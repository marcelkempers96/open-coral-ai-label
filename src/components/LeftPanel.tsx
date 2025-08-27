'use client'
import { useApp } from '@/lib/store'

export function LeftPanel() {
  const { present, setOpacity, setCondition } = useApp()
  return (
    <div className="space-y-3 text-sm">
      <div>
        <div className="text-xs text-slate-600 mb-1">Opacity</div>
        <input type="range" min={0.1} max={1} step={0.05} value={present.opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} />
      </div>
      <div>
        <div className="text-xs text-slate-600 mb-1">Condition</div>
        <div className="flex gap-2">
          {(['healthy','bleached','dead'] as const).map((c) => (
            <label key={c} className="flex items-center gap-1">
              <input type="radio" name="cond" checked={present.condition === c} onChange={() => setCondition(c)} /> {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-slate-600 mb-1">Labels</div>
        <input className="border rounded px-2 py-1 w-full" placeholder="Search labels…" />
        <div className="text-slate-500 mt-2">Starter: Hard/Massive</div>
      </div>
    </div>
  )
}

