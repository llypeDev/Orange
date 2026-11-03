import { forwardRef, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, range } from '../../utils'
import '../Field/Field.css'
import './Rating.css'

export type RatingSize = 'sm' | 'md' | 'lg'

export interface RatingProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Nota selecionada (controlado). `null` ou `0` = sem nota. */
  value?: number | null
  /** Nota inicial (não controlado). */
  defaultValue?: number | null
  /** Chamado com a nova nota (1 a `max`). */
  onChange?: (value: number) => void
  /** Quantidade de estrelas. Padrão: 5. */
  max?: number
  /**
   * Somente leitura: exibe as estrelas como imagem (`role="img"`) com a nota
   * por extenso. Aceita frações (ex.: 4.5).
   */
  readOnly?: boolean
  /** Rótulo do grupo ("Avalie o atendimento"). */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. */
  error?: ReactNode
  required?: boolean
  disabled?: boolean
  /**
   * Nome de cada nota ("Péssimo"… "Excelente"). Usado como nome acessível de
   * cada estrela e exibido ao lado durante o hover/seleção.
   */
  labels?: string[]
  /** Nome do grupo de rádios (envio em formulários). Gerado se omitido. */
  name?: string
  /** Tamanho das estrelas: `sm` 16px, `md` 24px, `lg` 32px. */
  size?: RatingSize
}

/**
 * Avaliação por estrelas. Interativo, é um grupo de rádios nativos (setas
 * do teclado funcionam como em qualquer radiogroup); em `readOnly`, uma
 * imagem com a nota por extenso.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value: valueProp,
    defaultValue = null,
    onChange,
    max = 5,
    readOnly = false,
    label,
    hideLabel = false,
    description,
    error,
    required = false,
    disabled = false,
    labels,
    name,
    size = 'md',
    id,
    className,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const baseId = useId('or-rating', id)
  const groupName = name ?? baseId
  const labelId = `${baseId}-label`
  const descriptionId = `${baseId}-description`
  const errorId = `${baseId}-error`
  const [value, setValue] = useControllableState<number | null>({
    value: valueProp,
    defaultValue,
    onChange: onChange as ((value: number | null) => void) | undefined,
  })
  const [hover, setHover] = useState<number | null>(null)
  const hasError = error !== undefined && error !== null && error !== false && error !== ''
  const stars = range(1, Math.max(1, Math.round(max)))
  const numberFormat = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
    } catch {
      return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
    }
  }, [locale])
  const current = value ?? 0
  const optionLabel = (n: number) =>
    labels?.[n - 1] ?? t('rating', { value: numberFormat.format(n), max })

  if (readOnly) {
    const clamped = Math.min(Math.max(current, 0), stars.length)
    return (
      <div
        ref={ref}
        id={id}
        className={cx('or-rating-field', 'or-rating-field--readonly', className)}
        {...rest}
      >
        {label && !hideLabel && <span className="or-field__label">{label}</span>}
        <div
          role="img"
          aria-label={t('rating', { value: numberFormat.format(clamped), max: stars.length })}
          className={cx('or-rating', `or-rating--${size}`)}
        >
          {stars.map((n) => {
            const fill = Math.min(Math.max(clamped - (n - 1), 0), 1)
            return (
              <span key={n} className="or-rating__star" data-filled={fill === 1 || undefined}>
                <Icon name="star" className="or-rating__icon" />
                {fill > 0 && fill < 1 && (
                  <span className="or-rating__partial" style={{ width: `${fill * 100}%` }}>
                    <Icon name="star" className="or-rating__icon" />
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  const display = hover ?? current
  const caption = display > 0 && labels?.[display - 1]
  const describedBy =
    [description && descriptionId, hasError && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div
      ref={ref}
      className={cx('or-field', 'or-rating-field', className)}
      data-invalid={hasError || undefined}
      data-disabled={disabled || undefined}
      {...rest}
    >
      {label && (
        <div className={cx('or-field__label-row', hideLabel && 'or-visually-hidden')}>
          <span id={labelId} className="or-field__label">
            {label}
            {required && (
              <span className="or-field__required" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </div>
      )}
      {description && (
        <p id={descriptionId} className="or-field__description">
          {description}
        </p>
      )}
      <div className="or-rating-field__row">
        {/* A prévia do hover termina quando o ponteiro sai da área das estrelas. */}
        <div className="or-rating__hover-zone" onMouseLeave={() => setHover(null)}>
          <div
            id={id}
            role="radiogroup"
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-disabled={disabled || undefined}
            className={cx(
              'or-rating',
              `or-rating--${size}`,
              hover !== null && 'or-rating--preview',
            )}
          >
            {stars.map((n) => {
              const inputId = `${baseId}-${n}`
              return (
                <span key={n} className="or-rating__option">
                  <input
                    id={inputId}
                    type="radio"
                    className="or-visually-hidden or-rating__input"
                    name={groupName}
                    value={n}
                    checked={current === n}
                    disabled={disabled}
                    required={required}
                    onChange={() => setValue(n)}
                  />
                  <label
                    htmlFor={inputId}
                    className="or-rating__star"
                    data-filled={n <= display || undefined}
                    onMouseEnter={() => {
                      if (!disabled) setHover(n)
                    }}
                  >
                    <Icon name="star" className="or-rating__icon" />
                    <span className="or-visually-hidden">{optionLabel(n)}</span>
                  </label>
                </span>
              )
            })}
          </div>
        </div>
        {labels && (
          <span className="or-rating-field__caption" aria-hidden="true">
            {caption || ''}
          </span>
        )}
      </div>
      {hasError && (
        <p id={errorId} className="or-field__error">
          <Icon name="alert-circle" size="sm" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
})
