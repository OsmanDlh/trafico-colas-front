import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import apiClient from '@/lib/api-client'
import type {
  CapacityPlanningRequest,
  CapacityPlanningResponse,
  CompareScenariosRequest,
  CompareScenariosResponse,
  NetworkHealthRequest,
  NetworkHealthResponse,
  RecommendModelRequest,
  RecommendModelResponse,
} from '@/types/queue.type'

const decisionKeys = {
  all: ['decision'] as const,
}

const useRecommendModel = (): UseMutationResult<
  RecommendModelResponse,
  Error,
  RecommendModelRequest
> => {
  return useMutation({
    mutationFn: async (payload: RecommendModelRequest): Promise<RecommendModelResponse> => {
      const response = await apiClient.post<RecommendModelResponse>(
        '/api/v1/decision/recommend-model',
        payload,
      )
      return response.data
    },
  })
}

const useCapacityPlanning = (): UseMutationResult<
  CapacityPlanningResponse,
  Error,
  CapacityPlanningRequest
> => {
  return useMutation({
    mutationFn: async (payload: CapacityPlanningRequest): Promise<CapacityPlanningResponse> => {
      const response = await apiClient.post<CapacityPlanningResponse>(
        '/api/v1/decision/capacity-planning',
        payload,
      )
      return response.data
    },
  })
}

const useNetworkHealth = (): UseMutationResult<
  NetworkHealthResponse,
  Error,
  NetworkHealthRequest
> => {
  return useMutation({
    mutationFn: async (payload: NetworkHealthRequest): Promise<NetworkHealthResponse> => {
      const response = await apiClient.post<NetworkHealthResponse>(
        '/api/v1/decision/network-health',
        payload,
      )
      return response.data
    },
  })
}

const useCompareScenarios = (): UseMutationResult<
  CompareScenariosResponse,
  Error,
  CompareScenariosRequest
> => {
  return useMutation({
    mutationFn: async (payload: CompareScenariosRequest): Promise<CompareScenariosResponse> => {
      const response = await apiClient.post<CompareScenariosResponse>(
        '/api/v1/decision/compare-scenarios',
        payload,
      )
      return response.data
    },
  })
}

export {
  decisionKeys,
  useCapacityPlanning,
  useCompareScenarios,
  useNetworkHealth,
  useRecommendModel,
}
