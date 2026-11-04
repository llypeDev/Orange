import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect, useReducedMotion } from '../../hooks'
import { composeEventHandlers, cx, mergeRefs } from '../../utils'
import type { HeadingLevel } from '../Typography'
import './Accordion.css'

export type AccordionType = 'single' | 'multiple'
export type AccordionVariant = 'outline' | 'flush'

interface AccordionContextValue {
  type: AccordionType
  collapsible: boolean
  disabled: boolean
  headingLevel: HeadingLevel
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

interface AccordionItemContextValue {
  value: string
  open: boolean
  disabled: boolean
  triggerId: string
  contentId: string
}

const AccordionContext = createContext<AccordionContextValue | null>(null)
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

function useAccordionContext(component: string) {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error(`${component} precisa estar dentro de <Accordion>.`)
  return ctx
}

function useAccordionItemContext(component: string) {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) throw new Error(`${component} precisa estar dentro de <AccordionItem>.`)
  return ctx
}

interface AccordionBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Nível semântico dos cabeçalhos (`h2`–`h6`). Padrão: 3. */
  headingLevel?: HeadingLevel
  /** Desabilita todos os itens. */
  disabled?: boolean
  /** `outline` (caixa com borda, padrão) ou `flush` (apenas divisórias). */
  variant?: AccordionVariant
}

export interface AccordionSingleProps extends AccordionBaseProps {
  /** `single`: apenas um item aberto por vez. */
  type?: 'single'
  /** Item aberto (controlado). `null` fecha todos. */
  value?: string | null
  /** Item aberto inicialmente (não controlado). */
  defaultValue?: string | null
  onChange?: (value: string | null) => void
  /** Permite fechar o item aberto, deixando todos fechados. Padrão: `true`. */
  collapsible?: boolean
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  /** `multiple`: vários itens podem ficar abertos ao mesmo tempo. */
  type: 'multiple'
  /** Itens abertos (controlado). */
  value?: string[]
  /** Itens abertos inicialmente (não controlado). */
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  collapsible?: boolean
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps

function toArray(value: string | string[] | null | undefined): string[] | undefined {
  if (value === undefined) return undefined
  if (value === null) return []
  return Array.isArray(value) ? value : [value]
}

/**
 * Lista de seções que se expandem e recolhem (padrão "accordion" do WAI-ARIA).
 * Use com `AccordionItem`, `AccordionTrigger` e `AccordionContent`.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const {
    type = 'single',
    value,
    defaultValue,
    onChange,
    collapsible = true,
    headingLevel = 3,
    disabled = false,
    variant = 'outline',
    className,
    onKeyDown,
    children,
    ...rest
  } = props
  const multiple = type === 'multiple'

  const [openValues, setOpenValues] = useControllableState<string[]>({
    value: toArray(value),
    defaultValue: toArray(defaultValue) ?? [],
    onChange: (next) => {
      if (multiple) (onChange as ((v: string[]) => void) | undefined)?.(next)
      else (onChange as ((v: string | null) => void) | undefined)?.(next[0] ?? null)
    },
  })

  const toggle = useCallback(
    (itemValue: string) => {
      setOpenValues((prev) => {
        const isOpen = prev.includes(itemValue)
        if (multiple) return isOpen ? prev.filter((v) => v !== itemValue) : [...prev, itemValue]
        if (isOpen) return collapsible ? [] : prev
        return [itemValue]
      })
    },
    [multiple, collapsible, setOpenValues],
  )

  const context = useMemo<AccordionContextValue>(
    () => ({
      type,
      collapsible: multiple || collapsible,
      disabled,
      headingLevel,
      isOpen: (v) => openValues.includes(v),
      toggle,
    }),
    [type, multiple, collapsible, disabled, headingLevel, openValues, toggle],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const root = event.currentTarget
    const target = event.target as HTMLElement
    if (!target.hasAttribute('data-or-accordion-trigger') || target.closest('[data-or-accordion]') !== root) return
    const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-or-accordion-trigger]')).filter(
      (el) => el.closest('[data-or-accordion]') === root && !el.disabled,
    )
    const index = triggers.indexOf(target as HTMLButtonElement)
    const last = triggers.length - 1
    let next: number
    switch (event.key) {
      case 'ArrowDown':
        next = index >= last ? 0 : index + 1
        break
      case 'ArrowUp':
        next = index <= 0 ? last : index - 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = last
        break
      default:
        return
    }
    event.preventDefault()
    triggers[next]?.focus()
  }

  return (
    <AccordionContext.Provider value={context}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- onKeyDown delega ↑/↓/Home/End entre os botões de cabeçalho (padrão APG) */}
      <div
        ref={ref}
        className={cx('or-accordion', `or-accordion--${variant}`, className)}
        data-or-accordion=""
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
})

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Identificador único do item dentro do Accordion. */
  value: string
  /** Desabilita o item. */
  disabled?: boolean
}

