import * as Icons from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

type Accent =
  | 'green'
  | 'blue'
  | 'purple'
  | 'teal'
  | 'orange'
  | 'red'
  | 'yellow'

type BorderAccentCard = {
  _key: string
  icon?: string
  accent?: Accent
  title?: string
  body?: string
}

export type BorderAccentCardsValue = {
  _type: 'borderAccentCards'
  _key: string
  anchorId?: string
  background?: 'white' | 'red'
  heading: string
  columns?: 2 | 3
  coloredTitles?: boolean
  cards?: BorderAccentCard[]
}

const BG: Record<string, string> = { white: 'bg-white', red: 'bg-red-50' }

// Per-accent class maps — verbatim from source. Left border, icon tile bg, and
// icon color. Brand accents (green/blue) use the #02c39a/#1b75bc hex values;
// the rest use Tailwind named colors.
const borderLeft: Record<Accent, string> = {
  green: 'border-l-[#02c39a]',
  blue: 'border-l-[#1b75bc]',
  purple: 'border-l-purple-500',
  teal: 'border-l-teal-500',
  orange: 'border-l-orange-500',
  red: 'border-l-red-500',
  yellow: 'border-l-yellow-500',
}
const tileBg: Record<Accent, string> = {
  green: 'bg-[#02c39a]/10',
  blue: 'bg-[#1b75bc]/10',
  purple: 'bg-purple-100',
  teal: 'bg-teal-100',
  orange: 'bg-orange-100',
  red: 'bg-red-100',
  yellow: 'bg-yellow-100',
}
const iconColor: Record<Accent, string> = {
  green: 'text-[#02c39a]',
  blue: 'text-[#1b75bc]',
  purple: 'text-purple-600',
  teal: 'text-teal-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
}
// Colored card titles (risks variant). Falls back to default title color when
// coloredTitles is off.
const titleColor: Record<Accent, string> = {
  green: 'text-[#02c39a]',
  blue: 'text-[#1b75bc]',
  purple: 'text-purple-700',
  teal: 'text-teal-700',
  orange: 'text-orange-700',
  red: 'text-red-700',
  yellow: 'text-yellow-700',
}

// Full-width band, constrained max-w-4xl, with a grid of left-border accent
// cards. Each card has a rounded icon tile, a title, and a body paragraph.
// Reproduces both the heloc-101 "Benefits" (white, 3-up, gap-6, default titles)
// and "Risks" (red-50, 2-up, gap-8, colored titles) sections.
export function BorderAccentCardsSection({ value }: { value: BorderAccentCardsValue }) {
  const bg = BG[value.background || 'white']
  const cols = value.columns || 3
  const gridCls =
    cols === 2 ? 'grid md:grid-cols-2 gap-8' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
  const iconBoxCls = cols === 2 ? 'w-10 h-10' : 'w-10 h-10'
  return (
    <section id={value.anchorId} className={`py-16 ${bg}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1b75bc] mb-8">{value.heading}</h2>
          <div className={gridCls}>
            {(value.cards || []).map((card) => {
              const accent = card.accent || 'green'
              return (
                <Card key={card._key} className={`border-l-4 ${borderLeft[accent]}`}>
                  <CardHeader>
                    <div
                      className={`${iconBoxCls} ${tileBg[accent]} rounded-lg flex items-center justify-center mb-2`}
                    >
                      <Icon name={card.icon} className={`w-5 h-5 ${iconColor[accent]}`} />
                    </div>
                    <CardTitle
                      className={`text-lg${value.coloredTitles ? ` ${titleColor[accent]}` : ''}`}
                    >
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={value.coloredTitles ? 'text-gray-700' : 'text-gray-600'}>
                      {card.body}
                    </p>
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
