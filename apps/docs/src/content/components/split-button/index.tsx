import {
  Bullets,
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
import { Button, SplitButton } from '@orange/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import DisabledActions from './examples/DisabledActions'
import DisabledActionsCode from './examples/DisabledActions?raw'
import Outline from './examples/Outline'
import OutlineCode from './examples/Outline?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import { meta } from './meta'

export default function SplitButtonPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'A ação principal é a mais comum; o menu guarda variações dela (salvar como rascunho, exportar em outro formato).',
              en: 'The main action is the most common one; the menu holds variations of it (save as draft, export in another format).',
            },
            {
              pt: 'Mantenha o menu curto — de 2 a 6 itens — com rótulos que começam com verbo.',
              en: 'Keep the menu short — 2 to 6 items — with labels that start with a verb.',
            },
            {
              pt: 'Se as ações não são variações da principal, use um botão comum e um menu separado ("Mais ações").',
              en: 'If the actions are not variations of the main one, use a regular button and a separate menu ("More actions").',
            },
            {
              pt: 'Itens indisponíveis ficam visíveis e desabilitados, para que o usuário saiba que a opção existe.',
              en: 'Unavailable items stay visible and disabled, so users know the option exists.',
            },
          ]}
        />
        <DoDont
          doExample={
            <SplitButton actions={[{ label: 'Salvar como rascunho', onSelect: () => {} }]}>Publicar</SplitButton>
          }
          dontExample={
            <>
              <SplitButton actions={[{ label: 'Excluir conta', onSelect: () => {} }]}>Salvar</SplitButton>
              <Button variant="outline">Ajuda</Button>
            </>
          }
          doItems={[{ pt: 'Menu com variações da ação principal.', en: 'Menu with variations of the main action.' }]}
          dontItems={[
            {
              pt: 'Ações destrutivas ou sem relação escondidas atrás da seta.',
              en: 'Destructive or unrelated actions hidden behind the arrow.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Ação principal', en: 'Main action' }, description: { pt: <>Um Button comum; recebe <Code>ref</Code>, <Code>onClick</Code> e os demais atributos.</>, en: <>A regular Button; receives <Code>ref</Code>, <Code>onClick</Code> and other attributes.</> } },
            { term: { pt: 'Seta', en: 'Arrow' }, description: { pt: <>Botão com <Code>aria-haspopup="menu"</Code>, <Code>aria-expanded</Code> e o nome "Mais ações".</>, en: <>Button with <Code>aria-haspopup="menu"</Code>, <Code>aria-expanded</Code> and the name "More actions".</> } },
            { term: { pt: 'Menu', en: 'Menu' }, description: { pt: <>Lista <Code>role="menu"</Code> num portal, posicionada abaixo do botão; vira para cima se faltar espaço.</>, en: <>A <Code>role="menu"</Code> list in a portal, placed below the button; flips up when space runs out.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Publicação de conteúdo', en: 'Publishing content' }}
          description={{
            pt: 'Ao escolher um item, o menu fecha e o foco volta para a seta.',
            en: 'Choosing an item closes the menu and returns focus to the arrow.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Outline com ícone', en: 'Outline with icon' }}
          description={{ pt: 'Para ações secundárias, como exportar.', en: 'For secondary actions, such as exporting.' }}
          code={OutlineCode}
        >
          <Outline />
        </Example>
        <Example
          title={{ pt: 'Tamanhos e variantes', en: 'Sizes and variants' }}
          description={{ pt: 'primary (padrão), secondary e outline; sm, md e lg.', en: 'primary (default), secondary and outline; sm, md and lg.' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Itens e botão desabilitados', en: 'Disabled items and button' }}
          description={{
            pt: <>Itens com <Code>disabled</Code> recebem foco, mas não são acionados. <Code>placement="bottom-start"</Code> alinha o menu à esquerda.</>,
            en: <>Items with <Code>disabled</Code> get focus but cannot be activated. <Code>placement="bottom-start"</Code> aligns the menu to the start.</>,
          }}
          code={DisabledActionsCode}
        >
          <DisabledActions />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'SplitButton', en: 'SplitButton' }}
          rows={[
            { name: 'actions', type: 'SplitButtonAction[]', required: true, description: { pt: 'Itens do menu.', en: 'Menu items.' } },
            { name: 'children', type: 'ReactNode', description: { pt: 'Rótulo da ação principal.', en: 'Main action label.' } },
            { name: 'onClick', type: '(event) => void', description: { pt: 'Ação principal.', en: 'Main action.' } },
            { name: 'variant', type: "'primary' | 'secondary' | 'outline'", default: "'primary'", description: { pt: 'Estilo das duas partes.', en: 'Style of both parts.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do botão.', en: 'Button height.' } },
            { name: 'menuLabel', type: 'string', default: "t('moreActions')", description: { pt: 'Nome acessível da seta e do menu.', en: 'Accessible name of the arrow and the menu.' } },
            { name: 'open', type: 'boolean', description: { pt: 'Menu aberto (controlado).', en: 'Menu open (controlled).' } },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: { pt: 'Menu aberto inicialmente.', en: 'Menu initially open.' } },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: { pt: 'Chamado ao abrir ou fechar.', en: 'Called when opening or closing.' } },
            { name: 'placement', type: "'bottom-end' | 'bottom-start'", default: "'bottom-end'", description: { pt: 'Alinhamento do menu.', en: 'Menu alignment.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita as duas partes.', en: 'Disables both parts.' } },
            { name: 'className / style', type: '—', description: { pt: 'Aplicados ao contêiner.', en: 'Applied to the container.' } },
            { name: '...rest', type: 'ButtonHTMLAttributes', description: { pt: 'Atributos do botão principal (startIcon, loading…).', en: 'Main button attributes (startIcon, loading…).' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'SplitButtonAction', en: 'SplitButtonAction' }}
          rows={[
            { name: 'label', type: 'string', required: true, description: { pt: 'Rótulo do item (usado também na busca por letra).', en: 'Item label (also used for type-ahead).' } },
            { name: 'onSelect', type: '() => void', required: true, description: { pt: 'Chamado ao escolher o item.', en: 'Called when the item is chosen.' } },
            { name: 'icon', type: 'IconName', description: { pt: 'Ícone antes do rótulo.', en: 'Icon before the label.' } },
            { name: 'disabled', type: 'boolean', description: { pt: 'Visível e focável, mas não acionável.', en: 'Visible and focusable, but not actionable.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <em>Menu Button</em> do WAI-ARIA. A seta controla um <Code>role="menu"</Code> rotulado por ela, com
                itens <Code>role="menuitem"</Code>. Ao abrir, o foco vai para o primeiro item; ao fechar com Escape ou ao escolher
                um item, volta para a seta. Clicar fora fecha o menu.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA <em>Menu Button</em> pattern. The arrow controls a <Code>role="menu"</Code> labelled by it, with{' '}
                <Code>role="menuitem"</Code> items. On open, focus moves to the first item; when closing with Escape or choosing an
                item, it returns to the arrow. Clicking outside closes the menu.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Enter'], description: { pt: 'Na seta: abre o menu. No menu: escolhe o item focado.', en: 'On the arrow: opens the menu. In the menu: chooses the focused item.' } },
            { keys: ['Space'], description: { pt: 'Na seta: abre o menu. No menu: escolhe o item focado.', en: 'On the arrow: opens the menu. In the menu: chooses the focused item.' } },
            { keys: ['↓'], description: { pt: 'Na seta: abre no primeiro item. No menu: próximo item (volta ao início).', en: 'On the arrow: opens on the first item. In the menu: next item (wraps).' } },
            { keys: ['↑'], description: { pt: 'Na seta: abre no último item. No menu: item anterior (volta ao fim).', en: 'On the arrow: opens on the last item. In the menu: previous item (wraps).' } },
            { keys: ['Home'], description: { pt: 'Primeiro item.', en: 'First item.' } },
            { keys: ['End'], description: { pt: 'Último item.', en: 'Last item.' } },
            { keys: ['A–Z'], description: { pt: 'Foca o próximo item que começa com a letra.', en: 'Focuses the next item starting with the letter.' } },
            { keys: ['Escape'], description: { pt: 'Fecha o menu e devolve o foco à seta.', en: 'Closes the menu and returns focus to the arrow.' } },
            { keys: ['Tab'], description: { pt: 'Fecha o menu e segue para o próximo elemento.', en: 'Closes the menu and moves to the next element.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '2.1.1', description: { pt: 'Todas as ações do menu são alcançáveis pelo teclado.', en: 'Every menu action is reachable by keyboard.' } },
            { criterion: '2.4.3', description: { pt: 'O foco vai para o menu ao abrir e volta para a seta ao fechar.', en: 'Focus moves into the menu on open and back to the arrow on close.' } },
            { criterion: '2.4.7', description: { pt: 'Item focado com fundo, barra laranja e contorno.', en: 'Focused item with background, orange bar and outline.' } },
            { criterion: '4.1.2', description: { pt: <>Estado exposto com <Code>aria-expanded</Code>; papéis <Code>menu</Code>/<Code>menuitem</Code> e <Code>aria-disabled</Code>.</>, en: <>State exposed with <Code>aria-expanded</Code>; <Code>menu</Code>/<Code>menuitem</Code> roles and <Code>aria-disabled</Code>.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
