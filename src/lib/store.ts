import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { immer } from 'zustand/middleware/immer'
import type { Annotation, ClickPoint, Condition, ImageItem, LabelRef, Mask } from './types'

interface History<T> { past: T[]; present: T; future: T[] }
interface PresentState {
  image?: ImageItem
  clicks: ClickPoint[]
  stagedMask?: Mask
  annotations: Annotation[]
  opacity: number
  condition: Condition
}

interface AppState extends History<PresentState> {
  setImage: (img: ImageItem) => void
  addClick: (p: ClickPoint) => void
  setStagedMask: (m?: Mask) => void
  confirmMask: (label: LabelRef) => void
  undo: () => void
  redo: () => void
  resetClicks: () => void
  setOpacity: (v: number) => void
  setCondition: (c: Condition) => void
}

const initial: PresentState = { clicks: [], annotations: [], opacity: 0.5, condition: 'healthy' }

function commit<S>(s: History<S>, next: S): History<S> {
  return { past: [...s.past, s.present], present: next, future: [] }
}

export const useApp = create<AppState>()(immer((set, get) => ({
  past: [], present: initial, future: [],
  setImage: (img) => set((s) => { s.present.image = img }),
  addClick: (p) => set((s) => { s.present.clicks.push(p) }),
  resetClicks: () => set((s) => { s.present.clicks = []; s.present.stagedMask = undefined }),
  setStagedMask: (m) => set((s) => { s.present.stagedMask = m }),
  confirmMask: (label) => set((state) => {
    const p = state.present; if (!p.image || !p.stagedMask) return
    const ann: Annotation = {
      id: nanoid(), imageId: p.image.id, maskId: p.stagedMask.id,
      label, condition: p.condition, createdAt: Date.now(),
    }
    const next: PresentState = { ...p, annotations: [...p.annotations, ann], clicks: [], stagedMask: undefined }
    const hist = commit<PresentState>(state, next); state.past = hist.past; state.present = hist.present; state.future = hist.future
  }),
  undo: () => set((s) => { const prev = s.past.pop(); if (!prev) return; s.future.unshift(s.present as any); s.present = prev }),
  redo: () => set((s) => { const next = s.future.shift(); if (!next) return; s.past.push(s.present as any); s.present = next }),
  setOpacity: (v) => set((s) => { s.present.opacity = v }),
  setCondition: (c) => set((s) => { s.present.condition = c }),
})))

