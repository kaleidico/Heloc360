import { getAllBlogPosts } from "@/lib/contentful";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const posts = await getAllBlogPosts();
		const POSTS_PER_PAGE = 12;
		const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

		const currentDate = new Date().toISOString().split("T")[0];

		let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Blog pagination pages -->
  <url>
    <loc>https://heloc360.com/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

		// Generate pagination pages (page 2 onwards)
		for (let page = 2; page <= totalPages; page++) {
			sitemap += `
  <url>
    <loc>https://heloc360.com/blog/page/${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
		}

		sitemap += `
</urlset>`;

		return new NextResponse(sitemap, {
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
			},
		});
	} catch (error) {
		console.error("Error generating blog pagination sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
