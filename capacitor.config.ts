import type { CapacitorConfig } from '@capacitor/cli'

// Configuration de la coque Android/iOS (Capacitor).
// L'application web reste la source unique : `npm run build` puis `npx cap sync`.
const config: CapacitorConfig = {
  appId: 'app.verbo.mobile',
  appName: 'Verbo',
  webDir: 'dist',
  // Les ressources sont servies depuis le paquet local ; aucun contenu distant.
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