/** Um item do Accordion: agrupa um `AccordionTrigger` e um `AccordionContent`. */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled = false, className, children, ...rest },
  ref,
) {
  const accordion = useAccordionContext('AccordionItem')
  const id = useId('or-accordion')
  const open = accordion.isOpen(value)
  const itemDisabled = accordion.disabled || disabled
  const item = useMemo<AccordionItemContextValue>(
    () => ({ value, open, disabled: itemDisabled, triggerId: `${id}-trigger`, contentId: `${id}-content` }),
    [value, open, itemDisabled, id],
  )
  return (
    <AccordionItemContext.Provider value={item}>
      <div
        ref={ref}
        className={cx('or-accordion__item', className)}
        data-state={open ? 'open' : 'closed'}
        data-disabled={itemDisabled || undefined}
        {...rest}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
})

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Sobrescreve o nível do cabeçalho definido no Accordion. */
  headingLevel?: HeadingLevel
}

/**
 * Cabeçalho do item: um `<button>` com `aria-expanded` dentro de um heading.
 * O ícone de caixa quadrada mostra "+" fechado e "−" aberto.
 */
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
  { headingLevel, className, children, onClick, ...rest },
  ref,
) {
  const accordion = useAccordionContext('AccordionTrigger')
  const item = useAccordionItemContext('AccordionTrigger')
  const Heading = `h${headingLevel ?? accordion.headingLevel}` as ElementType
  // No modo single não recolhível, o item aberto não pode ser fechado (APG).
  const locked = item.open && !accordion.collapsible
  return (
    <Heading className="or-accordion__heading">
      <button
        ref={ref}
        type="button"
        id={item.triggerId}
        className={cx('or-accordion__trigger', className)}
        aria-expanded={item.open}
        aria-controls={item.contentId}
        aria-disabled={locked || undefined}
        disabled={item.disabled}
        data-or-accordion-trigger=""
        onClick={composeEventHandlers(onClick, () => {
          if (!locked) accordion.toggle(item.value)
        })}
        {...rest}
      >
        <span className="or-accordion__title">{children}</span>
        <span className="or-accordion__icon" aria-hidden="true" />
      </button>
    </Heading>
  )
})

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>

function readDuration(el: HTMLElement, token: string, fallback: number) {
  if (typeof getComputedStyle !== 'function') return fallback
  const raw = getComputedStyle(el).getPropertyValue(token).trim()
  if (!raw) return fallback
  const n = parseFloat(raw)
  if (Number.isNaN(n)) return fallback
  return raw.endsWith('ms') ? n : n * 1000
}

/**
 * Painel do item (`role="region"` rotulado pelo cabeçalho). A altura é
 * animada ao abrir e fechar, respeitando `prefers-reduced-motion`.
 */
export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
  { className, children, ...rest },
  ref,
) {
  const item = useAccordionItemContext('AccordionContent')
  const { open } = item
  const localRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(open)
  const mounted = useRef(false)
  const animation = useRef<Animation | null>(null)
  const composedRef = useMemo(() => mergeRefs(ref, localRef), [ref])

  // Abre imediatamente; ao fechar, só esconde depois da animação.
  if (open && !visible) setVisible(true)

  useIsomorphicLayoutEffect(() => {
    const el = localRef.current
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (!el) return
    animation.current?.cancel()
    animation.current = null
    const duration = reducedMotion ? 0 : readDuration(el, '--or-duration-medium', 250)
    const canAnimate = duration > 0 && typeof el.animate === 'function'
    if (open) {
      if (!canAnimate) return
      animation.current = el.animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${el.scrollHeight}px`, opacity: 1 },
        ],
        { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    } else {
      if (!canAnimate) {
        setVisible(false)
        return
      }
      const anim = el.animate(
        [
          { height: `${el.scrollHeight}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        { duration: duration * 0.8, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
      )
      anim.onfinish = () => setVisible(false)
      animation.current = anim
    }
  }, [open])

  return (
    <div
      ref={composedRef}
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      className={cx('or-accordion__content', className)}
      data-state={open ? 'open' : 'closed'}
      hidden={!visible}
      {...rest}
    >
      <div className="or-accordion__content-inner">{children}</div>
    </div>
  )
})
