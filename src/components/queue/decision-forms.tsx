import { zodResolver } from '@hookform/resolvers/zod'
import { useFormContext } from 'react-hook-form'

import Form from '@/components/shared/form'
import FormInput from '@/components/shared/form-input'
import FormSelect from '@/components/shared/form-select'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  type CapacityPlanningFormValues,
  capacityPlanningSchema,
  type CompareScenariosFormValues,
  compareScenariosSchema,
  MODEL_OPTIONS,
  type NetworkHealthFormValues,
  networkHealthSchema,
  RANK_BY_OPTIONS,
  type RecommendModelFormValues,
  recommendModelSchema,
} from '@/lib/queue-schemas'
import type { CapacityPlanningRequest } from '@/types/queue.type'

type FormHandlers = {
  isPending: boolean
  onRecommend: (data: RecommendModelFormValues) => void
  onCapacity: (payload: CapacityPlanningRequest) => void
  onHealth: (data: NetworkHealthFormValues) => void
  onCompare: (data: CompareScenariosFormValues) => void
}

const FiniteBufferCheckbox = () => {
  const { register } = useFormContext<RecommendModelFormValues>()
  return (
    <div className="bg-muted/50 flex items-start gap-3 rounded-2xl p-3 sm:col-span-2">
      <input
        id="finite_buffer"
        type="checkbox"
        className="accent-secondary mt-1 h-4 w-4"
        {...register('finite_buffer')}
      />
      <div>
        <Label htmlFor="finite_buffer">Hay un cupo máximo de clientes</Label>
        <p className="text-muted-foreground text-xs">
          Márcalo si, cuando el local o el sistema se llena, no entran más personas.
        </p>
      </div>
    </div>
  )
}

const RecommendForm = ({
  isPending,
  onRecommend,
}: Pick<FormHandlers, 'isPending' | 'onRecommend'>) => (
  <Form<RecommendModelFormValues>
    onSubmit={onRecommend}
    useFormProps={{
      resolver: zodResolver(recommendModelSchema),
      defaultValues: {
        lambda: 8,
        mu: 3,
        finite_buffer: true,
        servers_available: 3,
        k: 6,
      },
    }}
  >
    <CardContent className="grid gap-4 sm:grid-cols-2">
      <FormInput<RecommendModelFormValues>
        name="lambda"
        label="Clientes por hora"
        type="number"
        step="any"
      />
      <FormInput<RecommendModelFormValues>
        name="mu"
        label="Atenciones por persona / hora"
        type="number"
        step="any"
      />
      <FormInput<RecommendModelFormValues>
        name="servers_available"
        label="Personas disponibles"
        hint="¿Cuántas tienes hoy?"
        type="number"
      />
      <FormInput<RecommendModelFormValues> name="k" label="Cupo máximo (si aplica)" type="number" />
      <FiniteBufferCheckbox />
    </CardContent>
    <CardFooter>
      <Button type="submit" isLoading={isPending}>
        Orientarme
      </Button>
    </CardFooter>
  </Form>
)

const CapacityForm = ({
  isPending,
  onCapacity,
}: Pick<FormHandlers, 'isPending' | 'onCapacity'>) => (
  <Form<CapacityPlanningFormValues>
    onSubmit={(data) =>
      onCapacity({
        model: data.model,
        lambda: data.lambda,
        mu: data.mu,
        s_max: data.s_max,
        k_max: data.k_max,
        k: data.k,
        goals: {
          wq_max: data.wq_max,
          w_max: data.w_max,
          lq_max: data.lq_max,
          l_max: data.l_max,
          pk_max: data.pk_max,
          rho_max: data.rho_max,
        },
      })
    }
    useFormProps={{
      resolver: zodResolver(capacityPlanningSchema),
      defaultValues: {
        model: 'MMSK',
        lambda: 8,
        mu: 3,
        s_max: 50,
        k_max: 200,
        pk_max: 0.01,
      },
    }}
  >
    <CardContent className="grid gap-4 sm:grid-cols-2">
      <FormSelect<CapacityPlanningFormValues>
        name="model"
        label="Cómo atiendes"
        options={MODEL_OPTIONS}
        className="sm:col-span-2"
      />
      <FormInput<CapacityPlanningFormValues>
        name="lambda"
        label="Clientes por hora"
        type="number"
        step="any"
      />
      <FormInput<CapacityPlanningFormValues>
        name="mu"
        label="Atenciones por persona / hora"
        type="number"
        step="any"
      />
      <FormInput<CapacityPlanningFormValues>
        name="pk_max"
        label="% máximo de clientes que se quedan fuera"
        hint="Ej. 0.01 = 1%"
        type="number"
        step="any"
      />
      <FormInput<CapacityPlanningFormValues>
        name="wq_max"
        label="Espera máxima aceptable"
        type="number"
        step="any"
      />
      <FormInput<CapacityPlanningFormValues>
        name="rho_max"
        label="Ocupación máxima del equipo"
        hint="Ej. 0.85 = 85%"
        type="number"
        step="any"
      />
      <FormInput<CapacityPlanningFormValues>
        name="w_max"
        label="Tiempo total máximo del cliente"
        type="number"
        step="any"
      />
    </CardContent>
    <CardFooter>
      <Button type="submit" isLoading={isPending}>
        Calcular equipo mínimo
      </Button>
    </CardFooter>
  </Form>
)

