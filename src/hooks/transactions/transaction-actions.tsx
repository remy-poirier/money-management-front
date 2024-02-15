import { useMutation, useQueryClient } from 'react-query'
import { Transaction, TransactionForm } from '@/domain/transaction.ts'
import { common } from '@/conf/common.ts'

const addTransactionFn = async (
  transactionCreation: TransactionForm,
): Promise<Transaction> => {
  return fetch(`${common.apiUrl}/transactions`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionCreation),
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

const toggleCollectedTransactionFn = async (
  id: string,
): Promise<Transaction> => {
  return fetch(`${common.apiUrl}/transactions/toggle-collected`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
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

const deleteTransactionFn = async (id: string): Promise<Transaction> => {
  return fetch(`${common.apiUrl}/transactions/archive`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
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

export const useTransactionActions = () => {
  const queryClient = useQueryClient()
  const addTransactionMutation = useMutation({
    mutationFn: addTransactionFn,
  })

  const toggleCollectedMutation = useMutation({
    mutationFn: toggleCollectedTransactionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return {
    add: addTransactionMutation,
    update: (t: TransactionForm) => {
      console.log('to implement => ', t)
      return Promise.resolve()
    },
    toggleCollected: toggleCollectedMutation,
    archive: deleteMutation,
  }
}
