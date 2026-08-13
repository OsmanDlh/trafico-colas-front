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
      label: 'Qué tan ocupado está el personal',
      hint: 'Cerca de 100% = casi no dan abasto. Ideal suele estar por debajo de ~70–80%.',
      value: formatPercent(metrics.rho),
    },
    {
      key: 'L',
      label: 'Personas en el local (promedio)',
      hint: 'Incluye quienes esperan y quienes ya están siendo atendidos.',
      value: formatNumber(metrics.L, 3),
    },
    {
      key: 'Lq',
      label: 'Personas solo esperando (promedio)',
      hint: 'La fila antes de ser atendidos.',
      value: formatNumber(metrics.Lq, 3),
    },
    {
      key: 'W',
      label: 'Tiempo total del cliente',
      hint: 'Desde que llega hasta que se va (espera + atención), en horas.',
      value: formatNumber(metrics.W, 4),
    },
    {
      key: 'Wq',
      label: 'Tiempo solo en la fila',
      hint: 'Cuánto espera antes de que lo atiendan, en horas.',
      value: formatNumber(metrics.Wq, 4),
    },
    {
      key: 'P0',
      label: 'Probabilidad de no tener clientes',
      hint: 'Qué tan seguido el negocio está “vacío” / sin nadie dentro.',
      value: formatPercent(metrics.P0),
    },
  ]

  if (metrics.PK != null) {
    items.push({
      key: 'PK',
      label: 'Clientes que se quedan fuera',
      hint: 'Porcentaje que no entra porque el cupo está lleno.',
      value: formatPercent(metrics.PK),
    })
  }

  if (metrics.lambda_effective != null) {
    items.push({
      key: 'lambda_e',
      label: 'Clientes que sí entran por hora',
      hint: 'Llegadas reales después de descontar a quienes no caben.',
      value: formatNumber(metrics.lambda_effective, 3),
    })
  }

  return items
}

export type { MetricItem, MetricsLike }

export { buildMetricItems }
