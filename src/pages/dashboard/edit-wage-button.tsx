import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SquarePen } from 'lucide-react'
import WageForm from '@/pages/dashboard/wage-form.tsx'
import { useEditWage } from '@/hooks/transactions/edit-wage.tsx'

interface Props {
  wageAmount: number
}

const EditButtonWage = ({ wageAmount }: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  const { editWage } = useEditWage()

  return (
    <>
      <Button aria-label="Edit wage" size="icon-sm" onClick={onOpen}>
        <SquarePen size={14} />
      </Button>
      {wageAmount && (
        <WageForm
          wageAmount={wageAmount}
          open={open}
          onClose={onClose}
          submitHandler={editWage}
          toggleOpen={setOpen}
          title="Éditer votre dernière paie"
        />
      )}
    </>
  )
}

export default EditButtonWage
