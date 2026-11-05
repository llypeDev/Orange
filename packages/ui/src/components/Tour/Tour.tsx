import {
  arrow as arrowMiddleware,
  autoPlacement,
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  size,
  useFloating,
  type Middleware,
} from '@floating-ui/react-dom'
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import {
  useControllableState,
  useFocusTrap,
  useId,
  useIsomorphicLayoutEffect,
  useLockBodyScroll,
  useMediaQuery,
  useMounted,
  usePresence,
  useReducedMotion,
} from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { canUseDOM, clamp, cx, devWarning, getFocusableElements, mergeRefs } from '../../utils'
import { Button } from '../Button'
import { focusElement, getThemeScope, useLayer } from '../Modal/overlay'
import { Portal } from '../Portal'
import './Tour.css'

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto'

/** Alvo de um passo: seletor CSS, ref ou função que devolve o elemento. */
export type TourTarget = string | RefObject<Element | null> | (() => Element | null)

export interface TourStep {
  /**
   * Elemento destacado pelo recorte. Seletor CSS, ref ou função. Sem alvo — ou
   * com um alvo que não existe na página — o passo aparece centralizado, sem recorte.
   */
  target?: TourTarget
  /** Título do passo; nomeia o diálogo (junto com o `label` do tour). */
  title: ReactNode
  /** Texto do passo; descreve o diálogo via `aria-describedby`. */
  content: ReactNode
  /** Lado do alvo onde o diálogo aparece. `auto` escolhe o lado com mais espaço. */
  placement?: TourPlacement
  /** Imagem, vídeo ou ilustração exibida acima do título. */
  media?: ReactNode
}

export interface TourProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'content' | 'children'> {
  /** Passos do tour, na ordem. */
  steps: TourStep[]
  /** Aberto (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o tour abre ou fecha (concluir, pular, Escape). */
  onOpenChange?: (open: boolean) => void
  /** Índice do passo atual, a partir de 0 (controlado). Use com `onStepChange`. */
  step?: number
  /** Passo inicial (não controlado). O tour volta para ele ao fechar. */
  defaultStep?: number
  /** Chamado com o índice do passo pedido (Próximo/Voltar). */
  onStepChange?: (step: number) => void
  /** Chamado ao clicar em "Concluir" no último passo. */
  onFinish?: () => void
  /** Chamado com o índice do passo atual ao pular (botão "Pular tour" ou Escape). */
  onSkip?: (step: number) => void
  /** Nome do tour (ex.: "Novidades do painel"). Aparece como eyebrow e abre o nome acessível do diálogo. */
  label?: string
  /** Folga entre o alvo e a borda do recorte, em px. */
  spotlightPadding?: number
  /** Permite sair antes do fim: mostra "Pular tour" e aceita Escape. */
  dismissible?: boolean
}

type TourMode = 'anchored' | 'center' | 'sheet'
type TourSide = 'top' | 'right' | 'bottom' | 'left'
interface Hole {
  x: number
  y: number
  w: number
  h: number
}

/** Distância entre a borda do recorte e o diálogo (inclui a seta), em px. */
const DIALOG_GAP = 12
/** Margem mínima entre o diálogo e a borda da tela, em px. */
const VIEWPORT_PADDING = 12
/** Transform do diálogo centralizado (só transform — assim ele desliza entre os modos). */
const CENTER_TRANSFORM = 'translate(calc(50vw - 50%), calc(50vh - 50%))'
/** Janela em que o recorte e o diálogo deslizam após uma troca de passo, em ms. */
const GLIDE_WINDOW = 700

/** Middleware que registra para qual alvo a posição foi calculada. */
const referenceMiddleware: Middleware = {
  name: 'orTourReference',
  fn: ({ elements }) => ({ data: { reference: elements.reference } }),
}

function resolveTarget(target: TourTarget | undefined): Element | null {
  if (!target || !canUseDOM) return null
  let element: Element | null = null
  if (typeof target === 'string') {
    try {
      element = document.querySelector(target)
    } catch {
      element = null
    }
  } else if (typeof target === 'function') {
    element = target()
  } else {
    element = target.current
  }
  return element?.isConnected ? element : null
}

