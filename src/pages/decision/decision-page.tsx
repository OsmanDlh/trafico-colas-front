import DecisionPanel from '@/components/queue/decision-panel'

const DecisionPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <p className="text-primary text-sm font-bold tracking-wide uppercase">Recomendaciones</p>
        <h1 className="font-display text-foreground text-3xl font-bold">
          Qué te conviene hacer ahora
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Elige una pregunta. Te respondemos con un diagnóstico claro y pasos concretos para tu
          negocio.
        </p>
      </div>
      <DecisionPanel />
    </div>
  )
}

export default DecisionPage
