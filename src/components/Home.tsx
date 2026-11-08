import { allLessons, exerciseIndex, isUnlocked, nextLesson } from '../data/course'
import { getCourseForPair } from '../data/courses'
import { dailyXpToday, displayStreak, dueCards } from '../lib/stats'
import { useProgress } from '../lib/progress'
import type { Lesson } from '../types'

interface HomeProps {
  onStart: (lesson: Lesson) => void
  onGoReview: () => void
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export function Home({ onStart, onGoReview }: HomeProps) {
  const { state } = useProgress()
  const course = getCourseForPair(state.nativeLang, state.targetLang)
  const lessons = allLessons(course)
  const total = lessons.length
  const courseLessonIds = new Set(lessons.map((entry) => entry.lesson.id))
  const done = Object.keys(state.lessons).filter((id) => courseLessonIds.has(id)).length
  const next = nextLesson(course, state.lessons)
  const nextEntry = lessons.find((entry) => entry.lesson.id === next?.id)
  const xp = dailyXpToday(state)
  const goalPercent = state.dailyGoal > 0 ? Math.min(1, xp / state.dailyGoal) : 0
  const index = exerciseIndex(course)
  const due = dueCards(state).filter((item) => index.has(item.id)).length
  const streak = displayStreak(state)

  return (
    <main className="page home">
      <section className="hero">
        <span className="hero-bubble hero-bubble-a" aria-hidden="true" />
        <span className="hero-bubble hero-bubble-b" aria-hidden="true" />
        <p className="hero-kicker">
          {greeting()} 👋 · {course.title}
        </p>
        <h1>{next ? next.title : 'Cours terminé !'}</h1>
        <p className="hero-sub">
          {nextEntry ? `${nextEntry.unit.title} · ${done}/${total} leçons` : `${done}/${total} leçons`}
        </p>
        <div className="hero-progress" aria-hidden="true">
          <div className="hero-progress-fill" style={{ width: `${goalPercent * 100}%` }} />
        </div>
        <div className="hero-meta">
          <span>⚡ {xp} / {state.dailyGoal} XP aujourd’hui</span>
          <span>🔥 {streak} jour{streak > 1 ? 's' : ''}</span>
        </div>
        <button
          className="btn btn-light btn-block"
          onClick={() => (next ? onStart(next) : onGoReview())}
        >
          {next ? 'Continuer' : 'Réviser'}
        </button>
      </section>

      {due > 0 && (
        <button className="review-banner" onClick={onGoReview}>
          <span className="review-banner-icon" aria-hidden="true">
            🔁
          </span>
          <span className="review-banner-text">
            <strong>{due} exercice{due > 1 ? 's' : ''} à réviser</strong>
            <small>La répétition espacée t’attend</small>
          </span>
          <span aria-hidden="true">→</span>
        </button>
      )}

      <section className="path-section" aria-label="Parcours du cours">
        {course.units.map((unit) => {
          const unitDone = unit.lessons.filter((lesson) => state.lessons[lesson.id]).length
          return (
            <div className="unit-block" key={unit.id}>
              <div className="unit-header" style={{ background: unit.color }}>
                <div>
                  <p className="unit-title">{unit.title}</p>
                  <h2>{unit.subtitle}</h2>
                </div>
                <span className="unit-count">
                  {unitDone}/{unit.lessons.length}
                </span>
              </div>

              <div className="path">
                {unit.lessons.map((lesson, index) => {
                  const completed = Boolean(state.lessons[lesson.id])
                  const locked = !isUnlocked(course, lesson.id, state.lessons)
                  const current = !completed && !locked
                  const status = completed ? 'done' : locked ? 'locked' : current ? 'current' : 'open'
                  return (
                    <div className={`path-row ${index % 2 === 0 ? 'left' : 'right'}`} key={lesson.id}>
                      <button
                        className={`node node-${status}`}
                        onClick={() => onStart(lesson)}
                        disabled={locked}
                        aria-label={`${lesson.title} — ${
                          completed ? 'terminée, rejouer' : locked ? 'verrouillée' : 'commencer'
                        }`}
                      >
                        <span className="node-icon" aria-hidden="true">
                          {completed ? '✓' : locked ? '🔒' : lesson.icon}
                        </span>
                      </button>
                      <div className="node-meta">
                        <strong>{lesson.title}</strong>
                        <span>
                          {completed ? 'Terminé · Rejouer' : locked ? 'Verrouillé' : 'Commencer'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
