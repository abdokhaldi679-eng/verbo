import type { CardState } from '../types'
import { addDays } from './date'

export function reviewCard(card: CardState | undefined, correct: boolean, today: string): CardState {
  const base: CardState = card ?? { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: today }

  if (correct) {
    const reps = base.reps + 1
    const interval =
      reps === 1 ? 1 : reps === 2 ? 3 : Math.max(1, Math.round(Math.max(1, base.interval) * base.ease))
    return {
      ease: Math.min(2.8, base.ease + 0.05),
      interval,
      reps,
      lapses: base.lapses,
      due: addDays(today, interval),
    }
  }

  return {
    ease: Math.max(1.3, base.ease - 0.2),
    interval: 1,
    reps: 0,
    lapses: base.lapses + 1,
    due: addDays(today, 1),
  }
}
