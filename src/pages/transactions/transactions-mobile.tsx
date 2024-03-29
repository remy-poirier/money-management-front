import { Transaction } from '@/domain/transaction.ts'
import { TransactionItem } from '@/pages/transactions/transaction-item.tsx'
import groupBy from 'lodash/groupBy'
import { Ban } from 'lucide-react'

interface Props {
  loading: boolean
  transactions: Transaction[]
}

export const TransactionsMobile = ({ loading, transactions }: Props) => {
  if (loading) {
    return Array(10)
      .fill('')
      .map((_, i) => (
        <TransactionItem key={i} loading={true} transaction={undefined} />
      ))
  }

  if (!loading && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <Ban />
        <div className="text-sm">Aucune transaction à afficher</div>
      </div>
    )
  }

  const groupedTransactions: Record<string, Transaction[]> = groupBy(
    transactions,
    'day',
  )

  if (!loading) {
    return Object.keys(groupedTransactions)
      .reverse()
      .map((day) => {
        const dayTransactions: Transaction[] = groupedTransactions[day]
        const date = new Date()
        date.setDate(parseInt(day, 10))
        const dateStr = date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        const capitalizedDate =
          dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

        return (
          <div key={day} className="flex flex-col gap-4">
            <div className="text-xs text-muted-foreground font-bold">
              {capitalizedDate}
            </div>
            <div className="flex flex-col gap-0.5">
              {dayTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  loading={false}
                />
              ))}
            </div>
          </div>
        )
      })
  }
}
