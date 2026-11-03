import { Button, Icon, useClipboard } from '@orange/ui'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang, type Localized } from '../../i18n'
import { CodeBlock } from '../../kit'
import { componentMetas, REPO_URL, STORYBOOK_URL } from '../registry'
import '../../styles/home.css'

function Marquee({ items, tone = 'paper' }: { items: Localized<string>[]; tone?: 'paper' | 'ink' }) {
  const { t } = useLang()
  const row = (hidden: boolean) => (
    <ul className="home-marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i}>
          <span>{t(item)}</span>
          <span className="home-marquee__dot" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`home-marquee home-marquee--${tone}`}>
      <div className="home-marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

function InstallCommand() {
  const { copy, copied } = useClipboard()
  const { t } = useLang()
  const cmd = 'pnpm add @orange/ui'
  return (
    <div className="home-install">
      <span className="home-install__prompt" aria-hidden="true">
        $
      </span>
      <code>{cmd}</code>
      <button type="button" onClick={() => copy(cmd)} className="home-install__copy">
        {copied ? t({ pt: 'Copiado', en: 'Copied' }) : t({ pt: 'Copiar', en: 'Copy' })}
      </button>
    </div>
  )
}

const layers: { n: string; title: Localized<string>; text: Localized<string>; path: string }[] = [
  {
    n: '01',
    title: { pt: 'Tokens', en: 'Tokens' },
    text: {
      pt: 'Cor, tipografia, espaço e movimento. Uma fonte única, dois temas.',
      en: 'Color, type, space and motion. One source of truth, two themes.',
    },
    path: '/design-guidelines/color',
  },
  {
    n: '02',
    title: { pt: 'Fundamentos', en: 'Foundations' },
    text: {
      pt: 'Grid, iconografia e tipografia com regras claras de uso.',
      en: 'Grid, iconography and typography with clear usage rules.',
    },
    path: '/design-guidelines/grid',
  },
  {
    n: '03',
    title: { pt: 'Componentes', en: 'Components' },
    text: {
      pt: 'React + TypeScript, testados com axe-core e por teclado.',
      en: 'React + TypeScript, tested with axe-core and by keyboard.',
    },
    path: '/components/overview',
  },
  {
    n: '04',
    title: { pt: 'Acessibilidade', en: 'Accessibility' },
    text: {
      pt: 'WCAG 2.2 AA como requisito, não como revisão no fim.',
      en: 'WCAG 2.2 AA as a requirement, not a final review.',
    },
    path: '/design-guidelines/accessibility',
  },
  {
    n: '05',
    title: { pt: 'Storybook', en: 'Storybook' },
    text: {
      pt: 'Laboratório interativo com controles, temas e painel a11y.',
      en: 'Interactive lab with controls, themes and an a11y panel.',
    },
    path: 'storybook',
  },
]

function Layers() {
  const { t, to } = useLang()
  const [active, setActive] = useState(0)
  return (
    <ol className="home-layers">
      {layers.map((layer, i) => {
        const content = (
          <>
            <span className="home-layers__n">{layer.n}</span>
            <span className="home-layers__title">{t(layer.title)}</span>
            <span className="home-layers__text">{t(layer.text)}</span>
          </>
        )
        return (
          <li key={layer.n} data-active={active === i || undefined} onMouseEnter={() => setActive(i)}>
            {layer.path === 'storybook' ? (
              <a href={STORYBOOK_URL} onFocus={() => setActive(i)} target="_blank" rel="noreferrer">
                {content}
              </a>
            ) : (
              <Link to={to(layer.path)} onFocus={() => setActive(i)}>
                {content}
              </Link>
            )}
          </li>
        )
      })}
    </ol>
  )
}

const codeTabs: { id: string; label: string; language: 'bash' | 'tsx' | 'css'; code: string }[] = [
  {
    id: 'install',
    label: 'Instalar',
    language: 'bash',
    code: `# pnpm
pnpm add @orange/ui

# npm
npm install @orange/ui`,
  },
  {
    id: 'provider',
    label: 'Provider',
    language: 'tsx',
    code: `// main.tsx
import '@orange/ui/styles.css'
import { OrangeProvider } from '@orange/ui'

createRoot(root).render(
  <OrangeProvider defaultTheme="dark" locale="pt-BR">
    <App />
  </OrangeProvider>,
)`,
  },
  {
    id: 'use',
    label: 'Usar',
    language: 'tsx',
    code: `import { Button, Icon } from '@orange/ui'

export function Hero() {
  return (
    <Button endIcon={<Icon name="arrow-right" />}>
      Começar agora
    </Button>
  )
}`,
  },
  {
    id: 'theme',
    label: 'Tema',
    language: 'css',
    code: `/* Sobrescreva qualquer token semântico */
[data-theme='dark'] {
  --or-color-accent: #f58549;
  --or-color-bg: #0f0f12;
  --or-radius-none: 0;
}`,
  },
]

function CodeTabs() {
  const [active, setActive] = useState(codeTabs[0].id)
  const baseId = useId()
  const current = codeTabs.find((tab) => tab.id === active) ?? codeTabs[0]

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = codeTabs.findIndex((tab) => tab.id === active)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % codeTabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + codeTabs.length) % codeTabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = codeTabs.length - 1
    else return
    event.preventDefault()
    setActive(codeTabs[next].id)
    document.getElementById(`${baseId}-tab-${codeTabs[next].id}`)?.focus()
  }

  return (
    <div className="home-tabs">
      <div role="tablist" aria-label="Exemplo de código" className="home-tabs__list">
        {codeTabs.map((tab) => (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={tab.id === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={tab.id === active ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`} className="home-tabs__panel">
        <CodeBlock code={current.code} language={current.language} title={current.language} />
      </div>
    </div>
  )
}

const pillars: {
  color: 'orange' | 'green' | 'blue'
  title: Localized<string>
  tagline: Localized<string>
  text: Localized<string>
  bullets: Localized<string>[]
  path: string
}[] = [
  {
    color: 'orange',
    title: { pt: 'Acessível', en: 'Accessible' },
    tagline: { pt: 'WCAG 2.2 nível AA', en: 'WCAG 2.2 level AA' },
    text: {
      pt: 'Cada componente nasce com semântica nativa, foco visível e navegação completa por teclado.',
      en: 'Every component ships with native semantics, visible focus and full keyboard navigation.',
    },
    bullets: [
      { pt: 'Testes automatizados com axe-core', en: 'Automated tests with axe-core' },
      { pt: 'Contraste validado nos tokens', en: 'Contrast validated at the token level' },
      { pt: 'Padrões WAI-ARIA documentados', en: 'Documented WAI-ARIA patterns' },
      { pt: 'Respeita prefers-reduced-motion', en: 'Respects prefers-reduced-motion' },
    ],
    path: '/design-guidelines/accessibility',
  },
  {
    color: 'green',
    title: { pt: 'Open source', en: 'Open source' },
    tagline: { pt: 'Licença MIT', en: 'MIT license' },
    text: {
      pt: 'Código aberto no GitHub. Abra issues, proponha componentes e contribua com melhorias.',
      en: 'Open code on GitHub. Open issues, propose components and contribute improvements.',
    },
    bullets: [
      { pt: 'React 19 + TypeScript estrito', en: 'React 19 + strict TypeScript' },
      { pt: 'Sem CSS-in-JS: CSS puro + tokens', en: 'No CSS-in-JS: plain CSS + tokens' },
      { pt: 'Storybook com cada estado', en: 'Storybook with every state' },
      { pt: 'Documentação bilíngue PT/EN', en: 'Bilingual PT/EN documentation' },
    ],
    path: '/about',
  },
  {
    color: 'blue',
    title: { pt: 'Customizável', en: 'Customizable' },
    tagline: { pt: 'Temas por tokens', en: 'Token-driven themes' },
    text: {
      pt: 'Temas claro e escuro prontos. Crie o seu sobrescrevendo variáveis CSS, sem recompilar nada.',
      en: 'Light and dark themes out of the box. Build yours by overriding CSS variables — no rebuild.',
    },
    bullets: [
      { pt: 'Tokens semânticos --or-*', en: 'Semantic --or-* tokens' },
      { pt: 'Tema por página ou por seção', en: 'Theme per page or per section' },
      { pt: 'Mensagens internas traduzíveis', en: 'Translatable internal messages' },
      { pt: 'Hooks reutilizáveis exportados', en: 'Reusable hooks exported' },
    ],
    path: '/usage/theme',
  },
]

const faqs: { q: Localized<string>; a: Localized<ReactNode> }[] = [
  {
    q: { pt: 'Preciso usar React?', en: 'Do I need React?' },
    a: {
      pt: 'Os componentes são React (18.2+ ou 19). Os tokens (@orange/tokens) são CSS puro e funcionam em qualquer stack.',
      en: 'Components are React (18.2+ or 19). Tokens (@orange/tokens) are plain CSS and work with any stack.',
    },
  },
  {
    q: { pt: 'Como o Orange garante acessibilidade?', en: 'How does Orange ensure accessibility?' },
    a: {
      pt: 'Cada componente tem testes com axe-core, testes de teclado com Testing Library e o painel de acessibilidade do Storybook. O contraste das cores é verificado nos testes de tokens.',
      en: 'Every component has axe-core tests, keyboard tests with Testing Library and the Storybook accessibility panel. Color contrast is verified in the token tests.',
    },
  },
  {
    q: { pt: 'Posso trocar o laranja pela cor da minha marca?', en: 'Can I swap orange for my brand color?' },
    a: {
      pt: 'Sim. Sobrescreva --or-color-accent e as variações (hover, active, subtle, text) no seu CSS. Confira o contraste na página de Cor.',
      en: 'Yes. Override --or-color-accent and its variants (hover, active, subtle, text) in your CSS. Check the contrast on the Color page.',
    },
  },
  {
    q: { pt: 'Funciona com SSR (Next.js, Remix)?', en: 'Does it work with SSR (Next.js, Remix)?' },
    a: {
      pt: 'Sim. Os componentes evitam acesso ao DOM durante a renderização e portais só montam no cliente.',
      en: 'Yes. Components avoid DOM access during render and portals only mount on the client.',
    },
  },
  {
    q: { pt: 'Por que cantos retos?', en: 'Why square corners?' },
    a: {
      pt: 'A linguagem do Orange é geométrica: grade explícita, bordas de 1px e um único acento. Cantos retos reforçam a estrutura e deixam o conteúdo em primeiro plano.',
      en: 'Orange speaks a geometric language: explicit grid, 1px borders and a single accent. Square corners reinforce structure and keep content in front.',
    },
  },
]

function Faq() {
  const { t } = useLang()
  return (
    <div className="home-faq">
      {faqs.map((item, i) => (
        <details key={i} className="home-faq__item">
          <summary>
            <span>{t(item.q)}</span>
            <span className="home-faq__icon" aria-hidden="true" />
          </summary>
          <div className="home-faq__answer">{t(item.a)}</div>
        </details>
      ))}
    </div>
  )
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export default function Home() {
  const { t, to } = useLang()
  const navigate = useNavigate()
  const count = useCountUp(componentMetas.length)

  useEffect(() => {
    document.title = 'Orange Design System'
  }, [])

  return (
    <div className="home">
      <Marquee
        items={[
          { pt: 'WCAG 2.2 AA em todos os componentes', en: 'WCAG 2.2 AA in every component' },
          { pt: 'Temas claro e escuro', en: 'Light and dark themes' },
          { pt: 'Documentação PT · EN', en: 'PT · EN documentation' },
          { pt: 'Storybook interativo', en: 'Interactive Storybook' },
          { pt: 'Open source · MIT', en: 'Open source · MIT' },
        ]}
      />

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-grid-lines" aria-hidden="true" />
        <Link to={to('/components/overview')} className="home-chip">
          <span className="doc-square" aria-hidden="true" />
          <span className="home-chip__version">v0.1.0</span>
          <span className="home-chip__sep" aria-hidden="true" />
          <span>{t({ pt: `${componentMetas.length} componentes prontos para usar.`, en: `${componentMetas.length} components ready to use.` })}</span>
          <Icon name="arrow-right" size="sm" className="home-chip__arrow" />
        </Link>
        <h1 id="home-title" className="home-hero__title">
          {t({ pt: 'O jeito mais direto de construir interfaces acessíveis.', en: 'The most direct way to build accessible interfaces.' })}
        </h1>
        <p className="home-hero__lead">
          {t({
            pt: 'Orange é um design system open source: tokens, componentes React, guias de uso e Storybook — tudo pensado para WCAG 2.2 AA desde o primeiro pixel.',
            en: 'Orange is an open source design system: tokens, React components, usage guides and Storybook — all built for WCAG 2.2 AA from the very first pixel.',
          })}
        </p>
        <div className="home-hero__actions">
          <Button variant="outline" size="lg" endIcon={<Icon name="arrow-right" />} onClick={() => navigate(to('/getting-started'))}>
            {t({ pt: 'Começando', en: 'Get started' })}
          </Button>
          <Button size="lg" endIcon={<Icon name="arrow-right" />} onClick={() => navigate(to('/components/overview'))}>
            {t({ pt: 'Ver componentes', en: 'Browse components' })}
          </Button>
        </div>
        <InstallCommand />
        <p className="home-hero__note">
          {t({ pt: 'React 19 · TypeScript · CSS puro com tokens · sem dependências pesadas', en: 'React 19 · TypeScript · Plain CSS with tokens · no heavy dependencies' })}
        </p>
      </section>

      <section className="home-section" aria-label={t({ pt: 'Números', en: 'Numbers' })}>
        <dl className="home-stats">
          <div>
            <dt>{t({ pt: 'Componentes acessíveis e documentados', en: 'Accessible, documented components' })}</dt>
            <dd>{count}</dd>
          </div>
          <div>
            <dt>{t({ pt: 'Nível de conformidade WCAG 2.2', en: 'WCAG 2.2 conformance level' })}</dt>
            <dd>AA</dd>
          </div>
          <div>
            <dt>{t({ pt: 'Temas prontos, claro e escuro', en: 'Ready-made themes, light and dark' })}</dt>
            <dd>2</dd>
          </div>
          <div>
            <dt>{t({ pt: 'Idiomas na documentação e nos componentes', en: 'Languages in docs and components' })}</dt>
            <dd>PT·EN</dd>
          </div>
        </dl>
      </section>

      <section className="home-section" aria-labelledby="home-layers-title">
        <h2 id="home-layers-title" className="or-eyebrow home-eyebrow">
          {t({ pt: 'Um sistema, não cinco ferramentas separadas.', en: 'One system, not five separate tools.' })}
        </h2>
        <Layers />
      </section>

      <section className="home-section">
        <div className="home-cta-band">
          <div>
            <h2 className="home-cta-band__title">
              {t({ pt: 'Do zero ao primeiro componente. Em 5 minutos.', en: 'From zero to your first component. In 5 minutes.' })}
            </h2>
            <p className="home-cta-band__text">
              {t({
                pt: 'Instale o pacote, envolva a aplicação no OrangeProvider e importe o que precisar. O guia mostra cada passo.',
                en: 'Install the package, wrap your app in OrangeProvider and import what you need. The guide shows every step.',
              })}
            </p>
          </div>
          <Button endIcon={<Icon name="arrow-right" />} onClick={() => navigate(to('/getting-started'))}>
            {t({ pt: 'Ler o guia', en: 'Read the guide' })}
          </Button>
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-code-title">
        <div className="home-section__head">
          <h2 id="home-code-title" className="home-h2">
            {t({ pt: 'Do token ao componente.', en: 'From token to component.' })}
          </h2>
          <p className="home-section__aside">
            {t({
              pt: 'Uma API previsível em todos os componentes: variantes, tamanhos e estados com os mesmos nomes.',
              en: 'A predictable API across every component: variants, sizes and states with the same names.',
            })}
          </p>
        </div>
        <div className="home-split">
          <CodeTabs />
          <div className="home-panel">
            <p className="or-eyebrow">{t({ pt: 'Depois, é só compor', en: 'Then just compose' })}</p>
            <ul className="home-prompts">
              <li>{t({ pt: 'Formulários com rótulo, ajuda e erro ligados por ARIA.', en: 'Forms with label, hint and error wired with ARIA.' })}</li>
              <li>{t({ pt: 'Modais e menus com foco preso e Escape para fechar.', en: 'Modals and menus with trapped focus and Escape to close.' })}</li>
              <li>{t({ pt: 'Tabelas, paginação e filtros prontos para dados reais.', en: 'Tables, pagination and filters ready for real data.' })}</li>
              <li>{t({ pt: 'Toasts, alerts e banners com anúncios para leitores de tela.', en: 'Toasts, alerts and banners with screen reader announcements.' })}</li>
            </ul>
            <p className="home-panel__foot">
              {t({
                pt: 'Todos os exemplos da documentação são código real, copiável e testado.',
                en: 'Every docs example is real, copyable and tested code.',
              })}
            </p>
          </div>
        </div>
        <div className="home-rules">
          <div>
            <span className="home-rules__label home-rules__label--yes">
              <span className="home-rules__sq" aria-hidden="true" />
              {t({ pt: 'Sempre', en: 'Always' })}
            </span>
            <span>
              {t({
                pt: 'semântica nativa · foco visível · rótulos acessíveis · contraste AA · suporte a teclado',
                en: 'native semantics · visible focus · accessible labels · AA contrast · keyboard support',
              })}
            </span>
          </div>
          <div>
            <span className="home-rules__label home-rules__label--no">
              <span className="home-rules__sq" aria-hidden="true" />
              {t({ pt: 'Nunca', en: 'Never' })}
            </span>
            <span>
              {t({
                pt: 'div clicável · cor como único sinal · armadilha de foco sem saída · animação sem controle',
                en: 'clickable div · color as the only signal · inescapable focus trap · uncontrolled animation',
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-pillars-title">
        <div className="home-section__head">
          <h2 id="home-pillars-title" className="home-h2">
            {t({ pt: 'Feito para durar.', en: 'Built to last.' })}
          </h2>
          <p className="home-section__aside">
            {t({
              pt: 'Três compromissos que guiam cada decisão: acessível, aberto e adaptável à sua marca.',
              en: 'Three commitments behind every decision: accessible, open and adaptable to your brand.',
            })}
          </p>
        </div>
        <div className="home-pillars">
          {pillars.map((p) => (
            <article key={p.color} className={`home-pillar home-pillar--${p.color}`}>
              <span className="home-pillar__icon" aria-hidden="true">
                <span />
              </span>
              <h3 className="home-pillar__title">{t(p.title)}</h3>
              <p className="home-pillar__tagline">{t(p.tagline)}</p>
              <p className="home-pillar__text">{t(p.text)}</p>
              <ul className="home-pillar__list">
                {p.bullets.map((b, i) => (
                  <li key={i}>{t(b)}</li>
                ))}
              </ul>
              <Link to={to(p.path)} className="home-pillar__link">
                {t({ pt: 'Explorar', en: 'Explore' })} <span className="or-visually-hidden">{t(p.title)}</span> →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-faq-title">
        <div className="home-section__head">
          <h2 id="home-faq-title" className="home-h2">
            {t({ pt: 'Perguntas frequentes.', en: 'Frequently asked questions.' })}
          </h2>
        </div>
        <Faq />
      </section>

      <section className="home-section home-final" aria-labelledby="home-final-title">
        <h2 id="home-final-title" className="home-final__title">
          {t({ pt: 'Comece a construir.', en: 'Start building.' })}
        </h2>
        <p className="home-final__text">
          {t({
            pt: 'Tokens, componentes e guias prontos. Você cuida do produto; o Orange cuida da base.',
            en: 'Tokens, components and guides, ready. You focus on the product; Orange takes care of the foundation.',
          })}
        </p>
        <div className="home-final__actions">
          <Button variant="secondary" size="lg" endIcon={<Icon name="arrow-right" />} onClick={() => navigate(to('/getting-started'))}>
            {t({ pt: 'Instalar o Orange', en: 'Install Orange' })}
          </Button>
          <a className="or-button or-button--outline or-button--lg" href={STORYBOOK_URL} target="_blank" rel="noreferrer">
            <span className="or-button__label">{t({ pt: 'Abrir o Storybook', en: 'Open Storybook' })}</span>
            <span className="or-button__icon or-button__icon--end" aria-hidden="true">
              <Icon name="arrow-up-right" />
            </span>
            <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
          </a>
          <a className="or-button or-button--outline or-button--lg" href={REPO_URL} target="_blank" rel="noreferrer">
            <span className="or-button__label">GitHub</span>
            <span className="or-button__icon or-button__icon--end" aria-hidden="true">
              <Icon name="arrow-up-right" />
            </span>
            <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
          </a>
        </div>
        <dl className="home-final__facts">
          <div>
            <dt>{t({ pt: 'para instalar e configurar', en: 'to install and configure' })}</dt>
            <dd>5 min</dd>
          </div>
          <div>
            <dt>{t({ pt: 'violações axe nos testes', en: 'axe violations in tests' })}</dt>
            <dd>0</dd>
          </div>
          <div>
            <dt>{t({ pt: 'licença, para sempre', en: 'license, forever' })}</dt>
            <dd>MIT</dd>
          </div>
        </dl>
      </section>

      <Marquee
        tone="paper"
        items={[
          { pt: 'Tokens → Componentes → Produto', en: 'Tokens → Components → Product' },
          { pt: 'Teclado primeiro', en: 'Keyboard first' },
          { pt: 'Cantos retos, ideias claras', en: 'Square corners, clear ideas' },
          { pt: 'Feito no Brasil', en: 'Made in Brazil' },
          { pt: 'Contribuições bem-vindas', en: 'Contributions welcome' },
        ]}
      />
    </div>
  )
}
