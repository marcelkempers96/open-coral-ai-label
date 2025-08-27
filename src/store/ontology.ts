import { create } from 'zustand'
import { db } from '@/lib/db'
import { uuid } from '@/lib/id'
import type { OntologyClass } from '@/lib/types'

type OntologyState = {
  classesByProject: Record<string, OntologyClass[]>
  isLoading: boolean
  load: (projectId: string) => Promise<void>
  addClass: (projectId: string, name: string, parentId?: string | null) => Promise<OntologyClass>
}

export const useOntology = create<OntologyState>((set, get) => ({
  classesByProject: {},
  isLoading: false,
  load: async (projectId) => {
    set({ isLoading: true })
    const items = await db.ontology.where('project_id').equals(projectId).toArray()
    const map = { ...get().classesByProject, [projectId]: items.sort((a, b) => a.order - b.order) }
    set({ classesByProject: map, isLoading: false })
  },
  addClass: async (projectId, name, parentId = null) => {
    const item: OntologyClass = { id: uuid(), project_id: projectId, name, parent_id: parentId, attributes: {}, order: Date.now() }
    await db.ontology.add(item)
    const dict = { ...get().classesByProject }
    dict[projectId] = [...(dict[projectId] ?? []), item]
    set({ classesByProject: dict })
    return item
  },
}))

