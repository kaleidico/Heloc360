#!/usr/bin/env node
// Delete the nine retired blog posts (ClickUp 868kd5nv5) from Sanity.
//
// Order matters and this script enforces it: the /blog/<slug> and /<slug>
// redirects must already be LIVE on heloc360.com before the documents go,
// otherwise those URLs 404 instead of redirecting. The redirects only go live
// when a fresh Production deployment is promoted in Vercel.
//
//   node scripts/delete-retired-posts.mjs            # dry run, checks only
//   node scripts/delete-retired-posts.mjs --confirm  # back up, then delete
//
// A JSON backup of every document is written to scripts/ before any deletion,
// which is what makes this reversible.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PROJECT = "2a445j5i";
const DATASET = "production";
const API = "2024-01-01";
const SITE = "https://heloc360.com";

const SLUGS = [
	"why-savvy-homeowners-are-turning-to-helocs-in-2025",
	"why-a-heloc-could-be-your-ultimate-financial-safety-net",
	"master-these-heloc-strategies-for-financial-success-2025",
	"unlocking-your-homes-hidden-potential-with-a-heloc",
	"whens-the-perfect-time-to-apply-for-a-heloc",
	"is-a-heloc-right-for-your-financial-future-2025-guide",
	"the-shocking-consequences-of-heloc-default",
	"helocs-in-a-post-covid-world-whats-changed",
	"why-a-heloc-is-your-ultimate-emergency-fund",
];

const confirm = process.argv.includes("--confirm");

function token() {
	if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;
	// Project-scoped Editor token, kept in .env.local beside the site's own settings.
	const envFile = path.join(import.meta.dirname, "..", ".env.local");
	if (fs.existsSync(envFile)) {
		const m = fs.readFileSync(envFile, "utf8").match(/^SANITY_API_WRITE_TOKEN=(.+)$/m);
		if (m) return m[1].trim();
	}
	const p = path.join(os.homedir(), ".config", "sanity", "config.json");
	const t = JSON.parse(fs.readFileSync(p, "utf8")).authToken;
	if (!t) throw new Error("no authToken in " + p);
	return t;
}

async function query(groq) {
	const u = new URL(`https://${PROJECT}.api.sanity.io/v${API}/data/query/${DATASET}`);
	u.searchParams.set("query", groq);
	const r = await fetch(u, { headers: { Authorization: `Bearer ${token()}` } });
	const j = await r.json();
	if (j.error) throw new Error(JSON.stringify(j.error));
	return j.result;
}

// The gate. Every retired URL, in both its /blog/ and root-level form, must
// already answer with a redirect to /blog on the public domain.
async function redirectsAreLive() {
	let live = 0;
	const broken = [];
	for (const slug of SLUGS) {
		for (const p of [`/blog/${slug}`, `/${slug}`]) {
			let res;
			try {
				res = await fetch(SITE + p, { redirect: "manual" });
			} catch (e) {
				broken.push(`${p} -> request failed: ${e.message}`);
				continue;
			}
			const loc = res.headers.get("location") || "";
			const ok = (res.status === 301 || res.status === 308) && /\/blog\/?$/.test(loc);
			if (ok) live++;
			else broken.push(`${p} -> ${res.status} ${loc || "(no redirect)"}`);
		}
	}
	return { live, total: SLUGS.length * 2, broken };
}

const docs = await query(
	`*[_type=="blogPost" && slug.current in ${JSON.stringify(SLUGS)}]`
);
console.log(`Found ${docs.length} of ${SLUGS.length} retired posts in Sanity.`);
for (const d of docs) console.log(`  ${d._id}  ${d.slug?.current}`);

const refs = await query(
	`*[references(${JSON.stringify(docs.map((d) => d._id))})]{_id}`
);
console.log(`Documents referencing them: ${refs.length}` + (refs.length ? " (delete will be refused)" : ""));

console.log("\nChecking the redirects are live on " + SITE + " ...");
const { live, total, broken } = await redirectsAreLive();
console.log(`  ${live}/${total} URLs redirect to /blog`);
for (const b of broken.slice(0, 6)) console.log(`  NOT REDIRECTING: ${b}`);
if (broken.length > 6) console.log(`  ... and ${broken.length - 6} more`);

if (live !== total) {
	console.error(
		"\nABORT: the redirects are not live yet, so deleting now would 404 these URLs." +
		"\nPromote a fresh Production deployment in Vercel first, re-check, then re-run."
	);
	process.exit(1);
}

if (!confirm) {
	console.log("\nDry run. Redirects are live and deletion is safe to proceed.");
	console.log("Re-run with --confirm to back up and delete.");
	process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backup = path.join(import.meta.dirname, `retired-posts-backup-${stamp}.json`);
fs.writeFileSync(backup, JSON.stringify(docs, null, 2));
console.log(`\nBacked up ${docs.length} documents to ${backup}`);

const res = await fetch(
	`https://${PROJECT}.api.sanity.io/v${API}/data/mutate/${DATASET}?returnIds=true`,
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token()}`,
		},
		body: JSON.stringify({ mutations: docs.map((d) => ({ delete: { id: d._id } })) }),
	}
);
const out = await res.json();
if (!res.ok || out.error) {
	console.error("Delete failed:", JSON.stringify(out, null, 2));
	console.error("The backup above is intact; nothing else was changed.");
	process.exit(1);
}
console.log(`Deleted ${out.results?.length ?? 0} documents.`);

const left = await query(
	`count(*[_type=="blogPost" && slug.current in ${JSON.stringify(SLUGS)}])`
);
console.log(`Retired posts remaining in Sanity: ${left} (expected 0)`);
