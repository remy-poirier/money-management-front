import { common } from '@/conf/common.ts'
import { useMutation } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

const editWageFn = async (amount: number): Promise<number> => {
  return fetch(`${common.apiUrl}/transactions/wage`, {
    method: 'POST',
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
export const useEditWage = () => {
  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: editWageFn,
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des utilisateurs (${error})`,
      })
    }
  }, [isError, error])

  return {
    editWage: mutateAsync,
    isLoading,
  }
}
