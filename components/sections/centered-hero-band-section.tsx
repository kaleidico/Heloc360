import Link from 'next/link'
import { Button } from '@/components/ui/button'

export type CenteredHeroBandValue = {
  _type: 'centeredHeroBand'
  _key: string
  heading: string
  body?: string
  primaryCta?: { label?: string; href?: string } | null
  secondaryCta?: { label?: string; href?: string } | null
}

// Full-width gradient hero band with centered copy and no image — the heloc-101
// page top. Distinct from `marketingHero` (which is a 2-column copy+image band)
// and `heroSection` (a min-h-600 background-image hero). Reusable for any
// centered educational/landing hero.
export function CenteredHeroBandSection({ value }: { value: CenteredHeroBandValue }) {
  return (
    <section className="bg-gradient-to-r from-[#1a71b6] to-[#007a5e] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{value.heading}</h1>
          {value.body && <p className="text-xl mb-8 opacity-90">{value.body}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {value.primaryCta?.href && value.primaryCta.label && (
              <Button size="lg" className="bg-white text-[#1a71b6] hover:bg-gray-100" asChild>
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
        </div>
      </div>
    </section>
  )
}
