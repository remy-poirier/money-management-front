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
  SortAsc,
  SortDesc,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useGetTransactions } from '@/hooks/transactions/get-transactions.tsx'
import { TransactionFormActions } from '@/pages/transactions/transaction-form-actions.tsx'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.tsx'
import { useDebounce } from '@uidotdev/usehooks'
import { Input } from '@/components/ui/input.tsx'

interface Props {
  categories: Category[]
  type: TransactionType
}
export const TransactionsTable = (props: Props) => {
  const { type, categories } = props
  const transactionActions = useTransactionActions()
  const { theme } = useTheme()
  const [showCollected, setShowCollected] = useState(false)
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebounce(searchText, 300)
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>(
    'desc',
  )

  const { transactions: transactionData, isLoading: loading } =
    useGetTransactions({
      type,
      page,
      collected: showCollected ? undefined : false,
      search: debouncedSearch,
      orderByDirection,
    })

  const transactions = transactionData?.data ?? []

  const iconColor = theme === 'dark' ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)'

  const onToggleShowCollected = () => setShowCollected((prev) => !prev)

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

  const onUpdateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
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

  const onNext = () => setPage((prev) => prev + 1)
  const onPrevious = () => setPage((prev) => prev - 1)
  const goToPage = (page: number) => () => setPage(page)

  const nextPages = () => {
    if (transactionData) {
      const currentPage = transactionData.meta.currentPage
      const lastPage = transactionData.meta.lastPage
      return Array.from(
        { length: lastPage - currentPage + 1 },
        (_, i) => currentPage + i,
      )
        .slice(1, 4)
        .filter((page) => page !== transactionData.meta.lastPage)
    }

    return []
  }

  const updateSort = () =>
    setOrderByDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))

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
      <div className="flex justify-around gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Switch
            id="show-collected"
            checked={showCollected}
            onCheckedChange={onToggleShowCollected}
          />
          <Label htmlFor="show-collected">
            Afficher les éléments collectés
          </Label>
        </div>

        <div className="hidden sm:flex flex-1">
          <Input placeholder="Recherche par nom..." onChange={onUpdateSearch} />
        </div>

        {transactionActions && (
          <TransactionFormActions
            submitHandler={transactionActions.add.mutateAsync}
            categories={categories}
            type={type}
          />
        )}
      </div>
      <div className="flex sm:hidden flex-1">
        <Input placeholder="Recherche par nom..." onChange={onUpdateSearch} />
      </div>
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead
              className="flex items-center cursor-pointer"
              onClick={updateSort}
            >
              <Button
                size="icon-sm"
                variant="ghost"
                className="flex items-center gap-2"
              >
                {orderByDirection === 'asc' ? (
                  <SortAsc size={17} />
                ) : (
                  <SortDesc size={17} />
                )}
                Date
              </Button>
            </TableHead>
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
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.day}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.amount} €</TableCell>
                <TableCell>
                  <Badge>{transaction.category.name}</Badge>
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
      {transactionData && (
        <div className="hidden md:flex">
          <Pagination className="justify-between">
            <PaginationContent className="flex-1 flex justify-end">
              <PaginationItem>
                <PaginationPrevious
                  disabled={page === 1}
                  onClick={onPrevious}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive={page === 1} onClick={goToPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              {page >= 3 && <PaginationEllipsis />}
              {transactionData.meta.currentPage !== 1 &&
                page !== transactionData.meta.lastPage && (
                  <PaginationItem>
                    <PaginationLink
                      isActive={page === transactionData.meta.currentPage}
                      onClick={goToPage(transactionData.meta.currentPage)}
                    >
                      {transactionData.meta.currentPage}
                    </PaginationLink>
                  </PaginationItem>
                )}
              {nextPages()
                .filter((p) => p !== page)
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === transactionData.meta.currentPage}
                      onClick={goToPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              {nextPages()[nextPages().length - 1] <
                transactionData.meta.lastPage - 1 && <PaginationEllipsis />}
              {transactionData.meta.lastPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={page === transactionData.meta.lastPage}
                    onClick={goToPage(transactionData.meta.lastPage)}
                  >
                    {transactionData.meta.lastPage}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  disabled={page >= transactionData.meta.lastPage}
                  onClick={onNext}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
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
          transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="flex-1">{transaction.name}</CardTitle>
                  <Badge>{transaction.category.name}</Badge>
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
        {transactionData && (
          <div className="flex md:hidden">
            <Pagination className="justify-between">
              <PaginationContent className="flex-1 flex justify-between">
                <PaginationItem>
                  <PaginationPrevious
                    disabled={page === 1}
                    onClick={onPrevious}
                  >
                    Précédent
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink disabled isActive>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    disabled={page >= transactionData.meta.lastPage}
                    onClick={onNext}
                  >
                    Suivant
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
