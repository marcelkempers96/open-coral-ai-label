"use client"
import { db } from '@/lib/db'
import { downloadCSV, downloadJSON } from '@/lib/download'

export default function ExportsPage() {
  async function exportRowsCSV() {
    const rows = await db.rows.toArray()
    const csv = [['id', 'dataset_id', 'uri', 'width', 'height']]
    for (const r of rows) csv.push([r.id, r.dataset_id, r.uri, String(r.width), String(r.height)])
    downloadCSV('rows.csv', csv)
  }
  async function exportAnnotationsJSON() {
    const annos = await db.annotations.toArray()
    downloadJSON('annotations.json', annos)
  }
  async function exportGeoJSON() {
    const annos = await db.annotations.toArray()
    const features = annos
      .filter((a) => a.geometry_type === 'box' || a.geometry_type === 'point')
      .map((a) => {
        if (a.geometry_type === 'point') return { type: 'Feature', geometry: { type: 'Point', coordinates: [a.geometry.x, a.geometry.y] }, properties: { id: a.id, class_id: a.class_id } }
        return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[a.geometry.x, a.geometry.y], [a.geometry.x + a.geometry.w, a.geometry.y], [a.geometry.x + a.geometry.w, a.geometry.y + a.geometry.h], [a.geometry.x, a.geometry.y + a.geometry.h], [a.geometry.x, a.geometry.y]]] }, properties: { id: a.id, class_id: a.class_id } }
      })
    const fc = { type: 'FeatureCollection', features }
    downloadJSON('annotations.geojson', fc)
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Exports</h2>
      <div className="flex flex-wrap gap-2">
        <button className="border rounded px-3 py-1" onClick={exportRowsCSV}>Export Rows CSV</button>
        <button className="border rounded px-3 py-1" onClick={exportAnnotationsJSON}>Export Annotations JSON</button>
        <button className="border rounded px-3 py-1" onClick={exportGeoJSON}>Export GeoJSON</button>
      </div>
    </div>
  )
}

