'use client'

export function ZoomPad() {
  return (
    <div className="flex flex-col items-center gap-2">
      <button className="border rounded w-8 h-8">+</button>
      <button className="border rounded w-8 h-8">-</button>
      <button className="border rounded w-12 h-8 text-xs">Fit</button>
      <button className="border rounded w-12 h-8 text-xs">1:1</button>
    </div>
  )
}

