import {
  enUS,
  Icon,
  interpolate,
  OrangeProvider,
  ptBR,
  useDebouncedValue,
  useLocale,
  useTheme,
  type MessageKey,
} from '@orange/ui'
import { Fragment, useId, useMemo, useState } from 'react'
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
import { Segmented, TableWrap } from '../_shared/Blocks'

const keys = Object.keys(ptBR) as MessageKey[]

/** Destaca os marcadores {variável} de uma mensagem. */
function Message({ text }: { text: string }) {
  const parts = text.split(/(\{\w+\})/g)
  return (
    <>
      {parts.map((part, i) =>
        /^\{\w+\}$/.test(part) ? (
          <span key={i} className="guide-var">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

function MessagesTable() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 150)
  const inputId = useId()
  const rows = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return keys
    return keys.filter(
      (k) =>
        k.toLowerCase().includes(q) ||
        ptBR[k].toLowerCase().includes(q) ||
        enUS[k].toLowerCase().includes(q),
    )
  }, [debounced])

  return (
    <>
      <div className="guide-toolbar">
        <div className="guide-icons__search guide-search">
          <Icon name="search" size="sm" />
          <label htmlFor={inputId} className="or-visually-hidden">
            {t({ pt: 'Filtrar mensagens', en: 'Filter messages' })}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t({ pt: 'Filtrar por chave ou texto…', en: 'Filter by key or text…' })}
            autoComplete="off"
          />
        </div>
        <span className="guide-mono guide-muted" role="status">
          {t({
            pt: `${rows.length} de ${keys.length} chaves`,
            en: `${rows.length} of ${keys.length} keys`,
          })}
        </span>
      </div>
      <div className="guide-scroll">
        <TableWrap label={{ pt: 'Mensagens internas', en: 'Internal messages' }}>
          <table className="doc-table guide-messages">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Chave', en: 'Key' })}</th>
                <th scope="col">pt-BR</th>
                <th scope="col">en-US</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((key) => (
                <tr key={key}>
                  <th scope="row">
                    <Code>{key}</Code>
                  </th>
                  <td lang="pt-BR">
                    <Message text={ptBR[key]} />
                  </td>
                  <td lang="en">
                    <Message text={enUS[key]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </div>
    </>
  )
}

/* --- Demonstração ao vivo do provider ------------------------------------- */

function Readout({ count }: { count: number }) {
  const { locale, t } = useLocale()
  const samples: [string, string][] = [
    ["t('close')", t('close')],
    ["t('loading')", t('loading')],
    ["t('pageOf', { page: 2, total: 10 })", t('pageOf', { page: 2, total: 10 })],
    [`t('resultsCount', { count: ${count} })`, t('resultsCount', { count })],
    ["t('removeItem', { label: 'React' })", t('removeItem', { label: 'React' })],
  ]
  return (
    <dl className="guide-kv guide-readout">
      <dt>locale</dt>
      <dd>
        <Code>'{locale}'</Code>
      </dd>
      {samples.map(([call, out]) => (
        <Fragment key={call}>
          <dt>{call}</dt>
          <dd>“{out}”</dd>
        </Fragment>
      ))}
    </dl>
  )
}

function LocaleDemo() {
  const { t } = useLang()
  const { resolvedTheme } = useTheme()
  const [mode, setMode] = useState<'pt-BR' | 'en-US' | 'custom'>('pt-BR')
  const [count, setCount] = useState(3)
  const countId = useId()
  const overrides =
    mode === 'custom'
      ? { close: 'Fechar janela', resultsCount: '{count} produtos encontrados' }
      : undefined
  return (
    <div className="guide-stack guide-locale-demo">
      <div className="guide-row">
        <Segmented
          label={{ pt: 'Configuração do provider', en: 'Provider configuration' }}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'pt-BR', label: 'locale="pt-BR"' },
            { value: 'en-US', label: 'locale="en-US"' },
            { value: 'custom', label: t({ pt: 'pt-BR + messages', en: 'pt-BR + messages' }) },
          ]}
        />
        <label htmlFor={countId} className="guide-label">
          count
        </label>
        <input
          id={countId}
          type="number"
          min={0}
          value={count}
          onChange={(e) => setCount(Number(e.target.value) || 0)}
          className="or-control guide-number"
        />
      </div>
      <OrangeProvider
        themeTarget="scoped"
        theme={resolvedTheme}
        locale={mode === 'en-US' ? 'en-US' : 'pt-BR'}
        messages={overrides}
      >
        <div className="guide-theme-scope">
          <Readout count={count} />
        </div>
      </OrangeProvider>
    </div>
  )
}

/* --- Intl ------------------------------------------------------------------ */

