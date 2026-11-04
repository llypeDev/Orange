import { createContext, useContext } from 'react'

/** Contexto interno que liga cada ToggleButton ao ToggleButtonGroup. */
export interface ToggleGroupContextValue {
  isPressed: (value: string) => boolean
  toggle: (value: string) => void
}

export const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

export function useToggleGroup(): ToggleGroupContextValue | null {
  return useContext(ToggleGroupContext)
}
