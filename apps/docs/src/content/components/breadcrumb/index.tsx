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
import { Breadcrumb } from '@orange/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Collapsed from './examples/Collapsed'
import CollapsedCode from './examples/Collapsed?raw'
import Separator from './examples/Separator'
import SeparatorCode from './examples/Separator?raw'
import WithRouter from './examples/WithRouter'
import WithRouterCode from './examples/WithRouter?raw'
import { meta } from './meta'

export default function BreadcrumbPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use em hierarquias com três ou mais níveis. Em sites rasos, a trilha só repete o menu.',
              en: 'Use it in hierarchies with three or more levels. On shallow sites, the trail only repeats the menu.',
            },
            {
              pt: 'A trilha mostra a hierarquia, não o histórico: "Voltar" é papel do navegador.',
              en: 'The trail shows the hierarchy, not the history: "Back" is the browser\'s job.',
            },
            {
              pt: 'Posicione-a acima do título da página e use os mesmos nomes do menu e dos títulos.',
              en: 'Place it above the page title and use the same names as the menu and titles.',
            },
            {
              pt: (
                <>
                  Em caminhos longos, use <Code>maxItems</Code>: os níveis do meio viram um botão "…" que os revela.
                </>
              ),
              en: (
                <>
                  On long paths, use <Code>maxItems</Code>: middle levels become a "…" button that reveals them.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Breadcrumb
              aria-label="Exemplo correto"
              items={[{ label: 'Início', href: '#a' }, { label: 'Pedidos', href: '#b' }, { label: 'Pedido #4821' }]}
            />
          }
          dontExample={
            <Breadcrumb
              aria-label="Exemplo incorreto"
              items={[{ label: 'Voltar', href: '#a' }, { label: 'Clique aqui', href: '#b' }, { label: 'Página' }]}
            />
          }
          doItems={[{ pt: 'Nomes reais dos níveis, terminando na página atual.', en: 'Real level names, ending at the current page.' }]}
          dontItems={[{ pt: 'Rótulos genéricos ou ações no lugar de níveis.', en: 'Generic labels or actions instead of levels.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'O último nível é a página atual: recebe aria-current="page" e não é link.',
            en: 'The last level is the current page: it gets aria-current="page" and is not a link.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Caminho longo recolhido', en: 'Collapsed long path' }}
          description={{
            pt: 'Com maxItems={4}, os níveis do meio ficam atrás do botão "…". Ao expandir, o foco vai para o primeiro nível revelado.',
            en: 'With maxItems={4}, middle levels hide behind the "…" button. When expanded, focus moves to the first revealed level.',
          }}
          code={CollapsedCode}
        >
          <Collapsed />
        </Example>
        <Example
          title={{ pt: 'Separadores e ícones', en: 'Separators and icons' }}
          description={{
            pt: 'Qualquer nó serve de separador; ele é sempre decorativo (aria-hidden).',
            en: 'Any node can be a separator; it is always decorative (aria-hidden).',
          }}
          code={SeparatorCode}
        >
          <Separator />
        </Example>
        <Example
          title={{ pt: 'Com roteador', en: 'With a router' }}
          description={{
            pt: 'renderLink recebe href, className, aria-current e children — repasse ao link do seu roteador.',
            en: 'renderLink receives href, className, aria-current and children — pass them to your router link.',
          }}
          code={WithRouterCode}
        >
          <WithRouter />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Breadcrumb', en: 'Breadcrumb' }}
          rows={[
            { name: 'items', type: '{ label, href?, icon? }[]', description: { pt: 'Níveis da trilha (alternativa a children).', en: 'Trail levels (alternative to children).' } },
            { name: 'children', type: 'BreadcrumbItem[]', description: { pt: 'Níveis como elementos.', en: 'Levels as elements.' } },
            { name: 'maxItems', type: 'number', description: { pt: 'Máximo de níveis visíveis antes de recolher.', en: 'Maximum visible levels before collapsing.' } },
            { name: 'itemsBeforeCollapse', type: 'number', default: '1', description: { pt: 'Níveis antes do "…".', en: 'Levels before the "…".' } },
            { name: 'itemsAfterCollapse', type: 'number', default: '2', description: { pt: 'Níveis depois do "…".', en: 'Levels after the "…".' } },
            { name: 'separator', type: 'ReactNode', default: "'/'", description: { pt: 'Separador decorativo.', en: 'Decorative separator.' } },
            { name: 'renderLink', type: '(props: RenderLinkProps) => ReactNode', description: { pt: 'Renderiza links com o componente do roteador.', en: 'Renders links with the router component.' } },
            { name: 'aria-label', type: 'string', default: "t('breadcrumb')", description: { pt: 'Nome da navegação.', en: 'Navigation name.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'BreadcrumbItem', en: 'BreadcrumbItem' }}
          rows={[
            { name: 'href', type: 'string', description: { pt: 'Destino; sem ele, o item é texto.', en: 'Destination; without it, the item is text.' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone decorativo.', en: 'Decorative icon.' } },
            { name: 'current', type: 'boolean', default: 'último item', description: { pt: 'Força o estado de página atual.', en: 'Forces the current page state.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Segue o padrão <strong>Breadcrumb</strong> do WAI-ARIA APG: <Code>&lt;nav aria-label="Trilha de navegação"&gt;</Code> com uma <Code>&lt;ol&gt;</Code> (leitores de tela anunciam "lista, 4 itens"), separadores com <Code>aria-hidden</Code> e o nível atual com <Code>aria-current="page"</Code>. O botão "…" tem nome acessível "Mostrar caminho completo".</>}
            en={<>Follows the WAI-ARIA APG <strong>Breadcrumb</strong> pattern: <Code>&lt;nav aria-label="Breadcrumb"&gt;</Code> with an <Code>&lt;ol&gt;</Code> (screen readers announce "list, 4 items"), separators with <Code>aria-hidden</Code> and the current level with <Code>aria-current="page"</Code>. The "…" button is named "Show full path".</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre os links da trilha e o botão "…".', en: 'Moves through the trail links and the "…" button.' } },
            { keys: ['Enter'], description: { pt: 'Segue o link ou expande os níveis recolhidos.', en: 'Follows the link or expands the collapsed levels.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Hierarquia exposta como lista ordenada dentro de uma navegação rotulada.', en: 'Hierarchy exposed as an ordered list inside a labelled navigation.' } },
            { criterion: '2.4.8', description: { pt: 'Indica a localização da página dentro do site.', en: 'Indicates the page location within the site.' } },
            { criterion: '2.5.8', description: { pt: 'Links e botão com altura mínima de 24px.', en: 'Links and button at least 24px tall.' } },
            { criterion: '4.1.2', description: { pt: 'Página atual exposta com aria-current="page".', en: 'Current page exposed with aria-current="page".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
