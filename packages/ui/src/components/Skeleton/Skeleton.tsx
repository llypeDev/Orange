import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../utils'
import './Skeleton.css'

export type SkeletonVariant = 'text' | 'rect' | 'circle'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Forma: linha de texto, retângulo (imagens, cartões) ou círculo (avatares). */
  variant?: SkeletonVariant
  /** Largura (número = px). Padrão: 100% (`text`/`rect`) ou 40px (`circle`). */
  width?: number | string
  /** Altura (número = px). Padrão: 1 linha (`text`), 120px (`rect`) ou igual à largura (`circle`). */
  height?: number | string
  /** Brilho animado. Desligado automaticamente com movimento reduzido. */
  animated?: boolean
}

const toSize = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value

/**
 * Espaço reservado com a forma do conteúdo que está carregando. É decorativo
 * (`aria-hidden`): marque o contêiner com `aria-busy` e anuncie o carregamento
 * numa região `role="status"` fora dele.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, animated = true, className, style, ...rest },
  ref,
) {
  const w = toSize(width)
  const h = toSize(height) ?? (variant === 'circle' ? w : undefined)
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(
        'or-skeleton',
        `or-skeleton--${variant}`,
        animated && 'or-skeleton--animated',
        className,
      )}
      style={{ width: w, height: h, ...style }}
      {...rest}
    />
  )
})

export interface SkeletonTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Número de linhas. */
  lines?: number
  /** Largura da última linha, para parecer um parágrafo real. */
  lastLineWidth?: number | string
  /** Largura do bloco. */
  width?: number | string
  /** Brilho animado. */
  animated?: boolean
}

/** Bloco de várias linhas de `Skeleton` imitando um parágrafo. */
export const SkeletonText = forwardRef<HTMLSpanElement, SkeletonTextProps>(function SkeletonText(
  { lines = 3, lastLineWidth = '60%', width, animated = true, className, style, ...rest },
  ref,
) {
  const count = Math.max(1, Math.floor(lines))
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx('or-skeleton-text', className)}
      style={{ width: toSize(width), ...style }}
      {...rest}
    >
      {Array.from({ length: count }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          animated={animated}
          width={count > 1 && i === count - 1 ? lastLineWidth : undefined}
        />
      ))}
    </span>
  )
})
