import { Link } from 'react-router-dom'
import { T, useLang } from '../../../i18n'
import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import InText from './examples/InText'
import InTextCode from './examples/InText?raw'
import StatCards from './examples/StatCards'
import StatCardsCode from './examples/StatCards?raw'
import Variants from './examples/Variants'
import VariantsCode from './examples/Variants?raw'
import { meta } from './meta'

export default function SparklinePage() {
  const { to } = useLang()
  const guideline = to('/design-guidelines/data-visualization')
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use ao lado de um número (<strong>Stat</strong>, uma linha de tabela) para mostrar
                  a forma da tendência. Sem eixos, ele não serve para ler valores — para isso use{' '}
                  <strong>LineChart</strong>. Veja a diretriz{' '}
                  <Link to={guideline}>Visualização de dados</Link>.
                </>
              ),
              en: (
                <>
                  Use it next to a number (<strong>Stat</strong>, a table row) to show the shape of
                  the trend. With no axes, it isn’t for reading values — use{' '}
                  <strong>LineChart</strong> for that. See the{' '}
                  <Link to={guideline}>Data visualization</Link> guideline.
                </>
              ),
            },
            {
              pt: (
                <>
                  O <Code>label</Code> é obrigatório e diz a tendência em palavras, com número e
                  período: “Vendas subiram 18% em 7 dias” — não “gráfico de vendas”.
                </>
              ),
              en: (
                <>
                  <Code>label</Code> is required and states the trend in words, with a number and a
                  period: “Sales rose 18% in 7 days” — not “sales chart”.
                </>
              ),
            },
            {
              pt: 'A linha fica no neutro e o ponto final no acento: o período atual é o que importa. Para outra cor, use um token viz em color.',
              en: 'The line stays neutral and the end point uses the accent: the current period is what matters. For another color, pass a viz token to color.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Linha', en: 'Line' },
              description: {
                pt: '2px, em --or-color-viz-other (≥ 3:1 contra o fundo). Os valores ocupam toda a altura.',
                en: '2px, in --or-color-viz-other (≥ 3:1 against the background). Values fill the whole height.',
              },
            },
            {
              term: { pt: 'Ponto final', en: 'End point' },
              description: {
                pt: 'O valor atual, no acento, com anel de fundo (showEndPoint, padrão).',
                en: 'The current value, in the accent, with a background ring (showEndPoint, default).',
              },
            },
            {
              term: { pt: 'Mínimo e máximo', en: 'Minimum and maximum' },
              description: {
                pt: 'Pontos discretos opcionais (showMinMax).',
                en: 'Optional subtle dots (showMinMax).',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Em cartões de métrica', en: 'In metric cards' }}
          description={{
            pt: 'Dentro do Stat, ao lado da variação.',
            en: 'Inside Stat, next to the change.',
          }}
          code={StatCardsCode}
        >
          <StatCards />
        </Example>
        <Example
          title={{ pt: 'Variações', en: 'Variations' }}
          description={{
            pt: 'Padrão, com mínimo e máximo, e com área e outra cor.',
            en: 'Default, with minimum and maximum, and with area and another color.',
          }}
          code={VariantsCode}
        >
          <Variants />
        </Example>
        <Example title={{ pt: 'Em linha com o texto', en: 'Inline with text' }} code={InTextCode}>
          <InText />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada', en: 'Entrance' },
              description: {
                pt: 'Uma vez, ao entrar na tela (useInView): a linha se desenha (stroke-dashoffset, --or-duration-reveal, --or-ease-in-out) e os pontos surgem no fim (--or-ease-bounce).',
                en: 'Once, when entering the viewport (useInView): the line draws (stroke-dashoffset, --or-duration-reveal, --or-ease-in-out) and the dots pop in at the end (--or-ease-bounce).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Aparece desenhado, sem animação.',
                en: 'Appears fully drawn, without animation.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'data',
              type: 'number[]',
              required: true,
              description: {
                pt: 'Valores em ordem; o último é o período atual.',
                en: 'Values in order; the last is the current period.',
              },
            },
            {
              name: 'label',
              type: 'string',
              required: true,
              description: {
                pt: 'Tendência em palavras. É o nome acessível.',
                en: 'The trend in words. It is the accessible name.',
              },
            },
            {
              name: 'width',
              type: 'number',
              default: '96',
              description: { pt: 'Largura em px.', en: 'Width in px.' },
            },
            {
              name: 'height',
              type: 'number',
              default: '28',
              description: { pt: 'Altura em px.', en: 'Height in px.' },
            },
            {
              name: 'color',
              type: 'string',
              default: "'var(--or-color-viz-other)'",
              description: { pt: 'Cor da linha.', en: 'Line color.' },
            },
            {
              name: 'area',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Preenche a área sob a linha.',
                en: 'Fills the area under the line.',
              },
            },
            {
              name: 'showEndPoint',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Ponto no último valor, no acento.',
                en: 'Dot on the last value, in the accent.',
              },
            },
            {
              name: 'showMinMax',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Marca o menor e o maior valor.',
                en: 'Marks the lowest and highest value.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLSpanElement>',
              description: {
                pt: 'Repassado ao <span> (ref também).',
                en: 'Passed to the <span> (ref too).',
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
                Renderiza um <Code>&lt;span role="img"&gt;</Code> com <Code>aria-label</Code> igual
                ao <Code>label</Code>; o SVG interno é <Code>aria-hidden</Code>. Por ser conteúdo em
                linha (cabe dentro de <Code>Stat</Code>, células e parágrafos) e não interativo, não
                usa <Code>&lt;figure&gt;</Code>, foco nem a tabela “Ver dados” dos gráficos maiores:
                o rótulo é a alternativa em texto — então ele precisa dizer a conclusão.
              </>
            }
            en={
              <>
                Renders a <Code>&lt;span role="img"&gt;</Code> whose <Code>aria-label</Code> is the{' '}
                <Code>label</Code>; the inner SVG is <Code>aria-hidden</Code>. Since it is inline
                content (it fits inside <Code>Stat</Code>, cells and paragraphs) and not
                interactive, it has no <Code>&lt;figure&gt;</Code>, focus or “Show data” table like
                the larger charts: the label is the text alternative — so it must state the
                takeaway.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.1.1',
              description: {
                pt: 'Texto alternativo obrigatório (label) com a tendência.',
                en: 'Required text alternative (label) with the trend.',
              },
            },
            {
              criterion: '1.4.11',
              description: {
                pt: 'Linha e ponto com ≥ 3:1 contra o fundo.',
                en: 'Line and dot at ≥ 3:1 against the background.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Sem animação com prefers-reduced-motion.',
                en: 'No animation with prefers-reduced-motion.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
