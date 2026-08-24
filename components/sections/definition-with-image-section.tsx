import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export type DefinitionWithImageValue = {
  _type: 'definitionWithImage'
  _key: string
  anchorId?: string
  heading: string
  paragraph?: string
  featuresHeading?: string
  features?: Array<{ _key: string; text: string }>
  imageSrc?: string
  imageAlt?: string
  imageBlurDataURL?: string
}

// Full-width white band, constrained max-w-4xl, with a 2-column row: a lead
// paragraph + a blue-50 "key features" card (CheckCircle bullets) on the left,
// and a rounded image on the right. Reproduces the heloc-101 "What is a HELOC?"
// section. Anchor target via `anchorId`.
export function DefinitionWithImageSection({ value }: { value: DefinitionWithImageValue }) {
  return (
    <section id={value.anchorId} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1a71b6] mb-8">{value.heading}</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              {value.paragraph && (
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{value.paragraph}</p>
              )}
              <div className="bg-blue-50 p-6 rounded-lg">
                {value.featuresHeading && (
                  <h3 className="font-semibold text-[#1a71b6] mb-3">{value.featuresHeading}</h3>
                )}
                <ul className="space-y-2">
                  {(value.features || []).map((f) => (
                    <li key={f._key} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#02c39a] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
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
      </div>
    </section>
  )
}
