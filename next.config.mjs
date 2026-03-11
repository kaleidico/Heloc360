/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	trailingSlash: false,
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
			{ protocol: "https", hostname: "images.ctfassets.net" },
			{ protocol: "https", hostname: "assets.ctfassets.net" },
			{ protocol: "https", hostname: "downloads.ctfassets.net" },
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
		];
	},
};

export default nextConfig;
