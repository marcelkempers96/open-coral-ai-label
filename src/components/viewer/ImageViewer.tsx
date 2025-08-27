"use client"
import { useMemo, useRef, useState } from 'react'
import { usePrefs } from '@/store/prefs'

export function ImageViewer({ src, overlay }: { src: string; overlay?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const { brightness, contrast, dehaze, grid } = usePrefs()

  const filter = useMemo(() => {
    const saturate = 1 + dehaze * 0.5
    const contrastAdj = contrast + dehaze * 0.2
    return `brightness(${brightness}) contrast(${contrastAdj}) saturate(${saturate})`
  }, [brightness, contrast, dehaze])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[60vh] md:h-[70vh] border rounded overflow-hidden bg-black"
      onWheel={(e) => {
        e.preventDefault()
        const delta = -e.deltaY
        const factor = delta > 0 ? 1.1 : 0.9
        setZoom((z) => Math.max(0.1, Math.min(10, z * factor)))
      }}
      onMouseDown={(e) => {
        const start = { x: e.clientX, y: e.clientY }
        const startOffset = { ...offset }
        const onMove = (ev: MouseEvent) => {
          setOffset({ x: startOffset.x + (ev.clientX - start.x), y: startOffset.y + (ev.clientY - start.y) })
        }
        const onUp = () => {
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('mouseup', onUp)
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <img src={src} className="max-w-none select-none" alt="viewer" style={{ filter }} />
      </div>
      {grid && <GridOverlay />}
      {overlay}
    </div>
  )
}

function GridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
  )
}

