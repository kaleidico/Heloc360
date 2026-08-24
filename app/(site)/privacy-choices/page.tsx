import type { Metadata } from "next"
import Link from "next/link"
import PrivacyRequestForm from "@/components/privacy-request-form"

export const metadata: Metadata = {
  title: "Your Privacy Choices",
  description:
    "Tell HELOC360 not to sell or share your personal information, ask what we hold about you, or have it deleted or corrected.",
  alternates: { canonical: "/privacy-choices" },
}

export default function PrivacyChoicesPage() {
  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-display-md text-brand-navy mb-3">
          Your Privacy Choices
        </h1>
        <p className="text-lg text-ink-700 leading-relaxed">
          Use this page to tell us not to sell or share your personal
          information, to ask what we hold about you, or to have it deleted or
          corrected. You do not need an account, and it costs nothing.
        </p>
      </header>

      <section
        aria-labelledby="what-we-share"
        className="mb-8 rounded-lg border border-surface-200 bg-surface-50 p-5"
      >
        <h2 id="what-we-share" className="text-lg font-bold text-brand-navy mb-2">
          What we share, in plain terms
        </h2>
        <p className="text-ink-700 leading-relaxed">
          HELOC360 is a lead-generation service. When you submit the pre-qual
          form, we pass the details you gave us to our lender partners so they
          can contact you about a HELOC. Under California law that counts as
          &ldquo;selling or sharing&rdquo; personal information, whether or not
          money changes hands. We also use analytics and advertising
          technologies described in our{" "}
          <Link href="/cookie-policy" className="text-brand-blue-dark underline">
            Cookie Policy
          </Link>
          .
        </p>
      </section>

      <PrivacyRequestForm />

      <section aria-labelledby="rights" className="mt-10 prose prose-slate max-w-none">
        <h2 id="rights">Your rights</h2>
        <p>
          Depending on where you live, you may have the right to know what
          personal information we collect and who we disclose it to, to have it
          deleted, to have inaccurate information corrected, to opt out of its
          sale or sharing, and not to be treated differently for exercising any
          of these rights. These rights are given by the California Consumer
          Privacy Act as amended by the CPRA, and by comparable laws including
          the Maryland Online Data Privacy Act, which applies to us as a
          Maryland company.
        </p>

        <h2>How long we take</h2>
        <p>
          We confirm a request within <strong>10 business days</strong> and
          complete it within <strong>45 days</strong>. If a request is complex we
          may extend once by a further 45 days, and we will tell you why before
          we do.
        </p>

        <h2>Verifying who you are</h2>
        <p>
          To protect your information we have to be reasonably sure a request
          comes from you. Usually matching the email address we already hold is
          enough. For a deletion request we may ask one further question about
          information you previously gave us. We never ask for a Social Security
          number, a password, or payment details to verify a request, and you
          should treat any message that does as fraudulent.
        </p>

        <h2>Browser signals</h2>
        <p>
          We honour the Global Privacy Control (GPC) signal where your browser
          sends one, treating it as an opt-out of the sale or sharing of your
          personal information for that browser. Because it is a per-browser
          setting, use the form above as well if you want the opt-out recorded
          against your details.
        </p>

        <h2>Other ways to reach us</h2>
        <p>
          Email <a href="mailto:compliance@heloc360.com">compliance@heloc360.com</a>,
          or write to My Perfect Leads, LLC, 1121 Annapolis Rd #218, Odenton, MD
          21113.
        </p>
        <p>
          See also our <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/cookie-policy">Cookie Policy</Link> and{" "}
          <Link href="/communication-consent">Communication Consent</Link>.
        </p>
      </section>
    </article>
  )
}
