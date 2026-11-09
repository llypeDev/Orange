# AppHeader

Cabeçalho da aplicação com marca, navegação principal e ações, que vira menu em telas pequenas.

- Categoria: Navegação · Status: estável
- Importação: `import { AppHeader } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/app-header (em inglês: https://orange.llypedev.com.br/en/components/app-header)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-appheader--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/AppHeader

## Boas práticas

- Use um único AppHeader por página, no topo, fora do <main>. Ele vira o landmark "banner".
- Até 5 ou 6 destinos de primeiro nível. Com mais áreas, combine com um SideNav.
- A marca leva à página inicial; dê a ela um nome acessível que diga isso ("Orange — início").
- Ações só com ícone (busca, notificações) precisam de `aria-label`. Mantenha no máximo três.
- Ajuste `collapseBelow` ao número de itens: quanto mais itens, mais cedo a navegação deve ir para o menu.

## Anatomia

- **Marca** — Logo com link para o início (brand).
- **Navegação** — Links principais; o atual ganha o sublinhado laranja (items, currentHref).
- **Submenu** — Item com `items`: botão com chevron que abre um painel de links (como no `NavigationMenu`); em telas pequenas, seção expansível do menu.
- **Ações** — Busca, notificações, perfil (actions).
- **Botão de menu** — Em telas estreitas, abre o painel com a navegação (`aria-expanded`).

## Exemplos

### Aplicação

Marca, navegação e ações. Aqui collapseBelow="sm" mantém a navegação em linha na largura da prévia.

```tsx
import { AppHeader, Button, Icon } from '@orangesys/ui'

export default function Basic() {
  return (
    <AppHeader
      collapseBelow="sm"
      navLabel="Navegação do Analytics"
      brand={
        <a href="#inicio" aria-label="Orange Analytics — início">
          <Icon name="chart-bar" /> Analytics
        </a>
      }
      items={[
        { label: 'Painel', href: '#painel' },
        { label: 'Campanhas', href: '#campanhas' },
        { label: 'Público', href: '#publico' },
        { label: 'Relatórios', href: '#relatorios' },
      ]}
      currentHref="#campanhas"
      // Uma ação: menu + marca + ação cabem na prévia estreita (celular de 320px).
      actions={<Button variant="ghost" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />}
    />
  )
}
```

### Em telas pequenas

A largura é medida no próprio cabeçalho (container query). O painel fecha com Esc, com clique fora ou ao escolher um link; menuFooter adiciona ações no fim.

```tsx
import { AppHeader, Button, Icon } from '@orangesys/ui'

export default function Mobile() {
  return (
    // Largura de celular: a navegação vai para o painel do botão "Menu".
    // O painel é absoluto: a altura mínima reserva exatamente o espaço dele, e a
    // borda de baixo é a do próprio painel (sem faixa vazia nem borda dupla).
    <div
      style={{
        width: 360,
        maxWidth: '100%',
        minHeight: 351,
        border: '1px solid var(--or-color-border)',
        borderBottom: 0,
      }}
    >
      <AppHeader
        defaultMenuOpen
        navLabel="Navegação da loja"
        brand={<a href="#loja">Aurora</a>}
        items={[
          { label: 'Novidades', href: '#novidades' },
          { label: 'Feminino', href: '#feminino' },
          { label: 'Masculino', href: '#masculino' },
          { label: 'Ofertas', href: '#ofertas' },
        ]}
        currentHref="#novidades"
        actions={<Button variant="ghost" iconOnly aria-label="Sacola, 2 itens" startIcon={<Icon name="tag" />} />}
        menuFooter={
          <Button block variant="outline">
            Entrar
          </Button>
        }
      />
    </div>
  )
}
```

### Com submenus

Itens com items abrem um submenu (padrão Disclosure Navigation Menu do APG, o mesmo do NavigationMenu): em telas largas, um painel encostado na borda do cabeçalho, com links, descrições e grupos em colunas; abaixo de collapseBelow, seções expansíveis dentro do menu — a da página atual já vem aberta. O href do item com submenu não vira link: ele marca a seção atual.

```tsx
import { AppHeader, Button, Icon } from '@orangesys/ui'

