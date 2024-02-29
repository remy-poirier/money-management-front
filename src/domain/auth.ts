export interface Token {
  type: 'bearer'
  token: string
  expiresAt: string | null
  lastUsedAt: string | null
}
