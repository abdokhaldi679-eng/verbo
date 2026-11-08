import type { ListenExercise } from '../../types'
import { Options } from './Options'
import { SpeakerButton } from './SpeakerButton'

interface ListenViewProps {
  exercise: ListenExercise
  value: string | null
  onChange: (value: string) => void
  soundEnabled: boolean
  lang?: string
}

export function ListenView({ exercise, value, onChange, soundEnabled, lang }: ListenViewProps) {
  return (
    <div className="exercise">
      <p className="instruction">{exercise.instruction}</p>
      <div className="listen-box">
        <SpeakerButton text={exercise.text} enabled={soundEnabled} big lang={lang} />
        <span className="listen-hint">Appuie sur le haut-parleur pour écouter</span>
      </div>
      <Options options={exercise.options} value={value} onChange={onChange} />
    </div>
  )
}
