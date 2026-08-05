import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ApprovalBandTable from "@/components/hmda/approval-band-table";
import DataDisclosure from "@/components/hmda/data-disclosure";
import DataStamp from "@/components/hmda/data-stamp";
import { LenderTypeChip, MembershipChip } from "@/components/hmda/lender-chips";
import {
	DATA_YEAR,
	getLenderProfile,
	getLenderProfilesMeta,
	getLenderSlugs,
	resolveDisplayName,
} from "@/lib/hmda/data";
import {
	compareToPool,
	formatApprovalPercent,
	formatCltv,
	formatCount,
	formatInitialRate,
	formatPercent,
	formatUsd,
	formatUsdCompact,
	NOT_REPORTED,
} from "@/lib/hmda/format";
import type { LenderProfile } from "@/types/hmda";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
	return getLenderSlugs().map((slug) => ({ slug }));
}

/** Nothing outside the generated set exists; the route is fully static. */
export const dynamicParams = false;

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const { slug } = await params;
	const profile = getLenderProfile(slug);
	if (!profile) return {};

	const canonical = `https://heloc360.com/lenders/${profile.slug}`;
	return {
		title: profile.seo.title,
		description: profile.seo.description,
		alternates: { canonical },
		openGraph: {
			title: profile.seo.title,
			description: profile.seo.description,
			url: canonical,
			siteName: "HELOC360",
			type: "article",
		},
		twitter: {
			card: "summary_large_image",
			title: profile.seo.title,
			description: profile.seo.description,
		},
	};
}

/**
 * The first-lien versus second-lien split, in words at the extremes.
 *
 * Some lenders wrote nothing but subordinate liens, which is a true 100%. It is
 * still not rendered as "100%": the surrounding tiles are rates and shares, a
 * bare 100% next to them reads as a probability, and PDR section 13 rules the
 * figure out on sight. Saying "All second lien" is both accurate and clearer.
 */
function describeLienMix(firstLien: number, subLien: number): string {
	const total = firstLien + subLien;
	if (total <= 0) return NOT_REPORTED;
	if (firstLien === 0) return "All second lien";
	if (subLien === 0) return "All first lien";
	return formatPercent(subLien / total);
}

function StatTile({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-surface-200 bg-white p-4">
			<dt className="text-xs uppercase tracking-wide text-ink-500">{label}</dt>
			<dd className="mt-1 text-xl font-bold tabular-nums text-brand-navy">
				{value}
			</dd>
		</div>
	);
}

function buildSchema(profile: LenderProfile, displayName: string) {
	const canonical = `https://heloc360.com/lenders/${profile.slug}`;

	const organization = {
		"@context": "https://schema.org",
		"@type": "FinancialService",
		name: displayName,
		url: canonical,
		identifier: { "@type": "PropertyValue", name: "LEI", value: profile.lei },
		areaServed: profile.states.map((state) => ({
			"@type": "State",
			name: state.name,
		})),
		serviceType: "Home Equity Line of Credit",
	};

	const faq = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: profile.faq.map((entry) => ({
			"@type": "Question",
			name: entry.q,
			acceptedAnswer: { "@type": "Answer", text: entry.a },
		})),
	};

	const breadcrumbs = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://heloc360.com/",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Best HELOC lenders",
				item: "https://heloc360.com/best-heloc-lenders",
			},
			{ "@type": "ListItem", position: 3, name: displayName, item: canonical },
		],
	};

	return [organization, faq, breadcrumbs];
}

