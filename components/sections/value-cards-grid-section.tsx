import * as Icons from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ValueCard = {
  _key: string
  icon?: string
  accent?: 'blue' | 'green' | 'purple' | 'orange'
  title?: string
  body?: string
}

export type ValueCardsGridValue = {
  _type: 'valueCardsGrid'
  _key: string
  background?: 'white' | 'gray'
  heading: string
  subheading?: string
  cards: ValueCard[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

const BG: Record<string, string> = { white: 'bg-white', gray: 'bg-gray-50' }

// Per-accent class maps — verbatim from source. Note green's icon color (#007a5e)
// differs from its top border (#02c39a).
const borderTop: Record<string, string> = {
  blue: 'border-t-[#1a71b6]',
  green: 'border-t-[#02c39a]',
  purple: 'border-t-purple-500',
  orange: 'border-t-orange-500',
}
const badgeBg: Record<string, string> = {
  blue: 'bg-[#1a71b6]/10',
  green: 'bg-[#02c39a]/10',
  purple: 'bg-purple-100',
  orange: 'bg-orange-100',
}
const iconColor: Record<string, string> = {
  blue: 'text-[#1a71b6]',
  green: 'text-[#007a5e]',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
}

// Verbatim reproduction of the about page "Our Values" section.
export function ValueCardsGridSection({ value }: { value: ValueCardsGridValue }) {
  const bg = BG[value.background || 'white']
  return (
    <section className={`py-16 ${bg}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a71b6] mb-4">{value.heading}</h2>
            {value.subheading && <p className="text-lg text-gray-600">{value.subheading}</p>}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(value.cards || []).map((card) => {
              const accent = card.accent || 'blue'
              return (
                <Card key={card._key} className={`text-center border-t-4 ${borderTop[accent]}`}>
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${badgeBg[accent]} rounded-lg flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon name={card.icon} className={`w-6 h-6 ${iconColor[accent]}`} />
                    </div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{card.body}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
