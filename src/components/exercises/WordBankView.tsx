import { useMemo } from 'react'
import type { SelectedToken, WordBankExercise } from '../../types'

interface WordBankViewProps {
  exercise: WordBankExercise
  value: SelectedToken[]
  onChange: (tokens: SelectedToken[]) => void
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

export function WordBankView({ exercise, value, onChange }: WordBankViewProps) {
  const pool = useMemo(
    () =>
      shuffle([
        ...exercise.answer.map((text, index) => ({ id: `a${index}`, text })),
        ...exercise.distractors.map((text, index) => ({ id: `d${index}`, text })),
      ]),
    [exercise],
  )

  const used = new Set(value.map((token) => token.id))

  return (
    <div className="exercise">
      <p className="instruction">{exercise.instruction}</p>
      <h2 className="question">{exercise.question}</h2>

      <div className={`tokens-selected ${value.length === 0 ? 'empty' : ''}`}>
        {value.length === 0 ? (
          <span className="tokens-placeholder">Touche les mots pour former la phrase</span>
        ) : (
          value.map((token) => (
            <button
              type="button"
              key={token.id}
              className="token token-selected"
              onClick={() => onChange(value.filter((item) => item.id !== token.id))}
            >
              {token.text}
            </button>
          ))
        )}
      </div>

      <div className="tokens-pool">
        {pool.map((token) => (
          <button
            type="button"
            key={token.id}
            className="token"
            disabled={used.has(token.id)}
            onClick={() => onChange([...value, token])}
          >
            {token.text}
          </button>
        ))}
      </div>
    </div>
  )
}
