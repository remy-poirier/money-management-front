import { common } from '@/conf/common.ts'
import { useMutation, useQueryClient } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Statistics } from '@/domain/statistics.ts'
import { getTokenOrFail } from '@/lib/utils.ts'

const resetTransactionsFn = async (): Promise<Statistics> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/transactions/reset`, {
    method: 'POST',
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

export const useResetTransactions = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: resetTransactionsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['account'] })
    },
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des statistiques (${error})`,
      })
    }
  }, [isError, error])

  return {
    resetTransactions: mutateAsync,
    isLoading,
  }
}
