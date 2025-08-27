import { create } from 'zustand'
import { db } from '@/lib/db'
import { uuid } from '@/lib/id'
import type { Dataset, Project, Region, License } from '@/lib/types'

type ProjectsState = {
  projects: Project[]
  datasetsByProject: Record<string, Dataset[]>
  isLoading: boolean
  load: () => Promise<void>
  createProject: (p: {
    name: string
    description?: string
    region: Region
    license: License
  }) => Promise<Project>
  addDataset: (projectId: string, input: { name: string; source_uri?: string }) => Promise<Dataset>
  softDeleteDataset: (datasetId: string) => Promise<void>
  restoreDataset: (datasetId: string) => Promise<void>
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  datasetsByProject: {},
  isLoading: false,
  load: async () => {
    set({ isLoading: true })
    const [projects, datasets] = await Promise.all([db.projects.toArray(), db.datasets.toArray()])
    const map: Record<string, Dataset[]> = {}
    for (const d of datasets) {
      if (!map[d.project_id]) map[d.project_id] = []
      map[d.project_id].push(d)
    }
    set({ projects, datasetsByProject: map, isLoading: false })
  },
  createProject: async ({ name, description = '', region, license }) => {
    const now = Date.now()
    const project: Project = {
      id: uuid(),
      name,
      description,
      region,
      license,
      created_at: now,
      updated_at: now,
    }
    await db.projects.add(project)
    set({ projects: [...get().projects, project] })
    return project
  },
  addDataset: async (projectId, input) => {
    const dataset: Dataset = {
      id: uuid(),
      project_id: projectId,
      name: input.name,
      source_uri: input.source_uri ?? '',
      meta: {},
      created_at: Date.now(),
      deleted: false,
    }
    await db.datasets.add(dataset)
    const dict = { ...get().datasetsByProject }
    dict[projectId] = [...(dict[projectId] ?? []), dataset]
    set({ datasetsByProject: dict })
    return dataset
  },
  softDeleteDataset: async (datasetId) => {
    const ds = await db.datasets.get(datasetId)
    if (!ds) return
    await db.datasets.update(datasetId, { deleted: true })
    const dict = { ...get().datasetsByProject }
    dict[ds.project_id] = (dict[ds.project_id] ?? []).map((d) => (d.id === datasetId ? { ...d, deleted: true } : d))
    set({ datasetsByProject: dict })
  },
  restoreDataset: async (datasetId) => {
    const ds = await db.datasets.get(datasetId)
    if (!ds) return
    await db.datasets.update(datasetId, { deleted: false })
    const dict = { ...get().datasetsByProject }
    dict[ds.project_id] = (dict[ds.project_id] ?? []).map((d) => (d.id === datasetId ? { ...d, deleted: false } : d))
    set({ datasetsByProject: dict })
  },
}))

