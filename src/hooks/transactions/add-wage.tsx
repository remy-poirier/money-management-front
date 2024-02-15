import { common } from '@/conf/common.ts'
import { useMutation } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

const addWageFn = async (amount: number): Promise<number> => {
  return fetch(`${common.apiUrl}/transactions/wage`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
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
export const useAddWage = () => {
  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: addWageFn,
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des utilisateurs (${error})`,
      })
    }
  }, [isError, error])

  return {
    addWage: mutateAsync,
    isLoading,
  }
}
