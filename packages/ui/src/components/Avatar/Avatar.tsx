import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import type { MessageKey } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Avatar.css'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'square' | 'circle'
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'

/** Contexto interno: o AvatarGroup repassa tamanho e forma aos avatares. */
export const AvatarGroupContext = createContext<{ size?: AvatarSize; shape?: AvatarShape } | null>(null)

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** URL da foto. Se falhar, mostra as iniciais (ou o ícone de usuário). */
  src?: string
  /**
   * Texto alternativo. Padrão: `name`. Use `alt=""` quando o nome já estiver
   * escrito ao lado do avatar (o avatar vira decorativo).
   */
  alt?: string
  /** Nome da pessoa: gera as iniciais e a cor de fundo. */
  name?: string
  /** `xs` 24px, `sm` 32px, `md` 40px, `lg` 48px, `xl` 64px. */
  size?: AvatarSize
  /** Forma: `square` (padrão) ou `circle`. */
  shape?: AvatarShape
  /** Indicador de presença. */
  status?: AvatarStatus
  /** Substitui o texto acessível do status. */
  statusLabel?: string
  /** Anel pulsante no indicador ("ao vivo"). Ignorado para `offline` e em movimento reduzido. */
  pulse?: boolean
  /** Ícone usado quando não há imagem nem nome. */
  icon?: ReactNode
  /** Atributos extras da `<img>` (ex.: `referrerPolicy`, `loading`). */
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>
}

const TONES = ['orange', 'amber', 'green', 'blue', 'red', 'neutral'] as const

const STATUS_KEYS: Record<AvatarStatus, MessageKey> = {
  online: 'presenceOnline',
  away: 'presenceAway',
  busy: 'presenceBusy',
  offline: 'presenceOffline',
}

function initialsOf(name: string, locale: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
  if (words.length === 0) return ''
  const first = Array.from(words[0])[0] ?? ''
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? '') : ''
  try {
    return (first + last).toLocaleUpperCase(locale)
  } catch {
    return (first + last).toUpperCase()
  }
}

function toneOf(name: string): (typeof TONES)[number] {
  let hash = 0
  for (const char of name.trim().toLowerCase()) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) | 0
  return TONES[Math.abs(hash) % TONES.length]
}

type LoadState = 'loading' | 'loaded' | 'error'

/**
 * Representa uma pessoa ou organização: foto, iniciais ou ícone, com
 * indicador de presença opcional.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, size: sizeProp, shape: shapeProp, status, statusLabel, pulse = false, icon, imgProps, className, ...rest },
  ref,
) {
  const { t, locale } = useLocale()
  const group = useContext(AvatarGroupContext)
  const size = sizeProp ?? group?.size ?? 'md'
  const shape = shapeProp ?? group?.shape ?? 'square'
  const imgRef = useRef<HTMLImageElement>(null)
  const [loadState, setLoadState] = useState<LoadState>(src ? 'loading' : 'error')

  useEffect(() => {
    if (!src) {
      setLoadState('error')
      return
    }
    const img = imgRef.current
    // imagem já em cache antes do React registrar o onLoad
    setLoadState(img?.complete && img.naturalWidth > 0 ? 'loaded' : 'loading')
  }, [src])

  const initials = name ? initialsOf(name, locale) : ''
  const tone = name ? toneOf(name) : 'neutral'
  const label = alt ?? name ?? ''
  const decorative = label === ''
  const statusText = status ? (statusLabel ?? t(STATUS_KEYS[status])) : ''
  const accessibleName = [label, statusText].filter(Boolean).join(', ')
  const showImage = Boolean(src) && loadState !== 'error'

  return (
    <span
      ref={ref}
      className={cx(
        'or-avatar',
        `or-avatar--${size}`,
        `or-avatar--${shape}`,
        `or-avatar--tone-${tone}`,
        showImage && loadState === 'loaded' && 'or-avatar--loaded',
        className,
      )}
      {...(decorative ? null : { role: 'img', 'aria-label': accessibleName })}
      {...rest}
    >
      <span className="or-avatar__frame" aria-hidden="true">
        {initials ? (
          <span className="or-avatar__initials">{initials}</span>
        ) : (
          <span className="or-avatar__icon">{icon ?? <Icon name="user" />}</span>
        )}
        {showImage && (
          <img
            ref={imgRef}
            className="or-avatar__image"
            src={src}
            alt=""
            onLoad={() => setLoadState('loaded')}
            onError={() => setLoadState('error')}
            {...imgProps}
          />
        )}
      </span>
      {status && (
        <span
          className={cx(
            'or-avatar__status',
            `or-avatar__status--${status}`,
            pulse && status !== 'offline' && 'or-avatar__status--pulse',
          )}
          aria-hidden="true"
        />
      )}
      {decorative && status && <VisuallyHidden>{statusText}</VisuallyHidden>}
    </span>
  )
})
