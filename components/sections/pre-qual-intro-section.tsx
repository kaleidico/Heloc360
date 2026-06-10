import { ComponentEmbedSection, type ComponentEmbedValue } from './component-embed-section'
import { StickyCtaSuppress } from '@/components/pre-qual/sticky-cta-suppress'

export type PreQualIntroValue = {
  _type: 'preQualIntro'
  _key: string
  eyebrow: string
  heading: string
  description?: string
  embeds?: ComponentEmbedValue[]
  suppressStickyCta?: boolean
}

// Verbatim reproduction of app/(site)/pre-qual/page.tsx: a bg-surface-50 main with a
// constrained header and a white card hosting the interactive pre-qual form (rendered
// via the nested componentEmbed, preserving its client logic). The StickyCtaSuppress
// side-effect is rendered directly (matching the source <main>'s first child).
export function PreQualIntroSection({ value }: { value: PreQualIntroValue }) {
  return (
    <main className="bg-surface-50 min-h-[80vh]">
      {value.suppressStickyCta !== false && <StickyCtaSuppress />}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue mb-2">
              {value.eyebrow}
            </p>
            <h1 className="text-display-lg text-ink-900">{value.heading}</h1>
            {value.description && (
              <p className="text-base text-ink-700 mt-3">{value.description}</p>
            )}
          </header>
          <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 lg:p-8">
            {value.embeds?.map((embed) => (
              <ComponentEmbedSection key={embed._key} value={embed} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
