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
import { useExitingItems, useShake } from '../Combobox/motion'
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
  removeAt: (index: number, focus: 'neighbor' | 'input') => void
  setError: (error: string | null) => void
  message: string
  tagButtons: React.MutableRefObject<Map<string, HTMLButtonElement>>
  inputEl: React.MutableRefObject<HTMLInputElement | null>
  /** Chaves das tags presentes na montagem (não animam a entrada). */
  initialKeys: React.MutableRefObject<Set<string>>
  frameMotion: ReturnType<typeof useShake>
}

/** Chave estável por tag: texto + ocorrência (suporta `allowDuplicates`). */
function tagKeys(tags: string[]): string[] {
  const seen = new Map<string, number>()
  return tags.map((tag) => {
    const n = seen.get(tag) ?? 0
    seen.set(tag, n + 1)
    return `${tag}\u0000${n}`
  })
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
  initialKeys,
  frameMotion,
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
  const keys = tagKeys(tags)
  const { entries, leavingProps } = useExitingItems(
    tags.map((tag, index) => ({ tag, index, key: keys[index] })),
    (entry) => entry.key,
  )

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
      // Expõe o estado inativo do conjunto (tags + campo) — o contraste reduzido
      // dos itens desabilitados é isento pela WCAG 1.4.3.
      aria-disabled={isDisabled || undefined}
      data-disabled={isDisabled || undefined}
      {...frameMotion}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault()
          inputEl.current?.focus()
        }
      }}
    >
      {entries.length > 0 && (
        // role="list" explícito: o Safari remove a semântica de listas com list-style: none.
        <ul role="list" className="or-tag-input__tags">
          {entries.map(({ item, key, leaving }) =>
            leaving ? (
              <li key={key} className="or-tag-input__tag" {...leavingProps(key)}>
                <span className="or-tag-input__tag-label">{item.tag}</span>
                {interactive && (
                  <span className="or-tag-input__remove" aria-hidden="true">
                    <Icon name="close" size={12} strokeWidth={2} />
                  </span>
                )}
              </li>
            ) : (
              <li
                key={key}
                className="or-tag-input__tag"
                data-enter={!initialKeys.current.has(key) || undefined}
              >
                <span className="or-tag-input__tag-label">{item.tag}</span>
                {interactive && (
                  <button
                    ref={(el) => {
                      if (el) tagButtons.current.set(key, el)
                      else tagButtons.current.delete(key)
                    }}
                    type="button"
                    className="or-tag-input__remove"
                    aria-label={t('removeItem', { label: item.tag })}
                    onClick={() => removeAt(item.index, 'neighbor')}
                  >
                    <Icon name="close" size={12} strokeWidth={2} />
                  </button>
                )}
              </li>
            ),
          )}
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
  const tagButtons = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = useRef<string | null>(null)
  const initialKeys = useRef(new Set(tagKeys(tags)))
  const rejections = useRef(0)

  const announce = (msg: string) => setMessage((prev) => (prev === msg ? `${msg}\u00a0` : msg))

  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null
    const next = target === 'input' ? null : tagButtons.current.get(target)
    ;(next ?? inputEl.current)?.focus()
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
    if (firstError) rejections.current += 1
    setInternalError(firstError)
    const parts = [
      added.length ? t('itemAdded', { label: added.join(', ') }) : '',
      firstError ?? '',
    ].filter(Boolean)
    if (parts.length) announce(parts.join('. '))
    return rejected.length === 0
  }

  const removeAt = (index: number, focus: 'neighbor' | 'input') => {
    const removed = tags[index]
    if (removed === undefined) return
    const next = tags.filter((_, i) => i !== index)
    const nextKeys = tagKeys(next)
    pendingFocus.current =
      focus === 'neighbor' ? (nextKeys[index] ?? nextKeys[index - 1] ?? 'input') : 'input'
    initialKeys.current.delete(tagKeys(tags)[index])
    setTags(next)
    setInternalError(null)
    announce(t('itemRemoved', { label: removed }))
  }

  const shownError = error ?? internalError ?? undefined
  // Tremor curto quando um erro surge (cada recusa conta, mesmo com a mesma mensagem).
  const frameMotion = useShake(
    internalError
      ? `${internalError}#${rejections.current}`
      : typeof error === 'string'
        ? error
        : Boolean(error),
  )

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
        initialKeys={initialKeys}
        frameMotion={frameMotion}
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
