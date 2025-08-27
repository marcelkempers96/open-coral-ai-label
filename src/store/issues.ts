import { create } from 'zustand'
import { db } from '@/lib/db'
import { uuid } from '@/lib/id'
import type { Issue, IssueStatus } from '@/lib/types'

type IssuesStore = {
  byRow: Record<string, Issue[]>
  loadForRow: (rowId: string) => Promise<void>
  create: (rowId: string, title: string, body?: string) => Promise<Issue>
  setStatus: (id: string, status: IssueStatus) => Promise<void>
}

export const useIssues = create<IssuesStore>((set, get) => ({
  byRow: {},
  loadForRow: async (rowId) => {
    const items = await db.issues.where('data_row_id').equals(rowId).toArray()
    set({ byRow: { ...get().byRow, [rowId]: items } })
  },
  create: async (rowId, title, body = '') => {
    const item: Issue = { id: uuid(), data_row_id: rowId, title, body, status: 'open', created_at: Date.now() }
    await db.issues.add(item)
    set({ byRow: { ...get().byRow, [rowId]: [...(get().byRow[rowId] ?? []), item] } })
    return item
  },
  setStatus: async (id, status) => {
    const found = await db.issues.get(id)
    if (!found) return
    await db.issues.put({ ...found, status })
    const list = (get().byRow[found.data_row_id] ?? []).map((i) => (i.id === id ? { ...i, status } : i))
    set({ byRow: { ...get().byRow, [found.data_row_id]: list } })
  },
}))

