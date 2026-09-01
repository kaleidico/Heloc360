import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { ctaCopy, preQualHref } from '@/lib/blog/cta-context'
import type { UseCase } from '@/lib/pre-qual/use-case'

type Props = {
  useCase: UseCase
  slug: string
}

/**
 * Mid-article prompt. Deliberately quieter than the end-of-article block — the reader is
 * still mid-sentence, so this offers the next step without trying to end the visit.
 */
export function MidArticleCta({ useCase, slug }: Props) {
  const copy = ctaCopy(useCase)

  return (
    <aside className="blog-inline-cta my-10 border-l-4 border-[#1b75bc] bg-[#f2f8fc] px-6 py-5 rounded-r-lg not-prose">
      <div className="text-lg font-semibold text-gray-900 mb-1">{copy.midHeading}</div>
      <div className="text-gray-700 mb-4 leading-relaxed">{copy.midBody}</div>
      <Link
        href={preQualHref(useCase, slug)}
        className="inline-flex items-center gap-2 font-semibold text-[#1b75bc] hover:text-[#12547f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b75bc] transition-colors"
      >
        {copy.action}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </aside>
  )
}

/**
 * End-of-article conversion block. The reader has finished, so this one asks properly.
 */
export function ArticleEndCta({ useCase, slug }: Props) {
  const copy = ctaCopy(useCase)

  return (
    <section className="mt-14 rounded-xl bg-[#1b75bc] px-7 py-9 md:px-10 md:py-11 text-white not-prose">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight text-white">{copy.endHeading}</h2>
      <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-2xl">{copy.endBody}</p>
      <Link
        href={preQualHref(useCase, slug)}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#1b75bc] hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
      >
        {copy.action}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
      <p className="flex items-center gap-2 text-sm text-white/80 mt-5">
        <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
        Checking your options does not affect your credit score.
      </p>
    </section>
  )
}
