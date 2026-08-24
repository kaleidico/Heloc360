import BlogHome from "@/components/blog/blog-home";
import { getBlogCards } from "@/lib/sanity/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "HELOC360 Blog — Insights, Tips, and Smart Equity Strategies",
	description:
		"Explore the latest articles on HELOCs, home equity strategies, calculators, and expert tips to make informed decisions about your home's equity.",
	alternates: {
		canonical: "https://heloc360.com/blog",
	},
	openGraph: {
		type: "website",
		url: "https://heloc360.com/blog",
		title: "HELOC360 Blog — Insights, Tips, and Smart Equity Strategies",
		description:
			"Explore the latest articles on HELOCs, home equity strategies, calculators, and expert tips to make informed decisions about your home's equity.",
		images: [
			{
				url: "/images/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "HELOC360 Blog",
			},
		],
		siteName: "HELOC360",
	},
	twitter: {
		card: "summary_large_image",
		title: "HELOC360 Blog — Insights, Tips, and Smart Equity Strategies",
		description:
			"Explore the latest articles on HELOCs, home equity strategies, calculators, and expert tips to make informed decisions about your home's equity.",
		images: ["/images/twitter-image.jpg"],
	},
};

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;

	// Extract filter parameters from URL
	const search = resolvedSearchParams?.search
		? (resolvedSearchParams.search as string)
		: "";
	const category = resolvedSearchParams?.category
		? (resolvedSearchParams.category as string)
		: "";

	// Filtered and paginated in Sanity, so only this page of cards is sent to
	// the browser.
	const listing = await getBlogCards({ page: 1, search, category });

	return (
		<BlogHome
			posts={listing.posts}
			totalPosts={listing.total}
			totalPages={listing.totalPages}
			initialPage={1}
			initialSearch={search}
			initialCategory={category}
		/>
	);
}
