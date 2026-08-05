/**
 * Type contracts for the HMDA-derived payloads under /data.
 *
 * These mirror PDR section 3. The null-heavy fields are typed as nullable on
 * purpose: `medianLineUsd`, `p90Cltv`, `medianRate` and friends are null when the
 * underlying sample was too thin or the percentile landed in an overflow bucket.
 * Rendering a null as `0` or a fabricated substitute violates PDR non-negotiable 5,
 * so the types force every call site to decide. Use the formatters in
 * `lib/hmda/format.ts` rather than interpolating these values directly.
 */

export type LenderType = "bank" | "nonbank" | "credit_union" | "unknown";

/** Ranking weights and the objective gate applied before scoring. */
export interface ScoreWeights {
	scale: number;
	reach: number;
	equityAccess: number;
	approval: number;
}

export interface EligibilityGate {
	minStates: number;
	minOriginations: number;
	weights: ScoreWeights;
}

export interface SegmentTotal {
	originations: number;
	volumeUsd: number;
}

// ---------------------------------------------------------------------------
// web-payload.json — powers /best-heloc-lenders
// ---------------------------------------------------------------------------

export interface WebPayloadMeta {
	source: string;
	rowsScanned: number;
	gate: EligibilityGate;
	excludedFromScore: string[];
	totals: Record<string, SegmentTotal>;
	lendersWithHeloc: number;
	qualifiedPool: number;
	statesCovered: number;
}

export interface RankedLender {
	rank: number;
	name: string;
	lei: string;
	slug: string;
	type: LenderType;
	/** null when the lender type could not be resolved, so membership is unknown. */
	membershipRequired: boolean | null;
	score: number;
	parts: ScoreWeights;
	originations: number;
	volumeUsd: number;
	states: number;
	stateList: string[];
	p90Cltv: number | null;
	medianCltv: number | null;
	medianLineUsd: number | null;
	/** True means the value sat at or above the top bucket, so render `$1M+`. */
	medianLineAtCap: boolean;
	p90LineUsd: number | null;
	p90LineAtCap: boolean;
	denialRate: number | null;
	/**
	 * The INITIAL rate on a variable open-end line, not an APR and not a rate the
	 * borrower keeps. Must be labelled "initial rate" wherever it renders and must
	 * never be sortable as "lowest rate" (PDR section 5).
	 */
	medianRate: number | null;
	dtiOver43Share: number | null;
}

export interface StateRow {
	name: string;
	type: LenderType;
	originations: number;
	p90Cltv: number | null;
	denialRate: number | null;
	medianLineUsd: number | null;
	nationallyQualified: boolean;
}

export interface WebPayload {
	meta: WebPayloadMeta;
	national: RankedLender[];
	states: Record<string, StateRow[]>;
}

// ---------------------------------------------------------------------------
// lender-profiles.json — powers /lenders/[slug]
// ---------------------------------------------------------------------------

export interface ProfileAtAGlance {
	originations: number;
	volumeUsd: number;
	stateCount: number;
	p90Cltv: number | null;
	medianCltv: number | null;
	medianLineUsd: number | null;
	medianLineAtCap: boolean;
	denialRate: number | null;
	approvalRate: number | null;
	medianInitialRate: number | null;
	dtiOver43Share: number | null;
}

/** One row of the approval-by-band tables. `n` is the sample the rate rests on. */
export interface ApprovalBand {
	band: string;
	approved: number;
	denied: number;
	n: number;
	rate: number;
}

export interface DenialReason {
	reason: string;
	share: number;
}

export interface PurposeMix {
	purpose: string;
	n: number;
	share: number;
}

export interface BorrowerProfile {
	incomeMedian: number | null;
	incomeP25: number | null;
	incomeP75: number | null;
	propertyValueMedian: number | null;
	firstLien: number;
	subLien: number;
	purposeMix: PurposeMix[];
}

export interface ProfileState {
	code: string;
	name: string;
	slug: string;
	originations: number;
}

/** The lender's four score components measured against the qualified-pool median. */
export interface VsPool {
	score: number;
	originations: number;
	p90Cltv: number | null;
	denialRate: number | null;
	medianLineUsd: number | null;
}

export interface FaqEntry {
	q: string;
	a: string;
}

export interface ProfileSeo {
	title: string;
	description: string;
}

export interface LenderProfile {
	slug: string;
	lei: string;
	/** FFIEC legal name, frequently ALL CAPS. Do not render this to users. */
	name: string;
	/** Title-cased name. Render this everywhere user-facing (PDR section 3.3). */
	displayName: string;
	/**
	 * True where the legal entity is not what a consumer searches for. These four
	 * need a hand-written brand mapping before their pages go live, and the slug
	 * should follow the brand rather than the legal name.
	 */
	brandOverrideNeeded: boolean;
	type: LenderType;
	membershipRequired: boolean | null;
	rank: number;
	score: number;
	scoreParts: ScoreWeights;
	modelIndex: number;
	atAGlance: ProfileAtAGlance;
	approvalByCltv: ApprovalBand[];
	approvalByDti: ApprovalBand[];
	denialMix: DenialReason[];
	denialSample: number;
	borrower: BorrowerProfile;
	states: ProfileState[];
	vsPool: VsPool;
	faq: FaqEntry[];
	seo: ProfileSeo;
}

export interface LenderProfilesMeta {
	source: string;
	built: string;
	profiles: number;
	poolMedians: VsPool;
	note: string;
}

export interface LenderProfilesFile {
	meta: LenderProfilesMeta;
	profiles: LenderProfile[];
}

// ---------------------------------------------------------------------------
// sponsored.json — the paid placement (PDR section 7)
// ---------------------------------------------------------------------------

export interface SponsoredConfig {
	slot: string;
	active: boolean;
	lei: string;
	brand: string;
	headline: string;
	body: string;
	cta: { label: string; url: string };
	disclosureShort: string;
	disclosureLong: string;
	/** Where the brand independently lands in the organic ranking. */
	organicRank: number;
	/**
	 * Null until every claim in headline/body has been checked against the
	 * advertiser's approved creative. Null blocks the unit from rendering, by
	 * design (PDR section 7.3).
	 */
	claimsVerifiedOn: string | null;
	claimsSourceUrl: string | null;
	payoutTrigger: string | null;
}
