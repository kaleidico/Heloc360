import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "How HELOC360 works to keep this site usable for everyone, the standard we hold ourselves to, known limitations, and how to tell us about a barrier.",
  alternates: { canonical: "/accessibility" },
}

const LAST_REVIEWED = "24 August 2026"

export default function AccessibilityPage() {
  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="mb-10">
        <h1 className="text-display-md text-brand-navy mb-3">
          Accessibility Statement
        </h1>
        <p className="text-sm text-ink-500">Last reviewed: {LAST_REVIEWED}</p>
      </header>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-ink-700 leading-relaxed">
          HELOC360, a service of My Perfect Leads, LLC, wants every homeowner to
          be able to use this site, including people who browse with a screen
          reader, a keyboard alone, speech input, or a magnified display.
        </p>

        <h2>The standard we work to</h2>
        <p>
          We aim to meet{" "}
          <a
            href="https://www.w3.org/TR/WCAG22/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web Content Accessibility Guidelines (WCAG) 2.2, Level AA
          </a>
          . That is the benchmark US courts and regulators generally look to
          when judging whether a website is accessible.
        </p>

        <h2>What we have done</h2>
        <ul>
          <li>Every page can be operated by keyboard alone, and the element with keyboard focus is always visibly marked.</li>
          <li>A &ldquo;Skip to main content&rdquo; link is the first thing a keyboard or screen-reader user reaches on every page.</li>
          <li>Text colour is tested against its background so it meets the 4.5:1 contrast ratio, including text set over photographs.</li>
          <li>Form fields have visible labels, and errors are announced rather than shown only as a colour change.</li>
          <li>Images that carry meaning have text alternatives; decorative images are hidden from assistive technology.</li>
          <li>Page structure uses real headings and landmarks, so a screen reader can navigate by section.</li>
          <li>The site reflows to a single column on small screens without horizontal scrolling.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          We would rather name these than imply the site is perfect:
        </p>
        <ul>
          <li>
            Our HELOC calculators are provided by MortgageMate and run inside an
            embedded frame. We do not control that software&rsquo;s
            accessibility. If you have trouble with a calculator, contact us and
            we will walk you through the numbers directly.
          </li>
          <li>
            Some older blog articles use heading levels inconsistently, which
            can make navigating by heading less predictable. We are correcting
            these as we revisit each article.
          </li>
          <li>
            Automated testing catches only part of what matters. We supplement
            it with keyboard testing, and we treat reports from real users as
            the most reliable signal we get.
          </li>
        </ul>

        <h2>Tell us about a barrier</h2>
        <p>
          If any part of this site stops you from doing what you came to do, we
          want to hear about it, and we will help you complete what you were
          trying to do in the meantime.
        </p>
        <ul>
          <li>
            Email <a href="mailto:compliance@heloc360.com">compliance@heloc360.com</a>
          </li>
          <li>
            Post: My Perfect Leads, LLC, 1121 Annapolis Rd #218, Odenton, MD 21113
          </li>
        </ul>
        <p>
          Please tell us the page address and what happened. We aim to
          acknowledge within <strong>2 business days</strong> and to give you a
          plan or a fix within <strong>10 business days</strong>. If a fix will
          take longer, we will say so and offer another way to get what you
          need.
        </p>

        <h2>Assessment</h2>
        <p>
          This statement reflects a review of the site carried out in August
          2026 using automated testing (axe-core), manual keyboard testing, and
          contrast measurement. It is not a formal third-party audit, and we
          will say so plainly here if that changes.
        </p>

        <p>
          See also our <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/cookie-policy">Cookie Policy</Link> and{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </div>
    </article>
  )
}
