import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/lib/contentful'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const posts = await getAllBlogPosts()
    return NextResponse.json({
      count: posts.length,
      sample: posts.slice(0, 5),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}


