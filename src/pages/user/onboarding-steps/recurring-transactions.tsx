import { useState } from 'react'
import { useRecurringTransactions } from '@/hooks/user/onboarding/recurring-transactions.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { Info } from 'lucide-react'
import { RecurringTransactionForm } from '@/pages/user/onboarding-steps/recurring-transaction-form.tsx'
import { RecurringTransactionsList } from '@/pages/user/onboarding-steps/recurring-transactions-list.tsx'
import { OnboardingTransaction } from '@/domain/transaction.ts'
import { Separator } from '@/components/ui/separator.tsx'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog.tsx'
import { useUpdateOnboardingStatus } from '@/hooks/user/onboarding/update-status.tsx'
import { OnboardingStatus } from '@/domain/user.ts'

interface Props {
  simplePrev: () => void
}

/**
 * As this is the last step displayed, we don't need to handle the simpleNext
 */
export const RecurringTransactions = ({ simplePrev }: Props) => {
  const [recurringTransactions, setRecurringTransactions] = useState<
    OnboardingTransaction[]
  >([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showEmptyTransactionAlertDialog, setShowEmptyTransactionAlertDialog] =
    useState<boolean>(false)

  const { addRecurringTransactions } = useRecurringTransactions()
  const { updateOnboardingStatus } = useUpdateOnboardingStatus()

  const onNext = () => {
    /**
     * 2 cases to handle here:
     *
     * 1. User has no recurring transactions, so we display an alert dialog that user will need to validate
     * 2. User has recurring transactions, so we need to upload transactions and update the status
     */

    if (recurringTransactions.length === 0) {
      setShowEmptyTransactionAlertDialog(true)
    } else {
      addRecurringTransactions({ transactions: recurringTransactions })
        .then(() => {
          updateOnboardingStatus({
            onboardingStatus: OnboardingStatus.ONBOARDED,
          }).finally(() => {
            setLoading(false)
          })
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  const closeEmptyTransactionAlertDialog = () =>
    setShowEmptyTransactionAlertDialog(false)

  const deleteTransaction = (transactionIndex: number) => {
    setRecurringTransactions((prev) =>
      prev.filter((_, index) => index !== transactionIndex),
    )
  }

  const simpleNext = () => {
    setLoading(true)
    updateOnboardingStatus({
      onboardingStatus: OnboardingStatus.ONBOARDED,
    }).finally(() => {
      setLoading(false)
    })
  }

  const addTransaction = (transaction: OnboardingTransaction) => {
    setRecurringTransactions((prev) => [...prev, transaction])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-bold">
          Prélèvements <u>déjà</u> passés sur votre compte
        </span>
        <span className="text-xs">
          Sur cette étape, ajoutez tous vos prélèvements récurrents{' '}
          <span className="font-bold underline">
            déjà passés sur votre compte
          </span>
          . Ainsi, ils seront ajoutés à votre liste de prélèvements en tant que
          prélèvement déjà prélevé sur votre compte sans être déduits de votre
          solde actuel. Les prélèvements n'étant pas encore passés sur votre
          compte seront ajoutés plus tard.
        </span>
        <Alert variant="info" className="py-2 mt-2">
          <Info />
          <div className="ml-2 pt-2">
            <AlertTitle>Pas de stress !</AlertTitle>
            <AlertDescription className="text-xs">
              Si vous oubliez un prélèvement, vous pourrez toujours l'ajouter
              plus tard via notre interface. Vous pourrez également modifier la
              catégorie associée au prélèvement, ainsi que son nom si besoin.
            </AlertDescription>
          </div>
        </Alert>
      </div>
      <Separator />

      <RecurringTransactionsList
        transactions={recurringTransactions}
        deleteTransaction={deleteTransaction}
      />

      <RecurringTransactionForm addTransaction={addTransaction} />

      <div className="flex justify-between">
        <Button onClick={simplePrev}>Précédent</Button>
        <Button onClick={onNext} loading={loading}>
          Suivant
        </Button>
      </div>

      <AlertDialog
        open={showEmptyTransactionAlertDialog}
        onOpenChange={setShowEmptyTransactionAlertDialog}
      >
        <AlertDialogContent>
          <AlertTitle>Êtes-vous sûr(e) ?</AlertTitle>
          <AlertDescription>
            Vous n'avez pas ajouté de prélèvements. Vous pouvez passer à l'étape
            suivante si ceci est bien intentionnel et qu'aucun prélèvement n'a
            encore été effectué sur votre compte. Veuillez confirmer cette
            action.
          </AlertDescription>
          <AlertDialogFooter>
            <Button
              onClick={closeEmptyTransactionAlertDialog}
              variant="outline"
            >
              Annuler
            </Button>
            <Button onClick={simpleNext} loading={loading}>
              Continuer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
