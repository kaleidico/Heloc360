type TitledBulletCard = {
  _key: string
  title?: string
  intro?: string
  bullets?: string[]
}

export type TitledBulletCardsValue = {
  _type: 'titledBulletCards'
  _key: string
  cards: TitledBulletCard[]
}

export function TitledBulletCardsSection({ value }: { value: TitledBulletCardsValue }) {
  return (
    <div className="space-y-6">
      {(value.cards || []).map((card) => (
        <div key={card._key} className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#1a71b6] mb-3">{card.title}</h3>
          {card.intro && <p className="text-gray-700 mb-3">{card.intro}</p>}
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            {(card.bullets || []).map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
