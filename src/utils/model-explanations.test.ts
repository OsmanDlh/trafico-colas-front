import axios from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { getApiErrorMessage } from '@/utils/api-error'
import { buildMetricItems } from '@/utils/queue-metrics'

describe('Cómo se explican los errores de la API a personas no técnicas', () => {
  it('muestra el detalle y la pista cuando la API rechaza el cálculo', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed',
      response: {
        data: {
          detail: 'El sistema no es estable: λ debe ser menor que μ.',
          hint: 'Sube la velocidad de atención o baja las llegadas.',
        },
      },
    }

    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const message = getApiErrorMessage(error)
    expect(message).toContain('no es estable')
    expect(message).toContain('Sube la velocidad')
  })

  it('une varios mensajes de validación del servidor', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const message = getApiErrorMessage({
      isAxiosError: true,
      message: '422',
      response: {
        data: {
          detail: [
            { loc: ['body', 'lambda'], msg: 'lambda debe ser > 0', type: 'value_error' },
            { loc: ['body', 'k'], msg: 'k debe ser ≥ s', type: 'value_error' },
          ],
        },
      },
    })

    expect(message).toContain('lambda debe ser > 0')
    expect(message).toContain('k debe ser ≥ s')
  })

  it('si no hay respuesta del servidor, avisa del problema de conexión', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

    const message = getApiErrorMessage({
      isAxiosError: true,
      message: 'Network Error',
      response: undefined,
    })

    expect(message).toMatch(/Network Error|conectar/i)
  })
})

describe('Las métricas se leen en lenguaje de negocio', () => {
  it('usa etiquetas entendibles en lugar de solo símbolos L, Wq, ρ', () => {
    const items = buildMetricItems({
      rho: 0.8,
      P0: 0.2,
      L: 4,
      Lq: 3.2,
      W: 0.5,
      Wq: 0.4,
      PK: 0.1,
      lambda_effective: 7.2,
    })

    const labels = items.map((item) => item.label)
    expect(labels.some((label) => /ocupado|personal/i.test(label))).toBe(true)
    expect(labels.some((label) => /esperando/i.test(label))).toBe(true)
    expect(labels.some((label) => /quedan fuera/i.test(label))).toBe(true)
    expect(labels.some((label) => /sí entran/i.test(label))).toBe(true)
  })
})
