import { Paginate } from '@/domain/paginate.ts'
import { common } from '@/conf/common.ts'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Transaction } from '@/domain/transaction.ts'
import { getTokenOrFail } from '@/lib/utils.ts'

const getLastTransactionsFn = async (): Promise<Transaction[]> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  // Create url with query params
  const url = new URL(`${common.apiUrl}/transactions/last-transactions`)

  return fetch(url, {
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

export const useGetLastTransactions = () => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['getLastTransactions'],
    queryFn: getLastTransactionsFn,
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des transactions (${error})`,
      })
    }
  }, [isError, error])

  return {
    lastTransactions: data || [],
    isLoading,
  }
}
