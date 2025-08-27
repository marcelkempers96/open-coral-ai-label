export type Condition = 'healthy' | 'bleached' | 'dead'
export type PointKind = 'pos' | 'neg'

export interface ClickPoint {
  x: number
  y: number
  kind: PointKind
}

export interface Mask {
  id: string
  rle?: { counts: string; size: [number, number] }
  pngDataUrl?: string
  bbox: [number, number, number, number]
  area: number
  confidence?: number
}

export interface LabelRef {
  path: string
}

export interface Annotation {
  id: string
  imageId: string
  maskId: string
  label: LabelRef
  condition: Condition
  createdAt: number
}

export interface ImageItem {
  id: string
  url: string
  width: number
  height: number
  filename: string
}

export interface Project {
  id: string
  name: string
  images: ImageItem[]
}

