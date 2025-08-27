Open Coral AI – Labeling App (v0 skeleton)

Local-first skeleton with Next.js (App Router), Tailwind, Zustand, Dexie. Deployable to Vercel or GitHub Pages (static export).

Getting Started

- npm install
- npm run dev

Static Export (GitHub Pages)

- export STATIC_EXPORT=true
- optionally set NEXT_PUBLIC_BASE_PATH=/open-coral-ai
- npm run build:static
- output in .next/out

Vercel

- npm run build
- deploy the project

Notes

- Data stored in browser IndexedDB (Dexie)
- API surface will be added under /api/v0 for Vercel runtime

