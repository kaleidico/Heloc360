import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { getSponsored, isSponsoredReady } from "@/lib/hmda/data";

/**
 * The paid placement (PDR section 7).
 *
 * Three rules govern this component and none of them are cosmetic:
 *
 *  - It renders ABOVE the organic ranking, never inside it, and never reorders
 *    it. The ranking is computed from federal filings and cannot be bought; the
 *    moment an advertiser can move an organic position the methodology page
 *    becomes a false statement.
 *  - It is visually distinct from the ranked rows and does not reuse the ranked
 *    card component, so it cannot be mistaken for rank zero.
 *  - It never renders on a lender profile page. A profile is a single-lender
 *    editorial page and carrying a competitor's ad on it undercuts its authority.
 *    That rule is enforced by not mounting this component there.
 *
 * It also self-blocks until the advertiser's claims are verified. See
 * `isSponsoredReady`.
 */
export default function SponsoredUnit({ className }: { className?: string }) {
	const config = getSponsored();
	if (!isSponsoredReady(config)) return null;

	return (
		<aside
			aria-label="Advertisement"
			className={cn(
				// Deliberately unlike the ranked rows: tinted ground, dashed rule, no rank column.
				"rounded-xl border-2 border-dashed border-brand-maize bg-amber-50/70 p-5 sm:p-6",
				className,
			)}
		>
			<p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-700">
				{config.disclosureShort}
			</p>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0">
					<p className="text-lg font-bold text-brand-navy">
						{config.brand}: {config.headline}
					</p>
					<p className="mt-1 text-sm text-ink-700">{config.body}</p>
					<p className="mt-2 text-sm font-medium text-ink-700">
						{config.brand} also ranks #{config.organicRank} in our data-driven
						list below.
					</p>
				</div>

				<a
					href={config.cta.url}
					rel="sponsored noopener noreferrer"
					target="_blank"
					className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
				>
					{config.cta.label}
					<ExternalLink className="h-4 w-4" aria-hidden="true" />
				</a>
			</div>

			<p className="mt-4 border-t border-amber-200 pt-3 text-xs text-ink-500">
				{config.disclosureLong}
			</p>
		</aside>
	);
}
