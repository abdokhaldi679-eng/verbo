declare const __APP_VERSION__: string

interface VerboSecureStorage {
  load: () => Promise<string | null>
  save: (json: string) => Promise<boolean>
  clear: () => Promise<boolean>
}

interface Window {
  verbo?: {
    platform: string
    storage: VerboSecureStorage
  }
}
