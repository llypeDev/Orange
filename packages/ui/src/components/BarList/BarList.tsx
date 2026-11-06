import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { useControllableState, useId, usePresence } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import { useChartMotion } from '../BarChart/ChartFrame'
import { createValueFormatter, type ChartValueFormat } from '../BarChart/chartUtils'
import type { RenderLink } from '../Link'
import { VisuallyHidden } from '../VisuallyHidden'
import './BarList.css'

export type BarListSort = 'desc' | 'asc' | 'none'
export type BarListSize = 'sm' | 'md' | 'lg'

/** Uma linha do ranking. */
export interface BarListDatum {
  /** Nome do item: página, produto, região… */
  label: ReactNode
  /** Valor (≥ 0). A barra é proporcional ao maior valor da lista. */
  value: number
  /** Torna a linha inteira um link. */
  href?: string
}

export interface BarListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Itens do ranking. A ordem final depende de `sort`. */
  data: BarListDatum[]
  /** `desc` (maior primeiro, padrão), `asc` ou `none` (a ordem de `data`). */
  sort?: BarListSort
  /** Formato dos valores: função ou opções do `Intl.NumberFormat` (ex.: `{ style: 'currency', currency: 'BRL' }`). */
  valueFormat?: ChartValueFormat
  /** Mostra só os primeiros itens, com o botão "Mostrar todos (N)" / "Mostrar menos". */
  limit?: number
  /** Lista inteira visível, com `limit` (controlado). */
  expanded?: boolean
  /** Estado inicial (não controlado). Padrão: `false`. */
  defaultExpanded?: boolean
  /** Chamado ao mostrar todos / mostrar menos. */
  onExpandedChange?: (expanded: boolean) => void
  /** Densidade: texto, respiro e espessura da barra. Padrão: `md`. */
  size?: BarListSize
  /** Cor das barras. Padrão: `--or-color-viz-1` (a cor da primeira série dos gráficos). */
  color?: string
  /**
   * Renderiza os links das linhas com `href` (ex.: o `Link` do roteador):
   * `renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}`.
   */
  renderLink?: RenderLink
}

/** Escalonamento máximo da entrada (em passos de `--or-stagger`). */
const MAX_STAGGER = 8

const safeValue = (value: number) => (Number.isFinite(value) ? value : 0)

/**
 * Ranking em barras horizontais ("Páginas mais visitadas", "Produtos mais
 * vendidos"): uma lista (`ul`) em que cada item traz o rótulo, o valor e uma
 * barra proporcional ao maior valor. Linhas com `href` viram links. Com
 * `limit`, mostra os primeiros e um botão para ver todos.
 */
export const BarList = forwardRef<HTMLDivElement, BarListProps>(function BarList(
  {
    data,
    sort = 'desc',
    valueFormat,
    limit,
    expanded: expandedProp,
    defaultExpanded = false,
    onExpandedChange,
    size = 'md',
    color = 'var(--or-color-viz-1)',
    renderLink,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const listId = useId('or-bar-list')
  const format = createValueFormatter(locale, valueFormat)
  const count = createValueFormatter(locale)

  devWarning(
    data.some((d) => !(d.value >= 0)),
    'BarList: os valores precisam ser números ≥ 0 — a barra mede a distância até o maior valor.',
  )

  // Ordem estável: empates mantêm a ordem de `data`. A chave é o índice original.
  const items = useMemo(() => {
    const indexed = data.map((datum, index) => ({ datum, index }))
    if (sort === 'desc') indexed.sort((a, b) => safeValue(b.datum.value) - safeValue(a.datum.value))
    if (sort === 'asc') indexed.sort((a, b) => safeValue(a.datum.value) - safeValue(b.datum.value))
    return indexed
  }, [data, sort])
  const max = Math.max(0, ...items.map(({ datum }) => safeValue(datum.value)))

  const [expanded, setExpanded] = useControllableState({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  })
  const cut = limit === undefined ? items.length : Math.max(0, Math.floor(limit))
  const limited = cut < items.length
  // Os itens extras saem com uma animação curta antes de desmontar.
  const { present, state, nodeRef } = usePresence<HTMLLIElement>(expanded)
  const visible = limited && !present ? items.slice(0, cut) : items

  const [motionRef, motion] = useChartMotion<HTMLDivElement>()
  const rootRef = useMemo(() => mergeRefs(ref, motionRef), [ref, motionRef])

  return (
    <div
      ref={rootRef}
      className={cx('or-bar-list', `or-bar-list--${size}`, className)}
      data-motion={motion}
      style={{ '--_color': color, ...style } as CSSProperties}
      {...rest}
    >
      {items.length === 0 ? (
        <p className="or-bar-list__empty">{t('chartEmpty')}</p>
      ) : (
        <ul
          id={listId}
          // `list-style: none` remove a semântica de lista no Safari/VoiceOver; o papel a restaura.
          role="list"
          className="or-bar-list__list"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
        >
          {visible.map(({ datum, index }, position) => {
            const extra = limited && position >= cut
            const share = max > 0 ? Math.max(0, safeValue(datum.value)) / max : 0
            const content = (
              <>
                <span className="or-bar-list__label">{datum.label}</span>
                {/* Pausa entre rótulo e valor para leitores de tela ("Início: 12.480"). */}
                <VisuallyHidden>: </VisuallyHidden>
                <span className="or-bar-list__value">{format(datum.value)}</span>
                <span className="or-bar-list__bar" aria-hidden="true">
                  <span className="or-bar-list__fill" />
                </span>
              </>
            )
            let row: ReactNode
            if (datum.href) {
              const linkProps = {
                className: 'or-bar-list__row or-bar-list__row--link',
                href: datum.href,
                children: content,
              }
              row = renderLink ? renderLink(linkProps) : <a {...linkProps} />
            } else {
              row = <div className="or-bar-list__row">{content}</div>
            }
            return (
              <li
                key={index}
                ref={extra && position === cut ? nodeRef : undefined}
                className={cx('or-bar-list__item', extra && 'or-bar-list__item--extra')}
                data-state={extra ? state : undefined}
                style={
                  {
                    '--_share': Math.round(share * 10000) / 10000,
                    '--_i': Math.min(extra ? position - cut : position, MAX_STAGGER),
                  } as CSSProperties
                }
              >
                {row}
              </li>
            )
          })}
        </ul>
      )}
      {limited && (
        <button
          type="button"
          className="or-bar-list__toggle"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded(!expanded)}
        >
          <span>
            {expanded ? t('showLess') : t('barListShowAll', { count: count(items.length) })}
          </span>
          <Icon name="chevron-down" size={16} className="or-bar-list__toggle-icon" />
        </button>
      )}
    </div>
  )
})
