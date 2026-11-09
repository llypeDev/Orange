# Card

Contêiner para conteúdo relacionado — título, texto, mídia e ações — que pode ser clicável por inteiro.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Card, CardBody, CardFooter, CardHeader, CardLink, CardMedia } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/card (em inglês: https://orange.llypedev.com.br/en/components/card)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-card--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Card

## Boas práticas

- Use cartões para agrupar informações sobre um único assunto (um produto, um relatório, um plano) em coleções que o usuário compara ou percorre.
- Para o cartão inteiro ser clicável, use `interactive` com um título-link ( `href`). Não envolva o cartão em um `<a>`: o leitor de tela leria todo o conteúdo como nome do link.
- Ajuste `headingLevel` à hierarquia da página e use `as="li"` dentro de listas ou `as="article"` para conteúdo independente.
- Reserve a variante accent para destacar um item (o plano recomendado, uma novidade) — não para todos.

## Anatomia

- **CardMedia** — Imagem de borda a borda, no topo ou na base. Proporção via ratio.
- **CardHeader** — Eyebrow, título (heading, opcionalmente link), descrição e ações.
- **CardBody** — Conteúdo principal; cresce para alinhar rodapés em grades.
- **CardFooter** — Ações ou metadados, sempre na base do cartão. divider adiciona uma linha.
- **CardLink** — Link do título; aceita o Link do seu roteador via as.

## Exemplos

### Básico

Cabeçalho, corpo e rodapé com ações.

```tsx
import { Button, Card, CardBody, CardFooter, CardHeader } from '@orangesys/ui'

const price = {
  fontFamily: 'var(--or-font-display)',
  fontSize: 28,
  letterSpacing: '-0.03em',
  color: 'var(--or-color-text)',
}

export default function Basic() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader eyebrow="Plano" title="Profissional" headingLevel={4} description="Para equipes em crescimento" />
      <CardBody>
        <p>
          <strong style={price}>R$ 89</strong> por usuário/mês
        </p>
        <p>Até 20 usuários, 100 GB de armazenamento e suporte prioritário por chat.</p>
      </CardBody>
      <CardFooter>
        <Button>Assinar plano</Button>
        <Button variant="ghost">Comparar planos</Button>
      </CardFooter>
    </Card>
  )
}
```

### Variantes

outline (borda de 1px, padrão), raised (superfície elevada) e accent (borda superior laranja de 2px).

```tsx
import { Card, CardBody, CardHeader } from '@orangesys/ui'

export default function Variants() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, width: '100%' }}>
      <Card variant="outline">
        <CardHeader eyebrow="outline" title="Backups diários" headingLevel={4} />
        <CardBody>Cópias automáticas às 3h, mantidas por 30 dias.</CardBody>
      </Card>
      <Card variant="raised">
        <CardHeader eyebrow="raised" title="Domínio próprio" headingLevel={4} />
        <CardBody>Use loja.suaempresa.com.br com SSL incluso.</CardBody>
      </Card>
      <Card variant="accent">
        <CardHeader eyebrow="accent" title="Novo: relatórios" headingLevel={4} />
        <CardBody>Exporte vendas por canal em PDF ou CSV.</CardBody>
      </Card>
    </div>
  )
}
```

### Cartão clicável

Com interactive, o link do título se estende por todo o cartão: no hover ou foco ele sobe 4px com a sombra laranja e a seta desliza. O botão de salvar continua sendo um alvo independente.

```tsx
import { Button, Card, CardBody, CardHeader, CardMedia, Icon } from '@orangesys/ui'
import { useState } from 'react'
import guia from './media/guia.svg'
import integracao from './media/integracao.svg'
import relatorio from './media/relatorio.svg'

const articles = [
  { id: 'vendas', type: 'Relatório', title: 'Vendas do 3º trimestre', meta: 'Atualizado há 2 horas', image: relatorio },
  { id: 'nfe', type: 'Guia', title: 'Como emitir notas fiscais em lote', meta: '6 min de leitura', image: guia },
  { id: 'erp', type: 'Integração', title: 'Conectar o ERP à sua loja', meta: '12 min de leitura', image: integracao },
]

export default function Interactive() {
  const [saved, setSaved] = useState<string[]>(['nfe'])
  const toggle = (id: string) =>
    setSaved((list) => (list.includes(id) ? list.filter((s) => s !== id) : [...list, id]))

  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        width: '100%',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {articles.map((article) => (
        <Card as="li" key={article.id} interactive>
          <CardMedia src={article.image} alt="" />
          <CardHeader
            eyebrow={article.type}
            title={article.title}
            href={`#${article.id}`}
            linkProps={{ arrow: true }}
            headingLevel={4}
            actions={
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Salvar "${article.title}"`}
                aria-pressed={saved.includes(article.id)}
                startIcon={<Icon name={saved.includes(article.id) ? 'check' : 'heart'} />}
                onClick={() => toggle(article.id)}
              />
            }
          />
          <CardBody style={{ fontSize: 'var(--or-text-sm)' }}>{article.meta}</CardBody>
        </Card>
      ))}
    </ul>
  )
}
```

### Produto com mídia

CardMedia no topo, sem padding lateral. O rodapé com divider separa a ação principal.

```tsx
import { Button, Card, CardBody, CardFooter, CardHeader, CardMedia, Icon } from '@orangesys/ui'
import cadeira from './media/cadeira.svg'

export default function Product() {
  return (
    <Card as="article" variant="raised" style={{ maxWidth: 320 }}>
      <CardMedia src={cadeira} alt="Cadeira ergonômica preta com braços laranja" ratio="4/3" />
      <CardHeader eyebrow="Escritório" title="Cadeira ergonômica Flex" headingLevel={4} />
      <CardBody>
        Encosto em tela, apoio lombar regulável e braços 3D.
        <p style={{ marginTop: 12, color: 'var(--or-color-text)', fontWeight: 600 }}>R$ 1.289,90 ou 10x sem juros</p>
      </CardBody>
      <CardFooter divider>
        <Button startIcon={<Icon name="plus" />} block>
          Adicionar ao carrinho
        </Button>
      </CardFooter>
    </Card>
  )
}
```

## Movimento

- **Hover ou foco no cartão** — Como os cartões do zop.dev: sobe 4px, ganha a sombra sólida 0 8px 0 -4px na cor do texto e uma barra de acento de 4px desce pela borda esquerda (scaleY 0 → 1, a partir do topo); a borda recua para o tom discreto. --or-duration-medium (250ms), --or-ease-out. Cores: --or-card-lift-color (barra) e --or-card-lift-shadow (sombra).
- **Cursor na borda de baixo** — Uma ponte invisível de 12px abaixo do cartão mantém o hover enquanto ele sobe — o cartão não treme.
- **Pressionar o cartão** — Afunda metade da elevação e a sombra encolhe. --or-duration-press (90ms). Cliques em botões internos não afundam o cartão.
- **Seta do CardLink** — Desliza 4px (--or-distance-sm) e clareia para a cor do texto no hover/foco. 250ms, --or-ease-out.
- **Movimento reduzido** — Sem deslocamento nem animação: a sombra, a barra e as cores aparecem direto e continuam indicando o estado.

## Props

### `Card`

Contêiner de conteúdo relacionado: título, texto, mídia e ações.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `div` | Elemento raiz. Use `article` para conteúdo independente e `li` dentro de listas. |
| `interactive` | `boolean` | `false` | Torna o cartão inteiro clicável. O alvo é o `CardLink` do título, que ganha uma área estendida sobre o cartão (o título continua sendo o link). |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Espaçamento interno: `sm` 16px, `md` 24px, `lg` 32px. |
| `variant` | `"outline" \| "accent" \| "raised"` | `outline` | `outline` (borda 1px, padrão), `raised` (superfície elevada) ou `accent` (borda superior laranja). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `CardBody`

Conteúdo principal do cartão.

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `CardFooter`

Rodapé com ações ou metadados, sempre alinhado à base do cartão.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `divider` | `boolean` | `false` | Mostra uma linha divisória acima do rodapé. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `CardHeader`

Cabeçalho do cartão: eyebrow, título (opcionalmente link), descrição e ações.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `actions` | `ReactNode` | — | Ações à direita do título (botões de ícone, menus). |
| `description` | `ReactNode` | — | Texto de apoio abaixo do título. |
| `eyebrow` | `ReactNode` | — | Rótulo curto em caixa alta acima do título. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Nível semântico do título. Padrão: 3. |
| `href` | `string` | — | Transforma o título em link (`CardLink`). |
| `linkProps` | `Omit<CardLinkProps, "children" \| "href">` | — | Atributos extras do link do título. |
| `title` | `ReactNode` | — | Título do cartão (renderizado como heading). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `CardLink`

Link do título do cartão. Em um `Card interactive`, sua área se estende por
todo o cartão (padrão "stretched link").

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `arrow` | `boolean` | `false` | Mostra uma seta após o texto, que desliza 4px no hover/foco do cartão. |
| `as` | `ElementType` | `a` | Componente de link do roteador (ex.: `Link` do React Router). Padrão: `a`. |
| `to` | `string` | — | Repassado ao componente de roteador. |

Repassa também os atributos nativos (`AnchorHTMLAttributes`) do `<a>`, como `href`, `target`, `rel` e `download`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### `CardMedia`

Imagem ou mídia de borda a borda (no topo ou na base do cartão).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `alt` | `string` | — | Texto alternativo da imagem. Use `""` se for decorativa. |
| `ratio` | `string \| number` | `16/9` | Proporção da área de mídia (ex.: `16/9`, `4/3`, `1`). Padrão: `16/9`. |
| `src` | `string` | — | URL da imagem. Alternativamente, passe a mídia como `children`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`CardSize`:

```ts
export type CardSize = 'sm' | 'md' | 'lg'
```

`CardVariant`:

```ts
export type CardVariant = 'outline' | 'raised' | 'accent'
```

## Acessibilidade

O cartão clicável usa o padrão de **link esticado**: o único link é o título (dentro do heading), e um pseudo-elemento `::after` estende sua área de clique sobre o cartão. Assim o nome do link é curto ("Vendas do 3º trimestre"), a navegação por headings e por links continua útil e o foco desenha um contorno ao redor do cartão inteiro. Botões e links internos ficam acima da camada e continuam funcionando.

| Teclas | Ação |
| --- | --- |
| `Tab` | Foca o link do título e depois as ações do cartão. |
| `Enter` | Abre o link do cartão (ou ativa a ação focada). |

> **Evite seleção de texto acidental** Como o cartão inteiro é um alvo de clique, o texto do corpo não pode ser selecionado com o mouse. Se o usuário precisar copiar informações (códigos, endereços), não use interactive.

- **1.3.1** — Título como heading com nível configurável; article/li conforme o contexto.
- **2.4.4** — O nome do link é o título do cartão, curto e descritivo.
- **2.4.7** — Foco visível ao redor do cartão inteiro.
- **2.5.8** — Área de clique do tamanho do cartão.
