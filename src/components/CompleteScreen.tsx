import type { CompletionSummary, SessionMode } from '../types'

interface CompleteScreenProps {
  summary: CompletionSummary
  title: string
  mode: SessionMode
  onDone: () => void
}

const confettiColors = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7']

export function CompleteScreen({ summary, title, mode, onDone }: CompleteScreenProps) {
  return (
    <div className="complete-screen">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 17) % 100}%`,
              animationDelay: `${(index % 9) * 0.12}s`,
              background: confettiColors[index % confettiColors.length],
            }}
          />
        ))}
      </div>

      <div className="complete-card">
        <span className="complete-emoji" aria-hidden="true">
          🏆
        </span>
        <p className="complete-kicker">{mode === 'review' ? 'Révision terminée' : 'Leçon terminée'}</p>
        <h1>{title}</h1>

        <div className="complete-stats">
          <div>
            <span aria-hidden="true">⚡</span>
            <strong>+{summary.xpEarned}</strong>
            <small>XP</small>
          </div>
          <div>
            <span aria-hidden="true">🎯</span>
            <strong>{Math.round(summary.accuracy * 100)}%</strong>
            <small>Précision</small>
          </div>
          <div>
            <span aria-hidden="true">🔥</span>
            <strong>{summary.streak}</strong>
            <small>Série</small>
          </div>
        </div>

        <p className="complete-detail">
          {summary.correct}/{summary.total} réponses justes du premier coup
        </p>

        {summary.goalReached && <p className="goal-badge">🎉 Objectif quotidien atteint !</p>}

        <button className="btn btn-primary btn-block" onClick={onDone} autoFocus>
          Continuer
        </button>
      </div>
    </div>
  )
}
