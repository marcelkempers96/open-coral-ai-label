export default function HomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/projects" className="rounded border p-4 hover:border-brand">
          <div className="text-sm text-slate-500 mb-1">Manage</div>
          <div className="text-lg font-medium">Projects & Datasets</div>
        </a>
        <a href="/gallery" className="rounded border p-4 hover:border-brand">
          <div className="text-sm text-slate-500 mb-1">Browse</div>
          <div className="text-lg font-medium">Dataset Gallery</div>
        </a>
        <a href="/ontology" className="rounded border p-4 hover:border-brand">
          <div className="text-sm text-slate-500 mb-1">Configure</div>
          <div className="text-lg font-medium">Ontology</div>
        </a>
      </div>
    </div>
  )
}

