import BlogHome from "@/components/blog/blog-home";
import { getBlogCards } from "@/lib/sanity/api";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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

	// Extract filter parameters from URL
	const search = resolvedSearchParams?.search
		? (resolvedSearchParams.search as string)
		: "";
	const category = resolvedSearchParams?.category
		? (resolvedSearchParams.category as string)
		: "";

	// Filtered and paginated in Sanity.
	const listing = await getBlogCards({ page: pageNum, search, category });

	// A page past the end is a 404, not an empty grid.
	if (pageNum > listing.totalPages) {
		notFound();
	}

	return (
		<BlogHome
			posts={listing.posts}
			totalPosts={listing.total}
			totalPages={listing.totalPages}
			initialPage={pageNum}
			initialSearch={search}
			initialCategory={category}
		/>
	);
}
