import { BigInput } from '@/components/ui/input.tsx'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { LoggedOutletContext } from '@/conf/logged-route.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUpdateBalance } from '@/hooks/user/onboarding/update-balance.tsx'
import { useUpdateOnboardingStatus } from '@/hooks/user/onboarding/update-status.tsx'
import { OnboardingStatus } from '@/domain/user.ts'

interface Props {
  onPrev: () => void
  simpleNext: () => void
}

export const Amount = ({ onPrev, simpleNext }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useOutletContext<LoggedOutletContext>()

  const [amount, setAmount] = useState(user.balance)

  const { updateBalance } = useUpdateBalance()
  const { updateOnboardingStatus } = useUpdateOnboardingStatus()

  const onBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(parseFloat(event.target.value))

  const onNext = () => {
    if (
      user.balance === amount &&
      user.onboardingStatus !== 'AMOUNT_ON_ACCOUNT'
    ) {
      /**
       * User was on RECURRING or ONBOARDED, and has not changed the balance,
       * so we just need to next without neither updating the status nor the balance
       */
      simpleNext()
    } else {
      /**
       * Otherwise we perform both requests.
       * In theory it exists a case where user accesses onboarding with a balance already set,
       * and do not changes it, but it's such a rare case that we can ignore it and always perform
       * 2 requests
       * **/
      setLoading(true)
      Promise.all([
        updateBalance({ balance: amount }),
        updateOnboardingStatus({
          onboardingStatus: OnboardingStatus.RECURRING,
        }),
      ]).finally(() => {
        setLoading(false)
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Quel est le montant actuellement sur votre compte en banque ?</h1>
      <BigInput value={amount} onChange={onBalanceChange} type="number" />
      <div>
        <p className="text-sm font-bold text-muted-foreground">
          Pourquoi cette question ?
        </p>
        <p className="text-sm text-muted-foreground">
          Nous avons besoin de connaître ce montant pour définir votre budget
          initial, par la suite il vous suffira d'indiquer vos dépenses et
          rentrées d'argent via notre interface pour que Money-Manager vous
          donne une vue d'ensemble de vos finances.
        </p>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrev}>Précédent</Button>
        <Button onClick={onNext} loading={loading}>
          Suivant
        </Button>
      </div>
    </div>
  )
}
