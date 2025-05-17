import { useNavigate, useOutletContext } from 'react-router-dom'
import { LoggedOutletContext } from '@/conf/logged-route.tsx'
import { OnboardingStatus } from '@/domain/user.ts'
import { cn } from '@/lib/utils.ts'
import { Presentation } from '@/pages/user/onboarding-steps/presentation.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import { Amount } from '@/pages/user/onboarding-steps/amount.tsx'
import { useEffect, useState } from 'react'
import { RecurringTransactions } from '@/pages/user/onboarding-steps/recurring-transactions.tsx'
import { toast } from 'sonner'

export const Onboarding = () => {
  const { user } = useOutletContext<LoggedOutletContext>()
  const [onboardingStep, setOnboardingStep] = useState(user.onboardingStatus)
  const navigate = useNavigate()

  useEffect(() => {
    setOnboardingStep(user.onboardingStatus)
    if (
      user.onboardingStatus === OnboardingStatus.ONBOARDED &&
      user.isOnboarded
    ) {
      toast.success('Félicitations !', {
        description:
          'Votre inscription est terminée, vous pouvez maintenant accéder à votre tableau de bord et utiliser pleinement notre application.',
      })
      navigate('/app/dashboard')
    }
  }, [user.onboardingStatus])

  const computePrev = (): OnboardingStatus => {
    switch (onboardingStep) {
      case OnboardingStatus.AMOUNT_ON_ACCOUNT:
        return OnboardingStatus.WELCOME
      case OnboardingStatus.RECURRING:
        return OnboardingStatus.AMOUNT_ON_ACCOUNT
      case OnboardingStatus.ONBOARDED:
        return OnboardingStatus.RECURRING
      case OnboardingStatus.WELCOME:
      default:
        return onboardingStep
    }
  }

  const prev = () => setOnboardingStep(computePrev())
  const nextPresentation = () =>
    setOnboardingStep(OnboardingStatus.AMOUNT_ON_ACCOUNT)
  const nextAmount = () => setOnboardingStep(OnboardingStatus.RECURRING)

  const isStepDoneOrCurrent = (name: OnboardingStatus) => {
    switch (name) {
      case OnboardingStatus.WELCOME:
        return (
          user.onboardingStatus === 'WELCOME' ||
          user.onboardingStatus === 'AMOUNT_ON_ACCOUNT' ||
          user.onboardingStatus === 'RECURRING'
        )
      case OnboardingStatus.AMOUNT_ON_ACCOUNT:
        return (
          user.onboardingStatus === 'AMOUNT_ON_ACCOUNT' ||
          user.onboardingStatus === 'RECURRING'
        )
      case OnboardingStatus.RECURRING:
        return user.onboardingStatus === 'RECURRING'
      case OnboardingStatus.ONBOARDED:
        return user.onboardingStatus === 'ONBOARDED'
      default:
        return false
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center content-center">
      <Card className="max-w-3xl pt-4">
        <CardContent className="flex flex-col gap-6">
          <ul className="flex justify-center steps">
            <li
              className={cn(
                'step text-sm  w-full',
                isStepDoneOrCurrent(OnboardingStatus.WELCOME) && 'step-primary',
              )}
            >
              Présentation
            </li>
            <li
              className={cn(
                'step text-sm w-full',
                isStepDoneOrCurrent(OnboardingStatus.AMOUNT_ON_ACCOUNT)
                  ? 'step-primary'
                  : '',
              )}
            >
              Montant sur compte
            </li>
            <li
              className={cn(
                'step text-sm  w-full',
                isStepDoneOrCurrent(OnboardingStatus.RECURRING)
                  ? 'step-primary'
                  : '',
              )}
            >
              Prélèvements
            </li>
            <li
              className={cn(
                'step text-sm  w-full',
                isStepDoneOrCurrent(OnboardingStatus.ONBOARDED)
                  ? 'step-primary'
                  : '',
              )}
            >
              Validation
            </li>
          </ul>
          <div className="flex flex-col flex-1 items-center justify-center content-center">
            {onboardingStep === 'WELCOME' && (
              <Presentation onNext={nextPresentation} />
            )}
            {onboardingStep === 'AMOUNT_ON_ACCOUNT' && (
              <Amount onPrev={prev} simpleNext={nextAmount} />
            )}
            {onboardingStep === 'RECURRING' && (
              <RecurringTransactions simplePrev={prev} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
