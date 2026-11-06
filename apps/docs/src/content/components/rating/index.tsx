import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Rating } from '@orangesys/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import ReadOnly from './examples/ReadOnly'
import ReadOnlyCode from './examples/ReadOnly?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import Survey from './examples/Survey'
import SurveyCode from './examples/Survey?raw'
import { meta } from './meta'

export default function RatingPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para opiniões rápidas e subjetivas (satisfação, qualidade). Para escolhas com significado preciso, prefira RadioGroup com rótulos.',
              en: 'Use it for quick, subjective opinions (satisfaction, quality). For choices with precise meaning, prefer a labelled RadioGroup.',
            },
            {
              pt: (
                <>
                  Dê nome a cada nota com <Code>labels</Code> ("Péssima" … "Excelente"): fica claro
                  o que cada estrela significa e o texto aparece ao lado durante o hover.
                </>
              ),
              en: (
                <>
                  Name each score with <Code>labels</Code> ("Terrible" … "Excellent"): it clarifies
                  what each star means and the text appears alongside while hovering.
                </>
              ),
            },
            {
              pt: (
                <>
                  Para exibir médias, use <Code>readOnly</Code> — aceita frações (4,5) e é anunciado
                  como "4,5 de 5 estrelas". Mostre também o número de avaliações.
                </>
              ),
              en: (
                <>
                  To display averages, use <Code>readOnly</Code> — it accepts fractions (4.5) and is
                  announced as "4.5 of 5 stars". Also show the number of reviews.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={<Rating readOnly value={4.5} />}
          dontExample={<Rating label="Média" defaultValue={4} />}
          doItems={[{ pt: 'Médias em modo somente leitura.', en: 'Averages in read-only mode.' }]}
          dontItems={[
            {
              pt: 'Rating interativo para mostrar uma média — parece que a pessoa pode votar.',
              en: 'Interactive rating to show an average — it looks like people can vote.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Passe o mouse para ver a prévia; clique ou use as setas para escolher.',
            en: 'Hover to preview; click or use the arrow keys to choose.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Pesquisa de satisfação', en: 'Satisfaction survey' }}
          description={{
            pt: 'Controlado, com rótulos por nota, obrigatório e validação no envio.',
            en: 'Controlled, with per-score labels, required and validated on submit.',
          }}
          code={SurveyCode}
        >
          <Survey />
        </Example>
        <Example
          title={{ pt: 'Somente leitura', en: 'Read-only' }}
          description={{
            pt: 'Médias com frações em uma lista de produtos.',
            en: 'Averages with fractions in a product list.',
          }}
          code={ReadOnlyCode}
        >
          <ReadOnly />
        </Example>
        <Example
          title={{ pt: 'Tamanhos, escala e estados', en: 'Sizes, scale and states' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Hover (prévia)', en: 'Hover (preview)' },
              description: {
                pt: 'As estrelas da prévia crescem 6% e a estrela sob o ponteiro (ou com foco do teclado) cresce 18% · fast, ease-spring.',
                en: 'Preview stars grow 6% and the star under the pointer (or with keyboard focus) grows 18% · fast, ease-spring.',
              },
            },
            {
              term: { pt: 'Escolher uma nota', en: 'Choosing a score' },
              description: {
                pt: 'Pop em onda até a nota escolhida, ~27ms entre estrelas · medium (250ms), ease-bounce.',
                en: 'Wave pop up to the chosen score, ~27ms between stars · medium (250ms), ease-bounce.',
              },
            },
            {
              term: { pt: 'Preenchimento', en: 'Fill' },
              description: {
                pt: 'Cor e preenchimento passam de transparente a laranja · fast (160ms).',
                en: 'Color and fill go from transparent to orange · fast (160ms).',
              },
            },
            {
              term: { pt: 'Pressionar', en: 'Pressing' },
              description: {
                pt: 'A estrela afunda 1px · press (90ms).',
                en: 'The star sinks 1px · press (90ms).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.',
                en: 'Duration and distance tokens become 0: everything changes instantly and exits do not wait for animation.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              description: { pt: 'Rótulo do grupo.', en: 'Group label.' },
            },
            {
              name: 'value',
              type: 'number | null',
              description: { pt: 'Nota (controlado).', en: 'Score (controlled).' },
            },
            {
              name: 'defaultValue',
              type: 'number | null',
              default: 'null',
              description: {
                pt: 'Nota inicial (não controlado).',
                en: 'Initial score (uncontrolled).',
              },
            },
            {
              name: 'onChange',
              type: '(value: number) => void',
              description: { pt: 'Nova nota (1 a max).', en: 'New score (1 to max).' },
            },
            {
              name: 'max',
              type: 'number',
              default: '5',
              description: { pt: 'Quantidade de estrelas.', en: 'Number of stars.' },
            },
            {
              name: 'labels',
              type: 'string[]',
              description: { pt: 'Nome de cada nota.', en: 'Name of each score.' },
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Exibe como imagem; aceita frações.',
                en: 'Displays as an image; accepts fractions.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Estrelas de 16, 24 ou 32px.', en: '16, 24 or 32px stars.' },
            },
            {
              name: 'description / error',
              type: 'ReactNode',
              description: { pt: 'Ajuda e erro do grupo.', en: 'Group help and error.' },
            },
            {
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Estado inválido sem mensagem (erro mostrado em outro lugar).',
                en: 'Invalid state without a message (error shown elsewhere).',
              },
            },
            {
              name: 'required / disabled',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Estados do grupo.', en: 'Group states.' },
            },
            {
              name: 'name',
              type: 'string',
              description: { pt: 'Nome dos rádios (formulários).', en: 'Radio name (forms).' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Cada estrela é um <Code>&lt;input type="radio"&gt;</Code> nativo, visualmente
                oculto, com um <Code>&lt;label&gt;</Code> que desenha a estrela e diz "3 de 5
                estrelas" (ou o rótulo de <Code>labels</Code>). O grupo tem{' '}
                <Code>role="radiogroup"</Code> nomeado pelo rótulo. Em <Code>readOnly</Code> não há
                controles: um <Code>role="img"</Code> com <Code>aria-label</Code> descreve a nota.
              </>
            }
            en={
              <>
                Each star is a visually hidden native <Code>&lt;input type="radio"&gt;</Code> with a{' '}
                <Code>&lt;label&gt;</Code> that draws the star and says "3 of 5 stars" (or the{' '}
                <Code>labels</Code> text). The group has <Code>role="radiogroup"</Code> named by the
                label. In <Code>readOnly</Code> there are no controls: a <Code>role="img"</Code>{' '}
                with <Code>aria-label</Code> describes the score.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Entra no grupo (na nota escolhida ou na primeira estrela).',
                en: 'Enters the group (on the chosen score or the first star).',
              },
            },
            {
              keys: ['→', '↓'],
              description: { pt: 'Próxima nota (seleciona).', en: 'Next score (selects).' },
            },
            {
              keys: ['←', '↑'],
              description: { pt: 'Nota anterior (seleciona).', en: 'Previous score (selects).' },
            },
            {
              keys: ['Space'],
              description: { pt: 'Seleciona a estrela focada.', en: 'Selects the focused star.' },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.1.1',
              description: {
                pt: 'Estrelas têm alternativa em texto; somente leitura usa role="img" com a nota.',
                en: 'Stars have a text alternative; read-only uses role="img" with the score.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Estrelas preenchidas mudam forma (preenchimento sólido), não só a cor.',
                en: 'Filled stars change shape (solid fill), not just color.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Setas nativas do grupo de rádios.',
                en: 'Native radio group arrow keys.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Alvo de 24×24px no tamanho sm.',
                en: '24×24px target at size sm.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
