import {
  forwardRef,
  useMemo,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { useId } from '../../hooks'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import {
  ChartFigure,
  colorStyle,
  useChartExplorer,
  useChartMotion,
  type ChartBaseProps,
  type ChartTableData,
} from '../BarChart/ChartFrame'
import {
  VIZ_CATEGORICAL_COUNT,
  createValueFormatter,
  formatList,
  px,
  seriesColor,
  truncate,
} from '../BarChart/chartUtils'
import './DonutChart.css'

/** Uma fatia da rosca. */
export interface DonutChartDatum {
  /** Nome da fatia: canal, status, forma de pagamento… */
  label: string
  /** Valor da fatia (≥ 0). A participação é calculada sobre a soma de todas. */
  value: number
  /**
   * Cor da fatia. Padrão: `--or-color-viz-1…5`, na ordem dos dados. Use
   * `--or-color-viz-other` para "Outros".
   */
  color?: string
}

export interface DonutChartProps extends ChartBaseProps {
  /** Fatias na ordem do desenho (sentido horário, a partir do topo) e da legenda. */
  data: DonutChartDatum[]
  /** Legenda pequena sob o total, no centro da rosca. Padrão: "Total". */
  centerLabel?: string
  /** Diâmetro da rosca em px. Encolhe para caber na largura disponível. Padrão: `200`. */
  height?: number
}

const DEFAULT_SIZE = 200
/** Quanto a fatia em destaque se afasta do centro (px do viewBox). */
const POP = 4
/** Raio interno em relação ao externo: anel de ~36% do raio. */
const HOLE = 0.64
const TAU = Math.PI * 2

/**
 * Participação de cada valor em pontos percentuais inteiros que somam 100
 * (método do maior resto): arredonda tudo para baixo e entrega os pontos que
 * faltam às fatias com os maiores restos — no empate, à que vem antes.
 */
function roundedShares(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0)
  if (total <= 0) return values.map(() => 0)
  const exact = values.map((value) => (value / total) * 100)
  // A folga absorve erros de ponto flutuante (25 → 24,999999999999996).
  const shares = exact.map((share) => Math.floor(share + 1e-9))
  let missing = 100 - shares.reduce((sum, share) => sum + share, 0)
  const byRest = exact
    .map((share, index) => ({ index, rest: share - shares[index] }))
    .sort((a, b) => b.rest - a.rest || a.index - b.index)
  for (let k = 0; missing > 0 && k < byRest.length; k++, missing--) shares[byRest[k].index] += 1
  return shares
}

/** Ponto no círculo: `turn` em voltas (0 = topo, sentido horário). */
function polar(c: number, radius: number, turn: number): [number, number] {
  return [px(c + radius * Math.sin(turn * TAU)), px(c - radius * Math.cos(turn * TAU))]
}

/** Setor do anel entre `start` e `end` (em voltas). Uma volta inteira vira um anel. */
function arcPath(c: number, outer: number, inner: number, start: number, end: number): string {
  if (end - start >= 0.9999) {
    return (
      `M${c} ${px(c - outer)}A${outer} ${outer} 0 1 1 ${c} ${px(c + outer)}` +
      `A${outer} ${outer} 0 1 1 ${c} ${px(c - outer)}Z` +
      `M${c} ${px(c - inner)}A${inner} ${inner} 0 1 0 ${c} ${px(c + inner)}` +
      `A${inner} ${inner} 0 1 0 ${c} ${px(c - inner)}Z`
    )
  }
  const large = end - start > 0.5 ? 1 : 0
  const [x0, y0] = polar(c, outer, start)
  const [x1, y1] = polar(c, outer, end)
  const [x2, y2] = polar(c, inner, end)
  const [x3, y3] = polar(c, inner, start)
  return (
    `M${x0} ${y0}A${outer} ${outer} 0 ${large} 1 ${x1} ${y1}` +
    `L${x2} ${y2}A${inner} ${inner} 0 ${large} 0 ${x3} ${y3}Z`
  )
}

/** Tamanho de fonte (px) para `text` caber em `width`, entre `min` e `max`. */
function fitFont(text: string, width: number, max: number, min = 12): number {
  return Math.round(Math.max(min, Math.min(max, width / (Math.max(1, text.length) * 0.6))))
}

/**
 * Gráfico de rosca acessível, em SVG puro: a participação de cada parte num
 * todo ("Vendas por canal", "Tickets por status"). O total fica no centro e a
 * legenda traz valor e percentual de cada fatia. Tabela de dados alternativa e
 * exploração por teclado, como BarChart e LineChart.
 */
