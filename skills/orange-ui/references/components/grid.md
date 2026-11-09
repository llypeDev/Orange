# Grid

Grade em duas dimensões: colunas por breakpoint ou automáticas por largura mínima, com variante de bordas de 1px entre as células.

- Categoria: Layout · Status: estável
- Importação: `import { Grid, GridItem } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/grid (em inglês: https://orange.llypedev.com.br/en/components/grid)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-grid--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Grid

## Boas práticas

- Use Grid quando os itens se alinham em linhas e colunas ao mesmo tempo: vitrines de produtos, galerias, painéis de métricas. Para uma única fila, use Stack.
- Escolha entre `columns` (contagem fixa, que pode mudar por breakpoint) e `minItemWidth` (quantas colunas couberem, sem media queries). Para coleções de tamanho variável, `minItemWidth` costuma ser o mais simples.
- Coleções são listas: use `as="ul"` com itens `li` (ou `Card as="li"` ). Pares rótulo/valor ficam bem em `as="dl"` ou com `Stat`.
- Reserve `variant="bordered"` para grades informativas (números, especificações). Cartões clicáveis já têm borda e elevação próprias: use a grade `plain` com `gap`.
- A ordem dos itens na tela é sempre a ordem do código: não há posicionamento manual nem preenchimento "dense" que reordene as células.

## Anatomia

- **Grid** — O contêiner: define colunas, espaçamento e a variante. Qualquer filho direto vira uma célula.
- **GridItem** — Opcional: só para células que ocupam várias colunas (span) ou a linha inteira (full).
- **plain** — Células separadas por gap, sem linhas (padrão).
- **bordered** — Células encostadas, linhas de 1px (--or-color-border) entre elas e moldura externa. O gap vira o respiro interno das células. Funciona com qualquer número de colunas e com a última linha incompleta.

## Exemplos

### Vitrine de produtos

Uma coluna no celular, duas a partir de 640px (sm) e três a partir de 1024px (lg). A grade é uma lista (ul) e cada Card é um li.

```tsx
import { Button, Card, CardBody, CardFooter, CardHeader, Grid, Icon, Text } from '@orangesys/ui'

const produtos = [
  { id: 'flex', categoria: 'Cadeiras', nome: 'Cadeira ergonômica Flex', preco: 'R$ 1.289,90' },
  { id: 'atlas', categoria: 'Mesas', nome: 'Mesa elevatória Atlas', preco: 'R$ 2.490,00' },
  { id: 'arco', categoria: 'Iluminação', nome: 'Luminária de mesa Arco', preco: 'R$ 349,90' },
  {
    id: 'modular',
    categoria: 'Armazenamento',
    nome: 'Estante Modular 4 nichos',
    preco: 'R$ 899,00',
  },
  {
    id: 'slim',
    categoria: 'Armazenamento',
    nome: 'Gaveteiro Slim com rodízios',
    preco: 'R$ 579,90',
  },
  { id: 'apoio', categoria: 'Ergonomia', nome: 'Apoio de pés regulável', preco: 'R$ 189,90' },
]

