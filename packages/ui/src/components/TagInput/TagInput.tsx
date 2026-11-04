import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useControllableState } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { Field, useFieldControlProps } from '../Field'
import { VisuallyHidden } from '../VisuallyHidden'
import './TagInput.css'

export type TagInputSize = 'sm' | 'md' | 'lg'
export type TagInputSeparator = 'Enter' | ',' | 'Tab' | ';' | ' '

export interface TagInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size'
> {
  /** Tags (controlado). */
  value?: string[]
  /** Tags iniciais (não controlado). */
  defaultValue?: string[]
  /** Chamado quando uma tag é adicionada ou removida. */
  onChange?: (tags: string[]) => void
  /** Teclas que criam a tag. Padrão: `['Enter', ',']`. */
  separators?: TagInputSeparator[]
  /** Número máximo de tags. Mostra o contador ao lado do rótulo. */
  maxTags?: number
  /**
   * Valida cada tag antes de adicioná-la. Retorne uma mensagem de erro para
   * recusar, ou `true`/`undefined` para aceitar.
   */
  validate?: (tag: string, tags: string[]) => string | boolean | null | undefined
  /** Permite tags repetidas (comparação sem diferenciar maiúsculas). Padrão: `false`. */
  allowDuplicates?: boolean
  /** Adiciona o texto pendente como tag quando o campo perde o foco. Padrão: `false`. */
  addOnBlur?: boolean
  label?: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  /** Mensagem de erro externa (tem precedência sobre os erros de validação internos). */
  error?: ReactNode
  invalid?: boolean
  /** Altura mínima do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: TagInputSize
  /** Classe aplicada ao contêiner externo. */
  className?: string
}

type ControlProps = Omit<
  TagInputProps,
  | 'label'
  | 'hideLabel'
  | 'description'
  | 'error'
  | 'className'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'validate'
  | 'maxTags'
  | 'allowDuplicates'
> & {
  inputRef: React.Ref<HTMLInputElement>
  tags: string[]
  text: string
  setText: (text: string) => void
  tryAdd: (raw: string[]) => boolean
  removeAt: (index: number, focus: number | 'input') => void
  setError: (error: string | null) => void
  message: string
  tagButtons: React.MutableRefObject<(HTMLButtonElement | null)[]>
  inputEl: React.MutableRefObject<HTMLInputElement | null>
}

const PASTE_SPLIT = /[,;\n\r\t]+/

