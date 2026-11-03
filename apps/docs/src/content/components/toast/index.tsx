import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  ComponentPage,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Toast, ToastProvider } from '@orange/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Positions from './examples/Positions'
import PositionsCode from './examples/Positions?raw'
import Update from './examples/Update'
import UpdateCode from './examples/Update?raw'
import Visual from './examples/Visual'
import VisualCode from './examples/Visual?raw'
import WithAction from './examples/WithAction'
import WithActionCode from './examples/WithAction?raw'
import { meta } from './meta'

const setupCode = `import { OrangeProvider, ToastProvider } from '@orange/ui'

export function App() {
  return (
    <OrangeProvider>
      <ToastProvider position="bottom-right" limit={3} duration={5000}>
        <Routes />
      </ToastProvider>
    </OrangeProvider>
  )
}

// em qualquer componente
const { toast, dismiss } = useToast()
const id = toast({ title: 'Alterações salvas', tone: 'success' })`

export default function ToastPage() {
  return (
    // Um único provider para os exemplos da página, como na raiz de uma aplicação.
    <ToastProvider>
      <ComponentPage meta={meta}>
        <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
          <Bullets
            items={[
              {
                pt: 'Use toasts para confirmar algo que o usuário acabou de fazer ("Link copiado", "Pedido enviado"). Não use para informações que ele precisa ler com calma.',
                en: 'Use toasts to confirm something the user just did ("Link copied", "Order sent"). Do not use them for information that must be read carefully.',
              },
              {
                pt: 'Seja breve: um título de até 6 palavras e, no máximo, uma linha de descrição.',
                en: 'Be brief: a title of up to 6 words and at most one line of description.',
              },
              {
                pt: (
                  <>
                    Erros que impedem o usuário de continuar pertencem ao lugar do erro (um{' '}
                    <strong>Alert</strong> no formulário), não a um toast que some.
                  </>
                ),
                en: (
                  <>
                    Errors that block the user belong where the error happened (an{' '}
                    <strong>Alert</strong> in the form), not in a toast that disappears.
                  </>
                ),
              },
              {
                pt: 'Toda ação de um toast precisa estar disponível em outro lugar da interface. Toasts com ação não somem sozinhos por padrão.',
                en: 'Every toast action must also be available elsewhere in the UI. Toasts with an action do not auto-dismiss by default.',
              },
            ]}
          />
          <DoDont
            doExample={<Toast tone="success" title="Pedido enviado" onClose={() => {}} />}
            dontExample={
              <Toast
                tone="danger"
                title="Erro de validação"
                description="O campo CNPJ é obrigatório, o e-mail é inválido e a data de vencimento precisa ser futura."
                onClose={() => {}}
              />
            }
            doItems={[
              {
                pt: 'Confirmação curta de uma ação concluída.',
                en: 'Short confirmation of a completed action.',
              },
            ]}
            dontItems={[
              {
                pt: 'Erros de formulário longos que somem antes de serem lidos.',
                en: 'Long form errors that vanish before being read.',
              },
            ]}
          />
        </Section>

        <Section title={{ pt: 'Configuração', en: 'Setup' }}>
          <p>
            <T
              pt={
                <>
                  Envolva a aplicação com um único <Code>ToastProvider</Code> (dentro do{' '}
                  <Code>OrangeProvider</Code>, para herdar o idioma) e dispare toasts com{' '}
                  <Code>useToast()</Code>.
                </>
              }
              en={
                <>
                  Wrap the app in a single <Code>ToastProvider</Code> (inside{' '}
                  <Code>OrangeProvider</Code>, to inherit the locale) and trigger toasts with{' '}
                  <Code>useToast()</Code>.
                </>
              }
            />
          </p>
          <CodeBlock code={setupCode} language="tsx" />
        </Section>

        <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
          <Example
            title={{ pt: 'Tons', en: 'Tones' }}
            description={{
              pt: 'Somem após 5 s. Passe o mouse ou foque um toast para pausar o tempo.',
              en: 'They disappear after 5 s. Hover or focus a toast to pause the timer.',
            }}
            code={BasicCode}
          >
            <Basic />
          </Example>
          <Example
            title={{ pt: 'Com ação', en: 'With action' }}
            description={{
              pt: 'A ação fecha o toast ao ser clicada. Pressione F8 para levar o foco ao toast mais recente e Escape para fechá-lo.',
              en: 'The action closes the toast when clicked. Press F8 to move focus to the newest toast and Escape to close it.',
            }}
            code={WithActionCode}
          >
            <WithAction />
          </Example>
          <Example
            title={{ pt: 'Atualizar pelo id', en: 'Update by id' }}
            description={{
              pt: 'Chamar toast() com um id existente substitui o conteúdo — útil para "processando → concluído".',
              en: 'Calling toast() with an existing id replaces its content — useful for "processing → done".',
            }}
            code={UpdateCode}
          >
            <Update />
          </Example>
          <Example
            title={{ pt: 'Posições', en: 'Positions' }}
            description={{
              pt: 'No topo, o mais recente aparece em cima; embaixo, junto à borda. Até 3 visíveis (limit) — os demais aguardam na fila.',
              en: 'At the top, the newest appears first; at the bottom, next to the edge. Up to 3 visible (limit) — the rest wait in a queue.',
            }}
            code={PositionsCode}
          >
            <Positions />
          </Example>
          <Example
            title={{ pt: 'Visual (Toast)', en: 'Visual (Toast)' }}
            description={{
              pt: 'O componente Toast é exportado para composições próprias. Dentro do provider, ele é renderizado automaticamente.',
              en: 'The Toast component is exported for custom compositions. Inside the provider it is rendered for you.',
            }}
            code={VisualCode}
          >
            <Visual />
          </Example>
        </Section>

        <Section title="Props" id="props">
          <PropsTable
            caption={{ pt: 'ToastProvider', en: 'ToastProvider' }}
            rows={[
              {
                name: 'position',
                type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
                default: "'bottom-right'",
                description: { pt: 'Canto da pilha.', en: 'Stack corner.' },
              },
              {
                name: 'limit',
                type: 'number',
                default: '3',
                description: {
                  pt: 'Toasts visíveis ao mesmo tempo; os demais aguardam na fila.',
                  en: 'Toasts visible at once; the rest wait in a queue.',
                },
              },
              {
                name: 'duration',
                type: 'number',
                default: '5000',
                description: {
                  pt: 'Tempo padrão (ms) até fechar.',
                  en: 'Default time (ms) until closing.',
                },
              },
              {
                name: 'hotkey',
                type: 'string | false',
                default: "'F8'",
                description: {
                  pt: 'Tecla que leva o foco ao toast mais recente.',
                  en: 'Key that moves focus to the newest toast.',
                },
              },
              {
                name: 'container',
                type: 'Element | null',
                default: 'document.body',
                description: { pt: 'Destino do portal.', en: 'Portal target.' },
              },
            ]}
          />
          <PropsTable
            caption={{ pt: 'toast(options) — retorna o id', en: 'toast(options) — returns the id' }}
            rows={[
              {
                name: 'title',
                type: 'ReactNode',
                description: { pt: 'Mensagem principal.', en: 'Main message.' },
              },
              {
                name: 'description',
                type: 'ReactNode',
                description: { pt: 'Detalhe opcional.', en: 'Optional detail.' },
              },
              {
                name: 'tone',
                type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
                default: "'neutral'",
                description: {
                  pt: (
                    <>
                      Cor e ícone. <Code>danger</Code> é anunciado com <Code>role="alert"</Code>.
                    </>
                  ),
                  en: (
                    <>
                      Color and icon. <Code>danger</Code> is announced with{' '}
                      <Code>role="alert"</Code>.
                    </>
                  ),
                },
              },
              {
                name: 'action',
                type: '{ label: string; onClick: () => void }',
                description: {
                  pt: 'Botão de ação; fecha o toast ao clicar.',
                  en: 'Action button; closes the toast on click.',
                },
              },
              {
                name: 'duration',
                type: 'number',
                description: {
                  pt: (
                    <>
                      Em ms. <Code>Infinity</Code> mantém aberto. Padrão: o do provider, ou{' '}
                      <Code>Infinity</Code> com ação.
                    </>
                  ),
                  en: (
                    <>
                      In ms. <Code>Infinity</Code> keeps it open. Default: the provider's, or{' '}
                      <Code>Infinity</Code> with an action.
                    </>
                  ),
                },
              },
              {
                name: 'id',
                type: 'string',
                description: {
                  pt: 'Id próprio; reutilizar um id atualiza o toast.',
                  en: 'Custom id; reusing an id updates the toast.',
                },
              },
              {
                name: 'dismissible',
                type: 'boolean',
                default: 'true',
                description: { pt: 'Mostra o botão de fechar.', en: 'Shows the close button.' },
              },
              {
                name: 'icon',
                type: 'ReactNode | false',
                description: {
                  pt: 'Substitui ou remove o ícone.',
                  en: 'Replaces or removes the icon.',
                },
              },
              {
                name: 'onDismiss',
                type: '() => void',
                description: {
                  pt: 'Chamado quando o toast fecha.',
                  en: 'Called when the toast closes.',
                },
              },
            ]}
          />
          <PropsTable
            caption={{ pt: 'useToast()', en: 'useToast()' }}
            rows={[
              {
                name: 'toast',
                type: '(options: ToastOptions) => string',
                description: {
                  pt: 'Mostra (ou atualiza) um toast.',
                  en: 'Shows (or updates) a toast.',
                },
              },
              {
                name: 'dismiss',
                type: '(id: string) => void',
                description: { pt: 'Fecha um toast.', en: 'Closes a toast.' },
              },
              {
                name: 'dismissAll',
                type: '() => void',
                description: { pt: 'Fecha todos.', en: 'Closes all toasts.' },
              },
            ]}
          />
        </Section>

        <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
          <p>
            <T
              pt={
                <>
                  A pilha fica num <Code>Portal</Code>, dentro de uma região rotulada "Notificações
                  (F8)". O texto de cada toast é copiado para regiões vivas ocultas e sempre
                  montadas: <Code>role="status"</Code> (educada) para a maioria e{' '}
                  <Code>role="alert"</Code> (assertiva) para <Code>danger</Code>. Assim o anúncio é
                  confiável e não inclui os rótulos dos botões. O foco nunca é roubado: o usuário
                  chega aos toasts com F8.
                </>
              }
              en={
                <>
                  The stack lives in a <Code>Portal</Code>, inside a region labelled "Notifications
                  (F8)". Each toast's text is copied to hidden, always-mounted live regions:{' '}
                  <Code>role="status"</Code> (polite) for most and <Code>role="alert"</Code>{' '}
                  (assertive) for <Code>danger</Code>. This makes announcements reliable and keeps
                  button labels out of them. Focus is never stolen: users reach toasts with F8.
                </>
              }
            />
          </p>
          <Callout tone="info" title={{ pt: 'Tempo ajustável', en: 'Adjustable timing' }}>
            <T
              pt="O tempo pausa enquanto o ponteiro está sobre a pilha, enquanto o foco está em um toast e quando a aba fica em segundo plano."
              en="The timer pauses while the pointer is over the stack, while focus is inside a toast and when the tab is in the background."
            />
          </Callout>
          <KeyboardTable
            rows={[
              {
                keys: ['F8'],
                description: {
                  pt: 'Leva o foco ao toast mais recente.',
                  en: 'Moves focus to the newest toast.',
                },
              },
              {
                keys: ['Tab'],
                description: {
                  pt: 'Percorre as ações e botões de fechar.',
                  en: 'Moves through actions and close buttons.',
                },
              },
              {
                keys: ['Escape'],
                description: {
                  pt: 'Fecha o toast focado; o foco vai para o próximo toast ou volta para onde estava.',
                  en: 'Closes the focused toast; focus moves to the next toast or back to where it was.',
                },
              },
              {
                keys: ['Enter'],
                description: {
                  pt: 'Ativa a ação ou fecha.',
                  en: 'Activates the action or closes.',
                },
              },
            ]}
          />
          <WcagList
            items={[
              {
                criterion: '2.2.1',
                description: {
                  pt: 'Tempo pausável (hover, foco, aba oculta); toasts com ação não expiram por padrão.',
                  en: 'Pausable timing (hover, focus, hidden tab); toasts with actions do not expire by default.',
                },
              },
              {
                criterion: '2.3.3',
                description: {
                  pt: 'Sem deslizamento quando o sistema pede movimento reduzido.',
                  en: 'No sliding when the system requests reduced motion.',
                },
              },
              {
                criterion: '2.4.3',
                description: {
                  pt: 'Ordem do DOM igual à ordem visual da pilha; o foco é devolvido ao fechar.',
                  en: 'DOM order matches the visual stack order; focus is restored on close.',
                },
              },
              {
                criterion: '4.1.3',
                description: {
                  pt: 'Mensagens anunciadas por regiões vivas sem receber foco.',
                  en: 'Messages announced through live regions without receiving focus.',
                },
              },
            ]}
          />
        </Section>
      </ComponentPage>
    </ToastProvider>
  )
}
