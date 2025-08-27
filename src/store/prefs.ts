import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ViewerPrefs = {
  brightness: number
  contrast: number
  dehaze: number
  grid: boolean
}

type PrefsState = ViewerPrefs & {
  setBrightness: (v: number) => void
  setContrast: (v: number) => void
  setDehaze: (v: number) => void
  toggleGrid: () => void
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      brightness: 1,
      contrast: 1,
      dehaze: 0,
      grid: false,
      setBrightness: (v) => set({ brightness: v }),
      setContrast: (v) => set({ contrast: v }),
      setDehaze: (v) => set({ dehaze: v }),
      toggleGrid: () => set((s) => ({ grid: !s.grid })),
    }),
    { name: 'viewer-prefs' }
  )
)

