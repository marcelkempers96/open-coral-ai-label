import './globals.css'
import type { ReactNode } from 'react'
import { Providers } from './providers'

export const metadata = {
  title: 'Open Coral AI – Labeling App',
  description:
    'Label coral reef imagery at scale with model-assisted segmentation, taxonomy, and QA workflows.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>
          <main className="min-h-screen p-4 md:p-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

