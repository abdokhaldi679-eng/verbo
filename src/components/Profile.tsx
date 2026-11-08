import { allLessons, exerciseIndex } from '../data/course'
import { getCourseForPair } from '../data/courses'
import { languagePairLabel } from '../data/languages'
import { displayStreak, dueCards } from '../lib/stats'
import { useProgress } from '../lib/progress'
import { todayKey } from '../lib/date'
import { LanguageSetup } from './LanguageSetup'

const GOALS = [10, 20, 30, 50]

export function Profile() {
  const { state, storageError, setDailyGoal, setSound, reset } = useProgress()
  const course = getCourseForPair(state.nativeLang, state.targetLang)
  const lessons = allLessons(course)
  const total = lessons.length
  const done = lessons.filter(({ lesson }) => Boolean(state.lessons[lesson.id])).length
  const records = lessons.flatMap(({ lesson }) => {
    const record = state.lessons[lesson.id]
    return record ? [record] : []
  })
  const average =
    records.length > 0
      ? records.reduce((sum, record) => sum + record.bestAccuracy, 0) / records.length
      : 0
  const index = exerciseIndex(course)
  const due = dueCards(state).filter((item) => index.has(item.id)).length

  function exportProgress() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `verbo-progression-${todayKey()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleReset() {
    if (window.confirm('Effacer toute ta progression ? Cette action est définitive.')) {
      reset()
    }
  }

  return (
    <main className="page profile-page">
      <div className="profile-head">
        <span className="avatar" aria-hidden="true">
          🦜
        </span>
        <div>
          <h1>Ton profil</h1>
          <p>
            Apprenti{state.xp > 0 ? ' passionné' : ' débutant'} ·{' '}
            {languagePairLabel(state.nativeLang, state.targetLang)}
          </p>
        </div>
      </div>

      {storageError && (
        <p className="storage-warning" role="alert">
          🔐 {storageError}
        </p>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <span>XP total</span>
          <strong>{state.xp}</strong>
        </div>
        <div className="stat-card">
          <span>Série</span>
          <strong>🔥 {displayStreak(state)}</strong>
        </div>
        <div className="stat-card">
          <span>Leçons terminées</span>
          <strong>
            {done}/{total}
          </strong>
        </div>
        <div className="stat-card">
          <span>Précision moyenne</span>
          <strong>{Math.round(average * 100)}%</strong>
        </div>
      </div>

      <section className="settings-card">
        <h2>Objectif quotidien</h2>
        <div className="goal-chips">
          {GOALS.map((goal) => (
            <button
              key={goal}
              className={`chip ${state.dailyGoal === goal ? 'active' : ''}`}
              onClick={() => setDailyGoal(goal)}
              aria-pressed={state.dailyGoal === goal}
            >
              {goal} XP
            </button>
          ))}
        </div>
      </section>

      <section className="settings-card">
        <div className="switch-row">
          <div>
            <h2>Sons et prononciation</h2>
            <p>Utilise la voix du navigateur pour les exercices d’écoute.</p>
          </div>
          <button
            className={`switch ${state.sound ? 'on' : ''}`}
            role="switch"
            aria-checked={state.sound}
            aria-label="Activer les sons"
            onClick={() => setSound(!state.sound)}
          />
        </div>
      </section>

      <section className="settings-card">
        <h2>Langues</h2>
        <LanguageSetup compact />
      </section>

      <section className="settings-card">
        <h2>Mes données</h2>
        <div className="goal-chips">
          <button className="ghost-btn" onClick={exportProgress}>
            Exporter ma progression
          </button>
          <button className="danger-btn" onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
        <p className="about" style={{ marginTop: 12 }}>
          {due > 0
            ? `${due} exercice${due > 1 ? 's' : ''} en attente de révision.`
            : 'Aucune révision en attente.'}{' '}
          Les données restent sur cet appareil. Dans l’application Windows, la progression est
          chiffrée par le système (DPAPI).
        </p>
      </section>

      <section className="settings-card">
        <h2>À propos</h2>
        <div className="about">
          <p>
            <strong>Verbo {__APP_VERSION__}</strong> — application open source sous licence MIT.
          </p>
          <p>
            Inspirée des applications d’apprentissage gamifiées, sans aucun lien avec Duolingo.
            Les cours sont écrits pour ce projet et modifiables dans{' '}
            <code>src/data/course.ts</code>.
          </p>
          <p>
            React + Vite + TypeScript · Windows (Electron), Android (Capacitor) et PWA installable ·
            fonctionne hors-ligne.
          </p>
        </div>
      </section>
    </main>
  )
}
