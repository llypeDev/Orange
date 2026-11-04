import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ReactNode,
} from 'react'
import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from '../Button'

/**
 * Contexto interno compartilhado pelos componentes de ação (ButtonGroup,
 * ToggleButtonGroup, Toolbar). Repassa `size`, `variant` e `disabled` aos
 * filhos e marca os itens de uma Toolbar para o roving tabindex.
 * Não é exportado pela biblioteca.
 */
export interface ActionGroupContextValue {
  size?: ButtonSize
  variant?: ButtonVariant
  disabled?: boolean
  /** Direção herdada por grupos e divisores aninhados (ex.: Toolbar vertical). */
  orientation?: 'horizontal' | 'vertical'
  /** Os itens estão dentro de uma `Toolbar` e participam do roving tabindex. */
  roving?: boolean
}

export const ActionGroupContext = createContext<ActionGroupContextValue | null>(null)

export function useActionGroup(): ActionGroupContextValue | null {
  return useContext(ActionGroupContext)
}

/** Atributos que marcam um item navegável por setas dentro de uma Toolbar. */
export function rovingItemProps(ctx: ActionGroupContextValue | null): { 'data-roving-item'?: '' } {
  return ctx?.roving ? { 'data-roving-item': '' } : {}
}

type ButtonElementProps = ButtonProps & { 'data-roving-item'?: string | boolean }

/**
 * O `Button` não lê contexto; por isso os filhos diretos que são `Button`
 * recebem `size`, `variant`, `disabled` e `data-roving-item` do grupo via
 * `cloneElement` — sempre respeitando o que foi definido no próprio botão.
 */
export function applyGroupDefaults(children: ReactNode, ctx: ActionGroupContextValue): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement<ButtonElementProps>(child) || child.type !== Button) return child
    const own = child.props
    const extra: Partial<ButtonElementProps> = {}
    if (own.size === undefined && ctx.size) extra.size = ctx.size
    if (own.variant === undefined && ctx.variant) extra.variant = ctx.variant
    if (own.disabled === undefined && ctx.disabled) extra.disabled = true
    if (own['data-roving-item'] === undefined && ctx.roving) extra['data-roving-item'] = ''
    return Object.keys(extra).length > 0 ? cloneElement(child, extra) : child
  })
}
