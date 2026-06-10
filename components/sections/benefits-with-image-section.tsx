import Image from 'next/image'
import * as Icons from 'lucide-react'

type BenefitItem = {
  _key: string
  icon?: string
  accent?: 'blue' | 'green' | 'teal' | 'purple'
  title?: string
  body?: string
}

export type BenefitsWithImageValue = {
  _type: 'benefitsWithImage'
  _key: string
  anchorId?: string
  heading: string
  lead?: string
  items: BenefitItem[]
  imageSrc?: string
  imageAlt?: string
  imageBlurDataURL?: string
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} aria-hidden="true" />
}

// Per-item badge background + icon color — verbatim from source.
const badgeBg: Record<string, string> = {
  blue: 'bg-[#1b75bc]/10',
  green: 'bg-[#02c39a]/10',
  teal: 'bg-teal-100',
  purple: 'bg-purple-100',
}
const iconColor: Record<string, string> = {
  blue: 'text-[#1b75bc]',
  green: 'text-[#02c39a]',
  teal: 'text-teal-600',
  purple: 'text-purple-600',
}

// Verbatim reproduction of the homepage "Benefits of HELOCs" section.
export function BenefitsWithImageSection({ value }: { value: BenefitsWithImageValue }) {
  return (
    <section className="py-16 bg-white" aria-labelledby={value.anchorId}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              id={value.anchorId}
              className="text-3xl md:text-4xl font-bold text-[#1b75bc] mb-6"
            >
              {value.heading}
            </h2>
            {value.lead && <p className="text-lg text-gray-700 mb-8">{value.lead}</p>}

            <div className="grid sm:grid-cols-2 gap-6" role="list">
              {(value.items || []).map((item) => {
                const accent = item.accent || 'blue'
                return (
                  <div key={item._key} className="flex items-start gap-3" role="listitem">
                    <div
                      className={`w-8 h-8 ${badgeBg[accent]} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon name={item.icon} className={`w-4 h-4 ${iconColor[accent]}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative">
            {value.imageSrc && (
              <Image
                src={value.imageSrc}
                alt={value.imageAlt || ''}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
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
