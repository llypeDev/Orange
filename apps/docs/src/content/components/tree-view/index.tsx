import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import CustomIcons from './examples/CustomIcons'
import CustomIconsCode from './examples/CustomIcons?raw'
import FileExplorer from './examples/FileExplorer'
import FileExplorerCode from './examples/FileExplorer?raw'
import MultipleSelection from './examples/MultipleSelection'
import MultipleSelectionCode from './examples/MultipleSelection?raw'
import { meta } from './meta'

export default function TreeViewPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para hierarquias que a pessoa explora: pastas e arquivos, categorias de produtos, estrutura de um site.',
              en: 'Use it for hierarchies people explore: folders and files, product categories, site structure.',
            },
            {
              pt: 'Para navegação principal entre páginas, prefira um menu lateral com links. A árvore tem um modelo de teclado próprio (setas), que não é o esperado para links.',
              en: 'For main navigation between pages, prefer a sidebar with links. The tree has its own keyboard model (arrows), which links do not follow.',
            },
            {
              pt: (
                <>
                  Dê um nome à árvore com <strong>aria-label</strong> ou <strong>aria-labelledby</strong>. Use rótulos curtos e
                  únicos entre irmãos — a busca por digitação depende deles.
                </>
              ),
              en: (
                <>
                  Name the tree with <strong>aria-label</strong> or <strong>aria-labelledby</strong>. Keep labels short and unique
                  among siblings — type-ahead depends on them.
                </>
              ),
            },
            {
              pt: 'Evite mais de 4 ou 5 níveis. Hierarquias muito profundas são difíceis de percorrer, principalmente por teclado.',
              en: 'Avoid more than 4 or 5 levels. Very deep hierarchies are hard to traverse, especially by keyboard.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Explorador de arquivos', en: 'File explorer' }}
          description={{
            pt: 'Seleção única. Clicar numa pasta a expande; onAction dispara com Enter ou clique — aqui, "abre" o arquivo.',
            en: 'Single selection. Clicking a folder expands it; onAction fires on Enter or click — here it "opens" the file.',
          }}
          code={FileExplorerCode}
        >
          <FileExplorer />
        </Example>
        <Example
          title={{ pt: 'Seleção múltipla', en: 'Multiple selection' }}
          description={{
            pt: 'Espaço alterna o item focado, Shift + ↑/↓ estende a seleção e Ctrl + A seleciona tudo. Itens desabilitados recebem foco, mas não seleção.',
            en: 'Space toggles the focused item, Shift + ↑/↓ extends the selection and Ctrl + A selects all. Disabled items receive focus but not selection.',
          }}
          code={MultipleSelectionCode}
        >
          <MultipleSelection />
        </Example>
        <Example
          title={{ pt: 'Expansão controlada', en: 'Controlled expansion' }}
          description={{
            pt: 'expanded + onExpandedChange permitem ações externas como "Expandir tudo". selectionMode="none" deixa a árvore só para navegação.',
            en: 'expanded + onExpandedChange enable external actions like "Expand all". selectionMode="none" makes the tree navigation-only.',
          }}
          code={ControlledCode}
        >
          <Controlled />
        </Example>
        <Example
          title={{ pt: 'Ícones próprios e tamanho compacto', en: 'Custom icons and compact size' }}
          code={CustomIconsCode}
        >
          <CustomIcons />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'items', type: 'TreeViewItem[]', required: true, description: { pt: <>Itens aninhados: <Code>{'{ id, label, textValue?, icon?, children?, disabled? }'}</Code>.</>, en: <>Nested items: <Code>{'{ id, label, textValue?, icon?, children?, disabled? }'}</Code>.</> } },
            { name: 'expanded', type: 'string[]', description: { pt: 'Ids expandidos (controlado).', en: 'Expanded ids (controlled).' } },
            { name: 'defaultExpanded', type: 'string[]', default: '[]', description: { pt: 'Ids expandidos inicialmente.', en: 'Initially expanded ids.' } },
            { name: 'onExpandedChange', type: '(ids: string[]) => void', description: { pt: 'Chamado ao expandir/recolher.', en: 'Called on expand/collapse.' } },
            { name: 'selectionMode', type: "'single' | 'multiple' | 'none'", default: "'single'", description: { pt: 'Modo de seleção.', en: 'Selection mode.' } },
            { name: 'selected', type: 'string[]', description: { pt: 'Ids selecionados (controlado).', en: 'Selected ids (controlled).' } },
            { name: 'defaultSelected', type: 'string[]', default: '[]', description: { pt: 'Ids selecionados inicialmente.', en: 'Initially selected ids.' } },
            { name: 'onSelectedChange', type: '(ids: string[]) => void', description: { pt: 'Chamado quando a seleção muda.', en: 'Called when the selection changes.' } },
            { name: 'onAction', type: '(item: TreeViewItem) => void', description: { pt: 'Ação padrão do item (Enter ou clique).', en: 'Item default action (Enter or click).' } },
            { name: 'expandOnClick', type: 'boolean', default: 'true', description: { pt: 'Clicar na linha de uma pasta também a expande.', en: 'Clicking a folder row also expands it.' } },
            { name: 'defaultIcons', type: 'boolean', default: 'true', description: { pt: 'Ícones de pasta/arquivo para itens sem icon.', en: 'Folder/file icons for items without icon.' } },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: { pt: 'Altura das linhas: 28px ou 32px.', en: 'Row height: 28px or 32px.' } },
            { name: 'aria-label', type: 'string', description: { pt: 'Nome acessível (ou use aria-labelledby).', en: 'Accessible name (or use aria-labelledby).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <em>Tree View</em> do WAI-ARIA: <Code>role="tree"</Code>, itens <Code>treeitem</Code> com{' '}
                <Code>aria-level</Code>, <Code>aria-setsize</Code>, <Code>aria-posinset</Code>, <Code>aria-expanded</Code> (pastas) e{' '}
                <Code>aria-selected</Code>, filhos em <Code>role="group"</Code>. Só um item fica na ordem de tabulação (roving
                tabindex); ao voltar à árvore, o foco retorna ao último item visitado ou ao selecionado. Na seleção múltipla, a
                árvore recebe <Code>aria-multiselectable</Code>.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA <em>Tree View</em> pattern: <Code>role="tree"</Code>, <Code>treeitem</Code> items with{' '}
                <Code>aria-level</Code>, <Code>aria-setsize</Code>, <Code>aria-posinset</Code>, <Code>aria-expanded</Code>{' '}
                (folders) and <Code>aria-selected</Code>, children in <Code>role="group"</Code>. Only one item is in the tab order
                (roving tabindex); when returning to the tree, focus goes back to the last visited or the selected item. With
                multiple selection, the tree gets <Code>aria-multiselectable</Code>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['↓'], description: { pt: 'Próximo item visível.', en: 'Next visible item.' } },
            { keys: ['↑'], description: { pt: 'Item visível anterior.', en: 'Previous visible item.' } },
            { keys: ['→'], description: { pt: 'Pasta fechada: expande. Pasta aberta: vai ao primeiro filho.', en: 'Closed folder: expands. Open folder: moves to the first child.' } },
            { keys: ['←'], description: { pt: 'Pasta aberta: recolhe. Demais: volta ao item pai.', en: 'Open folder: collapses. Otherwise: moves to the parent.' } },
            { keys: ['Home'], description: { pt: 'Primeiro item.', en: 'First item.' } },
            { keys: ['End'], description: { pt: 'Último item visível.', en: 'Last visible item.' } },
            { keys: ['Enter'], description: { pt: 'Seleciona o item e dispara onAction (em selectionMode="none", alterna a pasta).', en: 'Selects the item and fires onAction (with selectionMode="none", toggles the folder).' } },
            { keys: ['Space'], description: { pt: 'Seleciona (única) ou alterna a seleção (múltipla).', en: 'Selects (single) or toggles selection (multiple).' } },
            { keys: ['*'], description: { pt: 'Expande todas as pastas irmãs do item focado.', en: 'Expands all sibling folders of the focused item.' } },
            { keys: ['Shift', '↑ / ↓'], description: { pt: 'Seleção múltipla: move o foco e adiciona o item à seleção.', en: 'Multiple selection: moves focus and adds the item to the selection.' } },
            { keys: ['Ctrl', 'A'], description: { pt: 'Seleção múltipla: seleciona tudo (ou limpa, se tudo já estiver selecionado).', en: 'Multiple selection: selects all (or clears, if everything is selected).' } },
            { keys: ['a–z'], description: { pt: 'Busca por digitação: foca o próximo item que começa com o texto digitado.', en: 'Type-ahead: focuses the next item starting with the typed text.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Hierarquia, posição e estado expostos com papéis e atributos ARIA.', en: 'Hierarchy, position and state exposed with ARIA roles and attributes.' } },
            { criterion: '1.4.1', description: { pt: 'Seleção indicada por fundo, faixa lateral e caixa de marcação (múltipla), não só por cor.', en: 'Selection shown by background, side bar and check box (multiple), not by color alone.' } },
            { criterion: '2.1.1', description: { pt: 'Todas as ações disponíveis pelo teclado, conforme o padrão APG.', en: 'Every action available from the keyboard, following the APG pattern.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível desenhado na linha do item.', en: 'Visible focus drawn on the item row.' } },
            { criterion: '4.1.2', description: { pt: 'Cada item tem nome próprio (sem incluir o texto dos filhos) e estados atualizados.', en: 'Each item has its own name (excluding children text) and up-to-date states.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
