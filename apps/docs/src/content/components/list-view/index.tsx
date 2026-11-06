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
import Empty from './examples/Empty'
import EmptyCode from './examples/Empty?raw'
import Integrations from './examples/Integrations'
import IntegrationsCode from './examples/Integrations?raw'
import TeamMembers from './examples/TeamMembers'
import TeamMembersCode from './examples/TeamMembers?raw'
import { meta } from './meta'

export default function ListViewPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use para coleções em que cada linha é um objeto com ações: membros, arquivos,
                  integrações, configurações. Para listas só de leitura, use <strong>List</strong>;
                  para escolher valores de um formulário, <strong>Listbox</strong>; para dados com
                  várias colunas comparáveis, <strong>Table</strong>.
                </>
              ),
              en: (
                <>
                  Use it for collections where each row is an object with actions: members, files,
                  integrations, settings. For read-only lists use <strong>List</strong>; to pick
                  form values, <strong>Listbox</strong>; for data with several comparable columns,{' '}
                  <strong>Table</strong>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Dê um nome à lista com <strong>aria-label</strong> ou{' '}
                  <strong>aria-labelledby</strong>. O título de cada linha deve ser curto e único —
                  ele é o nome da linha e o alvo da busca por digitação.
                </>
              ),
              en: (
                <>
                  Name the list with <strong>aria-label</strong> or <strong>aria-labelledby</strong>
                  . Each row title should be short and unique — it is the row name and the
                  type-ahead target.
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <strong>onAction</strong> para a ação principal da linha (abrir detalhes).
                  Ações secundárias vão em <strong>actions</strong>: no máximo dois botões de ícone;
                  o resto num <strong>Dropdown</strong>.
                </>
              ),
              en: (
                <>
                  Use <strong>onAction</strong> for the row's primary action (open details).
                  Secondary actions go in <strong>actions</strong>: at most two icon buttons; the
                  rest in a <strong>Dropdown</strong>.
                </>
              ),
            },
            {
              pt: 'Não coloque links nem campos de texto como conteúdo principal da linha: a linha inteira já é o alvo do clique e do teclado.',
              en: 'Do not use links or text fields as the main row content: the whole row is already the click and keyboard target.',
            },
            {
              pt: 'Desabilite uma linha só quando o item existe mas não pode ser usado (ex.: convite expirado) — e desabilite também as ações dela. Como no Listbox e no TreeView, a linha desabilitada continua focável, para que o motivo (na descrição) seja lido.',
              en: 'Disable a row only when the item exists but cannot be used (e.g. expired invite) — and disable its actions too. As in Listbox and TreeView, the disabled row stays focusable so the reason (in the description) can be read.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'ListView', en: 'ListView' },
              description: {
                pt: (
                  <>
                    Contêiner <Code>role="grid"</Code> com borda de 1px e separadores entre as
                    linhas. Uma única parada de Tab.
                  </>
                ),
                en: (
                  <>
                    A <Code>role="grid"</Code> container with a 1px border and separators between
                    rows. A single Tab stop.
                  </>
                ),
              },
            },
            {
              term: { pt: 'ListViewItem', en: 'ListViewItem' },
              description: {
                pt: (
                  <>
                    Linha (<Code>role="row"</Code>) com uma célula. Slots, da esquerda para a
                    direita: caixa de seleção, <Code>icon</Code>, título (<Code>children</Code>) com{' '}
                    <Code>description</Code> abaixo e <Code>actions</Code>.
                  </>
                ),
                en: (
                  <>
                    Row (<Code>role="row"</Code>) with one cell. Slots, left to right: selection
                    box, <Code>icon</Code>, title (<Code>children</Code>) with{' '}
                    <Code>description</Code> below, and <Code>actions</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'icon', en: 'icon' },
              description: {
                pt: 'Ícone, avatar ou logotipo. Decorativo (aria-hidden): o nome da linha vem do título. Informação que só existe no visual (ex.: status de presença) deve ir para a descrição.',
                en: 'Icon, avatar or logo. Decorative (aria-hidden): the row name comes from the title. Information only present in the visual (e.g. presence status) belongs in the description.',
              },
            },
            {
              term: { pt: 'Título e descrição', en: 'Title and description' },
              description: {
                pt: 'Quebram linha em telas estreitas; as ações nunca encolhem e continuam alcançáveis a 320px.',
                en: 'Wrap on narrow screens; actions never shrink and stay reachable at 320px.',
              },
            },
            {
              term: { pt: 'actions', en: 'actions' },
              description: {
                pt: 'Botões de ícone, um Dropdown ou um status (Badge). Ficam fora da ordem de Tab e são alcançados com → / ←.',
                en: 'Icon buttons, a Dropdown or a status (Badge). Kept out of the Tab order and reached with → / ←.',
              },
            },
            {
              term: { pt: 'Indicador de seleção', en: 'Selection indicator' },
              description: {
                pt: (
                  <>
                    Em <Code>selectionMode="multiple"</Code>, uma caixa de seleção (checkbox):
                    clicar nela alterna só aquela linha. Na seleção única com <Code>onAction</Code>,
                    um botão de opção (radio), já que o clique na linha é a ação: marca a linha e
                    não desmarca.
                  </>
                ),
                en: (
                  <>
                    With <Code>selectionMode="multiple"</Code>, a checkbox: clicking it toggles only
                    that row. With single selection and <Code>onAction</Code>, a radio button, since
                    clicking the row is the action: it selects the row and never deselects.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Linha selecionada', en: 'Selected row' },
              description: {
                pt: 'Fundo de acento suave, barra laranja à esquerda e título em negrito.',
                en: 'Subtle accent background, orange bar on the left and bold title.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Seleção e ação', en: 'Selection and action' }}>
        <DefinitionTable
          rows={[
            {
              term: {
                pt: <Code>selectionMode="none"</Code>,
                en: <Code>selectionMode="none"</Code>,
              },
              description: {
                pt: (
                  <>
                    Padrão. Sem seleção: Enter, Espaço e clique na linha chamam{' '}
                    <Code>onAction(id)</Code> (se houver), com o <Code>id</Code> do item.
                  </>
                ),
                en: (
                  <>
                    Default. No selection: Enter, Space and row click call <Code>onAction(id)</Code>{' '}
                    (if any) with the item's <Code>id</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Sem onAction', en: 'Without onAction' },
              description: {
                pt: 'Enter, Espaço e clique na linha selecionam. Na seleção única (como no Listbox e no TreeView), selecionar outra linha substitui a seleção e a linha já selecionada continua selecionada; na múltipla, alternam a linha.',
                en: 'Enter, Space and row click select. With single selection (as in Listbox and TreeView), selecting another row replaces the selection and the already selected row stays selected; with multiple selection, they toggle the row.',
              },
            },
            {
              term: { pt: 'Com onAction', en: 'With onAction' },
              description: {
                pt: (
                  <>
                    Enter e clique no fundo da linha chamam <Code>onAction(id)</Code>, que recebe o{' '}
                    <Code>id</Code> do item; a seleção fica com Espaço e com o indicador de seleção
                    (caixa na múltipla, botão de opção na única).
                  </>
                ),
                en: (
                  <>
                    Enter and clicking the row background call <Code>onAction(id)</Code>, which
                    receives the item's <Code>id</Code>; selection uses Space and the selection
                    indicator (checkbox in multiple mode, radio in single mode).
                  </>
                ),
              },
            },
            {
              term: { pt: 'Ordem dos ids', en: 'Id order' },
              description: {
                pt: (
                  <>
                    <Code>onSelectedChange</Code> recebe os ids na ordem das linhas. Ids em{' '}
                    <Code>selected</Code> sem linha correspondente são mantidos no fim.
                  </>
                ),
                en: (
                  <>
                    <Code>onSelectedChange</Code> receives ids in row order. Ids in{' '}
                    <Code>selected</Code> without a matching row are kept at the end.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Linhas desabilitadas', en: 'Disabled rows' },
              description: {
                pt: 'Como no Listbox e no TreeView: continuam focáveis (setas, Home/End, PageUp/PageDown, busca por digitação e clique) e expõem aria-disabled="true", mas não são selecionadas — nem por Espaço, clique, Ctrl + A ou faixas com Shift — e não disparam onAction. Visual: conteúdo esmaecido, sem hover; com foco, o mesmo fundo e contorno das outras linhas.',
                en: 'As in Listbox and TreeView: they stay focusable (arrows, Home/End, PageUp/PageDown, type-ahead and click) and expose aria-disabled="true", but are never selected — not by Space, click, Ctrl + A or Shift ranges — and never fire onAction. Look: dimmed content, no hover; when focused, the same background and outline as other rows.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Membros da equipe', en: 'Team members' }}
          description={{
            pt: 'Seleção múltipla controlada, avatares, função na descrição e um Dropdown de ações por linha. O convite expirado está desabilitado: recebe foco, mas não seleção. Remover uma linha devolve o foco à vizinha.',
            en: 'Controlled multiple selection, avatars, role in the description and a Dropdown of actions per row. The expired invite is disabled: it gets focus but not selection. Removing a row moves focus to its neighbor.',
          }}
          code={TeamMembersCode}
        >
          <TeamMembers />
        </Example>
        <Example
          title={{ pt: 'Integrações', en: 'Integrations' }}
          description={{
            pt: 'onAction abre os detalhes num Drawer (Enter ou clique na linha). Sem seleção, a lista é navegação + ação; o status fica no slot actions.',
            en: 'onAction opens details in a Drawer (Enter or row click). Without selection, the list is navigation + action; the status sits in the actions slot.',
          }}
          code={IntegrationsCode}
        >
          <Integrations />
        </Example>
        <Example
          title={{ pt: 'Estado vazio', en: 'Empty state' }}
          description={{
            pt: 'emptyState aparece quando não há itens — aqui, com um EmptyState compacto e uma ação para limpar a busca. Lista compacta (size="sm") com seleção única.',
            en: 'emptyState shows when there are no items — here with a compact EmptyState and an action to clear the search. Compact list (size="sm") with single selection.',
          }}
          code={EmptyCode}
        >
          <Empty />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'ListView', en: 'ListView' }}
          rows={[
            {
              name: 'aria-label / aria-labelledby',
              type: 'string',
              required: true,
              description: {
                pt: 'Nome acessível da lista (um dos dois).',
                en: 'Accessible name of the list (one of them).',
              },
            },
            {
              name: 'selectionMode',
              type: "'none' | 'single' | 'multiple'",
              default: "'none'",
              description: {
                pt: (
                  <>
                    Modo de seleção. <Code>single</Code>: selecionar outra linha substitui e a
                    selecionada não desmarca. <Code>multiple</Code>: alterna, mostra caixas de
                    seleção e expõe <Code>aria-multiselectable</Code>.
                  </>
                ),
                en: (
                  <>
                    Selection mode. <Code>single</Code>: selecting another row replaces the
                    selection and the selected row never deselects. <Code>multiple</Code>: toggles,
                    shows checkboxes and exposes <Code>aria-multiselectable</Code>.
                  </>
                ),
              },
            },
            {
              name: 'selected',
              type: 'string[]',
              description: {
                pt: 'Ids selecionados (controlado).',
                en: 'Selected ids (controlled).',
              },
            },
            {
              name: 'defaultSelected',
              type: 'string[]',
              default: '[]',
              description: {
                pt: 'Ids selecionados inicialmente (não controlado).',
                en: 'Initially selected ids (uncontrolled).',
              },
            },
            {
              name: 'onSelectedChange',
              type: '(selected: string[]) => void',
              description: {
                pt: 'Chamado com os ids selecionados, na ordem das linhas.',
                en: 'Called with the selected ids, in row order.',
              },
            },
            {
              name: 'onAction',
              type: '(id: string) => void',
              description: {
                pt: 'Ação principal da linha, chamada com o id do item: Enter ou clique no fundo da linha (e Espaço, sem seleção). Nunca dispara em linhas desabilitadas.',
                en: "Row primary action, called with the item's id: Enter or clicking the row background (and Space, without selection). Never fires on disabled rows.",
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md'",
              default: "'md'",
              description: {
                pt: 'Altura mínima das linhas: 40px ou 56px.',
                en: 'Minimum row height: 40px or 56px.',
              },
            },
            {
              name: 'emptyState',
              type: 'ReactNode',
              default: '"Nenhum resultado encontrado"',
              description: {
                pt: 'Conteúdo exibido quando não há itens (dentro de uma linha da grade; seus botões continuam na ordem de Tab).',
                en: 'Content shown when there are no items (inside a grid row; its buttons stay in the Tab order).',
              },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: {
                pt: 'Os ListViewItem (podem vir dentro de fragmentos ou componentes).',
                en: 'The ListViewItem elements (may be inside fragments or components).',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Vão para o elemento <Code>role="grid"</Code>, que recebe a ref.
                  </>
                ),
                en: (
                  <>
                    Go to the <Code>role="grid"</Code> element, which receives the ref.
                  </>
                ),
              },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ListViewItem', en: 'ListViewItem' }}
          rows={[
            {
              name: 'id',
              type: 'string',
              required: true,
              description: {
                pt: (
                  <>
                    Identificador único na lista; é o valor usado em <Code>selected</Code> e{' '}
                    <Code>onAction</Code> (não vira o id do DOM).
                  </>
                ),
                en: (
                  <>
                    Unique id within the list; the value used in <Code>selected</Code> and{' '}
                    <Code>onAction</Code> (not the DOM id).
                  </>
                ),
              },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: {
                pt: 'Título da linha: nome acessível e alvo da busca por digitação.',
                en: 'Row title: accessible name and type-ahead target.',
              },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: {
                pt: (
                  <>
                    Texto secundário abaixo do título, ligado por <Code>aria-describedby</Code>.
                  </>
                ),
                en: (
                  <>
                    Secondary text below the title, linked with <Code>aria-describedby</Code>.
                  </>
                ),
              },
            },
            {
              name: 'icon',
              type: 'ReactNode',
              description: {
                pt: 'Visual à esquerda: Icon, Avatar (com alt="") ou logotipo. Decorativo.',
                en: 'Leading visual: Icon, Avatar (with alt="") or logo. Decorative.',
              },
            },
            {
              name: 'actions',
              type: 'ReactNode',
              description: {
                pt: 'Conteúdo à direita: IconButton, Dropdown ou status. Fora da ordem de Tab, alcançado com → / ←.',
                en: 'Trailing content: IconButton, Dropdown or status. Out of the Tab order, reached with → / ←.',
              },
            },
            {
              name: 'textValue',
              type: 'string',
              description: {
                pt: (
                  <>
                    Texto para a busca por digitação quando o título não é texto simples; vira o
                    nome da linha se não houver <Code>children</Code>.
                  </>
                ),
                en: (
                  <>
                    Type-ahead text when the title is not plain text; becomes the row name when
                    there are no <Code>children</Code>.
                  </>
                ),
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Continua focável e expõe aria-disabled, mas não é selecionada nem dispara onAction. Desabilite também as actions.',
                en: 'Stays focusable and exposes aria-disabled, but is never selected and never fires onAction. Disable the actions too.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Vão para a linha (<Code>role="row"</Code>), que recebe a ref.
                  </>
                ),
                en: (
                  <>
                    Go to the row (<Code>role="row"</Code>), which receives the ref.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Hover e foco', en: 'Hover and focus' },
              description: {
                pt: 'Mesma resposta: fundo da linha — 160ms, ease-out. O contorno de foco aparece na hora.',
                en: 'Same response: row background — 160ms, ease-out. The focus ring appears instantly.',
              },
            },
            {
              term: { pt: 'Pressionar', en: 'Press' },
              description: {
                pt: 'O fundo escurece um tom em 90ms (a linha não afunda, para não quebrar os separadores).',
                en: 'The background darkens one step in 90ms (the row does not sink, to keep separators intact).',
              },
            },
            {
              term: { pt: 'Seleção', en: 'Selection' },
              description: {
                pt: 'A barra laranja cresce do centro — 250ms, ease-spring; o check entra com "pop" — 250ms, ease-bounce.',
                en: 'The orange bar grows from the center — 250ms, ease-spring; the check pops in — 250ms, ease-bounce.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Todas as transições são instantâneas.',
                en: 'All transitions are instant.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <em>Grid</em> do WAI-ARIA APG usado como lista de uma coluna (como o
                GridList do React Aria): <Code>role="grid"</Code> com{' '}
                <Code>aria-multiselectable</Code> na seleção múltipla, linhas{' '}
                <Code>role="row"</Code> com <Code>aria-selected</Code> (quando selecionáveis) e{' '}
                <Code>aria-disabled</Code>, conteúdo numa <Code>role="gridcell"</Code>. O nome da
                linha vem só do título (<Code>aria-labelledby</Code>) e a descrição chega por{' '}
                <Code>aria-describedby</Code> — as ações não entram no nome.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <em>Grid</em> pattern used as a single-column list (like
                React Aria's GridList): <Code>role="grid"</Code> with{' '}
                <Code>aria-multiselectable</Code> for multiple selection, <Code>role="row"</Code>{' '}
                rows with <Code>aria-selected</Code> (when selectable) and{' '}
                <Code>aria-disabled</Code>, content in a <Code>role="gridcell"</Code>. The row name
                comes from the title only (<Code>aria-labelledby</Code>) and the description arrives
                through <Code>aria-describedby</Code> — actions are not part of the name.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                Só uma linha fica na ordem de tabulação (roving tabindex); botões, menus e caixas de
                seleção dentro das linhas recebem <Code>tabindex="-1"</Code> e são alcançados com →
                / ←. Ao voltar à lista, o foco retorna à última linha visitada ou à primeira
                selecionada. Se a linha focada for removida, o foco vai para a vizinha. Linhas
                desabilitadas continuam focáveis, como no Listbox e no TreeView, para que o leitor
                de tela anuncie o item e o motivo. Na seleção múltipla, o indicador de cada linha é
                um checkbox real ("Selecionar" + título) — um radio na seleção única com{' '}
                <Code>onAction</Code> — e Ctrl + A anuncia a contagem de selecionados numa região{' '}
                <Code>role="status"</Code>.
              </>
            }
            en={
              <>
                Only one row is in the tab order (roving tabindex); buttons, menus and selection
                boxes inside rows get <Code>tabindex="-1"</Code> and are reached with → / ←. When
                returning to the list, focus goes back to the last visited row or the first selected
                one. If the focused row is removed, focus moves to its neighbor. Disabled rows stay
                focusable, as in Listbox and TreeView, so screen readers announce the item and the
                reason. With multiple selection, each row's indicator is a real checkbox ("Select" +
                title) — a radio with single selection and <Code>onAction</Code> — and Ctrl + A
                announces the selected count in a <Code>role="status"</Code> region.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Entra na lista (uma única parada) ou sai dela, inclusive de dentro das ações.',
                en: 'Enters the list (a single stop) or leaves it, including from inside the actions.',
              },
            },
            {
              keys: ['↓ / ↑'],
              description: {
                pt: 'Próxima / anterior linha, inclusive as desabilitadas. Não dá a volta. Também funciona a partir de uma ação.',
                en: 'Next / previous row, including disabled ones. Does not wrap. Also works from inside an action.',
              },
            },
            {
              keys: ['Home / End'],
              description: {
                pt: 'Primeira / última linha (mesmo desabilitada).',
                en: 'First / last row (even if disabled).',
              },
            },
            {
              keys: ['PageUp / PageDown'],
              description: {
                pt: 'Sobe / desce uma "página" (a altura da lista, se ela rola, ou da janela).',
                en: 'Moves up / down one "page" (the list height when it scrolls, or the window).',
              },
            },
            {
              keys: ['→'],
              description: {
                pt: 'Na linha: vai à caixa de seleção ou à primeira ação. Numa ação: próxima ação; depois da última, volta à linha.',
                en: 'On the row: moves to the selection box or first action. On an action: next action; after the last one, back to the row.',
              },
            },
            {
              keys: ['←'],
              description: {
                pt: 'Na linha: vai à última ação. Numa ação: ação anterior; antes da primeira, volta à linha.',
                en: 'On the row: moves to the last action. On an action: previous action; before the first one, back to the row.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'Seleciona a linha (única: substitui a seleção; a já selecionada continua selecionada) ou alterna a seleção (múltipla). Sem seleção, chama onAction(id). Nada acontece numa linha desabilitada.',
                en: 'Selects the row (single: replaces the selection; an already selected row stays selected) or toggles the selection (multiple). Without selection, calls onAction(id). Nothing happens on a disabled row.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Chama onAction(id) com o id do item; sem onAction, seleciona como o Espaço. Nada acontece numa linha desabilitada.',
                en: "Calls onAction(id) with the item's id; without onAction, selects like Space. Nothing happens on a disabled row.",
              },
            },
            {
              keys: ['Shift', '↓ / ↑'],
              description: {
                pt: 'Seleção múltipla: estende a seleção da linha focada até a próxima/anterior (voltar encolhe a faixa; linhas desabilitadas ficam de fora).',
                en: 'Multiple selection: extends the selection from the focused row to the next/previous (going back shrinks the range; disabled rows are left out).',
              },
            },
            {
              keys: ['Ctrl', 'Shift', 'Home / End'],
              description: {
                pt: 'Seleção múltipla: estende a seleção até a primeira / última linha.',
                en: 'Multiple selection: extends the selection to the first / last row.',
              },
            },
            {
              keys: ['Ctrl / ⌘', 'A'],
              description: {
                pt: 'Seleção múltipla: seleciona todas as linhas habilitadas (ou limpa, se todas já estiverem).',
                en: 'Multiple selection: selects all enabled rows (or clears, if all already are).',
              },
            },
            {
              keys: ['a–z'],
              description: {
                pt: 'Busca por digitação: foca a próxima linha (inclusive desabilitada) cujo título ou textValue começa com o texto, ignorando acentos.',
                en: 'Type-ahead: focuses the next row (including disabled ones) whose title or textValue starts with the text, ignoring accents.',
              },
            },
          ]}
        />
        <p>
          <T
            pt={
              <>
                Dentro de uma ação, Espaço, Enter e as letras ficam com o próprio controle, e
                controles que usam as setas para si têm prioridade — o gatilho de um Dropdown abre o
                menu com ↓. Shift + clique para selecionar faixas não é suportado: use Shift + setas
                ou as caixas de seleção.
              </>
            }
            en={
              <>
                Inside an action, Space, Enter and letters belong to that control, and controls that
                use the arrows themselves take precedence — a Dropdown trigger opens its menu with
                ↓. Shift + click range selection is not supported: use Shift + arrows or the
                selection boxes.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Estrutura, seleção e estado desabilitado expostos com papéis e atributos ARIA.',
                en: 'Structure, selection and disabled state exposed with ARIA roles and attributes.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Seleção indicada por fundo, barra lateral, título em negrito e caixa marcada — não só por cor.',
                en: 'Selection shown by background, side bar, bold title and checked box — not by color alone.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'A 320px título e descrição quebram linha e as ações continuam visíveis, sem rolagem horizontal.',
                en: 'At 320px title and description wrap and actions stay visible, with no horizontal scrolling.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Navegação, seleção, ação e as ações internas disponíveis pelo teclado.',
                en: 'Navigation, selection, action and inner actions available from the keyboard.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Uma parada de Tab para a lista; o foco não se perde ao remover a linha focada.',
                en: 'One Tab stop for the list; focus is not lost when the focused row is removed.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível na linha e em cada ação; em alto contraste, seleção e foco usam cores do sistema.',
                en: 'Visible focus on the row and on each action; in high contrast, selection and focus use system colors.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Indicador de seleção (checkbox ou radio) com alvo de 24×24px.',
                en: 'Selection indicator (checkbox or radio) with a 24×24px target.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: 'Cada linha tem nome (só o título), descrição e estados (aria-selected, aria-disabled) atualizados; os indicadores têm nome "Selecionar + título".',
                en: 'Each row has an up-to-date name (title only), description and states (aria-selected, aria-disabled); indicators are named "Select + title".',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
