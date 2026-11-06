import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react'
import { useId, useIsomorphicLayoutEffect, usePresence, useRovingFocus } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, getFocusableElements, mergeRefs } from '../../utils'
import { Button, type ButtonProps } from '../Button'
import { ActionGroupContext, type ActionGroupContextValue } from '../ButtonGroup/context'
import { Dropdown, type DropdownProps } from '../Dropdown/Dropdown'
import { focusElement, getThemeScope } from '../Modal/overlay'
import { Portal } from '../Portal'
import './ActionBar.css'

export type ActionBarPlacement = 'bottom' | 'top'

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Mostra a barra. O uso comum é controlado pela seleção:
   * `open={selecionados.length > 0}`.
   */
  open?: boolean
  /**
   * Quantidade de itens selecionados. Mostra "{count} selecionados"
   * (no idioma do `OrangeProvider`) e anuncia cada mudança a leitores de tela.
   */
  count?: number
  /**
   * Substitui o texto da contagem (ex.: "3 faturas selecionadas"). Em texto,
   * é ele o anunciado; se for um elemento, anuncia-se a contagem.
   */
  label?: ReactNode
  /**
   * Mostra o botão "Limpar seleção" e é chamado nele e com Escape enquanto o
   * foco estiver na barra. Normalmente limpa a seleção (o que fecha a barra).
   */
  onDismiss?: () => void
  /** Borda da tela (ou do contêiner, com `portal={false}`) onde a barra flutua. */
  placement?: ActionBarPlacement
  /**
   * `true`: fixa na viewport, centralizada, acima do conteúdo (renderizada em
   * portal). `false`: absoluta dentro do contêiner posicionado mais próximo —
   * para painéis e exemplos.
   */
  portal?: boolean
  /**
   * Elemento que recebe o foco quando a barra fecha com o foco dentro dela.
   * Padrão: o elemento focado antes de entrar na barra ou, se ele sumiu (ex.:
   * linhas excluídas), o elemento focável mais próximo antes do ActionBar.
   */
  finalFocus?: RefObject<HTMLElement | null>
}

const ITEM_SELECTOR = '[data-roving-item]'
const ENABLED_ITEM_SELECTOR = '[data-roving-item]:not([disabled])'
const ACTIONS_SELECTOR = '.or-action-bar__actions'
/**
 * Botões e links dentro das ações entram no roving tabindex mesmo quando não
 * são filhos diretos (fragmentos, componentes próprios, Tooltip…).
 */
const AUTO_ITEM_SELECTOR = `${ACTIONS_SELECTOR} :is(button, a[href]):not([data-roving-item])`

type ButtonElementProps = ButtonProps & { 'data-roving-item'?: string | boolean }

/** Campos de texto usam as setas para mover o cursor: a barra não interfere. */
function capturesArrowKeys(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (
    target.isContentEditable ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
    return true
  if (target instanceof HTMLInputElement) {
    return !['button', 'checkbox', 'reset', 'submit', 'image', 'color', 'file'].includes(
      target.type,
    )
  }
  return false
}

/** Button recebe tamanho, variante e a marca do roving tabindex (respeitando o que já tem). */
function withItemDefaults(element: ReactNode, ctx: ActionGroupContextValue): ReactNode {
  if (!isValidElement<ButtonElementProps>(element) || element.type !== Button) return element
  const own = element.props
  const extra: Partial<ButtonElementProps> = {}
  if (own.size === undefined && ctx.size) extra.size = ctx.size
  if (own.variant === undefined && ctx.variant) extra.variant = ctx.variant
  if (own['data-roving-item'] === undefined) extra['data-roving-item'] = ''
  return Object.keys(extra).length > 0 ? cloneElement(element, extra) : element
}

/**
 * Filhos diretos: `Button` e o gatilho `Button` de um `Dropdown` (menu de
 * "Mais ações") entram no roving tabindex. IconButton, SplitButton etc. leem o
 * contexto sozinhos.
 */
function applyActionDefaults(children: ReactNode, ctx: ActionGroupContextValue): ReactNode {
  return Children.map(children, (child) => {
    if (isValidElement<DropdownProps>(child) && child.type === Dropdown) {
      const trigger = withItemDefaults(child.props.trigger, ctx) as ReactElement
      return trigger === child.props.trigger ? child : cloneElement(child, { trigger })
    }
    return withItemDefaults(child, ctx)
  })
}

function formatCount(count: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale).format(count)
  } catch {
    return String(count)
  }
}

