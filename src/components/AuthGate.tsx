"use client"
import { Suspense, type ReactNode } from 'react'
import { useAuth } from '@/store/auth'

export function AuthGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div />}> 
      <AuthInner>{children}</AuthInner>
    </Suspense>
  )
}

function AuthInner({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="text-lg">Welcome to Open Coral AI</div>
          <a className="bg-brand text-white rounded px-4 py-2 inline-block" href="/login">Login</a>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

