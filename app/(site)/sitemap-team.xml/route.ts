import { NextResponse } from 'next/server'

// Superseded by the generated sitemap at /sitemap.xml, which already lists every team
// member page. Redirects rather than 404s so any Search Console registration still resolves.
export function GET() {
  return NextResponse.redirect('https://heloc360.com/sitemap.xml', 301)
}
