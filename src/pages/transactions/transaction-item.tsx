import {
  Transaction,
  TransactionForm as TransactionEdition,
} from '@/domain/transaction'
import { TransactionItemDesktop } from '@/pages/transactions/transaction-item-desktop.tsx'
import { Category } from '@/domain/category.ts'
import { TransactionItemMobile } from '@/pages/transactions/transaction-item-mobile.tsx'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config.js'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useState } from 'react'
import { useTransactionActions } from '@/hooks/transactions/transaction-actions.tsx'
import { ConfirmToggle } from '@/pages/transactions/transaction-actions/confirm-toggle.tsx'
import { ConfirmArchive } from '@/pages/transactions/transaction-actions/confirm-archive.tsx'
import { TransactionForm } from '@/pages/transactions/transaction-form.tsx'

type LoadingProps = {
  loading: true
  transaction: undefined
  categories: Category[]
}

type SuccessProps = {
  loading: false
  transaction: Transaction
  categories: Category[]
}

type Props = LoadingProps | SuccessProps

interface TransactionActionsBagItem {
  toggle: () => void
}

export interface TransactionActionsBag {
  toggleCollected: TransactionActionsBagItem
  edit: TransactionActionsBagItem
  archive: TransactionActionsBagItem
}

const fullConfig = resolveConfig(tailwindConfig)
export const TransactionItem = ({
  loading,
  transaction,
  categories,
}: Props) => {
  const [showArchive, setShowArchive] = useState<boolean>(false)
  const [showToggle, setShowToggle] = useState<boolean>(false)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const transactionActions = useTransactionActions()

  const toggleArchive = () => setShowArchive(!showArchive)
  const toggleToggle = () => setShowToggle(!showToggle)
  const toggleEdit = () => setShowEdit(!showEdit)

  const closeArchive = () => setShowArchive(false)
  const closeToggle = () => setShowToggle(false)
  const closeEdit = () => setShowEdit(false)

  const isSmallDevice = useMediaQuery(
    `only screen and (max-width : ${fullConfig.theme.screens.md})`,
  )

  if (loading) {
    return (
      <>
        {isSmallDevice && (
          <TransactionItemMobile
            loading={true}
            transaction={undefined}
            transactionActionsBag={undefined}
          />
        )}
        {!isSmallDevice && (
          <TransactionItemDesktop
            loading={true}
            transaction={undefined}
            transactionActionsBag={undefined}
          />
        )}
      </>
    )
  }

  const editTransaction = async (transactionEdition: TransactionEdition) => {
    return transactionActions.update.mutateAsync({
      id: transaction.id,
      transactionEdition,
    })
  }

  const buildTransactionActionsBag = {
    toggleCollected: {
      toggle: toggleToggle,
    },
    edit: {
      toggle: toggleEdit,
    },
    archive: {
      toggle: toggleArchive,
    },
  }

  return (
    <>
      {isSmallDevice && (
        <TransactionItemMobile
          loading={false}
          transaction={transaction}
          transactionActionsBag={buildTransactionActionsBag}
        />
      )}
      {!isSmallDevice && (
        <TransactionItemDesktop
          loading={loading}
          transaction={transaction}
          transactionActionsBag={buildTransactionActionsBag}
        />
      )}
      {transaction && (
        <>
          <ConfirmToggle
            open={showToggle}
            onOpenChange={setShowToggle}
            transaction={transaction}
            onClose={closeToggle}
          />
          <ConfirmArchive
            open={showArchive}
            onOpenChange={setShowArchive}
            transaction={transaction}
            onClose={closeArchive}
          />
          <TransactionForm
            onOpenChange={setShowEdit}
            open={showEdit}
            onClose={closeEdit}
            type={transaction.type}
            mode={'edit'}
            submitHandler={editTransaction}
            categories={categories}
            expense={transaction}
          />
        </>
      )}
    </>
  )
}
