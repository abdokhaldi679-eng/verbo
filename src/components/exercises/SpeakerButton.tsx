import { speak } from '../../lib/audio'

interface SpeakerButtonProps {
  text: string
  enabled?: boolean
  big?: boolean
  lang?: string
}

export function SpeakerButton({ text, enabled = true, big = false, lang }: SpeakerButtonProps) {
  return (
    <button
      type="button"
      className={`speaker ${big ? 'speaker-big' : ''}`}
      onClick={() => speak(text, enabled, lang)}
      aria-label="Écouter la phrase"
      title="Écouter"
    >
      <span aria-hidden="true">🔊</span>
    </button>
  )
}
