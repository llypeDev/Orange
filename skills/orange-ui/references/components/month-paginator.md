# MonthPaginator

Navegação entre meses ("‹ Março de 2026 ›") para extratos, agendas e relatórios mensais.

- Categoria: Navegação · Status: estável
- Importação: `import { MonthPaginator } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/month-paginator (em inglês: https://orange.llypedev.com.br/en/components/month-paginator)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-monthpaginator--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/MonthPaginator

## Boas práticas

- Use quando o conteúdo é organizado por mês e a pessoa navega para meses vizinhos: extrato, fatura, escala, relatório. Para escolher uma data específica, use DatePicker.
- Dê um nome ao grupo com `aria-label` ("Mês do extrato") quando houver mais de um na tela.
- Defina `min` e `max` para os meses com dados — ex.: não deixe avançar para meses futuros num extrato.
- `month` vai de 0 (janeiro) a 11 (dezembro), igual a `Date#getMonth()`.

## Exemplos

### Básico

Sem valor inicial, começa no mês atual.

```tsx
import { MonthPaginator } from '@orangesys/ui'

export default function Basic() {
  return <MonthPaginator aria-label="Mês do extrato" />
}
```

### Resumo mensal (controlado)

O mês escolhido filtra o conteúdo abaixo; os limites cobrem só os meses com dados.

```tsx
import { MonthPaginator, Stack, Text, type YearMonth } from '@orangesys/ui'
import { useState } from 'react'

// Dados de exemplo: entradas e saídas por mês (chave "ano-mês").
const resumo: Record<string, { entradas: number; saidas: number }> = {
  '2026-8': { entradas: 18400, saidas: 12950 },
  '2026-9': { entradas: 21300, saidas: 15720 },
  '2026-10': { entradas: 19850, saidas: 9310 },
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Statement() {
  const [mes, setMes] = useState<YearMonth>({ year: 2026, month: 10 })
  const dados = resumo[`${mes.year}-${mes.month}`]

  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
      <MonthPaginator
        aria-label="Mês do resumo"
        value={mes}
        onChange={setMes}
        min={{ year: 2026, month: 8 }}
        max={{ year: 2026, month: 10 }}
      />
      {dados ? (
        <dl
          style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px 24px', margin: 0 }}
        >
          <dt>Entradas</dt>
          <dd style={{ margin: 0, textAlign: 'right' }}>{moeda.format(dados.entradas)}</dd>
          <dt>Saídas</dt>
          <dd style={{ margin: 0, textAlign: 'right' }}>{moeda.format(dados.saidas)}</dd>
          <dt>
            <strong>Saldo do mês</strong>
          </dt>
          <dd style={{ margin: 0, textAlign: 'right' }}>
            <strong>{moeda.format(dados.entradas - dados.saidas)}</strong>
          </dd>
        </dl>
      ) : (
        <Text tone="muted">Sem movimentações neste mês.</Text>
      )}
    </Stack>
  )
}
```

### Últimos 12 meses

No limite, o botão continua focável com aria-disabled — o foco não se perde.

```tsx
import { MonthPaginator } from '@orangesys/ui'

const hoje = new Date()

export default function Limits() {
  return (
    <MonthPaginator
      aria-label="Mês da fatura"
      defaultValue={{ year: hoje.getFullYear(), month: hoje.getMonth() }}
      min={{ year: hoje.getFullYear() - 1, month: hoje.getMonth() }}
      max={{ year: hoje.getFullYear(), month: hoje.getMonth() }}
    />
  )
}
```

### Tamanhos e formato curto

```tsx
import { MonthPaginator, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={4} align="start">
      <MonthPaginator
        size="sm"
        monthFormat="short"
        defaultValue={{ year: 2026, month: 2 }}
        aria-label="Mês (pequeno)"
      />
      <MonthPaginator size="md" defaultValue={{ year: 2026, month: 2 }} aria-label="Mês (médio)" />
      {/* O lg tem ~285px: numa prévia estreita (celular de 320px) ele rola na horizontal. */}
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <MonthPaginator
          size="lg"
          defaultValue={{ year: 2026, month: 2 }}
          aria-label="Mês (grande)"
        />
      </div>
      <MonthPaginator
        disabled
        defaultValue={{ year: 2026, month: 2 }}
        aria-label="Mês (desabilitado)"
      />
    </Stack>
  )
}
```

## Movimento

- **Próximo / anterior** — O novo mês entra deslizando 8px na direção da navegação com fade, enquanto o anterior sai para o outro lado · medium (entrada) e fast (saída).
- **Hover e foco** — Fundo e cor dos botões · fast; a seta empurra 2px para o seu lado · medium, ease-out.
- **Pressionar** — Fundo ativo e o ícone afunda 1px · press (90ms).
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `MonthPaginator`

Navegação entre meses ("‹ Março de 2026 ›") para filtrar extratos,
agendas e relatórios mensais. O rótulo central é anunciado a leitores
de tela a cada mudança.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `YearMonth` | — | Mês inicial (não controlado). Padrão: mês atual. |
| `disabled` | `boolean` | `false` | — |
| `max` | `YearMonth` | — | Último mês permitido — o botão "Próximo mês" fica indisponível nele. |
| `min` | `YearMonth` | — | Primeiro mês permitido — o botão "Mês anterior" fica indisponível nele. |
| `monthFormat` | `"long" \| "short"` | `long` | Formato do nome do mês. Padrão: `long` ("Março de 2026"). |
| `onChange` | `((value: YearMonth) => void)` | — | Chamado com o novo mês ao clicar em anterior/próximo. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura dos botões: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `YearMonth` | — | Mês exibido (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`MonthPaginatorSize`:

```ts
export type MonthPaginatorSize = 'sm' | 'md' | 'lg'
```

`YearMonth`:

```ts
/** Um mês do calendário. `month` vai de 0 (janeiro) a 11 (dezembro), como em `Date#getMonth()`. */
export interface YearMonth {
  year: number
  month: number
}
```

## Acessibilidade

Um `role="group"` nomeado com dois `<button>` nativos ("Mês anterior" e "Próximo mês"). O rótulo central fica numa região `aria-live="polite"`, então o novo mês é anunciado após cada clique sem mover o foco. Nos limites, os botões usam `aria-disabled` em vez de `disabled` para continuarem focáveis.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move entre "Mês anterior" e "Próximo mês". |
| `Enter` | Ativa o botão focado. |
| `Space` | Ativa o botão focado. |

- **2.4.6** — Botões com nomes descritivos traduzidos.
- **2.4.3** — Foco permanece no botão ao chegar no limite.
- **2.5.8** — Alvos de 32×32px (sm) a 48×48px (lg).
- **4.1.3** — Mudança de mês anunciada via `aria-live`.
