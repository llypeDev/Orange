import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { Button } from '../Button'
import { VisuallyHidden } from '../VisuallyHidden'
import '../Field/Field.css'
import './InlineEdit.css'

export type InlineEditSize = 'sm' | 'md' | 'lg'

export interface InlineEditProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Nome do campo, usado nos nomes acessíveis ("Editar <label>: <valor>"). */
  label: string
  /** Mostra o rótulo acima do valor (estilo eyebrow). */
  showLabel?: boolean
  /** Valor salvo (controlado). */
  value?: string
  /** Valor inicial (não controlado). */
  defaultValue?: string
  /**
   * Chamado ao salvar (Enter, sair do campo ou botão Salvar) com o novo
   * valor. Pode retornar uma Promise: o campo mostra o carregamento e, se ela
   * for rejeitada, continua em edição exibindo o erro.
   */
  onSave?: (value: string) => void | Promise<void>
  /** Chamado quando a edição é cancelada (Escape ou botão Cancelar). */
  onCancel?: () => void
  /** Retorna uma mensagem de erro para impedir o salvamento. */
  validate?: (value: string) => string | null | undefined
  /** Texto exibido quando não há valor ("Adicionar descrição"). */
  placeholder?: string
  /** Mostra botões Salvar/Cancelar durante a edição. */
  showButtons?: boolean
  /** Salva ao tirar o foco do campo. Padrão: `true`. */
  saveOnBlur?: boolean
  disabled?: boolean
  /** Altura: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: InlineEditSize
  /** Atributos extras do `<input>` (maxLength, type, inputMode…). */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'>
}

type SaveSource = 'enter' | 'blur' | 'button'

/**
 * Edição no lugar: o valor aparece como texto clicável e vira um campo ao
 * ser ativado. Enter ou sair do campo salva, Escape cancela.
 */
