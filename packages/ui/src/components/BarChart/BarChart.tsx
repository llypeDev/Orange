import { forwardRef, useMemo, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import {
  ChartFigure,
  ChartTooltip,
  colorStyle,
  useChartExplorer,
  useChartMotion,
  useElementWidth,
  type ChartBaseProps,
  type ChartTooltipRow,
} from './ChartFrame'
import {
  VIZ_CATEGORICAL_COUNT,
  createAxisFormatter,
  createValueFormatter,
  crisp,
  extremes,
  formatList,
  niceScale,
  px,
  seriesColor,
  textWidth,
  tickTarget,
  truncate,
  valueOf,
  type ChartDatum,
  type ChartSeries,
} from './chartUtils'
import './BarChart.css'

export type BarChartOrientation = 'vertical' | 'horizontal'
export type BarChartLayout = 'grouped' | 'stacked'
export type BarChartSeries = ChartSeries
export type BarChartDatum = ChartDatum

export interface BarChartProps extends ChartBaseProps {
  /** Uma entrada por categoria: `{ label: 'jan', values: { site: 12400, app: 8100 } }`. */
  data: BarChartDatum[]
  /** Séries na ordem da legenda. As cores seguem `--or-color-viz-1…5`. */
  series: BarChartSeries[]
  /** `vertical` (colunas, padrão) ou `horizontal` (para rótulos longos). */
  orientation?: BarChartOrientation
  /** `grouped` (lado a lado, padrão) ou `stacked` (empilhadas, com total). */
  layout?: BarChartLayout
  /** Escreve o valor na ponta de cada barra (ou o total da pilha) quando couber. */
  showValues?: boolean
  /**
   * Destaca uma categoria (pelo `label`) com o acento; as demais ficam no neutro
   * `--or-color-viz-other`. Só para uma série. Ganha rótulo de valor.
   */
  highlight?: string
}

interface Segment {
  series: number
  value: number | null
  start: number
  end: number
}

const GAP = 2
const AXIS_BAND = 28
const DEFAULT_HEIGHT = 280

/**
 * Gráfico de barras acessível, em SVG puro: compara quantidades entre categorias,
 * com eixo sempre a partir de zero. Agrupado ou empilhado, vertical ou horizontal.
 * Legenda com marcas, tabela de dados alternativa e exploração por teclado.
 */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
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
    series,
    orientation = 'vertical',
    layout = 'grouped',
    showValues = false,
    highlight,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const hintId = useId('or-bar-chart-hint')
  const horizontal = orientation === 'horizontal'
  const stacked = layout === 'stacked'
  const n = data.length
  const k = series.length
  const format = createValueFormatter(locale, valueFormat)

  devWarning(
    k > VIZ_CATEGORICAL_COUNT && series.slice(VIZ_CATEGORICAL_COUNT).some((s) => !s.color),
    'BarChart: a paleta categórica tem 5 cores. Agrupe a partir da sexta série em "Outros" ou divida o gráfico.',
  )

  const highlightIndex =
    highlight !== undefined && k === 1 ? data.findIndex((d) => d.label === highlight) : -1
  const colors = series.map((s, i) => seriesColor(s, i))
  const barColor = (index: number, si: number) =>
    highlightIndex >= 0
      ? index === highlightIndex
        ? 'var(--or-color-accent)'
        : 'var(--or-color-viz-other)'
      : colors[si]

  // Segmentos por categoria (em unidades de valor). Pilhas positivas e negativas crescem a partir de zero.
  const segments: Segment[][] = data.map((datum) => {
    let pos = 0
    let neg = 0
    return series.map((s, si) => {
      const value = valueOf(datum, s.key)
      if (value === null) return { series: si, value, start: 0, end: 0 }
      if (!stacked) return { series: si, value, start: 0, end: value }
      const start = value >= 0 ? pos : neg
      if (value >= 0) pos += value
      else neg += value
      return { series: si, value, start, end: start + value }
    })
  })
  const totals = data.map((datum) =>
    series.reduce<number | null>((sum, s) => {
      const value = valueOf(datum, s.key)
      return value === null ? sum : (sum ?? 0) + value
    }, null),
  )
  const ends = segments.flat().flatMap((seg) => [seg.start, seg.end])
  const domainMin = Math.min(0, ...ends)
  const domainMax = Math.max(0, ...ends)

  // Rótulos diretos: valor de cada barra (agrupado) ou total da pilha.
  const labelled = (index: number) => showValues || index === highlightIndex
  const anyLabels = showValues || highlightIndex >= 0
  const valueLabelOf = (index: number, si: number) => {
    const value = stacked && k > 1 ? totals[index] : segments[index][si].value
    return value === null ? '' : format(value)
  }

  // --- Geometria ---------------------------------------------------------
  const [plotRef, width] = useElementWidth<HTMLDivElement>()
  const rowHeight = stacked || k === 1 ? 36 : Math.max(36, k * 12 + (k - 1) * GAP + 16)
  const height = Math.max(
    120,
    heightProp ?? (horizontal ? n * rowHeight + AXIS_BAND + 8 : DEFAULT_HEIGHT),
  )

  let top: number
  let left: number
  let right: number
  let plotW: number
  let plotH: number
  let scale = niceScale(domainMin, domainMax)

  const categoryWidths = data.map((d) => textWidth(d.label))
  const maxValueLabel = anyLabels
    ? Math.max(0, ...data.flatMap((_, i) => series.map((__, si) => textWidth(valueLabelOf(i, si)))))
    : 0

  if (horizontal) {
    top = 8
    plotH = height - top - AXIS_BAND
    left = Math.min(Math.max(...categoryWidths, 0) + 12, Math.round(width * 0.38))
    right = anyLabels ? maxValueLabel + 10 : 16
    plotW = Math.max(0, width - left - right)
    scale = niceScale(domainMin, domainMax, tickTarget(plotW))
    // O último rótulo do eixo é centralizado no fim: garante espaço para a metade dele.
    const axisProbe = createAxisFormatter(locale, valueFormat, scale.ticks, scale.step)
    const lastHalf = Math.ceil(textWidth(axisProbe(scale.max)) / 2)
    if (lastHalf > right) {
      right = lastHalf
      plotW = Math.max(0, width - left - right)
    }
  } else {
    top = anyLabels ? 22 : 10
    plotH = Math.max(0, height - top - AXIS_BAND)
    scale = niceScale(domainMin, domainMax, tickTarget(plotH))
    const probe = createAxisFormatter(locale, valueFormat, scale.ticks, scale.step)
    left = Math.max(...scale.ticks.map((tick) => textWidth(probe(tick)))) + 10
    right = 4
    plotW = Math.max(0, width - left - right)
  }

  const axisFormat = createAxisFormatter(locale, valueFormat, scale.ticks, scale.step)
  const span = scale.max - scale.min || 1
  const band = n ? (horizontal ? plotH : plotW) / n : 0
  const slots = stacked ? 1 : Math.max(1, k)
  const maxThickness = horizontal ? 24 : 56
  const groupSpan = band * (slots > 1 ? 0.78 : 0.62)
  const thickness = Math.max(1, Math.min(maxThickness, (groupSpan - GAP * (slots - 1)) / slots))
  const groupSize = thickness * slots + GAP * (slots - 1)
  const offset = (band - groupSize) / 2

  /** Posição (px) de um valor no eixo de valores. */
  const pos = (value: number) =>
    horizontal
      ? left + ((value - scale.min) / span) * plotW
      : top + ((scale.max - value) / span) * plotH
  /** Início (px) da categoria no eixo de categorias. */
  const bandStart = (index: number) => (horizontal ? top : left) + index * band
  const baseline = pos(0)

  interface BarRect {
    key: string
    series: number
    x: number
    y: number
    w: number
    h: number
  }

  const rects: BarRect[][] = segments.map((segs, index) =>
    segs.flatMap((seg) => {
      if (seg.value === null || seg.value === 0) return []
      const slot = stacked ? 0 : seg.series
      const cross = bandStart(index) + offset + slot * (thickness + GAP)
      let a = pos(seg.start)
      const b = pos(seg.end)
      // 2px de fundo entre segmentos empilhados (o lado voltado para a base recua).
      if (stacked && seg.start !== 0) {
        const towardBase = Math.sign(a - b) || 1
        a -= towardBase * GAP
      }
      const lo = Math.min(a, b)
      const length = Math.max(Math.abs(b - a), 1)
      return [
        horizontal
          ? {
              key: `${index}-${seg.series}`,
              series: seg.series,
              x: lo,
              y: cross,
              w: length,
              h: thickness,
            }
          : {
              key: `${index}-${seg.series}`,
              series: seg.series,
              x: cross,
              y: lo,
              w: thickness,
              h: length,
            },
      ]
    }),
  )

  // --- Exploração (teclado e ponteiro) -----------------------------------
  const describe = (index: number, si: number) => {
    const value = segments[index]?.[si]?.value
    return t('chartPoint', {
      category: data[index].label,
      series: series[si].label,
      value: value === null || value === undefined ? t('chartNoData') : format(value),
    })
  }
  const explorer = useChartExplorer({
    count: n,
    seriesCount: k,
    keys: horizontal
      ? { next: 'ArrowDown', prev: 'ArrowUp', seriesNext: 'ArrowRight', seriesPrev: 'ArrowLeft' }
      : stacked
        ? { next: 'ArrowRight', prev: 'ArrowLeft', seriesNext: 'ArrowUp', seriesPrev: 'ArrowDown' }
        : { next: 'ArrowRight', prev: 'ArrowLeft', seriesNext: 'ArrowDown', seriesPrev: 'ArrowUp' },
    describe,
  })
  const { active, last } = explorer

  const segmentAt = (index: number, value: number) => {
    const segs = segments[index]
    const hit = segs.find(
      (seg) =>
        seg.value !== null &&
        value >= Math.min(seg.start, seg.end) &&
        value <= Math.max(seg.start, seg.end),
    )
    if (hit) return hit.series
    const sameSide = segs.filter(
      (seg) => seg.value !== null && Math.sign(seg.value) === (value < 0 ? -1 : 1),
    )
    return (
      (sameSide[sameSide.length - 1] ?? segs.find((seg) => seg.value !== null) ?? segs[0])
        ?.series ?? 0
    )
  }

  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!n || !band) return
    const box = event.currentTarget.getBoundingClientRect()
    const px = event.clientX - box.left
    const py = event.clientY - box.top
    const along = horizontal ? py - top : px - left
    const across = horizontal ? px : py
    if (along < 0 || along >= band * n) {
      explorer.handlers.onPointerLeave()
      return
    }
    const index = Math.min(n - 1, Math.floor(along / band))
    let si = 0
    if (k > 1) {
      if (stacked) {
        const value = horizontal
          ? scale.min + ((across - left) / (plotW || 1)) * span
          : scale.max - ((across - top) / (plotH || 1)) * span
        si = segmentAt(index, value)
      } else {
        const within = along - index * band - offset
        si = Math.max(0, Math.min(k - 1, Math.floor(within / (thickness + GAP))))
      }
    }
    explorer.point(index, si)
  }

  // --- Movimento ----------------------------------------------------------
  const [motionRef, motion] = useChartMotion<HTMLElement>()
  const rootRef = useMemo(() => mergeRefs(ref, motionRef), [ref, motionRef])
  const stagger = n > 8 ? 8 / n : 1

  // --- Textos acessíveis -------------------------------------------------
  const autoSummary = () => {
    const parts: string[] = []
    if (k > 1)
      parts.push(
        t('chartSeries', {
          series: formatList(
            locale,
            series.map((s) => s.label),
          ),
        }),
      )
    if (stacked && k > 1) {
      const valid = totals
        .map((total, index) => ({ total, index }))
        .filter((x): x is { total: number; index: number } => x.total !== null)
      if (valid.length) {
        const max = valid.reduce((a, b) => (b.total > a.total ? b : a))
        const min = valid.reduce((a, b) => (b.total < a.total ? b : a))
        const point = (x: { total: number; index: number }) =>
          t('chartPoint', {
            category: data[x.index].label,
            series: t('chartTotal'),
            value: format(x.total),
          })
        parts.push(
          t('chartHighest', { value: point(max) }),
          t('chartLowest', { value: point(min) }),
        )
      }
    } else {
      const ext = extremes(data, series)
      if (ext) {
        parts.push(t('chartHighest', { value: describe(ext.max.index, ext.max.series) }))
        parts.push(t('chartLowest', { value: describe(ext.min.index, ext.min.series) }))
      }
    }
    return parts.join(' ')
  }
  const label = [t('chartBarLabel', { title }), summary ?? (n ? autoSummary() : t('chartEmpty'))]
    .filter(Boolean)
    .join('. ')

  // --- Dica ---------------------------------------------------------------
  let tooltip: ReactNode = null
  if (last && last.index < n && last.series < k) {
    const index = last.index
    const outer = Math.max(0, ...segments[index].map((seg) => Math.max(seg.start, seg.end)))
    const rows: ChartTooltipRow[] = series.map((s, si) => {
      const value = segments[index][si].value
      return {
        key: s.key,
        label: s.label,
        value: value === null ? t('chartNoData') : format(value),
        color: barColor(index, si),
        active: k > 1 && si === last.series,
      }
    })
    const total = totals[index]
    tooltip = (
      <ChartTooltip
        open={active !== null}
        x={
          horizontal
            ? Math.min(left + plotW, Math.max(left, pos(outer)))
            : bandStart(index) + band / 2
        }
        y={horizontal ? bandStart(index) + offset : Math.min(pos(outer), baseline)}
        width={width}
        title={data[index].label}
        rows={rows}
        footer={
          stacked && k > 1 && total !== null
            ? { label: t('chartTotal'), value: format(total) }
            : undefined
        }
      />
    )
  }

  // --- Eixos ----------------------------------------------------------------
  const tickLabels = scale.ticks.map(axisFormat)
  const tickSpacing = scale.ticks.length > 1 ? plotW / (scale.ticks.length - 1) : plotW
  const tickEvery = horizontal
    ? Math.max(
        1,
        Math.ceil((Math.max(...tickLabels.map((l) => textWidth(l))) + 8) / (tickSpacing || 1)),
      )
    : 1
  // Rótulos de categoria: inteiros quando cabem; senão encurtados (…) se ainda sobrarem ~4
  // letras por barra; só em faixas estreitas demais (muitos meses) eles se alternam.
  const widestCategory = Math.max(0, ...categoryWidths)
  const categoryEvery =
    horizontal || widestCategory + 8 <= band || band - 6 >= 30
      ? 1
      : Math.max(1, Math.ceil((widestCategory + 8) / (band || 1)))
  const categorySpace = horizontal ? left - 10 : band * categoryEvery - 6

  const emphasis = (index: number, si: number) => {
    if (!active) return undefined
    if (index !== active.index) return 'muted'
    return k > 1 && si !== active.series ? 'related' : 'active'
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
      legend={
        highlightIndex >= 0
          ? undefined
          : series.map((s, i) => ({ label: s.label, color: colors[i], mark: 'bar' as const }))
      }
      table={{
        categoryLabel: categoryLabel ?? t('chartCategory'),
        columns: [...series.map((s) => s.label), ...(stacked && k > 1 ? [t('chartTotal')] : [])],
        rows: data.map((datum, index) => ({
          label: datum.label,
          cells: [
            ...series.map((s) => valueOf(datum, s.key)),
            ...(stacked && k > 1 ? [totals[index]] : []),
          ],
        })),
        format,
      }}
      announcement={explorer.announcement}
      hintId={n ? hintId : undefined}
      defaultShowData={defaultShowData}
      data-orientation={orientation}
      data-layout={layout}
      {...rest}
      className={cx('or-bar-chart', `or-bar-chart--${orientation}`, rest.className)}
    >
      <div ref={plotRef} className="or-chart__plot" style={{ height }}>
        {n === 0 ? (
          <p className="or-chart__empty">{t('chartEmpty')}</p>
        ) : (
          // O SVG é a imagem do gráfico (role="img" + resumo, como na diretriz) e também a área
          // explorável pelo teclado: Tab foca, setas movem o destaque, Escape limpa.
          <svg
            className="or-chart__svg"
            width={width}
            height={height}
            role="img"
            aria-label={label}
            aria-describedby={hintId}
            tabIndex={0}
            onKeyDown={explorer.handlers.onKeyDown}
            onBlur={explorer.handlers.onBlur}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={explorer.handlers.onPointerLeave}
          >
            {/* Grade e rótulos do eixo de valores */}
            <g className="or-bar-chart__axis">
              {scale.ticks.map((tick, i) => {
                const p = crisp(pos(tick))
                return (
                  <g key={tick}>
                    {tick !== 0 &&
                      (horizontal ? (
                        <line className="or-chart__grid" x1={p} x2={p} y1={top} y2={top + plotH} />
                      ) : (
                        <line
                          className="or-chart__grid"
                          x1={left}
                          x2={left + plotW}
                          y1={p}
                          y2={p}
                        />
                      ))}
                    {i % tickEvery === 0 &&
                      (horizontal ? (
                        <text
                          className="or-chart__tick"
                          x={px(pos(tick))}
                          y={px(top + plotH + 18)}
                          textAnchor="middle"
                        >
                          {tickLabels[i]}
                        </text>
                      ) : (
                        <text
                          className="or-chart__tick"
                          x={left - 8}
                          y={px(pos(tick))}
                          textAnchor="end"
                          dominantBaseline="middle"
                        >
                          {tickLabels[i]}
                        </text>
                      ))}
                  </g>
                )
              })}
            </g>

            {/* Faixa da categoria em destaque: desliza com --or-duration-fast */}
            {last && last.index < n && (
              <rect
                className="or-bar-chart__cursor"
                data-state={active ? 'open' : 'closed'}
                width={px(horizontal ? plotW : band)}
                height={px(horizontal ? band : plotH)}
                style={{
                  transform: horizontal
                    ? `translate(${left}px, ${bandStart(last.index)}px)`
                    : `translate(${bandStart(last.index)}px, ${top}px)`,
                }}
              />
            )}

            {/* Barras: cada categoria cresce a partir da base, escalonada */}
            {rects.map((bars, index) => (
              <g
                key={`${data[index].label}-${index}`}
                className="or-bar-chart__group or-chart__anim"
                style={
                  {
                    '--_i': Math.round(index * stagger * 100) / 100,
                    transformOrigin: horizontal ? `${baseline}px 0px` : `0px ${baseline}px`,
                  } as CSSProperties
                }
              >
                {bars.map((bar) => (
                  <rect
                    key={bar.key}
                    className="or-bar-chart__bar"
                    data-series={series[bar.series].key}
                    data-emphasis={emphasis(index, bar.series)}
                    x={px(bar.x)}
                    y={px(bar.y)}
                    width={px(bar.w)}
                    height={px(bar.h)}
                    style={colorStyle(barColor(index, bar.series))}
                  />
                ))}
              </g>
            ))}

            {/* Base (zero) por cima das barras */}
            {horizontal ? (
              <line
                className="or-chart__baseline"
                x1={crisp(baseline)}
                x2={crisp(baseline)}
                y1={top}
                y2={top + plotH}
              />
            ) : (
              <line
                className="or-chart__baseline"
                x1={left}
                x2={left + plotW}
                y1={crisp(baseline)}
                y2={crisp(baseline)}
              />
            )}

            {/* Rótulos das categorias */}
            <g className="or-bar-chart__categories">
              {data.map((datum, index) =>
                index % categoryEvery === 0 ? (
                  horizontal ? (
                    <text
                      key={`${datum.label}-${index}`}
                      className="or-chart__tick or-bar-chart__category"
                      x={left - 10}
                      y={px(bandStart(index) + band / 2)}
                      textAnchor="end"
                      dominantBaseline="middle"
                    >
                      {truncate(datum.label, categorySpace)}
                    </text>
                  ) : (
                    <text
                      key={`${datum.label}-${index}`}
                      className="or-chart__tick or-bar-chart__category"
                      x={px(bandStart(index) + band / 2)}
                      y={px(top + plotH + 18)}
                      textAnchor="middle"
                    >
                      {truncate(datum.label, categorySpace)}
                    </text>
                  )
                ) : null,
              )}
            </g>

            {/* Rótulos diretos (valor na ponta / total da pilha), só quando cabem */}
            {anyLabels && (
              <g className="or-bar-chart__values">
                {data.map((_, index) => {
                  if (!labelled(index)) return null
                  const items =
                    stacked && k > 1
                      ? [{ si: -1, slot: 0, value: totals[index] }]
                      : series.map((__, si) => ({
                          si,
                          slot: stacked ? 0 : si,
                          value: segments[index][si].value,
                        }))
                  return items.map(({ si, slot, value }) => {
                    if (value === null) return null
                    const text = format(value)
                    const end = pos(
                      stacked && k > 1
                        ? value >= 0
                          ? Math.max(0, ...segments[index].map((s) => s.end))
                          : Math.min(0, ...segments[index].map((s) => s.end))
                        : value,
                    )
                    const center =
                      bandStart(index) + offset + slot * (thickness + GAP) + thickness / 2
                    const room = k > 1 && !stacked ? thickness + GAP * 2 : band - 4
                    if (!horizontal && textWidth(text) > room) return null
                    return horizontal ? (
                      <text
                        key={`${index}-${si}`}
                        className="or-chart__value or-chart__anim"
                        style={{ '--_i': Math.round(index * stagger * 100) / 100 } as CSSProperties}
                        x={px(value >= 0 ? end + 6 : end - 6)}
                        y={px(center)}
                        textAnchor={value >= 0 ? 'start' : 'end'}
                        dominantBaseline="middle"
                      >
                        {text}
                      </text>
                    ) : (
                      <text
                        key={`${index}-${si}`}
                        className="or-chart__value or-chart__anim"
                        style={{ '--_i': Math.round(index * stagger * 100) / 100 } as CSSProperties}
                        x={px(center)}
                        y={px(value >= 0 ? end - 6 : end + 14)}
                        textAnchor="middle"
                      >
                        {text}
                      </text>
                    )
                  })
                })}
              </g>
            )}
          </svg>
        )}
        {tooltip}
      </div>
    </ChartFigure>
  )
})
