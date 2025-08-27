"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { db } from '@/lib/db'
import { useSlices } from '@/store/slices'

export default function GalleryPage() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<{ id: string; uri: string }[]>([])
  const { items: slices, load: loadSlices, save: saveSlice, remove: removeSlice } = useSlices()
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(0)
  const pageSize = 60
  const loader = useRef<HTMLDivElement | null>(null)

  const fetchPage = async (reset = false) => {
    const offset = reset ? 0 : pageRef.current * pageSize
    const all = await db.rows.toArray()
    const filtered = query.trim()
      ? all.filter((r) => r.uri.toLowerCase().includes(query.toLowerCase()))
      : all
    const slice = filtered.slice(offset, offset + pageSize)
    setRows((prev) => (reset ? slice : [...prev, ...slice]))
    setHasMore(offset + pageSize < filtered.length)
    pageRef.current = reset ? 1 : pageRef.current + 1
  }

  useEffect(() => {
    fetchPage(true)
    loadSlices()
  }, [loadSlices])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPage(false)
      }
    })
    if (loader.current) io.observe(loader.current)
    return () => io.disconnect()
  }, [hasMore])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    pageRef.current = 0
    fetchPage(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dataset Gallery</h2>
      <form className="flex gap-2" onSubmit={onSearch}>
        <input className="border rounded px-2 py-1 w-full max-w-md" placeholder="Search by URI contains…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="border rounded px-3 py-1 hover:border-brand" type="submit">Search</button>
        <button
          className="border rounded px-3 py-1 hover:border-brand"
          type="button"
          onClick={async () => {
            const name = prompt('Slice name?')
            if (!name) return
            await saveSlice(name, query)
            alert('Saved slice')
          }}
        >
          Save Slice
        </button>
      </form>
      {slices.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-slate-600">Slices:</span>
          {slices.map((s) => (
            <button
              key={s.id}
              className="border rounded px-2 py-1 hover:border-brand"
              onClick={() => {
                setQuery(s.query)
                pageRef.current = 0
                fetchPage(true)
              }}
              onAuxClick={() => removeSlice(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {rows.map((r) => (
          <figure key={r.id} className="aspect-square bg-slate-200/20 rounded border overflow-hidden group">
            <img src={r.uri} alt="row" className="w-full h-full object-cover" loading="lazy" />
            <a href={`/viewer`} className="hidden group-hover:block absolute bottom-1 right-1 text-xs bg-black/60 text-white px-2 py-0.5 rounded">Open</a>
          </figure>
        ))}
      </div>
      <div ref={loader} />
      {!hasMore && rows.length === 0 && (
        <p className="text-sm text-slate-500">No rows yet. Add a dataset and import URLs from the Projects page.</p>
      )}
    </div>
  )
}

