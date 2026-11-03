import {
  Bullets,
  Callout,
  Code,
  ComponentPage,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T, useLang } from '../../../i18n'
import Async from './examples/Async'
import AsyncCode from './examples/Async?raw'
import Danger from './examples/Danger'
import DangerCode from './examples/Danger?raw'
import UseConfirm from './examples/UseConfirm'
import UseConfirmCode from './examples/UseConfirm?raw'
import WithDetails from './examples/WithDetails'
import WithDetailsCode from './examples/WithDetails?raw'
import { meta } from './meta'

export default function ConfirmDialogPage() {
  const { t } = useLang()
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Confirme apenas ações destrutivas, caras ou difíceis de desfazer. Confirmar tudo ensina as pessoas a clicar sem ler — quando possível, ofereça "Desfazer" em vez de perguntar.',
              en: 'Only confirm destructive, costly or hard-to-undo actions. Confirming everything teaches people to click without reading — when possible, offer "Undo" instead of asking.',
            },
            {
              pt: (
                <>
                  O título é uma pergunta com o objeto: <strong>Excluir o projeto Site 2026?</strong>. A descrição diz a
                  consequência concreta (o que se perde, quem é afetado).
                </>
              ),
              en: (
                <>
                  The title is a question naming the object: <strong>Delete the Site 2026 project?</strong>. The description
                  states the concrete consequence (what is lost, who is affected).
                </>
              ),
            },
            {
              pt: (
                <>
                  O botão de confirmação repete o verbo da ação — <strong>Excluir projeto</strong>, nunca <strong>Sim</strong> ou{' '}
                  <strong>OK</strong>.
                </>
              ),
              en: (
                <>
                  The confirm button repeats the action's verb — <strong>Delete project</strong>, never <strong>Yes</strong> or{' '}
                  <strong>OK</strong>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <Code>tone="danger"</Code> para ações destrutivas: o botão fica vermelho e o foco inicial vai para{' '}
                  <strong>Cancelar</strong>, a opção segura.
                </>
              ),
              en: (
                <>
                  Use <Code>tone="danger"</Code> for destructive actions: the button turns red and initial focus goes to{' '}
                  <strong>Cancel</strong>, the safe option.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Ação destrutiva', en: 'Destructive action' }}
          description={{
            pt: 'tone="danger": botão vermelho, ícone de alerta e foco inicial em Cancelar. O fundo não fecha o diálogo.',
            en: 'tone="danger": red button, warning icon and initial focus on Cancel. Clicking the overlay does not close it.',
          }}
          code={DangerCode}
        >
          <Danger />
        </Example>
        <Example
          title={{ pt: 'Confirmação assíncrona', en: 'Async confirmation' }}
          description={{
            pt: (
              <>
                Se <Code>onConfirm</Code> retornar uma Promise, o botão fica em loading (anunciado a leitores de tela), Cancelar e
                Escape são bloqueados e o diálogo só fecha quando ela resolver. Se rejeitar, o diálogo continua aberto.
              </>
            ),
            en: (
              <>
                If <Code>onConfirm</Code> returns a Promise, the button shows a loading state (announced to screen readers), Cancel
                and Escape are blocked and the dialog only closes when it resolves. If it rejects, the dialog stays open.
              </>
            ),
          }}
          code={AsyncCode}
        >
          <Async />
        </Example>
        <Example
          title={{ pt: 'Com detalhes', en: 'With details' }}
          description={{
            pt: 'Conteúdo extra (children) aparece entre a descrição e as ações — útil para listar o que será afetado. Tom neutro foca o botão de confirmação.',
            en: 'Extra content (children) sits between the description and the actions — useful to list what will be affected. Neutral tone focuses the confirm button.',
          }}
          code={WithDetailsCode}
        >
          <WithDetails />
        </Example>
        <Example
          title={{ pt: 'Hook useConfirm', en: 'useConfirm hook' }}
          description={{
            pt: (
              <>
                <Code>const [confirm, confirmDialog] = useConfirm()</Code>: renderize <Code>confirmDialog</Code> uma vez e use{' '}
                <Code>await confirm({'{…}'})</Code>, que resolve <Code>true</Code> ou <Code>false</Code>.
              </>
            ),
            en: (
              <>
                <Code>const [confirm, confirmDialog] = useConfirm()</Code>: render <Code>confirmDialog</Code> once and use{' '}
                <Code>await confirm({'{…}'})</Code>, which resolves to <Code>true</Code> or <Code>false</Code>.
              </>
            ),
          }}
          code={UseConfirmCode}
        >
          <UseConfirm />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'ConfirmDialog', en: 'ConfirmDialog' }}
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: { pt: 'Pergunta direta; nomeia o diálogo.', en: 'Direct question; names the dialog.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Consequência da ação (aria-describedby).', en: 'Consequence of the action (aria-describedby).' } },
            { name: 'children', type: 'ReactNode', description: { pt: 'Conteúdo extra entre a descrição e as ações.', en: 'Extra content between the description and the actions.' } },
            { name: 'confirmLabel', type: 'string', default: "t('confirm')", description: { pt: 'Rótulo do botão de confirmação. Use o verbo da ação.', en: 'Confirm button label. Use the action verb.' } },
            { name: 'cancelLabel', type: 'string', default: "t('cancel')", description: { pt: 'Rótulo do botão de cancelar.', en: 'Cancel button label.' } },
            { name: 'tone', type: "'neutral' | 'danger'", default: "'neutral'", description: { pt: 'danger: botão vermelho e foco inicial em Cancelar.', en: 'danger: red button and initial focus on Cancel.' } },
            { name: 'onConfirm', type: '() => void | Promise<unknown>', description: { pt: 'Executa a ação. Com Promise, mostra loading até resolver.', en: 'Runs the action. With a Promise, shows loading until it resolves.' } },
            { name: 'onCancel', type: '() => void', description: { pt: 'Chamado ao cancelar (botão ou Escape).', en: 'Called on cancel (button or Escape).' } },
            { name: 'loadingText', type: 'string', description: { pt: 'Texto anunciado durante o loading.', en: 'Text announced while loading.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: 'trigger', type: 'ReactElement', description: { pt: 'Elemento que abre o diálogo.', en: 'Element that opens the dialog.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'useConfirm()', en: 'useConfirm()' }}
          rows={[
            {
              name: 'retorno',
              type: '[confirm: (options) => Promise<boolean>, dialog: ReactElement]',
              description: {
                pt: 'confirm aceita title, description, children, confirmLabel, cancelLabel, tone, onConfirm e loadingText.',
                en: 'confirm accepts title, description, children, confirmLabel, cancelLabel, tone, onConfirm and loadingText.',
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
                Segue o padrão <em>Alert Dialog</em> do WAI-ARIA APG: <Code>role="alertdialog"</Code> com{' '}
                <Code>aria-modal="true"</Code>, nome pelo título e descrição pela consequência — leitores de tela anunciam os dois
                ao abrir. O foco fica preso, começa na ação menos destrutiva e volta ao gatilho ao fechar.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <em>Alert Dialog</em> pattern: <Code>role="alertdialog"</Code> with{' '}
                <Code>aria-modal="true"</Code>, named by the title and described by the consequence — screen readers announce both
                on open. Focus is trapped, starts on the least destructive action and returns to the trigger on close.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Alterna entre Cancelar e a ação (e o conteúdo extra, se houver).', en: 'Moves between Cancel and the action (and extra content, if any).' } },
            { keys: ['Enter'], description: { pt: 'Ativa o botão focado.', en: 'Activates the focused button.' } },
            { keys: ['Esc'], description: { pt: 'Cancela e fecha (ignorado enquanto a ação está em andamento).', en: 'Cancels and closes (ignored while the action is running).' } },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Clique fora não fecha', en: 'Clicking outside does not close' }}>
          {t({
            pt: 'Um alerta exige uma resposta explícita: o clique no fundo é ignorado para evitar confirmações ou cancelamentos acidentais.',
            en: 'An alert requires an explicit answer: overlay clicks are ignored to avoid accidental confirmations or cancellations.',
          })}
        </Callout>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Título e consequência ligados por aria-labelledby e aria-describedby.', en: 'Title and consequence wired through aria-labelledby and aria-describedby.' } },
            { criterion: '2.4.3', description: { pt: 'Foco inicial na opção segura e retorno ao gatilho ao fechar.', en: 'Initial focus on the safe option and return to the trigger on close.' } },
            { criterion: '3.3.4', description: { pt: 'Ações destrutivas pedem confirmação antes de serem executadas.', en: 'Destructive actions ask for confirmation before running.' } },
            { criterion: '4.1.3', description: { pt: 'O estado de carregamento é anunciado por uma região de status.', en: 'The loading state is announced through a status region.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
