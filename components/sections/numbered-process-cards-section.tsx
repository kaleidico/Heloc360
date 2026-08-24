import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ProcessStep = {
  _key: string
  number?: string
  accent?: 'blue' | 'green' | 'teal'
  title?: string
  body?: string
}

export type NumberedProcessCardsValue = {
  _type: 'numberedProcessCards'
  _key: string
  anchorId?: string
  background?: 'white' | 'gray'
  heading: string
  subheading?: string
  steps: ProcessStep[]
}

const BG: Record<string, string> = { white: 'bg-white', gray: 'bg-gray-50' }

// Per-accent badge background + number color — verbatim from source. Note green's
// number color (#007a5e) differs from its badge tint (#02c39a).
const badgeBg: Record<string, string> = {
  blue: 'bg-[#1a71b6]/10',
  green: 'bg-[#02c39a]/10',
  teal: 'bg-teal-100',
}
const numberColor: Record<string, string> = {
  blue: 'text-[#1a71b6]',
  green: 'text-[#007a5e]',
  teal: 'text-teal-600',
}

// Verbatim reproduction of the homepage "Our Process" section.
export function NumberedProcessCardsSection({ value }: { value: NumberedProcessCardsValue }) {
  const bg = BG[value.background || 'white']
  return (
    <section className={`py-16 ${bg}`} aria-labelledby={value.anchorId}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            id={value.anchorId}
            className="text-3xl md:text-4xl font-bold text-[#1a71b6] mb-4"
          >
            {value.heading}
          </h2>
          {value.subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{value.subheading}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8" role="list">
          {(value.steps || []).map((step) => {
            const accent = step.accent || 'blue'
            return (
              <Card
                key={step._key}
                className="text-center border-2 border-[#1a71b6]/20 hover:border-[#1a71b6]/20 transition-colors"
                role="listitem"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 ${badgeBg[accent]} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <span
                      className={`text-2xl font-bold ${numberColor[accent]}`}
                      aria-label={`Step ${step.number}`}
                    >
                      {step.number}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-[#1a71b6]">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.body}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
