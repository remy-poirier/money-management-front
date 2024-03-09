import { create } from 'zustand'
import { OnboardingStatus, User } from '@/domain/user.ts'
import { Category } from '@/domain/category.ts'

interface UserStore {
  user?: User
  updateBalance: (newBalance: number) => void
  setOnboardingStatus: (data: {
    status: OnboardingStatus
    isOnboarded: boolean
  }) => void
  setUser: (user: User) => void
  signOut: () => void
  enableShortcuts: boolean
  setEnableShortcuts: (value: boolean) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

export const useUserStore = create<UserStore>()((set) => ({
  user: undefined,
  enableShortcuts: true,
  setEnableShortcuts: (value: boolean) =>
    set((state) => {
      return {
        ...state,
        enableShortcuts: value,
      }
    }),
  categories: [],
  setCategories: (categories: Category[]) =>
    set((state) => {
      return {
        ...state,
        categories,
      }
    }),
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
