import { describe, expect, it } from 'vitest'

import { MODEL_GUIDES, WORDS_GLOSSARY } from '@/lib/model-guides'
import { checkModelStability } from '@/lib/model-stability'
import { mm1kSchema, mm1Schema, mmskSchema, mmsSchema } from '@/lib/queue-schemas'

/**
 * Estas pruebas son la “explicación viva” de los modelos.
 * Cada nombre describe un caso real: qué pasa y por qué falla o funciona.
 */

describe('Cómo entender los 4 modelos (guía para todos)', () => {
  it('existen exactamente MM1, MM1K, MMS y MMSK con explicación cotidiana', () => {
    expect(Object.keys(MODEL_GUIDES).sort()).toEqual(['MM1', 'MM1K', 'MMS', 'MMSK'])
    for (const guide of Object.values(MODEL_GUIDES)) {
      expect(guide.analogy.length).toBeGreaterThan(40)
      expect(guide.whyItCanFail.length).toBeGreaterThan(0)
      expect(guide.example.story.length).toBeGreaterThan(10)
    }
  })

  it('el diccionario traduce λ, μ, s y K a palabras de negocio', () => {
    const words = WORDS_GLOSSARY.map((entry) => entry.word)
    expect(words.some((w) => w.includes('lambda'))).toBe(true)
    expect(words.some((w) => w.includes('mu'))).toBe(true)
    expect(words).toContain('s')
    expect(words).toContain('K')
  })
})

describe('MM1 — una persona, sin cupo (como un solo cajero)', () => {
  it('acepta un caso sano: llegan menos de lo que atiende', () => {
    // Historia: llegan 8/h, el cajero atiende 10/h → la fila no se desborda
    const parsed = mm1Schema.safeParse({ lambda: 8, mu: 10, n_max: 10 })
    expect(parsed.success).toBe(true)

    const stability = checkModelStability({ model: 'MM1', lambda: 8, mu: 10 })
    expect(stability.ok).toBe(true)
  })

  it('falla si ponen 0 llegadas: no hay operación que medir', () => {
    const parsed = mm1Schema.safeParse({ lambda: 0, mu: 10, n_max: 10 })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.lambda?.[0]).toMatch(/mayor que 0/i)
    }
  })

  it('falla si la atención es negativa: un ritmo imposible', () => {
    const parsed = mm1Schema.safeParse({ lambda: 5, mu: -1, n_max: 10 })
    expect(parsed.success).toBe(false)
  })

  it('rechaza la consulta cuando llegan más de lo que una persona puede atender', () => {
    // Historia: llegan 12/h y solo atienden 10/h → la fila crece para siempre
    // (como un grifo que llena más rápido de lo que vacía el desagüe)
    const formOk = mm1Schema.safeParse({ lambda: 12, mu: 10, n_max: 10 })
    expect(formOk.success).toBe(true) // el formulario deja pasar números válidos…

    const stability = checkModelStability({ model: 'MM1', lambda: 12, mu: 10 })
    expect(stability.ok).toBe(false) // …pero el negocio no es estable
    expect(stability.plainReason).toMatch(/fila crece/i)
    expect(stability.howToFix.length).toBeGreaterThan(10)
  })

  it('también falla si llegan exactamente igual a lo que atienden (λ = μ)', () => {
    // En el límite, no hay “colchón”: cualquier variación hace crecer la fila
    const stability = checkModelStability({ model: 'MM1', lambda: 10, mu: 10 })
    expect(stability.ok).toBe(false)
    expect(stability.message).toMatch(/más clientes|atiender/i)
  })
})

describe('MM1K — una persona, con cupo máximo (consultorio con sala pequeña)', () => {
  it('acepta un caso sano con cupo', () => {
    const parsed = mm1kSchema.safeParse({ lambda: 8, mu: 10, k: 5 })
    expect(parsed.success).toBe(true)
  })

  it('falla si el cupo es 0: no cabe nadie en el local', () => {
    const parsed = mm1kSchema.safeParse({ lambda: 8, mu: 10, k: 0 })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.k?.[0]).toMatch(/al menos 1/i)
    }
  })

  it('SÍ permite que lleguen más de lo que atienden: el cupo frena y rechaza clientes', () => {
    // Historia: llegan 20/h, atienden 5/h, caben 4 personas.
    // El local se llena; el resto se queda fuera. El cálculo sigue siendo válido.
    const parsed = mm1kSchema.safeParse({ lambda: 20, mu: 5, k: 4 })
    expect(parsed.success).toBe(true)

    const stability = checkModelStability({ model: 'MM1K', lambda: 20, mu: 5, k: 4 })
    expect(stability.ok).toBe(true)
    expect(stability.plainReason).toMatch(/cupo|rechaz/i)
  })
})

