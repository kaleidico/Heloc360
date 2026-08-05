import type { Metadata } from "next";
import Link from "next/link";

import DataDisclosure from "@/components/hmda/data-disclosure";
import DataStamp from "@/components/hmda/data-stamp";
import RankingTable from "@/components/hmda/ranking-table";
import SponsoredUnit from "@/components/hmda/sponsored-unit";
import {
	DATA_VINTAGE,
	DATA_YEAR,
	getRankingRows,
	getWebPayload,
} from "@/lib/hmda/data";
import { formatCount, formatUsdCompact } from "@/lib/hmda/format";

const TITLE = `Best HELOC Lenders of 2026, Ranked by Federal Lending Data`;
const DESCRIPTION = `We ranked every HELOC lender that filed with the federal government in ${DATA_YEAR}, using the loan-level data they are legally required to report. No lender can pay for a position.`;
const CANONICAL = "https://heloc360.com/best-heloc-lenders";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: CANONICAL },
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		url: CANONICAL,
		siteName: "HELOC360",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: TITLE,
		description: DESCRIPTION,
	},
};

const DIMENSION_COPY: Record<
	keyof ReturnType<typeof getWebPayload>["meta"]["gate"]["weights"],
	{ label: string; detail: string }
> = {
	scale: {
		label: "Scale",
		detail:
			"How much HELOC business the lender actually wrote, by origination count and dollar volume. A lender that closed 20,000 lines has a demonstrated, repeatable process.",
	},
	reach: {
		label: "Reach",
		detail:
			"How many states the lender lends in, and how evenly. Broad reach means a reader is more likely to be able to use them at all.",
	},
	equityAccess: {
		label: "Equity access",
		detail:
			"How deep into a borrower's equity the lender actually went, measured at the 90th percentile of combined loan-to-value on approved loans. This is observed behavior, not a published maximum.",
	},
	approval: {
		label: "Approval",
		detail:
			"The share of decided applications the lender originated, corrected for lender size. Small lenders pre-qualify before taking a formal application, which inflates a raw approval rate.",
	},
};

