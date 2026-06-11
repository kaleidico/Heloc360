import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type LinkCardsGridValue = {
  _type: 'linkCardsGrid'
  _key: string
  heading?: string
  subheading?: string
  cards?: { _key?: string; title?: string; body?: string; href?: string; ctaLabel?: string }[]
}

// Grid of clickable cards on a gray-50 band. Hover treatment (brand-blue
// title, green on hover, lifting shadow) matches the team member cards.
export function LinkCardsGridSection({ value }: { value: LinkCardsGridValue }) {
  const cards = value.cards ?? []
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {(value.heading || value.subheading) && (
            <div className="text-center mb-12">
              {value.heading && (
                <h2 className="text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4">{value.heading}</h2>
              )}
              {value.subheading && <p className="text-lg text-gray-600">{value.subheading}</p>}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            {cards.map((card, i) => (
              <Link key={card._key ?? i} href={card.href || '#'} aria-label={card.title}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#1b75bc] group-hover:text-[#007a5e] transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between pt-0">
                    {card.body && <p className="text-gray-600 text-sm leading-relaxed mb-4">{card.body}</p>}
                    <span className="inline-flex items-center text-[#1b75bc] group-hover:text-[#007a5e] transition-colors text-sm font-medium">
                      {card.ctaLabel || 'Open'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
