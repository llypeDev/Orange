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
import EditorPreview from './examples/EditorPreview'
import EditorPreviewCode from './examples/EditorPreview?raw'
import ListDetail from './examples/ListDetail'
import ListDetailCode from './examples/ListDetail?raw'
import Persisted from './examples/Persisted'
import PersistedCode from './examples/Persisted?raw'
import ThreePanels from './examples/ThreePanels'
import ThreePanelsCode from './examples/ThreePanels?raw'
import { meta } from './meta'

export default function SplitterPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use quando a pessoa precisa equilibrar duas ou três áreas que trabalham juntas: lista e detalhe, editor e prévia, inspetor, console de logs. Para a estrutura da página (cabeçalho, menu lateral), use o AppShell.',
              en: 'Use it when people need to balance two or three areas that work together: list and detail, editor and preview, an inspector, a log console. For the page scaffold (header, side menu), use AppShell.',
            },
            {
              pt: (
                <>
                  Dê um <Code>label</Code> a cada painel: ele nomeia o separador ("Redimensionar Lista de pedidos").
                  Defina <Code>minSize</Code> para que o conteúdo nunca fique estreito demais para ser lido.
                </>
              ),
              en: (
                <>
                  Give every panel a <Code>label</Code>: it names the separator ("Resize Order list"). Set{' '}
                  <Code>minSize</Code> so the content never gets too narrow to read.
                </>
              ),
            },
            {
              pt: (
                <>
                  Torne recolhível (<Code>collapsible</Code>) só o painel secundário — filtros, console, inspetor —, nunca o
                  conteúdo principal.
                </>
              ),
              en: (
                <>
                  Make only the secondary panel <Code>collapsible</Code> — filters, console, inspector — never the main
                  content.
                </>
              ),
            },
            {
              pt: (
                <>
                  Em ferramentas usadas todo dia, guarde o layout com <Code>storageKey</Code>. O clique duplo no separador
                  sempre volta aos tamanhos padrão.
                </>
              ),
              en: (
                <>
                  In tools used every day, keep the layout with <Code>storageKey</Code>. Double-clicking the separator always
                  goes back to the default sizes.
                </>
              ),
            },
            {
              pt: 'O Splitter ocupa a altura do contêiner: dê uma altura a ele (ou ao pai). Painéis rolam por dentro.',
              en: 'The Splitter fills its container height: give it (or its parent) a height. Panels scroll inside.',
            },
          ]}
        />
        <Callout tone="warning" title={{ pt: 'Telas estreitas', en: 'Narrow screens' }}>
          <T
            pt={
              <>
                Com <Code>stackBelow="sm"</Code> (640px) ou <Code>"md"</Code> (768px), abaixo do ponto de quebra os painéis
                empilham na ordem do código, com a altura do conteúdo e sem separadores (só CSS, sem JavaScript). O
                conteúdo precisa fazer sentido empilhado: a lista antes do detalhe, o editor antes da prévia. Painéis
                recolhidos voltam a aparecer.
              </>
            }
            en={
              <>
                With <Code>stackBelow="sm"</Code> (640px) or <Code>"md"</Code> (768px), below the breakpoint the panels stack
                in source order, at content height and without separators (CSS only, no JavaScript). The content must make
                sense stacked: the list before the detail, the editor before the preview. Collapsed panels show again.
              </>
            }
          />
        </Callout>
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Splitter', en: 'Splitter' }, description: { pt: 'Grade CSS que divide o espaço. Os tamanhos são porcentagens (somam 100) aplicadas como trilhas em fr; os separadores têm 1px fixo.', en: 'CSS grid that divides the space. Sizes are percentages (summing to 100) applied as fr tracks; separators are a fixed 1px.' } },
            { term: { pt: 'SplitterPanel', en: 'SplitterPanel' }, description: { pt: 'Área de conteúdo com limites (minSize, maxSize) e recolhimento opcional. Rola por dentro.', en: 'Content area with limits (minSize, maxSize) and optional collapsing. Scrolls inside.' } },
            { term: { pt: 'SplitterHandle', en: 'SplitterHandle' }, description: { pt: 'Separador focável entre dois painéis: linha de 1px em --or-color-border, área de toque invisível de 24px e marca de "pegar" no meio. Vira laranja no hover, no foco e no arraste.', en: 'Focusable separator between two panels: a 1px line in --or-color-border, an invisible 24px hit area and a grip mark in the middle. Turns orange on hover, focus and drag.' } },
            { term: { pt: 'Painel primário', en: 'Primary panel' }, description: { pt: 'O painel antes do separador. É o tamanho dele que o separador anuncia (aria-valuenow) e controla (aria-controls).', en: 'The panel before the separator. Its size is what the separator announces (aria-valuenow) and controls (aria-controls).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Lista e detalhe', en: 'List and detail' }}
          description={{
            pt: 'A lista vai de 25% a 55%; o detalhe nunca fica abaixo de 35%. Abaixo de 640px os painéis empilham.',
            en: 'The list goes from 25% to 55%; the detail never drops below 35%. Below 640px the panels stack.',
          }}
          code={ListDetailCode}
          align="stretch"
        >
          <ListDetail />
        </Example>
        <Example
          title={{ pt: 'Editor, prévia e console', en: 'Editor, preview and console' }}
          description={{
            pt: 'Divisão vertical com um Splitter horizontal dentro do painel de cima. O console de logs é recolhível: foque o separador de baixo e pressione Enter (ou arraste até o fim).',
            en: 'A vertical split with a horizontal Splitter inside the top panel. The log console is collapsible: focus the bottom separator and press Enter (or drag it all the way down).',
          }}
          code={EditorPreviewCode}
          align="stretch"
        >
          <EditorPreview />
        </Example>
        <Example
          title={{ pt: 'Três painéis', en: 'Three panels' }}
          description={{
            pt: 'Filtros, resultados e detalhes com tamanhos mínimos; cada separador mexe só nos seus vizinhos. Os tamanhos são controlados (sizes + onSizesChange) e os filtros, recolhíveis.',
            en: 'Filters, results and details with minimum sizes; each separator only moves its neighbours. Sizes are controlled (sizes + onSizesChange) and filters are collapsible.',
          }}
          code={ThreePanelsCode}
          align="stretch"
        >
          <ThreePanels />
        </Example>
        <Example
          title={{ pt: 'Layout salvo', en: 'Saved layout' }}
          description={{
            pt: 'Com storageKey, os tamanhos vão para o localStorage ao fim de cada ajuste e voltam ao recarregar. Se o armazenamento estiver bloqueado (modo privado, cota cheia), o Splitter segue funcionando sem salvar.',
            en: 'With storageKey, sizes go to localStorage at the end of each adjustment and come back on reload. If storage is blocked (private mode, full quota), the Splitter keeps working without saving.',
          }}
          code={PersistedCode}
          align="stretch"
        >
          <Persisted />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T
            pt="Só as trilhas da grade (grid-template-columns / grid-template-rows) animam — nada de width, height ou flex-basis nos painéis. Durações e curvas vêm dos tokens e zeram com prefers-reduced-motion."
            en="Only the grid tracks (grid-template-columns / grid-template-rows) animate — no width, height or flex-basis on the panels. Durations and curves come from the tokens and drop to zero with prefers-reduced-motion."
          />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Recolher / expandir (Enter)', en: 'Collapse / expand (Enter)' }, description: { pt: 'As trilhas animam até o novo tamanho em --or-duration-slow (400ms), --or-ease-in-out. Recolhido em 0%, o conteúdo esmaece em --or-duration-fast (160ms) e, ao fim, sai do foco e dos leitores de tela.', en: 'The tracks animate to the new size over --or-duration-slow (400ms), --or-ease-in-out. Collapsed to 0%, the content fades over --or-duration-fast (160ms) and then leaves focus and screen readers.' } },
            { term: { pt: 'Home / End e clique duplo', en: 'Home / End and double-click' }, description: { pt: 'Saltos ao mínimo, ao máximo ou aos tamanhos padrão usam a mesma transição (400ms, --or-ease-in-out).', en: 'Jumps to the minimum, the maximum or the default sizes use the same transition (400ms, --or-ease-in-out).' } },
            { term: { pt: 'Arrastar e setas', en: 'Dragging and arrows' }, description: { pt: 'Sem transição: o painel segue o ponteiro (ou o passo da tecla) na hora. Arrastando, o cursor vira col-resize/row-resize na página toda e a seleção de texto fica desligada.', en: 'No transition: the panel follows the pointer (or the key step) immediately. While dragging, the cursor becomes col-resize/row-resize across the page and text selection is off.' } },
            { term: { pt: 'Hover, foco e arraste no separador', en: 'Hover, focus and drag on the separator' }, description: { pt: 'A linha e a marca passam de --or-color-border para --or-color-accent em --or-duration-fast (160ms), --or-ease-out; no arraste, a linha engrossa para 3px com box-shadow.', en: 'The line and the grip go from --or-color-border to --or-color-accent over --or-duration-fast (160ms), --or-ease-out; while dragging, the line thickens to 3px with box-shadow.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Recolher, expandir e os saltos são instantâneos; as cores continuam indicando hover, foco e arraste.', en: 'Collapsing, expanding and jumps are instant; colors still indicate hover, focus and drag.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Splitter', en: 'Splitter' }}
          rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: { pt: 'horizontal: painéis lado a lado; vertical: um sobre o outro.', en: 'horizontal: panels side by side; vertical: one above the other.' } },
            { name: 'sizes', type: 'number[]', description: { pt: 'Tamanhos em % (somam 100), na ordem dos painéis (controlado).', en: 'Sizes in % (summing to 100), in panel order (controlled).' } },
            { name: 'defaultSizes', type: 'number[]', description: { pt: 'Tamanhos iniciais (não controlado) e destino do clique duplo. Padrão: divisão igual.', en: 'Initial sizes (uncontrolled) and the double-click target. Default: equal split.' } },
            { name: 'onSizesChange', type: '(sizes: number[]) => void', description: { pt: 'A cada mudança, inclusive durante o arraste.', en: 'On every change, including while dragging.' } },
            { name: 'onResizeEnd', type: '(sizes: number[]) => void', description: { pt: 'Ao terminar um ajuste: soltar o ponteiro, soltar a tecla ou clique duplo.', en: 'When an adjustment ends: pointer up, key up or double-click.' } },
            { name: 'storageKey', type: 'string', description: { pt: <>Salva e restaura os tamanhos no <Code>localStorage</Code> (chave <Code>or-splitter:&lt;storageKey&gt;</Code>). Com <Code>sizes</Code> controlado, o valor salvo chega por <Code>onSizesChange</Code> ao montar.</>, en: <>Saves and restores sizes in <Code>localStorage</Code> (key <Code>or-splitter:&lt;storageKey&gt;</Code>). With controlled <Code>sizes</Code>, the saved value arrives through <Code>onSizesChange</Code> on mount.</> } },
            { name: 'label', type: 'string', description: { pt: <>Nome do grupo de painéis (<Code>role="group"</Code>).</>, en: <>Name of the panel group (<Code>role="group"</Code>).</> } },
            { name: 'step', type: 'number', default: '2', description: { pt: 'Passo das setas, em %.', en: 'Arrow key step, in %.' } },
            { name: 'shiftStep', type: 'number', default: '10', description: { pt: 'Passo de Shift + seta, em %.', en: 'Shift + arrow step, in %.' } },
            { name: 'stackBelow', type: "'sm' | 'md'", description: { pt: 'Empilha os painéis abaixo de 640px (sm) ou 768px (md), sem separadores.', en: 'Stacks the panels below 640px (sm) or 768px (md), without separators.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos nativos do contêiner.', en: 'Native container attributes.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'SplitterPanel', en: 'SplitterPanel' }}
          rows={[
            { name: 'minSize', type: 'number', default: '0', description: { pt: 'Tamanho mínimo em %.', en: 'Minimum size in %.' } },
            { name: 'maxSize', type: 'number', default: '100', description: { pt: 'Tamanho máximo em %.', en: 'Maximum size in %.' } },
            { name: 'collapsible', type: 'boolean', default: 'false', description: { pt: 'Pode ser recolhido com Enter no separador ou arrastando abaixo da metade do mínimo.', en: 'Can collapse with Enter on the separator or by dragging below half of the minimum.' } },
            { name: 'collapsedSize', type: 'number', default: '0', description: { pt: 'Tamanho em % quando recolhido. Em 0, o conteúdo sai da tela, do foco e dos leitores de tela.', en: 'Size in % when collapsed. At 0, the content leaves the screen, focus and screen readers.' } },
            { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: { pt: 'Começa recolhido (requer collapsible); Enter abre no tamanho de defaultSizes.', en: 'Starts collapsed (requires collapsible); Enter opens it at its defaultSizes size.' } },
            { name: 'id', type: 'string', description: { pt: 'Alvo do aria-controls do separador. Padrão: gerado.', en: 'Target of the separator aria-controls. Default: generated.' } },
            { name: 'label', type: 'string', description: { pt: 'Nome do painel; compõe o nome do separador ("Redimensionar {label}").', en: 'Panel name; builds the separator name ("Resize {label}").' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'SplitterHandle', en: 'SplitterHandle' }}
          rows={[
            { name: 'aria-label', type: 'string', description: { pt: 'Substitui o nome gerado a partir do label do painel primário. Padrão: "Redimensionar {label}".', en: 'Overrides the name built from the primary panel label. Default: "Resize {label}".' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos nativos. Handlers de teclado e ponteiro são compostos com os internos (preventDefault cancela o comportamento padrão).', en: 'Native attributes. Keyboard and pointer handlers are composed with the internal ones (preventDefault cancels the default behavior).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <strong>Window Splitter</strong> do WAI-ARIA. Cada <Code>SplitterHandle</Code> é um{' '}
                <Code>role="separator"</Code> focável (<Code>tabIndex=0</Code>) com <Code>aria-orientation</Code>{' '}
                perpendicular ao layout (painéis lado a lado → separador vertical), <Code>aria-valuenow</Code> /{' '}
                <Code>aria-valuemin</Code> / <Code>aria-valuemax</Code> com o tamanho em % do painel primário (o anterior),{' '}
                <Code>aria-controls</Code> apontando para ele e um nome como "Redimensionar Lista de pedidos". Quando um
                painel está recolhido, <Code>aria-valuetext</Code> anuncia "Painel Filtros recolhido".
              </>
            }
            en={
              <>
                Follows the WAI-ARIA <strong>Window Splitter</strong> pattern. Each <Code>SplitterHandle</Code> is a focusable{' '}
                <Code>role="separator"</Code> (<Code>tabIndex=0</Code>) with an <Code>aria-orientation</Code> perpendicular
                to the layout (side-by-side panels → vertical separator), <Code>aria-valuenow</Code> /{' '}
                <Code>aria-valuemin</Code> / <Code>aria-valuemax</Code> holding the primary (preceding) panel size in %,{' '}
                <Code>aria-controls</Code> pointing at it and a name such as "Resize Order list". When a panel is collapsed,{' '}
                <Code>aria-valuetext</Code> announces "Filters panel collapsed".
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o separador (cada um é uma parada de Tab).', en: 'Moves focus to the separator (each one is a Tab stop).' } },
            { keys: ['← / →'], description: { pt: 'Painéis lado a lado: move o separador 2% (step). Em páginas da direita para a esquerda, a seta segue a direção visual.', en: 'Side-by-side panels: moves the separator 2% (step). In right-to-left pages, the arrow follows the visual direction.' } },
            { keys: ['↑ / ↓'], description: { pt: 'Painéis empilhados (vertical): move o separador 2%.', en: 'Stacked panels (vertical): moves the separator 2%.' } },
            { keys: ['Shift', '← → ↑ ↓'], description: { pt: 'Move 10% (shiftStep).', en: 'Moves 10% (shiftStep).' } },
            { keys: ['Home'], description: { pt: 'Leva o painel primário ao menor tamanho permitido pelos dois vizinhos.', en: 'Takes the primary panel to the smallest size both neighbours allow.' } },
            { keys: ['End'], description: { pt: 'Leva o painel primário ao maior tamanho permitido pelos dois vizinhos.', en: 'Takes the primary panel to the largest size both neighbours allow.' } },
            { keys: ['Enter'], description: { pt: 'Recolhe o painel recolhível (o primário; se ele não for, o secundário) ou o restaura ao tamanho anterior.', en: 'Collapses the collapsible panel (the primary one; if it is not, the secondary one) or restores its previous size.' } },
          ]}
        />
        <p>
          <T
            pt="Com o ponteiro: arraste com mouse, caneta ou toque (Pointer Events com captura — o arraste continua fora do separador). Clique duplo volta aos tamanhos padrão. No toque, o separador usa touch-action: none para não rolar a página."
            en="With a pointer: drag with mouse, pen or touch (Pointer Events with capture — the drag continues outside the separator). Double-click goes back to the default sizes. On touch, the separator uses touch-action: none so the page does not scroll."
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.2', description: { pt: 'Empilhado (stackBelow), os painéis seguem a ordem do código — a mesma da leitura.', en: 'Stacked (stackBelow), panels follow source order — the same as the reading order.' } },
            { criterion: '1.4.10', description: { pt: 'Sem rolagem horizontal a 320px CSS: os painéis empilham ou rolam por dentro.', en: 'No horizontal scrolling at 320 CSS px: panels stack or scroll inside.' } },
            { criterion: '1.4.11', description: { pt: 'A linha e a marca vão para a cor de acento no hover, foco e arraste; em alto contraste, usam as cores do sistema.', en: 'The line and the grip switch to the accent color on hover, focus and drag; in forced colors they use system colors.' } },
            { criterion: '2.1.1', description: { pt: 'Tudo que o arraste faz tem equivalente no teclado: setas, Shift, Home/End e Enter.', en: 'Everything dragging does has a keyboard equivalent: arrows, Shift, Home/End and Enter.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível: contorno de 2px e linha laranja.', en: 'Visible focus: a 2px outline and an orange line.' } },
            { criterion: '2.5.7', description: { pt: 'Movimentos de arraste têm alternativa de ponteiro único: clique duplo para o padrão e o teclado para o resto.', en: 'Dragging movements have a single-pointer alternative: double-click for the default and the keyboard for the rest.' } },
            { criterion: '2.5.8', description: { pt: 'Área de toque de 24px em volta da linha de 1px (--or-splitter-hit-area).', en: '24px hit area around the 1px line (--or-splitter-hit-area).' } },
            { criterion: '4.1.2', description: { pt: 'Papel, nome, valor e orientação expostos no separador; recolhido em 0%, o painel sai da árvore de acessibilidade.', en: 'Role, name, value and orientation exposed on the separator; collapsed to 0%, the panel leaves the accessibility tree.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
