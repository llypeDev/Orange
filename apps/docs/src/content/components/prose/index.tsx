import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  ComponentPage,
  DefinitionTable,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T, useLang } from '../../../i18n'
import CmsHtml from './examples/CmsHtml'
import CmsHtmlCode from './examples/CmsHtml?raw'
import HelpArticle from './examples/HelpArticle'
import HelpArticleCode from './examples/HelpArticle?raw'
import Overflow from './examples/Overflow'
import OverflowCode from './examples/Overflow?raw'
import TermsOfUse from './examples/TermsOfUse'
import TermsOfUseCode from './examples/TermsOfUse?raw'
import WithComponents from './examples/WithComponents'
import WithComponentsCode from './examples/WithComponents?raw'
import { meta } from './meta'

const specificityCode = `/* Todo seletor do Prose pesa (0,1,0): vence resets como p { margin: 0 }, nunca uma classe. */
.or-prose :where(h2):not(:where([class^='or-'], [class*=' or-'], .or-not-prose *)) {
  font-family: var(--or-font-display);
}`

const sanitizeCode = `import DOMPurify from 'isomorphic-dompurify'

// No servidor (ou no loader da rota), antes de chegar ao componente:
const html = DOMPurify.sanitize(artigo.corpoHtml)

<Prose as="article" dangerouslySetInnerHTML={{ __html: html }} />`

