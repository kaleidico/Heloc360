import FAQ, { type FAQItem } from "@/components/ui/faq"

const homeFAQData: FAQItem[] = [
  {
    question: "What is a HELOC?",
    answer: "A Home Equity Line of Credit lets you borrow against your home's value for flexible spending.",
  },
  {
    question: "How does HELOC360 work?",
    answer: "We match you with lenders that fit your financial needs and goals.",
  },
  {
    question: "How long does it take?",
    answer: "We connect you with lenders quickly—often within minutes.",
  },
  {
    question: "How much does it cost?",
    answer: "Our service is completely free to homeowners.",
  },
]

export default function HomeFAQ() {
  return (
    <FAQ
      title="Frequently Asked Questions"
      subtitle="Get answers to common questions about HELOCs and our services."
      items={homeFAQData}
      className="bg-gray-50"
      showContactCTA={true}
      contactCTAText="Still have questions?"
      contactCTALink="/contact"
    />
  )
}
