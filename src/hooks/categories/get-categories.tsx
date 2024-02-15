import { common } from '@/conf/common.ts'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Category } from '@/domain/category.ts'

const getCategoriesFn = async (): Promise<Category[]> => {
  return fetch(`${common.apiUrl}/categories`, {
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

export const useGetCategories = () => {
  const { data, isError, error, isLoading } = useQuery(
    ['categories'],
    getCategoriesFn,
    {},
  )

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des catégories (${error})`,
      })
    }
  }, [isError, error])

  return {
    categories: data,
    isLoading,
  }
}