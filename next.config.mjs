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
		];
	},
};

export default nextConfig;
