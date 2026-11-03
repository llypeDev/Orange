import { Bullets, Code, ComponentPage, DefinitionTable, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Help from './examples/Help'
import HelpCode from './examples/Help?raw'
import InlineEdit from './examples/InlineEdit'
import InlineEditCode from './examples/InlineEdit?raw'
import Placements from './examples/Placements'
import PlacementsCode from './examples/Placements?raw'
import Share from './examples/Share'
import ShareCode from './examples/Share?raw'
import { meta } from './meta'

export default function PopoverPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para conteúdo complementar e ações rápidas ligadas a um botão. O resto da página continua utilizável enquanto ele está aberto.',
              en: 'Use it for supplementary content and quick actions tied to a button. The rest of the page stays usable while it is open.',
            },
            {
              pt: 'Mantenha curto: um título, poucas linhas e no máximo um pequeno formulário. Se precisar de rolagem ou várias etapas, use um Drawer ou Modal.',
              en: 'Keep it short: a title, a few lines and at most a small form. If it needs scrolling or several steps, use a Drawer or Modal.',
            },
            {
              pt: 'Para um texto curto que explica um ícone, use Tooltip; para uma explicação acionada por clique, Toggletip; para uma lista de ações, Dropdown.',
              en: 'For short text explaining an icon, use Tooltip; for a click-triggered explanation, Toggletip; for a list of actions, Dropdown.',
            },
            {
              pt: (
                <>
                  Dê um nome ao painel: <Code>title</Code> visível ou <Code>aria-label</Code>. Sem nenhum dos dois, ele usa o texto
                  do gatilho.
                </>
              ),
              en: (
                <>
                  Name the panel: a visible <Code>title</Code> or <Code>aria-label</Code>. Without either, it uses the trigger's
                  text.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Quando usar cada sobreposição', en: 'Which overlay to use' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Popover', en: 'Popover' }, description: { pt: 'Conteúdo interativo não modal ancorado a um botão.', en: 'Non-modal interactive content anchored to a button.' } },
            { term: { pt: 'Tooltip', en: 'Tooltip' }, description: { pt: 'Rótulo curto em hover/foco, sem interação.', en: 'Short label on hover/focus, no interaction.' } },
            { term: { pt: 'Toggletip', en: 'Toggletip' }, description: { pt: 'Explicação curta aberta por clique num ícone de informação.', en: 'Short explanation opened by clicking an info icon.' } },
            { term: { pt: 'Dropdown', en: 'Dropdown' }, description: { pt: 'Lista de ações ou opções com navegação por setas.', en: 'List of actions or options with arrow-key navigation.' } },
            { term: { pt: 'Modal', en: 'Modal' }, description: { pt: 'Tarefa que bloqueia a página até ser concluída.', en: 'Task that blocks the page until it is done.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Compartilhar', en: 'Share' }}
          description={{
            pt: 'Com título, botão fechar e seta. O foco vai para o primeiro controle ao abrir.',
            en: 'With a title, close button and arrow. Focus moves to the first control on open.',
          }}
          code={ShareCode}
        >
          <Share />
        </Example>
        <Example
          title={{ pt: 'Edição rápida', en: 'Quick edit' }}
          description={{
            pt: (
              <>
                <Code>initialFocus</Code> leva o foco direto ao campo; <Code>children</Code> como função recebe{' '}
                <Code>close</Code>, que fecha e devolve o foco ao gatilho.
              </>
            ),
            en: (
              <>
                <Code>initialFocus</Code> moves focus straight to the field; <Code>children</Code> as a function receives{' '}
                <Code>close</Code>, which closes and returns focus to the trigger.
              </>
            ),
          }}
          code={InlineEditCode}
        >
          <InlineEdit />
        </Example>
        <Example
          title={{ pt: 'Posições', en: 'Placements' }}
          description={{
            pt: 'placement aceita top, right, bottom, left e as variações -start/-end. Flip e shift mantêm o painel na tela.',
            en: 'placement accepts top, right, bottom, left and their -start/-end variants. Flip and shift keep the panel on screen.',
          }}
          code={PlacementsCode}
          align="center"
        >
          <Placements />
        </Example>
        <Example
          title={{ pt: 'Ajuda contextual', en: 'Contextual help' }}
          description={{
            pt: 'Sem título visível: aria-label nomeia o painel. Diferente do Tooltip, pode conter links.',
            en: 'No visible title: aria-label names the panel. Unlike Tooltip, it can contain links.',
          }}
          code={HelpCode}
        >
          <Help />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'trigger', type: 'ReactElement', required: true, description: { pt: 'Botão que abre o popover. Recebe aria-haspopup, aria-expanded e aria-controls.', en: 'Button that opens the popover. Receives aria-haspopup, aria-expanded and aria-controls.' } },
            { name: 'children', type: 'ReactNode | ({ close }) => ReactNode', description: { pt: 'Conteúdo do painel.', en: 'Panel content.' } },
            { name: 'title', type: 'ReactNode', description: { pt: 'Título visível; nomeia o painel.', en: 'Visible title; names the panel.' } },
            { name: 'placement', type: 'Placement', default: "'bottom'", description: { pt: 'Posição preferida (top, bottom-start, right-end…).', en: 'Preferred position (top, bottom-start, right-end…).' } },
            { name: 'offset', type: 'number', default: '8', description: { pt: 'Distância do gatilho em px.', en: 'Distance from the trigger in px.' } },
            { name: 'arrow', type: 'boolean', default: 'false', description: { pt: 'Mostra a seta.', en: 'Shows the arrow.' } },
            { name: 'showCloseButton', type: 'boolean', default: 'false', description: { pt: 'Botão fechar no cabeçalho.', en: 'Close button in the header.' } },
            { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: { pt: 'Elemento focado ao abrir.', en: 'Element focused on open.' } },
            { name: 'closeOnOutsideClick', type: 'boolean', default: 'true', description: { pt: 'Fecha ao clicar fora.', en: 'Closes on outside click.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Repassados ao painel (ex.: aria-label, className).', en: 'Passed to the panel (e.g. aria-label, className).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O painel é um diálogo não modal (<Code>role="dialog"</Code>, sem <Code>aria-modal</Code>). O gatilho expõe{' '}
                <Code>aria-haspopup="dialog"</Code>, <Code>aria-expanded</Code> e <Code>aria-controls</Code>. Ao abrir, o foco vai
                para o conteúdo; na ordem de Tab, o painel se comporta como se estivesse logo depois do gatilho. Escape e clique
                fora fecham e devolvem o foco ao gatilho.
              </>
            }
            en={
              <>
                The panel is a non-modal dialog (<Code>role="dialog"</Code>, no <Code>aria-modal</Code>). The trigger exposes{' '}
                <Code>aria-haspopup="dialog"</Code>, <Code>aria-expanded</Code> and <Code>aria-controls</Code>. On open, focus moves
                into the content; in Tab order, the panel behaves as if it sat right after the trigger. Escape and outside clicks
                close it and return focus to the trigger.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Enter'], description: { pt: 'No gatilho: abre ou fecha o popover.', en: 'On the trigger: opens or closes the popover.' } },
            { keys: ['Tab'], description: { pt: 'Percorre o conteúdo; no último elemento, fecha e segue para o próximo item da página.', en: 'Moves through the content; on the last element, closes and moves on to the next item on the page.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'No primeiro elemento, volta ao gatilho (o painel continua aberto).', en: 'On the first element, goes back to the trigger (the panel stays open).' } },
            { keys: ['Esc'], description: { pt: 'Fecha e devolve o foco ao gatilho.', en: 'Closes and returns focus to the trigger.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.2', description: { pt: 'Ordem de foco lógica mesmo com o conteúdo renderizado em portal.', en: 'Logical focus order even though the content renders in a portal.' } },
            { criterion: '2.1.1', description: { pt: 'Abre, navega e fecha só com o teclado.', en: 'Opens, navigates and closes with the keyboard alone.' } },
            { criterion: '2.4.3', description: { pt: 'Foco entra no painel ao abrir e volta ao gatilho ao fechar.', en: 'Focus enters the panel on open and returns to the trigger on close.' } },
            { criterion: '4.1.2', description: { pt: 'Estado aberto/fechado exposto por aria-expanded.', en: 'Open/closed state exposed through aria-expanded.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
