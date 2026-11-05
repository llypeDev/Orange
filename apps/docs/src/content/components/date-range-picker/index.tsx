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
import { DateRangePicker } from '@orangesys/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import HotelBooking from './examples/HotelBooking'
import HotelBookingCode from './examples/HotelBooking?raw'
import SalesReport from './examples/SalesReport'
import SalesReportCode from './examples/SalesReport?raw'
import TeamVacation from './examples/TeamVacation'
import TeamVacationCode from './examples/TeamVacation?raw'
import Validation from './examples/Validation'
import ValidationCode from './examples/Validation?raw'
import { meta } from './meta'

export default function DateRangePickerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para períodos com início e fim: filtros de relatório, reservas, vigências e férias. Para uma data só, use o DatePicker.',
              en: 'Use it for periods with a start and an end: report filters, bookings, contract terms and vacations. For a single date, use DatePicker.',
            },
            {
              pt: (
                <>
                  Em filtros de relatório, ofereça <Code>presets</Code> ("Últimos 7 dias", "Mês
                  passado") — a maioria das consultas cabe em um clique. Combine com{' '}
                  <Code>max</Code> em hoje para não sugerir datas futuras.
                </>
              ),
              en: (
                <>
                  In report filters, offer <Code>presets</Code> ("Last 7 days", "Last month") —
                  most queries fit in one click. Combine with <Code>max</Code> set to today so
                  future dates are not suggested.
                </>
              ),
            },
            {
              pt: (
                <>
                  <Code>minLength</Code> e <Code>maxLength</Code> contam os dias{' '}
                  <strong>entre</strong> as datas (fim − início), como noites de hospedagem: 10/03
                  → 12/03 = 2. Explique a regra na <Code>description</Code>.
                </>
              ),
              en: (
                <>
                  <Code>minLength</Code> and <Code>maxLength</Code> count the days{' '}
                  <strong>between</strong> the dates (end − start), like hotel nights: 03/10 →
                  03/12 = 2. Explain the rule in the <Code>description</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Fim antes do início, datas inválidas e períodos fora dos limites mostram um erro
                  automático e emitem a ponta como <Code>null</Code>. Use <Code>error</Code> para
                  regras de negócio, como "Informe o início e o fim da vigência".
                </>
              ),
              en: (
                <>
                  End before start, invalid dates and ranges outside the limits show an automatic
                  error and emit that edge as <Code>null</Code>. Use <Code>error</Code> for
                  business rules such as "Enter the start and end of the term".
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <DateRangePicker
              label="Período do relatório"
              description="Até hoje. Use os atalhos para períodos comuns."
            />
          }
          dontExample={<DateRangePicker label="Datas" hideLabel />}
          doItems={[
            {
              pt: 'Rótulo que diz para que serve o período e a regra explicada.',
              en: 'A label that says what the period is for, with the rule explained.',
            },
          ]}
          dontItems={[
            {
              pt: 'Período sem rótulo visível, dependendo só dos placeholders.',
              en: 'A range without a visible label, relying only on the placeholders.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Grupo de campos', en: 'Field group' },
              description: {
                pt: 'Um só controle com role="group", nomeado pelo rótulo. Dentro, "Data inicial" e "Data final", cada um com máscara do idioma.',
                en: 'A single control with role="group", named by the label. Inside, "Start date" and "End date", each with the locale mask.',
              },
            },
            {
              term: { pt: 'Botão de calendário', en: 'Calendar button' },
              description: {
                pt: 'Abre o diálogo. Com período, o nome acessível inclui as datas: "Alterar período, 10 de março de 2026 a 15 de março de 2026".',
                en: 'Opens the dialog. With a range, its accessible name includes the dates: "Change date range, March 10, 2026 to March 15, 2026".',
              },
            },
            {
              term: { pt: 'Atalhos', en: 'Shortcuts' },
              description: {
                pt: 'Lista de botões ao lado do calendário (acima, no celular). O atalho do período atual fica marcado; os que violam min/max ou o comprimento ficam desabilitados.',
                en: 'List of buttons beside the calendar (above it on mobile). The shortcut matching the current range is marked; those breaking min/max or the length are disabled.',
              },
            },
            {
              term: { pt: 'Calendário (RangeCalendar)', en: 'Calendar (RangeCalendar)' },
              description: {
                pt: 'Dois meses em telas largas, um no celular. Início e fim preenchidos em laranja com cantos próprios (superior esquerdo / inferior direito); a faixa entre eles é preenchida em laranja suave; a prévia tem bordas tracejadas.',
                en: 'Two months on wide screens, one on mobile. Start and end are filled in orange with their own corners (top-left / bottom-right); the band between them is soft orange; the preview has dashed edges.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Digite as duas datas ou abra o calendário pelo botão (ou Alt + ↓ em qualquer campo).',
            en: 'Type both dates or open the calendar with the button (or Alt + ↓ in either field).',
          }}
          code={BasicCode}
          minHeight={140}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Filtro de relatório com atalhos', en: 'Report filter with shortcuts' }}
          description={{
            pt: 'Atalhos prontos (chaves como "last7Days") e um próprio ({ label, range }); max em hoje desabilita o futuro.',
            en: 'Built-in shortcuts (keys such as "last7Days") and a custom one ({ label, range }); max set to today disables the future.',
          }}
          code={SalesReportCode}
          minHeight={160}
        >
          <SalesReport />
        </Example>
        <Example
          title={{ pt: 'Reserva de hotel', en: 'Hotel booking' }}
          description={{
            pt: 'min em hoje bloqueia datas passadas; minLength 1 exige pelo menos uma noite e maxLength 14 limita a estadia. Depois do check-in, as datas fora da regra ficam desabilitadas.',
            en: 'min set to today blocks past dates; minLength 1 requires at least one night and maxLength 14 caps the stay. After check-in, dates outside the rule are disabled.',
          }}
          code={HotelBookingCode}
          minHeight={160}
        >
          <HotelBooking />
        </Example>
        <Example
          title={{ pt: 'Validação e estados', en: 'Validation and states' }}
          description={{
            pt: 'Erro de negócio via error ao enviar, erro automático de ordem, somente leitura e desabilitado. Com name, o formulário recebe vigencia[start] e vigencia[end] como aaaa-mm-dd.',
            en: 'Business error via error on submit, automatic order error, read-only and disabled. With name, the form receives vigencia[start] and vigencia[end] as yyyy-mm-dd.',
          }}
          code={ValidationCode}
        >
          <Validation />
        </Example>
        <Example
          title={{ pt: 'RangeCalendar standalone', en: 'Standalone RangeCalendar' }}
          description={{
            pt: 'A grade de período também é exportada para painéis e agendas, com a mesma navegação por teclado. Aqui, férias que começam e terminam em dias úteis.',
            en: 'The range grid is also exported for panels and agendas, with the same keyboard navigation. Here, a vacation that starts and ends on business days.',
          }}
          code={TeamVacationCode}
        >
          <TeamVacation />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Abrir o calendário', en: 'Opening the calendar' },
              description: {
                pt: 'Igual ao DatePicker: o diálogo entra com opacidade, 4px vindos do lado do campo e escala 0,98 → 1 · medium (250ms), ease-out.',
                en: 'Same as DatePicker: the dialog enters with opacity, 4px from the field side and 0.98 → 1 scale · medium (250ms), ease-out.',
              },
            },
            {
              term: { pt: 'Fechar', en: 'Closing' },
              description: {
                pt: 'Sai mais rápido pelo mesmo lado e fica inerte durante a saída (usePresence) · fast (160ms), ease-in-out.',
                en: 'Exits faster towards the same side and is inert while leaving (usePresence) · fast (160ms), ease-in-out.',
              },
            },
            {
              term: { pt: 'Prévia da faixa', en: 'Range preview' },
              description: {
                pt: 'Depois do início, cada dia que entra na faixa se preenche com scaleX 0 → 1 a partir do lado do início (da direita, se a prévia for para trás) · fast, ease-out.',
                en: 'After the start, each day joining the band fills with scaleX 0 → 1 from the start side (from the right when previewing backwards) · fast, ease-out.',
              },
            },
            {
              term: { pt: 'Marcar início e fim', en: 'Marking start and end' },
              description: {
                pt: 'A ponta escolhida entra com or-scale-in (0,6 → 1, com overshoot) · medium, ease-bounce. O atalho do período atual ganha o marcador quadrado com o mesmo pop.',
                en: 'The chosen edge enters with or-scale-in (0.6 → 1, with overshoot) · medium, ease-bounce. The current-range shortcut gets the square marker with the same pop.',
              },
            },
            {
              term: { pt: 'Trocar de mês', en: 'Changing month' },
              description: {
                pt: 'Como no Calendar: as grades deslizam 16px na direção com fade e os títulos fazem crossfade · medium, ease-out.',
                en: 'As in Calendar: the grids slide 16px in the direction with a fade and the titles crossfade · medium, ease-out.',
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
                pt: 'Fundo e cor dos dias, atalhos e botões · fast; dias, atalhos e o ícone do calendário afundam 1px · press (90ms).',
                en: 'Day, shortcut and button background and color · fast; days, shortcuts and the calendar icon sink 1px · press (90ms).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Os tokens viram 0: a faixa, as pontas e o diálogo aparecem na hora — forma, cor e texto continuam indicando o estado.',
                en: 'Tokens become 0: the band, the edges and the dialog appear instantly — shape, color and text still indicate the state.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'DateRangePicker', en: 'DateRangePicker' }}
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              description: {
                pt: 'Rótulo visível; também nomeia o grupo dos dois campos.',
                en: 'Visible label; also names the group of both fields.',
              },
            },
            {
              name: 'value',
              type: '{ start: Date | null; end: Date | null }',
              description: { pt: 'Período (controlado).', en: 'Range (controlled).' },
            },
            {
              name: 'defaultValue',
              type: 'DateRange',
              default: '{ start: null, end: null }',
              description: { pt: 'Período inicial (não controlado).', en: 'Initial range (uncontrolled).' },
            },
            {
              name: 'onChange',
              type: '(range: DateRange) => void',
              description: {
                pt: 'Novo período. Pontas vazias, incompletas, inválidas ou indisponíveis vêm como null; o fim também vem null se quebrar a ordem ou o comprimento.',
                en: 'New range. Empty, incomplete, invalid or unavailable edges come as null; the end also comes as null when it breaks the order or the length.',
              },
            },
            {
              name: 'presets',
              type: "(DateRangePreset | DateRangePresetKey)[]",
              description: {
                pt: (
                  <>
                    Atalhos ao lado do calendário. Chaves prontas: <Code>today</Code>,{' '}
                    <Code>last7Days</Code>, <Code>last30Days</Code>, <Code>thisWeek</Code>,{' '}
                    <Code>thisMonth</Code>, <Code>lastMonth</Code>, <Code>thisYear</Code> ("esta
                    semana/mês/ano" vão até hoje). Ou <Code>{'{ label, range: () => ({ start, end }) }'}</Code>.
                  </>
                ),
                en: (
                  <>
                    Shortcuts beside the calendar. Built-in keys: <Code>today</Code>,{' '}
                    <Code>last7Days</Code>, <Code>last30Days</Code>, <Code>thisWeek</Code>,{' '}
                    <Code>thisMonth</Code>, <Code>lastMonth</Code>, <Code>thisYear</Code> ("this
                    week/month/year" end today). Or <Code>{'{ label, range: () => ({ start, end }) }'}</Code>.
                  </>
                ),
              },
            },
            {
              name: 'min / max',
              type: 'Date',
              description: { pt: 'Primeira e última data permitidas.', en: 'First and last allowed dates.' },
            },
            {
              name: 'isDateDisabled',
              type: '(date: Date) => boolean',
              description: {
                pt: 'Desabilita datas como início ou fim (podem ficar no meio do período).',
                en: 'Disables dates as start or end (they may sit inside the range).',
              },
            },
            {
              name: 'minLength / maxLength',
              type: 'number',
              description: {
                pt: 'Dias entre início e fim (fim − início). No calendário, desabilitam as datas fora da regra depois do início.',
                en: 'Days between start and end (end − start). In the calendar, they disable dates outside the rule after the start.',
              },
            },
            {
              name: 'visibleMonths',
              type: '1 | 2',
              default: '2',
              description: {
                pt: 'Meses lado a lado no calendário; abaixo de 768px, sempre 1.',
                en: 'Months side by side in the calendar; below 768px, always 1.',
              },
            },
            {
              name: 'weekStartsOn',
              type: '0 | 1 | … | 6',
              default: '0',
              description: { pt: 'Primeiro dia da semana (0 = domingo).', en: 'First day of the week (0 = Sunday).' },
            },
            {
              name: 'name',
              type: 'string',
              description: {
                pt: (
                  <>
                    Envia dois inputs ocultos, <Code>name[start]</Code> e <Code>name[end]</Code>,
                    em <Code>aaaa-mm-dd</Code> (vazios enquanto a ponta for inválida).
                  </>
                ),
                en: (
                  <>
                    Submits two hidden inputs, <Code>name[start]</Code> and <Code>name[end]</Code>,
                    as <Code>yyyy-mm-dd</Code> (empty while that edge is invalid).
                  </>
                ),
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
              description: { pt: 'Erro; substitui a validação interna.', en: 'Error; overrides built-in validation.' },
            },
            {
              name: 'required / disabled / readOnly',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Aplicados aos dois campos; somente leitura e desabilitado não abrem o calendário.',
                en: 'Applied to both fields; read-only and disabled do not open the calendar.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Altura do controle.', en: 'Control height.' },
            },
            {
              name: 'open / defaultOpen / onOpenChange',
              type: 'boolean / (open) => void',
              description: { pt: 'Estado do calendário.', en: 'Calendar open state.' },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Atributos do grupo (role="group"), que também recebe a ref.',
                en: 'Attributes of the group (role="group"), which also receives the ref.',
              },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'RangeCalendar', en: 'RangeCalendar' }}
          rows={[
            {
              name: 'value / defaultValue',
              type: 'DateRange | null',
              description: {
                pt: 'Período exibido. Com só o início, o calendário já espera a data final.',
                en: 'Displayed range. With only a start, the calendar waits for the end date.',
              },
            },
            {
              name: 'onChange',
              type: '(range: { start: Date; end: Date }) => void',
              description: {
                pt: 'Chamado quando o período fica completo (2º clique, Enter ou Espaço).',
                en: 'Called when the range is complete (2nd click, Enter or Space).',
              },
            },
            {
              name: 'visibleMonths',
              type: '1 | 2',
              default: '1',
              description: {
                pt: 'Meses lado a lado (1 abaixo de 768px).',
                en: 'Months side by side (1 below 768px).',
              },
            },
            {
              name: 'defaultMonth',
              type: 'Date',
              default: 'hoje',
              description: { pt: 'Mês exibido quando não há valor.', en: 'Month shown when there is no value.' },
            },
            {
              name: 'min / max / isDateDisabled',
              type: 'Date / (date) => boolean',
              description: { pt: 'Datas indisponíveis; o foco não sai de [min, max].', en: 'Unavailable dates; focus stays within [min, max].' },
            },
            {
              name: 'minLength / maxLength',
              type: 'number',
              description: { pt: 'Comprimento em dias entre as pontas.', en: 'Length in days between the edges.' },
            },
            {
              name: 'weekStartsOn / autoFocus',
              type: '0 … 6 / boolean',
              description: { pt: 'Primeiro dia da semana; focar o dia ativo ao montar.', en: 'First day of the week; focus the active day on mount.' },
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
                nome próprio ("Data inicial", "Data final") e o formato como descrição. O
                calendário abre num diálogo modal (padrão <strong>Date Picker Dialog</strong> do
                WAI-ARIA APG). Cada mês é uma <Code>role="grid"</Code> com{' '}
                <Code>aria-multiselectable</Code>; todos os dias do período têm{' '}
                <Code>aria-selected</Code>, e início e fim têm descrição acessível "início"/"fim"
                além da forma própria — a cor nunca é a única pista. Escolhas e o período final são
                anunciados numa região <Code>role="status"</Code>.
              </>
            }
            en={
              <>
                Both fields sit in a <Code>role="group"</Code> named by the label, each with its
                own name ("Start date", "End date") and the format as description. The calendar
                opens in a modal dialog (WAI-ARIA APG <strong>Date Picker Dialog</strong> pattern).
                Each month is a <Code>role="grid"</Code> with <Code>aria-multiselectable</Code>;
                every day in the range has <Code>aria-selected</Code>, and start and end carry an
                accessible "start"/"end" description besides their own shape — color is never the
                only cue. Choices and the final range are announced in a <Code>role="status"</Code>{' '}
                region.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Alt', '↓'],
              description: { pt: 'Em qualquer campo: abre o calendário.', en: 'In either field: opens the calendar.' },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'No dia: 1º marca o início, 2º marca o fim, fecha e devolve o foco ao botão.',
                en: 'On a day: 1st marks the start, 2nd marks the end, closes and returns focus to the button.',
              },
            },
            {
              keys: ['Space'],
              description: { pt: 'No dia: igual ao Enter.', en: 'On a day: same as Enter.' },
            },
            {
              keys: ['←', '→', '↑', '↓'],
              description: {
                pt: 'Dia anterior / próximo / semana anterior / seguinte; com o início marcado, a prévia acompanha o foco.',
                en: 'Previous / next day / previous / next week; with the start marked, the preview follows focus.',
              },
            },
            {
              keys: ['Home', 'End'],
              description: { pt: 'Primeiro / último dia da semana.', en: 'First / last day of the week.' },
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
                pt: 'Circula entre atalhos, botões de mês e a grade — o foco fica preso no diálogo.',
                en: 'Cycles through shortcuts, month buttons and the grid — focus stays trapped in the dialog.',
              },
            },
            {
              keys: ['Escape'],
              description: {
                pt: 'Fecha sem alterar e devolve o foco ao botão (no RangeCalendar sozinho, cancela o início pendente).',
                en: 'Closes without changes and returns focus to the button (in a standalone RangeCalendar, cancels the pending start).',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Grupo rotulado para os dois campos e grades com cabeçalhos e nomes completos de cada dia.',
                en: 'Labelled group for both fields and grids with headers and full names for every day.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Início e fim se distinguem pela forma (cantos) e pela descrição, não só pela cor.',
                en: 'Start and end differ by shape (corners) and description, not only by color.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Um mês só e atalhos que quebram linha em telas estreitas: sem rolagem horizontal em 320px.',
                en: 'A single month and wrapping shortcuts on narrow screens: no horizontal scrolling at 320px.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Toda a seleção funciona pelo teclado, inclusive digitando as datas.',
                en: 'Selection works entirely by keyboard, including typing the dates.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'O foco entra no dia ativo ao abrir e volta ao botão ao fechar.',
                en: 'Focus moves to the active day on open and back to the button on close.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Fim antes do início, datas inválidas e comprimentos fora da regra geram mensagem vinculada aos campos.',
                en: 'End before start, invalid dates and out-of-rule lengths produce a message linked to the fields.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'O início escolhido e o período selecionado são anunciados numa região de status.',
                en: 'The chosen start and the selected range are announced in a status region.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
