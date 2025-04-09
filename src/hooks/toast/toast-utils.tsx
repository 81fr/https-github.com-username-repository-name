
import { actionTypes, ToastAction } from "./types"
import { TOAST_REMOVE_DELAY } from "./toast-constants"
import { dispatch } from "./toast-store"

// Timeout map for managing toast removal
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

let count = 0

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}
