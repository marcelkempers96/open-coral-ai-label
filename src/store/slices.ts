import { create } from 'zustand'
import { db } from '@/lib/db'
import { uuid } from '@/lib/id'
import type { Slice } from '@/lib/types'

type SlicesState = {
  items: Slice[]
  isLoading: boolean
  load: () => Promise<void>
  save: (name: string, query: string, datasetId?: string | null) => Promise<Slice>
  remove: (id: string) => Promise<void>
}

export const useSlices = create<SlicesState>((set, get) => ({
  items: [],
  isLoading: false,
  load: async () => {
    set({ isLoading: true })
    const items = (await db.slices.toArray()) as unknown as Slice[]
    set({ items, isLoading: false })
  },
  save: async (name, query, datasetId = null) => {
    const item: Slice = { id: uuid(), name, query, dataset_id: datasetId, created_at: Date.now() }
    await db.slices.add(item as any)
    set({ items: [...get().items, item] })
    return item
  },
  remove: async (id) => {
    await db.slices.delete(id)
    set({ items: get().items.filter((s) => s.id !== id) })
  },
}))

