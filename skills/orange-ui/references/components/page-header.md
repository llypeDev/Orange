# PageHeader

Topo de uma página da aplicação: contexto, título, descrição, selos, ações e abas.

- Categoria: Layout · Status: estável
- Importação: `import { PageHeader } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/page-header (em inglês: https://orange.llypedev.com.br/en/components/page-header)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-pageheader--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/PageHeader

## Boas práticas

- Use um PageHeader por página, no topo do `<main>`. O título é o `h1` da página; use `headingLevel` 2 ou 3 só em subpáginas dentro de outra página.
- O título diz onde o usuário está ("Pedidos", "Pedido #4821") — não o que ele pode fazer. As ações ficam nos botões.
- Até três ações, com uma só primária. Mais do que isso vai para um menu "Mais ações".
- Use a trilha (breadcrumbs) em hierarquias com três níveis ou mais; para um nível só, prefira o link de volta (back).
- Reserve reveal para páginas de entrada (painéis, relatórios). Em telas que o usuário visita o tempo todo, a animação cansa.

## Anatomia

- **Contexto** — breadcrumbs (normalmente um Breadcrumb) e/ou back — link de volta com seta.
- **Eyebrow** — Rótulo curto em caixa alta acima do título: a área ou seção do produto.
- **Título e meta** — Heading da página (h1 por padrão) com selos de status ao lado (Tag, Badge).
- **Descrição** — Uma ou duas linhas de apoio: data, responsável, resumo.
- **Ações** — Botões alinhados à direita; quando o título precisa de espaço (≈ 20rem), quebram para baixo dele.
- **Navegação** — Abas locais na base do cabeçalho; com divider, o sublinhado da aba ativa cobre a linha.

## Exemplos

### Lista de pedidos

Eyebrow, título, descrição e duas ações. Estreite a tela: as ações quebram para baixo do título.

```tsx
import { Button, Icon, PageHeader } from '@orangesys/ui'

export default function Basic() {
  return (
    <PageHeader
      headingLevel={2}
      eyebrow="Vendas"
      title="Pedidos"
      description="Acompanhe pagamentos, envios e devoluções de todas as lojas."
      divider
      actions={
        <>
          <Button variant="outline" startIcon={<Icon name="download" />}>
            Exportar
          </Button>
          <Button startIcon={<Icon name="plus" />}>Novo pedido</Button>
        </>
      }
    />
  )
}
```

### Detalhe com trilha e status

A trilha mostra a hierarquia; os selos ficam ao lado do título e quebram junto com ele.

```tsx
import { Breadcrumb, Button, IconButton, PageHeader, Tag } from '@orangesys/ui'

