import { Transaction } from '@/domain/transaction.ts'
import { getTokenOrFail } from '@/lib/utils.ts'
import { common } from '@/conf/common.ts'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

const nextToCollectFn = async (): Promise<Transaction[]> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/transactions/next-to-collect`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(res)
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

export const useNextToCollect = () => {
  const { data, isLoading, isError, error, refetch } = useQuery(
    'nextToCollect',
    nextToCollectFn,
    {},
  )

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération de vos prochaines collectes (${error})`,
      })
    }
  }, [isError, error])

  return {
    nextToCollect: data,
    isLoading,
    refetch,
  }
}
