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
import { DialogShell } from './DialogShell'
import './Modal.css'

export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

/** Funções entregues ao conteúdo quando `children` é uma função. */
export interface ModalRenderProps {
  /** Fecha o diálogo (útil no modo não controlado, com `trigger`). */
  close: () => void
}

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Aberto (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o diálogo pede para abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /** Título visível; nomeia o diálogo via `aria-labelledby`. */
  title: ReactNode
  /** Texto de apoio sob o título; descreve o diálogo via `aria-describedby`. */
  description?: ReactNode
  /** Largura: `sm` 400px, `md` 560px, `lg` 800px, `full` tela inteira. */
  size?: ModalSize
  /**
   * Elemento que recebe o foco ao abrir. Padrão: primeiro elemento focável do
   * conteúdo (ou o que tiver `data-autofocus`).
   */
  initialFocus?: RefObject<HTMLElement | null>
  /** Elemento que recebe o foco ao fechar. Padrão: o que estava focado antes de abrir. */
  finalFocus?: RefObject<HTMLElement | null>
  /** Fecha ao clicar no fundo escurecido. */
  closeOnOverlayClick?: boolean
  /** Fecha com a tecla Escape. */
  closeOnEscape?: boolean
  /** Esconde o botão de fechar do cabeçalho. Garanta outra forma de fechar. */
  hideCloseButton?: boolean
  /**
   * Elemento que abre o diálogo (modo não controlado). Recebe `onClick` e
   * `aria-haspopup="dialog"`.
   */
  trigger?: ReactElement
  /** Conteúdo: use `ModalBody` e `ModalFooter`. Aceita uma função `({ close }) => …`. */
  children?: ReactNode | ((props: ModalRenderProps) => ReactNode)
}

/**
 * Diálogo modal: interrompe a tarefa atual para pedir uma decisão ou
 * informação. Prende o foco, bloqueia o scroll da página e fecha com Escape.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    defaultOpen,
    onOpenChange,
    title,
    description,
    size = 'md',
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
  const titleId = useId('or-modal-title')
  const descriptionId = useId('or-modal-description')

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
        rootClassName={cx('or-modal-root', size === 'full' && 'or-modal-root--full')}
        panelRef={ref}
        className={cx('or-modal', `or-modal--${size}`, className)}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        {...rest}
      >
        <div className="or-modal__header">
          <div className="or-modal__heading">
            <h2 id={titleId} className="or-modal__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="or-modal__description">
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
              className="or-modal__close"
              data-or-dialog-close=""
              onClick={disclosure.close}
            />
          )}
        </div>
        {typeof children === 'function' ? children({ close: disclosure.close }) : children}
      </DialogShell>
    </>
  )
})

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {}

/** Corpo do Modal. Rola internamente quando o conteúdo passa da altura disponível. */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('or-modal__body', className)} {...rest} />
})

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

/** Rodapé do Modal com as ações, alinhadas à direita (a principal por último). */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('or-modal__footer', className)} {...rest} />
})
