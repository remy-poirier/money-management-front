import { Paginate } from '@/domain/paginate.ts'
import { common } from '@/conf/common.ts'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Transaction, TransactionSearch } from '@/domain/transaction.ts'
import { getTokenOrFail } from '@/lib/utils.ts'

const getTransactionsFn =
  (transactionSearch: TransactionSearch) =>
  async ({ pageParam = 1 }): Promise<Paginate<Transaction>> => {
    const token = getTokenOrFail()
    if (!token) return Promise.reject('No token found')

    // Create url with query params
    const url = new URL(`${common.apiUrl}/transactions`)

    // For each key in transactionSearch, add a query param to the url
    Object.keys(transactionSearch).forEach((key) => {
      const value = transactionSearch[key as keyof TransactionSearch]
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
    url.searchParams.append('page', `${pageParam}`)
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

export const useGetTransactions = (transactionSearch: TransactionSearch) => {
  const {
    fetchNextPage,
    hasNextPage,
    data,
    isError,
    error,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      'transactions',
      transactionSearch.collected,
      transactionSearch.search,
      transactionSearch.orderByDirection,
    ],
    queryFn: getTransactionsFn(transactionSearch),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage === lastPage.meta.lastPage) {
        return undefined
      }
      return lastPage.meta.currentPage + 1
    },
  })

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
    fetchNextPage,
    hasNextPage,
  }
}
