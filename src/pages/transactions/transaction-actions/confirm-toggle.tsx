import { Transaction } from '@/domain/transaction.ts'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { useState } from 'react'
import { useTransactionActions } from '@/hooks/transactions/transaction-actions.tsx'
import { Button } from '@/components/ui/button.tsx'

interface Props {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  transaction: Transaction
  onClose: () => void
}

export const ConfirmToggle = ({
  open,
  onOpenChange,
  transaction,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const transactionActions = useTransactionActions()
  const onConfirm = async () => {
    setLoading(true)
    await transactionActions.toggleCollected.mutateAsync(transaction.id)
    setLoading(false)
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Valider le changement de statut</AlertDialogTitle>
        <div className="text-sm text-muted-foreground">
          {transaction.collected ? (
            <div className="flex flex-col gap-2">
              <span>
                Veuillez noter que modifier le statut de cette dépense de{' '}
                <u>collecté</u> à <u>non-collecté</u> affectera votre balance de
                la manière suivante:
              </span>
              <ul className="list-disc pl-4">
                <li>
                  S'il s'agit d'un remboursement, alors le montant sera{' '}
                  <b>déduit</b> à votre balance
                </li>
                <li>
                  Sinon, le montant de la transaction sera <b>ajouté</b> à votre
                  balance
                </li>
              </ul>
              <span>
                Êtes-vous sûr de vouloir continuer avec cette modification ?
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span>
                Veuillez noter que modifier le statut de cette dépense de
                <u>non-collecté</u> à <u>collecté</u> affectera votre balance de
                la manière suivante:
              </span>
              <ul className="list-disc pl-4">
                <li>
                  S'il s'agit d'un remboursement, alors le montant sera{' '}
                  <b>ajouté</b> à votre balance
                </li>
                <li>
                  Sinon, votre balance sera <b>déduite</b> du montant de la
                  transaction
                </li>
              </ul>
              <span>
                Êtes-vous sûr de vouloir continuer avec cette modification ?
              </span>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button loading={loading} onClick={onConfirm}>
            Confirmer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
