# NavigationMenu

Navegação de site ou aplicação com painéis de links — submenus e pequenos mega-menus —, no padrão de navegação por divulgação do WAI-ARIA.

- Categoria: Navegação · Status: novo
- Importação: `import { NavigationMenu } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/navigation-menu (em inglês: https://orange.llypedev.com.br/en/components/navigation-menu)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-navigationmenu--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/NavigationMenu

## Boas práticas

- Use para a navegação principal de sites de conteúdo e de aplicações com várias áreas, quando cada área tem algumas páginas. Para uma lista curta de destinos, links diretos (ou o AppHeader) bastam.
- É navegação, não um menu de comandos: os painéis só têm links. Para ações (Duplicar, Arquivar…), use `Dropdown`.
- Até 6 itens no topo e até 8 links por coluna. Rótulos curtos e concretos ("Produtos", "Preços") — nada de "Mais".
- A descrição é opcional e curta (uma linha). Com muitos links, prefira grupos com título (`{ label, items }`), que viram colunas.
- Não esconda a página mais importante de uma área dentro do painel: se a área tem uma página inicial, inclua-a como primeiro link ("Visão geral").
- No cabeçalho da aplicação, passe os sublinks em `AppHeader` ( `items[].items`): o comportamento é o mesmo e, em telas pequenas, eles viram seções do menu.

## Anatomia

- **Item link** — Leva direto a uma página; a atual ganha a barra laranja e aria-current="page".
- **Item com painel** — Botão com chevron que abre o painel; ganha a barra laranja quando a página atual está nele.
- **Painel** — Texto de apresentação opcional (description) e links em 1 a 4 colunas (columns) ou em grupos com título.
- **Link do painel** — Rótulo, descrição de uma linha e ícone opcionais; a linha inteira é clicável.

## Exemplos

### Site de produto

Painéis com links (descrição e ícone opcionais) e links diretos no mesmo nível. Clique em "Produtos" ou use Tab e Enter.

```tsx
import { NavigationMenu } from '@orangesys/ui'

export default function ProductSite() {
  return (
    <NavigationMenu
      aria-label="Navegação do site"
      currentHref="/precos"
      items={[
        {
          id: 'produtos',
          label: 'Produtos',
          items: [
            {
              label: 'Loja virtual',
              href: '/produtos/loja-virtual',
              description: 'Catálogo, carrinho e checkout em um só lugar.',
              icon: 'tag',
            },
            {
              label: 'Pagamentos',
              href: '/produtos/pagamentos',
              description: 'Pix, cartão e boleto com conciliação automática.',
              icon: 'zap',
            },
            {
              label: 'Estoque',
              href: '/produtos/estoque',
              description: 'Saldo por depósito e alertas de reposição.',
              icon: 'layers',
            },
          ],
        },
        {
          id: 'recursos',
          label: 'Recursos',
          items: [
            { label: 'Central de ajuda', href: '/recursos/ajuda' },
            { label: 'Blog', href: '/recursos/blog' },
            { label: 'Webinars', href: '/recursos/webinars' },
            { label: 'Status dos serviços', href: '/recursos/status' },
          ],
        },
        { label: 'Clientes', href: '/clientes' },
        { label: 'Preços', href: '/precos' },
      ]}
    />
  )
}
```

### Mega-menu com grupos e colunas

Grupos com título viram colunas (cada lista é rotulada pelo título); description apresenta a seção; columns distribui links soltos. Em telas estreitas, uma coluna só.

```tsx
import { NavigationMenu } from '@orangesys/ui'