export default function Submenus() {
  return (
    <AppHeader
      collapseBelow="sm"
      navLabel="Navegação do site"
      brand={
        <a href="#inicio" aria-label="Vitrine — início">
          <Icon name="sparkle" /> Vitrine
        </a>
      }
      currentHref="#pagamentos"
      items={[
        {
          label: 'Produtos',
          href: '#produtos',
          columns: 2,
          items: [
            {
              label: 'Loja virtual',
              href: '#loja-virtual',
              description: 'Catálogo, carrinho e checkout.',
              icon: 'tag',
            },
            {
              label: 'Pagamentos',
              href: '#pagamentos',
              description: 'Pix, cartão e boleto.',
              icon: 'zap',
            },
            {
              label: 'Estoque',
              href: '#estoque',
              description: 'Saldo por depósito e reposição.',
              icon: 'layers',
            },
            {
              label: 'Relatórios',
              href: '#relatorios',
              description: 'Vendas e margem por canal.',
              icon: 'chart-bar',
            },
          ],
        },
        {
          label: 'Soluções',
          href: '#solucoes',
          items: [
            {
              label: 'Por setor',
              items: [
                { label: 'Varejo', href: '#varejo' },
                { label: 'Alimentação', href: '#alimentacao' },
                { label: 'Educação', href: '#educacao' },
              ],
            },
            {
              label: 'Por porte',
              items: [
                { label: 'Pequenas empresas', href: '#pequenas-empresas' },
                { label: 'Grandes contas', href: '#grandes-contas' },
              ],
            },
          ],
        },
        {
          label: 'Recursos',
          href: '#recursos',
          items: [
            { label: 'Central de ajuda', href: '#ajuda' },
            { label: 'Blog', href: '#blog' },
            { label: 'Webinars', href: '#webinars' },
          ],
        },
        { label: 'Preços', href: '#precos' },
      ]}
      actions={
        <Button variant="ghost" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />
      }
      menuFooter={
        <Button block variant="outline">
          Entrar
        </Button>
      }
    />
  )
}
```

### Fixo no topo

sticky mantém o cabeçalho visível durante a rolagem, com fundo levemente translúcido.

```tsx
import { AppHeader, Button } from '@orangesys/ui'

export default function Sticky() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Prévia com rolagem"
      style={{ width: '100%', height: 300, overflow: 'auto', border: '1px solid var(--or-color-border)' }}
    >
      <AppHeader
        sticky
        collapseBelow="sm"
        navLabel="Navegação da documentação"
        brand={<a href="#docs">Orange Docs</a>}
        items={[
          { label: 'Guias', href: '#guias' },
          { label: 'API', href: '#api' },
          { label: 'Changelog', href: '#changelog' },
        ]}
        currentHref="#guias"
        actions={<Button size="sm">Começar</Button>}
      />
      <div style={{ padding: 24, display: 'grid', gap: 16 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i} style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
            Role esta área: com sticky, o cabeçalho continua visível no topo enquanto o conteúdo passa por baixo.
          </p>
        ))}
      </div>
    </div>
  )
}
```

### Esconder ao rolar

hideOnScroll esconde o cabeçalho ao rolar para baixo (translateY, 250ms) e o traz de volta ao rolar para cima — nunca com foco dentro dele ou com o menu aberto.

```tsx
import { AppHeader, Button, Icon } from '@orangesys/ui'
import type { ReactNode } from 'react'

// No layout raiz: o cabeçalho sobe ao rolar para baixo (depois de 120px) e
// volta ao rolar para cima. Com foco dentro dele ou com o menu aberto, fica.
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader
        hideOnScroll
        brand={<a href="/">Orange</a>}
        items={[
          { label: 'Produto', href: '/produto' },
          { label: 'Preços', href: '/precos' },
          { label: 'Blog', href: '/blog' },
        ]}
        currentHref="/blog"
        actions={<Button size="sm" endIcon={<Icon name="arrow-right" />}>Teste grátis</Button>}
      />
      <main id="main">{children}</main>
    </>
  )
}

