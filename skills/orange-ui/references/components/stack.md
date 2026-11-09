# Stack

Empilha elementos na vertical ou na horizontal com espaçamento da escala — e muda de direção por breakpoint, sem escrever CSS.

- Categoria: Layout · Status: estável
- Importação: `import { Stack } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/stack (em inglês: https://orange.llypedev.com.br/en/components/stack)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-stack--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Stack

## Boas práticas

- Use Stack para qualquer sequência em uma dimensão: campos de um formulário, seções de uma página, grupos de botões, metadados em linha. Para linhas e colunas ao mesmo tempo, use Grid.
- Prefira `gap` a margens nos filhos: o espaço fica num lugar só e segue a escala (`4` = 16px, `6` = 24px, `8` = 32px).
- O padrão mais comum é **empilhado no celular, em linha no desktop**: `direction={{ base: 'vertical', md: 'horizontal' }}`. Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px (largura da janela).
- Escolha o elemento com `as`: `ul`/`ol` para listas (com itens `li`), `nav` para grupos de links, `section` com título para regiões.
- Não existe `reverse`, de propósito: a ordem visual é sempre a ordem do código. Se o item precisa aparecer antes, mude-o de lugar no JSX — assim leitores de tela e o Tab seguem a mesma ordem que os olhos (WCAG 1.3.2).

- Faça: A ordem do código é a ordem da tela.
- Evite: row-reverse: o Tab vai de Salvar para Cancelar, ao contrário do que se vê.

## Opções de layout

- **`direction`** — vertical (coluna, padrão) ou horizontal (linha). Responsivo.
- **`gap`** — Escala de espaço: 0, 1, 2, 3, 4 (padrão, 16px), 5, 6, 8, 10, 12, 16. Responsivo.
- **`align`** — Eixo cruzado: start, center, end, stretch (padrão) e baseline.
- **`justify`** — Eixo principal: start (padrão), center, end, between, around e evenly.
- **`separator`** — Linha de 1px entre os filhos, com gap de cada lado. Acompanha a direção sozinha, inclusive a responsiva.

## Exemplos

### Página de configurações

Stacks aninhadas montam a seção inteira: título, lista de preferências com separadores e ações alinhadas à direita — sem nenhuma linha de CSS.

```tsx
import { Button, Heading, Stack, Switch, Text } from '@orangesys/ui'

const preferencias = [
  {
    id: 'resumo',
    label: 'Resumo semanal de vendas',
    description: 'Toda segunda-feira, às 8h.',
    ligado: true,
  },
  {
    id: 'estoque',
    label: 'Alerta de estoque baixo',
    description: 'Quando um produto tiver menos de 5 unidades.',
    ligado: true,
  },
  {
    id: 'avaliacoes',
    label: 'Novas avaliações',
    description: 'Assim que um cliente avaliar um pedido.',
    ligado: false,
  },
]

export default function Configuracoes() {
  return (
    <Stack as="section" gap={6} aria-labelledby="titulo-notificacoes" style={{ maxWidth: 560 }}>
      <Stack gap={1}>
        <Heading level={4} id="titulo-notificacoes">
          Notificações por e-mail
        </Heading>
        <Text size="sm" tone="muted">
          Escolha o que a equipe da loja recebe na caixa de entrada.
        </Text>
      </Stack>

      {/* as="ul" mantém a lista; separator desenha a linha de 1px entre os itens */}
      <Stack as="ul" separator gap={4} aria-label="Preferências de notificação">
        {preferencias.map((p) => (
          <li key={p.id}>
            <Switch
              labelPosition="start"
              label={p.label}
              description={p.description}
              defaultChecked={p.ligado}
            />
          </li>
        ))}
      </Stack>

      <Stack direction="horizontal" justify="end" gap={3}>
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar preferências</Button>
      </Stack>
    </Stack>
  )
}
```

### Direção responsiva

Empilhado no celular, em linha a partir de 768px (md), com o gap crescendo junto. Redimensione a janela para ver a troca — os breakpoints olham a largura da janela, não a da prévia.

```tsx
import { Badge, Button, Heading, Stack, Text } from '@orangesys/ui'

