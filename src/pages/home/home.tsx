import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { SparklesCore } from '@/components/sparkles.tsx'
import { useTheme } from '@/components/theme-provider.tsx'
import { Separator } from '@/components/ui/separator.tsx'

export const Home = () => {
  const { theme } = useTheme()

  return (
    <>
      <div className="h-[40rem] w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className="md:text-6xl text-4xl lg:text-8xl font-bold text-center text-foreground relative z-20">
          Money-Manager
        </h1>
        <div className="w-[40rem] h-40 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.1}
            maxSize={1.3}
            particleDensity={1500}
            className="w-full h-full"
            particleColor={theme === 'dark' ? '#fff' : '#000'}
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
      <Separator />
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-4 md:pb-4 lg:py-12 lg:pb-12">
        <span className="max-w-[750px] text-center text-xl lg:text-3xl text-muted-foreground sm:text-xl">
          Prenez le contrôle de vos finances dès aujourd&apos;hui avec cette
          application de gestion des dépenses intelligente!
        </span>
      </section>
      <section className="max-w-full px-0 md:px-10 pb-10">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Optimisez votre budget mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ajoutez simplement le montant de votre salaire mensuel et
                laissez notre application calculer automatiquement ce qu&apos;il
                vous reste après toutes vos dépenses. Fini le stress en fin de
                mois!
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gestion simplifiée des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Cette application vous permet de lister, ajouter, modifier et
                supprimer toutes vos dépenses ponctuelles, prélèvements
                récurrents et remboursements attendus, vous offrant une vue
                d&apos;ensemble complète de vos finances.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Statistiques variées</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Grâce à un panel de statistiques variées, visualisez
                immédiatement le montant de vos dépenses à venir,
                remboursements, prélèvements et dépenses ponctuelles.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
