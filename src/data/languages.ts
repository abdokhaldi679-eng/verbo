export type LanguageCode =
  | 'fr'
  | 'en'
  | 'es'
  | 'de'
  | 'it'
  | 'pt'
  | 'nl'
  | 'pl'
  | 'sv'
  | 'ru'
  | 'uk'
  | 'tr'
  | 'ar'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'el'
  | 'hi'
  | 'vi'
  | 'id'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
  tts: string
  /** Langues dont l'écriture ne sépare pas les mots par des espaces. */
  noWordSpaces?: boolean
  /** Écriture latine : autorise les exercices de saisie au clavier. */
  latinScript?: boolean
}

export const LANGUAGES: Language[] = [
  {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    tts: 'fr-FR',
    latinScript: true,
  },
  {
    code: 'en',
    name: 'Anglais',
    nativeName: 'English',
    flag: '🇬🇧',
    tts: 'en-US',
    latinScript: true,
  },
  {
    code: 'es',
    name: 'Espagnol',
    nativeName: 'Español',
    flag: '🇪🇸',
    tts: 'es-ES',
    latinScript: true,
  },
  {
    code: 'de',
    name: 'Allemand',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    tts: 'de-DE',
    latinScript: true,
  },
  {
    code: 'it',
    name: 'Italien',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    tts: 'it-IT',
    latinScript: true,
  },
  {
    code: 'pt',
    name: 'Portugais',
    nativeName: 'Português',
    flag: '🇵🇹',
    tts: 'pt-PT',
    latinScript: true,
  },
  {
    code: 'nl',
    name: 'Néerlandais',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    tts: 'nl-NL',
    latinScript: true,
  },
  {
    code: 'pl',
    name: 'Polonais',
    nativeName: 'Polski',
    flag: '🇵🇱',
    tts: 'pl-PL',
    latinScript: true,
  },
  {
    code: 'sv',
    name: 'Suédois',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    tts: 'sv-SE',
    latinScript: true,
  },
  {
    code: 'ru',
    name: 'Russe',
    nativeName: 'Русский',
    flag: '🇷🇺',
    tts: 'ru-RU',
  },
  {
    code: 'uk',
    name: 'Ukrainien',
    nativeName: 'Українська',
    flag: '🇺🇦',
    tts: 'uk-UA',
  },
  {
    code: 'tr',
    name: 'Turc',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    tts: 'tr-TR',
    latinScript: true,
  },
  {
    code: 'ar',
    name: 'Arabe',
    nativeName: 'العربية',
    flag: '🇸🇦',
    tts: 'ar-SA',
  },
  {
    code: 'zh',
    name: 'Chinois mandarin',
    nativeName: '中文',
    flag: '🇨🇳',
    tts: 'zh-CN',
    noWordSpaces: true,
  },
  {
    code: 'ja',
    name: 'Japonais',
    nativeName: '日本語',
    flag: '🇯🇵',
    tts: 'ja-JP',
    noWordSpaces: true,
  },
  {
    code: 'ko',
    name: 'Coréen',
    nativeName: '한국어',
    flag: '🇰🇷',
    tts: 'ko-KR',
  },
  {
    code: 'el',
    name: 'Grec',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    tts: 'el-GR',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    tts: 'hi-IN',
  },
  {
    code: 'vi',
    name: 'Vietnamien',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    tts: 'vi-VN',
    latinScript: true,
  },
  {
    code: 'id',
    name: 'Indonésien',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    tts: 'id-ID',
    latinScript: true,
  },
]

const byCode = new Map(LANGUAGES.map((language) => [language.code, language]))

export function isLanguageCode(value: string): value is LanguageCode {
  return byCode.has(value as LanguageCode)
}

export function getLanguage(code: string): Language {
  return byCode.get(code as LanguageCode) ?? LANGUAGES[0]
}

export function languagePairLabel(native: string, target: string): string {
  const from = getLanguage(native)
  const to = getLanguage(target)
  return `${from.name} → ${to.name}`
}
