import type { Metadata } from "next"
import Link from "next/link"
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  COOKIE_INVENTORY,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_MODE,
} from "@/lib/consent"
import OpenCookiePreferences from "@/components/consent/open-cookie-preferences"

/**
 * The cookie tables below are generated from COOKIE_INVENTORY in
 * lib/consent/index.ts — the same list the consent manager enforces. Adding a
 * vendor there updates this page, so the published policy cannot describe a
 * different set of cookies from the ones actually set.
 */

const LAST_UPDATED = "24 August 2026"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How HELOC360 uses cookies and similar technologies, what each one does, how long it lasts, and how to turn off anything that is not strictly necessary.",
  alternates: { canonical: "/cookie-policy" },
}

export default function CookiePolicyPage() {
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-10">
        <h1 className="text-display-md text-brand-navy mb-3">Cookie Policy</h1>
        <p className="text-sm text-ink-500">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-ink-700 leading-relaxed">
          This policy explains how HELOC360, a service of My Perfect Leads, LLC,
          uses cookies and similar technologies on{" "}
          <strong>heloc360.com</strong>. It lists every cookie we set, what each
          one is for, how long it lasts, and how to switch off anything that is
          not strictly necessary.
        </p>

        <div className="not-prose my-8 rounded-lg border-2 border-brand-blue bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-brand-navy mb-2">
            Change your choices
          </h2>
          <p className="text-ink-700 mb-4 leading-relaxed">
            You can review or change which cookies we may use at any time. Your
            choice is remembered for {CONSENT_MAX_AGE_DAYS} days, after which we
            will ask again.
          </p>
          <OpenCookiePreferences />
        </div>

        <h2>What a cookie is</h2>
        <p>
          A cookie is a small text file a website asks your browser to store. It
          lets the site recognise your browser on a later page or a later visit.
          This policy also covers similar technologies that do the same job,
          including browser <em>local storage</em> and tracking pixels.
        </p>
        <p>
          A <strong>first-party</strong> cookie is set by heloc360.com. A{" "}
          <strong>third-party</strong> cookie is set by another company whose
          service we use, such as Google. Third parties handle the data they
          collect under their own privacy policies, which we link to below.
        </p>

        <h2>Your choices</h2>
        <p>
          {CONSENT_MODE === "opt-in" ? (
            <>
              When you first visit, we ask before using any cookie that is not
              strictly necessary. Until you agree, <strong>only</strong> the
              strictly necessary cookies listed below are used. Analytics,
              advertising and fraud-prevention technologies stay switched off.
            </>
          ) : (
            <>
              We use the cookies listed below when you arrive, and you can
              switch off any category that is not strictly necessary at any
              time. Turning a category off stops those technologies from loading
              and removes the cookies we are able to remove.
            </>
          )}
        </p>
        <p>
          Declining is as easy as agreeing: &ldquo;Reject all&rdquo; is offered
          alongside &ldquo;Accept all&rdquo; in the same place and at the same
          size. Refusing optional cookies does not limit any part of this site.
        </p>

        <h2>Cookies we use</h2>
      </div>

      {/* Per-category tables, generated from the consent manager's inventory. */}
      <div className="not-prose space-y-10 my-8">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category]
          const rows = COOKIE_INVENTORY.filter((c) => c.category === category)
          return (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <h3
                id={`cat-${category}`}
                className="text-xl font-bold text-brand-navy mb-1"
              >
                {meta.label}
                {meta.required ? (
                  <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide bg-surface-200 text-ink-700 px-2 py-1 rounded">
                    Always on
                  </span>
                ) : (
                  <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide bg-brand-green text-white px-2 py-1 rounded">
                    Optional
                  </span>
                )}
              </h3>
              <p className="text-ink-700 mb-4 leading-relaxed">{meta.summary}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <caption className="sr-only">
                    {meta.label} cookies used by heloc360.com
                  </caption>
                  <thead>
                    <tr className="bg-surface-100 text-left">
                      <th scope="col" className="p-3 font-semibold text-brand-navy border border-surface-200">
                        Name
                      </th>
                      <th scope="col" className="p-3 font-semibold text-brand-navy border border-surface-200">
                        Provider
                      </th>
                      <th scope="col" className="p-3 font-semibold text-brand-navy border border-surface-200">
                        Purpose
                      </th>
                      <th scope="col" className="p-3 font-semibold text-brand-navy border border-surface-200">
                        Type
                      </th>
                      <th scope="col" className="p-3 font-semibold text-brand-navy border border-surface-200">
                        Expires
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.name} className="align-top">
                        <th
                          scope="row"
                          className="p-3 font-mono text-xs font-semibold text-ink-900 border border-surface-200 text-left"
                        >
                          {row.name}
                        </th>
                        <td className="p-3 text-ink-700 border border-surface-200">
                          {row.provider}
                        </td>
                        <td className="p-3 text-ink-700 border border-surface-200">
                          {row.purpose}
                        </td>
                        <td className="p-3 text-ink-700 border border-surface-200">
                          {row.type}
                        </td>
                        <td className="p-3 text-ink-700 border border-surface-200 whitespace-nowrap">
                          {row.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}
      </div>

      <div className="prose prose-slate max-w-none">
        <h2>Third parties named above</h2>
        <ul>
          <li>
            <strong>Google</strong> (Analytics, Tag Manager, reCAPTCHA) —{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </a>
          </li>
          <li>
            <strong>Fraud Blocker</strong> —{" "}
            <a
              href="https://fraudblocker.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fraud Blocker Privacy Policy
            </a>
          </li>
        </ul>

        <h2>Controlling cookies in your browser</h2>
        <p>
          Alongside the controls on this site, every major browser lets you
          block or delete cookies in its settings, usually under
          &ldquo;Privacy&rdquo;. Blocking all cookies will stop the strictly
          necessary ones too, which means this site cannot remember that you
          declined and will ask again on each visit.
        </p>
        <p>
          Most browsers also offer a &ldquo;Do Not Track&rdquo; signal. There is
          no agreed standard for how sites should respond to it, so we do not
          rely on it. Use the controls on this page instead, which we do act on.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we add or remove a technology, we update the tables above and the
          date at the top. Where a change means we would use your information
          in a materially different way, we ask for your choice again rather
          than assuming the previous answer still applies.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy, or about the personal information we
          hold, can go to{" "}
          <a href="mailto:compliance@heloc360.com">compliance@heloc360.com</a>,
          or by post to My Perfect Leads, LLC, 1121 Annapolis Rd #218, Odenton,
          MD 21113.
        </p>
        <p>
          See also our{" "}
          <Link href="/privacy">Privacy Policy</Link>, which covers the
          information we collect when you submit an enquiry, and our{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </div>
    </article>
  )
}
