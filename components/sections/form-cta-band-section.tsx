import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ComponentEmbedSection, type ComponentEmbedValue } from './component-embed-section'

export type FormCtaBandValue = {
  _type: 'formCtaBand'
  _key: string
  anchorId?: string
  heading: string
  lead?: string
  cardTitle?: string
  cardDescription?: string
  embed?: ComponentEmbedValue
  finePrint?: {
    before?: string
    termsLabel?: string
    termsHref?: string
    middle?: string
    privacyLabel?: string
    privacyHref?: string
    after?: string
  }
}

// Verbatim reproduction of the homepage "Lead Capture" section. The interactive
// form is rendered via the nested componentEmbed, preserving its client logic.
export function FormCtaBandSection({ value }: { value: FormCtaBandValue }) {
  const fp = value.finePrint
  return (
    <section
      className="py-16 bg-gradient-to-r from-[#1a71b6] to-teal-600"
      aria-labelledby={value.anchorId}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 id={value.anchorId} className="text-3xl md:text-4xl font-bold mb-4">
            {value.heading}
          </h2>
          {value.lead && <p className="text-lg mb-8 opacity-90">{value.lead}</p>}

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              {value.cardTitle && <CardTitle className="text-white">{value.cardTitle}</CardTitle>}
              {value.cardDescription && (
                <CardDescription className="text-white/80">{value.cardDescription}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {value.embed && <ComponentEmbedSection value={value.embed} />}
              {fp && (
                <p className="text-xs text-white/70">
                  {fp.before}{' '}
                  <a href={fp.termsHref} className="underline hover:no-underline">
                    {fp.termsLabel}
                  </a>{' '}
                  {fp.middle}{' '}
                  <a href={fp.privacyHref} className="underline hover:no-underline">
                    {fp.privacyLabel}
                  </a>
                  {fp.after}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
