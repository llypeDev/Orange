import { forwardRef, type FieldsetHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../utils'
import { FieldsetBase } from './FieldsetBase'

export type FieldsetGap = 'sm' | 'md' | 'lg'

export interface FieldsetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title'> {
  /** Título do grupo, renderizado como `<legend>`. Leitores de tela o anunciam ao entrar no grupo. */
  legend: ReactNode
  /** Oculta a legenda visualmente (continua acessível). */
  hideLegend?: boolean
  /** Texto de ajuda do grupo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Erro que vale para o grupo inteiro (ex.: "Informe ao menos um telefone"). */
  error?: ReactNode
  /** Desabilita nativamente todos os controles internos. */
  disabled?: boolean
  /** Espaçamento entre os campos: `sm` 12px, `md` 20px, `lg` 32px. Padrão: `md`. */
  gap?: FieldsetGap
  children?: ReactNode
}

/**
 * Agrupa campos relacionados com `<fieldset>` e `<legend>` nativos — por
 * exemplo, "Endereço de entrega". `disabled` desabilita todos os controles
 * internos de uma vez.
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, gap = 'md', className, children, ...rest },
  ref,
) {
  return (
    <FieldsetBase
      ref={ref}
      appearance="section"
      legend={legend}
      className={cx(`or-fieldset--gap-${gap}`, className)}
      {...rest}
    >
      {children}
    </FieldsetBase>
  )
})
