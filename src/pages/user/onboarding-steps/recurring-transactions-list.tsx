import { OnboardingTransaction } from '@/domain/transaction.ts'
import { CircleSlash2, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { Button } from '@/components/ui/button.tsx'
import { CurrencyIcon } from '@/components/currency-icon.tsx'

interface Props {
  transactions: OnboardingTransaction[]
  deleteTransaction: (transactionIndex: number) => void
}

export const RecurringTransactionsList = ({
  transactions,
  deleteTransaction,
}: Props) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-md font-bold">
          Liste des prélèvements déjà prélevés
        </p>
        <div className="flex flex-col border rounded-md py-2 items-center justify-center text-muted-foreground">
          <CircleSlash2 />
          <span className="text-center mt-2 text-sm">
            Aucun prélèvement ajouté, cliquez sur le bouton ci-dessous pour
            ajouter votre premier prélèvement
          </span>
        </div>
      </div>
    )
  }

  const onDeleteClick = (transactionIndex: number) => () => {
    deleteTransaction(transactionIndex)
  }

  return (
    <div className="flex flex-col gap-2 border p-4 rounded-md">
      <span className="font-bold">Liste des prélèvements</span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Montant</TableCell>
            <TableCell>Jour</TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>{transaction.name}</TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  {transaction.amount}{' '}
                  <span className="flex items-center">
                    <CurrencyIcon size={12} />
                  </span>
                </span>
              </TableCell>
              <TableCell>{transaction.day}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={onDeleteClick(index)}
                >
                  <Trash2 size={15} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
