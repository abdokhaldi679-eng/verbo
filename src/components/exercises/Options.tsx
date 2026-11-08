interface OptionsProps {
  options: string[]
  value: string | null
  onChange: (value: string) => void
}

export function Options({ options, value, onChange }: OptionsProps) {
  return (
    <div className="options">
      {options.map((option, index) => {
        const selected = value === option
        return (
          <button
            type="button"
            key={option}
            className={`option ${selected ? 'selected' : ''}`}
            onClick={() => onChange(option)}
            aria-pressed={selected}
          >
            <span className="option-badge" aria-hidden="true">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="option-text">{option}</span>
          </button>
        )
      })}
    </div>
  )
}
