import fs from "node:fs";
import path from "node:path";

import type {
	LenderProfile,
	LenderProfilesFile,
	LenderProfilesMeta,
	RankedLender,
	SponsoredConfig,
	WebPayload,
} from "@/types/hmda";

/**
 * Build-time loaders for the committed HMDA payloads.
 *
 * Server-only. Every page that consumes these is statically generated, so the
 * files are read once during `next build` and never at request time. They are
 * read with `fs` rather than `import`ed so TypeScript does not have to infer a
 * literal type for a 688 KB object graph on every type-check.
 */

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filename: string): T {
	return JSON.parse(
		fs.readFileSync(path.join(DATA_DIR, filename), "utf8"),
	) as T;
}

function memoize<T>(load: () => T): () => T {
	let cached: T | undefined;
	return () => {
		if (cached === undefined) cached = load();
		return cached;
	};
}

// ---------------------------------------------------------------------------
// Provenance
// ---------------------------------------------------------------------------

/**
 * The data vintage shown on every page that renders these numbers (PDR section
 * 3.4). When the payloads are refreshed this constant changes once and every
 * page follows. Rendered through <DataStamp />, never hand-typed into copy.
 */
export const DATA_VINTAGE =
	"FFIEC HMDA Modified LAR, 2025, released 2026-06-14";

/** Filing year the payloads describe. */
export const DATA_YEAR = 2025;

// ---------------------------------------------------------------------------
// Payloads
// ---------------------------------------------------------------------------

export const getWebPayload = memoize(() =>
	readJson<WebPayload>("web-payload.json"),
);

const getProfilesFile = memoize(() =>
	readJson<LenderProfilesFile>("lender-profiles.json"),
);

export const getSponsored = memoize(() =>
	readJson<SponsoredConfig>("sponsored.json"),
);

// ---------------------------------------------------------------------------
// Display names
// ---------------------------------------------------------------------------

interface DisplayNameConfig {
	overrides: Record<string, string>;
	unresolved: Record<string, { current: string; reason: string; note: string }>;
}

const getDisplayNameConfig = memoize(
	() =>
		JSON.parse(
			fs.readFileSync(
				path.join(process.cwd(), "config", "lender-display-names.json"),
				"utf8",
			),
		) as DisplayNameConfig,
);

/**
 * The one name a user ever sees.
 *
 * Three layers, in order: a reviewed override, then the payload's `displayName`,
 * then the FFIEC legal name as a last resort. The payload's `name` is the legal
 * string and is frequently ALL CAPS, so it is never rendered directly, and
 * `web-payload.json` carries that legal string rather than the display one,
 * which is why every listing resolves its label through here instead of using
 * the field sitting next to it.
 */
export function resolveDisplayName(lender: {
	slug: string;
	displayName?: string;
	name: string;
}): string {
	const override = getDisplayNameConfig().overrides[lender.slug];
	return override ?? lender.displayName ?? lender.name;
}

/** Lenders whose public name still needs a sourced decision. */
export function getUnresolvedNames() {
	const { unresolved } = getDisplayNameConfig();
	return Object.entries(unresolved).map(([slug, info]) => ({ slug, ...info }));
}

/** All 46 nationally-ranked lenders, in rank order. */
export function getRankedLenders() {
	return getWebPayload().national;
}

/** Every assembled lender profile, in rank order. */
export function getLenderProfiles(): LenderProfile[] {
	return getProfilesFile().profiles;
}

export function getLenderProfilesMeta(): LenderProfilesMeta {
	return getProfilesFile().meta;
}

export function getLenderProfile(slug: string): LenderProfile | undefined {
	return getProfilesFile().profiles.find((p) => p.slug === slug);
}

/** Slugs for `generateStaticParams`. */
export function getLenderSlugs(): string[] {
	return getProfilesFile().profiles.map((p) => p.slug);
}

/**
 * The ranking rows, with the label already resolved and the profile link
 * confirmed to exist.
 *
 * Joining to the profile set here is what makes non-negotiable 7 structural
 * rather than aspirational: a ranked lender with no profile record would have to
 * be dropped from the list, so a listing can never render a name that leads
 * nowhere. If this ever throws, the payloads have drifted apart and the build
 * should fail rather than ship dead links.
 */
export function getRankingRows(): (RankedLender & { displayName: string })[] {
	const profiles = new Map(getProfilesFile().profiles.map((p) => [p.slug, p]));
	return getWebPayload().national.map((lender) => {
		const profile = profiles.get(lender.slug);
		if (!profile) {
			throw new Error(
				`Ranked lender "${lender.slug}" has no profile in lender-profiles.json. ` +
					"Every listing must link to a profile page (PDR non-negotiable 7), so " +
					"the payloads have to be regenerated together.",
			);
		}
		return { ...lender, displayName: resolveDisplayName(profile) };
	});
}

/**
 * The methodology document, published verbatim. It is committed as markdown so
 * the published page and the document reviewed for compliance cannot drift.
 */
export const getMethodologyMarkdown = memoize(() =>
	fs.readFileSync(path.join(DATA_DIR, "methodology.md"), "utf8"),
);

// ---------------------------------------------------------------------------
// Sponsored placement gate
// ---------------------------------------------------------------------------

/**
 * Whether the paid placement may render.
 *
 * Three independent conditions, all required (PDR section 7.3). `claimsVerifiedOn`
 * is null in the committed config on purpose: it blocks the unit until every
 * claim in the headline and body has been checked against the advertiser's own
 * approved creative. The placeholder affiliate URL blocks it too, so a half-wired
 * unit cannot reach production and quietly send traffic nowhere.
 *
 * This is deliberately a hard gate rather than a warning. Shipping an unverified
 * advertising claim on a page whose entire value is verifiability is the one
 * failure this build cannot absorb.
 */
export function isSponsoredReady(config: SponsoredConfig): boolean {
	if (!config.active) return false;
	if (!config.claimsVerifiedOn) return false;
	const url = config.cta?.url ?? "";
	if (!url || url.includes("REPLACE-WITH-AFFILIATE-LINK")) return false;
	return url.startsWith("https://");
}
