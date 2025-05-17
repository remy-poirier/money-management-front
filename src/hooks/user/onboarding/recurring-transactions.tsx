import { useMutation } from '@tanstack/react-query'
import { common } from '@/conf/common.ts'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getTokenOrFail } from '@/lib/utils.ts'

interface RecurringTransactionsProps {
  transactions: {
    name: string
    amount: number
    day: number
  }[]
}

const addRecurringTransactions = async (
  data: RecurringTransactionsProps,
): Promise<void> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/onboarding/transactions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
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

export const useRecurringTransactions = () => {
  const { mutateAsync, isError, error } = useMutation({
    mutationFn: addRecurringTransactions,
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la mise à jour du montant (${error})`,
      })
    }
  }, [isError, error])

  return {
    addRecurringTransactions: mutateAsync,
  }
}
