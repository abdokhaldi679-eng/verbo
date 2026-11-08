import type { ChoiceExercise } from '../../types'
import { Options } from './Options'
import { SpeakerButton } from './SpeakerButton'

interface ChoiceViewProps {
  exercise: ChoiceExercise
  value: string | null
  onChange: (value: string) => void
  soundEnabled: boolean
  lang?: string
}

export function ChoiceView({ exercise, value, onChange, soundEnabled, lang }: ChoiceViewProps) {
  return (
    <div className="exercise">
      <p className="instruction">{exercise.instruction}</p>
      <div className="prompt-row">
        <h2 className="question">{exercise.question}</h2>
        {exercise.audio && <SpeakerButton text={exercise.audio} enabled={soundEnabled} lang={lang} />}
      </div>
      <Options options={exercise.options} value={value} onChange={onChange} />
    </div>
  )
}
