import { useState } from 'react'
import { Button } from '@/components/ui/button'
import WageForm from '@/pages/dashboard/wage-form.tsx'
import { useAddWage } from '@/hooks/transactions/add-wage.tsx'

const AddButtonWage = () => {
  const [open, setOpen] = useState<boolean>(false)

  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  const { addWage } = useAddWage()

  return (
    <>
      <Button size="sm" onClick={onOpen}>
        Ajouter
      </Button>
      <WageForm
        toggleOpen={setOpen}
        title="Saisie de votre paie"
        open={open}
        onClose={onClose}
        submitHandler={addWage}
      />
    </>
  )
}

export default AddButtonWage
