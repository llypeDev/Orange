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
import { DatePicker } from '@orangesys/ui'
import Agenda from './examples/Agenda'
import AgendaCode from './examples/Agenda?raw'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Booking from './examples/Booking'
import BookingCode from './examples/Booking?raw'
import Restrictions from './examples/Restrictions'
import RestrictionsCode from './examples/Restrictions?raw'
import Validation from './examples/Validation'
import ValidationCode from './examples/Validation?raw'
import { meta } from './meta'

export default function DatePickerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para datas próximas ou relativas a hoje (entrega, vencimento, agendamento). Para datas distantes e conhecidas, como nascimento, a pessoa digita mais rápido — o campo aceita digitação direta com máscara.',
              en: 'Use it for dates close to or relative to today (delivery, due date, scheduling). For distant, known dates such as birthdays, typing is faster — the field accepts direct typing with a mask.',
            },
            {
              pt: (
                <>
                  O formato segue o idioma do <Code>OrangeProvider</Code>: <Code>dd/mm/aaaa</Code>{' '}
                  em pt-BR e <Code>mm/dd/yyyy</Code> em en-US. Ele aparece como placeholder e é
                  anunciado como descrição do campo.
                </>
              ),
              en: (
                <>
                  The format follows the <Code>OrangeProvider</Code> locale: <Code>dd/mm/aaaa</Code>{' '}
                  in pt-BR and <Code>mm/dd/yyyy</Code> in en-US. It shows as the placeholder and is
                  announced as the field description.
                </>
              ),
            },
            {
              pt: (
                <>
                  Restrinja com <Code>min</Code>, <Code>max</Code> e <Code>isDateDisabled</Code> e
                  explique a regra na <Code>description</Code> ("Dias úteis nos próximos 60 dias").
                </>
              ),
              en: (
                <>
                  Restrict with <Code>min</Code>, <Code>max</Code> and <Code>isDateDisabled</Code>{' '}
                  and explain the rule in the <Code>description</Code> ("Business days in the next
                  60 days").
                </>
              ),
            },
            {
              pt: (
                <>
                  Datas inválidas (31/02) ou indisponíveis mostram um erro automático e emitem{' '}
                  <Code>null</Code>. Passe <Code>error</Code> para mensagens de negócio, como
                  "Informe o vencimento".
                </>
              ),
              en: (
                <>
                  Invalid (02/31) or unavailable dates show an automatic error and emit{' '}
                  <Code>null</Code>. Pass <Code>error</Code> for business messages such as "Enter
                  the due date".
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <DatePicker
              label="Data da consulta"
              description="Segunda a sexta, a partir de amanhã."
            />
          }
          dontExample={<DatePicker label="Data" hideLabel />}
          doItems={[
            {
              pt: 'Rótulo específico e a regra de disponibilidade explicada.',
              en: 'Specific label and the availability rule explained.',
            },
          ]}
          dontItems={[
            {
              pt: 'Campo sem rótulo visível, dependendo só do placeholder.',
              en: 'Field without a visible label, relying only on the placeholder.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Campo de texto', en: 'Text field' },
              description: {
                pt: 'Aceita digitação com máscara; separadores são inseridos sozinhos e "5/3" vira "05/03".',
                en: 'Accepts masked typing; separators are inserted automatically and "5/3" becomes "05/03".',
              },
            },
            {
              term: { pt: 'Botão de calendário', en: 'Calendar button' },
              description: {
                pt: 'Abre o diálogo. Com valor, o nome acessível inclui a data: "Alterar data, domingo, 15 de março de 2026".',
                en: 'Opens the dialog. With a value, its accessible name includes the date: "Change date, Sunday, March 15, 2026".',
              },
            },
            {
              term: { pt: 'Diálogo', en: 'Dialog' },
              description: {
                pt: 'Modal, rotulado pelo mês e ano exibidos; prende o foco até fechar.',
                en: 'Modal, labelled by the displayed month and year; traps focus until closed.',
              },
            },
            {
              term: { pt: 'Grade (Calendar)', en: 'Grid (Calendar)' },
              description: {
                pt: 'Hoje tem marcador laranja; o dia selecionado é preenchido em laranja; dias indisponíveis ficam riscados.',
                en: 'Today has an orange marker; the selected day is filled in orange; unavailable days are struck through.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Digite a data ou abra o calendário pelo botão (ou Alt + ↓ dentro do campo).',
            en: 'Type the date or open the calendar with the button (or Alt + ↓ inside the field).',
          }}
          code={BasicCode}
          minHeight={140}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Datas permitidas', en: 'Allowed dates' }}
          description={{
            pt: 'min, max e isDateDisabled bloqueiam fins de semana e feriados; a semana começa na segunda-feira.',
            en: 'min, max and isDateDisabled block weekends and holidays; the week starts on Monday.',
          }}
          code={RestrictionsCode}
        >
          <Restrictions />
        </Example>
        <Example
          title={{ pt: 'Período (controlado)', en: 'Range (controlled)' }}
          description={{
            pt: 'Dois campos controlados: o check-out só libera depois do check-in e começa no dia seguinte.',
            en: 'Two controlled fields: check-out unlocks after check-in and starts on the next day.',
          }}
          code={BookingCode}
        >
          <Booking />
        </Example>
        <Example
          title={{ pt: 'Validação e estados', en: 'Validation and states' }}
          description={{
            pt: 'Erro de negócio via error, somente leitura e desabilitado. Com name, o valor vai no formulário como aaaa-mm-dd.',
            en: 'Business error via error, read-only and disabled. With name, the value is submitted as yyyy-mm-dd.',
          }}
          code={ValidationCode}
        >
          <Validation />
        </Example>
        <Example
          title={{ pt: 'Calendar standalone', en: 'Standalone Calendar' }}
          description={{
            pt: 'A grade também é exportada como Calendar para agendas e painéis — com a mesma navegação por teclado.',
            en: 'The grid is also exported as Calendar for agendas and panels — with the same keyboard navigation.',
          }}
          code={AgendaCode}
        >
          <Agenda />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Abrir o calendário', en: 'Opening the calendar' },
              description: {
                pt: 'O diálogo entra com opacidade, 4px vindos do lado do campo (acima ou abaixo) e escala 0,98 → 1 · medium (250ms), ease-out.',
                en: 'The dialog enters with opacity, 4px from the field side (above or below) and 0.98 → 1 scale · medium (250ms), ease-out.',
              },
            },
            {
              term: { pt: 'Fechar', en: 'Closing' },
              description: {
                pt: 'Sai mais rápido pelo mesmo lado e fica inerte durante a saída · fast (160ms), ease-in-out.',
                en: 'Exits faster towards the same side and is inert while leaving · fast (160ms), ease-in-out.',
              },
            },
            {
              term: { pt: 'Trocar de mês', en: 'Changing month' },
              description: {
                pt: 'A grade desliza 16px na direção (próximo → da direita, anterior → da esquerda) com fade; o título faz crossfade · medium, ease-out (saída do título em fast).',
                en: 'The grid slides 16px in the direction (next → from the right, previous → from the left) with a fade; the title crossfades · medium, ease-out (outgoing title in fast).',
              },
            },
            {
              term: { pt: 'Escolher um dia', en: 'Choosing a day' },
              description: {
                pt: 'O dia selecionado faz pop de 0,8 → 1 com overshoot · medium, ease-bounce.',
                en: 'The selected day pops from 0.8 → 1 with overshoot · medium, ease-bounce.',
              },
            },
            {
              term: { pt: 'Hover e foco', en: 'Hover and focus' },
              description: {
                pt: 'Fundo e cor dos dias e botões · fast; as setas de navegação empurram 2px na direção · medium.',
                en: 'Day and button background and color · fast; navigation arrows nudge 2px in their direction · medium.',
              },
            },
            {
              term: { pt: 'Pressionar', en: 'Pressing' },
              description: {
                pt: 'Dias, botões e o ícone do calendário afundam 1px (translateY(1px) scale(0.985)) · press (90ms).',
                en: 'Days, buttons and the calendar icon sink 1px (translateY(1px) scale(0.985)) · press (90ms).',
              },
            },
            {
              term: { pt: 'Hoje', en: 'Today' },
              description: {
                pt: 'O marcador laranja entra em escala ao exibir o mês · medium, ease-bounce.',
                en: 'The orange marker scales in when the month is shown · medium, ease-bounce.',
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
          caption={{ pt: 'DatePicker', en: 'DatePicker' }}
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              description: { pt: 'Rótulo visível do campo.', en: 'Visible field label.' },
            },
            {
              name: 'value',
              type: 'Date | null',
              description: {
                pt: 'Data selecionada (controlado).',
                en: 'Selected date (controlled).',
              },
            },
            {
              name: 'defaultValue',
              type: 'Date | null',
              default: 'null',
              description: {
                pt: 'Data inicial (não controlado).',
                en: 'Initial date (uncontrolled).',
              },
            },
            {
              name: 'onChange',
              type: '(date: Date | null) => void',
              description: {
                pt: 'Nova data, ou null quando o campo fica vazio, incompleto, inválido ou indisponível.',
                en: 'New date, or null when the field is empty, incomplete, invalid or unavailable.',
              },
            },
            {
              name: 'min',
              type: 'Date',
              description: { pt: 'Primeira data permitida.', en: 'First allowed date.' },
            },
            {
              name: 'max',
              type: 'Date',
              description: { pt: 'Última data permitida.', en: 'Last allowed date.' },
            },
            {
              name: 'isDateDisabled',
              type: '(date: Date) => boolean',
              description: { pt: 'Desabilita datas específicas.', en: 'Disables specific dates.' },
            },
            {
              name: 'weekStartsOn',
              type: '0 | 1 | … | 6',
              default: '0',
              description: {
                pt: 'Primeiro dia da semana (0 = domingo).',
                en: 'First day of the week (0 = Sunday).',
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
              description: {
                pt: 'Erro; substitui a validação interna.',
                en: 'Error; overrides built-in validation.',
              },
            },
            {
              name: 'required',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Campo obrigatório.', en: 'Required field.' },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Desabilita campo e botão.', en: 'Disables field and button.' },
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Somente leitura; o calendário não abre.',
                en: 'Read-only; the calendar does not open.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura do campo.', en: 'Field height.' },
            },
            {
              name: 'open / defaultOpen / onOpenChange',
              type: 'boolean / (open) => void',
              description: { pt: 'Estado do calendário.', en: 'Calendar open state.' },
            },
            {
              name: 'name',
              type: 'string',
              description: {
                pt: (
                  <>
                    Envia o valor em um input oculto no formato <Code>aaaa-mm-dd</Code>.
                  </>
                ),
                en: (
                  <>
                    Submits the value in a hidden input as <Code>yyyy-mm-dd</Code>.
                  </>
                ),
              },
            },
            {
              name: '...rest',
              type: 'InputHTMLAttributes',
              description: {
                pt: 'Atributos do <input> de texto.',
                en: 'Attributes of the text <input>.',
              },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'Calendar', en: 'Calendar' }}
          rows={[
            {
              name: 'value / defaultValue',
              type: 'Date | null',
              description: { pt: 'Dia selecionado.', en: 'Selected day.' },
            },
            {
              name: 'onChange',
              type: '(date: Date) => void',
              description: {
                pt: 'Dia escolhido por clique, Enter ou Espaço.',
                en: 'Day chosen by click, Enter or Space.',
              },
            },
            {
              name: 'defaultMonth',
              type: 'Date',
              default: 'hoje',
              description: {
                pt: 'Mês exibido quando não há valor.',
                en: 'Month shown when there is no value.',
              },
            },
            {
              name: 'min / max',
              type: 'Date',
              description: {
                pt: 'Intervalo selecionável; o foco não sai dele.',
                en: 'Selectable range; focus stays within it.',
              },
            },
            {
              name: 'isDateDisabled',
              type: '(date: Date) => boolean',
              description: { pt: 'Datas indisponíveis.', en: 'Unavailable dates.' },
            },
            {
              name: 'weekStartsOn',
              type: '0 | 1 | … | 6',
              default: '0',
              description: { pt: 'Primeiro dia da semana.', en: 'First day of the week.' },
            },
            {
              name: 'showTodayButton',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Botão "Hoje" no rodapé.', en: '"Today" button in the footer.' },
            },
            {
              name: 'autoFocus',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Foca o dia ativo ao montar.',
                en: 'Focuses the active day on mount.',
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
                Segue o padrão <strong>Date Picker Dialog</strong> do WAI-ARIA APG. O diálogo tem{' '}
                <Code>role="dialog"</Code>, <Code>aria-modal="true"</Code> e é rotulado pelo mês
                exibido, que fica numa região <Code>aria-live</Code>. A grade usa{' '}
                <Code>role="grid"</Code> com cabeçalhos de dia da semana (nome completo para
                leitores de tela), roving tabindex, <Code>aria-selected</Code> no dia escolhido,{' '}
                <Code>aria-current="date"</Code> em hoje e <Code>aria-disabled</Code> nos dias
                indisponíveis.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <strong>Date Picker Dialog</strong> pattern. The dialog has{' '}
                <Code>role="dialog"</Code>, <Code>aria-modal="true"</Code> and is labelled by the
                displayed month, which lives in an <Code>aria-live</Code> region. The grid uses{' '}
                <Code>role="grid"</Code> with weekday headers (full names for screen readers),
                roving tabindex, <Code>aria-selected</Code> on the chosen day,{' '}
                <Code>aria-current="date"</Code> on today and <Code>aria-disabled</Code> on
                unavailable days.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Alt', '↓'],
              description: {
                pt: 'No campo: abre o calendário.',
                en: 'In the field: opens the calendar.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'No botão: abre o calendário. No dia: seleciona, fecha e devolve o foco ao botão.',
                en: 'On the button: opens the calendar. On a day: selects, closes and returns focus to the button.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'No dia: seleciona e fecha.',
                en: 'On a day: selects and closes.',
              },
            },
            {
              keys: ['←', '→'],
              description: { pt: 'Dia anterior / próximo.', en: 'Previous / next day.' },
            },
            {
              keys: ['↑', '↓'],
              description: {
                pt: 'Mesmo dia da semana anterior / seguinte.',
                en: 'Same day of the previous / next week.',
              },
            },
            {
              keys: ['Home', 'End'],
              description: {
                pt: 'Primeiro / último dia da semana.',
                en: 'First / last day of the week.',
              },
            },
            {
              keys: ['PageUp', 'PageDown'],
              description: { pt: 'Mês anterior / próximo.', en: 'Previous / next month.' },
            },
            {
              keys: ['Shift', 'PageUp'],
              description: {
                pt: 'Ano anterior (Shift + PageDown: próximo ano).',
                en: 'Previous year (Shift + PageDown: next year).',
              },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'Circula entre os botões do cabeçalho, a grade e "Hoje" — o foco fica preso no diálogo.',
                en: 'Cycles through header buttons, the grid and "Today" — focus stays trapped in the dialog.',
              },
            },
            {
              keys: ['Escape'],
              description: {
                pt: 'Fecha sem alterar e devolve o foco ao botão.',
                en: 'Closes without changes and returns focus to the button.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Grade com cabeçalhos de coluna e nomes completos de cada dia.',
                en: 'Grid with column headers and full names for every day.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Toda a seleção funciona pelo teclado, inclusive digitando a data.',
                en: 'Selection works entirely by keyboard, including typing the date.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Foco entra no dia ativo ao abrir e volta ao botão ao fechar.',
                en: 'Focus moves to the active day on open and back to the button on close.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Datas inválidas ou indisponíveis geram mensagem de erro vinculada ao campo.',
                en: 'Invalid or unavailable dates produce an error message linked to the field.',
              },
            },
            {
              criterion: '3.3.2',
              description: {
                pt: 'O formato esperado é anunciado como descrição do campo.',
                en: 'The expected format is announced as the field description.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: (
                  <>
                    Estados expostos com <Code>aria-selected</Code>, <Code>aria-current</Code>,{' '}
                    <Code>aria-disabled</Code> e <Code>aria-expanded</Code>.
                  </>
                ),
                en: (
                  <>
                    States exposed with <Code>aria-selected</Code>, <Code>aria-current</Code>,{' '}
                    <Code>aria-disabled</Code> and <Code>aria-expanded</Code>.
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
