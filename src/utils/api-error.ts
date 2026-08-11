import axios from 'axios'

import type { ApiErrorBody } from '@/types/queue.type'

const getApiErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Error inesperado'
  }

  const data = error.response?.data as ApiErrorBody | undefined

  if (!data) {
    return error.message || 'No se pudo conectar con la API'
  }

  if (typeof data.detail === 'string') {
    const parts = [data.detail]
    if (data.hint) parts.push(data.hint)
    return parts.join(' — ')
  }

  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg).join('; ')
  }

  return error.message || 'Error de la API'
}

export { getApiErrorMessage }
