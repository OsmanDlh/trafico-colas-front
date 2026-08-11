import z from 'zod/v3'

import type { ModelName, RankBy } from '@/types/queue.type'

const toOptionalNumber = (value: unknown): number | undefined => {
  if (value === '' || value === null || value === undefined) return undefined
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const positiveNumber = z.coerce.number({ invalid_type_error: 'Debe ser un número' }).gt(0, {
  message: 'Debe ser mayor que 0',
})

const optionalPositive = z
  .any()
  .transform(toOptionalNumber)
  .refine((value) => value === undefined || value > 0, {
    message: 'Debe ser mayor que 0',
  })

const optionalNonNegative = z
  .any()
  .transform(toOptionalNumber)
  .refine((value) => value === undefined || value >= 0, {
    message: 'Debe ser ≥ 0',
  })

const modelNameSchema = z.enum(['MM1', 'MM1K', 'MMS', 'MMSK'], {
  required_error: 'Selecciona un modelo',
})

const rankBySchema = z.enum(['total_cost', 'W', 'Wq', 'L', 'Lq', 'rho', 'PK'])

const mm1Schema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  n_max: z.coerce.number().int().min(0).max(200),
})

const mm1kSchema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  k: z.coerce.number().int().min(1).max(10_000),
})

const mmsSchema = z.object({
  lambda: positiveNumber,
  mu: positiveNumber,
  s: z.coerce.number().int().min(1).max(500),
  n_max: z.coerce.number().int().min(0).max(200),
})

const mmskSchema = z
  .object({
    lambda: positiveNumber,
    mu: positiveNumber,
    s: z.coerce.number().int().min(1).max(500),
    k: z.coerce.number().int().min(1).max(10_000),
  })
  .refine((data) => data.k >= data.s, {
    message: 'K debe ser ≥ s',
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
