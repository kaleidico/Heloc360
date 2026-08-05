#!/usr/bin/env node
/**
 * Acceptance checks for the HMDA pages, run against the built HTML.
 *
 * These assert the PDR section 13 criteria that can be checked mechanically.
 * They read `.next/server/app`, not the source, because the failures worth
 * catching are rendering failures: a null that survived a formatter, a lender
 * name that never became a link, an advertisement that reached a profile page.
 * Checking the source would miss all three.
 *
 * Usage: npx next build && node scripts/verify-hmda-build.mjs
 */

import fs from "node:fs";
import path from "node:path";

const APP_DIR = path.join(process.cwd(), ".next", "server", "app");
const DATA_DIR = path.join(process.cwd(), "data");

const failures = [];
const notes = [];

function fail(check, detail) {
	failures.push(`${check}: ${detail}`);
}

function readHtml(relativePath) {
	const full = path.join(APP_DIR, relativePath);
	if (!fs.existsSync(full)) return null;
	return fs.readFileSync(full, "utf8");
}

/** Strip the JSON-LD and Next.js data payloads before scanning visible copy. */
function visibleText(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<[^>]+>/g, " ");
}

const profiles = JSON.parse(
	fs.readFileSync(path.join(DATA_DIR, "lender-profiles.json"), "utf8"),
).profiles;
const sponsored = JSON.parse(
	fs.readFileSync(path.join(DATA_DIR, "sponsored.json"), "utf8"),
);

const pages = [
	{ label: "/best-heloc-lenders", file: "best-heloc-lenders.html" },
	{ label: "/methodology", file: "methodology.html" },
	...profiles.map((p) => ({
		label: `/lenders/${p.slug}`,
		file: path.join("lenders", `${p.slug}.html`),
		profile: p,
	})),
];

// ---------------------------------------------------------------------------
// 1. Every expected page was actually prerendered
// ---------------------------------------------------------------------------

for (const page of pages) {
	if (readHtml(page.file) === null) {
		fail("missing page", `${page.label} was not prerendered`);
	}
}

// ---------------------------------------------------------------------------
// 2. No page renders null, NaN, undefined, $0, or 100%
// ---------------------------------------------------------------------------

/**
 * Two scans, because the criteria mean two different things.
 *
 * A leaked `null`, `NaN` or `undefined` is a formatting bug wherever it lands,
 * so those are matched against all visible copy.
 *
 * `100%` and `$0` are different: both are legitimate English in explanatory
 * prose ("these do not sum to 100%") and only wrong as a *rendered value*. So
 * those are matched only where a value stands alone as the entire text content
 * of an element, which is how every formatter output is emitted and how no
 * sentence ever is.
 */
const FORBIDDEN_ANYWHERE = [
	{ name: "null", re: /\bnull\b/ },
	{ name: "NaN", re: /\bNaN\b/ },
	{ name: "undefined", re: /\bundefined\b/ },
];

const FORBIDDEN_AS_VALUE = [
	{ name: "$0", re: />\s*\$0(?![\d.])\s*</ },
	{ name: "100%", re: />\s*100(?:\.0+)?%\s*</ },
];

for (const page of pages) {
	const html = readHtml(page.file);
	if (!html) continue;
	const text = visibleText(html);

	for (const { name, re } of FORBIDDEN_ANYWHERE) {
		const match = text.match(re);
		if (match) {
			const at = text.indexOf(match[0]);
			const context = text.slice(Math.max(0, at - 70), at + 70).trim();
			fail("forbidden value", `${page.label} renders "${name}" near: ${context}`);
		}
	}

	// Strip JSON-LD first: schema payloads are not user-visible values.
	const markup = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
	for (const { name, re } of FORBIDDEN_AS_VALUE) {
		const match = markup.match(re);
		if (match) {
			const at = markup.indexOf(match[0]);
			const context = markup.slice(Math.max(0, at - 120), at + 60).trim();
			fail(
				"forbidden value",
				`${page.label} renders "${name}" as a value near: ${context}`,
			);
		}
	}
}

// ---------------------------------------------------------------------------
// 3. Every lender in a listing links to a profile page that exists
// ---------------------------------------------------------------------------

const ranking = readHtml("best-heloc-lenders.html");
if (ranking) {
	const linked = new Set(
		[...ranking.matchAll(/href="\/lenders\/([a-z0-9-]+)"/g)].map((m) => m[1]),
	);
	for (const profile of profiles) {
		if (!linked.has(profile.slug)) {
			fail(
				"unlinked lender",
				`${profile.slug} appears in the ranking payload but has no /lenders/ link on the ranking page`,
			);
		}
	}
	for (const slug of linked) {
		if (!profiles.some((p) => p.slug === slug)) {
			fail("dead link", `ranking page links to /lenders/${slug}, which has no profile`);
		}
	}
	notes.push(`ranking page links to ${linked.size} profile pages, all resolving`);
}

