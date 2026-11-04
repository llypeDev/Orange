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
import { T } from '../../../i18n'
import Goals from './examples/Goals'
import GoalsCode from './examples/Goals?raw'
import Indeterminate from './examples/Indeterminate'
import IndeterminateCode from './examples/Indeterminate?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import Uploads from './examples/Uploads'
import UploadsCode from './examples/Uploads?raw'
import { meta } from './meta'

export default function ProgressCirclePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use em espaços compactos — linhas de lista, miniaturas de upload, cartões de meta — ou quando o percentual central for o destaque.',
              en: 'Use it in compact spaces — list rows, upload thumbnails, goal cards — or when the central percentage is the highlight.',
            },
            {
              pt: 'Com espaço horizontal e um rótulo longo, prefira ProgressBar: barras são mais fáceis de comparar.',
              en: 'With horizontal room and a long label, prefer ProgressBar: bars are easier to compare.',
            },
            {
              pt: (
                <>
                  Dê um <Code>label</Code> específico ("Enviando contrato.pdf"). Sem ele, o nome
                  acessível é o genérico "Carregando…".
                </>
              ),
              en: (
                <>
                  Give it a specific <Code>label</Code> ("Uploading contract.pdf"). Without it, the
                  accessible name is the generic "Loading…".
                </>
              ),
            },
            {
              pt: 'O valor central cabe só nos tamanhos md e lg; no sm, mostre o detalhe ao lado, em texto.',
              en: 'The central value only fits md and lg sizes; at sm, show the detail next to it, as text.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{
            pt: 'sm (24px), md (48px) e lg (80px). O traço tem terminação quadrada e começa no topo.',
            en: 'sm (24px), md (48px) and lg (80px). The stroke has a square cap and starts at the top.',
          }}
          code={SizesCode}
          align="center"
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Indeterminado', en: 'Indeterminate' }}
          description={{
            pt: 'Sem value, o arco gira; com movimento reduzido, pulsa.',
            en: 'Without value, the arc spins; with reduced motion, it pulses.',
          }}
          code={IndeterminateCode}
          align="center"
        >
          <Indeterminate />
        </Example>
        <Example title={{ pt: 'Lista de uploads', en: 'Upload list' }} code={UploadsCode}>
          <Uploads />
        </Example>
        <Example
          title={{ pt: 'Metas', en: 'Goals' }}
          description={{
            pt: 'Tons sinalizam a situação; o detalhe com unidade fica na legenda.',
            en: 'Tones signal status; the detail with units sits in the caption.',
          }}
          code={GoalsCode}
        >
          <Goals />
        </Example>
      </Section>
      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Ao montar', en: 'On mount' },
              description: {
                pt: (
                  <>
                    O arco é desenhado a partir do topo (<Code>{'stroke-dashoffset'}</Code>) em{' '}
                    <Code>{'--or-duration-slow'}</Code>, <Code>{'--or-ease-out'}</Code>; o valor
                    central entra com fade.
                  </>
                ),
                en: (
                  <>
                    The arc is drawn from the top (<Code>{'stroke-dashoffset'}</Code>) in{' '}
                    <Code>{'--or-duration-slow'}</Code>, <Code>{'--or-ease-out'}</Code>; the central
                    value fades in.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Mudança de valor', en: 'Value change' },
              description: {
                pt: (
                  <>
                    Transição de <Code>{'stroke-dashoffset'}</Code> em{' '}
                    <Code>{'--or-duration-slow'}</Code>.
                  </>
                ),
                en: (
                  <>
                    <Code>{'stroke-dashoffset'}</Code> transition in{' '}
                    <Code>{'--or-duration-slow'}</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Mudança de tom', en: 'Tone change' },
              description: {
                pt: (
                  <>
                    A cor do traço transiciona em <Code>{'--or-duration-medium'}</Code>.
                  </>
                ),
                en: (
                  <>
                    The stroke color transitions in <Code>{'--or-duration-medium'}</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Indeterminado', en: 'Indeterminate' },
              description: {
                pt: (
                  <>
                    O arco gira uma volta a cada 900ms (<Code>{'--or-duration-loop'}</Code> ×
                    0.375), linear.
                  </>
                ),
                en: (
                  <>
                    The arc spins one turn every 900ms (<Code>{'--or-duration-loop'}</Code> ×
                    0.375), linear.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: <>Mudanças instantâneas; o indeterminado pulsa em vez de girar.</>,
                en: <>Instant changes; indeterminate pulses instead of spinning.</>,
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'number | null',
              description: {
                pt: 'Valor atual. Sem valor, fica indeterminado.',
                en: 'Current value. Without it, it is indeterminate.',
              },
            },
            {
              name: 'min',
              type: 'number',
              default: '0',
              description: { pt: 'Valor mínimo.', en: 'Minimum value.' },
            },
            {
              name: 'max',
              type: 'number',
              default: '100',
              description: { pt: 'Valor máximo.', en: 'Maximum value.' },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Diâmetro: 24, 48 ou 80px.', en: 'Diameter: 24, 48 or 80px.' },
            },
            {
              name: 'tone',
              type: "'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'",
              default: "'accent'",
              description: { pt: 'Cor do arco.', en: 'Arc color.' },
            },
            {
              name: 'showValue',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Valor no centro (md e lg).',
                en: 'Value in the center (md and lg).',
              },
            },
            {
              name: 'formatValue',
              type: '(value, { min, max, percent }) => string',
              description: {
                pt: 'Formata o valor exibido e o aria-valuetext.',
                en: 'Formats the shown value and aria-valuetext.',
              },
            },
            {
              name: 'label',
              type: 'string',
              default: "t('loading')",
              description: {
                pt: (
                  <>
                    Nome acessível (<Code>aria-label</Code>).
                  </>
                ),
                en: (
                  <>
                    Accessible name (<Code>aria-label</Code>).
                  </>
                ),
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Atributos nativos; <Code>aria-labelledby</Code> substitui o label.
                  </>
                ),
                en: (
                  <>
                    Native attributes; <Code>aria-labelledby</Code> replaces the label.
                  </>
                ),
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
                A raiz é um <Code>role="progressbar"</Code> com nome, <Code>aria-valuenow</Code>/
                <Code>min</Code>/<Code>max</Code> e <Code>aria-valuetext</Code>. O SVG e o valor
                central são <Code>aria-hidden</Code>. Não recebe foco. Para anunciar a conclusão,
                use um Toast ou uma região <Code>role="status"</Code>.
              </>
            }
            en={
              <>
                The root is a <Code>role="progressbar"</Code> with a name,{' '}
                <Code>aria-valuenow</Code>/<Code>min</Code>/<Code>max</Code> and{' '}
                <Code>aria-valuetext</Code>. The SVG and central value are <Code>aria-hidden</Code>.
                It is not focusable. To announce completion, use a Toast or a{' '}
                <Code>role="status"</Code> region.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.4.11',
              description: {
                pt: 'Arco com contraste mínimo de 3:1 sobre a trilha.',
                en: 'Arc with at least 3:1 contrast against the track.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Rotação substituída por pulsação com movimento reduzido.',
                en: 'Rotation replaced by a pulse with reduced motion.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: 'Papel, nome e valores expostos via ARIA.',
                en: 'Role, name and values exposed via ARIA.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
