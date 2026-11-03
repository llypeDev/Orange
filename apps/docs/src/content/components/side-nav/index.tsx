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
import Collapsible from './examples/Collapsible'
import CollapsibleCode from './examples/Collapsible?raw'
import Dashboard from './examples/Dashboard'
import DashboardCode from './examples/Dashboard?raw'
import WithRouter from './examples/WithRouter'
import WithRouterCode from './examples/WithRouter?raw'
import { meta } from './meta'

export default function SideNavPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use em aplicações com muitas áreas (painéis, ferramentas internas). Sites com até 5 seções ficam melhor com o AppHeader.',
              en: 'Use it in apps with many areas (dashboards, internal tools). Sites with up to 5 sections are better served by the AppHeader.',
            },
            {
              pt: 'Ordene por frequência de uso e agrupe por tarefa. Evite mais de dois níveis: o terceiro nível cabe melhor em abas dentro da página.',
              en: 'Order by frequency of use and group by task. Avoid more than two levels: a third level fits better as tabs within the page.',
            },
            {
              pt: 'Todo item de primeiro nível precisa de ícone se o modo recolhido for usado — sem ele, aparece apenas a inicial.',
              en: 'Every top-level item needs an icon if the collapsed mode is used — without one, only the initial shows.',
            },
            {
              pt: (
                <>
                  Informe <Code>currentHref</Code> com a rota atual: o item correspondente ganha <Code>aria-current="page"</Code> e o
                  grupo dele abre sozinho.
                </>
              ),
              en: (
                <>
                  Pass the current route in <Code>currentHref</Code>: the matching item gets <Code>aria-current="page"</Code> and its group
                  opens on its own.
                </>
              ),
            },
            {
              pt: 'Em telas pequenas, esconda o SideNav e ofereça a navegação no menu do AppHeader ou na BottomNavigation.',
              en: 'On small screens, hide the SideNav and offer navigation in the AppHeader menu or the BottomNavigation.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'SideNav', en: 'SideNav' }, description: { pt: 'A <nav> com cabeçalho, lista rolável e rodapé.', en: 'The <nav> with header, scrollable list and footer.' } },
            { term: { pt: 'SideNavItem', en: 'SideNavItem' }, description: { pt: 'Destino (link) ou ação (botão), com ícone e badge opcionais.', en: 'Destination (link) or action (button), with optional icon and badge.' } },
            { term: { pt: 'SideNavGroup', en: 'SideNavGroup' }, description: { pt: 'Botão que abre/fecha uma sublista.', en: 'Button that opens/closes a sublist.' } },
            { term: { pt: 'SideNavSection', en: 'SideNavSection' }, description: { pt: 'Título em caixa alta que rotula um bloco de itens.', en: 'Uppercase title that labels a block of items.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Painel da aplicação', en: 'App dashboard' }}
          description={{
            pt: 'Cabeçalho, itens com badge, grupos, seção, item desabilitado e rodapé com o perfil. Clique nos itens para trocar a página atual.',
            en: 'Header, items with badge, groups, section, disabled item and a profile footer. Click items to change the current page.',
          }}
          code={DashboardCode}
          align="stretch"
        >
          <Dashboard />
        </Example>
        <Example
          title={{ pt: 'Recolhível', en: 'Collapsible' }}
          description={{
            pt: 'collapsible adiciona o botão de recolher. No modo recolhido, rótulos viram dicas (e seguem no nome acessível) e grupos abrem em painel — Escape fecha.',
            en: 'collapsible adds the collapse button. When collapsed, labels become hints (and remain the accessible name) and groups open in a panel — Escape closes it.',
          }}
          code={CollapsibleCode}
          align="stretch"
        >
          <Collapsible />
        </Example>
        <Example
          title={{ pt: 'Com roteador', en: 'With a router' }}
          description={{
            pt: 'renderLink troca o <a> pelo link do roteador; currentHref vem da rota atual.',
            en: 'renderLink swaps the <a> for the router link; currentHref comes from the current route.',
          }}
          code={WithRouterCode}
          align="stretch"
        >
          <WithRouter />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'SideNav', en: 'SideNav' }}
          rows={[
            { name: 'collapsed', type: 'boolean', description: { pt: 'Modo só com ícones (controlado).', en: 'Icon-only mode (controlled).' } },
            { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: { pt: 'Estado recolhido inicial.', en: 'Initial collapsed state.' } },
            { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: { pt: 'Chamado pelo botão de recolher.', en: 'Called by the collapse button.' } },
            { name: 'collapsible', type: 'boolean', default: 'false', description: { pt: 'Mostra o botão de recolher no rodapé.', en: 'Shows the collapse button in the footer.' } },
            { name: 'currentHref', type: 'string', description: { pt: 'Rota atual; marca o item correspondente.', en: 'Current route; marks the matching item.' } },
            { name: 'renderLink', type: '(props: RenderLinkProps) => ReactNode', description: { pt: 'Link do roteador.', en: 'Router link.' } },
            { name: 'header', type: 'ReactNode | ({ collapsed }) => ReactNode', description: { pt: 'Área superior.', en: 'Top area.' } },
            { name: 'footer', type: 'ReactNode | ({ collapsed }) => ReactNode', description: { pt: 'Área inferior.', en: 'Bottom area.' } },
            { name: 'aria-label', type: 'string', default: "t('mainNavigation')", description: { pt: 'Nome da navegação.', en: 'Navigation name.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'SideNavItem', en: 'SideNavItem' }}
          rows={[
            { name: 'href', type: 'string', description: { pt: 'Destino; sem ele, o item é um botão.', en: 'Destination; without it, the item is a button.' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone decorativo.', en: 'Decorative icon.' } },
            { name: 'badge', type: 'ReactNode', description: { pt: 'Contador à direita (ponto no modo recolhido).', en: 'Counter on the right (dot when collapsed).' } },
            { name: 'active', type: 'boolean', description: { pt: 'Força o estado atual.', en: 'Forces the current state.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita o item.', en: 'Disables the item.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'SideNavGroup e SideNavSection', en: 'SideNavGroup and SideNavSection' }}
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: { pt: 'Grupo: rótulo do botão.', en: 'Group: button label.' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Grupo: ícone decorativo.', en: 'Group: decorative icon.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Grupo: estado aberto. Padrão: aberto se contém o item atual.', en: 'Group: open state. Default: open if it contains the current item.' } },
            { name: 'title', type: 'ReactNode', required: true, description: { pt: 'Seção: título que rotula a lista.', en: 'Section: title that labels the list.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Uma <Code>&lt;nav&gt;</Code> rotulada com listas de links. O item atual tem <Code>aria-current="page"</Code>; grupos seguem o padrão <strong>Disclosure</strong> do APG (<Code>aria-expanded</Code> e <Code>aria-controls</Code>); seções nomeiam suas listas com <Code>aria-labelledby</Code>. No modo recolhido, o texto do rótulo continua no DOM — só a apresentação muda —, então leitores de tela anunciam os mesmos nomes.</>}
            en={<>A labelled <Code>&lt;nav&gt;</Code> with lists of links. The current item has <Code>aria-current="page"</Code>; groups follow the APG <strong>Disclosure</strong> pattern (<Code>aria-expanded</Code> and <Code>aria-controls</Code>); sections name their lists with <Code>aria-labelledby</Code>. In collapsed mode, label text stays in the DOM — only its presentation changes — so screen readers announce the same names.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre itens e grupos na ordem visual.', en: 'Moves through items and groups in visual order.' } },
            { keys: ['Enter'], description: { pt: 'Segue o link ou abre/fecha o grupo.', en: 'Follows the link or opens/closes the group.' } },
            { keys: ['Space'], description: { pt: 'Abre/fecha o grupo.', en: 'Opens/closes the group.' } },
            { keys: ['Esc'], description: { pt: 'Modo recolhido: fecha o painel do grupo e devolve o foco ao botão.', en: 'Collapsed mode: closes the group panel and returns focus to its button.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Estrutura de listas aninhadas e seções rotuladas.', en: 'Nested list structure and labelled sections.' } },
            { criterion: '1.4.1', description: { pt: 'Item atual com barra, fundo e ícone laranjas, não só cor do texto.', en: 'Current item with bar, background and orange icon, not only text color.' } },
            { criterion: '1.4.13', description: { pt: 'Dicas do modo recolhido aparecem no hover e no foco, sem bloquear o conteúdo.', en: 'Collapsed-mode hints show on hover and focus without blocking content.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível dentro de cada item.', en: 'Visible focus inside each item.' } },
            { criterion: '4.1.2', description: { pt: 'Estado de grupos com aria-expanded; item atual com aria-current.', en: 'Group state with aria-expanded; current item with aria-current.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
