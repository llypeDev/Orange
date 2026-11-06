import {
  Bullets,
  Callout,
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
import Comments from './examples/Comments'
import CommentsCode from './examples/Comments?raw'
import Composer from './examples/Composer'
import ComposerCode from './examples/Composer?raw'
import Demo from './examples/Demo'
import DemoCode from './examples/Demo?raw'
import Empty from './examples/Empty'
import EmptyCode from './examples/Empty?raw'
import RichContent from './examples/RichContent'
import RichContentCode from './examples/RichContent?raw'
import Support from './examples/Support'
import SupportCode from './examples/Support?raw'
import { meta } from './meta'

export default function ChatPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Três peças, exportadas juntas: <Code>ChatThread</Code> (a lista rolável),{' '}
                  <Code>ChatMessage</Code> (cada mensagem) e <Code>ChatComposer</Code> (o campo de
                  envio). Use em assistentes de IA, atendimento e threads de comentários.
                </>
              ),
              en: (
                <>
                  Three pieces, exported together: <Code>ChatThread</Code> (the scrolling list),{' '}
                  <Code>ChatMessage</Code> (each message) and <Code>ChatComposer</Code> (the input).
                  Use them for AI assistants, support and comment threads.
                </>
              ),
            },
            {
              pt: (
                <>
                  Dê uma altura ao <Code>ChatThread</Code> (<Code>style</Code>,{' '}
                  <Code>className</Code> ou <Code>flex: 1</Code> num layout em coluna) — é ele que
                  rola, não a página. Poucas mensagens ficam junto do fim, perto do composer.
                </>
              ),
              en: (
                <>
                  Give <Code>ChatThread</Code> a height (<Code>style</Code>, <Code>className</Code>{' '}
                  or <Code>flex: 1</Code> in a column layout) — it scrolls, not the page. A few
                  messages sit near the end, next to the composer.
                </>
              ),
            },
            {
              pt: (
                <>
                  Escolha o remetente certo: <Code>user</Code> para a própria pessoa,{' '}
                  <Code>assistant</Code> para a IA, <Code>other</Code> para outras pessoas
                  (atendentes, colegas em comentários e grupos — sempre com <Code>author</Code>{' '}
                  visível) e <Code>system</Code> para avisos automáticos. Sem <Code>author</Code>,
                  &quot;Você&quot;, &quot;Assistente&quot;, &quot;Participante&quot; ou
                  &quot;Sistema&quot; ficam só para leitores de tela. O <Code>avatar</Code> é
                  decorativo.
                </>
              ),
              en: (
                <>
                  Pick the right sender: <Code>user</Code> for the person themselves,{' '}
                  <Code>assistant</Code> for the AI, <Code>other</Code> for other people (support
                  agents, colleagues in comments and group chats — always with a visible{' '}
                  <Code>author</Code>) and <Code>system</Code> for automatic notices. Without{' '}
                  <Code>author</Code>, &quot;You&quot;, &quot;Assistant&quot;,
                  &quot;Participant&quot; or &quot;System&quot; are kept for screen readers only.
                  The <Code>avatar</Code> is decorative.
                </>
              ),
            },
            {
              pt: (
                <>
                  Em respostas em streaming, mantenha <Code>status=&quot;sending&quot;</Code> (ou{' '}
                  <Code>loading</Code> na conversa) até o texto terminar: a resposta é anunciada uma
                  vez, completa.
                </>
              ),
              en: (
                <>
                  For streamed answers, keep <Code>status=&quot;sending&quot;</Code> (or{' '}
                  <Code>loading</Code> on the thread) until the text is done: the answer is
                  announced once, complete.
                </>
              ),
            },
            {
              pt: 'Ações por mensagem (copiar, gerar de novo, feedback) ficam sempre visíveis — nada que só aparece no hover.',
              en: 'Per-message actions (copy, regenerate, feedback) are always visible — nothing that only shows on hover.',
            },
            {
              pt: 'Nunca peça nem mostre dados pessoais sensíveis (documentos, cartões, senhas) numa conversa; oriente a pessoa a usar o formulário seguro do produto.',
              en: 'Never ask for or show sensitive personal data (ID numbers, cards, passwords) in a conversation; point people to the product’s secure form.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'ChatThread', en: 'ChatThread' },
              description: {
                pt: (
                  <>
                    Área rolável com <Code>role=&quot;log&quot;</Code> e nome (&quot;Conversa&quot;
                    por padrão). Focável quando rola.
                  </>
                ),
                en: (
                  <>
                    Scrolling area with <Code>role=&quot;log&quot;</Code> and a name
                    (&quot;Conversation&quot; by default). Focusable when it scrolls.
                  </>
                ),
              },
            },
            {
              term: { pt: 'ChatMessage', en: 'ChatMessage' },
              description: {
                pt: (
                  <>
                    Um <Code>&lt;article&gt;</Code> nomeado por autor + horário: balão, estado de
                    envio e ações. O lado e a cor vêm de <Code>from</Code>: <Code>user</Code> à
                    direita; <Code>assistant</Code> e <Code>other</Code> (outras pessoas) à
                    esquerda; <Code>system</Code> centralizado.
                  </>
                ),
                en: (
                  <>
                    An <Code>&lt;article&gt;</Code> named by author + time: bubble, send status and
                    actions. Side and color come from <Code>from</Code>: <Code>user</Code> on the
                    right; <Code>assistant</Code> and <Code>other</Code> (other people) on the left;{' '}
                    <Code>system</Code> centered.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Digitando…', en: 'Typing…' },
              description: {
                pt: (
                  <>
                    Três pontos no fim da conversa com <Code>loading</Code>;{' '}
                    <Code>role=&quot;img&quot;</Code> nomeado &quot;Digitando…&quot;.
                  </>
                ),
                en: (
                  <>
                    Three dots at the end of the thread with <Code>loading</Code>;{' '}
                    <Code>role=&quot;img&quot;</Code> named &quot;Typing…&quot;.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Novas mensagens', en: 'New messages' },
              description: {
                pt: 'Botão que aparece quando chega mensagem e você não está no fim; leva ao fim.',
                en: 'Button shown when a message arrives and you are not at the end; jumps to the end.',
              },
            },
            {
              term: { pt: 'ChatComposer', en: 'ChatComposer' },
              description: {
                pt: (
                  <>
                    Moldura com o <Code>TextArea</Code> que cresce, ações à esquerda, contador
                    opcional e enviar/parar.
                  </>
                ),
                en: (
                  <>
                    Frame with the growing <Code>TextArea</Code>, actions on the left, optional
                    counter and send/stop.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Assistente com resposta simulada', en: 'Assistant with a simulated reply' }}
          description={{
            pt: 'Envie uma pergunta: o composer vira "Parar", a conversa mostra "Digitando…" e acompanha o fim. Role para cima antes da resposta (2,5 s) para ver o botão "Novas mensagens".',
            en: 'Send a question: the composer turns into "Stop", the thread shows "Typing…" and follows the end. Scroll up before the reply (2.5 s) to see the "New messages" button.',
          }}
          code={DemoCode}
          align="stretch"
        >
          <Demo />
        </Example>
        <Example
          title={{ pt: 'Conteúdo rico e ações', en: 'Rich content and actions' }}
          description={{
            pt: 'Parágrafos, listas, código e URLs longas quebram dentro do balão — nada vaza a página, nem em 320px. Ações abaixo do balão.',
            en: 'Paragraphs, lists, code and long URLs wrap inside the bubble — nothing overflows the page, even at 320px. Actions below the bubble.',
          }}
          code={RichContentCode}
          align="stretch"
        >
          <RichContent />
        </Example>
        <Example
          title={{ pt: 'Atendimento: estados de envio', en: 'Support: send status' }}
          description={{
            pt: 'A atendente é from="other" (uma pessoa, com author visível). status="error" mostra o aviso (role="alert") e "Tentar novamente" com onRetry; "sending" mostra "Enviando…" e marca aria-busy.',
            en: 'The agent is from="other" (a person, with a visible author). status="error" shows the notice (role="alert") and "Try again" with onRetry; "sending" shows "Sending…" and sets aria-busy.',
          }}
          code={SupportCode}
          align="stretch"
        >
          <Support />
        </Example>
        <Example
          title={{ pt: 'Comentários de uma tarefa', en: 'Task comments' }}
          description={{
            pt: 'Horários relativos (timestampFormat="relative"), autores visíveis e o log nomeado pelo título com aria-labelledby. Os colegas usam from="other" (à esquerda); os seus comentários, from="user".',
            en: 'Relative times (timestampFormat="relative"), visible authors and the log named by the heading with aria-labelledby. Colleagues use from="other" (left side); your own comments, from="user".',
          }}
          code={CommentsCode}
          align="stretch"
        >
          <Comments />
        </Example>
        <Example
          title={{ pt: 'Estado vazio com sugestões', en: 'Empty state with suggestions' }}
          description={{
            pt: 'emptyState aparece enquanto não há mensagens (e some com loading).',
            en: 'emptyState shows while there are no messages (and hides with loading).',
          }}
          code={EmptyCode}
          align="stretch"
        >
          <Empty />
        </Example>
        <Example
          title={{ pt: 'Composer controlado', en: 'Controlled composer' }}
          description={{
            pt: 'value/onChange com rótulo visível, ações e contador (maxLength + showCount). No modo controlado, limpe o value no onSubmit.',
            en: 'value/onChange with a visible label, actions and a counter (maxLength + showCount). In controlled mode, clear the value in onSubmit.',
          }}
          code={ComposerCode}
        >
          <Composer />
        </Example>
      </Section>

      <Section title={{ pt: 'Rolagem', en: 'Scrolling' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'No fim', en: 'At the end' },
              description: {
                pt: 'Mensagens novas, o "Digitando…" e o texto que cresce (streaming) mantêm a conversa no fim — antes da pintura, sem salto.',
                en: 'New messages, "Typing…" and growing text (streaming) keep the thread at the end — before paint, without a jump.',
              },
            },
            {
              term: { pt: 'Rolado para cima', en: 'Scrolled up' },
              description: {
                pt: 'A posição não muda. Uma mensagem nova mostra "Novas mensagens ↓"; clicar rola até o fim (suave, ou instantâneo com movimento reduzido) e o foco vai para a conversa.',
                en: 'The position stays. A new message shows "New messages ↓"; clicking scrolls to the end (smooth, or instant with reduced motion) and focus moves to the thread.',
              },
            },
            {
              term: { pt: 'Mensagem sua', en: 'Your own message' },
              description: {
                pt: 'Uma mensagem nova com from="user" sempre leva ao fim: quem acabou de enviar quer vê-la.',
                en: 'A new from="user" message always goes to the end: whoever just sent it wants to see it.',
              },
            },
            {
              term: { pt: '"No fim"', en: '"At the end"' },
              description: {
                pt: 'Até 32px do fim. Voltar até lá (rolando) esconde o botão.',
                en: 'Within 32px of the end. Scrolling back there hides the button.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T
            pt="Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion."
            en="Durations and curves come from the motion tokens and drop to zero with prefers-reduced-motion."
          />
        </p>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Mensagem nova', en: 'New message' },
              description: {
                pt: 'Fade + 4px de baixo para cima — medium (250ms), ease-out. O histórico presente na montagem não anima.',
                en: 'Fade + 4px upward — medium (250ms), ease-out. History present on mount does not animate.',
              },
            },
            {
              term: { pt: 'Digitando…', en: 'Typing…' },
              description: {
                pt: 'Três pontos quadrados sobem 4px e acendem em sequência (loop/2, atraso de 2 × stagger). Movimento reduzido: pontos parados e acesos.',
                en: 'Three square dots rise 4px and light up in sequence (loop/2, 2 × stagger delay). Reduced motion: static, lit dots.',
              },
            },
            {
              term: { pt: 'Novas mensagens', en: 'New messages' },
              description: {
                pt: 'Entra com or-motion-pop (medium) e sai mais rápido (fast).',
                en: 'Enters with or-motion-pop (medium) and leaves faster (fast).',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'ChatThread', en: 'ChatThread' }}
          rows={[
            {
              name: 'children',
              type: 'ReactNode',
              description: {
                pt: 'As mensagens (ChatMessage), da mais antiga para a mais nova.',
                en: 'The messages (ChatMessage), oldest first.',
              },
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Mostra "Digitando…" no fim (e o anuncia). Segura o anúncio da resposta até desligar.',
                en: 'Shows "Typing…" at the end (and announces it). Holds the answer announcement until it turns off.',
              },
            },
            {
              name: 'emptyState',
              type: 'ReactNode',
              description: {
                pt: 'Conteúdo exibido sem mensagens.',
                en: 'Content shown when there are no messages.',
              },
            },
            {
              name: 'aria-label',
              type: 'string',
              default: "t('chatThreadLabel')",
              description: {
                pt: 'Nome do log ("Conversa"). Ou use aria-labelledby.',
                en: 'Log name ("Conversation"). Or use aria-labelledby.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Vão para o elemento <Code>role=&quot;log&quot;</Code> (assim como a{' '}
                    <Code>ref</Code>); <Code>className</Code> e <Code>style</Code> vão para o
                    contêiner.
                  </>
                ),
                en: (
                  <>
                    Go to the <Code>role=&quot;log&quot;</Code> element (as does the{' '}
                    <Code>ref</Code>); <Code>className</Code> and <Code>style</Code> go to the
                    container.
                  </>
                ),
              },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ChatMessage', en: 'ChatMessage' }}
          rows={[
            {
              name: 'from',
              type: "'user' | 'assistant' | 'other' | 'system'",
              required: true,
              description: {
                pt: 'user: a própria pessoa, à direita (acento). assistant: a IA, à esquerda (neutro). other: outra pessoa (atendente, colega), à esquerda num neutro mais fechado — exige author. system: aviso centralizado.',
                en: 'user: the person themselves, on the right (accent). assistant: the AI, on the left (neutral). other: another person (agent, colleague), on the left in a slightly darker neutral — requires author. system: centered notice.',
              },
            },
            {
              name: 'author',
              type: 'ReactNode',
              description: {
                pt: 'Nome visível (obrigatório com from="other" — sem ele há um aviso em desenvolvimento). Sem ele: "Você" / "Assistente" / "Participante" / "Sistema" só para leitores de tela.',
                en: 'Visible name (required with from="other" — a development warning fires without it). Without it: "You" / "Assistant" / "Participant" / "System" for screen readers only.',
              },
            },
            {
              name: 'avatar',
              type: 'ReactNode',
              description: {
                pt: 'Avatar ao lado do balão (decorativo, não interativo).',
                en: 'Avatar next to the bubble (decorative, non-interactive).',
              },
            },
            {
              name: 'timestamp',
              type: 'Date | string | number',
              description: {
                pt: (
                  <>
                    Momento da mensagem, em <Code>&lt;time dateTime&gt;</Code> (RelativeTime).
                  </>
                ),
                en: (
                  <>
                    Message time, in <Code>&lt;time dateTime&gt;</Code> (RelativeTime).
                  </>
                ),
              },
            },
            {
              name: 'timestampFormat',
              type: "'absolute' | 'relative' | 'auto'",
              default: "'absolute'",
              description: {
                pt: 'absolute: "14:05" hoje, "3 de nov., 14:05" antes; relative: "há 5 minutos".',
                en: 'absolute: "2:05 PM" today, "Nov 3, 2:05 PM" before; relative: "5 minutes ago".',
              },
            },
            {
              name: 'status',
              type: "'sending' | 'sent' | 'error'",
              description: {
                pt: 'sending: aria-busy (+ "Enviando…" no usuário); error: aviso e onRetry.',
                en: 'sending: aria-busy (+ "Sending…" for the user); error: notice and onRetry.',
              },
            },
            {
              name: 'onRetry',
              type: '() => void',
              description: {
                pt: 'Com status="error", mostra "Tentar novamente".',
                en: 'With status="error", shows "Try again".',
              },
            },
            {
              name: 'actions',
              type: 'ReactNode',
              description: {
                pt: 'Ações abaixo do balão (CopyButton, IconButton).',
                en: 'Actions below the bubble (CopyButton, IconButton).',
              },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: {
                pt: 'Texto simples (mantém quebras de linha) ou conteúdo rico.',
                en: 'Plain text (keeps line breaks) or rich content.',
              },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ChatComposer', en: 'ChatComposer' }}
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              required: true,
              description: {
                pt: 'Rótulo do campo (oculto por padrão).',
                en: 'Field label (hidden by default).',
              },
            },
            {
              name: 'hideLabel',
              type: 'boolean',
              default: 'true',
              description: { pt: 'Oculta o rótulo visualmente.', en: 'Visually hides the label.' },
            },
            {
              name: 'value',
              type: 'string',
              description: { pt: 'Texto (controlado).', en: 'Text (controlled).' },
            },
            {
              name: 'defaultValue',
              type: 'string',
              default: "''",
              description: {
                pt: 'Texto inicial (não controlado).',
                en: 'Initial text (uncontrolled).',
              },
            },
            {
              name: 'onChange',
              type: '(value: string) => void',
              description: { pt: 'Chamado a cada alteração.', en: 'Called on every change.' },
            },
            {
              name: 'onSubmit',
              type: '(value: string) => void',
              description: {
                pt: 'Enter ou botão, com o texto sem espaços nas pontas. Não chama vazio, disabled ou loading. Limpa sozinho só no modo não controlado.',
                en: 'Enter or button, with the trimmed text. Not called when empty, disabled or loading. Clears itself only when uncontrolled.',
              },
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'O botão vira "Parar" e Enter não envia (dá para continuar digitando).',
                en: 'The button becomes "Stop" and Enter does not send (typing still works).',
              },
            },
            {
              name: 'onStop',
              type: '() => void',
              description: { pt: 'Chamado por "Parar".', en: 'Called by "Stop".' },
            },
            {
              name: 'actions',
              type: 'ReactNode',
              description: {
                pt: 'Ações à esquerda do enviar (anexar…).',
                en: 'Actions left of send (attach…).',
              },
            },
            {
              name: 'maxLength',
              type: 'number',
              description: { pt: 'Limite de caracteres.', en: 'Character limit.' },
            },
            {
              name: 'showCount',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Contador "x de y caracteres" (requer maxLength).',
                en: '"x of y characters" counter (requires maxLength).',
              },
            },
            {
              name: 'rows',
              type: 'number',
              default: '1',
              description: { pt: 'Linhas iniciais.', en: 'Initial rows.' },
            },
            {
              name: 'maxRows',
              type: 'number',
              default: '6',
              description: {
                pt: 'Cresce até este número de linhas; depois rola.',
                en: 'Grows up to this many rows; then scrolls.',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Desabilita campo e botão.',
                en: 'Disables the field and the button.',
              },
            },
            {
              name: 'formProps',
              type: 'FormHTMLAttributes',
              description: {
                pt: (
                  <>
                    Atributos do <Code>&lt;form&gt;</Code> (a <Code>ref</Code> e as demais props vão
                    para o <Code>&lt;textarea&gt;</Code>).
                  </>
                ),
                en: (
                  <>
                    Attributes for the <Code>&lt;form&gt;</Code> (the <Code>ref</Code> and other
                    props go to the <Code>&lt;textarea&gt;</Code>).
                  </>
                ),
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
                <strong>Estrutura.</strong> A conversa é um <Code>role=&quot;log&quot;</Code>{' '}
                nomeado; cada mensagem é um <Code>&lt;article&gt;</Code> com{' '}
                <Code>aria-labelledby</Code> apontando para o autor e o horário (&quot;Assistente de
                vendas 11:42&quot;). Escolhemos <Code>article</Code> e não <Code>li</Code>: funciona
                dentro do log e sozinho (comentários num cartão), como no padrão Feed do APG, e
                leitores de tela navegam de mensagem em mensagem.
              </>
            }
            en={
              <>
                <strong>Structure.</strong> The thread is a named <Code>role=&quot;log&quot;</Code>;
                each message is an <Code>&lt;article&gt;</Code> with <Code>aria-labelledby</Code>{' '}
                pointing at the author and time (&quot;Sales assistant 11:42&quot;). We chose{' '}
                <Code>article</Code> over <Code>li</Code>: it works inside the log and on its own
                (comments in a card), like the APG Feed pattern, and screen readers move from
                message to message.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                <strong>Anúncios.</strong> O log fica com <Code>aria-live=&quot;off&quot;</Code>:
                lido como região viva, ele anunciaria o streaming aos pedaços e o nome das ações de
                cada mensagem. No lugar, uma região <Code>role=&quot;status&quot;</Code> separada e
                sempre montada anuncia só a última mensagem recebida, uma vez e completa
                (&quot;Assistente de vendas: …&quot;) — fora de <Code>loading</Code>, sem{' '}
                <Code>aria-busy</Code> e após 500ms sem mudanças — vale para <Code>assistant</Code>,{' '}
                <Code>other</Code> e <Code>system</Code>. O histórico da montagem e as mensagens do
                próprio usuário não são anunciados; &quot;Digitando…&quot; é anunciado quando{' '}
                <Code>loading</Code> liga; erros de envio usam <Code>role=&quot;alert&quot;</Code>.
              </>
            }
            en={
              <>
                <strong>Announcements.</strong> The log uses <Code>aria-live=&quot;off&quot;</Code>:
                as a live region it would announce streaming in chunks plus every message’s action
                names. Instead, a separate, always-mounted <Code>role=&quot;status&quot;</Code>{' '}
                region announces only the latest received message, once and complete (&quot;Sales
                assistant: …&quot;) — outside <Code>loading</Code>, without <Code>aria-busy</Code>{' '}
                and after 500ms without changes — for <Code>assistant</Code>, <Code>other</Code> and{' '}
                <Code>system</Code> alike. History present on mount and the user’s own messages are
                not announced; &quot;Typing…&quot; is announced when <Code>loading</Code> turns on;
                send errors use <Code>role=&quot;alert&quot;</Code>.
              </>
            }
          />
        </p>
        <Callout tone="info" title={{ pt: 'Enter envia', en: 'Enter sends' }}>
          <T
            pt={
              <>
                Num <Code>&lt;textarea&gt;</Code> comum, Enter quebra a linha. Aqui ele envia — por
                isso a instrução &quot;Enter envia; Shift + Enter quebra a linha.&quot; fica ligada
                ao campo por <Code>aria-describedby</Code>. Durante uma composição de IME (japonês,
                chinês, coreano…), Enter confirma o texto e não envia.
              </>
            }
            en={
              <>
                In a regular <Code>&lt;textarea&gt;</Code>, Enter adds a new line. Here it sends —
                so the instruction &quot;Enter sends; Shift + Enter adds a new line.&quot; is linked
                to the field with <Code>aria-describedby</Code>. During IME composition (Japanese,
                Chinese, Korean…), Enter confirms the text and does not send.
              </>
            }
          />
        </Callout>
        <KeyboardTable
          rows={[
            {
              keys: ['Enter'],
              description: {
                pt: 'No composer: envia (não durante loading nem composição de IME).',
                en: 'In the composer: sends (not during loading or IME composition).',
              },
            },
            {
              keys: ['Shift', 'Enter'],
              description: {
                pt: 'No composer: quebra a linha.',
                en: 'In the composer: adds a new line.',
              },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'Entra na conversa (quando ela rola), passa pelas ações das mensagens, pelo "Novas mensagens" e chega ao composer.',
                en: 'Enters the thread (when it scrolls), goes through message actions, "New messages" and reaches the composer.',
              },
            },
            {
              keys: ['↑', '↓'],
              description: {
                pt: 'Com o foco na conversa: rola.',
                en: 'With focus on the thread: scrolls.',
              },
            },
            {
              keys: ['Page Up', 'Page Down'],
              description: {
                pt: 'Com o foco na conversa: rola uma tela.',
                en: 'With focus on the thread: scrolls one screen.',
              },
            },
            {
              keys: ['Home', 'End'],
              description: {
                pt: 'Com o foco na conversa: início e fim.',
                en: 'With focus on the thread: start and end.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'log, article nomeado por autor e horário, <time dateTime> e rótulo no campo.',
                en: 'log, article named by author and time, <time dateTime> and a label on the field.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Quem escreveu é indicado pelo lado e pelo nome, não só pela cor do balão.',
                en: 'Who wrote is indicated by side and name, not only bubble color.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Palavras longas, URLs e código quebram dentro do balão em 320px.',
                en: 'Long words, URLs and code wrap inside the bubble at 320px.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'A conversa rolável é focável; enviar, parar e as ações funcionam pelo teclado.',
                en: 'The scrolling thread is focusable; send, stop and actions work by keyboard.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Entradas e pontos animados param com movimento reduzido.',
                en: 'Entrances and animated dots stop with reduced motion.',
              },
            },
            {
              criterion: '3.3.2',
              description: {
                pt: 'Instrução de Enter/Shift + Enter ligada ao campo.',
                en: 'Enter/Shift + Enter instruction linked to the field.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'Nova resposta e "Digitando…" anunciados numa região status; falhas de envio em alert.',
                en: 'New answers and "Typing…" announced in a status region; send failures in an alert.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
