const { app, BrowserWindow, ipcMain, net, protocol, safeStorage, session } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const { pathToFileURL } = require('node:url')

const devUrl = process.env.VITE_DEV_SERVER_URL
const screenshotPath = process.env.VERBO_SCREENSHOT

// Isolent les vérifications automatiques du profil utilisateur réel.
if (process.env.VERBO_USER_DATA) {
  app.setPath('userData', process.env.VERBO_USER_DATA)
}
if (screenshotPath) {
  app.disableHardwareAcceleration()
}

const appRoot = path.join(__dirname, '..')
const distRoot = path.join(appRoot, 'dist')

// L'application est servie par un protocole interne plutôt que par file://.
// Cela permet de garder le fuse « grantFileProtocolExtraPrivileges » désactivé
// tout en bénéficiant d'une origine standard et sécurisée pour la CSP.
const APP_SCHEME = 'app'
const APP_ORIGIN = `${APP_SCHEME}://verbo`

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true },
  },
])

const PROGRESS_FILE = 'progress.enc'
const MAX_PROGRESS_BYTES = 2 * 1024 * 1024

// Tous les rendus sont sandboxés, y compris ceux créés plus tard.
app.enableSandbox()

function isTrustedSender(event) {
  const url = event.senderFrame?.url
  if (!url) return false
  if (devUrl) {
    try {
      return new URL(url).origin === new URL(devUrl).origin
    } catch {
      return false
    }
  }
  return url.startsWith(`${APP_ORIGIN}/`)
}

function progressPath() {
  return path.join(app.getPath('userData'), PROGRESS_FILE)
}

async function readProgress() {
  const file = progressPath()
  if (!(await safeStorage.isAsyncEncryptionAvailable())) return null

  let encrypted
  try {
    encrypted = await fs.promises.readFile(file)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }

  try {
    const decrypted = await safeStorage.decryptStringAsync(encrypted)
    if (decrypted.shouldReEncrypt) {
      await writeProgress(decrypted.result)
    }
    return decrypted.result
  } catch {
    // Fichier illisible : on le conserve sous un autre nom au lieu de l'écraser.
    const backup = `${file}.corrupt-${Date.now()}`
    try {
      await fs.promises.rename(file, backup)
    } catch {
      // Le prochain enregistrement recréera le fichier.
    }
    return null
  }
}

async function writeProgress(json) {
  if (!(await safeStorage.isAsyncEncryptionAvailable())) {
    throw new Error('Le chiffrement Windows est indisponible.')
  }

  const file = progressPath()
  const temp = `${file}.${process.pid}.tmp`
  const encrypted = await safeStorage.encryptStringAsync(json)

  await fs.promises.mkdir(path.dirname(file), { recursive: true })
  await fs.promises.writeFile(temp, encrypted, { mode: 0o600 })

  try {
    await fs.promises.rename(temp, file)
  } catch (error) {
    try {
      await fs.promises.unlink(temp)
    } catch {
      // Nettoyage best-effort.
    }
    throw error
  }
}

function registerIpc() {
  ipcMain.handle('progress:load', async (event) => {
    if (!isTrustedSender(event)) throw new Error('Origine non autorisée.')
    return readProgress()
  })

  ipcMain.handle('progress:save', async (event, json) => {
    if (!isTrustedSender(event)) throw new Error('Origine non autorisée.')
    if (typeof json !== 'string' || Buffer.byteLength(json, 'utf8') > MAX_PROGRESS_BYTES) {
      throw new Error('Données invalides.')
    }

    const parsed = JSON.parse(json)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Données invalides.')
    }

    await writeProgress(json)
    return true
  })

  ipcMain.handle('progress:clear', async (event) => {
    if (!isTrustedSender(event)) throw new Error('Origine non autorisée.')
    try {
      await fs.promises.unlink(progressPath())
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    return true
  })
}

function isAllowedNavigation(url) {
  if (devUrl) {
    try {
      return new URL(url).origin === new URL(devUrl).origin
    } catch {
      return false
    }
  }
  return url.startsWith(`${APP_ORIGIN}/`)
}

function registerAppProtocol() {
  protocol.handle(APP_SCHEME, (request) => {
    const url = new URL(request.url)
    if (url.host !== 'verbo') {
      return new Response('Not found', { status: 404 })
    }

    let pathname = decodeURIComponent(url.pathname)
    if (pathname === '/' || pathname === '') pathname = '/index.html'

    const root = path.resolve(distRoot)
    const filePath = path.resolve(root, `.${pathname}`)
    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      return new Response('Not found', { status: 404 })
    }

    return net.fetch(pathToFileURL(filePath).toString())
  })
}

function hardenContents(contents) {
  contents.setWindowOpenHandler(() => ({ action: 'deny' }))
  contents.on('will-attach-webview', (event) => event.preventDefault())
  contents.on('will-navigate', (event, url) => {
    if (!isAllowedNavigation(url)) event.preventDefault()
  })
  contents.on('will-redirect', (event, url) => {
    if (!isAllowedNavigation(url)) event.preventDefault()
  })
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 380,
    minHeight: 600,
    show: false,
    backgroundColor: '#f3f4fb',
    title: 'Verbo',
    icon: path.join(appRoot, 'build', 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: false,
      allowRunningInsecureContent: false,
      devTools: !app.isPackaged,
      preload: path.join(__dirname, 'preload.cjs'),
      spellcheck: true,
    },
  })

  hardenContents(window.webContents)

  window.once('ready-to-show', () => window.show())

  if (devUrl) {
    window.loadURL(devUrl)
  } else {
    window.loadURL(`${APP_ORIGIN}/index.html`)
  }

  // Utilisé par le script de vérification visuelle : capture puis fermeture.
  if (screenshotPath) {
    window.webContents.once('did-finish-load', async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 900))
        const image = await window.webContents.capturePage()
        fs.writeFileSync(screenshotPath, image.toPNG())
      } finally {
        app.quit()
      }
    })
  }

  return window
}

app.on('web-contents-created', (_event, contents) => {
  // Aucune webview et aucune fenêtre enfant, quel que soit le contenu créé.
  contents.on('will-attach-webview', (event) => event.preventDefault())
  contents.setWindowOpenHandler(() => ({ action: 'deny' }))
})

app.whenReady().then(() => {
  registerIpc()
  registerAppProtocol()

  // L'application n'a besoin d'aucune permission navigateur (caméra, micro,
  // notifications, géolocalisation, presse-papiers…).
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => {
    callback(false)
  })
  session.defaultSession.setPermissionCheckHandler(() => false)

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
