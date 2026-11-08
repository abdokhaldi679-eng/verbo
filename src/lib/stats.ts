import type { ProgressState } from './progress'
import { addDays, todayKey } from './date'

export function displayStreak(state: ProgressState): number {
  if (!state.lastActiveDate) return 0
  const today = todayKey()
  return state.lastActiveDate === today || state.lastActiveDate === addDays(today, -1)
    ? state.streak
    : 0
}

export function dailyXpToday(state: ProgressState): number {
  return state.dailyDate === todayKey() ? state.dailyXp : 0
}

export function completedLessonCount(state: ProgressState): number {
  return Object.keys(state.lessons).length
}

export function dueCards(state: ProgressState): { id: string; card: ProgressState['cards'][string] }[] {
  const today = todayKey()
  return Object.entries(state.cards)
    .filter(([, card]) => card.due <= today)
    .map(([id, card]) => ({ id, card }))
}
