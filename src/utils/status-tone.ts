type StatusTone = 'ok' | 'warn' | 'critical' | 'unstable' | 'neutral' | 'info'

const statusToTone = (status: string): StatusTone => {
  const normalized = status.toUpperCase()
  if (normalized === 'OK') return 'ok'
  if (normalized === 'ALERTA') return 'warn'
  if (normalized === 'CRITICO' || normalized === 'CRÍTICO') return 'critical'
  if (normalized === 'INESTABLE' || normalized === 'INVALIDO') return 'unstable'
  return 'info'
}

export type { StatusTone }

export { statusToTone }
