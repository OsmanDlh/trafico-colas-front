import type { ModelName } from '@/types/queue.type'

/**
 * Guías en lenguaje cotidiano.
 * Objetivo: que cualquier persona entienda qué modelo usar, sin jerga de colas.
 */
type ModelGuide = {
  id: ModelName
  /** Nombre técnico (para quien ya lo conoce) */
  technicalName: string
  /** Título amigable en la app */
  title: string
  /** Analogía de un negocio real */
  analogy: string
  /** Qué pregunta responde este modelo */
  answers: string
  /** Piezas que debes indicar */
  youNeed: string[]
  /** Cuándo usarlo */
  whenToUse: string
  /** Cuándo NO usarlo */
  whenNotToUse: string
  /** Por qué la API puede rechazar la consulta */
  whyItCanFail: string[]
  /** Ejemplo numérico fácil */
  example: {
    story: string
    numbers: string
  }
}

const MODEL_GUIDES: Record<ModelName, ModelGuide> = {
  MM1: {
    id: 'MM1',
    technicalName: 'M/M/1',
    title: 'Una persona atendiendo · la fila puede crecer sin límite',
    analogy:
      'Imagina un solo cajero en un kiosco. Los clientes llegan, hacen fila y nadie se va porque no hay espacio: la fila puede alargarse todo lo que haga falta.',
    answers:
      '¿Cuánto esperará cada cliente? ¿Qué tan ocupado está el cajero? ¿Cuánta gente habrá en promedio?',
    youNeed: [
      'Cuántos clientes llegan por hora (λ)',
      'Cuántos clientes atiende esa persona por hora (μ)',
    ],
    whenToUse:
      'Cuando solo hay un empleado o mostrador y no echas a nadie por falta de espacio (la fila puede crecer).',
    whenNotToUse:
      'Si tienes varios empleados a la vez, o si el local tiene un cupo máximo (por ejemplo, solo caben 10 personas).',
    whyItCanFail: [
      'Si llegan MÁS clientes de los que esa persona puede atender (λ ≥ μ), la fila nunca baja: el sistema “se desborda” y el cálculo no tiene sentido.',
      'Si pones 0 o números negativos, no hay tasa real de llegada o atención.',
    ],
    example: {
      story: 'Llegan 8 clientes por hora y el cajero atiende 10 por hora.',
      numbers: 'λ = 8, μ = 10 → funciona (atiende más rápido de lo que llegan).',
    },
  },
  MM1K: {
    id: 'MM1K',
    technicalName: 'M/M/1/K',
    title: 'Una persona atendiendo · con cupo máximo',
    analogy:
      'Un consultorio con un médico y sala de espera limitada: si ya hay K personas dentro (incluyendo quien está siendo atendido), el siguiente cliente no entra.',
    answers:
      'Además de esperas y ocupación: ¿qué porcentaje de clientes se queda fuera porque el cupo está lleno?',
    youNeed: [
      'Clientes que llegan por hora (λ)',
      'Clientes que atiende la persona por hora (μ)',
      'Cupo máximo del local (K)',
    ],
    whenToUse:
      'Cuando hay un solo servidor y el espacio es limitado (sala de espera pequeña, turnos limitados, aforo).',
    whenNotToUse:
      'Si no hay límite de espacio (usa MM1) o si atienden varias personas a la vez (usa MMS o MMSK).',
    whyItCanFail: [
      'El cupo K debe ser al menos 1 (si K = 0 no cabe nadie).',
      'Números ≤ 0 en llegadas o atención no tienen sentido físico.',
      'Nota: aquí λ puede ser mayor que μ: el local se llena y rechaza clientes; el cálculo sí se puede hacer.',
    ],
    example: {
      story: 'Llegan 12 por hora, el médico atiende 8, y solo caben 5 personas en total.',
      numbers: 'λ = 12, μ = 8, K = 5 → hay bloqueo: parte de la gente no entra.',
    },
  },
  MMS: {
    id: 'MMS',
    technicalName: 'M/M/S',
    title: 'Varias personas atendiendo · la fila puede crecer sin límite',
    analogy:
      'Un banco con varios cajeros. Todos atienden a la vez y la fila compartida puede crecer todo lo que haga falta.',
    answers:
      '¿Cuánta gente espera? ¿Cuánto tarda un cliente? ¿Qué tan ocupado está el equipo completo?',
    youNeed: [
      'Clientes que llegan por hora (λ)',
      'Clientes que atiende CADA persona por hora (μ)',
      'Cuántas personas atienden a la vez (s)',
    ],
    whenToUse:
      'Cuando tu equipo tiene varios empleados trabajando en paralelo y no echas a nadie por aforo.',
    whenNotToUse:
      'Si solo hay una persona (usa MM1) o si el local tiene cupo máximo (usa MMSK).',
    whyItCanFail: [
      'La capacidad total del equipo es s × μ. Si llegan más de lo que el equipo puede atender (λ ≥ s·μ), la fila crece sin parar y el cálculo falla.',
      'Debes tener al menos 1 persona atendiendo (s ≥ 1).',
      'Llegadas o atención ≤ 0 no son válidas.',
    ],
    example: {
      story: 'Llegan 8 por hora; cada empleado atiende 3; hay 3 empleados.',
      numbers: 'λ = 8, μ = 3, s = 3 → capacidad total 9 > 8 → estable.',
    },
  },
  MMSK: {
    id: 'MMSK',
    technicalName: 'M/M/S/K',
    title: 'Varias personas atendiendo · con cupo máximo',
    analogy:
      'Un restaurante con varios meseros y un aforo máximo: si el local está lleno, el cliente no entra aunque haya meseros libres en teoría (porque no hay mesa/espacio).',
    answers:
      'Esperas, ocupación del equipo y porcentaje de clientes que se quedan fuera por aforo lleno.',
    youNeed: [
      'Clientes que llegan por hora (λ)',
      'Atenciones por persona / hora (μ)',
      'Personas en el equipo (s)',
      'Cupo máximo del local (K), que incluye a quien espera y a quien ya está siendo atendido',
    ],
    whenToUse:
      'Negocios con varios empleados y espacio limitado: clínicas, oficinas, locales con aforo.',
    whenNotToUse:
      'Si no hay límite de cupo (usa MMS) o si solo atiende una persona (usa MM1 o MM1K).',
    whyItCanFail: [
      'El cupo K no puede ser menor que el número de personas atendiendo (K ≥ s): no puedes tener 4 cajeros y solo 2 plazas en el local.',
      's y K deben ser enteros ≥ 1.',
      'Llegadas o atención ≤ 0 no son válidas.',
      'Nota: aunque λ sea alta, el cupo limita la fila; el modelo calcula cuántos se quedan fuera.',
    ],
    example: {
      story: 'Llegan 8/h, cada uno atiende 3/h, 3 empleados, caben 6 personas en total.',
      numbers: 'λ = 8, μ = 3, s = 3, K = 6 → válido porque K ≥ s.',
    },
  },
}

