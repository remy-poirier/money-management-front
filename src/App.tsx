import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import { useUserStore } from '@/store/store.ts'
import { Button } from '@/components/ui/button.tsx'
import { toast, Toaster } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { useSignout } from '@/hooks/session/signout.tsx'
import { useAuthStatus } from '@/hooks/session/auth-status.tsx'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { Command, MenuIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator.tsx'
import { useEffect, useState } from 'react'
import { CommandPanel } from '@/components/command-panel.tsx'
import { CreateTransactionShortcut } from '@/components/create-transaction-shortcut.tsx'
import { TransactionType } from '@/domain/transaction.ts'
import { useGetCategories } from '@/hooks/categories/get-categories.tsx'
import { ToggleTransactionsPanel } from '@/components/toggle-transactions-panel.tsx'
import { CurrencyIcon } from '@/components/currency-icon.tsx'

function App() {
  const user = useUserStore((state) => state.user)
  const enableShortcut = useUserStore((state) => state.enableShortcuts)

  const { isLoading: isLoadingCategories } = useGetCategories()

  const [showMobileSheet, setShowMobileSheet] = useState(false)

  const [lastKey, setLastKey] = useState<{ key: string; time: number } | null>(
    null,
  )

  const { signout } = useSignout()
  const { isLoading } = useAuthStatus()

  const location = useLocation()
  const navigate = useNavigate()

  const [showCommandPanel, setShowCommandPanel] = useState<boolean>(false)
  const [showToggleTransactionsPanel, setShowToggleTransactionsPanel] =
    useState<boolean>(false)
  const [showCreateTransactionShortcut, setShowCreateTransactionShortcut] =
    useState<boolean>(false)
  const [createTransactionMode, setCreateTransactionMode] = useState<
    TransactionType | undefined
  >(undefined)

  const closeCommandPanel = () => setShowCommandPanel(false)
  const toggleShowTransactionsPanel = () =>
    setShowToggleTransactionsPanel(!showToggleTransactionsPanel)
  const toggleCommandPanel = () => setShowCommandPanel(!showCommandPanel)
  const toggleShowCreateTransaction = () =>
    setShowCreateTransactionShortcut(!showCreateTransactionShortcut)
  const closeShowCreateTransaction = () =>
    setShowCreateTransactionShortcut(false)
  const toggleShowMobileSheet = () => setShowMobileSheet(!showMobileSheet)

  useEffect(() => {
    if (showMobileSheet) setShowMobileSheet(false)
  }, [location])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!enableShortcut || !user || (user && !user.isOnboarded)) return

      // Handle cmd + K
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        toggleCommandPanel()
      }

      // handle keys g & d combination
      if (e.key === 'g' || e.key === 'd') {
        if (
          lastKey &&
          e.key === 'd' &&
          lastKey.key === 'g' &&
          Date.now() - lastKey.time < 2000
        ) {
          setLastKey(null)
          navigate('/app/dashboard')
        } else {
          setLastKey({ key: e.key, time: Date.now() })
        }
      }

      if (e.key === 'g' || e.key === 'h') {
        if (
          lastKey &&
          e.key === 'h' &&
          lastKey.key === 'g' &&
          Date.now() - lastKey.time < 2000
        ) {
          setLastKey(null)
          navigate('/')
        } else {
          setLastKey({ key: e.key, time: Date.now() })
        }
      }

      if (e.key === 'g' || e.key === 't') {
        if (
          lastKey &&
          e.key === 't' &&
          lastKey.key === 'g' &&
          Date.now() - lastKey.time < 2000
        ) {
          setLastKey(null)
          navigate('/app/transactions')
        } else {
          setLastKey({ key: e.key, time: Date.now() })
        }
      }

      if (e.key === 't' || e.key === 'c') {
        if (
          lastKey &&
          e.key === 'c' &&
          lastKey.key === 't' &&
          Date.now() - lastKey.time < 2000
        ) {
          e.preventDefault()
          setLastKey(null)
          setShowToggleTransactionsPanel(true)
        } else {
          setLastKey({ key: e.key, time: Date.now() })
        }
      }

      // Handle shift + T combination
      if (e.key === 'T' && e.shiftKey) {
        setShowCreateTransactionShortcut(true)
        setCreateTransactionMode(TransactionType.ONE_TIME)
      }

      if (e.key === 'P' && e.shiftKey) {
        setShowCreateTransactionShortcut(true)
        setCreateTransactionMode(TransactionType.RECURRING)
      }

      if (e.key === 'R' && e.shiftKey) {
        setShowCreateTransactionShortcut(true)
        setCreateTransactionMode(TransactionType.REFUND)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enableShortcut, showCommandPanel, lastKey, user])

  const showCreateTransaction = (mode: TransactionType) => {
    setShowCreateTransactionShortcut(true)
    setCreateTransactionMode(mode)
  }

  useEffect(() => {
    if (lastKey && lastKey.key === 'g') {
      const timeoutId = setTimeout(() => {
        setLastKey(null)
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [lastKey])

  const logout = async () => {
    signout().then(() => {
      navigate('/')
      toast.success('Déconnexion réussie')
    })
  }

  if (isLoading || isLoadingCategories)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement de l'application...</p>
      </div>
    )

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-(--breakpoint-2xl)">
          <div className="sm:block md:hidden">
            <Sheet open={showMobileSheet} onOpenChange={setShowMobileSheet}>
              <SheetTrigger asChild>
                <Button
                  onClick={toggleShowMobileSheet}
                  size="icon"
                  variant="outline"
                >
                  <MenuIcon size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <SheetDescription>
                  {user ? (
                    <span>
                      Connecté(e) en tant que {user.fullName ?? user.email}
                      {user.isAdmin && ' (admin)'}
                    </span>
                  ) : (
                    <span>
                      Vous n&apos;êtes pas connecté(e). Connectez-vous pour
                      accéder aux fonctionnalités de l&apos;application.
                    </span>
                  )}
                </SheetDescription>
                <Separator className="my-4" />
                <nav>
                  <ul className="flex flex-col gap-4">
                    {user && (
                      <>
                        <li>
                          <Link to="/">
                            <Button className="w-full" variant="outline">
                              Accueil
                            </Button>
                          </Link>
                        </li>
                        <li>
                          <Link to="/app/dashboard">
                            <Button className="w-full" variant="outline">
                              Tableau de bord
                            </Button>
                          </Link>
                        </li>
                        <li>
                          <Link to="/app/transactions">
                            <Button className="w-full" variant="outline">
                              Transactions
                            </Button>
                          </Link>
                        </li>
                        {user.isAdmin && (
                          <>
                            <Separator />
                            <SheetDescription>Administration</SheetDescription>
                            <li>
                              <Link to="/app/admin/users">
                                <Button className="w-full" variant="outline">
                                  Utilisateurs
                                </Button>
                              </Link>
                            </li>
                          </>
                        )}
                        <li>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={logout}
                          >
                            Déconnexion
                          </Button>
                        </li>
                      </>
                    )}

                    {!user && (
                      <>
                        <li>
                          <Link to="/signup">
                            <Button className="w-full" variant="outline">
                              Inscription
                            </Button>
                          </Link>
                        </li>
                        <li>
                          <Link to="/login">
                            <Button className="w-full" variant="outline">
                              Connexion
                            </Button>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <Link to="/">
            <span className="sm:text-md md:text-xl font-bold">
              MoneyManager
            </span>
          </Link>
          {user && user.isOnboarded && (
            <kbd className="kbd kbd-md flex gap-2 text-black">
              <Command size={14} /> K
            </kbd>
          )}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <Link to="/app/dashboard">
                  <Button variant="outline">Tableau de bord</Button>
                </Link>
                <Link to="/app/transactions">
                  <Button variant="outline">Transactions</Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer w-8 h-8">
                      {user.avatarUrl && (
                        <AvatarImage
                          src={user.avatarUrl}
                          alt={user?.fullName ?? user.email}
                        />
                      )}
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {(user?.fullName ?? user.email).slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Connecté(e) en tant que {user.fullName ?? user.email}{' '}
                      <br />
                      <span className="text-xs italic font-light flex items-center">
                        Montant sur compte: {user.balance} <CurrencyIcon />
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.isAdmin && (
                      <>
                        <DropdownMenuLabel>Administration</DropdownMenuLabel>
                        <Link to="/app/admin/users">
                          <DropdownMenuItem className="cursor-pointer">
                            Utilisateurs
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logout}
                    >
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <>
                <Link to="/signup">
                  <Button variant="outline">Inscription</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Connexion</Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
          <div className="flex md:hidden gap-4">
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className="relative flex flex-1 flex-col bg-background">
        <main className="flex flex-col flex-1">
          <div className="container px-4 md:px-8 relative max-w-(--breakpoint-2xl) flex-1 flex flex-col">
            <section className="flex flex-col flex-1 py-2">
              <Outlet />
            </section>
          </div>
        </main>
      </div>
      <Toaster richColors />
      <CommandPanel
        showCreateTransaction={showCreateTransaction}
        open={showCommandPanel}
        onOpenChange={closeCommandPanel}
        showToggleTransactionsPanel={toggleShowTransactionsPanel}
      />
      <CreateTransactionShortcut
        open={showCreateTransactionShortcut}
        onOpenChange={toggleShowCreateTransaction}
        mode={createTransactionMode}
        onClose={closeShowCreateTransaction}
      />
      {showToggleTransactionsPanel && (
        <ToggleTransactionsPanel
          open={showToggleTransactionsPanel}
          onOpenChange={toggleShowTransactionsPanel}
        />
      )}
    </div>
  )
}

export default App
