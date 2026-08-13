import { useMemo } from 'react'

import EChart from '@/components/charts/echart'
import { MetricGrid } from '@/components/queue/metric-grid'
import { EmptyState, ResultShell } from '@/components/queue/result-shell'
import { StatusBadge } from '@/components/queue/status-badge'
import {
  pnDistributionOption,
  utilizationGaugeOption,
  waitMetricsOption,
} from '@/lib/model-chart-options'
import type { ModelResponse } from '@/types/queue.type'
import { formatNumber, formatPercent, modelLabel } from '@/utils/queue-format'
import { buildMetricItems } from '@/utils/queue-metrics'

type ModelResultViewProps = {
  result: ModelResponse | null
  /** Sin marco de tarjeta (ideal dentro de un modal) */
  embedded?: boolean
}

const ModelResultView = ({ result, embedded = false }: ModelResultViewProps) => {
  const gaugeOption = useMemo(
    () => (result ? utilizationGaugeOption(result.metrics.rho) : null),
    [result],
  )
  const waitOption = useMemo(() => (result ? waitMetricsOption(result.metrics) : null), [result])
  const pnOption = useMemo(
    () => (result && result.metrics.Pn.length > 0 ? pnDistributionOption(result.metrics.Pn) : null),
    [result],
  )

  if (!result || !gaugeOption || !waitOption) {
    return (
      <EmptyState
        title="Aún no hay un cálculo para mostrar"
        description="Cierra este panel, completa los números de tu negocio y pulsa el botón. Aquí verás ocupación, esperas y clientes que se quedan fuera."
      />
    )
  }

  const { metrics, stability } = result
  const tone = stability.is_stable
    ? metrics.rho >= 0.9
      ? 'critical'
      : metrics.rho >= 0.7
        ? 'warn'
        : 'ok'
    : 'unstable'

  return (
    <ResultShell
      title={modelLabel(result.model)}
      badge={stability.is_stable ? 'Sistema estable' : 'Inestable'}
      badgeTone={stability.is_stable ? 'ok' : 'unstable'}
      className={embedded ? 'border-0 bg-transparent p-0 shadow-none' : undefined}
    >
      <p className="text-muted-foreground text-sm">{stability.note}</p>

      <div className="flex flex-wrap gap-2">
        <StatusBadge label={`Ocupación ${formatPercent(metrics.rho)}`} tone={tone} />
        {metrics.PK != null ? (
          <StatusBadge
            label={`Se quedan fuera ${formatPercent(metrics.PK)}`}
            tone={metrics.PK > 0.05 ? 'critical' : 'ok'}
          />
        ) : null}
        {result.inputs.s != null ? (
          <StatusBadge label={`${formatNumber(result.inputs.s, 0)} persona(s)`} tone="neutral" />
        ) : null}
        {result.inputs.k != null ? (
          <StatusBadge label={`Cupo ${formatNumber(result.inputs.k, 0)}`} tone="neutral" />
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={gaugeOption} height={260} />
        </div>
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={waitOption} height={260} />
        </div>
      </div>

      {pnOption ? (
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={pnOption} height={280} />
          <p className="text-muted-foreground px-3 pb-2 text-xs">
            Barras más altas = ese número de clientes es más frecuente.
          </p>
        </div>
      ) : null}

      <MetricGrid items={buildMetricItems(metrics)} />
    </ResultShell>
  )
}

export type { ModelResultViewProps }

export default ModelResultView
