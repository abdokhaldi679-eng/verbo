import type { TypeExercise } from '../../types'

interface TypeViewProps {
  exercise: TypeExercise
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  targetName: string
}

export function TypeView({ exercise, value, onChange, onSubmit, targetName }: TypeViewProps) {
  const placeholder = `Ta réponse en ${targetName}`
  return (
    <div className="exercise">
      <p className="instruction">{exercise.instruction}</p>
      <h2 className="question">{exercise.question}</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <input
          className="text-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          aria-label={placeholder}
        />
        <button type="submit" className="sr-only">
          Vérifier
        </button>
      </form>
      <p className="typing-hint">Appuie sur Entrée pour vérifier.</p>
    </div>
  )
}
