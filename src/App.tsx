import { useState } from 'react'
import { Home } from './components/Home'
import { LanguageSetup } from './components/LanguageSetup'
import { LessonPlayer } from './components/LessonPlayer'
import { Profile } from './components/Profile'
import { Review } from './components/Review'
import { TopBar } from './components/TopBar'
import { useProgress } from './lib/progress'
import type { Lesson, SessionMode } from './types'

type Tab = 'learn' | 'review' | 'profile'

interface Session {
  lesson: Lesson
  mode: SessionMode
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'learn', label: 'Apprendre', icon: '📚' },
  { id: 'review', label: 'Réviser', icon: '🔁' },
  { id: 'profile', label: 'Profil', icon: '🦜' },
]

export default function App() {
  const { state } = useProgress()
  const [tab, setTab] = useState<Tab>('learn')
  const [session, setSession] = useState<Session | null>(null)

  function changeTab(next: Tab) {
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!state.onboarded) {
    return (
      <div className="app onboarding-app">
        <TopBar />
        <main className="page">
          <LanguageSetup />
        </main>
      </div>
    )
  }

  if (session) {
    return (
      <LessonPlayer
        lesson={session.lesson}
        mode={session.mode}
        onExit={() => {
          setSession(null)
          window.scrollTo({ top: 0 })
        }}
      />
    )
  }

  return (
    <div className="app">
      <TopBar />

      {tab === 'learn' && (
        <Home
          onStart={(lesson) => setSession({ lesson, mode: 'lesson' })}
          onGoReview={() => changeTab('review')}
        />
      )}

      {tab === 'review' && (
        <Review onStart={(lesson) => setSession({ lesson, mode: 'review' })} />
      )}

      {tab === 'profile' && <Profile />}

      <nav className="tabbar" aria-label="Navigation principale">
        {TABS.map((item) => (
          <button
            key={item.id}
            className={`tab ${tab === item.id ? 'active' : ''}`}
            onClick={() => changeTab(item.id)}
            aria-current={tab === item.id ? 'page' : undefined}
          >
            <span className="tab-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
