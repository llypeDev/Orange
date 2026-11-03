import {
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react'
import { useDisclosure, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx } from '../../utils'
import { Button } from '../Button'
import { DialogShell } from '../Modal/DialogShell'
import './Drawer.css'

export type DrawerPlacement = 'left' | 'right' | 'bottom'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full'

/** Funções entregues ao conteúdo/rodapé quando eles são funções. */
export interface DrawerRenderProps {
  /** Fecha o painel (útil no modo não controlado, com `trigger`). */
  close: () => void
}

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Aberto (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o painel pede para abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /** Título visível; nomeia o painel via `aria-labelledby`. */
  title: ReactNode
  /** Texto de apoio sob o título (`aria-describedby`). */
  description?: ReactNode
  /** Borda de onde o painel desliza. */
  placement?: DrawerPlacement
  /**
   * Largura (left/right): `sm` 360px, `md` 480px, `lg` 640px, `full` 100%.
   * Altura máxima (bottom): `sm` 40%, `md` 60%, `lg` 85%, `full` 100%.
   */
  size?: DrawerSize
  /** Rodapé fixo com ações. Aceita uma função `({ close }) => …`. */
  footer?: ReactNode | ((props: DrawerRenderProps) => ReactNode)
  /** Elemento que recebe o foco ao abrir. Padrão: primeiro focável do conteúdo. */
  initialFocus?: RefObject<HTMLElement | null>
  /** Elemento que recebe o foco ao fechar. Padrão: o que estava focado antes. */
  finalFocus?: RefObject<HTMLElement | null>
  /** Fecha ao clicar no fundo escurecido. */
  closeOnOverlayClick?: boolean
  /** Fecha com a tecla Escape. */
  closeOnEscape?: boolean
  /** Esconde o botão de fechar do cabeçalho. Garanta outra forma de fechar. */
  hideCloseButton?: boolean
  /** Elemento que abre o painel (modo não controlado). */
  trigger?: ReactElement
  /** Conteúdo rolável do painel. Aceita uma função `({ close }) => …`. */
  children?: ReactNode | ((props: DrawerRenderProps) => ReactNode)
}

/**
 * Painel modal que desliza de uma borda da tela. Bom para formulários,
 * filtros e detalhes que não exigem sair do contexto atual.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open,
    defaultOpen,
    onOpenChange,
    title,
    description,
    placement = 'right',
    size = 'md',
    footer,
    initialFocus,
    finalFocus,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    hideCloseButton = false,
    trigger,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const disclosure = useDisclosure({ open, defaultOpen, onOpenChange })
  const titleId = useId('or-drawer-title')
  const descriptionId = useId('or-drawer-description')
  const api: DrawerRenderProps = { close: disclosure.close }

  const triggerElement = trigger
    ? cloneElement(trigger as ReactElement<HTMLAttributes<HTMLElement>>, {
        'aria-haspopup': 'dialog',
        onClick: composeEventHandlers(
          (trigger.props as HTMLAttributes<HTMLElement>).onClick,
          (_event: ReactMouseEvent<HTMLElement>) => disclosure.open(),
        ),
      })
    : null

  return (
    <>
      {triggerElement}
      <DialogShell
        open={disclosure.isOpen}
        onDismiss={disclosure.close}
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        closeOnEscape={closeOnEscape}
        closeOnOverlayClick={closeOnOverlayClick}
        rootClassName={cx('or-drawer-root', `or-drawer-root--${placement}`)}
        panelRef={ref}
        className={cx('or-drawer', `or-drawer--${placement}`, `or-drawer--${size}`, className)}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        {...rest}
      >
        <div className="or-drawer__header">
          <div className="or-drawer__heading">
            <h2 id={titleId} className="or-drawer__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="or-drawer__description">
                {description}
              </p>
            )}
          </div>
          {!hideCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={t('close')}
              startIcon={<Icon name="close" />}
              className="or-drawer__close"
              data-or-dialog-close=""
              onClick={disclosure.close}
            />
          )}
        </div>
        <div className="or-drawer__body">
          {typeof children === 'function' ? children(api) : children}
        </div>
        {footer && (
          <div className="or-drawer__footer">
            {typeof footer === 'function' ? footer(api) : footer}
          </div>
        )}
      </DialogShell>
    </>
  )
})
