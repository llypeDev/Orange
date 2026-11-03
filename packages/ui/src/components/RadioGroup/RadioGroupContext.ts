import { createContext, useContext } from 'react'

export interface RadioGroupContextValue {
  name: string
  value: string | null
  disabled: boolean
  required: boolean
  variant: 'default' | 'card'
  select: (value: string) => void
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export function useRadioGroup() {
  return useContext(RadioGroupContext)
}
