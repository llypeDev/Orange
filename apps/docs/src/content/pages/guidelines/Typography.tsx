import { Button, Eyebrow, Heading, Text } from '@orange/ui'
import { typography } from '@orange/tokens'
import { T, useLang, type Localized } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  DocPage,
  DoDont,
  Example,
  PropsTable,
  Prose,
  Section,
} from '../../../kit'
import { TableWrap } from '../_shared/Blocks'

const families: {
  token: string
  name: string
  stack: string
  role: Localized<string>
  weights: string
  sample: Localized<string>
}[] = [
  {
    token: '--or-font-display',
    name: 'Space Grotesk',
    stack: typography.fontFamily.display,
    role: {
      pt: 'Títulos, rótulos de botões, eyebrows, números em destaque e navegação.',
      en: 'Headings, button labels, eyebrows, highlighted numbers and navigation.',
    },
    weights: '500 · 600 · 700',
    sample: { pt: 'Interfaces acessíveis, sem ruído.', en: 'Accessible interfaces, no noise.' },
  },
  {
    token: '--or-font-body',
    name: 'Inter',
    stack: typography.fontFamily.body,
    role: {
      pt: 'Texto corrido, descrições, campos de formulário, tabelas.',
      en: 'Running text, descriptions, form fields, tables.',
    },
    weights: '400 · 500 · 600',
    sample: {
      pt: 'O pedido 4821 foi enviado em 3 de março.',
      en: 'Order 4821 shipped on March 3rd.',
    },
  },
  {
    token: '--or-font-mono',
    name: 'JetBrains Mono',
    stack: typography.fontFamily.mono,
    role: {
      pt: 'Código, nomes de tokens, valores técnicos e atalhos de teclado.',
      en: 'Code, token names, technical values and keyboard shortcuts.',
    },
    weights: '400 · 500',
    sample: { pt: 'var(--or-color-accent) // 0O 1lI', en: 'var(--or-color-accent) // 0O 1lI' },
  },
]

const sizeUsage: Record<string, Localized<string>> = {
  '2xs': { pt: 'Eyebrows, rótulos de tabela, metadados', en: 'Eyebrows, table labels, metadata' },
  xs: { pt: 'Legendas, badges, contadores', en: 'Captions, badges, counters' },
  sm: {
    pt: 'Botões, rótulos de campo, texto secundário',
    en: 'Buttons, field labels, secondary text',
  },
  md: { pt: 'Texto padrão do corpo (15px)', en: 'Default body text (15px)' },
  lg: { pt: 'Lead de página, texto de destaque', en: 'Page lead, emphasized text' },
  xl: { pt: 'Títulos de cartões, h4', en: 'Card titles, h4' },
  '2xl': { pt: 'Títulos de seção pequenos, h3', en: 'Small section titles, h3' },
  '3xl': { pt: 'Títulos de seção, h2', en: 'Section titles, h2' },
  '4xl': { pt: 'Título de página, h1', en: 'Page title, h1' },
  '5xl': { pt: 'Título de página de marketing', en: 'Marketing page title' },
  display: { pt: 'Hero — uma vez por página', en: 'Hero — once per page' },
}

const leading: Record<string, Localized<string>> = {
  display: { pt: 'Display e hero: linhas coladas', en: 'Display and hero: tight lines' },
  heading: { pt: 'Títulos de h1 a h3', en: 'Headings h1 to h3' },
  tight: {
    pt: 'Títulos pequenos, rótulos de várias linhas',
    en: 'Small headings, multi-line labels',
  },
  body: { pt: 'Texto de interface (padrão do body)', en: 'Interface text (body default)' },
  loose: { pt: 'Leitura longa, como esta documentação', en: 'Long reading, like these docs' },
}

const tracking: Record<string, Localized<string>> = {
  display: { pt: 'Display: aperta letras grandes', en: 'Display: tightens large letters' },
  heading: { pt: 'Títulos em Space Grotesk', en: 'Space Grotesk headings' },
  body: { pt: 'Corpo: ajuste quase imperceptível', en: 'Body: barely noticeable' },
  meta: {
    pt: 'Eyebrows em caixa alta: abre o espaçamento',
    en: 'Uppercase eyebrows: opens spacing',
  },
}

