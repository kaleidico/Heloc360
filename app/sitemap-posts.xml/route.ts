import { getAllBlogPosts } from '@/lib/contentful'

export async function GET() {
  try {
    const posts = await getAllBlogPosts()
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.map(post => `  <url>
    <loc>https://heloc360.com/blog/${post.slug}</loc>
    <lastmod>${new Date(post.publishedDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // Cache for 1 hour, CDN for 24 hours
      },
    })
  } catch (error) {
    console.error('Error generating posts sitemap:', error)
    
    // Return empty sitemap on error
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`
    
    return new Response(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
}
