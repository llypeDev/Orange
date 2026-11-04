import { forwardRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { usePresence } from '../../hooks'
import { cx } from '../../utils'
import './Skeleton.css'

export type SkeletonVariant = 'text' | 'rect' | 'circle'

export interface SkeletonProps extends HTMLAttributes<HTMLElement> {
  /** Forma: linha de texto, retângulo (imagens, cartões) ou círculo (avatares). */
  variant?: SkeletonVariant
  /** Largura (número = px). Padrão: 100% (`text`/`rect`) ou 40px (`circle`). */
  width?: number | string
  /** Altura (número = px). Padrão: 1 linha (`text`), 120px (`rect`) ou igual à largura (`circle`). */
  height?: number | string
  /** Brilho animado. Desligado automaticamente com movimento reduzido. */
  animated?: boolean
  /**
   * Modo de troca: com `loaded`, o Skeleton envolve o conteúdo real
   * (`children`) e faz um crossfade do placeholder para ele quando `loaded`
   * vira `true`. Enquanto carrega, o contêiner recebe `aria-busy`.
   */
  loaded?: boolean
  /** Conteúdo real, exibido quando `loaded` é `true`. */
  children?: ReactNode
}

const toSize = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value

interface SkeletonSwapProps extends HTMLAttributes<HTMLDivElement> {
  loaded: boolean
  placeholder: ReactNode
}

/**
 * Crossfade placeholder → conteúdo. As duas camadas ocupam a mesma célula do
 * grid; quem sai esmaece em --or-duration-fast (usePresence espera o fim) e
 * quem entra aparece em --or-duration-medium.
 */
const SkeletonSwap = forwardRef<HTMLDivElement, SkeletonSwapProps>(function SkeletonSwap(
  { loaded, placeholder, className, children, ...rest },
  ref,
) {
  const skeleton = usePresence<HTMLDivElement>(!loaded)
  const content = usePresence<HTMLDivElement>(loaded)
  // só anima depois de uma troca: conteúdo que já chega carregado não "pisca"
  const [previousLoaded, setPreviousLoaded] = useState(loaded)
  const [changed, setChanged] = useState(false)
  if (previousLoaded !== loaded) {
    setPreviousLoaded(loaded)
    setChanged(true)
  }

  return (
    <div
      ref={ref}
      className={cx('or-skeleton-swap', className)}
      aria-busy={!loaded || undefined}
      data-changed={changed || undefined}
      {...rest}
    >
      {skeleton.present && (
        <div
          ref={skeleton.nodeRef}
          className="or-skeleton-swap__layer"
          data-state={skeleton.state}
          aria-hidden="true"
        >
          {placeholder}
        </div>
      )}
      {content.present && (
        <div
          ref={content.nodeRef}
          className="or-skeleton-swap__layer or-skeleton-swap__content"
          data-state={content.state}
          aria-hidden={content.state === 'closed' || undefined}
        >
          {children}
        </div>
      )}
    </div>
  )
})

/**
 * Espaço reservado com a forma do conteúdo que está carregando. É decorativo
 * (`aria-hidden`): marque o contêiner com `aria-busy` e anuncie o carregamento
 * numa região `role="status"` fora dele. Com `loaded`, troca sozinho pelo
 * conteúdo real com crossfade.
 */
export const Skeleton = forwardRef<HTMLElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, animated = true, loaded, className, style, children, ...rest },
  ref,
) {
  const w = toSize(width)
  const h = toSize(height) ?? (variant === 'circle' ? w : undefined)
  const shapeClassName = cx(
    'or-skeleton',
    `or-skeleton--${variant}`,
    animated && 'or-skeleton--animated',
  )

  if (loaded === undefined) {
    return (
      <span
        ref={ref as Ref<HTMLSpanElement>}
        aria-hidden="true"
        className={cx(shapeClassName, className)}
        style={{ width: w, height: h, ...style }}
        {...rest}
      />
    )
  }

  return (
    <SkeletonSwap
      ref={ref as Ref<HTMLDivElement>}
      loaded={loaded}
      placeholder={
        <span aria-hidden="true" className={shapeClassName} style={{ width: w, height: h }} />
      }
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </SkeletonSwap>
  )
})

export interface SkeletonTextProps extends HTMLAttributes<HTMLElement> {
  /** Número de linhas. */
  lines?: number
  /** Largura da última linha, para parecer um parágrafo real. */
  lastLineWidth?: number | string
  /** Largura do bloco. */
  width?: number | string
  /** Brilho animado. */
  animated?: boolean
  /** Modo de troca: faz crossfade das linhas para `children` quando `true`. */
  loaded?: boolean
  /** Conteúdo real, exibido quando `loaded` é `true`. */
  children?: ReactNode
}

/** Bloco de várias linhas de `Skeleton` imitando um parágrafo. */
export const SkeletonText = forwardRef<HTMLElement, SkeletonTextProps>(function SkeletonText(
  {
    lines = 3,
    lastLineWidth = '60%',
    width,
    animated = true,
    loaded,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const count = Math.max(1, Math.floor(lines))
  const lineNodes = Array.from({ length: count }, (_, i) => (
    <Skeleton
      key={i}
      variant="text"
      animated={animated}
      width={count > 1 && i === count - 1 ? lastLineWidth : undefined}
    />
  ))

  if (loaded === undefined) {
    return (
      <span
        ref={ref as Ref<HTMLSpanElement>}
        aria-hidden="true"
        className={cx('or-skeleton-text', className)}
        style={{ width: toSize(width), ...style }}
        {...rest}
      >
        {lineNodes}
      </span>
    )
  }

  return (
    <SkeletonSwap
      ref={ref as Ref<HTMLDivElement>}
      loaded={loaded}
      placeholder={
        <span className="or-skeleton-text" style={{ width: toSize(width) }} aria-hidden="true">
          {lineNodes}
        </span>
      }
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </SkeletonSwap>
  )
})
