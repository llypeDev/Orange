import {
  Bullets,
  Callout,
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
import Collapsible from './examples/Collapsible'
import CollapsibleCode from './examples/Collapsible?raw'
import Orders from './examples/Orders'
import OrdersCode from './examples/Orders?raw'
import Settings from './examples/Settings'
import SettingsCode from './examples/Settings?raw'
import { meta } from './meta'

export default function AppShellPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use um AppShell por página, na raiz. Ele cria os landmarks (<Code>header</Code>, <Code>nav</Code>,{' '}
                  <Code>main</Code>, <Code>aside</Code>, <Code>footer</Code>) e o link "Pular para o conteúdo principal".
                </>
              ),
              en: (
                <>
                  Use one AppShell per page, at the root. It creates the landmarks (<Code>header</Code>,{' '}
                  <Code>nav</Code>, <Code>main</Code>, <Code>aside</Code>, <Code>footer</Code>) and the "Skip to main
                  content" link.
                </>
              ),
            },
            {
              pt: (
                <>
                  Componha com as peças do Orange: <Code>AppHeader</Code> no <Code>header</Code>, <Code>SideNav</Code>{' '}
                  na <Code>navigation</Code>, <Code>PageHeader</Code> no topo do conteúdo e <Code>Footer</Code> no{' '}
                  <Code>footer</Code>. O AppShell reconhece essas peças e não aninha landmarks repetidos.
                </>
              ),
              en: (
                <>
                  Compose with Orange parts: <Code>AppHeader</Code> in <Code>header</Code>, <Code>SideNav</Code> in{' '}
                  <Code>navigation</Code>, <Code>PageHeader</Code> at the top of the content and <Code>Footer</Code> in{' '}
                  <Code>footer</Code>. AppShell recognizes these parts and doesn't nest duplicate landmarks.
                </>
              ),
            },
            {
              pt: (
                <>
                  Coloque o <Code>AppShellNavToggle</Code> no cabeçalho, perto da marca. Abaixo de{' '}
                  <Code>navDrawerBelow</Code> ele abre o painel; acima, recolhe a barra lateral.
                </>
              ),
              en: (
                <>
                  Place <Code>AppShellNavToggle</Code> in the header, near the brand. Below <Code>navDrawerBelow</Code> it
                  opens the panel; above it, it collapses the sidebar.
                </>
              ),
            },
            {
              pt: 'Use o aside para informação de apoio (resumo, ajuda, detalhes do item selecionado). Ele vai para baixo do conteúdo quando não há espaço — nada essencial deve depender dele estar ao lado.',
              en: 'Use the aside for supporting information (summary, help, details of the selected item). It moves below the content when space runs out — nothing essential should depend on it being alongside.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'header', en: 'header' }, description: { pt: 'Topo da página (<header>), fixo durante a rolagem por padrão. Com um AppHeader, o próprio AppHeader é o landmark.', en: 'Top of the page (<header>), sticky by default. With an AppHeader, the AppHeader itself is the landmark.' } },
            { term: { pt: 'navigation', en: 'navigation' }, description: { pt: 'Barra lateral (<nav aria-label>) fixa a partir do ponto de quebra, recolhível para um trilho de 4rem. Abaixo dele, vai para um Drawer à esquerda.', en: 'Sidebar (<nav aria-label>) persistent from the breakpoint up, collapsible to a 4rem rail. Below it, it moves to a left Drawer.' } },
            { term: { pt: 'children', en: 'children' }, description: { pt: 'Conteúdo principal em <main id tabIndex={-1}>, destino do SkipLink.', en: 'Main content in <main id tabIndex={-1}>, the SkipLink target.' } },
            { term: { pt: 'aside', en: 'aside' }, description: { pt: 'Painel complementar (<aside aria-label>) de 20rem ao lado do conteúdo enquanto o conteúdo tiver ≥ 60% da largura; senão, empilha abaixo.', en: 'Complementary 20rem panel (<aside aria-label>) next to the content while the content keeps ≥ 60% of the width; otherwise it stacks below.' } },
            { term: { pt: 'footer', en: 'footer' }, description: { pt: 'Rodapé (<footer>) sob o conteúdo — por exemplo, um Footer.', en: 'Footer (<footer>) under the content — for example, a Footer.' } },
            { term: { pt: 'AppShellNavToggle', en: 'AppShellNavToggle' }, description: { pt: 'Botão de ícone com aria-expanded e aria-controls que abre o painel ou recolhe a barra.', en: 'Icon button with aria-expanded and aria-controls that opens the panel or collapses the bar.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Callout title={{ pt: 'Prévias contidas', en: 'Contained previews' }}>
          <T
            pt={
              <>
                Nas prévias, o AppShell fica em uma caixa de altura fixa com <Code>fullHeight={'{false}'}</Code>: ele
                ocupa o pai e rola o conteúdo por dentro. Em um app, use o padrão (<Code>fullHeight</Code>): altura
                mínima da tela, rolagem da página, cabeçalho e barra fixos. O ponto de quebra é o da tela: em telas
                menores que 1024px (768px no exemplo de configurações) a navegação vai para o painel.
              </>
            }
            en={
              <>
                In previews, AppShell sits in a fixed-height box with <Code>fullHeight={'{false}'}</Code>: it fills the
                parent and scrolls its content inside. In an app, use the default (<Code>fullHeight</Code>): at least
                the screen height, page scrolling, sticky header and sidebar. The breakpoint is the screen's: below
                1024px (768px in the settings example) the navigation moves to the panel.
              </>
            }
          />
        </Callout>
        <Example
          title={{ pt: 'Admin de pedidos', en: 'Orders admin' }}
          description={{
            pt: 'AppHeader com o botão de navegação, SideNav, PageHeader e um resumo no aside (que empilha abaixo da lista quando falta largura).',
            en: 'AppHeader with the navigation toggle, SideNav, PageHeader and a summary in the aside (which stacks below the list when width runs out).',
          }}
          code={OrdersCode}
          align="stretch"
        >
          <Orders />
        </Example>
        <Example
          title={{ pt: 'Barra recolhível (controlada)', en: 'Collapsible bar (controlled)' }}
          description={{
            pt: 'navCollapsed + onNavCollapsedChange. O botão do cabeçalho e o "Recolher menu lateral" do SideNav comandam o mesmo estado; recolhida, os rótulos aparecem como dicas no hover/foco.',
            en: 'navCollapsed + onNavCollapsedChange. The header button and the SideNav "Collapse sidebar" button drive the same state; when collapsed, labels show as hints on hover/focus.',
          }}
          code={CollapsibleCode}
          align="stretch"
        >
          <Collapsible />
        </Example>
        <Example
          title={{ pt: 'Área de configurações', en: 'Settings area' }}
          description={{
            pt: 'Cabeçalho próprio com useAppShell(): o botão de menu só aparece quando a navegação vai para o painel (navDrawerBelow="md"). Footer no rodapé.',
            en: 'Custom header with useAppShell(): the menu button only shows when the navigation moves to the panel (navDrawerBelow="md"). Footer at the bottom.',
          }}
          code={SettingsCode}
          align="stretch"
        >
          <Settings />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T
            pt="Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: a troca de estado fica instantânea e continua indicada pelo layout e pelo aria-expanded."
            en="Durations and curves come from the motion tokens and drop to zero with prefers-reduced-motion: state changes become instant and are still conveyed by the layout and aria-expanded."
          />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Recolher / expandir a barra', en: 'Collapsing / expanding the bar' }, description: { pt: 'A trilha da grade anima de 17.5rem para 4rem (grid-template-columns) em --or-duration-slow (400ms), --or-ease-in-out — sem animar width no conteúdo. Os rótulos do SideNav voltam deslizando 4px.', en: 'The grid track animates from 17.5rem to 4rem (grid-template-columns) over --or-duration-slow (400ms), --or-ease-in-out — no width animation on the content. SideNav labels slide back in 4px.' } },
            { term: { pt: 'Botão de recolher', en: 'Collapse button' }, description: { pt: 'Os chevrons giram 180° junto com a barra (mesma duração e curva).', en: 'The chevrons rotate 180° along with the bar (same duration and curve).' } },
            { term: { pt: 'Abrir o painel (telas estreitas)', en: 'Opening the panel (narrow screens)' }, description: { pt: 'O Drawer desliza da esquerda em --or-duration-medium (250ms), --or-ease-out, com fade no fundo; fecha em --or-duration-fast (160ms), --or-ease-in-out.', en: 'The Drawer slides in from the left over --or-duration-medium (250ms), --or-ease-out, with a backdrop fade; it closes over --or-duration-fast (160ms), --or-ease-in-out.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Recolher e abrir são instantâneos.', en: 'Collapsing and opening are instant.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'AppShell', en: 'AppShell' }}
          rows={[
            { name: 'header', type: 'ReactNode', description: { pt: 'Topo da página (normalmente um AppHeader).', en: 'Top of the page (usually an AppHeader).' } },
            { name: 'navigation', type: 'ReactNode | ({ collapsed, compact }) => ReactNode', description: { pt: 'Navegação lateral (normalmente um SideNav, que segue o estado recolhido).', en: 'Side navigation (usually a SideNav, which follows the collapsed state).' } },
            { name: 'aside', type: 'ReactNode', description: { pt: 'Painel complementar à direita.', en: 'Complementary panel on the right.' } },
            { name: 'footer', type: 'ReactNode', description: { pt: 'Rodapé (por exemplo, um Footer).', en: 'Footer (for example, a Footer).' } },
            { name: 'children', type: 'ReactNode', description: { pt: 'Conteúdo do <main>.', en: '<main> content.' } },
            { name: 'navLabel', type: 'string', default: "'Navegação principal'", description: { pt: 'Nome do landmark de navegação.', en: 'Navigation landmark name.' } },
            { name: 'asideLabel', type: 'string', default: "'Painel lateral'", description: { pt: 'Nome do landmark complementar.', en: 'Complementary landmark name.' } },
            { name: 'navTitle', type: 'ReactNode', default: "'Menu'", description: { pt: 'Título do painel em telas estreitas.', en: 'Panel title on narrow screens.' } },
            { name: 'navDrawerBelow', type: "'md' | 'lg'", default: "'lg'", description: { pt: 'Abaixo de 768px (md) ou 1024px (lg) a navegação vai para um painel; a partir daí, a barra fica fixa ao lado do conteúdo.', en: 'Below 768px (md) or 1024px (lg) the navigation moves to a panel; from there up, the bar stays next to the content.' } },
            { name: 'navCollapsed', type: 'boolean', description: { pt: 'Barra recolhida (controlado).', en: 'Collapsed bar (controlled).' } },
            { name: 'defaultNavCollapsed', type: 'boolean', default: 'false', description: { pt: 'Barra recolhida inicialmente.', en: 'Initially collapsed bar.' } },
            { name: 'onNavCollapsedChange', type: '(collapsed: boolean) => void', description: { pt: 'Chamado ao recolher/expandir.', en: 'Called on collapse/expand.' } },
            { name: 'navOpen', type: 'boolean', description: { pt: 'Painel aberto em telas estreitas (controlado).', en: 'Panel open on narrow screens (controlled).' } },
            { name: 'defaultNavOpen', type: 'boolean', default: 'false', description: { pt: 'Painel aberto inicialmente.', en: 'Initially open panel.' } },
            { name: 'onNavOpenChange', type: '(open: boolean) => void', description: { pt: 'Chamado ao abrir/fechar o painel.', en: 'Called when the panel opens/closes.' } },
            { name: 'mainId', type: 'string', description: { pt: 'id do <main> (destino do SkipLink). Padrão: gerado.', en: '<main> id (SkipLink target). Default: generated.' } },
            { name: 'mainElement', type: "'main' | 'div'", default: "'main'", description: { pt: <>Elemento da área principal. Use <Code>'div'</Code> quando o AppShell vive dentro de uma aplicação que já tem o seu <Code>&lt;main&gt;</Code> (micro-frontends, prévias): a página só pode ter um landmark principal. Os exemplos desta página usam <Code>'div'</Code> por isso.</>, en: <>Element for the main area. Use <Code>'div'</Code> when the AppShell lives inside an app that already has its own <Code>&lt;main&gt;</Code> (micro-frontends, previews): a page can only have one main landmark. The examples on this page use <Code>'div'</Code> for that reason.</> } },
            { name: 'skipLink', type: 'boolean', default: 'true', description: { pt: 'Renderiza o SkipLink como primeiro foco da página.', en: 'Renders the SkipLink as the first focus stop.' } },
            { name: 'skipLinkLabel', type: 'ReactNode', default: "'Pular para o conteúdo principal'", description: { pt: 'Texto do SkipLink.', en: 'SkipLink text.' } },
            { name: 'stickyHeader', type: 'boolean', default: 'true', description: { pt: 'Cabeçalho fixo no topo durante a rolagem.', en: 'Header sticks to the top while scrolling.' } },
            { name: 'stickyNav', type: 'boolean', default: 'true', description: { pt: 'Barra lateral com a altura da tela e rolagem própria.', en: 'Sidebar with the screen height and its own scrolling.' } },
            { name: 'fullHeight', type: 'boolean', default: 'true', description: { pt: 'false: ocupa a altura do pai e rola o conteúdo por dentro.', en: 'false: fills the parent height and scrolls the content inside.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'AppShellNavToggle', en: 'AppShellNavToggle' }}
          rows={[
            { name: 'label', type: 'string', description: { pt: "Nome acessível. Padrão: 'Abrir navegação' (telas estreitas) ou 'Recolher/Expandir menu lateral' (telas largas).", en: "Accessible name. Default: 'Open navigation' (narrow screens) or 'Collapse/Expand sidebar' (wide screens)." } },
            { name: 'icon', type: 'IconName | ReactElement', description: { pt: 'Ícone. Padrão: menu ou chevrons.', en: 'Icon. Default: menu or chevrons.' } },
            { name: '...rest', type: 'IconButtonProps', description: { pt: 'variant, size e atributos de <button>.', en: 'variant, size and <button> attributes.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'useAppShell()', en: 'useAppShell()' }}
          rows={[
            { name: 'isCompact', type: 'boolean', description: { pt: 'Abaixo do ponto de quebra (navegação no painel).', en: 'Below the breakpoint (navigation in the panel).' } },
            { name: 'navOpen / setNavOpen', type: 'boolean / (open) => void', description: { pt: 'Painel aberto.', en: 'Panel open.' } },
            { name: 'navCollapsed / setNavCollapsed', type: 'boolean / (collapsed) => void', description: { pt: 'Barra recolhida.', en: 'Bar collapsed.' } },
            { name: 'toggleNav', type: '() => void', description: { pt: 'Abre/fecha o painel ou recolhe/expande a barra, conforme a tela.', en: 'Opens/closes the panel or collapses/expands the bar, depending on the screen.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O primeiro foco da página é o SkipLink, que leva ao <Code>&lt;main&gt;</Code> (focável com{' '}
                <Code>tabIndex={'{-1}'}</Code>). A navegação é um <Code>&lt;nav&gt;</Code> nomeado e o aside, um{' '}
                <Code>&lt;aside&gt;</Code> nomeado. Em telas estreitas, o painel é o Drawer do Orange: diálogo modal
                com título, foco preso, Escape e foco de volta ao botão. Escolher um link fecha o painel.
              </>
            }
            en={
              <>
                The first focus stop is the SkipLink, which leads to <Code>&lt;main&gt;</Code> (focusable with{' '}
                <Code>tabIndex={'{-1}'}</Code>). The navigation is a named <Code>&lt;nav&gt;</Code> and the aside a named{' '}
                <Code>&lt;aside&gt;</Code>. On narrow screens, the panel is Orange's Drawer: a modal dialog with a
                title, trapped focus, Escape and focus returning to the button. Choosing a link closes the panel.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'O primeiro Tab mostra o "Pular para o conteúdo principal".', en: 'The first Tab reveals "Skip to main content".' } },
            { keys: ['Enter'], description: { pt: 'No SkipLink, move o foco para o conteúdo. No botão de navegação, abre o painel ou recolhe a barra.', en: 'On the SkipLink, moves focus to the content. On the navigation button, opens the panel or collapses the bar.' } },
            { keys: ['Space'], description: { pt: 'Ativa o botão de navegação.', en: 'Activates the navigation button.' } },
            { keys: ['Esc'], description: { pt: 'Fecha o painel e devolve o foco ao botão.', en: 'Closes the panel and returns focus to the button.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Landmarks header, nav, main, aside e footer, sem duplicar os de AppHeader, SideNav e Footer.', en: 'header, nav, main, aside and footer landmarks, without duplicating those of AppHeader, SideNav and Footer.' } },
            { criterion: '2.4.1', description: { pt: 'SkipLink para o conteúdo principal.', en: 'SkipLink to the main content.' } },
            { criterion: '4.1.2', description: { pt: <>Botão com nome, <Code>aria-expanded</Code> e <Code>aria-controls</Code>; o painel é um diálogo nomeado.</>, en: <>Button with a name, <Code>aria-expanded</Code> and <Code>aria-controls</Code>; the panel is a named dialog.</> } },
            { criterion: '1.4.10', description: { pt: 'Em 320–390px a barra vai para o painel e o aside empilha: sem rolagem horizontal.', en: 'At 320–390px the bar moves to the panel and the aside stacks: no horizontal scrolling.' } },
            { criterion: '2.3.3', description: { pt: 'Animações zeradas com prefers-reduced-motion.', en: 'Animations are disabled with prefers-reduced-motion.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