const HealthForm = ({ isPending, onHealth }: Pick<FormHandlers, 'isPending' | 'onHealth'>) => (
  <Form<NetworkHealthFormValues>
    onSubmit={onHealth}
    useFormProps={{
      resolver: zodResolver(networkHealthSchema),
      defaultValues: { lambda: 8, mu: 3, s: 3, k: 6 },
    }}
  >
    <CardContent className="grid gap-4 sm:grid-cols-2">
      <FormInput<NetworkHealthFormValues>
        name="lambda"
        label="Clientes que llegan ahora (por hora)"
        hint="Tu demanda actual"
        type="number"
        step="any"
      />
      <FormInput<NetworkHealthFormValues>
        name="mu"
        label="Atenciones por persona / hora"
        type="number"
        step="any"
      />
      <FormInput<NetworkHealthFormValues> name="s" label="Personas trabajando" type="number" />
      <FormInput<NetworkHealthFormValues>
        name="k"
        label="Cupo máximo (si hay)"
        hint="Déjalo vacío si no hay límite"
        type="number"
      />
    </CardContent>
    <CardFooter>
      <Button type="submit" isLoading={isPending}>
        Diagnosticar
      </Button>
    </CardFooter>
  </Form>
)

const CompareForm = ({ isPending, onCompare }: Pick<FormHandlers, 'isPending' | 'onCompare'>) => (
  <Form<CompareScenariosFormValues>
    onSubmit={onCompare}
    useFormProps={{
      resolver: zodResolver(compareScenariosSchema),
      defaultValues: {
        rank_by: 'Wq',
        scenarios: [
          { name: '3 personas', model: 'MMSK', lambda: 8, mu: 3, s: 3, k: 6 },
          { name: '4 personas', model: 'MMSK', lambda: 8, mu: 3, s: 4, k: 6 },
        ],
      },
    }}
  >
    <CardContent className="space-y-5">
      <FormSelect<CompareScenariosFormValues>
        name="rank_by"
        label="¿Qué es más importante para ti?"
        options={RANK_BY_OPTIONS}
      />
      {[0, 1].map((index) => (
        <div key={index} className="border-border bg-muted/20 space-y-3 rounded-2xl border p-4">
          <p className="text-sm font-bold">Opción {index + 1}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput<CompareScenariosFormValues>
              name={`scenarios.${index}.name`}
              label="Nombre"
              placeholder="Ej. 3 personas"
            />
            <FormSelect<CompareScenariosFormValues>
              name={`scenarios.${index}.model`}
              label="Tipo de operación"
              options={MODEL_OPTIONS}
            />
            <FormInput<CompareScenariosFormValues>
              name={`scenarios.${index}.lambda`}
              label="Clientes / hora"
              type="number"
              step="any"
            />
            <FormInput<CompareScenariosFormValues>
              name={`scenarios.${index}.mu`}
              label="Atenciones / persona"
              type="number"
              step="any"
            />
            <FormInput<CompareScenariosFormValues>
              name={`scenarios.${index}.s`}
              label="Personas"
              type="number"
            />
            <FormInput<CompareScenariosFormValues>
              name={`scenarios.${index}.k`}
              label="Cupo"
              type="number"
            />
          </div>
        </div>
      ))}
    </CardContent>
    <CardFooter>
      <Button type="submit" isLoading={isPending}>
        Comparar y elegir
      </Button>
    </CardFooter>
  </Form>
)

export type { FormHandlers }

export { CapacityForm, CompareForm, HealthForm, RecommendForm }