export const InlineEdit = forwardRef<HTMLDivElement, InlineEditProps>(function InlineEdit(
  {
    label,
    showLabel = false,
    value: valueProp,
    defaultValue = '',
    onSave,
    onCancel,
    validate,
    placeholder,
    showButtons = false,
    saveOnBlur = true,
    disabled = false,
    size = 'md',
    inputProps,
    className,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const baseId = useId('or-inline-edit')
  const inputId = `${baseId}-input`
  const labelId = `${baseId}-label`
  const errorId = `${baseId}-error`

  const [value, setValue] = useControllableState({ value: valueProp, defaultValue })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  // Motion: só anima a troca leitura ↔ edição depois da primeira interação
  // (nada se move no carregamento da página).
  const [interacted, setInteracted] = useState(false)
  // Flash de sucesso no valor recém-salvo.
  const [flash, setFlash] = useState(false)
  // Cada tentativa de salvar com erro faz o campo tremer de novo.
  const [errorCount, setErrorCount] = useState(0)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const displayRef = useRef<HTMLButtonElement>(null)
  const focusDisplayRef = useRef(false)
  const savingRef = useRef(false)
  const editingRef = useRef(false)
  editingRef.current = editing
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    } else if (focusDisplayRef.current) {
      focusDisplayRef.current = false
      displayRef.current?.focus()
    }
  }, [editing])

  const startEditing = () => {
    if (disabled) return
    setDraft(value)
    setError(null)
    setErrorCount(0)
    setFlash(false)
    setInteracted(true)
    setEditing(true)
  }

  const finish = (source: SaveSource) => {
    editingRef.current = false
    focusDisplayRef.current = source !== 'blur'
    setEditing(false)
    setError(null)
  }

  const cancel = () => {
    if (savingRef.current) return
    setDraft(value)
    editingRef.current = false
    focusDisplayRef.current = true
    setFlash(false)
    setEditing(false)
    setError(null)
    onCancel?.()
  }

  const save = async (source: SaveSource) => {
    if (savingRef.current) return
    const next = draft
    const validationError = validate?.(next)
    if (validationError) {
      setError(validationError)
      setErrorCount((count) => count + 1)
      if (source !== 'blur') inputRef.current?.focus()
      return
    }
    if (next === value) {
      finish(source)
      return
    }
    try {
      const result = onSave?.(next)
      if (result && typeof (result as Promise<void>).then === 'function') {
        savingRef.current = true
        setSaving(true)
        await result
      }
      if (!mountedRef.current) return
      setValue(next)
      setFlash(true)
      finish(source)
    } catch (reason) {
      if (!mountedRef.current) return
      setError(reason instanceof Error && reason.message ? reason.message : t('saveFailed'))
      setErrorCount((count) => count + 1)
      if (source !== 'blur') requestAnimationFrame(() => inputRef.current?.focus())
    } finally {
      savingRef.current = false
      if (mountedRef.current) setSaving(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    inputProps?.onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'Enter') {
      event.preventDefault()
      void save('enter')
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      cancel()
    }
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    inputProps?.onBlur?.(event)
    // Foco indo para os botões Salvar/Cancelar do próprio componente: não salva.
    if (rootRef.current?.contains(event.relatedTarget as Node | null)) return
    if (saveOnBlur && editingRef.current) void save('blur')
  }

  const shown = value || placeholder || ''
  const accessibleName = t('editValue', { label, value: value || placeholder || t('emptyValue') })

  return (
    <div
      ref={mergeRefs(rootRef, ref)}
      className={cx(
        'or-inline-edit',
        `or-inline-edit--${size}`,
        interacted && 'or-inline-edit--animated',
        className,
      )}
      data-state={editing ? 'editing' : 'display'}
      data-disabled={disabled || undefined}
      {...rest}
    >
      {showLabel &&
        (editing ? (
          <label id={labelId} htmlFor={inputId} className="or-eyebrow or-inline-edit__label">
            {label}
          </label>
        ) : (
          <span className="or-eyebrow or-inline-edit__label" aria-hidden="true">
            {label}
          </span>
        ))}

      {editing ? (
        <div className="or-inline-edit__editor">
          <div
            className={cx('or-control-frame', `or-control-frame--${size}`, 'or-inline-edit__frame')}
            data-invalid={error ? true : undefined}
            // Alterna entre duas animações idênticas para repetir o tremor.
            data-shake={errorCount > 0 ? (errorCount % 2 ? 'a' : 'b') : undefined}
          >
            <input
              {...inputProps}
              ref={inputRef}
              id={inputId}
              type={inputProps?.type ?? 'text'}
              className={cx(
                'or-control-frame__input',
                'or-inline-edit__input',
                inputProps?.className,
              )}
              value={draft}
              placeholder={inputProps?.placeholder ?? placeholder}
              aria-label={showLabel ? undefined : label}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              aria-busy={saving || undefined}
              readOnly={saving}
              onChange={(event) => {
                setDraft(event.target.value)
                if (error) setError(validate?.(event.target.value) || null)
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />
            {saving && !showButtons && (
              <span className="or-inline-edit__spinner" aria-hidden="true" />
            )}
          </div>
          {showButtons && (
            <div className="or-inline-edit__actions">
              <Button
                size={size}
                iconOnly
                aria-label={t('save')}
                startIcon={<Icon name="check" />}
                loading={saving}
                loadingText={t('saving')}
                onClick={() => void save('button')}
              />
              <Button
                size={size}
                variant="outline"
                iconOnly
                aria-label={t('cancel')}
                startIcon={<Icon name="close" />}
                disabled={saving}
                onClick={cancel}
              />
            </div>
          )}
        </div>
      ) : (
        <button
          ref={displayRef}
          type="button"
          className={cx('or-inline-edit__display', flash && 'or-inline-edit__display--saved')}
          aria-label={accessibleName}
          disabled={disabled}
          onClick={startEditing}
        >
          <span className="or-inline-edit__value" data-empty={!value || undefined}>
            {shown}
          </span>
          <Icon name="edit" size="sm" className="or-inline-edit__icon" />
        </button>
      )}

      {editing && error && (
        <p id={errorId} className="or-field__error or-inline-edit__error">
          <Icon name="alert-circle" size="sm" />
          <span>{error}</span>
        </p>
      )}
      {!showButtons && (
        <VisuallyHidden role="status" aria-live="polite">
          {saving ? t('saving') : ''}
        </VisuallyHidden>
      )}
    </div>
  )
})
