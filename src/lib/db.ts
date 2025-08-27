import Dexie, { Table } from 'dexie'
import type { Annotation, ImageItem } from './types'

export interface StoredMask {
  id: string
  imageId: string
  rleCounts?: string
  rleW?: number
  rleH?: number
  pngDataUrl?: string
  bbox: [number, number, number, number]
  area: number
  confidence?: number
}

export interface AppSetting {
  key: string
  value: string
}

export class CoralDB extends Dexie {
  images!: Table<ImageItem, string>
  annotations!: Table<Annotation, string>
  masks!: Table<StoredMask, string>
  settings!: Table<AppSetting, string>

  constructor() {
    super('coral-label-lite')
    this.version(1).stores({
      images: 'id, filename',
      annotations: 'id, imageId, maskId, createdAt',
      masks: 'id, imageId',
      settings: 'key',
    })
  }
}

export const db = new CoralDB()

