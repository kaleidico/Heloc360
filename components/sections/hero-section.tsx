import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { imageUrl } from '@/lib/sanity/image'

export type HeroSectionValue = {
  _type: 'heroSection'
  _key: string
  eyebrow?: string
  heading: string
  subheading?: string
  backgroundImage?: { alt?: string; asset?: unknown } | null
  primaryCta?: { label?: string; href?: string } | null
  secondaryCta?: { label?: string; href?: string } | null
}

export function HeroSection({ value }: { value: HeroSectionValue }) {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {value.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl(value.backgroundImage as any)}
            alt={value.backgroundImage.alt || ''}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* 60%, not 50%: guarantees at least 4.5:1 for white text even over a
              pure-white part of the photograph. See image-hero-section.tsx. */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {value.eyebrow && <p className="uppercase tracking-wide mb-3 text-sm">{value.eyebrow}</p>}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{value.heading}</h1>
        {value.subheading && <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">{value.subheading}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {value.primaryCta?.href && value.primaryCta.label && (
            <Button asChild size="lg">
              <Link href={value.primaryCta.href}>{value.primaryCta.label}</Link>
            </Button>
          )}
          {value.secondaryCta?.href && value.secondaryCta.label && (
            <Button asChild variant="outline" size="lg">
              <Link href={value.secondaryCta.href}>{value.secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
