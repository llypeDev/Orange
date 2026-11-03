import {
  Bullets,
  Code,
  ComponentPage,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { BottomNavigation, Icon } from '@orange/ui'
import Badges from './examples/Badges'
import BadgesCode from './examples/Badges?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Fixed from './examples/Fixed'
import FixedCode from './examples/Fixed?raw'
import WithRouter from './examples/WithRouter'
import WithRouterCode from './examples/WithRouter?raw'
import { meta } from './meta'

export default function BottomNavigationPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use de 3 a 5 destinos de mesmo nível, os mais usados do app. Ações (como "Novo pedido") não são destinos — use um botão.',
              en: 'Use 3 to 5 peer destinations, the most used in the app. Actions (such as "New order") are not destinations — use a button.',
            },
            {
              pt: 'Rótulos sempre visíveis, com uma palavra. Ícone sozinho não é suficiente.',
              en: 'Labels always visible, one word each. An icon alone is not enough.',
            },
            {
              pt: 'Mostre a barra apenas em telas pequenas; em telas largas, a mesma navegação vai para o AppHeader ou o SideNav.',
              en: 'Show the bar only on small screens; on wide screens, the same navigation moves to the AppHeader or SideNav.',
            },
            {
              pt: (
                <>
                  Badges numéricos precisam de <Code>badgeLabel</Code> ("12 não lidas"); o ponto sozinho não diz nada a leitores de tela.
                </>
              ),
              en: (
                <>
                  Numeric badges need a <Code>badgeLabel</Code> ("12 unread"); a dot alone says nothing to screen readers.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <div style={{ width: '100%' }}>
              <BottomNavigation
                aria-label="Exemplo correto"
                defaultValue="a"
                items={[
                  { value: 'a', label: 'Início', icon: <Icon name="home" /> },
                  { value: 'b', label: 'Buscar', icon: <Icon name="search" /> },
                  { value: 'c', label: 'Conta', icon: <Icon name="user" /> },
                ]}
              />
            </div>
          }
          dontExample={
            <div style={{ width: '100%' }}>
              <BottomNavigation
                aria-label="Exemplo incorreto"
                defaultValue="a"
                items={[
                  { value: 'a', label: 'Início', icon: <Icon name="home" /> },
                  { value: 'b', label: 'Novo', icon: <Icon name="plus" /> },
                  { value: 'c', label: 'Sair', icon: <Icon name="log-out" /> },
                ]}
              />
            </div>
          }
          doItems={[{ pt: 'Destinos de mesmo nível.', en: 'Peer destinations.' }]}
          dontItems={[{ pt: 'Misturar destinos com ações como "Novo" e "Sair".', en: 'Mixing destinations with actions such as "New" and "Log out".' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Sem href, os itens são botões controlados por value/onChange — útil para telas dentro do mesmo app.',
            en: 'Without href, items are buttons driven by value/onChange — useful for screens within the same app.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Com badges', en: 'With badges' }}
          description={{
            pt: 'badge mostra um contador (ou ponto com true) sobre o ícone; badgeLabel é o texto anunciado.',
            en: 'badge shows a counter (or a dot with true) over the icon; badgeLabel is the announced text.',
          }}
          code={BadgesCode}
        >
          <Badges />
        </Example>
        <Example
          title={{ pt: 'Com roteador', en: 'With a router' }}
          description={{
            pt: 'Com href, os itens são links; renderLink usa o link do roteador e value pode ser a rota atual.',
            en: 'With href, items are links; renderLink uses the router link and value can be the current route.',
          }}
          code={WithRouterCode}
        >
          <WithRouter />
        </Example>
        <Example
          title={{ pt: 'Fixa no rodapé', en: 'Fixed to the bottom' }}
          description={{
            pt: 'No layout real, use fixed e reserve espaço no fim do conteúdo.',
            en: 'In the real layout, use fixed and reserve space at the end of the content.',
          }}
          code={FixedCode}
        >
          <Fixed />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'BottomNavigation', en: 'BottomNavigation' }}
          rows={[
            { name: 'items', type: 'BottomNavigationItem[]', required: true, description: { pt: 'De 3 a 5 destinos.', en: '3 to 5 destinations.' } },
            { name: 'value', type: 'string', description: { pt: 'Destino ativo (controlado).', en: 'Active destination (controlled).' } },
            { name: 'defaultValue', type: 'string', description: { pt: 'Destino ativo inicial.', en: 'Initial active destination.' } },
            { name: 'onChange', type: '(value: string) => void', description: { pt: 'Chamado ao escolher um destino.', en: 'Called when a destination is chosen.' } },
            { name: 'fixed', type: 'boolean', default: 'false', description: { pt: 'Prende a barra ao rodapé da janela.', en: 'Pins the bar to the bottom of the window.' } },
            { name: 'renderLink', type: '(props: RenderLinkProps) => ReactNode', description: { pt: 'Link do roteador para itens com href.', en: 'Router link for items with href.' } },
            { name: 'aria-label', type: 'string', default: "t('mainNavigation')", description: { pt: 'Nome da navegação.', en: 'Navigation name.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'BottomNavigationItem', en: 'BottomNavigationItem' }}
          rows={[
            { name: 'value', type: 'string', required: true, description: { pt: 'Identificador.', en: 'Identifier.' } },
            { name: 'label', type: 'string', required: true, description: { pt: 'Rótulo visível.', en: 'Visible label.' } },
            { name: 'icon', type: 'ReactNode', required: true, description: { pt: 'Ícone decorativo.', en: 'Decorative icon.' } },
            { name: 'href', type: 'string', description: { pt: 'Transforma o item em link.', en: 'Turns the item into a link.' } },
            { name: 'badge', type: 'number | boolean', description: { pt: 'Contador ou ponto.', en: 'Counter or dot.' } },
            { name: 'badgeLabel', type: 'string', description: { pt: 'Texto do badge para leitores de tela.', en: 'Badge text for screen readers.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Uma <Code>&lt;nav&gt;</Code> rotulada com uma lista de links (ou botões). O destino ativo tem <Code>aria-current="page"</Code>, ícone laranja e indicador no topo. Ícones são decorativos; o rótulo visível é o nome acessível, complementado pelo texto do badge.</>}
            en={<>A labelled <Code>&lt;nav&gt;</Code> with a list of links (or buttons). The active destination has <Code>aria-current="page"</Code>, an orange icon and a top indicator. Icons are decorative; the visible label is the accessible name, complemented by the badge text.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre os destinos.', en: 'Moves through the destinations.' } },
            { keys: ['Enter'], description: { pt: 'Abre o destino.', en: 'Opens the destination.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.1', description: { pt: 'Destino ativo indicado por barra e cor do ícone, não só pela cor do texto.', en: 'Active destination indicated by a bar and icon color, not only text color.' } },
            { criterion: '2.5.8', description: { pt: 'Alvos de toque com 56px de altura.', en: '56px tall touch targets.' } },
            { criterion: '2.4.6', description: { pt: 'Rótulos visíveis e descritivos.', en: 'Visible, descriptive labels.' } },
            { criterion: '4.1.2', description: { pt: 'Destino atual exposto com aria-current="page".', en: 'Current destination exposed with aria-current="page".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
