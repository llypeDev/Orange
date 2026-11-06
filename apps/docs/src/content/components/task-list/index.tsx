import { TaskList, TaskListItem } from '@orangesys/ui'
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
import Onboarding from './examples/Onboarding'
import OnboardingCode from './examples/Onboarding?raw'
import RouterLinks from './examples/RouterLinks'
import RouterLinksCode from './examples/RouterLinks?raw'
import Sections from './examples/Sections'
import SectionsCode from './examples/Sections?raw'
import WithButtons from './examples/WithButtons'
import WithButtonsCode from './examples/WithButtons?raw'
import { meta } from './meta'

export default function TaskListPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use para configurações longas que a pessoa conclui{' '}
                  <strong>em qualquer ordem</strong> e em várias visitas — onboarding, cadastro em
                  seções, preparação de uma campanha. Para um fluxo linear, uma etapa por vez, use{' '}
                  <strong>Stepper</strong>.
                </>
              ),
              en: (
                <>
                  Use it for long setups people complete <strong>in any order</strong> and across
                  several visits — onboarding, multi-section sign-ups, preparing a campaign. For a
                  linear flow, one step at a time, use <strong>Stepper</strong>.
                </>
              ),
            },
            {
              pt: 'Nomeie cada tarefa pelo que a pessoa vai fazer ou informar (“Formas de pagamento”), em até poucas palavras; detalhes vão na descrição.',
              en: 'Name each task after what people will do or provide (“Payment methods”), in a few words; details go in the description.',
            },
            {
              pt: (
                <>
                  O status é sempre texto: a tag só reforça com cor. Use <Code>statusLabel</Code>{' '}
                  para explicar por que uma tarefa ainda não pode começar (“Disponível após o
                  frete”).
                </>
              ),
              en: (
                <>
                  The status is always text: the tag only reinforces it with color. Use{' '}
                  <Code>statusLabel</Code> to explain why a task cannot start yet (“Available after
                  shipping”).
                </>
              ),
            },
            {
              pt: (
                <>
                  Com <Code>title</Code>, o resumo “3 de 5 concluídas” é calculado a partir dos
                  itens. Se os itens estiverem dentro de componentes próprios, informe{' '}
                  <Code>completed</Code> e <Code>total</Code>.
                </>
              ),
              en: (
                <>
                  With <Code>title</Code>, the “3 of 5 completed” summary is computed from the
                  items. If items are wrapped in your own components, pass <Code>completed</Code>{' '}
                  and <Code>total</Code>.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <TaskList aria-label="Exemplo correto" style={{ width: '100%' }}>
              <TaskListItem href="#" status="in-progress" description="Pix e boleto">
                Formas de pagamento
              </TaskListItem>
              <TaskListItem status="cannot-start" statusLabel="Disponível após o frete">
                Domínio próprio
              </TaskListItem>
            </TaskList>
          }
          dontExample={
            <TaskList aria-label="Exemplo incorreto" style={{ width: '100%' }}>
              <TaskListItem href="#" status="in-progress">
                Clique aqui
              </TaskListItem>
              <TaskListItem href="#" status="not-started">
                Passo 2
              </TaskListItem>
            </TaskList>
          }
          doItems={[
            {
              pt: 'Nomes específicos e o motivo de uma tarefa bloqueada.',
              en: 'Specific names and the reason a task is blocked.',
            },
            {
              pt: 'Uma linha inteira por tarefa, com descrição curta.',
              en: 'One whole row per task, with a short description.',
            },
          ]}
          dontItems={[
            {
              pt: 'Nomes genéricos (“Clique aqui”, “Passo 2”): o link é lido fora de contexto.',
              en: 'Generic names (“Click here”, “Step 2”): the link is read out of context.',
            },
            {
              pt: 'Botões ou links dentro da descrição de uma linha acionável (alvos aninhados).',
              en: 'Buttons or links inside the description of an actionable row (nested targets).',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Status', en: 'Statuses' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'complete — Concluído', en: 'complete — Completed' },
              description: {
                pt: 'Tag success. A tarefa continua sendo link: a pessoa pode voltar e revisar.',
                en: 'Success tag. The task stays a link: people can come back and review it.',
              },
            },
            {
              term: { pt: 'in-progress — Em andamento', en: 'in-progress — In progress' },
              description: {
                pt: 'Tag info. Começou, mas falta algo para concluir.',
                en: 'Info tag. Started, but something is still missing.',
              },
            },
            {
              term: { pt: 'not-started — Não iniciado', en: 'not-started — Not started' },
              description: {
                pt: 'Tag neutral. Disponível, ainda sem nenhuma informação.',
                en: 'Neutral tag. Available, with no information yet.',
              },
            },
            {
              term: { pt: 'error — Com erro', en: 'error — Error' },
              description: {
                pt: 'Tag danger. Algo precisa ser corrigido; diga o quê na descrição (“2 produtos sem preço”).',
                en: 'Danger tag. Something needs fixing; say what in the description (“2 products without a price”).',
              },
            },
            {
              term: {
                pt: 'cannot-start — Ainda indisponível',
                en: 'cannot-start — Cannot start yet',
              },
              description: {
                pt: 'Texto simples, sem tag, e a linha nunca é link (mesmo com href). Explique o motivo com statusLabel.',
                en: 'Plain text, no tag, and the row is never a link (even with href). Explain why with statusLabel.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Onboarding com resumo', en: 'Onboarding with a summary' }}
          description={{
            pt: 'title mostra o heading e o progresso calculado a partir dos itens. A barra fica verde quando tudo está concluído.',
            en: 'title shows the heading and the progress computed from the items. The bar turns green when everything is complete.',
          }}
          code={OnboardingCode}
        >
          <Onboarding />
        </Example>
        <Example
          title={{ pt: 'Em seções', en: 'In sections' }}
          description={{
            pt: 'Como no GOV.UK: uma lista por seção, nomeada pelo heading da página (aria-labelledby), sem resumo próprio.',
            en: 'As in GOV.UK: one list per section, named by the page heading (aria-labelledby), with no summary of its own.',
          }}
          code={SectionsCode}
        >
          <Sections />
        </Example>
        <Example
          title={{ pt: 'Tarefas que abrem um diálogo', en: 'Tasks that open a dialog' }}
          description={{
            pt: 'Sem href, onClick transforma o nome em botão. Ao concluir, o status dá um pequeno “pop” e o progresso avança.',
            en: 'Without href, onClick turns the name into a button. On completion, the status pops and the progress moves forward.',
          }}
          code={WithButtonsCode}
        >
          <WithButtons />
        </Example>
        <Example
          title={{ pt: 'Com o roteador', en: 'With a router' }}
          description={{
            pt: 'renderLink recebe href, classe, aria-describedby e o nome — repasse tudo ao link do roteador.',
            en: 'renderLink receives href, class, aria-describedby and the name — pass everything to your router link.',
          }}
          code={RouterLinksCode}
        >
          <RouterLinks />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Hover / foco em uma linha', en: 'Hover / focus on a row' },
              description: {
                pt: 'Mesma resposta: fundo da linha, cor de acento e sublinhado que engrossa (1px → 2px) — --or-duration-fast. O foco desenha o contorno em volta da linha inteira.',
                en: 'Same response: row background, accent color and an underline that thickens (1px → 2px) — --or-duration-fast. Focus draws the outline around the whole row.',
              },
            },
            {
              term: { pt: 'Pressionar', en: 'Press' },
              description: {
                pt: 'A linha afunda 1px (translateY + scale) em --or-duration-press.',
                en: 'The row sinks 1px (translateY + scale) in --or-duration-press.',
              },
            },
            {
              term: { pt: 'Status muda', en: 'Status changes' },
              description: {
                pt: 'Só depois de montado: a nova tag entra com um “pop” (scale + opacidade, --or-ease-bounce); a barra de progresso cresce e troca de cor com transição.',
                en: 'Only after mount: the new tag pops in (scale + opacity, --or-ease-bounce); the progress bar grows and changes color with a transition.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Tudo instantâneo; status e progresso continuam em texto.',
                en: 'Everything is instant; status and progress remain in text.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'TaskList', en: 'TaskList' }}
          rows={[
            {
              name: 'title',
              type: 'ReactNode',
              description: {
                pt: 'Título do resumo (heading). Também nomeia a lista.',
                en: 'Summary title (heading). Also names the list.',
              },
            },
            {
              name: 'headingLevel',
              type: '2 | 3 | 4 | 5 | 6',
              default: '2',
              description: { pt: 'Nível do heading do title.', en: 'Heading level of the title.' },
            },
            {
              name: 'showProgress',
              type: 'boolean',
              default: 'true com title',
              description: {
                pt: 'Mostra “N de M concluídas” com uma ProgressBar. Sem title, a barra se chama “Progresso das tarefas”.',
                en: 'Shows “N of M completed” with a ProgressBar. Without title, the bar is named “Task progress”.',
              },
            },
            {
              name: 'completed',
              type: 'number',
              description: {
                pt: 'Tarefas concluídas. Padrão: TaskListItem filhos com status="complete".',
                en: 'Completed tasks. Default: child TaskListItems with status="complete".',
              },
            },
            {
              name: 'total',
              type: 'number',
              description: {
                pt: 'Total de tarefas. Padrão: número de TaskListItem filhos.',
                en: 'Total tasks. Default: number of child TaskListItems.',
              },
            },
            {
              name: 'renderLink',
              type: '(props: RenderLinkProps) => ReactNode',
              description: {
                pt: (
                  <>
                    Renderiza os links com o roteador:{' '}
                    <Code>{'({ href, ...p }) => <RouterLink to={href} {...p} />'}</Code>.
                  </>
                ),
                en: (
                  <>
                    Renders links with your router:{' '}
                    <Code>{'({ href, ...p }) => <RouterLink to={href} {...p} />'}</Code>.
                  </>
                ),
              },
            },
            {
              name: 'aria-label / aria-labelledby',
              type: 'string',
              description: {
                pt: 'Nome da lista quando não há title. Vão para o <ul>, não para a raiz.',
                en: 'The list’s name when there is no title. They go to the <ul>, not the root.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: { pt: 'Atributos da raiz (<div>).', en: 'Root (<div>) attributes.' },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'TaskListItem', en: 'TaskListItem' }}
          rows={[
            {
              name: 'children',
              type: 'ReactNode',
              required: true,
              description: {
                pt: 'Nome da tarefa — o nome acessível do link/botão.',
                en: 'Task name — the accessible name of the link/button.',
              },
            },
            {
              name: 'status',
              type: "'complete' | 'in-progress' | 'not-started' | 'cannot-start' | 'error'",
              required: true,
              description: {
                pt: 'Situação da tarefa (texto + tag; cannot-start só texto).',
                en: 'Task status (text + tag; cannot-start is text only).',
              },
            },
            {
              name: 'statusLabel',
              type: 'ReactNode',
              description: {
                pt: 'Substitui o texto padrão do status.',
                en: 'Replaces the default status text.',
              },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: {
                pt: 'Texto de apoio (o “hint” do GOV.UK). Descreve o link/botão.',
                en: 'Supporting text (GOV.UK’s “hint”). Describes the link/button.',
              },
            },
            {
              name: 'href',
              type: 'string',
              description: {
                pt: 'Destino. A linha inteira vira o alvo do link (exceto em cannot-start).',
                en: 'Destination. The whole row becomes the link target (except cannot-start).',
              },
            },
            {
              name: 'onClick',
              type: '(event: MouseEvent<HTMLElement>) => void',
              description: {
                pt: 'Sem href, torna o nome um botão; com href, é repassado ao link.',
                en: 'Without href, turns the name into a button; with href, it is passed to the link.',
              },
            },
            {
              name: '...rest',
              type: 'LiHTMLAttributes',
              description: { pt: 'Atributos do <li>.', en: '<li> attributes.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue a estrutura do <strong>Task list</strong> do GOV.UK: um{' '}
                <Code>&lt;ul&gt;</Code> nomeado pelo título, um <Code>&lt;li&gt;</Code> por tarefa.
                O nome da tarefa é o nome acessível do link (ou botão), e a descrição e o status o
                descrevem via <Code>aria-describedby</Code> — “Formas de pagamento, link, Pix e
                boleto, Em andamento”. A área de clique cobre a linha toda, mas há um único controle
                por linha. Tarefas <Code>cannot-start</Code> são texto. O resumo é uma{' '}
                <Code>progressbar</Code> nomeada pelo título, com <Code>aria-valuetext</Code> “3 de
                5 concluídas”.
              </>
            }
            en={
              <>
                Follows the GOV.UK <strong>Task list</strong> structure: a <Code>&lt;ul&gt;</Code>{' '}
                named by the title, one <Code>&lt;li&gt;</Code> per task. The task name is the
                link’s (or button’s) accessible name, and the description and status describe it via{' '}
                <Code>aria-describedby</Code> — “Payment methods, link, Pix and bank slip, In
                progress”. The click area covers the whole row, but there is a single control per
                row. <Code>cannot-start</Code> tasks are text. The summary is a{' '}
                <Code>progressbar</Code> named by the title, with <Code>aria-valuetext</Code> “3 of
                5 completed”.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Percorre as tarefas acionáveis (cannot-start fica de fora).',
                en: 'Moves through actionable tasks (cannot-start is skipped).',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Segue o link ou ativa o botão da tarefa.',
                en: 'Follows the link or activates the task button.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'Ativa o botão (tarefas com onClick).',
                en: 'Activates the button (tasks with onClick).',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Lista nomeada; nome, descrição e status ligados ao controle por aria-describedby.',
                en: 'Named list; name, description and status tied to the control via aria-describedby.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Status sempre em texto; a cor da tag só reforça.',
                en: 'Status is always text; the tag color only reinforces it.',
              },
            },
            {
              criterion: '2.4.4',
              description: {
                pt: 'O propósito do link vem do nome da tarefa e da descrição programática.',
                en: 'Link purpose comes from the task name and its programmatic description.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível em volta da linha inteira (o alvo real).',
                en: 'Visible focus around the whole row (the real target).',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Alvo de clique do tamanho da linha.',
                en: 'Click target as large as the row.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
