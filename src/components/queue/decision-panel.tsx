import { useState } from 'react'
import toast from 'react-hot-toast'

import {
  CapacityForm,
  CompareForm,
  HealthForm,
  RecommendForm,
} from '@/components/queue/decision-forms'
import DecisionResultView from '@/components/queue/decision-result-view'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  CompareScenariosFormValues,
  NetworkHealthFormValues,
  RecommendModelFormValues,
} from '@/lib/queue-schemas'
import { cn } from '@/lib/utils'
import {
  useCapacityPlanning,
  useCompareScenarios,
  useNetworkHealth,
  useRecommendModel,
} from '@/services/decision.service'
import type {
  CapacityPlanningRequest,
  CapacityPlanningResponse,
  CompareScenariosResponse,
  NetworkHealthResponse,
  RecommendModelResponse,
} from '@/types/queue.type'
import { getApiErrorMessage } from '@/utils/api-error'

type DecisionTab = 'recommend' | 'capacity' | 'health' | 'compare'

const tabs: { id: DecisionTab; label: string; help: string }[] = [
  { id: 'health', label: '¿Voy bien?', help: 'Diagnóstico rápido de tu operación' },
  {
    id: 'recommend',
    label: '¿Qué tipo de operación tengo?',
    help: 'Te orientamos sin tecnicismos',
  },
  { id: 'capacity', label: '¿Cuánta gente necesito?', help: 'Mínimo equipo para cumplir metas' },
  { id: 'compare', label: 'Comparar dos opciones', help: 'Ej.: 3 vs 4 personas' },
]

const DecisionPanel = () => {
  const [tab, setTab] = useState<DecisionTab>('health')
  const [result, setResult] = useState<
    | RecommendModelResponse
    | CapacityPlanningResponse
    | NetworkHealthResponse
    | CompareScenariosResponse
    | null
  >(null)

  const recommend = useRecommendModel()
  const capacity = useCapacityPlanning()
  const health = useNetworkHealth()
  const compare = useCompareScenarios()
  const isPending =
    recommend.isPending || capacity.isPending || health.isPending || compare.isPending
  const onError = (error: Error) => toast.error(getApiErrorMessage(error))

  const handleRecommend = (data: RecommendModelFormValues) => {
    recommend.mutate(
      {
        lambda: data.lambda,
        mu: data.mu,
        finite_buffer: data.finite_buffer,
        servers_available: data.servers_available,
        k: data.k,
      },
      {
        onSuccess: (response) => {
          setResult(response)
          toast.success(`Usa ${response.recommended_model}`)
        },
        onError,
      },
    )
  }

  const handleCapacity = (payload: CapacityPlanningRequest) => {
    capacity.mutate(payload, {
      onSuccess: (response) => {
        setResult(response)
        toast.success(response.feasible ? 'Encontramos una configuración' : 'Sin solución')
      },
      onError,
    })
  }

  const handleHealth = (data: NetworkHealthFormValues) => {
    health.mutate(
      { lambda: data.lambda, mu: data.mu, s: data.s, k: data.k },
      {
        onSuccess: (response) => {
          setResult(response)
          toast.success(`Estado: ${response.status}`)
        },
        onError,
      },
    )
  }

  const handleCompare = (data: CompareScenariosFormValues) => {
    compare.mutate(
      {
        rank_by: data.rank_by,
        scenarios: data.scenarios.map((scenario) => ({
          name: scenario.name,
          model: scenario.model,
          lambda: scenario.lambda,
          mu: scenario.mu,
          s: scenario.s,
          k: scenario.k,
          cs: scenario.cs,
          cw: scenario.cw,
          cb: scenario.cb,
        })),
      },
      {
        onSuccess: (response) => {
          setResult(response)
          toast.success(response.winner ? `Gana: ${response.winner}` : 'Comparación lista')
        },
        onError,
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Elige tu pregunta</CardTitle>
          <CardDescription>
            Responde solo lo necesario. Usamos ejemplos reales para que veas el resultado al
            instante.
          </CardDescription>
          <div className="grid gap-2 pt-2 sm:grid-cols-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id)
                  setResult(null)
                }}
                className={cn(
                  'rounded-2xl border px-3 py-3 text-left transition-colors',
                  tab === item.id
                    ? 'border-secondary bg-secondary/30 shadow-sm'
                    : 'border-border hover:bg-muted/70',
                )}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-muted-foreground text-xs">{item.help}</p>
              </button>
            ))}
          </div>
        </CardHeader>

        {tab === 'recommend' ? (
          <RecommendForm isPending={isPending} onRecommend={handleRecommend} />
        ) : null}
        {tab === 'capacity' ? (
          <CapacityForm isPending={isPending} onCapacity={handleCapacity} />
        ) : null}
        {tab === 'health' ? <HealthForm isPending={isPending} onHealth={handleHealth} /> : null}
        {tab === 'compare' ? <CompareForm isPending={isPending} onCompare={handleCompare} /> : null}
      </Card>

      <DecisionResultView kind={tab} result={result} />
    </div>
  )
}

export default DecisionPanel
