/**
 * Peças internas compartilhadas por Combobox e MultiSelect (não exportadas
 * pela biblioteca): normalização de texto, destaque do trecho buscado,
 * posicionamento do popup, região de anúncios e o item de opção.
 */
import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react-dom'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect, usePresence } from '../../hooks'
import { Icon } from '../../icons'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './ListboxPopup.css'

export interface ListboxOptionData {
  value: string
  label: string
  disabled?: boolean
  description?: string
}

/** Remove acentos e caixa para comparar textos ("São" casa com "sao"). */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Filtro padrão: o rótulo (ou a descrição) contém o texto buscado, ignorando acentos. */
export function defaultOptionFilter(option: ListboxOptionData, query: string): boolean {
  const q = normalizeText(query.trim())
  if (!q) return true
  return (
    normalizeText(option.label).includes(q) ||
    (option.description ? normalizeText(option.description).includes(q) : false)
  )
}

/** Localiza `query` em `text` ignorando acentos e devolve [início, fim] no texto original. */
function findMatch(text: string, query: string): [number, number] | null {
  const q = normalizeText(query.trim())
  if (!q) return null
  let normalized = ''
  const map: number[] = []
  for (let i = 0; i < text.length; i++) {
    const n = normalizeText(text[i])
    for (let j = 0; j < n.length; j++) map.push(i)
    normalized += n
  }
  const start = normalized.indexOf(q)
  if (start < 0) return null
  return [map[start], map[start + q.length - 1] + 1]
}

/** Destaca (com <mark>) o trecho do rótulo que corresponde à busca. */
export function HighlightMatch({ text, query }: { text: string; query: string }) {
  const match = findMatch(text, query)
  if (!match) return <>{text}</>
  const [start, end] = match
  return (
    <>
      {text.slice(0, start)}
      <mark className="or-combobox-option__match">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  )
}

/** Próximo índice habilitado a partir de `from`, andando `step` (±1), com volta. */
export function nextEnabledIndex(
  items: { disabled?: boolean }[],
  from: number,
  step: 1 | -1,
  loop = true,
): number {
  const count = items.length
  if (count === 0) return -1
  let index = from
  for (let i = 0; i < count; i++) {
    index += step
    if (index >= count) {
      if (!loop) return from
      index = 0
    } else if (index < 0) {
      if (!loop) return from
      index = count - 1
    }
    if (!items[index].disabled) return index
  }
  return -1
}

export function firstEnabledIndex(items: { disabled?: boolean }[]): number {
  return items.findIndex((item) => !item.disabled)
}

export function lastEnabledIndex(items: { disabled?: boolean }[]): number {
  for (let i = items.length - 1; i >= 0; i--) if (!items[i].disabled) return i
  return -1
}

/**
 * Posiciona o popup sob o controle (com `flip`/`shift`), iguala a largura e
 * limita a altura ao espaço disponível. Também copia o `data-theme` mais
 * próximo do controle, para que o popup (renderizado no `body`) siga o tema
 * de uma área com tema próprio.
 *
 * Movimento: com `usePresence`, o popup continua montado durante a animação
 * de saída (`present` + `data-state`). `side` indica para que lado ele abriu
 * (a entrada desliza a partir do campo). O posicionamento usa `left/top`
 * (`transform: false`) para que o `transform` fique livre para a animação.
 */
export function useListboxPopup(open: boolean) {
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(open)
  const { refs, floatingStyles, elements, placement } = useFloating({
    open: present,
    placement: 'bottom-start',
    strategy: 'fixed',
    transform: false,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements: els }) {
          els.floating.style.width = `${rects.reference.width}px`
          els.floating.style.maxHeight = `${Math.max(140, Math.min(320, availableHeight))}px`
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })
  const [theme, setTheme] = useState<string>()
  useIsomorphicLayoutEffect(() => {
    if (!open) return
    const reference = elements.reference as HTMLElement | null
    setTheme(reference?.closest?.('[data-theme]')?.getAttribute('data-theme') ?? undefined)
  }, [open, elements.reference])
  const side = placement.startsWith('top') ? 'top' : 'bottom'
  return { refs, floatingStyles, theme, present, state, nodeRef, side }
}

