import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export type StorySectionValue = {
  _type: 'storySection'
  _key: string
  background?: 'white' | 'gray'
  heading: string
  subheading?: string
  columnHeading?: string
  paragraphs?: string[]
  checklist?: string[]
  imageSrc?: string
  imageAlt?: string
  imageBlurDataURL?: string
}

// Static bg map so Tailwind keeps both classes.
const BG: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
}

// Verbatim reproduction of the about page "Our Story" section.
export function StorySection({ value }: { value: StorySectionValue }) {
  const bg = BG[value.background || 'gray']
  return (
    <section className={`py-16 ${bg}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4">{value.heading}</h2>
            {value.subheading && <p className="text-lg text-gray-600">{value.subheading}</p>}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {value.columnHeading && (
                <h3 className="text-2xl font-semibold text-[#1b75bc] mb-4">{value.columnHeading}</h3>
              )}
              {(value.paragraphs || []).map((para, i) => (
                <p key={i} className="text-gray-700 mb-6 leading-relaxed">
                  {para}
                </p>
              ))}
              {value.checklist && value.checklist.length > 0 && (
                <div className="space-y-3">
                  {value.checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#007a5e] mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              {value.imageSrc && (
                <Image
                  src={value.imageSrc}
                  alt={value.imageAlt || ''}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading="lazy"
                  quality={70}
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
