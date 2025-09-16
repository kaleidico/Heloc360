import BlogHome from "@/components/blog/blog-home";
import { getAllBlogPosts } from "@/lib/contentful";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const revalidate = 86400;

type Props = {
	params: Promise<{ page: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { page } = await params;
	const pageNum = parseInt(page);

	if (pageNum === 1) {
		return {
			title: "HELOC360 Blog — Insights, Tips, and Smart Equity Strategies",
			description:
				"Explore the latest articles on HELOCs, home equity strategies, calculators, and expert tips to make informed decisions about your home's equity.",
			alternates: {
				canonical: "https://heloc360.com/blog",
			},
		};
	}

	return {
		title: `HELOC360 Blog — Page ${pageNum} | Insights, Tips, and Smart Equity Strategies`,
		description: `Page ${pageNum} of HELOC360 Blog: Explore the latest articles on HELOCs, home equity strategies, calculators, and expert tips to make informed decisions about your home's equity.`,
		alternates: {
			canonical: `https://heloc360.com/blog/page/${pageNum}`,
		},
	};
}

export default async function BlogPage({ params, searchParams }: Props) {
	const { page } = await params;
	const resolvedSearchParams = await searchParams;
	const pageNum = parseInt(page);

	// Validate page number
	if (isNaN(pageNum) || pageNum < 1) {
		notFound();
	}

	const posts = await getAllBlogPosts();

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
			initialPage={pageNum}
			initialSearch={search}
			initialCategory={category}
		/>
	);
}
