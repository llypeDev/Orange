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
import Auto from './examples/Auto'
import AutoCode from './examples/Auto?raw'
import Manual from './examples/Manual'
import ManualCode from './examples/Manual?raw'
import ThisPage from './examples/ThisPage'
import ThisPageCode from './examples/ThisPage?raw'
import { meta } from './meta'

export default function TableOfContentsPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use em páginas longas com seções tituladas — documentação, artigos, termos de uso. Com menos de três seções, dispense.',
              en: 'Use it on long pages with titled sections — documentation, articles, terms of service. With fewer than three sections, skip it.',
            },
            {
              pt: 'Mantenha até dois níveis (h2 e h3). Índices profundos viram um segundo menu difícil de escanear.',
              en: 'Keep up to two levels (h2 and h3). Deep indexes become a second menu that is hard to scan.',
            },
            {
              pt: 'Fixe o índice ao lado do conteúdo em telas largas (position: sticky) e esconda-o em telas pequenas.',
              en: 'Pin the index next to the content on wide screens (position: sticky) and hide it on small screens.',
            },
            {
              pt: (
                <>
                  Quando houver mais de um índice ou navegação na página, dê a cada um um título diferente (<Code>title</Code>{' '}
                  ou <Code>aria-label</Code>).
                </>
              ),
              en: (
                <>
                  When a page has more than one index or navigation, give each one a different title (<Code>title</Code> or{' '}
                  <Code>aria-label</Code>).
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Itens definidos', en: 'Defined items' }}
          description={{
            pt: 'items com id, label e level. root aponta para o painel rolável; role-o para ver o destaque acompanhar.',
            en: 'items with id, label and level. root points to the scrollable panel; scroll it to see the highlight follow.',
          }}
          code={ManualCode}
        >
          <Manual />
        </Example>
        <Example
          title={{ pt: 'Coleta automática', en: 'Automatic collection' }}
          description={{
            pt: 'Com container, os títulos são lidos do DOM (e atualizados se o conteúdo mudar). Títulos sem id ganham um.',
            en: 'With container, headings are read from the DOM (and updated when content changes). Headings without an id get one.',
          }}
          code={AutoCode}
        >
          <Auto />
        </Example>
        <Example
          title={{ pt: 'Índice desta página', en: 'Index of this page' }}
          description={{
            pt: 'Lê os h2 desta documentação e acompanha a rolagem da janela — role a página para ver.',
            en: 'Reads the h2s of this documentation and follows the window scroll — scroll the page to see it.',
          }}
          code={ThisPageCode}
        >
          <ThisPage />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'items', type: '{ id, label, level? }[]', description: { pt: 'Itens do índice.', en: 'Index items.' } },
            { name: 'container', type: 'HTMLElement | RefObject', description: { pt: 'Contêiner de onde os títulos são coletados (sem items).', en: 'Container to collect headings from (without items).' } },
            { name: 'headingSelector', type: 'string', default: "'h2, h3'", description: { pt: 'Seletor dos títulos coletados.', en: 'Selector for collected headings.' } },
            { name: 'title', type: 'ReactNode | null', default: "t('tableOfContents')", description: { pt: 'Título visível; null esconde (o nome vai para aria-label).', en: 'Visible title; null hides it (the name goes to aria-label).' } },
            { name: 'root', type: 'HTMLElement | RefObject', default: 'window', description: { pt: 'Contêiner rolável observado.', en: 'Observed scroll container.' } },
            { name: 'rootMargin', type: 'string', default: "'-80px 0px -65% 0px'", description: { pt: 'Faixa da tela em que uma seção conta como visível.', en: 'Screen band where a section counts as visible.' } },
            { name: 'onItemClick', type: '(id, event) => void', description: { pt: 'Chamado ao clicar; preventDefault cancela a navegação.', en: 'Called on click; preventDefault cancels navigation.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Uma <Code>&lt;nav&gt;</Code> nomeada pelo título visível ("Nesta página"), com uma lista de links de âncora. A seção visível recebe <Code>aria-current="location"</Code> e a barra laranja de 2px. Os links são âncoras nativas: o navegador rola até a seção e o próximo Tab continua a partir dela.</>}
            en={<>A <Code>&lt;nav&gt;</Code> named by its visible title ("On this page"), with a list of anchor links. The visible section gets <Code>aria-current="location"</Code> and the 2px orange bar. Links are native anchors: the browser scrolls to the section and the next Tab continues from there.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre os links do índice.', en: 'Moves through the index links.' } },
            { keys: ['Enter'], description: { pt: 'Vai para a seção.', en: 'Goes to the section.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Hierarquia por indentação e tamanho, em uma lista de links.', en: 'Hierarchy through indentation and size, in a list of links.' } },
            { criterion: '2.4.5', description: { pt: 'Mais de um caminho para chegar a cada seção.', en: 'More than one way to reach each section.' } },
            { criterion: '2.4.8', description: { pt: 'A seção atual fica destacada.', en: 'The current section is highlighted.' } },
            { criterion: '4.1.2', description: { pt: 'Seção atual exposta com aria-current="location".', en: 'Current section exposed with aria-current="location".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
