import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useDisclosure, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx } from '../../utils'
import { Button } from '../Button'
import { DialogShell } from '../Modal/DialogShell'
import './ConfirmDialog.css'

export type ConfirmDialogTone = 'neutral' | 'danger'

export interface ConfirmDialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Aberto (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o diálogo pede para abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /** Pergunta direta: "Excluir projeto?". Nomeia o diálogo. */
  title: ReactNode
  /** Consequência da ação. Descreve o diálogo via `aria-describedby`. */
  description?: ReactNode
  /** Conteúdo extra entre a descrição e as ações (ex.: lista de itens afetados). */
  children?: ReactNode
  /** Rótulo do botão de confirmação. Padrão: "Confirmar". Prefira o verbo da ação. */
  confirmLabel?: string
  /** Rótulo do botão de cancelar. Padrão: "Cancelar". */
  cancelLabel?: string
  /**
   * `danger` para ações destrutivas: botão vermelho e foco inicial em Cancelar.
   * `neutral` foca o botão de confirmação.
   */
  tone?: ConfirmDialogTone
  /**
   * Executa a ação. Se retornar uma Promise, o botão fica em loading até ela
   * resolver; se ela rejeitar, o diálogo continua aberto.
   */
  onConfirm?: () => void | Promise<unknown>
  /** Chamado ao cancelar (botão, Escape). */
  onCancel?: () => void
  /** Texto anunciado enquanto `onConfirm` está pendente. */
  loadingText?: string
  /** Elemento que abre o diálogo (modo não controlado). */
  trigger?: ReactElement
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return !!value && typeof (value as PromiseLike<unknown>).then === 'function'
}

/**
 * Diálogo de alerta (`role="alertdialog"`) que pede confirmação antes de uma
 * ação importante ou irreversível.
 */
export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(function ConfirmDialog(
  {
    open,
    defaultOpen,
    onOpenChange,
    title,
    description,
    children,
    confirmLabel,
    cancelLabel,
    tone = 'neutral',
    onConfirm,
    onCancel,
    loadingText,
    trigger,
    className,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const disclosure = useDisclosure({ open, defaultOpen, onOpenChange })
  const [pending, setPending] = useState(false)
  const titleId = useId('or-confirm-title')
  const descriptionId = useId('or-confirm-description')
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const cancel = () => {
    if (pending) return
    onCancel?.()
    disclosure.close()
  }

  const confirm = async () => {
    if (pending) return
    const result = onConfirm?.()
    if (!isPromiseLike(result)) {
      disclosure.close()
      return
    }
    setPending(true)
    try {
      await result
      if (!mountedRef.current) return
      setPending(false)
      disclosure.close()
    } catch {
      if (mountedRef.current) setPending(false)
    }
  }

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
        onDismiss={cancel}
        role="alertdialog"
        initialFocus={tone === 'danger' ? cancelRef : confirmRef}
        closeOnEscape={!pending}
        closeOnOverlayClick={false}
        rootClassName="or-confirm-dialog-root"
        panelRef={ref}
        className={cx('or-confirm-dialog', `or-confirm-dialog--${tone}`, className)}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={pending || undefined}
        {...rest}
      >
        <div className="or-confirm-dialog__content">
          {tone === 'danger' && (
            <span className="or-confirm-dialog__icon" aria-hidden="true">
              <Icon name="alert-triangle" size="md" />
            </span>
          )}
          <div className="or-confirm-dialog__text">
            <h2 id={titleId} className="or-confirm-dialog__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="or-confirm-dialog__description">
                {description}
              </p>
            )}
            {children && <div className="or-confirm-dialog__extra">{children}</div>}
          </div>
        </div>
        <div className="or-confirm-dialog__actions">
          <Button ref={cancelRef} variant="outline" disabled={pending} onClick={cancel}>
            {cancelLabel ?? t('cancel')}
          </Button>
          <Button
            ref={confirmRef}
            variant={tone === 'danger' ? 'danger' : 'primary'}
            loading={pending}
            loadingText={loadingText}
            onClick={confirm}
          >
            {confirmLabel ?? t('confirm')}
          </Button>
        </div>
      </DialogShell>
    </>
  )
})

/** Opções aceitas por `confirm()` do hook `useConfirm`. */
export type ConfirmOptions = Pick<
  ConfirmDialogProps,
  'title' | 'description' | 'children' | 'confirmLabel' | 'cancelLabel' | 'tone' | 'onConfirm' | 'loadingText'
>

/**
 * Confirmação imperativa: `const [confirm, confirmDialog] = useConfirm()`.
 * Renderize `confirmDialog` uma vez e use `await confirm({ … })`, que resolve
 * `true` (confirmou) ou `false` (cancelou).
 */
export function useConfirm(): [(options: ConfirmOptions) => Promise<boolean>, ReactElement] {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({ title: '' })
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const settle = (value: boolean) => {
    resolveRef.current?.(value)
    resolveRef.current = null
  }

  const confirm = useCallback((next: ConfirmOptions) => {
    resolveRef.current?.(false)
    setOptions(next)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  // Diálogo desmontado com uma confirmação pendente: resolve como cancelada.
  useEffect(() => () => resolveRef.current?.(false), [])

  const element = (
    <ConfirmDialog
      {...options}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) settle(false)
      }}
      onConfirm={() => {
        const result = options.onConfirm?.()
        if (isPromiseLike(result)) return Promise.resolve(result).then(() => settle(true))
        settle(true)
      }}
    />
  )

  return [confirm, element]
}
