"use client"

import { BEST_TIME_OPTIONS, type BestTime } from "@/lib/pre-qual/schema"

interface BestTimeChipsProps {
  value: BestTime | undefined
  onChange: (value: BestTime) => void
  error?: string
}

export function BestTimeChips({ value, onChange, error }: BestTimeChipsProps) {
  return (
    <div>
      <p id="bestTime-label" className="text-sm font-medium text-ink-900 mb-2">
        Best time to call
      </p>
      <div
        role="radiogroup"
        aria-labelledby="bestTime-label"
        aria-describedby={error ? "bestTime-error" : undefined}
        className="flex flex-wrap gap-2"
      >
        {BEST_TIME_OPTIONS.map((option) => {
          const selected = value === option
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
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
