import type { ModelName } from '@/types/queue.type'

/**
 * Reglas de “¿esta consulta tiene sentido?” en palabras de negocio.
 * El front valida el formulario; la API además exige estabilidad en modelos sin cupo.
 */
type StabilityCheckInput = {
  model: ModelName
  lambda: number
  mu: number
  s?: number
  k?: number
}

type StabilityCheckResult = {
  ok: boolean
  /** Mensaje corto para toasts / formularios */
  message: string
  /** Explicación para personas no técnicas */
  plainReason: string
  /** Qué hacer para arreglarlo */
  howToFix: string
}

const checkModelStability = (input: StabilityCheckInput): StabilityCheckResult => {
  const { model, lambda, mu, s = 1, k } = input

  if (!(lambda > 0) || !(mu > 0)) {
    return {
      ok: false,
      message: 'Llegadas y atención deben ser mayores que 0',
      plainReason:
        'Sin un ritmo real de llegada o de atención no se puede estimar la fila. Cero o negativo no describe un negocio.',
      howToFix: 'Pon números mayores que 0. Ejemplo: llegan 8 por hora y atienden 10 por hora.',
    }
  }

  if (model === 'MMS' || model === 'MMSK') {
    if (!Number.isInteger(s) || s < 1) {
      return {
        ok: false,
        message: 'El equipo debe tener al menos 1 persona',
        plainReason: 'Si nadie atiende, no hay cola que calcular: no hay servicio.',
        howToFix: 'Indica cuántas personas atienden a la vez (1, 2, 3…).',
      }
    }
  }

  if (model === 'MM1K' || model === 'MMSK') {
    if (k == null || !Number.isInteger(k) || k < 1) {
      return {
        ok: false,
        message: 'El cupo máximo debe ser al menos 1',
        plainReason: 'Un cupo de 0 significa que no cabe nadie en el local.',
        howToFix: 'Pon el máximo de clientes que caben (esperando + siendo atendidos).',
      }
    }
  }

  if (model === 'MMSK' && k != null && k < s) {
    return {
      ok: false,
      message: 'El cupo no puede ser menor que el tamaño del equipo',
      plainReason: `Tienes ${s} persona(s) atendiendo, pero solo caben ${k} en total. No puede haber más puestos de atención que plazas en el local.`,
      howToFix: `Sube el cupo a ${s} o más, o baja el número de personas del equipo.`,
    }
  }

  // Modelos SIN cupo: la fila no puede crecer para siempre
  if (model === 'MM1' && lambda >= mu) {
    return {
      ok: false,
      message: 'Llegan más clientes de los que una persona puede atender',
      plainReason: `Llegan ${lambda}/h y solo se atienden ${mu}/h. La fila crece sin parar (como un grifo que llena más rápido de lo que vacía el desagüe). En este modelo no hay cupo que frene la llegada.`,
      howToFix:
        'Sube la velocidad de atención (μ), baja las llegadas (λ), o usa un modelo con cupo (MM1K) / más personal (MMS).',
    }
  }

  if (model === 'MMS') {
    const capacity = s * mu
    if (lambda >= capacity) {
      return {
        ok: false,
        message: 'El equipo no da abasto: la fila crecería sin límite',
        plainReason: `Llegan ${lambda}/h y el equipo solo puede atender ${capacity}/h (${s} × ${mu}). Sin cupo máximo, la cola nunca se estabiliza.`,
        howToFix:
          'Añade personas al equipo, sube μ, baja λ, o usa MMSK si el local tiene aforo y rechaza clientes al llenarse.',
      }
    }
  }

  // Con cupo (MM1K / MMSK) el sistema SÍ puede calcular aunque λ sea alta:
  // el “exceso” se traduce en clientes que no entran.
  return {
    ok: true,
    message: 'La consulta es válida',
    plainReason:
      model === 'MM1K' || model === 'MMSK'
        ? 'Con cupo máximo el local puede llenarse y rechazar clientes; el cálculo sigue siendo válido.'
        : 'El personal atiende al menos tan rápido como llegan los clientes, así que la fila no se desborda.',
    howToFix: '',
  }
}

export type { StabilityCheckInput, StabilityCheckResult }

export { checkModelStability }
