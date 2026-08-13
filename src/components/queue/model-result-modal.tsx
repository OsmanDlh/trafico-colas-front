import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import ModelResultView from '@/components/queue/model-result-view'
import Modal from '@/components/ui/modal'
import { useModelResultStore } from '@/stores/model-result-store'

/** Ruta del modal de resultados: /models/resultado */
const MODEL_RESULT_MODAL_PATH = '/models/resultado'

const ModelResultModal = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const result = useModelResultStore((state) => state.result)
  const clearResult = useModelResultStore((state) => state.clearResult)

  const onClose = useCallback(() => {
    clearResult()
    const model = searchParams.get('model')
    void navigate(
      { pathname: '/models', search: model ? `?model=${model}` : '' },
      { replace: true },
    )
  }, [clearResult, navigate, searchParams])

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title="Resultado de tu operación"
      description="Así se ve tu negocio con los números que indicaste: ocupación, esperas y si alguien se queda fuera."
    >
      <ModelResultView result={result} embedded />
    </Modal>
  )
}

export { MODEL_RESULT_MODAL_PATH }

export default ModelResultModal
