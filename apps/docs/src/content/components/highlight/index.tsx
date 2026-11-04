import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Literal from './examples/Literal'
import LiteralCode from './examples/Literal?raw'
import MultipleTerms from './examples/MultipleTerms'
import MultipleTermsCode from './examples/MultipleTerms?raw'
import SearchList from './examples/SearchList'
import SearchListCode from './examples/SearchList?raw'
import { meta } from './meta'

export default function HighlightPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para mostrar por que um resultado apareceu: buscas, filtros, autocompletar.',
              en: 'Use it to show why a result showed up: search, filters, autocomplete.',
            },
            {
              pt: (
                <>
                  O destaque deve refletir a mesma regra do filtro. Se a busca ignora acentos, o Highlight também ignora — "sao"
                  destaca "São".
                </>
              ),
              en: (
                <>
                  Highlighting should follow the same rule as the filter. If search ignores accents, Highlight does too — "sao"
                  highlights "São".
                </>
              ),
            },
            {
              pt: (
                <>
                  Para destacar cada palavra da busca separadamente, passe um array: <Code>query={'{busca.split(/\\s+/)}'}</Code>.
                </>
              ),
              en: (
                <>
                  To highlight each search word separately, pass an array: <Code>query={'{search.split(/\\s+/)}'}</Code>.
                </>
              ),
            },
            {
              pt: 'Não use para ênfase editorial em textos corridos — para isso existe <strong>.',
              en: 'Don\'t use it for editorial emphasis in running text — that is what <strong> is for.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Lista filtrada', en: 'Filtered list' }}
          description={{
            pt: 'Digite "sao", "SÃO" ou "ribeirao": acentos e maiúsculas são ignorados.',
            en: 'Type "sao", "SÃO" or "ribeirao": accents and case are ignored.',
          }}
          code={SearchListCode}
        >
          <SearchList />
        </Example>
        <Example
          title={{ pt: 'Vários termos', en: 'Several terms' }}
          description={{
            pt: 'Ocorrências sobrepostas ou vizinhas são unidas em um único destaque.',
            en: 'Overlapping or adjacent matches are merged into a single highlight.',
          }}
          code={MultipleTermsCode}
        >
          <MultipleTerms />
        </Example>
        <Example
          title={{ pt: 'Termos literais e maiúsculas', en: 'Literal terms and case' }}
          description={{
            pt: 'Caracteres especiais como ( ) $ * são tratados como texto. caseSensitive diferencia "API" de "rápida".',
            en: 'Special characters such as ( ) $ * are treated as text. caseSensitive tells "API" apart from "rápida".',
          }}
          code={LiteralCode}
        >
          <Literal />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'children', type: 'string', required: true, description: { pt: 'Texto em que os termos são destacados.', en: 'Text in which terms are highlighted.' } },
            { name: 'query', type: 'string | string[]', required: true, description: { pt: 'Termo ou termos a destacar.', en: 'Term or terms to highlight.' } },
            { name: 'as', type: 'ElementType', default: "'span'", description: { pt: 'Elemento que envolve o texto.', en: 'Element wrapping the text.' } },
            { name: 'caseSensitive', type: 'boolean', default: 'false', description: { pt: 'Diferencia maiúsculas de minúsculas.', en: 'Distinguishes letter case.' } },
            { name: 'accentSensitive', type: 'boolean', default: 'false', description: { pt: 'Diferencia letras acentuadas.', en: 'Distinguishes accented letters.' } },
            { name: 'markClassName', type: 'string', description: { pt: 'Classe extra de cada <mark>.', en: 'Extra class for each <mark>.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Nova ocorrência', en: 'New match' }, description: { pt: 'Fundo e sublinhado laranja surgem com fade — 250ms, ease-out. Marcas que continuam iguais quando a busca muda não repetem a animação.', en: 'Background and orange underline fade in — 250ms, ease-out. Marks that stay the same when the query changes do not replay.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'O destaque aparece sem fade.', en: 'The highlight appears without fading.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Os trechos destacados são elementos <Code>&lt;mark&gt;</Code>, que alguns leitores de tela anunciam como
                "destacado". O texto continua íntegro (nada é inserido ou removido), e o destaque usa fundo e sublinhado laranja —
                não depende só da cor. Em modo de alto contraste, usa as cores de sistema <Code>Mark</Code>/<Code>MarkText</Code>.
              </>
            }
            en={
              <>
                Highlighted fragments are <Code>&lt;mark&gt;</Code> elements, which some screen readers announce as "highlighted".
                The text stays intact (nothing is inserted or removed), and the highlight uses a background plus an orange
                underline — it doesn't rely on color alone. In forced-colors mode it uses the <Code>Mark</Code>/
                <Code>MarkText</Code> system colors.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Destaques expostos semanticamente com <mark>.', en: 'Highlights exposed semantically with <mark>.' } },
            { criterion: '1.4.1', description: { pt: 'Sublinhado de 2px além da cor de fundo.', en: '2px underline in addition to the background color.' } },
            { criterion: '1.4.3', description: { pt: 'O texto destacado mantém a cor original, com o mesmo contraste.', en: 'Highlighted text keeps its original color and contrast.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
