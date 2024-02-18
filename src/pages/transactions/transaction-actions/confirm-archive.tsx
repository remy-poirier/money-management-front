import { Transaction } from '@/domain/transaction.ts'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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

export const ConfirmArchive = ({
  open,
  onOpenChange,
  transaction,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const transactionActions = useTransactionActions()
  const onConfirm = async () => {
    setLoading(true)
    await transactionActions.archive.mutateAsync(transaction.id)
    setLoading(false)
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
        <AlertDialogDescription>
          Attention, la suppression d&apos;une opération est irréversible et ne
          pourra par conséquent pas être annulée. <br />
          Veuillez confirmer que c&apos;est bien ce que vous souhaitez faire.
        </AlertDialogDescription>
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
