import { forwardRef, useMemo, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../utils'
import './Highlight.css'

export interface HighlightProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Texto em que os termos serão destacados. */
  children: string
  /** Termo ou lista de termos a destacar. Termos vazios são ignorados. */
  query: string | string[]
  /** Elemento que envolve o texto. Padrão: `span`. */
  as?: ElementType
  /** Diferencia maiúsculas de minúsculas. Padrão: `false`. */
  caseSensitive?: boolean
  /** Diferencia letras acentuadas ("é" ≠ "e"). Padrão: `false`. */
  accentSensitive?: boolean
  /** Classe extra aplicada a cada `<mark>`. */
  markClassName?: string
}

interface FoldOptions {
  caseSensitive: boolean
  accentSensitive: boolean
}

const COMBINING_MARK = /\p{M}/u

function fold(value: string, { caseSensitive, accentSensitive }: FoldOptions) {
  let out = value
  if (!accentSensitive) out = out.normalize('NFD').replace(/\p{M}/gu, '')
  if (!caseSensitive) out = out.toLocaleLowerCase()
  return out
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Encontra os intervalos [início, fim) do texto original que correspondem aos
 * termos, comparando versões "dobradas" (sem acento/caixa) e mapeando os
 * índices de volta ao texto original.
 */
function findRanges(text: string, queries: string[], options: FoldOptions): [number, number][] {
  const terms = Array.from(new Set(queries.map((q) => fold(q.trim(), options)).filter(Boolean)))
  if (terms.length === 0 || !text) return []

  let folded = ''
  const starts: number[] = []
  const ends: number[] = []
  for (let i = 0; i < text.length; ) {
    const char = String.fromCodePoint(text.codePointAt(i)!)
    const piece = fold(char, options)
    for (let k = 0; k < piece.length; k++) {
      starts.push(i)
      ends.push(i + char.length)
    }
    folded += piece
    i += char.length
  }

  // Cada termo é buscado separadamente para que ocorrências sobrepostas
  // ("ab" e "bc" em "abc") sejam unidas em um único destaque.
  const found: [number, number][] = []
  for (const term of terms) {
    const pattern = new RegExp(escapeRegExp(term), 'g')
    let match: RegExpExecArray | null
    while ((match = pattern.exec(folded))) {
      let end = ends[match.index + match[0].length - 1]
      // inclui acentos combinantes que seguem a última letra (texto em NFD)
      while (end < text.length && COMBINING_MARK.test(text[end])) end += 1
      found.push([starts[match.index], end])
    }
  }
  found.sort((a, b) => a[0] - b[0] || b[1] - a[1])
  const ranges: [number, number][] = []
  for (const [start, end] of found) {
    const last = ranges[ranges.length - 1]
    if (last && start <= last[1]) last[1] = Math.max(last[1], end)
    else ranges.push([start, end])
  }
  return ranges
}

/**
 * Destaca termos de busca dentro de um texto com `<mark>`. A comparação ignora
 * acentos e maiúsculas por padrão, e os termos são tratados como texto literal.
 */
export const Highlight = forwardRef<HTMLElement, HighlightProps>(function Highlight(
  {
    children,
    query,
    as: Component = 'span',
    caseSensitive = false,
    accentSensitive = false,
    markClassName,
    className,
    ...rest
  },
  ref,
) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const queries = Array.isArray(query) ? query : [query]
  const queryKey = queries.join('\u0000')

  const parts = useMemo(() => {
    const ranges = findRanges(text, queryKey.split('\u0000'), { caseSensitive, accentSensitive })
    const out: ReactNode[] = []
    let cursor = 0
    ranges.forEach(([start, end], index) => {
      if (start > cursor) out.push(text.slice(cursor, start))
      out.push(
        <mark key={index} className={cx('or-highlight__mark', markClassName)}>
          {text.slice(start, end)}
        </mark>,
      )
      cursor = end
    })
    if (cursor < text.length) out.push(text.slice(cursor))
    return out
  }, [text, queryKey, caseSensitive, accentSensitive, markClassName])

  return (
    <Component ref={ref} className={cx('or-highlight', className)} {...rest}>
      {parts}
    </Component>
  )
})
