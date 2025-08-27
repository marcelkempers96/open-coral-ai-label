"use client"
import { useEffect, useMemo, useState } from 'react'
import { useProjectsStore } from '@/store/projects'
import { useOntology } from '@/store/ontology'

export default function OntologyPage() {
  const { projects, load } = useProjectsStore()
  const [projectId, setProjectId] = useState<string>('')
  const { classesByProject, load: loadOnt, addClass } = useOntology()
  const items = classesByProject[projectId] ?? []

  useEffect(() => {
    load().then(() => {
      const first = projects[0]?.id
      if (first) {
        setProjectId(first)
        loadOnt(first)
      }
    })
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ontology</h2>
      <div className="flex gap-2 items-center">
        <label className="text-sm text-slate-600">Project:</label>
        <select className="border rounded px-2 py-1 text-sm" value={projectId} onChange={(e) => { setProjectId(e.target.value); loadOnt(e.target.value) }}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button className="border rounded px-2 py-1 text-sm hover:border-brand" onClick={async () => {
          const name = prompt('New class name?')
          if (!name || !projectId) return
          await addClass(projectId, name)
        }}>Add Class</button>
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((c) => (
          <li key={c.id} className="border rounded p-2">{c.name}</li>
        ))}
        {items.length === 0 && <li className="text-slate-500">No classes yet.</li>}
      </ul>
    </div>
  )
}

