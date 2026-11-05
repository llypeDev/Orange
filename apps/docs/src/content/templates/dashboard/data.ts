/*
 * Dados fictícios do painel da Aurora. Em um app, venham da API — o formato
 * é o que os componentes esperam (Stat, Sparkline, BarChart, LineChart, Table).
 */
import type { BarChartDatum, BarChartSeries, LineChartDatum, LineChartSeries, StatDeltaTone, StatTrend } from '@orangesys/ui'

export interface Indicador {
  id: string
  label: string
  value: string
  delta: string
  trend: StatTrend
  deltaTone?: StatDeltaTone
  help: string
  /** Últimos 14 dias, do mais antigo ao mais recente. */
  serie: number[]
  /** Texto alternativo da sparkline: a conclusão em palavras. */
  resumo: string
}

export const indicadores: Indicador[] = [
  {
    id: 'receita',
    label: 'Receita',
    value: 'R$ 128,4 mil',
    delta: '12%',
    trend: 'increase',
    help: 'vs. período anterior',
    serie: [3.6, 3.9, 3.7, 4.1, 4.4, 4.2, 4.0, 4.3, 4.6, 4.5, 4.8, 4.7, 5.0, 4.9],
    resumo: 'Receita diária subiu de R$ 3,6 mil para R$ 4,9 mil em 14 dias',
  },
  {
    id: 'pedidos',
    label: 'Pedidos',
    value: '1.284',
    delta: '4%',
    trend: 'increase',
    help: 'vs. período anterior',
    serie: [41, 44, 39, 46, 45, 43, 47, 44, 48, 46, 49, 47, 50, 48],
    resumo: 'Pedidos por dia subiram de 41 para 48 em 14 dias',
  },
  {
    id: 'ticket',
    label: 'Ticket médio',
    value: 'R$ 99,90',
    delta: '7%',
    trend: 'increase',
    help: 'vs. período anterior',
    serie: [92, 94, 93, 95, 96, 94, 97, 96, 98, 97, 99, 98, 101, 100],
    resumo: 'Ticket médio subiu de R$ 92 para R$ 100 em 14 dias',
  },
  {
    id: 'cancelamentos',
    label: 'Cancelamentos',
    value: '2,4%',
    delta: '0,6 p.p.',
    trend: 'decrease',
    // Queda de cancelamento é boa notícia: o tom do delta é invertido.
    deltaTone: 'positive',
    help: 'dos pedidos do período',
    serie: [3.1, 3.0, 3.2, 2.9, 2.8, 2.9, 2.7, 2.6, 2.7, 2.5, 2.6, 2.4, 2.5, 2.4],
    resumo: 'Cancelamentos caíram de 3,1% para 2,4% dos pedidos em 14 dias',
  },
]

export const canais: BarChartSeries[] = [
  { key: 'site', label: 'Loja virtual' },
  { key: 'app', label: 'Aplicativo' },
  { key: 'marketplace', label: 'Marketplaces' },
]

export const receitaPorCanal: BarChartDatum[] = [
  { label: 'jun', values: { site: 48200, app: 21400, marketplace: 15800 } },
  { label: 'jul', values: { site: 51900, app: 24300, marketplace: 16900 } },
  { label: 'ago', values: { site: 50300, app: 27800, marketplace: 18200 } },
  { label: 'set', values: { site: 55100, app: 31200, marketplace: 17600 } },
  { label: 'out', values: { site: 58700, app: 35900, marketplace: 19400 } },
]

export const semanas: LineChartSeries[] = [
  { key: 'atual', label: 'Esta semana' },
  { key: 'anterior', label: 'Semana anterior' },
]

export const pedidosPorDia: LineChartDatum[] = [
  { label: 'seg', values: { atual: 182, anterior: 164 } },
  { label: 'ter', values: { atual: 176, anterior: 171 } },
  { label: 'qua', values: { atual: 195, anterior: 168 } },
  { label: 'qui', values: { atual: 201, anterior: 180 } },
  { label: 'sex', values: { atual: 228, anterior: 207 } },
  { label: 'sáb', values: { atual: 246, anterior: 229 } },
  { label: 'dom', values: { atual: 214, anterior: 198 } },
]

export type StatusPedido = 'pago' | 'separacao' | 'enviado' | 'aguardando' | 'cancelado'

export interface Pedido {
  id: string
  numero: number
  cliente: string
  canal: string
  criadoEm: Date
  total: number
  status: StatusPedido
}

const clientes = [
  'Beatriz L.',
  'Rafael M.',
  'Juliana C.',
  'Thiago S.',
  'Camila R.',
  'Diego A.',
  'Larissa F.',
  'Bruno T.',
  'Paula N.',
  'Gustavo O.',
  'Fernanda V.',
]
const nomesCanais = ['Loja virtual', 'Aplicativo', 'Marketplace', 'Loja física']
const status: StatusPedido[] = ['pago', 'separacao', 'pago', 'enviado', 'aguardando', 'pago', 'enviado', 'cancelado']
const HORA = 60 * 60 * 1000

/** 30 pedidos, um a cada ~22 horas, contando de agora para trás. */
export function gerarPedidos(agora = Date.now()): Pedido[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `pedido-${4821 - i}`,
    numero: 4821 - i,
    cliente: clientes[(i * 7) % clientes.length],
    canal: nomesCanais[(i * 3) % nomesCanais.length],
    criadoEm: new Date(agora - i * 22 * HORA - ((i * 37) % 60) * 60 * 1000),
    total: Math.round((79.9 + ((i * 137) % 640) + (i % 4) * 0.45) * 100) / 100,
    status: status[i % status.length],
  }))
}