function TagInputControl({
  inputRef,
  tags,
  text,
  setText,
  tryAdd,
  removeAt,
  setError,
  message,
  tagButtons,
  inputEl,
  separators = ['Enter', ','],
  addOnBlur = false,
  invalid,
  size = 'md',
  required,
  disabled,
  readOnly,
  name,
  onKeyDown,
  onBlur,
  onPaste,
  placeholder,
  ...rest
}: ControlProps) {
  const { t } = useLocale()
  const controlProps = useFieldControlProps({
    required,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': rest['aria-describedby'],
  })
  const isDisabled = Boolean(controlProps.disabled)
  const interactive = !isDisabled && !readOnly

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !interactive) return
    const key = event.key as TagInputSeparator
    if (separators.includes(key) && !event.nativeEvent.isComposing) {
      // Sem texto, a tecla mantém o comportamento normal (Tab navega, Enter envia o formulário).
      if (!text.trim() || (key === 'Tab' && event.shiftKey)) {
        if (key === ',' || key === ';') event.preventDefault()
        return
      }
      event.preventDefault()
      tryAdd([text])
      return
    }
    if (event.key === 'Backspace' && !text && tags.length > 0) {
      event.preventDefault()
      removeAt(tags.length - 1, 'input')
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event)
    if (event.defaultPrevented || !interactive) return
    const pasted = event.clipboardData.getData('text')
    if (!PASTE_SPLIT.test(pasted)) return
    event.preventDefault()
    tryAdd(`${text}${pasted}`.split(PASTE_SPLIT))
  }

  return (
    // O mousedown só amplia a área de clique do input (que já é focável por teclado).
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx('or-control-frame', `or-control-frame--${size}`, 'or-tag-input')}
      data-invalid={controlProps['aria-invalid'] || undefined}
      data-disabled={isDisabled || undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault()
          inputEl.current?.focus()
        }
      }}
    >
      {tags.length > 0 && (
        // role="list" explícito: o Safari remove a semântica de listas com list-style: none.
         
        <ul role="list" className="or-tag-input__tags">
          {tags.map((tag, index) => (
            <li key={`${tag}-${index}`} className="or-tag-input__tag">
              <span className="or-tag-input__tag-label">{tag}</span>
              {interactive && (
                <button
                  ref={(el) => {
                    tagButtons.current[index] = el
                  }}
                  type="button"
                  className="or-tag-input__remove"
                  aria-label={t('removeItem', { label: tag })}
                  onClick={() => removeAt(index, tags.length > 1 ? index : 'input')}
                >
                  <Icon name="close" size={12} strokeWidth={2} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <input
        ref={mergeRefs(inputEl, inputRef)}
        type="text"
        className="or-control-frame__input or-tag-input__input"
        value={text}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete="off"
        enterKeyHint="enter"
        onChange={(event) => {
          const next = event.target.value
          setError(null)
          // Teclados virtuais nem sempre informam a tecla no keydown: trata o separador digitado aqui.
          const typed = separators.filter((s): s is ',' | ';' => s === ',' || s === ';')
          if (typed.some((sep) => next.endsWith(sep)) && next.length > text.length) {
            tryAdd(next.split(new RegExp(`[${typed.join('')}]`)))
            return
          }
          setText(next)
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={(event) => {
          onBlur?.(event)
          if (addOnBlur && interactive && text.trim()) tryAdd([text])
        }}
        {...rest}
        {...controlProps}
        required={controlProps.required && tags.length === 0}
      />
      {name &&
        tags.map((tag, index) => (
          <input
            key={`${tag}-${index}`}
            type="hidden"
            name={name}
            value={tag}
            disabled={isDisabled}
          />
        ))}
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
        {message}
      </VisuallyHidden>
    </div>
  )
}

/**
 * Campo para digitar várias palavras-chave: Enter (ou vírgula) cria uma tag,
 * Backspace com o campo vazio remove a última. Colar texto separado por
 * vírgulas cria várias tags de uma vez.
 */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    label,
    hideLabel,
    description,
    error,
    required,
    disabled,
    id,
    className,
    value,
    defaultValue = [],
    onChange,
    maxTags,
    validate,
    allowDuplicates = false,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const [tags, setTags] = useControllableState<string[]>({ value, defaultValue, onChange })
  const [text, setText] = useState('')
  const [internalError, setInternalError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const inputEl = useRef<HTMLInputElement | null>(null)
  const tagButtons = useRef<(HTMLButtonElement | null)[]>([])
  const pendingFocus = useRef<number | 'input' | null>(null)

  const announce = (msg: string) => setMessage((prev) => (prev === msg ? `${msg}\u00a0` : msg))

  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null
    if (target === 'input') inputEl.current?.focus()
    else (tagButtons.current[target] ?? tagButtons.current[target - 1] ?? inputEl.current)?.focus()
  }, [tags])

  /** Tenta adicionar uma ou mais tags; devolve `true` se todas foram aceitas. */
  const tryAdd = (raw: string[]): boolean => {
    const next = [...tags]
    const added: string[] = []
    const rejected: string[] = []
    let firstError: string | null = null
    for (const candidate of raw.map((r) => r.trim()).filter(Boolean)) {
      let problem: string | null = null
      if (maxTags !== undefined && next.length >= maxTags)
        problem = t('maxItemsReached', { max: maxTags })
      else if (
        !allowDuplicates &&
        next.some((tag) => tag.toLowerCase() === candidate.toLowerCase())
      )
        problem = t('duplicateItem', { label: candidate })
      else {
        const result = validate?.(candidate, next)
        if (typeof result === 'string' && result) problem = result
        else if (result === false) problem = t('error')
      }
      if (problem) {
        firstError ??= problem
        rejected.push(candidate)
      } else {
        next.push(candidate)
        added.push(candidate)
      }
    }
    if (added.length) setTags(next)
    // Mantém no campo o que foi recusado, para o usuário corrigir.
    setText(rejected.join(', '))
    setInternalError(firstError)
    const parts = [
      added.length ? t('itemAdded', { label: added.join(', ') }) : '',
      firstError ?? '',
    ].filter(Boolean)
    if (parts.length) announce(parts.join('. '))
    return rejected.length === 0
  }

  const removeAt = (index: number, focus: number | 'input') => {
    const removed = tags[index]
    if (removed === undefined) return
    pendingFocus.current = focus
    setTags(tags.filter((_, i) => i !== index))
    setInternalError(null)
    announce(t('itemRemoved', { label: removed }))
  }

  const shownError = error ?? internalError ?? undefined

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={shownError}
      required={required}
      disabled={disabled}
      controlId={id}
      className={cx('or-tag-input-field', className)}
      labelAside={
        maxTags !== undefined ? (
          <span className="or-tag-input__count">
            {tags.length}/{maxTags}
          </span>
        ) : undefined
      }
    >
      <TagInputControl
        inputRef={ref}
        inputEl={inputEl}
        tagButtons={tagButtons}
        tags={tags}
        text={text}
        setText={setText}
        tryAdd={tryAdd}
        removeAt={removeAt}
        setError={setInternalError}
        message={message}
        required={required}
        disabled={disabled}
        {...rest}
      />
    </Field>
  )
})
