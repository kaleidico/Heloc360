import { NextResponse } from 'next/server'

// Superseded by the generated sitemap at /sitemap.xml, which already lists every post.
// Kept as a redirect rather than deleted: this URL may still be registered in Search
// Console, and Google follows redirects for sitemaps but reports a 404 as an error.
export function GET() {
  return NextResponse.redirect('https://heloc360.com/sitemap.xml', 301)
}
