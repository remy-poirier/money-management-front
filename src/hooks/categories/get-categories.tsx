import { common } from '@/conf/common.ts'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Category } from '@/domain/category.ts'
import { getTokenOrFail } from '@/lib/utils.ts'
import { useUserStore } from '@/store/store.ts'

const getCategoriesFn = async (): Promise<Category[]> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/categories`, {
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

export const useGetCategories = () => {
  const setCategories = useUserStore((state) => state.setCategories)
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['categories'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return getCategoriesFn().then((categories) => {
        setCategories(categories)
      })
    },
  })

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
