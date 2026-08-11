import { formatNumber, formatPercent } from '@/utils/queue-format'

type MetricItem = {
  key: string
  label: string
  hint: string
  value: string
}

type MetricsLike = {
  rho: number
  r?: number | null
  P0: number
  PK?: number | null
  lambda_effective?: number | null
  L: number
  Lq: number
  W: number
  Wq: number
}

const buildMetricItems = (metrics: MetricsLike): MetricItem[] => {
  const items: MetricItem[] = [
    {
      key: 'rho',
      label: 'Utilización (ρ)',
      hint: 'Qué tan ocupado está cada servidor',
      value: formatPercent(metrics.rho),
    },
    {
      key: 'L',
      label: 'En el sistema (L)',
      hint: 'Clientes esperados (en cola + siendo atendidos)',
      value: formatNumber(metrics.L, 3),
    },
    {
      key: 'Lq',
      label: 'En cola (Lq)',
      hint: 'Clientes esperando a ser atendidos',
      value: formatNumber(metrics.Lq, 3),
    },
    {
      key: 'W',
      label: 'Tiempo total (W)',
      hint: 'Tiempo medio desde llegada hasta salida',
      value: formatNumber(metrics.W, 4),
    },
    {
      key: 'Wq',
      label: 'Tiempo en cola (Wq)',
      hint: 'Tiempo medio solo esperando',
      value: formatNumber(metrics.Wq, 4),
    },
    {
      key: 'P0',
      label: 'Sistema vacío (P0)',
      hint: 'Probabilidad de no tener clientes',
      value: formatPercent(metrics.P0),
    },
  ]

  if (metrics.PK != null) {
    items.push({
      key: 'PK',
      label: 'Bloqueo (PK)',
      hint: 'Probabilidad de que un cliente no entre',
      value: formatPercent(metrics.PK),
    })
  }

  if (metrics.lambda_effective != null) {
    items.push({
      key: 'lambda_e',
      label: 'Llegadas efectivas (λe)',
      hint: 'Tasa real de clientes que sí entran',
      value: formatNumber(metrics.lambda_effective, 3),
    })
  }

  return items
}

export type { MetricItem, MetricsLike }

export { buildMetricItems }
