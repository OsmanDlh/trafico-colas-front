import { useMemo } from 'react'

import EChart from '@/components/charts/echart'
import { MetricGrid } from '@/components/queue/metric-grid'
import { EmptyState, ResultShell } from '@/components/queue/result-shell'
import { StatusBadge } from '@/components/queue/status-badge'
import { capacityAlternativesOption, compareScenariosOption } from '@/lib/decision-chart-options'
import {
  pnDistributionOption,
  utilizationGaugeOption,
  waitMetricsOption,
} from '@/lib/model-chart-options'
import type {
  CapacityPlanningResponse,
  CompareScenariosResponse,
  NetworkHealthResponse,
  RecommendModelResponse,
} from '@/types/queue.type'
import { formatPercent, modelLabel } from '@/utils/queue-format'
import { buildMetricItems, type MetricsLike } from '@/utils/queue-metrics'
import { statusToTone } from '@/utils/status-tone'

type DecisionResultViewProps = {
  kind: 'recommend' | 'capacity' | 'health' | 'compare'
  result:
    | RecommendModelResponse
    | CapacityPlanningResponse
    | NetworkHealthResponse
    | CompareScenariosResponse
    | null
}

const DecisionResultView = ({ kind, result }: DecisionResultViewProps) => {
  if (!result) {
    const copy: Record<DecisionResultViewProps['kind'], { title: string; description: string }> = {
      recommend: {
        title: 'Te orientamos sin tecnicismos',
        description:
          'Cuéntanos si tienes cupo limitado y cuántas personas tienes. Te diremos cómo modelar tu operación.',
      },
      capacity: {
        title: 'Calculamos el equipo mínimo',
        description:
          'Define metas (por ejemplo, que se queden fuera menos del 1%). Buscamos la opción más chica que las cumple.',
      },
      health: {
        title: 'Diagnóstico de tu negocio',
        description:
          'Ingresa tu demanda actual. Te diremos si vas bien, si hay alerta o si necesitas actuar ya.',
      },
      compare: {
        title: 'Compara dos caminos',
        description:
          'Ejemplo: 3 vs 4 personas en el equipo. Te mostramos cuál conviene según lo que más te importe.',
      },
    }
    return <EmptyState {...copy[kind]} />
  }

  if (kind === 'recommend' && 'recommended_model' in result) {
    return (
      <ResultShell title="Modelo recomendado" badge={result.recommended_model} badgeTone="ok">
        <p className="text-foreground text-base font-medium">
          {modelLabel(result.recommended_model)}
        </p>
        <p className="text-muted-foreground text-sm">{result.reason}</p>
        <div>
          <p className="mb-2 text-sm font-medium">Datos que vas a necesitar</p>
          <div className="flex flex-wrap gap-2">
            {result.required_parameters.map((param) => (
              <StatusBadge key={param} label={param} tone="neutral" />
            ))}
          </div>
        </div>
        {result.warnings.length > 0 ? (
          <ul className="text-sm text-amber-900">
            {result.warnings.map((warning) => (
              <li key={warning}>• {warning}</li>
            ))}
          </ul>
        ) : null}
        {result.alternatives.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Alternativas</p>
            {result.alternatives.map((alt) => (
              <div key={`${alt.model}-${alt.when}`} className="border-border rounded-lg border p-3">
                <p className="font-medium">{modelLabel(alt.model)}</p>
                <p className="text-muted-foreground text-sm">{alt.when}</p>
              </div>
            ))}
          </div>
        ) : null}
      </ResultShell>
    )
  }

  if (kind === 'capacity' && 'feasible' in result) {
    return <CapacityResult result={result} />
  }

  if (kind === 'health' && 'status' in result && 'explanation' in result) {
    return <HealthResult result={result} />
  }

  if (kind === 'compare' && 'results' in result) {
    return <CompareResult result={result} />
  }

  return <EmptyState title="Sin resultado" description="No se pudo interpretar la respuesta." />
}

