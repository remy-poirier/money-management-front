import { OnboardingStatus } from '@/domain/user.ts'
import { common } from '@/conf/common.ts'
import { useMutation } from 'react-query'
import { useUserStore } from '@/store/store.ts'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface UpdateOnboardingStatusProps {
  onboardingStatus: OnboardingStatus
  isOnboarded: boolean
}

const updateOnboardingStatus = async (
  data: Pick<UpdateOnboardingStatusProps, 'onboardingStatus'>,
): Promise<UpdateOnboardingStatusProps> => {
  return fetch(`${common.apiUrl}/onboarding/update`, {
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

export const useUpdateOnboardingStatus = () => {
  const setOnboardingStatus = useUserStore((state) => state.setOnboardingStatus)
  const { mutateAsync, isError, error } = useMutation({
    mutationFn: async (
      data: Pick<UpdateOnboardingStatusProps, 'onboardingStatus'>,
    ) => {
      console.log('ok update status')
      updateOnboardingStatus(data).then((status) => {
        setOnboardingStatus({
          status: status.onboardingStatus,
          isOnboarded: status.isOnboarded,
        })
      })
    },
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la mise à jour du statut (${error})`,
      })
    }
  }, [isError, error])

  return {
    updateOnboardingStatus: mutateAsync,
  }
}
