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
import Marks from './examples/Marks'
import MarksCode from './examples/Marks?raw'
import Range from './examples/Range'
import RangeCode from './examples/Range?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import { meta } from './meta'

export default function SliderPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use quando o valor exato importa menos que a posição relativa (volume, brilho, faixa de preço). Para valores precisos, ofereça também um campo numérico.',
              en: 'Use it when the exact value matters less than the relative position (volume, brightness, price range). For precise values, also offer a number field.',
            },
            {
              pt: (
                <>
                  Mostre o valor atual (padrão) e formate-o com <Code>formatValue</Code> — o mesmo
                  texto é anunciado por leitores de tela via <Code>aria-valuetext</Code>.
                </>
              ),
              en: (
                <>
                  Show the current value (default) and format it with <Code>formatValue</Code> — the
                  same text is announced by screen readers via <Code>aria-valuetext</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Escolha um <Code>step</Code> que faça sentido: R$ 100 em uma faixa de preços, 5%
                  em uma porcentagem. Passos muito finos tornam o teclado lento.
                </>
              ),
              en: (
                <>
                  Pick a meaningful <Code>step</Code>: R$ 100 for a price range, 5% for a
                  percentage. Very fine steps make the keyboard slow.
                </>
              ),
            },
            {
              pt: 'Use marcas com rótulos para pontos de referência (limites de plano, valores comuns), não para todos os passos.',
              en: 'Use labeled marks for reference points (plan limits, common values), not for every step.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: (
              <>
                O valor formatado aparece ao lado do rótulo em um <Code>&lt;output&gt;</Code>.
              </>
            ),
            en: (
              <>
                The formatted value shows next to the label in an <Code>&lt;output&gt;</Code>.
              </>
            ),
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Intervalo', en: 'Range' }}
          description={{
            pt: (
              <>
                Com <Code>range</Code>, dois polegares definem mínimo e máximo; eles não se cruzam e
                respeitam <Code>minDistance</Code>. Clique no trilho para mover o polegar mais
                próximo.
              </>
            ),
            en: (
              <>
                With <Code>range</Code>, two thumbs set minimum and maximum; they never cross and
                respect <Code>minDistance</Code>. Click the track to move the nearest thumb.
              </>
            ),
          }}
          code={RangeCode}
        >
          <Range />
        </Example>
        <Example
          title={{ pt: 'Marcas', en: 'Marks' }}
          description={{
            pt: (
              <>
                Marcas com rótulo (clicáveis) ou <Code>marks</Code> para uma marca por passo.
              </>
            ),
            en: (
              <>
                Labeled (clickable) marks, or <Code>marks</Code> for one mark per step.
              </>
            ),
          }}
          code={MarksCode}
        >
          <Marks />
        </Example>
        <Example
          title={{ pt: 'Tamanhos e desabilitado', en: 'Sizes and disabled' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'value / defaultValue',
              type: 'number | [number, number]',
              description: {
                pt: 'Valor (ou intervalo, com range).',
                en: 'Value (or range, with range).',
              },
            },
            {
              name: 'onChange',
              type: '(value: number | [number, number]) => void',
              description: {
                pt: 'Chamado enquanto o valor muda.',
                en: 'Called while the value changes.',
              },
            },
            {
              name: 'onChangeEnd',
              type: '(value: number | [number, number]) => void',
              description: {
                pt: 'Chamado ao soltar o polegar ou a tecla.',
                en: 'Called when the thumb or key is released.',
              },
            },
            {
              name: 'range',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Dois polegares (mínimo e máximo).',
                en: 'Two thumbs (minimum and maximum).',
              },
            },
            {
              name: 'min / max / step',
              type: 'number',
              default: '0 / 100 / 1',
              description: { pt: 'Faixa e incremento.', en: 'Scale and increment.' },
            },
            {
              name: 'minDistance',
              type: 'number',
              default: '0',
              description: {
                pt: 'Distância mínima entre os polegares (range).',
                en: 'Minimum distance between thumbs (range).',
              },
            },
            {
              name: 'marks',
              type: 'boolean | Array<number | { value, label? }>',
              description: {
                pt: 'Marcas no trilho; true = uma por passo.',
                en: 'Track marks; true = one per step.',
              },
            },
            {
              name: 'formatValue',
              type: '(value: number) => string',
              description: {
                pt: 'Formata a saída visível e o aria-valuetext.',
                en: 'Formats the visible output and aria-valuetext.',
              },
            },
            {
              name: 'showValue',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Mostra o valor ao lado do rótulo.',
                en: 'Shows the value next to the label.',
              },
            },
            {
              name: 'thumbLabels',
              type: '[string, string]',
              description: {
                pt: 'Nomes dos polegares no modo range. Padrão: "mínimo"/"máximo".',
                en: 'Thumb names in range mode. Default: "minimum"/"maximum".',
              },
            },
            {
              name: 'label / hideLabel / description / error',
              type: 'ReactNode / boolean',
              description: { pt: 'Estrutura de campo (Field).', en: 'Field structure.' },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: {
                pt: 'Tamanho do polegar e espessura do trilho.',
                en: 'Thumb size and track thickness.',
              },
            },
            {
              name: 'disabled / invalid',
              type: 'boolean',
              description: { pt: 'Estados do campo.', en: 'Field states.' },
            },
            {
              name: '...rest',
              type: 'InputHTMLAttributes',
              description: {
                pt: 'Atributos do input range (name…). A ref aponta para o primeiro polegar.',
                en: 'Range input attributes (name…). The ref points to the first thumb.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Hover e foco', en: 'Hover and focus' },
              description: {
                pt: 'O polegar cresce 12% (250ms, spring) e ganha um anel que se expande de 0 (250ms, ease-out) — mesma resposta para mouse e teclado.',
                en: 'The thumb grows 12% (250ms, spring) and gains a ring that expands from 0 (250ms, ease-out) — same response for mouse and keyboard.',
              },
            },
            {
              term: { pt: 'Pressionar / arrastar', en: 'Press / drag' },
              description: {
                pt: 'O polegar cresce 22% e preenche de laranja.',
                en: 'The thumb grows 22% and fills with orange.',
              },
            },
            {
              term: {
                pt: 'Clique no trilho ou marca, teclado',
                en: 'Track or mark click, keyboard',
              },
              description: {
                pt: 'Preenchimento e polegar deslizam até o novo valor por transform (250ms, spring).',
                en: 'Fill and thumb slide to the new value via transform (250ms, spring).',
              },
            },
            {
              term: { pt: 'Arraste', en: 'Dragging' },
              description: {
                pt: 'Sem transição: o polegar segue o ponteiro sem atraso.',
                en: 'No transition: the thumb follows the pointer with no lag.',
              },
            },
            {
              term: { pt: 'Marcas', en: 'Marks' },
              description: {
                pt: 'Mudam de cor em 160ms quando entram/saem do intervalo.',
                en: 'Change color in 160ms as they enter/leave the range.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.',
                en: 'Durations and distances drop to zero via tokens; state is still conveyed by color, border and text.',
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
                Cada polegar é um <Code>&lt;input type="range"&gt;</Code> nativo, com{' '}
                <Code>role="slider"</Code>, valores mínimo/máximo e teclado do navegador. No modo
                intervalo, os dois ficam em um <Code>role="group"</Code> com o rótulo do campo e
                cada um recebe o nome "<em>rótulo</em> mínimo" e "<em>rótulo</em> máximo". O{' '}
                <Code>&lt;output&gt;</Code> visível não é uma região viva, para não repetir o que o
                leitor de tela já anuncia.
              </>
            }
            en={
              <>
                Each thumb is a native <Code>&lt;input type="range"&gt;</Code>, with{' '}
                <Code>role="slider"</Code>, min/max values and browser keyboard support. In range
                mode both live in a <Code>role="group"</Code> named by the field label, and each is
                named "<em>label</em> minimum" and "<em>label</em> maximum". The visible{' '}
                <Code>&lt;output&gt;</Code> is not a live region, so it does not repeat what the
                screen reader already announces.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['→ / ↑'],
              description: { pt: 'Aumenta um passo.', en: 'Increases by one step.' },
            },
            {
              keys: ['← / ↓'],
              description: { pt: 'Diminui um passo.', en: 'Decreases by one step.' },
            },
            {
              keys: ['PageUp / PageDown'],
              description: {
                pt: 'Aumenta/diminui em passos maiores (conforme o navegador).',
                en: 'Increases/decreases in larger steps (browser-dependent).',
              },
            },
            {
              keys: ['Home / End'],
              description: {
                pt: 'Vai para o mínimo/máximo permitido.',
                en: 'Moves to the allowed minimum/maximum.',
              },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'No modo intervalo, passa do polegar mínimo para o máximo.',
                en: 'In range mode, moves from the minimum to the maximum thumb.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Rótulo, descrição e papéis nativos; grupo nomeado no modo intervalo.',
                en: 'Native label, description and roles; named group in range mode.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Teclado completo do input nativo.',
                en: 'Full keyboard support from the native input.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Anel de foco desenhado no polegar.',
                en: 'Focus ring drawn on the thumb.',
              },
            },
            {
              criterion: '2.5.7',
              description: {
                pt: 'Arrastar não é obrigatório: clique no trilho, nas marcas ou use o teclado.',
                en: 'Dragging is not required: click the track, the marks or use the keyboard.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: (
                  <>
                    Valor legível via <Code>aria-valuetext</Code> quando há <Code>formatValue</Code>
                    .
                  </>
                ),
                en: (
                  <>
                    Readable value via <Code>aria-valuetext</Code> when <Code>formatValue</Code> is
                    set.
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
