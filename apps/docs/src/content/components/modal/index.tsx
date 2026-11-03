import { Button, Modal, ModalBody, ModalFooter } from '@orange/ui'
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
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import Scrolling from './examples/Scrolling'
import ScrollingCode from './examples/Scrolling?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import { meta } from './meta'

export default function ModalPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use o Modal só quando a tarefa exige atenção imediata: uma decisão, um formulário curto, uma confirmação. Para conteúdo que pode conviver com a página, prefira um Drawer, um Popover ou uma página própria.',
              en: 'Use a Modal only when the task needs immediate attention: a decision, a short form, a confirmation. For content that can live alongside the page, prefer a Drawer, a Popover or a dedicated page.',
            },
            {
              pt: (
                <>
                  O título diz o que o usuário vai fazer — <strong>Convidar pessoas</strong>, não <strong>Atenção</strong>. Use a
                  descrição para a consequência ou o contexto.
                </>
              ),
              en: (
                <>
                  The title says what the user is about to do — <strong>Invite people</strong>, not <strong>Attention</strong>. Use
                  the description for consequences or context.
                </>
              ),
            },
            {
              pt: 'No rodapé, a ação principal fica à direita e com verbo específico; Cancelar fica à esquerda dela. Uma única ação primária.',
              en: 'In the footer, the main action sits on the right with a specific verb; Cancel sits to its left. A single primary action.',
            },
            {
              pt: 'Não empilhe modais. Se precisar de uma confirmação dentro de um modal, use o ConfirmDialog — e só para ações destrutivas.',
              en: "Don't stack modals. If you need a confirmation inside a modal, use ConfirmDialog — and only for destructive actions.",
            },
            {
              pt: (
                <>
                  Desligue <Code>closeOnOverlayClick</Code> quando houver dados digitados que se perderiam com um clique acidental.
                </>
              ),
              en: (
                <>
                  Turn off <Code>closeOnOverlayClick</Code> when typed data would be lost by an accidental click.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Modal title="Arquivar projeto" size="sm" trigger={<Button variant="outline">Ver exemplo</Button>}>
              {({ close }) => (
                <>
                  <ModalBody>O projeto sai da lista principal, mas continua acessível em Arquivados.</ModalBody>
                  <ModalFooter>
                    <Button variant="outline" onClick={close}>
                      Cancelar
                    </Button>
                    <Button onClick={close}>Arquivar projeto</Button>
                  </ModalFooter>
                </>
              )}
            </Modal>
          }
          dontExample={
            <Modal title="Atenção!" size="sm" trigger={<Button variant="outline">Ver exemplo</Button>}>
              {({ close }) => (
                <>
                  <ModalBody>Tem certeza?</ModalBody>
                  <ModalFooter>
                    <Button onClick={close}>Não</Button>
                    <Button onClick={close}>Sim</Button>
                  </ModalFooter>
                </>
              )}
            </Modal>
          }
          doItems={[
            { pt: 'Título com a tarefa, corpo com a consequência e uma ação primária específica.', en: 'Title with the task, body with the consequence and one specific primary action.' },
          ]}
          dontItems={[
            { pt: 'Título genérico, pergunta vaga e duas ações primárias "Sim/Não".', en: 'Generic title, vague question and two primary "Yes/No" actions.' },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Título', en: 'Title' },
              description: { pt: <>Obrigatório. Nomeia o diálogo via <Code>aria-labelledby</Code>.</>, en: <>Required. Names the dialog via <Code>aria-labelledby</Code>.</> },
            },
            {
              term: { pt: 'Descrição', en: 'Description' },
              description: { pt: <>Opcional. Lida junto com o título via <Code>aria-describedby</Code>.</>, en: <>Optional. Read with the title via <Code>aria-describedby</Code>.</> },
            },
            {
              term: { pt: 'Botão fechar', en: 'Close button' },
              description: { pt: 'Sempre presente no cabeçalho (a menos que hideCloseButton). Rótulo traduzido "Fechar".', en: 'Always in the header (unless hideCloseButton). Translated "Close" label.' },
            },
            {
              term: { pt: 'ModalBody', en: 'ModalBody' },
              description: { pt: 'Conteúdo principal. Rola internamente quando passa da altura da tela.', en: 'Main content. Scrolls internally when taller than the screen.' },
            },
            {
              term: { pt: 'ModalFooter', en: 'ModalFooter' },
              description: { pt: 'Ações alinhadas à direita, separadas do corpo por uma borda.', en: 'Right-aligned actions, separated from the body by a border.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Formulário curto', en: 'Short form' }}
          description={{
            pt: (
              <>
                Com <Code>trigger</Code>, o Modal controla o próprio estado. <Code>children</Code> pode ser uma função que recebe{' '}
                <Code>close</Code>. O foco vai para o primeiro campo.
              </>
            ),
            en: (
              <>
                With <Code>trigger</Code>, the Modal manages its own state. <Code>children</Code> can be a function that receives{' '}
                <Code>close</Code>. Focus moves to the first field.
              </>
            ),
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{ pt: 'sm (400px), md (560px, padrão), lg (800px) e full (tela inteira).', en: 'sm (400px), md (560px, default), lg (800px) and full (full screen).' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Conteúdo longo', en: 'Long content' }}
          description={{
            pt: 'Cabeçalho e rodapé ficam fixos; só o ModalBody rola. Aqui o clique no fundo está desligado.',
            en: 'Header and footer stay put; only ModalBody scrolls. Overlay click is turned off here.',
          }}
          code={ScrollingCode}
        >
          <Scrolling />
        </Example>
        <Example
          title={{ pt: 'Controlado com foco inicial', en: 'Controlled with initial focus' }}
          description={{
            pt: (
              <>
                <Code>open</Code> + <Code>onOpenChange</Code> para controlar o estado e <Code>initialFocus</Code> para escolher
                quem recebe o foco. Um <Code>&lt;form&gt;</Code> pode envolver corpo e rodapé.
              </>
            ),
            en: (
              <>
                <Code>open</Code> + <Code>onOpenChange</Code> to control the state and <Code>initialFocus</Code> to choose what
                receives focus. A <Code>&lt;form&gt;</Code> can wrap body and footer.
              </>
            ),
          }}
          code={ControlledCode}
        >
          <Controlled />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Modal', en: 'Modal' }}
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: { pt: 'Título visível; nomeia o diálogo.', en: 'Visible title; names the dialog.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio sob o título (aria-describedby).', en: 'Supporting text under the title (aria-describedby).' } },
            { name: 'open', type: 'boolean', description: { pt: 'Estado aberto (controlado).', en: 'Open state (controlled).' } },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: { pt: 'Estado inicial (não controlado).', en: 'Initial state (uncontrolled).' } },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: { pt: 'Chamado ao abrir ou fechar.', en: 'Called when opening or closing.' } },
            { name: 'trigger', type: 'ReactElement', description: { pt: 'Elemento que abre o diálogo (modo não controlado).', en: 'Element that opens the dialog (uncontrolled mode).' } },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: { pt: 'Largura do diálogo.', en: 'Dialog width.' } },
            { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: { pt: 'Elemento focado ao abrir. Padrão: primeiro focável do conteúdo.', en: 'Element focused on open. Default: first focusable in the content.' } },
            { name: 'finalFocus', type: 'RefObject<HTMLElement>', description: { pt: 'Elemento focado ao fechar. Padrão: o que estava focado antes.', en: 'Element focused on close. Default: what was focused before.' } },
            { name: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: { pt: 'Fecha ao clicar no fundo.', en: 'Closes when the overlay is clicked.' } },
            { name: 'closeOnEscape', type: 'boolean', default: 'true', description: { pt: 'Fecha com Escape.', en: 'Closes with Escape.' } },
            { name: 'hideCloseButton', type: 'boolean', default: 'false', description: { pt: 'Esconde o botão fechar do cabeçalho.', en: 'Hides the header close button.' } },
            { name: 'children', type: 'ReactNode | ({ close }) => ReactNode', description: { pt: 'Conteúdo: ModalBody e ModalFooter.', en: 'Content: ModalBody and ModalFooter.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Repassados ao painel do diálogo (role="dialog").', en: 'Passed to the dialog panel (role="dialog").' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ModalBody e ModalFooter', en: 'ModalBody and ModalFooter' }}
          rows={[
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos de <div>. O corpo rola; o rodapé alinha as ações à direita.', en: '<div> attributes. The body scrolls; the footer right-aligns actions.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <em>Dialog (Modal)</em> do WAI-ARIA APG: <Code>role="dialog"</Code> com{' '}
                <Code>aria-modal="true"</Code>, nome pelo título e descrição pelo texto de apoio. O conteúdo é renderizado em
                portal, o foco fica preso dentro do diálogo, o scroll da página é bloqueado e, ao fechar, o foco volta para quem
                abriu. Sobreposições abertas dentro do Modal (Popover, Dropdown, Tooltip) ficam acima dele e Escape fecha uma
                camada por vez.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <em>Dialog (Modal)</em> pattern: <Code>role="dialog"</Code> with{' '}
                <Code>aria-modal="true"</Code>, named by the title and described by the supporting text. Content renders in a
                portal, focus is trapped inside, page scroll is locked and, on close, focus returns to whatever opened it.
                Overlays opened inside the Modal (Popover, Dropdown, Tooltip) stack above it and Escape closes one layer at a time.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Próximo elemento focável dentro do diálogo; do último volta ao primeiro.', en: 'Next focusable element inside the dialog; wraps from last to first.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'Elemento anterior; do primeiro vai ao último.', en: 'Previous element; wraps from first to last.' } },
            { keys: ['Esc'], description: { pt: 'Fecha o diálogo e devolve o foco ao gatilho.', en: 'Closes the dialog and returns focus to the trigger.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Título e descrição ligados por aria-labelledby/aria-describedby.', en: 'Title and description wired through aria-labelledby/aria-describedby.' } },
            { criterion: '2.1.2', description: { pt: 'Sem armadilha de teclado: Escape e o botão Fechar sempre saem do diálogo.', en: 'No keyboard trap: Escape and the Close button always leave the dialog.' } },
            { criterion: '2.4.3', description: { pt: 'Ordem de foco previsível: entra no diálogo ao abrir e volta ao gatilho ao fechar.', en: 'Predictable focus order: enters the dialog on open and returns to the trigger on close.' } },
            { criterion: '2.4.7', description: { pt: 'Todos os controles mantêm o foco visível laranja.', en: 'Every control keeps the visible orange focus ring.' } },
            { criterion: '4.1.2', description: { pt: <>Papel <Code>dialog</Code>, estado modal e botão Fechar com nome acessível traduzido.</>, en: <><Code>dialog</Code> role, modal state and a Close button with a translated accessible name.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
