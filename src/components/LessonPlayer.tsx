import { useRef, useState } from 'react'
import type {
  CompletionSummary,
  Exercise,
  Lesson,
  SelectedToken,
  SessionMode,
} from '../types'
import { getLanguage } from '../data/languages'
import { answerText, isTypedAnswerCorrect, normalize } from '../lib/normalize'
import { stopSpeaking } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { ChoiceView } from './exercises/ChoiceView'
import { ListenView } from './exercises/ListenView'
import { MatchView } from './exercises/MatchView'
import { TypeView } from './exercises/TypeView'
import { WordBankView } from './exercises/WordBankView'
import { CompleteScreen } from './CompleteScreen'

type Phase = 'answering' | 'feedback' | 'done'

type Draft =
  | { kind: 'option'; value: string | null }
  | { kind: 'text'; value: string }
  | { kind: 'tokens'; value: SelectedToken[] }
  | { kind: 'match'; value: null }

interface QueueItem {
  exercise: Exercise
  retry: boolean
}

interface LessonPlayerProps {
  lesson: Lesson
  mode: SessionMode
  onExit: () => void
}

const PRAISE = ['Excellent !', 'Bien joué !', 'C’est ça !', 'Parfait !', 'Super !']

function initialDraft(exercise: Exercise): Draft {
  switch (exercise.type) {
    case 'choice':
    case 'listen':
      return { kind: 'option', value: null }
    case 'type':
      return { kind: 'text', value: '' }
    case 'wordbank':
      return { kind: 'tokens', value: [] }
    case 'match':
      return { kind: 'match', value: null }
  }
}

