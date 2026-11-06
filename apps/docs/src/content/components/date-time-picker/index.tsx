import { Link } from 'react-router-dom'
import { T, useLang } from '../../../i18n'
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
import { DateTimePicker } from '@orangesys/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import BusinessHours from './examples/BusinessHours'
import BusinessHoursCode from './examples/BusinessHours?raw'
import FormSubmit from './examples/FormSubmit'
import FormSubmitCode from './examples/FormSubmit?raw'
import Publication from './examples/Publication'
import PublicationCode from './examples/Publication?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import { meta } from './meta'

export default function DateTimePickerPage() {
  const { to } = useLang()
  const datePicker = <Link to={to('/components/date-picker')}>DatePicker</Link>
  const timeField = <Link to={to('/components/time-field')}>TimeField</Link>

  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use quando o horário faz parte da decisão: agendar uma publicação, marcar uma
                  reunião, programar uma manutenção. Só a data? Use o {datePicker}. Só a hora? Use o{' '}
                  {timeField}.
                </>
              ),
              en: (
                <>
                  Use it when the time is part of the decision: scheduling a post, booking a
                  meeting, planning maintenance. Date only? Use {datePicker}. Time only? Use{' '}
                  {timeField}.
                </>
              ),
            },
            {
              pt: (
                <>
                  O valor é um <Code>Date</Code> em hora local. Ele só existe com data e hora
                  completas: enquanto um dos campos estiver vazio, incompleto ou fora das regras, o{' '}
                  <Code>onChange</Code> recebe <Code>null</Code>. Diga o fuso na{' '}
                  <Code>description</Code> quando ele importar ("Horário de Brasília").
                </>
              ),
              en: (
                <>
                  The value is a <Code>Date</Code> in local time. It only exists with a complete
                  date and time: while either field is empty, incomplete or breaks the rules,{' '}
                  <Code>onChange</Code> receives <Code>null</Code>. State the time zone in the{' '}
                  <Code>description</Code> when it matters ("Brasília time").
                </>
              ),
            },
            {
              pt: (
                <>
                  Escolher um dia no calendário mantém a hora digitada. Com a hora vazia, passe{' '}
                  <Code>defaultTime</Code> (ex.: <Code>'09:00'</Code>) quando houver um horário
                  típico; sem ele, a hora fica vazia para a pessoa preencher.
                </>
              ),
              en: (
                <>
                  Choosing a day in the calendar keeps the typed time. When the time is empty, pass{' '}
                  <Code>defaultTime</Code> (e.g. <Code>'09:00'</Code>) if there is a typical time;
                  without it, the time stays empty for the person to fill in.
                </>
              ),
            },
            {
              pt: (
                <>
                  <Code>min</Code> e <Code>max</Code> valem para data <em>e</em> hora: dias fora
                  ficam desabilitados no calendário e, no dia-limite, um horário antes do mínimo
                  mostra "Escolha um horário a partir de 14:00". Regras por dia (horário comercial)
                  vão em <Code>error</Code>.
                </>
              ),
              en: (
                <>
                  <Code>min</Code> and <Code>max</Code> apply to date <em>and</em> time: days
                  outside are disabled in the calendar and, on the boundary day, a time before the
                  minimum shows "Choose a time at or after 2:00 PM". Per-day rules (business hours)
                  go in <Code>error</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Como no {timeField}, <Code>step</Code> é em segundos (<Code>900</Code> = 15
                  minutos) e a hora aparece em 12h ou 24h conforme o sistema da pessoa.
                </>
              ),
              en: (
                <>
                  As in {timeField}, <Code>step</Code> is in seconds (<Code>900</Code> = 15 minutes)
                  and the time shows in 12h or 24h following the person's system.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <DateTimePicker
              label="Agendar publicação"
              description="Horário de Brasília, nos próximos 30 dias."
            />
          }
          dontExample={<DateTimePicker label="Data" hideLabel />}
          doItems={[
            {
              pt: 'Um rótulo para o par data e hora, com o fuso e a regra explicados.',
              en: 'One label for the date and time pair, with the time zone and the rule explained.',
            },
          ]}
          dontItems={[
            {
              pt: 'Campo sem rótulo visível — ou um DatePicker e um TimeField soltos, com dois rótulos para um só valor.',
              en: 'A field without a visible label — or a loose DatePicker and TimeField, with two labels for a single value.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Grupo', en: 'Group' },
              description: {
                pt: 'Um só controle com role="group", nomeado pelo rótulo. O clique no rótulo leva ao campo de data.',
                en: 'A single control with role="group", named by the label. Clicking the label moves to the date field.',
              },
            },
            {
              term: { pt: 'Data', en: 'Date' },
              description: {
                pt: 'Campo de texto com a máscara do idioma, igual ao do DatePicker ("5/3" vira "05/03"). Nome acessível "Data".',
                en: 'Text field with the locale mask, the same as DatePicker ("5/3" becomes "05/03"). Accessible name "Date".',
              },
            },
            {
              term: { pt: 'Botão de calendário', en: 'Calendar button' },
              description: {
                pt: 'Logo depois da data. Abre o diálogo; com um dia preenchido, o nome inclui a data: "Alterar data, sexta-feira, 13 de novembro de 2026".',
                en: 'Right after the date. Opens the dialog; with a day filled in, its name includes the date: "Change date, Friday, November 13, 2026".',
              },
            },
            {
              term: { pt: 'Hora', en: 'Time' },
              description: {
                pt: 'O <input type="time"> nativo, como no TimeField, com o relógio à esquerda (no mouse, abre o seletor do navegador). Nome acessível "Hora".',
                en: 'The native <input type="time">, as in TimeField, with the clock on the left (with a mouse, it opens the browser picker). Accessible name "Time".',
              },
            },
            {
              term: { pt: 'Telas estreitas', en: 'Narrow screens' },
              description: {
                pt: 'Sem espaço para os dois lado a lado (≈ 320px), a hora desce para uma segunda linha dentro da mesma moldura, separada por um divisor.',
                en: 'Without room for both side by side (≈ 320px), the time moves to a second line inside the same frame, separated by a divider.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Digite a data e a hora, ou escolha o dia no calendário pelo botão (ou Alt + ↓ no campo de data).',
            en: 'Type the date and time, or choose the day in the calendar with the button (or Alt + ↓ in the date field).',
          }}
          code={BasicCode}
          minHeight={140}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Agendar publicação', en: 'Scheduling a post' }}
          description={{
            pt: 'min em agora e max em 30 dias; step de 15 minutos; ao escolher um dia sem hora, defaultTime preenche 09:00. Escolha hoje para ver o aviso de horário mínimo.',
            en: 'min set to now and max to 30 days ahead; 15-minute step; choosing a day with no time fills 09:00 from defaultTime. Choose today to see the minimum-time message.',
          }}
          code={PublicationCode}
          minHeight={160}
        >
          <Publication />
        </Example>
        <Example
          title={{ pt: 'Horário comercial', en: 'Business hours' }}
          description={{
            pt: 'Fins de semana desabilitados com isDateDisabled e a regra das 08:00 às 17:30 validada pela aplicação em error.',
            en: 'Weekends disabled with isDateDisabled and the 8:00 AM to 5:30 PM rule validated by the app through error.',
          }}
          code={BusinessHoursCode}
          minHeight={160}
        >
          <BusinessHours />
        </Example>
        <Example
          title={{ pt: 'No Form', en: 'In a Form' }}
          description={{
            pt: 'Com name, o valor vai num input oculto como aaaa-mm-ddTHH:mm (hora local, o formato do datetime-local). O link do resumo de erros foca o campo de data.',
            en: 'With name, the value goes in a hidden input as yyyy-mm-ddTHH:mm (local time, the datetime-local format). The error summary link focuses the date field.',
          }}
          code={FormSubmitCode}
        >
          <FormSubmit />
        </Example>
        <Example
          title={{ pt: 'Estados', en: 'States' }}
          description={{
            pt: 'Somente leitura, erro de negócio via error e desabilitado (no tamanho sm).',
            en: 'Read-only, business error via error and disabled (in the sm size).',
          }}
          code={StatesCode}
        >
          <States />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Abrir e fechar o calendário', en: 'Opening and closing the calendar' },
              description: {
                pt: 'Igual ao DatePicker: o diálogo entra com opacidade, 4px vindos do lado do campo e escala 0,98 → 1 · medium (250ms), ease-out; sai mais rápido e inerte · fast (160ms), ease-in-out.',
                en: 'Same as DatePicker: the dialog enters with opacity, 4px from the field side and 0.98 → 1 scale · medium (250ms), ease-out; it exits faster and inert · fast (160ms), ease-in-out.',
              },
            },
            {
              term: { pt: 'Calendário', en: 'Calendar' },
              description: {
                pt: 'O mesmo Calendar: a grade desliza ao trocar de mês e o dia escolhido faz pop · medium.',
                en: 'The same Calendar: the grid slides when the month changes and the chosen day pops · medium.',
              },
            },
            {
              term: { pt: 'Relógio', en: 'Clock' },
              description: {
                pt: 'Como no TimeField: com o foco na hora, o relógio fica laranja e avança um "tique" de 30° · medium, ease-spring.',
                en: 'As in TimeField: with focus on the time, the clock turns orange and advances a 30° "tick" · medium, ease-spring.',
              },
            },
            {
              term: { pt: 'Erro de validação', en: 'Validation error' },
              description: {
                pt: 'O controle treme uma vez quando a mensagem surge (or-shake) · slow (400ms).',
                en: 'The control shakes once when the message appears (or-shake) · slow (400ms).',
              },
            },
            {
              term: { pt: 'Hover, foco e pressionar', en: 'Hover, focus and press' },
              description: {
                pt: 'Borda e foco do frame · fast; o ícone do calendário e o relógio afundam 1px · press (90ms).',
                en: 'Frame border and focus · fast; the calendar icon and the clock sink 1px · press (90ms).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Os tokens viram 0: tudo muda na hora — borda, cor e texto continuam indicando o estado.',
                en: 'Tokens become 0: everything changes instantly — border, color and text still indicate the state.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'DateTimePicker', en: 'DateTimePicker' }}
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              description: {
                pt: 'Rótulo visível; também nomeia o grupo.',
                en: 'Visible label; also names the group.',
              },
            },
            {
              name: 'value',
              type: 'Date | null',
              description: {
                pt: 'Data e hora em hora local (controlado).',
                en: 'Date and time in local time (controlled).',
              },
            },
            {
              name: 'defaultValue',
              type: 'Date | null',
              default: 'null',
              description: {
                pt: 'Data e hora iniciais (não controlado).',
                en: 'Initial date and time (uncontrolled).',
              },
            },
            {
              name: 'onChange',
              type: '(date: Date | null) => void',
              description: {
                pt: 'Nova data e hora, ou null quando a data ou a hora fica vazia, incompleta, inválida ou fora de min/max.',
                en: 'New date and time, or null when the date or time is empty, incomplete, invalid or outside min/max.',
              },
            },
            {
              name: 'min / max',
              type: 'Date',
              description: {
                pt: 'Primeiro / último instante permitido (data e hora).',
                en: 'First / last allowed instant (date and time).',
              },
            },
            {
              name: 'isDateDisabled',
              type: '(date: Date) => boolean',
              description: { pt: 'Desabilita dias específicos.', en: 'Disables specific days.' },
            },
            {
              name: 'step',
              type: 'number',
              default: '60',
              description: {
                pt: 'Intervalo em segundos entre horários, como no TimeField. Fora de múltiplos de 60, mostra os segundos.',
                en: 'Interval in seconds between times, as in TimeField. Outside multiples of 60, seconds are shown.',
              },
            },
            {
              name: 'defaultTime',
              type: 'string',
              description: {
                pt: (
                  <>
                    Hora (<Code>HH:mm</Code>) aplicada ao escolher um dia no calendário com a hora
                    vazia.
                  </>
                ),
                en: (
                  <>
                    Time (<Code>HH:mm</Code>) applied when a day is chosen in the calendar and the
                    time is empty.
                  </>
                ),
              },
            },
            {
              name: 'weekStartsOn',
              type: '0 | 1 | … | 6',
              default: '0',
              description: {
                pt: 'Primeiro dia da semana no calendário (0 = domingo).',
                en: 'First day of the week in the calendar (0 = Sunday).',
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
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Estado inválido sem mensagem (erro mostrado em outro lugar).',
                en: 'Invalid state without a message (error shown elsewhere).',
              },
            },
            {
              name: 'required / optional',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Marca os dois campos como obrigatórios / mostra "(opcional)".',
                en: 'Marks both fields as required / shows "(optional)".',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Desabilita os campos e o botão.',
                en: 'Disables the fields and the button.',
              },
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
              description: {
                pt: 'Altura de cada linha do campo.',
                en: 'Height of each field line.',
              },
            },
            {
              name: 'placeholder',
              type: 'string',
              default: "'dd/mm/aaaa'",
              description: {
                pt: 'Placeholder da data. Padrão: o formato do idioma.',
                en: 'Date placeholder. Default: the locale format.',
              },
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
                    Envia o valor em um input oculto como <Code>aaaa-mm-ddTHH:mm</Code> (hora local,
                    com <Code>:ss</Code> quando o step pede segundos); vazio sem valor.
                  </>
                ),
                en: (
                  <>
                    Submits the value in a hidden input as <Code>yyyy-mm-ddTHH:mm</Code> (local
                    time, with <Code>:ss</Code> when step needs seconds); empty without a value.
                  </>
                ),
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Atributos do grupo (que também recebe a ref).',
                en: 'Attributes of the group (which also receives the ref).',
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
                Os dois campos ficam num <Code>role="group"</Code> nomeado pelo rótulo, cada um com
                nome próprio ("Data", "Hora"); a descrição e o erro valem para os dois, e o formato
                da data é anunciado como descrição do campo de data. O calendário abre num diálogo
                modal (padrão <strong>Date Picker Dialog</strong> do WAI-ARIA APG), com a mesma
                grade do DatePicker. A hora usa o <Code>&lt;input type="time"&gt;</Code> nativo:
                cada segmento é anunciado e editável pelo teclado. O campo com problema recebe{' '}
                <Code>aria-invalid</Code> (a data, quando ela é inválida ou indisponível; a hora,
                quando falta ou sai de min/max).
              </>
            }
            en={
              <>
                Both fields sit in a <Code>role="group"</Code> named by the label, each with its own
                name ("Date", "Time"); the description and the error apply to both, and the date
                format is announced as the date field description. The calendar opens in a modal
                dialog (WAI-ARIA APG <strong>Date Picker Dialog</strong> pattern) with the same grid
                as DatePicker. The time uses the native <Code>&lt;input type="time"&gt;</Code>: each
                segment is announced and keyboard-editable. The field at fault gets{' '}
                <Code>aria-invalid</Code> (the date when it is invalid or unavailable; the time when
                it is missing or outside min/max).
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Data → botão do calendário → hora (e entre os segmentos da hora).',
                en: 'Date → calendar button → time (and between the time segments).',
              },
            },
            {
              keys: ['Alt', '↓'],
              description: {
                pt: 'No campo de data: abre o calendário.',
                en: 'In the date field: opens the calendar.',
              },
            },
            {
              keys: ['↑', '↓'],
              description: {
                pt: 'Na hora: aumenta / diminui o segmento respeitando o step.',
                en: 'In the time: increments / decrements the segment respecting step.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'No botão: abre o calendário. No dia: seleciona mantendo a hora, fecha e devolve o foco ao botão.',
                en: 'On the button: opens the calendar. On a day: selects it keeping the time, closes and returns focus to the button.',
              },
            },
            {
              keys: ['←', '→', '↑', '↓'],
              description: {
                pt: 'Na grade: dia anterior / próximo / semana anterior / seguinte.',
                en: 'In the grid: previous / next day / previous / next week.',
              },
            },
            {
              keys: ['PageUp', 'PageDown'],
              description: {
                pt: 'Na grade: mês anterior / próximo (com Shift, ano).',
                en: 'In the grid: previous / next month (with Shift, year).',
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
                pt: 'Grupo rotulado com dois campos nomeados; descrição e erro ligados por aria-describedby.',
                en: 'Labelled group with two named fields; description and error linked via aria-describedby.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Em 320px a hora desce para uma segunda linha: sem rolagem horizontal.',
                en: 'At 320px the time moves to a second line: no horizontal scrolling.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Tudo funciona pelo teclado, inclusive digitando a data e a hora.',
                en: 'Everything works by keyboard, including typing the date and time.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'A ordem de foco segue a ordem visual nos dois layouts; o foco volta ao botão ao fechar o calendário.',
                en: 'Focus order follows the visual order in both layouts; focus returns to the button when the calendar closes.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Data inválida ou indisponível, hora fora do intervalo e campo deixado vazio geram mensagem vinculada.',
                en: 'Invalid or unavailable dates, out-of-range times and a field left empty produce a linked message.',
              },
            },
            {
              criterion: '3.3.2',
              description: {
                pt: 'O formato da data é anunciado; a hora usa o formato do sistema.',
                en: 'The date format is announced; the time uses the system format.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
