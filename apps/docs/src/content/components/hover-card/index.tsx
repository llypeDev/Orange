import { Bullets, Callout, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T, useLang } from '../../../i18n'
import LinkPreview from './examples/LinkPreview'
import LinkPreviewCode from './examples/LinkPreview?raw'
import Mentions from './examples/Mentions'
import MentionsCode from './examples/Mentions?raw'
import Profile from './examples/Profile'
import ProfileCode from './examples/Profile?raw'
import { meta } from './meta'

export default function HoverCardPage() {
  const { t } = useLang()
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para pré-visualizar o destino de um link — perfil de uma pessoa, resumo de uma tarefa, prévia de um artigo — sem obrigar a abrir a página.',
              en: 'Use it to preview a link destination — a person’s profile, a task summary, an article preview — without forcing a page visit.',
            },
            {
              pt: 'O conteúdo é complementar: tudo que aparece no cartão precisa estar também no destino do link. Quem usa toque ou leitor de tela pode nunca ver o cartão.',
              en: 'The content is supplementary: everything in the card must also exist at the link destination. Touch and screen reader users may never see the card.',
            },
            {
              pt: 'Não coloque ações essenciais (botões de seguir, aprovar…) apenas no cartão. Para conteúdo interativo aberto por clique, use Popover.',
              en: "Don't put essential actions (follow, approve…) only in the card. For interactive content opened by click, use Popover.",
            },
            {
              pt: (
                <>
                  Ajuste <Code>openDelay</Code> para que o cartão não apareça ao simplesmente cruzar o link com o mouse.
                </>
              ),
              en: (
                <>
                  Tune <Code>openDelay</Code> so the card does not show up when the pointer merely crosses the link.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Perfil', en: 'Profile' }}
          description={{
            pt: 'Passe o ponteiro sobre o nome ou foque o link com Tab. O cartão continua aberto enquanto o ponteiro estiver sobre ele.',
            en: 'Hover the name or focus the link with Tab. The card stays open while the pointer is over it.',
          }}
          code={ProfileCode}
        >
          <Profile />
        </Example>
        <Example
          title={{ pt: 'Prévia de link', en: 'Link preview' }}
          description={{ pt: 'Com seta, acima do link e atraso de 400ms.', en: 'With an arrow, above the link and a 400ms delay.' }}
          code={LinkPreviewCode}
        >
          <LinkPreview />
        </Example>
        <Example
          title={{ pt: 'Menções', en: 'Mentions' }}
          description={{
            pt: 'Atrasos menores para listas de menções: ao passar de uma para outra, o cartão troca rapidamente.',
            en: 'Shorter delays for mention lists: moving from one to the next swaps the card quickly.',
          }}
          code={MentionsCode}
        >
          <Mentions />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'trigger', type: 'ReactElement', required: true, description: { pt: 'Link ou elemento focável que mostra o cartão.', en: 'Link or focusable element that shows the card.' } },
            { name: 'children', type: 'ReactNode', required: true, description: { pt: 'Conteúdo da pré-visualização.', en: 'Preview content.' } },
            { name: 'openDelay', type: 'number', default: '600', description: { pt: 'Atraso para abrir (ms).', en: 'Open delay (ms).' } },
            { name: 'closeDelay', type: 'number', default: '300', description: { pt: 'Atraso para fechar ao sair (ms).', en: 'Close delay on leave (ms).' } },
            { name: 'placement', type: 'Placement', default: "'bottom'", description: { pt: 'Posição preferida.', en: 'Preferred position.' } },
            { name: 'offset', type: 'number', default: '8', description: { pt: 'Distância do gatilho (px).', en: 'Distance from the trigger (px).' } },
            { name: 'arrow', type: 'boolean', default: 'false', description: { pt: 'Mostra a seta.', en: 'Shows the arrow.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Repassados ao cartão.', en: 'Passed to the card.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O cartão abre no hover e também no foco por teclado do gatilho, respeitando os atrasos. Ele não rouba o foco nem
                muda a semântica do link: o gatilho continua sendo um link comum que leva ao conteúdo completo. Escape fecha sem
                mover o foco.
              </>
            }
            en={
              <>
                The card opens on hover and also on keyboard focus of the trigger, honoring the delays. It does not steal focus or
                change the link semantics: the trigger is still a regular link to the full content. Escape closes it without
                moving focus.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Focar o link mostra o cartão após o atraso; sair dele fecha.', en: 'Focusing the link shows the card after the delay; leaving it closes it.' } },
            { keys: ['Enter'], description: { pt: 'Segue o link normalmente.', en: 'Follows the link as usual.' } },
            { keys: ['Esc'], description: { pt: 'Fecha o cartão sem mover o foco.', en: 'Closes the card without moving focus.' } },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Conteúdo complementar', en: 'Supplementary content' }}>
          {t({
            pt: 'Leitores de tela não são avisados da existência do cartão. Por isso ele nunca deve ser o único lugar de uma informação ou ação.',
            en: 'Screen readers are not told the card exists. That is why it must never be the only place for a piece of information or action.',
          })}
        </Callout>
        <WcagList
          items={[
            { criterion: '1.4.13', description: { pt: 'Dispensável com Escape, sobrevoável e persistente enquanto o ponteiro ou o foco estiver no gatilho/cartão.', en: 'Dismissible with Escape, hoverable and persistent while pointer or focus is on the trigger/card.' } },
            { criterion: '2.1.1', description: { pt: 'Também abre pelo foco do teclado, não só pelo mouse.', en: 'Also opens on keyboard focus, not just with the mouse.' } },
            { criterion: '3.2.1', description: { pt: 'Receber foco não muda o contexto: o cartão aparece sem mover o foco.', en: 'Receiving focus does not change context: the card appears without moving focus.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
