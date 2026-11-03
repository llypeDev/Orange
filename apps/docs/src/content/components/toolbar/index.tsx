import {
  Bullets,
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
import Actions from './examples/Actions'
import ActionsCode from './examples/Actions?raw'
import Editor from './examples/Editor'
import EditorCode from './examples/Editor?raw'
import Vertical from './examples/Vertical'
import VerticalCode from './examples/Vertical?raw'
import { meta } from './meta'

export default function ToolbarPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para conjuntos de controles usados com frequência sobre um mesmo conteúdo — editor de texto, quadro, tabela.',
              en: 'Use it for sets of frequently used controls acting on the same content — text editor, whiteboard, table.',
            },
            {
              pt: (
                <>
                  Dê um nome à barra com <Code>aria-label</Code> ("Formatação de texto"), principalmente quando houver mais de uma
                  na página.
                </>
              ),
              en: (
                <>
                  Name the toolbar with <Code>aria-label</Code> ("Text formatting"), especially when there is more than one on the
                  page.
                </>
              ),
            },
            {
              pt: 'Organize os itens em grupos com ToolbarGroup e ToolbarSeparator: histórico, estilo, alinhamento, inserir.',
              en: 'Organize items in groups with ToolbarGroup and ToolbarSeparator: history, style, alignment, insert.',
            },
            {
              pt: 'Com três ou menos botões, prefira um ButtonGroup — a navegação por setas só compensa em barras maiores.',
              en: 'With three buttons or fewer, prefer a ButtonGroup — arrow-key navigation only pays off on larger bars.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Toolbar', en: 'Toolbar' }, description: { pt: <><Code>role="toolbar"</Code> com <Code>aria-orientation</Code>; controla o roving tabindex.</>, en: <><Code>role="toolbar"</Code> with <Code>aria-orientation</Code>; manages the roving tabindex.</> } },
            { term: { pt: 'Itens', en: 'Items' }, description: { pt: <>Elementos com <Code>data-roving-item</Code>. IconButton, ToggleButton, CopyButton, SplitButton e os Buttons filhos diretos são marcados automaticamente.</>, en: <>Elements with <Code>data-roving-item</Code>. IconButton, ToggleButton, CopyButton, SplitButton and direct Button children are marked automatically.</> } },
            { term: { pt: 'ToolbarGroup', en: 'ToolbarGroup' }, description: { pt: <>Um <Code>role="group"</Code> opcional para itens relacionados. ToggleButtonGroup também funciona como grupo.</>, en: <>An optional <Code>role="group"</Code> for related items. ToggleButtonGroup works as a group too.</> } },
            { term: { pt: 'ToolbarSeparator', en: 'ToolbarSeparator' }, description: { pt: <>Divisor <Code>role="separator"</Code>, não focável, com orientação oposta à da barra.</>, en: <>A non-focusable <Code>role="separator"</Code> divider, oriented opposite to the bar.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Editor de texto', en: 'Text editor' }}
          description={{
            pt: 'Tab entra na barra uma única vez; use ←/→ para percorrer os botões e Espaço para alternar a formatação. A barra lembra o último item focado.',
            en: 'Tab enters the bar once; use ←/→ to move between buttons and Space to toggle formatting. The bar remembers the last focused item.',
          }}
          code={EditorCode}
        >
          <Editor />
        </Example>
        <Example
          title={{ pt: 'Vertical', en: 'Vertical' }}
          description={{ pt: 'Com orientation="vertical", as setas ↑/↓ movem o foco.', en: 'With orientation="vertical", the ↑/↓ arrows move focus.' }}
          code={VerticalCode}
        >
          <Vertical />
        </Example>
        <Example
          title={{ pt: 'Ações com texto, sem moldura', en: 'Text actions, no frame' }}
          description={{
            pt: <>Buttons, CopyButton e SplitButton convivem na mesma barra. <Code>bordered=&#123;false&#125;</Code> remove a moldura.</>,
            en: <>Buttons, CopyButton and SplitButton live in the same bar. <Code>bordered=&#123;false&#125;</Code> removes the frame.</>,
          }}
          code={ActionsCode}
        >
          <Actions />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Toolbar', en: 'Toolbar' }}
          rows={[
            { name: 'aria-label', type: 'string', description: { pt: 'Nome da barra (ou aria-labelledby). Recomendado.', en: 'Toolbar name (or aria-labelledby). Recommended.' } },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: { pt: 'Direção e setas usadas (←/→ ou ↑/↓).', en: 'Direction and arrows used (←/→ or ↑/↓).' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", description: { pt: 'Tamanho repassado aos botões.', en: 'Size passed down to the buttons.' } },
            { name: 'loop', type: 'boolean', default: 'true', description: { pt: 'Volta ao primeiro item depois do último.', en: 'Wraps from the last item to the first.' } },
            { name: 'bordered', type: 'boolean', default: 'true', description: { pt: 'Desenha borda e fundo.', en: 'Draws border and background.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos nativos (aria-controls, id…).', en: 'Native attributes (aria-controls, id…).' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ToolbarGroup', en: 'ToolbarGroup' }}
          rows={[
            { name: 'aria-label', type: 'string', description: { pt: 'Nome do grupo (opcional).', en: 'Group name (optional).' } },
            { name: 'attached', type: 'boolean', default: 'false', description: { pt: 'Cola os botões do grupo.', en: 'Attaches the group buttons.' } },
            { name: 'size / variant / disabled', type: '—', description: { pt: 'Repassados aos itens do grupo.', en: 'Passed down to the group items.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ToolbarSeparator', en: 'ToolbarSeparator' }}
          rows={[
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos nativos do divisor.', en: 'Native attributes of the divider.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <em>Toolbar</em> do WAI-ARIA com <em>roving tabindex</em>: só um item tem <Code>tabindex="0"</Code>
                e os demais <Code>-1</Code>. As setas não são capturadas quando o foco está num campo de texto dentro da barra.
                Itens desabilitados são pulados.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA <em>Toolbar</em> pattern with a <em>roving tabindex</em>: only one item has{' '}
                <Code>tabindex="0"</Code> and the others <Code>-1</Code>. Arrow keys are not captured while focus is in a text
                field inside the bar. Disabled items are skipped.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Entra na barra pelo último item focado (ou o primeiro) e sai na próxima tecla Tab.', en: 'Enters the bar on the last focused item (or the first) and leaves on the next Tab.' } },
            { keys: ['→'], description: { pt: 'Próximo item (barra horizontal). Do último, volta ao primeiro.', en: 'Next item (horizontal bar). From the last, wraps to the first.' } },
            { keys: ['←'], description: { pt: 'Item anterior (barra horizontal).', en: 'Previous item (horizontal bar).' } },
            { keys: ['↓'], description: { pt: 'Próximo item (barra vertical).', en: 'Next item (vertical bar).' } },
            { keys: ['↑'], description: { pt: 'Item anterior (barra vertical).', en: 'Previous item (vertical bar).' } },
            { keys: ['Home'], description: { pt: 'Primeiro item.', en: 'First item.' } },
            { keys: ['End'], description: { pt: 'Último item.', en: 'Last item.' } },
            { keys: ['Enter'], description: { pt: 'Ativa o item focado.', en: 'Activates the focused item.' } },
            { keys: ['Space'], description: { pt: 'Ativa ou alterna o item focado.', en: 'Activates or toggles the focused item.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Barra, grupos e divisores expostos com toolbar, group e separator.', en: 'Bar, groups and dividers exposed as toolbar, group and separator.' } },
            { criterion: '2.1.1', description: { pt: 'Todos os itens são alcançáveis pelas setas; Home e End vão às pontas.', en: 'Every item is reachable with arrow keys; Home and End jump to the ends.' } },
            { criterion: '2.4.3', description: { pt: 'Uma única parada de Tab mantém a ordem de foco previsível.', en: 'A single Tab stop keeps the focus order predictable.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px em cada item.', en: 'Visible focus with a 2px orange outline on each item.' } },
            { criterion: '4.1.2', description: { pt: <>Nome em <Code>aria-label</Code>, orientação em <Code>aria-orientation</Code>.</>, en: <>Name in <Code>aria-label</Code>, orientation in <Code>aria-orientation</Code>.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