export default function DirecaoResponsiva() {
  return (
    // Empilhado no celular; em linha a partir de 768px (md), com mais espaço
    <Stack
      direction={{ base: 'vertical', md: 'horizontal' }}
      gap={{ base: 4, md: 8 }}
      justify="between"
      align="start"
    >
      <Stack gap={2}>
        <Stack direction="horizontal" gap={2} align="center">
          <Heading level={4}>Plano Pro</Heading>
          <Badge tone="accent">Atual</Badge>
        </Stack>
        <Text size="sm" tone="muted">
          Até 10 lojas, relatórios diários e suporte em português. Renova em 12 de março.
        </Text>
      </Stack>
      <Stack direction="horizontal" gap={3} wrap>
        <Button variant="outline">Ver faturas</Button>
        <Button>Mudar de plano</Button>
      </Stack>
    </Stack>
  )
}
```

### Alinhamento e distribuição

justify="between" separa dois grupos numa barra de ações; wrap deixa o segundo grupo descer quando falta espaço. align="baseline" alinha textos de tamanhos diferentes.

```tsx
import { Button, Icon, Stack, Text } from '@orangesys/ui'

export default function Alinhamento() {
  return (
    <Stack gap={6}>
      {/* justify="between" afasta os grupos; align="center" alinha no eixo cruzado */}
      <Stack direction="horizontal" justify="between" align="center" wrap gap={3}>
        <Text weight="semibold">3 pedidos selecionados</Text>
        <Stack direction="horizontal" wrap gap={2}>
          <Button variant="ghost" size="sm" startIcon={<Icon name="download" />}>
            Exportar
          </Button>
          <Button size="sm" startIcon={<Icon name="send" />}>
            Marcar como enviados
          </Button>
        </Stack>
      </Stack>

      {/* align="baseline" alinha textos de tamanhos diferentes pela linha de base */}
      <Stack direction="horizontal" align="baseline" gap={2}>
        <Text size="xl" weight="bold" font="display">
          R$ 1.289,90
        </Text>
        <Text size="sm" tone="muted">
          ou 10x de R$ 128,99 sem juros
        </Text>
      </Stack>
    </Stack>
  )
}
```

### Separadores e semântica

Na horizontal, o separador vira uma linha vertical. Com as="nav", a pilha vira um landmark de navegação — dê um nome com aria-label.

```tsx
import { Link, Stack, Text } from '@orangesys/ui'

export default function Separadores() {
  return (
    <Stack gap={6}>
      {/* Na horizontal, o separador vira uma linha vertical da altura da pilha */}
      <Stack direction="horizontal" separator gap={3} align="center">
        <Text size="sm">Pedido enviado</Text>
        <Text size="sm">3 itens</Text>
        <Text size="sm">Frete grátis</Text>
      </Stack>

      {/* as="nav" vira um landmark: dê um nome com aria-label */}
      <Stack as="nav" aria-label="Links do rodapé" direction="horizontal" separator gap={3}>
        <Link href="#ajuda" variant="subtle">
          Central de ajuda
        </Link>
        <Link href="#termos" variant="subtle">
          Termos de uso
        </Link>
        <Link href="#privacidade" variant="subtle">
          Privacidade
        </Link>
      </Stack>
    </Stack>
  )
}
```

## Movimento

- **Stack** — Sem movimento próprio. Trocas de direção, gap ou separadores por breakpoint acontecem na hora — animar layout (largura, posição) custa caro e desorienta.
- **Entrada dos itens** — Combine com Reveal: cada item envolto em <Reveal index={i}> sobe 24px e aparece em 600ms, 80ms (--or-stagger) depois do anterior. O Reveal com stagger só escalona os filhos diretos dele, por isso o index em cada item.
- **Movimento reduzido** — O Reveal mostra tudo de imediato; o layout não muda.

`Stack + Reveal`:

```tsx
import { Reveal, Stack } from '@orangesys/ui'