describe('MMS — varias personas, sin cupo (banco con varios cajeros)', () => {
  it('acepta un equipo que da abasto: capacidad total > llegadas', () => {
    // 3 personas × 3 atenciones/h = 9 de capacidad; llegan 8 → OK
    const parsed = mmsSchema.safeParse({ lambda: 8, mu: 3, s: 3, n_max: 10 })
    expect(parsed.success).toBe(true)

    const stability = checkModelStability({ model: 'MMS', lambda: 8, mu: 3, s: 3 })
    expect(stability.ok).toBe(true)
  })

  it('falla si el equipo tiene 0 personas: nadie atiende', () => {
    const parsed = mmsSchema.safeParse({ lambda: 8, mu: 3, s: 0, n_max: 10 })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.s?.[0]).toMatch(/al menos 1/i)
    }
  })

  it('rechaza la consulta si el equipo no cubre las llegadas (λ ≥ s·μ)', () => {
    // Historia: llegan 10/h; 2 personas × 4/h = 8 de capacidad → la fila crece sin límite
    const formOk = mmsSchema.safeParse({ lambda: 10, mu: 4, s: 2, n_max: 10 })
    expect(formOk.success).toBe(true)

    const stability = checkModelStability({ model: 'MMS', lambda: 10, mu: 4, s: 2 })
    expect(stability.ok).toBe(false)
    expect(stability.plainReason).toMatch(/8\/h|no da abasto|crecer/i)
    expect(stability.howToFix).toMatch(/equipo|MMSK|μ|λ/i)
  })
})

describe('MMSK — varias personas, con cupo (restaurante con aforo)', () => {
  it('acepta el caso típico: equipo 3 y cupo 6', () => {
    const parsed = mmskSchema.safeParse({ lambda: 8, mu: 3, s: 3, k: 6 })
    expect(parsed.success).toBe(true)

    const stability = checkModelStability({ model: 'MMSK', lambda: 8, mu: 3, s: 3, k: 6 })
    expect(stability.ok).toBe(true)
  })

  it('falla si el cupo es menor que el equipo (imposible físicamente)', () => {
    // Historia: 4 meseros pero solo caben 2 personas en el local → no tiene sentido
    const parsed = mmskSchema.safeParse({ lambda: 8, mu: 3, s: 4, k: 2 })
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      const message =
        parsed.error.flatten().fieldErrors.k?.[0] ?? parsed.error.errors.map((e) => e.message).join(' ')
      expect(message).toMatch(/cupo|equipo|plazas/i)
    }

    const stability = checkModelStability({ model: 'MMSK', lambda: 8, mu: 3, s: 4, k: 2 })
    expect(stability.ok).toBe(false)
    expect(stability.howToFix).toMatch(/cupo|equipo/i)
  })

  it('permite demanda alta: el aforo rechaza clientes en vez de dejar crecer la fila sin fin', () => {
    const stability = checkModelStability({ model: 'MMSK', lambda: 50, mu: 3, s: 3, k: 6 })
    expect(stability.ok).toBe(true)
  })
})

describe('Resumen: cuándo falla cada consulta (mapa mental)', () => {
  it('sin cupo (MM1/MMS): falla si la demanda supera la capacidad', () => {
    expect(checkModelStability({ model: 'MM1', lambda: 11, mu: 10 }).ok).toBe(false)
    expect(checkModelStability({ model: 'MMS', lambda: 11, mu: 5, s: 2 }).ok).toBe(false)
  })

  it('con cupo (MM1K/MMSK): no falla por demanda alta; falla por cupo inválido', () => {
    expect(checkModelStability({ model: 'MM1K', lambda: 100, mu: 1, k: 3 }).ok).toBe(true)
    expect(checkModelStability({ model: 'MMSK', lambda: 100, mu: 1, s: 2, k: 5 }).ok).toBe(true)
    expect(checkModelStability({ model: 'MMSK', lambda: 5, mu: 2, s: 3, k: 1 }).ok).toBe(false)
  })
})
