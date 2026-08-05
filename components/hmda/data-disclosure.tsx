import Link from "next/link";

import { cn } from "@/lib/utils";
import { DATA_YEAR } from "@/lib/hmda/data";

/**
 * "What this data cannot tell you."
 *
 * Carried in full on every data-bearing page and never truncated or collapsed
 * behind a toggle (PDR section 5). It mirrors the "What we do not measure"
 * section of the published methodology. If that document changes, change this
 * with it.
 *
 * The point of the section is that it is the honest half of the claim: a ranking
 * this specific is only credible if it is equally specific about its blind spots.
 */

const EXCLUSIONS: { term: string; detail: string }[] = [
	{
		term: "Interest rate is excluded from the score",
		detail:
			"HMDA records the initial rate on an open-end line. A HELOC is a variable product, so a lender running a six-month teaser shows a lower rate here than one quoting fully indexed, with no adjustment for margin or index. We report the median initial rate as context and label it as such. We never rank on it.",
	},
	{
		term: "Fees, closing costs, and annual charges",
		detail: "Not present in HMDA at any useful granularity.",
	},
	{
		term: "Customer service, servicing quality, and funding speed",
		detail: "Not present in HMDA at all.",
	},
	{
		term: "Credit score",
		detail:
			"HMDA carries a scoring model code, not a FICO. There is no credit-quality field in this data, and any list claiming a HMDA-derived minimum credit score is fabricating it.",
	},
	{
		term: "Lenders below the reporting threshold",
		detail:
			"Institutions that do not meet the HMDA filing threshold do not appear here. For consumer HELOC that is a small share of the market, but it is not zero.",
	},
	{
		term: "Current-year terms",
		detail: `This is ${DATA_YEAR} filed data. A lender's 2026 program may differ.`,
	},
];

export default function DataDisclosure({
	className,
	lenderName,
}: {
	className?: string;
	/** When set, the closing line is scoped to a single lender's profile page. */
	lenderName?: string;
}) {
	return (
		<section
			aria-labelledby="data-disclosure-heading"
			className={cn(
				"rounded-xl border border-surface-200 bg-surface-50 p-6 sm:p-8",
				className,
			)}
		>
			<h2
				id="data-disclosure-heading"
				className="text-display-sm text-brand-navy"
			>
				What this data cannot tell you
			</h2>
			<p className="mt-2 text-ink-700">
				Everything on this page comes from federal filings. That makes it
				verifiable, and it also makes it incomplete in specific ways worth
				stating plainly.
			</p>

			<dl className="mt-6 space-y-4">
				{EXCLUSIONS.map((item) => (
					<div key={item.term}>
						<dt className="font-semibold text-brand-navy">{item.term}</dt>
						<dd className="mt-1 text-sm leading-relaxed text-ink-700">
							{item.detail}
						</dd>
					</div>
				))}
			</dl>

			<p className="mt-6 border-t border-surface-200 pt-4 text-sm leading-relaxed text-ink-700">
				{lenderName ? (
					<>
						Because of those exclusions, this page describes what {lenderName}{" "}
						actually did in {DATA_YEAR}. It is not a claim about what they will
						offer you, and it is not a recommendation.
					</>
				) : (
					<>
						Because of those exclusions, the ranking is best read as most capable
						and most accessible by {DATA_YEAR} lending record. It is not a claim
						that the top-ranked lender will give any individual reader the best
						deal.
					</>
				)}{" "}
				<Link
					href="/methodology"
					className="font-medium text-brand-blue underline underline-offset-2 hover:text-brand-blue-dark"
				>
					Read the full methodology
				</Link>
				.
			</p>
		</section>
	);
}