export function LessonPlayer({ lesson, mode, onExit }: LessonPlayerProps) {
  const { state, finishSession } = useProgress()
  const [queue, setQueue] = useState<QueueItem[]>(() =>
    lesson.exercises.map((exercise) => ({ exercise, retry: false })),
  )
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('answering')
  const [draft, setDraft] = useState<Draft>(() => initialDraft(lesson.exercises[0]))
  const [feedbackCorrect, setFeedbackCorrect] = useState(true)
  const [feedbackAnswer, setFeedbackAnswer] = useState('')
  const [summary, setSummary] = useState<CompletionSummary | null>(null)
  const firstTry = useRef(new Map<string, boolean>())

  const current = queue[index]
  const exercise = current.exercise

  function submit(recordCorrect: boolean, displayCorrect = recordCorrect, allowRetry = true) {
    if (phase !== 'answering') return
    if (!current.retry) firstTry.current.set(exercise.id, recordCorrect)

    if (!recordCorrect && allowRetry && !current.retry) {
      setQueue((items) => [...items, { exercise, retry: true }])
    }

    setFeedbackCorrect(displayCorrect)
    setFeedbackAnswer(displayCorrect ? '' : answerText(exercise))
    setPhase('feedback')
  }

  function check() {
    if (phase !== 'answering') return

    if (exercise.type === 'choice' || exercise.type === 'listen') {
      if (draft.kind !== 'option' || draft.value === null) return
      submit(draft.value === exercise.answer)
      return
    }

    if (exercise.type === 'type') {
      if (draft.kind !== 'text' || draft.value.trim() === '') return
      submit(isTypedAnswerCorrect(draft.value, exercise))
      return
    }

    if (exercise.type === 'wordbank') {
      if (draft.kind !== 'tokens' || draft.value.length === 0) return
      const given = draft.value.map((token) => token.text).join(' ')
      submit(normalize(given) === normalize(exercise.answer.join(' ')))
    }
  }

  function advance() {
    if (phase !== 'feedback') return
    stopSpeaking()

    const nextIndex = index + 1
    if (nextIndex >= queue.length) {
      const outcomes = lesson.exercises.map((item) => ({
        exerciseId: item.id,
        firstTryCorrect: firstTry.current.get(item.id) ?? false,
      }))
      setSummary(finishSession(mode, lesson.id, outcomes))
      setPhase('done')
      return
    }

    setIndex(nextIndex)
    setDraft(initialDraft(queue[nextIndex].exercise))
    setPhase('answering')
  }

  function handleExit() {
    const inProgress = phase !== 'done' && (index > 0 || phase === 'feedback')
    if (inProgress && !window.confirm('Quitter la leçon ? Ta progression ne sera pas enregistrée.')) {
      return
    }
    stopSpeaking()
    onExit()
  }

  const canCheck =
    phase === 'answering' &&
    (exercise.type === 'choice' || exercise.type === 'listen'
      ? draft.kind === 'option' && draft.value !== null
      : exercise.type === 'type'
        ? draft.kind === 'text' && draft.value.trim().length > 0
        : exercise.type === 'wordbank'
          ? draft.kind === 'tokens' && draft.value.length > 0
          : false)

  if (phase === 'done' && summary) {
    return (
      <CompleteScreen
        summary={summary}
        title={mode === 'review' ? 'Révision' : lesson.title}
        mode={mode}
        onDone={onExit}
      />
    )
  }

  let body
  switch (exercise.type) {
    case 'choice':
      body = (
        <ChoiceView
          exercise={exercise}
          value={draft.kind === 'option' ? draft.value : null}
          onChange={(value) => setDraft({ kind: 'option', value })}
          soundEnabled={state.sound}
          lang={lesson.lang}
        />
      )
      break
    case 'listen':
      body = (
        <ListenView
          exercise={exercise}
          value={draft.kind === 'option' ? draft.value : null}
          onChange={(value) => setDraft({ kind: 'option', value })}
          soundEnabled={state.sound}
          lang={lesson.lang}
        />
      )
      break
    case 'type':
      body = (
        <TypeView
          exercise={exercise}
          value={draft.kind === 'text' ? draft.value : ''}
          onChange={(value) => setDraft({ kind: 'text', value })}
          onSubmit={check}
          targetName={getLanguage(state.targetLang).name}
        />
      )
      break
    case 'wordbank':
      body = (
        <WordBankView
          exercise={exercise}
          value={draft.kind === 'tokens' ? draft.value : []}
          onChange={(tokens) => setDraft({ kind: 'tokens', value: tokens })}
        />
      )
      break
    case 'match':
      body = (
        <MatchView
          exercise={exercise}
          onComplete={(firstTryCorrect) => submit(firstTryCorrect, true, false)}
        />
      )
      break
  }

  const progress = ((index + (phase === 'feedback' ? 1 : 0)) / queue.length) * 100

  return (
    <div className="player">
      <header className="player-header">
        <button className="icon-btn" onClick={handleExit} aria-label="Quitter la leçon">
          ✕
        </button>
        <div
          className="lesson-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={queue.length}
          aria-valuenow={index + 1}
        >
          <div className="lesson-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="lesson-counter">
          {Math.min(index + 1, queue.length)}/{queue.length}
        </span>
      </header>

      <main className="player-main">
        <div className="exercise-card" key={`${index}-${exercise.id}`}>
          {body}
        </div>
      </main>

      {phase === 'feedback' ? (
        <div className={`feedback ${feedbackCorrect ? 'good' : 'bad'}`} role="status" aria-live="polite">
          <div className="feedback-inner">
            <div className="feedback-icon" aria-hidden="true">
              {feedbackCorrect ? '✓' : '✕'}
            </div>
            <div className="feedback-copy">
              <strong>{feedbackCorrect ? PRAISE[index % PRAISE.length] : 'Presque !'}</strong>
              {!feedbackCorrect && (
                <span>
                  Bonne réponse : <b>{feedbackAnswer}</b>
                </span>
              )}
            </div>
            <button className="btn btn-feedback" onClick={advance} autoFocus>
              Continuer
            </button>
          </div>
        </div>
      ) : (
        <footer className="player-footer">
          {exercise.type === 'match' ? (
            <p className="hint">Associe toutes les paires pour continuer.</p>
          ) : (
            <button className="btn btn-primary btn-block" disabled={!canCheck} onClick={check}>
              Vérifier
            </button>
          )}
        </footer>
      )}
    </div>
  )
}
