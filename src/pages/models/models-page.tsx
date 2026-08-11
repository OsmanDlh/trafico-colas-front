import ModelsAnalyzer from '@/components/queue/models-analyzer'

const ModelsPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <p className="text-primary text-sm font-bold tracking-wide uppercase">Mi operación</p>
        <h1 className="font-display text-foreground text-3xl font-bold">
          ¿Cómo está funcionando hoy?
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Indica cuántos clientes llegan y cuántas personas te atienden. Te mostramos esperas,
          ocupación y si hay gente que se queda fuera.
        </p>
      </div>
      <ModelsAnalyzer />
    </div>
  )
}

export default ModelsPage
