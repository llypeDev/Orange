import { SaveStatus } from '@orangesys/ui'
import { T } from '../../../i18n'
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
import Autosave from './examples/Autosave'
import AutosaveCode from './examples/Autosave?raw'
import CustomLabels from './examples/CustomLabels'
import CustomLabelsCode from './examples/CustomLabels?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import Toolbar from './examples/Toolbar'
import ToolbarCode from './examples/Toolbar?raw'
import { meta } from './meta'

const tresMinutosAtras = new Date(Date.now() - 3 * 60_000)

export default function SaveStatusPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use em telas que salvam sozinhas (editores, formulários longos, configurações). Onde há um botão Salvar, o próprio botão mostra o carregamento e um Toast confirma.',
              en: 'Use it on screens that save on their own (editors, long forms, settings). Where there is a Save button, the button shows the loading state and a Toast confirms.',
            },
            {
              pt: (
                <>
                  Posicione perto do que está sendo salvo — no cabeçalho do documento ou embaixo do
                  campo — e sempre no mesmo lugar. Passe <Code>savedAt</Code>: “Salvo há 2 min.”
                  tranquiliza mais do que “Salvo”.
                </>
              ),
              en: (
                <>
                  Place it near what is being saved — in the document header or below the field —
                  and always in the same spot. Pass <Code>savedAt</Code>: “Saved 2 min. ago”
                  reassures more than “Saved”.
                </>
              ),
            },
            {
              pt: (
                <>
                  Em erro, passe <Code>onRetry</Code> e mantenha o que a pessoa digitou na tela. Não
                  apague o conteúdo nem mova o foco para o botão.
                </>
              ),
              en: (
                <>
                  On error, pass <Code>onRetry</Code> and keep what people typed on screen. Don’t
                  clear the content or move focus to the button.
                </>
              ),
            },
            {
              pt: 'Mude o status pelo ciclo real do salvamento (idle → saving → saved | error): cada transição para saved ou error é anunciada uma vez.',
              en: 'Drive the status from the real save cycle (idle → saving → saved | error): each transition to saved or error is announced once.',
            },
          ]}
        />
        <DoDont
          doExample={<SaveStatus status="saved" savedAt={tresMinutosAtras} />}
          dontExample={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                aria-hidden="true"
                style={{ width: 8, height: 8, background: 'var(--or-color-success)' }}
              />
            </span>
          }
          doItems={[
            {
              pt: 'Ícone + texto + quando foi salvo.',
              en: 'Icon + text + when it was saved.',
            },
          ]}
          dontItems={[
            {
              pt: 'Só um ponto colorido ou só uma animação: cor e movimento não podem ser a única pista.',
              en: 'Just a colored dot or just an animation: color and motion can’t be the only cue.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Estados', en: 'States' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'idle', en: 'idle' },
              description: {
                pt: 'Nada para salvar ainda. Vazio por padrão (ou labels.idle). As regiões vivas já ficam montadas.',
                en: 'Nothing to save yet. Empty by default (or labels.idle). The live regions are already mounted.',
              },
            },
            {
              term: { pt: 'saving — Salvando…', en: 'saving — Saving…' },
              description: {
                pt: 'Spinner (decorativo) + texto. Não é anunciado: a cada pausa na digitação seria ruído.',
                en: 'Spinner (decorative) + text. Not announced: on every typing pause it would be noise.',
              },
            },
            {
              term: { pt: 'saved — Salvo há 2 min.', en: 'saved — Saved 2 min. ago' },
              description: {
                pt: 'Check + texto com RelativeTime (atualiza sozinho, sem anúncio). Anuncia “Salvo” de forma educada.',
                en: 'Check + text with RelativeTime (updates on its own, without announcements). Politely announces “Saved”.',
              },
            },
            {
              term: { pt: 'error — Erro ao salvar', en: 'error — Could not save' },
              description: {
                pt: 'Ícone de alerta + texto em danger + “Tentar de novo” (com onRetry). Anunciado com role="alert".',
                en: 'Alert icon + danger text + “Try again” (with onRetry). Announced with role="alert".',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Salvamento automático', en: 'Autosave' }}
          description={{
            pt: 'Digite no campo: salva 1s depois da última tecla. Ligue “Simular falha” para ver o erro e a nova tentativa.',
            en: 'Type in the field: it saves 1s after the last keystroke. Turn on “Simulate failure” to see the error and the retry.',
          }}
          code={AutosaveCode}
        >
          <Autosave />
        </Example>
        <Example title={{ pt: 'Estados', en: 'States' }} code={StatesCode}>
          <States />
        </Example>
        <Example
          title={{ pt: 'No cabeçalho de um documento', en: 'In a document header' }}
          description={{
            pt: 'size="sm" para barras e cabeçalhos compactos.',
            en: 'size="sm" for compact bars and headers.',
          }}
          code={ToolbarCode}
        >
          <Toolbar />
        </Example>
        <Example
          title={{ pt: 'Textos próprios', en: 'Custom text' }}
          description={{
            pt: 'labels troca qualquer texto; em savedAt, {time} marca onde entra o tempo relativo.',
            en: 'labels replaces any text; in savedAt, {time} marks where the relative time goes.',
          }}
          code={CustomLabelsCode}
        >
          <CustomLabels />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Troca de estado', en: 'State change' },
              description: {
                pt: 'Crossfade: o estado anterior some em --or-duration-fast enquanto o novo entra em --or-duration-medium (opacidade + 2px). Nada se move na primeira renderização.',
                en: 'Crossfade: the previous state fades out in --or-duration-fast while the new one enters in --or-duration-medium (opacity + 2px). Nothing moves on first render.',
              },
            },
            {
              term: { pt: 'Salvo / erro', en: 'Saved / error' },
              description: {
                pt: 'O check entra com um “pop” (or-scale-in, --or-ease-bounce); o ícone de erro balança uma vez (or-shake).',
                en: 'The check pops in (or-scale-in, --or-ease-bounce); the error icon shakes once (or-shake).',
              },
            },
            {
              term: { pt: 'Salvando', en: 'Saving' },
              description: {
                pt: 'O Spinner gira enquanto salva (loop só durante o carregamento).',
                en: 'The Spinner turns while saving (loop only while loading).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Troca instantânea, sem pop nem balanço; o Spinner pulsa devagar em vez de girar.',
                en: 'Instant change, no pop or shake; the Spinner pulses slowly instead of spinning.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'status',
              type: "'idle' | 'saving' | 'saved' | 'error'",
              required: true,
              description: { pt: 'Situação do salvamento.', en: 'Save status.' },
            },
            {
              name: 'savedAt',
              type: 'Date | string | number',
              description: {
                pt: 'Último salvamento, em tempo relativo curto (RelativeTime). Um savedAt novo também é anunciado.',
                en: 'Last save, as short relative time (RelativeTime). A new savedAt is also announced.',
              },
            },
            {
              name: 'onRetry',
              type: '() => void',
              description: {
                pt: 'Mostra “Tentar de novo” no estado error.',
                en: 'Shows “Try again” in the error state.',
              },
            },
            {
              name: 'labels',
              type: '{ idle?, saving?, saved?, savedAt?, error?, retry?: string }',
              description: {
                pt: (
                  <>
                    Substitui os textos. <Code>savedAt</Code> usa <Code>{'{time}'}</Code> para o
                    tempo relativo (padrão “Salvo {'{time}'}”); <Code>saved</Code> também é o texto
                    anunciado.
                  </>
                ),
                en: (
                  <>
                    Replaces the text. <Code>savedAt</Code> uses <Code>{'{time}'}</Code> for the
                    relative time (default “Saved {'{time}'}”); <Code>saved</Code> is also the
                    announced text.
                  </>
                ),
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md'",
              default: "'md'",
              description: { pt: 'Texto de 12px ou 13px.', en: '12px or 13px text.' },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLSpanElement>',
              description: { pt: 'Atributos da raiz (<span>).', en: 'Root (<span>) attributes.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O texto visível não é uma região viva — o “há 2 min.” se atualiza sozinho e seria
                relido. Duas regiões ocultas e sempre montadas recebem só os anúncios, uma vez por
                transição: <Code>role="status"</Code> (educada) para “Salvo” e{' '}
                <Code>role="alert"</Code> (assertiva) para “Erro ao salvar”, porque a pessoa pode
                perder o que digitou. “Salvando…” não é anunciado. O botão “Tentar de novo” é
                descrito pela mensagem de erro. Nenhum estado move o foco; só quando o botão some
                com o foco nele (a nova tentativa começou), o foco fica no próprio indicador em vez
                de cair no início da página — a menos que <Code>onRetry</Code> já o tenha levado a
                outro lugar.
              </>
            }
            en={
              <>
                The visible text is not a live region — “2 min. ago” updates on its own and would be
                re-read. Two hidden, always-mounted regions receive only the announcements, once per
                transition: <Code>role="status"</Code> (polite) for “Saved” and{' '}
                <Code>role="alert"</Code> (assertive) for “Could not save”, because people may lose
                what they typed. “Saving…” is not announced. The “Try again” button is described by
                the error message. No state moves focus; only when the button disappears while
                focused (the retry started), focus stays on the indicator itself instead of falling
                back to the top of the page — unless <Code>onRetry</Code> already moved it
                elsewhere.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Leva ao botão “Tentar de novo” (só no erro com onRetry).',
                en: 'Moves to the “Try again” button (only on error with onRetry).',
              },
            },
            {
              keys: ['Enter'],
              description: { pt: 'Tenta salvar de novo.', en: 'Tries to save again.' },
            },
            {
              keys: ['Space'],
              description: { pt: 'Tenta salvar de novo.', en: 'Tries to save again.' },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.4.1',
              description: {
                pt: 'Cada estado tem ícone e texto; cor e movimento só reforçam.',
                en: 'Each state has an icon and text; color and motion only reinforce.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Ao tentar de novo, o foco não se perde: fica no indicador quando o botão some.',
                en: 'On retry, focus is not lost: it stays on the indicator when the button disappears.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Botão “Tentar de novo” com altura mínima de 24px.',
                en: '“Try again” button at least 24px tall.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'Mensagens de status anunciadas sem mover o foco: salvo (polite) e erro (alert).',
                en: 'Status messages announced without moving focus: saved (polite) and error (alert).',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
