import FAQ, { type FAQItem } from "@/components/ui/faq"

interface BlogFAQProps {
  title?: string
  items: FAQItem[]
}

export default function BlogFAQ({ title = "Frequently Asked Questions", items }: BlogFAQProps) {
  return (
    <div className="bg-gray-50 py-12 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <FAQ
          title={title}
          subtitle="Get answers to common questions about this topic"
          items={items}
          className="bg-transparent py-0"
          showContactCTA={true}
          contactCTAText="Have more questions about HELOCs?"
          contactCTALink="/contact"
          generateStructuredData={true}
        />
      </div>
    </div>
  )
}
