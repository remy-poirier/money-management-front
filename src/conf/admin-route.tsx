import { useUserStore } from '@/store/store.ts'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'sonner'

export const AdminRoute = () => {
  const user = useUserStore((state) => state.user)
  if (!user || !user.isAdmin) {
    toast.error('Accès interdit', {
      description:
        "Vous devez être connecté en tant qu'administrateur pour accéder à cette page.",
    })
    return <Navigate to="/" />
  }

  return <Outlet />
}
