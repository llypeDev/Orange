# AppShell

Estrutura de página da aplicação: cabeçalho, navegação lateral recolhível, conteúdo, painel complementar e rodapé.

- Categoria: Layout · Status: estável
- Importação: `import { AppShell, AppShellNavToggle } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/app-shell (em inglês: https://orange.llypedev.com.br/en/components/app-shell)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-appshell--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/AppShell

## Boas práticas

- Use um AppShell por página, na raiz. Ele cria os landmarks (`header`, `nav`, `main`, `aside`, `footer`) e o link "Pular para o conteúdo principal".
- Componha com as peças do Orange: `AppHeader` no `header`, `SideNav` na `navigation`, `PageHeader` no topo do conteúdo e `Footer` no `footer`. O AppShell reconhece essas peças e não aninha landmarks repetidos.
- Coloque o `AppShellNavToggle` no cabeçalho, perto da marca. Abaixo de `navDrawerBelow` ele abre o painel; acima, recolhe a barra lateral.
- Use o aside para informação de apoio (resumo, ajuda, detalhes do item selecionado). Ele vai para baixo do conteúdo quando não há espaço — nada essencial deve depender dele estar ao lado.

## Anatomia

- **header** — Topo da página (<header>), fixo durante a rolagem por padrão. Com um AppHeader, o próprio AppHeader é o landmark.
- **navigation** — Barra lateral (<nav aria-label>) fixa a partir do ponto de quebra, recolhível para um trilho de 4rem. Abaixo dele, vai para um Drawer à esquerda.
- **children** — Conteúdo principal em <main id tabIndex={-1}>, destino do SkipLink.
- **aside** — Painel complementar (<aside aria-label>) de 20rem ao lado do conteúdo enquanto o conteúdo tiver ≥ 60% da largura; senão, empilha abaixo.
- **footer** — Rodapé (<footer>) sob o conteúdo — por exemplo, um Footer.
- **AppShellNavToggle** — Botão de ícone com aria-expanded e aria-controls que abre o painel ou recolhe a barra.

## Exemplos

> **Prévias contidas** Nas prévias, o AppShell fica em uma caixa de altura fixa com `fullHeight={false}`: ele ocupa o pai e rola o conteúdo por dentro. Em um app, use o padrão (`fullHeight`): altura mínima da tela, rolagem da página, cabeçalho e barra fixos. O ponto de quebra é o da tela: em telas menores que 1024px (768px no exemplo de configurações) a navegação vai para o painel.

### Admin de pedidos

AppHeader com o botão de navegação, SideNav, PageHeader e um resumo no aside (que empilha abaixo da lista quando falta largura).

```tsx
import {
  AppHeader,
  AppShell,
  AppShellNavToggle,
  Button,
  Icon,
  IconButton,
  PageHeader,
  SideNav,
  SideNavGroup,
  SideNavItem,
  Tag,
} from '@orangesys/ui'

const orders = [
  {
    id: '#4821',
    store: 'Mercearia Bom Grão',
    total: 'R$ 1.240,00',
    status: 'Pago',
    tone: 'success',
  },
  {
    id: '#4820',
    store: 'Café Ponto Doce',
    total: 'R$ 318,90',
    status: 'Aguardando envio',
    tone: 'warning',
  },
  {
    id: '#4819',
    store: 'Ateliê Fio de Linha',
    total: 'R$ 96,50',
    status: 'Em separação',
    tone: 'info',
  },
] as const

