import type { Metadata } from "next"
import { PreQualForm } from "@/components/pre-qual/pre-qual-form"
import { StickyCtaSuppress } from "@/components/pre-qual/sticky-cta-suppress"

export const metadata: Metadata = {
  title: "Talk to a HELOC advisor — free, no obligation",
  description:
    "Two-step pre-qual: tell us about your home, see a rough borrowing estimate, then a licensed advisor walks you through the trade-offs. No credit pull.",
  alternates: { canonical: "/pre-qual" },
}

export default function PreQualPage() {
  return (
    <main className="bg-surface-50 min-h-[80vh]">
      <StickyCtaSuppress />
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue mb-2">
              The HELOC advisor
            </p>
            <h1 className="text-display-lg text-ink-900">
              See what your home equity can do — in under a minute.
            </h1>
            <p className="text-base text-ink-700 mt-3">
              Three quick questions about your home. We'll show you a rough borrowing
              estimate, then a licensed advisor (not a sales rep) calls you to walk
              through the trade-offs.
            </p>
          </header>
          <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 lg:p-8">
            <PreQualForm useCase="universal" />
          </div>
        </div>
      </div>
    </main>
  )
}
