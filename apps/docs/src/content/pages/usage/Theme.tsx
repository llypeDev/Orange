import {
  Button,
  Eyebrow,
  Field,
  Heading,
  Icon,
  OrangeProvider,
  Text,
  useFieldControlProps,
  useMediaQuery,
  useTheme,
} from '@orange/ui'
import { primitives, themes, type ThemeName } from '@orange/tokens'
import { useId, useMemo, useState, type CSSProperties } from 'react'
import { T, useLang } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  DocPage,
  Example,
  PropsTable,
  Prose,
  Section,
} from '../../../kit'
import { ContrastBadge, Segmented } from '../_shared/Blocks'
import { contrastRatio, hexToRgb, inkOn, rgbToHex } from '../_shared/color'

/* --- Mini interface usada nas prévias ------------------------------------ */

function MiniInput({ placeholder }: { placeholder: string }) {
  const props = useFieldControlProps()
  return <input {...props} className="or-control" placeholder={placeholder} />
}

function MiniUI({ name }: { name: string }) {
  const { t } = useLang()
  return (
    <div className="guide-mini-ui">
      <Eyebrow marker>{name}</Eyebrow>
      <Heading level={3} size="xl">
        {t({ pt: 'Convide sua equipe', en: 'Invite your team' })}
      </Heading>
      <Text size="sm" tone="muted">
        {t({
          pt: 'Cada pessoa recebe um e-mail com o link de acesso.',
          en: 'Everyone gets an email with an access link.',
        })}
      </Text>
      <Field label={t({ pt: 'E-mail', en: 'Email' })}>
        <MiniInput placeholder="ana@empresa.com" />
      </Field>
      <div className="guide-row">
        <Button size="sm" variant="outline">
          {t({ pt: 'Cancelar', en: 'Cancel' })}
        </Button>
        <Button size="sm" endIcon={<Icon name="send" size="sm" />}>
          {t({ pt: 'Enviar convite', en: 'Send invite' })}
        </Button>
      </div>
    </div>
  )
}

/* --- useTheme ao vivo --------------------------------------------------- */

function ThemeControls() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { t } = useLang()
  return (
    <div className="guide-theme-scope">
      <dl className="guide-kv">
        <dt>theme</dt>
        <dd>
          <Code>'{theme}'</Code>
        </dd>
        <dt>resolvedTheme</dt>
        <dd>
          <Code>'{resolvedTheme}'</Code>
        </dd>
      </dl>
      <div
        className="guide-row"
        role="group"
        aria-label={t({ pt: 'Tema da seção', en: 'Section theme' })}
      >
        {(['dark', 'light', 'system'] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={theme === value ? 'primary' : 'outline'}
            aria-pressed={theme === value}
            onClick={() => setTheme(value)}
            startIcon={
              <Icon
                name={value === 'dark' ? 'moon' : value === 'light' ? 'sun' : 'layout'}
                size="sm"
              />
            }
          >
            {value === 'dark'
              ? t({ pt: 'Escuro', en: 'Dark' })
              : value === 'light'
                ? t({ pt: 'Claro', en: 'Light' })
                : t({ pt: 'Sistema', en: 'System' })}
          </Button>
        ))}
      </div>
    </div>
  )
}

const useThemeCode = `import { Button, OrangeProvider, useTheme } from '@orange/ui'

function SeletorDeTema() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  return (
    <div role="group" aria-label="Tema">
      <p>theme: {theme} · resolvedTheme: {resolvedTheme}</p>
      {(['dark', 'light', 'system'] as const).map((valor) => (
        <Button
          key={valor}
          variant={theme === valor ? 'primary' : 'outline'}
          aria-pressed={theme === valor}
          onClick={() => setTheme(valor)}
        >
          {valor}
        </Button>
      ))}
    </div>
  )
}

// themeTarget="scoped": o tema vale só para esta seção
<OrangeProvider themeTarget="scoped" defaultTheme="light">
  <SeletorDeTema />
</OrangeProvider>`

/* --- Gerador de tema customizado ----------------------------------------- */

