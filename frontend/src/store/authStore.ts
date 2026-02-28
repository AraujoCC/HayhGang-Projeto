import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = { _id: string; name: string; email: string; isAdmin: boolean; token: string }

type AuthStore = {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user, token: user.token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().user,
      isAdmin: () => !!get().user?.isAdmin,
    }),
    { name: 'auth-storage' }
  )
)
