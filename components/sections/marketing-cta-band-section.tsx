import Link from 'next/link'
import { Button } from '@/components/ui/button'

export type MarketingCtaBandValue = {
  _type: 'marketingCtaBand'
  _key: string
  heading: string
  body?: string
  primaryCta?: { label?: string; href?: string } | null
  secondaryCta?: { label?: string; href?: string } | null
  finePrint?: string
}

// Verbatim reproduction of the about page closing CTA band.
export function MarketingCtaBandSection({ value }: { value: MarketingCtaBandValue }) {
  return (
    <section className="py-16 bg-gradient-to-r from-[#1b75bc] to-[#007a5e]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{value.heading}</h2>
          {value.body && <p className="text-xl mb-8 opacity-90">{value.body}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {value.primaryCta?.href && value.primaryCta.label && (
              <Button size="lg" className="bg-white text-[#1b75bc] hover:bg-gray-100" asChild>
                <Link href={value.primaryCta.href}>{value.primaryCta.label}</Link>
              </Button>
            )}
            {value.secondaryCta?.href && value.secondaryCta.label && (
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href={value.secondaryCta.href}>{value.secondaryCta.label}</Link>
              </Button>
            )}
          </div>
          {value.finePrint && <p className="text-sm mt-4 opacity-80">{value.finePrint}</p>}
        </div>
      </div>
    </section>
  )
}
