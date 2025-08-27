'use client'
import { useEffect, useMemo } from 'react'
import { Stage, Layer, Image as KImage, Circle, Group } from 'react-konva'
import useImage from 'use-image'
import { useMutation } from '@tanstack/react-query'
import { useApp } from '@/lib/store'
import type { ClickPoint, Mask } from '@/lib/types'
import { requestMask } from '@/lib/segmentation'

export default function CanvasStage({ imageUrl, w, h }: { imageUrl: string; w: number; h: number }) {
  const { present, addClick, setStagedMask } = useApp()
  const [img] = useImage(imageUrl, 'anonymous')
  const { mutate } = useMutation({ mutationFn: () => requestMask(imageUrl, present.clicks), onSuccess: (m) => setStagedMask(m) })

  useEffect(() => { if (present.clicks.length) mutate() }, [present.clicks])

  const overlay = useMemo(() => {
    if (!present.stagedMask?.pngDataUrl) return null
    return new window.Image()
  }, [present.stagedMask?.pngDataUrl])

  useEffect(() => { if (overlay && present.stagedMask?.pngDataUrl) overlay.src = present.stagedMask.pngDataUrl }, [overlay, present.stagedMask?.pngDataUrl])

  return (
    <Stage width={w} height={h} draggable>
      <Layer>
        {img && <KImage image={img} width={w} height={h} />}
        {overlay && (
          <KImage image={overlay} width={w} height={h} opacity={useApp.getState().present.opacity} />
        )}
        <Group>
          {present.clicks.map((p, i) => (
            <Circle key={i} x={p.x} y={p.y} radius={5} fill={p.kind === 'pos' ? 'lime' : 'red'} />
          ))}
        </Group>
      </Layer>
      <Layer
        listening
        onMouseDown={(e) => {
          const pos = e.target.getStage()?.getPointerPosition()
          if (!pos) return; const kind = (e.evt as MouseEvent).shiftKey ? 'neg' : 'pos'
          addClick({ x: pos.x, y: pos.y, kind } as ClickPoint)
        }}
      />
    </Stage>
  )
}

