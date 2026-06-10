type TwoTierCard = {
  _key: string
  title?: string
  body?: string
  finePrint?: string
}

export type TwoTierCardsValue = {
  _type: 'twoTierCards'
  _key: string
  columns?: 2 | 3 | 4
  cards: TwoTierCard[]
}

export function TwoTierCardsSection({ value }: { value: TwoTierCardsValue }) {
  const cols = value.columns || 4
  const gridCls = cols === 2 ? 'md:grid-cols-2' : cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'
  return (
    <div className={`grid ${gridCls} gap-6`}>
      {(value.cards || []).map((card) => (
        <div key={card._key} className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#1b75bc] mb-3">{card.title}</h3>
          {card.body && <p className="text-gray-700 text-sm mb-4">{card.body}</p>}
          {card.finePrint && <p className="text-xs text-gray-600">{card.finePrint}</p>}
        </div>
      ))}
    </div>
  )
}
