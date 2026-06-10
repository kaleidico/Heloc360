import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export type ImageHeroValue = {
  _type: 'imageHero'
  _key: string
  headingLine1: string
  headingLine2?: string
  lead?: string
  cta?: { label?: string; href?: string; ariaLabel?: string } | null
  finePrint?: string
  imageSrc?: string
  imageAlt?: string
  imageBlurDataURL?: string
}

// Verbatim reproduction of the homepage Hero section.
export function ImageHeroSection({ value }: { value: ImageHeroValue }) {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {value.imageSrc && (
          <Image
            src={value.imageSrc}
            alt={value.imageAlt || ''}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            placeholder={value.imageBlurDataURL ? 'blur' : 'empty'}
            blurDataURL={value.imageBlurDataURL}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {value.headingLine1}
          {value.headingLine2 && (
            <>
              <br />
              {value.headingLine2}
            </>
          )}
        </h1>
        {value.lead && (
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">{value.lead}</p>
        )}
        {value.cta?.href && value.cta.label && (
          <Button
            size="lg"
            className="bg-[#007a5e] hover:bg-[#00664e] text-white px-8 py-3 text-lg rounded-lg"
            aria-label={value.cta.ariaLabel}
            asChild
          >
            <Link href={value.cta.href}>{value.cta.label}</Link>
          </Button>
        )}
        {value.finePrint && <p className="text-sm mt-4 opacity-90">{value.finePrint}</p>}
      </div>
    </section>
  )
}