/** Mistura `color` com `towards` até alcançar o contraste mínimo contra `bg`. */
function adjustForContrast(color: string, bg: string, target: number, towards: string): string {
  const a = hexToRgb(color)
  const b = hexToRgb(towards)
  for (let p = 0; p <= 1.0001; p += 0.05) {
    const mixed = rgbToHex(
      ...(a.map((c, i) => Math.round(c + (b[i] - c) * p)) as [number, number, number]),
    )
    if (contrastRatio(mixed, bg) >= target) return mixed
  }
  return towards
}

function deriveAccent(accent: string, theme: ThemeName) {
  const base = themes[theme]
  const onAccent = inkOn(accent)
  const accentText = adjustForContrast(accent, base.bg, 4.5, base.text)
  const [r, g, b] = hexToRgb(accent)
  return {
    accent,
    onAccent,
    accentText,
    subtle: `rgba(${r}, ${g}, ${b}, 0.12)`,
    border: `rgba(${r}, ${g}, ${b}, 0.45)`,
    ratios: {
      ui: contrastRatio(accent, base.bg),
      onAccent: contrastRatio(onAccent, accent),
      text: contrastRatio(accentText, base.bg),
    },
  }
}

const presets: { name: string; value: string }[] = [
  { name: 'Orange', value: primitives.orange[500] },
  { name: 'Blue', value: primitives.blue[400] },
  { name: 'Green', value: primitives.green[500] },
  { name: 'Violeta', value: '#8b6cf0' },
  { name: 'Teal', value: '#2bb3a3' },
]

function ThemeBuilder() {
  const { t } = useLang()
  const [accent, setAccent] = useState('#8b6cf0')
  const inputId = useId()
  const derived = useMemo(
    () => ({ dark: deriveAccent(accent, 'dark'), light: deriveAccent(accent, 'light') }),
    [accent],
  )

  const vars = (d: ReturnType<typeof deriveAccent>) =>
    ({
      '--or-color-accent': d.accent,
      '--or-color-accent-hover': `color-mix(in srgb, ${d.accent} 88%, white)`,
      '--or-color-accent-active': `color-mix(in srgb, ${d.accent} 85%, black)`,
      '--or-color-accent-subtle': d.subtle,
      '--or-color-accent-text': d.accentText,
      '--or-color-accent-border': d.border,
      '--or-color-focus': d.accentText,
      '--or-color-text-on-accent': d.onAccent,
    }) as CSSProperties

  const css = (['dark', 'light'] as const)
    .map((theme) => {
      const d = derived[theme]
      return `[data-theme='${theme}'] {
  --or-color-accent: ${d.accent};
  --or-color-accent-hover: color-mix(in srgb, ${d.accent} 88%, white);
  --or-color-accent-active: color-mix(in srgb, ${d.accent} 85%, black);
  --or-color-accent-subtle: ${d.subtle};
  --or-color-accent-text: ${d.accentText};
  --or-color-accent-border: ${d.border};
  --or-color-focus: ${d.accentText};
  --or-color-text-on-accent: ${d.onAccent};
}`
    })
    .join('\n\n')

  return (
    <div className="guide-builder">
      <div className="guide-builder__controls">
        <div className="guide-builder__picker">
          <label htmlFor={inputId} className="guide-label">
            {t({ pt: 'Cor de acento', en: 'Accent color' })}
          </label>
          <div className="guide-row">
            <input
              id={inputId}
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="guide-builder__color"
            />
            <Code>{accent}</Code>
          </div>
        </div>
        <Segmented
          label={{ pt: 'Cores sugeridas', en: 'Suggested colors' }}
          value={presets.find((p) => p.value === accent)?.value ?? ''}
          onChange={setAccent}
          options={presets.map((p) => ({ value: p.value, label: p.name }))}
        />
      </div>
      <div className="guide-builder__previews">
        {(['dark', 'light'] as const).map((theme) => {
          const d = derived[theme]
          return (
            <div key={theme} className="guide-builder__pane" data-theme={theme} style={vars(d)}>
              <MiniUI
                name={
                  theme === 'dark'
                    ? t({ pt: 'Escuro', en: 'Dark' })
                    : t({ pt: 'Claro', en: 'Light' })
                }
              />
              <ul className="guide-builder__checks">
                <li>
                  <span>{t({ pt: 'Acento × fundo', en: 'Accent × background' })}</span>
                  <ContrastBadge ratio={d.ratios.ui} kind="ui" />
                </li>
                <li>
                  <span>{t({ pt: 'Texto sobre acento', en: 'Text on accent' })}</span>
                  <ContrastBadge ratio={d.ratios.onAccent} />
                </li>
                <li>
                  <span>
                    accent-text{' '}
                    {d.accentText !== accent && (
                      <span className="guide-muted">({t({ pt: 'ajustado', en: 'adjusted' })})</span>
                    )}
                  </span>
                  <ContrastBadge ratio={d.ratios.text} />
                </li>
              </ul>
            </div>
          )
        })}
      </div>
      <div className="guide-builder__css">
        <p className="or-eyebrow guide-builder__label">
          {t({
            pt: 'CSS gerado — copie para o seu projeto',
            en: 'Generated CSS — copy it into your project',
          })}
        </p>
        <CodeBlock code={css} language="css" title="meu-tema.css" />
      </div>
    </div>
  )
}

