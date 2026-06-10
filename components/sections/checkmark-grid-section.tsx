import * as Icons from 'lucide-react'

type CheckmarkItem = {
  _key: string
  title?: string
  body?: string
}

export type CheckmarkGridValue = {
  _type: 'checkmarkGrid'
  _key: string
  inGradientBox?: boolean
  heading?: string
  icon?: string
  items: CheckmarkItem[]
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

export function CheckmarkGridSection({ value }: { value: CheckmarkGridValue }) {
  const inner = (
    <>
      {value.heading && (
        <h2 className="text-2xl font-bold text-[#1b75bc] mb-6 flex items-center gap-3">
          <Icon name={value.icon} className="w-6 h-6" />
          {value.heading}
        </h2>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {(value.items || []).map((item) => (
          <div key={item._key} className="flex items-start gap-3">
            <Icons.CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  if (value.inGradientBox) {
    return (
      <div className="bg-gradient-to-r from-[#1b75bc]/10 to-[#007a5e]/10 p-8 rounded-lg mb-12">
        {inner}
      </div>
    )
  }
  return inner
}
