import { useState, type FormEvent } from 'react'
import { LANGUAGES } from '../data/languages'
import { useProgress } from '../lib/progress'

interface LanguageSetupProps {
  compact?: boolean
}

export function LanguageSetup({ compact = false }: LanguageSetupProps) {
  const { state, setLanguages } = useProgress()
  const [native, setNative] = useState(state.nativeLang)
  const [target, setTarget] = useState(state.targetLang)

  const same = native === target
  const changed = native !== state.nativeLang || target !== state.targetLang

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!same) setLanguages(native, target)
  }

  return (
    <form className={`language-setup ${compact ? 'compact' : ''}`} onSubmit={submit}>
      {!compact && (
        <>
          <span className="language-emoji" aria-hidden="true">
            🌍
          </span>
          <h1>Quelle langue veux-tu apprendre ?</h1>
          <p className="language-lede">
            Choisis la langue que tu parles et celle que tu veux apprendre. Les consignes et les
            traductions s’adaptent à ta paire de langues.
          </p>
        </>
      )}

      <div className="language-grid">
        <label className="language-field">
          <span>Je parle</span>
          <select value={native} onChange={(event) => setNative(event.target.value)}>
            {LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name} — {language.nativeName}
              </option>
            ))}
          </select>
        </label>

        <span className="language-arrow" aria-hidden="true">
          →
        </span>

        <label className="language-field">
          <span>J’apprends</span>
          <select value={target} onChange={(event) => setTarget(event.target.value)}>
            {LANGUAGES.filter((language) => language.code !== native).map((language) => (
              <option key={language.code} value={language.code}>
                {language.name} — {language.nativeName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {same && (
        <p className="form-error" role="alert">
          Choisis deux langues différentes.
        </p>
      )}

      <button className="btn btn-primary" type="submit" disabled={same || (compact && !changed)}>
        {compact ? (changed ? 'Changer de langue' : 'Langues actuelles') : 'Commencer'}
      </button>

      <p className="language-note">
        20 langues · module de découverte A1 · contenu à faire relire par des locuteurs natifs.
      </p>
    </form>
  )
}
