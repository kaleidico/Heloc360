type AccentNote = {
  _key: string
  accent?: 'blue' | 'green' | 'purple'
  heading?: string
  body?: string
}

export type AccentNotesValue = {
  _type: 'accentNotes'
  _key: string
  notes: AccentNote[]
}

// Accent → left-border color, verbatim from source.
const borderColor: Record<string, string> = {
  blue: 'border-l-[#1b75bc]',
  green: 'border-l-[#02c39a]',
  purple: 'border-l-purple-500',
}

export function AccentNotesSection({ value }: { value: AccentNotesValue }) {
  return (
    <div className="space-y-6">
      {(value.notes || []).map((note) => {
        const border = borderColor[note.accent || 'blue']
        return (
          <div key={note._key} className={`border-l-4 ${border} pl-6`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.heading}</h3>
            <p className="text-gray-700 leading-relaxed">{note.body}</p>
          </div>
        )
      })}
    </div>
  )
}