const CapacityResult = ({ result }: { result: CapacityPlanningResponse }) => {
  const recommended = result.recommended as {
    s?: number
    k?: number | null
    metrics?: MetricsLike
  } | null

  const chartOption = useMemo(() => {
    const alternatives = result.alternatives.map((alt) => {
      const row = alt as { s: number; k: number | null; Wq: number; rho: number }
      return row
    })
    return alternatives.length > 0 ? capacityAlternativesOption(alternatives) : null
  }, [result.alternatives])

  const metricsOption = useMemo(() => {
    if (!recommended?.metrics) return null
    return waitMetricsOption(recommended.metrics)
  }, [recommended])

  return (
    <ResultShell
      title="Plan de capacidad"
      badge={result.feasible ? 'Factible' : 'Sin solución'}
      badgeTone={result.feasible ? 'ok' : 'critical'}
    >
      <p className="text-muted-foreground text-sm">{result.note}</p>
      {recommended ? (
        <div className="from-secondary/30 to-muted grid gap-4 rounded-2xl bg-gradient-to-br p-5 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs uppercase">Personas necesarias</p>
            <p className="text-3xl font-bold tabular-nums">{recommended.s ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase">Cupo recomendado</p>
            <p className="text-3xl font-bold tabular-nums">{recommended.k ?? '—'}</p>
          </div>
        </div>
      ) : null}

      {chartOption ? (
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={chartOption} height={280} />
        </div>
      ) : null}

      {metricsOption ? (
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={metricsOption} height={260} />
        </div>
      ) : null}

      {recommended?.metrics ? <MetricGrid items={buildMetricItems(recommended.metrics)} /> : null}
    </ResultShell>
  )
}

const HealthResult = ({ result }: { result: NetworkHealthResponse }) => {
  const gaugeOption = useMemo(
    () => utilizationGaugeOption(result.rho, '¿Qué tan saturado estás?'),
    [result.rho],
  )
  const waitOption = useMemo(
    () => (result.metrics ? waitMetricsOption(result.metrics) : null),
    [result.metrics],
  )
  const pnOption = useMemo(
    () =>
      result.metrics && result.metrics.Pn.length > 0
        ? pnDistributionOption(result.metrics.Pn)
        : null,
    [result.metrics],
  )

  return (
    <ResultShell
      title="Salud de tu operación"
      badge={result.status}
      badgeTone={statusToTone(result.status)}
    >
      <p className="text-foreground text-base">{result.explanation}</p>
      <p className="text-muted-foreground text-sm">
        {modelLabel(result.model)} · Ocupación {formatPercent(result.rho)}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={gaugeOption} height={260} />
          <p className="text-muted-foreground px-3 pb-2 text-xs">
            Verde &lt; 70% · Amarillo 70–90% · Rojo &gt; 90%
          </p>
        </div>
        {waitOption ? (
          <div className="border-border bg-muted/20 rounded-2xl border p-2">
            <EChart option={waitOption} height={260} />
          </div>
        ) : null}
      </div>

      {pnOption ? (
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={pnOption} height={260} />
        </div>
      ) : null}

      {result.recommendations.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium">Qué puedes hacer</p>
          <ul className="space-y-2">
            {result.recommendations.map((item) => (
              <li
                key={item}
                className="border-border bg-muted/40 rounded-lg border px-3 py-2 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.metrics ? <MetricGrid items={buildMetricItems(result.metrics)} /> : null}
    </ResultShell>
  )
}

const CompareResult = ({ result }: { result: CompareScenariosResponse }) => {
  const chartOption = useMemo(
    () => compareScenariosOption(result.results.filter((item) => item.metrics)),
    [result.results],
  )

  return (
    <ResultShell
      title="Comparación de escenarios"
      badge={result.winner ? `Gana: ${result.winner}` : 'Sin ganador'}
      badgeTone={result.winner ? 'ok' : 'neutral'}
    >
      <p className="text-muted-foreground text-sm">{result.note}</p>
      <p className="text-sm">
        Ordenado por <strong>{result.rank_by}</strong> (menor es mejor)
      </p>

      <div className="border-border bg-muted/20 rounded-2xl border p-2">
        <EChart option={chartOption} height={300} />
        <p className="text-muted-foreground px-3 pb-2 text-xs">
          Barras más bajas suelen ser mejores para espera y gente en el sistema.
        </p>
      </div>

      <div className="space-y-3">
        {result.results.map((scenario, index) => (
          <div
            key={`${scenario.name}-${index}`}
            className={`rounded-xl border p-4 ${
              scenario.name === result.winner ? 'border-secondary bg-secondary/20' : 'border-border'
            }`}
          >
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                #{index + 1} · {scenario.name}
              </p>
              <StatusBadge label={scenario.status} tone={statusToTone(scenario.status)} />
            </div>
            <p className="text-muted-foreground text-sm">{modelLabel(scenario.model)}</p>
            {scenario.error ? <p className="text-destructive text-sm">{scenario.error}</p> : null}
          </div>
        ))}
      </div>
    </ResultShell>
  )
}

export type { DecisionResultViewProps }

export default DecisionResultView
