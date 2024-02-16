export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  balance: number
  isAdmin: boolean

  isOnboarded: boolean
  onboardingStatus: OnboardingStatus

  createdAt: Date
  updatedAt: Date
}

export enum OnboardingStatus {
  WELCOME = 'WELCOME',
  AMOUNT_ON_ACCOUNT = 'AMOUNT_ON_ACCOUNT',
  RECURRING = 'RECURRING',
  ONBOARDED = 'ONBOARDED',
}