export default async function LenderProfilePage({
	params,
}: {
	params: Promise<Params>;
}) {
	const { slug } = await params;
	const profile = getLenderProfile(slug);
	if (!profile) notFound();

	const displayName = resolveDisplayName(profile);
	const pool = getLenderProfilesMeta().poolMedians;
	const glance = profile.atAGlance;
	const borrower = profile.borrower;

	const comparisons: {
		label: string;
		lender: string;
		poolValue: string;
		direction: ReturnType<typeof compareToPool>;
		betterWord: string;
		worseWord: string;
	}[] = [
		{
			label: "Composite score",
			lender: profile.score.toFixed(1),
			poolValue: pool.score.toFixed(1),
			direction: compareToPool(profile.score, pool.score, true),
			betterWord: "Higher than the pool median",
			worseWord: "Lower than the pool median",
		},
		{
			label: `${DATA_YEAR} HELOC originations`,
			lender: formatCount(glance.originations),
			poolValue: formatCount(pool.originations),
			direction: compareToPool(glance.originations, pool.originations, true),
			betterWord: "Writes more than the median qualifier",
			worseWord: "Writes less than the median qualifier",
		},
		{
			label: "Equity reached (90th percentile CLTV)",
			lender: formatCltv(glance.p90Cltv),
			poolValue: formatCltv(pool.p90Cltv),
			direction: compareToPool(glance.p90Cltv, pool.p90Cltv, true),
			betterWord: "Lends deeper into equity than the median",
			worseWord: "Lends less deep into equity than the median",
		},
		{
			label: "Denial rate",
			lender: formatPercent(glance.denialRate),
			poolValue: formatPercent(pool.denialRate),
			direction: compareToPool(glance.denialRate, pool.denialRate, false),
			betterWord: "Denies less often than the median",
			worseWord: "Denies more often than the median",
		},
		{
			label: "Median line size",
			lender: formatUsd(glance.medianLineUsd, glance.medianLineAtCap),
			poolValue: formatUsd(pool.medianLineUsd),
			direction: compareToPool(glance.medianLineUsd, pool.medianLineUsd, true),
			betterWord: "Writes larger lines than the median",
			worseWord: "Writes smaller lines than the median",
		},
	];

	return (
		<div className="bg-surface-50">
			{buildSchema(profile, displayName).map((schema, index) => (
				<script
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			))}

			<div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
				{/* 1. Header. No sponsored unit here, ever (PDR section 7.2). ------- */}
				<nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
					<Link href="/best-heloc-lenders" className="hover:text-brand-blue">
						Best HELOC lenders
					</Link>
					<span className="mx-2" aria-hidden="true">
						/
					</span>
					<span className="text-ink-700">{displayName}</span>
				</nav>

				<header className="rounded-xl border border-surface-200 bg-white p-6 sm:p-8">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="min-w-0">
							<h1 className="text-display-md text-brand-navy">
								{displayName} HELOC Review
							</h1>
							<div className="mt-3 flex flex-wrap gap-2">
								<LenderTypeChip type={profile.type} />
								<MembershipChip
									membershipRequired={profile.membershipRequired}
								/>
							</div>
						</div>

						<div className="rounded-xl bg-brand-navy px-5 py-4 text-center text-white">
							<p className="text-xs uppercase tracking-wide text-white/70">
								National rank
							</p>
							<p className="text-3xl font-bold tabular-nums">#{profile.rank}</p>
							<p className="mt-1 text-xs text-white/70">
								Score {profile.score.toFixed(1)} of 100
							</p>
						</div>
					</div>

					<p className="mt-5 leading-relaxed text-ink-700">
						{profile.seo.description}
					</p>

					<DataStamp className="mt-5" />
				</header>

				{/* 2. At a glance --------------------------------------------------- */}
				<section className="mt-10" aria-labelledby="at-a-glance">
					<h2 id="at-a-glance" className="text-display-sm text-brand-navy">
						At a glance
					</h2>
					<p className="mt-2 text-ink-700">
						What {displayName} actually did in {DATA_YEAR}, as filed.
					</p>
					<dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
						<StatTile
							label={`${DATA_YEAR} HELOCs`}
							value={formatCount(glance.originations)}
						/>
						<StatTile
							label="Total volume"
							value={formatUsdCompact(glance.volumeUsd)}
						/>
						<StatTile
							label="States lent in"
							value={formatCount(glance.stateCount)}
						/>
						<StatTile
							label="Max CLTV reached"
							value={formatCltv(glance.p90Cltv)}
						/>
						<StatTile
							label="Median line"
							value={formatUsd(glance.medianLineUsd, glance.medianLineAtCap)}
						/>
						<StatTile
							label="Denial rate"
							value={formatPercent(glance.denialRate)}
						/>
						<StatTile
							label="Median initial rate"
							value={formatInitialRate(glance.medianInitialRate)}
						/>
						<StatTile
							label="Approved with DTI over 43%"
							value={formatPercent(glance.dtiOver43Share)}
						/>
					</dl>
					<p className="mt-3 text-xs leading-relaxed text-ink-500">
						Median initial rate is the starting rate on a variable line as filed.
						It is not an APR and not the rate a borrower keeps. Max CLTV is the
						90th percentile combined loan-to-value actually reached on approved
						loans, not a published program maximum.
					</p>
				</section>

				{/* 3. Will they approve me? ----------------------------------------- */}
				<section className="mt-12" aria-labelledby="approval">
					<h2 id="approval" className="text-display-sm text-brand-navy">
						Will they approve me?
					</h2>
					<p className="mt-2 max-w-3xl leading-relaxed text-ink-700">
						These are the shares of {DATA_YEAR} applications that {displayName}{" "}
						actually originated, broken out by how much equity the borrower was
						tapping and how much debt they already carried.
					</p>

					<p className="mt-4 rounded-lg border-l-4 border-brand-maize bg-amber-50 p-4 text-sm leading-relaxed text-ink-700">
						This is a likelihood, not a preapproval. Each percentage is the share
						of {DATA_YEAR} HMDA applications resembling a profile that the lender
						actually originated. It is historical fact about other people, not a
						decision about you, and no lender has seen your application.
					</p>

					<div className="mt-5 grid gap-4 lg:grid-cols-2">
						<ApprovalBandTable
							title="By combined loan-to-value"
							description="How much of the home's value the borrower was borrowing against, first mortgage included."
							bands={profile.approvalByCltv}
							unitLabel="CLTV band"
							lenderName={displayName}
						/>
						<ApprovalBandTable
							title="By debt-to-income"
							description="The borrower's total monthly debt payments as a share of gross monthly income."
							bands={profile.approvalByDti}
							unitLabel="DTI band"
							lenderName={displayName}
						/>
					</div>
				</section>

				{/* 4. What they decline for ------------------------------------------ */}
				{profile.denialMix.length > 0 && (
					<section className="mt-12" aria-labelledby="denials">
						<h2 id="denials" className="text-display-sm text-brand-navy">
							What they decline for
						</h2>
						<p className="mt-2 max-w-3xl leading-relaxed text-ink-700">
							The reasons {displayName} gave on{" "}
							{formatCount(profile.denialSample)} declined {DATA_YEAR}{" "}
							applications. Lenders may report more than one reason, so these do
							not sum to 100%.
						</p>

						<ul className="mt-5 space-y-3 rounded-xl border border-surface-200 bg-white p-5 sm:p-6">
							{profile.denialMix.map((reason) => (
								<li key={reason.reason}>
									<div className="flex items-baseline justify-between gap-3">
										<span className="font-medium text-brand-navy">
											{reason.reason}
										</span>
										<span className="shrink-0 font-semibold tabular-nums text-ink-700">
											{formatPercent(reason.share)}
										</span>
									</div>
									<span
										className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-surface-200"
										aria-hidden="true"
									>
										<span
											className="block h-full rounded-full bg-brand-blue"
											style={{
												width: `${Math.min(100, Math.round(reason.share * 100))}%`,
											}}
										/>
									</span>
								</li>
							))}
						</ul>
					</section>
				)}

				{/* 5. Who gets approved ---------------------------------------------- */}
				<section className="mt-12" aria-labelledby="borrowers">
					<h2 id="borrowers" className="text-display-sm text-brand-navy">
						Who gets approved
					</h2>
					<p className="mt-2 max-w-3xl leading-relaxed text-ink-700">
						The borrowers {displayName} actually approved in {DATA_YEAR}. These
						describe who was approved, not who is eligible.
					</p>

					<dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
						<StatTile
							label="Median income"
							value={formatUsd(borrower.incomeMedian)}
						/>
						<StatTile
							label="Middle half of incomes"
							value={
								borrower.incomeP25 !== null && borrower.incomeP75 !== null
									? `${formatUsd(borrower.incomeP25)} to ${formatUsd(borrower.incomeP75)}`
									: NOT_REPORTED
							}
						/>
						<StatTile
							label="Median property value"
							value={formatUsd(borrower.propertyValueMedian)}
						/>
						<StatTile
							label="Second-lien share"
							value={describeLienMix(borrower.firstLien, borrower.subLien)}
						/>
					</dl>

					{borrower.purposeMix.length > 0 && (
						<div className="mt-5 rounded-xl border border-surface-200 bg-white p-5 sm:p-6">
							<h3 className="font-semibold text-brand-navy">
								What the money was for
							</h3>
							<ul className="mt-3 space-y-2 text-sm">
								{borrower.purposeMix.map((purpose) => (
									<li
										key={purpose.purpose}
										className="flex items-baseline justify-between gap-3 border-b border-surface-200 pb-2 last:border-0 last:pb-0"
									>
										<span className="text-ink-700">{purpose.purpose}</span>
										<span className="shrink-0 font-semibold tabular-nums text-brand-navy">
											{formatPercent(purpose.share)}
										</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</section>

				{/* 6. Where they lend ------------------------------------------------- */}
				<section className="mt-12" aria-labelledby="states">
					<h2 id="states" className="text-display-sm text-brand-navy">
						Where they lend
					</h2>
					<p className="mt-2 leading-relaxed text-ink-700">
						{displayName} originated HELOCs in{" "}
						{formatCount(profile.states.length)} states and territories in{" "}
						{DATA_YEAR}.
					</p>
					<ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
						{profile.states.map((state) => (
							<li
								key={state.code}
								className="flex items-baseline justify-between gap-2 border-b border-surface-200 pb-1"
							>
								<span className="text-ink-700">{state.name}</span>
								<span className="shrink-0 tabular-nums text-ink-500">
									{formatCount(state.originations)}
								</span>
							</li>
						))}
					</ul>
				</section>

				{/* 7. How they compare ------------------------------------------------ */}
				<section className="mt-12" aria-labelledby="compare">
					<h2 id="compare" className="text-display-sm text-brand-navy">
						How they compare
					</h2>
					<p className="mt-2 max-w-3xl leading-relaxed text-ink-700">
						{displayName} measured against the median of the{" "}
						{getLenderProfilesMeta().profiles} lenders that clear the national
						eligibility gate.
					</p>

					<div className="mt-5 overflow-x-auto rounded-xl border border-surface-200 bg-white">
						<table className="w-full min-w-[36rem] border-collapse text-sm">
							<thead>
								<tr className="bg-surface-100 text-left text-xs uppercase tracking-wide text-ink-700">
									<th scope="col" className="px-4 py-3 font-semibold">
										Measure
									</th>
									<th scope="col" className="px-4 py-3 text-right font-semibold">
										{displayName}
									</th>
									<th scope="col" className="px-4 py-3 text-right font-semibold">
										Pool median
									</th>
									<th scope="col" className="px-4 py-3 font-semibold">
										Read
									</th>
								</tr>
							</thead>
							<tbody>
								{comparisons.map((row) => (
									<tr key={row.label} className="border-t border-surface-200">
										<th
											scope="row"
											className="px-4 py-3 text-left font-medium text-brand-navy"
										>
											{row.label}
										</th>
										<td className="px-4 py-3 text-right font-semibold tabular-nums text-brand-navy">
											{row.lender}
										</td>
										<td className="px-4 py-3 text-right tabular-nums text-ink-500">
											{row.poolValue}
										</td>
										<td className="px-4 py-3 text-ink-700">
											{row.direction === "above" && row.betterWord}
											{row.direction === "below" && row.worseWord}
											{row.direction === "even" && "In line with the median"}
											{row.direction === "unknown" && NOT_REPORTED}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* 8. FAQ -------------------------------------------------------------- */}
				<section className="mt-12" aria-labelledby="faq">
					<h2 id="faq" className="text-display-sm text-brand-navy">
						Common questions about {displayName}
					</h2>
					<dl className="mt-5 space-y-4">
						{profile.faq.map((entry) => (
							<div
								key={entry.q}
								className="rounded-xl border border-surface-200 bg-white p-5 sm:p-6"
							>
								<dt className="font-semibold text-brand-navy">{entry.q}</dt>
								<dd className="mt-2 leading-relaxed text-ink-700">{entry.a}</dd>
							</div>
						))}
					</dl>
				</section>

				{/* 9. Disclosure -------------------------------------------------------- */}
				<DataDisclosure className="mt-12" lenderName={displayName} />

				<p className="mt-8 text-center text-ink-700">
					<Link
						href="/best-heloc-lenders"
						className="font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue-dark"
					>
						See all {getLenderProfilesMeta().profiles} ranked HELOC lenders
					</Link>
				</p>
			</div>
		</div>
	);
}
