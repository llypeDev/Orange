import { Bullets, Code, ComponentPage, DefinitionTable, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Actions from './examples/Actions'
import ActionsCode from './examples/Actions?raw'
import Options from './examples/Options'
import OptionsCode from './examples/Options?raw'
import RowActions from './examples/RowActions'
import RowActionsCode from './examples/RowActions?raw'
import WithConfirm from './examples/WithConfirm'
import WithConfirmCode from './examples/WithConfirm?raw'
import { meta } from './meta'

export default function DropdownPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para agrupar ações secundárias de um objeto (projeto, linha da tabela, arquivo) e economizar espaço. A ação mais comum deve continuar visível como botão.',
              en: 'Use it to group secondary actions of an object (project, table row, file) and save space. The most common action should stay visible as a button.',
            },
            {
              pt: 'Itens começam com verbo e são curtos. Termine com reticências (…) quando a ação abre outra etapa, como um diálogo.',
              en: 'Items start with a verb and stay short. End with an ellipsis (…) when the action opens another step, such as a dialog.',
            },
            {
              pt: (
                <>
                  Ações destrutivas ficam no fim, depois de um <Code>DropdownSeparator</Code>, com <Code>tone="danger"</Code> — e
                  pedem confirmação.
                </>
              ),
              en: (
                <>
                  Destructive actions go last, after a <Code>DropdownSeparator</Code>, with <Code>tone="danger"</Code> — and ask for
                  confirmation.
                </>
              ),
            },
            {
              pt: 'Para escolher um valor de formulário, use Select ou Combobox; o Dropdown é para ações e preferências de visualização.',
              en: 'To pick a form value, use Select or Combobox; Dropdown is for actions and view preferences.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Partes', en: 'Parts' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'DropdownItem', en: 'DropdownItem' }, description: { pt: <>Ação (<Code>menuitem</Code>) com ícone, atalho e <Code>tone="danger"</Code> opcionais.</>, en: <>Action (<Code>menuitem</Code>) with optional icon, shortcut and <Code>tone="danger"</Code>.</> } },
            { term: { pt: 'DropdownCheckboxItem', en: 'DropdownCheckboxItem' }, description: { pt: <>Opção liga/desliga (<Code>menuitemcheckbox</Code>). Não fecha o menu.</>, en: <>On/off option (<Code>menuitemcheckbox</Code>). Keeps the menu open.</> } },
            { term: { pt: 'DropdownRadioGroup + DropdownRadioItem', en: 'DropdownRadioGroup + DropdownRadioItem' }, description: { pt: <>Opções exclusivas (<Code>menuitemradio</Code>) num grupo rotulado.</>, en: <>Exclusive options (<Code>menuitemradio</Code>) in a labelled group.</> } },
            { term: { pt: 'DropdownSeparator', en: 'DropdownSeparator' }, description: { pt: 'Divide grupos de itens.', en: 'Divides groups of items.' } },
            { term: { pt: 'DropdownLabel', en: 'DropdownLabel' }, description: { pt: 'Título não interativo de uma seção.', en: 'Non-interactive section title.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Menu de ações', en: 'Action menu' }}
          description={{
            pt: 'Ícones, atalhos, item desabilitado e ação destrutiva. Experimente ↓, letras e Enter.',
            en: 'Icons, shortcuts, a disabled item and a destructive action. Try ↓, letters and Enter.',
          }}
          code={ActionsCode}
        >
          <Actions />
        </Example>
        <Example
          title={{ pt: 'Opções de visualização', en: 'View options' }}
          description={{
            pt: 'Checkboxes mantêm o menu aberto para marcar vários; o grupo de rádio fecha ao escolher (ajustável com closeOnSelect).',
            en: 'Checkboxes keep the menu open to toggle several; the radio group closes on pick (adjustable with closeOnSelect).',
          }}
          code={OptionsCode}
        >
          <Options />
        </Example>
        <Example
          title={{ pt: 'Ações por linha', en: 'Row actions' }}
          description={{
            pt: 'Gatilho só com ícone (com aria-label específico) alinhado ao fim com placement="bottom-end".',
            en: 'Icon-only trigger (with a specific aria-label) aligned to the end with placement="bottom-end".',
          }}
          code={RowActionsCode}
        >
          <RowActions />
        </Example>
        <Example
          title={{ pt: 'Abrindo uma confirmação', en: 'Opening a confirmation' }}
          description={{
            pt: 'Ao escolher um item, o foco volta ao gatilho antes da ação rodar — então o diálogo aberto por ela devolve o foco ao lugar certo.',
            en: 'When an item is chosen, focus returns to the trigger before the action runs — so a dialog it opens returns focus to the right place.',
          }}
          code={WithConfirmCode}
        >
          <WithConfirm />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Abrir', en: 'Open' }, description: { pt: 'Opacidade + 6px vindo do gatilho. 160ms (--or-duration-fast), --or-ease-out.', en: 'Opacity + 6px from the trigger. 160ms (--or-duration-fast), --or-ease-out.' } },
            { term: { pt: 'Fechar', en: 'Close' }, description: { pt: 'Recua para o gatilho em 80ms (--or-duration-instant); inerte durante a saída.', en: 'Retreats toward the trigger in 80ms (--or-duration-instant); inert while leaving.' } },
            { term: { pt: 'Item em foco', en: 'Focused item' }, description: { pt: 'Fundo muda em 160ms e a barra laranja cresce do centro (scaleY). Mesmo efeito no hover e no teclado.', en: 'Background changes in 160ms and the orange bar grows from the center (scaleY). Same effect on hover and keyboard.' } },
            { term: { pt: 'Pressionar item', en: 'Pressing an item' }, description: { pt: 'Afunda 1px. 90ms (--or-duration-press).', en: 'Sinks 1px. 90ms (--or-duration-press).' } },
            { term: { pt: 'Check e rádio', en: 'Check and radio' }, description: { pt: 'O indicador entra com or-scale-in (160ms, --or-ease-bounce) quando o estado muda — não ao abrir o menu.', en: 'The indicator enters with or-scale-in (160ms, --or-ease-bounce) when the state changes — not when the menu opens.' } },
            { term: { pt: 'prefers-reduced-motion', en: 'prefers-reduced-motion' }, description: { pt: 'Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.', en: 'Durations and distances drop to zero: the component appears and disappears instantly, with no movement.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Dropdown', en: 'Dropdown' }}
          rows={[
            { name: 'trigger', type: 'ReactElement', required: true, description: { pt: 'Botão que abre o menu.', en: 'Button that opens the menu.' } },
            { name: 'children', type: 'ReactNode', required: true, description: { pt: 'Itens do menu.', en: 'Menu items.' } },
            { name: 'placement', type: 'Placement', default: "'bottom-start'", description: { pt: 'Posição preferida.', en: 'Preferred position.' } },
            { name: 'offset', type: 'number', default: '4', description: { pt: 'Distância do gatilho (px).', en: 'Distance from the trigger (px).' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Repassados ao menu (ex.: aria-label, className).', en: 'Passed to the menu (e.g. aria-label, className).' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'DropdownItem', en: 'DropdownItem' }}
          rows={[
            { name: 'onSelect', type: '(event) => void', description: { pt: 'Executado ao ativar (clique, Enter, Espaço).', en: 'Runs on activation (click, Enter, Space).' } },
            { name: 'icon', type: 'IconName | ReactElement', description: { pt: 'Ícone à esquerda.', en: 'Leading icon.' } },
            { name: 'shortcut', type: 'string', description: { pt: 'Atalho exibido (apenas visual).', en: 'Displayed shortcut (visual only).' } },
            { name: 'tone', type: "'neutral' | 'danger'", default: "'neutral'", description: { pt: 'danger para ações destrutivas.', en: 'danger for destructive actions.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Focável, mas não ativável.', en: 'Focusable but not activatable.' } },
            { name: 'closeOnSelect', type: 'boolean', default: 'true', description: { pt: 'Fecha o menu ao ativar.', en: 'Closes the menu on activation.' } },
            { name: 'textValue', type: 'string', description: { pt: 'Texto para o typeahead quando o conteúdo não é texto simples.', en: 'Typeahead text when the content is not plain text.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'DropdownCheckboxItem', en: 'DropdownCheckboxItem' }}
          rows={[
            { name: 'checked / defaultChecked', type: 'boolean', description: { pt: 'Estado marcado (controlado / não controlado).', en: 'Checked state (controlled / uncontrolled).' } },
            { name: 'onCheckedChange', type: '(checked: boolean) => void', description: { pt: 'Chamado com o novo estado.', en: 'Called with the new state.' } },
            { name: 'closeOnSelect', type: 'boolean', default: 'false', description: { pt: 'Fecha o menu ao alternar.', en: 'Closes the menu on toggle.' } },
            { name: 'disabled / shortcut / textValue', type: '—', description: { pt: 'Como em DropdownItem.', en: 'As in DropdownItem.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'DropdownRadioGroup e DropdownRadioItem', en: 'DropdownRadioGroup and DropdownRadioItem' }}
          rows={[
            { name: 'value / defaultValue', type: 'string', description: { pt: 'Grupo: valor selecionado.', en: 'Group: selected value.' } },
            { name: 'onChange', type: '(value: string) => void', description: { pt: 'Grupo: chamado com o novo valor.', en: 'Group: called with the new value.' } },
            { name: 'onValueChange', type: '(value: string) => void', deprecated: { replacement: 'onChange', since: '0.6.0', removal: '1.0.0' }, description: { pt: 'Grupo: nome antigo de onChange.', en: 'Group: former name of onChange.' } },
            { name: 'label', type: 'ReactNode', description: { pt: 'Grupo: título visível que nomeia o grupo.', en: 'Group: visible title naming the group.' } },
            { name: 'value', type: 'string', required: true, description: { pt: 'Item: valor da opção.', en: 'Item: option value.' } },
            { name: 'closeOnSelect', type: 'boolean', default: 'true', description: { pt: 'Item: fecha o menu ao escolher.', en: 'Item: closes the menu on pick.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <em>Menu Button</em> do WAI-ARIA APG. O gatilho tem <Code>aria-haspopup="menu"</Code>,{' '}
                <Code>aria-expanded</Code> e <Code>aria-controls</Code>; o menu tem <Code>role="menu"</Code> rotulado pelo
                gatilho e itens <Code>menuitem</Code>, <Code>menuitemcheckbox</Code> e <Code>menuitemradio</Code> com{' '}
                <Code>aria-checked</Code>. O foco percorre os itens de verdade (não só visualmente) e volta ao gatilho ao fechar.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <em>Menu Button</em> pattern. The trigger has <Code>aria-haspopup="menu"</Code>,{' '}
                <Code>aria-expanded</Code> and <Code>aria-controls</Code>; the menu has <Code>role="menu"</Code> labelled by the
                trigger and <Code>menuitem</Code>, <Code>menuitemcheckbox</Code> and <Code>menuitemradio</Code> items with{' '}
                <Code>aria-checked</Code>. Focus truly moves through the items (not just visually) and returns to the trigger on
                close.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Enter'], description: { pt: 'No gatilho: abre e foca o primeiro item. No item: ativa.', en: 'On the trigger: opens and focuses the first item. On an item: activates it.' } },
            { keys: ['Space'], description: { pt: 'No gatilho: abre. No item: ativa (checkbox alterna sem fechar).', en: 'On the trigger: opens. On an item: activates (checkbox toggles without closing).' } },
            { keys: ['↓'], description: { pt: 'No gatilho: abre no primeiro item. No menu: próximo item (circula).', en: 'On the trigger: opens on the first item. In the menu: next item (wraps).' } },
            { keys: ['↑'], description: { pt: 'No gatilho: abre no último item. No menu: item anterior (circula).', en: 'On the trigger: opens on the last item. In the menu: previous item (wraps).' } },
            { keys: ['Home'], description: { pt: 'Primeiro item.', en: 'First item.' } },
            { keys: ['End'], description: { pt: 'Último item.', en: 'Last item.' } },
            { keys: ['A–Z'], description: { pt: 'Foca o próximo item que começa com as letras digitadas.', en: 'Focuses the next item starting with the typed letters.' } },
            { keys: ['Esc'], description: { pt: 'Fecha e devolve o foco ao gatilho.', en: 'Closes and returns focus to the trigger.' } },
            { keys: ['Tab'], description: { pt: 'Fecha e segue para o próximo elemento da página.', en: 'Closes and moves on to the next element on the page.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Grupos, separadores e estados marcados expostos por papéis ARIA.', en: 'Groups, separators and checked states exposed through ARIA roles.' } },
            { criterion: '2.1.1', description: { pt: 'Todas as ações acessíveis por teclado, incluindo busca por letra.', en: 'Every action reachable by keyboard, including letter search.' } },
            { criterion: '2.4.3', description: { pt: 'Foco volta ao gatilho ao fechar ou escolher um item.', en: 'Focus returns to the trigger on close or when an item is chosen.' } },
            { criterion: '2.4.7', description: { pt: 'Item focado destacado com fundo e barra laranja.', en: 'Focused item highlighted with a background and an orange bar.' } },
            { criterion: '4.1.2', description: { pt: 'Estado do menu exposto por aria-expanded; itens desabilitados por aria-disabled.', en: 'Menu state exposed via aria-expanded; disabled items via aria-disabled.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
