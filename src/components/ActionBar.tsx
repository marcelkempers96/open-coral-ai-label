'use client'
import { useApp } from '@/lib/store'

export function ActionBar() {
  const { present, resetClicks, confirmMask } = useApp()
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-2xl shadow px-3 py-2 bg-white text-black flex gap-2">
      <button className="border rounded px-3 py-1" onClick={() => { /* open label picker */ }}>Assign Label (C)</button>
      <button className="border rounded px-3 py-1" onClick={resetClicks}>Remove (X)</button>
      <button className="border rounded px-3 py-1" onClick={() => { /* mask mode (W) */ }}>Add Mask (W)</button>
      <button className="border rounded px-3 py-1" onClick={() => history.back()}>Back</button>
      <button className="border rounded px-3 py-1 bg-black text-white disabled:opacity-50" onClick={() => confirmMask({ path: 'hard/massive/UNKNOWN' })} disabled={!present.stagedMask}>Confirm</button>
    </div>
  )
}

