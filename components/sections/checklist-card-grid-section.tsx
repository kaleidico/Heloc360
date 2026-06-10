import * as Icons from 'lucide-react'

type ChecklistCard = {
  _key: string
  icon?: string
  iconColor?: 'blue' | 'green'
  title?: string
  items?: string[]
}

export type ChecklistCardGridValue = {
  _type: 'checklistCardGrid'
  _key: string
  cards: ChecklistCard[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

export function ChecklistCardGridSection({ value }: { value: ChecklistCardGridValue }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {(value.cards || []).map((card) => {
        const iconCls =
          card.iconColor === 'green'
            ? 'w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0'
            : 'w-6 h-6 text-[#1b75bc] mt-1 flex-shrink-0'
        return (
          <div key={card._key} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Icon name={card.icon} className={iconCls} />
              <h3 className="text-lg font-semibold text-[#1b75bc]">{card.title}</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              {(card.items || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-[#02c39a] mt-1 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
