import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import React, { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  Transaction,
  TransactionForm,
  TransactionType,
} from '@/domain/transaction.ts'
import { Category } from '@/domain/category'
import { useTheme } from '@/components/theme-provider.tsx'
import { useTransactionActions } from '@/hooks/transactions/transaction-actions.tsx'
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useGetTransactions } from '@/hooks/transactions/get-transactions.tsx'
import { TransactionFormActions } from '@/pages/transactions/transaction-form-actions.tsx'

interface Props {
  categories: Category[]
  type: TransactionType
}
export const TransactionsTable = (props: Props) => {
  const { type, categories } = props
  const transactionActions = useTransactionActions()
  const { theme } = useTheme()
  const { transactions: transactionData, isLoading: loading } =
    useGetTransactions(type)

  const transactions = transactionData?.data ?? []

  const iconColor = theme === 'dark' ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)'

  const [showCollected, setShowCollected] = useState(false)

  const onToggleShowCollected = () => setShowCollected((prev) => !prev)

  const transactionsList = transactions.filter(
    (t) => showCollected || !t.collected,
  )

  const paymentPrefix = () => {
    switch (type) {
      case TransactionType.ONE_TIME:
        return 'Paiement effectué le'
      case TransactionType.RECURRING:
        return 'Prélèvement attendu le'
      case TransactionType.REFUND:
      default:
        return 'Remboursement attendu le'
    }
  }

  const toggleCollected = (transaction: Transaction) => () => {
    // Maybe find a way to display loader here
    transactionActions.toggleCollected.mutateAsync(transaction.id)
  }

  const archiveTransaction = (transaction: Transaction) => () => {
    transactionActions.archive.mutateAsync(transaction.id)
  }

  const editTransaction =
    (transaction: Transaction) =>
    async (transactionEdition: TransactionForm) => {
      return transactionActions.update.mutateAsync({
        id: transaction.id,
        transactionEdition,
      })
    }

  const renderTransactionActions = (transaction: Transaction) => {
    if (!transactionActions) {
      return <></>
    }

    return (
      <div className="flex gap-4 flex-1 items-center justify-between">
        <Button
          size="icon-sm"
          className="px-10 py-5"
          onClick={toggleCollected(transaction)}
        >
          {transaction.collected ? (
            <XCircle size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}
        </Button>
        {!transaction.archived && !transaction.collected && (
          <TransactionFormActions
            type={type}
            mode="edit"
            submitHandler={editTransaction(transaction)}
            categories={categories}
          />
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon-sm" className="py-5 px-10">
              <Trash2 size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Attention, la suppression d&apos;une opération est irréversible
                et ne pourra par conséquent pas être annulée. <br />
                Veuillez confirmer que c&apos;est bien ce que vous souhaitez
                faire.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={archiveTransaction(transaction)}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-collected"
            checked={showCollected}
            onCheckedChange={onToggleShowCollected}
          />
          <Label htmlFor="show-collected">
            Afficher les éléments collectés
          </Label>
        </div>

        {transactionActions && (
          <TransactionFormActions
            submitHandler={transactionActions.add.mutateAsync}
            categories={categories}
            type={type}
          />
        )}
      </div>

      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prélevé ?</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading &&
            Array(10)
              .fill('')
              .map((_, i) => (
                <React.Fragment key={i}>
                  <TableRow>
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
                    <TableCell>
                      <Skeleton className="h-[1rem] w-full" />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          {!loading &&
            transactionsList.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.day}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.amount} €</TableCell>
                <TableCell>
                  <Badge>Mettre nom de la catégorie ici</Badge>
                </TableCell>
                <TableCell>
                  {transaction.collected ? (
                    <CheckCircle2 color="green" />
                  ) : (
                    <XCircle color="red" />
                  )}
                </TableCell>
                <TableCell>
                  {transactionActions && (
                    <div className="flex gap-4 items-center">
                      <Button
                        size="icon-sm"
                        onClick={toggleCollected(transaction)}
                      >
                        {transaction.collected ? (
                          <XCircle size={20} />
                        ) : (
                          <CheckCircle2 size={20} />
                        )}
                      </Button>

                      {!transaction.archived && !transaction.collected && (
                        <TransactionFormActions
                          transaction={transaction}
                          type={type}
                          mode="edit"
                          submitHandler={editTransaction(transaction)}
                          categories={categories}
                        />
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon-sm">
                            <Trash2 size={20} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmer la suppression
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Attention, la suppression d&apos;une opération est
                              irréversible et ne pourra par conséquent pas être
                              annulée. <br />
                              Veuillez confirmer que c&apos;est bien ce que vous
                              souhaitez faire.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={archiveTransaction(transaction)}
                            >
                              Confirmer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2 md:hidden">
        {loading &&
          Array(10)
            .fill('')
            .map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-baseline gap-2">
                    <CardTitle className="flex-[4]">
                      <Skeleton className="h-[1rem] w-full" />
                    </CardTitle>
                    <Badge className="flex-1">
                      <Skeleton className="h-[1rem] w-full" />
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex text-base flex-col gap-2">
                  <div className="flex gap-4 items-center">
                    <Banknote size={20} color={iconColor} />
                    <Skeleton className="h-[24px] w-[20%]" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <CalendarDays size={20} color={iconColor} />
                    <Skeleton className="h-[24px] w-[50%]" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <CheckCircle2 size={20} color={iconColor} />
                    <Skeleton className="h-[24px] w-[50%]" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 flex-1 items-center justify-between">
                    <Skeleton className="h-[32px] w-[20%]" />
                    <Skeleton className="h-[32px] w-[20%]" />
                    <Skeleton className="h-[32px] w-[20%]" />
                  </div>
                </CardFooter>
              </Card>
            ))}

        {!loading &&
          transactionsList.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="flex-1">{transaction.name}</CardTitle>
                  <Badge>METTRE CATEGORY NAME ICI</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex text-base flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <Banknote size={20} color={iconColor} />
                  <span className="font-bold">{transaction.amount} €</span>
                </div>
                <div className="flex gap-4 items-center">
                  <CalendarDays size={20} color={iconColor} />
                  <span>
                    {paymentPrefix()} le {transaction.day}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  {transaction.collected ? (
                    <CheckCircle2 size={20} color={iconColor} />
                  ) : (
                    <XCircle size={20} color={iconColor} />
                  )}
                  <span>
                    Statut:&nbsp;
                    {transaction.collected ? 'Collecté' : 'Non-collecté'}
                  </span>
                </div>
              </CardContent>
              <CardFooter>{renderTransactionActions(transaction)}</CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}
