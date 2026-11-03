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
import BusinessHours from './examples/BusinessHours'
import BusinessHoursCode from './examples/BusinessHours?raw'
import Interval from './examples/Interval'
import IntervalCode from './examples/Interval?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import { meta } from './meta'

export default function TimeFieldPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  O valor é sempre uma string <Code>HH:mm</Code> em 24 horas, independente de como o
                  navegador exibe (12h com AM/PM ou 24h, conforme o sistema da pessoa).
                </>
              ),
              en: (
                <>
                  The value is always a 24-hour <Code>HH:mm</Code> string, regardless of how the
                  browser displays it (12h with AM/PM or 24h, following the person's system).
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <Code>step</Code> (em segundos) quando só alguns horários fazem sentido —{' '}
                  <Code>900</Code> para intervalos de 15 minutos — e informe a regra na{' '}
                  <Code>description</Code>.
                </>
              ),
              en: (
                <>
                  Use <Code>step</Code> (in seconds) when only some times make sense —{' '}
                  <Code>900</Code> for 15-minute slots — and state the rule in the{' '}
                  <Code>description</Code>.
                </>
              ),
            },
            {
              pt: 'Mencione o fuso horário quando a pessoa puder estar em outra região.',
              en: 'Mention the time zone when people may be in another region.',
            },
            {
              pt: 'Para escolher entre poucos horários fixos (ex.: 3 janelas de entrega), prefira RadioGroup ou SegmentedControl.',
              en: 'To choose among a few fixed times (e.g. 3 delivery windows), prefer RadioGroup or SegmentedControl.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Horário comercial', en: 'Business hours' }}
          description={{
            pt: 'min, max e step seguem o atributo nativo; as setas respeitam o intervalo de 15 minutos.',
            en: 'min, max and step follow the native attribute; arrow keys respect the 15-minute step.',
          }}
          code={BusinessHoursCode}
        >
          <BusinessHours />
        </Example>
        <Example
          title={{ pt: 'Intervalo (controlado)', en: 'Interval (controlled)' }}
          description={{
            pt: 'Dois campos controlados com validação de negócio: o fim precisa ser depois do início.',
            en: 'Two controlled fields with business validation: the end must be after the start.',
          }}
          code={IntervalCode}
        >
          <Interval />
        </Example>
        <Example title={{ pt: 'Tamanhos', en: 'Sizes' }} code={SizesCode}>
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Estados', en: 'States' }}
          description={{
            pt: 'Somente leitura, com erro e desabilitado.',
            en: 'Read-only, with error and disabled.',
          }}
          code={StatesCode}
        >
          <States />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              description: { pt: 'Rótulo visível.', en: 'Visible label.' },
            },
            {
              name: 'value',
              type: 'string',
              description: { pt: 'Horário HH:mm (controlado).', en: 'HH:mm time (controlled).' },
            },
            {
              name: 'defaultValue',
              type: 'string',
              default: "''",
              description: {
                pt: 'Horário inicial (não controlado).',
                en: 'Initial time (uncontrolled).',
              },
            },
            {
              name: 'onChange',
              type: '(value: string, event) => void',
              description: {
                pt: "Novo horário, ou '' quando apagado.",
                en: "New time, or '' when cleared.",
              },
            },
            {
              name: 'min / max',
              type: 'string',
              description: { pt: 'Limites no formato HH:mm.', en: 'Limits in HH:mm format.' },
            },
            {
              name: 'step',
              type: 'number',
              default: '60',
              description: {
                pt: 'Intervalo em segundos. Abaixo de 60 exibe segundos.',
                en: 'Step in seconds. Below 60 shows seconds.',
              },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: { pt: 'Texto de ajuda.', en: 'Help text.' },
            },
            {
              name: 'error',
              type: 'ReactNode',
              description: { pt: 'Mensagem de erro.', en: 'Error message.' },
            },
            {
              name: 'required / disabled / readOnly',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Estados do campo.', en: 'Field states.' },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura do campo.', en: 'Field height.' },
            },
            {
              name: '...rest',
              type: 'InputHTMLAttributes',
              description: {
                pt: 'Atributos do <input type="time">.',
                en: 'Attributes of <input type="time">.',
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
                Usa o <Code>&lt;input type="time"&gt;</Code> nativo: cada segmento (hora, minuto,
                AM/PM) é anunciado e editável pelo teclado em qualquer leitor de tela. O ícone de
                relógio é decorativo — no mouse, ele abre o seletor nativo.
              </>
            }
            en={
              <>
                Uses the native <Code>&lt;input type="time"&gt;</Code>: each segment (hour, minute,
                AM/PM) is announced and keyboard-editable in every screen reader. The clock icon is
                decorative — with a mouse it opens the native picker.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Entra no campo e passa entre os segmentos.',
                en: 'Enters the field and moves between segments.',
              },
            },
            {
              keys: ['←', '→'],
              description: { pt: 'Segmento anterior / próximo.', en: 'Previous / next segment.' },
            },
            {
              keys: ['↑', '↓'],
              description: {
                pt: 'Aumenta / diminui o segmento respeitando o step.',
                en: 'Increments / decrements the segment respecting step.',
              },
            },
            {
              keys: ['0–9'],
              description: { pt: 'Digita o valor do segmento.', en: 'Types the segment value.' },
            },
            {
              keys: ['Backspace'],
              description: { pt: 'Apaga o segmento.', en: 'Clears the segment.' },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Rótulo, descrição e erro ligados por for/aria-describedby.',
                en: 'Label, description and error linked via for/aria-describedby.',
              },
            },
            {
              criterion: '1.3.5',
              description: {
                pt: 'Tipo de entrada nativo identifica o propósito do campo.',
                en: 'Native input type identifies the field purpose.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível na borda laranja e no segmento ativo.',
                en: 'Visible focus on the orange border and the active segment.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: (
                  <>
                    Erros com <Code>aria-invalid</Code> e mensagem associada.
                  </>
                ),
                en: (
                  <>
                    Errors with <Code>aria-invalid</Code> and an associated message.
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
