import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Details from './examples/Details'
import DetailsCode from './examples/Details?raw'
import Filters from './examples/Filters'
import FiltersCode from './examples/Filters?raw'
import Placements from './examples/Placements'
import PlacementsCode from './examples/Placements?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import { meta } from './meta'

export default function DrawerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use o Drawer para tarefas de apoio que não exigem sair da página: filtros, edição rápida, detalhes de um item da lista, configurações de uma seção.',
              en: 'Use a Drawer for supporting tasks that do not require leaving the page: filters, quick edits, details of a list item, section settings.',
            },
            {
              pt: 'Para uma decisão curta e urgente, prefira o Modal; para fluxos longos com várias etapas, uma página própria.',
              en: 'For a short, urgent decision, prefer a Modal; for long multi-step flows, a dedicated page.',
            },
            {
              pt: (
                <>
                  Coloque as ações em <Code>footer</Code>: ele fica fixo enquanto o conteúdo rola, e a ação principal fica à direita.
                </>
              ),
              en: (
                <>
                  Put actions in <Code>footer</Code>: it stays fixed while the content scrolls, with the main action on the right.
                </>
              ),
            },
            {
              pt: 'Mantenha a direção consistente no produto: detalhes e edição pela direita, navegação pela esquerda, folhas de ação por baixo no celular.',
              en: 'Keep the direction consistent across the product: details and editing from the right, navigation from the left, action sheets from the bottom on mobile.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Filtros', en: 'Filters' }}
          description={{
            pt: (
              <>
                Painel à direita (padrão) com rodapé fixo. <Code>footer</Code> e <Code>children</Code> aceitam funções que
                recebem <Code>close</Code>.
              </>
            ),
            en: (
              <>
                Right panel (default) with a fixed footer. <Code>footer</Code> and <Code>children</Code> accept functions that
                receive <Code>close</Code>.
              </>
            ),
          }}
          code={FiltersCode}
        >
          <Filters />
        </Example>
        <Example
          title={{ pt: 'Posições', en: 'Placements' }}
          description={{ pt: 'left, right e bottom — cada uma com sua animação de deslizar.', en: 'left, right and bottom — each with its own slide animation.' }}
          code={PlacementsCode}
        >
          <Placements />
        </Example>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{
            pt: 'Nas laterais, size define a largura; na posição inferior, a altura máxima (40%, 60%, 85% ou 100%).',
            en: 'On the sides, size sets the width; at the bottom, the maximum height (40%, 60%, 85% or 100%).',
          }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Detalhes de um item', en: 'Item details' }}
          description={{
            pt: 'Leitura rápida de um registro da lista com uma ação contextual no rodapé.',
            en: 'Quick read of a list record with a contextual action in the footer.',
          }}
          code={DetailsCode}
        >
          <Details />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: { pt: 'Título visível; nomeia o painel.', en: 'Visible title; names the panel.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio sob o título (aria-describedby).', en: 'Supporting text under the title (aria-describedby).' } },
            { name: 'placement', type: "'left' | 'right' | 'bottom'", default: "'right'", description: { pt: 'Borda de onde o painel desliza.', en: 'Edge the panel slides from.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: { pt: 'Largura (laterais) ou altura máxima (inferior).', en: 'Width (sides) or max height (bottom).' } },
            { name: 'footer', type: 'ReactNode | ({ close }) => ReactNode', description: { pt: 'Rodapé fixo com ações.', en: 'Fixed footer with actions.' } },
            { name: 'children', type: 'ReactNode | ({ close }) => ReactNode', description: { pt: 'Conteúdo rolável.', en: 'Scrollable content.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: 'trigger', type: 'ReactElement', description: { pt: 'Elemento que abre o painel.', en: 'Element that opens the panel.' } },
            { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: { pt: 'Elemento focado ao abrir. Padrão: primeiro focável.', en: 'Element focused on open. Default: first focusable.' } },
            { name: 'finalFocus', type: 'RefObject<HTMLElement>', description: { pt: 'Elemento focado ao fechar. Padrão: quem abriu.', en: 'Element focused on close. Default: the opener.' } },
            { name: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: { pt: 'Fecha ao clicar no fundo.', en: 'Closes on overlay click.' } },
            { name: 'closeOnEscape', type: 'boolean', default: 'true', description: { pt: 'Fecha com Escape.', en: 'Closes with Escape.' } },
            { name: 'hideCloseButton', type: 'boolean', default: 'false', description: { pt: 'Esconde o botão fechar.', en: 'Hides the close button.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Repassados ao painel (role="dialog").', en: 'Passed to the panel (role="dialog").' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O Drawer é um diálogo modal (padrão <em>Dialog (Modal)</em> do APG): <Code>role="dialog"</Code>,{' '}
                <Code>aria-modal="true"</Code>, nome pelo título e o mesmo comportamento do Modal — foco preso, scroll da página
                bloqueado, Escape fecha e o foco volta para quem abriu. A animação de deslizar é desligada para quem prefere
                movimento reduzido.
              </>
            }
            en={
              <>
                The Drawer is a modal dialog (APG <em>Dialog (Modal)</em> pattern): <Code>role="dialog"</Code>,{' '}
                <Code>aria-modal="true"</Code>, named by the title and with the same behavior as Modal — trapped focus, locked page
                scroll, Escape closes and focus returns to the opener. The slide animation is turned off for people who prefer
                reduced motion.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Próximo elemento dentro do painel; do último volta ao primeiro.', en: 'Next element inside the panel; wraps from last to first.' } },
            { keys: ['Shift', 'Tab'], description: { pt: 'Elemento anterior dentro do painel.', en: 'Previous element inside the panel.' } },
            { keys: ['Esc'], description: { pt: 'Fecha o painel e devolve o foco.', en: 'Closes the panel and returns focus.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Título e descrição ligados ao painel por ARIA.', en: 'Title and description linked to the panel through ARIA.' } },
            { criterion: '2.1.2', description: { pt: 'Escape e o botão Fechar sempre saem do painel.', en: 'Escape and the Close button always leave the panel.' } },
            { criterion: '2.3.3', description: { pt: 'Animação de deslizar desativada com prefers-reduced-motion.', en: 'Slide animation disabled with prefers-reduced-motion.' } },
            { criterion: '2.4.3', description: { pt: 'Foco entra no painel ao abrir e volta ao gatilho ao fechar.', en: 'Focus enters the panel on open and returns to the trigger on close.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
