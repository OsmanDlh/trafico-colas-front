import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import apiClient from '@/lib/api-client'
import type {
  MM1KRequest,
  MM1Request,
  MMSKRequest,
  MMSRequest,
  ModelResponse,
} from '@/types/queue.type'

const modelsKeys = {
  all: ['models'] as const,
}

const useAnalyzeMm1 = (): UseMutationResult<ModelResponse, Error, MM1Request> => {
  return useMutation({
    mutationFn: async (payload: MM1Request): Promise<ModelResponse> => {
      const response = await apiClient.post<ModelResponse>('/api/v1/models/mm1', payload)
      return response.data
    },
  })
}

const useAnalyzeMm1k = (): UseMutationResult<ModelResponse, Error, MM1KRequest> => {
  return useMutation({
    mutationFn: async (payload: MM1KRequest): Promise<ModelResponse> => {
      const response = await apiClient.post<ModelResponse>('/api/v1/models/mm1k', payload)
      return response.data
    },
  })
}

const useAnalyzeMms = (): UseMutationResult<ModelResponse, Error, MMSRequest> => {
  return useMutation({
    mutationFn: async (payload: MMSRequest): Promise<ModelResponse> => {
      const response = await apiClient.post<ModelResponse>('/api/v1/models/mms', payload)
      return response.data
    },
  })
}

const useAnalyzeMmsk = (): UseMutationResult<ModelResponse, Error, MMSKRequest> => {
  return useMutation({
    mutationFn: async (payload: MMSKRequest): Promise<ModelResponse> => {
      const response = await apiClient.post<ModelResponse>('/api/v1/models/mmsk', payload)
      return response.data
    },
  })
}

export { modelsKeys, useAnalyzeMm1, useAnalyzeMm1k, useAnalyzeMms, useAnalyzeMmsk }
