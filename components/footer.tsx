import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import footerNavData from "@/config/footer-nav.json"
import type { FooterNavigation, FooterNavigationItem } from "@/types/navigation"

// lucide-react exports use "Linkedin" (lowercase d), not "LinkedIn". Keep
// the icon string in config/footer-nav.json matching this casing.
const socialIconMap = { Facebook, Twitter, Linkedin, Mail }

function FooterColumn({
  heading,
  items,
}: {
  heading: string
  items: FooterNavigationItem[]
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-maize mb-3">
        {heading}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <Link
              href={item.url}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const data: FooterNavigation = footerNavData as FooterNavigation

  return (
    <footer className="bg-brand-navy text-white">
      {/* Mailing list row (lead magnet) */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-display-sm text-white mb-2">
                {data.mailingList.heading}
              </h2>
              <p className="text-sm text-white/70">{data.mailingList.subheading}</p>
            </div>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Mailing list signup"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-md bg-white text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-brand-green hover:bg-brand-green-dark text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                {data.mailingList.ctaLabel}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 5-column nav */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <FooterColumn heading="Use cases" items={data.useCases} />
          <FooterColumn heading="Calculators" items={data.calculators} />
          <FooterColumn heading="Resources" items={data.resources} />
          <FooterColumn heading="Company" items={data.company} />
          <FooterColumn heading="Legal" items={data.legal} />
        </div>
      </div>

      {/* Company info + legal */}
      <div className="bg-black/20 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="md:col-span-2">
              <p className="text-white/80 leading-relaxed">{data.companyInfo.description}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs leading-relaxed">
                {data.companyInfo.legalDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black/30">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} HELOC360 · My Perfect Leads, LLC. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs">
              {data.socialMedia.map((s, i) => {
                const Icon = socialIconMap[s.icon as keyof typeof socialIconMap]
                return (
                  <a
                    key={i}
                    href={s.url}
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label={s.label}
                  >
                    {Icon ? <Icon className="w-4 h-4" /> : s.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
