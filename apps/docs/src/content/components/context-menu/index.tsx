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
import { T, useLang } from '../../../i18n'
import Canvas from './examples/Canvas'
import CanvasCode from './examples/Canvas?raw'
import Files from './examples/Files'
import FilesCode from './examples/Files?raw'
import { meta } from './meta'

export default function ContextMenuPage() {
  const { t } = useLang()
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'O menu de contexto é um atalho, nunca o único caminho: toda ação dele também precisa estar disponível de forma visível (botão, Dropdown de "Mais ações").',
              en: 'The context menu is a shortcut, never the only path: every action in it must also be available visibly (a button, a "More actions" Dropdown).',
            },
            {
              pt: 'Mostre só ações relacionadas ao que está sob o ponteiro — um arquivo, uma linha, o quadro — e mantenha a lista curta.',
              en: 'Show only actions related to what is under the pointer — a file, a row, the canvas — and keep the list short.',
            },
            {
              pt: (
                <>
                  Torne a área focável (<Code>tabIndex={0}</Code> ou um elemento focável dentro dela) para que Shift+F10 e a tecla
                  Menu funcionem.
                </>
              ),
              en: (
                <>
                  Make the area focusable (<Code>tabIndex={0}</Code> or a focusable element inside it) so Shift+F10 and the Menu
                  key work.
                </>
              ),
            },
            {
              pt: (
                <>
                  Usa as mesmas partes do Dropdown: <Code>DropdownItem</Code>, <Code>DropdownCheckboxItem</Code>,{' '}
                  <Code>DropdownRadioGroup</Code>, <Code>DropdownSeparator</Code> e <Code>DropdownLabel</Code>.
                </>
              ),
              en: (
                <>
                  It uses the same parts as Dropdown: <Code>DropdownItem</Code>, <Code>DropdownCheckboxItem</Code>,{' '}
                  <Code>DropdownRadioGroup</Code>, <Code>DropdownSeparator</Code> and <Code>DropdownLabel</Code>.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Lista de arquivos', en: 'File list' }}
          description={{
            pt: 'Cada linha tem seu próprio menu, nomeado com aria-label. Ao escolher um item, o foco volta para a linha.',
            en: 'Each row has its own menu, named with aria-label. When an item is chosen, focus returns to the row.',
          }}
          code={FilesCode}
        >
          <Files />
        </Example>
        <Example
          title={{ pt: 'Área de trabalho', en: 'Canvas' }}
          description={{
            pt: 'O menu abre exatamente no ponto do clique e acompanha a área se a página rolar. Inclui uma opção marcável.',
            en: 'The menu opens exactly at the click point and follows the area if the page scrolls. Includes a checkable option.',
          }}
          code={CanvasCode}
          align="stretch"
        >
          <Canvas />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Abrir', en: 'Open' }, description: { pt: 'Cresce de 96% a partir do canto junto ao ponteiro. 160ms, --or-ease-out.', en: 'Grows from 96% out of the corner next to the pointer. 160ms, --or-ease-out.' } },
            { term: { pt: 'Fechar', en: 'Close' }, description: { pt: 'Encolhe para o mesmo canto em 80ms; inerte durante a saída.', en: 'Shrinks back to the same corner in 80ms; inert while leaving.' } },
            { term: { pt: 'Itens', en: 'Items' }, description: { pt: 'Iguais ao Dropdown: fundo + barra laranja no foco (160ms), afundar ao pressionar (90ms), pop no check/rádio.', en: 'Same as Dropdown: background + orange bar on focus (160ms), sink on press (90ms), pop on check/radio.' } },
            { term: { pt: 'prefers-reduced-motion', en: 'prefers-reduced-motion' }, description: { pt: 'Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.', en: 'Durations and distances drop to zero: the component appears and disappears instantly, with no movement.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactElement', required: true, description: { pt: 'Área que responde ao clique direito (um único elemento).', en: 'Area that responds to right-click (a single element).' } },
            { name: 'content', type: 'ReactNode', required: true, description: { pt: 'Itens do menu (partes do Dropdown).', en: 'Menu items (Dropdown parts).' } },
            { name: 'aria-label', type: 'string', default: "t('contextMenu')", description: { pt: 'Nome do menu ("Menu de contexto").', en: 'Menu name ("Context menu").' } },
            { name: 'open / onOpenChange', type: 'boolean / (open) => void', description: { pt: 'Estado controlado.', en: 'Controlled state.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desliga o menu (volta o menu nativo).', en: 'Turns the menu off (native menu returns).' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Repassados ao menu.', en: 'Passed to the menu.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O painel é um <Code>role="menu"</Code> com a mesma semântica e navegação do Dropdown. Pelo mouse, abre no ponto
                do clique com o foco no menu; pelo teclado (Shift+F10 ou a tecla Menu), abre junto ao elemento focado com o foco
                no primeiro item. Ao fechar, o foco volta para onde estava.
              </>
            }
            en={
              <>
                The panel is a <Code>role="menu"</Code> with the same semantics and navigation as Dropdown. With the mouse, it opens
                at the click point with focus on the menu; with the keyboard (Shift+F10 or the Menu key), it opens next to the
                focused element with focus on the first item. On close, focus returns to where it was.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Shift', 'F10'], description: { pt: 'Abre o menu da área focada.', en: 'Opens the menu of the focused area.' } },
            { keys: ['Menu'], description: { pt: 'Abre o menu (tecla de menu de contexto).', en: 'Opens the menu (context menu key).' } },
            { keys: ['↓'], description: { pt: 'Próximo item (circula).', en: 'Next item (wraps).' } },
            { keys: ['↑'], description: { pt: 'Item anterior (circula).', en: 'Previous item (wraps).' } },
            { keys: ['Home'], description: { pt: 'Primeiro item.', en: 'First item.' } },
            { keys: ['End'], description: { pt: 'Último item.', en: 'Last item.' } },
            { keys: ['Enter'], description: { pt: 'Ativa o item focado.', en: 'Activates the focused item.' } },
            { keys: ['Esc'], description: { pt: 'Fecha e devolve o foco.', en: 'Closes and returns focus.' } },
          ]}
        />
        <Callout tone="warning" title={{ pt: 'Não esconda ações', en: "Don't hide actions" }}>
          {t({
            pt: 'Muitas pessoas não sabem que existe um menu de contexto, e leitores de tela não o anunciam. Ofereça as mesmas ações em um controle visível.',
            en: "Many people don't know a context menu exists, and screen readers don't announce it. Offer the same actions in a visible control.",
          })}
        </Callout>
        <WcagList
          items={[
            { criterion: '2.1.1', description: { pt: 'Abre e opera inteiramente pelo teclado (Shift+F10 / Menu).', en: 'Opens and operates entirely by keyboard (Shift+F10 / Menu).' } },
            { criterion: '2.4.3', description: { pt: 'Foco entra no menu ao abrir e volta à origem ao fechar.', en: 'Focus enters the menu on open and returns to the origin on close.' } },
            { criterion: '4.1.2', description: { pt: 'Papéis menu/menuitem e nome acessível traduzido.', en: 'menu/menuitem roles and a translated accessible name.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
