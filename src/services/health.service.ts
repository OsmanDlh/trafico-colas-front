import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import apiClient from '@/lib/api-client'
import type { HealthResponse } from '@/types/queue.type'

const healthKeys = {
  all: ['health'] as const,
  status: () => [...healthKeys.all, 'status'] as const,
}

const useHealth = (): UseQueryResult<HealthResponse> => {
  return useQuery({
    queryKey: healthKeys.status(),
    queryFn: async (): Promise<HealthResponse> => {
      const response = await apiClient.get<HealthResponse>('/api/v1/health')
      return response.data
    },
    retry: false,
    refetchInterval: 30_000,
  })
}

export { healthKeys, useHealth }
