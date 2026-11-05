import {
  Bullets,
  Callout,
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
import Horizontal from './examples/Horizontal'
import HorizontalCode from './examples/Horizontal?raw'
import MenuCategories from './examples/MenuCategories'
import MenuCategoriesCode from './examples/MenuCategories?raw'
import ProcessSteps from './examples/ProcessSteps'
import ProcessStepsCode from './examples/ProcessSteps?raw'
import SprintPriorities from './examples/SprintPriorities'
import SprintPrioritiesCode from './examples/SprintPriorities?raw'
import { meta } from './meta'

export default function SortableListPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use quando a ordem é decisão do usuário e tem efeito: prioridades da sprint, ordem das categorias no cardápio, etapas de um processo. Para ordenar por um critério (data, preço), use a ordenação da Table.',
              en: 'Use it when the order is the user’s decision and has an effect: sprint priorities, menu category order, process steps. To sort by a criterion (date, price), use Table sorting.',
            },
            {
              pt: (
                <>
                  Arrastar nunca é o único caminho: mantenha <Code>moveControls</Code> em <Code>buttons</Code> (padrão)
                  ou <Code>menu</Code>. Use <Code>menu</Code> em listas longas ou telas estreitas — ele também oferece
                  "para o topo" e "para o fim".
                </>
              ),
              en: (
                <>
                  Dragging is never the only way: keep <Code>moveControls</Code> as <Code>buttons</Code> (default) or{' '}
                  <Code>menu</Code>. Use <Code>menu</Code> for long lists or narrow screens — it also offers "to top"
                  and "to end".
                </>
              ),
            },
            {
              pt: (
                <>
                  Dê um nome curto a cada item com <Code>getItemLabel</Code>: ele aparece na alça ("Reordenar Pizzas,
                  posição 3 de 8") e em todos os anúncios.
                </>
              ),
              en: (
                <>
                  Give each item a short name with <Code>getItemLabel</Code>: it appears on the handle ("Reorder Pizzas,
                  position 3 of 8") and in every announcement.
                </>
              ),
            },
            {
              pt: 'Desabilite os itens que não podem sair do lugar (uma etapa automática, uma categoria fixa). Os demais passam por eles sem tirá-los da posição.',
              en: 'Disable items that cannot move (an automatic step, a pinned category). Other items move around them without displacing them.',
            },
          ]}
        />
        <DoDont
          doItems={[
            { pt: 'Salve a nova ordem em onReorder — o usuário espera que ela persista.', en: 'Save the new order in onReorder — users expect it to persist.' },
            { pt: 'Mostre a posição no conteúdo quando ela importa (01, 02…) usando o index de renderItem.', en: 'Show the position in the content when it matters (01, 02…) using the renderItem index.' },
          ]}
          dontItems={[
            { pt: 'Usar moveControls="none" sem oferecer outra forma de mover com um clique.', en: 'Use moveControls="none" without offering another single-click way to move.' },
            { pt: 'Colocar links ou campos editáveis dentro da alça; ela é só para mover.', en: 'Put links or editable fields inside the handle; it is only for moving.' },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Alça', en: 'Handle' }, description: { pt: 'Botão com o ícone grip. Inicia o arraste (ponteiro) e o modo de mover (teclado). Em itens desabilitados, mostra um cadeado.', en: 'Button with the grip icon. Starts dragging (pointer) and move mode (keyboard). On disabled items it shows a lock.' } },
            { term: { pt: 'Conteúdo', en: 'Content' }, description: { pt: 'O que renderItem devolve. Recebe index, total, isDragging e disabled.', en: 'Whatever renderItem returns. Receives index, total, isDragging and disabled.' } },
            { term: { pt: 'Controles de mover', en: 'Move controls' }, description: { pt: 'Botões "Mover para cima/baixo" ou um menu com topo, cima, baixo e fim — a alternativa de clique único.', en: '"Move up/down" buttons or a menu with top, up, down and end — the single-click alternative.' } },
            { term: { pt: 'Lugar de destino', en: 'Drop placeholder' }, description: { pt: 'Contorno tracejado laranja que mostra onde o item vai cair durante o arraste com ponteiro.', en: 'Dashed orange outline showing where the item will land while dragging with a pointer.' } },
            { term: { pt: 'Região de anúncios', en: 'Live region' }, description: { pt: 'role="status" invisível que narra levantar, mover, soltar e cancelar.', en: 'Invisible role="status" that narrates lift, move, drop and cancel.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Priorizar tarefas da sprint', en: 'Prioritize sprint tasks' }}
          description={{
            pt: 'Lista controlada: items + onReorder. Arraste pela alça, use as setas no teclado ou os botões de mover. A numeração vem do index de renderItem e acompanha o arraste.',
            en: 'Controlled list: items + onReorder. Drag by the handle, use the arrow keys or the move buttons. The numbering comes from the renderItem index and follows the drag.',
          }}
          code={SprintPrioritiesCode}
          align="stretch"
        >
          <SprintPriorities />
        </Example>
        <Example
          title={{ pt: 'Categorias do cardápio (menu e rolagem)', en: 'Menu categories (menu and scrolling)' }}
          description={{
            pt: 'moveControls="menu" agrupa topo, cima, baixo e fim em um botão. "Destaques da semana" está desabilitada e fica fixa. Com altura máxima, a lista rola sozinha quando o item arrastado chega perto da borda.',
            en: 'moveControls="menu" groups top, up, down and end in one button. "Destaques da semana" is disabled and stays pinned. With a max height, the list auto-scrolls when the dragged item nears the edge.',
          }}
          code={MenuCategoriesCode}
          align="stretch"
        >
          <MenuCategories />
        </Example>
        <Example
          title={{ pt: 'Etapas de um processo', en: 'Process steps' }}
          description={{
            pt: 'Não controlada (defaultItems). onReorder recebe { item, from, to } — útil para registrar a mudança. A primeira e a última etapa são automáticas e não se movem.',
            en: 'Uncontrolled (defaultItems). onReorder receives { item, from, to } — handy to log the change. The first and last steps are automatic and do not move.',
          }}
          code={ProcessStepsCode}
          align="stretch"
        >
          <ProcessSteps />
        </Example>
        <Example
          title={{ pt: 'Horizontal', en: 'Horizontal' }}
          description={{
            pt: 'orientation="horizontal" troca as setas do teclado para ← e → e os controles para esquerda/direita. Envolva a lista em um contêiner com rolagem horizontal em telas estreitas.',
            en: 'orientation="horizontal" switches the keyboard arrows to ← and → and the controls to left/right. Wrap the list in a horizontally scrolling container on narrow screens.',
          }}
          code={HorizontalCode}
          align="stretch"
        >
          <Horizontal />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Levantar', en: 'Lift' }, description: { pt: 'O "lift" do zop: o item sobe 4px (--or-distance-lift), ganha a sombra sólida 0 8px 0 -4px, borda laranja e uma barra de acento de 4px que desce pela borda esquerda (scaleY 0 → 1). --or-duration-medium, --or-ease-out.', en: 'The zop "lift": the item rises 4px (--or-distance-lift), gets the solid 0 8px 0 -4px shadow, an orange border and a 4px accent bar drawing down the left edge (scaleY 0 → 1). --or-duration-medium, --or-ease-out.' } },
            { term: { pt: 'Vizinhos abrem espaço', en: 'Siblings make room' }, description: { pt: 'Enquanto o item passa, os vizinhos deslizam com transform (--or-duration-medium, --or-ease-out). Nos botões e no menu, a troca usa FLIP: os itens partem da posição antiga e deslizam até a nova.', en: 'As the item passes, siblings slide with transform (--or-duration-medium, --or-ease-out). With buttons and the menu, the swap uses FLIP: items start from their old position and slide to the new one.' } },
            { term: { pt: 'Arrastar com ponteiro', en: 'Pointer drag' }, description: { pt: 'O item segue o ponteiro sem atraso, só no eixo da lista. O lugar de destino (tracejado laranja) desliza até a posição prevista. Só começa depois de 5px de movimento: um clique simples não arrasta.', en: 'The item follows the pointer without delay, on the list axis only. The drop placeholder (dashed orange) slides to the predicted slot. It only starts after 5px of movement: a simple click does not drag.' } },
            { term: { pt: 'Soltar', en: 'Drop' }, description: { pt: 'O item assenta no lugar com --or-ease-spring (uma mola curta) e a sombra se desfaz em --or-duration-fast.', en: 'The item settles into place with --or-ease-spring (a short spring) and the shadow fades in --or-duration-fast.' } },
            { term: { pt: 'Cancelar', en: 'Cancel' }, description: { pt: 'Esc devolve o item e os vizinhos à ordem original com o mesmo deslize.', en: 'Esc returns the item and its siblings to the original order with the same slide.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Com prefers-reduced-motion, tudo é instantâneo: sem FLIP, sem mola e sem deslocamento de 4px. A sombra, a borda e a barra laranja continuam indicando o item levantado.', en: 'With prefers-reduced-motion, everything is instant: no FLIP, no spring and no 4px offset. The shadow, border and orange bar still mark the lifted item.' } },
          ]}
        />
        <p>
          <T
            pt={<>Só <Code>transform</Code> e <Code>box-shadow</Code> são animados — nada de <Code>top</Code> ou <Code>height</Code>.</>}
            en={<>Only <Code>transform</Code> and <Code>box-shadow</Code> are animated — never <Code>top</Code> or <Code>height</Code>.</>}
          />
        </p>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'SortableList', en: 'SortableList' }}
          rows={[
            { name: 'items', type: 'T[]', description: { pt: 'Itens na ordem atual (controlado). Use com onReorder.', en: 'Items in their current order (controlled). Use with onReorder.' } },
            { name: 'defaultItems', type: 'T[]', description: { pt: 'Itens iniciais (não controlado).', en: 'Initial items (uncontrolled).' } },
            { name: 'onReorder', type: '(items: T[], details: { from, to, item }) => void', description: { pt: 'Chamado ao concluir uma reordenação (soltar, botão ou menu). Não é chamado ao cancelar. from/to são base 0.', en: 'Called when a reorder completes (drop, button or menu). Not called on cancel. from/to are 0-based.' } },
            { name: 'renderItem', type: '(item: T, state: SortableItemState) => ReactNode', required: true, description: { pt: 'Conteúdo do item. A alça e os controles são do componente.', en: 'Item content. The handle and controls belong to the component.' } },
            { name: 'getKey', type: '(item: T, index: number) => string | number', default: 'item.id', description: { pt: 'Chave estável de cada item (ou o próprio item, se for texto).', en: 'Stable key for each item (or the item itself, if it is text).' } },
            { name: 'getItemLabel', type: '(item: T) => string', default: 'item.label ?? item.title ?? item.name', description: { pt: 'Nome do item na alça e nos anúncios.', en: 'Item name on the handle and in announcements.' } },
            { name: 'isItemDisabled', type: '(item: T) => boolean', default: 'item.disabled', description: { pt: 'Itens que não podem ser movidos (ficam fixos na posição).', en: 'Items that cannot be moved (they stay pinned in place).' } },
            { name: 'label', type: 'string', description: { pt: <>Nome acessível da lista. Ou use <Code>aria-labelledby</Code>.</>, en: <>Accessible name of the list. Or use <Code>aria-labelledby</Code>.</> } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita a reordenação de todos os itens.', en: 'Disables reordering for every item.' } },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: { pt: 'Direção da lista e das setas do teclado.', en: 'List direction and keyboard arrows.' } },
            { name: 'moveControls', type: "'buttons' | 'menu' | 'none'", default: "'buttons'", description: { pt: 'Alternativa de clique único ao arraste (WCAG 2.5.7).', en: 'Single-click alternative to dragging (WCAG 2.5.7).' } },
            { name: 'announcements', type: 'SortableAnnouncements', description: { pt: <>Substitui os textos de <Code>lifted</Code>, <Code>moved</Code>, <Code>dropped</Code> e <Code>cancelled</Code>. Cada função recebe <Code>{'{ label, position, total, initialPosition }'}</Code> (base 1).</>, en: <>Overrides the <Code>lifted</Code>, <Code>moved</Code>, <Code>dropped</Code> and <Code>cancelled</Code> texts. Each function receives <Code>{'{ label, position, total, initialPosition }'}</Code> (1-based).</> } },
            { name: '...rest', type: 'HTMLAttributes<HTMLUListElement>', description: { pt: <>Atributos do <Code>&lt;ul&gt;</Code> (ex.: <Code>style</Code> com altura máxima e rolagem).</>, en: <>Attributes of the <Code>&lt;ul&gt;</Code> (e.g. <Code>style</Code> with a max height and scrolling).</> } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'SortableItemState (2º argumento de renderItem)', en: 'SortableItemState (2nd renderItem argument)' }}
          rows={[
            { name: 'index', type: 'number', description: { pt: 'Posição atual (base 0); durante o arraste, a posição prevista.', en: 'Current position (0-based); while dragging, the predicted position.' } },
            { name: 'total', type: 'number', description: { pt: 'Total de itens.', en: 'Total number of items.' } },
            { name: 'isDragging', type: 'boolean', description: { pt: 'O item está sendo movido (ponteiro ou teclado).', en: 'The item is being moved (pointer or keyboard).' } },
            { name: 'disabled', type: 'boolean', description: { pt: 'O item não pode ser movido.', en: 'The item cannot be moved.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Renderiza um <Code>&lt;ul role="list"&gt;</Code> com o nome de <Code>label</Code>. Cada item tem uma
                alça — um <Code>&lt;button&gt;</Code> com nome "Reordenar Pizzas, posição 3 de 8" e as instruções de
                teclado como descrição. Levantar, mover, soltar e cancelar são narrados em uma região{' '}
                <Code>aria-live="polite"</Code>, e o foco fica na alça do item movido depois de cada passo.
              </>
            }
            en={
              <>
                Renders a <Code>&lt;ul role="list"&gt;</Code> named by <Code>label</Code>. Each item has a handle — a{' '}
                <Code>&lt;button&gt;</Code> named "Reorder Pizzas, position 3 of 8" with the keyboard instructions as
                its description. Lift, move, drop and cancel are narrated in an <Code>aria-live="polite"</Code>{' '}
                region, and focus stays on the moved item’s handle after every step.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Foca a alça e depois os controles de mover de cada item.', en: 'Focuses the handle, then each item’s move controls.' } },
            { keys: ['Space'], description: { pt: 'Na alça: levanta o item; com o item levantado, solta.', en: 'On the handle: lifts the item; when lifted, drops it.' } },
            { keys: ['Enter'], description: { pt: 'Igual ao Espaço.', en: 'Same as Space.' } },
            { keys: ['↑', '↓'], description: { pt: 'Item levantado (vertical): move uma posição. Itens desabilitados são pulados.', en: 'Lifted item (vertical): moves one position. Disabled items are skipped.' } },
            { keys: ['←', '→'], description: { pt: 'Item levantado (horizontal): move uma posição.', en: 'Lifted item (horizontal): moves one position.' } },
            { keys: ['Home'], description: { pt: 'Item levantado: vai para a primeira posição livre.', en: 'Lifted item: goes to the first free position.' } },
            { keys: ['End'], description: { pt: 'Item levantado: vai para a última posição livre.', en: 'Lifted item: goes to the last free position.' } },
            { keys: ['Esc'], description: { pt: 'Cancela e devolve o item à posição original (também durante o arraste com ponteiro).', en: 'Cancels and returns the item to its original position (also while dragging with a pointer).' } },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Sair da alça solta o item', en: 'Leaving the handle drops the item' }}>
          <T
            pt="Se o usuário pressionar Tab ou clicar fora com um item levantado, o item é solto onde está e o foco vai para onde o usuário o levou."
            en="If the user presses Tab or clicks elsewhere while an item is lifted, the item is dropped where it is and focus goes wherever the user moved it."
          />
        </Callout>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Lista semântica com papel explícito; o nome de cada alça inclui a posição.', en: 'Semantic list with an explicit role; each handle name includes the position.' } },
            { criterion: '2.1.1', description: { pt: 'Reordenação completa pelo teclado na alça, sem depender de arrastar.', en: 'Full reordering from the keyboard on the handle, without dragging.' } },
            { criterion: '2.4.3', description: { pt: 'O foco acompanha o item movido em cada passo (teclado, botões e menu).', en: 'Focus follows the moved item at every step (keyboard, buttons and menu).' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px na alça e nos controles.', en: 'Visible focus with a 2px orange outline on the handle and controls.' } },
            { criterion: '2.5.7', description: { pt: 'Alternativa de clique único ao arraste: botões ou menu de mover (padrão: botões).', en: 'Single-pointer alternative to dragging: move buttons or menu (default: buttons).' } },
            { criterion: '2.5.8', description: { pt: 'Alça e controles com 32×32px.', en: 'Handle and controls are 32×32px.' } },
            { criterion: '4.1.3', description: { pt: 'Mudanças de posição anunciadas em uma região de status educada, sem mover o foco.', en: 'Position changes announced in a polite status region, without moving focus.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
