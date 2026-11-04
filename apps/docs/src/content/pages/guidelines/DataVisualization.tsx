import { useTheme } from '@orange/ui'
import { primitives, themes, type ThemeName } from '@orange/tokens'
import { useId, useState, type ReactNode } from 'react'
import { T, useLang, type Localized } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  DefinitionTable,
  DocPage,
  DoDont,
  Prose,
  Section,
} from '../../../kit'
import { ContrastBadge, Segmented, TableWrap } from '../_shared/Blocks'
import { contrastRatio, inkOn } from '../_shared/color'

const { orange, blue, green, amber, red, carbon, paper } = primitives

/* ---------------------------------------------------------------------------
 * Paletas por tema. A ordem categórica foi validada para daltonismo
 * (protanopia/deuteranopia) entre vizinhos e tem ≥ 3:1 contra o fundo.
 * ------------------------------------------------------------------------- */

const categorical: Record<ThemeName, { colors: string[]; other: string; names: string[] }> = {
  dark: {
    colors: [green[500], blue[400], amber[500], orange[600], red[300]],
    other: carbon[500],
    names: ['green-500', 'blue-400', 'amber-500', 'orange-600', 'red-300'],
  },
  light: {
    colors: [green[700], blue[500], amber[700], orange[550], red[700]],
    other: paper[600],
    names: ['green-700', 'blue-500', 'amber-700', 'orange-550', 'red-700'],
  },
}

const sequential: Record<ThemeName, string[]> = {
  light: [
    orange[100],
    orange[200],
    orange[300],
    orange[500],
    orange[600],
    orange[800],
    orange[900],
  ],
  dark: [orange[900], orange[800], orange[700], orange[600], orange[500], orange[300], orange[100]],
}

const diverging: Record<ThemeName, string[]> = {
  light: [blue[700], blue[500], blue[300], paper[400], orange[300], orange[550], orange[800]],
  dark: [blue[300], blue[400], blue[700], carbon[400], orange[800], orange[600], orange[300]],
}

const months: Localized<string>[] = [
  { pt: 'jan', en: 'Jan' },
  { pt: 'fev', en: 'Feb' },
  { pt: 'mar', en: 'Mar' },
  { pt: 'abr', en: 'Apr' },
  { pt: 'mai', en: 'May' },
  { pt: 'jun', en: 'Jun' },
]

/* --- Figura acessível ------------------------------------------------------ */

