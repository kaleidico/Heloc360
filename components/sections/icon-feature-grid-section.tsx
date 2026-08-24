import * as Icons from 'lucide-react'

type IconFeature = {
  _key: string
  icon?: string
  accent?: 'blue' | 'green' | 'teal' | 'purple'
  title?: string
  body?: string
}

export type IconFeatureGridValue = {
  _type: 'iconFeatureGrid'
  _key: string
  anchorId?: string
  background?: 'blue' | 'white' | 'gray'
  heading: string
  subheading?: string
  features: IconFeature[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} aria-hidden="true" />
}

const BG: Record<string, string> = { blue: 'bg-blue-50', white: 'bg-white', gray: 'bg-gray-50' }

// Per-accent badge background + icon color — verbatim from source.
const badgeBg: Record<string, string> = {
  blue: 'bg-[#1a71b6]/10',
  green: 'bg-[#02c39a]/10',
  teal: 'bg-teal-100',
  purple: 'bg-purple-100',
}
const iconColor: Record<string, string> = {
  blue: 'text-[#1a71b6]',
  green: 'text-[#02c39a]',
  teal: 'text-teal-600',
  purple: 'text-purple-600',
}

// Verbatim reproduction of the homepage "Why Choose HELOC360?" section.
export function IconFeatureGridSection({ value }: { value: IconFeatureGridValue }) {
  const bg = BG[value.background || 'blue']
  return (
    <section className={`py-16 ${bg}`} aria-labelledby={value.anchorId}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            id={value.anchorId}
            className="text-3xl md:text-4xl font-bold text-[#1a71b6] mb-4"
          >
            {value.heading}
          </h2>
          {value.subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{value.subheading}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
          {(value.features || []).map((feature) => {
            const accent = feature.accent || 'blue'
            return (
              <div key={feature._key} className="text-center" role="listitem">
                <div
                  className={`w-16 h-16 ${badgeBg[accent]} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon name={feature.icon} className={`w-8 h-8 ${iconColor[accent]}`} />
                </div>
                <h3 className="text-xl font-semibold text-[#1a71b6] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
