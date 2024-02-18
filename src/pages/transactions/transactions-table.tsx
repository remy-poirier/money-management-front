import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { TransactionType } from '@/domain/transaction.ts'
import { Category } from '@/domain/category'
import { useTransactionActions } from '@/hooks/transactions/transaction-actions.tsx'
import { Plus, SortAsc, SortDesc } from 'lucide-react'
import { useGetTransactions } from '@/hooks/transactions/get-transactions.tsx'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.tsx'
import { useDebounce, useMediaQuery } from '@uidotdev/usehooks'
import { Input } from '@/components/ui/input.tsx'
import { TransactionItem } from '@/pages/transactions/transaction-item.tsx'
import { TransactionForm } from '@/pages/transactions/transaction-form.tsx'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'
import { TransactionsMobile } from '@/pages/transactions/transactions-mobile.tsx'

interface Props {
  categories: Category[]
  type: TransactionType
}

const fullConfig = resolveConfig(tailwindConfig)

export const TransactionsTable = (props: Props) => {
  const { type, categories } = props
  const transactionActions = useTransactionActions()
  const [showCollected, setShowCollected] = useState(false)
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebounce(searchText, 300)
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>(
    'desc',
  )
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  const isSmallDevice = useMediaQuery(
    `only screen and (max-width : ${fullConfig.theme.screens.md})`,
  )

  const toggleAddTransaction = () => setShowAddTransaction((prev) => !prev)
  const closeAddTransaction = () => setShowAddTransaction(false)

  const { transactions: transactionData, isLoading: loading } =
    useGetTransactions({
      type,
      page,
      collected: showCollected ? undefined : false,
      search: debouncedSearch,
      orderByDirection,
    })

  const transactions = transactionData?.data ?? []

  const onToggleShowCollected = () => setShowCollected((prev) => !prev)

  const onUpdateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-around gap-4">
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

        <Button onClick={toggleAddTransaction} className="flex gap-2">
          <Plus size={15} />
          Ajouter une transaction
        </Button>
      </div>
      <div className="flex sm:hidden flex-1">
        <Input placeholder="Recherche par nom..." onChange={onUpdateSearch} />
      </div>
      {!isSmallDevice && (
        <>
          <Table>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array(10)
                  .fill('')
                  .map((_, i) => (
                    <TransactionItem
                      key={i}
                      categories={[]}
                      loading={true}
                      transaction={undefined}
                    />
                  ))}
              {!loading &&
                transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    categories={categories}
                    loading={false}
                    transaction={transaction}
                  />
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
        </>
      )}

      {isSmallDevice && (
        <>
          <TransactionsMobile
            categories={categories}
            loading={loading}
            transactions={transactions}
          />
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
                    disabled={
                      transactionData
                        ? page >= transactionData?.meta?.lastPage
                        : true
                    }
                    onClick={onNext}
                  >
                    Suivant
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
      <TransactionForm
        mode="add"
        submitHandler={transactionActions.add.mutateAsync}
        categories={categories}
        type={type}
        open={showAddTransaction}
        onClose={closeAddTransaction}
        onOpenChange={setShowAddTransaction}
      />
    </div>
  )
}
