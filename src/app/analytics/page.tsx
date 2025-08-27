"use client"
import { useEffect, useState } from 'react'
import { db } from '@/lib/db'

export default function AnalyticsPage() {
  const [counts, setCounts] = useState<{ totalRows: number; totalAnnos: number } | null>(null)
  useEffect(() => {
    Promise.all([db.rows.count(), db.annotations.count()]).then(([r, a]) => setCounts({ totalRows: r, totalAnnos: a }))
  }, [])
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Analytics</h2>
      {counts ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <div className="text-sm text-slate-500">Data Rows</div>
            <div className="text-2xl font-semibold">{counts.totalRows}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-sm text-slate-500">Annotations</div>
            <div className="text-2xl font-semibold">{counts.totalAnnos}</div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Loading…</p>
      )}
    </div>
  )
}

