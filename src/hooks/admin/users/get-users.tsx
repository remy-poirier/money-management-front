import { common } from '@/conf/common.ts'
import { useQuery } from 'react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Paginate } from '@/domain/paginate.ts'
import { User } from '@/domain/user.ts'

const getUsersFn = async (): Promise<Paginate<User>> => {
  return fetch(`${common.apiUrl}/admin/users`, {
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

export const useGetUsers = () => {
  const { data, isError, error, isLoading } = useQuery('users', getUsersFn, {})

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des utilisateurs (${error})`,
      })
    }
  }, [isError, error])

  return {
    users: data,
    isLoading,
  }
}
