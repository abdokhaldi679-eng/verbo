const voiceCache = new Map<string, SpeechSynthesisVoice>()

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null

  const cached = voiceCache.get(lang)
  if (cached) return cached

  const wanted = lang.toLowerCase()
  const base = wanted.split('-')[0]
  const voices = window.speechSynthesis.getVoices()
  const sameBase = voices.filter((voice) => voice.lang.toLowerCase().startsWith(base))
  if (sameBase.length === 0) return null

  const exact = sameBase.find((voice) => voice.lang.toLowerCase() === wanted)
  const preferred = sameBase.find((voice) =>
    /google|samantha|aria|jenny|zira|denise|amelie|marie|anna|milena/i.test(voice.name),
  )
  const voice = exact ?? preferred ?? sameBase[0]
  voiceCache.set(lang, voice)
  return voice
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, enabled = true, lang = 'en-US'): void {
  if (!enabled || !canSpeak()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.9
  utterance.pitch = 1
  const voice = pickVoice(lang)
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel()
}
