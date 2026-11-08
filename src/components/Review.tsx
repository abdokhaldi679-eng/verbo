import { useMemo } from 'react'
import { exerciseIndex } from '../data/course'
import { getCourseForPair } from '../data/courses'
import { getLanguage } from '../data/languages'
import { dueCards } from '../lib/stats'
import { useProgress } from '../lib/progress'
import { formatDate } from '../lib/date'
import type { Exercise, Lesson } from '../types'

interface ReviewProps {
  onStart: (lesson: Lesson) => void
}

export function Review({ onStart }: ReviewProps) {
  const { state } = useProgress()
  const course = getCourseForPair(state.nativeLang, state.targetLang)
  const index = useMemo(() => exerciseIndex(course), [course])
  const due = dueCards(state)
    .filter((item) => index.has(item.id))
    .sort((a, b) => a.card.due.localeCompare(b.card.due))
  const exercises = due
    .map((item) => index.get(item.id)?.exercise)
    .filter((exercise): exercise is Exercise => exercise !== undefined)
    .slice(0, 12)
  const tracked = Object.keys(state.cards).filter((id) => index.has(id)).length
  const earliest = Object.entries(state.cards)
    .filter(([id]) => index.has(id))
    .map(([, card]) => card.due)
    .sort()[0]

  const reviewLesson: Lesson = {
    id: `review-${course.id}`,
    title: 'Révision',
    icon: '🔁',
    lang: getLanguage(course.toCode).tts,
    exercises,
  }

  return (
    <main className="page review-page">
      <h1>Révision</h1>
      <p className="page-lede">
        La répétition espacée revient sur chaque exercice au bon moment, pour ancrer durablement.
      </p>

      {exercises.length > 0 ? (
        <section className="review-card">
          <span className="review-emoji" aria-hidden="true">
            🧠
          </span>
          <h2 className="review-count">
            {exercises.length} exercice{exercises.length > 1 ? 's' : ''} à réviser
          </h2>
          <p>Un mélange d’exercices déjà vus, choisis selon tes oublis.</p>
          <button className="btn btn-primary btn-block" onClick={() => onStart(reviewLesson)}>
            Commencer la révision
          </button>
          {due.length > exercises.length && (
            <p className="hint">
              {due.length - exercises.length} autre{due.length - exercises.length > 1 ? 's' : ''} seront
              proposés plus tard.
            </p>
          )}
        </section>
      ) : (
        <section className="review-card">
          <span className="review-emoji" aria-hidden="true">
            🌱
          </span>
          <h2 className="review-count">Rien à réviser pour le moment</h2>
          <p>
            {tracked === 0
              ? 'Termine ta première leçon : ses exercices reviendront ici dès demain.'
              : earliest
                ? `Prochaine révision prévue le ${formatDate(earliest)}.`
                : 'Continue le parcours pour alimenter tes révisions.'}
          </p>
          <button className="btn btn-primary btn-block" onClick={() => onStart(reviewLesson)} disabled>
            Commencer la révision
          </button>
        </section>
      )}

      <div className="info-grid">
        <article className="info-card">
          <strong>🗓️ Intervalle adaptatif</strong>
          <p>Une réussite espace la révision (1, 3, puis plusieurs jours). Une erreur la rapproche.</p>
        </article>
        <article className="info-card">
          <strong>🎯 Priorité aux oublis</strong>
          <p>Les exercices les plus fragiles remontent en premier, sans noyer le reste.</p>
        </article>
        <article className="info-card">
          <strong>🔒 100 % local</strong>
          <p>Ta progression reste dans le navigateur. Aucune donnée envoyée à un serveur.</p>
        </article>
      </div>
    </main>
  )
}
