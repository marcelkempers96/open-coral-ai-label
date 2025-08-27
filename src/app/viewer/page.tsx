"use client"
import { useEffect, useState } from 'react'
import { db } from '@/lib/db'
import { Controls } from '@/components/viewer/Controls'
import { ImageViewer } from '@/components/viewer/ImageViewer'
import { AnnoCanvas } from '@/components/viewer/AnnoCanvas'
import { useAnnotations } from '@/store/annotations'

export default function ViewerPage() {
  const [rowId, setRowId] = useState<string | null>(null)
  const [uri, setUri] = useState<string | null>(null)
  const [rows, setRows] = useState<{ id: string; uri: string }[]>([])
  const { tool, setTool } = useAnnotations()

  useEffect(() => {
    db.rows.toArray().then((all) => {
      setRows(all)
      if (all[0]) {
        setRowId(all[0].id)
        setUri(all[0].uri)
      }
    })
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Image Viewer</h2>
      <Controls />
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">Row:</label>
        <select className="border rounded px-2 py-1 text-sm" value={rowId ?? ''} onChange={(e) => { const id = e.target.value; setRowId(id); setUri(rows.find((r) => r.id === id)?.uri ?? null) }}>
          {rows.map((r) => (
            <option key={r.id} value={r.id}>{r.uri}</option>
          ))}
        </select>
      </div>
      {uri ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span>Tool:</span>
            <select className="border rounded px-2 py-1" value={tool} onChange={(e) => setTool(e.target.value as any)}>
              <option value="select">Select</option>
              <option value="point">Point</option>
              <option value="box">Box</option>
            </select>
          </div>
          <div className="relative">
            <ImageViewer src={uri} overlay={rowId ? <div className="absolute inset-0">
              <AnnoCanvas rowId={rowId} width={800} height={500} />
            </div> : undefined} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No data rows yet. Import URLs in Projects page.</p>
      )}
    </div>
  )
}

