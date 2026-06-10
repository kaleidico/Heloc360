import * as Icons from 'lucide-react'

type Stat = { _key: string; icon?: string; number?: string; label?: string }

export type StatsBandValue = {
  _type: 'statsBand'
  _key: string
  stats: Stat[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

// Verbatim reproduction of the about page "Company Stats" band.
export function StatsBandSection({ value }: { value: StatsBandValue }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(value.stats || []).map((stat) => (
            <div key={stat._key} className="text-center">
              <div className="w-16 h-16 bg-[#1b75bc]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={stat.icon} className="w-8 h-8 text-[#1b75bc]" />
              </div>
              <div className="text-3xl font-bold text-[#1b75bc] mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
