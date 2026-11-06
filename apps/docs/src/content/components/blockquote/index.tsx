import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import InProse from './examples/InProse'
import InProseCode from './examples/InProse?raw'
import InsetText from './examples/InsetText'
import InsetTextCode from './examples/InsetText?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import WithSource from './examples/WithSource'
import WithSourceCode from './examples/WithSource?raw'
import { meta } from './meta'

export default function BlockquotePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para trechos de outra fonte: depoimentos, cláusulas de um contrato, a fala de uma pessoa em um relatório.',
              en: 'Use it for excerpts from another source: testimonials, contract clauses, what someone said in a report.',
            },
            {
              pt: (
                <>
                  Dê o crédito em <Code>source</Code> (quem disse e onde) e, quando houver, o
                  endereço da origem em <Code>cite</Code>. Marque o título da obra com{' '}
                  <Code>&lt;cite&gt;</Code>.
                </>
              ),
              en: (
                <>
                  Give credit in <Code>source</Code> (who said it and where) and, when there is one,
                  the origin URL in <Code>cite</Code>. Mark the title of the work with{' '}
                  <Code>&lt;cite&gt;</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Para <strong>texto em destaque</strong> (o "inset text" do GOV.UK) — um prazo, uma
                  exceção, um exemplo que precisa se separar do texto ao redor sem ser citação —,
                  use <Code>as="div"</Code>. Assim leitores de tela não anunciam uma citação que não
                  existe.
                </>
              ),
              en: (
                <>
                  For <strong>inset text</strong> (as in GOV.UK) — a deadline, an exception, an
                  example that has to stand apart from the surrounding text without being a quote —,
                  use <Code>as="div"</Code>. That way screen readers don't announce a quote that
                  isn't there.
                </>
              ),
            },
            {
              pt: 'Não use para avisos que pedem atenção ou ação (erro, atenção, sucesso): para isso existem Alert e Banner. Nem para recuo decorativo.',
              en: "Don't use it for notices that need attention or action (error, warning, success): Alert and Banner cover that. Nor for decorative indentation.",
            },
            {
              pt: 'Mantenha curto: uma ou duas frases. Citações longas cansam e escondem o ponto principal.',
              en: 'Keep it short: one or two sentences. Long quotes tire readers and hide the main point.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Barra de acento', en: 'Accent bar' },
              description: {
                pt: 'Borda laranja de 3px à esquerda (à direita em RTL). É uma borda, então continua visível em alto contraste.',
                en: 'A 3px orange border on the left (right in RTL). It is a border, so it stays visible in forced-colors mode.',
              },
            },
            {
              term: { pt: 'Citação', en: 'Quote' },
              description: {
                pt: (
                  <>
                    O <Code>&lt;blockquote&gt;</Code> (ou <Code>&lt;div&gt;</Code> com{' '}
                    <Code>as="div"</Code>). Aceita texto ou vários parágrafos.
                  </>
                ),
                en: (
                  <>
                    The <Code>&lt;blockquote&gt;</Code> (or a <Code>&lt;div&gt;</Code> with{' '}
                    <Code>as="div"</Code>). Takes text or several paragraphs.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Fonte', en: 'Source' },
              description: {
                pt: (
                  <>
                    Com <Code>source</Code>, tudo vai para um <Code>&lt;figure&gt;</Code> e a fonte
                    para a <Code>&lt;figcaption&gt;</Code>, em texto secundário e precedida de
                    travessão.
                  </>
                ),
                en: (
                  <>
                    With <Code>source</Code>, everything goes into a <Code>&lt;figure&gt;</Code> and
                    the source into the <Code>&lt;figcaption&gt;</Code>, as secondary text preceded
                    by an em dash.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Com fonte', en: 'With source' }}
          description={{
            pt: 'cite guarda o endereço do relatório; source mostra quem disse e onde.',
            en: 'cite holds the report URL; source shows who said it and where.',
          }}
          code={WithSourceCode}
        >
          <WithSource />
        </Example>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{
            pt: 'sm (13px), md (15px, padrão) e lg (17px) — a mesma escala do Prose.',
            en: 'sm (13px), md (15px, default) and lg (17px) — the same scale as Prose.',
          }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Texto em destaque', en: 'Inset text' }}
          description={{
            pt: 'as="div": o mesmo visual, sem a semântica de citação.',
            en: 'as="div": the same look, without quote semantics.',
          }}
          code={InsetTextCode}
        >
          <InsetText />
        </Example>
        <Example
          title={{ pt: 'Dentro do Prose', en: 'Inside Prose' }}
          description={{
            pt: 'O Blockquote mantém o próprio estilo dentro do Prose — que, por sua vez, dá o mesmo visual a um <blockquote> vindo do CMS.',
            en: 'Blockquote keeps its own style inside Prose — which, in turn, gives the same look to a <blockquote> coming from the CMS.',
          }}
          code={InProseCode}
          align="stretch"
        >
          <InProse />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'children',
              type: 'ReactNode',
              required: true,
              description: {
                pt: 'O texto citado: uma frase ou parágrafos.',
                en: 'The quoted text: a sentence or paragraphs.',
              },
            },
            {
              name: 'source',
              type: 'ReactNode',
              description: {
                pt: 'Atribuição visível. Envolve a citação em <figure> com <figcaption>.',
                en: 'Visible attribution. Wraps the quote in a <figure> with a <figcaption>.',
              },
            },
            {
              name: 'cite',
              type: 'string',
              description: {
                pt: 'URL da origem (atributo cite do <blockquote>). Não é exibida.',
                en: 'Origin URL (the <blockquote> cite attribute). Not displayed.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: {
                pt: 'Tamanho do texto: 13, 15 ou 17px.',
                en: 'Text size: 13, 15 or 17px.',
              },
            },
            {
              name: 'as',
              type: "'blockquote' | 'div'",
              default: "'blockquote'",
              description: {
                pt: 'div para texto em destaque que não é citação (ignora cite).',
                en: "div for inset text that isn't a quote (ignores cite).",
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes',
              description: {
                pt: 'Atributos repassados à raiz (<figure> com source, senão <blockquote>), assim como a ref.',
                en: 'Attributes forwarded to the root (<figure> with source, otherwise <blockquote>), as is the ref.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Leitores de tela anunciam o início e o fim da citação (
                <Code>&lt;blockquote&gt;</Code>). Com <Code>source</Code>, a{' '}
                <Code>&lt;figure&gt;</Code> é nomeada pela <Code>&lt;figcaption&gt;</Code>, então a
                fonte fica ligada à citação. O travessão antes da fonte é decorativo (gerado por
                CSS, com texto alternativo vazio). O endereço em <Code>cite</Code> não é exposto aos
                usuários — se a origem for importante, coloque um link na fonte. Não é um componente
                interativo: não há interação de teclado.
              </>
            }
            en={
              <>
                Screen readers announce where the quote starts and ends (
                <Code>&lt;blockquote&gt;</Code>). With <Code>source</Code>, the{' '}
                <Code>&lt;figure&gt;</Code> is named by its <Code>&lt;figcaption&gt;</Code>, so the
                source stays tied to the quote. The em dash before the source is decorative
                (CSS-generated, with empty alt text). The <Code>cite</Code> URL isn't exposed to
                users — if the origin matters, put a link in the source. It is not an interactive
                component: there are no keyboard interactions.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Citação e fonte expostas com <blockquote>, <figure> e <figcaption>; texto em destaque sem semântica de citação.',
                en: 'Quote and source exposed with <blockquote>, <figure> and <figcaption>; inset text without quote semantics.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'A barra e o recuo marcam o trecho, além da cor.',
                en: 'The bar and the indentation mark the excerpt, beyond color.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'O texto quebra em telas de 320px, inclusive palavras e URLs longas.',
                en: 'Text wraps on 320px screens, including long words and URLs.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
