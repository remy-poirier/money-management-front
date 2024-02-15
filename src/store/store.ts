import { create } from 'zustand'
import { User } from '@/domain/user.ts'

interface UserStore {
  user?: User
  updateBalance: (newBalance: number) => void
  setUser: (user: User) => void
  signOut: () => void
}

export const useUserStore = create<UserStore>()((set) => ({
  user: undefined,
  updateBalance: (newBalance: number) =>
    set((state) => {
      if (!state.user) {
        return state
      }
      return {
        ...state,
        user: {
          ...state.user,
          balance: newBalance,
        },
      }
    }),
  setUser: (user: User) => set((state) => ({ ...state, user })),
  signOut: () => set((state) => ({ ...state, user: undefined })),
}))
