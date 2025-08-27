import { NextResponse } from 'next/server'
import { starterTaxonomy } from '@/lib/taxonomy'

export async function GET() {
  return NextResponse.json(starterTaxonomy)
}

