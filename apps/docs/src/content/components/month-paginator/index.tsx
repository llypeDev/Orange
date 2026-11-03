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
import Limits from './examples/Limits'
import LimitsCode from './examples/Limits?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import Statement from './examples/Statement'
import StatementCode from './examples/Statement?raw'
import { meta } from './meta'

export default function MonthPaginatorPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use quando o conteúdo é organizado por mês e a pessoa navega para meses vizinhos: extrato, fatura, escala, relatório. Para escolher uma data específica, use DatePicker.',
              en: 'Use it when content is organized by month and people move to neighbouring months: statements, invoices, schedules, reports. To pick a specific date, use DatePicker.',
            },
            {
              pt: (
                <>
                  Dê um nome ao grupo com <Code>aria-label</Code> ("Mês do extrato") quando houver
                  mais de um na tela.
                </>
              ),
              en: (
                <>
                  Name the group with <Code>aria-label</Code> ("Statement month") when there is more
                  than one on screen.
                </>
              ),
            },
            {
              pt: (
                <>
                  Defina <Code>min</Code> e <Code>max</Code> para os meses com dados — ex.: não
                  deixe avançar para meses futuros num extrato.
                </>
              ),
              en: (
                <>
                  Set <Code>min</Code> and <Code>max</Code> to the months with data — e.g. don't
                  allow moving into future months in a statement.
                </>
              ),
            },
            {
              pt: (
                <>
                  <Code>month</Code> vai de 0 (janeiro) a 11 (dezembro), igual a{' '}
                  <Code>Date#getMonth()</Code>.
                </>
              ),
              en: (
                <>
                  <Code>month</Code> goes from 0 (January) to 11 (December), like{' '}
                  <Code>Date#getMonth()</Code>.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Sem valor inicial, começa no mês atual.',
            en: 'Without an initial value it starts at the current month.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Resumo mensal (controlado)', en: 'Monthly summary (controlled)' }}
          description={{
            pt: 'O mês escolhido filtra o conteúdo abaixo; os limites cobrem só os meses com dados.',
            en: 'The selected month filters the content below; the limits cover only months with data.',
          }}
          code={StatementCode}
        >
          <Statement />
        </Example>
        <Example
          title={{ pt: 'Últimos 12 meses', en: 'Last 12 months' }}
          description={{
            pt: 'No limite, o botão continua focável com aria-disabled — o foco não se perde.',
            en: 'At the limit the button stays focusable with aria-disabled — focus is never lost.',
          }}
          code={LimitsCode}
        >
          <Limits />
        </Example>
        <Example
          title={{ pt: 'Tamanhos e formato curto', en: 'Sizes and short format' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'value',
              type: '{ year: number; month: number }',
              description: {
                pt: 'Mês exibido (controlado). month de 0 a 11.',
                en: 'Displayed month (controlled). month from 0 to 11.',
              },
            },
            {
              name: 'defaultValue',
              type: '{ year; month }',
              default: 'mês atual',
              description: {
                pt: 'Mês inicial (não controlado).',
                en: 'Initial month (uncontrolled).',
              },
            },
            {
              name: 'onChange',
              type: '(value: YearMonth) => void',
              description: {
                pt: 'Novo mês ao clicar em anterior/próximo.',
                en: 'New month when clicking previous/next.',
              },
            },
            {
              name: 'min / max',
              type: '{ year; month }',
              description: {
                pt: 'Limites; os botões ficam indisponíveis neles.',
                en: 'Limits; the buttons become unavailable at them.',
              },
            },
            {
              name: 'monthFormat',
              type: "'long' | 'short'",
              default: "'long'",
              description: {
                pt: '"Março de 2026" ou "mar. de 2026".',
                en: '"March 2026" or "Mar 2026".',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura dos botões.', en: 'Button height.' },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Bloqueia a navegação.', en: 'Blocks navigation.' },
            },
            {
              name: 'aria-label',
              type: 'string',
              default: 't("monthNavigation")',
              description: { pt: 'Nome do grupo.', en: 'Group name.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Um <Code>role="group"</Code> nomeado com dois <Code>&lt;button&gt;</Code> nativos
                ("Mês anterior" e "Próximo mês"). O rótulo central fica numa região{' '}
                <Code>aria-live="polite"</Code>, então o novo mês é anunciado após cada clique sem
                mover o foco. Nos limites, os botões usam <Code>aria-disabled</Code> em vez de{' '}
                <Code>disabled</Code> para continuarem focáveis.
              </>
            }
            en={
              <>
                A named <Code>role="group"</Code> with two native <Code>&lt;button&gt;</Code>s
                ("Previous month" and "Next month"). The central label lives in an{' '}
                <Code>aria-live="polite"</Code> region, so the new month is announced after each
                click without moving focus. At the limits the buttons use <Code>aria-disabled</Code>{' '}
                instead of <Code>disabled</Code> so they stay focusable.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Move entre "Mês anterior" e "Próximo mês".',
                en: 'Moves between "Previous month" and "Next month".',
              },
            },
            {
              keys: ['Enter'],
              description: { pt: 'Ativa o botão focado.', en: 'Activates the focused button.' },
            },
            {
              keys: ['Space'],
              description: { pt: 'Ativa o botão focado.', en: 'Activates the focused button.' },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '2.4.6',
              description: {
                pt: 'Botões com nomes descritivos traduzidos.',
                en: 'Buttons with descriptive translated names.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Foco permanece no botão ao chegar no limite.',
                en: 'Focus stays on the button when reaching a limit.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Alvos de 32×32px (sm) a 48×48px (lg).',
                en: 'Targets from 32×32px (sm) to 48×48px (lg).',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: (
                  <>
                    Mudança de mês anunciada via <Code>aria-live</Code>.
                  </>
                ),
                en: (
                  <>
                    Month change announced via <Code>aria-live</Code>.
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
