import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useQueryClient } from 'react-query'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useUserStore } from '@/store/store.ts'
import { CurrencyIcon } from '@/components/currency-icon.tsx'

interface Props {
  wageAmount?: number
  open: boolean
  onClose: () => void
  submitHandler: (amount: number) => Promise<number>
  toggleOpen: (isOpen: boolean) => void
  title: string
}

const wageSchema = z.object({
  amount: z.coerce.number().min(1),
})

const WageForm = ({
  wageAmount,
  open,
  onClose,
  submitHandler,
  title,
  toggleOpen,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const updateBalance = useUserStore((state) => state.updateBalance)

  const form = useForm<z.infer<typeof wageSchema>>({
    resolver: zodResolver(wageSchema),
    mode: 'onChange',
    defaultValues: {
      amount: wageAmount ?? 1,
    },
  })

  useEffect(() => {
    if (wageAmount) {
      form.setValue('amount', wageAmount)
    }
  }, [wageAmount])

  const onSubmit = async (values: z.infer<typeof wageSchema>) => {
    setLoading(true)
    submitHandler(values.amount)
      .then((amount) => {
        updateBalance(amount)
        form.reset()
        toast.success(`Paye enregistrée avec succès`)
        queryClient.invalidateQueries({ queryKey: ['getWage'] })
      })
      .finally(() => {
        setLoading(false)
      })

    onClose()
  }

  const isValid = () => !form.getFieldState('amount').invalid

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={<CurrencyIcon size={20} />}
                      endIcon={
                        isValid() ? (
                          <CheckCircle2 color="green" />
                        ) : (
                          <XCircle color="red" />
                        )
                      }
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center">
                    Le montant doit être de minimum 1 <CurrencyIcon size={12} />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                disabled={loading}
                onClick={onClose}
                variant="ghost"
              >
                Annuler
              </Button>
              <Button loading={loading} type="submit">
                Sauvegarder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default WageForm
