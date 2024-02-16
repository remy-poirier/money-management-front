import { Paginate } from '@/domain/paginate.ts'
import { common } from '@/conf/common.ts'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Transaction, TransactionSearch } from '@/domain/transaction.ts'

const getTransactionsFn = async (
  transactionSearch: TransactionSearch,
): Promise<Paginate<Transaction>> => {
  // Create url with query params
  const url = new URL(`${common.apiUrl}/transactions`)

  // For each key in transactionSearch, add a query param to the url
  Object.keys(transactionSearch).forEach((key) => {
    const value = transactionSearch[key as keyof TransactionSearch]
    if (value !== undefined) {
      url.searchParams.append(key, String(value))
    }
  })
  return fetch(url, {
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

export const useGetTransactions = (transactionSearch: TransactionSearch) => {
  const { data, isError, error, isLoading, refetch } = useQuery(
    [
      'transactions',
      transactionSearch.page,
      transactionSearch.collected,
      transactionSearch.search,
      transactionSearch.orderByDirection,
    ],
    async () => {
      return await getTransactionsFn(transactionSearch)
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
    refetchTransactions: refetch,
    isLoading,
  }
}