export default function Orders() {
  return (
    // Na documentação o AppShell fica contido: altura fixa + fullHeight={false}.
    // Em um app, use <AppShell> direto na raiz da página.
    <div style={{ height: 560, border: '1px solid var(--or-color-border)' }}>
      <AppShell
        mainElement="div"
        fullHeight={false}
        header={
          <AppHeader
            brand={
              <>
                <AppShellNavToggle />
                <a href="#inicio" aria-label="Aurora Commerce — início">
                  <Icon name="layers" /> Aurora
                </a>
              </>
            }
            actions={<IconButton icon="bell" label="Notificações" />}
          />
        }
        navLabel="Navegação do painel"
        navigation={
          <SideNav currentHref="#pedidos">
            <SideNavItem href="#inicio" icon={<Icon name="home" />}>
              Início
            </SideNavItem>
            <SideNavItem href="#pedidos" icon={<Icon name="inbox" />} badge={12}>
              Pedidos
            </SideNavItem>
            <SideNavGroup label="Catálogo" icon={<Icon name="tag" />}>
              <SideNavItem href="#produtos">Produtos</SideNavItem>
              <SideNavItem href="#estoque">Estoque</SideNavItem>
            </SideNavGroup>
            <SideNavItem href="#clientes" icon={<Icon name="users" />}>
              Clientes
            </SideNavItem>
          </SideNav>
        }
        asideLabel="Resumo do dia"
        aside={
          <div style={{ display: 'grid', gap: 8 }}>
            <p className="or-eyebrow" style={{ margin: 0 }}>
              Resumo do dia
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--or-font-display)',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              R$ 8.420
            </p>
            <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
              37 pedidos · 5 aguardando envio
            </p>
          </div>
        }
      >
        <PageHeader
          headingLevel={2}
          eyebrow="Vendas"
          title="Pedidos"
          description="Pedidos das últimas 24 horas."
          divider
          actions={<Button startIcon={<Icon name="plus" />}>Novo pedido</Button>}
        />
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 12,
                padding: '14px 0',
                borderBottom: '1px solid var(--or-color-border)',
              }}
            >
              <strong style={{ fontFamily: 'var(--or-font-display)' }}>{order.id}</strong>
              <span style={{ flex: '1 1 9rem' }}>{order.store}</span>
              <Tag tone={order.tone}>{order.status}</Tag>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{order.total}</span>
            </li>
          ))}
        </ul>
      </AppShell>
    </div>
  )
}
```

### Barra recolhível (controlada)

navCollapsed + onNavCollapsedChange. O botão do cabeçalho e o "Recolher menu lateral" do SideNav comandam o mesmo estado; recolhida, os rótulos aparecem como dicas no hover/foco.

```tsx
import {
  AppHeader,
  AppShell,
  AppShellNavToggle,
  Icon,
  PageHeader,
  SideNav,
  SideNavItem,
  SideNavSection,
} from '@orangesys/ui'
import { useState } from 'react'

export default function Collapsible() {
  // Controlado: guarde a preferência (ex.: no localStorage) e restaure na próxima visita.
  const [collapsed, setCollapsed] = useState(true)
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Barra lateral: <strong>{collapsed ? 'recolhida' : 'expandida'}</strong>
      </p>
      <div style={{ height: 440, border: '1px solid var(--or-color-border)' }}>
        <AppShell
          mainElement="div"
          fullHeight={false}
          navCollapsed={collapsed}
          onNavCollapsedChange={setCollapsed}
          header={
            <AppHeader
              brand={
                <>
                  <AppShellNavToggle />
                  <a href="#inicio">Aurora</a>
                </>
              }
            />
          }
          navLabel="Navegação dos relatórios"
          navigation={
            <SideNav currentHref="#relatorios" collapsible>
              <SideNavItem href="#inicio" icon={<Icon name="home" />}>
                Início
              </SideNavItem>
              <SideNavItem href="#pedidos" icon={<Icon name="inbox" />}>
                Pedidos
              </SideNavItem>
              <SideNavItem href="#relatorios" icon={<Icon name="chart-bar" />}>
                Relatórios
              </SideNavItem>
              <SideNavSection title="Loja">
                <SideNavItem href="#configuracoes" icon={<Icon name="sliders" />}>
                  Configurações
                </SideNavItem>
              </SideNavSection>
            </SideNav>
          }
        >
          <PageHeader
            headingLevel={2}
            title="Relatórios"
            description="Use o botão do cabeçalho ou o do rodapé da barra: os dois comandam o mesmo estado."
          />
        </AppShell>
      </div>
    </div>
  )
}
```

### Área de configurações

Cabeçalho próprio com useAppShell(): o botão de menu só aparece quando a navegação vai para o painel (navDrawerBelow="md"). Footer no rodapé.

```tsx
import {
  AppShell,
  AppShellNavToggle,
  Button,
  Footer,
  PageHeader,
  SideNav,
  SideNavItem,
  SideNavSection,
  Switch,
  useAppShell,
} from '@orangesys/ui'

