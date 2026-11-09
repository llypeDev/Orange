# ProgressCircle

Indicador circular de progresso, determinado ou indeterminado, com valor central opcional.

- Categoria: Feedback · Status: estável
- Importação: `import { ProgressCircle } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/progress-circle (em inglês: https://orange.llypedev.com.br/en/components/progress-circle)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-progresscircle--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ProgressCircle

## Boas práticas

- Use em espaços compactos — linhas de lista, miniaturas de upload, cartões de meta — ou quando o percentual central for o destaque.
- Com espaço horizontal e um rótulo longo, prefira ProgressBar: barras são mais fáceis de comparar.
- Dê um `label` específico ("Enviando contrato.pdf"). Sem ele, o nome acessível é o genérico "Carregando…".
- O valor central cabe só nos tamanhos md e lg; no sm, mostre o detalhe ao lado, em texto.

## Exemplos

### Tamanhos

sm (24px), md (48px) e lg (80px). O traço tem terminação quadrada e começa no topo.

```tsx
import { ProgressCircle } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <ProgressCircle size="sm" value={68} label="Perfil completo" />
      <ProgressCircle size="md" value={68} showValue label="Perfil completo" />
      <ProgressCircle size="lg" value={68} showValue label="Perfil completo" />
    </div>
  )
}
```

### Indeterminado

Sem value, o arco gira; com movimento reduzido, pulsa.

```tsx
import { ProgressCircle } from '@orangesys/ui'

export default function Indeterminate() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <ProgressCircle size="sm" label="Sincronizando agenda" />
      <ProgressCircle size="md" tone="neutral" label="Sincronizando agenda" />
      <ProgressCircle size="lg" label="Sincronizando agenda" />
    </div>
  )
}
```

### Lista de uploads

```tsx
import { Icon, ProgressCircle } from '@orangesys/ui'
import { useEffect, useState } from 'react'

const files = [
  { name: 'contrato-assinado.pdf', size: '1,2 MB', speed: 9 },
  { name: 'nota-fiscal-4821.xml', size: '48 KB', speed: 25 },
  { name: 'fotos-vistoria.zip', size: '18,4 MB', speed: 4 },
]

export default function Uploads() {
  const [progress, setProgress] = useState(files.map(() => 0))

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((list) => list.map((p, i) => (p >= 100 ? 0 : Math.min(100, p + files[i].speed))))
    }, 300)
    return () => clearInterval(timer)
  }, [])

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', maxWidth: 440 }}>
      {files.map((file, i) => (
        <li
          key={file.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            borderTop: '1px solid var(--or-color-border)',
          }}
        >
          <Icon name="file" />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block' }}>{file.name}</span>
            <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>{file.size}</span>
          </span>
          {progress[i] >= 100 ? (
            <span style={{ color: 'var(--or-color-success-text)', display: 'inline-flex' }}>
              <Icon name="check-circle" label={`${file.name} enviado`} />
            </span>
          ) : (
            <ProgressCircle size="sm" value={progress[i]} label={`Enviando ${file.name}`} />
          )}
        </li>
      ))}
    </ul>
  )
}
```

### Metas

Tons sinalizam a situação; o detalhe com unidade fica na legenda.

```tsx
import { ProgressCircle } from '@orangesys/ui'

const goals = [
  {
    label: 'Meta de vendas',
    detail: 'R$ 82 mil de R$ 100 mil',
    value: 82,
    tone: 'success' as const,
  },
  { label: 'Novos clientes', detail: '31 de 50', value: 62, tone: 'info' as const },
  { label: 'Chamados resolvidos', detail: '44 de 120', value: 37, tone: 'warning' as const },
]

export default function Goals() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
      {goals.map((goal) => (
        <figure
          key={goal.label}
          style={{ display: 'grid', justifyItems: 'center', gap: 10, margin: 0 }}
        >
          <ProgressCircle
            size="lg"
            showValue
            value={goal.value}
            tone={goal.tone}
            label={goal.label}
          />
          <figcaption
            style={{ textAlign: 'center', fontSize: 13, color: 'var(--or-color-text-muted)' }}
          >
            <strong style={{ display: 'block', color: 'var(--or-color-text)' }}>
              {goal.label}
            </strong>
            {goal.detail}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
```

## Movimento

- **Ao montar** — O arco é desenhado a partir do topo (`stroke-dashoffset`) em `--or-duration-slow`, `--or-ease-out`; o valor central entra com fade.
- **Mudança de valor** — Transição de `stroke-dashoffset` em `--or-duration-slow`.
- **Mudança de tom** — A cor do traço transiciona em `--or-duration-medium`.
- **Indeterminado** — O arco gira uma volta a cada 900ms (`--or-duration-loop` × 0.375), linear.
- **Movimento reduzido** — Mudanças instantâneas; o indeterminado pulsa em vez de girar.

## Props

### `ProgressCircle`

Indicador circular de progresso (`role="progressbar"`). Use em espaços
compactos — cartões, miniaturas de upload, botões — ou quando o valor
central for o destaque.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `formatValue` | `((value: number, info: ProgressCircleValueInfo) => string)` | — | Formata o valor exibido e anunciado (`aria-valuetext`). Padrão: percentual. |
| `label` | `string` | — | Nome acessível (`aria-label`). Padrão: `t('loading')`. Prefira algo específico: "Enviando foto", "Sincronizando agenda". |
| `max` | `number` | `100` | — |
| `min` | `number` | `0` | — |
| `showValue` | `boolean` | `false` | Mostra o valor no centro (tamanhos `md` e `lg`, modo determinado). |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Diâmetro: `sm` 24px, `md` 48px, `lg` 80px. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "accent"` | `accent` | Cor do arco. |
| `value` | `number \| null` | — | Valor atual. Sem valor (`undefined`/`null`), o círculo fica indeterminado. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ProgressCircleSize`:

```ts
export type ProgressCircleSize = 'sm' | 'md' | 'lg'
```

`ProgressCircleTone`:

```ts
export type ProgressCircleTone = 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'
```

`ProgressCircleValueInfo`:

```ts
export interface ProgressCircleValueInfo {
  min: number
  max: number
  /** Percentual concluído, de 0 a 100. */
  percent: number
}
```

## Acessibilidade

A raiz é um `role="progressbar"` com nome, `aria-valuenow`/ `min`/`max` e `aria-valuetext`. O SVG e o valor central são `aria-hidden`. Não recebe foco. Para anunciar a conclusão, use um Toast ou uma região `role="status"`.

- **1.4.11** — Arco com contraste mínimo de 3:1 sobre a trilha.
- **2.3.3** — Rotação substituída por pulsação com movimento reduzido.
- **4.1.2** — Papel, nome e valores expostos via ARIA.
