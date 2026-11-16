// Blog posts retired 2026-09-01 (ClickUp 868kd5nv5): removed from Sanity and
// permanently redirected to the blog index so the live URLs keep their equity.
const RETIRED_BLOG_SLUGS = [
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

// Duplicate posts consolidated into their refreshed guides (batch 1, 2026-11-16):
// removed from Sanity and permanently redirected to the surviving post.
const CONSOLIDATED_BLOG_POSTS = [
	["heloc-vs-cash-out-refi-which-is-right-for-you", "heloc-vs-cash-out-refinance"],
	["heloc-vs-cash-out-refinance-choosing-the-best-option", "heloc-vs-cash-out-refinance"],
	["heloc-vs-cash-out-refinance-2026-the-real-cost-analysis", "heloc-vs-cash-out-refinance"],
	["heloc-vs-cash-out-refinance-which-wins-in-2025", "heloc-vs-cash-out-refinance"],
	["heloc-or-refinance-the-ultimate-showdown", "heloc-vs-cash-out-refinance"],
	["heloc-or-refinance-which-path-suits-you-best", "heloc-vs-cash-out-refinance"],
	["heloc-consolidation-strategies-for-smart-borrowers", "best-heloc-options-for-debt-consolidation"],
	["is-a-heloc-the-answer-to-your-debt-woes", "best-heloc-options-for-debt-consolidation"],
	["using-a-heloc-for-debt-consolidation-pros-and-cons", "best-heloc-options-for-debt-consolidation"],
	["is-a-heloc-the-secret-to-smart-debt-consolidation", "best-heloc-options-for-debt-consolidation"],
	["top-heloc-lenders-for-bad-credit-2025-review", "top-heloc-lenders-for-bad-credit"],
	["fixed-rate-heloc-options-explained-2025-guide", "fixed-rate-heloc-options-demystified"],
	["why-choose-a-fixed-rate-heloc-option", "fixed-rate-heloc-options-demystified"],
	["optimizing-your-debt-ratio-for-heloc-approval", "dti-requirements-for-heloc"],
	["top-equity-line-of-credit-lenders-for-homeowners", "top-home-equity-line-of-credit-lenders-reviewed"],
	["best-heloc-lenders-2025-review", "top-home-equity-line-of-credit-lenders-reviewed"],
	["top-heloc-lenders-of-2025-revealed", "top-home-equity-line-of-credit-lenders-reviewed"],
	["best-home-equity-line-of-credit-lenders-a-comparison", "top-home-equity-line-of-credit-lenders-reviewed"],
	["master-your-heloc-payments-with-this-simple-calculator", "heloc-payment-calculator-how-to-estimate-your-monthly-costs"],
	["demystifying-heloc-eligibility-requirements", "equity-line-of-credit-requirements-what-you-need-to-know"],
	["are-you-a-perfect-heloc-candidate-2025-quiz", "equity-line-of-credit-requirements-what-you-need-to-know"],
	["are-you-eligible-for-a-heloc-2025-guide", "equity-line-of-credit-requirements-what-you-need-to-know"],
];

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
	// Webpack optimizations
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			// Optimize bundle splitting
			config.optimization.splitChunks = {
				chunks: "all",
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all",
					},
					common: {
						name: "common",
						minChunks: 2,
						chunks: "all",
						enforce: true,
					},
				},
			};
		}
		return config;
	},
	// Redirects for legacy slugs are handled dynamically in app/[slug]/page.tsx
	async redirects() {
		return [
			// Calculator redirects for safety
			{
				source: "/calculators/home-equity",
				destination: "/calculators/home-equity-estimator",
				permanent: true,
			},
			// Retired blog posts -> blog index
			...RETIRED_BLOG_SLUGS.map((slug) => ({
				source: `/blog/${slug}`,
				destination: "/blog",
				permanent: true,
			})),
			// Same nine posts at their legacy root-level URLs. These normally resolve via
			// the catch-all in app/(site)/[...slug]/page.tsx, which looks the slug up in
			// Sanity and redirects to /blog/<slug> — so the moment the documents are
			// deleted that lookup fails and the URL 404s instead. Redirecting here keeps
			// them working for inbound links and anything still in the index.
			...RETIRED_BLOG_SLUGS.map((slug) => ({
				source: `/${slug}`,
				destination: "/blog",
				permanent: true,
			})),
			// Consolidated duplicates -> refreshed posts (both /blog/<slug> and legacy root form)
			...CONSOLIDATED_BLOG_POSTS.flatMap(([from, to]) => [
				{ source: `/blog/${from}`, destination: `/blog/${to}`, statusCode: 301 },
				{ source: `/${from}`, destination: `/blog/${to}`, statusCode: 301 },
			]),
		];
	},
};

export default nextConfig;
