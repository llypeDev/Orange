import { iconNames, ptBR } from '@orange/ui'
import { primitives, themes } from '@orange/tokens'
import { T, useLang } from '../../i18n'
import { Bullets, Callout, Code, DefinitionTable, DocPage, Prose, Section } from '../../kit'
import { componentMetas, REPO_URL, STORYBOOK_URL } from '../registry'
import { Cards, Stats, Steps, TableWrap } from './_shared/Blocks'

const paletteCount = Object.values(primitives).reduce(
  (sum, family) => sum + Object.keys(family).length,
  0,
)

type RoadmapItemState = 'done' | 'external'

const roadmap: {
  version: string
  status: 'done' | 'now' | 'next' | 'later'
  items: { pt: string; en: string; state?: RoadmapItemState; note?: { pt: string; en: string } }[]
}[] = [
  {
    version: '0.1',
    status: 'done',
    items: [
      {
        pt: 'Tokens com temas claro e escuro e testes de contraste',
        en: 'Tokens with light and dark themes and contrast tests',
        state: 'done',
      },
      {
        pt: 'Componentes base, hooks, ícones e OrangeProvider',
        en: 'Base components, hooks, icons and OrangeProvider',
        state: 'done',
      },
      {
        pt: 'Documentação bilíngue e Storybook com painel a11y',
        en: 'Bilingual docs and Storybook with a11y panel',
        state: 'done',
      },
    ],
  },
  {
    version: '0.2',
    status: 'done',
    items: [
      {
        pt: 'Biblioteca completa de formulários, sobreposições e navegação',
        en: 'Full set of form, overlay and navigation components',
        state: 'done',
      },
      {
        pt: 'Exemplos de páginas inteiras (login, painel, configurações)',
        en: 'Full-page examples (sign-in, dashboard, settings)',
        state: 'done',
        note: { pt: 'Seção Modelos da documentação.', en: 'Templates section of the docs.' },
      },
      {
        pt: 'Publicação dos pacotes no npm com changelog automatizado',
        en: 'npm publishing with an automated changelog',
        state: 'done',
        note: {
          pt: 'Changesets + workflow de release; a primeira publicação sai quando o token do npm for configurado.',
          en: 'Changesets + release workflow; the first publish runs once the npm token is configured.',
        },
      },
    ],
  },
  {
    version: '0.3',
    status: 'done',
    items: [
      {
        pt: 'Tema de alto contraste e suporte a forced-colors',
        en: 'High-contrast theme and forced-colors support',
        state: 'done',
        note: {
          pt: 'Temas dark-hc e light-hc (AAA) e forced-colors em todos os componentes.',
          en: 'dark-hc and light-hc themes (AAA) and forced-colors in every component.',
        },
      },
      {
        pt: 'Sincronização dos tokens com variáveis do Figma',
        en: 'Token sync with Figma variables',
        state: 'done',
        note: { pt: 'Exportação DTCG por modo e o script figma:sync.', en: 'Per-mode DTCG export and the figma:sync script.' },
      },
      {
        pt: 'Testes de regressão visual dos dois temas',
        en: 'Visual regression tests for both themes',
        state: 'done',
        note: { pt: 'Playwright no CI, com baselines geradas no próprio CI.', en: 'Playwright in CI, with baselines generated in CI itself.' },
      },
    ],
  },
  {
    version: '1.0',
    status: 'now',
    items: [
      {
        pt: 'API estável com política formal de depreciação',
        en: 'Stable API with a formal deprecation policy',
        state: 'done',
        note: {
          pt: 'Política e ferramentas prontas; a API é congelada no lançamento da 1.0.',
          en: 'Policy and tooling in place; the API freezes when 1.0 ships.',
        },
      },
      {
        pt: 'Auditoria externa de acessibilidade (WCAG 2.2 AA)',
        en: 'External accessibility audit (WCAG 2.2 AA)',
        state: 'external',
        note: {
          pt: 'Relatório de conformidade pronto para os auditores; a auditoria depende de contratação.',
          en: 'Conformance report ready for auditors; the audit itself needs to be commissioned.',
        },
      },
      {
        pt: 'Kit de design espelhando os tokens',
        en: 'Design kit mirroring the tokens',
        state: 'external',
        note: {
          pt: 'As variáveis já chegam ao Figma; os componentes do kit são desenhados no próprio Figma.',
          en: 'The variables already reach Figma; the kit components are drawn in Figma itself.',
        },
      },
    ],
  },
]

