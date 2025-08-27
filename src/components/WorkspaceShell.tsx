'use client'
import CanvasStage from '@/components/CanvasStage'
import { ActionBar } from '@/components/ActionBar'
import { LeftPanel } from '@/components/LeftPanel'
import { ZoomPad } from '@/components/ZoomPad'

export function WorkspaceShell({ imageUrl, w, h, filename }: { imageUrl: string; w: number; h: number; filename: string }) {
  return (
    <div className="h-screen w-screen grid grid-cols-[300px_1fr_56px] grid-rows-[56px_1fr]">
      <header className="col-span-3 border-b flex items-center px-4 gap-3">
        <a href="/" className="text-sm">&lt; All Images</a>
        <div className="font-medium">{filename}</div>
      </header>
      <aside className="border-r p-3 overflow-auto"><LeftPanel /></aside>
      <main className="relative">
        <CanvasStage imageUrl={imageUrl} w={w} h={h} />
        <ActionBar />
      </main>
      <aside className="border-l p-2 flex flex-col items-center gap-2"><ZoomPad /></aside>
    </div>
  )
}

