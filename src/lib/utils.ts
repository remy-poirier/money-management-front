import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Token } from '@/domain/auth.ts'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTokenOrFail = (): string | undefined => {
  const token = localStorage.getItem('mmtoken')
  if (!token) return undefined

  const parsedToken: Token = JSON.parse(token)

  return parsedToken.token
}
