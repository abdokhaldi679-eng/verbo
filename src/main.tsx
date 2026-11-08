import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ProgressProvider } from './lib/progress'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>,
)

// PWA : service worker uniquement en HTTP(S) hors coque native. Dans Electron
// (app://) et Capacitor (https://localhost), les fichiers sont déjà embarqués :
// un service worker n'apporterait rien et pourrait figer une ancienne version.
const isNativeShell = 'Capacitor' in window

if (
  import.meta.env.PROD &&
  'serviceWorker' in navigator &&
  window.location.protocol.startsWith('http') &&
  !isNativeShell
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Le mode hors-ligne est un bonus : son échec ne doit pas bloquer l'app.
    })
  })
}
