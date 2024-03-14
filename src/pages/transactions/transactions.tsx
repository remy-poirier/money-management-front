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
          <TransactionsTable type={TransactionType.ONE_TIME} />
        </TabsContent>
        <TabsContent value="recurrings">
          <TransactionsTable type={TransactionType.RECURRING} />
        </TabsContent>
        <TabsContent value="refunds">
          <TransactionsTable type={TransactionType.REFUND} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
