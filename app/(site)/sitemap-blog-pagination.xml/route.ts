import { NextResponse } from 'next/server'

// Superseded by /sitemap.xml. Paginated blog index pages are deliberately not listed
// there — they canonicalise to /blog and offer nothing to index on their own.
// Redirects rather than 404s so any Search Console registration still resolves.
export function GET() {
  return NextResponse.redirect('https://heloc360.com/sitemap.xml', 301)
}
