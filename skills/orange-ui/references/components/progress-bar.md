# ProgressBar

Barra de progresso linear para tarefas com andamento mensurável — uploads, importações, etapas.

- Categoria: Feedback · Status: estável
- Importação: `import { ProgressBar } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/progress-bar (em inglês: https://orange.llypedev.com.br/en/components/progress-bar)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-progressbar--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ProgressBar

## Boas práticas

- Use para tarefas com andamento mensurável. Sem como medir, deixe a barra indeterminada (sem value) ou use um Spinner.
- Sempre dê um rótulo visível que diga o que está acontecendo ("Enviando 3 arquivos").
- Quando a unidade importa, formate o valor: "320 de 800 contatos" diz mais que "40%". Use `description` para tempo restante ou tamanho.
- Para valores que não são progresso (uso de disco, cota), use Meter.

## Exemplos

### Upload

O valor visível e o aria-valuetext usam o mesmo texto formatado no idioma do provider.

```tsx
import { Button, ProgressBar, VisuallyHidden } from '@orangesys/ui'
import { useEffect, useState } from 'react'

const TOTAL_MB = 2.8

export default function Upload() {
  const [progress, setProgress] = useState<number | null>(null)

  useEffect(() => {
    if (progress === null || progress >= 100) return
    const timer = setTimeout(() => setProgress((p) => Math.min(100, (p ?? 0) + 8)), 250)
    return () => clearTimeout(timer)
  }, [progress])

  const sent = (((progress ?? 0) / 100) * TOTAL_MB).toFixed(1).replace('.', ',')

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 480 }}>
      <ProgressBar
        label="Enviando 3 arquivos"
        value={progress ?? 0}
        tone={progress === 100 ? 'success' : 'accent'}
        description={progress === 100 ? 'Envio concluído' : `${sent} MB de 2,8 MB`}
      />
      {/* a barra não anuncia cada mudança: avise a conclusão numa região de status */}
      <VisuallyHidden role="status">{progress === 100 ? 'Envio concluído' : ''}</VisuallyHidden>
      <div>
        <Button size="sm" variant="outline" onClick={() => setProgress(0)}>
          {progress === null ? 'Enviar arquivos' : 'Enviar novamente'}
        </Button>
      </div>
    </div>
  )
}
```

### Indeterminada

Sem value: sem aria-valuenow. Com movimento reduzido, o segmento deslizante vira uma pulsação.

```tsx
import { ProgressBar } from '@orangesys/ui'

export default function Indeterminate() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <ProgressBar label="Preparando exportação" description="Isso pode levar alguns minutos." />
    </div>
  )
}
```

### Tons e tamanhos

md tem 8px de altura; sm tem 4px.

```tsx
import { ProgressBar } from '@orangesys/ui'

export default function TonesSizes() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 480 }}>
      <ProgressBar label="Meta de vendas de outubro" value={82} tone="success" />
      <ProgressBar label="Treinamento de segurança" value={40} tone="info" />
      <ProgressBar label="Backup noturno" value={64} tone="neutral" size="sm" />
      <ProgressBar
        label="Envio interrompido"
        value={23}
        tone="danger"
        size="sm"
        description="Conexão perdida. Tente novamente."
      />
    </div>
  )
}
```

### Valor formatado

```tsx
import { ProgressBar } from '@orangesys/ui'

export default function CustomFormat() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 480 }}>
      <ProgressBar
        label="Importando contatos"
        value={320}
        max={800}
        formatValue={(value, { max }) => `${value} de ${max} contatos`}
      />
      <ProgressBar
        label="Configuração da conta"
        value={2}
        min={0}
        max={5}
        size="sm"
        formatValue={(value, { max }) => `Etapa ${value} de ${max}`}
      />
    </div>
  )
}
```

## Movimento

- **Ao montar** — O preenchimento cresce do zero até o valor — `transform: scaleX`, `--or-duration-slow` (400ms), `--or-ease-out`.
- **Mudança de valor** — Transição de `scaleX` em `--or-duration-slow` — sem animar `width`.
- **Mudança de tom** — A cor transiciona em `--or-duration-medium` (ex.: accent → success ao concluir).
- **Indeterminado** — Um segmento desliza em loop a cada 1.44s (`--or-duration-loop` × 0.6), `--or-ease-in-out`.
- **Movimento reduzido** — Valores mudam na hora; o indeterminado vira uma pulsação lenta de opacidade.

## Props

### `ProgressBar`

Barra de progresso linear para tarefas com duração mensurável (upload,
importação, etapas). Sem `value`, indica atividade de duração desconhecida.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `description` | `ReactNode` | — | Texto de apoio abaixo da barra, associado via `aria-describedby`. |
| `formatValue` | `((value: number, info: ProgressValueInfo) => string)` | — | Formata o valor exibido e anunciado (`aria-valuetext`). Padrão: percentual no idioma do provider (ex.: "45%"). |
| `label` | `ReactNode` | — | Rótulo visível, associado à barra via `aria-labelledby`. |
| `max` | `number` | `100` | Valor máximo. |
| `min` | `number` | `0` | Valor mínimo. |
| `showValue` | `boolean` | `true` | Mostra o valor formatado ao lado do rótulo (barras determinadas). |
| `size` | `"sm" \| "md"` | `md` | Espessura: `sm` 4px, `md` 8px. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "accent"` | `accent` | Cor da barra. |
| `value` | `number \| null` | — | Valor atual. Sem valor (`undefined`/`null`), a barra fica indeterminada. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ProgressBarSize`:

```ts
export type ProgressBarSize = 'sm' | 'md'
```

`ProgressBarTone`:

```ts
export type ProgressBarTone = 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'
```

`ProgressValueInfo`:

```ts
export interface ProgressValueInfo {
  min: number
  max: number
  /** Percentual concluído, de 0 a 100. */
  percent: number
}
```

## Acessibilidade

A trilha é um `role="progressbar"` com `aria-valuemin`, `aria-valuemax`, `aria-valuenow` e `aria-valuetext` . O valor visível é `aria-hidden` para não ser lido duas vezes. No modo indeterminado, `aria-valuenow` é omitido.

> **Anunciar a conclusão** Leitores de tela não anunciam cada mudança de valor. Ao terminar, avise com um Toast ou uma região role="status" (ex.: “Envio concluído”).

- **1.3.1** — Rótulo visível associado programaticamente à barra.
- **1.4.11** — Preenchimento com contraste mínimo de 3:1 sobre a trilha.
- **2.3.3** — Animação indeterminada substituída por pulsação com movimento reduzido.
- **4.1.2** — Papel, nome e valores expostos via ARIA.
