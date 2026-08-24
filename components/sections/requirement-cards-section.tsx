import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RequirementCard = {
  _key: string
  title?: string
  // 'detailed' → CheckCircle + bold title + small body; 'simple' → CheckCircle + plain text.
  itemStyle?: 'detailed' | 'simple'
  items?: Array<{ _key: string; title?: string; body?: string }>
}

export type RequirementCardsValue = {
  _type: 'requirementCards'
  _key: string
  anchorId?: string
  heading: string
  cards?: RequirementCard[]
}

// Full-width gray-50 band, constrained max-w-4xl, with a 2-up grid of plain
// Cards. Each card has a blue title and a CheckCircle list; list items are
// either "detailed" (bold title + small body) or "simple" (plain text).
// Reproduces the heloc-101 "HELOC Qualification Requirements" section.
export function RequirementCardsSection({ value }: { value: RequirementCardsValue }) {
  return (
    <section id={value.anchorId} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a71b6] mb-8">{value.heading}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(value.cards || []).map((card) => (
              <Card key={card._key}>
                <CardHeader>
                  <CardTitle className="text-xl text-[#1a71b6]">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(card.items || []).map((item) =>
                    card.itemStyle === 'simple' ? (
                      <div key={item._key} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <div key={item._key} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.body}</p>
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
