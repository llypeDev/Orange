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
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import HideOnScroll from './examples/HideOnScroll'
import HideOnScrollCode from './examples/HideOnScroll?raw'
import Mobile from './examples/Mobile'
import MobileCode from './examples/Mobile?raw'
import Sticky from './examples/Sticky'
import StickyCode from './examples/Sticky?raw'
import WithRouter from './examples/WithRouter'
import WithRouterCode from './examples/WithRouter?raw'
import { meta } from './meta'

export default function AppHeaderPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use um único AppHeader por página, no topo, fora do <main>. Ele vira o landmark "banner".',
              en: 'Use a single AppHeader per page, at the top, outside <main>. It becomes the "banner" landmark.',
            },
            {
              pt: 'Até 5 ou 6 destinos de primeiro nível. Com mais áreas, combine com um SideNav.',
              en: 'Up to 5 or 6 top-level destinations. With more areas, combine it with a SideNav.',
            },
            {
              pt: 'A marca leva à página inicial; dê a ela um nome acessível que diga isso ("Orange — início").',
              en: 'The brand leads to the home page; give it an accessible name that says so ("Orange — home").',
            },
            {
              pt: (
                <>
                  Ações só com ícone (busca, notificações) precisam de <Code>aria-label</Code>. Mantenha no máximo três.
                </>
              ),
              en: (
                <>
                  Icon-only actions (search, notifications) need an <Code>aria-label</Code>. Keep at most three.
                </>
              ),
            },
            {
              pt: (
                <>
                  Ajuste <Code>collapseBelow</Code> ao número de itens: quanto mais itens, mais cedo a navegação deve ir para o menu.
                </>
              ),
              en: (
                <>
                  Tune <Code>collapseBelow</Code> to the number of items: the more items, the sooner navigation should move to the menu.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Marca', en: 'Brand' }, description: { pt: 'Logo com link para o início (brand).', en: 'Logo linking home (brand).' } },
            { term: { pt: 'Navegação', en: 'Navigation' }, description: { pt: 'Links principais; o atual ganha o sublinhado laranja (items, currentHref).', en: 'Main links; the current one gets the orange underline (items, currentHref).' } },
            { term: { pt: 'Ações', en: 'Actions' }, description: { pt: 'Busca, notificações, perfil (actions).', en: 'Search, notifications, profile (actions).' } },
            { term: { pt: 'Botão de menu', en: 'Menu button' }, description: { pt: <>Em telas estreitas, abre o painel com a navegação (<Code>aria-expanded</Code>).</>, en: <>On narrow screens, opens the panel with the navigation (<Code>aria-expanded</Code>).</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Aplicação', en: 'Application' }}
          description={{
            pt: 'Marca, navegação e ações. Aqui collapseBelow="sm" mantém a navegação em linha na largura da prévia.',
            en: 'Brand, navigation and actions. Here collapseBelow="sm" keeps the navigation inline at the preview width.',
          }}
          code={BasicCode}
          align="stretch"
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Em telas pequenas', en: 'On small screens' }}
          description={{
            pt: 'A largura é medida no próprio cabeçalho (container query). O painel fecha com Esc, com clique fora ou ao escolher um link; menuFooter adiciona ações no fim.',
            en: 'Width is measured on the header itself (container query). The panel closes with Esc, an outside click or when a link is chosen; menuFooter adds actions at the end.',
          }}
          code={MobileCode}
        >
          <Mobile />
        </Example>
        <Example
          title={{ pt: 'Fixo no topo', en: 'Sticky' }}
          description={{
            pt: 'sticky mantém o cabeçalho visível durante a rolagem, com fundo levemente translúcido.',
            en: 'sticky keeps the header visible while scrolling, with a slightly translucent background.',
          }}
          code={StickyCode}
          align="stretch"
        >
          <Sticky />
        </Example>
        <Example
          title={{ pt: 'Esconder ao rolar', en: 'Hide on scroll' }}
          description={{
            pt: 'hideOnScroll esconde o cabeçalho ao rolar para baixo (translateY, 250ms) e o traz de volta ao rolar para cima — nunca com foco dentro dele ou com o menu aberto.',
            en: 'hideOnScroll hides the header when scrolling down (translateY, 250ms) and brings it back when scrolling up — never with focus inside it or the menu open.',
          }}
          code={HideOnScrollCode}
        >
          <HideOnScroll />
        </Example>
        <Example
          title={{ pt: 'Com roteador', en: 'With a router' }}
          description={{
            pt: 'renderLink usa o link do roteador; currentHref vem da rota atual.',
            en: 'renderLink uses the router link; currentHref comes from the current route.',
          }}
          code={WithRouterCode}
          align="stretch"
        >
          <WithRouter />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T pt='Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.' en='Durations and curves come from the motion tokens and drop to zero with prefers-reduced-motion: state is still conveyed by color, border or text.' />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover / foco em um link', en: 'Hover / focus on a link' }, description: { pt: 'Sublinhado de 2px cresce da esquerda (scaleX) — medium, ease-out. Na página atual ele fica laranja.', en: 'A 2px underline grows from the left (scaleX) — medium, ease-out. On the current page it stays orange.' } },
            { term: { pt: 'Rolar com hideOnScroll', en: 'Scrolling with hideOnScroll' }, description: { pt: 'Ao rolar para baixo, o cabeçalho sobe (translateY(-110%)); ao subir, volta — medium (250ms), ease-in-out. Nunca some com foco dentro ou com o menu aberto.', en: 'Scrolling down slides the header up (translateY(-110%)); scrolling up brings it back — medium (250ms), ease-in-out. It never hides with focus inside or the menu open.' } },
            { term: { pt: 'Abrir o menu (telas pequenas)', en: 'Opening the menu (small screens)' }, description: { pt: 'O painel desce com fade (medium, ease-out) e os itens entram em cascata (40ms entre eles).', en: 'The panel drops in with a fade (medium, ease-out) and items enter staggered (40ms apart).' } },
            { term: { pt: 'Fechar o menu', en: 'Closing the menu' }, description: { pt: 'O painel sai com fade + 4px para cima — fast, ease-in-out — e só então é escondido (usePresence).', en: 'The panel exits with a fade + 4px upward — fast, ease-in-out — and only then gets hidden (usePresence).' } },
            { term: { pt: 'Botão de menu', en: 'Menu button' }, description: { pt: 'O ícone ☰/✕ entra girando com um pop (medium, ease-bounce); o botão afunda 1px ao pressionar (press).', en: 'The ☰/✕ icon spins in with a pop (medium, ease-bounce); the button sinks 1px when pressed (press).' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'brand', type: 'ReactNode', description: { pt: 'Área da marca.', en: 'Brand area.' } },
            { name: 'items', type: '{ label, href, active? }[]', description: { pt: 'Links da navegação principal.', en: 'Main navigation links.' } },
            { name: 'currentHref', type: 'string', description: { pt: 'Rota atual; marca o item correspondente.', en: 'Current route; marks the matching item.' } },
            { name: 'renderLink', type: '(props: RenderLinkProps) => ReactNode', description: { pt: 'Link do roteador.', en: 'Router link.' } },
            { name: 'actions', type: 'ReactNode', description: { pt: 'Ações à direita.', en: 'Actions on the right.' } },
            { name: 'menuFooter', type: 'ReactNode', description: { pt: 'Conteúdo no fim do painel em telas pequenas.', en: 'Content at the end of the panel on small screens.' } },
            { name: 'navLabel', type: 'string', default: "t('mainNavigation')", description: { pt: 'Nome da navegação.', en: 'Navigation name.' } },
            { name: 'sticky', type: 'boolean', default: 'false', description: { pt: 'Fixa no topo durante a rolagem.', en: 'Sticks to the top while scrolling.' } },
            { name: 'hideOnScroll', type: 'boolean', default: 'false', description: { pt: 'Esconde ao rolar para baixo e mostra ao subir (implica sticky). Nunca esconde com foco dentro ou com o menu aberto.', en: 'Hides when scrolling down and shows when scrolling up (implies sticky). Never hides with focus inside or the menu open.' } },
            { name: 'collapseBelow', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Largura (40/48/64rem) abaixo da qual a navegação vai para o menu.', en: 'Width (40/48/64rem) below which navigation moves to the menu.' } },
            { name: 'menuOpen', type: 'boolean', description: { pt: 'Menu aberto (controlado).', en: 'Menu open (controlled).' } },
            { name: 'defaultMenuOpen', type: 'boolean', default: 'false', description: { pt: 'Menu aberto inicialmente.', en: 'Menu initially open.' } },
            { name: 'onMenuOpenChange', type: '(open: boolean) => void', description: { pt: 'Chamado ao abrir/fechar o menu.', en: 'Called when the menu opens/closes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;header&gt;</Code> (landmark "banner" quando fora de <Code>&lt;main&gt;</Code>) com uma <Code>&lt;nav&gt;</Code> rotulada. O item atual tem <Code>aria-current="page"</Code>. O botão de menu segue o padrão <strong>Disclosure</strong> do APG: nome "Menu", <Code>aria-expanded</Code> e <Code>aria-controls</Code> apontando para a navegação. Esc fecha o painel e devolve o foco ao botão.</>}
            en={<>A <Code>&lt;header&gt;</Code> ("banner" landmark when outside <Code>&lt;main&gt;</Code>) with a labelled <Code>&lt;nav&gt;</Code>. The current item has <Code>aria-current="page"</Code>. The menu button follows the APG <strong>Disclosure</strong> pattern: named "Menu", with <Code>aria-expanded</Code> and <Code>aria-controls</Code> pointing to the navigation. Esc closes the panel and returns focus to the button.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre marca, botão de menu, links e ações.', en: 'Moves through brand, menu button, links and actions.' } },
            { keys: ['Enter'], description: { pt: 'Segue o link ou abre/fecha o menu.', en: 'Follows the link or opens/closes the menu.' } },
            { keys: ['Space'], description: { pt: 'Abre/fecha o menu.', en: 'Opens/closes the menu.' } },
            { keys: ['Esc'], description: { pt: 'Fecha o menu e devolve o foco ao botão.', en: 'Closes the menu and returns focus to the button.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Landmarks header e nav com rótulo.', en: 'Header and labelled nav landmarks.' } },
            { criterion: '1.4.10', description: { pt: 'Em 320px, a navegação vai para o painel sem rolagem horizontal.', en: 'At 320px, navigation moves to the panel without horizontal scrolling.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível em todos os controles.', en: 'Visible focus on every control.' } },
            { criterion: '4.1.2', description: { pt: 'Estado do menu com aria-expanded; página atual com aria-current.', en: 'Menu state with aria-expanded; current page with aria-current.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
