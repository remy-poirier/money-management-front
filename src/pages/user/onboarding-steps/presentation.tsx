import { Button } from '@/components/ui/button.tsx'
import { useUpdateOnboardingStatus } from '@/hooks/user/onboarding/update-status.tsx'
import { useState } from 'react'
import { OnboardingStatus } from '@/domain/user.ts'
import { useOutletContext } from 'react-router-dom'
import { LoggedOutletContext } from '@/conf/logged-route.tsx'

interface Props {
  onNext: () => void // this method should be called only when user clicks next but is not really in this step, ie he was on amount, then clicked previous
}

export const Presentation = ({ onNext }: Props) => {
  const { user } = useOutletContext<LoggedOutletContext>()

  const [loading, setLoading] = useState<boolean>(false)

  const { updateOnboardingStatus } = useUpdateOnboardingStatus()
  const onSubmit = async () => {
    if (user.onboardingStatus !== OnboardingStatus.WELCOME) {
      onNext()
    } else {
      setLoading(true)
      updateOnboardingStatus({
        onboardingStatus: OnboardingStatus.AMOUNT_ON_ACCOUNT,
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold">Bienvenue sur Money-Manager !</p>
      <p className="text-sm">
        Money-Manager est votre compagnon idéal pour une gestion efficace de vos
        dépenses. L'application vous permet de visualiser rapidement l'état
        actuel de votre compte en banque après déduction de tous les
        prélèvements et paiements en attente. Fini les mauvaises surprises en
        fin de mois, Money-Manager vous offre une vue d'ensemble claire et
        précise de vos finances.
      </p>
      <p className="font-bold">Premiers pas avec Money-Manager</p>
      <p className="text-sm">
        Vous êtes à quelques pas de pouvoir utiliser notre application. Mais
        avant ça, nous allons définir le montant exact que vous avez
        actuellement sur votre compte en banque. Ensuite, nous vous guiderons
        pour établir la liste de tous les prélèvements récurrents déjà encaissés
        sur votre compte. Ceci est uniquement nécessaire lors de la première
        utilisation de l'application.
      </p>
      <div className="flex justify-end">
        <Button onClick={onSubmit} loading={loading}>
          Suivant
        </Button>
      </div>
    </div>
  )
}
