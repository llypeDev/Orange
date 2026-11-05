import {
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import { Skeleton } from '../Skeleton'
import { VisuallyHidden } from '../VisuallyHidden'
import './Image.css'

export type ImageRatio = '1/1' | '4/3' | '3/2' | '16/9' | '21/9' | number
export type ImageFit = 'cover' | 'contain'
export type ImageState = 'loading' | 'loaded' | 'error'

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'children' | 'placeholder'> {
  /** URL da imagem. `srcSet` e `sizes` são repassados à `<img>`. */
  src: string
  /**
   * Texto alternativo — obrigatório. Descreva o que a imagem comunica no
   * contexto. Use `alt=""` só quando ela for decorativa (o mesmo conteúdo já
   * está no texto ao lado, ou é puro ornamento): assim leitores de tela a ignoram.
   */
  alt: string
  /**
   * Proporção reservada antes do carregamento (`aspect-ratio`), evitando
   * deslocamento de layout. Sem `ratio`, usa `width`/`height` numéricos se houver.
   */
  ratio?: ImageRatio
  /** Como a imagem preenche a área: `cover` (recorta, padrão) ou `contain` (mostra inteira). */
  fit?: ImageFit
  /** Ponto focal do recorte (`object-position`), ex.: `'top'`, `'50% 30%'`. */
  position?: string
  /** Conteúdo exibido se a imagem (e o `fallbackSrc`) falharem. Substitui o padrão. */
  fallback?: ReactNode
  /** Segunda tentativa: carregada uma vez quando `src` falha, antes do `fallback`. */
  fallbackSrc?: string
  /** Legenda visível. Envolve a imagem em `<figure>` com `<figcaption>`. */
  caption?: ReactNode
  /** Borda de 1px (`--or-color-border`) desenhada sobre a borda da imagem. */
  bordered?: boolean
}

const toNumber = (value: number | string | undefined) => {
  const n = typeof value === 'string' ? Number(value) : value
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined
}

/**
 * Imagem robusta: reserva a proporção (sem CLS), carrega sob demanda
 * (`loading="lazy"`, `decoding="async"`), mostra um skeleton até carregar e
 * entra com fade. Se falhar, tenta `fallbackSrc` uma vez e depois exibe um
 * substituto acessível. A `ref` e os demais atributos vão para a `<img>`;
 * `className` e `style` vão para o contêiner (que define tamanho e proporção).
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    alt,
    ratio,
    fit = 'cover',
    position,
    fallback,
    fallbackSrc,
    caption,
    bordered = false,
    loading = 'lazy',
    decoding = 'async',
    className,
    style,
    onLoad,
    onError,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  devWarning(alt === undefined, 'Image precisa de `alt`. Use `alt=""` apenas para imagens decorativas.')

  const imgRef = useRef<HTMLImageElement>(null)
  const initialSrc = src || fallbackSrc || ''
  const [currentSrc, setCurrentSrc] = useState(initialSrc)
  const [state, setState] = useState<ImageState>(initialSrc ? 'loading' : 'error')

  // Nova origem: recomeça do `src` (derivado na renderização, sem piscar o estado antigo).
  const [sources, setSources] = useState({ src, fallbackSrc })
  if (sources.src !== src || sources.fallbackSrc !== fallbackSrc) {
    setSources({ src, fallbackSrc })
    setCurrentSrc(initialSrc)
    setState(initialSrc ? 'loading' : 'error')
  }

  // Imagem já em cache (ou carregada antes da hidratação): o onLoad não chega.
  useIsomorphicLayoutEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) setState('loaded')
  }, [currentSrc])

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    onLoad?.(event)
    setState('loaded')
  }

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    onError?.(event)
    // Uma única nova tentativa com o fallbackSrc antes de mostrar o substituto.
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setState('loading')
      return
    }
    setState('error')
  }

  const width = toNumber(rest.width)
  const height = toNumber(rest.height)
  const aspectRatio = ratio ?? (width && height ? `${width} / ${height}` : undefined)
  const decorative = alt === ''

  const frameStyle: CSSProperties = { aspectRatio: aspectRatio === undefined ? undefined : String(aspectRatio) }

  const frame = (
    <div
      className={cx(
        'or-image',
        `or-image--${fit}`,
        aspectRatio === undefined && 'or-image--auto',
        bordered && 'or-image--bordered',
        !caption && className,
      )}
      data-state={state}
      style={caption ? frameStyle : { ...frameStyle, ...style }}
    >
      {state === 'loading' && <Skeleton variant="rect" className="or-image__skeleton" />}
      {currentSrc && (
        <img
          ref={mergeRefs(ref, imgRef)}
          loading={loading}
          decoding={decoding}
          {...rest}
          src={currentSrc}
          alt={alt}
          className="or-image__img"
          style={position ? { objectPosition: position } : undefined}
          hidden={state === 'error'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {state === 'error' && (
        <div className="or-image__fallback" aria-hidden={fallback === undefined && decorative ? true : undefined}>
          {fallback ?? (
            <>
              <Icon name="image" size="lg" />
              {!decorative && <VisuallyHidden>{t('imageUnavailable', { alt })}</VisuallyHidden>}
            </>
          )}
        </div>
      )}
    </div>
  )

  if (!caption) return frame

  return (
    <figure className={cx('or-image-figure', className)} style={style}>
      {frame}
      <figcaption className="or-image__caption">{caption}</figcaption>
    </figure>
  )
})
