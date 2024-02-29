import { useMutation, useQueryClient } from 'react-query'
import { Transaction, TransactionForm } from '@/domain/transaction.ts'
import { common } from '@/conf/common.ts'
import { toast } from 'sonner'
import { getTokenOrFail } from '@/lib/utils.ts'

const addTransactionFn = async (
  transactionCreation: TransactionForm,
): Promise<Transaction> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/transactions`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

const updateTransactionFn = async ({
  id,
  transactionEdition,
}: {
  id: string
  transactionEdition: TransactionForm
}): Promise<Transaction> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/transactions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id,
      ...transactionEdition,
    }),
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
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/transactions/toggle-collected`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

const deleteTransactionFn = async (id: string): Promise<void> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/transactions/archive`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
      queryClient.invalidateQueries({ queryKey: ['account'] })
      toast.success(`Félicitations`, {
        description: `Statut de la transaction mis à jour avec succès`,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['account'] })
      toast.success(`Félicitations`, {
        description: `Transaction archivée avec succès`,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateTransactionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['account'] })
      toast.success(`Félicitations`, {
        description: `Transaction mise à jour avec succès`,
      })
    },
  })

  return {
    add: addTransactionMutation,
    update: updateMutation,
    toggleCollected: toggleCollectedMutation,
    archive: deleteMutation,
  }
}
