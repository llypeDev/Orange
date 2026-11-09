# Stat

Métrica em destaque com rótulo, variação e contexto; StatGroup organiza várias em uma grade.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Stat, StatGroup } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/stat (em inglês: https://orange.llypedev.com.br/en/components/stat)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-stat--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Stat

## Boas práticas

- Mostre poucas métricas — as que levam a uma decisão. Quatro por linha é o máximo confortável.
- Formate o valor antes de passá-lo (`Intl.NumberFormat`): moeda, separadores e unidades do idioma do usuário.
- Dê contexto à variação com `help` ("vs. outubro"). Uma porcentagem sem referência não diz muito.
- Quando subir é ruim (churn, custo, tempo de espera), inverta a cor com `deltaTone` — a seta continua mostrando a direção.

## Anatomia

- **Rótulo** — O que está sendo medido (<dt>).
- **Valor** — Número em Space Grotesk com tracking negativo e algarismos tabulares (<dd>).
- **Variação** — Seta, valor e tom; texto acessível como "aumento de 12%".
- **Ajuda** — Contexto curto: período de comparação, meta, total.

## Exemplos

### Métrica com variação

trend="increase" mostra a seta para cima no tom positivo e anuncia "aumento de 12%".

```tsx
import { Stat } from '@orangesys/ui'

export default function Single() {
  return (
    <Stat
      label="Receita recorrente mensal"
      value="R$ 48,2 mil"
      delta="12%"
      trend="increase"
      help="vs. outubro"
    />
  )
}
```

### Painel com StatGroup

Grade com divisórias de 1px que reflui para 2 e 1 coluna. Com animate, cada número conta até o valor ao entrar na tela.

```tsx
import { Button, Icon, Stat, StatGroup } from '@orangesys/ui'
import { useState } from 'react'

export default function Dashboard() {
  // Trocar a key remonta o grupo e repete a contagem.
  const [run, setRun] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <StatGroup key={run}>
        <Stat animate label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" help="vs. outubro" />
        <Stat animate label="Pedidos" value={1284} delta="4,3%" trend="increase" help="vs. outubro" />
        <Stat animate label="Ticket médio" value="R$ 37,54" delta="2,1%" trend="decrease" help="vs. outubro" />
        <Stat animate label="Conversão" value="3,8%" delta="0 p.p." trend="neutral" help="estável" />
      </StatGroup>
      <div>
        <Button variant="ghost" size="sm" startIcon={<Icon name="refresh" />} onClick={() => setRun((n) => n + 1)}>
          Repetir animação
        </Button>
      </div>
    </div>
  )
}
```

### Quando cair é bom

deltaTone="positive" em uma queda (churn) e "negative" em um aumento (custo).

```tsx
import { Stat, StatGroup } from '@orangesys/ui'

export default function InvertedTone() {
  return (
    <div style={{ width: '100%' }}>
      {/* Para estas métricas, cair é bom e subir é ruim. */}
      <StatGroup columns={3}>
        <Stat label="Cancelamentos (churn)" value="2,4%" delta="0,6 p.p." trend="decrease" deltaTone="positive" />
        <Stat label="Tempo de primeira resposta" value="1h 12min" delta="18%" trend="decrease" deltaTone="positive" />
        <Stat label="Custo por aquisição" value="R$ 86" delta="9%" trend="increase" deltaTone="negative" />
      </StatGroup>
    </div>
  )
}
```

### Dentro de cartões

Fora de um StatGroup, cada Stat renderiza seu próprio <dl> e pode ser combinado com Card.

```tsx
import { Card, CardBody, CardHeader, Stat } from '@orangesys/ui'

export default function InCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: '100%' }}>
      <Card variant="accent">
        <CardHeader eyebrow="Loja virtual" title="Hoje" headingLevel={4} />
        <CardBody>
          <Stat label="Vendas até 14h" value="R$ 9.870" delta="23%" trend="increase" help="vs. ontem" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Atendimento" title="Esta semana" headingLevel={4} />
        <CardBody>
          <Stat label="Satisfação (CSAT)" value="94%" delta="1 p.p." trend="decrease" help="meta: 92%" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Estoque" title="Agora" headingLevel={4} />
        <CardBody>
          <Stat label="Produtos sem estoque" value="7" help="de 412 ativos" />
        </CardBody>
      </Card>
    </div>
  )
}
```

## Movimento

- **animate** — Conta de zero até o valor quando o Stat entra na tela (useInView + useCountUp, 1,2s com desaceleração). Todos os números do texto são interpolados com os separadores do idioma.
- **Seta da variação** — Entra pela direção da tendência (de baixo no aumento, de cima na queda) com --or-ease-spring, após --or-duration-slow (400ms).
- **Leitores de tela** — O número animado é aria-hidden; o valor final fica no lugar (transparente) e é o único lido.
- **Movimento reduzido** — Mostra o valor final imediatamente, sem contagem.

## Props

### `Stat`

Métrica em destaque: rótulo, número grande e variação opcional, com
semântica de lista de definição (`dt`/`dd`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | O que está sendo medido (vira o `<dt>`). |
| `value` (obrigatória) | `ReactNode` | — | A métrica, já formatada (ex.: "R$ 48,2 mil"). |
| `animate` | `boolean` | `false` | Conta de zero até o valor quando o Stat entra na tela. Funciona com números e com textos já formatados ("R$ 48,2 mil", "1h 12min"). Leitores de tela ouvem só o valor final. Sem efeito em movimento reduzido. |
| `delta` | `ReactNode` | — | Variação exibida ao lado da seta (ex.: "12%"). |
| `deltaTone` | `"neutral" \| "positive" \| "negative"` | — | Se a variação é boa ou ruim. Padrão: aumento → `positive`, queda → `negative`. Inverta para métricas como churn ou tempo de resposta. |
| `format` | `((value: number) => string)` | — | Formata `value` quando ele é um número. Padrão: `Intl.NumberFormat` do idioma. |
| `help` | `ReactNode` | — | Contexto da métrica (ex.: "vs. mês anterior"). |
| `size` | `"sm" \| "md" \| "lg"` | — | Tamanho do número. Padrão: `md` (ou o do `StatGroup`). |
| `trend` | `"neutral" \| "increase" \| "decrease"` | `neutral` | Direção da variação: define a seta e o texto acessível. Padrão: `neutral`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `StatGroup`

Grade de métricas com divisórias de 1px entre as células. Renderiza um
único `<dl>`; cada `Stat` vira um grupo `dt`/`dd`. Reflui para 2 e 1
coluna conforme a largura disponível.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `columns` | `number` | — | Número de colunas em telas largas. Padrão: quantidade de Stats (até 4). |
| `size` | `"sm" \| "md" \| "lg"` | — | Tamanho aplicado a todos os Stats. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`StatDeltaTone`:

```ts
export type StatDeltaTone = 'positive' | 'negative' | 'neutral'
```

`StatSize`:

```ts
export type StatSize = 'sm' | 'md' | 'lg'
```

`StatTrend`:

```ts
export type StatTrend = 'increase' | 'decrease' | 'neutral'
```

## Acessibilidade

Métricas são pares nome–valor, então usam uma lista de definição: `StatGroup` é um único `<dl>` e cada `Stat` é um grupo `<div>` com `<dt>` e `<dd>`. A seta é decorativa; a variação é lida como frase completa ("aumento de 12%", "queda de 3,1%"), traduzida via `useLocale().t()`.

- **1.3.1** — Relação rótulo–valor exposta com <dl>, <dt> e <dd>.
- **1.4.1** — Direção indicada por seta e texto, não só pela cor.
- **1.4.3** — Tons de sucesso e perigo com contraste mínimo de 4.5:1.
- **1.4.10** — A grade reflui para 2 e 1 coluna sem rolagem horizontal.
