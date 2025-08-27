import { getImages } from '@/lib/images'

export default async function HomePage() {
  const imgs = await getImages()
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dataset Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {imgs.map((r) => (
          <a key={r.id} href={`/images/${r.id}`} className="aspect-square bg-slate-200/20 rounded border overflow-hidden group relative">
            <img src={r.url} alt={r.filename} className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-2 py-0.5 rounded">{r.filename}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