const itemStateLabel: Record<RoadmapItemState, { pt: string; en: string }> = {
  done: { pt: 'Pronto', en: 'Done' },
  external: { pt: 'Depende de terceiros', en: 'Depends on third parties' },
}

const statusLabel = {
  done: { pt: 'Lançado', en: 'Shipped' },
  now: { pt: 'Em andamento', en: 'In progress' },
  next: { pt: 'Próximo', en: 'Next' },
  later: { pt: 'Planejado', en: 'Planned' },
}

export default function About() {
  const { t } = useLang()
  return (
    <DocPage
      hero={{
        stats: [
          { value: componentMetas.length, label: { pt: 'componentes documentados', en: 'documented components' } },
          { value: iconNames.length, label: { pt: 'ícones na mesma grade', en: 'icons on the same grid' } },
          { value: Object.keys(ptBR).length, label: { pt: 'mensagens traduzidas PT/EN', en: 'translated PT/EN messages' } },
          { value: Object.keys(themes).length, label: { pt: 'temas, com alto contraste', en: 'themes, high contrast included' } },
        ],
      }}
      eyebrow={{ pt: 'Orange', en: 'Orange' }}
      title={{ pt: 'Sobre o Orange', en: 'About Orange' }}
      lead={{
        pt: 'Um design system open source para construir interfaces acessíveis com React: tokens, componentes, hooks, guias e Storybook, mantidos juntos e testados juntos.',
        en: 'An open source design system for building accessible interfaces with React: tokens, components, hooks, guides and Storybook — kept together and tested together.',
      }}
    >
      <Section title={{ pt: 'O que é o Orange', en: 'What Orange is' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  O Orange reúne em um único repositório tudo o que uma equipe precisa para entregar
                  telas consistentes: os <strong>tokens</strong> (<Code>@orange/tokens</Code>) que
                  definem cor, tipografia, espaço e movimento; os <strong>componentes React</strong>{' '}
                  (<Code>@orange/ui</Code>) que consomem esses tokens; os <strong>hooks</strong> de
                  acessibilidade usados para construí-los; e esta documentação, que é escrita com os
                  próprios componentes.
                </>
              }
              en={
                <>
                  Orange brings into a single repository everything a team needs to ship consistent
                  screens: the <strong>tokens</strong> (<Code>@orange/tokens</Code>) defining color,
                  type, space and motion; the <strong>React components</strong> (
                  <Code>@orange/ui</Code>) that consume them; the accessibility{' '}
                  <strong>hooks</strong> used to build them; and this documentation, written with
                  the components themselves.
                </>
              }
            />
          </p>
          <p>
            <T
              pt="A linguagem visual é geométrica e contida: fundo carvão, texto creme, um único acento laranja, cantos retos, bordas de 1px e grade explícita. A restrição é intencional — menos decisões visuais por tela significam mais atenção ao conteúdo e menos chances de errar contraste, hierarquia ou foco."
              en="The visual language is geometric and restrained: charcoal background, cream text, a single orange accent, square corners, 1px borders and an explicit grid. The restraint is deliberate — fewer visual decisions per screen mean more attention on content and fewer chances to get contrast, hierarchy or focus wrong."
            />
          </p>
        </Prose>
        <Stats
          items={[
            {
              value: componentMetas.length,
              label: { pt: 'componentes documentados', en: 'documented components' },
            },
            {
              value: Object.keys(themes.dark).length,
              label: {
                pt: 'tokens semânticos de cor por tema',
                en: 'semantic color tokens per theme',
              },
            },
            {
              value: paletteCount,
              label: { pt: 'cores primitivas em 7 paletas', en: 'primitive colors in 7 palettes' },
            },
            {
              value: iconNames.length,
              label: { pt: 'ícones na grade de 24px', en: 'icons on the 24px grid' },
            },
            {
              value: Object.keys(ptBR).length,
              label: { pt: 'mensagens internas em PT e EN', en: 'internal messages in PT and EN' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Princípios', en: 'Principles' }}>
        <Cards
          columns={3}
          items={[
            {
              icon: 'accessibility',
              eyebrow: { pt: 'Princípio 01', en: 'Principle 01' },
              title: { pt: 'Acessível por padrão', en: 'Accessible by default' },
              text: {
                pt: 'WCAG 2.2 AA é requisito de entrada, não revisão no fim. HTML semântico primeiro, ARIA só quando necessário, foco sempre visível e teclado completo em todos os componentes.',
                en: 'WCAG 2.2 AA is an entry requirement, not a final review. Semantic HTML first, ARIA only when needed, focus always visible and full keyboard support in every component.',
              },
            },
            {
              icon: 'grid',
              eyebrow: { pt: 'Princípio 02', en: 'Principle 02' },
              title: { pt: 'Geométrico', en: 'Geometric' },
              text: {
                pt: 'Cantos retos, bordas de 1px, ícones com terminações quadradas e uma grade de 12 colunas. Estrutura visível que organiza sem decorar.',
                en: 'Square corners, 1px borders, square-capped icons and a 12-column grid. Visible structure that organizes without decorating.',
              },
            },
            {
              icon: 'layers',
              eyebrow: { pt: 'Princípio 03', en: 'Principle 03' },
              title: { pt: 'Tokens como contrato', en: 'Tokens as a contract' },
              text: {
                pt: (
                  <>
                    Nenhum componente usa cor, medida ou duração soltas: tudo vem de{' '}
                    <code>var(--or-*)</code>. Trocar um token muda o sistema inteiro — e os testes
                    de contraste protegem a troca.
                  </>
                ),
                en: (
                  <>
                    No component uses a raw color, size or duration: everything comes from{' '}
                    <code>var(--or-*)</code>. Changing a token changes the whole system — and the
                    contrast tests guard the change.
                  </>
                ),
              },
            },
            {
              icon: 'globe',
              eyebrow: { pt: 'Princípio 04', en: 'Principle 04' },
              title: { pt: 'Bilíngue', en: 'Bilingual' },
              text: {
                pt: 'Documentação inteira em português e inglês, e mensagens internas dos componentes (como “Fechar” e “Próxima página”) em pt-BR e en-US, sobrescrevíveis pelo provider.',
                en: 'The entire documentation in Portuguese and English, and internal component messages (such as “Close” and “Next page”) in pt-BR and en-US, overridable through the provider.',
              },
            },
            {
              icon: 'code',
              eyebrow: { pt: 'Princípio 05', en: 'Principle 05' },
              title: { pt: 'Open source', en: 'Open source' },
              text: {
                pt: 'Licença MIT, código no GitHub e decisões documentadas. Sem CSS-in-JS nem dependências pesadas: React, CSS puro e Floating UI para posicionamento.',
                en: 'MIT license, code on GitHub and documented decisions. No CSS-in-JS and no heavy dependencies: React, plain CSS and Floating UI for positioning.',
              },
            },
            {
              icon: 'zap',
              eyebrow: { pt: 'Na prática', en: 'In practice' },
              title: { pt: 'Previsível', en: 'Predictable' },
              text: {
                pt: (
                  <>
                    As mesmas props significam a mesma coisa em todo lugar: <code>size</code>{' '}
                    (32/40/48px), <code>variant</code>, <code>tone</code>, <code>value</code>/
                    <code>defaultValue</code>/<code>onChange</code>.
                  </>
                ),
                en: (
                  <>
                    The same props mean the same thing everywhere: <code>size</code> (32/40/48px),{' '}
                    <code>variant</code>, <code>tone</code>, <code>value</code>/
                    <code>defaultValue</code>/<code>onChange</code>.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Como um componente é construído', en: 'How a component is built' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Todo componente segue o mesmo roteiro, descrito no{' '}
                  <a
                    href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    CONTRIBUTING.md
                  </a>
                  . O <Code>Button</Code> é a implementação de referência.
                </>
              }
              en={
                <>
                  Every component follows the same path, described in{' '}
                  <a
                    href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    CONTRIBUTING.md
                  </a>
                  . <Code>Button</Code> is the reference implementation.
                </>
              }
            />
          </p>
        </Prose>
        <Steps
          items={[
            {
              title: { pt: 'Padrão e semântica', en: 'Pattern and semantics' },
              content: (
                <p>
                  <T
                    pt="Escolhemos o elemento HTML nativo e, quando não existe, o padrão do WAI-ARIA Authoring Practices — incluindo o mapa de teclado completo."
                    en="We pick the native HTML element and, when none exists, the WAI-ARIA Authoring Practices pattern — including the full keyboard map."
                  />
                </p>
              ),
            },
            {
              title: { pt: 'CSS com tokens', en: 'CSS with tokens' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Um arquivo por componente, prefixo <Code>or-</Code> e BEM. Estados via
                        atributos (<Code>[aria-expanded='true']</Code>, <Code>[data-state]</Code>),
                        nunca classes de estado soltas.
                      </>
                    }
                    en={
                      <>
                        One file per component, <Code>or-</Code> prefix and BEM. States through
                        attributes (<Code>[aria-expanded='true']</Code>, <Code>[data-state]</Code>),
                        never loose state classes.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'API React consistente', en: 'Consistent React API' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        <Code>forwardRef</Code> no elemento interativo, <Code>...rest</Code>{' '}
                        repassado, estado controlado e não controlado com{' '}
                        <Code>useControllableState</Code>, textos internos via{' '}
                        <Code>useLocale().t()</Code>.
                      </>
                    }
                    en={
                      <>
                        <Code>forwardRef</Code> on the interactive element, <Code>...rest</Code>{' '}
                        forwarded, controlled and uncontrolled state with{' '}
                        <Code>useControllableState</Code>, internal text via{' '}
                        <Code>useLocale().t()</Code>.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Testes, stories e documentação', en: 'Tests, stories and docs' },
              content: (
                <p>
                  <T
                    pt="Testes de comportamento, teclado e axe; stories para cada variação; e uma página bilíngue com boas práticas, exemplos ao vivo, props e acessibilidade."
                    en="Behavior, keyboard and axe tests; stories for every variation; and a bilingual page with best practices, live examples, props and accessibility."
                  />
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Como testamos', en: 'How we test' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Testing Library', en: 'Testing Library' },
              description: {
                pt: (
                  <>
                    Vitest + <Code>@testing-library/react</Code> + <Code>user-event</Code>. Os
                    testes consultam pela função acessível (<Code>getByRole</Code>) e exercitam
                    mouse e teclado — se o leitor de tela não encontra, o teste também não.
                  </>
                ),
                en: (
                  <>
                    Vitest + <Code>@testing-library/react</Code> + <Code>user-event</Code>. Tests
                    query by accessible role (<Code>getByRole</Code>) and exercise mouse and
                    keyboard — if a screen reader can't find it, neither can the test.
                  </>
                ),
              },
            },
            {
              term: { pt: 'axe-core', en: 'axe-core' },
              description: {
                pt: (
                  <>
                    Cada componente roda <Code>expectNoA11yViolations(container)</Code>, que falha
                    com a lista de violações. A regra de contraste fica desligada no jsdom (sem
                    layout real) e é coberta pelos testes de tokens.
                  </>
                ),
                en: (
                  <>
                    Every component runs <Code>expectNoA11yViolations(container)</Code>, which fails
                    with the list of violations. The contrast rule is off in jsdom (no real layout)
                    and is covered by the token tests.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Contraste dos tokens', en: 'Token contrast' },
              description: {
                pt: (
                  <>
                    <Code>contrast.test.ts</Code> verifica, nos quatro temas, os pares de texto (≥
                    4.5:1; ≥ 7:1 nos de alto contraste) e de elementos de interface (≥ 3:1). Mudar
                    um token que quebre o contraste quebra o build.
                  </>
                ),
                en: (
                  <>
                    <Code>contrast.test.ts</Code> checks, in all four themes, the text pairs (≥
                    4.5:1; ≥ 7:1 in the high-contrast ones) and UI pairs (≥ 3:1). Changing a token
                    in a way that breaks contrast breaks the build.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Storybook a11y', en: 'Storybook a11y' },
              description: {
                pt: (
                  <>
                    O addon de acessibilidade roda o axe com layout real em cada story, com as tags
                    WCAG 2.0, 2.1 e 2.2 A/AA, e está configurado com <Code>test: 'error'</Code>.
                  </>
                ),
                en: (
                  <>
                    The accessibility addon runs axe with real layout on every story, with the WCAG
                    2.0, 2.1 and 2.2 A/AA tags, configured with <Code>test: 'error'</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Tipos e lint', en: 'Types and lint' },
              description: {
                pt: (
                  <>
                    TypeScript strict e ESLint com <Code>jsx-a11y</Code> e <Code>react-hooks</Code>.
                    O CI do GitHub Actions roda gen → typecheck → lint → test → build a cada push.
                  </>
                ),
                en: (
                  <>
                    Strict TypeScript and ESLint with <Code>jsx-a11y</Code> and{' '}
                    <Code>react-hooks</Code>. GitHub Actions CI runs gen → typecheck → lint → test →
                    build on every push.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Revisão manual', en: 'Manual review' },
              description: {
                pt: 'Teclado, zoom de 200%, movimento reduzido e leitores de tela (NVDA, VoiceOver). Ferramentas automáticas pegam só parte dos problemas; ordem de leitura, clareza e fluxo exigem gente.',
                en: 'Keyboard, 200% zoom, reduced motion and screen readers (NVDA, VoiceOver). Automated tools catch only part of the issues; reading order, clarity and flow take people.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Versionamento', en: 'Versioning' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Os pacotes seguem o{' '}
                  <a href="https://semver.org/lang/pt-BR/" target="_blank" rel="noreferrer">
                    Versionamento Semântico
                  </a>{' '}
                  e são versionados juntos. Versão atual: <strong>0.1.0</strong>. Enquanto
                  estivermos em <Code>0.x</Code>, versões minor podem trazer mudanças incompatíveis
                  — sempre listadas no changelog com o caminho de migração.
                </>
              }
              en={
                <>
                  Packages follow{' '}
                  <a href="https://semver.org/" target="_blank" rel="noreferrer">
                    Semantic Versioning
                  </a>{' '}
                  and are versioned together. Current version: <strong>0.1.0</strong>. While on{' '}
                  <Code>0.x</Code>, minor versions may include breaking changes — always listed in
                  the changelog with a migration path.
                </>
              }
            />
          </p>
        </Prose>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <strong>Incompatível (major):</strong> remover ou renomear um componente, prop,
                  token <Code>--or-*</Code>, classe <Code>.or-*</Code> pública ou chave de mensagem.
                </>
              ),
              en: (
                <>
                  <strong>Breaking (major):</strong> removing or renaming a component, prop,{' '}
                  <Code>--or-*</Code> token, public <Code>.or-*</Code> class or message key.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Nova funcionalidade (minor):</strong> novos componentes, props opcionais,
                  tokens ou mensagens.
                </>
              ),
              en: (
                <>
                  <strong>Feature (minor):</strong> new components, optional props, tokens or
                  messages.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Correção (patch):</strong> bugs, ajustes de valores de token que mantêm o
                  contraste, melhorias de acessibilidade sem mudança de API.
                </>
              ),
              en: (
                <>
                  <strong>Fix (patch):</strong> bugs, token value tweaks that keep contrast,
                  accessibility improvements without API changes.
                </>
              ),
            },
            {
              pt: (
                <>
                  Antes de remover algo, marcamos com <Code>@deprecated</Code> e um aviso no console
                  em desenvolvimento por pelo menos uma versão minor.
                </>
              ),
              en: (
                <>
                  Before removing anything we mark it <Code>@deprecated</Code> with a development
                  console warning for at least one minor version.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Como contribuir', en: 'How to contribute' }}>
        <Prose>
          <p>
            <T
              pt="Contribuições são bem-vindas: correções, novos componentes, traduções, exemplos e relatos de problemas de acessibilidade — especialmente estes."
              en="Contributions are welcome: fixes, new components, translations, examples and accessibility bug reports — especially those."
            />
          </p>
        </Prose>
        <Steps
          items={[
            {
              title: { pt: 'Abra uma issue', en: 'Open an issue' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Descreva o problema ou a proposta em{' '}
                        <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                          github.com/llypeDev/Orange/issues
                        </a>
                        . Para componentes novos, inclua o padrão APG de referência.
                      </>
                    }
                    en={
                      <>
                        Describe the problem or proposal at{' '}
                        <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                          github.com/llypeDev/Orange/issues
                        </a>
                        . For new components, include the reference APG pattern.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Prepare o ambiente', en: 'Set up the environment' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Faça um fork, rode <Code>pnpm install</Code> e <Code>pnpm dev</Code>. A
                        documentação recarrega a cada mudança nos pacotes.
                      </>
                    }
                    en={
                      <>
                        Fork the repo, run <Code>pnpm install</Code> and <Code>pnpm dev</Code>. The
                        docs reload on every package change.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Siga o checklist', en: 'Follow the checklist' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Componente, CSS, testes, stories e página de documentação — a lista completa
                        está no{' '}
                        <a
                          href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          CONTRIBUTING.md
                        </a>
                        .
                      </>
                    }
                    en={
                      <>
                        Component, CSS, tests, stories and docs page — the full list is in{' '}
                        <a
                          href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          CONTRIBUTING.md
                        </a>
                        .
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Abra o pull request', en: 'Open the pull request' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Com <Code>pnpm typecheck</Code>, <Code>pnpm lint</Code> e{' '}
                        <Code>pnpm test</Code> passando. Mensagens de commit no imperativo, em
                        português: “Adiciona componente Tabs”.
                      </>
                    }
                    en={
                      <>
                        With <Code>pnpm typecheck</Code>, <Code>pnpm lint</Code> and{' '}
                        <Code>pnpm test</Code> passing. Commit messages in the imperative, in
                        Portuguese: “Adiciona componente Tabs”.
                      </>
                    }
                  />
                </p>
              ),
            },
          ]}
        />
        <Callout
          tone="success"
          title={{
            pt: 'Encontrou uma barreira de acessibilidade?',
            en: 'Found an accessibility barrier?',
          }}
        >
          <p>
            <T
              pt={
                <>
                  Abra uma issue com o rótulo <Code>a11y</Code> informando navegador, tecnologia
                  assistiva e passos para reproduzir. Problemas de acessibilidade têm prioridade
                  sobre novas funcionalidades.
                </>
              }
              en={
                <>
                  Open an issue labeled <Code>a11y</Code> with browser, assistive technology and
                  reproduction steps. Accessibility issues take priority over new features.
                </>
              }
            />
          </p>
        </Callout>
      </Section>

      <Section title="Roadmap" id="roadmap">
        <TableWrap label={{ pt: 'Roadmap do Orange', en: 'Orange roadmap' }}>
          <table className="doc-table guide-roadmap">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Versão', en: 'Version' })}</th>
                <th scope="col">{t({ pt: 'Situação', en: 'Status' })}</th>
                <th scope="col">{t({ pt: 'Escopo', en: 'Scope' })}</th>
              </tr>
            </thead>
            <tbody>
              {roadmap.map((row) => (
                <tr key={row.version}>
                  <th scope="row">
                    <span className="guide-roadmap__version">{row.version}</span>
                  </th>
                  <td>
                    <span className={`guide-roadmap__status guide-roadmap__status--${row.status}`}>
                      <span aria-hidden="true" />
                      {t(statusLabel[row.status])}
                    </span>
                  </td>
                  <td>
                    <ul className="guide-roadmap__items">
                      {row.items.map((item) => (
                        <li key={item.pt} data-state={item.state}>
                          <span>{t(item)}</span>
                          {item.state && (
                            <span className={`guide-roadmap__item-state guide-roadmap__item-state--${item.state}`}>
                              {t(itemStateLabel[item.state])}
                            </span>
                          )}
                          {item.note && <span className="guide-roadmap__note">{t(item.note)}</span>}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Prioridades mudam com o uso real. Acompanhe e vote nas issues do{' '}
                  <a href={REPO_URL} target="_blank" rel="noreferrer">
                    repositório
                  </a>{' '}
                  ou explore o estado atual no{' '}
                  <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
                    Storybook
                  </a>
                  .
                </>
              }
              en={
                <>
                  Priorities shift with real usage. Follow and vote on issues in the{' '}
                  <a href={REPO_URL} target="_blank" rel="noreferrer">
                    repository
                  </a>{' '}
                  or explore the current state in{' '}
                  <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
                    Storybook
                  </a>
                  .
                </>
              }
            />
          </p>
        </Prose>
      </Section>

      <Section title={{ pt: 'Licença', en: 'License' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  MIT. Use, modifique e distribua — inclusive comercialmente — mantendo o aviso de
                  copyright. As fontes Space Grotesk, Inter e JetBrains Mono são distribuídas sob a
                  SIL Open Font License.
                </>
              }
              en={
                <>
                  MIT. Use, modify and distribute — commercially too — keeping the copyright notice.
                  The Space Grotesk, Inter and JetBrains Mono fonts are distributed under the SIL
                  Open Font License.
                </>
              }
            />
          </p>
        </Prose>
      </Section>
    </DocPage>
  )
}
