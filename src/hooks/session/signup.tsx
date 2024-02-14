import { useMutation } from 'react-query'
import { User } from '@/domain/User.ts'
import { common } from '@/conf/common.ts'
import { toast } from 'sonner'
import { useEffect } from 'react'

const signupFn = ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<User> => {
  return fetch(`${common.apiUrl}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
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

export const useSignup = () => {
  const { mutateAsync, isLoading, data, error, isError } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      return signupFn({ email, password })
    },
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la création du compte (${error})`,
      })
    }
  }, [isError, error])

  return {
    signup: mutateAsync,
    isLoading,
    data,
    error,
    isError,
  }
}