/** O alvo (com a folga do recorte) está inteiro na tela? Elementos sem caixa contam como visíveis. */
function isFullyVisible(element: Element, margin: number) {
  const rect = element.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return true
  return (
    rect.top >= margin &&
    rect.left >= margin &&
    rect.bottom <= window.innerHeight - margin &&
    rect.right <= window.innerWidth - margin
  )
}

/** Espera o alvo parar de se mover (fim da rolagem suave) e chama `done`. */
function waitForScrollEnd(element: Element, done: () => void) {
  let frame = 0
  let last = ''
  let stableFrames = 0
  const start = performance.now()
  const tick = () => {
    const rect = element.getBoundingClientRect()
    const key = `${Math.round(rect.top)}:${Math.round(rect.left)}`
    stableFrames = key === last ? stableFrames + 1 : 0
    last = key
    if (stableFrames >= 3 || performance.now() - start > 1000) {
      done()
      return
    }
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}

/**
 * Escreve o recorte como variáveis CSS na raiz (sem re-renderizar o React a
 * cada quadro de rolagem). Sem alvo, o recorte se fecha num ponto.
 */
function paintSpotlight(
  root: HTMLElement,
  target: Element | null,
  padding: number,
  lastHole: { current: Hole | null },
) {
  const vw = root.clientWidth || window.innerWidth
  const vh = root.clientHeight || window.innerHeight
  let hole: Hole
  if (target) {
    const rect = target.getBoundingClientRect()
    const left = clamp(Math.floor(rect.left - padding), 0, vw)
    const top = clamp(Math.floor(rect.top - padding), 0, vh)
    const right = clamp(Math.ceil(rect.right + padding), left, vw)
    const bottom = clamp(Math.ceil(rect.bottom + padding), top, vh)
    hole = { x: left, y: top, w: right - left, h: bottom - top }
  } else {
    const previous = lastHole.current
    hole = {
      x: Math.round(previous ? previous.x + previous.w / 2 : vw / 2),
      y: Math.round(previous ? previous.y + previous.h / 2 : vh / 2),
      w: 0,
      h: 0,
    }
  }
  lastHole.current = hole
  const style = root.style
  style.setProperty('--_hx', String(hole.x))
  style.setProperty('--_hy', String(hole.y))
  style.setProperty('--_hw', String(hole.w))
  style.setProperty('--_hh', String(hole.h))
  // Telas estreitas: a folha fica na metade oposta à do alvo.
  root.setAttribute('data-dock', target && hole.y + hole.h / 2 > vh / 2 ? 'top' : 'bottom')
}

/**
 * Tour guiado (onboarding com spotlight): apresenta novidades passo a passo,
 * destacando cada elemento com um recorte na tela escurecida. Cada passo é um
 * diálogo modal — o foco fica preso, vai para o título a cada passo e volta
 * para onde estava ao fechar. O alvo destacado não recebe cliques enquanto o
 * tour está aberto.
 */
export const Tour = forwardRef<HTMLDivElement, TourProps>(function Tour(
  {
    steps,
    open,
    defaultOpen = false,
    onOpenChange,
    step: stepProp,
    defaultStep = 0,
    onStepChange,
    onFinish,
    onSkip,
    label,
    spotlightPadding = 8,
    dismissible = true,
    className,
    onKeyDown,
    onFocus,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const mounted = useMounted()
  const reducedMotion = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 40rem)')
  const total = steps.length
  const lastIndex = Math.max(0, total - 1)
  devWarning(total === 0, 'Tour precisa de pelo menos um passo em `steps`.')

  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const active = isOpen && mounted && total > 0
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(active)

  // Passo pedido (controlado ou não) × passo exibido: a troca espera a rolagem até o novo alvo.
  const silentRef = useRef(false)
  const [requestedStep, setRequestedStep] = useControllableState({
    value: stepProp,
    defaultValue: defaultStep,
    onChange: (value: number) => {
      if (!silentRef.current) onStepChange?.(value)
    },
  })
  const requestedIndex = clamp(requestedStep, 0, lastIndex)
  const [shownIndex, setShownIndex] = useState(requestedIndex)
  const [glide, setGlide] = useState(false)
  const openerRef = useRef<Element | null>(null)
  const [wasActive, setWasActive] = useState(active)
  if (wasActive !== active) {
    setWasActive(active)
    if (active) {
      if (canUseDOM) openerRef.current = document.activeElement
      setShownIndex(requestedIndex)
      setGlide(false)
    }
  }
  const index = clamp(shownIndex, 0, lastIndex)
  const current = steps[index] as TourStep | undefined
  const isFirst = index === 0
  const isLast = index === lastIndex

  const labelId = useId('or-tour-label')
  const titleId = useId('or-tour-title')
  const contentId = useId('or-tour-content')

  const rootRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const arrowRef = useRef<HTMLSpanElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const holeRef = useRef<Hole | null>(null)
  const lastTransformRef = useRef<string | undefined>(undefined)
  const [positionerEl, setPositionerEl] = useState<HTMLDivElement | null>(null)

  // Alvo do passo exibido. Resolvido a cada render (refs, seletores e funções
  // podem mudar) — no layout effect e de novo no passivo, quando todas as refs
  // da página já foram ligadas. Durante a saída, o último alvo é mantido.
  const [target, setTarget] = useState<Element | null>(null)
  const targetRef = useRef<Element | null>(null)
  const stepTarget = current?.target
  const syncTarget = () => {
    if (!active) return
    const element = resolveTarget(stepTarget)
    if (element !== targetRef.current) {
      targetRef.current = element
      setTarget(element)
    }
  }
  useIsomorphicLayoutEffect(syncTarget)
  useEffect(syncTarget)

  const scrollBehavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth'

  // Troca de passo: rola o novo alvo para a vista e só então mostra o passo.
  useIsomorphicLayoutEffect(() => {
    if (!active || requestedIndex === shownIndex) return
    const commit = () => {
      setGlide(true)
      setShownIndex(requestedIndex)
    }
    const next = resolveTarget(steps[requestedIndex]?.target)
    if (!next || isFullyVisible(next, spotlightPadding)) {
      commit()
      return
    }
    next.scrollIntoView({ block: 'center', inline: 'nearest', behavior: scrollBehavior })
    // Movimento reduzido: a rolagem é instantânea, nada a esperar.
    if (reducedMotion) {
      commit()
      return
    }
    return waitForScrollEnd(next, commit)
  }, [active, requestedIndex, shownIndex])

  // Ao abrir (ou se o alvo mudar), garante que ele esteja na tela.
  useEffect(() => {
    if (!active || !target) return
    if (!isFullyVisible(target, spotlightPadding))
      target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: scrollBehavior })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target])

  // O recorte e o diálogo só deslizam logo após uma troca de passo; fora disso
  // (rolagem, redimensionamento) acompanham o alvo sem atraso.
  useEffect(() => {
    if (!glide) return
    const timer = window.setTimeout(() => setGlide(false), GLIDE_WINDOW)
    return () => window.clearTimeout(timer)
  }, [glide, index])

  // Passo não controlado: ao fechar, volta ao passo inicial (sem disparar onStepChange).
  const openedOnceRef = useRef(false)
  useEffect(() => {
    if (active) {
      openedOnceRef.current = true
      return
    }
    if (!openedOnceRef.current || stepProp !== undefined) return
    silentRef.current = true
    setRequestedStep(defaultStep)
    silentRef.current = false
  }, [active, stepProp, defaultStep, setRequestedStep])

  // Foco: ao abrir vai para o título (useFocusTrap) e volta para quem estava focado ao fechar.
  useFocusTrap(dialogRef, active, { initialFocus: headingRef })

  // A cada troca de passo, o foco vai para o título do novo passo.
  const focusedIndexRef = useRef<number | null>(null)
  useEffect(() => {
    if (!active) {
      focusedIndexRef.current = null
      return
    }
    if (focusedIndexRef.current === null) {
      focusedIndexRef.current = index
      return
    }
    if (focusedIndexRef.current === index) return
    focusedIndexRef.current = index
    focusElement(headingRef.current ?? dialogRef.current)
  }, [active, index])

  const close = () => setOpen(false)
  const finish = () => {
    onFinish?.()
    close()
  }
  const skip = () => {
    onSkip?.(index)
    close()
  }
  const goNext = () => {
    if (isLast) finish()
    else setRequestedStep(index + 1)
  }
  const goBack = () => {
    if (!isFirst) setRequestedStep(index - 1)
  }

  // Camada modal: Escape (se dispensável) e foco que escapa voltam para o diálogo.
  const { setNode, layerProps } = useLayer(active, {
    modal: true,
    onEscape: dismissible ? () => skip() : undefined,
    onFocusOutside: () =>
      focusElement(lastFocusedRef.current?.isConnected ? lastFocusedRef.current : dialogRef.current),
  })

  useLockBodyScroll(active)

  // Posição do diálogo.
  const mode: TourMode = narrow ? 'sheet' : target ? 'anchored' : 'center'
  const placement = current?.placement ?? 'auto'
  const floating = useFloating({
    open: present && mode === 'anchored',
    strategy: 'fixed',
    placement: placement === 'auto' ? 'bottom' : placement,
    transform: false,
    elements: {
      reference: mode === 'anchored' ? target : null,
      floating: mode === 'anchored' ? positionerEl : null,
    },
    whileElementsMounted: autoUpdate,
    middleware: [
      offsetMiddleware(spotlightPadding + DIALOG_GAP),
      placement === 'auto'
        ? autoPlacement({
            allowedPlacements: ['bottom', 'top', 'right', 'left'],
            padding: VIEWPORT_PADDING,
          })
        : flip({ padding: VIEWPORT_PADDING }),
      shift({ padding: VIEWPORT_PADDING }),
      size({
        padding: VIEWPORT_PADDING,
        apply({ availableHeight, elements }) {
          elements.floating.style.setProperty(
            '--_tour-available-height',
            `${Math.max(0, Math.floor(availableHeight))}px`,
          )
        },
      }),
      arrowMiddleware({ element: arrowRef, padding: 8 }),
      referenceMiddleware,
    ],
  })
  const side = floating.placement.split('-')[0] as TourSide
  const positionedFor = (floating.middlewareData.orTourReference as { reference?: unknown } | undefined)
    ?.reference
  const fresh = floating.isPositioned && positionedFor === target
  let transform: string | undefined
  if (mode === 'center') transform = CENTER_TRANSFORM
  else if (mode === 'anchored')
    transform = fresh
      ? `translate(${Math.round(floating.x)}px, ${Math.round(floating.y)}px)`
      : (lastTransformRef.current ?? CENTER_TRANSFORM)
  useIsomorphicLayoutEffect(() => {
    lastTransformRef.current = transform
  })
  const arrowData = floating.middlewareData.arrow
  const arrowStyle: CSSProperties = {
    left: arrowData?.x != null ? `${arrowData.x}px` : undefined,
    top: arrowData?.y != null ? `${arrowData.y}px` : undefined,
  }

  // Recorte: acompanha o alvo (rolagem, redimensionamento, mudanças de layout).
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!present || !root) return
    const paint = () => paintSpotlight(root, target, spotlightPadding, holeRef)
    if (!target) {
      paint()
      return
    }
    return autoUpdate(target, root, paint)
  }, [present, target, spotlightPadding])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.key !== 'Tab' || !event.shiftKey) return
    // Shift+Tab a partir do título (foco programático) dá a volta para o último controle.
    const dialog = dialogRef.current
    const heading = headingRef.current
    if (!dialog || !heading || document.activeElement !== heading) return
    const items = getFocusableElements(dialog).filter((el) => el.tabIndex >= 0)
    const before = items.filter(
      (el) => heading.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING,
    )
    if (before.length > 0) return
    event.preventDefault()
    focusElement(items[items.length - 1] ?? dialog)
  }

  const handleFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
    onFocus?.(event)
    if (dialogRef.current?.contains(event.target)) lastFocusedRef.current = event.target as HTMLElement
  }

  const rootRefs = useMemo(() => mergeRefs<HTMLDivElement>(rootRef, setNode), [setNode])
  const dialogRefs = useMemo(
    () => mergeRefs<HTMLDivElement>(dialogRef, nodeRef as Ref<HTMLDivElement>, ref),
    [nodeRef, ref],
  )

  const tourLabel = label ?? t('tourLabel')

  return (
    <Portal>
      {present && current && (
        <div
          ref={rootRefs}
          className="or-tour"
          data-state={state}
          data-mode={mode}
          data-spotlight={target ? 'on' : 'off'}
          data-glide={glide || undefined}
          data-theme={getThemeScope(target ?? openerRef.current)}
          inert={state === 'closed' || undefined}
          {...layerProps}
        >
          {/* Fundo escurecido com o recorte. Cobre a tela toda (inclusive o alvo): o tour é modal. */}
          <div
            className="or-tour__spotlight"
            aria-hidden="true"
            onMouseDown={(event) => event.preventDefault()}
          >
            <span className="or-tour__shade or-tour__shade--top" />
            <span className="or-tour__shade or-tour__shade--bottom" />
            <span className="or-tour__shade or-tour__shade--left" />
            <span className="or-tour__shade or-tour__shade--right" />
            <span className="or-tour__ring or-tour__ring--top" />
            <span className="or-tour__ring or-tour__ring--bottom" />
            <span className="or-tour__ring or-tour__ring--left" />
            <span className="or-tour__ring or-tour__ring--right" />
          </div>
          <div ref={setPositionerEl} className="or-tour__positioner" style={{ transform }}>
            {/* onKeyDown só gerencia o Tab (ordem de foco); o diálogo em si não é um controle. */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <div
              ref={dialogRefs}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${labelId} ${titleId}`}
              aria-describedby={contentId}
              tabIndex={-1}
              data-state={state}
              data-side={mode === 'anchored' ? side : undefined}
              className={cx('or-tour__dialog', 'or-motion-pop', className)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              {...rest}
            >
              {mode === 'anchored' && (
                <span
                  ref={arrowRef}
                  className="or-tour__arrow"
                  data-side={side}
                  style={arrowStyle}
                  aria-hidden="true"
                />
              )}
              <div className="or-tour__header">
                <p id={labelId} className="or-eyebrow or-tour__label">
                  {tourLabel}
                </p>
                {dismissible && (
                  <Button variant="ghost" size="sm" className="or-tour__skip" onClick={skip}>
                    {t('tourSkip')}
                  </Button>
                )}
              </div>
              <div className="or-tour__scroll">
                <div key={index} className="or-tour__step">
                  {current.media && <div className="or-tour__media">{current.media}</div>}
                  <div className="or-tour__body">
                    <h2 ref={headingRef} id={titleId} tabIndex={-1} className="or-tour__title">
                      {current.title}
                    </h2>
                    <div id={contentId} className="or-tour__content">
                      {current.content}
                    </div>
                  </div>
                </div>
              </div>
              <div className="or-tour__footer">
                {/* Um passo só (anúncio): sem contador nem pontos. */}
                {total > 1 && (
                  <div className="or-tour__progress">
                    <span className="or-tour__dots" aria-hidden="true">
                      {steps.map((_, i) => (
                        <span
                          key={i}
                          className="or-tour__dot"
                          data-state={i < index ? 'complete' : i === index ? 'current' : 'upcoming'}
                        />
                      ))}
                    </span>
                    <span className="or-tour__counter">
                      {t('tourStepCounter', { current: index + 1, total })}
                    </span>
                  </div>
                )}
                <div className="or-tour__actions">
                  {!isFirst && (
                    <Button variant="outline" size="sm" onClick={goBack}>
                      {t('tourBack')}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    endIcon={isLast ? undefined : <Icon name="arrow-right" />}
                    onClick={goNext}
                  >
                    {isLast ? t('finish') : t('next')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Portal>
  )
})
