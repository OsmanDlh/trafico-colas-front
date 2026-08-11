import { useMemo } from 'react'

import EChart from '@/components/charts/echart'
import { EmptyState, ResultShell } from '@/components/queue/result-shell'
import { costBreakdownOption, costSweepOption } from '@/lib/decision-chart-options'
import type { CostOptimizeResponse } from '@/types/queue.type'
import { formatMoney, modelLabel } from '@/utils/queue-format'

type CostResultViewProps = {
  result: CostOptimizeResponse | null
}

const CostResultView = ({ result }: CostResultViewProps) => {
  const sweepOption = useMemo(
    () => (result ? costSweepOption(result.table, result.best) : null),
    [result],
  )
  const breakdownOption = useMemo(
    () => (result ? costBreakdownOption(result.best) : null),
    [result],
  )

  if (!result || !sweepOption || !breakdownOption) {
    return (
      <EmptyState
        title="Encuentra el tamaño ideal de tu equipo"
        description="Indica demanda, productividad y costos. Te diremos cuántas personas contratar para gastar menos."
      />
    )
  }

  const { best, note, savings_vs_worst: savings } = result

  return (
    <ResultShell title="Mejor configuración" badge={modelLabel(result.model)} badgeTone="info">
      <div className="from-secondary/40 via-secondary/10 to-muted grid gap-4 rounded-2xl bg-gradient-to-br p-5 sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase">Personas recomendadas</p>
          <p className="text-foreground text-3xl font-bold tabular-nums">{best.s}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase">Costo total estimado</p>
          <p className="text-foreground text-3xl font-bold tabular-nums">
            {formatMoney(best.total_cost)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase">Ahorro vs peor opción</p>
          <p className="text-foreground text-3xl font-bold tabular-nums">{formatMoney(savings)}</p>
        </div>
      </div>

      <p className="text-muted-foreground text-sm">{note}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={sweepOption} height={300} />
          <p className="text-muted-foreground px-3 pb-2 text-xs">
            El punto amarillo marca el equipo con menor costo.
          </p>
        </div>
        <div className="border-border bg-muted/20 rounded-2xl border p-2">
          <EChart option={breakdownOption} height={300} />
          <p className="text-muted-foreground px-3 pb-2 text-xs">
            Así se reparte el costo de la mejor opción.
          </p>
        </div>
      </div>
    </ResultShell>
  )
}

export type { CostResultViewProps }

export default CostResultView
