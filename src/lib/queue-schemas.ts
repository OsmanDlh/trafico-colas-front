import z from 'zod/v3'

import type { ModelName, RankBy } from '@/types/queue.type'

const toOptionalNumber = (value: unknown): number | undefined => {
  if (value === '' || value === null || value === undefined) return undefined
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const positiveNumber = z.coerce
  .number({ invalid_type_error: 'Escribe un número (por ejemplo 8)' })
  .gt(0, {
    message: 'Debe ser mayor que 0 (cero o negativo no describe tu operación)',
  })

const optionalPositive = z
  .any()
  .transform(toOptionalNumber)
  .refine((value) => value === undefined || value > 0, {
    message: 'Si lo rellenas, debe ser mayor que 0',
  })

const optionalNonNegative = z
  .any()
  .transform(toOptionalNumber)
  .refine((value) => value === undefined || value >= 0, {
    message: 'Si lo rellenas, debe ser 0 o más',
  })

const modelNameSchema = z.enum(['MM1', 'MM1K', 'MMS', 'MMSK'], {
  required_error: 'Selecciona un modelo',
})

const rankBySchema = z.enum(['total_cost', 'W', 'Wq', 'L', 'Lq', 'rho', 'PK'])

const mm1Schema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  n_max: z.coerce
    .number({ invalid_type_error: 'Escribe un número entero' })
    .int({ message: 'Usa un número entero' })
    .min(0, { message: 'No puede ser negativo' })
    .max(200, { message: 'El detalle máximo es 200' }),
})

const mm1kSchema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  k: z.coerce
    .number({ invalid_type_error: 'Escribe el cupo máximo' })
    .int({ message: 'El cupo debe ser un número entero' })
    .min(1, { message: 'El cupo debe ser al menos 1 (si es 0 no cabe nadie)' })
    .max(10_000, { message: 'El cupo máximo permitido es 10.000' }),
})

const mmsSchema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  s: z.coerce
    .number({ invalid_type_error: 'Escribe cuántas personas atienden' })
    .int({ message: 'El tamaño del equipo debe ser un número entero' })
    .min(1, { message: 'Necesitas al menos 1 persona atendiendo' })
    .max(500, { message: 'El máximo de personas es 500' }),
  n_max: z.coerce
    .number({ invalid_type_error: 'Escribe un número entero' })
    .int({ message: 'Usa un número entero' })
    .min(0, { message: 'No puede ser negativo' })
    .max(200, { message: 'El detalle máximo es 200' }),
})

const mmskSchema = z
  .object({
    lambda: positiveNumber,
    mu: positiveNumber,
    s: z.coerce
      .number({ invalid_type_error: 'Escribe cuántas personas atienden' })
      .int({ message: 'El tamaño del equipo debe ser un número entero' })
      .min(1, { message: 'Necesitas al menos 1 persona atendiendo' })
      .max(500, { message: 'El máximo de personas es 500' }),
    k: z.coerce
      .number({ invalid_type_error: 'Escribe el cupo máximo' })
      .int({ message: 'El cupo debe ser un número entero' })
      .min(1, { message: 'El cupo debe ser al menos 1 (si es 0 no cabe nadie)' })
      .max(10_000, { message: 'El cupo máximo permitido es 10.000' }),
  })
  .refine((data) => data.k >= data.s, {
    message:
      'El cupo no puede ser menor que el equipo: no puedes tener más puestos de atención que plazas en el local',
    path: ['k'],
  })

const costOptimizeSchema = z.object({
  model: modelNameSchema,
  lambda: positiveNumber,
  mu: positiveNumber,
  cs: positiveNumber,
  cw: positiveNumber,
  cb: optionalNonNegative,
  k: optionalPositive,
  s_min: optionalPositive,
  s_max: optionalPositive,
  k_min: optionalPositive,
  k_max: optionalPositive,
})

const recommendModelSchema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  finite_buffer: z.boolean(),
  k: optionalPositive,
  servers_available: z.coerce.number().int().min(1).max(500),
})

const capacityPlanningSchema = z.object({
  model: modelNameSchema,
  lambda: positiveNumber,
  mu: positiveNumber,
  k: optionalPositive,
  s_max: z.coerce.number().int().min(1).max(500),
  k_max: z.coerce.number().int().min(1).max(10_000),
  wq_max: optionalPositive,
  w_max: optionalPositive,
  lq_max: optionalPositive,
  l_max: optionalPositive,
  pk_max: optionalPositive,
  rho_max: optionalPositive,
})

const networkHealthSchema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  s: z.coerce.number().int().min(1).max(500),
  k: optionalPositive,
})

const scenarioSchema = z.object({
  name: z.string().min(1).max(80),
  model: modelNameSchema,
  lambda: positiveNumber,
  mu: positiveNumber,
  s: optionalPositive,
  k: optionalPositive,
  cs: optionalNonNegative,
  cw: optionalNonNegative,
  cb: optionalNonNegative,
})

const compareScenariosSchema = z.object({
  rank_by: rankBySchema,
  scenarios: z.array(scenarioSchema).min(2).max(20),
})

type Mm1FormValues = z.infer<typeof mm1Schema>
type Mm1kFormValues = z.infer<typeof mm1kSchema>
type MmsFormValues = z.infer<typeof mmsSchema>
type MmskFormValues = z.infer<typeof mmskSchema>
type CostOptimizeFormValues = z.infer<typeof costOptimizeSchema>
type RecommendModelFormValues = z.infer<typeof recommendModelSchema>
type CapacityPlanningFormValues = z.infer<typeof capacityPlanningSchema>
type NetworkHealthFormValues = z.infer<typeof networkHealthSchema>
type CompareScenariosFormValues = z.infer<typeof compareScenariosSchema>

const MODEL_OPTIONS: { value: ModelName; label: string }[] = [
  { value: 'MM1', label: 'Una persona · sin cupo' },
  { value: 'MM1K', label: 'Una persona · con cupo' },
  { value: 'MMS', label: 'Varias personas · sin cupo' },
  { value: 'MMSK', label: 'Varias personas · con cupo' },
]

const RANK_BY_OPTIONS: { value: RankBy; label: string }[] = [
  { value: 'total_cost', label: 'Menor costo total' },
  { value: 'Wq', label: 'Menos tiempo de espera' },
  { value: 'W', label: 'Menos tiempo total del cliente' },
  { value: 'Lq', label: 'Menos gente esperando' },
  { value: 'L', label: 'Menos gente en el local' },
  { value: 'rho', label: 'Equipo menos saturado' },
  { value: 'PK', label: 'Menos clientes que se quedan fuera' },
]

export {
  capacityPlanningSchema,
  compareScenariosSchema,
  costOptimizeSchema,
  mm1kSchema,
  mm1Schema,
  mmskSchema,
  mmsSchema,
  MODEL_OPTIONS,
  networkHealthSchema,
  RANK_BY_OPTIONS,
  recommendModelSchema,
}

export type {
  CapacityPlanningFormValues,
  CompareScenariosFormValues,
  CostOptimizeFormValues,
  Mm1FormValues,
  Mm1kFormValues,
  MmsFormValues,
  MmskFormValues,
  NetworkHealthFormValues,
  RecommendModelFormValues,
}
