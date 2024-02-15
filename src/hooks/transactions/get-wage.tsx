import { common } from '@/conf/common.ts'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

const getLastWageFn = async (): Promise<number> => {
  return fetch(`${common.apiUrl}/transactions/wage`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(0)
      }
      return res.json()
    })
    .catch((error) => {
      return Promise.reject(
        error.statusText ??
          "Oops, une erreur s'est produite, veuillez réessayer ultérieurement.",
      )
    })
}

export const useGetWage = () => {
  const { data, isLoading, isError, error } = useQuery(
    'getWage',
    getLastWageFn,
    {},
  )

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération de votre dernier salaire (${error})`,
      })
    }
  }, [isError, error])

  return {
    wage: data,
    isLoading,
  }
}
