import { useUserStore } from '@/store/store.ts'
import { Navigate } from 'react-router-dom'
import StatisticItem from '@/pages/dashboard/statistic-item.tsx'
import { EuroIcon, LandmarkIcon } from 'lucide-react'
import { useGetWage } from '@/hooks/transactions/get-wage.tsx'
import AddButtonWage from '@/pages/dashboard/add-wage-button.tsx'
import EditButtonWage from '@/pages/dashboard/edit-wage-button.tsx'

export const Dashboard = () => {
  const user = useUserStore((state) => state.user)
  const { wage, isLoading: loadingLastWage } = useGetWage()

  if (!user) return <Navigate to="/" />

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatisticItem
        label="Montant sur compte"
        value={`${user.balance.toFixed(2)}€`}
        color={user.balance < 0 ? 'text-red-600' : 'text-green-600'}
        icon={<LandmarkIcon />}
      />
      <StatisticItem
        label="Dernière paye"
        isLoading={loadingLastWage}
        value={`${wage?.toFixed(2) ?? 0} €`}
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
    </div>
  )
}
