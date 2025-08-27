import type { ImageItem } from './types'

const samples: ImageItem[] = [
  { id: 'sample-1', url: '/samples/coral1.svg', width: 1280, height: 720, filename: 'coral1.svg' },
  { id: 'sample-2', url: '/samples/coral2.svg', width: 1280, height: 720, filename: 'coral2.svg' },
  { id: 'sample-3', url: '/samples/coral3.svg', width: 1280, height: 720, filename: 'coral3.svg' },
]

export async function getImages(): Promise<ImageItem[]> {
  return samples
}

export async function getImageById(id: string): Promise<ImageItem> {
  const found = samples.find((i) => i.id === id)
  if (!found) throw new Error('Image not found')
  return found
}

