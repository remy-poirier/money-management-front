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
import { Transaction, TransactionType } from '@/domain/transaction.ts'
import { Category } from '@/domain/category'
import { useTransactionActions } from '@/hooks/transactions/transaction-actions.tsx'
import { ArrowDown, Ban, Plus, SortAsc, SortDesc } from 'lucide-react'
import { useGetTransactions } from '@/hooks/transactions/get-transactions.tsx'
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

  const {
    fetchNextPage,
    transactions: transactionData,
    isLoading: loading,
    hasNextPage,
  } = useGetTransactions({
    type,
    collected: showCollected ? undefined : false,
    search: debouncedSearch,
    orderByDirection,
  })

  const onToggleShowCollected = () => setShowCollected((prev) => !prev)

  const onUpdateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const updateSort = () =>
    setOrderByDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))

  const transactions: Transaction[] =
    transactionData?.pages.reduce((acc, value) => {
      acc.push(...value.data)

      return acc
    }, [] as Transaction[]) ?? []

  const lastPage = transactionData?.pages[0].meta.lastPage ?? 1

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

              {!loading && transactions.length === 0 && (
                <TableRow>
                  <td colSpan={6} className="text-center">
                    <div className="flex flex-col items-center pt-4 text-muted-foreground gap-2">
                      <Ban />
                      Aucune transaction à afficher
                    </div>
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {transactionData && lastPage > 1 && (
            <div className="hidden md:flex justify-center mt-2">
              <Button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
                {hasNextPage && (
                  <>
                    <ArrowDown size={20} className="mr-2" />
                    Charger + de transactions
                  </>
                )}
                {!hasNextPage &&
                  '🎉 Vous avez visualisé toutes les transactions'}
              </Button>
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
          {lastPage > 1 && (
            <div className="flex md:hidden justify-center">
              <Button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
                {hasNextPage && (
                  <>
                    <ArrowDown size={20} className="mr-2" />
                    Charger + de transactions
                  </>
                )}
                {!hasNextPage &&
                  '🎉 Vous avez visualisé toutes les transactions'}
              </Button>
            </div>
          )}
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
