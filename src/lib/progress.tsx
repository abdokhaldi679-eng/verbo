import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CardState, CompletionSummary, ExerciseOutcome, SessionMode } from '../types'
import { DEFAULT_NATIVE, DEFAULT_TARGET } from '../data/courses'
import { isLanguageCode } from '../data/languages'
import { addDays, todayKey } from './date'
import { reviewCard } from './srs'

export interface LessonRecord {
  accuracy: number
  bestAccuracy: number
  attempts: number
  completedAt: string
}

export interface ProgressState {
  version: 1
  xp: number
  streak: number
  lastActiveDate: string | null
  dailyGoal: number
  dailyXp: number
  dailyDate: string | null
  lessons: Record<string, LessonRecord>
  cards: Record<string, CardState>
  sound: boolean
  nativeLang: string
  targetLang: string
  onboarded: boolean
}

const STORAGE_KEY = 'verbo.progress.v1'

const defaultState: ProgressState = {
  version: 1,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  dailyGoal: 20,
  dailyXp: 0,
  dailyDate: null,
  lessons: {},
  cards: {},
  sound: true,
  nativeLang: DEFAULT_NATIVE,
  targetLang: DEFAULT_TARGET,
  onboarded: false,
}

function parseState(raw: string): ProgressState {
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    if (parsed.version !== 1) return defaultState
    const lessons = parsed.lessons ?? {}
    return {
      ...defaultState,
      ...parsed,
      lessons,
      cards: parsed.cards ?? {},
      nativeLang: isLanguageCode(parsed.nativeLang ?? '')
        ? (parsed.nativeLang as string)
        : DEFAULT_NATIVE,
      targetLang: isLanguageCode(parsed.targetLang ?? '')
        ? (parsed.targetLang as string)
        : DEFAULT_TARGET,
      // Les anciennes progressions existent déjà : on ne force pas l'écran de choix.
      onboarded:
        typeof parsed.onboarded === 'boolean'
          ? parsed.onboarded
          : Object.keys(lessons).length > 0,
    }
  } catch {
    return defaultState
  }
}

function loadLocalState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseState(raw) : defaultState
  } catch {
    return defaultState
  }
}

// Présent uniquement dans l'application Electron : coffre chiffré par Windows
// (DPAPI via safeStorage). Dans le navigateur, on garde localStorage.
const secureStorage = typeof window !== 'undefined' ? window.verbo?.storage : undefined

interface ProgressContextValue {
  state: ProgressState
  storageError: string | null
  finishSession: (
    mode: SessionMode,
    lessonId: string,
    outcomes: ExerciseOutcome[],
  ) => CompletionSummary
  setDailyGoal: (goal: number) => void
  setSound: (sound: boolean) => void
  setLanguages: (native: string, target: string) => void
  reset: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadLocalState)
  const [storageReady, setStorageReady] = useState(!secureStorage)
  const [storageError, setStorageError] = useState<string | null>(null)

  useEffect(() => {
    if (!secureStorage) return

    let cancelled = false
    void (async () => {
      try {
        const raw = await secureStorage.load()
        if (cancelled) return

        if (raw) {
          setState(parseState(raw))
          return
        }

        // Première ouverture du coffre : reprendre l'ancienne progression
        // localStorage et la chiffrer immédiatement.
        const legacy = loadLocalState()
        setState(legacy)
        try {
          await secureStorage.save(JSON.stringify(legacy))
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          if (!cancelled) {
            setStorageError(
              'Impossible de chiffrer la progression. Elle reste en mémoire pour cette session.',
            )
          }
        }
      } catch {
        if (!cancelled) {
          setStorageError(
            'Impossible de lire le coffre chiffré. La progression reste en mémoire pour cette session.',
          )
        }
      } finally {
        if (!cancelled) setStorageReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!storageReady) return
    const json = JSON.stringify(state)

    if (secureStorage) {
      secureStorage.save(json).catch(() => {
        setStorageError('Impossible d’enregistrer la progression chiffrée.')
      })
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, json)
    } catch {
      // Le stockage peut être indisponible (navigation privée) : on continue en mémoire.
    }
  }, [state, storageReady])

  const finishSession = useCallback(
    (mode: SessionMode, lessonId: string, outcomes: ExerciseOutcome[]): CompletionSummary => {
      const today = todayKey()
      const total = outcomes.length
      const correct = outcomes.filter((outcome) => outcome.firstTryCorrect).length
      const accuracy = total > 0 ? correct / total : 1
      const baseXp = mode === 'lesson' ? 10 : 5
      const bonusXp = accuracy === 1 ? 5 : accuracy >= 0.8 ? 3 : 0
      const xpEarned = baseXp + bonusXp

      const cards = { ...state.cards }
      for (const outcome of outcomes) {
        cards[outcome.exerciseId] = reviewCard(cards[outcome.exerciseId], outcome.firstTryCorrect, today)
      }

      const lessons = { ...state.lessons }
      if (mode === 'lesson') {
        const previous = lessons[lessonId]
        lessons[lessonId] = {
          accuracy,
          bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, accuracy),
          attempts: (previous?.attempts ?? 0) + 1,
          completedAt: new Date().toISOString(),
        }
      }

      const xpToday = state.dailyDate === today ? state.dailyXp : 0
      const dailyXp = xpToday + xpEarned

      let streak = state.streak
      let lastActiveDate = state.lastActiveDate
      if (lastActiveDate !== today) {
        streak = lastActiveDate === addDays(today, -1) ? state.streak + 1 : 1
        lastActiveDate = today
      }

      setState({
        ...state,
        xp: state.xp + xpEarned,
        cards,
        lessons,
        streak,
        lastActiveDate,
        dailyXp,
        dailyDate: today,
      })

      return {
        xpEarned,
        accuracy,
        correct,
        total,
        streak,
        goalReached: dailyXp >= state.dailyGoal,
      }
    },
    [state],
  )

  const setDailyGoal = useCallback((goal: number) => {
    setState((current) => ({ ...current, dailyGoal: goal }))
  }, [])

  const setSound = useCallback((sound: boolean) => {
    setState((current) => ({ ...current, sound }))
  }, [])

  const setLanguages = useCallback((native: string, target: string) => {
    if (!isLanguageCode(native) || !isLanguageCode(target) || native === target) return
    setState((current) => ({
      ...current,
      nativeLang: native,
      targetLang: target,
      onboarded: true,
    }))
  }, [])

  const reset = useCallback(() => {
    setState({ ...defaultState })
  }, [])

  const value = useMemo(
    () => ({ state, storageError, finishSession, setDailyGoal, setSound, setLanguages, reset }),
    [state, storageError, finishSession, setDailyGoal, setSound, setLanguages, reset],
  )

  if (!storageReady) {
    return (
      <div className="boot-screen" role="status" aria-live="polite">
        <div className="boot-mark" aria-hidden="true">
          V
        </div>
        <p>Chargement de ta progression…</p>
      </div>
    )
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- hook colocated with its provider
export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress doit être utilisé dans ProgressProvider')
  return context
}
