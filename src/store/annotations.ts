import { create } from 'zustand'
import { db } from '@/lib/db'
import { uuid } from '@/lib/id'
import type { Annotation, GeometryType } from '@/lib/types'

type Tool = 'select' | 'point' | 'box' | 'polygon'

type AnnoState = {
  byRow: Record<string, Annotation[]>
  activeRowId: string | null
  tool: Tool
  setTool: (t: Tool) => void
  loadForRow: (rowId: string) => Promise<void>
  addAnnotation: (rowId: string, a: Partial<Annotation> & { geometry_type: GeometryType; geometry: any }) => Promise<Annotation>
  updateAnnotation: (id: string, updates: Partial<Annotation>) => Promise<void>
  deleteAnnotation: (id: string) => Promise<void>
}

export const useAnnotations = create<AnnoState>((set, get) => ({
  byRow: {},
  activeRowId: null,
  tool: 'select',
  setTool: (t) => set({ tool: t }),
  loadForRow: async (rowId) => {
    const items = await db.annotations.where('data_row_id').equals(rowId).toArray()
    const dict = { ...get().byRow, [rowId]: items }
    set({ byRow: dict, activeRowId: rowId })
  },
  addAnnotation: async (rowId, a) => {
    const now = Date.now()
    const anno: Annotation = {
      id: uuid(),
      data_row_id: rowId,
      author_id: uuid(),
      class_id: a.class_id ?? '00000000-0000-0000-0000-000000000000',
      geometry_type: a.geometry_type,
      geometry: a.geometry,
      attributes: a.attributes ?? {},
      confidence: a.confidence,
      area_cm2: a.area_cm2,
      perimeter_cm: a.perimeter_cm,
      created_at: now,
      updated_at: now,
      version: 1,
      state: a.state ?? 'draft',
    }
    await db.annotations.add(anno)
    const dict = { ...get().byRow }
    dict[rowId] = [...(dict[rowId] ?? []), anno]
    set({ byRow: dict })
    return anno
  },
  updateAnnotation: async (id, updates) => {
    const existing = await db.annotations.get(id)
    if (!existing) return
    const merged = { ...existing, ...updates, updated_at: Date.now() }
    await db.annotations.put(merged)
    const dict = { ...get().byRow }
    const list = dict[existing.data_row_id] ?? []
    dict[existing.data_row_id] = list.map((a) => (a.id === id ? merged : a))
    set({ byRow: dict })
  },
  deleteAnnotation: async (id) => {
    const existing = await db.annotations.get(id)
    if (!existing) return
    await db.annotations.delete(id)
    const dict = { ...get().byRow }
    dict[existing.data_row_id] = (dict[existing.data_row_id] ?? []).filter((a) => a.id !== id)
    set({ byRow: dict })
  },
}))

