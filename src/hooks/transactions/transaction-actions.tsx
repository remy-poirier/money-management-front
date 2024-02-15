import { useMutation } from 'react-query'
import { Transaction } from '@/domain/transaction.ts'
import { common } from '@/conf/common.ts'

const addTransactionFn = async (
  transactionCreation: Omit<Transaction, 'id'>,
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

export const useTransactionActions = () => {
  const addTransactionMutation = useMutation({
    mutationFn: addTransactionFn,
  })

  return {
    add: addTransactionMutation,
    update: (t: Transaction) => {
      console.log('to implement => ', t)
      return Promise.resolve()
    },
    toggleCollected: (t: Transaction) => {
      console.log('to implement => ', t)
      return Promise.resolve()
    },
    archive: (t: Transaction) => {
      console.log('to implement => ', t)
      return Promise.resolve()
    },
  }
}
