import { NextResponse } from 'next/server'
import { getImages } from '@/lib/images'

export async function GET() {
  const imgs = await getImages()
  return NextResponse.json(imgs)
}

