import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { BigInput, Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Category } from '@/domain/category.ts'
import {
  Transaction,
  TransactionType,
  TransactionForm as TransactionFormSchema,
} from '@/domain/transaction.ts'
import { Calendar, Check, Plus } from 'lucide-react'
import { useQueryClient } from 'react-query'
import { useUserStore } from '@/store/store.ts'

const now = new Date()
const lastDayOfMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  0,
).getDate()

const expenseSchema = z.object({
  name: z.string().min(1, 'Champ obligatoire'),
  amount: z.string(),
  type: z.nativeEnum(TransactionType),
  day: z.coerce
    .number()
    .min(1)
    .max(lastDayOfMonth, `Le jour ne peut pas dépasser le ${lastDayOfMonth}`),
  category_id: z.string(),
  collected: z.boolean().default(false),
  archived: z.boolean().default(false),
})

interface Props {
  open: boolean
  onClose: () => void
  onOpenChange: (isOpen: boolean) => void
  type: TransactionType
  expense?: Transaction
  mode: 'add' | 'edit' | 'wage' | 'editMobile' | 'addMobile'
  submitHandler: (expense: TransactionFormSchema) => Promise<Transaction>
}

export const TransactionForm = ({
  open,
  onClose,
  type,
  expense,
  submitHandler,
  onOpenChange,
  mode,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const categories = useUserStore((state) => state.categories)

  const queryClient = useQueryClient()
  const setEnableShortcuts = useUserStore((state) => state.setEnableShortcuts)
  const enableShortcut = useUserStore((state) => state.enableShortcuts)

  useEffect(() => {
    if (open && enableShortcut) {
      setEnableShortcuts(false)
    }

    if (!open && !enableShortcut) {
      setEnableShortcuts(true)
    }
  }, [open])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter') {
        e.preventDefault()
        form.handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    mode: 'onChange',
    defaultValues: {
      name: expense?.name ?? '',
      amount: `${expense?.amount ?? 1}`,
      day: expense?.day ?? new Date().getDate(),
      type: expense?.type ?? type,
      category_id:
        expense?.category_id ?? '8fbd6c98-cc0f-11ee-9489-325096b39f47',
      collected: expense?.collected ?? type === 'REFUND',
      archived: expense?.archived ?? false,
    },
  })

  const modalHeader = () => {
    switch (type) {
      case 'ONE_TIME':
        return 'Ajouter une nouvelle dépense'
      case 'REFUND':
        return 'Ajouter un nouveau remboursement'
      case 'WAGE':
        return 'Ajouter une nouvelle paie'
      case 'RECURRING':
      default:
        return 'Ajouter un nouveau prélèvement récurrent'
    }
  }

  const selectTag = (category: Category) => () => {
    form.setValue('category_id', category.id, { shouldValidate: true })
  }

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['transactions'],
    })
    await queryClient.invalidateQueries({ queryKey: ['account'] })
  }

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    setLoading(true)
    const amount = parseFloat(values.amount).toFixed(2)
    submitHandler({
      ...expense,
      ...values,
      amount: parseFloat(amount),
    })
      .then(() => {
        form.reset()
        onClose()
        invalidateQueries()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{modalHeader()}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <BigInput
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D,./g, '')

                        if (value) {
                          if (value.includes('.')) {
                            const parts = value.split('.')
                            if (parts[1].length > 2) {
                              e.preventDefault()
                            } else {
                              form.setValue('amount', `${value}`, {
                                shouldValidate: true,
                              })
                            }
                          } else {
                            const asNumber = parseFloat(value)
                            form.setValue('amount', `${asNumber}`, {
                              shouldValidate: true,
                            })
                          }
                        } else {
                          form.setValue('amount', '', { shouldValidate: true })
                        }
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} autoFocus={false} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jour</FormLabel>
                    <FormControl>
                      <Input {...field} endIcon={<Calendar size={20} />} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {['ONE_TIME', 'REFUND'].includes(type) && (
              <FormField
                name="collected"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-2">
                    <div className="space-y-0.5">
                      <FormLabel>Collecté</FormLabel>
                      <FormDescription>
                        Si le champ est coché, alors la transaction sera
                        automatiquement marquée comme complétée et donc déduite
                        de votre montant sur compte.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        {...(mode === 'edit' && { disabled: true })}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col flex-1">
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <div className="flex flex-1 gap-2 flex-wrap">
                  {categories.map((c) => (
                    <Badge
                      className="cursor-pointer gap-2"
                      key={c.id}
                      onClick={selectTag(c)}
                    >
                      {c.name}
                      {form.getValues().category_id === c.id ? (
                        <Check size={12} />
                      ) : (
                        <Plus size={12} />
                      )}
                    </Badge>
                  ))}
                </div>
              </FormItem>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                disabled={loading}
                onClick={onClose}
                variant="outline"
              >
                Annuler
              </Button>
              <Button
                loading={loading}
                type="submit"
                disabled={!form.formState.isValid}
              >
                {expense ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
