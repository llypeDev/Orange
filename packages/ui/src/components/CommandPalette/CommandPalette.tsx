import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { useDisclosure, useId } from '../../hooks'
import { Icon, type IconName } from '../../icons'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx } from '../../utils'
import { DialogShell } from '../Modal/DialogShell'
import { VisuallyHidden } from '../VisuallyHidden'
import './CommandPalette.css'

export interface CommandItem {
  /** Identificador único em toda a paleta. */
  id: string
  /** Nome do comando, em forma de ação: "Criar projeto". */
  label: string
  /** Detalhe opcional exibido abaixo do rótulo (também é pesquisável). */
  description?: string
  /** Ícone: nome da biblioteca do Orange ou um elemento. */
  icon?: IconName | ReactElement
  /** Atalho exibido à direita: `'⌘ N'` ou `['G', 'P']`. */
  shortcut?: string | string[]
  /** Sinônimos que também encontram o comando na busca. */
  keywords?: string[]
  /** Exibido, mas não pode ser escolhido. */
  disabled?: boolean
  /** Executado ao escolher o comando (depois que a paleta fecha). */
  onSelect?: () => void
}

export interface CommandGroup {
  /** Título do grupo (ex.: "Navegação"). */
  label: string
  items: CommandItem[]
}

export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'title' | 'children'> {
  /** Comandos agrupados. */
  groups: CommandGroup[]
  /** Aberta (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Aberta inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando a paleta pede para abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /**
   * Atalho global que abre/fecha a paleta: `'mod+k'` (⌘K no Mac, Ctrl+K nos
   * demais), `'ctrl+shift+p'`… Desligado por padrão.
   */
  hotkey?: string
  /** Texto de exemplo do campo de busca. */
  placeholder?: string
  /** Nome acessível da paleta. Padrão: "Paleta de comandos". */
  label?: string
  /** Mensagem quando a busca não encontra nada. Padrão: "Nenhum resultado encontrado". */
  emptyMessage?: ReactNode
  /** Chamado com o comando escolhido (além do `onSelect` do próprio item). */
  onSelect?: (item: CommandItem) => void
  /** Elemento que abre a paleta (modo não controlado). */
  trigger?: ReactElement
}

/** Remove acentos e caixa: "Configurações" → "configuracoes". */
function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function matchesHotkey(event: KeyboardEvent, hotkey: string) {
  const parts = hotkey.toLowerCase().split('+').map((part) => part.trim())
  const key = parts.pop()
  const mods = new Set(parts)
  const meta = mods.has('meta') || mods.has('cmd')
  const ctrl = mods.has('ctrl') || mods.has('control')
  if (mods.has('mod')) {
    if (!event.metaKey && !event.ctrlKey) return false
  } else if (event.metaKey !== meta || event.ctrlKey !== ctrl) {
    return false
  }
  if (event.shiftKey !== mods.has('shift')) return false
  if (event.altKey !== (mods.has('alt') || mods.has('option'))) return false
  return event.key.toLowerCase() === key
}

function toDomId(value: string) {
  return value.replace(/[^\w-]/g, '_')
}

