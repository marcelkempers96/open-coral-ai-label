import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Open Coral AI – Labeling App',
  description:
    'Label coral reef imagery at scale with model-assisted segmentation, taxonomy, and QA workflows.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen">
          <aside className="w-60 shrink-0 border-r border-slate-200/20 p-4 hidden md:block">
            <h1 className="text-lg font-semibold mb-4">Open Coral AI</h1>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block hover:text-brand">Dashboard</a>
              <a href="/projects" className="block hover:text-brand">Projects</a>
              <a href="/gallery" className="block hover:text-brand">Gallery</a>
              <a href="/viewer" className="block hover:text-brand">Viewer</a>
              <a href="/ontology" className="block hover:text-brand">Ontology</a>
              <a href="/review" className="block hover:text-brand">Review</a>
              <a href="/analytics" className="block hover:text-brand">Analytics</a>
              <a href="/exports" className="block hover:text-brand">Exports</a>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}

