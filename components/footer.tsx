"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import footerNavData from "@/config/footer-nav.json"
import CookiePreferencesLink from "@/components/consent/cookie-preferences-link"
import FooterMailingListForm from "@/components/footer-mailing-list-form"
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
            {/* py-1 takes the link box to 24px, the WCAG 2.2 (2.5.8) minimum
                target size. It measured 20px before. */}
            <Link
              href={item.url}
              className="inline-block py-1 text-sm text-white/80 hover:text-white transition-colors"
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
            <FooterMailingListForm ctaLabel={data.mailingList.ctaLabel} />
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
          <div>
            <FooterColumn heading="Legal" items={data.legal} />
            {/* Withdrawing consent has to be as easy as giving it, so this
                sits with the other legal links rather than behind the banner. */}
            <div className="mt-2">
              <CookiePreferencesLink />
            </div>
          </div>
        </div>
      </div>

      {/* Company info + legal */}
      <div className="bg-black/20 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-maize mb-2">
                {data.companyInfo.tagline}
              </p>
              <p className="text-base font-semibold text-white mb-3">
                {data.companyInfo.callToAction}
              </p>
              <p className="text-white/80 leading-relaxed">{data.companyInfo.description}</p>
              <address className="not-italic text-white/60 text-sm mt-3">
                {data.companyInfo.address}
              </address>
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
                  // The 16px icon needs padding to reach the 24px minimum
                  // target size in WCAG 2.2 (2.5.8); inline-flex centres it.
                  <a
                    key={i}
                    href={s.url}
                    className="inline-flex items-center justify-center w-11 h-11 -m-1 text-white/60 hover:text-white transition-colors"
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
