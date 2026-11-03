import { forwardRef, Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { useLocale } from '../../providers'
import type { MessageKey } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Kbd.css'

export type KbdSize = 'sm' | 'md'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /**
   * Combinação de teclas: `['Ctrl', 'K']`. Nomes reconhecidos: `Mod` (Ctrl ou
   * ⌘), `Meta`/`Cmd`, `Ctrl`, `Alt`/`Option`, `Shift`, `Enter`, `Backspace`,
   * `Delete`, `Esc`, `Tab`, `Space`, `ArrowUp`/`Down`/`Left`/`Right`.
   */
  keys?: string[]
  /** Separador visual entre as teclas. Padrão: `+`. */
  separator?: ReactNode
  /** Usa os símbolos do macOS (⌘ ⌥ ⇧ ⌃), com rótulos acessíveis. */
  symbols?: boolean
  /** Tamanho: `sm` (20px) ou `md` (24px, padrão). */
  size?: KbdSize
}

interface KeyInfo {
  /** Texto visível. */
  text: string
  /** Nome falado (quando o texto é um símbolo). */
  label?: string
}

type Resolver = (symbols: boolean, t: (key: MessageKey) => string) => KeyInfo

const KEYS: Record<string, Resolver> = {
  mod: (s) => (s ? { text: '⌘', label: 'Command' } : { text: 'Ctrl' }),
  meta: (s) => (s ? { text: '⌘', label: 'Command' } : { text: 'Cmd' }),
  ctrl: (s) => (s ? { text: '⌃', label: 'Control' } : { text: 'Ctrl' }),
  alt: (s) => (s ? { text: '⌥', label: 'Option' } : { text: 'Alt' }),
  shift: (s) => (s ? { text: '⇧', label: 'Shift' } : { text: 'Shift' }),
  enter: (s) => (s ? { text: '↵', label: 'Enter' } : { text: 'Enter' }),
  backspace: (s) => (s ? { text: '⌫', label: 'Backspace' } : { text: 'Backspace' }),
  delete: (s) => (s ? { text: '⌦', label: 'Delete' } : { text: 'Delete' }),
  tab: (s) => (s ? { text: '⇥', label: 'Tab' } : { text: 'Tab' }),
  capslock: (s) => (s ? { text: '⇪', label: 'Caps Lock' } : { text: 'Caps Lock' }),
  escape: () => ({ text: 'Esc' }),
  space: (_, t) => ({ text: t('keySpace') }),
  arrowup: (_, t) => ({ text: '↑', label: t('keyArrowUp') }),
  arrowdown: (_, t) => ({ text: '↓', label: t('keyArrowDown') }),
  arrowleft: (_, t) => ({ text: '←', label: t('keyArrowLeft') }),
  arrowright: (_, t) => ({ text: '→', label: t('keyArrowRight') }),
}

const ALIASES: Record<string, string> = {
  cmd: 'meta',
  command: 'meta',
  '⌘': 'meta',
  control: 'ctrl',
  option: 'alt',
  opt: 'alt',
  return: 'enter',
  del: 'delete',
  esc: 'escape',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  ' ': 'space',
  spacebar: 'space',
}

function resolveKey(name: string, symbols: boolean, t: (key: MessageKey) => string): KeyInfo {
  const normalized = name.toLowerCase()
  const resolver = KEYS[ALIASES[normalized] ?? normalized]
  if (resolver) return resolver(symbols, t)
  return { text: name.length === 1 ? name.toUpperCase() : name }
}

/**
 * Representa teclas e atalhos de teclado (`<kbd>`). Use `keys` para
 * combinações; símbolos do macOS ganham nomes acessíveis.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, separator = '+', symbols = false, size = 'md', className, children, ...rest },
  ref,
) {
  const { t } = useLocale()

  if (!keys) {
    return (
      <kbd ref={ref} className={cx('or-kbd', 'or-kbd__key', `or-kbd--${size}`, className)} {...rest}>
        {children}
      </kbd>
    )
  }

  return (
    <kbd ref={ref} className={cx('or-kbd', 'or-kbd--combo', `or-kbd--${size}`, className)} {...rest}>
      {keys.map((name, index) => {
        const { text, label } = resolveKey(name, symbols, t)
        return (
          <Fragment key={`${name}-${index}`}>
            {index > 0 && separator !== null && separator !== '' && (
              <span className="or-kbd__separator">{separator}</span>
            )}
            {label ? (
              <kbd className="or-kbd__key or-kbd__key--symbol" title={label}>
                <span aria-hidden="true">{text}</span>
                <VisuallyHidden>{label}</VisuallyHidden>
              </kbd>
            ) : (
              <kbd className="or-kbd__key">{text}</kbd>
            )}
          </Fragment>
        )
      })}
    </kbd>
  )
})
