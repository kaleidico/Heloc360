import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export type MarketingHeroValue = {
  _type: 'marketingHero'
  _key: string
  heading: string
  body?: string
  primaryCta?: { label?: string; href?: string } | null
  secondaryCta?: { label?: string; href?: string } | null
  imageSrc?: string
  imageAlt?: string
  imageBlurDataURL?: string
}

// Verbatim reproduction of the about page hero band.
export function MarketingHeroSection({ value }: { value: MarketingHeroValue }) {
  return (
    <section className="relative py-20 bg-gradient-to-r from-[#1a71b6] to-[#007a5e] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{value.heading}</h1>
            {value.body && <p className="text-xl mb-8 opacity-90 leading-relaxed">{value.body}</p>}
            <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="relative">
            {value.imageSrc && (
              <Image
                src={value.imageSrc}
                alt={value.imageAlt || ''}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
                quality={70}
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder={value.imageBlurDataURL ? 'blur' : 'empty'}
                blurDataURL={value.imageBlurDataURL}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
