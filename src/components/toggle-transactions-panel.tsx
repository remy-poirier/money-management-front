import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx'
import { useNextToCollect } from '@/hooks/transactions/next-to-collect.tsx'
import { TransactionCategory } from '@/pages/transactions/transaction-category.tsx'
import { useTransactionActions } from '@/hooks/transactions/transaction-actions.tsx'
import { useState } from 'react'
import { TransactionType } from '@/domain/transaction.ts'

interface Props {
  open: boolean
  onOpenChange: () => void
}

export const ToggleTransactionsPanel = ({ open, onOpenChange }: Props) => {
  const { nextToCollect, isLoading, refetch } = useNextToCollect()
  const transactions = nextToCollect ?? []

  const [collectingTransactionId, setCollectingTransactionId] = useState<
    string | null
  >(null)

  const { toggleCollected } = useTransactionActions()

  const toggleTransaction = (transactionId: string) => async () => {
    setCollectingTransactionId(transactionId)
    await toggleCollected.mutateAsync(transactionId)
    refetch().then(() => setCollectingTransactionId(null))
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Recherchez une transaction par son nom" />
      <CommandList>
        {!isLoading && transactions.length > 0 && (
          <CommandEmpty>Aucune transaction à afficher</CommandEmpty>
        )}
        {isLoading && <CommandEmpty>Chargement...</CommandEmpty>}
        {transactions.map((transaction) => (
          <CommandItem
            disabled={toggleCollected.isLoading}
            onSelect={toggleTransaction(transaction.id)}
            key={transaction.id}
            className="flex gap-4 relative"
          >
            {toggleCollected.isLoading &&
              collectingTransactionId === transaction.id && (
                <div className="absolute top-0 left-0 right-0 bottom-0 h-full w-full flex items-center justify-center ">
                  <div className="bg-background opacity-50 h-full w-full" />
                  <span className="absolute loading loading-infinity loading-lg z-20"></span>
                </div>
              )}

            <TransactionCategory
              forceSmall
              categoryId={transaction.category.id}
            />
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-bold">
                Le {transaction.day} - {transaction.name}
              </span>
              <span className="text-xs">
                Type:{' '}
                {transaction.type === TransactionType.ONE_TIME
                  ? 'Paiement'
                  : 'Prélèvement'}{' '}
                • Le {transaction.day}
              </span>
              <span className="text-xs text-muted-foreground">
                ID: {transaction.id}
              </span>
            </div>
            <span className="text-md font-bold">{transaction.amount} €</span>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
