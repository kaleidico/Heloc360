import { cn } from "@/lib/utils";
import {
	approvalBarWidthFromCounts,
	formatApprovalRateFromCounts,
	formatCount,
} from "@/lib/hmda/format";
import { DATA_YEAR } from "@/lib/hmda/data";
import type { ApprovalBand } from "@/types/hmda";

/**
 * Approval rate by band (PDR section 9.1, item 3).
 *
 * Every row carries the sample it rests on, because a rate without an n is a
 * claim rather than a measurement, and a thin band is exactly where a reader
 * would otherwise be misled.
 *
 * The copy here is load-bearing and compliance-critical. These are historical
 * rates for applications that resembled a profile, never a prediction about the
 * reader and never anything resembling a preapproval. The percentage is capped
 * below 100% for the same reason (PDR section 6.4).
 */
export default function ApprovalBandTable({
	title,
	description,
	bands,
	unitLabel,
	lenderName,
}: {
	title: string;
	description: string;
	bands: ApprovalBand[];
	unitLabel: string;
	lenderName: string;
}) {
	const rows = bands.filter((band) => band.n > 0);
	if (rows.length === 0) return null;

	return (
		<div className="rounded-xl border border-surface-200 bg-white p-5 sm:p-6">
			<h3 className="font-semibold text-brand-navy">{title}</h3>
			<p className="mt-1 text-sm text-ink-500">{description}</p>

			<table className="mt-4 w-full border-collapse text-sm">
				<caption className="sr-only">
					{lenderName} {DATA_YEAR} approval rate by {unitLabel}, with the number
					of decided applications behind each rate.
				</caption>
				<thead>
					<tr className="text-left text-xs uppercase tracking-wide text-ink-500">
						<th scope="col" className="pb-2 font-semibold">
							{unitLabel}
						</th>
						<th scope="col" className="pb-2 font-semibold">
							Approved
						</th>
						<th scope="col" className="pb-2 text-right font-semibold">
							Applications
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((band) => {
						// Derived from the counts, never from the stored (pre-rounded) rate.
						const width = approvalBarWidthFromCounts(band.approved, band.n);
						// Bands under a few hundred applications are reported, but flagged:
						// the rate is real and the confidence in it is not the same.
						const thin = band.n < 100;
						return (
							<tr key={band.band} className="border-t border-surface-200">
								<th
									scope="row"
									className="py-3 pr-3 text-left font-medium tabular-nums text-brand-navy"
								>
									{band.band}
								</th>
								<td className="py-3 pr-3">
									<div className="flex items-center gap-2">
										<span className="w-10 shrink-0 font-semibold tabular-nums text-brand-navy">
											{formatApprovalRateFromCounts(band.approved, band.n)}
										</span>
										<span
											className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-200"
											aria-hidden="true"
										>
											<span
												className={cn(
													"block h-full rounded-full",
													thin ? "bg-ink-400" : "bg-brand-mint",
												)}
												style={{ width: `${width}%` }}
											/>
										</span>
									</div>
								</td>
								<td className="py-3 text-right tabular-nums text-ink-500">
									{formatCount(band.n)}
									{thin && (
										<span className="ml-1 text-xs text-ink-400">(thin)</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
