import { Icon, Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import { Bullets, Callout, Code, CodeBlock, DefinitionTable, DocPage, Prose, Section } from '../../../kit'
import { templatePages } from '../../../nav'
import { SubHeading } from '../../pages/_shared/Blocks'
import { getComponentMeta } from '../../registry'
import { TemplateEmbed, useEmbedMode } from './TemplateEmbed'
import { TemplatePreview } from './TemplatePreview'

export interface TemplateComponentUse {
  /** Slug da página do componente (`/components/<slug>`). */
  slug: string
  /** Por que o modelo usa este componente. */
  why: Localized<ReactNode>
}

export interface TemplateFile {
  name: string
  code: string
  language: 'tsx' | 'ts' | 'css'
}

export interface TemplateA11yItem {
  /** Tema da verificação: landmarks, títulos, foco, erros… */
  topic: Localized<string>
  /** Critérios WCAG relacionados (ex.: "1.3.1"). */
  criteria?: string
  description: Localized<ReactNode>
}

export interface TemplateDocPageProps {
  /** Rota sem idioma: `/templates/sign-in`. */
  path: string
  title: Localized<string>
  lead: Localized<ReactNode>
  /** O modelo em si (renderizado só no iframe da prévia). */
  template: ReactNode
  /** Título da aba quando o modelo é aberto sozinho. */
  embedTitle: string
  /** Texto de abertura da seção "Visão geral". */
  overview: Localized<ReactNode>
  components: TemplateComponentUse[]
  /** O que experimentar na prévia. */
  tryIt: Localized<ReactNode>[]
  /** Diferenças entre a versão da documentação e a de um app. */
  /** Diferenças entre o modelo na documentação e num app real (opcional). */
  docsAdjustments?: Localized<ReactNode>[]
  files: TemplateFile[]
  a11y: TemplateA11yItem[]
}

/**
 * Página de um modelo. Na rota normal mostra a documentação (visão geral,
 * prévia, código e acessibilidade); com `?embed=1`, mostra só o modelo — é o
 * que o iframe da prévia carrega.
 */
export function TemplateDocPage(props: TemplateDocPageProps) {
  const embed = useEmbedMode()
  if (embed) return <TemplateEmbed title={props.embedTitle}>{props.template}</TemplateEmbed>
  return <TemplateDocContent {...props} />
}

function ComponentLink({ slug }: { slug: string }) {
  const { to } = useLang()
  const meta = getComponentMeta(slug)
  if (!meta) return <Code>{slug}</Code>
  return <Link to={to(`/components/${slug}`)}>{meta.name}</Link>
}

function TemplatePager({ path }: { path: string }) {
  const { t, to } = useLang()
  const index = templatePages.findIndex((p) => p.path === path)
  const prev = index > 0 ? templatePages[index - 1] : undefined
  const next = index >= 0 && index < templatePages.length - 1 ? templatePages[index + 1] : undefined
  if (!prev && !next) return null
  return (
    <nav className="doc-pager" aria-label={t({ pt: 'Navegação entre modelos', en: 'Template navigation' })}>
      {prev ? (
        <Link className="doc-pager__link or-lift" to={to(prev.path)}>
          <span className="or-eyebrow doc-pager__dir">
            <Icon name="arrow-left" size="xs" /> {t({ pt: 'Anterior', en: 'Previous' })}
          </span>
          <span className="doc-pager__name">{t(prev.label)}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link className="doc-pager__link doc-pager__link--next or-lift" to={to(next.path)}>
          <span className="or-eyebrow doc-pager__dir">
            {t({ pt: 'Próximo', en: 'Next' })} <Icon name="arrow-right" size="xs" />
          </span>
          <span className="doc-pager__name">{t(next.label)}</span>
        </Link>
      )}
    </nav>
  )
}

function TemplateDocContent({
  path,
  title,
  lead,
  overview,
  components,
  tryIt,
  docsAdjustments,
  files,
  a11y,
}: TemplateDocPageProps) {
  const { t } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: 'Modelos', en: 'Templates' }}
      title={title}
      lead={lead}
      footer={<TemplatePager path={path} />}
    >
      <Section title={{ pt: 'Visão geral', en: 'Overview' }} id="visao-geral">
        <Prose>{t(overview)}</Prose>
        <Callout title={{ pt: 'Interface em português', en: 'Portuguese-only interface' }}>
          <T
            pt="O produto do modelo, a Aurora, é fictício e brasileiro: a interface do modelo está só em português, com dados inventados. Os textos internos dos componentes (Fechar, Mostrar senha, Paginação…) seguem o locale do OrangeProvider."
            en="The template's product, Aurora, is fictional and Brazilian: the template interface is in Portuguese only, with made-up data. Component internal texts (Close, Show password, Pagination…) follow the OrangeProvider locale."
          />
        </Callout>
        <SubHeading title={{ pt: 'Componentes usados', en: 'Components used' }} id="componentes-usados" />
        <DefinitionTable
          rows={components.map((item) => ({
            term: { pt: <ComponentLink slug={item.slug} />, en: <ComponentLink slug={item.slug} /> },
            description: item.why,
          }))}
        />
      </Section>

      <Section title={{ pt: 'Prévia', en: 'Preview' }} id="previa">
        <Prose>
          <p>
            <T
              pt="O modelo roda em um iframe com a largura escolhida — as media queries e os pontos de quebra dos componentes respondem a essa largura. Quando a moldura não cabe na coluna, ela é reduzida em escala; abra em nova aba para ver em tamanho real."
              en="The template runs in an iframe at the chosen width — media queries and component breakpoints respond to that width. When the frame doesn't fit the column, it's scaled down; open it in a new tab to see it at full size."
            />
          </p>
        </Prose>
        <TemplatePreview path={path} name={title} />
        <SubHeading title={{ pt: 'Experimente', en: 'Try it' }} id="experimente" />
        <Bullets items={tryIt} />
        {docsAdjustments && docsAdjustments.length > 0 && (
          <Callout title={{ pt: 'Ajustes para a documentação', en: 'Adjustments for the docs' }}>
            <Bullets items={docsAdjustments} />
          </Callout>
        )}
      </Section>

      <Section title={{ pt: 'Código-fonte', en: 'Source code' }} id="codigo-fonte">
        <Prose>
          <p>
            <T
              pt={
                <>
                  Copie os arquivos para o seu projeto. Eles usam só componentes do <Code>@orangesys/ui</Code> e tokens{' '}
                  <Code>--or-*</Code>; o CSS próprio cuida apenas da disposição da página.
                </>
              }
              en={
                <>
                  Copy the files into your project. They only use <Code>@orangesys/ui</Code> components and{' '}
                  <Code>--or-*</Code> tokens; the custom CSS only handles page layout.
                </>
              }
            />
          </p>
        </Prose>
        <Tabs defaultValue={files[0]?.name} size="sm" className="tpl-files">
          <TabList aria-label={t({ pt: 'Arquivos do modelo', en: 'Template files' })}>
            {files.map((file) => (
              <Tab key={file.name} value={file.name}>
                {file.name}
              </Tab>
            ))}
          </TabList>
          {files.map((file) => (
            <TabPanel key={file.name} value={file.name}>
              <CodeBlock code={file.code} language={file.language} title={file.name} lineNumbers maxHeight={560} />
            </TabPanel>
          ))}
        </Tabs>
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }} id="acessibilidade">
        <Prose>
          <p>
            <T
              pt="O que este modelo já resolve — confira de novo ao adaptar para o seu produto:"
              en="What this template already gets right — check again when adapting it to your product:"
            />
          </p>
        </Prose>
        <DefinitionTable
          rows={a11y.map((item) => ({
            term: item.criteria
              ? { pt: `${item.topic.pt} (${item.criteria})`, en: `${item.topic.en} (${item.criteria})` }
              : item.topic,
            description: item.description,
          }))}
        />
      </Section>
    </DocPage>
  )
}