const headingCode = `import { Heading } from '@orange/ui'

// level = semântica (h1–h6); size = aparência
<Heading level={1} size="4xl">Relatório de vendas</Heading>
<Heading level={2}>Resumo do trimestre</Heading>          {/* 3xl */}
<Heading level={3}>Por canal</Heading>                    {/* 2xl */}
<Heading level={4}>Loja física</Heading>                  {/* xl */}
<Heading level={2} size="xl">Um h2 com tamanho de h4</Heading>`

const textCode = `import { Text } from '@orange/ui'

<Text size="lg" tone="muted">Lead: resumo do que a página entrega.</Text>
<Text>Texto padrão: 15px, Inter, cor text.</Text>
<Text size="sm" tone="subtle">Atualizado há 5 minutos</Text>
<Text tone="success" weight="semibold">Pagamento confirmado</Text>
<Text font="mono" size="sm">PED-2026-04821</Text>
<Text truncate style={{ maxWidth: 260 }}>
  Endereço: Rua Doutor Arnaldo de Carvalho, 1500 — São Paulo
</Text>`

const eyebrowCode = `import { Eyebrow, Heading } from '@orange/ui'

<Eyebrow>Configurações</Eyebrow>
<Eyebrow marker>Novo</Eyebrow>
<Eyebrow tone="accent" marker>Em destaque</Eyebrow>

{/* Acima de um título */}
<Eyebrow as="span" marker>Faturamento</Eyebrow>
<Heading level={2}>R$ 182.430</Heading>`

const hierarchyCode = `<header>
  <Eyebrow marker>Pedidos · Março</Eyebrow>
  <Heading level={1} size="4xl">Pedidos em aberto</Heading>
  <Text size="lg" tone="muted">
    32 pedidos aguardam separação. Os mais antigos aparecem primeiro.
  </Text>
</header>
<section>
  <Heading level={2} size="xl">Prioridade alta</Heading>
  <Text tone="muted">Pedidos com entrega expressa e prazo vencendo hoje.</Text>
</section>`

