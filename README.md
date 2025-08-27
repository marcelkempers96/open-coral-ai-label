Coral Label Lite

Lightweight, production-ready coral image segment & label app.

Features:
- Interactive auto-seg via clicks (W add mask, C assign label, X remove).
- Minimal UI: left panel, top bar, canvas, bottom action bar, right zoom.
- Local-first (IndexedDB) and export to COCO panoptic + PNG masks.
- Pluggable /api/segment proxy to your model service.

Getting Started

- npm install
- npm run dev

Static Export (GitHub Pages)

- export STATIC_EXPORT=true
- optionally set NEXT_PUBLIC_BASE_PATH=/open-coral-ai-label
- npm run build:static
- static output in out/

Vercel

- npm run build
- deploy the project

Env

- SEGMENT_ENDPOINT your FastAPI/Replicate proxy (optional during dev)

