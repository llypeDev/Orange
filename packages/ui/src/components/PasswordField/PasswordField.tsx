import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useControllableState, useDebouncedValue, useId, useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { Field } from '../Field'
import { InputControl } from '../TextField/InputControl'
import type { TextFieldBaseProps } from '../TextField/TextField'
import { VisuallyHidden } from '../VisuallyHidden'
import './PasswordField.css'

export interface PasswordRequirement {
  /** Texto do requisito, ex.: "Pelo menos 8 caracteres". */
  label: ReactNode
  /** Se o valor atual atende ao requisito. */
  met: boolean
}

export interface PasswordFieldProps
  extends TextFieldBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'> {
  /** Ícone decorativo no início do campo (ex.: cadeado). */
  startIcon?: ReactNode
  /** Lista de requisitos exibida abaixo do campo, com estado atendido/não atendido. */
  requirements?: PasswordRequirement[]
  /** Título da lista de requisitos. Padrão: "Requisitos da senha". */
  requirementsLabel?: ReactNode
  /** Senha visível (controlado). */
  visible?: boolean
  /** Senha visível inicialmente (não controlado). Padrão: `false`. */
  defaultVisible?: boolean
  /** Chamado quando a visibilidade muda. */
  onVisibleChange?: (visible: boolean) => void
}

function PasswordRequirements({
  id,
  title,
  requirements,
}: {
  id: string
  title: ReactNode
  requirements: PasswordRequirement[]
}) {
  const { t } = useLocale()
  const met = requirements.filter((r) => r.met).length
  const total = requirements.length
  const [initial] = useState(met)
  const dirty = useRef(false)
  if (met !== initial) dirty.current = true
  const settled = useDebouncedValue(met, 700)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (!dirty.current) return
    setAnnouncement(t('requirementsProgress', { count: settled, total }))
  }, [settled, total, t])

  return (
    <div className="or-password-field__requirements">
      <div id={id}>
        <p className="or-password-field__requirements-title">{title}</p>
        <ul className="or-password-field__requirements-list">
          {requirements.map((requirement, index) => (
            <li
              key={index}
              className="or-password-field__requirement"
              data-met={requirement.met || undefined}
            >
              <Icon
                name={requirement.met ? 'check' : 'square'}
                size="sm"
                strokeWidth={requirement.met ? 2.5 : 1.75}
                className="or-password-field__requirement-icon"
              />
              <span>
                {requirement.label}
                <VisuallyHidden> ({requirement.met ? t('requirementMet') : t('requirementNotMet')})</VisuallyHidden>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {announcement}
      </VisuallyHidden>
    </div>
  )
}

/**
 * Campo de senha com botão para mostrar/ocultar o valor e lista opcional de
 * requisitos. O botão usa `aria-pressed` e, quando clicado com o mouse ou
 * toque, mantém o foco e o cursor no campo.
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  {
    label,
    hideLabel,
    description,
    error,
    invalid,
    required,
    optional,
    labelAside,
    disabled,
    id,
    className,
    style,
    size = 'md',
    startIcon,
    requirements,
    requirementsLabel,
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    onChange,
    onValueChange,
    autoComplete,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const inputId = useId('or-password', id)
  const requirementsId = useId('or-password-requirements')
  const innerRef = useRef<HTMLInputElement>(null)
  const mergedRef = useMemo(() => mergeRefs(ref, innerRef), [ref])
  const [visible, setVisible] = useControllableState({
    value: visibleProp,
    defaultValue: defaultVisible,
    onChange: onVisibleChange,
  })
  const pendingSelection = useRef<{ start: number | null; end: number | null } | null>(null)
  const hasRequirements = Boolean(requirements && requirements.length > 0)

  // Trocar o `type` pode reposicionar o cursor: restaura a seleção anterior.
  useIsomorphicLayoutEffect(() => {
    const selection = pendingSelection.current
    const input = innerRef.current
    if (!selection || !input) return
    pendingSelection.current = null
    if (selection.start === null || selection.end === null) return
    try {
      input.setSelectionRange(selection.start, selection.end)
    } catch {
      /* alguns tipos não suportam seleção */
    }
  }, [visible])

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const input = innerRef.current
    // `detail > 0` → clique de ponteiro: o foco continua (ou vai) para o campo.
    // Pelo teclado, o foco permanece no botão para permitir alternar de novo.
    if (input && event.detail > 0) {
      const hadFocus = document.activeElement === input
      const end = input.value.length
      pendingSelection.current = {
        start: hadFocus ? input.selectionStart : end,
        end: hadFocus ? input.selectionEnd : end,
      }
      if (!hadFocus) input.focus({ preventScroll: true })
    }
    setVisible(!visible)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      optional={optional}
      disabled={disabled}
      controlId={inputId}
      labelAside={labelAside}
      className={cx('or-password-field', className)}
      style={style}
    >
      <InputControl
        ref={mergedRef}
        type={visible ? 'text' : 'password'}
        size={size}
        invalid={invalid}
        startIcon={startIcon}
        autoComplete={autoComplete ?? (hasRequirements ? 'new-password' : 'current-password')}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        onChange={handleChange}
        describedBy={hasRequirements ? requirementsId : undefined}
        trailing={
          <button
            type="button"
            className="or-control-frame__button or-password-field__toggle"
            aria-label={t('showPassword')}
            aria-pressed={visible}
            aria-controls={inputId}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleToggle}
          >
            <Icon name={visible ? 'eye-off' : 'eye'} />
          </button>
        }
        after={
          hasRequirements ? (
            <PasswordRequirements
              id={requirementsId}
              title={requirementsLabel ?? t('passwordRequirements')}
              requirements={requirements!}
            />
          ) : null
        }
        {...rest}
      />
    </Field>
  )
})
