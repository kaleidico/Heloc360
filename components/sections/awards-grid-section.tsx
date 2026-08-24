import * as Icons from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

type Award = { _key: string; icon?: string; tint?: 'yellow' | 'blue' | 'green'; title?: string; subtitle?: string }

export type AwardsGridValue = {
  _type: 'awardsGrid'
  _key: string
  background?: 'white' | 'gray'
  heading: string
  subheading?: string
  awards: Award[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

const BG: Record<string, string> = { white: 'bg-white', gray: 'bg-gray-50' }
const badgeBg: Record<string, string> = {
  yellow: 'bg-yellow-100',
  blue: 'bg-blue-100',
  green: 'bg-green-100',
}
const iconColor: Record<string, string> = {
  yellow: 'text-yellow-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
}

// Verbatim reproduction of the about page "Awards & Recognition" section.
export function AwardsGridSection({ value }: { value: AwardsGridValue }) {
  const bg = BG[value.background || 'gray']
  return (
    <section className={`py-16 ${bg}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a71b6] mb-4">{value.heading}</h2>
            {value.subheading && <p className="text-lg text-gray-600">{value.subheading}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(value.awards || []).map((award) => {
              const tint = award.tint || 'yellow'
              return (
                <Card key={award._key} className="text-center">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 ${badgeBg[tint]} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon name={award.icon} className={`w-8 h-8 ${iconColor[tint]}`} />
                    </div>
                    <CardTitle className="text-lg">{award.title}</CardTitle>
                    <p className="text-gray-600">{award.subtitle}</p>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
