import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import { isPreOne } from '../../../version'
import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  DefinitionTable,
  DocPage,
  Prose,
  Section,
} from '../../../kit'
import { REPO_URL } from '../../registry'
import { Steps, TableWrap } from '../_shared/Blocks'

type Bump = 'patch' | 'minor' | 'major'

/** O que é (e o que não é) API pública. */
const surfaces: {
  surface: Localized<ReactNode>
  isPublic: boolean
  notes: Localized<ReactNode>
}[] = [
  {
    surface: { pt: 'Componentes, props e tipos', en: 'Components, props and types' },
    isPublic: true,
    notes: {
      pt: (
        <>
          Tudo o que sai de <Code>@orangesys/ui</Code>: nomes, props, valores aceitos (
          <Code>variant</Code>, <Code>size</Code>, <Code>tone</Code>), valores padrão, callbacks e
          suas assinaturas, tipos <Code>*Props</Code>.
        </>
      ),
      en: (
        <>
          Everything exported by <Code>@orangesys/ui</Code>: names, props, accepted values (
          <Code>variant</Code>, <Code>size</Code>, <Code>tone</Code>), defaults, callbacks and their
          signatures, <Code>*Props</Code> types.
        </>
      ),
    },
  },
  {
    surface: { pt: 'Comportamento documentado', en: 'Documented behavior' },
    isPublic: true,
    notes: {
      pt: 'Teclado, papéis e atributos ARIA, foco e anúncios descritos na seção Acessibilidade de cada componente.',
      en: 'Keyboard, ARIA roles and attributes, focus and announcements described in each component’s Accessibility section.',
    },
  },
  {
    surface: {
      pt: 'Hooks, providers, ícones e utilitários',
      en: 'Hooks, providers, icons and utilities',
    },
    isPublic: true,
    notes: {
      pt: (
        <>
          <Code>useControllableState</Code>, <Code>OrangeProvider</Code>, nomes de ícones (
          <Code>IconName</Code>), <Code>cx</Code>, <Code>buttonClassName</Code> e as chaves de
          mensagens (<Code>MessageKey</Code>).
        </>
      ),
      en: (
        <>
          <Code>useControllableState</Code>, <Code>OrangeProvider</Code>, icon names (
          <Code>IconName</Code>), <Code>cx</Code>, <Code>buttonClassName</Code> and message keys (
          <Code>MessageKey</Code>).
        </>
      ),
    },
  },
  {
    surface: { pt: 'Pontos de entrada', en: 'Entry points' },
    isPublic: true,
    notes: {
      pt: (
        <>
          <Code>@orangesys/ui</Code>, <Code>@orangesys/ui/styles.css</Code>, <Code>@orangesys/tokens</Code>,{' '}
          <Code>@orangesys/tokens/contrast</Code> e <Code>@orangesys/tokens/tokens.css</Code>. Imports
          profundos (<Code>@orangesys/ui/dist/…</Code>) não são suportados — o campo{' '}
          <Code>exports</Code> os bloqueia.
        </>
      ),
      en: (
        <>
          <Code>@orangesys/ui</Code>, <Code>@orangesys/ui/styles.css</Code>, <Code>@orangesys/tokens</Code>,{' '}
          <Code>@orangesys/tokens/contrast</Code> and <Code>@orangesys/tokens/tokens.css</Code>. Deep
          imports (<Code>@orangesys/ui/dist/…</Code>) are not supported — the <Code>exports</Code>{' '}
          field blocks them.
        </>
      ),
    },
  },
  {
    surface: {
      pt: 'Tokens --or-* e exports de @orangesys/tokens',
      en: '--or-* tokens and @orangesys/tokens exports',
    },
    isPublic: true,
    notes: {
      pt: 'Os nomes são API. Os valores (um tom, uma duração) podem ser refinados em uma minor, sempre mantendo o contraste AA.',
      en: 'Names are API. Values (a shade, a duration) may be refined in a minor, always keeping AA contrast.',
    },
  },
  {
    surface: { pt: 'Classes utilitárias documentadas', en: 'Documented utility classes' },
    isPublic: true,
    notes: {
      pt: (
        <>
          <Code>.or-visually-hidden</Code>, <Code>.or-visually-hidden-focusable</Code>,{' '}
          <Code>.or-eyebrow</Code>, <Code>.or-control</Code>, <Code>.or-control-frame</Code>,{' '}
          <Code>.or-theme-scope</Code> e as de movimento (<Code>.or-press</Code>,{' '}
          <Code>.or-lift</Code>, <Code>.or-nudge</Code>, <Code>.or-collapse</Code>,{' '}
          <Code>.or-motion-*</Code>…).
        </>
      ),
      en: (
        <>
          <Code>.or-visually-hidden</Code>, <Code>.or-visually-hidden-focusable</Code>,{' '}
          <Code>.or-eyebrow</Code>, <Code>.or-control</Code>, <Code>.or-control-frame</Code>,{' '}
          <Code>.or-theme-scope</Code> and the motion ones (<Code>.or-press</Code>,{' '}
          <Code>.or-lift</Code>, <Code>.or-nudge</Code>, <Code>.or-collapse</Code>,{' '}
          <Code>.or-motion-*</Code>…).
        </>
      ),
    },
  },
  {
    surface: { pt: 'Classes or-* de componentes', en: 'Component or-* classes' },
    isPublic: false,
    notes: {
      pt: (
        <>
          <Code>.or-button</Code>, <Code>.or-button__label</Code>, <Code>.or-button--primary</Code>:
          estrutura interna. Evitamos mudanças à toa e as listamos no changelog, mas podem mudar em
          uma minor. Para personalizar, use <Code>className</Code>, <Code>style</Code> e tokens.
        </>
      ),
      en: (
        <>
          <Code>.or-button</Code>, <Code>.or-button__label</Code>, <Code>.or-button--primary</Code>:
          internal structure. We avoid gratuitous changes and list them in the changelog, but they
          may change in a minor. To customize, use <Code>className</Code>, <Code>style</Code> and
          tokens.
        </>
      ),
    },
  },
  {
    surface: { pt: 'Variáveis --_*', en: '--_* variables' },
    isPublic: false,
    notes: {
      pt: (
        <>
          Variáveis privadas de cada componente (<Code>--_bg</Code>, <Code>--_size</Code>). Mudam
          sem aviso.
        </>
      ),
      en: (
        <>
          Private per-component variables (<Code>--_bg</Code>, <Code>--_size</Code>). They change
          without notice.
        </>
      ),
    },
  },
  {
    surface: { pt: 'DOM, data-* e keyframes', en: 'DOM, data-* and keyframes' },
    isPublic: false,
    notes: {
      pt: 'A estrutura de elementos, atributos data-* não documentados e nomes de animações podem mudar em qualquer versão.',
      en: 'Element structure, undocumented data-* attributes and animation names may change in any release.',
    },
  },
]

