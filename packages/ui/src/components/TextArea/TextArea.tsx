import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react'
import { useId, useIsomorphicLayoutEffect } from '../../hooks'
import { cx, devWarning, mergeRefs } from '../../utils'
import { Field, useFieldControlProps } from '../Field'
import { CharacterCount } from '../TextField/CharacterCount'
import type { TextFieldBaseProps } from '../TextField/TextField'
import './TextArea.css'

export interface TextAreaProps extends TextFieldBaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Número de linhas visíveis (altura mínima com `autoResize`). Padrão: 3. */
  rows?: number
  /** Cresce automaticamente conforme o conteúdo, sem barra de rolagem. */
  autoResize?: boolean
  /** Com `autoResize`, limita o crescimento a este número de linhas (depois rola). */
  maxRows?: number
  /** Mostra o contador "x de y caracteres". Requer `maxLength`. */
  showCount?: boolean
}

interface TextAreaControlProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size: NonNullable<TextAreaProps['size']>
  invalid?: boolean
  autoResize: boolean
  maxRows?: number
  describedBy?: string
}

const TextAreaControl = forwardRef<HTMLTextAreaElement, TextAreaControlProps>(function TextAreaControl(
  { size, invalid, autoResize, maxRows, describedBy, className, onChange, 'aria-describedby': ariaDescribedBy, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement>(null)
  const mergedRef = useMemo(() => mergeRefs(ref, innerRef), [ref])
  const controlProps = useFieldControlProps({
    'aria-describedby': [ariaDescribedBy, describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': invalid ? true : undefined,
  })

  const resize = useCallback(() => {
    const el = innerRef.current
    if (!el) return
    if (!autoResize) {
      el.style.removeProperty('height')
      el.style.removeProperty('overflow-y')
      return
    }
    const styles = window.getComputedStyle(el)
    const borders = (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0)
    el.style.height = 'auto'
    if (el.scrollHeight === 0) {
      // Elemento oculto (display: none) — mede de novo quando aparecer.
      el.style.removeProperty('height')
      return
    }
    let next = el.scrollHeight + borders
    if (maxRows) {
      const lineHeight = parseFloat(styles.lineHeight) || (parseFloat(styles.fontSize) || 15) * 1.55
      const padding = (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0)
      const max = lineHeight * maxRows + padding + borders
      el.style.overflowY = next > max ? 'auto' : 'hidden'
      next = Math.min(next, max)
    } else {
      el.style.overflowY = 'hidden'
    }
    el.style.height = `${next}px`
  }, [autoResize, maxRows])

  // Recalcula quando o valor (controlado) ou as opções mudam.
  useIsomorphicLayoutEffect(() => {
    resize()
  }, [resize, rest.value])

  // Recalcula quando a largura muda (quebra de linha diferente) ou o campo aparece.
  useEffect(() => {
    const el = innerRef.current
    if (!autoResize || !el || typeof ResizeObserver === 'undefined') return
    let lastWidth = el.offsetWidth
    const observer = new ResizeObserver(() => {
      const width = el.offsetWidth
      if (width === lastWidth) return
      lastWidth = width
      resize()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [autoResize, resize])

  return (
    <textarea
      ref={mergedRef}
      className={cx(
        'or-control',
        `or-control--${size}`,
        'or-text-area__control',
        autoResize && 'or-text-area__control--auto',
        className,
      )}
      onChange={(event) => {
        onChange?.(event)
        resize()
      }}
      {...controlProps}
      {...rest}
    />
  )
})

/**
 * Campo de texto multilinha para comentários, descrições e mensagens. Pode
 * crescer com o conteúdo (`autoResize`) e mostrar contador de caracteres.
 * A `ref` e as props nativas vão para o `<textarea>`.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
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
    rows = 3,
    autoResize = false,
    maxRows,
    showCount = false,
    maxLength,
    value,
    defaultValue,
    onChange,
    onValueChange,
    ...rest
  },
  ref,
) {
  const countId = useId('or-text-area-count')
  const [uncontrolledLength, setUncontrolledLength] = useState(() => String(defaultValue ?? '').length)
  const length = value !== undefined ? String(value ?? '').length : uncontrolledLength
  const withCount = showCount && typeof maxLength === 'number'
  devWarning(showCount && maxLength === undefined, 'TextArea com `showCount` precisa de `maxLength`.')

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUncontrolledLength(event.target.value.length)
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
      controlId={id}
      labelAside={labelAside}
      className={cx('or-text-area', className)}
      style={style}
    >
      <TextAreaControl
        ref={ref}
        size={size}
        invalid={invalid}
        rows={rows}
        autoResize={autoResize}
        maxRows={maxRows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        describedBy={withCount ? countId : undefined}
        {...rest}
      />
      {withCount && <CharacterCount id={countId} count={length} max={maxLength} />}
    </Field>
  )
})
