"use client"
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useAnnotations } from '@/store/annotations'

const Stage = dynamic(() => import('react-konva').then((m) => m.Stage), { ssr: false }) as any
const Layer = dynamic(() => import('react-konva').then((m) => m.Layer), { ssr: false }) as any
const Rect = dynamic(() => import('react-konva').then((m) => m.Rect), { ssr: false }) as any
const Circle = dynamic(() => import('react-konva').then((m) => m.Circle), { ssr: false }) as any

export function AnnoCanvas({ rowId, width, height }: { rowId: string; width: number; height: number }) {
  const { byRow, loadForRow, addAnnotation, tool } = useAnnotations()
  const annos = byRow[rowId] ?? []
  const [start, setStart] = useState<{ x: number; y: number } | null>(null)
  const polyRef = useRef<{ points: number[] } | null>(null)

  useEffect(() => {
    loadForRow(rowId)
  }, [rowId, loadForRow])

  return (
    <Stage width={width} height={height} onMouseDown={(e: any) => {
      const pos = e.target.getStage()?.getPointerPosition()
      if (!pos) return
      if (tool === 'point') {
        addAnnotation(rowId, { geometry_type: 'point', geometry: { x: pos.x, y: pos.y } })
      } else if (tool === 'box') {
        setStart({ x: pos.x, y: pos.y })
      } else if (tool === 'polygon') {
        const list = polyRef.current?.points ?? []
        polyRef.current = { points: [...list, pos.x, pos.y] }
      }
    }} onMouseUp={(e: any) => {
      if (tool === 'box' && start) {
        const pos = e.target.getStage()?.getPointerPosition(); if (!pos) return
        const x = Math.min(start.x, pos.x)
        const y = Math.min(start.y, pos.y)
        const w = Math.abs(pos.x - start.x)
        const h = Math.abs(pos.y - start.y)
        if (w > 2 && h > 2) addAnnotation(rowId, { geometry_type: 'box', geometry: { x, y, w, h } })
        setStart(null)
      } else if (tool === 'polygon' && polyRef.current && polyRef.current.points.length >= 6) {
        // double-click to finalize
      }
    }}>
      <Layer>
        {annos.map((a) => {
          if (a.geometry_type === 'point') {
            return <Circle key={a.id} x={a.geometry.x} y={a.geometry.y} radius={4} fill="#22c55e" />
          }
          if (a.geometry_type === 'box') {
            return <Rect key={a.id} x={a.geometry.x} y={a.geometry.y} width={a.geometry.w} height={a.geometry.h} stroke="#22c55e" strokeWidth={2} />
          }
          return null
        })}
        {tool === 'box' && start && (
          <Rect x={start.x} y={start.y} width={1} height={1} stroke="#22c55e" strokeWidth={1} />
        )}
      </Layer>
    </Stage>
  )
}