// ---------------------------------------------------------------------------
// 4. The initial-rate column is labeled and the table is not sortable
// ---------------------------------------------------------------------------

if (ranking) {
	const text = visibleText(ranking);
	if (!/initial rate/i.test(text)) {
		fail(
			"rate labelling",
			"the ranking page renders a rate column without the words 'initial rate'",
		);
	}
	if (/<th[^>]*(role="button"|aria-sort|onclick)/i.test(ranking)) {
		fail(
			"sortable rate",
			"the ranking table exposes sorting controls; the initial-rate column must never be sortable",
		);
	}
}

// ---------------------------------------------------------------------------
// 5. No advertisement on any profile page (PDR section 7.2)
// ---------------------------------------------------------------------------

for (const page of pages) {
	if (!page.profile) continue;
	const html = readHtml(page.file);
	if (!html) continue;
	if (/aria-label="Advertisement"/i.test(html)) {
		fail(
			"ad on profile",
			`${page.label} carries a sponsored unit; profile pages never do`,
		);
	}
	if (html.includes(sponsored.cta.url) && sponsored.cta.url.startsWith("http")) {
		fail("ad on profile", `${page.label} links to the advertiser CTA`);
	}
}

// ---------------------------------------------------------------------------
// 6. The sponsored gate held
// ---------------------------------------------------------------------------

const sponsoredReady =
	sponsored.active &&
	Boolean(sponsored.claimsVerifiedOn) &&
	!sponsored.cta.url.includes("REPLACE-WITH-AFFILIATE-LINK");

if (ranking) {
	const rendered = /aria-label="Advertisement"/i.test(ranking);
	if (rendered !== sponsoredReady) {
		fail(
			"sponsored gate",
			`ranking page ${rendered ? "renders" : "omits"} the ad, but the config says it is ${sponsoredReady ? "ready" : "not ready"}`,
		);
	}
	notes.push(
		sponsoredReady
			? "sponsored unit is verified and rendering"
			: "sponsored unit correctly withheld: claims not yet verified and the affiliate link is still a placeholder",
	);
}

// ---------------------------------------------------------------------------
// 7. Provenance and disclosure on every data-bearing page
// ---------------------------------------------------------------------------

for (const page of pages) {
	const html = readHtml(page.file);
	if (!html) continue;
	const text = visibleText(html);
	if (!/FFIEC HMDA Modified LAR, 2025/.test(text)) {
		fail("provenance", `${page.label} does not carry the data vintage`);
	}
	if (page.profile || page.label === "/best-heloc-lenders") {
		if (!/What this data cannot tell you/i.test(text)) {
			fail("disclosure", `${page.label} is missing the disclosure block`);
		}
		if (!/href="\/methodology"/.test(html)) {
			fail("methodology link", `${page.label} does not link to /methodology`);
		}
	}
}

// ---------------------------------------------------------------------------
// 8. Profile pages carry the not-a-preapproval language and FAQ schema
// ---------------------------------------------------------------------------

for (const page of pages) {
	if (!page.profile) continue;
	const html = readHtml(page.file);
	if (!html) continue;
	if (!/This is a likelihood, not a preapproval/i.test(visibleText(html))) {
		fail(
			"preapproval disclaimer",
			`${page.label} is missing the required likelihood disclosure`,
		);
	}
	if (!/"@type":"FAQPage"/.test(html.replace(/\s/g, ""))) {
		fail("schema", `${page.label} is missing FAQPage structured data`);
	}
}

// ---------------------------------------------------------------------------
// 9. Names still awaiting a sourced decision, reported not failed
// ---------------------------------------------------------------------------

const displayNames = JSON.parse(
	fs.readFileSync(
		path.join(process.cwd(), "config", "lender-display-names.json"),
		"utf8",
	),
);
const unresolved = Object.keys(displayNames.unresolved ?? {});
if (unresolved.length > 0) {
	notes.push(
		`${unresolved.length} lender names still need a sourced decision before launch: ${unresolved.join(", ")}`,
	);
}

// ---------------------------------------------------------------------------

console.log(`Checked ${pages.length} prerendered pages.\n`);
for (const note of notes) console.log(`  note: ${note}`);
if (notes.length) console.log("");

if (failures.length === 0) {
	console.log("All mechanical acceptance checks passed.");
	process.exit(0);
}

console.error(`${failures.length} check(s) failed:\n`);
for (const failure of failures) console.error(`  FAIL ${failure}`);
process.exit(1);
