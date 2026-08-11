import CostsOptimizer from '@/components/queue/costs-optimizer'

const CostsPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <p className="text-primary text-sm font-bold tracking-wide uppercase">Ahorrar</p>
        <h1 className="font-display text-foreground text-3xl font-bold">
          ¿Cuánto personal te conviene?
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Equilibra lo que pagas por cada persona con lo que te cuesta hacer esperar a tus clientes.
          Te decimos el número que minimiza el gasto total.
        </p>
      </div>
      <CostsOptimizer />
    </div>
  )
}

export default CostsPage
