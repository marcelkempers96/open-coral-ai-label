"use client"
import { usePrefs } from '@/store/prefs'

export function Controls() {
  const { brightness, contrast, dehaze, grid, setBrightness, setContrast, setDehaze, toggleGrid } = usePrefs()
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <LabeledSlider label="Brightness" value={brightness} min={0.5} max={2} step={0.01} onChange={setBrightness} />
      <LabeledSlider label="Contrast" value={contrast} min={0.5} max={2} step={0.01} onChange={setContrast} />
      <LabeledSlider label="Dehaze" value={dehaze} min={0} max={1} step={0.01} onChange={setDehaze} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={grid} onChange={toggleGrid} />
        Grid
      </label>
    </div>
  )
}

function LabeledSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="text-sm">
      <span className="mr-2 text-slate-600">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      <span className="ml-2 tabular-nums">{value.toFixed(2)}</span>
    </label>
  )
}

