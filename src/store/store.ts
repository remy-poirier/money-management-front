import { create } from 'zustand'
import { OnboardingStatus, User } from '@/domain/user.ts'

interface UserStore {
  user?: User
  updateBalance: (newBalance: number) => void
  setOnboardingStatus: (data: {
    status: OnboardingStatus
    isOnboarded: boolean
  }) => void
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
  setOnboardingStatus: (data: {
    status: OnboardingStatus
    isOnboarded: boolean
  }) =>
    set((state) => {
      if (!state.user) {
        return state
      }
      return {
        ...state,
        user: {
          ...state.user,
          onboardingStatus: data.status,
          isOnboarded: data.isOnboarded,
        },
      }
    }),
  setUser: (user: User) => set((state) => ({ ...state, user })),
  signOut: () => set((state) => ({ ...state, user: undefined })),
}))