export default function HideOnScroll() {
  return (
    <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
      hideOnScroll observa a rolagem da janela, por isso o efeito aparece no layout real (veja a story “Hide On Scroll” no
      Storybook).
    </p>
  )
}
```

### Com roteador

renderLink usa o link do roteador; currentHref vem da rota atual.

```tsx
import { AppHeader } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/clientes' // useLocation().pathname
  return (
    <AppHeader
      collapseBelow="sm"
      navLabel="Navegação do CRM"
      brand={<RouterLink to="/">CRM</RouterLink>}
      items={[
        { label: 'Clientes', href: '/clientes' },
        { label: 'Negócios', href: '/negocios' },
        { label: 'Tarefas', href: '/tarefas' },
      ]}
      currentHref={pathname}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    />
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Hover / foco em um link** — Sublinhado de 2px cresce da esquerda (scaleX) — medium, ease-out. Na página atual ele fica laranja.
- **Rolar com hideOnScroll** — Ao rolar para baixo, o cabeçalho sobe (translateY(-110%)); ao subir, volta — medium (250ms), ease-in-out. Nunca some com foco dentro ou com o menu aberto.
- **Abrir o menu (telas pequenas)** — O painel desce com fade (medium, ease-out) e os itens entram em cascata (40ms entre eles).
- **Fechar o menu** — O painel sai com fade + 4px para cima — fast, ease-in-out — e só então é escondido (usePresence).
- **Botão de menu** — O ícone ☰/✕ entra girando com um pop (medium, ease-bounce); o botão afunda 1px ao pressionar (press).
- **Submenu** — Telas largas: o painel entra com fade + 4px (medium, ease-out) e sai mais rápido (fast). Menu móvel: a seção abre com grid-template-rows 0fr → 1fr (slow, ease-out) e fecha em medium. O chevron gira 180° (medium, ease-spring).

## Props

### `AppHeader`

Cabeçalho da aplicação: marca, navegação principal e ações. Em telas
estreitas, a navegação vai para um painel aberto pelo botão de menu.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `actions` | `ReactNode` | — | Área de ações à direita (busca, notificações, avatar). |
| `brand` | `ReactNode` | — | Área da marca (logo com link para o início). |
| `collapseBelow` | `"sm" \| "md" \| "lg"` | `md` | Largura do cabeçalho abaixo da qual a navegação vai para o menu (`sm` 40rem, `md` 48rem, `lg` 64rem). Padrão: `md`. |
| `currentHref` | `string` | — | `href` da página atual: o item correspondente recebe `aria-current="page"`. |
| `defaultMenuOpen` | `boolean` | `false` | Menu aberto inicialmente (não controlado). |
| `hideOnScroll` | `boolean` | `false` | Esconde o cabeçalho ao rolar a página para baixo (depois de 120px) e o mostra de novo ao rolar para cima. Implica `sticky`. Nunca esconde com o foco dentro do cabeçalho ou com o menu aberto. |
| `items` | `AppHeaderNavItem[]` | `[]` | Links da navegação principal. |
| `menuFooter` | `ReactNode` | — | Conteúdo extra no fim do painel do menu em telas pequenas (ex.: botão "Entrar"). |
| `menuOpen` | `boolean` | — | Menu aberto em telas pequenas (controlado). |
| `navLabel` | `string` | — | Nome da navegação. Padrão: `t('mainNavigation')`. |
| `onMenuOpenChange` | `((open: boolean) => void)` | — | Chamado quando o menu abre ou fecha. |
| `renderLink` | `RenderLink` | — | Renderiza os links com o componente do seu roteador. |
| `sticky` | `boolean` | `false` | Fixa o cabeçalho no topo durante a rolagem. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Um `<header>` (landmark "banner" quando fora de `<main>`) com uma `<nav>` rotulada. O item atual tem `aria-current="page"`. O botão de menu segue o padrão **Disclosure** do APG: nome "Menu", `aria-expanded` e `aria-controls` apontando para a navegação. Esc fecha o painel e devolve o foco ao botão.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre marca, botão de menu, links e ações. |
| `Enter` | Segue o link ou abre/fecha o menu. |
| `Space` | Abre/fecha o menu. |
| `Esc` | Fecha o submenu aberto (ou, em telas pequenas, o menu) e devolve o foco ao botão. |
| `→` + `←` + `↑` + `↓` + `Home` + `End` | Só com submenus, como no `NavigationMenu`: ←/→ entre os itens, ↓ entra no submenu aberto, ↑/↓ entre os sublinks, Home/End no primeiro/último. |

- **1.3.1** — Landmarks header e nav com rótulo.
- **1.4.10** — Em 320px, a navegação vai para o painel sem rolagem horizontal.
- **2.4.7** — Foco visível em todos os controles.
- **4.1.2** — Estado do menu com aria-expanded; página atual com aria-current.
