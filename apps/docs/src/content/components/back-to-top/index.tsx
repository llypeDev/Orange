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
import Page from './examples/Page'
import PageCode from './examples/Page?raw'
import ScrollPanel from './examples/ScrollPanel'
import ScrollPanelCode from './examples/ScrollPanel?raw'
import WithLabel from './examples/WithLabel'
import WithLabelCode from './examples/WithLabel?raw'
import { meta } from './meta'

export default function BackToTopPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use em páginas com várias telas de altura — artigos, listas longas, documentação. Em páginas curtas, ele só ocupa espaço.',
              en: 'Use it on pages several screens tall — articles, long lists, documentation. On short pages it only takes up space.',
            },
            {
              pt: 'Inclua apenas um por página e mantenha-o no canto inferior direito, longe de outras ações flutuantes.',
              en: 'Include only one per page and keep it in the bottom-right corner, away from other floating actions.',
            },
            {
              pt: (
                <>
                  O foco vai para o <Code>&lt;main&gt;</Code> depois da rolagem. Se o início lógico for outro (um título, um
                  painel), informe <Code>focusTarget</Code>.
                </>
              ),
              en: (
                <>
                  Focus moves to <Code>&lt;main&gt;</Code> after scrolling. If the logical start is elsewhere (a heading, a
                  panel), pass <Code>focusTarget</Code>.
                </>
              ),
            },
            {
              pt: 'Em barras inferiores no mobile (BottomNavigation), aumente o deslocamento com a variável --or-back-to-top-offset para não sobrepor.',
              en: 'With bottom bars on mobile (BottomNavigation), increase the offset with the --or-back-to-top-offset variable to avoid overlap.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Em um painel rolável', en: 'In a scrollable panel' }}
          description={{
            pt: 'Com scrollContainer e position="sticky", o botão acompanha o fim do painel. Role a lista para vê-lo.',
            en: 'With scrollContainer and position="sticky", the button follows the end of the panel. Scroll the list to see it.',
          }}
          code={ScrollPanelCode}
          align="stretch"
        >
          <ScrollPanel />
        </Example>
        <Example
          title={{ pt: 'Com rótulo visível', en: 'With visible label' }}
          description={{
            pt: 'showLabel mostra o texto ao lado da seta — útil quando o ícone sozinho pode não ser entendido.',
            en: 'showLabel shows the text next to the arrow — useful when the icon alone may not be understood.',
          }}
          code={WithLabelCode}
          align="stretch"
        >
          <WithLabel />
        </Example>
        <Example
          title={{ pt: 'Na página inteira', en: 'On the whole page' }}
          description={{
            pt: 'O uso mais comum: fixo na janela. Esta página usa este exemplo — role para baixo.',
            en: 'The most common usage: fixed to the window. This page uses this example — scroll down.',
          }}
          code={PageCode}
        >
          <Page />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'threshold', type: 'number', default: '400', description: { pt: 'Pixels rolados até o botão aparecer.', en: 'Scrolled pixels before the button appears.' } },
            {
              name: 'focusTarget',
              type: 'HTMLElement | RefObject | (() => HTMLElement) | string',
              default: "'main' | body",
              description: {
                pt: 'Elemento (ou seletor) que recebe o foco depois de voltar ao topo.',
                en: 'Element (or selector) that receives focus after returning to the top.',
              },
            },
            {
              name: 'scrollContainer',
              type: 'HTMLElement | RefObject | (() => HTMLElement)',
              default: 'window',
              description: { pt: 'Contêiner rolável observado.', en: 'Observed scroll container.' },
            },
            {
              name: 'position',
              type: "'fixed' | 'sticky'",
              default: "'fixed'",
              description: {
                pt: 'fixed prende na janela; sticky prende no fim do contêiner rolável.',
                en: 'fixed pins it to the window; sticky pins it to the end of the scroll container.',
              },
            },
            { name: 'showLabel', type: 'boolean', default: 'false', description: { pt: 'Mostra o rótulo ao lado do ícone.', en: 'Shows the label next to the icon.' } },
            {
              name: 'label',
              type: 'string',
              default: "t('backToTop')",
              description: { pt: 'Rótulo (visível ou aria-label).', en: 'Label (visible or aria-label).' },
            },
            {
              name: '...rest',
              type: 'ButtonHTMLAttributes',
              description: { pt: <>Atributos nativos de <Code>&lt;button&gt;</Code>.</>, en: <>Native <Code>&lt;button&gt;</Code> attributes.</> },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Um <Code>&lt;button&gt;</Code> nativo com nome "Voltar ao topo". Enquanto escondido, usa <Code>visibility: hidden</Code>: sai da ordem de foco e da árvore de acessibilidade. Depois de rolar, o foco é movido para o início do conteúdo — sem isso, o próximo Tab continuaria do fim da página.</>}
            en={<>A native <Code>&lt;button&gt;</Code> named "Back to top". While hidden, it uses <Code>visibility: hidden</Code>: it leaves the focus order and the accessibility tree. After scrolling, focus moves to the start of the content — otherwise the next Tab would continue from the end of the page.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o botão (quando visível).', en: 'Moves focus to the button (when visible).' } },
            { keys: ['Enter'], description: { pt: 'Volta ao topo e move o foco para o conteúdo.', en: 'Goes back to the top and moves focus to the content.' } },
            { keys: ['Space'], description: { pt: 'Mesmo que Enter.', en: 'Same as Enter.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '2.3.3', description: { pt: 'Rolagem instantânea quando o sistema pede movimento reduzido.', en: 'Instant scrolling when the system requests reduced motion.' } },
            { criterion: '2.4.3', description: { pt: 'O foco acompanha a rolagem e volta ao início do conteúdo.', en: 'Focus follows the scroll and returns to the start of the content.' } },
            { criterion: '2.5.8', description: { pt: 'Alvo de 48×48px.', en: '48×48px target.' } },
            { criterion: '4.1.2', description: { pt: 'Nome acessível mesmo quando só o ícone aparece.', en: 'Accessible name even when only the icon shows.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
