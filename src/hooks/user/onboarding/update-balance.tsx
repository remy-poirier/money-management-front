import { common } from '@/conf/common.ts'
import { useMutation } from 'react-query'
import { useUserStore } from '@/store/store.ts'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface UpdateOnboardingBalanceProps {
  balance: number
}

const updateOnboardingBalance = async (
  data: UpdateOnboardingBalanceProps,
): Promise<UpdateOnboardingBalanceProps> => {
  return fetch(`${common.apiUrl}/onboarding/balance`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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

export const useUpdateBalance = () => {
  const setBalance = useUserStore((state) => state.updateBalance)
  const { mutateAsync, isError, error } = useMutation({
    mutationFn: async (data: UpdateOnboardingBalanceProps) => {
      updateOnboardingBalance(data).then((balance) => {
        setBalance(balance.balance)
      })
    },
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la mise à jour du montant (${error})`,
      })
    }
  }, [isError, error])

  return {
    updateBalance: mutateAsync,
  }
}
