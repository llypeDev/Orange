import {
  forwardRef,
  useEffect,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useControllableState, useId, usePresence } from '../../hooks'
import { Icon } from '../../icons'
import { cx } from '../../utils'
import './Disclosure.css'

export type DisclosureVariant = 'inline' | 'outline'
export type DisclosureSize = 'sm' | 'md'

export interface DisclosureProps extends HTMLAttributes<HTMLDivElement> {
  /** Texto do botão que mostra e esconde o conteúdo ("Opções avançadas", "Por que pedimos isso?"). */
  label: ReactNode
  /** Aberto (controlado). */
  open?: boolean
  /** Aberto inicialmente (não controlado). Padrão: `false`. */
  defaultOpen?: boolean
  /** Chamado ao abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /**
   * `inline` (padrão): botão com cara de link e conteúdo recuado com um fio à esquerda.
   * `outline`: caixa com borda, como um item de Accordion.
   */
  variant?: DisclosureVariant
  /** Tamanho do texto e dos espaçamentos. Padrão: `md`. */
  size?: DisclosureSize
  /** Envolve o botão em um heading (`h2`–`h6`). Sem esta prop, não há heading. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Desabilita o botão (o conteúdo mantém o estado atual). */
  disabled?: boolean
  children?: ReactNode
}

/**
 * Uma área que se mostra e se esconde, fora de um Accordion (padrão
 * "disclosure" do WAI-ARIA): um `<button>` com `aria-expanded` e
 * `aria-controls` e o conteúdo logo abaixo. O conteúdo fechado continua
 * montado (preserva o estado de campos), fica `inert` durante a saída e
 * recebe `hidden` quando a transição termina.
 */
export const Disclosure = forwardRef<HTMLDivElement, DisclosureProps>(function Disclosure(
  {
    label,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    variant = 'inline',
    size = 'md',
    headingLevel,
    disabled = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const id = useId('or-disclosure')
  const triggerId = `${id}-trigger`
  const contentId = `${id}-content`
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const { present, nodeRef } = usePresence<HTMLDivElement>(open)
  // Ao abrir, o conteúdo fica um quadro em 0fr para a transição ter um ponto de partida.
  const [expanded, setExpanded] = useState(open)

  useEffect(() => {
    if (!open) {
      setExpanded(false)
      return
    }
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setExpanded(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [open])

  const Header: ElementType = headingLevel ? `h${headingLevel}` : 'div'

  return (
    <div
      ref={ref}
      className={cx(
        'or-disclosure',
        `or-disclosure--${variant}`,
        `or-disclosure--${size}`,
        className,
      )}
      data-state={open ? 'open' : 'closed'}
      data-disabled={disabled || undefined}
      {...rest}
    >
      <Header className="or-disclosure__header">
        <button
          type="button"
          id={triggerId}
          className="or-disclosure__trigger"
          aria-expanded={open}
          aria-controls={contentId}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="or-disclosure__label">{label}</span>
          <Icon
            name="chevron-down"
            size={size === 'sm' ? 16 : 20}
            className="or-disclosure__icon"
          />
        </button>
      </Header>
      <div
        ref={nodeRef}
        id={contentId}
        role="group"
        aria-labelledby={triggerId}
        className="or-disclosure__content"
        data-state={open && expanded ? 'open' : 'closed'}
        hidden={!present}
        inert={open ? undefined : true}
      >
        <div className="or-disclosure__content-clip">
          <div className="or-disclosure__content-inner">{children}</div>
        </div>
      </div>
    </div>
  )
})
