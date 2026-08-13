import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { MODEL_RESULT_MODAL_PATH } from '@/components/queue/model-result-modal'
import Form from '@/components/shared/form'
import FormInput from '@/components/shared/form-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { checkModelStability } from '@/lib/model-stability'
import {
  type Mm1FormValues,
  type Mm1kFormValues,
  mm1kSchema,
  mm1Schema,
  type MmsFormValues,
  type MmskFormValues,
  mmskSchema,
  mmsSchema,
} from '@/lib/queue-schemas'
import { cn } from '@/lib/utils'
import {
  useAnalyzeMm1,
  useAnalyzeMm1k,
  useAnalyzeMms,
  useAnalyzeMmsk,
} from '@/services/models.service'
import { useModelResultStore } from '@/stores/model-result-store'
import type { ModelName, ModelResponse } from '@/types/queue.type'
import { getApiErrorMessage } from '@/utils/api-error'

const modelTabs: {
  id: ModelName
  title: string
  example: string
}[] = [
  {
    id: 'MM1',
    title: 'Una persona · sin límite de espera',
    example: 'Un solo mostrador o cajero, la fila puede crecer',
  },
  {
    id: 'MM1K',
    title: 'Una persona · con cupo máximo',
    example: 'Un mostrador y solo caben K clientes',
  },
  {
    id: 'MMS',
    title: 'Varias personas · sin límite',
    example: 'Varios empleados atendiendo a la vez',
  },
  {
    id: 'MMSK',
    title: 'Varias personas · con cupo',
    example: 'Varios empleados y un máximo de clientes dentro',
  },
]

const MODEL_IDS = new Set<string>(modelTabs.map((tab) => tab.id))

const parseModelParam = (value: string | null): ModelName | null => {
  if (value && MODEL_IDS.has(value)) return value as ModelName
  return null
}

