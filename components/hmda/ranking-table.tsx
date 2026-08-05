import Link from "next/link";

import { LenderTypeChip, MembershipChip } from "@/components/hmda/lender-chips";
import {
	formatCltv,
	formatCount,
	formatInitialRate,
	formatPercent,
	formatScore,
	formatUsd,
} from "@/lib/hmda/format";
import { DATA_YEAR } from "@/lib/hmda/data";
import type { RankedLender } from "@/types/hmda";

type Row = RankedLender & { displayName: string };

/**
 * The ranked list (PDR section 5).
 *
 * Deliberately not sortable. The columns include the median INITIAL rate on a
 * variable line, and a sortable "lowest rate" would put a six-month teaser above
 * a fully-indexed quote and mislead every reader who used it. Ranking order is
 * the computed composite score and nothing else reorders it.
 */
export default function RankingTable({ rows }: { rows: Row[] }) {
	return (
		<div>
			<p className="mb-2 text-sm text-ink-500 lg:hidden">
				Scroll the table sideways to see every column.
			</p>

			<div className="overflow-x-auto rounded-xl border border-surface-200">
				<table className="w-full min-w-[64rem] border-collapse text-sm">
					<caption className="sr-only">
						All {rows.length} nationally qualified HELOC lenders, ranked by
						composite score computed from {DATA_YEAR} federal HMDA filings.
					</caption>
					<thead>
						<tr className="bg-surface-100 text-left text-xs uppercase tracking-wide text-ink-700">
							<th scope="col" className="px-3 py-3 font-semibold">
								Rank
							</th>
							<th scope="col" className="px-3 py-3 font-semibold">
								Lender
							</th>
							<th scope="col" className="px-3 py-3 font-semibold">
								Score
							</th>
							<th scope="col" className="px-3 py-3 text-right font-semibold">
								{DATA_YEAR} HELOCs
							</th>
							<th scope="col" className="px-3 py-3 text-right font-semibold">
								States
							</th>
							<th scope="col" className="px-3 py-3 text-right font-semibold">
								Max CLTV
							</th>
							<th scope="col" className="px-3 py-3 text-right font-semibold">
								Denial rate
							</th>
							<th scope="col" className="px-3 py-3 text-right font-semibold">
								Median line
							</th>
							<th scope="col" className="px-3 py-3 text-right font-semibold">
								Median initial rate
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr
								key={row.slug}
								className="border-t border-surface-200 align-top even:bg-surface-50/60"
							>
								<td className="px-3 py-4 font-bold tabular-nums text-brand-navy">
									{row.rank}
								</td>

								<td className="px-3 py-4">
									<Link
										href={`/lenders/${row.slug}`}
										className="font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue-dark"
									>
										{row.displayName}
									</Link>
									<div className="mt-1.5 flex flex-wrap gap-1.5">
										<LenderTypeChip type={row.type} />
										<MembershipChip
											membershipRequired={row.membershipRequired}
										/>
									</div>
								</td>

								<td className="px-3 py-4">
									<div className="flex items-center gap-2">
										<span className="w-10 shrink-0 font-semibold tabular-nums text-brand-navy">
											{formatScore(row.score)}
										</span>
										<span
											className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-200 sm:block"
											aria-hidden="true"
										>
											<span
												className="block h-full rounded-full bg-brand-mint"
												style={{
													width: `${Math.max(0, Math.min(100, row.score))}%`,
												}}
											/>
										</span>
									</div>
								</td>

								<td className="px-3 py-4 text-right tabular-nums text-ink-700">
									{formatCount(row.originations)}
								</td>
								<td className="px-3 py-4 text-right tabular-nums text-ink-700">
									{formatCount(row.states)}
								</td>
								<td className="px-3 py-4 text-right tabular-nums text-ink-700">
									{formatCltv(row.p90Cltv)}
								</td>
								<td className="px-3 py-4 text-right tabular-nums text-ink-700">
									{formatPercent(row.denialRate)}
								</td>
								<td className="px-3 py-4 text-right tabular-nums text-ink-700">
									{formatUsd(row.medianLineUsd, row.medianLineAtCap)}
								</td>
								<td className="px-3 py-4 text-right tabular-nums text-ink-700">
									{formatInitialRate(row.medianRate)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="mt-3 text-xs leading-relaxed text-ink-500">
				Max CLTV is the 90th percentile combined loan-to-value actually reached
				on approved {DATA_YEAR} originations, not a published program maximum.
				Median initial rate is the starting rate on a variable line as filed. It
				is not an APR, it is not the rate a borrower keeps, and the table is not
				sortable by it.
			</p>
		</div>
	);
}
