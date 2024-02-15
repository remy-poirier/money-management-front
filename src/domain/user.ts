export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  balance: number
  isAdmin: boolean

  createdAt: Date
  updatedAt: Date
}
