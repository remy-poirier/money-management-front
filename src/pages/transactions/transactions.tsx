import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TransactionsTable } from '@/pages/transactions/transactions-table.tsx'
import { TransactionType } from '@/domain/transaction.ts'

export const Transactions = () => {
  return (
    <div>
      <Tabs defaultValue="transactions" className="pb-6">
        <TabsList className="grid grid-cols-3 w-fit h-auto">
          <TabsTrigger className="text-xs md:text-base" value="transactions">
            Transactions
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-base" value="recurrings">
            Prélèvements
          </TabsTrigger>
          <TabsTrigger className="text-xs md:text-base" value="refunds">
            Remboursements
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <TransactionsTable categories={[]} type={TransactionType.ONE_TIME} />
        </TabsContent>
        <TabsContent value="recurrings">
          <div>
            <h1>Prélèvements</h1>
          </div>
        </TabsContent>
        <TabsContent value="refunds">
          <div>
            <h1>Remboursements</h1>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
