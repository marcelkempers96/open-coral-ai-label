import { create } from 'zustand'

export type Role = 'annotator' | 'reviewer' | 'curator' | 'admin'

type User = {
  id: string
  name: string
  role: Role
}

type AuthState = {
  user: User | null
  login: (name: string, role: Role) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (name, role) => {
    set({ user: { id: crypto.randomUUID(), name, role } })
  },
  logout: () => set({ user: null }),
}))

