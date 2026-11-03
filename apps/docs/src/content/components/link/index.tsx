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
import { Link } from '@orange/ui'
import External from './examples/External'
import ExternalCode from './examples/External?raw'
import Standalone from './examples/Standalone'
import StandaloneCode from './examples/Standalone?raw'
import Variants from './examples/Variants'
import VariantsCode from './examples/Variants?raw'
import WithRouter from './examples/WithRouter'
import WithRouterCode from './examples/WithRouter?raw'
import { meta } from './meta'

export default function LinkPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Links navegam; botões agem. Para salvar, enviar ou abrir um diálogo, use <strong>Button</strong>.
                </>
              ),
              en: (
                <>
                  Links navigate; buttons act. To save, submit or open a dialog, use <strong>Button</strong>.
                </>
              ),
            },
            {
              pt: 'O texto do link deve fazer sentido fora de contexto: descreva o destino, não "clique aqui" ou "saiba mais".',
              en: 'Link text must make sense out of context: describe the destination, not "click here" or "learn more".',
            },
            {
              pt: (
                <>
                  Marque links para outros sites com <Code>external</Code>: o ícone ↗ e o aviso "(abre em nova aba)" evitam surpresas.
                </>
              ),
              en: (
                <>
                  Mark links to other sites with <Code>external</Code>: the ↗ icon and the "(opens in a new tab)" notice avoid surprises.
                </>
              ),
            },
            {
              pt: 'Em texto corrido, mantenha o sublinhado — cor sozinha não basta para identificar um link (WCAG 1.4.1).',
              en: 'In running text, keep the underline — color alone is not enough to identify a link (WCAG 1.4.1).',
            },
          ]}
        />
        <DoDont
          doExample={
            <p style={{ margin: 0 }}>
              Veja o <Link href="#relatorio">relatório anual de 2025</Link>.
            </p>
          }
          dontExample={
            <p style={{ margin: 0 }}>
              Para ver o relatório anual, <Link href="#relatorio">clique aqui</Link>.
            </p>
          }
          doItems={[{ pt: 'Texto que descreve o destino.', en: 'Text that describes the destination.' }]}
          dontItems={[{ pt: '"Clique aqui" não diz para onde o link leva.', en: '"Click here" does not say where the link goes.' }]}
        />
      </Section>

      <Section title={{ pt: 'Variantes', en: 'Variants' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'default', en: 'default' },
              description: {
                pt: 'Links dentro de parágrafos. Sublinhado laranja com espaçamento; fica laranja no hover.',
                en: 'Links inside paragraphs. Orange, offset underline; turns orange on hover.',
              },
            },
            {
              term: { pt: 'subtle', en: 'subtle' },
              description: {
                pt: 'Rodapés, metadados e textos secundários. Cor atenuada e sublinhado discreto.',
                en: 'Footers, metadata and secondary text. Muted color and a discreet underline.',
              },
            },
            {
              term: { pt: 'standalone', en: 'standalone' },
              description: {
                pt: 'Links isolados (chamadas, listas de artigos). Sem sublinhado, com seta → que desliza no hover.',
                en: 'Standalone links (calls to action, article lists). No underline, with an → arrow that slides on hover.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Variantes', en: 'Variants' }} code={VariantsCode}>
          <Variants />
        </Example>
        <Example
          title={{ pt: 'Links isolados', en: 'Standalone links' }}
          description={{
            pt: 'Use standalone em listas de links e chamadas fora de um parágrafo.',
            en: 'Use standalone in link lists and calls to action outside a paragraph.',
          }}
          code={StandaloneCode}
        >
          <Standalone />
        </Example>
        <Example
          title={{ pt: 'Links externos', en: 'External links' }}
          description={{
            pt: 'external adiciona target="_blank", rel="noopener noreferrer", o ícone ↗ e o texto oculto "(abre em nova aba)".',
            en: 'external adds target="_blank", rel="noopener noreferrer", the ↗ icon and the hidden text "(opens in a new tab)".',
          }}
          code={ExternalCode}
        >
          <External />
        </Example>
        <Example
          title={{ pt: 'Com roteador', en: 'With a router' }}
          description={{
            pt: 'Passe o link do seu roteador em as; as demais props (como to) são repassadas a ele.',
            en: 'Pass your router link in as; the remaining props (such as to) are forwarded to it.',
          }}
          code={WithRouterCode}
        >
          <WithRouter />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'href', type: 'string', description: { pt: 'Destino do link.', en: 'Link destination.' } },
            {
              name: 'variant',
              type: "'default' | 'subtle' | 'standalone'",
              default: "'default'",
              description: { pt: 'Estilo visual.', en: 'Visual style.' },
            },
            {
              name: 'external',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Abre em nova aba com rel seguro, ícone ↗ e aviso para leitores de tela.',
                en: 'Opens in a new tab with a safe rel, ↗ icon and a screen reader notice.',
              },
            },
            {
              name: 'as',
              type: 'ElementType',
              default: "'a'",
              description: {
                pt: <>Componente renderizado — ex.: o <Code>Link</Code> do React Router ou do Next.js.</>,
                en: <>Rendered component — e.g. the React Router or Next.js <Code>Link</Code>.</>,
              },
            },
            {
              name: '...rest',
              type: 'AnchorHTMLAttributes',
              description: {
                pt: <>Atributos nativos de <Code>&lt;a&gt;</Code> ou props do componente em <Code>as</Code>.</>,
                en: <>Native <Code>&lt;a&gt;</Code> attributes or props of the <Code>as</Code> component.</>,
              },
            },
          ]}
        />
        <p>
          <T
            pt={<>Também exportado: <Code>linkClassName({'{ variant }'})</Code> para aplicar o estilo em outros elementos.</>}
            en={<>Also exported: <Code>linkClassName({'{ variant }'})</Code> to apply the style to other elements.</>}
          />
        </p>
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Renderiza um <Code>&lt;a href&gt;</Code> nativo, com papel, foco e teclado do navegador. Ícones são decorativos; em links externos o aviso de nova aba é texto oculto, incluído no nome acessível.</>}
            en={<>Renders a native <Code>&lt;a href&gt;</Code>, with the browser's role, focus and keyboard. Icons are decorative; on external links the new tab notice is hidden text included in the accessible name.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o link.', en: 'Moves focus to the link.' } },
            { keys: ['Enter'], description: { pt: 'Segue o link.', en: 'Follows the link.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.1', description: { pt: 'Links em texto são sublinhados, não apenas coloridos.', en: 'Links in text are underlined, not only colored.' } },
            { criterion: '2.4.4', description: { pt: 'O propósito do link é dado pelo próprio texto.', en: 'The link purpose is given by its own text.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno de 2px.', en: 'Visible focus with a 2px outline.' } },
            { criterion: '3.2.5', description: { pt: 'Links que abrem nova aba avisam antes, visualmente e para leitores de tela.', en: 'Links that open a new tab say so beforehand, visually and to screen readers.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
