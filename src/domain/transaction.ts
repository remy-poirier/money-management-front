export enum TransactionType {
  RECURRING = 'RECURRING',
  ONE_TIME = 'ONE_TIME',
  REFUND = 'REFUND',
  WAGE = 'WAGE',
}

export interface Transaction {
  id: string
  name: string
  amount: number
  day: number
  collected: boolean
  type: TransactionType
  archived: boolean

  // Maybe we'll directly get category instead of id, or both
  category_id: string

  createdAt: string
  updatedAt: string
}

export type TransactionForm = Omit<
  Transaction,
  'id' | 'createdAt' | 'updatedAt'
>
