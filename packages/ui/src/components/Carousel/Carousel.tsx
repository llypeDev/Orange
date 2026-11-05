import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type TouchEvent,
} from 'react'
import {
  useControllableState,
  useId,
  useIsomorphicLayoutEffect,
  useMediaQuery,
  useReducedMotion,
} from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { clamp, cx, devWarning } from '../../utils'
import { IconButton } from '../IconButton'
import { useSlidingIndicator } from '../Tabs/useSlidingIndicator'
import './Carousel.css'

export type CarouselGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8
export type CarouselControlsPlacement = 'bottom' | 'top'
export type CarouselPicker = 'dots' | 'counter' | 'none'
export type CarouselAutoplay = boolean | { interval: number }

/** Valores por breakpoint (largura mínima, mesmos de `@orange/tokens`). */
export interface CarouselResponsiveValue {
  /** Abaixo de 640px. */
  base?: number
  /** A partir de 640px. */
  sm?: number
  /** A partir de 768px. */
  md?: number
  /** A partir de 1024px. */
  lg?: number
  /** A partir de 1280px. */
  xl?: number
}

export type CarouselSlidesPerView = number | CarouselResponsiveValue

/* Espelha `breakpoints` de @orange/tokens (sm 640, md 768, lg 1024, xl 1280). */
const MEDIA = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
} as const

const DEFAULT_INTERVAL = 5000
const MIN_INTERVAL = 1000

function useSlidesPerView(value: CarouselSlidesPerView): number {
  const sm = useMediaQuery(MEDIA.sm)
  const md = useMediaQuery(MEDIA.md)
  const lg = useMediaQuery(MEDIA.lg)
  const xl = useMediaQuery(MEDIA.xl)
  let resolved: number | undefined
  if (typeof value === 'number') resolved = value
  else {
    const steps: [boolean, number | undefined][] = [
      [xl, value.xl],
      [lg, value.lg],
      [md, value.md],
      [sm, value.sm],
    ]
    resolved = steps.find(([matches, n]) => matches && n !== undefined)?.[1] ?? value.base
  }
  return Number.isFinite(resolved) ? Math.max(1, resolved as number) : 1
}

interface SlideContextValue {
  index: number
  total: number
  active: boolean
  id: string
}

const SlideContext = createContext<SlideContextValue | null>(null)

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'children'> {
  /**
   * Nome acessível do carrossel (vira `aria-label`). Obrigatório. Não inclua a
   * palavra "carrossel": o papel já é anunciado. Com um título visível, passe
   * `aria-labelledby` — ele tem precedência.
   */
  label: string
  /** Posição atual (controlado). É o índice do primeiro slide visível. */
  index?: number
  /** Posição inicial (não controlado). Padrão: `0`. */
  defaultIndex?: number
  /** Chamado quando a posição muda (botões, seletor, swipe ou rotação). */
  onIndexChange?: (index: number) => void
  /** Anterior/próximo dão a volta nas pontas. A rotação automática sempre volta ao início. */
  loop?: boolean
  /**
   * Slides visíveis por vez. Frações deixam o próximo "espiando" (ex.: `1.2`,
   * `2.5`). Aceita valores por breakpoint: `{ base: 1.2, md: 2.5, lg: 4 }`.
   */
  slidesPerView?: CarouselSlidesPerView
  /** Espaço entre slides, na escala `--or-space-*`. Padrão: `4` (16px). */
  gap?: CarouselGap
  /**
   * Rotação automática. `true` usa 5s; `{ interval }` define o tempo em ms.
   * Sempre exibe o botão Pausar/Iniciar como primeiro controle; pausa no hover,
   * para quando o foco do teclado entra e nunca começa sozinha com movimento reduzido.
   */
  autoplay?: CarouselAutoplay
  /** Posição da barra de controles. Na ordem do Tab ela sempre vem antes dos slides. */
  controls?: CarouselControlsPlacement
  /**
   * Seletor de slides: `dots` (abas do APG, uma parada de Tab), `counter`
   * ("02 / 05", para muitos slides) ou `none` (só anterior/próximo).
   */
  picker?: CarouselPicker
  /** Slides (`CarouselSlide`) como filhos diretos. */
  children?: ReactNode
}

/**
 * Carrossel acessível (padrão Carousel do WAI-ARIA APG): região com
 * `aria-roledescription="carousel"`, slides `role="group"`, botões
 * anterior/próximo, seletor em abas e rotação opcional com botão de pausa.
 * O trilho usa scroll-snap nativo: swipe, trackpad e roda funcionam sem JS.
 */