export default function ProsePage() {
  const { t } = useLang()
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para conteúdo que não é montado componente por componente: artigos da central de ajuda, termos de uso, notas de versão, HTML de um CMS ou Markdown convertido. Nas telas do produto, use Heading, Text, List e os demais componentes.',
              en: "Use it for content that isn't built component by component: help-center articles, terms of use, release notes, CMS HTML or converted Markdown. In product screens, use Heading, Text, List and the other components.",
            },
            {
              pt: (
                <>
                  Passe o HTML pronto com <Code>dangerouslySetInnerHTML</Code> no próprio Prose, não
                  em um <Code>div</Code> interno: assim a margem do primeiro e do último bloco é
                  cortada.
                </>
              ),
              en: (
                <>
                  Pass ready-made HTML with <Code>dangerouslySetInnerHTML</Code> on Prose itself,
                  not on an inner <Code>div</Code>: that way the first and last block margins are
                  trimmed.
                </>
              ),
            },
            {
              pt: (
                <>
                  Componentes do Orange dentro do Prose mantêm o próprio estilo. Para um trecho que
                  não deve receber a tipografia (botões, um widget de terceiros), use{' '}
                  <Code>className="or-not-prose"</Code>.
                </>
              ),
              en: (
                <>
                  Orange components inside Prose keep their own styles. For a region that should not
                  get the typography (buttons, a third-party widget), use{' '}
                  <Code>className="or-not-prose"</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Mantenha <Code>measure</Code> ligado em textos longos (linhas de até ~68
                  caracteres). Desligue em colunas que já têm largura própria, como cartões e
                  painéis laterais.
                </>
              ),
              en: (
                <>
                  Keep <Code>measure</Code> on for long texts (lines up to ~68 characters). Turn it
                  off in columns that already have their own width, such as cards and side panels.
                </>
              ),
            },
            {
              pt: 'A hierarquia de títulos é do conteúdo: se a página já tem um h1, o artigo começa no h2.',
              en: 'Heading hierarchy belongs to the content: if the page already has an h1, the article starts at h2.',
            },
          ]}
        />
        <Callout tone="warning" title={{ pt: 'Sanitize o HTML', en: 'Sanitize the HTML' }}>
          {t({
            pt: 'O Prose só aplica a tipografia: ele não limpa nem valida o HTML. Conteúdo de CMS, Markdown ou escrito por usuários precisa ser sanitizado pela aplicação — de preferência no servidor, com DOMPurify ou sanitize-html — antes de chegar ao dangerouslySetInnerHTML. Sem isso, um <script> ou um atributo onerror no conteúdo vira XSS.',
            en: "Prose only applies typography: it doesn't clean or validate the HTML. CMS, Markdown or user-written content must be sanitized by the app — preferably on the server, with DOMPurify or sanitize-html — before it reaches dangerouslySetInnerHTML. Otherwise a <script> or an onerror attribute in the content becomes XSS.",
          })}
        </Callout>
        <CodeBlock code={sanitizeCode} language="tsx" />
      </Section>

      <Section title={{ pt: 'Elementos estilizados', en: 'Styled elements' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Títulos h1–h6', en: 'Headings h1–h6' },
              description: {
                pt: 'Space Grotesk na escala do Heading: no tamanho md, h1 = 4xl … h6 = md. sm desce um degrau e lg sobe um.',
                en: 'Space Grotesk on the Heading scale: at size md, h1 = 4xl … h6 = md. sm steps down one level and lg steps up one.',
              },
            },
            {
              term: { pt: 'Texto', en: 'Text' },
              description: {
                pt: 'p, strong (semibold), em, small (texto secundário), sub e sup (sem abrir a entrelinha).',
                en: 'p, strong (semibold), em, small (secondary text), sub and sup (without widening the line height).',
              },
            },
            {
              term: { pt: 'Links', en: 'Links' },
              description: {
                pt: 'O visual do Link: sublinhado laranja de 1px que engrossa e se aproxima do texto no hover e no foco, com contorno de foco de 2px.',
                en: 'The Link look: a 1px orange underline that thickens and moves closer to the text on hover and focus, with a 2px focus outline.',
              },
            },
            {
              term: { pt: 'Listas', en: 'Lists' },
              description: {
                pt: 'ul com o quadrado laranja e ol com a numeração "01" da List, usando marcadores nativos (::marker). ol com type="a" ou "i" mantém o tipo pedido.',
                en: 'ul with the orange square and ol with the "01" numbering from List, using native markers (::marker). ol with type="a" or "i" keeps the requested type.',
              },
            },
            {
              term: { pt: 'Listas de definição', en: 'Description lists' },
              description: {
                pt: 'dt em semibold e dd recuado.',
                en: 'dt in semibold and an indented dd.',
              },
            },
            {
              term: { pt: 'Citações', en: 'Quotes' },
              description: {
                pt: 'blockquote com a barra de acento do Blockquote. Em <figure><blockquote/><figcaption/></figure>, a legenda vira a fonte, com travessão.',
                en: 'blockquote with the Blockquote accent bar. In <figure><blockquote/><figcaption/></figure>, the caption becomes the source, with an em dash.',
              },
            },
            {
              term: { pt: 'Código', en: 'Code' },
              description: {
                pt: 'code e samp em linha com moldura de 1px; kbd com o visual do Kbd (inclusive combinações <kbd><kbd>Ctrl</kbd>+<kbd>K</kbd></kbd>); pre na superfície escura do CodeBlock, com rolagem horizontal.',
                en: 'Inline code and samp with a 1px frame; kbd with the Kbd look (including <kbd><kbd>Ctrl</kbd>+<kbd>K</kbd></kbd> combinations); pre on the dark CodeBlock surface, with horizontal scrolling.',
              },
            },
            {
              term: { pt: 'Tabelas', en: 'Tables' },
              description: {
                pt: 'Bordas, legenda e cabeçalho em caixa alta do Table. Tabelas largas rolam dentro delas mesmas; o alinhamento do Markdown (align="right") é respeitado.',
                en: 'Table borders, caption and uppercase header. Wide tables scroll inside themselves; Markdown alignment (align="right") is respected.',
              },
            },
            {
              term: { pt: 'Mídia', en: 'Media' },
              description: {
                pt: 'img e video com largura máxima de 100%; figcaption em texto secundário, como no Image.',
                en: 'img and video with a 100% max width; figcaption as secondary text, as in Image.',
              },
            },
            {
              term: { pt: 'Divisor e marca', en: 'Divider and mark' },
              description: {
                pt: 'hr como a linha de 1px do Divider; mark com o fundo e o sublinhado do Highlight.',
                en: 'hr as the 1px Divider line; mark with the Highlight background and underline.',
              },
            },
          ]}
        />
        <p>
          <T
            pt={
              <>
                Ritmo vertical: os blocos são separados por 16, 20 ou 24px (sm, md, lg); títulos
                ganham mais espaço acima do que abaixo; a primeira e a última margem são cortadas.
                Todos os seletores usam <Code>:where()</Code> e pesam o mesmo que uma classe —
                vencem resets globais, mas nunca o estilo de um componente. Elementos com classe do
                Orange (<Code>or-*</Code>) e tudo dentro de <Code>.or-not-prose</Code> ficam de
                fora.
              </>
            }
            en={
              <>
                Vertical rhythm: blocks are separated by 16, 20 or 24px (sm, md, lg); headings get
                more space above than below; the first and last margins are trimmed. Every selector
                uses <Code>:where()</Code> and weighs the same as one class — it beats global
                resets, but never a component's own style. Elements with an Orange class (
                <Code>or-*</Code>) and everything inside <Code>.or-not-prose</Code> are left out.
              </>
            }
          />
        </p>
        <CodeBlock code={specificityCode} language="css" />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Artigo da central de ajuda', en: 'Help-center article' }}
          description={{
            pt: 'Como article, nomeado pelo h1. Títulos, lista numerada, atalho de teclado, figura, tabela e citação.',
            en: 'As an article, named by its h1. Headings, numbered list, keyboard shortcut, figure, table and quote.',
          }}
          code={HelpArticleCode}
          align="stretch"
        >
          <HelpArticle />
        </Example>
        <Example
          title={{ pt: 'HTML de um CMS', en: 'CMS HTML' }}
          description={{
            pt: 'Notas de versão vindas do CMS, já sanitizadas no servidor, passadas com dangerouslySetInnerHTML.',
            en: 'Release notes from the CMS, already sanitized on the server, passed with dangerouslySetInnerHTML.',
          }}
          code={CmsHtmlCode}
          align="stretch"
        >
          <CmsHtml />
        </Example>
        <Example
          title={{ pt: 'Termos de uso em tamanho sm', en: 'Terms of use at size sm' }}
          description={{
            pt: 'Texto de 13px para conteúdo denso. A sublista com type="a" mantém as letras.',
            en: '13px text for dense content. The sub-list with type="a" keeps its letters.',
          }}
          code={TermsOfUseCode}
          align="stretch"
        >
          <TermsOfUse />
        </Example>
        <Example
          title={{ pt: 'Componentes e or-not-prose', en: 'Components and or-not-prose' }}
          description={{
            pt: 'Alert e Blockquote mantêm o próprio estilo; os botões ficam em um trecho or-not-prose.',
            en: 'Alert and Blockquote keep their own styles; the buttons sit in an or-not-prose region.',
          }}
          code={WithComponentsCode}
          align="stretch"
        >
          <WithComponents />
        </Example>
        <Example
          title={{ pt: 'Conteúdo largo em 320px', en: 'Wide content at 320px' }}
          description={{
            pt: 'URLs e palavras longas quebram; código e tabelas rolam dentro do próprio bloco, sem alargar a página.',
            en: 'Long URLs and words wrap; code and tables scroll inside their own block, without widening the page.',
          }}
          code={OverflowCode}
        >
          <Overflow />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: {
                pt: 'Texto de 13, 15 ou 17px, com ritmo vertical e títulos proporcionais.',
                en: '13, 15 or 17px text, with proportional vertical rhythm and headings.',
              },
            },
            {
              name: 'measure',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Limita a largura a ~68 caracteres por linha. false ocupa toda a largura.',
                en: 'Limits the width to ~68 characters per line. false fills the width.',
              },
            },
            {
              name: 'as',
              type: 'ElementType',
              default: "'div'",
              description: {
                pt: 'Elemento renderizado. Use article para um artigo completo.',
                en: 'Rendered element. Use article for a full article.',
              },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: {
                pt: 'Conteúdo com elementos HTML comuns (h2, p, ul…).',
                en: 'Content with plain HTML elements (h2, p, ul…).',
              },
            },
            {
              name: 'dangerouslySetInnerHTML',
              type: '{ __html: string }',
              description: {
                pt: 'HTML pronto (CMS, Markdown). Sanitize antes — o Prose não faz isso.',
                en: "Ready-made HTML (CMS, Markdown). Sanitize it first — Prose doesn't.",
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes',
              description: {
                pt: 'Atributos repassados ao elemento raiz, assim como a ref.',
                en: 'Attributes forwarded to the root element, as is the ref.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O Prose não muda a semântica do conteúdo: títulos, listas, tabelas e citações
                continuam sendo o que o HTML diz. As listas usam marcadores nativos (
                <Code>::marker</Code>), então o Safari mantém a semântica de lista. Links se
                distinguem do texto pelo sublinhado, não só pela cor.
              </>
            }
            en={
              <>
                Prose doesn't change the content's semantics: headings, lists, tables and quotes
                remain what the HTML says. Lists use native markers (<Code>::marker</Code>), so
                Safari keeps list semantics. Links stand out from text by their underline, not by
                color alone.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                <strong>Rolagem horizontal.</strong> Um <Code>pre</Code> ou uma tabela mais largos
                que a coluna rolam dentro do próprio bloco. Para rolar pelo teclado, a área precisa
                receber foco — o que o CSS não consegue fazer. O Chrome (130+) e o Firefox tornam
                essas áreas focáveis sozinhos; para o Safari, adicione <Code>tabindex="0"</Code> ao{' '}
                <Code>pre</Code> e às tabelas largas no seu renderizador de Markdown/HTML (e permita
                o atributo no sanitizador). As tabelas usam <Code>display: block</Code> para rolar;
                em combinações antigas de navegador e leitor de tela, isso pode esconder a semântica
                de tabela. Para tabelas de dados importantes, use o componente{' '}
                <strong>Table</strong> dentro de um trecho <Code>or-not-prose</Code>.
              </>
            }
            en={
              <>
                <strong>Horizontal scrolling.</strong> A <Code>pre</Code> or a table wider than the
                column scrolls inside its own block. To scroll with the keyboard, the area must take
                focus — which CSS can't do. Chrome (130+) and Firefox make these areas focusable on
                their own; for Safari, add <Code>tabindex="0"</Code> to <Code>pre</Code> and wide
                tables in your Markdown/HTML renderer (and allow the attribute in the sanitizer).
                Tables use <Code>display: block</Code> to scroll; in older browser and screen reader
                combinations this can hide table semantics. For important data tables, use the{' '}
                <strong>Table</strong> component inside an <Code>or-not-prose</Code> region.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Move o foco para os links e para as áreas roláveis focáveis.',
                en: 'Moves focus to links and focusable scroll areas.',
              },
            },
            {
              keys: ['←', '→'],
              description: {
                pt: 'Rolam horizontalmente o pre ou a tabela em foco.',
                en: 'Scroll the focused pre or table horizontally.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'A semântica do HTML é preservada; listas mantêm marcadores nativos.',
                en: 'HTML semantics are preserved; lists keep native markers.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Links sublinhados, não identificados só pela cor.',
                en: 'Links are underlined, not identified by color alone.',
              },
            },
            {
              criterion: '1.4.8',
              description: {
                pt: 'Linhas de até ~68 caracteres com measure e entrelinha de 1,55 a 1,7 (AAA).',
                en: 'Lines up to ~68 characters with measure and 1.55–1.7 line height (AAA).',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Sem rolagem horizontal da página em 320px: palavras longas quebram; código e tabelas rolam no próprio bloco.',
                en: 'No horizontal page scrolling at 320px: long words wrap; code and tables scroll in their own block.',
              },
            },
            {
              criterion: '1.4.12',
              description: {
                pt: 'Sem alturas fixas: o conteúdo acompanha ajustes de entrelinha e de espaçamento entre letras e parágrafos.',
                en: 'No fixed heights: content follows line-height, letter and paragraph spacing overrides.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível de 2px em links, pre e tabelas focáveis.',
                en: 'Visible 2px focus on links and focusable pre and tables.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
