import { getAllTeamMembers } from '@/lib/contentful'

export async function GET() {
  try {
    const teamMembers = await getAllTeamMembers()
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${teamMembers.map(member => `  <url>
    <loc>https://heloc360.com/meet-our-team/${member.slug}</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // Cache for 1 hour, CDN for 24 hours
      },
    })
  } catch (error) {
    console.error('Error generating team sitemap:', error)
    
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
