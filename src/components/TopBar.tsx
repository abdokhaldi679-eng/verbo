import { dailyXpToday, displayStreak } from '../lib/stats'
import { languagePairLabel } from '../data/languages'
import { useProgress } from '../lib/progress'

export function TopBar() {
  const { state } = useProgress()
  const xp = dailyXpToday(state)
  const streak = displayStreak(state)
  const percent = state.dailyGoal > 0 ? Math.min(1, xp / state.dailyGoal) : 0
  const radius = 17
  const circumference = 2 * Math.PI * radius

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          V
        </span>
        <span className="brand-name">verbo</span>
      </div>
      <div className="topbar-stats">
        <div
          className="stat-pill lang-pill"
          title={languagePairLabel(state.nativeLang, state.targetLang)}
        >
          <span aria-hidden="true">{state.nativeLang.toUpperCase()}</span>
          <span aria-hidden="true">→</span>
          <span aria-hidden="true">{state.targetLang.toUpperCase()}</span>
          <span className="sr-only">{languagePairLabel(state.nativeLang, state.targetLang)}</span>
        </div>
        <div className="stat-pill" title="Série de jours consécutifs">
          <span className="stat-icon" aria-hidden="true">
            🔥
          </span>
          <strong>{streak}</strong>
          <span className="sr-only">jours de série</span>
        </div>
        <div
          className="goal"
          title={`Objectif quotidien : ${xp} sur ${state.dailyGoal} XP`}
        >
          <svg viewBox="0 0 44 44" className="goal-ring" aria-hidden="true">
            <circle cx="22" cy="22" r={radius} className="goal-track" />
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="goal-value"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percent)}
            />
          </svg>
          <span className="goal-bolt" aria-hidden="true">
            ⚡
          </span>
          <span className="goal-text">
            {xp}/{state.dailyGoal}
          </span>
        </div>
      </div>
    </header>
  )
}