export default function MegaMenu() {
  return (
    <NavigationMenu
      aria-label="Navegação do site"
      items={[
        {
          id: 'solucoes',
          label: 'Soluções',
          description: 'Configurações prontas para o seu negócio, do primeiro pedido à expansão.',
          items: [
            {
              label: 'Por setor',
              items: [
                { label: 'Varejo', href: '/solucoes/varejo' },
                { label: 'Alimentação', href: '/solucoes/alimentacao' },
                { label: 'Educação', href: '/solucoes/educacao' },
                { label: 'Serviços', href: '/solucoes/servicos' },
              ],
            },
            {
              label: 'Por porte',
              items: [
                { label: 'Pequenas empresas', href: '/solucoes/pequenas-empresas' },
                { label: 'Médias empresas', href: '/solucoes/medias-empresas' },
                { label: 'Grandes contas', href: '/solucoes/grandes-contas' },
              ],
            },
            {
              label: 'Por canal',
              items: [
                { label: 'Loja física', href: '/solucoes/loja-fisica' },
                { label: 'Marketplaces', href: '/solucoes/marketplaces' },
                { label: 'Vendas pelo WhatsApp', href: '/solucoes/whatsapp' },
              ],
            },
          ],
        },
        {
          id: 'integracoes',
          label: 'Integrações',
          columns: 2,
          items: [
            {
              label: 'ERP',
              href: '/integracoes/erp',
              description: 'Pedidos e notas fiscais sincronizados.',
            },
            {
              label: 'Transportadoras',
              href: '/integracoes/frete',
              description: 'Cotação e etiqueta no pedido.',
            },
            {
              label: 'Contabilidade',
              href: '/integracoes/contabilidade',
              description: 'Exportação mensal automática.',
            },
            {
              label: 'API e webhooks',
              href: '/integracoes/api',
              description: 'Para times de desenvolvimento.',
            },
          ],
        },
        { label: 'Preços', href: '/precos' },
      ]}
    />
  )
}
```

### Com roteador

renderLink usa o link do roteador; currentHref vem da rota atual e marca o link e a seção ("Financeiro").

```tsx
import { NavigationMenu } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/financeiro/conciliacao' // useLocation().pathname
  return (
    <NavigationMenu
      aria-label="Áreas do sistema"
      currentHref={pathname}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      items={[
        { label: 'Início', href: '/', icon: 'home' },
        {
          id: 'vendas',
          label: 'Vendas',
          items: [
            { label: 'Pedidos', href: '/vendas/pedidos' },
            { label: 'Clientes', href: '/vendas/clientes' },
            { label: 'Cupons', href: '/vendas/cupons' },
          ],
        },
        {
          id: 'financeiro',
          label: 'Financeiro',
          items: [
            { label: 'Recebimentos', href: '/financeiro/recebimentos' },
            { label: 'Conciliação', href: '/financeiro/conciliacao' },
            { label: 'Notas fiscais', href: '/financeiro/notas' },
          ],
        },
      ]}
    />
  )
}
```

### Controlado

openItem e onOpenItemChange ligam o painel aberto ao estado da aplicação (o id do item, ou null).

```tsx
import { Button, NavigationMenu, Stack, Text } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  return (
    <Stack gap={4}>
      <Stack direction="horizontal" gap={3} align="center" wrap>
        <Button size="sm" variant="outline" onClick={() => setOpenItem('ajuda')}>
          Abrir “Ajuda”
        </Button>
        <Text size="sm" tone="muted">
          Painel aberto: {openItem ?? 'nenhum'}
        </Text>
      </Stack>
      <NavigationMenu
        aria-label="Navegação da central de ajuda"
        openItem={openItem}
        onOpenItemChange={setOpenItem}
        items={[
          {
            id: 'ajuda',
            label: 'Ajuda',
            items: [
              { label: 'Primeiros passos', href: '/ajuda/primeiros-passos' },
              { label: 'Pagamentos e repasses', href: '/ajuda/pagamentos' },
              { label: 'Falar com o suporte', href: '/ajuda/suporte' },
            ],
          },
          {
            id: 'comunidade',
            label: 'Comunidade',
            items: [
              { label: 'Fórum', href: '/comunidade/forum' },
              { label: 'Eventos', href: '/comunidade/eventos' },
            ],
          },
        ]}
      />
    </Stack>
  )
}
```

## Posicionamento

O painel é renderizado no lugar, logo depois do botão (sem `Portal`), para que a ordem de Tab siga o APG: botão → links do painel → próximo item. Ele é ancorado abaixo do botão com Floating UI (`bottom-start`, com `flip`, `shift` e `size`): nunca passa da largura nem da altura disponíveis (rola por dentro) e fica acima da página ( `--or-z-dropdown`). Evite colocar o menu dentro de um contêiner com `overflow: hidden`. No `AppHeader`, o painel encosta na borda de baixo do cabeçalho.

## Movimento

- **Abrir o painel** — Fade + 4px vindo do botão — --or-duration-medium, --or-ease-out (base .or-floating, como Popover e Dropdown).
- **Fechar** — Mais curto: --or-duration-fast, --or-ease-in-out; inerte durante a saída e hidden ao fim (usePresence).
- **Chevron** — Gira 180° com o painel aberto — --or-duration-medium, --or-ease-spring.
- **Hover e foco** — Mesma resposta: fundo no item do topo; no link do painel, fundo e barra laranja que cresce do centro — --or-duration-fast.
- **Página atual** — Barra laranja de 2px na base do item (scaleX, --or-duration-medium); no painel, barra à esquerda e fundo de acento.

## Props

### `NavigationMenu`

Navegação de site/aplicação com painéis de links (submenus e pequenos
mega-menus), no padrão "Disclosure Navigation Menu" do WAI-ARIA APG: uma
`<nav>` com lista; itens com painel são botões com `aria-expanded` que
mostram uma lista de links. Um painel aberto por vez; Esc, clique fora ou
foco fora fecham.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `items` (obrigatória) | `NavigationMenuItem[]` | — | Itens do primeiro nível: links ou botões que abrem um painel (`items`). |
| `currentHref` | `string` | — | `href` da página atual: o link correspondente recebe `aria-current="page"`. |
| `defaultOpenItem` | `string \| null` | `null` | Painel aberto inicialmente (não controlado). Padrão: `null`. |
| `onOpenItemChange` | `((item: string \| null) => void)` | — | Chamado quando um painel abre (`id`) ou fecha (`null`). |
| `openItem` | `string \| null` | — | Painel aberto (controlado): o `id` do item, ou `null` para nenhum. |
| `renderLink` | `RenderLink` | — | Renderiza os links com o componente do seu roteador. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o exemplo **Disclosure Navigation Menu** do WAI-ARIA APG — não o padrão menu/menubar, que é para comandos e exige outro modelo de teclado. Uma `<nav>` rotulada com uma lista; itens com painel são `<button>` com `aria-expanded` e `aria-controls`, seguidos do painel com a lista de links (grupos rotulados pelo título). A página atual tem `aria-current="page"`; a descrição de um link entra como `aria-describedby`, então o nome continua curto. O foco fica no botão ao abrir. Os painéis abrem só por clique, Enter ou Espaço — não há abertura por hover.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os itens do topo e, com um painel aberto, os links dele. Sair do item (ou da navegação) fecha o painel. |
| `Enter` + `Space` | No botão, abre ou fecha o painel (fechando o outro que estiver aberto). No link, segue o link. |
| `Esc` | Fecha o painel aberto e devolve o foco ao botão. |
| `→` + `←` | No topo: próximo/anterior item (sem dar a volta). No painel: próximo/anterior link. |
| `↓` | No botão de um painel aberto: primeiro link do painel. Nos demais itens do topo: próximo item. No painel: próximo link. |
| `↑` | No topo: item anterior. No painel: link anterior. |
| `Home` + `End` | Primeiro/último item do topo, ou primeiro/último link do painel. |

- **1.3.1** — nav rotulada, listas e grupos rotulados; descrição ligada por aria-describedby.
- **1.4.10** — Em 320px os itens quebram linha e o painel vira uma coluna, sem rolagem horizontal da página.
- **1.4.13** — Nada abre no hover; o painel fica aberto até Esc, clique fora ou o foco sair.
- **2.1.1** — Tudo por teclado: Tab, Enter/Espaço, Esc e as setas opcionais do APG.
- **2.4.3** — O painel vem logo depois do botão no DOM; Esc e a escolha de um link devolvem o foco ao botão.
- **4.1.2** — Estado do painel com aria-expanded; página atual com aria-current.
