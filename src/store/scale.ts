import { create } from 'zustand'
import { db } from '@/lib/db'

type ScaleStore = {
  // pixels per cm for a row
  byRow: Record<string, number>
  setForRow: (rowId: string, pxPerCm: number) => Promise<void>
  getForRow: (rowId: string) => number | undefined
}

export const useScale = create<ScaleStore>((set, get) => ({
  byRow: {},
  setForRow: async (rowId, pxPerCm) => {
    const row = await db.rows.get(rowId)
    if (row) {
      const meta = { ...(row.meta || {}), scale_px_per_cm: pxPerCm }
      await db.rows.put({ ...row, meta })
    }
    set({ byRow: { ...get().byRow, [rowId]: pxPerCm } })
  },
  getForRow: (rowId) => get().byRow[rowId],
}))