/** Que tipo de versão cada mudança exige (a partir da 1.0). */
const bumps: { change: Localized<ReactNode>; bump: Bump }[] = [
  {
    bump: 'patch',
    change: { pt: 'Correção de bug sem mudar a API.', en: 'Bug fix that keeps the API.' },
  },
  {
    bump: 'patch',
    change: {
      pt: 'Correção de acessibilidade, mesmo que mude atributos ARIA ou a estrutura interna do DOM.',
      en: 'Accessibility fix, even if it changes ARIA attributes or the internal DOM structure.',
    },
  },
  {
    bump: 'patch',
    change: {
      pt: (
        <>
          Mudança em classes de componente, variáveis <Code>--_*</Code> ou estilos internos.
        </>
      ),
      en: (
        <>
          Change to component classes, <Code>--_*</Code> variables or internal styles.
        </>
      ),
    },
  },
  {
    bump: 'minor',
    change: {
      pt: (
        <>
          Componente, hook, prop opcional, token ou valor novo numa união (
          <Code>variant="soft"</Code>).
        </>
      ),
      en: (
        <>
          New component, hook, optional prop, token or union value (<Code>variant="soft"</Code>).
        </>
      ),
    },
  },
  {
    bump: 'minor',
    change: {
      pt: 'Depreciação: a API antiga continua funcionando, com aviso.',
      en: 'Deprecation: the old API keeps working, with a warning.',
    },
  },
  {
    bump: 'minor',
    change: {
      pt: 'Refinamento de valores de tokens (cor, sombra, duração) mantendo nomes e contraste AA.',
      en: 'Refined token values (color, shadow, duration) keeping names and AA contrast.',
    },
  },
  {
    bump: 'minor',
    change: { pt: 'Suporte a uma nova major do React.', en: 'Support for a new React major.' },
  },
  {
    bump: 'major',
    change: {
      pt: (
        <>
          Remover ou renomear componente, prop, valor, export, token <Code>--or-*</Code>, classe
          utilitária documentada ou ponto de entrada.
        </>
      ),
      en: (
        <>
          Removing or renaming a component, prop, value, export, <Code>--or-*</Code> token,
          documented utility class or entry point.
        </>
      ),
    },
  },
  {
    bump: 'major',
    change: {
      pt: 'Mudar o padrão de uma prop, tornar uma prop obrigatória ou mudar a assinatura de um callback.',
      en: 'Changing a prop’s default, making a prop required or changing a callback signature.',
    },
  },
  {
    bump: 'major',
    change: {
      pt: 'Restringir um tipo exportado (código que compilava deixa de compilar).',
      en: 'Narrowing an exported type (code that compiled stops compiling).',
    },
  },
  {
    bump: 'major',
    change: {
      pt: 'Deixar de suportar uma versão do React, do Node.js ou um navegador da lista de suporte.',
      en: 'Dropping support for a React or Node.js version, or a browser on the support list.',
    },
  },
]