const ModelsAnalyzer = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeModel = parseModelParam(searchParams.get('model')) ?? 'MMSK'
  const setResult = useModelResultStore((state) => state.setResult)

  const setActiveModel = (model: ModelName) => {
    setSearchParams({ model }, { replace: true })
  }

  const mm1 = useAnalyzeMm1()
  const mm1k = useAnalyzeMm1k()
  const mms = useAnalyzeMms()
  const mmsk = useAnalyzeMmsk()
  const isPending = mm1.isPending || mm1k.isPending || mms.isPending || mmsk.isPending

  const onError = (error: Error) => toast.error(getApiErrorMessage(error))
  const onSuccess = (data: ModelResponse) => {
    setResult(data)
    toast.success('Cálculo listo')
    void navigate({ pathname: MODEL_RESULT_MODAL_PATH, search: `?model=${activeModel}` })
  }

  const guardAndRun = (
    model: ModelName,
    values: { lambda: number; mu: number; s?: number; k?: number },
    run: () => void,
  ) => {
    const check = checkModelStability({ model, ...values })
    if (!check.ok) {
      toast.error(`${check.message}. ${check.howToFix}`)
      return
    }
    run()
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle className="font-display">Describe tu negocio</CardTitle>
        <CardDescription>
          Elige cómo atiendes hoy. Ejemplo: clientes llegan cada hora y tu equipo los atiende de uno
          en uno o en paralelo. Si algo no cuadra, te diremos por qué en palabras simples.
        </CardDescription>
        <div className="grid gap-2 pt-2 sm:grid-cols-2">
          {modelTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveModel(tab.id)}
              className={cn(
                'rounded-2xl border px-3 py-3 text-left transition-colors',
                activeModel === tab.id
                  ? 'border-secondary bg-secondary/30 shadow-sm'
                  : 'border-border hover:bg-muted/70',
              )}
            >
              <p className="text-foreground text-sm font-semibold">{tab.title}</p>
              <p className="text-muted-foreground mt-1 text-xs">{tab.example}</p>
            </button>
          ))}
        </div>
      </CardHeader>

          {activeModel === 'MM1' ? (
            <Form<Mm1FormValues>
              onSubmit={(data) =>
                guardAndRun('MM1', data, () => mm1.mutate(data, { onSuccess, onError }))
              }
              useFormProps={{
                resolver: zodResolver(mm1Schema),
                defaultValues: { lambda: 8, mu: 10, n_max: 10 },
              }}
            >
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormInput<Mm1FormValues>
                  name="lambda"
                  label="Clientes que llegan por hora"
                  hint="Ej.: 8 personas llegan cada hora"
                  type="number"
                  step="any"
                />
                <FormInput<Mm1FormValues>
                  name="mu"
                  label="Clientes que atiende cada persona por hora"
                  hint="Debe ser mayor que las llegadas (si no, la fila no para de crecer)"
                  type="number"
                  step="any"
                />
                <FormInput<Mm1FormValues>
                  name="n_max"
                  label="Detalle de la distribución (opcional)"
                  hint="Solo afecta gráficos avanzados"
                  type="number"
                  className="sm:col-span-2"
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
                  Ver cómo está mi operación
                </Button>
              </CardFooter>
            </Form>
          ) : null}

          {activeModel === 'MM1K' ? (
            <Form<Mm1kFormValues>
              onSubmit={(data) =>
                guardAndRun('MM1K', data, () => mm1k.mutate(data, { onSuccess, onError }))
              }
              useFormProps={{
                resolver: zodResolver(mm1kSchema),
                defaultValues: { lambda: 8, mu: 10, k: 5 },
              }}
            >
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormInput<Mm1kFormValues>
                  name="lambda"
                  label="Clientes que llegan por hora"
                  hint="Personas que llegan a pedir servicio"
                  type="number"
                  step="any"
                />
                <FormInput<Mm1kFormValues>
                  name="mu"
                  label="Clientes atendidos por hora"
                  hint="Ritmo de atención de tu personal"
                  type="number"
                  step="any"
                />
                <FormInput<Mm1kFormValues>
                  name="k"
                  label="Cupo máximo de clientes"
                  hint="Si se llena, el siguiente cliente no entra"
                  type="number"
                  className="sm:col-span-2"
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
                  Ver cómo está mi operación
                </Button>
              </CardFooter>
            </Form>
          ) : null}

          {activeModel === 'MMS' ? (
            <Form<MmsFormValues>
              onSubmit={(data) =>
                guardAndRun('MMS', data, () => mms.mutate(data, { onSuccess, onError }))
              }
              useFormProps={{
                resolver: zodResolver(mmsSchema),
                defaultValues: { lambda: 8, mu: 3, s: 3, n_max: 10 },
              }}
            >
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormInput<MmsFormValues>
                  name="lambda"
                  label="Clientes que llegan por hora"
                  hint="Ejemplo: 8 por hora"
                  type="number"
                  step="any"
                />
                <FormInput<MmsFormValues>
                  name="mu"
                  label="Atenciones por persona / hora"
                  hint="Ejemplo: cada empleado atiende 3 por hora"
                  type="number"
                  step="any"
                />
                <FormInput<MmsFormValues>
                  name="s"
                  label="Personas atendiendo"
                  hint="Tu equipo debe cubrir las llegadas: s × atención > llegadas"
                  type="number"
                />
                <FormInput<MmsFormValues> name="n_max" label="Detalle (opcional)" type="number" />
              </CardContent>
              <CardFooter>
                <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
                  Ver cómo está mi operación
                </Button>
              </CardFooter>
            </Form>
          ) : null}

          {activeModel === 'MMSK' ? (
            <Form<MmskFormValues>
              onSubmit={(data) =>
                guardAndRun('MMSK', data, () => mmsk.mutate(data, { onSuccess, onError }))
              }
              useFormProps={{
                resolver: zodResolver(mmskSchema),
                defaultValues: { lambda: 8, mu: 3, s: 3, k: 6 },
              }}
            >
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormInput<MmskFormValues>
                  name="lambda"
                  label="Clientes que llegan por hora"
                  hint="Demanda que llega a tu negocio"
                  type="number"
                  step="any"
                />
                <FormInput<MmskFormValues>
                  name="mu"
                  label="Atenciones por persona / hora"
                  hint="Productividad de cada empleado"
                  type="number"
                  step="any"
                />
                <FormInput<MmskFormValues> name="s" label="Personas en el equipo" type="number" />
                <FormInput<MmskFormValues>
                  name="k"
                  label="Cupo máximo (incluye quien espera)"
                  hint="No puede ser menor que el tamaño del equipo"
                  type="number"
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
                  Ver cómo está mi operación
                </Button>
              </CardFooter>
            </Form>
        ) : null}
    </Card>
  )
}

export default ModelsAnalyzer
