import { useEffect, useMemo, useRef, useState } from 'react'
import type { MatchExercise } from '../../types'

interface MatchViewProps {
  exercise: MatchExercise
  onComplete: (firstTry: boolean) => void
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

export function MatchView({ exercise, onComplete }: MatchViewProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const [wrong, setWrong] = useState<{ left: string; right: string } | null>(null)
  const [hadMistake, setHadMistake] = useState(false)
  const [done, setDone] = useState(false)
  const timer = useRef<number | null>(null)

  const rights = useMemo(
    () => shuffle(exercise.pairs.map((pair) => pair.right)),
    [exercise],
  )
  const matchedRights = new Set(Object.values(matched))

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const pickRight = (right: string) => {
    if (!selectedLeft || matchedRights.has(right)) return
    const pair = exercise.pairs.find((item) => item.left === selectedLeft)
    if (pair && pair.right === right) {
      const next = { ...matched, [selectedLeft]: right }
      setMatched(next)
      setSelectedLeft(null)
      if (Object.keys(next).length === exercise.pairs.length) setDone(true)
      return
    }

    setHadMistake(true)
    setWrong({ left: selectedLeft, right })
    setSelectedLeft(null)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setWrong(null), 650)
  }

  return (
    <div className="exercise">
      <p className="instruction">{exercise.instruction}</p>
      <p className="match-progress">
        {Object.keys(matched).length}/{exercise.pairs.length} paires associées
      </p>

      <div className="match-grid">
        <div className="match-col">
          {exercise.pairs.map((pair) => {
            const isMatched = Boolean(matched[pair.left])
            const isSelected = selectedLeft === pair.left
            const isWrong = wrong?.left === pair.left
            return (
              <button
                type="button"
                key={pair.left}
                className={`match-item ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${
                  isWrong ? 'wrong' : ''
                }`}
                disabled={isMatched}
                onClick={() => setSelectedLeft(pair.left)}
              >
                {pair.left}
              </button>
            )
          })}
        </div>
        <div className="match-col">
          {rights.map((right) => {
            const isMatched = matchedRights.has(right)
            const isWrong = wrong?.right === right
            return (
              <button
                type="button"
                key={right}
                className={`match-item ${isMatched ? 'matched' : ''} ${isWrong ? 'wrong' : ''}`}
                disabled={isMatched}
                onClick={() => pickRight(right)}
              >
                {right}
              </button>
            )
          })}
        </div>
      </div>

      {done && (
        <button type="button" className="btn btn-primary btn-block" onClick={() => onComplete(!hadMistake)}>
          Valider les associations
        </button>
      )}
    </div>
  )
}