/**
 * Congela o conteúdo enquanto `frozen` for verdadeiro: durante a saída do
 * popup, a lista não pode mudar (ex.: a busca é limpa ao escolher) — senão
 * o conteúdo "pisca" antes de sumir.
 */
export function Freeze({ frozen, children }: { frozen: boolean; children: ReactNode }) {
  const last = useRef(children)
  if (!frozen) last.current = children
  return <>{last.current}</>
}

/**
 * Região `role="status"` para anúncios de leitores de tela (contagem de
 * resultados, itens adicionados/removidos). Mensagens repetidas são
 * reanunciadas.
 */
export function useAnnouncer() {
  const [message, setMessage] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const announce = useCallback((text: string, delay = 0) => {
    clearTimeout(timer.current)
    const run = () => setMessage((prev) => (prev === text ? `${text}\u00a0` : text))
    if (delay > 0) timer.current = setTimeout(run, delay)
    else run()
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  const region = (
    <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
      {message}
    </VisuallyHidden>
  )
  return { announce, region }
}

/**
 * Mantém a opção ativa visível ao navegar por teclado. Devolve a ref da lista:
 * ao abrir, a lista (no portal) só é montada depois que a opção ativa muda e
 * só ganha a altura final depois do posicionamento (com movimento reduzido,
 * um quadro depois) — por isso a opção ativa (a última, com ArrowUp, ou a
 * escolhida) é revelada também sempre que a lista muda de tamanho.
 */
export function useScrollActiveIntoView(activeId: string | undefined) {
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId
  useEffect(() => {
    if (!activeId) return
    document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' })
  }, [activeId])

  const observer = useRef<ResizeObserver | null>(null)
  return useCallback((list: HTMLElement | null) => {
    observer.current?.disconnect()
    observer.current = null
    if (!list || typeof ResizeObserver === 'undefined') return
    observer.current = new ResizeObserver(() => {
      const id = activeIdRef.current
      if (id) list.ownerDocument.getElementById(id)?.scrollIntoView?.({ block: 'nearest' })
    })
    observer.current.observe(list)
  }, [])
}

export interface ListboxOptionItemProps {
  id: string
  option: ListboxOptionData
  active: boolean
  selected: boolean
  disabled?: boolean
  multiple?: boolean
  query: string
  onSelect: () => void
  onHover: () => void
  children?: ReactNode
}

/** Item `role="option"` usado pelos popups do Combobox e do MultiSelect. */
export function ListboxOptionItem({
  id,
  option,
  active,
  selected,
  disabled,
  multiple,
  query,
  onSelect,
  onHover,
}: ListboxOptionItemProps) {
  // O check só "pula" quando a seleção muda com a lista aberta (não ao abrir).
  const initialSelected = useRef(selected)
  const toggled = useRef(false)
  if (selected !== initialSelected.current) toggled.current = true
  return (
    // A opção é operada pelo teclado a partir do campo (aria-activedescendant); o clique é o atalho do mouse.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      id={id}
      role="option"
      // Nome explícito: o destaque da busca (<mark>) não deve fragmentar a leitura.
      aria-label={option.description ? `${option.label}, ${option.description}` : option.label}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-active={active || undefined}
      data-pop={(toggled.current && selected) || undefined}
      className={cx('or-combobox-option', multiple && 'or-combobox-option--multiple')}
      // Mantém o foco no campo de texto ao clicar em uma opção.
      onMouseDown={(event) => event.preventDefault()}
      onMouseMove={() => {
        if (!active && !disabled) onHover()
      }}
      onClick={() => {
        if (!disabled) onSelect()
      }}
    >
      {multiple && (
        <span className="or-combobox-option__checkbox" aria-hidden="true">
          {selected && <Icon name="check" size={12} strokeWidth={2.5} />}
        </span>
      )}
      <span className="or-combobox-option__text">
        <span className="or-combobox-option__label">
          <HighlightMatch text={option.label} query={query} />
        </span>
        {option.description && (
          <span className="or-combobox-option__description">
            <HighlightMatch text={option.description} query={query} />
          </span>
        )}
      </span>
      {!multiple && selected && (
        <Icon name="check" size="sm" className="or-combobox-option__check" />
      )}
    </li>
  )
}
