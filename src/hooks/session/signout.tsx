import { common } from '@/conf/common.ts'
import { useMutation } from 'react-query'
import { useUserStore } from '@/store/store.ts'

const signoutFn = (): Promise<string> => {
  return fetch(`${common.apiUrl}/signout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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

export const useSignout = () => {
  const signOut = useUserStore((state) => state.signOut)
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async () => {
      return signoutFn().then(() => {
        signOut()
      })
    },
  })

  return {
    signout: mutateAsync,
    isLoading,
  }
}
