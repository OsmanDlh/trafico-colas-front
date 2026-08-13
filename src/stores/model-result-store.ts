import { create } from 'zustand'

import type { ModelResponse } from '@/types/queue.type'

type ModelResultState = {
  result: ModelResponse | null
  setResult: (result: ModelResponse) => void
  clearResult: () => void
}

const useModelResultStore = create<ModelResultState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
}))

export { useModelResultStore }
