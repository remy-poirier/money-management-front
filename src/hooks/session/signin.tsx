import { User } from '@/domain/user.ts'
import { common } from '@/conf/common.ts'
import { useMutation } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Token } from '@/domain/auth.ts'

export interface AuthResponse {
  user: User
  token: Token
}

const signinFn = ({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<User> => {
  return fetch(`${common.apiUrl}/signin`, {
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
      return res.json().then((response: AuthResponse) => {
        localStorage.setItem('mmtoken', JSON.stringify(response.token))
        return Promise.resolve(response.user)
      })
    })
    .catch((error) => {
      return Promise.reject(
        error.statusText ??
          "Oops, une erreur s'est produite, veuillez réessayer ultérieurement.",
      )
    })
}

export const useSignin = () => {
  const { mutateAsync, isLoading, error, isError } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      return signinFn({ email, password })
    },
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(`Oops ! Une erreur s'est produite`, {
        description: `Erreur lors de la connexion du compte (${error})`,
      })
    }
  }, [isError, error])

  return {
    signin: mutateAsync,
    isLoading,
    error,
    isError,
  }
}
