import { Link, Outlet } from 'react-router-dom'
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

function App() {
  const user = useUserStore((state) => state.user)

  const { signout } = useSignout()
  const { isLoading } = useAuthStatus()

  const logout = async () => {
    signout().then(() => {
      toast.success('Déconnexion réussie')
    })
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    )

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-screen-2xl">
          <div className="sm:block md:hidden"></div>
          <Link to="/">
            <span className="sm:text-md md:text-xl font-bold">
              MoneyManager
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                {user.isAdmin && (
                  <Link to="/admin/users">
                    <Button variant="outline">Utilisateurs</Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer w-[2rem] h-[2rem]">
                      {user.avatarUrl && (
                        <AvatarImage
                          src={user.avatarUrl}
                          alt={user?.fullName ?? user.email}
                        />
                      )}
                      <AvatarFallback className="bg-primary">
                        {(user?.fullName ?? user.email).slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Connecté(e) en tant que {user.fullName ?? user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
