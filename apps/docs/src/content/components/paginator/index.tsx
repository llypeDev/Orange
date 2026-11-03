import {
  Bullets,
  Code,
  ComponentPage,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Compact from './examples/Compact'
import CompactCode from './examples/Compact?raw'
import FirstLast from './examples/FirstLast'
import FirstLastCode from './examples/FirstLast?raw'
import Links from './examples/Links'
import LinksCode from './examples/Links?raw'
import WithTable from './examples/WithTable'
import WithTableCode from './examples/WithTable?raw'
import { meta } from './meta'

export default function PaginatorPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use paginação quando a pessoa precisa voltar a um ponto específico (tabelas, resultados de busca). Para feeds, prefira "Carregar mais".',
              en: 'Use pagination when people need to return to a specific point (tables, search results). For feeds, prefer "Load more".',
            },
            {
              pt: 'Mostre quantos itens existem ("41–60 de 240") — ajuda a decidir entre paginar ou refinar a busca.',
              en: 'Show how many items exist ("41–60 of 240") — it helps people decide between paging and refining the search.',
            },
            {
              pt: 'Coloque a paginação logo abaixo do conteúdo que ela controla, alinhada à direita em tabelas.',
              en: 'Place the pagination right below the content it controls, aligned right in tables.',
            },
            {
              pt: (
                <>
                  Em espaços estreitos (cards, mobile), use <Code>variant="compact"</Code>.
                </>
              ),
              en: (
                <>
                  In narrow spaces (cards, mobile), use <Code>variant="compact"</Code>.
                </>
              ),
            },
            {
              pt: 'Ao trocar de página, leve o foco ou a rolagem ao início da lista, para que a pessoa saiba que o conteúdo mudou.',
              en: 'When the page changes, move focus or scroll to the start of the list, so people know the content changed.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Com 12 páginas, a primeira e a última ficam sempre visíveis; as demais viram reticências.',
            en: 'With 12 pages, the first and last are always visible; the rest become ellipses.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Com tabela e itens por página', en: 'With a table and page size' }}
          description={{
            pt: 'totalItems habilita o texto de intervalo; pageSizeOptions mostra um select nativo. Ao trocar o tamanho, o primeiro item continua visível.',
            en: 'totalItems enables the range text; pageSizeOptions shows a native select. When the size changes, the first item stays visible.',
          }}
          code={WithTableCode}
          align="stretch"
        >
          <WithTable />
        </Example>
        <Example
          title={{ pt: 'Compacta', en: 'Compact' }}
          description={{
            pt: '"Página 3 de 12" entre anterior e próximo; o texto é anunciado quando muda.',
            en: '"Page 3 of 12" between previous and next; the text is announced when it changes.',
          }}
          code={CompactCode}
        >
          <Compact />
        </Example>
        <Example
          title={{ pt: 'Primeira, última e vizinhas', en: 'First, last and siblings' }}
          description={{
            pt: 'showFirstLast adiciona atalhos às extremidades; siblingCount controla quantas páginas aparecem ao redor da atual.',
            en: 'showFirstLast adds shortcuts to both ends; siblingCount controls how many pages show around the current one.',
          }}
          code={FirstLastCode}
        >
          <FirstLast />
        </Example>
        <Example
          title={{ pt: 'Páginas como links', en: 'Pages as links' }}
          description={{
            pt: 'Com getPageHref, cada página tem endereço próprio (compartilhável e indexável). renderLink integra com o roteador.',
            en: 'With getPageHref, each page has its own address (shareable and indexable). renderLink integrates with the router.',
          }}
          code={LinksCode}
        >
          <Links />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'page', type: 'number', description: { pt: 'Página atual, a partir de 1 (controlado).', en: 'Current page, from 1 (controlled).' } },
            { name: 'defaultPage', type: 'number', default: '1', description: { pt: 'Página inicial (não controlado).', en: 'Initial page (uncontrolled).' } },
            { name: 'onPageChange', type: '(page: number) => void', description: { pt: 'Chamado quando a página muda.', en: 'Called when the page changes.' } },
            { name: 'totalPages', type: 'number', description: { pt: 'Total de páginas.', en: 'Total pages.' } },
            { name: 'totalItems', type: 'number', description: { pt: 'Total de itens: calcula as páginas e mostra o intervalo.', en: 'Total items: computes pages and shows the range.' } },
            { name: 'pageSize', type: 'number', description: { pt: 'Itens por página (controlado).', en: 'Items per page (controlled).' } },
            { name: 'defaultPageSize', type: 'number', default: '20', description: { pt: 'Itens por página inicial.', en: 'Initial items per page.' } },
            { name: 'onPageSizeChange', type: '(size: number) => void', description: { pt: 'Chamado ao trocar itens por página.', en: 'Called when the page size changes.' } },
            { name: 'pageSizeOptions', type: 'number[]', description: { pt: 'Opções do seletor de itens por página.', en: 'Page size selector options.' } },
            { name: 'siblingCount', type: 'number', default: '1', description: { pt: 'Páginas de cada lado da atual.', en: 'Pages on each side of the current one.' } },
            { name: 'boundaryCount', type: 'number', default: '1', description: { pt: 'Páginas fixas no início e no fim.', en: 'Fixed pages at the start and end.' } },
            { name: 'showFirstLast', type: 'boolean', default: 'false', description: { pt: 'Botões de primeira e última página.', en: 'First and last page buttons.' } },
            { name: 'variant', type: "'default' | 'compact'", default: "'default'", description: { pt: 'Lista de páginas ou "Página X de Y".', en: 'Page list or "Page X of Y".' } },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: { pt: 'Botões de 32px ou 40px.', en: '32px or 40px buttons.' } },
            { name: 'getPageHref', type: '(page: number) => string', description: { pt: 'Transforma as páginas em links.', en: 'Turns pages into links.' } },
            { name: 'renderLink', type: '(props: RenderLinkProps) => ReactNode', description: { pt: 'Link do roteador (com getPageHref).', en: 'Router link (with getPageHref).' } },
            { name: 'aria-label', type: 'string', default: "t('pagination')", description: { pt: 'Nome da navegação. Diferencie quando houver mais de uma.', en: 'Navigation name. Make it unique when there is more than one.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;nav aria-label="Paginação"&gt;</Code> com uma lista de botões (ou links). Cada página tem nome completo — "Página 3" — com o número visível; a atual recebe <Code>aria-current="page"</Code> e a barra laranja. Reticências são decorativas. Quando "Próxima página" fica desabilitado sob o foco, o foco passa para a página atual em vez de se perder.</>}
            en={<>A <Code>&lt;nav aria-label="Pagination"&gt;</Code> with a list of buttons (or links). Each page has a full name — "Page 3" — with the visible number; the current one gets <Code>aria-current="page"</Code> and the orange bar. Ellipses are decorative. When "Next page" becomes disabled under focus, focus moves to the current page instead of getting lost.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre os controles habilitados.', en: 'Moves through the enabled controls.' } },
            { keys: ['Enter'], description: { pt: 'Vai para a página.', en: 'Goes to the page.' } },
            { keys: ['Space'], description: { pt: 'Vai para a página (botões).', en: 'Goes to the page (buttons).' } },
            { keys: ['↑', '↓'], description: { pt: 'No seletor: escolhe a quantidade de itens por página.', en: 'In the selector: picks the number of items per page.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Navegação rotulada com lista de páginas e select com rótulo visível.', en: 'Labelled navigation with a page list and a select with a visible label.' } },
            { criterion: '2.5.3', description: { pt: 'O nome acessível ("Página 3") contém o número visível.', en: 'The accessible name ("Page 3") contains the visible number.' } },
            { criterion: '2.5.8', description: { pt: 'Botões de 32 ou 40px.', en: '32 or 40px buttons.' } },
            { criterion: '4.1.2', description: { pt: 'Página atual com aria-current; anterior/próximo desabilitados nas extremidades.', en: 'Current page with aria-current; previous/next disabled at the ends.' } },
            { criterion: '4.1.3', description: { pt: 'Intervalo e "Página X de Y" anunciados em região viva.', en: 'Range and "Page X of Y" announced in a live region.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
