import {
  forwardRef,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { useControllableState, useId, useMounted } from '../../hooks'
import { Icon, type IconName } from '../../icons'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx, mergeRefs } from '../../utils'
import { getThemeScope, useLayer } from '../Modal/overlay'
import { useFloatingPanel, type FloatingPlacement } from '../Popover/floating'
import { Portal } from '../Portal'
import './Toggletip.css'

export type ToggletipPlacement = FloatingPlacement
export type ToggletipSize = 'sm' | 'md'

export interface ToggletipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'content' | 'children'> {
  /** Explicação exibida na bolha e anunciada por leitores de tela. Evite links e botões. */
  content: ReactNode
  /** Nome acessível do botão. Padrão: "Mais informações". Prefira algo específico: "Sobre a taxa de conversão". */
  label?: string
  /** Posição preferida da bolha; inverte sozinha se faltar espaço. */
  placement?: ToggletipPlacement
  /** Distância do botão, em px. */
  offset?: number
  /** Ícone do botão. */
  icon?: IconName
  /** Tamanho do botão: `sm` 24px, `md` 32px. */
  size?: ToggletipSize
  /** Aberto (controlado). */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando a bolha abre ou fecha. */
  onOpenChange?: (open: boolean) => void
}

/**
 * Botão de informação que mostra uma explicação curta ao ser clicado. O
 * conteúdo entra numa região `aria-live`, então é anunciado mesmo sem mover o
 * foco (padrão "toggletip" do Inclusive Components).
 */
export const Toggletip = forwardRef<HTMLButtonElement, ToggletipProps>(function Toggletip(
  {
    content,
    label,
    placement = 'top',
    offset = 8,
    icon = 'info',
    size = 'sm',
    open,
    defaultOpen = false,
    onOpenChange,
    className,
    onClick,
    onBlur,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange })
  const mounted = useMounted()
  const visible = isOpen && mounted
  const bubbleId = useId('or-toggletip')
  const [buttonEl, setButtonEl] = useState<HTMLButtonElement | null>(null)
  const [bubbleEl, setBubbleEl] = useState<HTMLDivElement | null>(null)

  const floating = useFloatingPanel({ open: visible, reference: buttonEl, floating: bubbleEl, placement, offset, arrow: true })

  const { setNode, layerProps } = useLayer(visible, {
    onEscape: () => setOpen(false),
    onPointerDownOutside: () => setOpen(false),
    insideElements: () => [buttonEl],
  })

  const buttonRef = useMemo(() => mergeRefs<HTMLButtonElement>(ref, setButtonEl), [ref])
  const bubbleRef = useMemo(() => mergeRefs<HTMLDivElement>(setBubbleEl, setNode), [setNode])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={cx('or-toggletip-button', `or-toggletip-button--${size}`, className)}
        aria-label={label ?? t('moreInfo')}
        aria-expanded={visible}
        onClick={composeEventHandlers(onClick, (_event: ReactMouseEvent<HTMLButtonElement>) => setOpen((v) => !v))}
        onBlur={composeEventHandlers(onBlur, (event: ReactFocusEvent<HTMLButtonElement>) => {
          // Fecha quando o foco vai para outro controle (Tab, clique em outro campo).
          const next = event.relatedTarget as Node | null
          if (next && !bubbleEl?.contains(next)) setOpen(false)
        })}
        {...rest}
      >
        <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />
      </button>
      <Portal>
        {/* A região existe desde a montagem; inserir a bolha nela dispara o anúncio. */}
        <div role="status" aria-live="polite" className="or-toggletip-region">
          {visible && (
            <div
              ref={bubbleRef}
              id={bubbleId}
              data-side={floating.side}
              data-theme={getThemeScope(buttonEl)}
              className="or-floating or-toggletip"
              style={floating.floatingStyles}
              {...layerProps}
            >
              {content}
              <span
                ref={floating.arrowRef}
                className="or-floating-arrow"
                data-side={floating.side}
                style={floating.arrowStyle}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </Portal>
    </>
  )
})
