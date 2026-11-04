import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Bullet from './examples/Bullet'
import BulletCode from './examples/Bullet?raw'
import Divided from './examples/Divided'
import DividedCode from './examples/Divided?raw'
import Inline from './examples/Inline'
import InlineCode from './examples/Inline?raw'
import Numbered from './examples/Numbered'
import NumberedCode from './examples/Numbered?raw'
import WithIcons from './examples/WithIcons'
import WithIconsCode from './examples/WithIcons?raw'
import Animated from './examples/Animated'
import AnimatedCode from './examples/Animated?raw'
import { meta } from './meta'

export default function ListPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use <strong>numbered</strong> quando a ordem importa (passos, ranking) — ela renderiza um <Code>&lt;ol&gt;</Code>.
                  Nas demais variantes, a ordem não carrega significado.
                </>
              ),
              en: (
                <>
                  Use <strong>numbered</strong> when order matters (steps, rankings) — it renders an <Code>&lt;ol&gt;</Code>. In the
                  other variants, order carries no meaning.
                </>
              ),
            },
            {
              pt: 'Mantenha os itens paralelos: mesma estrutura gramatical e tamanho parecido. Comece com a informação mais importante.',
              en: 'Keep items parallel: same grammatical structure and similar length. Lead with the most important information.',
            },
            {
              pt: 'Na variante icon, o ícone reforça o texto — ele é decorativo e não é anunciado. Não dependa só dele para transmitir significado.',
              en: 'In the icon variant, the icon reinforces the text — it is decorative and not announced. Never rely on it alone to convey meaning.',
            },
            {
              pt: 'Para pares rótulo/valor, use DescriptionList; para dados com várias colunas, use Table.',
              en: 'For label/value pairs, use DescriptionList; for multi-column data, use Table.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Variantes', en: 'Variants' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'bullet', en: 'bullet' }, description: { pt: 'Marcador quadrado laranja de 6px — a assinatura do Orange.', en: '6px orange square marker — the Orange signature.' } },
            { term: { pt: 'numbered', en: 'numbered' }, description: { pt: '"01", "02"… em Space Grotesk, num <ol>. Aceita start.', en: '"01", "02"… in Space Grotesk, in an <ol>. Accepts start.' } },
            { term: { pt: 'icon', en: 'icon' }, description: { pt: 'Um ícone por item (da List ou do próprio ListItem).', en: 'One icon per item (from the List or the ListItem itself).' } },
            { term: { pt: 'divided', en: 'divided' }, description: { pt: 'Sem marcador, com linhas de 1px entre os itens.', en: 'No marker, with 1px lines between items.' } },
            { term: { pt: 'inline', en: 'inline' }, description: { pt: 'Itens na mesma linha separados por "·".', en: 'Items on one line separated by "·".' } },
            { term: { pt: 'plain', en: 'plain' }, description: { pt: 'Sem marcador nem divisórias.', en: 'No marker or dividers.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Marcadores', en: 'Bullets' }} code={BulletCode}>
          <Bullet />
        </Example>
        <Example
          title={{ pt: 'Numerada com descrição', en: 'Numbered with description' }}
          description={{
            pt: 'A numeração "01" é desenhada por CSS; leitores de tela recebem a ordem pelo próprio <ol>.',
            en: 'The "01" numbering is drawn with CSS; screen readers get the order from the <ol> itself.',
          }}
          code={NumberedCode}
        >
          <Numbered />
        </Example>
        <Example
          title={{ pt: 'Com ícones', en: 'With icons' }}
          description={{ pt: 'Defina um ícone para a lista e sobrescreva em itens específicos.', en: 'Set an icon for the list and override it on specific items.' }}
          code={WithIconsCode}
        >
          <WithIcons />
        </Example>
        <Example title={{ pt: 'Com divisórias', en: 'Divided' }} code={DividedCode}>
          <Divided />
        </Example>
        <Example
          title={{ pt: 'Em linha', en: 'Inline' }}
          description={{
            pt: 'Para metadados curtos e links de rodapé. O separador "·" não é lido por leitores de tela.',
            en: 'For short metadata and footer links. The "·" separator is not read by screen readers.',
          }}
          code={InlineCode}
        >
          <Inline />
        </Example>
        <Example
          title={{ pt: 'Entrada animada', en: 'Animated entrance' }}
          description={{ pt: 'Para listas de destaque em páginas de apresentação: os itens entram escalonados ao aparecer na tela.', en: 'For highlight lists on landing pages: items enter staggered as they scroll into view.' }}
          code={AnimatedCode}
        >
          <Animated />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'List', en: 'List' }}
          rows={[
            { name: 'variant', type: "'bullet' | 'numbered' | 'icon' | 'divided' | 'inline' | 'plain'", default: "'bullet'", description: { pt: 'Estilo dos marcadores.', en: 'Marker style.' } },
            { name: 'as', type: "'ul' | 'ol'", description: { pt: <>Elemento da lista. Padrão: <Code>ol</Code> em numbered, <Code>ul</Code> nas demais.</>, en: <>List element. Default: <Code>ol</Code> for numbered, <Code>ul</Code> otherwise.</> } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Tamanho do texto e espaçamento.', en: 'Text size and spacing.' } },
            { name: 'start', type: 'number', default: '1', description: { pt: 'Número inicial (numbered).', en: 'Starting number (numbered).' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone padrão da variante icon.', en: 'Default icon for the icon variant.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'ListItem', en: 'ListItem' }}
          rows={[
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto secundário abaixo do conteúdo.', en: 'Secondary text below the content.' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone do item (variante icon).', en: 'Item icon (icon variant).' } },
            { name: '...rest', type: 'LiHTMLAttributes', description: { pt: 'Atributos nativos de <li>.', en: 'Native <li> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Entrada (animated)', en: 'Entrance (animated)' }, description: { pt: 'Cada item sobe 24px e aparece — 600ms, ease-out, 80ms entre itens.', en: 'Each item rises 24px and fades in — 600ms, ease-out, 80ms between items.' } },
            { term: { pt: 'Marcadores', en: 'Markers' }, description: { pt: 'Quadrado, numeração ou ícone surgem com "pop" (escala 0.4 → 1) — 250ms, ease-bounce.', en: 'Square, number or icon pop in (scale 0.4 → 1) — 250ms, ease-bounce.' } },
            { term: { pt: 'Sem animated', en: 'Without animated' }, description: { pt: 'A lista é estática: itens não são interativos, então não há hover.', en: 'The list is static: items are not interactive, so there is no hover.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Nada é escondido: a lista aparece direto.', en: 'Nothing is hidden: the list appears immediately.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Usa <Code>&lt;ul&gt;</Code>/<Code>&lt;ol&gt;</Code> e <Code>&lt;li&gt;</Code> nativos. Como os marcadores padrão são
                removidos, a lista recebe <Code>role="list"</Code> explícito — sem ele, o VoiceOver no Safari deixa de anunciá-la
                como lista. Números, quadrados, ícones e o separador "·" são decorativos e ficam fora da leitura.
              </>
            }
            en={
              <>
                Uses native <Code>&lt;ul&gt;</Code>/<Code>&lt;ol&gt;</Code> and <Code>&lt;li&gt;</Code>. Since default markers are
                removed, the list gets an explicit <Code>role="list"</Code> — without it, VoiceOver on Safari stops announcing it as
                a list. Numbers, squares, icons and the "·" separator are decorative and skipped by screen readers.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Estrutura de lista e quantidade de itens expostas a tecnologias assistivas.', en: 'List structure and item count exposed to assistive technology.' } },
            { criterion: '1.3.2', description: { pt: 'Listas numeradas usam <ol>, preservando a sequência significativa.', en: 'Numbered lists use <ol>, preserving the meaningful sequence.' } },
            { criterion: '1.4.1', description: { pt: 'Nenhuma informação depende só da cor do marcador ou do ícone.', en: 'No information relies solely on marker or icon color.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
