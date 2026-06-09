import BlogHome from "@/components/blog/blog-home";
import { getAllBlogPosts } from "@/lib/contentful";
import type { Metadata } from "next";

export const revalidate = 86400;

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
	const posts = await getAllBlogPosts();
	const resolvedSearchParams = await searchParams;

	// Extract filter parameters from URL
	const search = resolvedSearchParams?.search
		? (resolvedSearchParams.search as string)
		: "";
	const category = resolvedSearchParams?.category
		? (resolvedSearchParams.category as string)
		: "";

	return (
		<BlogHome
			initialPosts={posts}
			initialPage={1}
			initialSearch={search}
			initialCategory={category}
		/>
	);
}
