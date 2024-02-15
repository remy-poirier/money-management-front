import { Paginate } from '@/domain/paginate.ts'
import { common } from '@/conf/common.ts'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Transaction, TransactionType } from '@/domain/transaction.ts'

const getTransactionsFn = async (
  type: TransactionType,
): Promise<Paginate<Transaction>> => {
  return fetch(`${common.apiUrl}/transactions?type=${type}`, {
    method: 'GET',
    credentials: 'include',
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

export const useGetTransactions = (type: TransactionType) => {
  const { data, isError, error, isLoading } = useQuery(
    'users',
    async () => {
      return await getTransactionsFn(type)
    },
    {},
  )

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des transactions (${error})`,
      })
    }
  }, [isError, error])

  return {
    transactions: data,
    isLoading,
  }
}
