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
import Horizontal from './examples/Horizontal'
import HorizontalCode from './examples/Horizontal?raw'
import PlanPicker from './examples/PlanPicker'
import PlanPickerCode from './examples/PlanPicker?raw'
import StoreFilter from './examples/StoreFilter'
import StoreFilterCode from './examples/StoreFilter?raw'
import Warehouses from './examples/Warehouses'
import WarehousesCode from './examples/Warehouses?raw'
import WithForm from './examples/WithForm'
import WithFormCode from './examples/WithForm?raw'
import { meta } from './meta'

export default function ListboxPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use quando as opções precisam ficar à vista enquanto a pessoa decide: painéis de filtro, escolha de plano, listas mestre (escolher um item para ver os detalhes ao lado).',
              en: 'Use it when options must stay in view while people decide: filter panels, plan pickers, master lists (pick an item to see its details alongside).',
            },
            {
              pt: (
                <>
                  Em formulários compactos, prefira uma lista suspensa: <strong>Select</strong> para poucas opções,{' '}
                  <strong>Combobox</strong> para muitas com busca e <strong>MultiSelect</strong> para várias. Com até
                  cinco opções simples, <strong>RadioGroup</strong> e <strong>CheckboxGroup</strong> são mais familiares.
                </>
              ),
              en: (
                <>
                  In compact forms, prefer a dropdown: <strong>Select</strong> for a few options,{' '}
                  <strong>Combobox</strong> for many with search and <strong>MultiSelect</strong> for several. With up to
                  five simple options, <strong>RadioGroup</strong> and <strong>CheckboxGroup</strong> are more familiar.
                </>
              ),
            },
            {
              pt: (
                <>
                  Rótulos curtos e escaneáveis; detalhes (preço, prazo, estoque) vão na <Code>description</Code>. Com
                  mais de oito opções, agrupe com <Code>ListboxGroup</Code> e limite a altura com{' '}
                  <Code>maxHeight</Code>.
                </>
              ),
              en: (
                <>
                  Short, scannable labels; details (price, lead time, stock) go in the <Code>description</Code>. With
                  more than eight options, group them with <Code>ListboxGroup</Code> and cap the height with{' '}
                  <Code>maxHeight</Code>.
                </>
              ),
            },
            {
              pt: 'Explique na descrição por que uma opção está desabilitada ("Em manutenção até 18/11"). Ela continua focável, então o leitor de tela também lê o motivo.',
              en: 'Explain in the description why an option is disabled ("Under maintenance until Nov 18"). It stays focusable, so screen readers read the reason too.',
            },
            {
              pt: 'No modo múltiplo, mostre perto da lista quantos itens estão selecionados e uma ação para limpar.',
              en: 'In multiple mode, show how many items are selected next to the list, plus an action to clear them.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Listbox', en: 'Listbox' }, description: { pt: 'Contêiner com borda de 1px que recebe o foco (uma única parada de Tab). Rola por dentro com maxHeight. Fica com borda vermelha quando há error.', en: 'Container with a 1px border that receives focus (a single Tab stop). Scrolls internally with maxHeight. Gets a red border when there is an error.' } },
            { term: { pt: 'ListboxOption', en: 'ListboxOption' }, description: { pt: 'Linha com ícone opcional, rótulo e descrição, separada das outras por 1px.', en: 'Row with an optional icon, label and description, separated from the others by 1px.' } },
            { term: { pt: 'Indicador de seleção', en: 'Selection indicator' }, description: { pt: 'Seleção única: check laranja à direita. Seleção múltipla: caixa quadrada à esquerda, como o Checkbox.', en: 'Single selection: orange check on the right. Multiple selection: square box on the left, like Checkbox.' } },
            { term: { pt: 'Opção ativa', en: 'Active option' }, description: { pt: 'A opção sob o foco do teclado: fundo sutil e barra de acento à esquerda. Só aparece enquanto a lista tem foco.', en: 'The option under keyboard focus: subtle background and an accent bar on the left. Only shown while the list has focus.' } },
            { term: { pt: 'ListboxGroup', en: 'ListboxGroup' }, description: { pt: 'Título em caixa alta (eyebrow) que nomeia um role="group" com as opções abaixo dele.', en: 'Uppercase title (eyebrow) naming a role="group" with the options below it.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Escolha de plano', en: 'Plan picker' }}
          description={{
            pt: (
              <>
                Seleção única controlada (<Code>value</Code> / <Code>onChange</Code>) com descrições. Espaço, Enter ou
                clique selecionam; as setas só movem o foco.
              </>
            ),
            en: (
              <>
                Controlled single selection (<Code>value</Code> / <Code>onChange</Code>) with descriptions. Space, Enter
                or click selects; arrows only move focus.
              </>
            ),
          }}
          code={PlanPickerCode}
        >
          <PlanPicker />
        </Example>
        <Example
          title={{ pt: 'Filtro de categorias da loja', en: 'Store category filter' }}
          description={{
            pt: (
              <>
                <Code>selectionMode="multiple"</Code> com grupos e <Code>maxHeight</Code>. Clique alterna, Shift+clique
                marca uma faixa e Ctrl/Cmd+A marca todas; a lista rola mantendo a opção ativa visível.
              </>
            ),
            en: (
              <>
                <Code>selectionMode="multiple"</Code> with groups and <Code>maxHeight</Code>. Click toggles,
                Shift+click selects a range and Ctrl/Cmd+A selects all; the list scrolls keeping the active option in
                view.
              </>
            ),
          }}
          code={StoreFilterCode}
        >
          <StoreFilter />
        </Example>
        <Example
          title={{ pt: 'Armazéns com item desabilitado', en: 'Warehouses with a disabled item' }}
          description={{
            pt: (
              <>
                Com <Code>selectionFollowsFocus</Code>, as setas já selecionam. O CD Recife está desabilitado: recebe o
                foco (e o motivo é lido), mas não pode ser escolhido. Ícones são decorativos.
              </>
            ),
            en: (
              <>
                With <Code>selectionFollowsFocus</Code>, arrows select right away. The Recife warehouse is disabled: it
                receives focus (and the reason is read), but cannot be chosen. Icons are decorative.
              </>
            ),
          }}
          code={WarehousesCode}
        >
          <Warehouses />
        </Example>
        <Example
          title={{ pt: 'Integração com Form', en: 'Form integration' }}
          description={{
            pt: (
              <>
                Com <Code>name</Code>, cada valor selecionado vira um <Code>&lt;input type="hidden"&gt;</Code> que o{' '}
                <Code>Form</Code> (e formulários nativos) envia. Envie sem escolher a entrega para ver o erro: a lista
                treme, o resumo de erros leva o foco até ela e o erro some assim que você escolhe.
              </>
            ),
            en: (
              <>
                With <Code>name</Code>, each selected value becomes an <Code>&lt;input type="hidden"&gt;</Code> that{' '}
                <Code>Form</Code> (and native forms) submit. Submit without choosing a delivery type to see the error:
                the list shakes, the error summary moves focus to it and the error clears as soon as you choose.
              </>
            ),
          }}
          code={WithFormCode}
        >
          <WithForm />
        </Example>
        <Example
          title={{ pt: 'Orientação horizontal', en: 'Horizontal orientation' }}
          description={{
            pt: (
              <>
                <Code>orientation="horizontal"</Code> troca ↑/↓ por ←/→. Bom para poucas opções curtas, como tamanhos.
              </>
            ),
            en: (
              <>
                <Code>orientation="horizontal"</Code> swaps ↑/↓ for ←/→. Good for a few short options, such as sizes.
              </>
            ),
          }}
          code={HorizontalCode}
        >
          <Horizontal />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Opção ativa', en: 'Active option' }, description: { pt: 'O fundo muda em --or-duration-fast (160ms), --or-ease-out; a barra de acento de 3px cresce do centro (scaleY 0 → 1) em --or-duration-medium (250ms), --or-ease-spring. Na horizontal, a barra fica na base (scaleX).', en: 'The background changes in --or-duration-fast (160ms), --or-ease-out; the 3px accent bar grows from the center (scaleY 0 → 1) in --or-duration-medium (250ms), --or-ease-spring. When horizontal, the bar sits at the bottom (scaleX).' } },
            { term: { pt: 'Selecionar', en: 'Selecting' }, description: { pt: 'O check (ou a marca da caixa) entra com escala 0.6 → 1 em 250ms, --or-ease-bounce; a caixa ganha o laranja em 160ms. Ao desmarcar, sai mais rápido (160ms, --or-ease-in-out). Seleções já presentes ao carregar não animam.', en: 'The check (or the box mark) scales 0.6 → 1 in 250ms, --or-ease-bounce; the box turns orange in 160ms. When unselected, it leaves faster (160ms, --or-ease-in-out). Selections present on load do not animate.' } },
            { term: { pt: 'Pressionar', en: 'Pressing' }, description: { pt: 'A linha escurece um tom (--or-color-surface-active) em --or-duration-press (90ms). Ela não afunda, para não quebrar os separadores.', en: 'The row darkens one step (--or-color-surface-active) in --or-duration-press (90ms). It does not sink, so the separators stay aligned.' } },
            { term: { pt: 'Erro', en: 'Error' }, description: { pt: 'Quando o erro surge, a lista treme uma vez (or-shake, 400ms) e a mensagem entra com fade + 4px, como nos outros campos.', en: 'When the error appears, the list shakes once (or-shake, 400ms) and the message enters with a fade + 4px, like other fields.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Tudo instantâneo pelos tokens: o fundo, a barra, o check e a borda vermelha continuam indicando o estado.', en: 'Everything is instant via tokens: the background, bar, check and red border still convey the state.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Listbox', en: 'Listbox' }}
          rows={[
            { name: 'selectionMode', type: "'single' | 'multiple'", default: "'single'", description: { pt: <>Uma opção ou várias (<Code>aria-multiselectable</Code>).</>, en: <>One option or several (<Code>aria-multiselectable</Code>).</> } },
            { name: 'value / defaultValue', type: 'string | null  ·  string[]', description: { pt: 'Seleção controlada / inicial: string | null no modo single, string[] no multiple.', en: 'Controlled / initial selection: string | null in single mode, string[] in multiple.' } },
            { name: 'onChange', type: '(value: string | null) => void  ·  (value: string[]) => void', description: { pt: 'Chamado com a nova seleção. No modo múltiplo, os valores vêm na ordem das opções.', en: 'Called with the new selection. In multiple mode, values come in option order.' } },
            { name: 'selectionFollowsFocus', type: 'boolean', default: 'false', description: { pt: 'Só no modo single: setas, Home/End e digitação também selecionam.', en: 'Single mode only: arrows, Home/End and type-ahead also select.' } },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: { pt: 'Disposição e teclas de navegação (↑/↓ ou ←/→).', en: 'Layout and navigation keys (↑/↓ or ←/→).' } },
            { name: 'maxHeight', type: 'number | string', description: { pt: 'Altura máxima; a lista rola por dentro mantendo a opção ativa visível.', en: 'Maximum height; the list scrolls internally keeping the active option in view.' } },
            { name: 'name', type: 'string', description: { pt: 'Envia um input oculto por valor selecionado.', en: 'Submits one hidden input per selected value.' } },
            { name: 'options', type: 'Array<ListboxItem | ListboxItemGroup>', description: { pt: <>Alternativa aos filhos: <Code>{'{ value, label, description?, disabled?, icon? }'}</Code> ou <Code>{'{ label, options }'}</Code>.</>, en: <>Alternative to children: <Code>{'{ value, label, description?, disabled?, icon? }'}</Code> or <Code>{'{ label, options }'}</Code>.</> } },
            { name: 'label / hideLabel / description / error', type: 'ReactNode / boolean', description: { pt: 'Estrutura de campo (Field) e vínculos ARIA.', en: 'Field structure and ARIA links.' } },
            { name: 'required / optional / disabled / invalid', type: 'boolean', description: { pt: <>Estados do campo. <Code>disabled</Code> tira a lista da ordem de Tab e não envia valores.</>, en: <>Field states. <Code>disabled</Code> removes the list from the Tab order and submits nothing.</> } },
            { name: 'children', type: 'ReactNode', description: { pt: 'ListboxOption e ListboxGroup.', en: 'ListboxOption and ListboxGroup.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: <>Vão para o elemento <Code>role="listbox"</Code> (que recebe a ref); <Code>className</Code> vai para o contêiner do campo.</>, en: <>Go to the <Code>role="listbox"</Code> element (which receives the ref); <Code>className</Code> goes to the field container.</> } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ListboxOption', en: 'ListboxOption' }}
          rows={[
            { name: 'value', type: 'string', required: true, description: { pt: 'Valor único da opção.', en: 'Unique option value.' } },
            { name: 'children', type: 'ReactNode', required: true, description: { pt: 'Rótulo (nome acessível) — também usado na busca por digitação.', en: 'Label (accessible name) — also used by type-ahead.' } },
            { name: 'description', type: 'ReactNode', description: { pt: <>Texto secundário, ligado por <Code>aria-describedby</Code>.</>, en: <>Secondary text, linked with <Code>aria-describedby</Code>.</> } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Focável, mas não selecionável.', en: 'Focusable, but not selectable.' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone decorativo antes do rótulo.', en: 'Decorative icon before the label.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ListboxGroup', en: 'ListboxGroup' }}
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: { pt: <>Título que nomeia o <Code>role="group"</Code> (<Code>aria-labelledby</Code>).</>, en: <>Title naming the <Code>role="group"</Code> (<Code>aria-labelledby</Code>).</> } },
            { name: 'children', type: 'ReactNode', description: { pt: 'As opções do grupo.', en: 'The options in the group.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <strong>Listbox</strong> do WAI-ARIA APG. O foco do teclado fica sempre no elemento{' '}
                <Code>role="listbox"</Code> e a opção ativa é indicada por <Code>aria-activedescendant</Code> (em vez
                de mover o foco entre as opções com roving tabindex). Motivos: a lista é uma única parada de Tab mesmo
                com centenas de opções; o foco não salta para dentro de grupos nem dispara rolagens do navegador ao
                navegar — a própria lista rola a opção ativa para a vista; e é o mesmo modelo dos popups de{' '}
                <strong>Select</strong>, <strong>Combobox</strong> e <strong>MultiSelect</strong>, então leitores de
                tela se comportam igual em toda a biblioteca. Cada opção expõe <Code>aria-selected</Code> e a lista,{' '}
                <Code>aria-multiselectable</Code>.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <strong>Listbox</strong> pattern. Keyboard focus always stays on the{' '}
                <Code>role="listbox"</Code> element and the active option is referenced with{' '}
                <Code>aria-activedescendant</Code> (instead of moving focus between options with roving tabindex).
                Why: the list is a single Tab stop even with hundreds of options; focus never jumps into groups or
                triggers browser scrolling while navigating — the list itself scrolls the active option into view;
                and it is the same model used by the <strong>Select</strong>, <strong>Combobox</strong> and{' '}
                <strong>MultiSelect</strong> popups, so screen readers behave the same across the library. Each option
                exposes <Code>aria-selected</Code> and the list exposes <Code>aria-multiselectable</Code>.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                Ao receber o foco, a opção ativa é a primeira selecionada (ou a primeira da lista). Opções desabilitadas
                continuam focáveis — recomendação do APG para que o motivo seja descoberto —, mas não são selecionadas
                por Espaço, clique, faixas nem Ctrl+A. Com o mouse, o clique seleciona (única) ou alterna (múltipla) e
                Shift+clique seleciona a faixa desde a última opção marcada. No modo múltiplo, mudanças em bloco (Ctrl+A, faixas) anunciam a
                contagem de selecionados numa região <Code>role="status"</Code>.
              </>
            }
            en={
              <>
                On focus, the active option is the first selected one (or the first in the list). Disabled options stay
                focusable — the APG recommendation, so the reason can be discovered — but Space, click, ranges and
                Ctrl+A never select them. With a mouse, click selects (single) or toggles (multiple) and Shift+click
                selects the range from the last checked option. In multiple mode, bulk changes (Ctrl+A, ranges) announce the selected count in
                a <Code>role="status"</Code> region.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Foca a lista (uma única parada).', en: 'Focuses the list (a single stop).' } },
            { keys: ['↓ / ↑'], description: { pt: 'Próxima / anterior opção (← / → na horizontal). Não dá a volta.', en: 'Next / previous option (← / → when horizontal). Does not wrap.' } },
            { keys: ['Home / End'], description: { pt: 'Primeira / última opção.', en: 'First / last option.' } },
            { keys: ['a–z'], description: { pt: 'Busca por digitação: letras em sequência (até 500ms entre elas) vão à opção que começa com o texto; repetir a mesma letra percorre as opções.', en: 'Type-ahead: letters typed in sequence (up to 500ms apart) jump to the option starting with the text; repeating a letter cycles through options.' } },
            { keys: ['Space / Enter'], description: { pt: 'Seleção única: seleciona a opção ativa. Seleção múltipla: marca ou desmarca.', en: 'Single selection: selects the active option. Multiple selection: toggles it.' } },
            { keys: ['Shift', '↓ / ↑'], description: { pt: 'Múltipla: move e estende a seleção a partir de onde a extensão começou; voltar encolhe a faixa.', en: 'Multiple: moves and extends the selection from where the extension started; going back shrinks the range.' } },
            { keys: ['Shift', 'Space'], description: { pt: 'Múltipla: seleciona as opções contíguas da última marcada até a ativa.', en: 'Multiple: selects contiguous options from the last checked one to the active one.' } },
            { keys: ['Ctrl / ⌘', 'A'], description: { pt: 'Múltipla: seleciona todas as habilitadas; se já estiverem todas, desmarca.', en: 'Multiple: selects all enabled options; if all are already selected, clears them.' } },
            { keys: ['Ctrl', 'Shift', 'Home / End'], description: { pt: 'Múltipla: seleciona da opção ativa até a primeira / última e move o foco.', en: 'Multiple: selects from the active option to the first / last and moves focus.' } },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Envio sem seleção', en: 'Submitting with no selection' }}>
          <T
            pt={
              <>
                Sem nada selecionado, nenhum valor é enviado (como caixas desmarcadas). Valide no <Code>Form</Code>{' '}
                com <Code>values.campo ? undefined : 'mensagem'</Code>: o resumo de erros encontra a lista pelo{' '}
                <Code>name</Code> e leva o foco até ela.
              </>
            }
            en={
              <>
                With nothing selected, no value is submitted (like unchecked checkboxes). Validate in <Code>Form</Code>{' '}
                with <Code>values.field ? undefined : 'message'</Code>: the error summary finds the list by its{' '}
                <Code>name</Code> and moves focus to it.
              </>
            }
          />
        </Callout>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Papéis listbox, option e group; rótulo, descrição e erro ligados por aria-labelledby e aria-describedby.', en: 'listbox, option and group roles; label, description and error linked with aria-labelledby and aria-describedby.' } },
            { criterion: '1.4.1', description: { pt: 'Seleção indicada por check/caixa e peso do texto, não só por cor; opção ativa com barra lateral.', en: 'Selection shown by a check/box and text weight, not color alone; active option with a side bar.' } },
            { criterion: '2.1.1', description: { pt: 'Navegação, seleção, faixas e "selecionar tudo" pelo teclado, conforme o APG.', en: 'Navigation, selection, ranges and "select all" from the keyboard, per the APG.' } },
            { criterion: '2.4.7', description: { pt: 'Contorno de foco de 2px na lista e opção ativa destacada.', en: '2px focus outline on the list and a highlighted active option.' } },
            { criterion: '3.3.1', description: { pt: 'Erro exposto com aria-invalid, texto ligado à lista e borda vermelha.', en: 'Error exposed with aria-invalid, text linked to the list and a red border.' } },
            { criterion: '4.1.2', description: { pt: 'aria-selected, aria-multiselectable, aria-disabled e aria-activedescendant sempre atualizados.', en: 'aria-selected, aria-multiselectable, aria-disabled and aria-activedescendant always up to date.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
