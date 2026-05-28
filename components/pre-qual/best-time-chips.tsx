"use client"

import { BEST_TIME_OPTIONS, type BestTime } from "@/lib/pre-qual/schema"

interface BestTimeChipsProps {
  value: BestTime | undefined
  onChange: (value: BestTime) => void
  error?: string
}

export function BestTimeChips({ value, onChange, error }: BestTimeChipsProps) {
  const onGroupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown"
    ) {
      return
    }
    e.preventDefault()
    const currentIndex = value
      ? BEST_TIME_OPTIONS.indexOf(value)
      : -1
    const delta = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1
    const base = currentIndex < 0 ? 0 : currentIndex
    const next =
      (base + delta + BEST_TIME_OPTIONS.length) % BEST_TIME_OPTIONS.length
    onChange(BEST_TIME_OPTIONS[next])
  }

  return (
    <div>
      <p id="bestTime-label" className="text-sm font-medium text-ink-900 mb-2">
        Best time to call
      </p>
      <div
        role="radiogroup"
        aria-labelledby="bestTime-label"
        aria-describedby={error ? "bestTime-error" : undefined}
        onKeyDown={onGroupKeyDown}
        className="flex flex-wrap gap-2"
      >
        {BEST_TIME_OPTIONS.map((option, index) => {
          const selected = value === option
          const tabbable = selected || (!value && index === 0)
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => onChange(option)}
              className={
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border " +
                (selected
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white text-ink-700 border-surface-200 hover:border-brand-blue")
              }
            >
              {option}
            </button>
          )
        })}
      </div>
      {error && (
        <p id="bestTime-error" className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  )
}
