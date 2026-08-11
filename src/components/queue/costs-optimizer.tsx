import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'

import CostResultView from '@/components/queue/cost-result-view'
import Form from '@/components/shared/form'
import FormInput from '@/components/shared/form-input'
import FormSelect from '@/components/shared/form-select'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type CostOptimizeFormValues, costOptimizeSchema, MODEL_OPTIONS } from '@/lib/queue-schemas'
import { useOptimizeCost } from '@/services/costs.service'
import type { CostOptimizeRequest, CostOptimizeResponse } from '@/types/queue.type'
import { getApiErrorMessage } from '@/utils/api-error'

const toPayload = (data: CostOptimizeFormValues): CostOptimizeRequest => {
  const payload: CostOptimizeRequest = {
    model: data.model,
    lambda: data.lambda,
    mu: data.mu,
    cs: data.cs,
    cw: data.cw,
  }

  if (data.cb !== undefined) payload.cb = data.cb
  if (data.k !== undefined) payload.k = data.k
  if (data.s_min !== undefined && data.s_max !== undefined) {
    payload.s_range = [data.s_min, data.s_max]
  }
  if (data.k_min !== undefined && data.k_max !== undefined) {
    payload.k_range = [data.k_min, data.k_max]
  }

  return payload
}

const CostsOptimizer = () => {
  const [result, setResult] = useState<CostOptimizeResponse | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const optimize = useOptimizeCost()

  const handleSubmit = (data: CostOptimizeFormValues) => {
    optimize.mutate(toPayload(data), {
      onSuccess: (response) => {
        setResult(response)
        toast.success(`Mejor opción: ${response.best.s} servidores`)
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Datos de tu operación</CardTitle>
          <CardDescription>
            Cuéntanos tu demanda, la productividad de tu equipo y lo que te cuesta cada persona
            frente a hacer esperar a un cliente.
          </CardDescription>
        </CardHeader>
        <Form<CostOptimizeFormValues>
          onSubmit={handleSubmit}
          useFormProps={{
            resolver: zodResolver(costOptimizeSchema),
            defaultValues: {
              model: 'MMS',
              lambda: 8,
              mu: 3,
              cs: 20,
              cw: 30,
            },
          }}
        >
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormSelect<CostOptimizeFormValues>
                name="model"
                label="Cómo atiendes hoy"
                options={MODEL_OPTIONS}
                className="sm:col-span-2"
              />
              <FormInput<CostOptimizeFormValues>
                name="lambda"
                label="Clientes por hora"
                hint="Demanda promedio"
                type="number"
                step="any"
              />
              <FormInput<CostOptimizeFormValues>
                name="mu"
                label="Atenciones por persona / hora"
                hint="Productividad individual"
                type="number"
                step="any"
              />
              <FormInput<CostOptimizeFormValues>
                name="cs"
                label="Costo de cada persona"
                hint="Salario u operación por unidad de tiempo"
                type="number"
                step="any"
              />
              <FormInput<CostOptimizeFormValues>
                name="cw"
                label="Costo de hacer esperar a un cliente"
                hint="Pérdida de productividad o insatisfacción"
                type="number"
                step="any"
              />
            </div>

            <button
              type="button"
              className="text-primary text-sm font-bold hover:underline"
              onClick={() => setShowAdvanced((prev) => !prev)}
            >
              {showAdvanced ? 'Ocultar opciones extras' : 'Más opciones (opcional)'}
            </button>

            {showAdvanced ? (
              <div className="border-border bg-muted/30 grid gap-4 rounded-2xl border border-dashed p-4 sm:grid-cols-2">
                <FormInput<CostOptimizeFormValues>
                  name="cb"
                  label="Costo por cliente perdido"
                  hint="Si se van cuando no caben"
                  type="number"
                  step="any"
                />
                <FormInput<CostOptimizeFormValues> name="k" label="Cupo fijo" type="number" />
                <FormInput<CostOptimizeFormValues>
                  name="s_min"
                  label="Buscar desde # personas"
                  type="number"
                />
                <FormInput<CostOptimizeFormValues>
                  name="s_max"
                  label="Buscar hasta # personas"
                  type="number"
                />
                <FormInput<CostOptimizeFormValues> name="k_min" label="Cupo desde" type="number" />
                <FormInput<CostOptimizeFormValues> name="k_max" label="Cupo hasta" type="number" />
              </div>
            ) : null}
          </CardContent>
          <CardFooter>
            <Button type="submit" isLoading={optimize.isPending} className="w-full sm:w-auto">
              Calcular el mejor equipo
            </Button>
          </CardFooter>
        </Form>
      </Card>

      <CostResultView result={result} />
    </div>
  )
}

export default CostsOptimizer
