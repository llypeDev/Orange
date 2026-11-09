# SideNav

Navegação lateral da aplicação, com grupos recolhíveis, seções e modo só com ícones.

- Categoria: Navegação · Status: estável
- Importação: `import { SideNav, SideNavGroup, SideNavItem, SideNavSection } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/side-nav (em inglês: https://orange.llypedev.com.br/en/components/side-nav)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-sidenav--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/SideNav

## Boas práticas

- Use em aplicações com muitas áreas (painéis, ferramentas internas). Sites com até 5 seções ficam melhor com o AppHeader.
- Ordene por frequência de uso e agrupe por tarefa. Evite mais de dois níveis: o terceiro nível cabe melhor em abas dentro da página.
- Todo item de primeiro nível precisa de ícone se o modo recolhido for usado — sem ele, aparece apenas a inicial.
- Informe `currentHref` com a rota atual: o item correspondente ganha `aria-current="page"` e o grupo dele abre sozinho.
- Em telas pequenas, esconda o SideNav e ofereça a navegação no menu do AppHeader ou na BottomNavigation.

## Anatomia

- **SideNav** — A <nav> com cabeçalho, lista rolável e rodapé.
- **SideNavItem** — Destino (link) ou ação (botão), com ícone e badge opcionais.
- **SideNavGroup** — Botão que abre/fecha uma sublista.
- **SideNavSection** — Título em caixa alta que rotula um bloco de itens.

## Exemplos

### Painel da aplicação

Cabeçalho, itens com badge, grupos, seção, item desabilitado e rodapé com o perfil. Clique nos itens para trocar a página atual.

```tsx
import { Icon, SideNav, SideNavGroup, SideNavItem, SideNavSection } from '@orangesys/ui'
import { useState, type MouseEvent } from 'react'

export default function Dashboard() {
  const [current, setCurrent] = useState('#checkout')
  // Em um app real, currentHref vem da rota atual (useLocation().pathname).
  const go = (event: MouseEvent<HTMLElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (href) {
      event.preventDefault()
      setCurrent(href)
    }
  }
  return (
    <div style={{ height: 540, display: 'flex', border: '1px solid var(--or-color-border)' }}>
      <SideNav
        aria-label="Navegação do painel"
        currentHref={current}
        header={<strong style={{ fontFamily: 'var(--or-font-display)' }}>Orange Labs</strong>}
        footer={
          <SideNavItem href="#perfil" icon={<Icon name="user" />} onClick={go}>
            Ana Ribeiro
          </SideNavItem>
        }
      >
        <SideNavItem href="#inicio" icon={<Icon name="home" />} onClick={go}>
          Início
        </SideNavItem>
        <SideNavItem href="#caixa" icon={<Icon name="inbox" />} badge={12} onClick={go}>
          Caixa de entrada
        </SideNavItem>
        <SideNavGroup label="Projetos" icon={<Icon name="folder" />}>
          <SideNavItem href="#checkout" onClick={go}>
            Checkout 2.0
          </SideNavItem>
          <SideNavItem href="#app" onClick={go}>
            App mobile
          </SideNavItem>
          <SideNavItem href="#site" onClick={go}>
            Site institucional
          </SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Relatórios" icon={<Icon name="chart-bar" />}>
          <SideNavItem href="#vendas" onClick={go}>
            Vendas
          </SideNavItem>
          <SideNavItem href="#funil" onClick={go}>
            Funil de conversão
          </SideNavItem>
        </SideNavGroup>
        <SideNavSection title="Configurações">
          <SideNavItem href="#equipe" icon={<Icon name="users" />} onClick={go}>
            Equipe
          </SideNavItem>
          <SideNavItem href="#integracoes" icon={<Icon name="layers" />} disabled>
            Integrações
          </SideNavItem>
        </SideNavSection>
      </SideNav>
      {/* minWidth 0 + overflowWrap: no celular, "#checkout" vazava da caixa do exemplo. */}
      <div style={{ flex: 1, minWidth: 0, padding: 24, color: 'var(--or-color-text-muted)', overflowWrap: 'anywhere' }}>
        Página atual: {current}
      </div>
    </div>
  )
}
```

### Recolhível

collapsible adiciona o botão de recolher. No modo recolhido, rótulos viram dicas (e seguem no nome acessível) e grupos abrem em painel — Escape fecha.

```tsx
import { Icon, SideNav, SideNavGroup, SideNavItem, SideNavSection } from '@orangesys/ui'
import { useState } from 'react'

