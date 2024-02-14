import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button.tsx'

export const ErrorPage = () => {
  const error = useRouteError()

  let errorMessage: string

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    console.error(error)
    errorMessage = 'Unknown error'
  }

  return (
    <div
      className="relative flex min-h-screen flex-col bg-background"
      id="error-page"
    >
      <div className="flex flex-col flex-1  items-center justify-center content-center">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Oops !</CardTitle>
            <CardDescription>
              Désolé, une erreur est survenue durant la navigation, veuillez
              retourner à l'accueil
            </CardDescription>
          </CardHeader>
          <CardContent>
            Voici le détail de l'erreur :{' '}
            <pre className="whitespace-pre-wrap text-sm text-red-400">
              {errorMessage}
            </pre>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  )
}