export default function Produtos() {
  return (
    // 1 coluna no celular, 2 a partir de 640px (sm), 3 a partir de 1024px (lg)
    <Grid as="ul" columns={{ base: 1, sm: 2, lg: 3 }} gap={4} aria-label="Produtos">
      {produtos.map((p) => (
        <Card as="li" key={p.id}>
          <CardHeader eyebrow={p.categoria} title={p.nome} headingLevel={4} />
          <CardBody>
            <Text weight="semibold">{p.preco}</Text>
          </CardBody>
          <CardFooter>
            <Button variant="outline" size="sm" startIcon={<Icon name="plus" />}>
              Adicionar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  )
}
```

### Colunas automáticas

Com minItemWidth="12rem", cabem quantas colunas a largura permitir — sem media queries, e reagindo à largura da própria grade.

```tsx
import { Grid, Icon, Paper, Stack, Text } from '@orangesys/ui'

const integracoes = [
  { id: 'email', icone: 'mail', nome: 'E-mail marketing' },
  { id: 'agenda', icone: 'calendar', nome: 'Agenda de entregas' },
  { id: 'relatorios', icone: 'chart-bar', nome: 'Relatórios' },
  { id: 'estoque', icone: 'layers', nome: 'Controle de estoque' },
  { id: 'cupons', icone: 'tag', nome: 'Cupons de desconto' },
  { id: 'api', icone: 'code', nome: 'API e webhooks' },
] as const

export default function ColunasAutomaticas() {
  return (
    // Quantas colunas couberem com pelo menos 12rem cada — sem media queries.
    // Abaixo de 12rem de largura, cada item ocupa a linha inteira (sem rolagem horizontal).
    <Grid as="ul" minItemWidth="12rem" gap={3} aria-label="Integrações disponíveis">
      {integracoes.map((i) => (
        <Paper as="li" key={i.id} padding={4}>
          <Stack direction="horizontal" gap={3} align="center">
            <Icon name={i.icone} />
            <Text size="sm" weight="medium">
              {i.nome}
            </Text>
          </Stack>
        </Paper>
      ))}
    </Grid>
  )
}
```

### Painel de métricas com bordas

variant="bordered" desenha as linhas de 1px das grades de números do zop.dev. Teste os dois temas e redimensione: as linhas se ajustam a qualquer número de colunas.

```tsx
import { Grid, Stat } from '@orangesys/ui'

export default function Metricas() {
  return (
    // bordered: células encostadas com linhas de 1px; o gap vira o respiro interno de cada célula.
    // Com 5 métricas em 3 colunas, a célula que sobra fica fechada pela moldura.
    <Grid variant="bordered" columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
      <Stat
        size="sm"
        label="Receita do mês"
        value="R$ 48,2 mil"
        delta="12%"
        trend="increase"
        help="vs. fevereiro"
      />
      <Stat
        size="sm"
        label="Pedidos"
        value="1.284"
        delta="4%"
        trend="increase"
        help="vs. fevereiro"
      />
      <Stat
        size="sm"
        label="Ticket médio"
        value="R$ 37,50"
        delta="2%"
        trend="decrease"
        help="vs. fevereiro"
      />
      <Stat
        size="sm"
        label="Taxa de devolução"
        value="1,8%"
        delta="0,3 p.p."
        trend="decrease"
        deltaTone="positive"
        help="vs. fevereiro"
      />
      <Stat size="sm" label="Avaliação média" value="4,7 de 5" help="312 avaliações" />
    </Grid>
  )
}
```

### Células que ocupam várias colunas

GridItem com span="full" ocupa a linha inteira; span={{ base: 1, md: 2 }} ocupa duas das três colunas a partir de 768px.

```tsx
import { Grid, GridItem, Heading, Paper, Stack, Text } from '@orangesys/ui'

export default function Painel() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap={4}>
      {/* span="full": a linha inteira em qualquer número de colunas */}
      <GridItem span="full">
        <Paper tone="subtle" padding={4}>
          <Text size="sm">Fechamento do mês em 3 dias — revise os pedidos pendentes.</Text>
        </Paper>
      </GridItem>

      {/* 1 coluna no celular, 2 de 3 a partir de 768px */}
      <GridItem span={{ base: 1, md: 2 }}>
        <Paper as="section" aria-labelledby="titulo-canais" padding={5} style={{ height: '100%' }}>
          <Stack gap={2}>
            <Heading level={4} id="titulo-canais">
              Vendas por canal
            </Heading>
            <Text size="sm" tone="muted">
              Loja online 62% · Marketplace 28% · Loja física 10%
            </Text>
          </Stack>
        </Paper>
      </GridItem>

      <Paper as="section" aria-labelledby="titulo-pendentes" padding={5}>
        <Stack gap={2}>
          <Heading level={4} id="titulo-pendentes">
            Pendentes
          </Heading>
          <Text size="sm" tone="muted">
            18 pedidos aguardando envio
          </Text>
        </Stack>
      </Paper>
    </Grid>
  )
}
```

## Movimento

- **Grid e GridItem** — Sem movimento próprio. Mudanças de colunas, spans e gap por breakpoint acontecem na hora — animar layout desorienta e custa caro.
- **Entrada escalonada** — Combine com Reveal: cada célula é um <Reveal index={i}> (ou <Reveal as="li"> em listas). Ela sobe 24px e aparece em 600ms (--or-duration-reveal), 80ms (--or-stagger) depois da anterior. O Reveal com stagger escalona os filhos diretos dele — como as células precisam ser filhos diretos da Grid, use index.
- **Grades longas** — Limite o atraso: index={i % 3} (o número de colunas) faz cada linha entrar junta, sem esperar as anteriores.
- **Movimento reduzido** — O Reveal mostra tudo de imediato. As linhas da variante bordered são estáticas.

### Grid com Reveal

As coleções entram uma a uma quando a grade chega à tela (role a página para ver de novo depois de recarregar).

```tsx
import { Grid, Paper, Reveal, Stack, Text } from '@orangesys/ui'

const colecoes = [
  { id: 'home-office', nome: 'Home office', itens: '48 produtos' },
  { id: 'estudos', nome: 'Cantinho de estudos', itens: '32 produtos' },
  { id: 'reunioes', nome: 'Sala de reuniões', itens: '21 produtos' },
  { id: 'recepcao', nome: 'Recepção', itens: '17 produtos' },
  { id: 'copa', nome: 'Copa', itens: '26 produtos' },
  { id: 'deposito', nome: 'Depósito', itens: '14 produtos' },
]

export default function Revelacao() {
  return (
    <Grid as="ul" columns={{ base: 1, sm: 2, lg: 3 }} gap={4} aria-label="Coleções">
      {colecoes.map((c, i) => (
        // Cada item é um Reveal (filho direto da Grid): index soma 80ms por posição.
        // Reveal com stagger não serve aqui — ele escalona os filhos diretos dele, não os da Grid.
        <Reveal as="li" key={c.id} index={i}>
          <Paper padding={5}>
            <Stack gap={1}>
              <Text weight="semibold">{c.nome}</Text>
              <Text size="sm" tone="muted">
                {c.itens}
              </Text>
            </Stack>
          </Paper>
        </Reveal>
      ))}
    </Grid>
  )
}
```

## Props

### `Grid`

Layout em duas dimensões: colunas de mesma largura (fixas por breakpoint ou
automáticas por largura mínima) com espaçamento da escala do sistema.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `div` | Elemento renderizado. Padrão: `div`. Use `ul`/`ol` (com itens `li`) para coleções e `dl` para pares rótulo/valor; listas ganham `role="list"`. |
| `columnGap` | `ResponsiveValue<LayoutGap>` | — | Espaço só entre colunas (substitui `gap` nesse eixo). Responsivo. |
| `columns` | `ResponsiveValue<number>` | — | Número de colunas de mesma largura. Responsivo: `{ base: 1, sm: 2, lg: 4 }`. Padrão: `1`. |
| `gap` | `ResponsiveValue<LayoutGap>` | — | Espaço entre linhas e colunas na escala de espaço (`4` = 1rem). Responsivo. Padrão: `4`. |
| `minItemWidth` | `string` | — | Largura mínima de cada item (`'16rem'`, `'240px'`). Cabem quantas colunas a largura permitir — sem media queries. Tem prioridade sobre `columns`. |
| `rowGap` | `ResponsiveValue<LayoutGap>` | — | Espaço só entre linhas (substitui `gap` nesse eixo). Responsivo. |
| `variant` | `"plain" \| "bordered"` | `plain` | `plain` (padrão) ou `bordered`: as células encostam, separadas por linhas de 1px e com moldura externa, como as grades de números do zop.dev. Em `bordered`, `gap`/`rowGap`/`columnGap` viram o respiro interno de cada célula (o espaço entre a linha e o conteúdo). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `GridItem`

Item de `Grid` que ocupa mais de uma coluna. Itens simples não precisam dele.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `div` | Elemento renderizado. Padrão: `div`. Dentro de `Grid as="ul"`, use `li`. |
| `span` | `ResponsiveValue<GridSpan>` | — | Quantas colunas o item ocupa, ou `full` para a linha inteira. Responsivo: `{ base: 'full', lg: 2 }`. Não passe de `columns` no mesmo breakpoint. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`GridSpan`:

```ts
export type GridSpan = number | 'full'
```

`GridVariant`:

```ts
export type GridVariant = 'plain' | 'bordered'
```

## Acessibilidade

A Grid é puramente visual: a semântica vem de `as`. Coleções devem ser listas (`ul` + `li`) para que leitores de tela anunciem "lista, 6 itens"; a Grid adiciona `role="list"` porque o Safari remove a semântica de listas sem marcadores. As linhas da variante `bordered` são desenhadas só com CSS e não aparecem para tecnologias assistivas.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os elementos focáveis das células na ordem do código: linha por linha, da esquerda para a direita. |

> **Breakpoints olham a janela** columns e span responsivos usam media queries (largura da janela), como os tokens. Dentro de uma área estreita (barra lateral, modal), prefira minItemWidth, que reage à largura da própria grade.

- **1.3.1** — Estrutura real com as (ul, ol, dl); listas mantêm role="list".
- **1.3.2** — Sem posicionamento manual: ordem visual igual à ordem de leitura.
- **1.4.10** — Colunas responsivas e minItemWidth com min(…, 100%) evitam rolagem horizontal a 320px.
- **2.4.3** — A ordem do foco segue a ordem visual das células.
