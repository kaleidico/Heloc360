import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export type SplitContentChecklistValue = {
  _type: 'splitContentChecklist'
  _key: string
  anchorId?: string
  heading: string
  lead?: string
  checklist?: string[]
  imageSrc?: string
  imageAlt?: string
  imageBlurDataURL?: string
}

// Verbatim reproduction of the homepage "What is HELOC360?" section.
export function SplitContentChecklistSection({ value }: { value: SplitContentChecklistValue }) {
  return (
    <section className="py-16 bg-gray-50" aria-labelledby={value.anchorId}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              id={value.anchorId}
              className="text-3xl md:text-4xl font-bold text-[#1a71b6] mb-6"
            >
              {value.heading}
            </h2>
            {value.lead && (
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{value.lead}</p>
            )}
            <ul className="space-y-4" role="list">
              {(value.checklist || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-6 h-6 text-[#02c39a] mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-gray-700">{item}</p>
                </li>
              ))}
            </ul>
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
