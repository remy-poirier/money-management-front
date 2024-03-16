import { Transaction, TransactionType } from '@/domain/transaction.ts'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { CheckCircle2, SquarePen, Trash2, XCircle } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import { cn } from '@/lib/utils.ts'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator.tsx'
import { TransactionActionsBag } from '@/pages/transactions/transaction-item.tsx'
import { TransactionCategory } from '@/pages/transactions/transaction-category.tsx'
import { CurrencyIcon } from '@/components/currency-icon.tsx'

type LoadingProps = {
  loading: true
  transaction: undefined
  transactionActionsBag: undefined
}

type SuccessProps = {
  loading: false
  transaction: Transaction
  transactionActionsBag: TransactionActionsBag
}

type Props = LoadingProps | SuccessProps

export const TransactionItemMobile = ({
  transaction,
  loading,
  transactionActionsBag,
}: Props) => {
  const [showActions, setShowActions] = useState<boolean>(false)

  const handler = useSwipeable({
    onSwipedLeft: () => setShowActions(true),
    onSwipedRight: () => setShowActions(false),
  })

  if (loading) {
    return (
      <div className="h-[56px] w-full flex gap-4 px-3 py-2 items-center bg-slate-100 dark:bg-slate-900">
        <Skeleton className="h-[40px] w-[40px] rounded-full" />
        <div className="flex-1 flex-col text-sm h-[40px]">
          <Skeleton className="w-[40%] text-sm h-[17px]" />
          <div className="flex items-center">
            <Skeleton className="w-[14px] mt-[3px] h-[14px]" />
            <Separator orientation="vertical" className="px-0.5" />
            <Skeleton className="w-[40%] text-sm h-[14px] mt-[4px]" />
          </div>
        </div>
        <Skeleton className="w-[40px] text-sm h-[24px]" />
      </div>
    )
  }

  const transationTypeText = () => {
    switch (transaction.type) {
      case TransactionType.ONE_TIME:
        return 'Paiement'
      case TransactionType.RECURRING:
        return 'Prélèvement'
      case TransactionType.REFUND:
      default:
        return 'Remboursement'
    }
  }

  return (
    <>
      <div
        {...handler}
        className="relative flex overflow-x-hidden bg-slate-100 dark:bg-slate-900 rounded-md items-center"
      >
        <div
          className={cn(
            'flex gap-4 ml-0 px-3 py-2 items-center w-full transition-all',
            showActions && `ml-[-112px]`,
            showActions &&
              !transaction.collected &&
              !transaction.archived &&
              'ml-[-168px]',
          )}
          onClick={() => setShowActions(false)}
        >
          <TransactionCategory categoryId={transaction.category.id} />
          <div className="flex flex-1 flex-col text-sm">
            <span>{transaction.name}</span>
            <span className="text-muted-foreground flex items-center">
              <span>
                {transaction.collected ? (
                  <CheckCircle2 className="text-green-500" size={14} />
                ) : (
                  <XCircle className="text-red-400" size={14} />
                )}
              </span>
              <Separator orientation="vertical" className="px-0.5" />
              {transationTypeText()}
            </span>
          </div>
          <div>
            <span className="font-bold flex items-center">
              {transaction.type === 'REFUND' ? '+' : '-'}
              {transaction.amount} <CurrencyIcon size={20} />
            </span>
          </div>
        </div>

        <div
          className={cn(
            'absolute top-0 bottom-0 flex items-center transition-all',
            showActions ? 'right-0' : '',
            !showActions && `right-[-112px]`,
            !showActions &&
              !transaction.collected &&
              !transaction.archived &&
              `right-[-168px]`,
          )}
        >
          <div
            onClick={transactionActionsBag.toggleCollected.toggle}
            className={cn(
              'h-full flex px-5 items-center',
              transaction.collected ? 'bg-blue-500' : 'bg-green-500',
            )}
          >
            {transaction.collected ? (
              <XCircle size={16} className="text-white" />
            ) : (
              <CheckCircle2 size={16} className="text-white" />
            )}
          </div>
          {!transaction.archived && !transaction.collected && (
            <div
              onClick={transactionActionsBag.edit.toggle}
              className="h-full flex px-5 items-center bg-orange-400"
            >
              <SquarePen size={16} className="text-white" />
            </div>
          )}

          <div
            onClick={transactionActionsBag.archive.toggle}
            className="h-full flex px-5 items-center bg-red-500"
          >
            <Trash2 size={16} className="text-white" />
          </div>
        </div>
      </div>
    </>
  )
}
