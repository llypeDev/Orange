import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
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
import HourCycle from './examples/HourCycle'
import HourCycleCode from './examples/HourCycle?raw'
import Interval from './examples/Interval'
import IntervalCode from './examples/Interval?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import TimeList from './examples/TimeList'
import TimeListCode from './examples/TimeList?raw'
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
                  O valor é sempre uma string <Code>HH:mm</Code> em 24 horas. Como ele aparece (12
                  horas com AM/PM ou 24 horas) vem do idioma do <Code>OrangeProvider</Code>, não do
                  navegador da pessoa; <Code>hourCycle</Code> força um dos dois.
                </>
              ),
              en: (
                <>
                  The value is always a 24-hour <Code>HH:mm</Code> string. How it is shown (12 hours
                  with AM/PM or 24 hours) comes from the <Code>OrangeProvider</Code> locale, not from
                  the person's browser; <Code>hourCycle</Code> forces one of them.
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <Code>step</Code> (em segundos) quando só alguns horários fazem sentido —{' '}
                  <Code>900</Code> para intervalos de 15 minutos — e informe a regra na{' '}
                  <Code>description</Code>. As setas e a lista seguem o passo.
                </>
              ),
              en: (
                <>
                  Use <Code>step</Code> (in seconds) when only some times make sense —{' '}
                  <Code>900</Code> for 15-minute slots — and state the rule in the{' '}
                  <Code>description</Code>. Arrow keys and the list follow the step.
                </>
              ),
            },
            {
              pt: (
                <>
                  Com <Code>min</Code>, <Code>max</Code> ou <Code>step</Code>, o próprio campo avisa
                  quando o horário digitado fica de fora. Use <Code>error</Code> para as regras do seu
                  negócio; ela substitui o aviso do campo.
                </>
              ),
              en: (
                <>
                  With <Code>min</Code>, <Code>max</Code> or <Code>step</Code>, the field itself warns
                  when the typed time falls outside. Use <Code>error</Code> for your business rules;
                  it replaces the field's warning.
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
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Digite os números, use as setas em cada segmento ou abra a lista pelo relógio.',
            en: 'Type the numbers, use the arrow keys on each segment or open the list from the clock.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Horário comercial', en: 'Business hours' }}
          description={{
            pt: 'As setas andam de 15 em 15 minutos e param em 08:00 e 18:00; a lista só traz os horários válidos; um horário digitado fora disso mostra o aviso do campo.',
            en: 'Arrow keys move in 15-minute steps and stop at 08:00 and 18:00; the list only offers valid times; a typed time outside that shows the field warning.',
          }}
          code={BusinessHoursCode}
        >
          <BusinessHours />
        </Example>
        <Example
          title={{ pt: 'Relógio de 12 ou 24 horas', en: '12 or 24-hour clock' }}
          description={{
            pt: 'Sem hourCycle, vale o idioma do provider: 24 horas em português e espanhol, 12 em inglês americano. O valor continua em 24 horas.',
            en: 'Without hourCycle, the provider locale decides: 24 hours in Portuguese and Spanish, 12 in US English. The value stays in 24 hours.',
          }}
          code={HourCycleCode}
        >
          <HourCycle />
        </Example>
        <Example
          title={{ pt: 'Lista de horários', en: 'List of times' }}
          description={{
            pt: 'O relógio abre uma lista: no intervalo do step quando ele é de 5 minutos ou mais, senão de meia em meia hora. listStep muda o intervalo; false tira o botão.',
            en: 'The clock opens a list: at the step interval when it is 5 minutes or more, otherwise every half hour. listStep changes the interval; false removes the button.',
          }}
          code={TimeListCode}
        >
          <TimeList />
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
            pt: 'Somente leitura, com o aviso do próprio campo (depois do máximo) e desabilitado.',
            en: "Read-only, with the field's own warning (after the maximum) and disabled.",
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
              term: { pt: 'Hover e foco', en: 'Hover and focus' },
              description: {
                pt: 'Borda e anel laranja do campo · fast (160ms), ease-out.',
                en: 'Field border and orange ring · fast (160ms), ease-out.',
              },
            },
            {
              term: { pt: 'Segmento em edição', en: 'Editing segment' },
              description: {
                pt: 'O segmento com foco ganha fundo laranja, com transição · fast.',
                en: 'The focused segment gets an orange background, with a transition · fast.',
              },
            },
            {
              term: { pt: 'Abrir a lista', en: 'Opening the list' },
              description: {
                pt: 'O relógio fica laranja e avança um "tique" (gira 30°) · medium (250ms), ease-spring. A lista entra com opacidade e 4px vindo do campo e sai mais rápido.',
                en: 'The clock turns orange and advances one "tick" (rotates 30°) · medium (250ms), ease-spring. The list enters with opacity and 4px from the field and exits faster.',
              },
            },
            {
              term: { pt: 'Clicar no relógio', en: 'Clicking the clock' },
              description: {
                pt: 'O ícone afunda 1px · press (90ms).',
                en: 'The icon sinks 1px · press (90ms).',
              },
            },
            {
              term: { pt: 'Opção da lista', en: 'List option' },
              description: {
                pt: 'A barra laranja da opção com foco cresce do centro · medium, ease-spring.',
                en: 'The orange bar on the focused option grows from the center · medium, ease-spring.',
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
                pt: "Novo horário, ou '' quando apagado ou ainda incompleto.",
                en: "New time, or '' when cleared or still incomplete.",
              },
            },
            {
              name: 'min / max',
              type: 'string',
              description: {
                pt: 'Limites no formato HH:mm. Com min depois de max, o intervalo atravessa a meia-noite.',
                en: 'Limits in HH:mm format. With min after max, the range crosses midnight.',
              },
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
              name: 'hourCycle',
              type: '12 | 24',
              description: {
                pt: 'Relógio de 12 horas (AM/PM) ou de 24. Padrão: o do idioma do provider.',
                en: '12-hour (AM/PM) or 24-hour clock. Default: the provider locale.',
              },
            },
            {
              name: 'listStep',
              type: 'number | false',
              description: {
                pt: 'Intervalo da lista, em segundos. Padrão: o step, se for de 5 minutos ou mais; senão 30 minutos. false tira o botão e a lista.',
                en: 'List interval, in seconds. Default: step, if it is 5 minutes or more; otherwise 30 minutes. false removes the button and the list.',
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
                pt: 'Mensagem de erro. Substitui os avisos do próprio campo.',
                en: "Error message. Replaces the field's own warnings.",
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
              name: 'ref / ...rest',
              type: 'InputHTMLAttributes',
              description: {
                pt: 'Vão para o <input type="time"> oculto que guarda o valor: name, form, autoFocus, data-*. onFocus, onBlur e onKeyDown valem para o campo inteiro.',
                en: 'Go to the hidden <input type="time"> that holds the value: name, form, autoFocus, data-*. onFocus, onBlur and onKeyDown apply to the whole field.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Formulários', en: 'Forms' }}>
        <p>
          <T
            pt={
              <>
                O valor mora num <Code>&lt;input type="time"&gt;</Code> oculto, que é quem recebe a{' '}
                <Code>ref</Code> e o <Code>name</Code>: o campo entra no envio do formulário, no{' '}
                <Code>FormData</Code> e na validação nativa (<Code>required</Code>,{' '}
                <Code>min</Code>, <Code>max</Code>, <Code>step</Code>) como antes. Um horário pela
                metade conta como inválido, e o envio para no campo. Focar esse input — pelo rótulo,
                por <Code>ref.current.focus()</Code> ou pela validação — leva o foco ao primeiro
                segmento.
              </>
            }
            en={
              <>
                The value lives in a hidden <Code>&lt;input type="time"&gt;</Code>, which receives
                the <Code>ref</Code> and the <Code>name</Code>: the field takes part in form
                submission, <Code>FormData</Code> and native validation (<Code>required</Code>,{' '}
                <Code>min</Code>, <Code>max</Code>, <Code>step</Code>) as before. A half-typed time
                counts as invalid, and submission stops at the field. Focusing that input — through
                the label, <Code>ref.current.focus()</Code> or validation — moves focus to the first
                segment.
              </>
            }
          />
        </p>
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Os segmentos formam um grupo com o nome do campo. Cada um é um{' '}
                <Code>spinbutton</Code> com nome próprio ("hora", "minuto", "segundo", "AM ou PM"),
                valor atual, mínimo e máximo; vazio, anuncia "vazio". Descrição e erro são lidos no
                primeiro segmento. O botão do relógio diz o que faz ("Escolher horário" ou "Alterar
                horário, 09:30") e abre uma <Code>listbox</Code> com o foco no horário escolhido.
              </>
            }
            en={
              <>
                The segments form a group named after the field. Each one is a{' '}
                <Code>spinbutton</Code> with its own name ("hour", "minute", "second", "AM or PM"),
                current, minimum and maximum values; when empty it announces "empty". Description and
                error are read on the first segment. The clock button says what it does ("Choose
                time" or "Change time, 09:30 AM") and opens a <Code>listbox</Code> with focus on the
                chosen time.
              </>
            }
          />
        </p>
        <p>
          <T
            pt="No celular, cada segmento abre o teclado numérico. Essa digitação foi verificada por emulação de toque, não em aparelhos; os anúncios, por testes automáticos, não com leitores de tela."
            en="On phones, each segment opens the numeric keyboard. That typing was verified through touch emulation, not on devices; announcements, through automated tests, not with screen readers."
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Entra no campo, passa pelos segmentos e chega ao botão do relógio.',
                en: 'Enters the field, moves through the segments and reaches the clock button.',
              },
            },
            {
              keys: ['← / →'],
              description: { pt: 'Segmento anterior / próximo.', en: 'Previous / next segment.' },
            },
            {
              keys: ['↑ / ↓'],
              description: {
                pt: 'Aumenta / diminui o segmento no passo, dando a volta, sem sair de min e max.',
                en: 'Increments / decrements the segment by the step, wrapping around, without leaving min and max.',
              },
            },
            {
              keys: ['PageUp / PageDown'],
              description: {
                pt: 'Anda mais: 2 horas, 15 minutos ou 15 segundos.',
                en: 'Moves further: 2 hours, 15 minutes or 15 seconds.',
              },
            },
            {
              keys: ['Home / End'],
              description: {
                pt: 'Primeiro / último valor do segmento.',
                en: 'First / last value of the segment.',
              },
            },
            {
              keys: ['0–9'],
              description: {
                pt: 'Digita o valor; completo, o foco passa para o próximo segmento.',
                en: 'Types the value; once complete, focus moves to the next segment.',
              },
            },
            {
              keys: ['A / P'],
              description: {
                pt: 'No relógio de 12 horas, escolhe AM ou PM.',
                en: 'On the 12-hour clock, picks AM or PM.',
              },
            },
            {
              keys: ['Backspace / Delete'],
              description: {
                pt: 'Apaga o segmento; Backspace num segmento vazio volta ao anterior.',
                en: 'Clears the segment; Backspace on an empty segment goes back to the previous one.',
              },
            },
            {
              keys: ['Ctrl', 'V'],
              description: {
                pt: 'Cola um horário escrito de vários jeitos: 14:30, 14h30, 2:30 pm.',
                en: 'Pastes a time written in several ways: 14:30, 14h30, 2:30 pm.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Nos segmentos, envia o formulário. Na lista, escolhe o horário.',
                en: 'On the segments, submits the form. In the list, picks the time.',
              },
            },
            {
              keys: ['Alt', '↓'],
              description: {
                pt: 'Abre a lista de horários a partir de um segmento.',
                en: 'Opens the list of times from a segment.',
              },
            },
            {
              keys: ['Esc'],
              description: {
                pt: 'Fecha a lista sem escolher e devolve o foco ao relógio. Tab faz o mesmo.',
                en: 'Closes the list without choosing and returns focus to the clock. Tab does the same.',
              },
            },
          ]}
        />
        <p>
          <T
            pt="Na lista: ↑ e ↓ andam entre os horários, PageUp e PageDown pulam oito, Home e End vão aos extremos, e digitar números leva ao horário (14 → 14:00)."
            en="In the list: ↑ and ↓ move between times, PageUp and PageDown jump eight, Home and End go to the ends, and typing numbers jumps to the time (14 → 14:00)."
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Grupo com o nome do campo; descrição e erro ligados por aria-describedby.',
                en: 'Group named after the field; description and error linked via aria-describedby.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Tudo pelo teclado: segmentos, botão e lista.',
                en: 'Everything by keyboard: segments, button and list.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível na borda laranja e no segmento ativo; em alto contraste, com as cores de seleção do sistema.',
                en: 'Visible focus on the orange border and the active segment; in high contrast, with the system selection colors.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Botão do relógio e opções da lista com pelo menos 24px.',
                en: 'Clock button and list options at least 24px.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: (
                  <>
                    Erros com <Code>aria-invalid</Code> e mensagem associada, inclusive os avisos do
                    próprio campo.
                  </>
                ),
                en: (
                  <>
                    Errors with <Code>aria-invalid</Code> and an associated message, including the
                    field's own warnings.
                  </>
                ),
              },
            },
            {
              criterion: '3.3.3',
              description: {
                pt: 'Os avisos dizem como corrigir: o limite ou o intervalo aceito.',
                en: 'Warnings say how to fix it: the accepted limit or interval.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: 'spinbutton com nome e valor; botão com aria-expanded; listbox com a opção escolhida marcada.',
                en: 'spinbutton with name and value; button with aria-expanded; listbox with the chosen option marked.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
