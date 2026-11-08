const { contextBridge, ipcRenderer } = require('electron')

// API minimale exposée au rendu. Aucun accès à Node, au système de fichiers
// ou à l'objet ipcRenderer complet n'est donné à la page.
const storage = Object.freeze({
  load: () => ipcRenderer.invoke('progress:load'),
  save: (json) => ipcRenderer.invoke('progress:save', json),
  clear: () => ipcRenderer.invoke('progress:clear'),
})

contextBridge.exposeInMainWorld(
  'verbo',
  Object.freeze({
    platform: process.platform,
    storage,
  }),
)
