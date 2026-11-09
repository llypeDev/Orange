# Meter

Medidor de um valor dentro de uma faixa conhecida — armazenamento, cotas, níveis — com cor por faixa.

- Categoria: Feedback · Status: estável
- Importação: `import { Meter } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/meter (em inglês: https://orange.llypedev.com.br/en/components/meter)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-meter--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Meter

## Boas práticas

- Use Meter para um valor estático dentro de uma escala (uso, cota, nível). Para o andamento de uma tarefa, use ProgressBar.
- Defina `low`, `high` e `optimum` quando a faixa importar: a cor muda sozinha para success, warning ou danger.
- A cor não pode ser a única pista: em faixas críticas, explique a consequência na descrição ("novos uploads serão bloqueados").
- Mostre o valor com a unidade ("92 GB de 128 GB") — percentuais sozinhos escondem a escala.

## Faixas e cor

O cálculo segue o elemento `<meter>` do HTML: `low` e `high` dividem a escala em três faixas, e a faixa onde está o `optimum` é a ideal.

- **Ótimo → success** — O valor está na mesma faixa do optimum.
- **Subótimo → warning** — O valor está numa faixa vizinha à ideal.
- **Crítico → danger** — O valor está na faixa oposta à ideal (ex.: disco quase cheio quando o ideal é vazio).
- **Sem faixas → accent** — Sem low/high, o medidor só mostra o valor, em laranja.

## Exemplos

### Armazenamento (baixo é bom)

optimum={0} abaixo de low: até 90 GB é ótimo, até 115 GB atenção, acima disso crítico. As marcas indicam os limites.

```tsx
import { Meter } from '@orangesys/ui'

const gb = (value: number, { max }: { max: number }) => `${value} GB de ${max} GB`

export default function Storage() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 480 }}>
      {/* valores baixos são bons: optimum abaixo de low */}
      <Meter label="Fotos" value={38} max={128} low={90} high={115} optimum={0} formatValue={gb} />
      <Meter
        label="Backups"
        value={102}
        max={128}
        low={90}
        high={115}
        optimum={0}
        formatValue={gb}
      />
      <Meter
        label="Vídeos"
        value={124}
        max={128}
        low={90}
        high={115}
        optimum={0}
        formatValue={gb}
        description="Quase sem espaço: novos uploads serão bloqueados em 4 GB."
      />
    </div>
  )
}
```

### Bateria (alto é bom)

```tsx
import { Meter } from '@orangesys/ui'

export default function HighIsGood() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 480 }}>
      {/* valores altos são bons: optimum acima de high */}
      <Meter label="Bateria do leitor de cartão" value={86} low={20} high={50} optimum={100} />
      <Meter label="Bateria do totem" value={34} low={20} high={50} optimum={100} />
      <Meter
        label="Bateria da maquininha"
        value={12}
        low={20}
        high={50}
        optimum={100}
        description="Conecte ao carregador."
      />
    </div>
  )
}
```

### Sem faixas

```tsx
import { Meter } from '@orangesys/ui'

const fmt = new Intl.NumberFormat('pt-BR')

export default function Neutral() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 480 }}>
      {/* sem low/high: tom accent, sem julgamento de faixa */}
      <Meter
        label="Requisições à API este mês"
        value={6400}
        max={10000}
        formatValue={(value, { max }) => `${fmt.format(value)} de ${fmt.format(max)}`}
        description="A cota renova em 3 dias."
      />
      <Meter
        label="Assentos usados"
        value={7}
        max={10}
        size="sm"
        formatValue={(v, { max }) => `${v} de ${max}`}
      />
    </div>
  )
}
```

### Mudando de faixa

Arraste o controle para ver a cor acompanhar o valor.

```tsx
import { Meter, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Interactive() {
  const [value, setValue] = useState(72)

  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 480 }}>
      <Meter
        label="Uso de CPU do servidor"
        value={value}
        low={60}
        high={85}
        optimum={0}
        description="Faixas: até 60% normal, até 85% atenção, acima disso crítico."
      />
      <label style={{ display: 'grid', gap: 8, color: 'var(--or-color-text-muted)', fontSize: 13 }}>
        Simular carga
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </label>
    </Stack>
  )
}
```

## Movimento

- **Ao montar** — O preenchimento cresce do zero (`scaleX`, `--or-duration-slow`) e as marcas de low/high aparecem em seguida (`or-scale-in`, `--or-ease-bounce`).
- **Mudança de valor** — Transição de `scaleX` em `--or-duration-slow`.
- **Troca de faixa** — Ao cruzar low/high, a cor muda com transição (success → warning → danger) em `--or-duration-medium`.
- **Movimento reduzido** — Mudanças instantâneas.

## Props

### `Meter`

Medidor de um valor escalar dentro de uma faixa conhecida — uso de
armazenamento, cota de API, força de senha. Para o andamento de uma tarefa,
use `ProgressBar`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` (obrigatória) | `number` | — | Valor medido. |
| `description` | `ReactNode` | — | Texto de apoio abaixo do medidor, associado via `aria-describedby`. |
| `formatValue` | `((value: number, info: MeterValueInfo) => string)` | — | Formata o valor exibido e anunciado (`aria-valuetext`). Padrão: percentual. |
| `high` | `number` | — | Limite inferior da faixa "alta". |
| `label` | `ReactNode` | — | Rótulo visível, associado via `aria-labelledby`. |
| `low` | `number` | — | Limite superior da faixa "baixa". |
| `max` | `number` | `100` | Fim da escala. |
| `min` | `number` | `0` | Início da escala. |
| `optimum` | `number` | — | Valor ideal. Define qual faixa é boa: se estiver abaixo de `low`, valores baixos são ótimos (ex.: uso de disco); acima de `high`, valores altos são ótimos (ex.: bateria). Padrão: o meio da escala. |
| `showThresholds` | `boolean` | `true` | Mostra marcas nos limites `low` e `high`. |
| `showValue` | `boolean` | `true` | Mostra o valor formatado ao lado do rótulo. |
| `size` | `"sm" \| "md"` | `md` | Espessura: `sm` 4px, `md` 8px. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "accent"` | — | Força uma cor. Sem esta prop, a cor vem das faixas: ótimo → `success`, subótimo → `warning`, crítico → `danger` (ou `accent` sem `low`/`high`). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`MeterLevel`:

```ts
/** Faixa do valor em relação ao ótimo (mesmo algoritmo do `<meter>` nativo). */
export type MeterLevel = 'optimum' | 'suboptimum' | 'critical'
```

`MeterSize`:

```ts
export type MeterSize = 'sm' | 'md'
```

`MeterTone`:

```ts
export type MeterTone = 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'
```

`MeterValueInfo`:

```ts
export interface MeterValueInfo {
  min: number
  max: number
  /** Posição do valor na escala, de 0 a 100. */
  percent: number
}
```

## Acessibilidade

O medidor usa `role="meter"` (ARIA 1.2) com `aria-valuenow`, `aria-valuemin`, `aria-valuemax` e `aria-valuetext` — o mesmo texto exibido, com unidade. Usamos um elemento com papel em vez do `<meter>` nativo para ter visual consistente entre navegadores. A faixa atual fica em `data-level`.

- **1.3.1** — Rótulo e descrição associados programaticamente.
- **1.4.1** — Faixas críticas devem ser explicadas em texto, não só pela cor.
- **1.4.11** — Preenchimento com contraste mínimo de 3:1 sobre a trilha.
- **4.1.2** — Papel, nome e valores expostos via ARIA.
