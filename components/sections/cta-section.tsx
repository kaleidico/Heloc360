import Link from 'next/link'
import { Button } from '@/components/ui/button'

export type CtaSectionValue = {
  _type: 'ctaSection'
  _key: string
  heading: string
  subheading?: string
  cta?: { label?: string; href?: string } | null
  variant?: 'primary' | 'secondary'
}

export function CtaSection({ value }: { value: CtaSectionValue }) {
  const variant = value.variant || 'primary'
  const bg = variant === 'primary' ? 'bg-[#00274C] text-white' : 'bg-gray-50 text-gray-900'
  return (
    <section className={`${bg} py-16`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{value.heading}</h2>
        {value.subheading && <p className="text-lg mb-8 max-w-2xl mx-auto">{value.subheading}</p>}
        {value.cta?.href && value.cta.label && (
          <Button asChild size="lg" variant={variant === 'primary' ? 'default' : 'outline'}>
            <Link href={value.cta.href}>{value.cta.label}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
