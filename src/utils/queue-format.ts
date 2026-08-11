const formatNumber = (value: number | null | undefined, digits = 4): string => {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toLocaleString('es-ES', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })
}

const formatPercent = (value: number | null | undefined, digits = 2): string => {
  if (value == null || Number.isNaN(value)) return '—'
  return `${(value * 100).toLocaleString('es-ES', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })}%`
}

const formatMoney = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toLocaleString('es-ES', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
}

const modelLabel = (model: string): string => {
  const labels: Record<string, string> = {
    MM1: 'Una persona · sin cupo',
    MM1K: 'Una persona · con cupo máximo',
    MMS: 'Varias personas · sin cupo',
    MMSK: 'Varias personas · con cupo máximo',
  }
  return labels[model] ?? model
}

const modelShortLabel = (model: string): string => {
  const labels: Record<string, string> = {
    MM1: '1 persona · ilimitado',
    MM1K: '1 persona · cupo',
    MMS: 'Equipo · ilimitado',
    MMSK: 'Equipo · cupo',
  }
  return labels[model] ?? model
}

export { formatMoney, formatNumber, formatPercent, modelLabel, modelShortLabel }
