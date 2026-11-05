import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type RefObject,
} from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'
import {
  getColorScheme,
  isHighContrastTheme,
  isThemeName,
  useTheme,
  type ResolvedTheme,
} from '../../providers'
import { cx, mergeRefs } from '../../utils'
import './Paper.css'

export type PaperPadding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
export type PaperBorder = 'none' | 'default' | 'strong' | 'accent-top' | 'accent-left'
export type PaperElevation = 'flat' | 'raised' | 'overlay'
export type PaperTone = 'default' | 'subtle' | 'inverse'

export interface PaperProps
  extends HTMLAttributes<HTMLElement>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel' | 'download'>,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
  /** Elemento renderizado (`section`, `article`, `aside`, `li`…). Padrão: `div`. */
  as?: ElementType
  /** Espaçamento interno na escala de espaço (`6` = 1.5rem). Padrão: `6`. */
  padding?: PaperPadding
  /** Borda: 1px neutra, mais forte, ou com faixa laranja no topo/à esquerda. Padrão: `default`. */
  border?: PaperBorder
  /** `flat` (padrão), `raised` (sombra leve) ou `overlay` (sombra de sobreposição). */
  elevation?: PaperElevation
  /**
   * Cor de fundo: `default` (superfície), `subtle` (fundo sutil) ou `inverse`
   * (inverte o tema dentro da superfície — componentes internos acompanham).
   */
  tone?: PaperTone
  /**
   * Superfície clicável (cartão-link, opção selecionável): sobe 4px com sombra
   * laranja no hover/foco e afunda ao pressionar. Use com `as="a"`/`as="button"`
   * ou com um link/botão dentro.
   */
  interactive?: boolean
}

/**
 * Lê o esquema de cores efetivo do pai (que pode estar num escopo
 * `data-theme` diferente do documento) e devolve o tema oposto.
 */
function useInverseTheme(ref: RefObject<HTMLElement | null>, enabled: boolean): ResolvedTheme | undefined {
  const { resolvedTheme } = useTheme()
  const [theme, setTheme] = useState<ResolvedTheme | undefined>(undefined)

  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      setTheme(undefined)
      return
    }
    const el = ref.current
    if (!el) return
    const update = () => {
      const parent = el.parentElement
      const scheme = parent ? (getComputedStyle(parent).colorScheme ?? '') : ''
      // O tema do escopo diz se é alto contraste: o inverso de dark-hc é light-hc.
      const scope = parent?.closest('[data-theme]')?.getAttribute('data-theme')
      const context: ResolvedTheme = isThemeName(scope) ? scope : resolvedTheme
      const current = scheme.includes('light')
        ? 'light'
        : scheme.includes('dark')
          ? 'dark'
          : getColorScheme(context)
      const inverse = current === 'light' ? 'dark' : 'light'
      setTheme(isHighContrastTheme(context) ? `${inverse}-hc` : inverse)
    }
    update()
    if (typeof MutationObserver === 'undefined') return
    // reage a trocas de tema em qualquer ancestral (provider, prévia da doc…)
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'], subtree: true })
    return () => observer.disconnect()
  }, [enabled, resolvedTheme])

  return theme
}

/**
 * Superfície base do Orange: um contêiner com fundo, borda de 1px e
 * espaçamento interno. É a peça sobre a qual cartões, painéis e seções são
 * montados.
 */
export const Paper = forwardRef<HTMLElement, PaperProps>(function Paper(
  {
    as: Component = 'div',
    padding = 6,
    border = 'default',
    elevation = 'flat',
    tone = 'default',
    interactive = false,
    className,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLElement>(null)
  const composedRef = useMemo(() => mergeRefs(ref, innerRef), [ref])
  const inverseTheme = useInverseTheme(innerRef, tone === 'inverse')

  return (
    <Component
      ref={composedRef}
      className={cx(
        'or-paper',
        `or-paper--padding-${padding}`,
        `or-paper--border-${border}`,
        `or-paper--${elevation}`,
        `or-paper--tone-${tone}`,
        interactive && 'or-paper--interactive',
        className,
      )}
      data-theme={inverseTheme}
      {...rest}
    />
  )
})
