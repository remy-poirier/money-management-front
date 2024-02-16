import { Button } from '@/components/ui/button.tsx'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useResetTransactions } from '@/hooks/transactions/reset-transactions.tsx'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog.tsx'

export const ResetData = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const { resetTransactions } = useResetTransactions()

  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  const confirmReset = async () => {
    setLoading(true)
    resetTransactions()
      .then(() => {
        toast.success('Félicitations', {
          description:
            'Les dépenses de ce mois ont été réinitialisées avec succès.',
        })
      })
      .finally(() => {
        setLoading(false)
        onClose()
      })
  }

  return (
    <div className="flex justify-end">
      <Button className="flex gap-2" onClick={onOpen}>
        <RotateCcw size={18} />
        Réinitialiser les dépenses de ce mois
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser les dépenses</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va retirer les dépenses ponctuelles & les
              remboursements ayant le statut collecté, ainsi que réinitialiser
              les dépenses récurrentes en repssant leurs statuts à
              non-collectés. Idéalement cette opération doit être faite en début
              de mois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <Button loading={loading} onClick={confirmReset}>
              Confirmer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
