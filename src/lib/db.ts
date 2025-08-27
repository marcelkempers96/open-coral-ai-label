import Dexie, { Table } from 'dexie'
import type {
  Annotation,
  DataRow,
  Dataset,
  Issue,
  ModelRun,
  OntologyClass,
  Project,
  Review,
  WorkflowState,
} from './types'

export class CoralDB extends Dexie {
  projects!: Table<Project, string>
  datasets!: Table<Dataset, string>
  rows!: Table<DataRow, string>
  ontology!: Table<OntologyClass, string>
  annotations!: Table<Annotation, string>
  reviews!: Table<Review, string>
  issues!: Table<Issue, string>
  workflow!: Table<WorkflowState, string>
  model_runs!: Table<ModelRun, string>
  slices!: Table<{ id: string; name: string; query: string; dataset_id?: string | null; created_at: number }, string>

  constructor() {
    super('open-coral-ai')
    this.version(1).stores({
      projects: 'id, name, region, updated_at',
      datasets: 'id, project_id, name, created_at, deleted',
      rows: 'id, dataset_id, uri',
      ontology: 'id, project_id, parent_id, order',
      annotations: 'id, data_row_id, class_id, updated_at',
      reviews: 'id, annotation_id, created_at',
      issues: 'id, data_row_id, status, created_at',
      workflow: 'data_row_id, status, updated_at',
      model_runs: 'id, model_name, version, created_at',
    })
    this.version(2).stores({
      slices: 'id, dataset_id, created_at',
    })
  }
}

export const db = new CoralDB()

