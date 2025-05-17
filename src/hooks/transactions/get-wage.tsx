import { common } from '@/conf/common.ts'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getTokenOrFail } from '@/lib/utils.ts'

const getLastWageFn = async (): Promise<number> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/transactions/wage`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getWage'],
    queryFn: getLastWageFn,
  })

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
