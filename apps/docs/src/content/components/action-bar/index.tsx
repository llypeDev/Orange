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
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import LabelAndPlacement from './examples/LabelAndPlacement'
import LabelAndPlacementCode from './examples/LabelAndPlacement?raw'
import Viewport from './examples/Viewport'
import ViewportCode from './examples/Viewport?raw'
import WithTable from './examples/WithTable'
import WithTableCode from './examples/WithTable?raw'
import { meta } from './meta'

export default function ActionBarPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Controle a visibilidade pela seleção —{' '}
                  <Code>open=&#123;selecionados.length &gt; 0&#125;</Code> — e passe{' '}
                  <Code>count</Code>: a barra mostra "N selecionados" e anuncia cada mudança.
                </>
              ),
              en: (
                <>
                  Drive visibility from the selection —{' '}
                  <Code>open=&#123;selected.length &gt; 0&#125;</Code> — and pass <Code>count</Code>
                  : the bar shows "N selected" and announces every change.
                </>
              ),
            },
            {
              pt: 'Até três ações visíveis, com verbos curtos (Exportar, Atribuir, Excluir). As demais vão para um Dropdown "Mais ações".',
              en: 'Up to three visible actions with short verbs (Export, Assign, Delete). The rest go into a "More actions" Dropdown.',
            },
            {
              pt: 'Ações destrutivas pedem confirmação (ConfirmDialog) dizendo quantos itens serão afetados.',
              en: 'Destructive actions ask for confirmation (ConfirmDialog) stating how many items are affected.',
            },
            {
              pt: (
                <>
                  Declare o ActionBar logo depois da coleção que ele controla: é ali que ele entra
                  na ordem do Tab e é para lá que o foco volta quando a barra fecha. Passe{' '}
                  <Code>onDismiss</Code> para limpar a seleção (botão e Escape).
                </>
              ),
              en: (
                <>
                  Declare the ActionBar right after the collection it acts on: that is where it sits
                  in the Tab order and where focus goes back when the bar closes. Pass{' '}
                  <Code>onDismiss</Code> to clear the selection (button and Escape).
                </>
              ),
            },
            {
              pt: (
                <>
                  Em painéis, drawers e cartões use <Code>portal=&#123;false&#125;</Code> num
                  contêiner com <Code>position: relative</Code> e reserve espaço (padding) para a
                  barra não cobrir o último item.
                </>
              ),
              en: (
                <>
                  In panels, drawers and cards use <Code>portal=&#123;false&#125;</Code> inside a
                  container with <Code>position: relative</Code> and reserve space (padding) so the
                  bar does not cover the last item.
                </>
              ),
            },
            {
              pt: 'Para ações que não dependem de seleção, use Toolbar ou os botões do PageHeader.',
              en: 'For actions that do not depend on a selection, use a Toolbar or the PageHeader buttons.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia e layout', en: 'Anatomy and layout' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Barra', en: 'Bar' },
              description: {
                pt: (
                  <>
                    <Code>role="toolbar"</Code> com nome "Ações em lote" (troque com{' '}
                    <Code>aria-label</Code>) e a contagem como descrição. Uma única parada de Tab.
                  </>
                ),
                en: (
                  <>
                    <Code>role="toolbar"</Code> named "Bulk actions" (change it with{' '}
                    <Code>aria-label</Code>) and described by the count. A single Tab stop.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Contagem', en: 'Count' },
              description: {
                pt: (
                  <>
                    "1 selecionado" / "3 selecionados", no idioma do OrangeProvider e com separador
                    de milhar. <Code>label</Code> troca o texto.
                  </>
                ),
                en: (
                  <>
                    "1 selected" / "3 selected", in the OrangeProvider language and with thousands
                    separators. <Code>label</Code> replaces the text.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Limpar seleção', en: 'Clear selection' },
              description: {
                pt: (
                  <>
                    Botão ✕ ao lado da contagem, presente quando há <Code>onDismiss</Code>.
                  </>
                ),
                en: (
                  <>
                    An ✕ button next to the count, shown when <Code>onDismiss</Code> is set.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Ações', en: 'Actions' },
              description: {
                pt: 'Os filhos. Todo botão ou link dentro deles entra nas setas, mesmo em fragmentos ou componentes próprios. Button filhos diretos (e o gatilho Button de um Dropdown) também ficam ghost/sm, como na Toolbar.',
                en: 'The children. Every button or link inside them joins the arrow keys, even within fragments or custom components. Direct Button children (and the Button trigger of a Dropdown) also become ghost/sm, as in Toolbar.',
              },
            },
            {
              term: { pt: 'Posição', en: 'Position' },
              description: {
                pt: (
                  <>
                    Padrão: fixa na janela, centralizada, acima do conteúdo (
                    <Code>--or-z-header</Code>) e da safe area. Com{' '}
                    <Code>portal=&#123;false&#125;</Code>, absoluta no contêiner posicionado mais
                    próximo. Ajuste a distância da borda com <Code>--or-action-bar-offset</Code>{' '}
                    (ex.: acima de uma BottomNavigation).
                  </>
                ),
                en: (
                  <>
                    Default: fixed to the window, centered, above the content (
                    <Code>--or-z-header</Code>) and the safe area. With{' '}
                    <Code>portal=&#123;false&#125;</Code>, absolute in the nearest positioned
                    container. Tune the edge distance with <Code>--or-action-bar-offset</Code> (e.g.
                    above a BottomNavigation).
                  </>
                ),
              },
            },
            {
              term: { pt: 'Faixa estreita', en: 'Narrow space' },
              description: {
                pt: 'Até 32rem de largura disponível (container query, vale também dentro de painéis), a barra ocupa a largura toda e empilha: contagem e ✕ em cima, ações embaixo, quebrando linha. Nada rola na horizontal, nem a 320px.',
                en: 'Up to 32rem of available width (a container query, so it also works inside panels), the bar fills the width and stacks: count and ✕ on top, actions below, wrapping. Nothing scrolls horizontally, even at 320px.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Marque os arquivos: a barra aparece sem tirar o foco da caixa marcada. Excluir remove os itens e o foco volta para a lista.',
            en: 'Check the files: the bar appears without taking focus away from the checkbox. Delete removes the items and focus goes back to the list.',
          }}
          code={BasicCode}
          align="stretch"
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Com Table', en: 'With Table' }}
          description={{
            pt: (
              <>
                <Code>selectedRows</Code> e <Code>onSelectedRowsChange</Code> da Table controlam a
                barra. Excluir pede confirmação; as ações menos usadas ficam em "Mais ações".
              </>
            ),
            en: (
              <>
                The Table's <Code>selectedRows</Code> and <Code>onSelectedRowsChange</Code> drive
                the bar. Delete asks for confirmation; less frequent actions live in "More actions".
              </>
            ),
          }}
          code={WithTableCode}
          align="stretch"
        >
          <WithTable />
        </Example>
        <Example
          title={{ pt: 'Rótulo próprio e no topo', en: 'Custom label, on top' }}
          description={{
            pt: (
              <>
                <Code>label</Code> mostra um resumo da seleção e <Code>placement="top"</Code> leva a
                barra para o topo.
              </>
            ),
            en: (
              <>
                <Code>label</Code> shows a summary of the selection and <Code>placement="top"</Code>{' '}
                moves the bar to the top.
              </>
            ),
          }}
          code={LabelAndPlacementCode}
          align="stretch"
        >
          <LabelAndPlacement />
        </Example>
        <Example
          title={{ pt: 'Fixa na janela (padrão)', en: 'Fixed to the window (default)' }}
          description={{
            pt: 'Sem portal={false}, a barra flutua no rodapé da janela. A ordem do Tab continua a da página: depois da lista vem a barra.',
            en: 'Without portal={false}, the bar floats at the bottom of the window. The Tab order still follows the page: the bar comes right after the list.',
          }}
          code={ViewportCode}
        >
          <Viewport />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrar', en: 'Enter' },
              description: {
                pt: (
                  <>
                    Sobe 24px (desce, no topo) com fade em <Code>--or-duration-medium</Code> e{' '}
                    <Code>--or-ease-out</Code>.
                  </>
                ),
                en: (
                  <>
                    Rises 24px (drops, on top) with a fade in <Code>--or-duration-medium</Code> and{' '}
                    <Code>--or-ease-out</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Sair', en: 'Exit' },
              description: {
                pt: (
                  <>
                    Mais curta: volta 8px e esmaece em <Code>--or-duration-fast</Code> com{' '}
                    <Code>--or-ease-in-out</Code>, sem receber cliques. O <Code>usePresence</Code>{' '}
                    mantém a barra montada até o fim.
                  </>
                ),
                en: (
                  <>
                    Shorter: moves back 8px and fades in <Code>--or-duration-fast</Code> with{' '}
                    <Code>--or-ease-in-out</Code>, ignoring clicks. <Code>usePresence</Code> keeps
                    the bar mounted until it ends.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Contagem', en: 'Count' },
              description: {
                pt: 'O número muda na hora, sem animação: é informação, não decoração.',
                en: 'The number changes instantly, without animation: it is information, not decoration.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: (
                  <>
                    Com <Code>prefers-reduced-motion</Code>, sem deslocamento e com as durações
                    zeradas: a barra só aparece e some.
                  </>
                ),
                en: (
                  <>
                    With <Code>prefers-reduced-motion</Code>, no movement and zero durations: the
                    bar just appears and disappears.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'open',
              type: 'boolean',
              default: 'false',
              description: {
                pt: (
                  <>
                    Mostra a barra. Normalmente <Code>selecionados.length &gt; 0</Code>.
                  </>
                ),
                en: (
                  <>
                    Shows the bar. Usually <Code>selected.length &gt; 0</Code>.
                  </>
                ),
              },
            },
            {
              name: 'count',
              type: 'number',
              description: {
                pt: 'Itens selecionados: mostra "N selecionados" e anuncia as mudanças.',
                en: 'Selected items: shows "N selected" and announces changes.',
              },
            },
            {
              name: 'label',
              type: 'ReactNode',
              description: {
                pt: 'Substitui o texto da contagem. Em texto, é ele o anunciado.',
                en: 'Replaces the count text. When it is text, it is what gets announced.',
              },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: {
                pt: 'As ações: Button, IconButton, Dropdown ("Mais ações").',
                en: 'The actions: Button, IconButton, Dropdown ("More actions").',
              },
            },
            {
              name: 'onDismiss',
              type: '() => void',
              description: {
                pt: 'Mostra "Limpar seleção" e é chamado nele e com Escape dentro da barra.',
                en: 'Shows "Clear selection" and is called by it and by Escape inside the bar.',
              },
            },
            {
              name: 'placement',
              type: "'bottom' | 'top'",
              default: "'bottom'",
              description: { pt: 'Borda onde a barra flutua.', en: 'Edge where the bar floats.' },
            },
            {
              name: 'portal',
              type: 'boolean',
              default: 'true',
              description: {
                pt: (
                  <>
                    Fixa na janela. <Code>false</Code>: absoluta no contêiner posicionado mais
                    próximo.
                  </>
                ),
                en: (
                  <>
                    Fixed to the window. <Code>false</Code>: absolute in the nearest positioned
                    container.
                  </>
                ),
              },
            },
            {
              name: 'finalFocus',
              type: 'RefObject<HTMLElement>',
              description: {
                pt: 'Destino do foco quando a barra fecha com o foco dentro dela.',
                en: 'Where focus goes when the bar closes with focus inside it.',
              },
            },
            {
              name: 'aria-label',
              type: 'string',
              default: "'Ações em lote'",
              description: {
                pt: 'Nome da barra (ou aria-labelledby).',
                en: 'Toolbar name (or aria-labelledby).',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Atributos nativos da barra (id, className…). A ref aponta para ela.',
                en: 'Native attributes of the bar (id, className…). The ref points to it.',
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
                A barra é um <Code>role="toolbar"</Code> com <em>roving tabindex</em>: uma parada de
                Tab (de início, a primeira ação) e setas entre os itens.{' '}
                <strong>Aparecer não move o foco</strong> — quem está marcando linhas continua na
                linha. A contagem é anunciada numa região <Code>role="status"</Code> educada, sempre
                montada, só quando muda.
              </>
            }
            en={
              <>
                The bar is a <Code>role="toolbar"</Code> with a <em>roving tabindex</em>: one Tab
                stop (initially the first action) and arrow keys between items.{' '}
                <strong>Appearing does not move focus</strong> — whoever is checking rows stays on
                the row. The count is announced in a polite, always-mounted{' '}
                <Code>role="status"</Code> region, only when it changes.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                <strong>Foco ao fechar:</strong> se a barra fecha com o foco dentro dela (Limpar
                seleção, Escape, uma ação que limpa a seleção), o foco vai para{' '}
                <Code>finalFocus</Code>; senão, volta ao elemento focado antes de entrar na barra (a
                caixa da linha, por exemplo); se ele sumiu (linhas excluídas), vai para o elemento
                focável mais próximo antes do ActionBar na página. Um diálogo de confirmação que
                devolva o foco à barra que está saindo é redirecionado da mesma forma. Em portal, a
                ordem do Tab trata a barra como se ela estivesse onde o ActionBar foi declarado.
              </>
            }
            en={
              <>
                <strong>Focus on close:</strong> if the bar closes with focus inside it (Clear
                selection, Escape, an action that clears the selection), focus goes to{' '}
                <Code>finalFocus</Code>; otherwise back to the element focused before entering the
                bar (the row checkbox, for example); if that is gone (deleted rows), to the closest
                focusable element before the ActionBar on the page. A confirmation dialog returning
                focus to the closing bar is redirected the same way. In a portal, the Tab order
                treats the bar as if it were where the ActionBar was declared.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Entra na barra pela primeira ação (ou a última focada) a partir do elemento anterior a ela; o próximo Tab sai da barra.',
                en: 'Enters the bar on the first action (or the last focused one) from the element before it; the next Tab leaves the bar.',
              },
            },
            {
              keys: ['Shift', 'Tab'],
              description: { pt: 'Mesmo caminho, ao contrário.', en: 'Same path, backwards.' },
            },
            {
              keys: ['→'],
              description: {
                pt: 'Próximo item. Do último, volta ao primeiro.',
                en: 'Next item. From the last, wraps to the first.',
              },
            },
            { keys: ['←'], description: { pt: 'Item anterior.', en: 'Previous item.' } },
            {
              keys: ['Home'],
              description: {
                pt: 'Primeiro item (Limpar seleção, quando houver).',
                en: 'First item (Clear selection, when present).',
              },
            },
            { keys: ['End'], description: { pt: 'Último item.', en: 'Last item.' } },
            {
              keys: ['Enter'],
              description: { pt: 'Ativa o item focado.', en: 'Activates the focused item.' },
            },
            {
              keys: ['Space'],
              description: { pt: 'Ativa o item focado.', en: 'Activates the focused item.' },
            },
            {
              keys: ['↓'],
              description: {
                pt: 'No gatilho de um Dropdown, abre o menu.',
                en: 'On a Dropdown trigger, opens the menu.',
              },
            },
            {
              keys: ['Esc'],
              description: {
                pt: (
                  <>
                    Com o foco na barra, chama <Code>onDismiss</Code> (limpa a seleção). Num menu
                    aberto, fecha só o menu.
                  </>
                ),
                en: (
                  <>
                    With focus in the bar, calls <Code>onDismiss</Code> (clears the selection). In
                    an open menu, closes only the menu.
                  </>
                ),
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Barra exposta como toolbar com nome; a contagem é a descrição dela.',
                en: 'Bar exposed as a named toolbar; the count is its description.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Reflui em faixas estreitas, sem rolagem horizontal a 320px.',
                en: 'Reflows in narrow spaces, with no horizontal scrolling at 320px.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Todas as ações alcançáveis pelo teclado; Escape limpa a seleção.',
                en: 'Every action is reachable by keyboard; Escape clears the selection.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Aparecer não rouba o foco; ao fechar, o foco volta para um lugar previsível; em portal, a ordem do Tab segue a página.',
                en: 'Appearing does not steal focus; on close, focus returns to a predictable place; in a portal, the Tab order follows the page.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível com contorno laranja de 2px em cada item.',
                en: 'Visible focus with a 2px orange outline on each item.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'A contagem é anunciada numa região viva educada, sem mover o foco.',
                en: 'The count is announced in a polite live region, without moving focus.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
