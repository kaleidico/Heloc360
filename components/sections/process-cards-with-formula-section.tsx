import * as Icons from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

type ProcessCard = {
  _key: string
  icon?: string
  tint?: 'blue' | 'green'
  title?: string
  points?: Array<{ _key: string; text: string }>
}

export type ProcessCardsWithFormulaValue = {
  _type: 'processCardsWithFormula'
  _key: string
  anchorId?: string
  heading: string
  cards?: ProcessCard[]
  formulaHeading?: string
  formulaIntro?: string
  formula?: string
  formulaNote?: string
}

// Per-card tint → icon tile background + icon color, verbatim from source.
const tileBg: Record<string, string> = {
  blue: 'bg-[#1a71b6]/10',
  green: 'bg-[#02c39a]/10',
}
const iconColor: Record<string, string> = {
  blue: 'text-[#1a71b6]',
  green: 'text-[#02c39a]',
}

// Full-width gray-50 band, constrained max-w-4xl: a 2-up grid of icon-tile cards
// (CheckCircle bullet lists) followed by a white formula/highlight box with a
// blue-50 emphasized line. Reproduces the heloc-101 "How HELOCs Work" section.
export function ProcessCardsWithFormulaSection({ value }: { value: ProcessCardsWithFormulaValue }) {
  return (
    <section id={value.anchorId} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a71b6] mb-8">{value.heading}</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {(value.cards || []).map((card) => {
              const tint = card.tint || 'blue'
              return (
                <Card key={card._key}>
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${tileBg[tint]} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Icon name={card.icon} className={`w-6 h-6 ${iconColor[tint]}`} />
                    </div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {(card.points || []).map((p) => (
                        <li key={p._key} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{p.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            {value.formulaHeading && (
              <h3 className="text-xl font-semibold text-[#1a71b6] mb-4">{value.formulaHeading}</h3>
            )}
            {value.formulaIntro && <p className="text-gray-700 mb-4">{value.formulaIntro}</p>}
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-lg font-semibold text-[#1a71b6]">{value.formula}</p>
            </div>
            {value.formulaNote && <p className="text-sm text-gray-600 mt-4">{value.formulaNote}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
