/**
 * Display helpers for the HMDA payloads.
 *
 * PDR acceptance criteria: no page may ever render `null`, `NaN`, `undefined`,
 * `$0`, or `100%`. Every one of those is a data-integrity bug in a site whose
 * whole claim is that the numbers are verifiable. Route every number through
 * these helpers rather than interpolating a payload field directly.
 */

/**
 * What a missing value reads as. The payloads use null to mean "the sample was
 * too thin, or the percentile landed in an overflow bucket", which is a real and
 * reportable fact rather than a zero. Saying so beats a bare dash.
 */
export const NOT_REPORTED = "Not reported";

/** Approval display is capped below 100%: no lender approves everyone. */
export const APPROVAL_DISPLAY_CAP = 0.99;

function isRenderable(value: number | null | undefined): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

/**
 * Whole-dollar money. `atCap` means the value sat at or above the top bucket of
 * the aggregation, so the true figure is unknown and only a floor can be stated.
 */
export function formatUsd(
	value: number | null | undefined,
	atCap = false,
): string {
	if (atCap) return "$1M+";
	if (!isRenderable(value)) return NOT_REPORTED;
	return `$${Math.round(value).toLocaleString("en-US")}`;
}

/** Large aggregate volumes, where the exact dollar is noise. */
export function formatUsdCompact(value: number | null | undefined): string {
	if (!isRenderable(value)) return NOT_REPORTED;
	const abs = Math.abs(value);
	if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
	if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
	if (abs >= 1_000) return `$${Math.round(value / 1_000)}K`;
	return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function formatCount(value: number | null | undefined): string {
	if (!isRenderable(value)) return NOT_REPORTED;
	return Math.round(value).toLocaleString("en-US");
}

/**
 * A rate or share expressed 0..1, rendered as a whole percent.
 *
 * Both boundaries are guarded, because naive rounding lies in exactly the places
 * a reader is most likely to quote. A lender with 3,193 second liens and 7 first
 * liens is at 99.78%, which rounds to a flat "100%" and tells the reader the
 * seven do not exist. The same in reverse: a small but real share must not round
 * away to "0%". And a genuine 1.0 is reported in words, since a bare 100% next
 * to a column of rates reads as a probability and is ruled out on sight by PDR
 * section 13.
 */
export function formatPercent(
	value: number | null | undefined,
	digits = 0,
): string {
	if (!isRenderable(value)) return NOT_REPORTED;
	if (value >= 1) return "All";
	if (value <= 0) return "None";
	const scaled = value * 100;
	if (scaled >= 99.5) return ">99%";
	if (scaled < 0.5) return "<1%";
	return `${scaled.toFixed(digits)}%`;
}

/**
 * Approval rates, capped so no card ever shows 100%. A displayed 100% reads as a
 * guarantee, and nothing in this data guarantees an outcome for an individual.
 */
export function formatApprovalPercent(
	value: number | null | undefined,
): string {
	if (!isRenderable(value)) return NOT_REPORTED;
	return `${Math.round(Math.min(value, APPROVAL_DISPLAY_CAP) * 100)}%`;
}

/**
 * An approval rate derived from the counts behind it, which is the only safe way
 * to render one.
 *
 * The `rate` field on each band is pre-rounded upstream, and in at least one
 * band a lender that approved 1 of 2,521 applications carries a stored rate of
 * exactly 0. Rendering that as "0%" tells a reader the door is shut when it is
 * not, so the distinction between "approved nobody" and "approved almost nobody"
 * is taken from `approved` rather than from the rounded rate. A true zero is
 * still shown as 0%: a lender that approved none of 4,718 applications above 90%
 * CLTV is telling the reader something real, and softening it would be the
 * mirror-image lie.
 */
export function formatApprovalRateFromCounts(
	approved: number,
	n: number,
): string {
	if (!isRenderable(n) || n <= 0) return NOT_REPORTED;
	if (!isRenderable(approved) || approved <= 0) return "0%";
	const ratio = approved / n;
	if (ratio < 0.005) return "<1%";
	return `${Math.round(Math.min(ratio, APPROVAL_DISPLAY_CAP) * 100)}%`;
}

/** The bar width matching `formatApprovalRateFromCounts`, so the two agree. */
export function approvalBarWidthFromCounts(
	approved: number,
	n: number,
): number {
	if (!isRenderable(n) || n <= 0) return 0;
	if (!isRenderable(approved) || approved <= 0) return 0;
	const ratio = Math.min(Math.max(approved / n, 0), APPROVAL_DISPLAY_CAP);
	return Math.round(ratio * 100);
}

/** The same cap, as a number, for bar widths so the bar matches the label. */
export function approvalBarWidth(value: number | null | undefined): number {
	if (!isRenderable(value)) return 0;
	return Math.round(Math.min(Math.max(value, 0), APPROVAL_DISPLAY_CAP) * 100);
}

/** A combined loan-to-value percentage, already expressed 0..150. */
export function formatCltv(value: number | null | undefined): string {
	if (!isRenderable(value)) return NOT_REPORTED;
	return `${value.toFixed(1)}%`;
}

/**
 * The median INITIAL rate on a variable open-end line. Callers must label this
 * "initial rate"; it is not an APR and not a rate the borrower keeps.
 */
export function formatInitialRate(value: number | null | undefined): string {
	if (!isRenderable(value)) return NOT_REPORTED;
	return `${value.toFixed(2)}%`;
}

const TYPE_LABELS: Record<string, string> = {
	bank: "Bank",
	nonbank: "Nonbank lender",
	credit_union: "Credit union",
	unknown: "Unclassified",
};

/**
 * Lender type. "unknown" is not a gap we paper over: 122 filers registered a
 * name truncated past the point where the institution can be typed from it, and
 * GLEIF returns the same string, so they are labeled rather than assumed.
 */
export function formatLenderType(type: string): string {
	return TYPE_LABELS[type] ?? TYPE_LABELS.unknown;
}

/** Score components render 0..100 with one decimal. */
export function formatScore(value: number | null | undefined): string {
	if (!isRenderable(value)) return NOT_REPORTED;
	return value.toFixed(1);
}

/**
 * Compares a lender value against the qualified-pool median and describes the
 * direction in words. `higherIsBetter` is false for denial rate, where a lower
 * number is the better outcome.
 */
export function compareToPool(
	value: number | null | undefined,
	poolMedian: number | null | undefined,
	higherIsBetter = true,
): "above" | "below" | "even" | "unknown" {
	if (!isRenderable(value) || !isRenderable(poolMedian)) return "unknown";
	if (Math.abs(value - poolMedian) < 1e-9) return "even";
	const isHigher = value > poolMedian;
	if (isHigher === higherIsBetter) return "above";
	return "below";
}