export const Carousel = forwardRef<HTMLElement, CarouselProps>(function Carousel(
  {
    label,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    loop = false,
    slidesPerView = 1,
    gap = 4,
    autoplay = false,
    controls = 'bottom',
    picker = 'dots',
    className,
    style,
    children,
    onFocus,
    onBlur,
    onPointerEnter,
    onPointerLeave,
    onPointerDownCapture,
    onPointerCancel,
    onPointerUp,
    onClickCapture,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const baseId = useId('or-carousel', rest.id)
  const trackId = `${baseId}-track`
  const reduced = useReducedMotion()
  const perView = useSlidesPerView(slidesPerView)
  const visibleCount = Math.floor(perView)

  devWarning(
    !label && !rest['aria-labelledby'],
    'Carousel precisa de `label` (ou `aria-labelledby`) descrevendo o conjunto de slides.',
  )

  const slides = Children.toArray(children).filter(isValidElement)
  const count = slides.length
  const maxIndex = Math.max(0, count - visibleCount)
  const positions = maxIndex + 1
  const navigable = maxIndex > 0

  const [rawIndex, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  })
  const index = clamp(Math.round(rawIndex) || 0, 0, maxIndex)
  const indexRef = useRef(index)
  indexRef.current = index
  const maxIndexRef = useRef(maxIndex)
  maxIndexRef.current = maxIndex

  /* --- Rotação automática ------------------------------------------------ */

  const interval =
    typeof autoplay === 'object' ? Math.max(MIN_INTERVAL, autoplay.interval || DEFAULT_INTERVAL) : DEFAULT_INTERVAL
  const hasAutoplay = Boolean(autoplay) && navigable
  // Com movimento reduzido a rotação nunca começa sozinha (o usuário ainda pode iniciá-la).
  const [playing, setPlaying] = useState(() => Boolean(autoplay) && !reduced)
  // "Iniciar" explícito vence hover e foco (APG); qualquer navegação manual zera.
  const [userStarted, setUserStarted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [touching, setTouching] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [pageHidden, setPageHidden] = useState(false)

  const [prevAutoplay, setPrevAutoplay] = useState(Boolean(autoplay))
  if (prevAutoplay !== Boolean(autoplay)) {
    setPrevAutoplay(Boolean(autoplay))
    setPlaying(Boolean(autoplay) && !reduced)
    setUserStarted(false)
  }

  useEffect(() => {
    if (reduced) setPlaying(false)
  }, [reduced])

  const paused = pageHidden || (!userStarted && (hovered || touching || focusWithin))
  const rotating = hasAutoplay && playing && !paused

  const stopRotation = useCallback(() => {
    setPlaying(false)
    setUserStarted(false)
  }, [])

  // Aba do navegador oculta: pausa (a barra de progresso pausa junto).
  useEffect(() => {
    if (!hasAutoplay || typeof document === 'undefined') return
    const update = () => setPageHidden(document.visibilityState === 'hidden')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [hasAutoplay])

  // Timer com pausa: guarda o tempo restante entre pausas (hover, foco do mouse).
  const remainingRef = useRef(interval)
  useEffect(() => {
    remainingRef.current = interval
  }, [index, interval, playing])

  useEffect(() => {
    if (!rotating) return
    const startedAt = Date.now()
    const handle = window.setTimeout(() => {
      const current = indexRef.current
      setIndex(current >= maxIndexRef.current ? 0 : current + 1)
    }, remainingRef.current)
    return () => {
      window.clearTimeout(handle)
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt))
    }
  }, [rotating, index, setIndex])

  /* --- Navegação ----------------------------------------------------------- */

  const goTo = useCallback(
    (target: number) => {
      // Toda navegação do usuário encerra a rotação (WCAG 2.2.2).
      stopRotation()
      setIndex(clamp(target, 0, maxIndexRef.current))
    },
    [setIndex, stopRotation],
  )

  const canPrev = loop || index > 0
  const canNext = loop || index < maxIndex
  const goPrev = () => {
    if (canPrev) goTo(index === 0 ? maxIndex : index - 1)
  }
  const goNext = () => {
    if (canNext) goTo(index >= maxIndex ? 0 : index + 1)
  }

  /* --- Trilho com scroll-snap ---------------------------------------------- */

  const trackRef = useRef<HTMLDivElement>(null)
  /** Destino de uma rolagem programática em andamento (eventos de scroll dela são ignorados). */
  const pendingRef = useRef<number | null>(null)
  const pendingTimer = useRef<number | undefined>(undefined)
  /** Índice que veio da própria rolagem do usuário: não rola de volta para ele. */
  const fromScrollRef = useRef<number | null>(null)
  const lastScrolledRef = useRef<number | null>(null)
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  const getSlideElements = useCallback(() => {
    const track = trackRef.current
    if (!track) return []
    return Array.from(track.children).filter((el): el is HTMLElement =>
      el.classList.contains('or-carousel__slide'),
    )
  }, [])

  const measure = useCallback(() => {
    const track = trackRef.current
    // Sem layout (SSR, jsdom, display: none): nada a medir.
    if (!track || track.clientWidth === 0) return null
    const els = getSlideElements()
    const first = els[0]
    if (!first) return null
    const rtl = getComputedStyle(track).direction === 'rtl'
    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    const offsets = els.map((el) =>
      Math.min(
        max,
        rtl
          ? first.offsetLeft + first.offsetWidth - (el.offsetLeft + el.offsetWidth)
          : el.offsetLeft - first.offsetLeft,
      ),
    )
    return { track, rtl, max, offsets, scroll: rtl ? -track.scrollLeft : track.scrollLeft }
  }, [getSlideElements])

  const nearestIndex = (m: NonNullable<ReturnType<typeof measure>>) => {
    const last = Math.min(maxIndexRef.current, m.offsets.length - 1)
    if (m.scroll >= m.max - 1) return last
    let best = 0
    for (let i = 1; i <= last; i++) {
      if (Math.abs(m.offsets[i] - m.scroll) < Math.abs(m.offsets[best] - m.scroll)) best = i
    }
    return best
  }

  const clearPending = useCallback(() => {
    pendingRef.current = null
    window.clearTimeout(pendingTimer.current)
  }, [])

  // Posição mudou (botões, seletor, rotação, prop controlada): rola o trilho até ela.
  useIsomorphicLayoutEffect(() => {
    if (fromScrollRef.current === index) {
      fromScrollRef.current = null
      lastScrolledRef.current = index
      return
    }
    fromScrollRef.current = null
    const m = measure()
    if (!m) return
    const target = m.offsets[index] ?? 0
    // Montagem e ajustes de layout (breakpoint) são instantâneos; navegação é suave.
    const smooth = lastScrolledRef.current !== null && lastScrolledRef.current !== index && !reducedRef.current
    lastScrolledRef.current = index
    if (Math.abs(m.scroll - target) < 1) return
    pendingRef.current = index
    window.clearTimeout(pendingTimer.current)
    pendingTimer.current = window.setTimeout(clearPending, 1200)
    const left = m.rtl ? -target : target
    if (typeof m.track.scrollTo === 'function') m.track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
    else m.track.scrollLeft = left
  }, [index, perView, count, measure, clearPending])

  const onUserScrollRef = useRef((_next: number) => {})
  onUserScrollRef.current = (next: number) => {
    fromScrollRef.current = next
    goTo(next)
  }

  // Swipe/trackpad/roda: mantém o índice em sincronia com a rolagem (1x por quadro).
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const sync = () => {
      frame = 0
      const m = measure()
      if (!m) return
      const pending = pendingRef.current
      if (pending !== null) {
        if (Math.abs(m.scroll - (m.offsets[pending] ?? 0)) < 2) clearPending()
        return
      }
      const next = nearestIndex(m)
      if (next !== indexRef.current) onUserScrollRef.current(next)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync)
    }
    const onScrollEnd = () => {
      clearPending()
      sync()
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('scrollend', onScrollEnd)
    // Gesto do usuário interrompe uma rolagem programática.
    track.addEventListener('pointerdown', clearPending)
    track.addEventListener('wheel', clearPending, { passive: true })
    track.addEventListener('touchstart', clearPending, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(pendingTimer.current)
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('scrollend', onScrollEnd)
      track.removeEventListener('pointerdown', clearPending)
      track.removeEventListener('wheel', clearPending)
      track.removeEventListener('touchstart', clearPending)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nearestIndex só lê refs
  }, [measure, clearPending])

  // Clique num slide parcialmente visível (inerte, o clique cai no trilho): traz o slide para a vista.
  const handleTrackClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    const hit = getSlideElements().findIndex((el) => {
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && event.clientX >= rect.left && event.clientX <= rect.right
    })
    if (hit === -1 || (hit >= index && hit < index + visibleCount)) return
    goTo(hit < index ? hit : hit - visibleCount + 1)
  }

  /* --- Foco, hover e toque ----------------------------------------------- */

  // Diferencia foco do teclado (para a rotação) de foco por clique/toque (só pausa).
  const pointerRef = useRef(false)
  const pointerTimer = useRef<number | undefined>(undefined)
  useEffect(
    () => () => {
      window.clearTimeout(pointerTimer.current)
      window.clearTimeout(pendingTimer.current)
    },
    [],
  )

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    onFocus?.(event)
    const from = event.relatedTarget as Node | null
    const entering = !from || !event.currentTarget.contains(from)
    setFocusWithin(true)
    // APG: o foco do teclado entrando no carrossel para a rotação até o usuário pedir de novo.
    if (entering && !pointerRef.current && hasAutoplay && playing) stopRotation()
  }

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    onBlur?.(event)
    const to = event.relatedTarget as Node | null
    if (!to || !event.currentTarget.contains(to)) setFocusWithin(false)
  }

  /* --- Seletor (abas) ---------------------------------------------------- */

  const pickerRef = useRef<HTMLDivElement>(null)
  const indicator = useSlidingIndicator(
    pickerRef,
    '[aria-selected="true"] > .or-carousel__dot-mark',
    'x',
    `${index}|${positions}`,
  )

  const handlePickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number
    if (event.key === 'ArrowRight') next = index >= maxIndex ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? maxIndex : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = maxIndex
    else return
    event.preventDefault()
    goTo(next)
    pickerRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }

  const slideIds = slides.map((child, i) => {
    const own = (child.props as { id?: unknown }).id
    return typeof own === 'string' && own ? own : `${baseId}-slide-${i + 1}`
  })

  const pad = (n: number) => String(n).padStart(2, '0')

  const rootStyle = {
    '--_per-view': perView,
    '--_gap': `var(--or-space-${gap})`,
    ...style,
  } as CSSProperties

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label={label}
      className={cx('or-carousel', `or-carousel--controls-${controls}`, className)}
      data-autoplay={hasAutoplay ? (playing ? 'playing' : 'stopped') : undefined}
      data-paused={hasAutoplay && playing && paused ? '' : undefined}
      style={rootStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPointerEnter={(event: PointerEvent<HTMLElement>) => {
        onPointerEnter?.(event)
        if (event.pointerType !== 'touch') setHovered(true)
      }}
      onPointerLeave={(event: PointerEvent<HTMLElement>) => {
        onPointerLeave?.(event)
        setHovered(false)
      }}
      onPointerDownCapture={(event: PointerEvent<HTMLElement>) => {
        onPointerDownCapture?.(event)
        window.clearTimeout(pointerTimer.current)
        pointerRef.current = true
      }}
      onPointerUp={(event: PointerEvent<HTMLElement>) => {
        onPointerUp?.(event)
        // No toque, o foco chega depois do pointerup: espera o clique (ou desiste).
        window.clearTimeout(pointerTimer.current)
        pointerTimer.current = window.setTimeout(() => {
          pointerRef.current = false
        }, 1000)
      }}
      onPointerCancel={(event: PointerEvent<HTMLElement>) => {
        onPointerCancel?.(event)
        pointerRef.current = false
      }}
      onClickCapture={(event: MouseEvent<HTMLElement>) => {
        onClickCapture?.(event)
        pointerRef.current = false
      }}
      onTouchStart={(event: TouchEvent<HTMLElement>) => {
        onTouchStart?.(event)
        setTouching(true)
      }}
      onTouchEnd={(event: TouchEvent<HTMLElement>) => {
        onTouchEnd?.(event)
        setTouching(false)
      }}
      onTouchCancel={(event: TouchEvent<HTMLElement>) => {
        onTouchCancel?.(event)
        setTouching(false)
      }}
      {...rest}
    >
      {navigable && (
        // Sempre antes dos slides no DOM: o botão de rotação é o primeiro controle (APG, WCAG 2.2.2).
        <div className="or-carousel__controls">
          {hasAutoplay && (
            <IconButton
              className="or-carousel__rotation"
              variant="outline"
              icon={<Icon key={playing ? 'pause' : 'play'} name={playing ? 'pause' : 'play'} />}
              label={playing ? t('carouselPause') : t('carouselPlay')}
              onClick={() => {
                if (playing) stopRotation()
                else {
                  setPlaying(true)
                  setUserStarted(true)
                }
              }}
            />
          )}

          {picker === 'dots' && (
            // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- o foco fica nas abas (roving tabindex); o tablist só delega as setas
            <div
              ref={pickerRef}
              role="tablist"
              aria-label={t('carouselPicker')}
              className="or-carousel__picker"
              data-indicator={indicator.ready ? 'ready' : undefined}
              onKeyDown={handlePickerKeyDown}
            >
              {Array.from({ length: positions }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i + 1}`}
                  aria-selected={i === index}
                  aria-controls={slideIds[i]}
                  aria-label={t('carouselSlideTab', { index: i + 1 })}
                  tabIndex={i === index ? 0 : -1}
                  className="or-carousel__dot"
                  onClick={() => goTo(i)}
                >
                  <span className="or-carousel__dot-mark" aria-hidden="true" />
                </button>
              ))}
              <span
                className="or-carousel__dot-indicator"
                aria-hidden="true"
                data-visible={indicator.visible || undefined}
                data-ready={indicator.ready || undefined}
                style={indicator.style}
              />
            </div>
          )}

          {picker === 'counter' && (
            <span className="or-carousel__counter" aria-hidden="true">
              <span className="or-carousel__counter-current">{pad(index + 1)}</span>
              <span className="or-carousel__counter-sep">/</span>
              {pad(positions)}
            </span>
          )}

          <div className="or-carousel__nav">
            <IconButton
              className="or-carousel__prev"
              variant="outline"
              icon="chevron-left"
              label={t('carouselPrevious')}
              aria-controls={trackId}
              aria-disabled={!canPrev || undefined}
              onClick={goPrev}
            />
            <IconButton
              className="or-carousel__next"
              variant="outline"
              icon="chevron-right"
              label={t('carouselNext')}
              aria-controls={trackId}
              aria-disabled={!canNext || undefined}
              onClick={goNext}
            />
          </div>

          {hasAutoplay && playing && (
            // Tempo até o próximo slide (or-fill-x); recomeça a cada slide e pausa com a rotação.
            <span
              key={index}
              className="or-carousel__progress"
              aria-hidden="true"
              style={{ '--_interval': `${interval}ms` } as CSSProperties}
            />
          )}
        </div>
      )}

      <div className="or-carousel__viewport">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- atalho de mouse; teclado usa anterior/próximo e o seletor */}
        <div
          ref={trackRef}
          id={trackId}
          className="or-carousel__track"
          // APG: anúncios desligados enquanto gira; educados quando o usuário navega.
          aria-live={hasAutoplay && playing ? 'off' : 'polite'}
          aria-atomic="false"
          onClick={handleTrackClick}
        >
          {slides.map((child, i) => {
            const active = i >= index && i < index + Math.max(1, visibleCount)
            return (
              <SlideContext.Provider key={child.key ?? i} value={{ index: i, total: count, active, id: slideIds[i] }}>
                {child}
              </SlideContext.Provider>
            )
          })}
        </div>
      </div>
    </section>
  )
})

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Nome acessível do slide. Padrão: a posição ("2 de 5"). Com um título
   * visível no slide, prefira `aria-labelledby`.
   */
  label?: string
  children?: ReactNode
}

/**
 * Um slide do `Carousel` (`role="group"`, `aria-roledescription="slide"`).
 * Fora da vista fica inerte: some dos leitores de tela e da ordem do Tab.
 */
export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(function CarouselSlide(
  { label, className, children, ...rest },
  ref,
) {
  const ctx = useContext(SlideContext)
  if (!ctx) throw new Error('<CarouselSlide> precisa estar dentro de <Carousel>.')
  const { t } = useLocale()
  const labelledBy = rest['aria-labelledby']
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={labelledBy ? undefined : (label ?? t('carouselSlideLabel', { index: ctx.index + 1, total: ctx.total }))}
      className={cx('or-carousel__slide', className)}
      data-state={ctx.active ? 'active' : 'inactive'}
      {...rest}
      id={ctx.id}
      inert={!ctx.active || undefined}
      aria-hidden={!ctx.active || undefined}
    >
      {children}
    </div>
  )
})
