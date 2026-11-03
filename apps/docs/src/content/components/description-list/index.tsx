import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Composed from './examples/Composed'
import ComposedCode from './examples/Composed?raw'
import Grid from './examples/Grid'
import GridCode from './examples/Grid?raw'
import Horizontal from './examples/Horizontal'
import HorizontalCode from './examples/Horizontal?raw'
import Vertical from './examples/Vertical'
import VerticalCode from './examples/Vertical?raw'
import { meta } from './meta'

export default function DescriptionListPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para pares rótulo/valor somente leitura: detalhes de um pedido, especificações, dados de uma assinatura.',
              en: 'Use it for read-only label/value pairs: order details, specs, subscription data.',
            },
            {
              pt: 'Termos curtos e substantivos ("Vencimento", não "Data em que a fatura vence"). O valor é o que a pessoa procura — deixe-o em destaque.',
              en: 'Short, noun-based terms ("Due date", not "Date the invoice is due"). The value is what people look for — keep it prominent.',
            },
            {
              pt: (
                <>
                  O layout <strong>horizontal</strong> funciona para listas de detalhes; <strong>vertical</strong> para colunas
                  estreitas; <strong>grid</strong> para indicadores lado a lado.
                </>
              ),
              en: (
                <>
                  The <strong>horizontal</strong> layout suits detail lists; <strong>vertical</strong> fits narrow columns;{' '}
                  <strong>grid</strong> works for side-by-side indicators.
                </>
              ),
            },
            {
              pt: 'Para dados comparáveis em várias linhas e colunas, use Table.',
              en: 'For data compared across rows and columns, use Table.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Layouts', en: 'Layouts' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'horizontal', en: 'horizontal' }, description: { pt: 'Termo à esquerda (largura em termWidth) e valor à direita, com linhas de 1px. Empilha em telas estreitas.', en: 'Term on the left (width set by termWidth) and value on the right, with 1px rules. Stacks on narrow screens.' } },
            { term: { pt: 'vertical', en: 'vertical' }, description: { pt: 'Termo acima do valor.', en: 'Term above the value.' } },
            { term: { pt: 'grid', en: 'grid' }, description: { pt: 'Células com bordas de 1px em colunas responsivas; valores em Space Grotesk.', en: 'Cells with 1px borders in responsive columns; values in Space Grotesk.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Horizontal', en: 'Horizontal' }}
          description={{
            pt: 'Um termo pode ter vários valores: passe um array em description.',
            en: 'A term can have several values: pass an array as description.',
          }}
          code={HorizontalCode}
        >
          <Horizontal />
        </Example>
        <Example title={{ pt: 'Vertical', en: 'Vertical' }} code={VerticalCode}>
          <Vertical />
        </Example>
        <Example
          title={{ pt: 'Grade de indicadores', en: 'Indicator grid' }}
          description={{
            pt: 'columns define o máximo de colunas; em contêineres estreitos, as células se reorganizam.',
            en: 'columns sets the maximum column count; in narrow containers, cells reflow.',
          }}
          code={GridCode}
        >
          <Grid />
        </Example>
        <Example
          title={{ pt: 'Composição e termos em negrito', en: 'Composition and bold terms' }}
          description={{
            pt: 'Componha com DescriptionGroup, DescriptionTerm e DescriptionDetails quando os valores tiverem marcação própria.',
            en: 'Compose with DescriptionGroup, DescriptionTerm and DescriptionDetails when values need their own markup.',
          }}
          code={ComposedCode}
        >
          <Composed />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'DescriptionList', en: 'DescriptionList' }}
          rows={[
            { name: 'items', type: '{ term: ReactNode; description: ReactNode | ReactNode[]; key?: Key }[]', description: { pt: 'Pares termo/descrição. Alternativa a compor com children.', en: 'Term/description pairs. Alternative to composing with children.' } },
            { name: 'layout', type: "'horizontal' | 'vertical' | 'grid'", default: "'horizontal'", description: { pt: 'Disposição dos pares.', en: 'Pair arrangement.' } },
            { name: 'termVariant', type: "'eyebrow' | 'strong'", default: "'eyebrow'", description: { pt: 'Estilo dos termos: caixa alta ou negrito.', en: 'Term style: uppercase or bold.' } },
            { name: 'columns', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: { pt: 'Colunas no layout grid.', en: 'Columns in the grid layout.' } },
            { name: 'termWidth', type: 'string', default: "'12rem'", description: { pt: 'Largura da coluna de termos (horizontal).', en: 'Term column width (horizontal).' } },
            { name: 'divided', type: 'boolean', default: 'true', description: { pt: 'Linhas de 1px entre os pares (horizontal e vertical).', en: '1px rules between pairs (horizontal and vertical).' } },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: { pt: 'Tamanho do texto.', en: 'Text size.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'DescriptionGroup, DescriptionTerm, DescriptionDetails', en: 'DescriptionGroup, DescriptionTerm, DescriptionDetails' }}
          rows={[
            { name: '...rest', type: 'HTMLAttributes', description: { pt: <>Renderizam <Code>&lt;div&gt;</Code>, <Code>&lt;dt&gt;</Code> e <Code>&lt;dd&gt;</Code>. O grupo é necessário no layout grid.</>, en: <>Render <Code>&lt;div&gt;</Code>, <Code>&lt;dt&gt;</Code> and <Code>&lt;dd&gt;</Code>. The group is required in the grid layout.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Usa a lista de descrição nativa: <Code>&lt;dl&gt;</Code> com <Code>&lt;dt&gt;</Code> (termo) e <Code>&lt;dd&gt;</Code>{' '}
                (descrição), agrupados em <Code>&lt;div&gt;</Code> — estrutura válida em HTML. Leitores de tela anunciam a relação
                entre termo e valor. Use <Code>aria-label</Code> quando houver várias listas na mesma página.
              </>
            }
            en={
              <>
                Uses the native description list: <Code>&lt;dl&gt;</Code> with <Code>&lt;dt&gt;</Code> (term) and{' '}
                <Code>&lt;dd&gt;</Code> (description), grouped in <Code>&lt;div&gt;</Code> — valid HTML. Screen readers announce the
                relationship between term and value. Use <Code>aria-label</Code> when a page has several lists.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Relação termo/valor exposta pela semântica de <dl>, não só pelo layout.', en: 'Term/value relationship exposed through <dl> semantics, not just layout.' } },
            { criterion: '1.4.10', description: { pt: 'O layout horizontal empilha e a grade se reorganiza em telas estreitas, sem rolagem horizontal.', en: 'The horizontal layout stacks and the grid reflows on narrow screens, without horizontal scrolling.' } },
            { criterion: '1.4.3', description: { pt: 'Termos e valores usam tokens de texto com contraste de 4.5:1.', en: 'Terms and values use text tokens with 4.5:1 contrast.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