export default function TypographyPage() {
  const { t } = useLang()
  const sizes = Object.entries(typography.fontSize)

  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Tipografia', en: 'Typography' }}
      lead={{
        pt: 'Três famílias com papéis claros: Space Grotesk dá a voz, Inter faz o trabalho pesado de leitura e JetBrains Mono cuida do que é técnico. Uma escala de 11 tamanhos cobre do rótulo ao hero.',
        en: 'Three families with clear roles: Space Grotesk gives the voice, Inter does the heavy reading and JetBrains Mono handles the technical. An 11-step scale covers everything from labels to the hero.',
      }}
    >
      <Section title={{ pt: 'Famílias', en: 'Families' }}>
        <div className="guide-fonts">
          {families.map((family) => (
            <div key={family.token} className="guide-font" style={{ fontFamily: family.stack }}>
              <span className="guide-font__specimen" aria-hidden="true">
                Aa
              </span>
              <div className="guide-font__meta">
                <p className="guide-font__name">{family.name}</p>
                <p className="guide-mono guide-muted">{family.token}</p>
              </div>
              <p className="guide-font__sample">{t(family.sample)}</p>
              <p className="guide-font__role">{t(family.role)}</p>
              <p className="guide-mono guide-muted">
                {t({ pt: 'Pesos usados', en: 'Weights used' })}: {family.weights}
              </p>
            </div>
          ))}
        </div>
        <Callout tone="info" title={{ pt: 'Fallbacks', en: 'Fallbacks' }}>
          <p>
            <T
              pt={
                <>
                  Cada família termina em fontes do sistema (<Code>system-ui</Code>,{' '}
                  <Code>Segoe UI</Code>, <Code>ui-monospace</Code>…). Se as fontes web não
                  carregarem, a interface continua legível e com a mesma hierarquia.
                </>
              }
              en={
                <>
                  Each family ends in system fonts (<Code>system-ui</Code>, <Code>Segoe UI</Code>,{' '}
                  <Code>ui-monospace</Code>…). If web fonts fail to load, the interface stays
                  readable with the same hierarchy.
                </>
              }
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Escala', en: 'Scale' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Os tamanhos vivem em <Code>--or-text-*</Code> e estão em rem: respeitam o tamanho
                  de fonte que a pessoa configurou no navegador (1.4.4). Os valores em px abaixo
                  consideram a base de 16px.
                </>
              }
              en={
                <>
                  Sizes live in <Code>--or-text-*</Code> and use rem: they respect the font size the
                  person set in their browser (1.4.4). The px values below assume a 16px base.
                </>
              }
            />
          </p>
        </Prose>
        <ol className="guide-type-scale">
          {sizes
            .slice()
            .reverse()
            .map(([name, rem]) => {
              const px = parseFloat(rem) * 16
              const display = px >= 32
              return (
                <li key={name}>
                  <div className="guide-type-scale__meta">
                    <span className="guide-type-scale__token">--or-text-{name}</span>
                    <span className="guide-mono guide-muted">
                      {rem} · {px}px
                    </span>
                    <span className="guide-type-scale__usage">{t(sizeUsage[name])}</span>
                  </div>
                  <p
                    className={`guide-type-scale__sample ${display ? 'guide-type-scale__sample--display' : ''}`}
                    style={{ fontSize: `var(--or-text-${name})` }}
                  >
                    {px >= 60
                      ? 'Orange'
                      : px >= 24
                        ? t({ pt: 'Interfaces acessíveis', en: 'Accessible interfaces' })
                        : t({
                            pt: 'O jeito mais direto de construir interfaces acessíveis.',
                            en: 'The most direct way to build accessible interfaces.',
                          })}
                  </p>
                </li>
              )
            })}
        </ol>
      </Section>

      <Section title={{ pt: 'Pesos', en: 'Weights' }}>
        <div className="guide-weights">
          {Object.entries(typography.fontWeight).map(([name, weight]) => (
            <div key={name} className="guide-weights__item">
              <span
                className="guide-weights__sample"
                style={{ fontWeight: Number(weight) }}
                aria-hidden="true"
              >
                Ag
              </span>
              <span className="guide-weights__name">
                {name} · {weight}
              </span>
              <span className="guide-mono guide-muted">--or-weight-{name}</span>
            </div>
          ))}
        </div>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <strong>Regular (400):</strong> texto corrido. É o padrão do <Code>body</Code>.
                </>
              ),
              en: (
                <>
                  <strong>Regular (400):</strong> running text. The <Code>body</Code> default.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Medium (500):</strong> eyebrows, navegação, ênfase leve.
                </>
              ),
              en: (
                <>
                  <strong>Medium (500):</strong> eyebrows, navigation, light emphasis.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Semibold (600):</strong> títulos grandes (h1, display) e{' '}
                  <Code>&lt;strong&gt;</Code>.
                </>
              ),
              en: (
                <>
                  <strong>Semibold (600):</strong> large headings (h1, display) and{' '}
                  <Code>&lt;strong&gt;</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Bold (700):</strong> títulos de h2 para baixo e rótulos de botão —
                  compensa o tamanho menor.
                </>
              ),
              en: (
                <>
                  <strong>Bold (700):</strong> headings from h2 down and button labels — compensates
                  for smaller size.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Altura de linha e espaçamento', en: 'Line height and tracking' }}>
        <TableWrap label={{ pt: 'Tokens de altura de linha', en: 'Line height tokens' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">{t({ pt: 'Valor', en: 'Value' })}</th>
                <th scope="col">{t({ pt: 'Uso', en: 'Usage' })}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(typography.lineHeight).map(([name, v]) => (
                <tr key={name}>
                  <th scope="row">
                    <Code>--or-leading-{name}</Code>
                  </th>
                  <td>
                    <span className="guide-mono">{v}</span>
                  </td>
                  <td>{t(leading[name])}</td>
                </tr>
              ))}
              {Object.entries(typography.letterSpacing).map(([name, v]) => (
                <tr key={`tracking-${name}`}>
                  <th scope="row">
                    <Code>--or-tracking-{name}</Code>
                  </th>
                  <td>
                    <span className="guide-mono">{v}</span>
                  </td>
                  <td>{t(tracking[name])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <div className="guide-split">
          <div className="guide-leading" style={{ lineHeight: 'var(--or-leading-body)' }}>
            <span className="or-eyebrow">body · 1.55</span>
            <p>
              {t({
                pt: 'Em telas de produto, 1.55 mantém tabelas, formulários e cartões compactos sem colar as linhas.',
                en: 'On product screens, 1.55 keeps tables, forms and cards compact without cramping lines.',
              })}
            </p>
          </div>
          <div className="guide-leading" style={{ lineHeight: 'var(--or-leading-loose)' }}>
            <span className="or-eyebrow">loose · 1.7</span>
            <p>
              {t({
                pt: 'Para leitura longa, 1.7 dá ar ao parágrafo e ajuda o olho a achar o começo da próxima linha.',
                en: 'For long reading, 1.7 gives the paragraph air and helps the eye find the start of the next line.',
              })}
            </p>
          </div>
        </div>
        <Prose>
          <p>
            <T
              pt={
                <>
                  O conteúdo precisa sobreviver quando a pessoa aumenta o espaçamento (1.4.12):
                  altura de linha 1.5×, parágrafos 2×, letras +0.12em e palavras +0.16em. Não fixe
                  alturas em contêineres de texto.
                </>
              }
              en={
                <>
                  Content must survive when people increase spacing (1.4.12): line height 1.5×,
                  paragraphs 2×, letters +0.12em and words +0.16em. Don't fix heights on text
                  containers.
                </>
              }
            />
          </p>
        </Prose>
      </Section>

      <Section title={{ pt: 'Componentes', en: 'Components' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  <Code>Heading</Code>, <Code>Text</Code> e <Code>Eyebrow</Code> aplicam a escala,
                  as famílias e as cores de texto. Use-os em vez de estilizar <Code>h1</Code>–
                  <Code>p</Code> à mão.
                </>
              }
              en={
                <>
                  <Code>Heading</Code>, <Code>Text</Code> and <Code>Eyebrow</Code> apply the scale,
                  families and text colors. Use them instead of styling <Code>h1</Code>–
                  <Code>p</Code> by hand.
                </>
              }
            />
          </p>
        </Prose>
        <Example
          title={{ pt: 'Heading', en: 'Heading' }}
          description={{
            pt: 'level define a semântica (o que o leitor de tela anuncia); size define a aparência. Escolha o nível pela estrutura do documento, nunca pelo tamanho.',
            en: 'level sets semantics (what screen readers announce); size sets appearance. Pick the level from the document structure, never from size.',
          }}
          code={headingCode}
          align="stretch"
        >
          <div className="guide-stack">
            <Heading level={4} size="4xl">
              {t({ pt: 'Relatório de vendas', en: 'Sales report' })}
            </Heading>
            <Heading level={5} size="3xl">
              {t({ pt: 'Resumo do trimestre', en: 'Quarter summary' })}
            </Heading>
            <Heading level={6} size="2xl">
              {t({ pt: 'Por canal', en: 'By channel' })}
            </Heading>
            <Heading level={6} size="xl">
              {t({ pt: 'Loja física', en: 'Physical store' })}
            </Heading>
          </div>
        </Example>
        <PropsTable
          caption={{ pt: 'Heading', en: 'Heading' }}
          rows={[
            {
              name: 'level',
              type: '1 | 2 | 3 | 4 | 5 | 6',
              default: '2',
              description: { pt: 'Nível semântico (h1–h6).', en: 'Semantic level (h1–h6).' },
            },
            {
              name: 'size',
              type: "'display' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md'",
              description: {
                pt: 'Tamanho visual. Padrão: 4xl para h1, 3xl para h2, 2xl para h3, xl para h4…',
                en: 'Visual size. Default: 4xl for h1, 3xl for h2, 2xl for h3, xl for h4…',
              },
            },
          ]}
        />
        <Example
          title={{ pt: 'Text', en: 'Text' }}
          description={{
            pt: 'Tamanho, tom, peso, família e truncamento. O elemento padrão é <p>; troque com as.',
            en: 'Size, tone, weight, family and truncation. The default element is <p>; change it with as.',
          }}
          code={textCode}
          align="stretch"
        >
          <div className="guide-stack">
            <Text size="lg" tone="muted">
              {t({
                pt: 'Lead: resumo do que a página entrega.',
                en: 'Lead: a summary of what the page delivers.',
              })}
            </Text>
            <Text>
              {t({
                pt: 'Texto padrão: 15px, Inter, cor text.',
                en: 'Default text: 15px, Inter, text color.',
              })}
            </Text>
            <Text size="sm" tone="subtle">
              {t({ pt: 'Atualizado há 5 minutos', en: 'Updated 5 minutes ago' })}
            </Text>
            <Text tone="success" weight="semibold">
              {t({ pt: 'Pagamento confirmado', en: 'Payment confirmed' })}
            </Text>
            <Text font="mono" size="sm">
              PED-2026-04821
            </Text>
            <Text truncate style={{ maxWidth: 260 }}>
              {t({
                pt: 'Endereço: Rua Doutor Arnaldo de Carvalho, 1500 — São Paulo',
                en: 'Address: 1500 Doctor Arnaldo de Carvalho St — São Paulo',
              })}
            </Text>
          </div>
        </Example>
        <PropsTable
          caption={{ pt: 'Text', en: 'Text' }}
          rows={[
            {
              name: 'as',
              type: 'ElementType',
              default: "'p'",
              description: {
                pt: 'Elemento renderizado (span, li, label…).',
                en: 'Rendered element (span, li, label…).',
              },
            },
            {
              name: 'size',
              type: "'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
              default: "'md'",
              description: { pt: 'Tamanho da escala.', en: 'Scale size.' },
            },
            {
              name: 'tone',
              type: "'default' | 'muted' | 'subtle' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'inherit'",
              default: "'default'",
              description: {
                pt: 'Cor semântica; todas com ≥ 4.5:1 sobre bg.',
                en: 'Semantic color; all ≥ 4.5:1 on bg.',
              },
            },
            {
              name: 'weight',
              type: "'regular' | 'medium' | 'semibold' | 'bold'",
              description: { pt: 'Peso da fonte.', en: 'Font weight.' },
            },
            {
              name: 'font',
              type: "'body' | 'display' | 'mono'",
              default: "'body'",
              description: { pt: 'Família tipográfica.', en: 'Type family.' },
            },
            {
              name: 'truncate',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Corta em uma linha com reticências. Garanta o texto completo em outro lugar (title não basta).',
                en: 'Cuts to one line with an ellipsis. Make the full text available elsewhere (title is not enough).',
              },
            },
          ]}
        />
        <Example
          title={{ pt: 'Eyebrow', en: 'Eyebrow' }}
          description={{
            pt: 'Rótulo curto em caixa alta acima de títulos. O marcador quadrado é decorativo.',
            en: 'Short uppercase label above headings. The square marker is decorative.',
          }}
          code={eyebrowCode}
        >
          <div className="guide-stack">
            <Eyebrow>{t({ pt: 'Configurações', en: 'Settings' })}</Eyebrow>
            <Eyebrow marker>{t({ pt: 'Novo', en: 'New' })}</Eyebrow>
            <Eyebrow tone="accent" marker>
              {t({ pt: 'Em destaque', en: 'Featured' })}
            </Eyebrow>
          </div>
          <div className="guide-stack">
            <Eyebrow as="span" marker>
              {t({ pt: 'Faturamento', en: 'Revenue' })}
            </Eyebrow>
            <Heading level={3} size="3xl">
              R$ 182.430
            </Heading>
          </div>
        </Example>
      </Section>

      <Section title={{ pt: 'Hierarquia', en: 'Hierarchy' }}>
        <Prose>
          <p>
            <T
              pt="A hierarquia nasce de tamanho, peso e espaço — não de cor. Um cabeçalho típico combina eyebrow (contexto), título (o quê) e lead (por quê), separados do conteúdo por uma borda de 1px."
              en="Hierarchy comes from size, weight and space — not color. A typical header combines an eyebrow (context), title (what) and lead (why), separated from content by a 1px border."
            />
          </p>
        </Prose>
        <Example code={hierarchyCode} align="stretch" collapsed>
          <div className="guide-hierarchy">
            <header>
              <Eyebrow marker>{t({ pt: 'Pedidos · Março', en: 'Orders · March' })}</Eyebrow>
              <Heading level={3} size="4xl">
                {t({ pt: 'Pedidos em aberto', en: 'Open orders' })}
              </Heading>
              <Text size="lg" tone="muted">
                {t({
                  pt: '32 pedidos aguardam separação. Os mais antigos aparecem primeiro.',
                  en: '32 orders are waiting to be picked. The oldest come first.',
                })}
              </Text>
            </header>
            <section>
              <Heading level={4} size="xl">
                {t({ pt: 'Prioridade alta', en: 'High priority' })}
              </Heading>
              <Text tone="muted">
                {t({
                  pt: 'Pedidos com entrega expressa e prazo vencendo hoje.',
                  en: 'Express orders due today.',
                })}
              </Text>
              <div>
                <Button size="sm" variant="outline">
                  {t({ pt: 'Ver 6 pedidos', en: 'View 6 orders' })}
                </Button>
              </div>
            </section>
          </div>
        </Example>
      </Section>

      <Section title={{ pt: 'Escrita', en: 'Writing' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <strong>Caixa de sentença</strong> em títulos, botões e rótulos: “Criar projeto”,
                  não “Criar Projeto”. Só a primeira palavra e nomes próprios em maiúscula.
                </>
              ),
              en: (
                <>
                  <strong>Sentence case</strong> for headings, buttons and labels: “Create project”,
                  not “Create Project”. Capitalize only the first word and proper nouns.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>60 a 75 caracteres por linha</strong> em texto corrido. A documentação usa{' '}
                  <Code>max-width: 72ch</Code>; o lead usa 68ch.
                </>
              ),
              en: (
                <>
                  <strong>60 to 75 characters per line</strong> in running text. These docs use{' '}
                  <Code>max-width: 72ch</Code>; the lead uses 68ch.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Caixa alta só em eyebrows</strong>, com <Code>text-transform</Code> —
                  nunca digitada em maiúsculas (leitores de tela podem soletrar).
                </>
              ),
              en: (
                <>
                  <strong>Uppercase only for eyebrows</strong>, via <Code>text-transform</Code> —
                  never typed in caps (screen readers may spell it out).
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Alinhado à esquerda.</strong> Texto justificado cria rios de espaço;
                  centralizado só em blocos curtos, como o hero.
                </>
              ),
              en: (
                <>
                  <strong>Left aligned.</strong> Justified text creates rivers of space; center only
                  short blocks such as the hero.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Números tabulares</strong> em tabelas e métricas:{' '}
                  <Code>font-variant-numeric: tabular-nums</Code>.
                </>
              ),
              en: (
                <>
                  <strong>Tabular figures</strong> in tables and metrics:{' '}
                  <Code>font-variant-numeric: tabular-nums</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Direto ao ponto.</strong> Verbos no começo dos botões, frases curtas, sem
                  jargão interno.
                </>
              ),
              en: (
                <>
                  <strong>Straight to the point.</strong> Verbs first on buttons, short sentences,
                  no internal jargon.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <div className="guide-measure guide-measure--good">
              <Heading level={3} size="lg">
                {t({ pt: 'Conecte sua loja', en: 'Connect your store' })}
              </Heading>
              <Text size="sm" tone="muted">
                {t({
                  pt: 'Importamos pedidos, clientes e estoque a cada 15 minutos. Você pode pausar a sincronização quando quiser.',
                  en: 'We import orders, customers and inventory every 15 minutes. You can pause sync at any time.',
                })}
              </Text>
            </div>
          }
          dontExample={
            <div className="guide-measure">
              <Heading level={3} size="lg">
                {t({ pt: 'CONECTE SUA LOJA AGORA MESMO', en: 'CONNECT YOUR STORE RIGHT NOW' })}
              </Heading>
              <Text size="sm" tone="muted" style={{ textAlign: 'justify' }}>
                {t({
                  pt: 'Importamos pedidos, clientes e estoque a cada 15 minutos e você pode pausar a sincronização quando quiser nas configurações avançadas.',
                  en: 'We import orders, customers and inventory every 15 minutes and you can pause sync at any time in the advanced settings.',
                })}
              </Text>
            </div>
          }
          doItems={[
            {
              pt: 'Caixa de sentença, texto alinhado à esquerda e linhas de tamanho confortável.',
              en: 'Sentence case, left-aligned text and comfortable line lengths.',
            },
          ]}
          dontItems={[
            {
              pt: 'Título digitado em maiúsculas e parágrafo justificado.',
              en: 'Heading typed in capitals and a justified paragraph.',
            },
          ]}
        />
      </Section>
    </DocPage>
  )
}
