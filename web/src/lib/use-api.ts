import { useAuth } from '@clerk/clerk-react'
import { useCallback } from 'react'
import { apiFetch } from './api'

export function useApi() {
  const { getToken } = useAuth()

  const withToken = useCallback(
    async <T>(path: string, options: Parameters<typeof apiFetch>[1] = {}) => {
      const token = await getToken()
      return apiFetch<T>(path, { ...options, token })
    },
    [getToken],
  )

  return { api: withToken }
}
