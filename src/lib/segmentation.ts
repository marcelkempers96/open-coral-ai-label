import type { ClickPoint, Mask } from './types'

export async function requestMask(imageUrl: string, clicks: ClickPoint[]): Promise<Mask> {
  const res = await fetch('/api/segment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, clicks }),
  })
  if (!res.ok) throw new Error('segmentation failed')
  const j = await res.json()
  return { id: crypto.randomUUID(), ...j.mask } as Mask
}

