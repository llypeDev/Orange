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
import Navigation from './examples/Navigation'
import NavigationCode from './examples/Navigation?raw'
import { meta } from './meta'

export default function CommandPalettePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'A paleta acelera quem já conhece o produto; ela não substitui a navegação visível. Todo comando deve existir também em algum lugar da interface.',
              en: 'The palette speeds up people who already know the product; it does not replace visible navigation. Every command should also exist somewhere in the UI.',
            },
            {
              pt: 'Escreva comandos como ações ("Criar projeto", "Ir para relatórios") e agrupe por intenção: navegar, criar, configurar.',
              en: 'Write commands as actions ("Create project", "Go to reports") and group them by intent: navigate, create, configure.',
            },
            {
              pt: (
                <>
                  Use <Code>keywords</Code> para sinônimos ("equipe", "time", "membros") e <Code>description</Code> para
                  desambiguar comandos parecidos. A busca ignora acentos e caixa.
                </>
              ),
              en: (
                <>
                  Use <Code>keywords</Code> for synonyms ("team", "members") and <Code>description</Code> to disambiguate similar
                  commands. Search ignores accents and case.
                </>
              ),
            },
            {
              pt: (
                <>
                  Registre o atalho global (<Code>hotkey="mod+k"</Code>) em apenas uma paleta por página e mostre-o no gatilho.
                </>
              ),
              en: (
                <>
                  Register the global shortcut (<Code>hotkey="mod+k"</Code>) on a single palette per page and show it on the
                  trigger.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Paleta de comandos', en: 'Command palette' }}
          description={{
            pt: 'Clique no botão ou use Ctrl+K / ⌘K. Digite para filtrar, ↑/↓ para escolher e Enter para executar.',
            en: 'Click the button or press Ctrl+K / ⌘K. Type to filter, ↑/↓ to choose and Enter to run.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Ir para um registro', en: 'Jump to a record' }}
          description={{
            pt: (
              <>
                Um grupo só, com <Code>label</Code>, <Code>placeholder</Code> e <Code>emptyMessage</Code> personalizados. Busque
                sem acentos.
              </>
            ),
            en: (
              <>
                A single group, with custom <Code>label</Code>, <Code>placeholder</Code> and <Code>emptyMessage</Code>. Search
                without accents.
              </>
            ),
          }}
          code={NavigationCode}
        >
          <Navigation />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Abrir', en: 'Open' }, description: { pt: 'Desce 8px com escala 0,98 → 1 em ~200ms (média entre --or-duration-fast e --or-duration-medium), --or-ease-out; fundo em fade.', en: 'Drops 8px with 0.98 → 1 scale in ~200ms (between --or-duration-fast and --or-duration-medium), --or-ease-out; overlay fades in.' } },
            { term: { pt: 'Fechar', en: 'Close' }, description: { pt: 'Sobe 4px e some. 160ms, --or-ease-in-out.', en: 'Rises 4px and fades. 160ms, --or-ease-in-out.' } },
            { term: { pt: 'Item ativo', en: 'Active item' }, description: { pt: 'Um único destaque desliza até a opção ativa (setas ou ponteiro). 160ms, --or-ease-out. Na abertura ele já aparece no lugar.', en: 'A single highlight slides to the active option (arrows or pointer). 160ms, --or-ease-out. On open it appears in place.' } },
            { term: { pt: 'Filtrar', en: 'Filtering' }, description: { pt: 'Só as opções que reaparecem entram com fade de 160ms; as que continuam na lista não reanimam a cada tecla.', en: 'Only options that reappear fade in over 160ms; those that stay in the list do not re-animate on every keystroke.' } },
            { term: { pt: 'Campo de busca', en: 'Search field' }, description: { pt: 'Sublinhado laranja surge no foco em 160ms.', en: 'Orange underline appears on focus in 160ms.' } },
            { term: { pt: 'prefers-reduced-motion', en: 'prefers-reduced-motion' }, description: { pt: 'Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.', en: 'Durations and distances drop to zero: the component appears and disappears instantly, with no movement.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'CommandPalette', en: 'CommandPalette' }}
          rows={[
            { name: 'groups', type: 'CommandGroup[]', required: true, description: { pt: 'Comandos agrupados: { label, items }.', en: 'Grouped commands: { label, items }.' } },
            { name: 'hotkey', type: 'string', description: { pt: "Atalho global que abre/fecha: 'mod+k' (⌘K no Mac, Ctrl+K nos demais).", en: "Global shortcut that toggles it: 'mod+k' (⌘K on Mac, Ctrl+K elsewhere)." } },
            { name: 'placeholder', type: 'string', default: "t('searchPlaceholder')", description: { pt: 'Texto de exemplo da busca.', en: 'Search placeholder.' } },
            { name: 'label', type: 'string', default: "t('commandPalette')", description: { pt: 'Nome acessível do diálogo e da lista.', en: 'Accessible name of the dialog and list.' } },
            { name: 'emptyMessage', type: 'ReactNode', default: "t('noResults')", description: { pt: 'Mensagem sem resultados.', en: 'Message when nothing matches.' } },
            { name: 'onSelect', type: '(item: CommandItem) => void', description: { pt: 'Chamado com o comando escolhido.', en: 'Called with the chosen command.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: 'trigger', type: 'ReactElement', description: { pt: 'Elemento que abre a paleta.', en: 'Element that opens the palette.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'CommandItem', en: 'CommandItem' }}
          rows={[
            { name: 'id', type: 'string', required: true, description: { pt: 'Identificador único na paleta.', en: 'Unique identifier in the palette.' } },
            { name: 'label', type: 'string', required: true, description: { pt: 'Nome do comando.', en: 'Command name.' } },
            { name: 'description', type: 'string', description: { pt: 'Detalhe abaixo do rótulo (também pesquisável).', en: 'Detail under the label (also searchable).' } },
            { name: 'icon', type: 'IconName | ReactElement', description: { pt: 'Ícone à esquerda.', en: 'Leading icon.' } },
            { name: 'shortcut', type: 'string | string[]', description: { pt: "Atalho exibido: 'G P' ou ['⌘', 'N'].", en: "Displayed shortcut: 'G P' or ['⌘', 'N']." } },
            { name: 'keywords', type: 'string[]', description: { pt: 'Sinônimos para a busca.', en: 'Search synonyms.' } },
            { name: 'disabled', type: 'boolean', description: { pt: 'Exibido, mas não pode ser escolhido.', en: 'Shown but cannot be chosen.' } },
            { name: 'onSelect', type: '() => void', description: { pt: 'Executado depois que a paleta fecha.', en: 'Runs after the palette closes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                É um diálogo modal com um campo <Code>role="combobox"</Code> (padrão <em>Combobox</em> do APG) que controla uma{' '}
                <Code>role="listbox"</Code> com grupos rotulados. O foco fica no campo; o item ativo é indicado por{' '}
                <Code>aria-activedescendant</Code> e <Code>aria-selected</Code>. A quantidade de resultados é anunciada numa
                região de status e, ao executar um comando, o foco volta para onde estava antes de abrir.
              </>
            }
            en={
              <>
                It is a modal dialog with a <Code>role="combobox"</Code> field (APG <em>Combobox</em> pattern) controlling a{' '}
                <Code>role="listbox"</Code> with labelled groups. Focus stays in the field; the active item is conveyed by{' '}
                <Code>aria-activedescendant</Code> and <Code>aria-selected</Code>. The number of results is announced in a status
                region and, when a command runs, focus returns to where it was before opening.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Ctrl', 'K'], description: { pt: 'Abre ou fecha a paleta (⌘K no Mac), quando hotkey="mod+k".', en: 'Opens or closes the palette (⌘K on Mac), when hotkey="mod+k".' } },
            { keys: ['↓'], description: { pt: 'Próximo comando (circula, pulando desabilitados).', en: 'Next command (wraps, skipping disabled ones).' } },
            { keys: ['↑'], description: { pt: 'Comando anterior.', en: 'Previous command.' } },
            { keys: ['Page Down'], description: { pt: 'Último comando.', en: 'Last command.' } },
            { keys: ['Page Up'], description: { pt: 'Primeiro comando.', en: 'First command.' } },
            { keys: ['Enter'], description: { pt: 'Executa o comando ativo.', en: 'Runs the active command.' } },
            { keys: ['Esc'], description: { pt: 'Fecha e devolve o foco.', en: 'Closes and returns focus.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Grupos rotulados e descrições ligadas a cada opção.', en: 'Labelled groups and descriptions linked to each option.' } },
            { criterion: '2.1.1', description: { pt: 'Busca, navegação e execução inteiramente pelo teclado.', en: 'Search, navigation and execution entirely by keyboard.' } },
            { criterion: '2.1.4', description: { pt: 'O atalho global usa modificador (Ctrl/⌘), sem atalhos de uma tecla só.', en: 'The global shortcut uses a modifier (Ctrl/⌘), no single-key shortcuts.' } },
            { criterion: '4.1.2', description: { pt: 'combobox com aria-expanded, aria-controls e aria-activedescendant.', en: 'combobox with aria-expanded, aria-controls and aria-activedescendant.' } },
            { criterion: '4.1.3', description: { pt: 'Total de resultados e "nenhum resultado" anunciados em região de status.', en: 'Result count and "no results" announced in a status region.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
