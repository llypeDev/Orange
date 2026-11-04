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
import Excerpt from './examples/Excerpt'
import ExcerptCode from './examples/Excerpt?raw'
import Install from './examples/Install'
import InstallCode from './examples/Install?raw'
import LineHighlight from './examples/LineHighlight'
import LineHighlightCode from './examples/LineHighlight?raw'
import WrapAndHeight from './examples/WrapAndHeight'
import WrapAndHeightCode from './examples/WrapAndHeight?raw'
import Steps from './examples/Steps'
import StepsCode from './examples/Steps?raw'
import { meta } from './meta'

export default function CodeBlockPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para trechos que a pessoa vai ler ou copiar: comandos de instalação, exemplos de configuração, payloads de API.',
              en: 'Use it for snippets people will read or copy: install commands, configuration examples, API payloads.',
            },
            {
              pt: (
                <>
                  Informe <strong>language</strong> ou <strong>title</strong> (nome do arquivo): eles aparecem no cabeçalho e
                  dão nome à área de código para leitores de tela.
                </>
              ),
              en: (
                <>
                  Set <strong>language</strong> or <strong>title</strong> (file name): they appear in the header and name the
                  code area for screen readers.
                </>
              ),
            },
            {
              pt: 'Destaque só as linhas que o texto ao redor explica. O destaque é um reforço visual; diga em palavras o que mudou.',
              en: 'Only highlight the lines the surrounding text explains. Highlighting is a visual aid; say in words what changed.',
            },
            {
              pt: (
                <>
                  Para código inline numa frase, use <Code>&lt;code&gt;</Code>. O CodeBlock não faz realce de sintaxe — mantém a
                  biblioteca leve e funciona com qualquer linguagem.
                </>
              ),
              en: (
                <>
                  For inline code inside a sentence, use <Code>&lt;code&gt;</Code>. CodeBlock does no syntax highlighting — it
                  keeps the library light and works with any language.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Cabeçalho', en: 'Header' },
              description: {
                pt: 'Nome do arquivo (mono) e linguagem (eyebrow) à esquerda; botão Copiar à direita.',
                en: 'File name (mono) and language (eyebrow) on the left; Copy button on the right.',
              },
            },
            {
              term: { pt: 'Área de código', en: 'Code area' },
              description: {
                pt: 'Um <pre> focável que rola na horizontal (ou quebra linhas com wrap) e na vertical com maxHeight.',
                en: 'A focusable <pre> that scrolls horizontally (or wraps lines with wrap) and vertically with maxHeight.',
              },
            },
            {
              term: { pt: 'Numeração', en: 'Line numbers' },
              description: {
                pt: 'Gerada por CSS: não é copiada nem lida por leitores de tela.',
                en: 'Generated with CSS: never copied nor read by screen readers.',
              },
            },
            {
              term: { pt: 'Linha destacada', en: 'Highlighted line' },
              description: {
                pt: 'Um <mark> com fundo laranja sutil e faixa laranja de 3px à esquerda.',
                en: 'A <mark> with a subtle orange background and a 3px orange bar on the left.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Comando de instalação', en: 'Install command' }}
          description={{
            pt: 'O botão Copiar copia o código sem quebras de linha finais e anuncia "Copiado!".',
            en: 'The Copy button copies the code without trailing line breaks and announces "Copied!".',
          }}
          code={InstallCode}
        >
          <Install />
        </Example>
        <Example
          title={{ pt: 'Numeração e linhas destacadas', en: 'Line numbers and highlighted lines' }}
          description={{
            pt: 'highlightLines recebe os números exibidos das linhas.',
            en: 'highlightLines takes the displayed line numbers.',
          }}
          code={LineHighlightCode}
        >
          <LineHighlight />
        </Example>
        <Example
          title={{ pt: 'Trecho de um arquivo maior', en: 'Excerpt from a larger file' }}
          description={{
            pt: 'startingLineNumber mantém a numeração do arquivo original — o destaque usa os mesmos números.',
            en: 'startingLineNumber keeps the original file numbering — highlighting uses the same numbers.',
          }}
          code={ExcerptCode}
        >
          <Excerpt />
        </Example>
        <Example
          title={{ pt: 'Quebra de linha e altura máxima', en: 'Wrapping and max height' }}
          description={{
            pt: 'wrap quebra linhas longas (útil para JSON e logs); maxHeight limita a altura e ativa a rolagem.',
            en: 'wrap breaks long lines (useful for JSON and logs); maxHeight caps the height and enables scrolling.',
          }}
          code={WrapAndHeightCode}
        >
          <WrapAndHeight />
        </Example>
        <Example
          title={{ pt: 'Destaque passo a passo', en: 'Step-by-step highlight' }}
          description={{ pt: 'Mudar highlightLines faz o destaque deslizar suavemente entre as linhas.', en: 'Changing highlightLines smoothly moves the highlight between lines.' }}
          code={StepsCode}
        >
          <Steps />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'code', type: 'string', required: true, description: { pt: 'Código exibido. Quebras de linha finais são removidas.', en: 'Code to display. Trailing line breaks are removed.' } },
            { name: 'language', type: 'string', description: { pt: 'Linguagem exibida no cabeçalho (tsx, bash, json…).', en: 'Language shown in the header (tsx, bash, json…).' } },
            { name: 'title', type: 'string', description: { pt: 'Nome do arquivo ou título do trecho.', en: 'File name or snippet title.' } },
            { name: 'showLineNumbers', type: 'boolean', default: 'false', description: { pt: 'Mostra a numeração das linhas.', en: 'Shows line numbers.' } },
            { name: 'startingLineNumber', type: 'number', default: '1', description: { pt: 'Número da primeira linha.', en: 'Number of the first line.' } },
            { name: 'highlightLines', type: 'number[]', description: { pt: 'Linhas destacadas, pelo número exibido.', en: 'Highlighted lines, by displayed number.' } },
            { name: 'wrap', type: 'boolean', default: 'false', description: { pt: 'Quebra linhas longas em vez de rolar.', en: 'Wraps long lines instead of scrolling.' } },
            { name: 'maxHeight', type: 'number | string', description: { pt: 'Altura máxima da área de código.', en: 'Max height of the code area.' } },
            { name: 'copyable', type: 'boolean', default: 'true', description: { pt: 'Mostra o botão Copiar.', en: 'Shows the Copy button.' } },
            { name: 'onCopy', type: '(code: string) => void', description: { pt: 'Chamado depois de copiar com sucesso.', en: 'Called after a successful copy.' } },
            { name: 'codeLabel', type: 'string', description: { pt: <>Nome acessível da área de código. Padrão: <Code>Código: {'{title ou language}'}</Code>.</>, en: <>Accessible name of the code area. Default: <Code>Code: {'{title or language}'}</Code>.</> } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos do contêiner.', en: 'Container attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Copiar', en: 'Copy' }, description: { pt: 'O ícone troca para um check que "salta" (escala 0.6 → 1) — 250ms, ease-bounce; ao voltar, o ícone de copiar surge com fade de 160ms. "Copiado!" continua anunciado pela região de status.', en: 'The icon swaps to a check that pops (scale 0.6 → 1) — 250ms, ease-bounce; on return, the copy icon fades in over 160ms. "Copied!" is still announced by the status region.' } },
            { term: { pt: 'Botão Copiar', en: 'Copy button' }, description: { pt: 'Hover e foco: borda e cor em 160ms; pressionar afunda 1px (90ms).', en: 'Hover and focus: border and color in 160ms; pressing sinks it 1px (90ms).' } },
            { term: { pt: 'Linhas destacadas', en: 'Highlighted lines' }, description: { pt: 'Fundo e faixa laranja transicionam quando highlightLines muda — 250ms, ease-out.', en: 'Background and orange bar transition when highlightLines changes — 250ms, ease-out.' } },
            { term: { pt: 'Hover na linha', en: 'Line hover' }, description: { pt: 'O número da linha clareia — 160ms.', en: 'The line number brightens — 160ms.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                A área de código é um <Code>&lt;pre tabindex="0" role="group"&gt;</Code> com nome acessível, para que quem usa
                teclado consiga rolar trechos longos. A numeração fica fora da árvore de acessibilidade e as linhas destacadas
                usam <Code>&lt;mark&gt;</Code>. Ao copiar, uma região <Code>role="status"</Code> anuncia "Copiado!".
              </>
            }
            en={
              <>
                The code area is a <Code>&lt;pre tabindex="0" role="group"&gt;</Code> with an accessible name, so keyboard users
                can scroll long snippets. Line numbers stay out of the accessibility tree and highlighted lines use{' '}
                <Code>&lt;mark&gt;</Code>. On copy, a <Code>role="status"</Code> region announces "Copied!".
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o botão Copiar e depois para a área de código.', en: 'Moves focus to the Copy button, then to the code area.' } },
            { keys: ['Enter'], description: { pt: 'No botão, copia o código.', en: 'On the button, copies the code.' } },
            { keys: ['←', '→', '↑', '↓'], description: { pt: 'Na área de código focada, rola o conteúdo.', en: 'On the focused code area, scrolls the content.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Linhas destacadas são <mark>; numeração é aria-hidden e não entra no texto copiado.', en: 'Highlighted lines are <mark>; line numbers are aria-hidden and excluded from copied text.' } },
            { criterion: '1.4.3', description: { pt: 'Texto claro sobre fundo escuro nos dois temas, com contraste acima de 4.5:1.', en: 'Light text on a dark background in both themes, above 4.5:1 contrast.' } },
            { criterion: '2.1.1', description: { pt: 'A área rolável é focável e pode ser rolada pelo teclado.', en: 'The scrollable area is focusable and keyboard-scrollable.' } },
            { criterion: '4.1.3', description: { pt: 'A confirmação de cópia é anunciada por uma região de status.', en: 'Copy confirmation is announced through a status region.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
