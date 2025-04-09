
import { ToastState, ToastAction, Toast, ToasterToast } from "./types"
import { reducer } from "./toast-reducer"
import { genId } from "./toast-utils"

// Initialize with an empty state
export const initialState: ToastState = { toasts: [] }

// Create listeners array outside of components
export const listeners: Array<(state: ToastState) => void> = []
export let memoryState: ToastState = initialState

export function dispatch(action: ToastAction) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

export function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}
