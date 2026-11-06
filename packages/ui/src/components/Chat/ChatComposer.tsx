import {
  forwardRef,
  useMemo,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type FormHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { IconButton } from '../IconButton'
import { TextArea } from '../TextArea'
import { CharacterCount } from '../TextField/CharacterCount'
import { VisuallyHidden } from '../VisuallyHidden'
import './ChatComposer.css'

export interface ChatComposerProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange' | 'onSubmit' | 'children'
> {
  /** Rótulo do campo (obrigatório — fica oculto por padrão, mas é lido por leitores de tela). */
  label: ReactNode
  /** Oculta o rótulo visualmente. Padrão: `true`. */
  hideLabel?: boolean
  /** Texto do campo (controlado). */
  value?: string
  /** Texto inicial (não controlado). */
  defaultValue?: string
  /** Chamado com o novo texto a cada alteração. */
  onChange?: (value: string) => void
  /**
   * Chamado ao enviar (Enter ou botão), com o texto sem espaços nas pontas.
   * Não é chamado com o campo vazio, `disabled` ou `loading`. No modo não
   * controlado o campo é limpo em seguida; no controlado, limpe o `value`.
   */
  onSubmit?: (value: string) => void
  /** Resposta em andamento: o botão de enviar vira "Parar" e Enter não envia. */
  loading?: boolean
  /** Chamado pelo botão "Parar" (durante `loading`). */
  onStop?: () => void
  /** Ações à esquerda do botão de enviar (ex.: anexar arquivo). */
  actions?: ReactNode
  /** Mostra o contador "x de y caracteres". Requer `maxLength`. */
  showCount?: boolean
  /** Linhas visíveis iniciais. Padrão: `1`. */
  rows?: number
  /** O campo cresce com o texto até este número de linhas (depois rola). Padrão: `6`. */
  maxRows?: number
  /** Atributos extras do `<form>`. */
  formProps?: Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
  /** Classe aplicada ao `<form>`. */
  className?: string
}

/**
 * Campo de mensagem de uma conversa: `TextArea` que cresce com o texto e botão
 * de enviar. Enter envia e Shift + Enter quebra a linha (respeitando a
 * composição de IME). Durante `loading` o botão vira "Parar". A `ref` e as props
 * nativas vão para o `<textarea>`; `className` e `formProps`, para o `<form>`.
 */
export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(
  function ChatComposer(
    {
      label,
      hideLabel = true,
      value,
      defaultValue = '',
      onChange,
      onSubmit,
      loading = false,
      onStop,
      actions,
      showCount = false,
      maxLength,
      rows = 1,
      maxRows = 6,
      disabled,
      id,
      formProps,
      className,
      onKeyDown,
      onCompositionStart,
      onCompositionEnd,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) {
    const { t } = useLocale()
    const inputId = useId('or-chat-composer', id)
    const hintId = useId('or-chat-composer-hint')
    const countId = useId('or-chat-composer-count')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const mergedRef = useMemo(() => mergeRefs(ref, textareaRef), [ref])
    const composing = useRef(false)
    const [text, setText] = useControllableState({ value, defaultValue, onChange })
    const controlled = value !== undefined
    const empty = text.trim() === ''
    const withCount = showCount && typeof maxLength === 'number'

    const submit = () => {
      if (disabled || loading || empty) return false
      onSubmit?.(text.trim())
      if (!controlled) setText('')
      return true
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      // Enviou pelo botão: o foco volta ao campo para a próxima mensagem.
      if (submit()) textareaRef.current?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || event.key !== 'Enter' || event.shiftKey) return
      // IME (japonês, chinês, coreano…): o Enter confirma a composição, não envia.
      // keyCode 229 cobre o Safari, que dispara o keydown depois do compositionend.
      if (composing.current || event.nativeEvent.isComposing || event.keyCode === 229) return
      event.preventDefault()
      submit()
    }

    const stopUnavailable = loading && !onStop

    return (
      <form
        {...formProps}
        noValidate
        className={cx('or-chat-composer', className)}
        onSubmit={handleSubmit}
      >
        <label
          htmlFor={inputId}
          className={cx('or-chat-composer__label', hideLabel && 'or-visually-hidden')}
        >
          {label}
        </label>
        <div className="or-chat-composer__frame" data-disabled={disabled || undefined}>
          <TextArea
            ref={mergedRef}
            id={inputId}
            className="or-chat-composer__field"
            rows={rows}
            autoResize
            maxRows={maxRows}
            maxLength={maxLength}
            value={text}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={(event) => {
              composing.current = true
              onCompositionStart?.(event)
            }}
            onCompositionEnd={(event) => {
              composing.current = false
              onCompositionEnd?.(event)
            }}
            disabled={disabled}
            aria-describedby={cx(hintId, withCount && countId, ariaDescribedBy)}
            {...rest}
          />
          <div className="or-chat-composer__toolbar">
            <div className="or-chat-composer__actions">{actions}</div>
            {withCount && <CharacterCount id={countId} count={text.length} max={maxLength!} />}
            {/* Um único botão (o mesmo nó): trocar enviar ↔ parar não tira o foco de quem está nele. */}
            <IconButton
              type={loading ? 'button' : 'submit'}
              icon={loading ? 'square' : 'send'}
              label={loading ? t('chatStop') : t('chatSend')}
              variant={loading ? 'outline' : 'primary'}
              size="sm"
              className="or-chat-composer__send"
              disabled={disabled}
              // Vazio (ou sem onStop): continua focável e encontrável, mas não age.
              aria-disabled={(loading ? stopUnavailable : empty) || undefined}
              onClick={
                loading
                  ? (event) => {
                      event.preventDefault()
                      if (!stopUnavailable) onStop?.()
                    }
                  : undefined
              }
            />
          </div>
        </div>
        <VisuallyHidden id={hintId}>{t('chatComposerHint')}</VisuallyHidden>
      </form>
    )
  },
)
