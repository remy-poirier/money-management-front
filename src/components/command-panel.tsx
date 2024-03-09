import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command.tsx'
import {
  ArrowLeftRight,
  CalendarCheck,
  CreditCard,
  Handshake,
  Home,
  PiggyBank,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore } from '@/store/store.ts'
import { TransactionType } from '@/domain/transaction.ts'

interface Props {
  open: boolean
  onOpenChange: () => void
  showCreateTransaction: (mode: TransactionType) => void
  showToggleTransactionsPanel: () => void
}

export const CommandPanel = ({
  open,
  onOpenChange,
  showCreateTransaction,
  showToggleTransactionsPanel,
}: Props) => {
  const navigate = useNavigate()
  const setEnableShortcuts = useUserStore((state) => state.setEnableShortcuts)

  const navigateHome = () => {
    navigate('/')
    onOpenChange()
  }
  const navigateDashboard = () => {
    navigate('/app/dashboard')
    onOpenChange()
  }
  const navigateTransactions = () => {
    navigate('/app/transactions')
    onOpenChange()
  }

  useEffect(() => {
    if (open) {
      setEnableShortcuts(false)
    } else {
      setEnableShortcuts(true)
    }
  }, [open])

  const showCreateTransactionShortcut = (mode: TransactionType) => () => {
    showCreateTransaction(mode)
    onOpenChange()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Tapez une commande ou recherchez" />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
        <CommandGroup heading="Transactions">
          <CommandItem
            onSelect={showCreateTransactionShortcut(TransactionType.ONE_TIME)}
          >
            <CreditCard className="mr-2" />
            <span>Ajouter un nouveau paiement</span>
            <CommandShortcut>⇧ + T</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={showCreateTransactionShortcut(TransactionType.RECURRING)}
          >
            <CalendarCheck className="mr-2" />
            <span>Ajouter un nouveau prélèvement</span>
            <CommandShortcut>⇧ + P</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={showCreateTransactionShortcut(TransactionType.REFUND)}
          >
            <PiggyBank className="mr-2" />
            <span>Ajouter un nouveau remboursement</span>
            <CommandShortcut>⇧ + R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={showToggleTransactionsPanel}>
            <Handshake className="mr-2" />
            <span>Collecter des transactions</span>
            <CommandShortcut>tc</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={navigateHome}>
            <Home className="mr-2" />
            <span>Accéder à l'accueil</span>
            <CommandShortcut>gh</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={navigateDashboard}>
            <TrendingUp className="mr-2" />
            <span>Accéder au tableau de bord</span>
            <CommandShortcut>gd</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={navigateTransactions}>
            <ArrowLeftRight className="mr-2" />
            <span>Accéder aux transactions</span>
            <CommandShortcut>gt</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
