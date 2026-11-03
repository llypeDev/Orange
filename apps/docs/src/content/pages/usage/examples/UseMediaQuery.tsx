import { useMediaQuery, useReducedMotion } from '@orange/ui'

export default function Ambiente() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const claro = useMediaQuery('(prefers-color-scheme: light)')
  const toque = useMediaQuery('(pointer: coarse)')
  const reduzido = useReducedMotion()
  const linhas: [string, boolean][] = [
    ['(min-width: 1024px)', desktop],
    ['(prefers-color-scheme: light)', claro],
    ['(pointer: coarse)', toque],
    ['useReducedMotion()', reduzido],
  ]
  return (
    <dl className="guide-kv">
      {linhas.map(([consulta, valor]) => (
        <div key={consulta} className="guide-kv__row">
          <dt>{consulta}</dt>
          <dd>
            <span className={valor ? 'guide-bool guide-bool--true' : 'guide-bool'}>{String(valor)}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
