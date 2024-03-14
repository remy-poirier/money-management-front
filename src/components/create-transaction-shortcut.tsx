import { TransactionType } from '@/domain/transaction.ts'
import { TransactionForm } from '@/pages/transactions/transaction-form.tsx'
import { useTransactionActions } from '@/hooks/transactions/transaction-actions.tsx'

interface Props {
  open: boolean
  onOpenChange: () => void
  mode?: TransactionType
  onClose: () => void
}

export const CreateTransactionShortcut = ({
  open,
  onOpenChange,
  mode,
}: Props) => {
  const { add } = useTransactionActions()

  if (open && !mode) {
    console.error('No mode provided for transaction creation')
    return null
  }

  return (
    <TransactionForm
      mode="add"
      submitHandler={add.mutateAsync}
      type={mode ?? TransactionType.ONE_TIME}
      open={open}
      onClose={onOpenChange}
      onOpenChange={onOpenChange}
    />
  )
}