/** Cabeçalho próprio: o botão de menu só aparece quando a navegação vai para o painel. */
function SettingsHeader() {
  const { isCompact } = useAppShell()
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 56, padding: '0 16px' }}
    >
      {isCompact && <AppShellNavToggle />}
      <strong style={{ fontFamily: 'var(--or-font-display)' }}>Configurações da loja</strong>
    </div>
  )
}

export default function Settings() {
  return (
    <div style={{ height: 560, border: '1px solid var(--or-color-border)' }}>
      <AppShell
        mainElement="div"
        fullHeight={false}
        navDrawerBelow="md"
        header={<SettingsHeader />}
        navLabel="Seções das configurações"
        navTitle="Configurações"
        navigation={
          <SideNav currentHref="#notificacoes">
            <SideNavSection title="Loja">
              <SideNavItem href="#geral">Geral</SideNavItem>
              <SideNavItem href="#pagamentos">Pagamentos</SideNavItem>
              <SideNavItem href="#entregas">Entregas</SideNavItem>
            </SideNavSection>
            <SideNavSection title="Conta">
              <SideNavItem href="#equipe">Equipe</SideNavItem>
              <SideNavItem href="#notificacoes">Notificações</SideNavItem>
            </SideNavSection>
          </SideNav>
        }
        footer={<Footer bottom={<span>Alterações são salvas para todas as unidades.</span>} />}
      >
        <PageHeader
          headingLevel={2}
          title="Notificações"
          description="Escolha quando a equipe recebe avisos por e-mail."
          divider
          actions={<Button>Salvar</Button>}
        />
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <Switch label="Novo pedido recebido" defaultChecked />
          <Switch label="Estoque abaixo do mínimo" defaultChecked />
          <Switch label="Resumo semanal de vendas" />
        </div>
      </AppShell>
    </div>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: a troca de estado fica instantânea e continua indicada pelo layout e pelo aria-expanded.

- **Recolher / expandir a barra** — A trilha da grade anima de 17.5rem para 4rem (grid-template-columns) em --or-duration-slow (400ms), --or-ease-in-out — sem animar width no conteúdo. Os rótulos do SideNav voltam deslizando 4px.
- **Botão de recolher** — Os chevrons giram 180° junto com a barra (mesma duração e curva).
- **Abrir o painel (telas estreitas)** — O Drawer desliza da esquerda em --or-duration-medium (250ms), --or-ease-out, com fade no fundo; fecha em --or-duration-fast (160ms), --or-ease-in-out.
- **Movimento reduzido** — Recolher e abrir são instantâneos.

## Props

### `AppShell`

Estrutura de página da aplicação: cabeçalho, navegação lateral recolhível
(painel em telas estreitas), conteúdo principal, painel complementar e
rodapé — com os landmarks e o link de atalho certos.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `aside` | `ReactNode` | — | Painel complementar à direita do conteúdo (empilha abaixo dele quando falta espaço). |
| `asideLabel` | `string` | — | Nome do landmark complementar (`aside`). Padrão: `t('appShellAside')`. |
| `children` | `ReactNode` | — | Conteúdo principal (`<main>`). |
| `defaultNavCollapsed` | `boolean` | `false` | Barra lateral recolhida inicialmente (não controlado). |
| `defaultNavOpen` | `boolean` | `false` | Painel aberto inicialmente (não controlado). |
| `footer` | `ReactNode` | — | Rodapé — por exemplo, um `Footer`. |
| `fullHeight` | `boolean` | `true` | Ocupa no mínimo a altura da tela e rola com a página. Com `false`, ocupa a altura do contêiner pai e rola o conteúdo por dentro (útil em prévias e painéis). |
| `header` | `ReactNode` | — | Topo da página — normalmente um `AppHeader`. |
| `mainElement` | `"main" \| "div"` | `main` | Elemento da área principal. Use `'div'` quando o AppShell vive dentro de uma aplicação que já tem o seu `<main>` (micro-frontends, prévias embutidas): uma página só pode ter um landmark principal. Padrão: `'main'`. |
| `mainId` | `string` | — | `id` do `<main>` (destino do link de atalho). Padrão: gerado. |
| `navCollapsed` | `boolean` | — | Barra lateral recolhida (controlado). |
| `navDrawerBelow` | `"md" \| "lg"` | `lg` | Abaixo deste ponto de quebra (`md` 768px, `lg` 1024px) a navegação vai para um painel (Drawer); a partir dele, fica fixa ao lado do conteúdo. Padrão: `lg`. |
| `navigation` | `ReactNode \| ((state: AppShellNavigationState) => ReactNode)` | — | Navegação lateral — normalmente um `SideNav`, que passa a seguir o estado recolhido do AppShell. Aceita uma função `({ collapsed, compact }) => ReactNode`. |
| `navLabel` | `string` | — | Nome do landmark de navegação. Padrão: `t('mainNavigation')`. |
| `navOpen` | `boolean` | — | Painel de navegação aberto em telas estreitas (controlado). |
| `navTitle` | `ReactNode` | — | Título do painel de navegação em telas estreitas. Padrão: `t('menu')`. |
| `onNavCollapsedChange` | `((collapsed: boolean) => void)` | — | Chamado quando a barra lateral é recolhida ou expandida. |
| `onNavOpenChange` | `((open: boolean) => void)` | — | Chamado quando o painel abre ou fecha. |
| `skipLink` | `boolean` | `true` | Renderiza o `SkipLink` "Pular para o conteúdo principal" como primeiro foco. |
| `skipLinkLabel` | `ReactNode` | — | Texto do link de atalho. Padrão: `t('skipToContent')`. |
| `stickyHeader` | `boolean` | `true` | Fixa o cabeçalho no topo durante a rolagem. |
| `stickyNav` | `boolean` | `true` | Fixa a barra lateral (altura da tela, rolagem própria). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `AppShellNavToggle`

Botão que abre o painel de navegação (telas estreitas) ou recolhe a barra
lateral (telas largas). Coloque-o onde quiser dentro do AppShell — em geral
na marca do `AppHeader`. Não renderiza nada sem `navigation`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `icon` | `"type" \| ReactElement<unknown, string \| JSXElementConstructor<any>> \| "search" \| "send" \| "grid" \| "link" \| "list" \| "menu" \| "copy" \| "info" \| ... 83 more ...` | — | Ícone. Padrão: menu (telas estreitas) ou chevrons que giram (telas largas). |
| `label` | `string` | — | Nome acessível. Padrão: "Abrir navegação" (telas estreitas) ou "Recolher/Expandir menu lateral" (telas largas). |
| `loading` | `boolean` | — | Mostra um indicador de carregamento e bloqueia novos cliques. |
| `loadingText` | `string` | — | Texto anunciado a leitores de tela durante o carregamento. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. |
| `variant` | `"outline" \| "danger" \| "primary" \| "secondary" \| "ghost"` | — | Estilo visual. `primary` é a ação principal; use apenas um por contexto. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O primeiro foco da página é o SkipLink, que leva ao `<main>` (focável com `tabIndex={-1}`). A navegação é um `<nav>` nomeado e o aside, um `<aside>` nomeado. Em telas estreitas, o painel é o Drawer do Orange: diálogo modal com título, foco preso, Escape e foco de volta ao botão. Escolher um link fecha o painel.

| Teclas | Ação |
| --- | --- |
| `Tab` | O primeiro Tab mostra o "Pular para o conteúdo principal". |
| `Enter` | No SkipLink, move o foco para o conteúdo. No botão de navegação, abre o painel ou recolhe a barra. |
| `Space` | Ativa o botão de navegação. |
| `Esc` | Fecha o painel e devolve o foco ao botão. |

- **1.3.1** — Landmarks header, nav, main, aside e footer, sem duplicar os de AppHeader, SideNav e Footer.
- **2.4.1** — SkipLink para o conteúdo principal.
- **4.1.2** — Botão com nome, `aria-expanded` e `aria-controls`; o painel é um diálogo nomeado.
- **1.4.10** — Em 320–390px a barra vai para o painel e o aside empilha: sem rolagem horizontal.
- **2.3.3** — Animações zeradas com prefers-reduced-motion.
