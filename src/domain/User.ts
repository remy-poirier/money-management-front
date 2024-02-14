export interface User {
  id: string
  email: string
  fullName?: string
  avatar_url?: string
  balance: number

  created_at: Date
  updated_at: Date
}
