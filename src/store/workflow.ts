import { create } from 'zustand'
import { db } from '@/lib/db'
import type { WorkflowStatus } from '@/lib/types'

type Counters = {
  to_label: number
  in_review: number
  rework: number
  done: number
  skipped: number
  issues: number
}

type WorkflowStateStore = {
  byRow: Record<string, WorkflowStatus>
  countersByProject: Record<string, Counters>
  load: () => Promise<void>
  getStatus: (rowId: string) => WorkflowStatus
  setStatus: (rowId: string, status: WorkflowStatus) => Promise<void>
  recomputeCounters: () => Promise<void>
}

const emptyCounters = (): Counters => ({ to_label: 0, in_review: 0, rework: 0, done: 0, skipped: 0, issues: 0 })

export const useWorkflow = create<WorkflowStateStore>((set, get) => ({
  byRow: {},
  countersByProject: {},
  load: async () => {
    const rows = await db.rows.toArray()
    const wf = await db.workflow.toArray()
    const byRow: Record<string, WorkflowStatus> = {}
    for (const s of wf) byRow[s.data_row_id] = s.status
    // default any rows without state to to_label
    for (const r of rows) if (!byRow[r.id]) byRow[r.id] = 'to_label'
    set({ byRow })
    await get().recomputeCounters()
  },
  getStatus: (rowId) => get().byRow[rowId] ?? 'to_label',
  setStatus: async (rowId, status) => {
    const existing = await db.workflow.get(rowId)
    if (existing) await db.workflow.put({ ...existing, status, updated_at: Date.now() })
    else await db.workflow.add({ data_row_id: rowId, status, updated_at: Date.now() })
    set({ byRow: { ...get().byRow, [rowId]: status } })
    await get().recomputeCounters()
  },
  recomputeCounters: async () => {
    const [rows, datasets] = await Promise.all([db.rows.toArray(), db.datasets.toArray()])
    const datasetToProject: Record<string, string> = {}
    for (const d of datasets) datasetToProject[d.id] = d.project_id
    const byProject: Record<string, Counters> = {}
    const byRow = get().byRow
    for (const r of rows) {
      const projectId = datasetToProject[r.dataset_id]
      if (!projectId) continue
      const counters = (byProject[projectId] ??= emptyCounters())
      const status = byRow[r.id] ?? 'to_label'
      if (status in counters) {
        ;(counters as any)[status]++
      }
    }
    set({ countersByProject: byProject })
  },
}))

