type ModelName = 'MM1' | 'MM1K' | 'MMS' | 'MMSK'

type RankBy = 'total_cost' | 'W' | 'Wq' | 'L' | 'Lq' | 'rho' | 'PK'

type NetworkHealthStatus = 'OK' | 'ALERTA' | 'CRITICO' | 'INESTABLE'

type Stability = {
  is_stable: boolean
  rho: number
  note: string
}

type Metrics = {
  rho: number
  r: number | null
  P0: number
  Pn: number[]
  PK: number | null
  lambda_effective: number | null
  L: number
  Lq: number
  W: number
  Wq: number
  extra: Record<string, number>
}

type ModelResponse = {
  model: string
  inputs: Record<string, number | null>
  stability: Stability
  metrics: Metrics
}

type ApiErrorBody = {
  detail: string | Array<{ loc: (string | number)[]; msg: string; type: string }>
  rule?: string | null
  hint?: string | null
}

type MM1Request = {
  lambda: number
  mu: number
  n_max?: number
}

type MM1KRequest = {
  lambda: number
  mu: number
  k: number
}

type MMSRequest = {
  lambda: number
  mu: number
  s: number
  n_max?: number
}

type MMSKRequest = {
  lambda: number
  mu: number
  s: number
  k: number
}

type CostOptimizeRequest = {
  model: ModelName
  lambda: number
  mu: number
  cs: number
  cw: number
  cb?: number | null
  k?: number | null
  s_range?: [number, number] | null
  k_range?: [number, number] | null
}

type CostRow = {
  s: number
  k: number | null
  L: number
  PK: number | null
  service_cost: number
  waiting_cost: number
  blocking_cost: number
  total_cost: number
}

type CostOptimizeResponse = {
  model: string
  inputs: Record<string, number | null>
  best: CostRow
  savings_vs_worst: number
  table: CostRow[]
  note: string
}

type RecommendModelRequest = {
  lambda: number
  mu: number
  finite_buffer?: boolean
  k?: number | null
  servers_available?: number
}

type ModelAlternative = {
  model: string
  when: string
  parameters: string[]
}

type RecommendModelResponse = {
  recommended_model: string
  reason: string
  required_parameters: string[]
  alternatives: ModelAlternative[]
  warnings: string[]
}

type ServiceGoals = {
  wq_max?: number | null
  w_max?: number | null
  lq_max?: number | null
  l_max?: number | null
  pk_max?: number | null
  rho_max?: number | null
}

type CapacityPlanningRequest = {
  model: ModelName
  lambda: number
  mu: number
  goals: ServiceGoals
  k?: number | null
  s_max?: number
  k_max?: number
}

type CapacityPlanningResponse = {
  model: string
  feasible: boolean
  recommended: Record<string, unknown> | null
  goals_evaluated: Record<string, number>
  alternatives: Record<string, unknown>[]
  note: string
}

type NetworkHealthRequest = {
  lambda: number
  mu: number
  s?: number
  k?: number | null
}

type NetworkHealthResponse = {
  model: string
  status: NetworkHealthStatus | string
  rho: number
  explanation: string
  metrics: Metrics | null
  recommendations: string[]
}

type Scenario = {
  name?: string
  model: ModelName
  lambda: number
  mu: number
  s?: number | null
  k?: number | null
  cs?: number | null
  cw?: number | null
  cb?: number | null
}

type CompareScenariosRequest = {
  scenarios: Scenario[]
  rank_by?: RankBy
}

type ScenarioResult = {
  name: string
  model: string
  inputs: Record<string, number | null>
  status: string
  metrics: Metrics | null
  costs: Record<string, number | null> | null
  error: string | null
}

type CompareScenariosResponse = {
  rank_by: string
  winner: string | null
  results: ScenarioResult[]
  note: string
}

type HealthResponse = {
  status: string
  service: string
  version: string
  models: string[]
}

export type {
  ApiErrorBody,
  CapacityPlanningRequest,
  CapacityPlanningResponse,
  CompareScenariosRequest,
  CompareScenariosResponse,
  CostOptimizeRequest,
  CostOptimizeResponse,
  CostRow,
  HealthResponse,
  Metrics,
  MM1KRequest,
  MM1Request,
  MMSKRequest,
  MMSRequest,
  ModelAlternative,
  ModelName,
  ModelResponse,
  NetworkHealthRequest,
  NetworkHealthResponse,
  NetworkHealthStatus,
  RankBy,
  RecommendModelRequest,
  RecommendModelResponse,
  Scenario,
  ScenarioResult,
  ServiceGoals,
  Stability,
}
