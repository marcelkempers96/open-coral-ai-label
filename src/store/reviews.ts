import { create } from 'zustand'
import { db } from '@/lib/db'
import { uuid } from '@/lib/id'
import type { Review, ReviewDecision } from '@/lib/types'

type ReviewsStore = {
  byAnnotation: Record<string, Review[]>
  loadForAnnotation: (annotationId: string) => Promise<void>
  add: (annotationId: string, decision: ReviewDecision, notes?: string) => Promise<Review>
}

export const useReviews = create<ReviewsStore>((set, get) => ({
  byAnnotation: {},
  loadForAnnotation: async (annotationId) => {
    const items = await db.reviews.where('annotation_id').equals(annotationId).toArray()
    set({ byAnnotation: { ...get().byAnnotation, [annotationId]: items } })
  },
  add: async (annotationId, decision, notes = '') => {
    const review: Review = { id: uuid(), annotation_id: annotationId, reviewer_id: uuid(), decision, notes, created_at: Date.now() }
    await db.reviews.add(review)
    set({ byAnnotation: { ...get().byAnnotation, [annotationId]: [...(get().byAnnotation[annotationId] ?? []), review] } })
    return review
  },
}))

