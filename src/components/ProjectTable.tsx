"use client"
import { useEffect, useMemo, useState } from 'react'
import { useProjectsStore } from '@/store/projects'
import { useRowsStore } from '@/store/rows'
import { useWorkflow } from '@/store/workflow'
import type { Region, License } from '@/lib/types'

export function ProjectTable() {
  const { projects, datasetsByProject, isLoading, load, createProject, addDataset, softDeleteDataset, restoreDataset } = useProjectsStore()
  const { rowsCountByDataset, loadCounts, addRowsByUris } = useRowsStore()
  const { countersByProject, load: loadWorkflow } = useWorkflow()
  const [form, setForm] = useState<{ name: string; description: string; region: Region; license: License }>({
    name: '',
    description: '',
    region: 'Caribbean',
    license: 'CC-BY',
  })

  useEffect(() => {
    load()
    loadCounts()
    loadWorkflow()
  }, [load, loadCounts, loadWorkflow])

  const rows = useMemo(() => {
    return projects.map((p) => {
      const datasets = datasetsByProject[p.id] ?? []
      const dataRows = (datasets ?? []).reduce((acc, d) => acc + (rowsCountByDataset[d.id] ?? 0), 0)
      const counters = countersByProject[p.id]
      const total = counters ? counters.to_label + counters.in_review + counters.rework + counters.done + counters.skipped : 0
      const completion = total > 0 ? Math.round(((counters?.done ?? 0) / total) * 100) : 0
      const labelsCount = 0
      return { p, datasets, dataRows, labelsCount, completion, counters }
    })
  }, [projects, datasetsByProject, rowsCountByDataset, countersByProject])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Projects</h2>
        <p className="text-sm text-slate-500">Create projects; attach datasets; view counts & completion.</p>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3 items-end"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!form.name.trim()) return
          await createProject(form)
          setForm({ name: '', description: '', region: 'Caribbean', license: 'CC-BY' })
        }}
      >
        <div>
          <label className="text-xs block">Name</label>
          <input className="w-full border rounded px-2 py-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs block">Description</label>
          <input className="w-full border rounded px-2 py-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label className="text-xs block">Region</label>
          <select className="w-full border rounded px-2 py-1" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as Region })}>
            <option>Caribbean</option>
            <option>IndoPacific</option>
            <option>RedSea</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs block">License</label>
          <select className="w-full border rounded px-2 py-1" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value as License })}>
            <option>CC-BY</option>
            <option>CC-BY-NC</option>
            <option>CC0</option>
            <option>Custom</option>
          </select>
        </div>
        <button className="bg-brand text-white rounded px-3 py-1" type="submit">Create</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Project</th>
              <th className="py-2 pr-4">Data Type</th>
              <th className="py-2 pr-4">Labels</th>
              <th className="py-2 pr-4">Data Rows</th>
              <th className="py-2 pr-4">Completion %</th>
              <th className="py-2 pr-4">Updated</th>
              <th className="py-2 pr-4">Datasets</th>
              <th className="py-2 pr-4">Workflow</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">Loading…</td>
              </tr>
            )}
            {rows.map(({ p, datasets, dataRows, labelsCount, completion, counters }) => (
              <tr key={p.id} className="border-b align-top">
                <td className="py-2 pr-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.region} · {p.license}</div>
                </td>
                <td className="py-2 pr-4">images</td>
                <td className="py-2 pr-4">{labelsCount}</td>
                <td className="py-2 pr-4">{dataRows}</td>
                <td className="py-2 pr-4">{completion}%</td>
                <td className="py-2 pr-4">{new Date(p.updated_at).toLocaleString()}</td>
                <td className="py-2 pr-4">
                  <DatasetList
                    projectId={p.id}
                    datasets={datasets}
                    onAdd={async (name) => addDataset(p.id, { name })}
                    onDelete={softDeleteDataset}
                    onRestore={restoreDataset}
                    onImportUrls={async (datasetId, text) => {
                      const count = await addRowsByUris(datasetId, text.split('\n'))
                      if (count > 0) alert(`Imported ${count} rows`)
                    }}
                  />
                </td>
                <td className="py-2 pr-4 text-xs text-slate-600">
                  {counters ? (
                    <div className="space-y-1">
                      <div>to_label: {counters.to_label}</div>
                      <div>in_review: {counters.in_review}</div>
                      <div>rework: {counters.rework}</div>
                      <div>done: {counters.done}</div>
                      <div>skipped: {counters.skipped}</div>
                    </div>
                  ) : (
                    <span>–</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DatasetList({ projectId, datasets, onAdd, onDelete, onRestore, onImportUrls }: { projectId: string; datasets: any[]; onAdd: (name: string) => Promise<any>; onDelete: (id: string) => Promise<void>; onRestore: (id: string) => Promise<void>; onImportUrls: (datasetId: string, text: string) => Promise<void> }) {
  const [name, setName] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [text, setText] = useState('')
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className="border rounded px-2 py-1 text-sm" placeholder="New dataset name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="border rounded px-2 py-1 text-sm hover:border-brand" onClick={async () => { if (!name.trim()) return; await onAdd(name.trim()); setName('') }}>Add</button>
      </div>
      <ul className="space-y-1">
        {datasets.map((d) => (
          <li key={d.id} className="text-sm border rounded p-2">
            <div className="flex items-center justify-between">
              <span className={d.deleted ? 'line-through text-slate-400' : ''}>{d.name}</span>
              <div className="flex gap-3 items-center">
                <span className="text-xs text-slate-500">{d.deleted ? 'deleted' : ''}</span>
                {!d.deleted && (
                  <button className="text-brand" onClick={() => setOpenId(openId === d.id ? null : d.id)}>Import URLs</button>
                )}
                {d.deleted ? (
                  <button className="text-brand" onClick={() => onRestore(d.id)}>Restore</button>
                ) : (
                  <button className="text-red-600" onClick={() => onDelete(d.id)}>Delete</button>
                )}
              </div>
            </div>
            {openId === d.id && (
              <div className="mt-2 space-y-2">
                <textarea className="w-full border rounded p-2 h-28" placeholder="Paste image URLs, one per line" value={text} onChange={(e) => setText(e.target.value)} />
                <div className="flex gap-2">
                  <button className="border rounded px-2 py-1" onClick={async () => { await onImportUrls(d.id, text); setText('') }}>Import</button>
                  <a className="text-xs text-slate-500 underline" href="/gallery">Open Gallery</a>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

