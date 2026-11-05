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
import { Tab, TabList, Tabs } from '@orangesys/ui'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Enclosed from './examples/Enclosed'
import EnclosedCode from './examples/Enclosed?raw'
import Fitted from './examples/Fitted'
import FittedCode from './examples/Fitted?raw'
import Manual from './examples/Manual'
import ManualCode from './examples/Manual?raw'
import Vertical from './examples/Vertical'
import VerticalCode from './examples/Vertical?raw'
import { meta } from './meta'

export default function TabsPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use abas para alternar entre visões do mesmo assunto. Para etapas em sequência, use Stepper; para ir a outra página, use links.',
              en: 'Use tabs to switch between views of the same subject. For sequential steps, use Stepper; to go to another page, use links.',
            },
            {
              pt: 'Rótulos curtos (uma ou duas palavras), em caixa de sentença, que descrevem o conteúdo do painel.',
              en: 'Short labels (one or two words), in sentence case, describing the panel content.',
            },
            {
              pt: 'Evite mais de 6 abas. Se o conteúdo não cabe, reorganize — abas roláveis escondem opções.',
              en: 'Avoid more than 6 tabs. If content does not fit, reorganize — scrolling tabs hide options.',
            },
            {
              pt: (
                <>
                  Prefira a ativação automática. Use <Code>activation="manual"</Code> quando trocar de painel dispara uma
                  consulta lenta.
                </>
              ),
              en: (
                <>
                  Prefer automatic activation. Use <Code>activation="manual"</Code> when switching panels triggers a slow
                  request.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Tabs defaultValue="a">
              <TabList aria-label="Exemplo correto">
                <Tab value="a">Resumo</Tab>
                <Tab value="b">Membros</Tab>
                <Tab value="c">Arquivos</Tab>
              </TabList>
            </Tabs>
          }
          dontExample={
            <Tabs defaultValue="a">
              <TabList aria-label="Exemplo incorreto">
                <Tab value="a">1. Dados</Tab>
                <Tab value="b">2. Endereço</Tab>
                <Tab value="c">3. Pagamento</Tab>
              </TabList>
            </Tabs>
          }
          doItems={[{ pt: 'Visões paralelas do mesmo objeto.', en: 'Parallel views of the same object.' }]}
          dontItems={[{ pt: 'Etapas sequenciais de um fluxo — use Stepper.', en: 'Sequential steps of a flow — use Stepper.' }]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Tabs', en: 'Tabs' }, description: { pt: 'Raiz: guarda a aba selecionada, a variante e a orientação.', en: 'Root: holds the selected tab, variant and orientation.' } },
            { term: { pt: 'TabList', en: 'TabList' }, description: { pt: <>Lista de abas (<Code>role="tablist"</Code>). Precisa de <Code>aria-label</Code>.</>, en: <>Tab list (<Code>role="tablist"</Code>). Needs an <Code>aria-label</Code>.</> } },
            { term: { pt: 'Tab', en: 'Tab' }, description: { pt: 'Uma aba, com ícone e contador opcionais.', en: 'A tab, with optional icon and counter.' } },
            { term: { pt: 'TabPanel', en: 'TabPanel' }, description: { pt: <>Painel ligado à aba de mesmo <Code>value</Code>.</>, en: <>Panel linked to the tab with the same <Code>value</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Variante line: a aba ativa ganha o sublinhado laranja de 2px. Abas desabilitadas são puladas pelas setas.',
            en: 'Line variant: the active tab gets the 2px orange underline. Disabled tabs are skipped by the arrow keys.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Enclosed com ícones e contadores', en: 'Enclosed with icons and counters' }}
          description={{
            pt: 'Abas com borda que se unem ao painel. icon é decorativo; badge entra no nome acessível.',
            en: 'Bordered tabs that join the panel. icon is decorative; badge is part of the accessible name.',
          }}
          code={EnclosedCode}
        >
          <Enclosed />
        </Example>
        <Example
          title={{ pt: 'Vertical', en: 'Vertical' }}
          description={{
            pt: 'Para páginas de configurações. As setas ↑/↓ substituem ←/→. Em telas estreitas a lista fica acima do painel.',
            en: 'For settings pages. ↑/↓ replace ←/→. On narrow screens the list sits above the panel.',
          }}
          code={VerticalCode}
        >
          <Vertical />
        </Example>
        <Example
          title={{ pt: 'Controlado com ativação manual', en: 'Controlled with manual activation' }}
          description={{
            pt: 'As setas só movem o foco; Enter ou Espaço carregam o período.',
            en: 'Arrow keys only move focus; Enter or Space loads the period.',
          }}
          code={ManualCode}
        >
          <Manual />
        </Example>
        <Example
          title={{ pt: 'Ajustadas à largura', en: 'Fitted' }}
          description={{
            pt: 'fitted divide a largura igualmente — bom para duas ou três abas em telas pequenas.',
            en: 'fitted splits the width equally — good for two or three tabs on small screens.',
          }}
          code={FittedCode}
        >
          <Fitted />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T pt='Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.' en='Durations and curves come from the motion tokens and drop to zero with prefers-reduced-motion: state is still conveyed by color, border or text.' />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Trocar de aba', en: 'Switching tabs' }, description: { pt: 'Um único indicador de 2px desliza até a aba ativa (translateX + scaleX) — medium (250ms), ease-spring. Na vertical, translateY + scaleY.', en: 'A single 2px indicator slides to the active tab (translateX + scaleX) — medium (250ms), ease-spring. Vertically, translateY + scaleY.' } },
            { term: { pt: 'Painel novo', en: 'New panel' }, description: { pt: 'Entra com fade + 4px de baixo para cima — medium, ease-out. Não anima na primeira renderização.', en: 'Enters with a fade + 4px upward — medium, ease-out. Does not animate on first render.' } },
            { term: { pt: 'Hover / foco em aba inativa', en: 'Hover / focus on an inactive tab' }, description: { pt: 'Prévia do sublinhado cresce da esquerda (scaleX) — medium, ease-out; cor do texto em fast (160ms).', en: 'An underline preview grows from the left (scaleX) — medium, ease-out; text color in fast (160ms).' } },
            { term: { pt: 'Enclosed: selecionar', en: 'Enclosed: select' }, description: { pt: 'O traço laranja do topo cresce de 0 a 2px (box-shadow) — medium, ease-spring; fundo e borda em fast.', en: 'The orange top stroke grows from 0 to 2px (box-shadow) — medium, ease-spring; background and border in fast.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Tabs', en: 'Tabs' }}
          rows={[
            { name: 'value', type: 'string', description: { pt: 'Aba selecionada (controlado).', en: 'Selected tab (controlled).' } },
            { name: 'defaultValue', type: 'string', default: '1ª aba habilitada', description: { pt: 'Aba inicial (não controlado).', en: 'Initial tab (uncontrolled).' } },
            { name: 'onChange', type: '(value: string) => void', description: { pt: 'Chamado ao selecionar outra aba.', en: 'Called when another tab is selected.' } },
            { name: 'activation', type: "'automatic' | 'manual'", default: "'automatic'", description: { pt: 'Seleciona ao focar (automatic) ou só com Enter/Espaço (manual).', en: 'Selects on focus (automatic) or only with Enter/Space (manual).' } },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: { pt: 'Orientação da lista e das setas.', en: 'List and arrow key orientation.' } },
            { name: 'variant', type: "'line' | 'enclosed'", default: "'line'", description: { pt: 'Estilo visual.', en: 'Visual style.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura das abas (32/40/48px).', en: 'Tab height (32/40/48px).' } },
            { name: 'fitted', type: 'boolean', default: 'false', description: { pt: 'Abas dividem a largura igualmente.', en: 'Tabs split the width equally.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'Tab', en: 'Tab' }}
          rows={[
            { name: 'value', type: 'string', required: true, description: { pt: 'Identificador; liga a aba ao painel.', en: 'Identifier; links the tab to its panel.' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone decorativo antes do rótulo.', en: 'Decorative icon before the label.' } },
            { name: 'badge', type: 'ReactNode', description: { pt: 'Contador após o rótulo.', en: 'Counter after the label.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita e pula a aba na navegação por setas.', en: 'Disables the tab and skips it in arrow navigation.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'TabList e TabPanel', en: 'TabList and TabPanel' }}
          rows={[
            { name: 'aria-label', type: 'string', required: true, description: { pt: 'TabList: nome do conjunto de abas (ou aria-labelledby).', en: 'TabList: name of the tab set (or aria-labelledby).' } },
            { name: 'value', type: 'string', required: true, description: { pt: 'TabPanel: value da aba correspondente.', en: 'TabPanel: value of the matching tab.' } },
            { name: 'keepMounted', type: 'boolean', default: 'false', description: { pt: 'TabPanel: mantém o conteúdo montado quando inativo.', en: 'TabPanel: keeps content mounted when inactive.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Segue o padrão <strong>Tabs</strong> do WAI-ARIA APG: <Code>role="tablist"</Code>, <Code>tab</Code> e <Code>tabpanel</Code>, com <Code>aria-selected</Code>, <Code>aria-controls</Code> e <Code>aria-labelledby</Code>. Apenas a aba selecionada fica na ordem de Tab (roving tabindex); o painel é focável para quem navega por teclado.</>}
            en={<>Follows the WAI-ARIA APG <strong>Tabs</strong> pattern: <Code>role="tablist"</Code>, <Code>tab</Code> and <Code>tabpanel</Code>, with <Code>aria-selected</Code>, <Code>aria-controls</Code> and <Code>aria-labelledby</Code>. Only the selected tab is in the Tab order (roving tabindex); the panel is focusable for keyboard users.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Entra na lista pela aba selecionada; o próximo Tab vai para o painel.', en: 'Enters the list at the selected tab; the next Tab goes to the panel.' } },
            { keys: ['→'], description: { pt: 'Horizontal: próxima aba (volta ao início no fim).', en: 'Horizontal: next tab (wraps around).' } },
            { keys: ['←'], description: { pt: 'Horizontal: aba anterior.', en: 'Horizontal: previous tab.' } },
            { keys: ['↓', '↑'], description: { pt: 'Vertical: próxima e anterior.', en: 'Vertical: next and previous.' } },
            { keys: ['Home'], description: { pt: 'Primeira aba habilitada.', en: 'First enabled tab.' } },
            { keys: ['End'], description: { pt: 'Última aba habilitada.', en: 'Last enabled tab.' } },
            { keys: ['Enter'], description: { pt: 'Ativação manual: seleciona a aba em foco.', en: 'Manual activation: selects the focused tab.' } },
            { keys: ['Space'], description: { pt: 'Ativação manual: seleciona a aba em foco.', en: 'Manual activation: selects the focused tab.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Relações entre abas e painéis expostas com papéis e atributos ARIA.', en: 'Tab/panel relationships exposed with ARIA roles and attributes.' } },
            { criterion: '1.4.1', description: { pt: 'A aba ativa é indicada pelo sublinhado (ou borda), não só pela cor do texto.', en: 'The active tab is indicated by the underline (or border), not only text color.' } },
            { criterion: '2.1.1', description: { pt: 'Todas as funções disponíveis por teclado, conforme o APG.', en: 'All functions available by keyboard, following the APG.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível dentro da aba e no painel.', en: 'Visible focus inside the tab and on the panel.' } },
            { criterion: '4.1.2', description: { pt: 'Estado selecionado exposto com aria-selected.', en: 'Selected state exposed with aria-selected.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