// Reveal com stagger escalona os filhos diretos DELE. Para escalonar os
// itens de uma Stack, envolva cada item em um Reveal com index:
<Stack gap={4}>
  {passos.map((passo, i) => (
    <Reveal key={passo.id} index={i}>
      <PassoDoCadastro {...passo} />
    </Reveal>
  ))}
</Stack>

// Em listas, o Reveal vira o próprio <li>:
<Stack as="ul" gap={4} aria-label="Próximos passos">
  {passos.map((passo, i) => (
    <Reveal as="li" key={passo.id} index={i}>{passo.titulo}</Reveal>
  ))}
</Stack>
```

## Props

### `Stack`

Layout em uma dimensão: empilha os filhos na vertical ou na horizontal com
espaçamento da escala do sistema. Direção e espaço podem mudar por
breakpoint, só com CSS.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `align` | `"center" \| "start" \| "end" \| "stretch" \| "baseline"` | `stretch` | Alinhamento no eixo cruzado (`align-items`). Padrão: `stretch`. |
| `as` | `ElementType` | `div` | Elemento renderizado. Padrão: `div`. `ul`/`ol` mantêm a semântica de lista (com `role="list"`); `nav` e `section` precisam de um nome acessível. |
| `direction` | `ResponsiveValue<StackDirection>` | — | Eixo principal: `vertical` (coluna, padrão) ou `horizontal` (linha). Responsivo: `{ base: 'vertical', md: 'horizontal' }` empilha no celular e vira linha a partir de 768px. Não existe `reverse`: a ordem visual é sempre a ordem do DOM (WCAG 1.3.2). |
| `gap` | `ResponsiveValue<LayoutGap>` | — | Espaço entre os filhos na escala de espaço (`4` = 1rem). Responsivo. Padrão: `4`. |
| `justify` | `"center" \| "start" \| "end" \| "between" \| "around" \| "evenly"` | `start` | Distribuição no eixo principal (`justify-content`). Padrão: `start`. |
| `separator` | `boolean` | `false` | Linha de 1px (`--or-color-border`) entre os filhos, com `gap` de cada lado. Acompanha a direção (horizontal ou vertical) sozinha. Decorativa: fica oculta para leitores de tela. Pensada para pilhas sem `wrap`. |
| `wrap` | `boolean` | `false` | Quebra os filhos em novas linhas quando não cabem. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`LayoutGap`:

```ts
/** Escala de espaço dos componentes de layout: `4` = `--or-space-4` (1rem). */
export type LayoutGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
```

`ResponsiveValue`:

```ts
/**
 * Valor que pode mudar conforme a largura da janela. Mobile-first: `base` vale
 * sempre e cada breakpoint vale daquela largura para cima (sm 640px, md 768px,
 * lg 1024px, xl 1280px), até o próximo breakpoint definido.
 *
 * `direction={{ base: 'vertical', md: 'horizontal' }}`
 */
export type ResponsiveValue<T> = T | BreakpointMap<T>
```

`StackAlign`:

```ts
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
```

`StackDirection`:

```ts
export type StackDirection = 'vertical' | 'horizontal'
```

`StackJustify`:

```ts
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
```

## Acessibilidade

A Stack é puramente visual: a semântica vem do elemento escolhido em `as` . Listas mantêm a semântica — como o `list-style: none` faz o Safari esquecer que é uma lista, a Stack adiciona `role="list"`. Os separadores são decorativos (`aria-hidden`); dentro de listas eles são `<li>` ocultos, então a contagem de itens anunciada não muda.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os elementos focáveis na ordem do código — a mesma ordem da tela, em qualquer direção. |

> **Por que não há reverse** row-reverse e column-reverse invertem só o desenho: leitores de tela e o foco do teclado continuam na ordem do código. Quem enxerga e usa teclado vê o foco pular para trás. Reordene o JSX.

- **1.3.1** — Estrutura real com as (ul, ol, nav, section); listas mantêm role="list".
- **1.3.2** — Sem reverse: ordem visual igual à ordem de leitura.
- **1.4.10** — Direção responsiva empilha o conteúdo em telas estreitas, sem rolagem horizontal a 320px.
- **2.4.3** — A ordem do foco segue a ordem visual.