export default function Detail() {
  return (
    <PageHeader
      headingLevel={2}
      breadcrumbs={
        <Breadcrumb
          items={[
            { label: 'Início', href: '#inicio' },
            { label: 'Pedidos', href: '#pedidos' },
            { label: 'Pedido #4821' },
          ]}
        />
      }
      title="Pedido #4821"
      meta={
        <>
          <Tag tone="success">Pago</Tag>
          <Tag tone="warning">Aguardando envio</Tag>
        </>
      }
      description="Criado em 12 de março às 14:32 · Mercearia Bom Grão · 6 itens"
      divider
      actions={
        <>
          <IconButton icon="more-horizontal" label="Mais ações do pedido" variant="outline" />
          <Button variant="outline">Imprimir etiqueta</Button>
          <Button>Marcar como enviado</Button>
        </>
      }
    />
  )
}
```

### Link de volta com roteador

back leva ao nível anterior; renderLink usa o link do seu roteador. A seta desliza 4px para trás no hover/foco.

```tsx
import { Button, PageHeader, Tag } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function BackLink() {
  return (
    <PageHeader
      headingLevel={2}
      back={{ href: '/devolucoes', label: 'Devoluções' }}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      title="Devolução #219"
      meta={<Tag tone="info">Em análise</Tag>}
      description="Solicitada em 3 de abril · Motivo: tamanho errado"
      actions={
        <>
          <Button variant="outline">Recusar</Button>
          <Button>Aprovar devolução</Button>
        </>
      }
    />
  )
}
```

### Área de configurações com abas

O Tabs envolve o cabeçalho e os painéis; a TabList vai no slot navigation.

```tsx
import { Button, PageHeader, Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

export default function WithTabs() {
  return (
    // O Tabs envolve o cabeçalho e os painéis: a TabList fica no slot navigation.
    <Tabs defaultValue="geral">
      <PageHeader
        headingLevel={2}
        eyebrow="Configurações"
        title="Loja Aurora"
        description="Ajustes que valem para todas as unidades da loja."
        divider
        actions={<Button>Salvar alterações</Button>}
        navigation={
          <TabList aria-label="Seções das configurações">
            <Tab value="geral">Geral</Tab>
            <Tab value="faturamento">Faturamento</Tab>
            <Tab value="equipe">Equipe</Tab>
            <Tab value="integracoes">Integrações</Tab>
          </TabList>
        }
      />
      <TabPanel value="geral">Nome da loja, fuso horário e moeda.</TabPanel>
      <TabPanel value="faturamento">Plano Pro · próxima fatura em 5 de maio.</TabPanel>
      <TabPanel value="equipe">8 pessoas com acesso ao painel.</TabPanel>
      <TabPanel value="integracoes">2 marketplaces e 1 meio de pagamento conectados.</TabPanel>
    </Tabs>
  )
}
```

### Entrada em sequência

Com reveal, eyebrow → título → descrição → ações sobem em sequência ao montar.

```tsx
import { Button, Icon, PageHeader } from '@orangesys/ui'
import { useState } from 'react'

export default function Reveal() {
  // A revelação roda ao montar: trocar a key remonta o cabeçalho para ver de novo.
  const [run, setRun] = useState(0)
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <PageHeader
        headingLevel={2}
        key={run}
        reveal
        eyebrow="Relatórios"
        title="Vendas do trimestre"
        description="Receita, ticket médio e conversão por canal, atualizados a cada hora."
        actions={<Button variant="outline">Compartilhar</Button>}
      />
      <div>
        <Button
          variant="ghost"
          size="sm"
          startIcon={<Icon name="refresh" />}
          onClick={() => setRun((n) => n + 1)}
        >
          Repetir animação
        </Button>
      </div>
    </div>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion. A revelação é opcional e só roda ao montar.

- **Entrada com reveal** — Cada parte sobe 24px (--or-distance-lg) com fade em --or-duration-reveal (600ms), --or-ease-out, 80ms (--or-stagger) depois da anterior: eyebrow → título → descrição → ações. Desligada por padrão.
- **Link de volta** — No hover/foco, a seta desliza 4px para a esquerda (--or-duration-medium, --or-ease-out) e o texto clareia.
- **Abas** — O sublinhado da aba ativa desliza entre as abas (comportamento do Tabs).
- **Movimento reduzido** — reveal não faz nada: o cabeçalho aparece pronto, sem deslocamento.

## Props

### `PageHeader`

Topo de uma página da aplicação: trilha ou link de volta, eyebrow, título,
descrição, selos, ações e navegação local (abas).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` (obrigatória) | `ReactNode` | — | Título da página. |
| `actions` | `ReactNode` | — | Ações da página (botões), alinhadas à direita; quebram para baixo do título em telas estreitas. |
| `back` | `PageHeaderBack` | — | Link de volta, com seta, acima do título. |
| `breadcrumbs` | `ReactNode` | — | Trilha de navegação acima do título — normalmente um `<Breadcrumb>`. |
| `description` | `ReactNode` | — | Texto de apoio abaixo do título. |
| `divider` | `boolean` | `false` | Linha de 1px na base do cabeçalho. |
| `eyebrow` | `ReactNode` | — | Rótulo curto em caixa alta acima do título (área, seção, contexto). |
| `headingLevel` | `1 \| 2 \| 3` | `1` | Nível do heading do título. Padrão: `1` (um `h1` por página). |
| `meta` | `ReactNode` | — | Selos ou status ao lado do título (Tag, Badge…). |
| `navigation` | `ReactNode` | — | Navegação local sob o cabeçalho — normalmente uma `TabList`. |
| `renderLink` | `RenderLink` | — | Renderiza o link de volta com o componente do seu roteador. |
| `reveal` | `boolean` | `false` | Entrada em sequência ao montar: eyebrow → título → descrição → ações (sobem 24px com fade, 80ms entre eles). Desligada com movimento reduzido. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

A raiz é uma `<div>` — não um `<header>` — para não criar um segundo landmark "banner" ao lado do cabeçalho da aplicação. O título é um heading real (`h1` por padrão), então a navegação por headings encontra a página. Eyebrow, título e descrição seguem a ordem de leitura; as ações vêm depois, na ordem do Tab.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre trilha, link de volta, ações e abas, nessa ordem. |
| `Enter` | Segue o link focado ou ativa a ação focada. |
| `←` + `→` | Entre as abas do slot navigation (padrão Tabs). |

- **1.3.1** — Título como heading com nível configurável; trilha em um nav nomeado.
- **2.4.6** — O título descreve a página; o link de volta diz para onde leva.
- **2.3.3** — A revelação é opcional e desligada com prefers-reduced-motion.
- **1.4.10** — Ações e selos quebram linha em 320px, sem rolagem horizontal.
