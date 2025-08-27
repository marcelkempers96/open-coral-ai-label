import { z } from 'zod'

export const RegionEnum = z.enum(['Caribbean', 'IndoPacific', 'RedSea', 'Other'])
export type Region = z.infer<typeof RegionEnum>

export const LicenseEnum = z.enum(['CC-BY', 'CC-BY-NC', 'CC0', 'Custom'])
export type License = z.infer<typeof LicenseEnum>

export const GeometryTypeEnum = z.enum(['point', 'box', 'polygon', 'mask'])
export type GeometryType = z.infer<typeof GeometryTypeEnum>

export const AnnotationStateEnum = z.enum(['draft', 'final'])
export type AnnotationState = z.infer<typeof AnnotationStateEnum>

export const ReviewDecisionEnum = z.enum(['approved', 'rejected'])
export type ReviewDecision = z.infer<typeof ReviewDecisionEnum>

export const IssueStatusEnum = z.enum(['open', 'in_progress', 'resolved'])
export type IssueStatus = z.infer<typeof IssueStatusEnum>

export const WorkflowStatusEnum = z.enum([
  'to_label',
  'in_review',
  'rework',
  'done',
  'skipped',
])
export type WorkflowStatus = z.infer<typeof WorkflowStatusEnum>

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().default(''),
  region: RegionEnum,
  license: LicenseEnum,
  created_at: z.number(), // epoch ms
  updated_at: z.number(),
})
export type Project = z.infer<typeof ProjectSchema>

export const DatasetSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string(),
  source_uri: z.string().default(''),
  meta: z.record(z.any()).default({}),
  created_at: z.number(),
  deleted: z.boolean().default(false),
})
export type Dataset = z.infer<typeof DatasetSchema>

export const DataRowSchema = z.object({
  id: z.string().uuid(),
  dataset_id: z.string().uuid(),
  uri: z.string(),
  width: z.number().int().nonnegative().default(0),
  height: z.number().int().nonnegative().default(0),
  captured_at: z.number().optional(),
  site: z.string().optional(),
  quadrat_size_cm: z.number().optional(),
  meta: z.record(z.any()).default({}),
})
export type DataRow = z.infer<typeof DataRowSchema>

export const OntologyClassSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string(),
  parent_id: z.string().uuid().nullable().optional(),
  attributes: z.record(z.any()).default({}),
  order: z.number().int().default(0),
})
export type OntologyClass = z.infer<typeof OntologyClassSchema>

export const AnnotationSchema = z.object({
  id: z.string().uuid(),
  data_row_id: z.string().uuid(),
  author_id: z.string().uuid(),
  class_id: z.string().uuid(),
  geometry_type: GeometryTypeEnum,
  geometry: z.record(z.any()),
  attributes: z.record(z.any()).default({}),
  confidence: z.number().optional(),
  area_cm2: z.number().optional(),
  perimeter_cm: z.number().optional(),
  created_at: z.number(),
  updated_at: z.number(),
  version: z.number().int().default(1),
  state: AnnotationStateEnum,
})
export type Annotation = z.infer<typeof AnnotationSchema>

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  annotation_id: z.string().uuid(),
  reviewer_id: z.string().uuid(),
  decision: ReviewDecisionEnum,
  notes: z.string().default(''),
  created_at: z.number(),
})
export type Review = z.infer<typeof ReviewSchema>

export const IssueSchema = z.object({
  id: z.string().uuid(),
  data_row_id: z.string().uuid(),
  title: z.string(),
  body: z.string().default(''),
  status: IssueStatusEnum,
  assignee_id: z.string().uuid().optional(),
  created_at: z.number(),
})
export type Issue = z.infer<typeof IssueSchema>

export const WorkflowStateSchema = z.object({
  data_row_id: z.string().uuid(),
  status: WorkflowStatusEnum,
  assigned_to: z.string().uuid().optional(),
  updated_at: z.number(),
})
export type WorkflowState = z.infer<typeof WorkflowStateSchema>

export const ModelRunSchema = z.object({
  id: z.string().uuid(),
  model_name: z.string(),
  version: z.string(),
  params: z.record(z.any()).default({}),
  input_slice: z.record(z.any()).default({}),
  outputs_uri: z.string().default(''),
  created_at: z.number(),
})
export type ModelRun = z.infer<typeof ModelRunSchema>

export const SliceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  query: z.string().default(''),
  dataset_id: z.string().uuid().nullable().optional(),
  created_at: z.number(),
})
export type Slice = z.infer<typeof SliceSchema>

