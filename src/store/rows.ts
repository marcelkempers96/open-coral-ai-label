import { create } from 'zustand'
import { db } from '@/lib/db'
import { uuid } from '@/lib/id'
import type { DataRow } from '@/lib/types'

type RowsState = {
  rowsCountByDataset: Record<string, number>
  isLoading: boolean
  loadCounts: () => Promise<void>
  addRowsByUris: (datasetId: string, uris: string[]) => Promise<number>
  listByDataset: (datasetId: string, limit?: number, offset?: number) => Promise<DataRow[]>
}

export const useRowsStore = create<RowsState>((set, get) => ({
  rowsCountByDataset: {},
  isLoading: false,
  loadCounts: async () => {
    set({ isLoading: true })
    const all = await db.rows.toArray()
    const counts: Record<string, number> = {}
    for (const r of all) {
      counts[r.dataset_id] = (counts[r.dataset_id] ?? 0) + 1
    }
    set({ rowsCountByDataset: counts, isLoading: false })
  },
  addRowsByUris: async (datasetId, uris) => {
    const now = Date.now()
    const rows: DataRow[] = uris
      .map((u) => u.trim())
      .filter(Boolean)
      .map((uri) => ({ id: uuid(), dataset_id: datasetId, uri, width: 0, height: 0, meta: {} }))
    if (rows.length === 0) return 0
    await db.rows.bulkAdd(rows)
    const counts = { ...get().rowsCountByDataset }
    counts[datasetId] = (counts[datasetId] ?? 0) + rows.length
    set({ rowsCountByDataset: counts })
    return rows.length
  },
  listByDataset: async (datasetId, limit = 60, offset = 0) => {
    const coll = db.rows.where('dataset_id').equals(datasetId)
    const items = await coll.offset(offset).limit(limit).toArray()
    return items
  },
}))

