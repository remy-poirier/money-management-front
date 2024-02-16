import { useUserStore } from '@/store/store.ts'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { User } from '@/domain/user'

export interface LoggedOutletContext {
  user: User
}

export const LoggedRoute = () => {
  const user = useUserStore((state) => state.user)
  const location = useLocation()

  if (!user) {
    toast.error('Accès interdit', {
      description: 'Vous devez être connecté pour accéder à cette page.',
    })
    return <Navigate to="/" />
  }

  if (!user.isOnboarded && location.pathname !== '/app/onboarding') {
    toast.info('Complétez votre profil', {
      description:
        'Complétez votre inscription en terminant les 4 étapes présentes sur cette page.',
    })
    return <Navigate to="/app/onboarding" />
  }

  return <Outlet context={{ user }} />
}
