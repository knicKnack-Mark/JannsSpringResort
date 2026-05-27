// composables/useApi.js
import axios from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const user = useCookie('user')

  const api = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.request.use((request) => {
    if (token.value) {
      request.headers.Authorization = `Bearer ${token.value}`
    }

    return request
  })

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status
      const url = error?.config?.url

      if (status === 401 && url !== '/login') {
        token.value = null
        user.value = null

        await navigateTo('/admin/login')
      }

      return Promise.reject(error)
    }
  )

  const apiFetch = async (url, options = {}) => {
    const response = await api({
      url,
      ...options
    })

    return response.data
  }

  return {
    api,
    apiFetch
  }
}