export const DonutChart = forwardRef<HTMLElement, DonutChartProps>(function DonutChart(
  {
    title,
    description,
    summary,
    source,
    hideCaption = false,
    variant = 'outline',
    height: heightProp,
    valueFormat,
    categoryLabel,
    defaultShowData,
    data,
    centerLabel,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const hintId = useId('or-donut-chart-hint')
  const maskId = useId('or-donut-chart-mask')
  const n = data.length
  const format = createValueFormatter(locale, valueFormat)
  const percent = createValueFormatter(locale, { style: 'percent', maximumFractionDigits: 0 })

  devWarning(
    data.some((d) => !(d.value >= 0)),
    'DonutChart: valores negativos ou inválidos contam como zero — a rosca mostra partes de um todo.',
  )
  devWarning(
    n > VIZ_CATEGORICAL_COUNT && data.slice(VIZ_CATEGORICAL_COUNT).some((d) => !d.color),
    'DonutChart: a paleta categórica tem 5 cores. Agrupe a partir da sexta fatia em "Outros" (--or-color-viz-other).',
  )

  // Só valores finitos e positivos ocupam o anel.
  const values = data.map((d) => (Number.isFinite(d.value) && d.value > 0 ? d.value : 0))
  const total = values.reduce((sum, value) => sum + value, 0)
  const empty = total <= 0
  const shares = roundedShares(values)
  const colors = data.map((d, i) => seriesColor(d, i))
  const caption = centerLabel ?? t('chartTotal')
  const shareText = (index: number) => percent(shares[index] / 100)

  // --- Geometria (unidades do viewBox; o SVG escala para caber) ---------------
  const size = Math.max(96, heightProp ?? DEFAULT_SIZE)
  const c = size / 2
  const outer = c - POP - 2
  const inner = px(outer * HOLE)
  /** Raio do traço da máscara de entrada: o meio do anel. */
  const mid = px((outer + inner) / 2)
  const slices = values.reduce<{ start: number; end: number }[]>((list, value) => {
    const start = list.length ? list[list.length - 1].end : 0
    list.push({ start, end: empty ? start : start + value / total })
    return list
  }, [])

  // --- Exploração (teclado e ponteiro) -----------------------------------
  const describe = (index: number) =>
    t('chartSlice', {
      label: data[index].label,
      value: format(data[index].value),
      percent: shareText(index),
    })
  const explorer = useChartExplorer({
    count: empty ? 0 : n,
    seriesCount: 1,
    keys: { next: 'ArrowRight', prev: 'ArrowLeft', seriesNext: 'ArrowDown', seriesPrev: 'ArrowUp' },
    describe,
  })
  const { active, last } = explorer

  // Não há séries para trocar: ↓ e ↑ também percorrem as fatias (a legenda é uma coluna).
  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const alias =
      event.key === 'ArrowDown' ? 'ArrowRight' : event.key === 'ArrowUp' ? 'ArrowLeft' : null
    explorer.handlers.onKeyDown(
      alias
        ? {
            ...event,
            key: alias,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation(),
          }
        : event,
    )
  }

  // O ponteiro encontra a fatia pelo ângulo; no furo ou fora do anel, limpa.
  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    if (empty || !box.width) return
    const scale = size / box.width
    const x = (event.clientX - box.left) * scale - c
    const y = (event.clientY - box.top) * scale - c
    const distance = Math.hypot(x, y)
    if (distance < inner - 2 || distance > outer + POP + 2) {
      explorer.handlers.onPointerLeave()
      return
    }
    const turn = (Math.atan2(x, -y) / TAU + 1) % 1
    const index = slices.findIndex((s) => s.end > s.start && turn >= s.start && turn < s.end)
    if (index >= 0) explorer.point(index, 0)
  }

  // --- Movimento ----------------------------------------------------------
  const [motionRef, motion] = useChartMotion<HTMLElement>()
  const rootRef = useMemo(() => mergeRefs(ref, motionRef), [ref, motionRef])
  const animated = motion !== 'static'

  // --- Textos acessíveis -------------------------------------------------
  const autoSummary = () =>
    [
      t('chartDonutTotal', { label: caption, value: format(total) }),
      `${formatList(
        locale,
        data.map((_, i) => describe(i)),
      )}.`,
    ].join(' ')
  const label = [
    t('chartDonutLabel', { title }),
    summary ?? (empty ? t('chartEmpty') : autoSummary()),
  ]
    .filter(Boolean)
    .join('. ')

  // A tabela do ChartFigure formata todas as células com uma só função; aqui as colunas
  // têm formatos diferentes (valor e percentual), então cada célula guarda o índice do texto pronto.
  const cells: string[] = []
  const cell = (text: string) => cells.push(text) - 1
  const table: ChartTableData = {
    categoryLabel: categoryLabel ?? t('chartCategory'),
    columns: [t('chartValue'), t('chartShare')],
    rows: [
      ...data.map((d, i) => ({
        label: d.label,
        cells: [cell(format(d.value)), cell(shareText(i))],
      })),
      ...(empty
        ? []
        : [{ label: t('chartTotal'), cells: [cell(format(total)), cell(percent(1))] }]),
    ],
    format: (index) => cells[index],
  }

  const emphasis = (index: number) =>
    active ? (index === active.index ? 'active' : 'muted') : undefined

  // --- Centro: o total; com uma fatia em destaque, o percentual dela -----------
  const room = inner * 2 * 0.78
  const totalText = format(total)
  const totalFont = fitFont(totalText, room, Math.round(inner * 0.46))
  const focus = last && last.index < n ? last.index : null
  const centerFace = (big: string, small: string, fontSize: number) => {
    const block = fontSize + 6 + 12
    const top = c - block / 2
    return (
      <>
        <text
          className="or-donut-chart__total"
          x={c}
          y={px(top + fontSize * 0.8)}
          textAnchor="middle"
          style={{ fontSize }}
        >
          {big}
        </text>
        <text
          className="or-donut-chart__caption"
          x={c}
          y={px(top + fontSize + 6 + 10)}
          textAnchor="middle"
        >
          {truncate(small, room)}
        </text>
      </>
    )
  }

  return (
    <ChartFigure
      ref={rootRef}
      title={title}
      description={description}
      source={source}
      hideCaption={hideCaption}
      variant={variant}
      motion={motion}
      table={table}
      announcement={explorer.announcement}
      hintId={empty ? undefined : hintId}
      defaultShowData={defaultShowData}
      {...rest}
      className={cx('or-donut-chart', rest.className)}
    >
      {empty ? (
        <div className="or-chart__plot" style={{ height: size }}>
          <p className="or-chart__empty">{t('chartEmpty')}</p>
        </div>
      ) : (
        <div className="or-donut-chart__layout">
          <div className="or-donut-chart__ring" style={{ width: size }}>
            {/* O SVG é a imagem do gráfico (role="img" + resumo, como em BarChart/LineChart) e
                também a área explorável pelo teclado: Tab foca, setas movem o destaque, Esc limpa. */}
            <svg
              className="or-chart__svg or-donut-chart__svg"
              width="100%"
              height="100%"
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label={label}
              aria-describedby={hintId}
              tabIndex={0}
              onKeyDown={onKeyDown}
              onBlur={explorer.handlers.onBlur}
              onPointerMove={onPointer}
              onPointerDown={onPointer}
              onPointerLeave={explorer.handlers.onPointerLeave}
            >
              {animated && (
                <defs>
                  {/* Entrada: uma máscara com um traço circular (pathLength=1) revela as fatias
                      em sentido horário a partir do topo, uma vez. */}
                  <mask
                    id={maskId}
                    maskUnits="userSpaceOnUse"
                    x={0}
                    y={0}
                    width={size}
                    height={size}
                  >
                    <path
                      className="or-donut-chart__sweep or-chart__anim"
                      d={`M${c} ${px(c - mid)}A${mid} ${mid} 0 1 1 ${c} ${px(c + mid)}A${mid} ${mid} 0 1 1 ${c} ${px(c - mid)}`}
                      pathLength={1}
                      strokeWidth={px(outer - inner + POP * 2 + 4)}
                    />
                  </mask>
                </defs>
              )}
              <g className="or-donut-chart__slices" mask={animated ? `url(#${maskId})` : undefined}>
                {slices.map((slice, index) => {
                  if (slice.end <= slice.start) return null
                  const middle = (slice.start + slice.end) / 2
                  return (
                    <path
                      key={`${data[index].label}-${index}`}
                      className="or-donut-chart__slice"
                      data-emphasis={emphasis(index)}
                      d={arcPath(c, outer, inner, slice.start, slice.end)}
                      fillRule="evenodd"
                      style={
                        {
                          ...colorStyle(colors[index]),
                          '--_dx': `${px(Math.sin(middle * TAU) * POP)}px`,
                          '--_dy': `${px(-Math.cos(middle * TAU) * POP)}px`,
                        } as CSSProperties
                      }
                    />
                  )
                })}
              </g>
              <g className="or-donut-chart__center or-chart__anim">
                <g className="or-donut-chart__face" data-state={active ? 'closed' : 'open'}>
                  {centerFace(totalText, caption, totalFont)}
                </g>
                {focus !== null && (
                  <g
                    className="or-donut-chart__face or-donut-chart__face--slice"
                    data-state={active ? 'open' : 'closed'}
                  >
                    {centerFace(
                      shareText(focus),
                      data[focus].label,
                      fitFont(shareText(focus), room, Math.round(inner * 0.46)),
                    )}
                  </g>
                )}
              </g>
            </svg>
          </div>
          <ul
            className="or-donut-chart__legend"
            role="list"
            aria-label={t('chartLegend')}
            onPointerLeave={explorer.handlers.onPointerLeave}
          >
            {data.map((d, index) => (
              <li
                key={`${d.label}-${index}`}
                className="or-donut-chart__legend-item"
                data-emphasis={emphasis(index)}
                style={colorStyle(colors[index])}
                onPointerEnter={() => explorer.point(index, 0)}
              >
                <svg
                  className="or-chart__swatch"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect className="or-chart__swatch-fill" width="12" height="12" />
                </svg>
                <span className="or-donut-chart__label">{d.label}</span>
                <span className="or-donut-chart__value">{format(d.value)}</span>
                <span className="or-donut-chart__share">{shareText(index)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartFigure>
  )
})
