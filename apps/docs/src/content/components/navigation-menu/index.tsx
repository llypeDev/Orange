import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import MegaMenu from './examples/MegaMenu'
import MegaMenuCode from './examples/MegaMenu?raw'
import ProductSite from './examples/ProductSite'
import ProductSiteCode from './examples/ProductSite?raw'
import WithRouter from './examples/WithRouter'
import WithRouterCode from './examples/WithRouter?raw'
import { meta } from './meta'

export default function NavigationMenuPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para a navegação principal de sites de conteúdo e de aplicações com várias áreas, quando cada área tem algumas páginas. Para uma lista curta de destinos, links diretos (ou o AppHeader) bastam.',
              en: 'Use it for the main navigation of content sites and multi-area apps, when each area has a few pages. For a short list of destinations, plain links (or the AppHeader) are enough.',
            },
            {
              pt: (
                <>
                  É navegação, não um menu de comandos: os painéis só têm links. Para ações
                  (Duplicar, Arquivar…), use <Code>Dropdown</Code>.
                </>
              ),
              en: (
                <>
                  This is navigation, not a command menu: panels only hold links. For actions
                  (Duplicate, Archive…), use <Code>Dropdown</Code>.
                </>
              ),
            },
            {
              pt: 'Até 6 itens no topo e até 8 links por coluna. Rótulos curtos e concretos ("Produtos", "Preços") — nada de "Mais".',
              en: 'Up to 6 top-level items and up to 8 links per column. Short, concrete labels ("Products", "Pricing") — never "More".',
            },
            {
              pt: (
                <>
                  A descrição é opcional e curta (uma linha). Com muitos links, prefira grupos com
                  título (<Code>{'{ label, items }'}</Code>), que viram colunas.
                </>
              ),
              en: (
                <>
                  The description is optional and short (one line). With many links, prefer titled
                  groups (<Code>{'{ label, items }'}</Code>), which become columns.
                </>
              ),
            },
            {
              pt: (
                <>
                  Não esconda a página mais importante de uma área dentro do painel: se a área tem
                  uma página inicial, inclua-a como primeiro link ("Visão geral").
                </>
              ),
              en: (
                <>
                  Do not bury the most important page of an area in the panel: if the area has a
                  landing page, add it as the first link ("Overview").
                </>
              ),
            },
            {
              pt: (
                <>
                  No cabeçalho da aplicação, passe os sublinks em <Code>AppHeader</Code> (
                  <Code>items[].items</Code>): o comportamento é o mesmo e, em telas pequenas, eles
                  viram seções do menu.
                </>
              ),
              en: (
                <>
                  In the app header, pass sub-links to <Code>AppHeader</Code> (
                  <Code>items[].items</Code>): the behaviour is the same and, on small screens, they
                  become sections of the menu.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Item link', en: 'Link item' },
              description: {
                pt: 'Leva direto a uma página; a atual ganha a barra laranja e aria-current="page".',
                en: 'Goes straight to a page; the current one gets the orange bar and aria-current="page".',
              },
            },
            {
              term: { pt: 'Item com painel', en: 'Panel item' },
              description: {
                pt: 'Botão com chevron que abre o painel; ganha a barra laranja quando a página atual está nele.',
                en: 'Button with a chevron that opens the panel; gets the orange bar when the current page is in it.',
              },
            },
            {
              term: { pt: 'Painel', en: 'Panel' },
              description: {
                pt: 'Texto de apresentação opcional (description) e links em 1 a 4 colunas (columns) ou em grupos com título.',
                en: 'Optional intro text (description) and links in 1 to 4 columns (columns) or in titled groups.',
              },
            },
            {
              term: { pt: 'Link do painel', en: 'Panel link' },
              description: {
                pt: 'Rótulo, descrição de uma linha e ícone opcionais; a linha inteira é clicável.',
                en: 'Label, optional one-line description and icon; the whole row is clickable.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Site de produto', en: 'Product site' }}
          description={{
            pt: 'Painéis com links (descrição e ícone opcionais) e links diretos no mesmo nível. Clique em "Produtos" ou use Tab e Enter.',
            en: 'Panels with links (optional description and icon) next to direct links. Click "Produtos" or use Tab and Enter.',
          }}
          code={ProductSiteCode}
          minHeight={340}
        >
          <ProductSite />
        </Example>
        <Example
          title={{ pt: 'Mega-menu com grupos e colunas', en: 'Mega menu with groups and columns' }}
          description={{
            pt: 'Grupos com título viram colunas (cada lista é rotulada pelo título); description apresenta a seção; columns distribui links soltos. Em telas estreitas, uma coluna só.',
            en: 'Titled groups become columns (each list is labelled by its title); description introduces the section; columns spreads loose links. On narrow screens, a single column.',
          }}
          code={MegaMenuCode}
          minHeight={360}
        >
          <MegaMenu />
        </Example>
        <Example
          title={{ pt: 'Com roteador', en: 'With a router' }}
          description={{
            pt: 'renderLink usa o link do roteador; currentHref vem da rota atual e marca o link e a seção ("Financeiro").',
            en: 'renderLink uses the router link; currentHref comes from the current route and marks the link and its section ("Financeiro").',
          }}
          code={WithRouterCode}
          minHeight={260}
        >
          <WithRouter />
        </Example>
        <Example
          title={{ pt: 'Controlado', en: 'Controlled' }}
          description={{
            pt: 'openItem e onOpenItemChange ligam o painel aberto ao estado da aplicação (o id do item, ou null).',
            en: 'openItem and onOpenItemChange tie the open panel to app state (the item id, or null).',
          }}
          code={ControlledCode}
          minHeight={280}
        >
          <Controlled />
        </Example>
      </Section>

      <Section title={{ pt: 'Posicionamento', en: 'Positioning' }}>
        <p>
          <T
            pt={
              <>
                O painel é renderizado no lugar, logo depois do botão (sem <Code>Portal</Code>),
                para que a ordem de Tab siga o APG: botão → links do painel → próximo item. Ele é
                ancorado abaixo do botão com Floating UI (<Code>bottom-start</Code>, com{' '}
                <Code>flip</Code>, <Code>shift</Code> e <Code>size</Code>): nunca passa da largura
                nem da altura disponíveis (rola por dentro) e fica acima da página (
                <Code>--or-z-dropdown</Code>). Evite colocar o menu dentro de um contêiner com{' '}
                <Code>overflow: hidden</Code>. No <Code>AppHeader</Code>, o painel encosta na borda
                de baixo do cabeçalho.
              </>
            }
            en={
              <>
                The panel renders in place, right after its button (no <Code>Portal</Code>), so the
                Tab order follows the APG: button → panel links → next item. It is anchored below
                the button with Floating UI (<Code>bottom-start</Code>, with <Code>flip</Code>,{' '}
                <Code>shift</Code> and <Code>size</Code>): it never exceeds the available width or
                height (it scrolls inside) and sits above the page (<Code>--or-z-dropdown</Code>).
                Avoid placing the menu inside a container with <Code>overflow: hidden</Code>. In the{' '}
                <Code>AppHeader</Code>, the panel sits flush with the header&apos;s bottom edge.
              </>
            }
          />
        </p>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Abrir o painel', en: 'Opening a panel' },
              description: {
                pt: 'Fade + 4px vindo do botão — --or-duration-medium, --or-ease-out (base .or-floating, como Popover e Dropdown).',
                en: 'Fade + 4px from the button — --or-duration-medium, --or-ease-out (.or-floating base, like Popover and Dropdown).',
              },
            },
            {
              term: { pt: 'Fechar', en: 'Closing' },
              description: {
                pt: 'Mais curto: --or-duration-fast, --or-ease-in-out; inerte durante a saída e hidden ao fim (usePresence).',
                en: 'Shorter: --or-duration-fast, --or-ease-in-out; inert while leaving and hidden at the end (usePresence).',
              },
            },
            {
              term: { pt: 'Chevron', en: 'Chevron' },
              description: {
                pt: 'Gira 180° com o painel aberto — --or-duration-medium, --or-ease-spring.',
                en: 'Turns 180° while the panel is open — --or-duration-medium, --or-ease-spring.',
              },
            },
            {
              term: { pt: 'Hover e foco', en: 'Hover and focus' },
              description: {
                pt: 'Mesma resposta: fundo no item do topo; no link do painel, fundo e barra laranja que cresce do centro — --or-duration-fast.',
                en: 'Same response: background on top-level items; on panel links, background and an orange bar growing from the centre — --or-duration-fast.',
              },
            },
            {
              term: { pt: 'Página atual', en: 'Current page' },
              description: {
                pt: 'Barra laranja de 2px na base do item (scaleX, --or-duration-medium); no painel, barra à esquerda e fundo de acento.',
                en: 'A 2px orange bar at the bottom of the item (scaleX, --or-duration-medium); in the panel, a bar on the left and an accent background.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'NavigationMenu', en: 'NavigationMenu' }}
          rows={[
            {
              name: 'items',
              type: 'NavigationMenuItem[]',
              required: true,
              description: {
                pt: 'Itens do topo: links ({ label, href, icon?, active? }) ou painéis ({ id?, label, items, description?, columns? }).',
                en: 'Top-level items: links ({ label, href, icon?, active? }) or panels ({ id?, label, items, description?, columns? }).',
              },
            },
            {
              name: 'currentHref',
              type: 'string',
              description: {
                pt: 'Rota atual; o link correspondente recebe aria-current="page" e o botão do painel que o contém, a marca de seção atual.',
                en: 'Current route; the matching link gets aria-current="page" and the panel button containing it, the current-section mark.',
              },
            },
            {
              name: 'renderLink',
              type: '(props: RenderLinkProps) => ReactNode',
              description: { pt: 'Link do roteador.', en: 'Router link.' },
            },
            {
              name: 'openItem',
              type: 'string | null',
              description: {
                pt: 'Painel aberto (controlado): o id do item, ou null.',
                en: 'Open panel (controlled): the item id, or null.',
              },
            },
            {
              name: 'defaultOpenItem',
              type: 'string | null',
              default: 'null',
              description: { pt: 'Painel aberto inicialmente.', en: 'Initially open panel.' },
            },
            {
              name: 'onOpenItemChange',
              type: '(item: string | null) => void',
              description: {
                pt: 'Chamado quando um painel abre (id) ou fecha (null).',
                en: 'Called when a panel opens (id) or closes (null).',
              },
            },
            {
              name: 'aria-label',
              type: 'string',
              default: "t('mainNavigation')",
              description: {
                pt: 'Nome da navegação ("Navegação principal").',
                en: 'Navigation name ("Main navigation").',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLElement>',
              description: {
                pt: (
                  <>
                    Atributos nativos e <Code>ref</Code> vão para a <Code>&lt;nav&gt;</Code>.
                  </>
                ),
                en: (
                  <>
                    Native attributes and <Code>ref</Code> go to the <Code>&lt;nav&gt;</Code>.
                  </>
                ),
              },
            },
          ]}
        />
        <PropsTable
          caption={{
            pt: 'NavigationMenuPanelItem (item com painel)',
            en: 'NavigationMenuPanelItem (panel item)',
          }}
          rows={[
            {
              name: 'id',
              type: 'string',
              default: "'0', '1'…",
              description: {
                pt: 'Identificador usado em openItem. Padrão: a posição do item.',
                en: 'Identifier used by openItem. Default: the item position.',
              },
            },
            {
              name: 'label',
              type: 'ReactNode',
              required: true,
              description: { pt: 'Texto do botão.', en: 'Button text.' },
            },
            {
              name: 'items',
              type: '(NavigationMenuLink | NavigationMenuGroup)[]',
              required: true,
              description: {
                pt: 'Links ({ label, href, description?, icon?, active? }) e/ou grupos ({ label, items }).',
                en: 'Links ({ label, href, description?, icon?, active? }) and/or groups ({ label, items }).',
              },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: {
                pt: 'Texto de apresentação no topo do painel.',
                en: 'Intro text at the top of the panel.',
              },
            },
            {
              name: 'columns',
              type: '1 | 2 | 3 | 4',
              default: '1',
              description: {
                pt: 'Colunas do painel. Com grupos, o padrão é uma por grupo.',
                en: 'Panel columns. With groups, the default is one per group.',
              },
            },
          ]}
        />
        <PropsTable
          caption={{
            pt: 'NavigationMenuLink (link do painel)',
            en: 'NavigationMenuLink (panel link)',
          }}
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              required: true,
              description: { pt: 'Texto (nome acessível).', en: 'Text (accessible name).' },
            },
            {
              name: 'href',
              type: 'string',
              required: true,
              description: { pt: 'Destino.', en: 'Destination.' },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: {
                pt: 'Linha de apoio; vira a descrição acessível (aria-describedby).',
                en: 'Supporting line; becomes the accessible description (aria-describedby).',
              },
            },
            {
              name: 'icon',
              type: 'IconName | ReactNode',
              description: { pt: 'Ícone decorativo.', en: 'Decorative icon.' },
            },
            {
              name: 'active',
              type: 'boolean',
              default: 'href === currentHref',
              description: { pt: 'Marca como página atual.', en: 'Marks as the current page.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o exemplo <strong>Disclosure Navigation Menu</strong> do WAI-ARIA APG — não o
                padrão menu/menubar, que é para comandos e exige outro modelo de teclado. Uma{' '}
                <Code>&lt;nav&gt;</Code> rotulada com uma lista; itens com painel são{' '}
                <Code>&lt;button&gt;</Code> com <Code>aria-expanded</Code> e{' '}
                <Code>aria-controls</Code>, seguidos do painel com a lista de links (grupos
                rotulados pelo título). A página atual tem <Code>aria-current="page"</Code>; a
                descrição de um link entra como <Code>aria-describedby</Code>, então o nome continua
                curto. O foco fica no botão ao abrir. Os painéis abrem só por clique, Enter ou
                Espaço — não há abertura por hover.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <strong>Disclosure Navigation Menu</strong> example — not
                the menu/menubar pattern, which is for commands and requires a different keyboard
                model. A labelled <Code>&lt;nav&gt;</Code> with a list; panel items are{' '}
                <Code>&lt;button&gt;</Code>s with <Code>aria-expanded</Code> and{' '}
                <Code>aria-controls</Code>, followed by the panel with the list of links (groups
                labelled by their title). The current page has <Code>aria-current="page"</Code>; a
                link description is exposed via <Code>aria-describedby</Code>, so the name stays
                short. Focus stays on the button when it opens. Panels open only on click, Enter or
                Space — there is no hover opening.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Percorre os itens do topo e, com um painel aberto, os links dele. Sair do item (ou da navegação) fecha o painel.',
                en: 'Moves through top-level items and, with a panel open, through its links. Leaving the item (or the navigation) closes the panel.',
              },
            },
            {
              keys: ['Enter', 'Space'],
              description: {
                pt: 'No botão, abre ou fecha o painel (fechando o outro que estiver aberto). No link, segue o link.',
                en: 'On a button, opens or closes the panel (closing any other open one). On a link, follows it.',
              },
            },
            {
              keys: ['Esc'],
              description: {
                pt: 'Fecha o painel aberto e devolve o foco ao botão.',
                en: 'Closes the open panel and returns focus to its button.',
              },
            },
            {
              keys: ['→', '←'],
              description: {
                pt: 'No topo: próximo/anterior item (sem dar a volta). No painel: próximo/anterior link.',
                en: 'Top level: next/previous item (no wrapping). In the panel: next/previous link.',
              },
            },
            {
              keys: ['↓'],
              description: {
                pt: 'No botão de um painel aberto: primeiro link do painel. Nos demais itens do topo: próximo item. No painel: próximo link.',
                en: 'On the button of an open panel: first link of the panel. On other top-level items: next item. In the panel: next link.',
              },
            },
            {
              keys: ['↑'],
              description: {
                pt: 'No topo: item anterior. No painel: link anterior.',
                en: 'Top level: previous item. In the panel: previous link.',
              },
            },
            {
              keys: ['Home', 'End'],
              description: {
                pt: 'Primeiro/último item do topo, ou primeiro/último link do painel.',
                en: 'First/last top-level item, or first/last link in the panel.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'nav rotulada, listas e grupos rotulados; descrição ligada por aria-describedby.',
                en: 'Labelled nav, lists and labelled groups; description linked via aria-describedby.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Em 320px os itens quebram linha e o painel vira uma coluna, sem rolagem horizontal da página.',
                en: 'At 320px items wrap and the panel becomes a single column, with no horizontal page scrolling.',
              },
            },
            {
              criterion: '1.4.13',
              description: {
                pt: 'Nada abre no hover; o painel fica aberto até Esc, clique fora ou o foco sair.',
                en: 'Nothing opens on hover; the panel stays open until Esc, an outside click or focus leaving.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Tudo por teclado: Tab, Enter/Espaço, Esc e as setas opcionais do APG.',
                en: 'Everything by keyboard: Tab, Enter/Space, Esc and the optional APG arrow keys.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'O painel vem logo depois do botão no DOM; Esc e a escolha de um link devolvem o foco ao botão.',
                en: 'The panel comes right after its button in the DOM; Esc and choosing a link return focus to the button.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: 'Estado do painel com aria-expanded; página atual com aria-current.',
                en: 'Panel state with aria-expanded; current page with aria-current.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