export default function Collapsible() {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <div style={{ height: 480, display: 'flex', border: '1px solid var(--or-color-border)' }}>
      <SideNav
        aria-label="Navegação da loja"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        collapsible
        currentHref="#pedidos"
        header={({ collapsed }) => (
          <strong style={{ fontFamily: 'var(--or-font-display)' }}>{collapsed ? 'L' : 'Loja Aurora'}</strong>
        )}
      >
        <SideNavItem href="#resumo" icon={<Icon name="grid" />}>
          Resumo
        </SideNavItem>
        <SideNavItem href="#pedidos" icon={<Icon name="inbox" />} badge={4}>
          Pedidos
        </SideNavItem>
        <SideNavGroup label="Catálogo" icon={<Icon name="tag" />}>
          <SideNavItem href="#produtos">Produtos</SideNavItem>
          <SideNavItem href="#categorias">Categorias</SideNavItem>
          <SideNavItem href="#estoque">Estoque</SideNavItem>
        </SideNavGroup>
        <SideNavItem href="#clientes" icon={<Icon name="users" />}>
          Clientes
        </SideNavItem>
        <SideNavSection title="Loja">
          <SideNavItem href="#ajustes" icon={<Icon name="sliders" />}>
            Ajustes
          </SideNavItem>
        </SideNavSection>
      </SideNav>
      <div style={{ flex: 1, padding: 24, color: 'var(--or-color-text-muted)' }}>
        Passe o mouse ou use Tab nos ícones para ver os rótulos. "Catálogo" abre em um painel.
      </div>
    </div>
  )
}
```

### Com roteador

renderLink troca o <a> pelo link do roteador; currentHref vem da rota atual.

```tsx
import { Icon, SideNav, SideNavItem } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/agenda' // useLocation().pathname
  return (
    <div style={{ height: 260, display: 'flex', border: '1px solid var(--or-color-border)' }}>
      <SideNav
        aria-label="Navegação da clínica"
        currentHref={pathname}
        renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      >
        <SideNavItem href="/agenda" icon={<Icon name="calendar" />}>
          Agenda
        </SideNavItem>
        <SideNavItem href="/pacientes" icon={<Icon name="users" />}>
          Pacientes
        </SideNavItem>
        <SideNavItem href="/financeiro" icon={<Icon name="chart-bar" />}>
          Financeiro
        </SideNavItem>
      </SideNav>
    </div>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Abrir / fechar grupo** — A altura anima com grid-template-rows 0fr → 1fr + opacidade — slow (400ms), ease-out; o chevron gira 180° no mesmo tempo.
- **Item atual** — A barra laranja de 2px cresce do centro (scaleY) — medium, ease-spring; fundo em fast.
- **Recolher / expandir o menu** — O ícone do botão gira 180° — medium, ease-spring. Ao expandir, rótulos e selos entram com fade + 4px — medium, ease-out. A largura não anima.
- **Painel flutuante (recolhido)** — Entra com fade + 4px da esquerda em medium, ease-out; sai em fast, ease-in-out.
- **Dica do rótulo (recolhido)** — Aparece no hover/foco com fade + 4px — fast, ease-out.

## Props

### `SideNav`

Navegação lateral da aplicação: itens com ícone, grupos recolhíveis,
seções e modo recolhido (somente ícones).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `collapsed` | `boolean` | — | Modo recolhido: só ícones (rótulos continuam acessíveis e aparecem no hover/foco). Controlado. |
| `collapsible` | `boolean` | `false` | Mostra o botão "Recolher menu lateral" no rodapé. |
| `currentHref` | `string` | — | `href` da página atual: o item correspondente recebe `aria-current="page"`. |
| `defaultCollapsed` | `boolean` | `false` | Estado recolhido inicial (não controlado). |
| `footer` | `Slot` | — | Área inferior (perfil, ajuda). Aceita função `({ collapsed }) => ReactNode`. |
| `header` | `Slot` | — | Área superior (marca, seletor de workspace). Aceita função `({ collapsed }) => ReactNode`. |
| `onCollapsedChange` | `((collapsed: boolean) => void)` | — | Chamado quando o botão de recolher é acionado. |
| `renderLink` | `RenderLink` | — | Renderiza os links com o componente do seu roteador. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `SideNavGroup`

Grupo recolhível de itens. O botão expõe `aria-expanded`/`aria-controls`.
No modo recolhido, os itens abrem em um painel ao lado.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Rótulo do grupo (texto do botão que abre/fecha). |
| `defaultOpen` | `boolean` | — | Aberto inicialmente (não controlado). Padrão: aberto se contém o item atual. |
| `icon` | `ReactNode` | — | Ícone decorativo. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado ao abrir/fechar. |
| `open` | `boolean` | — | Aberto (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `SideNavItem`

Um destino da navegação lateral.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `active` | `boolean` | — | Marca o item como página atual. Padrão: `href === currentHref` do SideNav. |
| `badge` | `ReactNode` | — | Contador ou selo à direita (no modo recolhido vira um ponto). |
| `disabled` | `boolean` | `false` | Desabilita o item. |
| `href` | `string` | — | Destino. Sem `href`, o item é um botão (ex.: "Sair"). |
| `icon` | `ReactNode` | — | Ícone decorativo. No modo recolhido, sem ícone, mostra a inicial do rótulo. |
| `onClick` | `((event: MouseEvent<HTMLElement, MouseEvent>) => void)` | — | — |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `SideNavSection`

Agrupa itens sob um título curto em caixa alta (ex.: "Configurações").

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` (obrigatória) | `ReactNode` | — | Título da seção (rótulo da lista). No modo recolhido vira uma linha divisória. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Uma `<nav>` rotulada com listas de links. O item atual tem `aria-current="page"`; grupos seguem o padrão **Disclosure** do APG (`aria-expanded` e `aria-controls`); seções nomeiam suas listas com `aria-labelledby`. No modo recolhido, o texto do rótulo continua no DOM — só a apresentação muda —, então leitores de tela anunciam os mesmos nomes.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre itens e grupos na ordem visual. |
| `Enter` | Segue o link ou abre/fecha o grupo. |
| `Space` | Abre/fecha o grupo. |
| `Esc` | Modo recolhido: fecha o painel do grupo e devolve o foco ao botão. |

- **1.3.1** — Estrutura de listas aninhadas e seções rotuladas.
- **1.4.1** — Item atual com barra, fundo e ícone laranjas, não só cor do texto.
- **1.4.13** — Dicas do modo recolhido aparecem no hover e no foco, sem bloquear o conteúdo.
- **2.4.7** — Foco visível dentro de cada item.
- **4.1.2** — Estado de grupos com aria-expanded; item atual com aria-current.
