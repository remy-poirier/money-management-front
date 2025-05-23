import { common } from '@/conf/common.ts'
import { useQuery } from '@tanstack/react-query'
import { useUserStore } from '@/store/store.ts'
import { User } from '@/domain/user.ts'
import { getTokenOrFail } from '@/lib/utils.ts'

type AuthSuccessResponse = {
  state: 'authenticated'
  user: User
}

type AuthErrorResponse = {
  state: 'unauthenticated'
}

type AuthResponse = AuthSuccessResponse | AuthErrorResponse

const authStatusFn = (): Promise<AuthResponse> => {
  const token = getTokenOrFail()
  if (!token) return Promise.reject('No token found')

  return fetch(`${common.apiUrl}/auth`, {
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

export const useAuthStatus = () => {
  const setUser = useUserStore((state) => state.setUser)
  const { isLoading } = useQuery({
    queryKey: ['account'],
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return authStatusFn().then((data) => {
        if (data.state === 'authenticated') {
          setUser(data.user)
        }
      })
    },
  })

  return {
    isLoading,
  }
}
