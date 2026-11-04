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
import { Alert } from '@orange/ui'
import Dismissible from './examples/Dismissible'
import DismissibleCode from './examples/Dismissible?raw'
import LiveRegion from './examples/LiveRegion'
import LiveRegionCode from './examples/LiveRegion?raw'
import Tones from './examples/Tones'
import TonesCode from './examples/Tones?raw'
import WithActions from './examples/WithActions'
import WithActionsCode from './examples/WithActions?raw'
import WithoutTitle from './examples/WithoutTitle'
import WithoutTitleCode from './examples/WithoutTitle?raw'
import { meta } from './meta'

export default function AlertPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Coloque o Alert perto do que ele descreve: no topo do formulário, acima da tabela, ao lado da configuração.',
              en: 'Place the Alert close to what it describes: at the top of the form, above the table, next to the setting.',
            },
            {
              pt: 'Escreva um título curto com o fato e use o texto para o que fazer em seguida. Evite repetir o tom no título ("Erro: …") — o prefixo para leitores de tela já é automático.',
              en: 'Write a short title with the fact and use the body for what to do next. Avoid repeating the tone in the title ("Error: …") — the screen-reader prefix is automatic.',
            },
            {
              pt: (
                <>
                  Use <Code>live</Code> só quando a mensagem surge depois de uma ação (envio de
                  formulário, sincronização). Mensagens presentes no carregamento da página são
                  estáticas.
                </>
              ),
              en: (
                <>
                  Use <Code>live</Code> only when the message appears after an action (form submit,
                  sync). Messages present on page load are static.
                </>
              ),
            },
            {
              pt: (
                <>
                  Para avisos do sistema que valem para a página inteira, use{' '}
                  <strong>Banner</strong>; para confirmações breves que somem sozinhas,{' '}
                  <strong>Toast</strong>.
                </>
              ),
              en: (
                <>
                  For system-wide notices use <strong>Banner</strong>; for brief confirmations that
                  disappear on their own, <strong>Toast</strong>.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Alert tone="danger" title="Não foi possível importar a planilha">
              A coluna “CNPJ” está vazia em 14 linhas.
            </Alert>
          }
          dontExample={
            <Alert tone="danger" title="Erro!">
              Ocorreu um erro inesperado.
            </Alert>
          }
          doItems={[
            {
              pt: 'Diga o que aconteceu e como resolver.',
              en: 'Say what happened and how to fix it.',
            },
          ]}
          dontItems={[
            {
              pt: 'Mensagens genéricas que não ajudam a seguir em frente.',
              en: 'Generic messages that do not help the user move on.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Tons', en: 'Tones' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: <Code>neutral</Code>, en: <Code>neutral</Code> },
              description: {
                pt: 'Contexto sem urgência: rascunhos, estados, observações.',
                en: 'Non-urgent context: drafts, states, remarks.',
              },
            },
            {
              term: { pt: <Code>info</Code>, en: <Code>info</Code> },
              description: {
                pt: 'Informação útil ou novidade. Tom padrão.',
                en: 'Useful information or news. Default tone.',
              },
            },
            {
              term: { pt: <Code>success</Code>, en: <Code>success</Code> },
              description: {
                pt: 'Confirma que uma ação foi concluída.',
                en: 'Confirms an action was completed.',
              },
            },
            {
              term: { pt: <Code>warning</Code>, en: <Code>warning</Code> },
              description: {
                pt: 'Algo precisa de atenção antes de virar problema.',
                en: 'Something needs attention before it becomes a problem.',
              },
            },
            {
              term: { pt: <Code>danger</Code>, en: <Code>danger</Code> },
              description: {
                pt: 'Erro que impede o usuário de continuar.',
                en: 'Error that blocks the user from continuing.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Tons', en: 'Tones' }}
          description={{
            pt: 'Cada tom tem cor e ícone próprios. A borda esquerda de 3px marca o tom; o fundo continua neutro.',
            en: 'Each tone has its own color and icon. The 3px left border marks the tone; the background stays neutral.',
          }}
          code={TonesCode}
        >
          <Tones />
        </Example>
        <Example
          title={{ pt: 'Com ações', en: 'With actions' }}
          description={{
            pt: 'Até duas ações, em botões sm. A principal vem primeiro.',
            en: 'Up to two actions, as sm buttons. The main one comes first.',
          }}
          code={WithActionsCode}
        >
          <WithActions />
        </Example>
        <Example
          title={{ pt: 'Dispensável', en: 'Dismissible' }}
          description={{
            pt: 'Ao fechar, o foco vai para o próximo elemento focável — nunca se perde no <body>. Com open controlado, você decide quando mostrar de novo.',
            en: 'On close, focus moves to the next focusable element — it never gets lost on <body>. With controlled open, you decide when to show it again.',
          }}
          code={DismissibleCode}
        >
          <Dismissible />
        </Example>
        <Example
          title={{ pt: 'Mensagem dinâmica (live)', en: 'Dynamic message (live)' }}
          description={{
            pt: 'Clique em Salvar duas vezes: o erro é anunciado imediatamente (role="alert") e o sucesso de forma educada (role="status").',
            en: 'Click Save twice: the error is announced immediately (role="alert") and the success politely (role="status").',
          }}
          code={LiveRegionCode}
        >
          <LiveRegion />
        </Example>
        <Example
          title={{
            pt: 'Sem título e com ícone próprio',
            en: 'Without title and with a custom icon',
          }}
          code={WithoutTitleCode}
        >
          <WithoutTitle />
        </Example>
      </Section>
      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada (live ou reaberto)', en: 'Enter (live or reopened)' },
              description: {
                pt: (
                  <>
                    Fade e sobe 8px — <Code>{'--or-duration-medium'}</Code> (250ms),{' '}
                    <Code>{'--or-ease-out'}</Code>. Mensagens estáticas não animam.
                  </>
                ),
                en: (
                  <>
                    Fades in and rises 8px — <Code>{'--or-duration-medium'}</Code> (250ms),{' '}
                    <Code>{'--or-ease-out'}</Code>. Static messages do not animate.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Ícone', en: 'Icon' },
              description: {
                pt: (
                  <>
                    "Assenta" com escala (<Code>{'or-scale-in'}</Code>) logo depois da mensagem —{' '}
                    <Code>{'--or-duration-medium'}</Code>, <Code>{'--or-ease-bounce'}</Code>.
                  </>
                ),
                en: (
                  <>
                    Settles with a scale (<Code>{'or-scale-in'}</Code>) right after the message —{' '}
                    <Code>{'--or-duration-medium'}</Code>, <Code>{'--or-ease-bounce'}</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Dispensar', en: 'Dismiss' },
              description: {
                pt: (
                  <>
                    Esmaece e sobe 4px em <Code>{'--or-duration-fast'}</Code> (160ms) enquanto a
                    altura recolhe (grid <Code>{'1fr → 0fr'}</Code>) em{' '}
                    <Code>{'--or-duration-medium'}</Code>: o conteúdo abaixo sobe suave. Fica{' '}
                    <Code>{'inert'}</Code> até desmontar (<Code>{'usePresence'}</Code>); o foco já
                    foi movido.
                  </>
                ),
                en: (
                  <>
                    Fades and rises 4px in <Code>{'--or-duration-fast'}</Code> (160ms) while the
                    height collapses (grid <Code>{'1fr → 0fr'}</Code>) in{' '}
                    <Code>{'--or-duration-medium'}</Code>: content below slides up smoothly. Stays{' '}
                    <Code>{'inert'}</Code> until it unmounts (<Code>{'usePresence'}</Code>); focus
                    has already moved.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Pressionar ações e fechar', en: 'Pressing actions and close' },
              description: {
                pt: (
                  <>
                    Os botões afundam 1px — <Code>{'--or-duration-press'}</Code> (90ms).
                  </>
                ),
                en: (
                  <>
                    Buttons sink 1px — <Code>{'--or-duration-press'}</Code> (90ms).
                  </>
                ),
              },
            },
            {
              term: { pt: 'Para a saída animar', en: 'For the exit to animate' },
              description: {
                pt: (
                  <>
                    O Alert precisa continuar montado: use <Code>open</Code> (ou deixe não
                    controlado) em vez de <Code>{'{cond && <Alert />}'}</Code>. Espaçamento em
                    margem no próprio Alert recolhe junto; <Code>gap</Code> no pai só some no fim.
                  </>
                ),
                en: (
                  <>
                    The Alert must stay mounted: use <Code>open</Code> (or leave it uncontrolled)
                    instead of <Code>{'{cond && <Alert />}'}</Code>. Spacing as a margin on the
                    Alert itself collapses with it; a parent <Code>gap</Code> only goes away at the
                    end.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: <>Sem deslocamento: entrada e saída são instantâneas (os tokens zeram).</>,
                en: <>No movement: enter and exit are instant (tokens are zeroed).</>,
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'tone',
              type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
              default: "'info'",
              description: { pt: 'Cor semântica e ícone.', en: 'Semantic color and icon.' },
            },
            {
              name: 'title',
              type: 'ReactNode',
              description: { pt: 'Título curto, em negrito.', en: 'Short bold title.' },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: { pt: 'Texto da mensagem.', en: 'Message body.' },
            },
            {
              name: 'icon',
              type: 'ReactNode | false',
              description: {
                pt: (
                  <>
                    Substitui o ícone do tom; <Code>false</Code> remove.
                  </>
                ),
                en: (
                  <>
                    Replaces the tone icon; <Code>false</Code> removes it.
                  </>
                ),
              },
            },
            {
              name: 'action',
              type: 'ReactNode',
              description: {
                pt: 'Ações relacionadas (botões sm ou links).',
                en: 'Related actions (sm buttons or links).',
              },
            },
            {
              name: 'dismissible',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Mostra o botão de fechar.', en: 'Shows the close button.' },
            },
            {
              name: 'onDismiss',
              type: '() => void',
              description: { pt: 'Chamado ao fechar.', en: 'Called on close.' },
            },
            {
              name: 'open',
              type: 'boolean',
              description: {
                pt: 'Visibilidade controlada. Sem ela, o Alert se esconde sozinho ao fechar.',
                en: 'Controlled visibility. Without it, the Alert hides itself on close.',
              },
            },
            {
              name: 'live',
              type: 'boolean',
              default: 'false',
              description: {
                pt: (
                  <>
                    Região viva: <Code>role="alert"</Code> em danger/warning,{' '}
                    <Code>role="status"</Code> nos demais.
                  </>
                ),
                en: (
                  <>
                    Live region: <Code>role="alert"</Code> for danger/warning,{' '}
                    <Code>role="status"</Code> otherwise.
                  </>
                ),
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Atributos nativos da <div> raiz.',
                en: 'Native attributes of the root <div>.',
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
                Por padrão o Alert é estático, sem papel ARIA: ele faz parte do conteúdo e é lido na
                ordem da página. Com <Code>live</Code>, só a mensagem (prefixo, título e texto) vira
                região viva — ações e o botão de fechar ficam de fora do anúncio. Um prefixo
                visualmente oculto ("Erro:", "Atenção:"…) informa o tom sem depender da cor.
              </>
            }
            en={
              <>
                By default the Alert is static, with no ARIA role: it is part of the content and
                read in page order. With <Code>live</Code>, only the message (prefix, title and
                body) becomes a live region — actions and the close button stay out of the
                announcement. A visually hidden prefix ("Error:", "Warning:"…) conveys the tone
                without relying on color.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Move o foco para as ações e o botão de fechar.',
                en: 'Moves focus to the actions and the close button.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Ativa a ação ou fecha o Alert.',
                en: 'Activates the action or closes the Alert.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'Ativa a ação ou fecha o Alert.',
                en: 'Activates the action or closes the Alert.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.4.1',
              description: {
                pt: 'O tom é comunicado por ícone, texto oculto e cor — nunca só pela cor.',
                en: 'Tone is conveyed by icon, hidden text and color — never by color alone.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Ao fechar, o foco segue para o próximo elemento focável.',
                en: 'On close, focus moves to the next focusable element.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: (
                  <>
                    Botão de fechar com nome acessível traduzido (<Code>t('close')</Code>).
                  </>
                ),
                en: (
                  <>
                    Close button with a translated accessible name (<Code>t('close')</Code>).
                  </>
                ),
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: (
                  <>
                    Mensagens dinâmicas anunciadas com <Code>role="alert"</Code> ou{' '}
                    <Code>role="status"</Code>.
                  </>
                ),
                en: (
                  <>
                    Dynamic messages announced with <Code>role="alert"</Code> or{' '}
                    <Code>role="status"</Code>.
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
