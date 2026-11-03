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
import HighIsGood from './examples/HighIsGood'
import HighIsGoodCode from './examples/HighIsGood?raw'
import Interactive from './examples/Interactive'
import InteractiveCode from './examples/Interactive?raw'
import Neutral from './examples/Neutral'
import NeutralCode from './examples/Neutral?raw'
import Storage from './examples/Storage'
import StorageCode from './examples/Storage?raw'
import { meta } from './meta'

export default function MeterPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use Meter para um valor estático dentro de uma escala (uso, cota, nível). Para o andamento de uma tarefa, use ProgressBar.',
              en: 'Use Meter for a static value within a scale (usage, quota, level). For task progress, use ProgressBar.',
            },
            {
              pt: (
                <>
                  Defina <Code>low</Code>, <Code>high</Code> e <Code>optimum</Code> quando a faixa
                  importar: a cor muda sozinha para success, warning ou danger.
                </>
              ),
              en: (
                <>
                  Set <Code>low</Code>, <Code>high</Code> and <Code>optimum</Code> when the range
                  matters: the color switches to success, warning or danger on its own.
                </>
              ),
            },
            {
              pt: 'A cor não pode ser a única pista: em faixas críticas, explique a consequência na descrição ("novos uploads serão bloqueados").',
              en: 'Color cannot be the only cue: in critical ranges, explain the consequence in the description ("new uploads will be blocked").',
            },
            {
              pt: 'Mostre o valor com a unidade ("92 GB de 128 GB") — percentuais sozinhos escondem a escala.',
              en: 'Show the value with its unit ("92 GB of 128 GB") — percentages alone hide the scale.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Faixas e cor', en: 'Ranges and color' }}>
        <p>
          <T
            pt={
              <>
                O cálculo segue o elemento <Code>&lt;meter&gt;</Code> do HTML: <Code>low</Code> e{' '}
                <Code>high</Code> dividem a escala em três faixas, e a faixa onde está o{' '}
                <Code>optimum</Code> é a ideal.
              </>
            }
            en={
              <>
                The calculation follows the HTML <Code>&lt;meter&gt;</Code> element:{' '}
                <Code>low</Code> and <Code>high</Code> split the scale into three ranges, and the
                range containing <Code>optimum</Code> is the ideal one.
              </>
            }
          />
        </p>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Ótimo → success', en: 'Optimum → success' },
              description: {
                pt: 'O valor está na mesma faixa do optimum.',
                en: 'The value is in the same range as optimum.',
              },
            },
            {
              term: { pt: 'Subótimo → warning', en: 'Suboptimum → warning' },
              description: {
                pt: 'O valor está numa faixa vizinha à ideal.',
                en: 'The value is in a range next to the ideal one.',
              },
            },
            {
              term: { pt: 'Crítico → danger', en: 'Critical → danger' },
              description: {
                pt: 'O valor está na faixa oposta à ideal (ex.: disco quase cheio quando o ideal é vazio).',
                en: 'The value is in the range opposite the ideal one (e.g. disk almost full when empty is ideal).',
              },
            },
            {
              term: { pt: 'Sem faixas → accent', en: 'No ranges → accent' },
              description: {
                pt: 'Sem low/high, o medidor só mostra o valor, em laranja.',
                en: 'Without low/high, the meter just shows the value, in orange.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Armazenamento (baixo é bom)', en: 'Storage (low is good)' }}
          description={{
            pt: 'optimum={0} abaixo de low: até 90 GB é ótimo, até 115 GB atenção, acima disso crítico. As marcas indicam os limites.',
            en: 'optimum={0} below low: up to 90 GB is optimal, up to 115 GB warning, above that critical. Marks show the thresholds.',
          }}
          code={StorageCode}
        >
          <Storage />
        </Example>
        <Example
          title={{ pt: 'Bateria (alto é bom)', en: 'Battery (high is good)' }}
          code={HighIsGoodCode}
        >
          <HighIsGood />
        </Example>
        <Example title={{ pt: 'Sem faixas', en: 'Without ranges' }} code={NeutralCode}>
          <Neutral />
        </Example>
        <Example
          title={{ pt: 'Mudando de faixa', en: 'Changing range' }}
          description={{
            pt: 'Arraste o controle para ver a cor acompanhar o valor.',
            en: 'Drag the control to see the color follow the value.',
          }}
          code={InteractiveCode}
        >
          <Interactive />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'number',
              required: true,
              description: { pt: 'Valor medido.', en: 'Measured value.' },
            },
            {
              name: 'min',
              type: 'number',
              default: '0',
              description: { pt: 'Início da escala.', en: 'Scale start.' },
            },
            {
              name: 'max',
              type: 'number',
              default: '100',
              description: { pt: 'Fim da escala.', en: 'Scale end.' },
            },
            {
              name: 'low',
              type: 'number',
              description: {
                pt: 'Limite superior da faixa baixa.',
                en: 'Upper bound of the low range.',
              },
            },
            {
              name: 'high',
              type: 'number',
              description: {
                pt: 'Limite inferior da faixa alta.',
                en: 'Lower bound of the high range.',
              },
            },
            {
              name: 'optimum',
              type: 'number',
              default: '(min + max) / 2',
              description: {
                pt: 'Valor ideal; define qual faixa é boa.',
                en: 'Ideal value; defines which range is good.',
              },
            },
            {
              name: 'label',
              type: 'ReactNode',
              description: {
                pt: (
                  <>
                    Rótulo visível, ligado por <Code>aria-labelledby</Code>.
                  </>
                ),
                en: (
                  <>
                    Visible label, linked via <Code>aria-labelledby</Code>.
                  </>
                ),
              },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: {
                pt: (
                  <>
                    Texto de apoio, ligado por <Code>aria-describedby</Code>.
                  </>
                ),
                en: (
                  <>
                    Helper text, linked via <Code>aria-describedby</Code>.
                  </>
                ),
              },
            },
            {
              name: 'showValue',
              type: 'boolean',
              default: 'true',
              description: { pt: 'Mostra o valor formatado.', en: 'Shows the formatted value.' },
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
              name: 'tone',
              type: "'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'",
              description: {
                pt: 'Força uma cor, ignorando as faixas.',
                en: 'Forces a color, ignoring ranges.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md'",
              default: "'md'",
              description: { pt: 'Espessura: 4px ou 8px.', en: 'Thickness: 4px or 8px.' },
            },
            {
              name: 'showThresholds',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Marcas nos limites low/high.',
                en: 'Marks at the low/high thresholds.',
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
                O medidor usa <Code>role="meter"</Code> (ARIA 1.2) com <Code>aria-valuenow</Code>,{' '}
                <Code>aria-valuemin</Code>, <Code>aria-valuemax</Code> e <Code>aria-valuetext</Code>{' '}
                — o mesmo texto exibido, com unidade. Usamos um elemento com papel em vez do{' '}
                <Code>&lt;meter&gt;</Code> nativo para ter visual consistente entre navegadores. A
                faixa atual fica em <Code>data-level</Code>.
              </>
            }
            en={
              <>
                The meter uses <Code>role="meter"</Code> (ARIA 1.2) with <Code>aria-valuenow</Code>,{' '}
                <Code>aria-valuemin</Code>, <Code>aria-valuemax</Code> and{' '}
                <Code>aria-valuetext</Code> — the same text shown, with its unit. We use an element
                with a role instead of the native <Code>&lt;meter&gt;</Code> for consistent visuals
                across browsers. The current range is exposed in <Code>data-level</Code>.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Rótulo e descrição associados programaticamente.',
                en: 'Label and description programmatically associated.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Faixas críticas devem ser explicadas em texto, não só pela cor.',
                en: 'Critical ranges must be explained in text, not only by color.',
              },
            },
            {
              criterion: '1.4.11',
              description: {
                pt: 'Preenchimento com contraste mínimo de 3:1 sobre a trilha.',
                en: 'Fill with at least 3:1 contrast against the track.',
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
