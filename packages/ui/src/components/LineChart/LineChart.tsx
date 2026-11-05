import { forwardRef, useMemo, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import {
  ChartFigure,
  ChartTooltip,
  LINE_DASHES,
  MARKER_SHAPES,
  colorStyle,
  markerPath,
  useChartExplorer,
  useChartMotion,
  useElementWidth,
  type ChartBaseProps,
} from '../BarChart/ChartFrame'
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
} from '../BarChart/chartUtils'
import './LineChart.css'

export type LineChartSeries = ChartSeries
export type LineChartDatum = ChartDatum

export interface LineChartProps extends ChartBaseProps {
  /** Um ponto do eixo X por entrada (mês, data em texto): `{ label: 'mar', values: { site: 180 } }`. `null` = sem dado (a linha se interrompe). */
  data: LineChartDatum[]
  /** Séries na ordem da legenda. Cada uma ganha cor, traço e marcador próprios. */
  series: LineChartSeries[]
  /** Preenche a área sob a linha (só com uma série). Inclui o zero no eixo. */
  area?: boolean
  /** Escreve o último valor de cada linha no fim dela (quando os rótulos não colidem). Padrão: `true`. */
  endLabels?: boolean
  /** Começa o eixo de valores em zero. Padrão: só com `area`. */
  includeZero?: boolean
}

interface Point {
  index: number
  x: number
  y: number
  value: number
}

const AXIS_BAND = 28
const DEFAULT_HEIGHT = 280
const INSET = 12
const MARKER_R = 4.5

