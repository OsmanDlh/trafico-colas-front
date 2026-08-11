import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import apiClient from '@/lib/api-client'
import type { CostOptimizeRequest, CostOptimizeResponse } from '@/types/queue.type'

const costsKeys = {
  all: ['costs'] as const,
}

const useOptimizeCost = (): UseMutationResult<CostOptimizeResponse, Error, CostOptimizeRequest> => {
  return useMutation({
    mutationFn: async (payload: CostOptimizeRequest): Promise<CostOptimizeResponse> => {
      const response = await apiClient.post<CostOptimizeResponse>('/api/v1/costs/optimize', payload)
      return response.data
    },
  })
}

export { costsKeys, useOptimizeCost }
