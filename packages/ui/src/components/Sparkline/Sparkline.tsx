import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes } from 'react'
import { cx, devWarning, mergeRefs } from '../../utils'
import { useChartMotion } from '../BarChart/ChartFrame'
import { px } from '../BarChart/chartUtils'
import './Sparkline.css'

export interface SparklineProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Valores em ordem (o último é o período atual). */
  data: number[]
  /**
   * Resumo da tendência em palavras — é o texto alternativo do gráfico
   * (ex.: "Vendas subiram 18% em 7 dias"). Obrigatório.
   */
  label: string
  /** Largura em px. Padrão: 96. */
  width?: number
  /** Altura em px. Padrão: 28. */
  height?: number
  /** Cor da linha. Padrão: o neutro `--or-color-viz-other` (o ponto final usa o acento). */
  color?: string
  /** Preenche a área sob a linha. */
  area?: boolean
  /** Ponto no último valor, no acento. Padrão: `true`. */
  showEndPoint?: boolean
  /** Marca o menor e o maior valor. */
  showMinMax?: boolean
}

const PAD = 4

/**
 * Tendência em miniatura, para usar junto de um número (Stat, tabelas, listas).
 * Não interativa: sem eixos nem legenda — o `label` diz em palavras o que a
 * linha mostra. Desenha-se uma vez ao entrar na tela.
 */
export const Sparkline = forwardRef<HTMLSpanElement, SparklineProps>(function Sparkline(
  {
    data,
    label,
    width = 96,
    height = 28,
    color = 'var(--or-color-viz-other)',
    area = false,
    showEndPoint = true,
    showMinMax = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  devWarning(!label, 'Sparkline precisa de `label` resumindo a tendência em palavras.')
  const values = data.filter((v) => Number.isFinite(v))
  const n = values.length
  const min = n ? Math.min(...values) : 0
  const max = n ? Math.max(...values) : 0
  const span = max - min
  const x = (i: number) => px(n > 1 ? PAD + (i * (width - PAD * 2)) / (n - 1) : width / 2)
  const y = (v: number) => px(span ? PAD + ((max - v) / span) * (height - PAD * 2) : height / 2)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join('')
  const minIndex = values.indexOf(min)
  const maxIndex = values.indexOf(max)
  const lastIndex = n - 1

  const [motionRef, motion] = useChartMotion<HTMLSpanElement>()
  const rootRef = useMemo(() => mergeRefs(ref, motionRef), [ref, motionRef])

  return (
    <span
      ref={rootRef}
      role="img"
      aria-label={label}
      className={cx('or-sparkline', className)}
      data-motion={motion}
      style={{ width, height, '--_color': color, ...style } as CSSProperties}
      {...rest}
    >
      <svg className="or-sparkline__svg" width={width} height={height} aria-hidden="true" focusable="false">
        {area && n > 1 && (
          <path
            className="or-sparkline__area or-chart__anim"
            d={`${d}L${x(lastIndex)} ${height}L${x(0)} ${height}Z`}
          />
        )}
        {n > 1 && <path className="or-sparkline__line or-chart__anim" d={d} pathLength={1} />}
        {showMinMax && n > 1 && span > 0 && (
          <g className="or-sparkline__extremes">
            <circle className="or-sparkline__dot or-sparkline__dot--min or-chart__anim" cx={x(minIndex)} cy={y(min)} r={2.5} />
            <circle className="or-sparkline__dot or-sparkline__dot--max or-chart__anim" cx={x(maxIndex)} cy={y(max)} r={2.5} />
          </g>
        )}
        {showEndPoint && n > 0 && (
          <circle className="or-sparkline__dot or-sparkline__dot--end or-chart__anim" cx={x(lastIndex)} cy={y(values[lastIndex])} r={3} />
        )}
      </svg>
    </span>
  )
})
