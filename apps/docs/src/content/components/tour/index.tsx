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
import Anuncio from './examples/Anuncio'
import AnuncioCode from './examples/Anuncio?raw'
import Controlado from './examples/Controlado'
import ControladoCode from './examples/Controlado?raw'
import PainelPedidos from './examples/PainelPedidos'
import PainelPedidosCode from './examples/PainelPedidos?raw'
import { meta } from './meta'

export default function TourPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use o Tour para apresentar o que mudou — um painel novo, um recurso recém-lançado. Não use para ensinar a interface inteira: se a tela precisa de um tour para ser entendida, o problema é a tela.',
              en: "Use a Tour to introduce what changed — a new dashboard, a just-launched feature. Don't use it to teach the whole interface: if a screen needs a tour to be understood, the problem is the screen.",
            },
            {
              pt: (
                <>
                  Três a cinco passos, cada um com <strong>um</strong> elemento e <strong>uma</strong> ideia. O título diz o
                  benefício (<strong>Filtre por status</strong>), não o nome do controle (<strong>Segmented control</strong>).
                </>
              ),
              en: (
                <>
                  Three to five steps, each with <strong>one</strong> element and <strong>one</strong> idea. The title states the
                  benefit (<strong>Filter by status</strong>), not the control name (<strong>Segmented control</strong>).
                </>
              ),
            },
            {
              pt: 'Comece o tour por uma ação da pessoa (um botão "Conheça as novidades", um item no menu Ajuda) ou uma única vez após a atualização — e lembre que ele já foi visto. Nunca abra sozinho a cada visita.',
              en: 'Start the tour from a user action (a "See what\'s new" button, an item in the Help menu) or once after the update — and remember it was seen. Never open it on every visit.',
            },
            {
              pt: (
                <>
                  Mantenha <Code>dismissible</Code> ligado: pular precisa ser sempre possível. Desligue só em fluxos curtos e
                  obrigatórios, em que concluir é o único caminho.
                </>
              ),
              en: (
                <>
                  Keep <Code>dismissible</Code> on: skipping must always be possible. Turn it off only for short, mandatory flows
                  where finishing is the only way forward.
                </>
              ),
            },
            {
              pt: 'Destaque elementos que estão na tela atual. Um passo cujo alvo não existe (oculto, em outra rota, ainda carregando) aparece centralizado, sem recorte — escreva o texto para fazer sentido também assim.',
              en: 'Highlight elements on the current screen. A step whose target does not exist (hidden, on another route, still loading) shows centered, with no cutout — write the copy so it also makes sense that way.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Fundo e recorte', en: 'Backdrop and cutout' }, description: { pt: 'A página escurece (--or-color-overlay) e um recorte com contorno de acento de 1px deixa o alvo à vista. O fundo cobre a tela toda, inclusive o alvo: ele fica visível, mas não clicável, enquanto o tour está aberto.', en: 'The page dims (--or-color-overlay) and a cutout with a 1px accent outline keeps the target visible. The backdrop covers the whole screen, target included: it is visible but not clickable while the tour is open.' } },
            { term: { pt: 'Diálogo', en: 'Dialog' }, description: { pt: 'Ao lado do alvo, com uma seta apontando para ele; troca de lado sozinho se faltar espaço. Sem alvo, fica no centro. Em telas estreitas vira uma folha na borda inferior (ou superior, se o alvo estiver embaixo).', en: 'Next to the target, with an arrow pointing at it; flips sides on its own when space runs out. Without a target it sits in the center. On narrow screens it becomes a sheet on the bottom edge (or the top, if the target is low on the screen).' } },
            { term: { pt: 'Cabeçalho', en: 'Header' }, description: { pt: 'Eyebrow com o nome do tour (label) e o botão "Pular tour".', en: 'Eyebrow with the tour name (label) and the "Skip tour" button.' } },
            { term: { pt: 'Mídia, título e texto', en: 'Media, title and text' }, description: { pt: 'Imagem opcional, título do passo (nomeia o diálogo) e texto (descreve o diálogo).', en: 'Optional image, step title (names the dialog) and text (describes the dialog).' } },
            { term: { pt: 'Rodapé', en: 'Footer' }, description: { pt: 'Pontos de progresso (decorativos), contador "2 de 4" e os botões Voltar e Próximo — que vira Concluir no último passo. Com um passo só, o contador some.', en: 'Progress dots (decorative), a "2 of 4" counter and the Back and Next buttons — Next becomes Finish on the last step. With a single step, the counter is hidden.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Novo painel de pedidos', en: 'New orders dashboard' }}
          description={{
            pt: 'Quatro passos sobre um painel fictício. Os alvos são refs de elementos do próprio exemplo; o recorte desliza de um para o outro.',
            en: 'Four steps over a mock dashboard. Targets are refs to elements inside the example; the cutout glides from one to the next.',
          }}
          code={PainelPedidosCode}
        >
          <PainelPedidos />
        </Example>
        <Example
          title={{ pt: 'Anúncio de recurso', en: 'Feature announcement' }}
          description={{
            pt: 'Um passo sem alvo: diálogo centralizado com mídia, sem recorte nem contador.',
            en: 'A single step with no target: centered dialog with media, no cutout and no counter.',
          }}
          code={AnuncioCode}
        >
          <Anuncio />
        </Example>
        <Example
          title={{ pt: 'Controlado', en: 'Controlled' }}
          description={{
            pt: (
              <>
                <Code>open</Code> e <Code>step</Code> controlados: o tour começa por um botão (ou direto num passo) e os eventos{' '}
                <Code>onStepChange</Code>, <Code>onFinish</Code> e <Code>onSkip</Code> alimentam o estado da página.
              </>
            ),
            en: (
              <>
                Controlled <Code>open</Code> and <Code>step</Code>: the tour starts from a button (or straight at a step) and the{' '}
                <Code>onStepChange</Code>, <Code>onFinish</Code> and <Code>onSkip</Code> events feed the page state.
              </>
            ),
          }}
          code={ControladoCode}
        >
          <Controlado />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Abrir', en: 'Open' }, description: { pt: 'O fundo faz fade e o diálogo entra com or-motion-pop (sobe 4px, escala 0,98 → 1). 250ms (--or-duration-medium), --or-ease-out.', en: 'The backdrop fades in and the dialog enters with or-motion-pop (rises 4px, 0.98 → 1 scale). 250ms (--or-duration-medium), --or-ease-out.' } },
            { term: { pt: 'Trocar de passo', en: 'Change step' }, description: { pt: 'Se o novo alvo estiver fora da tela, a página rola até ele (centralizado) antes; então o recorte e o diálogo deslizam até o novo alvo. Só transform: 400ms (--or-duration-slow), --or-ease-in-out. O conteúdo do passo entra em fade.', en: 'If the new target is off-screen, the page first scrolls to it (centered); then the cutout and the dialog glide to the new target. Transform only: 400ms (--or-duration-slow), --or-ease-in-out. The step content fades in.' } },
            { term: { pt: 'Passo sem alvo', en: 'Step without target' }, description: { pt: 'O recorte se fecha num ponto, o contorno some (opacidade, 160ms) e o diálogo desliza para o centro.', en: 'The cutout closes into a point, the outline fades out (opacity, 160ms) and the dialog glides to the center.' } },
            { term: { pt: 'Progresso', en: 'Progress' }, description: { pt: 'O ponto atual cresce com --or-ease-spring e ganha o acento.', en: 'The current dot grows with --or-ease-spring and takes the accent.' } },
            { term: { pt: 'Fechar', en: 'Close' }, description: { pt: 'Diálogo e fundo saem juntos em 160ms (--or-duration-fast), --or-ease-in-out; o conteúdo fica inerte durante a saída.', en: 'Dialog and backdrop leave together in 160ms (--or-duration-fast), --or-ease-in-out; content is inert while leaving.' } },
            { term: { pt: 'Rolagem e redimensionamento', en: 'Scroll and resize' }, description: { pt: 'Fora das trocas de passo, recorte e diálogo acompanham o alvo sem atraso.', en: 'Outside step changes, cutout and dialog follow the target with no lag.' } },
            { term: { pt: 'prefers-reduced-motion', en: 'prefers-reduced-motion' }, description: { pt: 'Tudo instantâneo: a rolagem até o alvo é imediata (behavior: auto), o recorte e o diálogo pulam direto para o lugar e as entradas/saídas não se deslocam.', en: 'Everything is instant: scrolling to the target is immediate (behavior: auto), the cutout and the dialog jump straight into place and enter/exit with no movement.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Tour', en: 'Tour' }}
          rows={[
            { name: 'steps', type: 'TourStep[]', required: true, description: { pt: 'Passos do tour, na ordem.', en: 'Tour steps, in order.' } },
            { name: 'open', type: 'boolean', description: { pt: 'Aberto (controlado).', en: 'Open (controlled).' } },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: { pt: 'Aberto inicialmente (não controlado).', en: 'Initially open (uncontrolled).' } },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: { pt: 'Chamado ao abrir e ao fechar (concluir, pular, Escape).', en: 'Called on open and close (finish, skip, Escape).' } },
            { name: 'step', type: 'number', description: { pt: 'Índice do passo atual, a partir de 0 (controlado).', en: 'Current step index, from 0 (controlled).' } },
            { name: 'defaultStep', type: 'number', default: '0', description: { pt: 'Passo inicial (não controlado). O tour volta para ele ao fechar.', en: 'Initial step (uncontrolled). The tour goes back to it when closed.' } },
            { name: 'onStepChange', type: '(step: number) => void', description: { pt: 'Chamado com o passo pedido por Próximo/Voltar.', en: 'Called with the step requested by Next/Back.' } },
            { name: 'onFinish', type: '() => void', description: { pt: 'Concluir no último passo.', en: 'Finish on the last step.' } },
            { name: 'onSkip', type: '(step: number) => void', description: { pt: 'Pular tour ou Escape, com o índice do passo atual.', en: 'Skip tour or Escape, with the current step index.' } },
            { name: 'label', type: 'string', default: "t('tourLabel')", description: { pt: 'Nome do tour (ex.: "Novidades do painel"). Eyebrow visível e início do nome acessível do diálogo.', en: 'Tour name (e.g. "Dashboard updates"). Visible eyebrow and start of the dialog accessible name.' } },
            { name: 'spotlightPadding', type: 'number', default: '8', description: { pt: 'Folga entre o alvo e a borda do recorte, em px.', en: 'Gap between the target and the cutout edge, in px.' } },
            { name: 'dismissible', type: 'boolean', default: 'true', description: { pt: 'Mostra "Pular tour" e aceita Escape.', en: 'Shows "Skip tour" and accepts Escape.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Repassados ao diálogo (role="dialog"); a ref também aponta para ele.', en: 'Passed to the dialog (role="dialog"); the ref points to it too.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'TourStep', en: 'TourStep' }}
          rows={[
            { name: 'target', type: 'string | RefObject<Element> | () => Element | null', description: { pt: 'Elemento destacado: seletor CSS, ref ou função. Sem alvo (ou alvo ausente), o passo fica centralizado e sem recorte.', en: 'Highlighted element: CSS selector, ref or function. Without a target (or with a missing one) the step is centered with no cutout.' } },
            { name: 'title', type: 'ReactNode', required: true, description: { pt: 'Título do passo; nomeia o diálogo.', en: 'Step title; names the dialog.' } },
            { name: 'content', type: 'ReactNode', required: true, description: { pt: 'Texto do passo; descreve o diálogo.', en: 'Step text; describes the dialog.' } },
            { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' | 'auto'", default: "'auto'", description: { pt: 'Lado do alvo onde o diálogo aparece; inverte se faltar espaço. auto escolhe o lado com mais espaço.', en: 'Side of the target where the dialog shows; flips when space runs out. auto picks the side with the most room.' } },
            { name: 'media', type: 'ReactNode', description: { pt: 'Imagem, vídeo ou ilustração acima do título (dê um texto alternativo).', en: 'Image, video or illustration above the title (give it alt text).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Cada passo é um diálogo modal (padrão <em>Dialog (Modal)</em> do WAI-ARIA APG): <Code>role="dialog"</Code> com{' '}
                <Code>aria-modal="true"</Code>, nomeado pelo nome do tour + título do passo e descrito pelo texto do passo. O
                foco fica preso no diálogo; ao abrir e a cada troca de passo ele vai para o título, que é lido pelo leitor de
                tela. Ao fechar, volta para o elemento que estava focado quando o tour abriu. Como no Modal, o restante da página
                fica inerte: o fundo bloqueia cliques, o foco não sai do diálogo e o scroll da página é travado.
              </>
            }
            en={
              <>
                Each step is a modal dialog (WAI-ARIA APG <em>Dialog (Modal)</em> pattern): <Code>role="dialog"</Code> with{' '}
                <Code>aria-modal="true"</Code>, named by the tour name + step title and described by the step text. Focus is
                trapped in the dialog; on open and on every step change it moves to the title, which screen readers announce. On
                close it returns to whatever was focused when the tour opened. As with Modal, the rest of the page is inert: the
                backdrop blocks clicks, focus cannot leave the dialog and page scroll is locked.
              </>
            }
          />
        </p>
        <Callout tone="info" title={{ pt: 'O alvo não é clicável', en: 'The target is not clickable' }}>
          <T
            pt="O tour é modal: o elemento destacado fica visível pelo recorte, mas não recebe cliques nem foco enquanto o tour está aberto. Para pedir que a pessoa experimente o recurso, conclua o tour e deixe o controle livre."
            en="The tour is modal: the highlighted element is visible through the cutout but receives no clicks or focus while the tour is open. To invite people to try the feature, finish the tour and leave the control free."
          />
        </Callout>
        <p>
          <T
            pt={
              <>
                Os pontos de progresso são decorativos (<Code>aria-hidden</Code>); a posição é dada pelo contador em texto
                ("2 de 4"). Os rótulos internos — Voltar, Próximo, Concluir, Pular tour e o contador — vêm do dicionário de
                mensagens e seguem o idioma do <Code>OrangeProvider</Code>.
              </>
            }
            en={
              <>
                Progress dots are decorative (<Code>aria-hidden</Code>); position is conveyed by the text counter ("2 of 4").
                Internal labels — Back, Next, Finish, Skip tour and the counter — come from the message dictionary and follow the{' '}
                <Code>OrangeProvider</Code> locale.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Do título para os controles do passo; do último volta ao primeiro.', en: 'From the title to the step controls; wraps from last to first.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'Controle anterior; do primeiro vai ao último.', en: 'Previous control; wraps from first to last.' } },
            { keys: ['Enter'], description: { pt: 'Ativa o botão focado (Próximo, Voltar, Concluir, Pular tour).', en: 'Activates the focused button (Next, Back, Finish, Skip tour).' } },
            { keys: ['Esc'], description: { pt: 'Pula o tour (onSkip) e devolve o foco. Ignorado com dismissible={false}.', en: 'Skips the tour (onSkip) and returns focus. Ignored with dismissible={false}.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Título e texto ligados por aria-labelledby/aria-describedby; progresso em texto, não só em pontos.', en: 'Title and text wired through aria-labelledby/aria-describedby; progress in text, not just dots.' } },
            { criterion: '1.4.11', description: { pt: 'Contorno de acento de 1px ao redor do recorte nos dois temas (Highlight em alto contraste).', en: '1px accent outline around the cutout in both themes (Highlight in forced colors).' } },
            { criterion: '2.1.2', description: { pt: 'Sem armadilha de teclado: Escape e Pular tour saem do tour; sem dismissible, Concluir é sempre alcançável.', en: 'No keyboard trap: Escape and Skip tour leave the tour; without dismissible, Finish is always reachable.' } },
            { criterion: '2.4.3', description: { pt: 'Foco no título a cada passo e retorno ao ponto de origem ao fechar.', en: 'Focus on the title at every step and back to the origin on close.' } },
            { criterion: '2.4.11', description: { pt: 'O foco fica sempre no diálogo, acima do fundo — nunca encoberto. O alvo é rolado para o centro da tela antes de cada passo.', en: 'Focus always stays in the dialog, above the backdrop — never obscured. The target is scrolled to the center of the screen before each step.' } },
            { criterion: '2.3.3', description: { pt: 'Com movimento reduzido, rolagem e transições são instantâneas.', en: 'With reduced motion, scrolling and transitions are instant.' } },
            { criterion: '4.1.2', description: { pt: <>Papel <Code>dialog</Code>, estado modal e botões com nomes traduzidos.</>, en: <><Code>dialog</Code> role, modal state and buttons with translated names.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
