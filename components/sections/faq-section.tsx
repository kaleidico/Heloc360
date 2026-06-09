import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PortableText } from '@/components/blog/portable-text'
import type { PortableTextBlock } from '@portabletext/types'

export type FaqSectionValue = {
  _type: 'faqSection'
  _key: string
  heading?: string
  items: Array<{ _key: string; question: string; answer: PortableTextBlock[] }>
}

export function FaqSection({ value }: { value: FaqSectionValue }) {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        {value.heading && <h2 className="text-3xl font-bold text-center mb-12">{value.heading}</h2>}
        <Accordion type="single" collapsible>
          {value.items.map((item) => (
            <AccordionItem key={item._key} value={item._key}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>
                <div className="prose-custom">
                  <PortableText value={item.answer} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