/**
 * Gráfico de linhas acessível, em SVG puro: evolução no tempo de uma ou mais
 * séries, cada uma com cor, traço e marcador próprios (nunca só a cor). Lacunas
 * (`null`) interrompem a linha. Tabela de dados alternativa e exploração por teclado.
 */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart(
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
    area = false,
    endLabels = true,
    includeZero,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const hintId = useId('or-line-chart-hint')
  const maskId = useId('or-line-chart-mask')
  const n = data.length
  const k = series.length
  const format = createValueFormatter(locale, valueFormat)
  const filled = area && k === 1

  devWarning(
    area && k > 1,
    'LineChart: `area` só vale para uma série — áreas sobrepostas escondem umas às outras.',
  )
  devWarning(
    k > VIZ_CATEGORICAL_COUNT && series.slice(VIZ_CATEGORICAL_COUNT).some((s) => !s.color),
    'LineChart: a paleta categórica tem 5 cores. Agrupe a partir da sexta série em "Outros" ou use pequenos múltiplos.',
  )

  const colors = series.map((s, i) => seriesColor(s, i))
  const dashes = series.map((_, i) => LINE_DASHES[i % LINE_DASHES.length])
  const shapes = series.map((_, i) => MARKER_SHAPES[i % MARKER_SHAPES.length])
  const values = series.map((s) => data.map((d) => valueOf(d, s.key)))
  const all = values.flat().filter((v): v is number => v !== null)
  const zero = includeZero ?? filled

  // --- Geometria ---------------------------------------------------------
  const [plotRef, width] = useElementWidth<HTMLDivElement>()
  const height = Math.max(120, heightProp ?? DEFAULT_HEIGHT)
  const top = 12
  const plotH = Math.max(0, height - top - AXIS_BAND)
  const lo = all.length ? Math.min(...all, ...(zero ? [0] : [])) : 0
  const hi = all.length ? Math.max(...all, ...(zero ? [0] : [])) : 1
  const scale = niceScale(lo, hi, tickTarget(plotH))
  const axisFormat = createAxisFormatter(locale, valueFormat, scale.ticks, scale.step)
  const tickLabels = scale.ticks.map(axisFormat)
  const left = Math.max(...tickLabels.map((l) => textWidth(l))) + 10

  const lastIndexOf = (si: number) => {
    for (let i = n - 1; i >= 0; i--) if (values[si][i] !== null) return i
    return -1
  }
  const endLabelText = series.map((_, si) => {
    const li = lastIndexOf(si)
    return endLabels && li === n - 1 ? format(values[si][li] as number) : ''
  })
  const maxEndLabel = Math.max(0, ...endLabelText.map((l) => (l ? textWidth(l) : 0)))
  const lastCategoryHalf = n ? Math.ceil(textWidth(data[n - 1].label) / 2) - INSET : 0
  const right = Math.max(maxEndLabel ? maxEndLabel + 14 : 8, lastCategoryHalf, 8)
  const plotW = Math.max(0, width - left - right)
  const step = n > 1 ? (plotW - INSET * 2) / (n - 1) : 0
  const span = scale.max - scale.min || 1

  const x = (index: number) => (n > 1 ? left + INSET + index * step : left + plotW / 2)
  const y = (value: number) => top + ((scale.max - value) / span) * plotH
  const baseValue = scale.min <= 0 && scale.max >= 0 ? 0 : scale.min

  const points: (Point | null)[][] = values.map((row) =>
    row.map((value, index) =>
      value === null ? null : { index, value, x: px(x(index)), y: px(y(value)) },
    ),
  )
  /** Trechos contínuos de cada série (`null` interrompe). */
  const runs = points.map((row) => {
    const out: Point[][] = []
    let current: Point[] = []
    for (const p of row) {
      if (p) current.push(p)
      else if (current.length) {
        out.push(current)
        current = []
      }
    }
    if (current.length) out.push(current)
    return out
  })
  const pathOf = (run: Point[]) => run.map((p, j) => `${j ? 'L' : 'M'}${p.x} ${p.y}`).join('')
  const markersEverywhere = n <= 1 || step >= 18

  // --- Exploração (teclado e ponteiro) -----------------------------------
  const describe = (index: number, si: number) => {
    const value = values[si]?.[index]
    return t('chartPoint', {
      category: data[index].label,
      series: series[si].label,
      value: value === null || value === undefined ? t('chartNoData') : format(value),
    })
  }
  const explorer = useChartExplorer({
    count: n,
    seriesCount: k,
    keys: { next: 'ArrowRight', prev: 'ArrowLeft', seriesNext: 'ArrowDown', seriesPrev: 'ArrowUp' },
    describe,
  })
  const { active, last } = explorer

  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!n) return
    const box = event.currentTarget.getBoundingClientRect()
    const cx0 = event.clientX - box.left
    const cy0 = event.clientY - box.top
    if (cx0 < left || cx0 > left + plotW || cy0 < 0 || cy0 > top + plotH + AXIS_BAND) {
      explorer.handlers.onPointerLeave()
      return
    }
    // A cruz encontra o X: o ponteiro só precisa estar perto da data, não da linha.
    const index =
      n > 1 ? Math.max(0, Math.min(n - 1, Math.round((cx0 - left - INSET) / (step || 1)))) : 0
    let si = 0
    let best = Infinity
    points.forEach((row, s) => {
      const p = row[index]
      if (p && Math.abs(p.y - cy0) < best) {
        best = Math.abs(p.y - cy0)
        si = s
      }
    })
    explorer.point(index, si)
  }

  // --- Movimento ----------------------------------------------------------
  const [motionRef, motion] = useChartMotion<HTMLElement>()
  const rootRef = useMemo(() => mergeRefs(ref, motionRef), [ref, motionRef])
  const animated = motion !== 'static'

  // --- Textos acessíveis -------------------------------------------------
  const autoSummary = () => {
    const parts = [t('chartRange', { first: data[0].label, last: data[n - 1].label })]
    if (k > 1)
      parts.push(
        t('chartSeries', {
          series: formatList(
            locale,
            series.map((s) => s.label),
          ),
        }),
      )
    const ext = extremes(data, series)
    if (ext) {
      parts.push(t('chartHighest', { value: describe(ext.max.index, ext.max.series) }))
      parts.push(t('chartLowest', { value: describe(ext.min.index, ext.min.series) }))
    }
    return parts.join(' ')
  }
  const label = [t('chartLineLabel', { title }), summary ?? (n ? autoSummary() : t('chartEmpty'))]
    .filter(Boolean)
    .join('. ')

  // --- Rótulos no fim das linhas: sem empilhar; quem colide fica para a legenda e a dica.
  const placed: number[] = []
  const endLabelY = series.map((_, si) => {
    const text = endLabelText[si]
    const p = text ? points[si][n - 1] : null
    if (!p || placed.some((yy) => Math.abs(yy - p.y) < 14)) return null
    placed.push(p.y)
    return p.y
  })

  // --- Dica ---------------------------------------------------------------
  let tooltip: ReactNode = null
  if (last && last.index < n && last.series < k) {
    const index = last.index
    const ys = points.map((row) => row[index]?.y).filter((v): v is number => v !== undefined)
    tooltip = (
      <ChartTooltip
        open={active !== null}
        x={x(index)}
        y={ys.length ? Math.min(...ys) - 6 : top + plotH / 2}
        width={width}
        title={data[index].label}
        rows={series.map((s, si) => ({
          key: s.key,
          label: s.label,
          value:
            values[si][index] === null ? t('chartNoData') : format(values[si][index] as number),
          color: colors[si],
          active: k > 1 && si === last.series,
        }))}
      />
    )
  }

  // --- Eixo X: rótulos espaçados para não se encostarem.
  const maxCategory = Math.max(0, ...data.map((d) => textWidth(d.label)))
  const every = n > 1 ? Math.max(1, Math.ceil((maxCategory + 10) / (step || 1))) : 1
  // O ritmo parte do último ponto (o período mais recente sempre tem rótulo).
  const showCategory = (index: number) => (n - 1 - index) % every === 0

  return (
    <ChartFigure
      ref={rootRef}
      title={title}
      description={description}
      source={source}
      hideCaption={hideCaption}
      variant={variant}
      motion={motion}
      legend={series.map((s, i) => ({
        label: s.label,
        color: colors[i],
        mark: 'line' as const,
        dash: dashes[i],
        shape: shapes[i],
      }))}
      table={{
        categoryLabel: categoryLabel ?? t('chartCategory'),
        columns: series.map((s) => s.label),
        rows: data.map((datum, index) => ({
          label: datum.label,
          cells: values.map((row) => row[index]),
        })),
        format,
      }}
      announcement={explorer.announcement}
      hintId={n ? hintId : undefined}
      defaultShowData={defaultShowData}
      {...rest}
      className={cx('or-line-chart', rest.className)}
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
            {animated && (
              <defs>
                {/* Desenho da linha: uma máscara com stroke-dashoffset revela cada série (contínua ou tracejada). */}
                {runs.map((seriesRuns, si) => (
                  <mask
                    key={si}
                    id={`${maskId}-${si}`}
                    maskUnits="userSpaceOnUse"
                    x={-INSET}
                    y={-INSET}
                    width={width + INSET * 2}
                    height={height + INSET * 2}
                  >
                    <path
                      className="or-line-chart__draw or-chart__anim"
                      d={pathOf(seriesRuns.flat())}
                      pathLength={1}
                      style={{ '--_s': si } as CSSProperties}
                    />
                  </mask>
                ))}
              </defs>
            )}

            {/* Grade e rótulos do eixo de valores */}
            <g className="or-line-chart__axis">
              {scale.ticks.map((tick, i) => (
                <g key={tick}>
                  <line
                    className={tick === baseValue ? 'or-chart__baseline' : 'or-chart__grid'}
                    x1={left}
                    x2={left + plotW}
                    y1={crisp(y(tick))}
                    y2={crisp(y(tick))}
                  />
                  <text
                    className="or-chart__tick"
                    x={left - 8}
                    y={px(y(tick))}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {tickLabels[i]}
                  </text>
                </g>
              ))}
              {data.map((datum, index) =>
                showCategory(index) ? (
                  <text
                    key={`${datum.label}-${index}`}
                    className="or-chart__tick or-line-chart__category"
                    x={px(x(index))}
                    y={px(top + plotH + 18)}
                    textAnchor="middle"
                  >
                    {truncate(datum.label, Math.max(step * every - 4, 24))}
                  </text>
                ) : null,
              )}
            </g>

            {/* Cruz vertical no X em destaque: desliza com --or-duration-fast */}
            {last && last.index < n && (
              <line
                className="or-line-chart__crosshair"
                data-state={active ? 'open' : 'closed'}
                x1={0.5}
                x2={0.5}
                y1={top}
                y2={top + plotH}
                style={{ transform: `translateX(${Math.round(x(last.index))}px)` }}
              />
            )}

            {/* Área (uma série) */}
            {filled &&
              runs[0].map((run, ri) => {
                const base = px(y(baseValue))
                const d = `${pathOf(run)}L${run[run.length - 1].x} ${base}L${run[0].x} ${base}Z`
                return (
                  <path
                    key={ri}
                    className="or-line-chart__area or-chart__anim"
                    d={d}
                    style={colorStyle(colors[0])}
                  />
                )
              })}

            {/* Linhas e marcadores */}
            {series.map((s, si) => (
              <g
                key={s.key}
                className="or-line-chart__series"
                data-series={s.key}
                data-emphasis={
                  active && k > 1 ? (si === active.series ? 'active' : 'muted') : undefined
                }
                style={{ ...colorStyle(colors[si]), '--_s': si } as CSSProperties}
              >
                {runs[si].map((run, ri) =>
                  run.length > 1 ? (
                    <path
                      key={ri}
                      className="or-line-chart__line"
                      d={pathOf(run)}
                      strokeDasharray={dashes[si] || undefined}
                      mask={animated ? `url(#${maskId}-${si})` : undefined}
                    />
                  ) : null,
                )}
                {points[si].map((p, index) => {
                  if (!p) return null
                  const isolated = !points[si][index - 1] && !points[si][index + 1]
                  const isActive = active?.index === index
                  const isEnd = index === lastIndexOf(si)
                  if (!markersEverywhere && !isolated && !isActive && !isEnd) return null
                  return (
                    <path
                      key={index}
                      className="or-line-chart__marker or-chart__anim"
                      data-active={isActive || undefined}
                      d={markerPath(shapes[si], p.x, p.y, isActive ? MARKER_R + 1.5 : MARKER_R)}
                      style={
                        {
                          '--_t': n > 1 ? Math.round((index / (n - 1)) * 100) / 100 : 0,
                        } as CSSProperties
                      }
                    />
                  )
                })}
              </g>
            ))}

            {/* Rótulo direto: o último valor, na cor do texto */}
            {series.map((s, si) => {
              const yy = endLabelY[si]
              if (yy === null) return null
              return (
                <text
                  key={s.key}
                  className="or-chart__value or-line-chart__end-label or-chart__anim"
                  x={px(x(n - 1) + MARKER_R + 6)}
                  y={yy}
                  dominantBaseline="middle"
                >
                  {endLabelText[si]}
                </text>
              )
            })}
          </svg>
        )}
        {tooltip}
      </div>
    </ChartFigure>
  )
})
