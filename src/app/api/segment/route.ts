import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const Body = z.object({
  imageUrl: z.string(),
  clicks: z.array(z.object({ x: z.number(), y: z.number(), kind: z.enum(['pos','neg']) })),
  sessionId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json())
  const endpoint = process.env.SEGMENT_ENDPOINT
  if (!endpoint) {
    // Return a trivial transparent mask placeholder for dev
    const empty = {
      pngDataUrl: undefined,
      rle: { counts: '', size: [1, 1] as [number, number] },
      bbox: [0, 0, 0, 0] as [number, number, number, number],
      area: 0,
      confidence: 0,
    }
    return NextResponse.json({ mask: empty, latencyMs: 0 })
  }
  const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.SEGMENT_TOKEN ?? ''}` }, body: JSON.stringify(body) })
  if (!r.ok) return NextResponse.json({ error: 'upstream failed' }, { status: 500 })
  const mask = await r.json()
  return NextResponse.json({ mask, latencyMs: r.headers.get('x-latency-ms') ?? null })
}