function Figure({
  title,
  subtitle,
  description,
  source,
  legend,
  viewBox,
  table,
  children,
  aside,
}: {
  title: string
  subtitle?: string
  description: string
  source: string
  legend?: ReactNode
  viewBox: string
  table: { head: string[]; rows: (string | number)[][] }
  children: ReactNode
  aside?: ReactNode
}) {
  const { t } = useLang()
  const id = useId()
  return (
    <figure className="guide-figure">
      <figcaption className="guide-figure__head">
        <span className="guide-figure__title">{title}</span>
        {subtitle && <span className="guide-figure__subtitle">{subtitle}</span>}
      </figcaption>
      {legend}
      <div
        className={aside ? 'guide-figure__body guide-figure__body--aside' : 'guide-figure__body'}
      >
        <svg
          className="guide-figure__svg"
          viewBox={viewBox}
          role="img"
          aria-labelledby={`${id}-t ${id}-d`}
        >
          <title id={`${id}-t`}>{title}</title>
          <desc id={`${id}-d`}>{description}</desc>
          {children}
        </svg>
        {aside}
      </div>
      <p className="guide-figure__source">{source}</p>
      <details className="guide-figure__data">
        <summary>{t({ pt: 'Ver dados em tabela', en: 'View data as a table' })}</summary>
        <table className="doc-table">
          <thead>
            <tr>
              {table.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={String(row[0])}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="guide-figure__num">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

function Legend({
  items,
}: {
  items: { label: string; color: string; shape?: 'circle' | 'square' | 'triangle' }[]
}) {
  return (
    <ul className="guide-legend">
      {items.map((item) => (
        <li key={item.label}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            {item.shape === 'circle' ? (
              <circle cx="7" cy="7" r="5" fill={item.color} />
            ) : item.shape === 'triangle' ? (
              <path d="M7 1.5 13 12.5H1Z" fill={item.color} />
            ) : (
              <rect x="1.5" y="1.5" width="11" height="11" fill={item.color} />
            )}
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/* --- Barras com destaque --------------------------------------------------- */

function BarChart({ theme }: { theme: ThemeName }) {
  const { t, uiLocale } = useLang()
  const values = [312, 348, 401, 377, 452, 518]
  const W = 640
  const H = 300
  const m = { l: 48, r: 16, t: 28, b: 36 }
  const pw = W - m.l - m.r
  const ph = H - m.t - m.b
  const max = 600
  const band = pw / values.length
  const bw = 56
  const y = (v: number) => m.t + ph - (v / max) * ph
  const fmt = (n: number) => n.toLocaleString(uiLocale)
  const accent = themes[theme].accent
  const neutral = categorical[theme].other
  return (
    <Figure
      title={t({ pt: 'Pedidos por mês', en: 'Orders per month' })}
      subtitle={t({
        pt: '1º semestre de 2026 · junho em destaque',
        en: 'H1 2026 · June highlighted',
      })}
      description={t({
        pt: 'Gráfico de barras. Pedidos crescem de 312 em janeiro para 518 em junho, o maior valor do semestre, com uma queda leve em abril.',
        en: 'Bar chart. Orders grow from 312 in January to 518 in June, the highest of the half, with a slight dip in April.',
      })}
      source={t({
        pt: 'Fonte: painel de vendas (dados fictícios).',
        en: 'Source: sales dashboard (fictional data).',
      })}
      viewBox={`0 0 ${W} ${H}`}
      table={{
        head: [t({ pt: 'Mês', en: 'Month' }), t({ pt: 'Pedidos', en: 'Orders' })],
        rows: values.map((v, i) => [t(months[i]), fmt(v)]),
      }}
    >
      {[0, 150, 300, 450, 600].map((tick) => (
        <g key={tick}>
          <line
            x1={m.l}
            x2={W - m.r}
            y1={y(tick)}
            y2={y(tick)}
            className={tick === 0 ? 'guide-viz-axis' : 'guide-viz-grid'}
          />
          <text
            x={m.l - 8}
            y={y(tick)}
            className="guide-viz-tick"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {fmt(tick)}
          </text>
        </g>
      ))}
      {values.map((v, i) => {
        const x = m.l + i * band + (band - bw) / 2
        const last = i === values.length - 1
        return (
          <g key={i} className="guide-viz-mark">
            <rect x={x} y={y(v)} width={bw} height={y(0) - y(v)} fill={last ? accent : neutral}>
              <title>{`${t(months[i])}: ${fmt(v)}`}</title>
            </rect>
            <text x={x + bw / 2} y={H - m.b + 20} className="guide-viz-tick" textAnchor="middle">
              {t(months[i])}
            </text>
            {last && (
              <text x={x + bw / 2} y={y(v) - 8} className="guide-viz-label" textAnchor="middle">
                {fmt(v)}
              </text>
            )}
          </g>
        )
      })}
    </Figure>
  )
}

/* --- Linhas com rótulos diretos ------------------------------------------- */

function LineChart({ theme }: { theme: ThemeName }) {
  const { t, uiLocale } = useLang()
  const colors = categorical[theme].colors
  const series = [
    {
      name: t({ pt: 'Site', en: 'Website' }),
      values: [180, 192, 205, 199, 221, 240],
      shape: 'circle' as const,
    },
    { name: 'App', values: [95, 110, 128, 141, 156, 175], shape: 'square' as const },
    { name: 'Marketplace', values: [120, 118, 112, 125, 119, 130], shape: 'triangle' as const },
  ]
  const W = 640
  const H = 300
  const m = { l: 48, r: 112, t: 20, b: 36 }
  const pw = W - m.l - m.r
  const ph = H - m.t - m.b
  const max = 250
  const x = (i: number) => m.l + (i * pw) / 5
  const y = (v: number) => m.t + ph - (v / max) * ph
  const fmt = (n: number) => n.toLocaleString(uiLocale)

  const marker = (
    shape: 'circle' | 'square' | 'triangle',
    cx: number,
    cy: number,
    color: string,
  ) =>
    shape === 'circle' ? (
      <circle cx={cx} cy={cy} r={4.5} fill={color} className="guide-viz-ring" />
    ) : shape === 'square' ? (
      <rect
        x={cx - 4.5}
        y={cy - 4.5}
        width={9}
        height={9}
        fill={color}
        className="guide-viz-ring"
      />
    ) : (
      <path
        d={`M${cx} ${cy - 5.5} L${cx + 5.5} ${cy + 4.5} L${cx - 5.5} ${cy + 4.5} Z`}
        fill={color}
        className="guide-viz-ring"
      />
    )

  return (
    <Figure
      title={t({ pt: 'Receita por canal', en: 'Revenue by channel' })}
      subtitle={t({
        pt: 'R$ mil por mês · 1º semestre de 2026',
        en: 'BRL thousand per month · H1 2026',
      })}
      description={t({
        pt: 'Gráfico de linhas com três canais. Site sobe de 180 para 240, App cresce todo mês de 95 para 175, e Marketplace oscila entre 112 e 130.',
        en: 'Line chart with three channels. Website rises from 180 to 240, App grows every month from 95 to 175, and Marketplace hovers between 112 and 130.',
      })}
      source={t({
        pt: 'Fonte: financeiro (dados fictícios).',
        en: 'Source: finance (fictional data).',
      })}
      viewBox={`0 0 ${W} ${H}`}
      legend={
        <Legend
          items={series.map((s, i) => ({ label: s.name, color: colors[i], shape: s.shape }))}
        />
      }
      table={{
        head: [t({ pt: 'Mês', en: 'Month' }), ...series.map((s) => s.name)],
        rows: months.map((mo, i) => [t(mo), ...series.map((s) => fmt(s.values[i]))]),
      }}
    >
      {[0, 50, 100, 150, 200, 250].map((tick) => (
        <g key={tick}>
          <line
            x1={m.l}
            x2={m.l + pw}
            y1={y(tick)}
            y2={y(tick)}
            className={tick === 0 ? 'guide-viz-axis' : 'guide-viz-grid'}
          />
          <text
            x={m.l - 8}
            y={y(tick)}
            className="guide-viz-tick"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {tick}
          </text>
        </g>
      ))}
      {months.map((mo, i) => (
        <text key={mo.en} x={x(i)} y={H - m.b + 20} className="guide-viz-tick" textAnchor="middle">
          {t(mo)}
        </text>
      ))}
      {series.map((s, si) => (
        <g key={s.name}>
          <polyline
            points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
            fill="none"
            stroke={colors[si]}
            strokeWidth={2}
          />
          {s.values.map((v, i) => (
            <g key={i}>
              {marker(s.shape, x(i), y(v), colors[si])}
              <title>{`${s.name} · ${t(months[i])}: ${fmt(v)}`}</title>
            </g>
          ))}
          <text
            x={x(5) + 12}
            y={y(s.values[5])}
            className="guide-viz-label"
            dominantBaseline="middle"
          >
            {s.name} <tspan className="guide-viz-tick">{fmt(s.values[5])}</tspan>
          </text>
        </g>
      ))}
    </Figure>
  )
}

/* --- Rosca com texturas ---------------------------------------------------- */

function DonutChart({ theme }: { theme: ThemeName }) {
  const { t, uiLocale } = useLang()
  const [textures, setTextures] = useState(false)
  const pid = useId().replace(/[^a-zA-Z0-9-]/g, '')
  const { colors, other } = categorical[theme]
  const bg = themes[theme].bg
  const data = [
    { label: 'Pix', value: 46, color: colors[0] },
    { label: t({ pt: 'Cartão de crédito', en: 'Credit card' }), value: 31, color: colors[1] },
    { label: 'Boleto', value: 12, color: colors[2] },
    { label: t({ pt: 'Cartão de débito', en: 'Debit card' }), value: 7, color: colors[3] },
    { label: t({ pt: 'Outros', en: 'Other' }), value: 4, color: other },
  ]
  const cx = 120
  const cy = 120
  const R = 104
  const r = 66
  const point = (radius: number, a: number) => [
    cx + radius * Math.cos(a),
    cy + radius * Math.sin(a),
  ]
  let acc = 0
  const arcs = data.map((d) => {
    const a0 = (acc / 100) * Math.PI * 2 - Math.PI / 2
    acc += d.value
    const a1 = (acc / 100) * Math.PI * 2 - Math.PI / 2
    const large = a1 - a0 > Math.PI ? 1 : 0
    const [x0, y0] = point(R, a0)
    const [x1, y1] = point(R, a1)
    const [x2, y2] = point(r, a1)
    const [x3, y3] = point(r, a0)
    return {
      ...d,
      path: `M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 ${large} 0 ${x3} ${y3} Z`,
    }
  })
  const patterns = [
    <line key="a" x1="0" y1="0" x2="0" y2="6" />,
    <line key="b" x1="3" y1="0" x2="3" y2="6" />,
    <circle key="c" cx="3" cy="3" r="1.2" />,
    <line key="d" x1="0" y1="3" x2="6" y2="3" />,
    <path key="e" d="M0 0L6 6M6 0L0 6" />,
  ]
  const rotation = [45, 135, 0, 0, 0]
  const fmtPct = (n: number) => `${n.toLocaleString(uiLocale)}%`

  return (
    <>
      <div className="guide-toolbar">
        <span className="or-eyebrow">
          {t({ pt: 'Codificação secundária', en: 'Secondary encoding' })}
        </span>
        <Segmented
          label={{ pt: 'Preenchimento da rosca', en: 'Donut fill' }}
          value={textures ? 'on' : 'off'}
          onChange={(v) => setTextures(v === 'on')}
          options={[
            { value: 'off', label: { pt: 'Só cor', en: 'Color only' } },
            { value: 'on', label: { pt: 'Cor + textura', en: 'Color + texture' } },
          ]}
        />
      </div>
      <Figure
        title={t({ pt: 'Pedidos por forma de pagamento', en: 'Orders by payment method' })}
        subtitle={t({ pt: 'Março de 2026 · 3.214 pedidos', en: 'March 2026 · 3,214 orders' })}
        description={t({
          pt: 'Gráfico de rosca. Pix 46%, cartão de crédito 31%, boleto 12%, cartão de débito 7% e outros 4%.',
          en: 'Donut chart. Pix 46%, credit card 31%, boleto 12%, debit card 7% and other 4%.',
        })}
        source={t({
          pt: 'Fonte: gateway de pagamentos (dados fictícios).',
          en: 'Source: payment gateway (fictional data).',
        })}
        viewBox="0 0 240 240"
        table={{
          head: [t({ pt: 'Forma', en: 'Method' }), t({ pt: 'Participação', en: 'Share' })],
          rows: data.map((d) => [d.label, fmtPct(d.value)]),
        }}
        aside={
          <ul className="guide-donut-legend">
            {data.map((d, i) => (
              <li key={d.label}>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="13"
                    height="13"
                    fill={textures ? `url(#${pid}-p${i})` : d.color}
                  />
                </svg>
                <span>{d.label}</span>
                <strong>{fmtPct(d.value)}</strong>
              </li>
            ))}
          </ul>
        }
      >
        <defs>
          {data.map((d, i) => (
            <pattern
              key={i}
              id={`${pid}-p${i}`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${rotation[i]})`}
            >
              <rect width="6" height="6" fill={d.color} />
              <g stroke={bg} fill={bg} strokeWidth="1.5" opacity="0.7">
                {patterns[i]}
              </g>
            </pattern>
          ))}
        </defs>
        {arcs.map((a, i) => (
          <path
            key={a.label}
            d={a.path}
            fill={textures ? `url(#${pid}-p${i})` : a.color}
            className="guide-viz-gap"
          >
            <title>{`${a.label}: ${fmtPct(a.value)}`}</title>
          </path>
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" className="guide-viz-total">
          {(3214).toLocaleString(uiLocale)}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="guide-viz-tick">
          {t({ pt: 'pedidos', en: 'orders' })}
        </text>
      </Figure>
    </>
  )
}

/* --- Barras divergentes ---------------------------------------------------- */

function DivergingChart({ theme }: { theme: ThemeName }) {
  const { t, uiLocale } = useLang()
  const scale = diverging[theme]
  const rows = [
    { name: t({ pt: 'Norte', en: 'North' }), v: -12 },
    { name: t({ pt: 'Nordeste', en: 'Northeast' }), v: 8 },
    { name: t({ pt: 'Centro-Oeste', en: 'Center-West' }), v: 3 },
    { name: t({ pt: 'Sudeste', en: 'Southeast' }), v: -4 },
    { name: t({ pt: 'Sul', en: 'South' }), v: 15 },
  ]
  const W = 640
  const rowH = 36
  const top = 12
  const H = top + rows.length * rowH + 28
  const center = 380
  const half = 220
  const max = 20
  const colorFor = (v: number) => {
    const mag = Math.abs(v)
    const step = mag >= 10 ? 3 : mag >= 5 ? 2 : 1
    return scale[3 + Math.sign(v) * step]
  }
  const fmt = (v: number) =>
    `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toLocaleString(uiLocale)}%`
  return (
    <Figure
      title={t({ pt: 'Variação de pedidos por região', en: 'Order change by region' })}
      subtitle={t({ pt: 'Março vs. fevereiro de 2026', en: 'March vs. February 2026' })}
      description={t({
        pt: 'Barras divergentes a partir de zero. Sul +15%, Nordeste +8%, Centro-Oeste +3%, Sudeste −4% e Norte −12%.',
        en: 'Diverging bars from zero. South +15%, Northeast +8%, Center-West +3%, Southeast −4% and North −12%.',
      })}
      source={t({
        pt: 'Fonte: logística (dados fictícios).',
        en: 'Source: logistics (fictional data).',
      })}
      viewBox={`0 0 ${W} ${H}`}
      table={{
        head: [t({ pt: 'Região', en: 'Region' }), t({ pt: 'Variação', en: 'Change' })],
        rows: rows.map((r) => [r.name, fmt(r.v)]),
      }}
    >
      {[-20, -10, 0, 10, 20].map((tick) => {
        const x = center + (tick / max) * half
        return (
          <g key={tick}>
            <line
              x1={x}
              x2={x}
              y1={top - 4}
              y2={H - 24}
              className={tick === 0 ? 'guide-viz-axis' : 'guide-viz-grid'}
            />
            <text x={x} y={H - 8} className="guide-viz-tick" textAnchor="middle">
              {tick === 0 ? '0' : fmt(tick)}
            </text>
          </g>
        )
      })}
      {rows.map((row, i) => {
        const yy = top + i * rowH + 6
        const w = (Math.abs(row.v) / max) * half
        const x = row.v < 0 ? center - w : center
        return (
          <g key={row.name}>
            <text x={8} y={yy + 12} className="guide-viz-label" dominantBaseline="middle">
              {row.name}
            </text>
            <rect x={x} y={yy} width={w} height={24} fill={colorFor(row.v)}>
              <title>{`${row.name}: ${fmt(row.v)}`}</title>
            </rect>
            <text
              x={row.v < 0 ? x - 6 : x + w + 6}
              y={yy + 12}
              className="guide-viz-tick"
              textAnchor={row.v < 0 ? 'end' : 'start'}
              dominantBaseline="middle"
            >
              {fmt(row.v)}
            </text>
          </g>
        )
      })}
    </Figure>
  )
}

/* --- Mapa de calor sequencial (tabela HTML) -------------------------------- */

function Heatmap({ theme }: { theme: ThemeName }) {
  const { t, uiLocale } = useLang()
  const scale = sequential[theme]
  const days: Localized<string>[] = [
    { pt: 'Seg', en: 'Mon' },
    { pt: 'Ter', en: 'Tue' },
    { pt: 'Qua', en: 'Wed' },
    { pt: 'Qui', en: 'Thu' },
    { pt: 'Sex', en: 'Fri' },
    { pt: 'Sáb', en: 'Sat' },
    { pt: 'Dom', en: 'Sun' },
  ]
  const bands: Localized<string>[] = [
    { pt: 'Madrugada', en: 'Overnight' },
    { pt: 'Manhã', en: 'Morning' },
    { pt: 'Tarde', en: 'Afternoon' },
    { pt: 'Noite', en: 'Evening' },
  ]
  const values = [
    [12, 86, 142, 118],
    [9, 92, 151, 126],
    [11, 88, 147, 131],
    [14, 95, 160, 140],
    [18, 104, 171, 188],
    [31, 122, 196, 207],
    [27, 74, 133, 162],
  ]
  const flat = values.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const step = (v: number) =>
    Math.min(scale.length - 1, Math.floor(((v - min) / (max - min)) * scale.length))
  return (
    <TableWrap
      label={{ pt: 'Pedidos por dia e faixa de horário', en: 'Orders by day and time band' }}
    >
      <table className="doc-table guide-heatmap">
        <caption className="doc-table__caption">
          {t({
            pt: 'Pedidos por dia e faixa de horário — média de março de 2026',
            en: 'Orders by day and time band — March 2026 average',
          })}
        </caption>
        <thead>
          <tr>
            <th scope="col">{t({ pt: 'Dia', en: 'Day' })}</th>
            {bands.map((b) => (
              <th scope="col" key={b.en}>
                {t(b)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((d, i) => (
            <tr key={d.en}>
              <th scope="row">{t(d)}</th>
              {values[i].map((v, j) => {
                const bg = scale[step(v)]
                return (
                  <td key={j} style={{ background: bg, color: inkOn(bg) }}>
                    {v.toLocaleString(uiLocale)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  )
}

function Ramp({ colors, labels }: { colors: string[]; labels: [string, string, string?] }) {
  return (
    <div className="guide-ramp">
      <div className="guide-ramp__strip" aria-hidden="true">
        {colors.map((c, i) => (
          <span key={i} style={{ background: c, color: inkOn(c) }}>
            {c}
          </span>
        ))}
      </div>
      <div className="guide-ramp__labels">
        <span>{labels[0]}</span>
        {labels[2] && <span>{labels[2]}</span>}
        <span>{labels[1]}</span>
      </div>
    </div>
  )
}

export default function DataVisualizationPage() {
  const { t } = useLang()
  const { resolvedTheme } = useTheme()
  const theme: ThemeName = resolvedTheme
  const cat = categorical[theme]
  const bg = themes[theme].bg

  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Visualização de dados', en: 'Data visualization' }}
      lead={{
        pt: 'Gráficos no Orange seguem a mesma regra das telas: estrutura visível, cor com propósito e nada que dependa só da cor. Esta página traz as paletas, as regras e modelos de gráficos acessíveis desenhados com SVG puro.',
        en: 'Charts in Orange follow the same rule as screens: visible structure, purposeful color and nothing that depends on color alone. This page covers the palettes, the rules and accessible chart templates drawn with plain SVG.',
      }}
    >
      <Section title={{ pt: 'Escolha a forma antes da cor', en: 'Pick the form before the color' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Um número', en: 'One number' },
              description: {
                pt: 'Não é gráfico: mostre o valor grande, com a variação em texto ao lado.',
                en: 'Not a chart: show the big number with the change as text next to it.',
              },
            },
            {
              term: { pt: 'Comparar categorias', en: 'Compare categories' },
              description: {
                pt: 'Barras, com eixo começando em zero. Horizontais quando os rótulos são longos.',
                en: 'Bars, with the axis starting at zero. Horizontal when labels are long.',
              },
            },
            {
              term: { pt: 'Evolução no tempo', en: 'Change over time' },
              description: {
                pt: 'Linhas para séries contínuas; barras para poucos períodos discretos.',
                en: 'Lines for continuous series; bars for a few discrete periods.',
              },
            },
            {
              term: { pt: 'Parte de um todo', en: 'Part of a whole' },
              description: {
                pt: 'Rosca ou barra empilhada com até 5 fatias; o resto vira “Outros”.',
                en: 'Donut or stacked bar with up to 5 slices; the rest becomes “Other”.',
              },
            },
            {
              term: { pt: 'Acima ou abaixo de uma referência', en: 'Above or below a baseline' },
              description: {
                pt: 'Barras divergentes com a paleta divergente.',
                en: 'Diverging bars with the diverging palette.',
              },
            },
            {
              term: { pt: 'Intensidade em duas dimensões', en: 'Intensity across two dimensions' },
              description: {
                pt: 'Mapa de calor com a paleta sequencial e o valor escrito em cada célula.',
                en: 'Heatmap with the sequential palette and the value written in each cell.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Paleta categórica', en: 'Categorical palette' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Para identificar séries: cinco matizes em ordem fixa, mais um neutro para
                  “Outros”. A ordem não é estética — verde, âmbar e vermelho ficam quase iguais para
                  quem tem protanopia ou deuteranopia, então nunca são vizinhos. Cada tema tem seus
                  próprios tons, validados contra o próprio fundo (a tabela abaixo mostra o tema
                  atual:{' '}
                  <strong>
                    {theme === 'dark'
                      ? t({ pt: 'escuro', en: 'dark' })
                      : t({ pt: 'claro', en: 'light' })}
                  </strong>
                  ).
                </>
              }
              en={
                <>
                  To identify series: five hues in a fixed order, plus a neutral for “Other”. The
                  order isn’t aesthetic — green, amber and red look almost the same to people with
                  protanopia or deuteranopia, so they are never neighbors. Each theme has its own
                  steps, validated against its own background (the table below shows the current
                  theme: <strong>{theme}</strong>).
                </>
              }
            />
          </p>
        </Prose>
        <TableWrap label={{ pt: 'Paleta categórica', en: 'Categorical palette' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Ordem', en: 'Order' })}</th>
                <th scope="col">{t({ pt: 'Cor', en: 'Color' })}</th>
                <th scope="col">{t({ pt: 'Primitiva', en: 'Primitive' })}</th>
                <th scope="col">
                  {t({ pt: 'Contraste com o fundo', en: 'Contrast with background' })}
                </th>
              </tr>
            </thead>
            <tbody>
              {cat.colors.map((c, i) => (
                <tr key={c}>
                  <th scope="row">{i + 1}</th>
                  <td>
                    <span className="guide-token-cell">
                      <span
                        className="guide-swatch-inline guide-swatch-inline--lg"
                        style={{ background: c }}
                        aria-hidden="true"
                      />
                      {c}
                    </span>
                  </td>
                  <td>
                    <Code>--or-palette-{cat.names[i]}</Code>
                  </td>
                  <td>
                    <ContrastBadge ratio={contrastRatio(c, bg)} kind="ui" />
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row">{t({ pt: 'Outros', en: 'Other' })}</th>
                <td>
                  <span className="guide-token-cell">
                    <span
                      className="guide-swatch-inline guide-swatch-inline--lg"
                      style={{ background: cat.other }}
                      aria-hidden="true"
                    />
                    {cat.other}
                  </span>
                </td>
                <td>
                  <Code>--or-palette-{theme === 'dark' ? 'carbon-500' : 'paper-600'}</Code>
                </td>
                <td>
                  <ContrastBadge ratio={contrastRatio(cat.other, bg)} kind="ui" />
                </td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
        <Bullets
          items={[
            {
              pt: 'Atribua as cores na ordem, sem pular. A sexta série não ganha uma cor nova: vira “Outros” ou um gráfico separado.',
              en: 'Assign colors in order, without skipping. A sixth series doesn’t get a new color: it becomes “Other” or a separate chart.',
            },
            {
              pt: 'A cor segue a entidade, não a posição: se um filtro remove uma série, as outras mantêm suas cores.',
              en: 'Color follows the entity, not the position: if a filter removes a series, the others keep their colors.',
            },
            {
              pt: (
                <>
                  Quando a série significa bom ou ruim (erros, metas), use os tokens de status (
                  <Code>success</Code>, <Code>danger</Code>) com ícone e rótulo — nunca misture as
                  duas lógicas no mesmo gráfico.
                </>
              ),
              en: (
                <>
                  When a series means good or bad (errors, goals), use the status tokens (
                  <Code>success</Code>, <Code>danger</Code>) with icon and label — never mix both
                  logics in one chart.
                </>
              ),
            },
            {
              pt: (
                <>
                  O acento continua único: para destacar uma barra ou série, pinte-a com{' '}
                  <Code>--or-color-accent</Code> e deixe o resto no neutro.
                </>
              ),
              en: (
                <>
                  The accent stays single: to highlight a bar or series, paint it with{' '}
                  <Code>--or-color-accent</Code> and leave the rest neutral.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section
        title={{ pt: 'Paletas sequencial e divergente', en: 'Sequential and diverging palettes' }}
      >
        <Prose>
          <p>
            <T
              pt="Sequencial representa quantidade: um único matiz (laranja), do claro ao escuro no tema claro e do escuro ao claro no escuro — o valor alto é sempre o que mais se destaca do fundo. Divergente representa os dois lados de uma referência: azul abaixo, laranja acima, neutro no meio."
              en="Sequential encodes quantity: a single hue (orange), light to dark on the light theme and dark to light on the dark theme — the high value is always the one that stands out most from the background. Diverging encodes both sides of a baseline: blue below, orange above, neutral in the middle."
            />
          </p>
        </Prose>
        <p className="guide-ramp__title">{t({ pt: 'Sequencial', en: 'Sequential' })}</p>
        <Ramp
          colors={sequential[theme]}
          labels={[t({ pt: 'menos', en: 'less' }), t({ pt: 'mais', en: 'more' })]}
        />
        <p className="guide-ramp__title">{t({ pt: 'Divergente', en: 'Diverging' })}</p>
        <Ramp
          colors={diverging[theme]}
          labels={[
            t({ pt: 'abaixo', en: 'below' }),
            t({ pt: 'acima', en: 'above' }),
            t({ pt: 'referência', en: 'baseline' }),
          ]}
        />
        <Heatmap theme={theme} />
        <p className="guide-muted guide-note">
          {t({
            pt: 'No mapa de calor, cada célula mostra o número: a cor ajuda a achar padrões, o texto garante a leitura exata.',
            en: 'In the heatmap each cell shows the number: color helps spot patterns, text guarantees exact reading.',
          })}
        </p>
      </Section>

      <Section title={{ pt: 'Regras', en: 'Rules' }}>
        <DoDont
          doItems={[
            {
              pt: 'Rótulos diretos nas linhas e na barra em destaque, além da legenda.',
              en: 'Direct labels on lines and on the highlighted bar, plus the legend.',
            },
            {
              pt: 'Forma, textura ou posição reforçando a cor (marcadores diferentes por série).',
              en: 'Shape, texture or position reinforcing color (different markers per series).',
            },
            {
              pt: 'Eixo de barras começando em zero e um único eixo vertical.',
              en: 'Bar axis starting at zero and a single vertical axis.',
            },
            {
              pt: 'Linhas de grade discretas (--or-color-border) e texto nos tokens de texto.',
              en: 'Subtle gridlines (--or-color-border) and text in the text tokens.',
            },
            {
              pt: 'Título que diz o quê, subtítulo que diz quando e em que unidade, e a fonte dos dados.',
              en: 'A title that says what, a subtitle that says when and in which unit, and the data source.',
            },
          ]}
          dontItems={[
            {
              pt: 'Legenda como única forma de saber qual cor é qual série.',
              en: 'A legend as the only way to tell which color is which series.',
            },
            {
              pt: 'Gráficos 3D, pizza com mais de 5 fatias ou dois eixos Y.',
              en: '3D charts, pies with more than 5 slices or two Y axes.',
            },
            {
              pt: 'Arco-íris para quantidades — use um só matiz.',
              en: 'Rainbow scales for quantities — use a single hue.',
            },
            {
              pt: 'Texto colorido com a cor da série: o rótulo fica em text e um marcador colorido identifica.',
              en: 'Text in the series color: labels stay in text and a colored marker identifies.',
            },
            {
              pt: 'Um número em cada ponto do gráfico.',
              en: 'A number on every point of the chart.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Modelos', en: 'Templates' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Os gráficos abaixo são SVG desenhado à mão, sem biblioteca. Cada um é um{' '}
                  <Code>&lt;figure&gt;</Code> com o SVG em <Code>role="img"</Code>,{' '}
                  <Code>&lt;title&gt;</Code> e <Code>&lt;desc&gt;</Code> resumindo a conclusão, e a
                  tabela com os dados completos logo abaixo. Passe o mouse sobre as marcas para ver
                  os valores.
                </>
              }
              en={
                <>
                  The charts below are hand-drawn SVG, no library. Each is a{' '}
                  <Code>&lt;figure&gt;</Code> with the SVG as <Code>role="img"</Code>, a{' '}
                  <Code>&lt;title&gt;</Code> and <Code>&lt;desc&gt;</Code> summarizing the takeaway,
                  and the full data table right below. Hover the marks to see the values.
                </>
              }
            />
          </p>
        </Prose>
        <BarChart theme={theme} />
        <LineChart theme={theme} />
        <DonutChart theme={theme} />
        <DivergingChart theme={theme} />
        <Callout tone="info" title={{ pt: 'Gráficos com biblioteca', en: 'Charts with a library' }}>
          <p>
            <T
              pt="Usando Recharts, Visx, ECharts ou similares? Passe as mesmas cores na mesma ordem, desligue animações com movimento reduzido e mantenha a tabela de dados e o resumo em texto."
              en="Using Recharts, Visx, ECharts or similar? Pass the same colors in the same order, turn animations off with reduced motion and keep the data table and the text summary."
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Anatomia de um gráfico', en: 'Chart anatomy' }}>
        <div className="guide-anatomy">
          <div className="guide-anatomy__mock" aria-hidden="true">
            <span className="guide-anatomy__row">
              <span className="guide-anatomy__n">1</span>
              <span className="guide-anatomy__title">
                {t({ pt: 'Pedidos por mês', en: 'Orders per month' })}
              </span>
            </span>
            <span className="guide-anatomy__row">
              <span className="guide-anatomy__n">2</span>
              <span className="guide-anatomy__sub">
                {t({ pt: '1º semestre · unidades', en: 'H1 · units' })}
              </span>
            </span>
            <span className="guide-anatomy__row">
              <span className="guide-anatomy__n">3</span>
              <span className="guide-anatomy__legend">
                <span style={{ background: cat.other }} /> 2025
                <span style={{ background: themes[theme].accent }} /> 2026
              </span>
            </span>
            <svg viewBox="0 0 320 150" className="guide-anatomy__svg">
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="50"
                  x2="316"
                  y1={20 + i * 36}
                  y2={20 + i * 36}
                  className={i === 3 ? 'guide-viz-axis' : 'guide-viz-grid'}
                />
              ))}
              {['600', '400', '200', '0'].map((v, i) => (
                <text
                  key={v}
                  x="44"
                  y={20 + i * 36}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="guide-viz-tick"
                >
                  {v}
                </text>
              ))}
              {[70, 84, 96, 90, 104, 116].map((h, i) => (
                <g key={i}>
                  <rect
                    x={62 + i * 42}
                    y={128 - h * 0.9}
                    width="14"
                    height={h * 0.9}
                    fill={cat.other}
                  />
                  <rect
                    x={78 + i * 42}
                    y={128 - h}
                    width="14"
                    height={h}
                    fill={themes[theme].accent}
                  />
                </g>
              ))}
              <text
                x={85 + 5 * 42}
                y={128 - 116 - 5}
                textAnchor="middle"
                className="guide-viz-label"
              >
                518
              </text>
              {[
                { n: 4, x: 0, y: 13 },
                { n: 5, x: 68, y: 34 },
                { n: 6, x: 305, y: 0 },
              ].map((b) => (
                <g key={b.n} className="guide-anno">
                  <rect x={b.x} y={b.y} width="14" height="14" />
                  <text x={b.x + 7} y={b.y + 7.5} textAnchor="middle" dominantBaseline="middle">
                    {b.n}
                  </text>
                </g>
              ))}
            </svg>
            <span className="guide-anatomy__row">
              <span className="guide-anatomy__n">7</span>
              <span className="guide-anatomy__source">
                {t({
                  pt: 'Fonte: painel de vendas · ver dados em tabela',
                  en: 'Source: sales dashboard · view data as a table',
                })}
              </span>
            </span>
          </div>
          <ol className="guide-anatomy__list">
            <li>
              <strong>{t({ pt: 'Título', en: 'Title' })}</strong> —{' '}
              {t({
                pt: 'o que o gráfico mostra, em display semibold.',
                en: 'what the chart shows, in display semibold.',
              })}
            </li>
            <li>
              <strong>{t({ pt: 'Subtítulo', en: 'Subtitle' })}</strong> —{' '}
              {t({
                pt: 'período e unidade, em text-subtle.',
                en: 'period and unit, in text-subtle.',
              })}
            </li>
            <li>
              <strong>{t({ pt: 'Legenda', en: 'Legend' })}</strong> —{' '}
              {t({
                pt: 'acima do gráfico, na ordem das séries, sempre que houver 2 ou mais.',
                en: 'above the chart, in series order, whenever there are 2 or more.',
              })}
            </li>
            <li>
              <strong>{t({ pt: 'Eixo e grade', en: 'Axis and grid' })}</strong> —{' '}
              {t({
                pt: 'linhas de 1px em border; base em border-strong; números em text-subtle.',
                en: '1px lines in border; baseline in border-strong; numbers in text-subtle.',
              })}
            </li>
            <li>
              <strong>{t({ pt: 'Marcas', en: 'Marks' })}</strong> —{' '}
              {t({
                pt: 'barras retas, linhas de 2px e marcadores de ≥ 8px, separados por 2px de fundo.',
                en: 'square bars, 2px lines and ≥ 8px markers, separated by 2px of background.',
              })}
            </li>
            <li>
              <strong>{t({ pt: 'Rótulo direto', en: 'Direct label' })}</strong> —{' '}
              {t({
                pt: 'só no que importa (o destaque, o fim da linha), na cor de texto.',
                en: 'only on what matters (the highlight, the line end), in text color.',
              })}
            </li>
            <li>
              <strong>{t({ pt: 'Fonte e dados', en: 'Source and data' })}</strong> —{' '}
              {t({
                pt: 'origem dos números e a tabela alternativa para leitores de tela.',
                en: 'where the numbers come from, plus the alternative table for screen readers.',
              })}
            </li>
          </ol>
        </div>
      </Section>
    </DocPage>
  )
}
