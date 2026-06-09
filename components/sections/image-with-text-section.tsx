import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PortableText } from '@/components/blog/portable-text'
import { imageUrl } from '@/lib/sanity/image'
import type { PortableTextBlock } from '@portabletext/types'

export type ImageWithTextSectionValue = {
  _type: 'imageWithTextSection'
  _key: string
  image: { alt?: string; asset?: unknown }
  imagePosition?: 'left' | 'right'
  heading?: string
  body?: PortableTextBlock[]
  cta?: { label?: string; href?: string } | null
}

export function ImageWithTextSection({ value }: { value: ImageWithTextSectionValue }) {
  const reverse = value.imagePosition === 'left'
  return (
    <section className="py-16 container mx-auto px-4">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reverse ? 'md:[direction:rtl]' : ''}`}>
        <div className={reverse ? 'md:[direction:ltr]' : ''}>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={imageUrl(value.image as any)}
              alt={value.image.alt || ''}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className={reverse ? 'md:[direction:ltr]' : ''}>
          {value.heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{value.heading}</h2>}
          {value.body && (
            <div className="prose-custom mb-6" style={{ lineHeight: '1.8' }}>
              <PortableText value={value.body} />
            </div>
          )}
          {value.cta?.href && value.cta.label && (
            <Button asChild size="lg">
              <Link href={value.cta.href}>{value.cta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
