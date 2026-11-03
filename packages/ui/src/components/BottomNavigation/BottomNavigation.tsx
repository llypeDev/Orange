import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { useControllableState } from '../../hooks'
import { useLocale } from '../../providers'
import { cx, devWarning } from '../../utils'
import type { RenderLink } from '../Link'
import './BottomNavigation.css'

export interface BottomNavigationItem {
  /** Identificador do destino. */
  value: string
  /** Rótulo — sempre visível. */
  label: string
  /** Ícone (decorativo). */
  icon: ReactNode
  /** Destino. Sem `href`, o item é um botão que só chama `onChange`. */
  href?: string
  /** Contador ou ponto de notificação sobre o ícone. `true` mostra só o ponto. */
  badge?: number | boolean
  /** Texto para leitores de tela sobre o badge (ex.: "3 não lidas"). */
  badgeLabel?: string
}

export interface BottomNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** De 3 a 5 destinos principais. */
  items: BottomNavigationItem[]
  /** Destino ativo (controlado). */
  value?: string
  /** Destino ativo inicial (não controlado). */
  defaultValue?: string
  /** Chamado ao escolher um destino. */
  onChange?: (value: string) => void
  /** Prende a barra na parte inferior da janela (respeitando a área segura do iOS). */
  fixed?: boolean
  /** Renderiza os links com o componente do seu roteador. */
  renderLink?: RenderLink
}

/**
 * Barra de navegação inferior para telas pequenas: de 3 a 5 destinos
 * principais, com ícone e rótulo sempre visíveis.
 */
export const BottomNavigation = forwardRef<HTMLElement, BottomNavigationProps>(function BottomNavigation(
  {
    items,
    value: valueProp,
    defaultValue,
    onChange,
    fixed = false,
    renderLink,
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange: onChange as ((value: string | undefined) => void) | undefined,
  })

  devWarning(
    items.length < 3 || items.length > 5,
    'BottomNavigation funciona melhor com 3 a 5 destinos. Para mais opções, use um menu.',
  )

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? t('mainNavigation')}
      className={cx('or-bottom-nav', fixed && 'or-bottom-nav--fixed', className)}
      {...rest}
    >
      <ul className="or-bottom-nav__list">
        {items.map((item) => {
          const active = item.value === value
          const hiddenBadge = item.badgeLabel ?? (typeof item.badge === 'number' ? String(item.badge) : undefined)
          const content = (
            <>
              <span className="or-bottom-nav__icon" aria-hidden="true">
                {item.icon}
                {item.badge !== undefined && item.badge !== false && (
                  <span className={cx('or-bottom-nav__badge', item.badge === true && 'or-bottom-nav__badge--dot')}>
                    {item.badge === true ? null : item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>
              <span className="or-bottom-nav__label">{item.label}</span>
              {hiddenBadge && <span className="or-visually-hidden"> ({hiddenBadge})</span>}
            </>
          )
          const common = {
            className: 'or-bottom-nav__item',
            'aria-current': active ? ('page' as const) : undefined,
          }
          const select = () => setValue(item.value)
          let control: ReactNode
          if (item.href) {
            const linkProps = {
              ...common,
              href: item.href,
              children: content,
              onClick: select,
            }
            control = renderLink ? renderLink(linkProps) : <a {...linkProps} />
          } else {
            control = (
              <button type="button" {...common} onClick={select}>
                {content}
              </button>
            )
          }
          return (
            <li key={item.value} className="or-bottom-nav__cell">
              {control}
            </li>
          )
        })}
      </ul>
    </nav>
  )
})
