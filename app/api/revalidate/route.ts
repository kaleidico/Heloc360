import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TAG_BY_TYPE: Record<string, 'post' | 'team' | 'page'> = {
  blogPost: 'post',
  teamMember: 'team',
  page: 'page',
}

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false
  // Sanity sends `t=<timestamp>,v1=<base64url>` per their HMAC-SHA256 webhook spec
  // (matches @sanity/webhook's isValidSignature — base64url digest, not hex).
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const idx = p.indexOf('=')
      return idx === -1 ? [p, ''] : [p.slice(0, idx), p.slice(idx + 1)]
    }),
  ) as { t?: string; v1?: string }
  const ts = parts.t
  const sig = parts.v1
  if (!ts || !sig) return false

  const expected = createHmac('sha256', secret).update(`${ts}.${rawBody}`).digest('base64url')
  const a = Buffer.from(expected, 'base64url')
  const b = Buffer.from(sig, 'base64url')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET not set; rejecting webhook')
    return NextResponse.json({ ok: false, error: 'secret not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const sigHeader = req.headers.get('sanity-webhook-signature')

  if (!verifySignature(rawBody, sigHeader, secret)) {
    console.warn('Sanity webhook signature verification failed')
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let body: { _type?: string; _id?: string; ids?: { created?: string[]; updated?: string[]; deleted?: string[] } }
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  // Sanity GROQ-powered webhook payloads carry _type at the top level when filter is per-type.
  const type = body._type
  const tag = type ? TAG_BY_TYPE[type] : undefined

  if (tag) {
    revalidateTag(tag)
    console.log(`revalidated tag '${tag}' for ${type} ${body._id || '(no id)'}`)
    return NextResponse.json({ ok: true, tag, type, id: body._id })
  }

  // If the filter is broader, revalidate all three tags as a safe default.
  revalidateTag('post')
  revalidateTag('team')
  revalidateTag('page')
  console.log('revalidated post + team + page tags (no _type in payload)')
  return NextResponse.json({ ok: true, revalidated: ['post', 'team', 'page'] })
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'sanity revalidate webhook receiver' })
}