const sampleDate = new Date(2026, 2, 15, 14, 30)

function IntlTable() {
  const { t } = useLang()
  const rows: { label: string; fmt: (locale: string) => string }[] = [
    { label: 'Intl.NumberFormat', fmt: (l) => new Intl.NumberFormat(l).format(1234567.891) },
    {
      label: "style: 'currency'",
      fmt: (l) => new Intl.NumberFormat(l, { style: 'currency', currency: 'BRL' }).format(1499.9),
    },
    {
      label: "style: 'percent'",
      fmt: (l) =>
        new Intl.NumberFormat(l, { style: 'percent', maximumFractionDigits: 1 }).format(0.127),
    },
    {
      label: "notation: 'compact'",
      fmt: (l) => new Intl.NumberFormat(l, { notation: 'compact' }).format(18400),
    },
    {
      label: "dateStyle: 'long'",
      fmt: (l) => new Intl.DateTimeFormat(l, { dateStyle: 'long' }).format(sampleDate),
    },
    {
      label: "dateStyle: 'short', timeStyle: 'short'",
      fmt: (l) =>
        new Intl.DateTimeFormat(l, { dateStyle: 'short', timeStyle: 'short' }).format(sampleDate),
    },
    {
      label: 'Intl.RelativeTimeFormat',
      fmt: (l) => new Intl.RelativeTimeFormat(l, { numeric: 'auto' }).format(-3, 'day'),
    },
    {
      label: 'Intl.ListFormat',
      fmt: (l) =>
        new Intl.ListFormat(l, { type: 'conjunction' }).format(['Pix', 'Boleto', 'Cartão']),
    },
    {
      label: 'Intl.PluralRules',
      fmt: (l) => [0, 1, 2].map((n) => `${n}→${new Intl.PluralRules(l).select(n)}`).join(' · '),
    },
  ]
  return (
    <TableWrap label={{ pt: 'Formatação com Intl', en: 'Formatting with Intl' }}>
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">API</th>
            <th scope="col">pt-BR</th>
            <th scope="col">en-US</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">
                <span className="guide-mono">{row.label}</span>
              </th>
              <td lang="pt-BR">{row.fmt('pt-BR')}</td>
              <td lang="en">{row.fmt('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="or-visually-hidden">
        {t({
          pt: 'Valores calculados ao vivo pelo navegador.',
          en: 'Values computed live by the browser.',
        })}
      </p>
    </TableWrap>
  )
}

export default function I18nPage() {
  return (
    <DocPage
      eyebrow={{ pt: 'Usando', en: 'Usage' }}
      title={{ pt: 'Internacionalização', en: 'Internationalization' }}
      lead={{
        pt: 'Os componentes do Orange falam português e inglês. Rótulos internos — “Fechar”, “Próxima página”, “Carregando…” — vêm de um dicionário que você escolhe, traduz ou sobrescreve pelo OrangeProvider.',
        en: 'Orange components speak Portuguese and English. Internal labels — “Close”, “Next page”, “Loading…” — come from a dictionary you choose, translate or override through OrangeProvider.',
      }}
    >
      <Section title={{ pt: 'O locale do provider', en: 'The provider locale' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Passe <Code>locale</Code> no <Code>OrangeProvider</Code>. O dicionário é escolhido
                  pelo valor exato (<Code>pt-BR</Code>, <Code>en-US</Code>), depois pelo idioma (
                  <Code>pt</Code>, <Code>en</Code>) e, por fim, cai em <Code>pt-BR</Code>. O
                  provider não muda o <Code>lang</Code> do documento — sincronize-o você mesmo.
                </>
              }
              en={
                <>
                  Pass <Code>locale</Code> to <Code>OrangeProvider</Code>. The dictionary is picked
                  by exact value (<Code>pt-BR</Code>, <Code>en-US</Code>), then by language (
                  <Code>pt</Code>, <Code>en</Code>) and finally falls back to <Code>pt-BR</Code>.
                  The provider doesn’t change the document <Code>lang</Code> — keep it in sync
                  yourself.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="tsx"
          title="main.tsx"
          code={`import { OrangeProvider } from '@orange/ui'

const idioma = navigator.language.startsWith('en') ? 'en-US' : 'pt-BR'
document.documentElement.lang = idioma

createRoot(root).render(
  <OrangeProvider locale={idioma}>
    <App />
  </OrangeProvider>,
)`}
        />
        <PropsTable
          rows={[
            {
              name: 'locale',
              type: "'pt-BR' | 'en-US' | string",
              default: "'pt-BR'",
              description: {
                pt: 'Idioma das mensagens internas.',
                en: 'Language of the internal messages.',
              },
            },
            {
              name: 'messages',
              type: 'Partial<Messages>',
              description: {
                pt: 'Sobrescreve chaves específicas, mesclando com o dicionário do locale.',
                en: 'Overrides specific keys, merged over the locale dictionary.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Mensagens internas ao vivo', en: 'Internal messages, live' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Cada componente lê seus textos com <Code>useLocale().t(chave, variáveis)</Code>.
                  Troque a configuração abaixo e veja as mesmas chaves mudarem. A terceira opção
                  mantém <Code>pt-BR</Code> e sobrescreve duas mensagens.
                </>
              }
              en={
                <>
                  Each component reads its text with <Code>useLocale().t(key, variables)</Code>.
                  Switch the configuration below and watch the same keys change. The third option
                  keeps <Code>pt-BR</Code> and overrides two messages.
                </>
              }
            />
          </p>
        </Prose>
        <Example
          code={`<OrangeProvider
  locale="pt-BR"
  messages={{
    close: 'Fechar janela',
    resultsCount: '{count} produtos encontrados',
  }}
>
  <App />
</OrangeProvider>

// Dentro de qualquer componente:
const { locale, t } = useLocale()
t('close')                              // "Fechar janela"
t('pageOf', { page: 2, total: 10 })     // "Página 2 de 10"
t('resultsCount', { count: 3 })         // "3 produtos encontrados"`}
          align="stretch"
          collapsed
        >
          <LocaleDemo />
        </Example>
      </Section>

      <Section title={{ pt: 'Todas as chaves', en: 'All keys' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Gerada a partir de <Code>ptBR</Code> e <Code>enUS</Code>, exportados por{' '}
                  <Code>@orange/ui</Code> — esta tabela está sempre em dia com o código. Trechos
                  entre chaves, como <span className="guide-var">{'{count}'}</span>, são
                  substituídos na interpolação.
                </>
              }
              en={
                <>
                  Generated from <Code>ptBR</Code> and <Code>enUS</Code>, exported by{' '}
                  <Code>@orange/ui</Code> — this table is always in sync with the code. Segments in
                  braces, like <span className="guide-var">{'{count}'}</span>, are replaced during
                  interpolation.
                </>
              }
            />
          </p>
        </Prose>
        <MessagesTable />
      </Section>

      <Section title={{ pt: 'Interpolação', en: 'Interpolation' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Use <Code>{'{nome}'}</Code> no texto e passe os valores no segundo argumento de{' '}
                  <Code>t()</Code>. Variáveis ausentes ficam como estão, o que facilita achar erros.
                  A mesma função está exportada como <Code>interpolate()</Code> para seus próprios
                  textos.
                </>
              }
              en={
                <>
                  Use <Code>{'{name}'}</Code> in the text and pass values as the second argument of{' '}
                  <Code>t()</Code>. Missing variables are left as-is, which makes mistakes easy to
                  spot. The same function is exported as <Code>interpolate()</Code> for your own
                  strings.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="ts"
          title="interpolate.ts"
          code={`import { interpolate } from '@orange/ui'

interpolate('Página {page} de {total}', { page: 2, total: 10 })
// "${interpolate('Página {page} de {total}', { page: 2, total: 10 })}"

interpolate('Olá, {nome}! Você tem {n} pedidos.', { nome: 'Ana' })
// "${interpolate('Olá, {nome}! Você tem {n} pedidos.', { nome: 'Ana' })}"`}
        />
      </Section>

      <Section
        title={{ pt: 'useLocale() nos seus componentes', en: 'useLocale() in your components' }}
      >
        <Prose>
          <p>
            <T
              pt={
                <>
                  Componentes da sua aplicação podem reaproveitar o dicionário. Prefira as chaves
                  existentes a textos fixos: assim a tradução e as sobrescritas valem para tudo.
                </>
              }
              en={
                <>
                  Your app components can reuse the dictionary. Prefer existing keys over hard-coded
                  text: that way translation and overrides apply everywhere.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="tsx"
          title="Aviso.tsx"
          code={`import { Button, Icon, useLocale } from '@orange/ui'

export function Aviso({ children, onDismiss }: { children: React.ReactNode; onDismiss: () => void }) {
  const { t } = useLocale()
  return (
    <div role="status" className="aviso">
      <Icon name="info" label={t('info')} />
      <p>{children}</p>
      <Button variant="ghost" iconOnly aria-label={t('dismiss')} onClick={onDismiss}>
        <Icon name="close" />
      </Button>
    </div>
  )
}`}
        />
        <Callout tone="info" title={{ pt: 'Precisa de uma chave nova?', en: 'Need a new key?' }}>
          <p>
            <T
              pt={
                <>
                  Ao contribuir com um componente, adicione a chave em <Code>ptBR</Code> e{' '}
                  <Code>enUS</Code> (<Code>packages/ui/src/providers/messages.ts</Code>). O tipo{' '}
                  <Code>Messages</Code> garante que nenhum idioma fique sem tradução.
                </>
              }
              en={
                <>
                  When contributing a component, add the key to both <Code>ptBR</Code> and{' '}
                  <Code>enUS</Code> (<Code>packages/ui/src/providers/messages.ts</Code>). The{' '}
                  <Code>Messages</Code> type ensures no language is left untranslated.
                </>
              }
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Adicionando um idioma', en: 'Adding a language' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Para um idioma que o Orange não traz, crie um objeto <Code>Messages</Code>{' '}
                  completo e passe-o em <Code>messages</Code>. Partir de <Code>enUS</Code> com
                  spread garante que nenhuma chave fique faltando enquanto a tradução avança.
                </>
              }
              en={
                <>
                  For a language Orange doesn’t ship, create a complete <Code>Messages</Code> object
                  and pass it as <Code>messages</Code>. Spreading <Code>enUS</Code> ensures no key
                  is missing while the translation is in progress.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="tsx"
          title="es-ES.ts"
          code={`import { enUS, OrangeProvider, type Messages } from '@orange/ui'

export const esES: Messages = {
  ...enUS,
  close: 'Cerrar',
  cancel: 'Cancelar',
  loading: 'Cargando…',
  nextPage: 'Página siguiente',
  pageOf: 'Página {page} de {total}',
  // …
}

<OrangeProvider locale="es-ES" messages={esES}>
  <App />
</OrangeProvider>`}
        />
      </Section>

      <Section title={{ pt: 'Datas, números e moedas', en: 'Dates, numbers and currency' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Formatação não é tradução: use as APIs <Code>Intl</Code> do navegador com o mesmo
                  locale do provider. Elas cuidam de separadores, moeda, ordem de dia e mês, plurais
                  e listas. A tabela abaixo é calculada ao vivo para 15/03/2026 14h30.
                </>
              }
              en={
                <>
                  Formatting is not translation: use the browser’s <Code>Intl</Code> APIs with the
                  same locale as the provider. They handle separators, currency, day/month order,
                  plurals and lists. The table below is computed live for March 15, 2026 2:30 PM.
                </>
              }
            />
          </p>
        </Prose>
        <IntlTable />
        <CodeBlock
          language="tsx"
          title="Preco.tsx"
          code={`import { useLocale } from '@orange/ui'

export function Preco({ valor }: { valor: number }) {
  const { locale } = useLocale()
  const formato = new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' })
  return <span className="preco">{formato.format(valor)}</span>
}`}
        />
      </Section>

      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Mantenha o <Code>lang</Code> do <Code>&lt;html&gt;</Code> igual ao locale; marque
                  trechos em outro idioma com <Code>lang</Code> (3.1.2).
                </>
              ),
              en: (
                <>
                  Keep the <Code>&lt;html&gt;</Code> <Code>lang</Code> equal to the locale; mark
                  passages in another language with <Code>lang</Code> (3.1.2).
                </>
              ),
            },
            {
              pt: (
                <>
                  Não concatene frases (<Code>{"'Página ' + n + ' de ' + total"}</Code>): a ordem
                  das palavras muda entre idiomas. Use uma mensagem com variáveis.
                </>
              ),
              en: (
                <>
                  Don’t concatenate sentences (<Code>{"'Page ' + n + ' of ' + total"}</Code>): word
                  order changes between languages. Use one message with variables.
                </>
              ),
            },
            {
              pt: 'Deixe espaço: textos em português costumam ser 20–30% mais longos que em inglês. Evite larguras fixas em botões e abas.',
              en: 'Leave room: Portuguese text is often 20–30% longer than English. Avoid fixed widths on buttons and tabs.',
            },
            {
              pt: (
                <>
                  Para plurais, use <Code>Intl.PluralRules</Code> e escolha a mensagem pela
                  categoria (<Code>one</Code>, <Code>other</Code>…).
                </>
              ),
              en: (
                <>
                  For plurals, use <Code>Intl.PluralRules</Code> and pick the message by category (
                  <Code>one</Code>, <Code>other</Code>…).
                </>
              ),
            },
            {
              pt: 'Textos do seu produto (títulos, rótulos de campo) chegam aos componentes por props, já traduzidos pela sua solução de i18n (react-intl, i18next, Lingui…).',
              en: 'Your product text (headings, field labels) reaches components through props, already translated by your i18n solution (react-intl, i18next, Lingui…).',
            },
          ]}
        />
      </Section>
    </DocPage>
  )
}
