import { Button } from '@/components/ui/button.tsx'
import { Calendar, EuroIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input.tsx'
import { OnboardingTransaction } from '@/domain/transaction.ts'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'

interface Props {
  addTransaction: (transaction: OnboardingTransaction) => void
}

const today = new Date().getDate()

const schema = z.object({
  name: z.string().min(1, 'Le nom du prélèvement ne peut pas être vide'),
  amount: z.coerce.number(),
  day: z.coerce
    .number()
    .max(today, "La date doit être inférieure à aujourd'hui"),
})

export const RecurringTransactionForm = ({ addTransaction }: Props) => {
  const [showAddTransaction, setShowAddTransaction] = useState<boolean>(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      amount: 1,
      day: today,
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    addTransaction(data)
    form.reset()
    setShowAddTransaction(false)
  }

  const cancelAdd = () => {
    form.reset()
    setShowAddTransaction(false)
  }

  const showAddForm = () => setShowAddTransaction(true)

  return (
    <div className="flex flex-col flex-1 items-center">
      <Button onClick={showAddForm} variant="secondary">
        <Plus size={20} className="mr-2" />
        Ajouter un prélèvement
      </Button>
      <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un prélèvement</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col gap-4"
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Nom du prélèvement</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Abonnement Spotify" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant du prélèvement</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" endIcon={<EuroIcon />} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Jour de prélèvement
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" endIcon={<Calendar />} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-end gap-2">
                <Button onClick={cancelAdd} variant="secondary">
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