/**
 * Paleta de comandos: um diálogo com busca para encontrar e executar ações
 * pelo teclado. Abre por um gatilho ou por um atalho global como ⌘K.
 */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(function CommandPalette(
  {
    groups,
    open,
    defaultOpen,
    onOpenChange,
    hotkey,
    placeholder,
    label,
    emptyMessage,
    onSelect,
    trigger,
    className,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const disclosure = useDisclosure({ open, defaultOpen, onOpenChange })
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const baseId = useId('or-command')
  const listboxId = `${baseId}-listbox`
  const name = label ?? t('commandPalette')

  const toggleRef = useRef(disclosure.toggle)
  toggleRef.current = disclosure.toggle
  useEffect(() => {
    if (!hotkey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || !matchesHotkey(event, hotkey)) return
      event.preventDefault()
      toggleRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hotkey])

  // A cada abertura, a busca começa do zero.
  const [wasOpen, setWasOpen] = useState(disclosure.isOpen)
  if (wasOpen !== disclosure.isOpen) {
    setWasOpen(disclosure.isOpen)
    if (disclosure.isOpen) {
      setQuery('')
      setActiveId(null)
    }
  }

  const filtered = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean)
    return groups
      .map((group, groupIndex) => ({
        ...group,
        key: `${groupIndex}`,
        items: terms.length
          ? group.items.filter((item) => {
              const haystack = normalize([item.label, item.description ?? '', ...(item.keywords ?? [])].join(' '))
              return terms.every((term) => haystack.includes(term))
            })
          : group.items,
      }))
      .filter((group) => group.items.length > 0)
  }, [groups, query])

  const enabledItems = useMemo(
    () => filtered.flatMap((group) => group.items).filter((item) => !item.disabled),
    [filtered],
  )
  const total = filtered.reduce((sum, group) => sum + group.items.length, 0)

  // Mantém um item ativo válido sempre que a lista muda.
  const active = enabledItems.find((item) => item.id === activeId) ?? enabledItems[0] ?? null
  const optionId = (item: CommandItem) => `${baseId}-option-${toDomId(item.id)}`
  const activeOptionId = active ? optionId(active) : undefined

  useEffect(() => {
    setActiveId(enabledItems[0]?.id ?? null)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!activeOptionId) return
    document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' })
  }, [activeOptionId])

  const select = (item: CommandItem) => {
    if (item.disabled) return
    // Fecha e devolve o foco antes de executar o comando (que pode abrir outro diálogo).
    flushSync(() => disclosure.close())
    item.onSelect?.()
    onSelect?.(item)
  }

  const move = (delta: 1 | -1) => {
    if (enabledItems.length === 0) return
    const index = active ? enabledItems.indexOf(active) : -1
    const next = (index + delta + enabledItems.length) % enabledItems.length
    setActiveId(enabledItems[next].id)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        move(-1)
        break
      case 'PageDown':
      case 'PageUp':
        if (enabledItems.length) {
          event.preventDefault()
          setActiveId(enabledItems[event.key === 'PageDown' ? enabledItems.length - 1 : 0].id)
        }
        break
      case 'Enter':
        if (active) {
          event.preventDefault()
          select(active)
        }
        break
    }
  }

  const announcement = !query
    ? ''
    : total === 0
      ? t('noResults')
      : total === 1
        ? t('resultsCountOne')
        : t('resultsCount', { count: total })

  const triggerElement = trigger
    ? cloneElement(trigger as ReactElement<HTMLAttributes<HTMLElement>>, {
        'aria-haspopup': 'dialog',
        onClick: composeEventHandlers(
          (trigger.props as HTMLAttributes<HTMLElement>).onClick,
          (_event: ReactMouseEvent<HTMLElement>) => disclosure.open(),
        ),
      })
    : null

  return (
    <>
      {triggerElement}
      <DialogShell
        open={disclosure.isOpen}
        onDismiss={disclosure.close}
        initialFocus={inputRef}
        rootClassName="or-command-palette-root"
        panelRef={ref}
        className={cx('or-command-palette', className)}
        aria-label={name}
        {...rest}
      >
        <div className="or-command-palette__search">
          <Icon name="search" size="md" className="or-command-palette__search-icon" />
          <input
            ref={inputRef}
            className="or-command-palette__input"
            type="text"
            role="combobox"
            aria-label={t('searchCommands')}
            aria-expanded={total > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={placeholder ?? t('searchPlaceholder')}
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="or-command-palette__results">
          <div role="listbox" id={listboxId} aria-label={name} className="or-command-palette__listbox" hidden={total === 0}>
            {filtered.map((group) => {
              const groupLabelId = `${baseId}-group-${group.key}`
              return (
                <div key={group.key} role="group" aria-labelledby={groupLabelId} className="or-command-palette__group">
                  <div id={groupLabelId} role="presentation" className="or-command-palette__group-label">
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const id = optionId(item)
                    const isActive = active?.id === item.id
                    const shortcut = typeof item.shortcut === 'string' ? item.shortcut.split(/\s+/) : item.shortcut
                    return (
                      <div
                        key={item.id}
                        id={id}
                        role="option"
                        aria-selected={isActive}
                        aria-disabled={item.disabled || undefined}
                        aria-labelledby={`${id}-label`}
                        aria-describedby={item.description ? `${id}-description` : undefined}
                        data-active={isActive || undefined}
                        className="or-command-palette__option"
                        onMouseDown={(event) => event.preventDefault()}
                        onPointerMove={() => {
                          if (!item.disabled && !isActive) setActiveId(item.id)
                        }}
                        onClick={() => select(item)}
                      >
                        {item.icon && (
                          <span className="or-command-palette__icon" aria-hidden="true">
                            {isValidElement(item.icon) ? item.icon : <Icon name={item.icon as IconName} size="sm" />}
                          </span>
                        )}
                        <span className="or-command-palette__text">
                          <span id={`${id}-label`} className="or-command-palette__label">
                            {item.label}
                          </span>
                          {item.description && (
                            <span id={`${id}-description`} className="or-command-palette__description">
                              {item.description}
                            </span>
                          )}
                        </span>
                        {shortcut && shortcut.length > 0 && (
                          <span className="or-command-palette__shortcut" aria-hidden="true">
                            {shortcut.map((key, index) => (
                              <kbd key={index}>{key}</kbd>
                            ))}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          {total === 0 && (
            <div className="or-command-palette__empty">
              <Icon name="search" size="lg" />
              <p>{emptyMessage ?? t('noResults')}</p>
            </div>
          )}
        </div>

        <div className="or-command-palette__footer" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            {t('paletteNavigate')}
          </span>
          <span>
            <kbd>↵</kbd>
            {t('paletteSelect')}
          </span>
          <span>
            <kbd>Esc</kbd>
            {t('close')}
          </span>
        </div>
        <VisuallyHidden role="status" aria-live="polite">
          {announcement}
        </VisuallyHidden>
      </DialogShell>
    </>
  )
})
