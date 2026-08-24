import { readFileSync } from "node:fs";

// Duplicate blog posts, shared with app/(site)/sitemap.ts so the redirect list
// and the sitemap can never disagree.
const { redirects: BLOG_REDIRECTS } = JSON.parse(
	readFileSync(new URL("./config/blog-redirects.json", import.meta.url), "utf8"),
);

// Content Security Policy.
//
// Shipped as Report-Only on purpose. A blocking CSP on a site with this many
// third parties (GTM, GA, reCAPTCHA, Fraud Blocker, Sanity, MortgageMate) will
// break something the first time it is wrong, and a broken lead form is worse
// than a missing header. Run it in report-only, watch the reports, then switch
// the key below to "Content-Security-Policy" once it is quiet.
//
// 'unsafe-inline' is required for scripts because Next.js inlines its own
// bootstrap and the Consent Mode defaults must run before any tag. Moving to
// nonces means routing every page through middleware; worth doing later, but
// it is a separate change.
const CSP = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'self'",
	"form-action 'self'",
	"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://monitor.fraudblocker.com https://mortgagemate.app",
	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
	"font-src 'self' data: https://fonts.gstatic.com",
	"img-src 'self' data: blob: https://cdn.sanity.io https://sjc.microlink.io https://www.googletagmanager.com https://www.google-analytics.com https://monitor.fraudblocker.com https://www.google.com",
	"connect-src 'self' https://*.sanity.io https://cdn.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://monitor.fraudblocker.com",
	"frame-src 'self' https://www.google.com https://mortgagemate.app https://www.googletagmanager.com",
	"worker-src 'self' blob:",
	"manifest-src 'self'",
	"upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	trailingSlash: false,
	// Required for embedded Sanity Studio: transpile Sanity's source so its
	// styled-components internals render correctly (otherwise StyledBox emits
	// list-children without keys and React dev-mode warns).
	transpilePackages: ['sanity'],
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						// Switch to "Content-Security-Policy" to enforce.
						key: "Content-Security-Policy-Report-Only",
						value: CSP,
					},
				],
			},
		];
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	// Enable image optimization
	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		remotePatterns: [
			{ protocol: "https", hostname: "cdn.sanity.io" },
			{ protocol: "https", hostname: "sjc.microlink.io" },
		],
	},
	// Enable compression
	compress: true,
	// Enable experimental features for better performance
	experimental: {
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
	},
	// Bundle splitting is deliberately left to Next.js.
	//
	// This block previously forced every node_modules package into a single
	// `vendors` chunk. Because the Sanity Studio is mounted at /studio inside
	// this app, that pulled the whole editor into the chunk EVERY page loads:
	// 2.28 MB of shared JavaScript on a marketing site. Next's own splitting
	// keeps route-specific dependencies on their own routes, so /studio pays
	// for the Studio and the public pages do not.
	// Redirects for legacy slugs are handled dynamically in app/[slug]/page.tsx
	async redirects() {
		return [
			// Calculator redirects for safety
			{
				source: "/calculators/home-equity",
				destination: "/calculators/home-equity-estimator",
				permanent: true,
			},

			// Duplicate blog posts, folded into a canonical URL so they stop
			// competing for the same query. Sourced from config/blog-redirects.json,
			// which app/(site)/sitemap.ts reads too.
			...BLOG_REDIRECTS.map(({ from, to }) => ({
				source: `/blog/${from}`,
				destination: `/blog/${to}`,
				permanent: true,
			})),
		];
	},
};

export default nextConfig;
