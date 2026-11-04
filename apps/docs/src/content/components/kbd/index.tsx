import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Combinations from './examples/Combinations'
import CombinationsCode from './examples/Combinations?raw'
import InText from './examples/InText'
import InTextCode from './examples/InText?raw'
import MacSymbols from './examples/MacSymbols'
import MacSymbolsCode from './examples/MacSymbols?raw'
import ShortcutList from './examples/ShortcutList'
import ShortcutListCode from './examples/ShortcutList?raw'
import Pressed from './examples/Pressed'
import PressedCode from './examples/Pressed?raw'
import { meta } from './meta'

export default function KbdPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use Kbd para ensinar atalhos em textos de ajuda, menus, dicas e listas de atalhos — não como botão.',
              en: 'Use Kbd to teach shortcuts in help text, menus, tooltips and shortcut lists — not as a button.',
            },
            {
              pt: (
                <>
                  Prefira <Code>keys</Code> a escrever "Ctrl+K" à mão: cada tecla vira um <Code>&lt;kbd&gt;</Code> e o
                  leitor de tela entende a combinação.
                </>
              ),
              en: (
                <>
                  Prefer <Code>keys</Code> over typing "Ctrl+K" by hand: each key becomes a <Code>&lt;kbd&gt;</Code> and
                  screen readers understand the combination.
                </>
              ),
            },
            {
              pt: (
                <>
                  Mostre o atalho do sistema do usuário. Use <Code>Mod</Code> (Ctrl ou ⌘) com <Code>symbols</Code>{' '}
                  para alternar entre Windows/Linux e macOS.
                </>
              ),
              en: (
                <>
                  Show the shortcut for the user's system. Use <Code>Mod</Code> (Ctrl or ⌘) with <Code>symbols</Code>{' '}
                  to switch between Windows/Linux and macOS.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Teclas reconhecidas', en: 'Recognized keys' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Mod', en: 'Mod' }, description: { pt: 'Ctrl — ou ⌘ (Command) com symbols.', en: 'Ctrl — or ⌘ (Command) with symbols.' } },
            { term: { pt: 'Meta, Cmd', en: 'Meta, Cmd' }, description: { pt: 'Cmd — ou ⌘ (Command).', en: 'Cmd — or ⌘ (Command).' } },
            { term: { pt: 'Ctrl, Alt, Shift', en: 'Ctrl, Alt, Shift' }, description: { pt: 'Com symbols: ⌃ (Control), ⌥ (Option), ⇧ (Shift).', en: 'With symbols: ⌃ (Control), ⌥ (Option), ⇧ (Shift).' } },
            { term: { pt: 'Enter, Backspace, Delete, Tab', en: 'Enter, Backspace, Delete, Tab' }, description: { pt: 'Com symbols: ↵ ⌫ ⌦ ⇥.', en: 'With symbols: ↵ ⌫ ⌦ ⇥.' } },
            { term: { pt: 'ArrowUp, ArrowDown, ArrowLeft, ArrowRight', en: 'ArrowUp, ArrowDown, ArrowLeft, ArrowRight' }, description: { pt: 'Sempre setas (↑ ↓ ← →), com nome traduzido ("Seta para cima").', en: 'Always arrows (↑ ↓ ← →), with a translated name ("Up arrow").' } },
            { term: { pt: 'Esc, Space', en: 'Esc, Space' }, description: { pt: 'Esc e "Espaço"/"Space" conforme o idioma.', en: 'Esc and "Espaço"/"Space" depending on the locale.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'No texto', en: 'In text' }}
          description={{
            pt: 'Kbd acompanha a linha de base do texto. Teclas simples podem ser passadas como children.',
            en: 'Kbd follows the text baseline. Single keys can be passed as children.',
          }}
          code={InTextCode}
        >
          <InText />
        </Example>
        <Example
          title={{ pt: 'Combinações', en: 'Combinations' }}
          description={{
            pt: 'keys gera um <kbd> por tecla, com "+" entre elas. separator troca o separador; size="sm" para espaços apertados.',
            en: 'keys renders one <kbd> per key, with "+" between them. separator changes it; size="sm" for tight spaces.',
          }}
          code={CombinationsCode}
          align="center"
        >
          <Combinations />
        </Example>
        <Example
          title={{ pt: 'Símbolos do macOS', en: 'macOS symbols' }}
          description={{
            pt: 'Com symbols, modificadores viram ⌘ ⌥ ⇧ ⌃. Cada símbolo tem o nome da tecla em texto oculto e no title.',
            en: 'With symbols, modifiers become ⌘ ⌥ ⇧ ⌃. Each symbol has the key name as hidden text and in its title.',
          }}
          code={MacSymbolsCode}
          align="center"
        >
          <MacSymbols />
        </Example>
        <Example
          title={{ pt: 'Teclas pressionadas', en: 'Pressed keys' }}
          description={{
            pt: 'pressed aceita true ou uma lista de teclas. Clique no campo e pressione Shift + N: cada tecla afunda enquanto está pressionada.',
            en: 'pressed takes true or a list of keys. Click the field and press Shift + N: each key sinks while it is held.',
          }}
          code={PressedCode}
        >
          <Pressed />
        </Example>
        <Example
          title={{ pt: 'Lista de atalhos', en: 'Shortcut list' }}
          description={{
            pt: 'Uma tabela de atalhos que alterna entre Windows/Linux e macOS com o mesmo array de teclas.',
            en: 'A shortcut table that switches between Windows/Linux and macOS with the same key array.',
          }}
          code={ShortcutListCode}
        >
          <ShortcutList />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'pressed', en: 'pressed' }, description: { pt: 'A tecla desce 1px e a sombra inferior some (a borda de 2px vira 1px), com fundo laranja suave. --or-duration-press (90ms).', en: 'The key moves down 1px and its bottom shadow disappears (the 2px edge becomes 1px), with a soft orange fill. --or-duration-press (90ms).' } },
            { term: { pt: 'Soltar', en: 'Release' }, description: { pt: 'Volta à posição com --or-ease-bounce em --or-duration-fast (160ms).', en: 'Returns into place with --or-ease-bounce in --or-duration-fast (160ms).' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'keys', type: 'string[]', description: { pt: 'Combinação de teclas. Sem keys, renderiza children como uma tecla.', en: 'Key combination. Without keys, renders children as one key.' } },
            { name: 'separator', type: 'ReactNode', default: "'+'", description: { pt: <>Separador visual entre teclas. Use <Code>""</Code> para nenhum.</>, en: <>Visual separator between keys. Use <Code>""</Code> for none.</> } },
            { name: 'symbols', type: 'boolean', default: 'false', description: { pt: 'Símbolos do macOS para modificadores.', en: 'macOS symbols for modifiers.' } },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: { pt: 'Altura de 20 ou 24px.', en: '20 or 24px height.' } },
            { name: 'pressed', type: 'boolean | string[]', default: 'false', description: { pt: 'Teclas exibidas como pressionadas (todas ou as listadas).', en: 'Keys shown as pressed (all or the listed ones).' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: { pt: 'Atributos nativos do <kbd> raiz.', en: 'Native attributes of the root <kbd>.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue a recomendação do HTML para entradas de teclado: a combinação é um <Code>&lt;kbd&gt;</Code> que
                contém um <Code>&lt;kbd&gt;</Code> por tecla. Símbolos como ⌘ não têm pronúncia confiável, então o
                símbolo fica oculto (<Code>aria-hidden</Code>) e o nome da tecla ("Command") é lido no lugar. Nomes de
                setas e da barra de espaço vêm de <Code>useLocale().t()</Code>.
              </>
            }
            en={
              <>
                Follows the HTML recommendation for keyboard input: the combination is a <Code>&lt;kbd&gt;</Code>{' '}
                containing one <Code>&lt;kbd&gt;</Code> per key. Symbols like ⌘ have no reliable pronunciation, so the
                symbol is hidden (<Code>aria-hidden</Code>) and the key name ("Command") is read instead. Arrow and space
                bar names come from <Code>useLocale().t()</Code>.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.1.1', description: { pt: 'Símbolos têm alternativa em texto.', en: 'Symbols have a text alternative.' } },
            { criterion: '1.3.1', description: { pt: 'Semântica de entrada de teclado com <kbd> aninhados.', en: 'Keyboard input semantics with nested <kbd>.' } },
            { criterion: '1.4.3', description: { pt: 'Contraste de texto mínimo de 4.5:1 nos dois temas.', en: 'Minimum 4.5:1 text contrast in both themes.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
