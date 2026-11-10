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
                  ficam desabilitados no calendário e, no dia-limite, as setas da hora param no
                  horário mínimo ou máximo; um horário digitado antes do mínimo mostra "Escolha um
                  horário a partir de 14:00". Regras por dia (horário comercial) vão em{' '}
                  <Code>error</Code>.
                </>
              ),
              en: (
                <>
                  <Code>min</Code> and <Code>max</Code> apply to date <em>and</em> time: days
                  outside are disabled in the calendar and, on the boundary day, the arrow keys on
                  the time stop at the minimum or maximum time; a time typed before the minimum
                  shows "Choose a time at or after 02:00 PM". Per-day rules (business hours) go in{' '}
                  <Code>error</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  A hora usa os mesmos segmentos do {timeField} e fica igual em todos os
                  navegadores. O relógio de 12 horas (com AM/PM) ou de 24 vem do idioma do{' '}
                  <Code>OrangeProvider</Code>, como o formato da data — não do navegador da pessoa.
                  O valor é sempre um <Code>Date</Code>.
                </>
              ),
              en: (
                <>
                  The time uses the same segments as {timeField} and looks the same in every
                  browser. The 12-hour (with AM/PM) or 24-hour clock comes from the{' '}
                  <Code>OrangeProvider</Code> locale, like the date format — not from the person's
                  browser. The value is always a <Code>Date</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  <Code>step</Code> é em segundos (<Code>900</Code> = 15 minutos): as setas da hora
                  andam nesse passo, contado a partir da meia-noite. Um horário digitado fora do
                  passo continua valendo; se só alguns horários servem, use <Code>error</Code> para
                  validar.
                </>
              ),
              en: (
                <>
                  <Code>step</Code> is in seconds (<Code>900</Code> = 15 minutes): the arrow keys on
                  the time move by that step, counted from midnight. A time typed off the step is
                  still accepted; if only some times are valid, use <Code>error</Code> to validate.
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
                pt: 'Segmentos de hora e minuto (mais segundo e AM/PM, quando há), os mesmos do TimeField, com o relógio à esquerda; clicar no relógio ou na área livre leva o foco à hora. Formam um grupo com o nome acessível "Hora".',
                en: 'Hour and minute segments (plus second and AM/PM, when present), the same as TimeField, with the clock on the left; clicking the clock or the free area moves focus to the hour. They form a group with the accessible name "Time".',
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
            pt: 'Digite a data e a hora, ou escolha o dia no calendário pelo botão (ou Alt + ↓ no campo de data). Na hora, os números avançam sozinhos de um segmento para o outro e as setas ↑ e ↓ mudam o valor.',
            en: 'Type the date and time, or choose the day in the calendar with the button (or Alt + ↓ in the date field). In the time, digits advance on their own from one segment to the next and the ↑ and ↓ arrows change the value.',
          }}
          code={BasicCode}
          minHeight={140}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Agendar publicação', en: 'Scheduling a post' }}
          description={{
            pt: 'min em agora e max em 30 dias; step de 15 minutos (as setas da hora andam de 15 em 15); ao escolher um dia sem hora, defaultTime preenche 09:00. Escolha hoje: as setas param no horário mínimo e digitar um horário anterior mostra o aviso.',
            en: 'min set to now and max to 30 days ahead; 15-minute step (the arrow keys on the time move 15 by 15); choosing a day with no time fills 09:00 from defaultTime. Choose today: the arrows stop at the minimum time and typing an earlier one shows the message.',
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
                pt: 'Com o foco num segmento da hora, o relógio fica laranja e avança um "tique" de 30° · medium, ease-spring.',
                en: 'With focus on a time segment, the clock turns orange and advances a 30° "tick" · medium, ease-spring.',
              },
            },
            {
              term: { pt: 'Segmento em edição', en: 'Segment being edited' },
              description: {
                pt: 'O segmento com o foco troca para o fundo laranja · fast (160ms), ease-out.',
                en: 'The focused segment switches to the orange background · fast (160ms), ease-out.',
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
                pt: 'Borda e foco do frame · fast; o relógio acende ao passar o mouse pela hora · fast; o ícone do calendário afunda 1px · press (90ms).',
                en: 'Frame border and focus · fast; the clock lights up when hovering the time · fast; the calendar icon sinks 1px · press (90ms).',
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
                pt: 'Primeiro / último instante permitido (data e hora). No dia do limite, as setas da hora param nele.',
                en: 'First / last allowed instant (date and time). On the boundary day, the arrow keys on the time stop at it.',
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
                pt: 'Intervalo em segundos em que as setas andam na hora, contado a partir da meia-noite. Fora de múltiplos de 60, aparece o segmento dos segundos.',
                en: 'Interval in seconds by which the arrow keys move the time, counted from midnight. Outside multiples of 60, the seconds segment is shown.',
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
                pt: 'Marca a data e a hora como obrigatórias / mostra "(opcional)".',
                en: 'Marks the date and the time as required / shows "(optional)".',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Desabilita a data, a hora e o botão.',
                en: 'Disables the date, the time and the button.',
              },
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Somente leitura: dá para focar e ler, mas nada muda e o calendário não abre.',
                en: 'Read-only: it can be focused and read, but nothing changes and the calendar does not open.',
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
                A data e a hora ficam num <Code>role="group"</Code> nomeado pelo rótulo. A data é um
                campo de texto com nome próprio ("Data"), e o formato dela é anunciado como
                descrição. A hora é um grupo ("Hora") com os mesmos segmentos do TimeField: cada um
                é um <Code>spinbutton</Code> com nome próprio ("hora", "minuto", "segundo", "AM ou
                PM"), valor atual, mínimo e máximo; vazio, anuncia "vazio". A descrição e o erro são
                lidos na data e no primeiro segmento da hora. O calendário abre num diálogo modal
                (padrão <strong>Date Picker Dialog</strong> do WAI-ARIA APG), com a mesma grade do
                DatePicker. A parte com problema recebe <Code>aria-invalid</Code> (a data, quando
                ela é inválida ou indisponível; a hora, quando falta ou sai de min/max).
              </>
            }
            en={
              <>
                The date and the time sit in a <Code>role="group"</Code> named by the label. The
                date is a text field with its own name ("Date"), and its format is announced as the
                description. The time is a group ("Time") with the same segments as TimeField: each
                one is a <Code>spinbutton</Code> with its own name ("hour", "minute", "second", "AM
                or PM"), current, minimum and maximum values; when empty it announces "empty". The
                description and the error are read on the date and on the first time segment. The
                calendar opens in a modal dialog (WAI-ARIA APG <strong>Date Picker Dialog</strong>{' '}
                pattern) with the same grid as DatePicker. The part at fault gets{' '}
                <Code>aria-invalid</Code> (the date when it is invalid or unavailable; the time when
                it is missing or outside min/max).
              </>
            }
          />
        </p>
        <p>
          <T
            pt="No celular, cada segmento da hora abre o teclado numérico. Essa digitação foi verificada por emulação de toque, não em aparelhos; os anúncios, por testes automáticos, não com leitores de tela."
            en="On phones, each time segment opens the numeric keyboard. That typing was verified through touch emulation, not on devices; announcements, through automated tests, not with screen readers."
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Data → botão do calendário → hora → minuto (e os demais segmentos da hora).',
                en: 'Date → calendar button → hour → minute (and the other time segments).',
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
              keys: ['← / →'],
              description: {
                pt: 'Na hora: segmento anterior / próximo.',
                en: 'In the time: previous / next segment.',
              },
            },
            {
              keys: ['↑ / ↓'],
              description: {
                pt: 'Na hora: aumenta / diminui o segmento no step, dando a volta, sem passar do horário-limite no dia de min ou de max.',
                en: 'In the time: increments / decrements the segment by the step, wrapping around, without going past the limit time on the min or max day.',
              },
            },
            {
              keys: ['PageUp / PageDown'],
              description: {
                pt: 'Na hora: anda mais (2 horas, 15 minutos ou 15 segundos). Home e End vão ao primeiro e ao último valor do segmento.',
                en: 'In the time: moves further (2 hours, 15 minutes or 15 seconds). Home and End go to the first and last value of the segment.',
              },
            },
            {
              keys: ['0–9'],
              description: {
                pt: 'Na hora: digita o valor; completo, o foco passa para o próximo segmento. No relógio de 12 horas, A e P escolhem AM ou PM.',
                en: 'In the time: types the value; once complete, focus moves to the next segment. On the 12-hour clock, A and P pick AM or PM.',
              },
            },
            {
              keys: ['Backspace / Delete'],
              description: {
                pt: 'Na hora: apaga o segmento (o valor fica vazio até a hora estar completa); Backspace num segmento vazio volta ao anterior.',
                en: 'In the time: clears the segment (the value stays empty until the time is complete); Backspace on an empty segment goes back to the previous one.',
              },
            },
            {
              keys: ['Ctrl', 'V'],
              description: {
                pt: 'Na hora: cola um horário escrito de vários jeitos (14:30, 14h30, 2:30 pm).',
                en: 'In the time: pastes a time written in several ways (14:30, 14h30, 2:30 pm).',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'No botão: abre o calendário. No dia: seleciona mantendo a hora, fecha e devolve o foco ao botão. Na data e na hora: envia o formulário.',
                en: 'On the button: opens the calendar. On a day: selects it keeping the time, closes and returns focus to the button. In the date and the time: submits the form.',
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
                pt: 'Fecha o calendário sem alterar e devolve o foco ao botão.',
                en: 'Closes the calendar without changes and returns focus to the button.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Grupo rotulado com a data e a hora nomeadas; descrição e erro ligados por aria-describedby.',
                en: 'Labelled group with the date and the time named; description and error linked via aria-describedby.',
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
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível na borda laranja e no segmento ativo da hora; em alto contraste, com as cores de seleção do sistema.',
                en: 'Visible focus on the orange border and the active time segment; in high contrast, with the system selection colors.',
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
                pt: 'O formato da data é anunciado; cada segmento da hora diz o que é ("hora", "minuto") e os limites que aceita.',
                en: 'The date format is announced; each time segment says what it is ("hour", "minute") and the limits it accepts.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
