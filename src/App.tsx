import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import { useUserStore } from '@/store/store.ts'
import { Button } from '@/components/ui/button.tsx'
import { toast, Toaster } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
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
import { MenuIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator.tsx'
import { useEffect, useState } from 'react'

function App() {
  const user = useUserStore((state) => state.user)

  const [showMobileSheet, setShowMobileSheet] = useState(false)

  const { signout } = useSignout()
  const { isLoading } = useAuthStatus()

  const location = useLocation()
  const navigate = useNavigate()

  const toggleShowMobileSheet = () => setShowMobileSheet(!showMobileSheet)

  useEffect(() => {
    if (showMobileSheet) setShowMobileSheet(false)
  }, [location])

  const logout = async () => {
    signout().then(() => {
      navigate('/')
      toast.success('Déconnexion réussie')
    })
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement de l'application...</p>
      </div>
    )

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-screen-2xl">
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
                    <Avatar className="cursor-pointer w-[2rem] h-[2rem]">
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
                      <span className="text-xs italic font-light">
                        Montant sur compte: {user.balance}€
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
      <div className="relative flex min-h-screen flex-col bg-background">
        <main className="flex-1">
          <div className="container relative max-w-screen-2xl">
            <section className="py-2">
              <Outlet />
            </section>
          </div>
        </main>
      </div>
      <Toaster richColors />
    </div>
  )
}

export default App