export default function ThemePage() {
  const { t, uiLocale } = useLang()
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)')

  return (
    <DocPage
      eyebrow={{ pt: 'Usando', en: 'Usage' }}
      title={{ pt: 'Tema', en: 'Theme' }}
      lead={{
        pt: 'Dois temas prontos — escuro (padrão) e claro — trocados por um único atributo data-theme. Os componentes só leem tokens, então qualquer tema novo é questão de sobrescrever variáveis CSS.',
        en: 'Two ready-made themes — dark (default) and light — switched by a single data-theme attribute. Components only read tokens, so any new theme is a matter of overriding CSS variables.',
      }}
    >
      <Section title={{ pt: 'Temas claro e escuro', en: 'Light and dark themes' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Mesmos componentes, mesmos tokens, valores diferentes. O tema escuro usa a paleta{' '}
                  <Code>carbon</Code> e o laranja 500; o claro usa <Code>paper</Code> e um laranja
                  mais fechado (600) para manter 3:1 sobre o papel.
                </>
              }
              en={
                <>
                  Same components, same tokens, different values. The dark theme uses the{' '}
                  <Code>carbon</Code> palette and orange 500; the light theme uses{' '}
                  <Code>paper</Code> and a deeper orange (600) to keep 3:1 on paper.
                </>
              }
            />
          </p>
        </Prose>
        <div className="guide-theme-pair">
          <div data-theme="dark" className="guide-theme-pair__pane">
            <MiniUI name={t({ pt: 'Escuro', en: 'Dark' })} />
          </div>
          <div data-theme="light" className="guide-theme-pair__pane">
            <MiniUI name={t({ pt: 'Claro', en: 'Light' })} />
          </div>
        </div>
      </Section>

      <Section title="OrangeProvider" id="orange-provider">
        <Prose>
          <p>
            <T
              pt={
                <>
                  O provider guarda a preferência de tema, resolve <Code>system</Code> com{' '}
                  <Code>prefers-color-scheme</Code> e aplica <Code>data-theme</Code> no{' '}
                  <Code>&lt;html&gt;</Code> (ou em um <Code>&lt;div&gt;</Code>, com{' '}
                  <Code>themeTarget="scoped"</Code>).
                </>
              }
              en={
                <>
                  The provider stores the theme preference, resolves <Code>system</Code> with{' '}
                  <Code>prefers-color-scheme</Code> and sets <Code>data-theme</Code> on{' '}
                  <Code>&lt;html&gt;</Code> (or on a <Code>&lt;div&gt;</Code>, with{' '}
                  <Code>themeTarget="scoped"</Code>).
                </>
              }
            />
          </p>
        </Prose>
        <PropsTable
          rows={[
            {
              name: 'defaultTheme',
              type: "'dark' | 'light' | 'system'",
              default: "'dark'",
              description: {
                pt: 'Tema inicial, não controlado.',
                en: 'Initial theme, uncontrolled.',
              },
            },
            {
              name: 'theme',
              type: "'dark' | 'light' | 'system'",
              description: {
                pt: 'Tema controlado — você guarda o estado (ex.: localStorage).',
                en: 'Controlled theme — you own the state (e.g. localStorage).',
              },
            },
            {
              name: 'onThemeChange',
              type: '(theme: ThemeSetting) => void',
              description: {
                pt: 'Chamado quando um componente chama setTheme().',
                en: 'Called when a component calls setTheme().',
              },
            },
            {
              name: 'themeTarget',
              type: "'document' | 'scoped'",
              default: "'document'",
              description: {
                pt: (
                  <>
                    <Code>document</Code> aplica no <Code>&lt;html&gt;</Code>; <Code>scoped</Code>{' '}
                    envolve os filhos em <Code>&lt;div data-theme class="or-theme-scope"&gt;</Code>.
                  </>
                ),
                en: (
                  <>
                    <Code>document</Code> sets it on <Code>&lt;html&gt;</Code>; <Code>scoped</Code>{' '}
                    wraps children in <Code>&lt;div data-theme class="or-theme-scope"&gt;</Code>.
                  </>
                ),
              },
            },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="App.tsx"
          code={`import { OrangeProvider, type ThemeSetting } from '@orange/ui'
import { useState } from 'react'

const CHAVE = 'tema'

function lerTema(): ThemeSetting {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'light' || salvo === 'dark') return salvo
  } catch {}
  return 'system'
}

export function App() {
  const [tema, setTema] = useState<ThemeSetting>(lerTema)
  return (
    <OrangeProvider
      theme={tema}
      onThemeChange={(proximo) => {
        setTema(proximo)
        try { localStorage.setItem(CHAVE, proximo) } catch {}
      }}
    >
      <Rotas />
    </OrangeProvider>
  )
}`}
        />
      </Section>

      <Section title="useTheme()" id="use-theme">
        <Prose>
          <p>
            <T
              pt={
                <>
                  Qualquer componente dentro do provider lê e altera o tema com{' '}
                  <Code>useTheme()</Code>: <Code>theme</Code> é a preferência (pode ser{' '}
                  <Code>system</Code>), <Code>resolvedTheme</Code> é o tema aplicado de fato. Fora
                  de um provider, o hook devolve <Code>dark</Code>.
                </>
              }
              en={
                <>
                  Any component inside the provider reads and changes the theme with{' '}
                  <Code>useTheme()</Code>: <Code>theme</Code> is the preference (may be{' '}
                  <Code>system</Code>), <Code>resolvedTheme</Code> is the theme actually applied.
                  Outside a provider the hook returns <Code>dark</Code>.
                </>
              }
            />
          </p>
        </Prose>
        <Example
          title={{ pt: 'Tema escopado ao vivo', en: 'Live scoped theme' }}
          description={{
            pt: 'Um OrangeProvider aninhado com themeTarget="scoped": os botões mudam o tema só desta caixa, sem afetar a página.',
            en: 'A nested OrangeProvider with themeTarget="scoped": the buttons change the theme of this box only, not the page.',
          }}
          code={useThemeCode}
          align="stretch"
          collapsed
        >
          <OrangeProvider themeTarget="scoped" defaultTheme="light" locale={uiLocale}>
            <ThemeControls />
          </OrangeProvider>
        </Example>
      </Section>

      <Section title={{ pt: 'Tema por seção', en: 'Per-section theme' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Como os tokens semânticos são definidos em <Code>[data-theme='dark']</Code> e{' '}
                  <Code>[data-theme='light']</Code>, basta o atributo em qualquer elemento para
                  inverter aquela região — útil para um rodapé escuro numa página clara ou para
                  prévias, como as desta documentação.
                </>
              }
              en={
                <>
                  Since semantic tokens are defined under <Code>[data-theme='dark']</Code> and{' '}
                  <Code>[data-theme='light']</Code>, the attribute on any element flips that region
                  — handy for a dark footer on a light page, or for previews like the ones in these
                  docs.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="tsx"
          title="Rodape.tsx"
          code={`<footer data-theme="dark" className="rodape">
  {/* tudo aqui dentro usa os tokens do tema escuro */}
</footer>

/* rodape.css — o elemento precisa pintar o próprio fundo */
.rodape {
  background: var(--or-color-bg);
  color: var(--or-color-text);
}`}
        />
        <Callout
          tone="info"
          title={{ pt: 'Pinte o fundo da região', en: 'Paint the region background' }}
        >
          <p>
            <T
              pt={
                <>
                  O atributo só troca as variáveis. Quem define <Code>background</Code> e{' '}
                  <Code>color</Code> é o elemento — sem isso, o texto creme do tema escuro aparece
                  sobre o fundo claro da página.
                </>
              }
              en={
                <>
                  The attribute only swaps variables. The element itself sets{' '}
                  <Code>background</Code> and <Code>color</Code> — without that, the dark theme’s
                  cream text shows on the page’s light background.
                </>
              }
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Seguir o sistema', en: 'Follow the system' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Com <Code>theme="system"</Code> (ou <Code>defaultTheme="system"</Code>), o
                  provider acompanha <Code>prefers-color-scheme</Code> e reage quando a pessoa muda
                  o sistema. Os temas também definem <Code>color-scheme</Code>, então barras de
                  rolagem e controles nativos combinam com o tema.
                </>
              }
              en={
                <>
                  With <Code>theme="system"</Code> (or <Code>defaultTheme="system"</Code>), the
                  provider follows <Code>prefers-color-scheme</Code> and reacts when the person
                  changes their system. Themes also set <Code>color-scheme</Code>, so scrollbars and
                  native controls match the theme.
                </>
              }
            />
          </p>
        </Prose>
        <p className="guide-live" role="status">
          prefers-color-scheme: <strong>{prefersLight ? 'light' : 'dark'}</strong>
        </p>
        <Bullets
          items={[
            {
              pt: 'Ofereça três opções — claro, escuro e sistema — e lembre a escolha.',
              en: 'Offer three options — light, dark and system — and remember the choice.',
            },
            {
              pt: (
                <>
                  Aplique o tema antes da primeira pintura com um script inline no{' '}
                  <Code>&lt;head&gt;</Code> (veja <em>Começando → Next.js e SSR</em>).
                </>
              ),
              en: (
                <>
                  Apply the theme before first paint with an inline script in{' '}
                  <Code>&lt;head&gt;</Code> (see <em>Getting started → Next.js and SSR</em>).
                </>
              ),
            },
            {
              pt: (
                <>
                  Atualize a meta <Code>theme-color</Code> se o navegador pintar a barra de
                  endereço.
                </>
              ),
              en: (
                <>
                  Update the <Code>theme-color</Code> meta if the browser paints the address bar.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Criando um tema', en: 'Creating a theme' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Para usar a cor da sua marca, sobrescreva os tokens{' '}
                  <Code>--or-color-accent*</Code>, <Code>--or-color-focus</Code> e{' '}
                  <Code>--or-color-text-on-accent</Code> nos dois temas. Escolha uma cor abaixo: o
                  gerador calcula as variações, ajusta o <Code>accent-text</Code> até 4.5:1 e mostra
                  os contrastes ao vivo.
                </>
              }
              en={
                <>
                  To use your brand color, override the <Code>--or-color-accent*</Code>,{' '}
                  <Code>--or-color-focus</Code> and <Code>--or-color-text-on-accent</Code> tokens in
                  both themes. Pick a color below: the generator derives the variants, adjusts{' '}
                  <Code>accent-text</Code> up to 4.5:1 and shows contrast live.
                </>
              }
            />
          </p>
        </Prose>
        <ThemeBuilder />
        <Bullets
          items={[
            {
              pt: 'O acento como elemento gráfico (botão, borda de seleção) precisa de ≥ 3:1 contra o fundo; texto sobre ele, de ≥ 4.5:1.',
              en: 'The accent as a graphic (button, selection border) needs ≥ 3:1 against the background; text on it needs ≥ 4.5:1.',
            },
            {
              pt: 'Se o mesmo valor não passa nos dois temas, use tons diferentes por tema — é o que o Orange faz com o laranja 500 e 600.',
              en: 'If the same value doesn’t pass in both themes, use different shades per theme — just like Orange does with orange 500 and 600.',
            },
            {
              pt: (
                <>
                  Valide no seu CI com <Code>contrastRatio()</Code> de{' '}
                  <Code>@orange/tokens/contrast</Code>, como em <Code>contrast.test.ts</Code>.
                </>
              ),
              en: (
                <>
                  Validate in your CI with <Code>contrastRatio()</Code> from{' '}
                  <Code>@orange/tokens/contrast</Code>, as in <Code>contrast.test.ts</Code>.
                </>
              ),
            },
          ]}
        />
      </Section>
    </DocPage>
  )
}
