import { createContext, useContext } from 'react'

export interface CheckboxGroupContextValue {
  name?: string
  value: string[]
  disabled: boolean
  invalid: boolean
  variant: 'default' | 'card'
  toggle: (value: string, checked: boolean) => void
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)

export function useCheckboxGroup() {
  return useContext(CheckboxGroupContext)
}
