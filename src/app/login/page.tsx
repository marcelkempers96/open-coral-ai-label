"use client"
import { useState } from 'react'
import { useAuth, type Role } from '@/store/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('annotator')
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      <div className="space-y-2">
        <label className="block text-sm">Name</label>
        <input className="w-full border rounded px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Role</label>
        <select className="w-full border rounded px-2 py-1" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="annotator">annotator</option>
          <option value="reviewer">reviewer</option>
          <option value="curator">curator</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <button className="bg-brand text-white rounded px-3 py-1" onClick={() => login(name || 'User', role)}>Enter</button>
    </div>
  )
}

