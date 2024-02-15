import { PropsWithChildren, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Transaction,
  TransactionType,
  TransactionForm as TransactionFormSchema,
} from '@/domain/transaction.ts'
import { Category } from '@/domain/category.ts'
import { SquarePen } from 'lucide-react'
import { TransactionForm } from '@/pages/transactions/transaction-form.tsx'

interface Props {
  type: TransactionType
  categories: Category[]
  transaction?: Transaction
  mode?: 'add' | 'edit'
  submitHandler: (transaction: TransactionFormSchema) => Promise<Transaction>
}

export const TransactionFormActions = ({
  type,
  categories,
  mode = 'add',
  transaction,
  submitHandler,
}: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState<boolean>(false)

  const onClose = () => setOpen(false)
  const onOpen = () => setOpen(true)

  return (
    <>
      {mode === 'add' && (
        <div className="flex flex-1 justify-end">
          <Button onClick={onOpen}>+ Ajouter</Button>
        </div>
      )}
      {mode === 'edit' && (
        <Button
          size="icon-sm"
          className="px-10 md:px-3 py-5 md:py-2"
          aria-label="edit"
          variant="edit"
          onClick={onOpen}
        >
          <SquarePen size={20} />
        </Button>
      )}

      {open && (
        <TransactionForm
          onOpenChange={setOpen}
          open={open}
          onClose={onClose}
          type={type}
          mode={mode}
          submitHandler={submitHandler}
          categories={categories}
          expense={transaction}
        />
      )}
    </>
  )
}
