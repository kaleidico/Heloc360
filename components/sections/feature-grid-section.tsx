import * as Icons from 'lucide-react'

export type FeatureGridSectionValue = {
  _type: 'featureGridSection'
  _key: string
  heading?: string
  subheading?: string
  columns?: 2 | 3 | 4
  features: Array<{ _key: string; icon?: string; title?: string; description?: string }>
}

function IconByName({ name }: { name?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className="w-8 h-8" />
}

export function FeatureGridSection({ value }: { value: FeatureGridSectionValue }) {
  const cols = value.columns || 3
  const gridCls = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  return (
    <section className="py-16 container mx-auto px-4">
      {(value.heading || value.subheading) && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          {value.heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{value.heading}</h2>}
          {value.subheading && <p className="text-lg text-gray-700">{value.subheading}</p>}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCls} gap-8`}>
        {value.features.map((f) => (
          <div key={f._key} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFCB05] text-[#00274C] mb-4">
              <IconByName name={f.icon} />
            </div>
            {f.title && <h3 className="text-xl font-semibold mb-2">{f.title}</h3>}
            {f.description && <p className="text-gray-700">{f.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
