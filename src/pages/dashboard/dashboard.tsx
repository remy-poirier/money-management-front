import { useUserStore } from '@/store/store.ts'
import { Navigate } from 'react-router-dom'
import StatisticItem from '@/pages/dashboard/statistic-item.tsx'
import {
  Banknote,
  CalendarRange,
  CreditCard,
  EuroIcon,
  LandmarkIcon,
  PiggyBank,
} from 'lucide-react'
import { useGetWage } from '@/hooks/transactions/get-wage.tsx'
import AddButtonWage from '@/pages/dashboard/add-wage-button.tsx'
import EditButtonWage from '@/pages/dashboard/edit-wage-button.tsx'
import { useGetStatistics } from '@/hooks/statistics/get-statistics.tsx'
import { ResetData } from '@/pages/dashboard/reset-data.tsx'
import { Progress } from '@/components/ui/progress.tsx'
import { useGetLastTransactions } from '@/hooks/transactions/last-transactions.tsx'
import { TransactionCategory } from '@/pages/transactions/transaction-category.tsx'
import { Transaction, TransactionType } from '@/domain/transaction.ts'

export const Dashboard = () => {
  const user = useUserStore((state) => state.user)
  const { wage, isLoading: loadingLastWage } = useGetWage()
  const { statistics, isLoading } = useGetStatistics()
  const { lastTransactions } = useGetLastTransactions()

  if (!user) return <Navigate to="/" />

  const percentageLeft = () => {
    if (statistics) {
      const usedBudget = user.balance - statistics.amountLeftForMonth
      const percentageUsed = (usedBudget / user.balance) * 100
      return Math.round(percentageUsed)
    }
    return 0
  }

  const percentageLeftColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-600'
    if (percentage > 75) return 'bg-orange-600'
    if (percentage > 50) return 'bg-yellow-600'
    return 'bg-green-600'
  }

  const transactionDate = (day: number) => {
    const date = new Date()
    date.setDate(day)
    return Intl.DateTimeFormat('fr', {
      day: '2-digit',
      month: '2-digit',
    }).format(date)
  }

  const transationTypeText = (transactionType: TransactionType) => {
    switch (transactionType) {
      case TransactionType.ONE_TIME:
        return 'Paiement'
      case TransactionType.RECURRING:
        return 'Prélèvement'
      case TransactionType.REFUND:
      default:
        return 'Remboursement'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ResetData />
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatisticItem
          label="Montant sur compte"
          value={`${user.balance.toFixed(2)}`}
          color={user.balance < 0 ? 'text-red-600' : 'text-green-600'}
          icon={<LandmarkIcon />}
        />
        <StatisticItem
          label="Total à venir"
          isLoading={isLoading}
          value={`${statistics?.totalToCome}`}
          icon={<LandmarkIcon />}
        />
        <StatisticItem
          label="Restant ce mois-ci"
          isLoading={isLoading}
          value={`${statistics?.amountLeftForMonth}`}
          icon={<PiggyBank />}
          subValue={
            <div className="flex flex-row items-center gap-4">
              <Progress
                className={percentageLeftColor(percentageLeft())}
                value={percentageLeft() > 100 ? 100 : percentageLeft()}
              />
              {percentageLeft()}%
            </div>
          }
        />
        <StatisticItem
          label="Dernière paye"
          isLoading={loadingLastWage}
          value={`${wage?.toFixed(2) ?? 0}`}
          icon={<EuroIcon />}
          actions={
            <div className="flex gap-2">
              {!!wage && (
                <EditButtonWage wageAmount={parseFloat(wage.toFixed(2))} />
              )}
              <AddButtonWage />
            </div>
          }
        />
        <StatisticItem
          label="Paiements à venir"
          isLoading={isLoading}
          value={`${statistics?.oneTime.toCome}`}
          icon={<CreditCard />}
          helper={`Réparti en ${statistics?.transactions.oneTime.toCome} paiement${(statistics?.transactions.oneTime.toCome ?? 0) > 1 ? 's' : ''}`}
        />
        <StatisticItem
          label="Prélèvements à venir"
          isLoading={isLoading}
          value={`${statistics?.recurring.toCome}`}
          icon={<CalendarRange />}
          helper={`Réparti en ${statistics?.transactions.recurring.toCome} prélèvement${(statistics?.transactions.recurring.toCome ?? 0) > 1 ? 's' : ''}`}
        />
        <StatisticItem
          label="Remboursements à venir"
          isLoading={isLoading}
          value={`${statistics?.refunds.toCome}`}
          icon={<Banknote />}
          helper={`Réparti en ${statistics?.transactions.refunds.toCome} remboursement${(statistics?.transactions.refunds.toCome ?? 0) > 1 ? 's' : ''}`}
        />
      </div>

      <div className="grid gap-8 grid-cols-2">
        <div>
          <h3 className="text-xl font-bold mb-4">
            Derniers mouvements collectés
          </h3>
          <div className="flex flex-col gap-4">
            {lastTransactions.map((transaction) => (
              <div className="flex border p-4 rounded-xl text-sm justify-between">
                <span className="text-primary font-bold">
                  {transactionDate(transaction.day)}
                </span>
                <span className="flex gap-2 items-center">
                  <div className="flex gap-2">
                    <TransactionCategory categoryId={transaction.category.id} />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{transaction.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {transationTypeText(transaction.type)}
                      </span>
                    </div>
                  </div>
                </span>

                <span>
                  {Intl.NumberFormat('fr', {
                    style: 'currency',
                    currency: 'EUR',
                    signDisplay: 'always',
                  }).format(
                    parseFloat(
                      `${transaction.type === 'REFUND' ? '+' : '-'}${transaction.amount}`,
                    ),
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
