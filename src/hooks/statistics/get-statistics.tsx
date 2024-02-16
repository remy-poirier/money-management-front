import { common } from '@/conf/common.ts'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Statistics } from '@/domain/statistics.ts'

const getStatisticsFn = async (): Promise<Statistics> => {
  return fetch(`${common.apiUrl}/statistics`, {
    method: 'GET',
    credentials: 'include',
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

export const useGetStatistics = () => {
  const { data, isLoading, isError, error } = useQuery(
    'statistics',
    getStatisticsFn,
    {},
  )

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la récupération des statistiques (${error})`,
      })
    }
  }, [isError, error])

  return {
    statistics: data,
    isLoading,
  }
}
