import { Transaction } from '@/domain/transaction.ts'
import { TableCell, TableRow } from '@/components/ui/table.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { CheckCircle2, ChevronDown, XCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { TransactionActionsBag } from '@/pages/transactions/transaction-item.tsx'
import { TransactionCategory } from '@/pages/transactions/transaction-category.tsx'

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

export const TransactionItemDesktop = ({
  transaction,
  loading,
  transactionActionsBag,
}: Props) => {
  if (loading) {
    return (
      <TableRow className="hidden md:table-row">
        <TableCell>
          <Skeleton className="h-[1rem] w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[1rem] w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[1rem] w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[1rem] w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-[1rem] w-full" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-[1rem] w-full" />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow className="hidden md:table-row">
      <TableCell>{transaction.day}</TableCell>
      <TableCell>{transaction.name}</TableCell>
      <TableCell>{transaction.amount} €</TableCell>
      <TableCell>
        <Badge className="pl-0 rounded-3xl h-[25px] py-0 bg-slate-800 dark:bg-slate-400">
          <TransactionCategory categoryId={transaction.category.id} />
          <span className="mx-2">{transaction.category.name}</span>
        </Badge>
      </TableCell>
      <TableCell>
        {transaction.collected ? (
          <CheckCircle2 color="green" />
        ) : (
          <XCircle color="red" />
        )}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Actions
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={transactionActionsBag.toggleCollected.toggle}
            >
              Définir comme{' '}
              {transaction.collected ? 'non collecté' : 'collecté'}
            </DropdownMenuItem>
            {!transaction.archived && !transaction.collected && (
              <DropdownMenuItem
                onClick={transactionActionsBag.edit.toggle}
                className="cursor-pointer"
              >
                Éditer
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={transactionActionsBag.archive.toggle}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