export default function BestHelocLendersPage() {
	const { meta } = getWebPayload();
	const rows = getRankingRows();
	const heloc = meta.totals.heloc_subordinate;

	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: TITLE,
		description: DESCRIPTION,
		numberOfItems: rows.length,
		itemListOrder: "https://schema.org/ItemListOrderDescending",
		itemListElement: rows.map((row) => ({
			"@type": "ListItem",
			position: row.rank,
			url: `https://heloc360.com/lenders/${row.slug}`,
			name: row.displayName,
		})),
	};

	return (
		<div className="bg-white">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
			/>

			<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
				{/* Above the fold ------------------------------------------------- */}
				<header>
					<h1 className="text-display-md text-brand-navy sm:text-display-lg">
						{TITLE}
					</h1>

					<p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-700">
						Every other list of the best HELOC lenders is either an affiliate
						payout order or an editor&rsquo;s opinion. This one is computed from
						the {formatCount(meta.rowsScanned)} loan records that lenders filed
						with the federal government for {DATA_YEAR} under the Home Mortgage
						Disclosure Act. We scored{" "}
						{formatCount(meta.lendersWithHeloc)} lenders that wrote home equity
						lines, {meta.qualifiedPool} of which clear the eligibility gate
						below.{" "}
						<strong className="font-semibold text-brand-navy">
							No lender can pay for a position in this ranking.
						</strong>{" "}
						The paid placement on this page sits outside the list, labeled, and
						does not touch the order.
					</p>

					<DataStamp className="mt-5" />
				</header>

				{/* Paid placement, outside and above the organic list --------------- */}
				<SponsoredUnit className="mt-8" />

				{/* The ranking ------------------------------------------------------ */}
				<section className="mt-10" aria-labelledby="ranking-heading">
					<h2 id="ranking-heading" className="sr-only">
						The ranking
					</h2>
					<RankingTable rows={rows} />
				</section>

				{/* Market context --------------------------------------------------- */}
				<section className="mt-12 grid gap-4 sm:grid-cols-3">
					{[
						{
							value: formatCount(heloc.originations),
							label: `HELOCs originated in ${DATA_YEAR}`,
						},
						{
							value: formatUsdCompact(heloc.volumeUsd),
							label: "In total line volume",
						},
						{
							value: formatCount(meta.statesCovered),
							label: "States and territories covered",
						},
					].map((stat) => (
						<div
							key={stat.label}
							className="rounded-xl border border-surface-200 bg-surface-50 p-5"
						>
							<p className="text-display-sm text-brand-navy">{stat.value}</p>
							<p className="mt-1 text-sm text-ink-500">{stat.label}</p>
						</div>
					))}
				</section>

				{/* Scored dimensions ------------------------------------------------ */}
				<section className="mt-12" aria-labelledby="dimensions-heading">
					<h2
						id="dimensions-heading"
						className="text-display-sm text-brand-navy"
					>
						The four scored dimensions
					</h2>
					<p className="mt-2 max-w-3xl text-ink-700">
						Each lender gets a 0 to 100 score on four measures, combined with the
						weights below. Interest rate is deliberately not one of them, for the
						reason given in the disclosure further down.
					</p>

					<div className="mt-6 overflow-x-auto rounded-xl border border-surface-200">
						<table className="w-full min-w-[40rem] border-collapse text-sm">
							<thead>
								<tr className="bg-surface-100 text-left text-xs uppercase tracking-wide text-ink-700">
									<th scope="col" className="px-4 py-3 font-semibold">
										Dimension
									</th>
									<th scope="col" className="px-4 py-3 font-semibold">
										Weight
									</th>
									<th scope="col" className="px-4 py-3 font-semibold">
										What it measures
									</th>
								</tr>
							</thead>
							<tbody>
								{(
									Object.keys(meta.gate.weights) as (keyof typeof DIMENSION_COPY)[]
								).map((key) => (
									<tr key={key} className="border-t border-surface-200">
										<th
											scope="row"
											className="px-4 py-4 text-left font-semibold text-brand-navy"
										>
											{DIMENSION_COPY[key].label}
										</th>
										<td className="px-4 py-4 font-semibold tabular-nums text-brand-navy">
											{Math.round(meta.gate.weights[key] * 100)}%
										</td>
										<td className="px-4 py-4 leading-relaxed text-ink-700">
											{DIMENSION_COPY[key].detail}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* Eligibility gate -------------------------------------------------- */}
				<section
					className="mt-12 rounded-xl border border-surface-200 bg-white p-6 sm:p-8"
					aria-labelledby="gate-heading"
				>
					<h2 id="gate-heading" className="text-display-sm text-brand-navy">
						Who is eligible to be ranked
					</h2>
					<p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
						A lender qualifies for the national ranking only if it lent in at
						least{" "}
						<strong className="font-semibold text-brand-navy">
							{meta.gate.minStates} states
						</strong>{" "}
						and originated at least{" "}
						<strong className="font-semibold text-brand-navy">
							{formatCount(meta.gate.minOriginations)} HELOCs
						</strong>{" "}
						in {DATA_YEAR}. Both conditions, not either. The gate is applied
						before scoring, it is the same for everyone, and it is the only thing
						standing between a lender and this list.
					</p>
					<p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
						That gate excludes strong regional lenders on purpose. A credit union
						operating in four states can be the right answer for a reader in one
						of them and still have no business being called a best national
						lender, so those lenders belong on the state pages instead.
					</p>
				</section>

				{/* Disclosure -------------------------------------------------------- */}
				<DataDisclosure className="mt-12" />

				<p className="mt-8 text-center text-ink-700">
					<Link
						href="/methodology"
						className="font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue-dark"
					>
						Read the full methodology
					</Link>{" "}
					for how the score is computed and how to reproduce it from{" "}
					{DATA_VINTAGE}.
				</p>
			</div>
		</div>
	);
}