const deprecateCode = `import { forwardRef } from 'react'
import { deprecate } from '../../utils'

export interface FooProps {
  onClose?: () => void
  /** @deprecated Use \`onClose\`. Sai na v1.0. */
  onDismiss?: () => void
}

export const Foo = forwardRef<HTMLDivElement, FooProps>(function Foo({ onClose, onDismiss, ...rest }, ref) {
  if (onDismiss !== undefined) {
    deprecate('Foo: \`onDismiss\` está depreciado e sai na v1.0. Use \`onClose\`.', 'foo.onDismiss')
  }
  const handleClose = onClose ?? onDismiss
  // …
})`

const metaCode = `export const meta: ComponentMeta = {
  slug: 'foo',
  name: 'Foo',
  category: 'feedback',
  description: { pt: '…', en: '…' },
  status: 'deprecated',
  deprecation: { replacement: 'bar', since: '0.5.0', removal: '1.0.0' },
}`

const changesetCode = `---
'@orangesys/ui': minor
---

Depreciado: a prop \`onDismiss\` do \`Foo\` — use \`onClose\` (mesma assinatura). Sai na v1.0.`

export default function VersioningPage() {
  const { t, to } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: 'Usando', en: 'Usage' }}
      title={{ pt: 'Versionamento e depreciação', en: 'Versioning and deprecation' }}
      lead={{
        pt: 'O que é API pública, que tipo de versão cada mudança exige e como algo é depreciado antes de sair. Atualize sem medo: nada público some sem aviso.',
        en: 'What counts as public API, which kind of release each change needs and how something is deprecated before it goes away. Upgrade with confidence: nothing public disappears without notice.',
      }}
    >
      <Section title={{ pt: 'Resumo', en: 'At a glance' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  O Orange segue o{' '}
                  <a href="https://semver.org/lang/pt-BR/">Versionamento Semântico</a>:{' '}
                  <Code>MAJOR.MINOR.PATCH</Code>. <Code>@orangesys/tokens</Code> e{' '}
                  <Code>@orangesys/ui</Code> saem sempre juntos, com o mesmo número de versão.
                </>
              ),
              en: (
                <>
                  Orange follows <a href="https://semver.org/">Semantic Versioning</a>:{' '}
                  <Code>MAJOR.MINOR.PATCH</Code>. <Code>@orangesys/tokens</Code> and{' '}
                  <Code>@orangesys/ui</Code> always ship together, with the same version number.
                </>
              ),
            },
            {
              pt: 'Nada público é removido de surpresa: primeiro vem a depreciação em uma minor, com aviso no console em desenvolvimento e selo na documentação. A remoção só acontece na major seguinte.',
              en: 'Nothing public is removed by surprise: first comes a deprecation in a minor, with a development-only console warning and a docs badge. Removal only happens in the next major.',
            },
            {
              pt: (
                <>
                  Toda mudança nos pacotes chega com um changeset, que gera o{' '}
                  <Code>CHANGELOG.md</Code> de cada pacote, as notas da release no GitHub e alimenta
                  a página <Link to={to('/changelog')}>Novidades</Link>.
                </>
              ),
              en: (
                <>
                  Every package change comes with a changeset, which generates each package’s{' '}
                  <Code>CHANGELOG.md</Code> and the GitHub release notes, and feeds the{' '}
                  <Link to={to('/changelog')}>Changelog</Link> page.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'O que é API pública', en: 'What is public API' }}>
        <Prose>
          <p>
            <T
              pt="Só a API pública segue as regras desta página. O resto é detalhe de implementação: evitamos mudanças desnecessárias, mas não prometemos estabilidade."
              en="Only the public API follows the rules on this page. Everything else is an implementation detail: we avoid needless changes, but promise no stability."
            />
          </p>
        </Prose>
        <TableWrap label={{ pt: 'API pública e interna', en: 'Public and internal API' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Superfície', en: 'Surface' })}</th>
                <th scope="col">{t({ pt: 'Pública?', en: 'Public?' })}</th>
                <th scope="col">{t({ pt: 'Detalhes', en: 'Details' })}</th>
              </tr>
            </thead>
            <tbody>
              {surfaces.map((row, i) => (
                <tr key={i}>
                  <th scope="row">{t(row.surface)}</th>
                  <td>{row.isPublic ? t({ pt: 'Sim', en: 'Yes' }) : t({ pt: 'Não', en: 'No' })}</td>
                  <td>{t(row.notes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Section>

      <Section
        title={{ pt: 'Que versão cada mudança exige', en: 'Which release each change needs' }}
      >
        <TableWrap label={{ pt: 'Mudanças e tipo de versão', en: 'Changes and release type' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Mudança', en: 'Change' })}</th>
                <th scope="col">{t({ pt: 'Versão', en: 'Release' })}</th>
              </tr>
            </thead>
            <tbody>
              {bumps.map((row, i) => (
                <tr key={i}>
                  <td>{t(row.change)}</td>
                  <td>
                    <Code>{row.bump}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <Callout tone="info" title={{ pt: 'Componentes Beta', en: 'Beta components' }}>
          <p>
            <T
              pt="Componentes marcados como Beta ainda estão consolidando a API e podem mudar em uma minor — sempre com changeset explicando a migração."
              en="Components marked Beta are still settling their API and may change in a minor — always with a changeset explaining the migration."
            />
          </p>
        </Callout>
      </Section>

      <Section title={isPreOne ? { pt: 'Antes da 1.0', en: 'Before 1.0' } : { pt: 'A série 0.x', en: 'The 0.x series' }}>
        <Prose>
          {!isPreOne && (
            <p>
              <T
                pt="Desde a 1.0.0 vale a tabela acima: mudanças incompatíveis só numa nova major. Antes dela, as regras eram estas:"
                en="Since 1.0.0 the table above applies: breaking changes only in a new major. Before it, the rules were these:"
              />
            </p>
          )}
          <p>
            <T
              pt={
                <>
                  O Orange {isPreOne ? 'está' : 'esteve'} na série 0.x. Nela, o npm já trata a minor como major:{' '}
                  <Code>^0.4.0</Code> aceita a 0.4.1, mas não a 0.5.0. Por isso, até a 1.0, a{' '}
                  <strong>minor faz o papel da major</strong>: patch traz correções; minor traz
                  novidades e, quando inevitável, mudanças incompatíveis — sempre depois de uma
                  depreciação publicada em uma minor anterior. O changeset <Code>major</Code> fica
                  reservado para lançar a 1.0.
                </>
              }
              en={
                <>
                  Orange {isPreOne ? 'is' : 'was'} in the 0.x series. There, npm already treats the minor as the major:{' '}
                  <Code>^0.4.0</Code> accepts 0.4.1 but not 0.5.0. So until 1.0 the{' '}
                  <strong>minor plays the role of the major</strong>: patches bring fixes; minors
                  bring features and, when unavoidable, breaking changes — always after a
                  deprecation shipped in an earlier minor. The <Code>major</Code> changeset is
                  reserved for releasing 1.0.
                </>
              }
            />
          </p>
          <p>
            <T
              pt="Exemplo: depreciado na 0.5.0, com aviso durante toda a 0.5.x, removível a partir da 0.6.0."
              en="Example: deprecated in 0.5.0, warning throughout 0.5.x, removable from 0.6.0 on."
            />
          </p>
        </Prose>
      </Section>

      <Section title={{ pt: 'Ciclo de depreciação', en: 'Deprecation lifecycle' }}>
        <Steps
          items={[
            {
              title: { pt: 'Depreciar — em uma minor', en: 'Deprecate — in a minor' },
              content: (
                <Bullets
                  items={[
                    {
                      pt: (
                        <>
                          Tag <Code>@deprecated</Code> no JSDoc com o substituto e a versão de
                          remoção: o editor risca o nome e mostra a dica.
                        </>
                      ),
                      en: (
                        <>
                          A <Code>@deprecated</Code> JSDoc tag naming the replacement and the
                          removal version: editors strike the name through and show the hint.
                        </>
                      ),
                    },
                    {
                      pt: (
                        <>
                          <Code>deprecate(mensagem, id)</Code> quando a API antiga é usada: aviso no
                          console só em desenvolvimento, uma vez por id. Em produção o código some
                          do bundle.
                        </>
                      ),
                      en: (
                        <>
                          <Code>deprecate(message, id)</Code> when the old API is used: a console
                          warning in development only, once per id. In production the code is
                          stripped from the bundle.
                        </>
                      ),
                    },
                    {
                      pt: 'Selo "Depreciado" na página do componente, com link para o substituto.',
                      en: 'A "Deprecated" badge on the component page, linking to the replacement.',
                    },
                    {
                      pt: 'Changeset minor começando com "Depreciado:" e a nota de migração — ou um codemod, quando a troca é mecânica e atinge muitos arquivos.',
                      en: 'A minor changeset starting with "Depreciado:" (Deprecated) and the migration note — or a codemod, when the change is mechanical and touches many files.',
                    },
                  ]}
                />
              ),
            },
            {
              title: { pt: 'Conviver — pelo menos uma minor', en: 'Coexist — at least one minor' },
              content: (
                <p>
                  <T
                    pt="A API antiga e a nova funcionam lado a lado, as duas cobertas por testes. Ninguém precisa migrar no mesmo dia em que atualiza."
                    en="The old and the new API work side by side, both covered by tests. Nobody has to migrate on the day they upgrade."
                  />
                </p>
              ),
            },
            {
              title: {
                pt: 'Remover — só na major seguinte',
                en: 'Remove — only in the next major',
              },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Changeset <Code>major</Code> (<Code>minor</Code> na série 0.x) começando com{' '}
                        <strong>Incompatível:</strong> e com o passo a passo da migração. A remoção
                        aparece em destaque na página Novidades.
                      </>
                    }
                    en={
                      <>
                        A <Code>major</Code> changeset (<Code>minor</Code> in the 0.x series)
                        starting with <strong>Incompatível:</strong> (Breaking) and the migration
                        steps. The removal is highlighted on the Changelog page.
                      </>
                    }
                  />
                </p>
              ),
            },
          ]}
        />
        <CodeBlock
          code={deprecateCode}
          language="tsx"
          title="packages/ui/src/components/Foo/Foo.tsx"
        />
        <CodeBlock
          code={metaCode}
          language="ts"
          title="apps/docs/src/content/components/foo/meta.ts"
        />
        <CodeBlock code={changesetCode} language="markup" title=".changeset/foo-on-dismiss.md" />
        <Callout tone="warning" title={{ pt: 'Exceções', en: 'Exceptions' }}>
          <p>
            <T
              pt="Falhas de segurança e falhas graves de acessibilidade (WCAG A/AA) podem ser corrigidas em qualquer versão, mesmo que o comportamento mude. Essas correções são sempre anunciadas no changelog."
              en="Security issues and serious accessibility failures (WCAG A/AA) may be fixed in any release, even if behavior changes. These fixes are always announced in the changelog."
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Janela de suporte', en: 'Support window' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Major atual', en: 'Current major' },
              description: {
                pt: 'Novidades, correções e segurança.',
                en: 'Features, fixes and security.',
              },
            },
            {
              term: { pt: 'Major anterior', en: 'Previous major' },
              description: {
                pt: 'Correções de segurança e de acessibilidade críticas por 6 meses após o lançamento da nova major.',
                en: 'Security and critical accessibility fixes for 6 months after the new major ships.',
              },
            },
            {
              term: { pt: 'Série 0.x', en: '0.x series' },
              description: isPreOne
                ? {
                    pt: 'Só a minor mais recente recebe correções. Atualize para a última 0.y antes de reportar um bug.',
                    en: 'Only the latest minor gets fixes. Upgrade to the latest 0.y before reporting a bug.',
                  }
                : {
                    pt: 'Encerrada com a 1.0.0: não recebe mais correções. Migre seguindo o changelog da 1.0.',
                    en: 'Closed with 1.0.0: no more fixes. Migrate following the 1.0 changelog.',
                  },
            },
            {
              term: { pt: 'React', en: 'React' },
              description: {
                pt: (
                  <>
                    As majors em <Code>peerDependencies</Code>: hoje <Code>^18.2.0 || ^19.0.0</Code>
                    . Uma major nova do React entra em uma minor; deixar de suportar uma é major.
                  </>
                ),
                en: (
                  <>
                    The majors in <Code>peerDependencies</Code>: currently{' '}
                    <Code>^18.2.0 || ^19.0.0</Code>. A new React major is added in a minor; dropping
                    one is a major.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Navegadores', en: 'Browsers' },
              description: {
                pt: 'As duas últimas versões de Chrome, Edge, Firefox e Safari.',
                en: 'The last two versions of Chrome, Edge, Firefox and Safari.',
              },
            },
            {
              term: { pt: 'Node.js', en: 'Node.js' },
              description: {
                pt: (
                  <>
                    <Code>{'>=18'}</Code> para SSR e ferramentas que leem os pacotes (campo{' '}
                    <Code>engines</Code>).
                  </>
                ),
                en: (
                  <>
                    <Code>{'>=18'}</Code> for SSR and tools that read the packages (
                    <Code>engines</Code> field).
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Como anunciamos mudanças', en: 'How changes are announced' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Cada PR que muda <Code>@orangesys/tokens</Code> ou <Code>@orangesys/ui</Code> traz um
                  changeset (<Code>pnpm changeset</Code>). Ao entrar em <Code>main</Code>, ele vai
                  para o PR "Versionar pacotes"; no merge, vira entrada no <Code>CHANGELOG.md</Code>{' '}
                  e na release do GitHub.
                </>
              ),
              en: (
                <>
                  Every PR that changes <Code>@orangesys/tokens</Code> or <Code>@orangesys/ui</Code>{' '}
                  includes a changeset (<Code>pnpm changeset</Code>). Once on <Code>main</Code>, it
                  goes into the "Versionar pacotes" (Version packages) PR; on merge, it becomes an
                  entry in <Code>CHANGELOG.md</Code> and in the GitHub release.
                </>
              ),
            },
            {
              pt: (
                <>
                  Mudanças incompatíveis começam com <strong>Incompatível:</strong> e trazem a
                  migração; ficam no topo das notas da versão.
                </>
              ),
              en: (
                <>
                  Breaking changes start with <strong>Incompatível:</strong> (Breaking) and include
                  the migration; they sit at the top of the release notes.
                </>
              ),
            },
            {
              pt: 'Depreciações começam com "Depreciado:", aparecem no console em desenvolvimento e ganham selo na documentação.',
              en: 'Deprecations start with "Depreciado:" (Deprecated), show up in the console during development and get a badge in the docs.',
            },
            {
              pt: (
                <>
                  A página <Link to={to('/changelog')}>Novidades</Link> resume cada versão em
                  português e inglês.
                </>
              ),
              en: (
                <>
                  The <Link to={to('/changelog')}>Changelog</Link> page summarizes every release in
                  Portuguese and English.
                </>
              ),
            },
          ]}
        />
        <Prose>
          <p>
            <T
              pt={
                <>
                  Para quem contribui: o passo a passo está nas seções Versionamento e Publicação do{' '}
                  <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>.
                </>
              }
              en={
                <>
                  For contributors: the step-by-step lives in the Versionamento (Versioning) and
                  Publicação (Publishing) sections of{' '}
                  <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>.
                </>
              }
            />
          </p>
        </Prose>
      </Section>
    </DocPage>
  )
}