const MODEL_CHOOSER_STEPS = [
  {
    question: '¿Cuántas personas te atienden a la vez?',
    options: [
      { label: 'Solo una', leadsTo: 'MM1 o MM1K' },
      { label: 'Varias', leadsTo: 'MMS o MMSK' },
    ],
  },
  {
    question: '¿Hay un cupo máximo de clientes dentro?',
    options: [
      { label: 'No, la fila puede crecer', leadsTo: 'MM1 (una persona) o MMS (varias)' },
      { label: 'Sí, si se llena no entra más gente', leadsTo: 'MM1K (una) o MMSK (varias)' },
    ],
  },
] as const

const WORDS_GLOSSARY = [
  {
    word: 'λ (lambda)',
    meaning: 'Cuántos clientes llegan en promedio por hora.',
  },
  {
    word: 'μ (mu)',
    meaning: 'Cuántos clientes atiende una persona en promedio por hora.',
  },
  {
    word: 's',
    meaning: 'Cuántas personas atienden al mismo tiempo (tamaño del equipo).',
  },
  {
    word: 'K',
    meaning: 'Cupo máximo: cuántos clientes caben en total (esperando + siendo atendidos).',
  },
  {
    word: 'Ocupación',
    meaning: 'Qué tan “lleno de trabajo” está el personal. Cerca de 100% = casi no dan abasto.',
  },
  {
    word: 'Se quedan fuera',
    meaning: 'Porcentaje de clientes que no entran porque el cupo está lleno (solo con cupo K).',
  },
] as const

const getModelGuide = (model: ModelName): ModelGuide => MODEL_GUIDES[model]

export type { ModelGuide }

export { getModelGuide, MODEL_CHOOSER_STEPS, MODEL_GUIDES, WORDS_GLOSSARY }
