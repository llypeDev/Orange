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
import BackLink from './examples/BackLink'
import BackLinkCode from './examples/BackLink?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Detail from './examples/Detail'
import DetailCode from './examples/Detail?raw'
import Reveal from './examples/Reveal'
import RevealCode from './examples/Reveal?raw'
import WithTabs from './examples/WithTabs'
import WithTabsCode from './examples/WithTabs?raw'
import { meta } from './meta'

export default function PageHeaderPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use um PageHeader por página, no topo do <Code>&lt;main&gt;</Code>. O título é o <Code>h1</Code> da
                  página; use <Code>headingLevel</Code> 2 ou 3 só em subpáginas dentro de outra página.
                </>
              ),
              en: (
                <>
                  Use one PageHeader per page, at the top of <Code>&lt;main&gt;</Code>. The title is the page's{' '}
                  <Code>h1</Code>; use <Code>headingLevel</Code> 2 or 3 only for subpages inside another page.
                </>
              ),
            },
            {
              pt: 'O título diz onde o usuário está ("Pedidos", "Pedido #4821") — não o que ele pode fazer. As ações ficam nos botões.',
              en: 'The title says where the user is ("Orders", "Order #4821") — not what they can do. Actions belong in the buttons.',
            },
            {
              pt: 'Até três ações, com uma só primária. Mais do que isso vai para um menu "Mais ações".',
              en: 'Up to three actions, with a single primary one. Anything beyond that goes into a "More actions" menu.',
            },
            {
              pt: 'Use a trilha (breadcrumbs) em hierarquias com três níveis ou mais; para um nível só, prefira o link de volta (back).',
              en: 'Use breadcrumbs for hierarchies three or more levels deep; for a single level, prefer the back link.',
            },
            {
              pt: 'Reserve reveal para páginas de entrada (painéis, relatórios). Em telas que o usuário visita o tempo todo, a animação cansa.',
              en: 'Reserve reveal for landing pages (dashboards, reports). On screens users visit all the time, the animation gets tiring.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Contexto', en: 'Context' }, description: { pt: 'breadcrumbs (normalmente um Breadcrumb) e/ou back — link de volta com seta.', en: 'breadcrumbs (usually a Breadcrumb) and/or back — a back link with an arrow.' } },
            { term: { pt: 'Eyebrow', en: 'Eyebrow' }, description: { pt: 'Rótulo curto em caixa alta acima do título: a área ou seção do produto.', en: 'Short uppercase label above the title: the product area or section.' } },
            { term: { pt: 'Título e meta', en: 'Title and meta' }, description: { pt: 'Heading da página (h1 por padrão) com selos de status ao lado (Tag, Badge).', en: 'Page heading (h1 by default) with status badges next to it (Tag, Badge).' } },
            { term: { pt: 'Descrição', en: 'Description' }, description: { pt: 'Uma ou duas linhas de apoio: data, responsável, resumo.', en: 'One or two supporting lines: date, owner, summary.' } },
            { term: { pt: 'Ações', en: 'Actions' }, description: { pt: 'Botões alinhados à direita; quando o título precisa de espaço (≈ 20rem), quebram para baixo dele.', en: 'Right-aligned buttons; when the title needs room (≈ 20rem), they wrap below it.' } },
            { term: { pt: 'Navegação', en: 'Navigation' }, description: { pt: 'Abas locais na base do cabeçalho; com divider, o sublinhado da aba ativa cobre a linha.', en: 'Local tabs at the bottom of the header; with divider, the active tab underline covers the line.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Lista de pedidos', en: 'Orders list' }}
          description={{ pt: 'Eyebrow, título, descrição e duas ações. Estreite a tela: as ações quebram para baixo do título.', en: 'Eyebrow, title, description and two actions. Narrow the screen: the actions wrap below the title.' }}
          code={BasicCode}
          align="stretch"
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Detalhe com trilha e status', en: 'Detail with breadcrumbs and status' }}
          description={{ pt: 'A trilha mostra a hierarquia; os selos ficam ao lado do título e quebram junto com ele.', en: 'Breadcrumbs show the hierarchy; badges sit next to the title and wrap with it.' }}
          code={DetailCode}
          align="stretch"
        >
          <Detail />
        </Example>
        <Example
          title={{ pt: 'Link de volta com roteador', en: 'Back link with a router' }}
          description={{ pt: 'back leva ao nível anterior; renderLink usa o link do seu roteador. A seta desliza 4px para trás no hover/foco.', en: 'back leads to the previous level; renderLink uses your router link. The arrow slides 4px back on hover/focus.' }}
          code={BackLinkCode}
          align="stretch"
        >
          <BackLink />
        </Example>
        <Example
          title={{ pt: 'Área de configurações com abas', en: 'Settings area with tabs' }}
          description={{ pt: 'O Tabs envolve o cabeçalho e os painéis; a TabList vai no slot navigation.', en: 'Tabs wraps the header and the panels; the TabList goes in the navigation slot.' }}
          code={WithTabsCode}
          align="stretch"
        >
          <WithTabs />
        </Example>
        <Example
          title={{ pt: 'Entrada em sequência', en: 'Staggered entrance' }}
          description={{ pt: 'Com reveal, eyebrow → título → descrição → ações sobem em sequência ao montar.', en: 'With reveal, eyebrow → title → description → actions rise in sequence on mount.' }}
          code={RevealCode}
          align="stretch"
        >
          <Reveal />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T
            pt="Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion. A revelação é opcional e só roda ao montar."
            en="Durations and curves come from the motion tokens and drop to zero with prefers-reduced-motion. The reveal is opt-in and only runs on mount."
          />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Entrada com reveal', en: 'Entrance with reveal' }, description: { pt: 'Cada parte sobe 24px (--or-distance-lg) com fade em --or-duration-reveal (600ms), --or-ease-out, 80ms (--or-stagger) depois da anterior: eyebrow → título → descrição → ações. Desligada por padrão.', en: 'Each part rises 24px (--or-distance-lg) with a fade over --or-duration-reveal (600ms), --or-ease-out, 80ms (--or-stagger) after the previous one: eyebrow → title → description → actions. Off by default.' } },
            { term: { pt: 'Link de volta', en: 'Back link' }, description: { pt: 'No hover/foco, a seta desliza 4px para a esquerda (--or-duration-medium, --or-ease-out) e o texto clareia.', en: 'On hover/focus, the arrow slides 4px left (--or-duration-medium, --or-ease-out) and the text brightens.' } },
            { term: { pt: 'Abas', en: 'Tabs' }, description: { pt: 'O sublinhado da aba ativa desliza entre as abas (comportamento do Tabs).', en: 'The active tab underline slides between tabs (Tabs behavior).' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'reveal não faz nada: o cabeçalho aparece pronto, sem deslocamento.', en: 'reveal does nothing: the header appears ready, without movement.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: { pt: 'Título da página.', en: 'Page title.' } },
            { name: 'headingLevel', type: '1 | 2 | 3', default: '1', description: { pt: 'Nível do heading do título.', en: 'Title heading level.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio abaixo do título.', en: 'Supporting text below the title.' } },
            { name: 'eyebrow', type: 'ReactNode', description: { pt: 'Rótulo em caixa alta acima do título.', en: 'Uppercase label above the title.' } },
            { name: 'breadcrumbs', type: 'ReactNode', description: { pt: <>Trilha acima do título (normalmente <Code>&lt;Breadcrumb&gt;</Code>).</>, en: <>Breadcrumbs above the title (usually <Code>&lt;Breadcrumb&gt;</Code>).</> } },
            { name: 'back', type: '{ href: string; label: string }', description: { pt: 'Link de volta com seta.', en: 'Back link with an arrow.' } },
            { name: 'renderLink', type: '(props) => ReactNode', description: { pt: 'Renderiza o link de volta com o componente do roteador.', en: 'Renders the back link with your router component.' } },
            { name: 'actions', type: 'ReactNode', description: { pt: 'Ações à direita; quebram para baixo em telas estreitas.', en: 'Right-aligned actions; wrap below on narrow screens.' } },
            { name: 'meta', type: 'ReactNode', description: { pt: 'Selos/status ao lado do título.', en: 'Badges/status next to the title.' } },
            { name: 'navigation', type: 'ReactNode', description: { pt: <>Navegação local sob o cabeçalho (normalmente uma <Code>TabList</Code>).</>, en: <>Local navigation under the header (usually a <Code>TabList</Code>).</> } },
            { name: 'divider', type: 'boolean', default: 'false', description: { pt: 'Linha de 1px na base.', en: '1px line at the bottom.' } },
            { name: 'reveal', type: 'boolean', default: 'false', description: { pt: 'Entrada em sequência ao montar (nada com movimento reduzido).', en: 'Staggered entrance on mount (nothing with reduced motion).' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos nativos da <div> raiz.', en: 'Native attributes of the root <div>.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                A raiz é uma <Code>&lt;div&gt;</Code> — não um <Code>&lt;header&gt;</Code> — para não criar um segundo
                landmark "banner" ao lado do cabeçalho da aplicação. O título é um heading real (<Code>h1</Code> por
                padrão), então a navegação por headings encontra a página. Eyebrow, título e descrição seguem a ordem
                de leitura; as ações vêm depois, na ordem do Tab.
              </>
            }
            en={
              <>
                The root is a <Code>&lt;div&gt;</Code> — not a <Code>&lt;header&gt;</Code> — so it doesn't create a
                second "banner" landmark next to the app header. The title is a real heading (<Code>h1</Code> by
                default), so heading navigation finds the page. Eyebrow, title and description follow reading order;
                actions come after, in Tab order.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre trilha, link de volta, ações e abas, nessa ordem.', en: 'Moves through breadcrumbs, back link, actions and tabs, in that order.' } },
            { keys: ['Enter'], description: { pt: 'Segue o link focado ou ativa a ação focada.', en: 'Follows the focused link or activates the focused action.' } },
            { keys: ['←', '→'], description: { pt: 'Entre as abas do slot navigation (padrão Tabs).', en: 'Between tabs in the navigation slot (Tabs pattern).' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Título como heading com nível configurável; trilha em um nav nomeado.', en: 'Title as a heading with a configurable level; breadcrumbs in a named nav.' } },
            { criterion: '2.4.6', description: { pt: 'O título descreve a página; o link de volta diz para onde leva.', en: 'The title describes the page; the back link says where it goes.' } },
            { criterion: '2.3.3', description: { pt: 'A revelação é opcional e desligada com prefers-reduced-motion.', en: 'The reveal is opt-in and turned off with prefers-reduced-motion.' } },
            { criterion: '1.4.10', description: { pt: 'Ações e selos quebram linha em 320px, sem rolagem horizontal.', en: 'Actions and badges wrap at 320px, without horizontal scrolling.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