/** `a` vem antes de `b` na ordem do documento (ancestrais vêm antes dos descendentes). */
function isBefore(a: Node, b: Node) {
  return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}

function isVisible(el: HTMLElement) {
  return typeof el.checkVisibility === 'function' ? el.checkVisibility() : true
}

/** Elementos alcançáveis por Tab na página, fora de `exclude`, na ordem do DOM. */
function getTabbables(exclude: HTMLElement | null) {
  return getFocusableElements(document.body).filter(
    (el) => el.tabIndex >= 0 && !exclude?.contains(el) && !el.closest('[hidden]') && isVisible(el),
  )
}

/** Ainda dá para focar? (conectado, fora de `inert`, habilitado e visível). */
function canFocus(el: HTMLElement | null | undefined): el is HTMLElement {
  return (
    !!el && el.isConnected && !el.closest('[inert]') && !el.matches(':disabled') && isVisible(el)
  )
}

/**
 * Barra flutuante de ações em lote: aparece quando há itens selecionados
 * (Table, TreeView, CheckboxGroup, SortableList…) com a contagem, as ações e
 * um botão para limpar a seleção. É um `role="toolbar"` com roving tabindex;
 * aparecer não rouba o foco e a contagem é anunciada numa região viva educada.
 */
export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  {
    open = false,
    count,
    label,
    onDismiss,
    placement = 'bottom',
    portal = true,
    finalFocus,
    className,
    children,
    onKeyDown,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const labelId = useId('or-action-bar-label')
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(open)
  const closing = state === 'closed'

  const barRef = useRef<HTMLDivElement | null>(null)
  const [barEl, setBarEl] = useState<HTMLDivElement | null>(null)
  /**
   * Região viva, sempre montada no lugar onde o ActionBar foi declarado.
   * Também marca a posição da barra na ordem de foco (útil em portal).
   */
  const anchorRef = useRef<HTMLSpanElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null)
  const barRefs = useMemo(
    () => mergeRefs<HTMLDivElement>(ref, barRef, nodeRef, setBarEl),
    [ref, nodeRef],
  )
  const anchorRefs = useMemo(() => mergeRefs<HTMLSpanElement>(anchorRef, setAnchorEl), [])

  /* Texto e anúncio -------------------------------------------------------- */

  const countText =
    count === undefined
      ? ''
      : count === 1
        ? t('actionBarCountOne')
        : t('actionBarCount', { count: formatCount(count, locale) })
  const text = label ?? (count !== undefined ? countText : null)
  const hasText = text !== null && text !== undefined && text !== false && text !== ''
  // Anuncia o que está escrito: o `label` em texto ou, se ele for um elemento, a contagem.
  const announceText =
    typeof label === 'string' || typeof label === 'number' ? String(label) : countText

  // Só muda quando o texto muda (abrir ou nova contagem) — não a cada render.
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => {
    setAnnouncement(open ? announceText : '')
  }, [open, announceText])

  /* Roving tabindex -------------------------------------------------------- */

  const activeItemRef = useRef<HTMLElement | null>(null)
  const roving = useRovingFocus(barRef, {
    orientation: 'horizontal',
    loop: true,
    selector: ENABLED_ITEM_SELECTOR,
  })

  /** Uma única parada de Tab: o último item focado ou, de início, a primeira ação. */
  const syncTabStops = useCallback(() => {
    const bar = barRef.current
    if (!bar) return
    for (const el of bar.querySelectorAll(AUTO_ITEM_SELECTOR))
      el.setAttribute('data-roving-item', '')
    const items = Array.from(bar.querySelectorAll<HTMLElement>(ITEM_SELECTOR))
    const enabled = items.filter((el) => !el.hasAttribute('disabled'))
    if (!activeItemRef.current || !enabled.includes(activeItemRef.current)) {
      const actions = bar.querySelector(ACTIONS_SELECTOR)
      activeItemRef.current = enabled.find((el) => actions?.contains(el)) ?? enabled[0] ?? null
    }
    for (const el of items) {
      const value = el === activeItemRef.current ? '0' : '-1'
      if (el.getAttribute('tabindex') !== value) el.setAttribute('tabindex', value)
    }
  }, [])

  useIsomorphicLayoutEffect(syncTabStops)

  // Ações podem surgir, sumir ou ser desabilitadas sem que a barra renderize.
  useEffect(() => {
    if (!barEl || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(syncTabStops)
    observer.observe(barEl, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'data-roving-item'],
    })
    return () => observer.disconnect()
  }, [barEl, syncTabStops])

  /** Paradas de Tab da barra (normalmente só o item ativo do roving tabindex). */
  const getBarTabbables = useCallback(() => {
    const bar = barRef.current
    if (!bar) return []
    syncTabStops()
    return getFocusableElements(bar).filter((el) => el.tabIndex >= 0 && isVisible(el))
  }, [syncTabStops])

  /* Foco ------------------------------------------------------------------- */

  /** Elemento focado antes de entrar na barra. */
  const lastOutsideRef = useRef<HTMLElement | null>(null)
  const focusWithinRef = useRef(false)
  /** Elementos que receberam foco pela árvore React da barra (inclui menus em portal). */
  const treeFocusRef = useRef(new WeakSet<EventTarget>())

  const isInBar = useCallback(
    (node: EventTarget | null) =>
      node instanceof Node && (!!barRef.current?.contains(node) || treeFocusRef.current.has(node)),
    [],
  )

  const finalFocusRef = useRef(finalFocus)
  finalFocusRef.current = finalFocus

  /**
   * A barra fechou (ou está saindo) com o foco dentro: o foco volta para
   * `finalFocus`, para onde estava antes de entrar na barra ou, se esse
   * elemento sumiu, para o focável mais próximo antes do ActionBar (depois,
   * se não houver) — nunca fica perdido no `<body>`.
   */
  const restoreFocus = useCallback(() => {
    focusWithinRef.current = false
    const bar = barRef.current
    const preferred = [finalFocusRef.current?.current, lastOutsideRef.current].find(
      (el) => !isInBar(el ?? null) && canFocus(el),
    )
    let target = preferred ?? null
    const anchor = anchorRef.current
    if (!target && anchor) {
      const list = getTabbables(bar)
      target =
        [...list].reverse().find((el) => isBefore(el, anchor)) ??
        list.find((el) => isBefore(anchor, el)) ??
        null
    }
    if (target) focusElement(target)
    else if (isInBar(document.activeElement)) (document.activeElement as HTMLElement).blur()
  }, [isInBar])

  // Fechou com o foco dentro (Excluir, Limpar seleção, Escape…). Roda no
  // commit em que `open` vira false: a barra ainda está montada (saída
  // animada) e o DOM já reflete a mudança (ex.: linhas removidas).
  const wasOpenRef = useRef(open)
  useIsomorphicLayoutEffect(() => {
    const wasOpen = wasOpenRef.current
    wasOpenRef.current = open
    if (open) {
      if (!wasOpen) lastOutsideRef.current = null
      return
    }
    if (!wasOpen) return
    const active = document.activeElement
    const inside = active && active !== document.body ? isInBar(active) : focusWithinRef.current
    if (inside) restoreFocus()
  }, [open, isInBar, restoreFocus])

  // Desmontado aberto (ex.: `{n > 0 && <ActionBar open />}`): a mesma regra.
  // O cleanup de layout roda antes de o React remover os nós do DOM.
  useIsomorphicLayoutEffect(
    () => () => {
      if (wasOpenRef.current && isInBar(document.activeElement)) restoreFocus()
    },
    [isInBar, restoreFocus],
  )

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event)
    treeFocusRef.current.add(event.target)
    // Algo devolveu o foco para a barra que está saindo (ex.: um diálogo de
    // confirmação aberto por "Excluir"): repassa para fora.
    if (closing) {
      restoreFocus()
      return
    }
    const from = event.relatedTarget
    if (from instanceof HTMLElement && !isInBar(from)) lastOutsideRef.current = from
    focusWithinRef.current = true
    const bar = barRef.current
    const target = event.target
    const item = target instanceof HTMLElement ? target.closest<HTMLElement>(ITEM_SELECTOR) : null
    if (item && bar?.contains(item) && item !== activeItemRef.current) {
      activeItemRef.current = item
      syncTabStops()
    }
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event)
    const to = event.relatedTarget
    if (to instanceof Node && !isInBar(to)) focusWithinRef.current = false
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    const bar = barRef.current
    if (event.defaultPrevented || !bar) return
    // Eventos de portais (ex.: o menu de um Dropdown) borbulham pela árvore React.
    if (!bar.contains(event.target as Node)) return
    if (event.key === 'Escape') {
      if (!onDismiss || closing || event.nativeEvent.isComposing) return
      // Para aqui: um Drawer ou Modal por baixo não deve fechar junto.
      event.preventDefault()
      event.stopPropagation()
      onDismiss()
      return
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (capturesArrowKeys(event.target)) return
    roving(event)
  }

  // Em portal, a barra vive no fim do <body>, mas a ordem de Tab a trata como
  // se estivesse no lugar onde o ActionBar foi declarado (logo depois da
  // tabela, por exemplo): Tab entra nela a partir do elemento anterior e sai
  // dela para o elemento seguinte (e o inverso com Shift+Tab).
  useEffect(() => {
    if (!portal || !open || !barEl) return
    const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Tab' || event.defaultPrevented) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const anchor = anchorRef.current
      const active = document.activeElement
      if (!anchor || !(active instanceof HTMLElement) || active === document.body) return
      const list = getTabbables(barEl)
      if (barEl.contains(active)) {
        // Ainda há uma parada de Tab na barra nessa direção (ex.: um campo): o Tab segue normal.
        const inner = getBarTabbables()
        const index = inner.indexOf(active)
        const atEdge = event.shiftKey ? index <= 0 : index === -1 || index === inner.length - 1
        if (!atEdge) return
        const target = event.shiftKey
          ? [...list].reverse().find((el) => isBefore(el, anchor))
          : list.find((el) => isBefore(anchor, el))
        if (target) {
          event.preventDefault()
          focusElement(target)
        }
        return
      }
      let crosses: boolean
      if (event.shiftKey) {
        const previous = [...list].reverse().find((el) => el !== active && isBefore(el, active))
        crosses = isBefore(anchor, active) && (!previous || isBefore(previous, anchor))
      } else {
        const next = list.find((el) => el !== active && isBefore(active, el))
        crosses = isBefore(active, anchor) && (!next || isBefore(anchor, next))
      }
      if (!crosses) return
      const inner = getBarTabbables()
      const stop = event.shiftKey ? inner[inner.length - 1] : inner[0]
      if (!stop) return
      event.preventDefault()
      focusElement(stop)
    }
    document.addEventListener('keydown', onDocumentKeyDown)
    return () => document.removeEventListener('keydown', onDocumentKeyDown)
  }, [portal, open, barEl, getBarTabbables])

  /* Render ----------------------------------------------------------------- */

  const ctx = useMemo<ActionGroupContextValue>(
    () => ({ size: 'sm', variant: 'ghost', orientation: 'horizontal', roving: true }),
    [],
  )
  const hasActions = Children.toArray(children).length > 0
  const ariaLabel =
    rest['aria-label'] ?? (rest['aria-labelledby'] ? undefined : t('actionBarLabel'))

  const bar = present ? (
    <div
      className={cx(
        'or-action-bar-region',
        `or-action-bar-region--${placement}`,
        portal ? 'or-action-bar-region--fixed' : 'or-action-bar-region--inline',
      )}
      data-theme={portal ? getThemeScope(anchorEl) : undefined}
    >
      <div
        ref={barRefs}
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={ariaLabel}
        aria-describedby={hasText ? labelId : undefined}
        data-state={state}
        data-placement={placement}
        className={cx('or-action-bar', className)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        {(hasText || onDismiss) && (
          <div className="or-action-bar__selection">
            {hasText && (
              <span id={labelId} className="or-action-bar__count">
                {text}
              </span>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={t('actionBarClear')}
                startIcon={<Icon name="close" size="sm" />}
                className="or-action-bar__clear"
                data-roving-item=""
                onClick={onDismiss}
              />
            )}
          </div>
        )}
        {hasActions && (
          <div className="or-action-bar__actions">{applyActionDefaults(children, ctx)}</div>
        )}
      </div>
    </div>
  ) : null

  return (
    <ActionGroupContext.Provider value={ctx}>
      <span
        ref={anchorRefs}
        className="or-visually-hidden or-action-bar__live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </span>
      <Portal disabled={!portal}>{bar}</Portal>
    </ActionGroupContext.Provider>
  )
})
