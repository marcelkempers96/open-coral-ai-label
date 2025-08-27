export function downloadBlob(filename: string, data: Blob) {
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadJSON(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  downloadBlob(filename, blob)
}

export function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((v) => JSON.stringify(v ?? '')).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  downloadBlob(filename, blob)
}

