import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  ComponentPage,
  DefinitionTable,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Card from './examples/Card'
import CardCode from './examples/Card?raw'
import Loading from './examples/Loading'
import LoadingCode from './examples/Loading?raw'
import Paragraph from './examples/Paragraph'
import ParagraphCode from './examples/Paragraph?raw'
import Variants from './examples/Variants'
import VariantsCode from './examples/Variants?raw'
import { meta } from './meta'

const patternCode = `<VisuallyHidden role="status">
  {loading ? 'Carregando pedidos…' : 'Pedidos carregados'}
</VisuallyHidden>

<section aria-labelledby="pedidos" aria-busy={loading}>
  <h2 id="pedidos">Últimos pedidos</h2>
  {loading ? <SkeletonText lines={3} /> : <OrderList />}
</section>`

export default function SkeletonPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Imite o layout real: mesma quantidade aproximada de linhas, alturas e posições. O conteúdo não deve "pular" ao carregar.',
              en: 'Mirror the real layout: about the same number of lines, heights and positions. Content should not "jump" when it loads.',
            },
            {
              pt: 'Use para o primeiro carregamento de listas, cartões e páginas. Para recarregar algo já visível, prefira LoadingOverlay ou Spinner.',
              en: 'Use it for the first load of lists, cards and pages. To reload something already visible, prefer LoadingOverlay or Spinner.',
            },
            {
              pt: 'Mostre só a estrutura — não use skeleton para botões ou campos que o usuário já poderia usar.',
              en: 'Show only structure — do not use skeletons for buttons or fields the user could already use.',
            },
            {
              pt: 'Se a espera passar de alguns segundos, troque por uma mensagem que explique o que está acontecendo.',
              en: 'If the wait exceeds a few seconds, switch to a message that explains what is happening.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Padrão de contêiner', en: 'Container pattern' }}>
        <p>
          <T
            pt={
              <>
                Skeletons são decorativos (<Code>aria-hidden</Code>). Quem informa o carregamento é
                o contêiner: marque-o com <Code>aria-busy</Code> e anuncie o início e o fim numa
                região <Code>role="status"</Code> que fica <strong>fora</strong> dele — alguns
                leitores de tela ignoram mudanças dentro de um elemento ocupado.
              </>
            }
            en={
              <>
                Skeletons are decorative (<Code>aria-hidden</Code>). The container is what reports
                loading: mark it with <Code>aria-busy</Code> and announce start and end in a{' '}
                <Code>role="status"</Code> region placed <strong>outside</strong> it — some screen
                readers ignore changes inside a busy element.
              </>
            }
          />
        </p>
        <CodeBlock code={patternCode} language="tsx" />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Variantes', en: 'Variants' }}
          description={{
            pt: 'text (uma linha), rect (imagens, gráficos, cartões) e circle (avatares).',
            en: 'text (one line), rect (images, charts, cards) and circle (avatars).',
          }}
          code={VariantsCode}
        >
          <Variants />
        </Example>
        <Example
          title={{ pt: 'Parágrafo', en: 'Paragraph' }}
          description={{
            pt: 'SkeletonText repete linhas e encurta a última, como um texto real.',
            en: 'SkeletonText repeats lines and shortens the last one, like real text.',
          }}
          code={ParagraphCode}
        >
          <Paragraph />
        </Example>
        <Example title={{ pt: 'Cartão', en: 'Card' }} code={CardCode}>
          <Card />
        </Example>
        <Example
          title={{ pt: 'Lista carregando', en: 'Loading list' }}
          description={{
            pt: 'aria-busy no contêiner e status fora dele. Clique em Recarregar para repetir.',
            en: 'aria-busy on the container and status outside it. Click Reload to repeat.',
          }}
          code={LoadingCode}
        >
          <Loading />
        </Example>
      </Section>
      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Brilho', en: 'Shimmer' },
              description: {
                pt: (
                  <>
                    Uma faixa clara atravessa a forma a cada 1.6s (
                    <Code>{'--or-duration-loop'}</Code> × 2/3), <Code>{'--or-ease-in-out'}</Code>.
                  </>
                ),
                en: (
                  <>
                    A light band sweeps across the shape every 1.6s (
                    <Code>{'--or-duration-loop'}</Code> × 2/3), <Code>{'--or-ease-in-out'}</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Troca (loaded)', en: 'Swap (loaded)' },
              description: {
                pt: (
                  <>
                    Crossfade: o conteúdo aparece em <Code>{'--or-duration-medium'}</Code> sobre o
                    placeholder, que esmaece em <Code>{'--or-duration-fast'}</Code> e só então sai
                    do DOM (<Code>{'usePresence'}</Code>). Conteúdo que já chega carregado não
                    anima.
                  </>
                ),
                en: (
                  <>
                    Crossfade: the content appears in <Code>{'--or-duration-medium'}</Code> over the
                    placeholder, which fades in <Code>{'--or-duration-fast'}</Code> and only then
                    leaves the DOM (<Code>{'usePresence'}</Code>). Content that arrives already
                    loaded does not animate.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: <>Forma estática, sem brilho; a troca é instantânea.</>,
                en: <>Static shape, no shimmer; the swap is instant.</>,
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Skeleton', en: 'Skeleton' }}
          rows={[
            {
              name: 'variant',
              type: "'text' | 'rect' | 'circle'",
              default: "'text'",
              description: { pt: 'Forma.', en: 'Shape.' },
            },
            {
              name: 'width',
              type: 'number | string',
              description: {
                pt: 'Largura (número = px). Padrão: 100%; 40px no círculo.',
                en: 'Width (number = px). Default: 100%; 40px for circle.',
              },
            },
            {
              name: 'height',
              type: 'number | string',
              description: {
                pt: 'Altura. Padrão: uma linha; 120px no rect; igual à largura no círculo.',
                en: 'Height. Default: one line; 120px for rect; same as width for circle.',
              },
            },
            {
              name: 'animated',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Brilho animado (desligado com movimento reduzido).',
                en: 'Animated shimmer (off with reduced motion).',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLSpanElement>',
              description: { pt: 'Atributos nativos.', en: 'Native attributes.' },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'SkeletonText', en: 'SkeletonText' }}
          rows={[
            {
              name: 'lines',
              type: 'number',
              default: '3',
              description: { pt: 'Número de linhas.', en: 'Number of lines.' },
            },
            {
              name: 'lastLineWidth',
              type: 'number | string',
              default: "'60%'",
              description: { pt: 'Largura da última linha.', en: 'Width of the last line.' },
            },
            {
              name: 'width',
              type: 'number | string',
              description: { pt: 'Largura do bloco.', en: 'Block width.' },
            },
            {
              name: 'animated',
              type: 'boolean',
              default: 'true',
              description: { pt: 'Brilho animado.', en: 'Animated shimmer.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <Callout tone="info" title={{ pt: 'Sem interação', en: 'No interaction' }}>
          <T
            pt="Skeletons não recebem foco nem são lidos. Não há interação por teclado."
            en="Skeletons are neither focusable nor read. There is no keyboard interaction."
          />
        </Callout>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: (
                  <>
                    Estado de carregamento exposto no contêiner com <Code>aria-busy</Code>.
                  </>
                ),
                en: (
                  <>
                    Loading state exposed on the container with <Code>aria-busy</Code>.
                  </>
                ),
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Sem brilho animado quando o sistema pede movimento reduzido.',
                en: 'No animated shimmer when the system requests reduced motion.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: (
                  <>
                    Início e fim do carregamento anunciados por <Code>role="status"</Code>.
                  </>
                ),
                en: (
                  <>
                    Loading start and end announced via <Code>role="status"</Code>.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
