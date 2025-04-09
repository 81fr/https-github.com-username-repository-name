
import * as React from "react"
import { initialState, listeners, memoryState, toast, dispatch } from "./toast-store"
import { ToastState } from "./types"

// Create a context to manage toast state
const ToastContext = React.createContext<{
  state: ToastState
  toast: typeof toast
  dismiss: (toastId?: string) => void
}>({
  state: initialState,
  toast: () => ({ id: "", dismiss: () => {}, update: () => {} }),
  dismiss: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  const contextValue = React.useMemo(() => {
    return {
      state,
      toast,
      dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    }
  }, [state])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return {
    ...context.state,
    toast: context.toast,
    dismiss: context.dismiss,
  }
}
