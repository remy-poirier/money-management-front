import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'

export const Home = () => {
  return (
    <>
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Money Manager
        </h1>
        <span className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Prenez le contrôle de vos finances dès aujourd&apos;hui avec cette
          application de gestion des dépenses intelligente!
        </span>
      </section>
      <section className="max-w-full px-0 md:px-10">
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
