import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import DataStamp from "@/components/hmda/data-stamp";
import {
	DATA_VINTAGE,
	DATA_YEAR,
	getMethodologyMarkdown,
	getWebPayload,
} from "@/lib/hmda/data";
import { formatCount } from "@/lib/hmda/format";

const TITLE = "How We Rank HELOC Lenders: Our Methodology";
const DESCRIPTION = `Every ranking, approval rate, and lender fact on this site is computed from federal HMDA filings. Here is exactly how, including what the data cannot tell you and how to reproduce it yourself.`;
const CANONICAL = "https://heloc360.com/methodology";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: CANONICAL },
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		url: CANONICAL,
		siteName: "HELOC360",
		type: "article",
	},
	twitter: {
		card: "summary_large_image",
		title: TITLE,
		description: DESCRIPTION,
	},
};

/**
 * The methodology document is published verbatim from `data/methodology.md`, so
 * the page and the document reviewed for compliance cannot drift apart. One line
 * is removed on the way out.
 *
 * The source file carries an internal editorial marker, `**Status:** Draft for
 * review`, which is true of the document inside the project and false of the
 * published page. Publishing it would tell every reader that the methodology
 * backing the ranking is not final. Rather than edit Bill's file and lose the
 * byte-for-byte match against the reviewed copy, the line is stripped here and
 * only that line. Nothing else about the document is transformed.
 */
function stripInternalStatusLine(markdown: string): string {
	return markdown
		.split("\n")
		.filter((line) => !/^\*\*Status:\*\*/.test(line.trim()))
		.join("\n");
}

export default function MethodologyPage() {
	const { meta } = getWebPayload();
	const markdown = stripInternalStatusLine(getMethodologyMarkdown());

	const datasetSchema = {
		"@context": "https://schema.org",
		"@type": "Dataset",
		name: `HELOC lender rankings derived from ${DATA_VINTAGE}`,
		description: `Lender-level aggregates for home equity lines of credit, computed from ${formatCount(meta.rowsScanned)} loan-level records in the ${DATA_YEAR} FFIEC HMDA Modified Loan Application Register.`,
		url: CANONICAL,
		license: "https://www.ffiec.gov/hmda/",
		creator: {
			"@type": "Organization",
			name: "HELOC360",
			url: "https://heloc360.com",
		},
		isBasedOn: {
			"@type": "Dataset",
			name: "FFIEC HMDA Modified Loan Application Register, 2025",
			url: "https://ffiec.cfpb.gov/data-publication/modified-lar/2025",
			creator: {
				"@type": "GovernmentOrganization",
				name: "Federal Financial Institutions Examination Council",
			},
		},
		temporalCoverage: String(DATA_YEAR),
		spatialCoverage: { "@type": "Country", name: "United States" },
		variableMeasured: [
			"HELOC originations",
			"HELOC origination volume",
			"Denial rate",
			"Combined loan-to-value at the 90th percentile",
			"Median line size",
			"Median initial interest rate",
		],
	};

	return (
		<div className="bg-white">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
			/>

			<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
				<DataStamp className="mb-8" withMethodologyLink={false} />

				<article
					className="prose prose-slate max-w-none
						prose-headings:text-brand-navy
						prose-h1:text-display-md prose-h1:sm:text-display-lg
						prose-h2:text-display-sm prose-h2:mt-12
						prose-a:text-brand-blue prose-a:underline prose-a:underline-offset-2
						prose-strong:text-brand-navy
						prose-code:before:content-none prose-code:after:content-none
						prose-table:text-sm
						prose-hr:border-surface-200"
				>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
				</article>

				<aside className="mt-12 rounded-xl border border-surface-200 bg-surface-50 p-6">
					<h2 className="text-display-sm text-brand-navy">
						See it applied
					</h2>
					<p className="mt-2 leading-relaxed text-ink-700">
						The ranking this methodology produces is on the{" "}
						<Link
							href="/best-heloc-lenders"
							className="font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue-dark"
						>
							best HELOC lenders
						</Link>{" "}
						page, and every lender in it has a profile showing the same numbers
						broken out by approval band.
					</p>
				</aside>
			</div>
		</div>
	);
}
