import * as Icons from 'lucide-react'

type IconBadgeCard = {
  _key: string
  icon?: string
  iconTint?: 'blue' | 'green' | 'purple'
  title?: string
  body?: string
}

export type IconBadgeCardsValue = {
  _type: 'iconBadgeCards'
  _key: string
  columns?: 2 | 3 | 4
  cards: IconBadgeCard[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

// Per-card tint → badge background + icon color, verbatim from source.
const badgeBg: Record<string, string> = {
  blue: 'bg-[#1a71b6]/10',
  green: 'bg-[#02c39a]/10',
  purple: 'bg-purple-100',
}
const iconColor: Record<string, string> = {
  blue: 'text-[#1a71b6]',
  green: 'text-[#02c39a]',
  purple: 'text-purple-600',
}

export function IconBadgeCardsSection({ value }: { value: IconBadgeCardsValue }) {
  const cols = value.columns || 3
  const gridCls = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  return (
    <div className={`grid ${gridCls} gap-6`}>
      {(value.cards || []).map((card) => {
        const tint = card.iconTint || 'blue'
        return (
          <div key={card._key} className="text-center p-6 border border-gray-200 rounded-lg">
            <div
              className={`w-12 h-12 ${badgeBg[tint]} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <Icon name={card.icon} className={`w-6 h-6 ${iconColor[tint]}`} />
            </div>
            <h3 className="text-lg font-semibold text-[#1a71b6] mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.body}</p>
          </div>
        )
      })}
    </div>
  )
}
