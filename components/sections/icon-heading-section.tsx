import * as Icons from 'lucide-react'

export type IconHeadingValue = {
  _type: 'iconHeading'
  _key: string
  icon?: string
  level?: 'h2' | 'h3'
  marginBottom?: '4' | '6'
  text: string
}

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Comp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Comp) return null
  return <Comp className={className} />
}

export function IconHeadingSection({ value }: { value: IconHeadingValue }) {
  const mb = value.marginBottom === '6' ? 'mb-6' : 'mb-4'
  const cls = `text-2xl font-bold text-[#1b75bc] ${mb} flex items-center gap-3`
  const Tag = value.level === 'h3' ? 'h3' : 'h2'
  return (
    <Tag className={cls}>
      <Icon name={value.icon} className="w-6 h-6" />
      {value.text}
    </Tag>
  )
}
