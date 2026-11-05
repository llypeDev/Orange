import {
  Button,
  Field,
  Icon,
  useFieldControlProps,
  useReducedMotion,
  VisuallyHidden,
} from '@orangesys/ui'
import { controlSize, themes, type ThemeName } from '@orangesys/tokens'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  DocPage,
  Example,
  KeyboardTable,
  Prose,
  Section,
  slugify,
  WcagList,
} from '../../../kit'
import { Cards, Checklist, ContrastBadge, Steps, TableWrap } from '../_shared/Blocks'
import { ratioOf } from '../_shared/color'

const textPairs: [string, string][] = [
  ['text', 'bg'],
  ['text', 'surface-raised'],
  ['text-muted', 'bg'],
  ['text-subtle', 'bg'],
  ['text-on-accent', 'accent'],
  ['text-on-accent', 'accent-hover'],
  ['text-on-neutral', 'neutral'],
  ['text-on-danger', 'danger'],
  ['accent-text', 'bg'],
  ['success-text', 'bg'],
  ['warning-text', 'bg'],
  ['danger-text', 'bg'],
  ['info-text', 'bg'],
  ['text-inverse', 'surface-inverse'],
  ['code-text', 'code-bg'],
]

const uiPairs: [string, string][] = [
  ['border-control', 'bg'],
  ['border-control', 'surface'],
  ['focus', 'bg'],
  ['accent', 'bg'],
]

const value = (theme: ThemeName, token: string) =>
  (themes[theme] as unknown as Record<string, string>)[token]

function PairCell({
  theme,
  fg,
  bg,
  kind,
}: {
  theme: ThemeName
  fg: string
  bg: string
  kind: 'text' | 'ui'
}) {
  return (
    <td>
      <span className="guide-pair">
        <span
          className="guide-pair__sample"
          style={{ background: value(theme, bg), color: value(theme, fg) }}
          aria-hidden="true"
        >
          {kind === 'text' ? (
            'Aa'
          ) : (
            <span className="guide-pair__ui" style={{ borderColor: value(theme, fg) }} />
          )}
        </span>
        <ContrastBadge ratio={ratioOf(theme, fg, bg)} kind={kind} />
      </span>
    </td>
  )
}

function ContrastTable() {
  const { t } = useLang()
  const rows = [
    ...textPairs.map((p) => [...p, 'text'] as const),
    ...uiPairs.map((p) => [...p, 'ui'] as const),
  ]
  return (
    <TableWrap label={{ pt: 'Contraste dos pares semânticos', en: 'Semantic pair contrast' }}>
      <table className="doc-table guide-contrast-pairs">
        <thead>
          <tr>
            <th scope="col">
              {t({ pt: 'Par (frente / fundo)', en: 'Pair (foreground / background)' })}
            </th>
            <th scope="col">{t({ pt: 'Mínimo', en: 'Minimum' })}</th>
            <th scope="col">{t({ pt: 'Escuro', en: 'Dark' })}</th>
            <th scope="col">{t({ pt: 'Claro', en: 'Light' })}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([fg, bg, kind]) => (
            <tr key={`${fg}-${bg}`}>
              <th scope="row">
                {/* Cada token fica inteiro (nowrap); a linha só quebra nos espaços em volta
                    da barra — assim nomes longos como "text-inverse / surface-inverse"
                    ocupam duas linhas em vez de alargar a tabela além da coluna. */}
                <span className="guide-mono">
                  <span className="guide-nowrap">{fg}</span> <span className="guide-muted">/</span>{' '}
                  <span className="guide-nowrap">{bg}</span>
                </span>
              </th>
              <td>
                <span className="guide-mono">{kind === 'text' ? '4.5:1' : '3:1'}</span>
              </td>
              <PairCell theme="dark" fg={fg} bg={bg} kind={kind} />
              <PairCell theme="light" fg={fg} bg={bg} kind={kind} />
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  )
}

function CartAnnouncer() {
  const { t } = useLang()
  const [count, setCount] = useState(2)
  return (
    <div className="guide-row">
      <Button
        variant="outline"
        startIcon={<Icon name="plus" size="sm" />}
        onClick={() => setCount((c) => c + 1)}
      >
        {t({ pt: 'Adicionar ao carrinho', en: 'Add to cart' })}
      </Button>
      <Button
        variant="ghost"
        iconOnly
        aria-label={t({ pt: 'Remover do carrinho', en: 'Remove from cart' })}
        onClick={() => setCount((c) => Math.max(0, c - 1))}
      >
        <Icon name="minus" />
      </Button>
      <p className="guide-live" role="status">
        <Icon name="inbox" size="sm" /> <strong>{count}</strong>{' '}
        {t({
          pt: count === 1 ? 'item no carrinho' : 'itens no carrinho',
          en: count === 1 ? 'item in cart' : 'items in cart',
        })}
      </p>
    </div>
  )
}

function SignupForm() {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const error =
    submitted && !/^\S+@\S+\.\S+$/.test(email)
      ? t({
          pt: 'Informe um e-mail no formato nome@empresa.com.',
          en: 'Enter an email like name@company.com.',
        })
      : undefined
  return (
    <form
      className="guide-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
    >
      <Field
        label={t({ pt: 'E-mail de trabalho', en: 'Work email' })}
        description={t({
          pt: 'Enviaremos o convite para este endereço.',
          en: "We'll send the invite to this address.",
        })}
        error={error}
        required
      >
        <EmailInput value={email} onChange={setEmail} />
      </Field>
      <div>
        <Button type="submit">{t({ pt: 'Enviar convite', en: 'Send invite' })}</Button>
      </div>
      {submitted && !error && (
        <p className="guide-live" role="status">
          {t({ pt: `Convite enviado para ${email}.`, en: `Invite sent to ${email}.` })}
        </p>
      )}
    </form>
  )
}

/** Input ligado ao Field: id, aria-describedby, aria-invalid e required vêm do contexto. */
function EmailInput({
  value: current,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const fieldProps = useFieldControlProps()
  return (
    <input
      {...fieldProps}
      className="or-control"
      type="email"
      autoComplete="email"
      value={current}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

const signupCode = `import { Button, Field, useFieldControlProps } from '@orangesys/ui'
import { useState } from 'react'

function EmailInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  // id, aria-describedby, aria-invalid e required vêm do Field
  const fieldProps = useFieldControlProps()
  return <input {...fieldProps} {...props} className="or-control" type="email" autoComplete="email" />
}

export function Convite() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState<string>()
  return (
    <form noValidate onSubmit={(e) => {
      e.preventDefault()
      setErro(/^\\S+@\\S+\\.\\S+$/.test(email) ? undefined : 'Informe um e-mail no formato nome@empresa.com.')
    }}>
      <Field label="E-mail de trabalho" description="Enviaremos o convite para este endereço." error={erro} required>
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Button type="submit">Enviar convite</Button>
    </form>
  )
}`

/** Papéis das cores do sistema nos blocos `@media (forced-colors: active)` dos componentes. */
const forcedColorRoles: { color: string; use: Localized<string> }[] = [
  {
    color: 'Canvas / CanvasText',
    use: {
      pt: 'Fundo e texto da página; bordas, separadores, eixos de gráfico e “vazios” (a falha do anel de carregamento, células do calendário).',
      en: 'Page background and text; borders, separators, chart axes and “gaps” (the loading ring gap, calendar cells).',
    },
  },
  {
    color: 'Highlight / HighlightText',
    use: {
      pt: 'Tudo que está selecionado, marcado, atual ou preenchido: caixas, switches, rádios, abas, opções, dias, estrelas, barras de progresso e a página atual.',
      en: 'Everything selected, checked, current or filled: boxes, switches, radios, tabs, options, days, stars, progress bars and the current page.',
    },
  },
  {
    color: 'ButtonText / ButtonFace',
    use: {
      pt: 'Botões, chips, trilho do Switch e polegar do Slider.',
      en: 'Buttons, chips, the Switch track and the Slider thumb.',
    },
  },
  {
    color: 'LinkText',
    use: {
      pt: 'Links, inclusive o SkipLink e as setas do Footer.',
      en: 'Links, including SkipLink and the Footer arrows.',
    },
  },
  {
    color: 'GrayText',
    use: {
      pt: 'Estados desabilitados: rótulos, caixas, trilhos, estrelas, opções e botões.',
      en: 'Disabled states: labels, boxes, tracks, stars, options and buttons.',
    },
  },
  {
    color: 'Mark / MarkText',
    use: {
      pt: 'Trechos destacados: termos encontrados (Highlight), linhas em destaque do CodeBlock e os dias entre o início e o fim no RangeCalendar.',
      en: 'Marked passages: matched terms (Highlight), highlighted CodeBlock lines and the days between start and end in RangeCalendar.',
    },
  },
]

const principles: { letter: string; title: Localized<string>; text: Localized<string> }[] = [
  {
    letter: 'P',
    title: { pt: 'Perceptível', en: 'Perceivable' },
    text: {
      pt: 'Contraste garantido pelos tokens, ícones informativos com rótulo, status com ícone e texto, nada comunicado só por cor.',
      en: 'Contrast guaranteed by tokens, informative icons with labels, status with icon and text, nothing conveyed by color alone.',
    },
  },
  {
    letter: 'O',
    title: { pt: 'Operável', en: 'Operable' },
    text: {
      pt: 'Tudo funciona por teclado, foco sempre visível, alvos de pelo menos 24×24px e nenhuma animação obrigatória.',
      en: 'Everything works by keyboard, focus is always visible, targets are at least 24×24px and no animation is mandatory.',
    },
  },
  {
    letter: 'C',
    title: { pt: 'Compreensível', en: 'Understandable' },
    text: {
      pt: 'Rótulos visíveis, erros que dizem como corrigir, comportamento previsível e mensagens internas no idioma da página.',
      en: 'Visible labels, errors that explain how to fix them, predictable behavior and internal messages in the page language.',
    },
  },
  {
    letter: 'R',
    title: { pt: 'Robusto', en: 'Robust' },
    text: {
      pt: 'HTML nativo primeiro e ARIA seguindo o APG, para funcionar em qualquer navegador e tecnologia assistiva.',
      en: 'Native HTML first and ARIA following the APG, so it works with any browser and assistive technology.',
    },
  },
]

export default function AccessibilityPage() {
  const { t, to } = useLang()
  const reduced = useReducedMotion()
  const forcedTestId = slugify(
    t({ pt: 'Como testar o alto contraste', en: 'How to test high contrast' }),
  )
  const sizes = Object.entries(controlSize).map(([name, rem]) => ({
    name,
    px: parseFloat(rem) * 16,
  }))

  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Acessibilidade', en: 'Accessibility' }}
      lead={{
        pt: 'O Orange é construído para atender à WCAG 2.2 nível AA. Os componentes cuidam da semântica, do teclado, do foco e do contraste — e esta página mostra o que fica com quem monta as telas.',
        en: 'Orange is built to meet WCAG 2.2 level AA. Components take care of semantics, keyboard, focus and contrast — and this page shows what is left to whoever builds the screens.',
      }}
    >
      <Section title={{ pt: 'Nosso compromisso', en: 'Our commitment' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Acessibilidade é um requisito de entrada: nenhum componente é publicado sem
                  navegação por teclado completa, nome acessível, foco visível, testes com axe-core
                  e contraste validado nos dois temas. Seguimos a{' '}
                  <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">
                    WCAG 2.2
                  </a>{' '}
                  no nível AA e os padrões do{' '}
                  <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">
                    WAI-ARIA Authoring Practices
                  </a>
                  .
                </>
              }
              en={
                <>
                  Accessibility is an entry requirement: no component ships without full keyboard
                  navigation, an accessible name, visible focus, axe-core tests and contrast
                  validated in both themes. We follow{' '}
                  <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">
                    WCAG 2.2
                  </a>{' '}
                  at level AA and the{' '}
                  <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">
                    WAI-ARIA Authoring Practices
                  </a>{' '}
                  patterns.
                </>
              }
            />
          </p>
        </Prose>
        <Callout
          tone="warning"
          title={{
            pt: 'Componentes acessíveis não garantem telas acessíveis',
            en: "Accessible components don't guarantee accessible screens",
          }}
        >
          <p>
            <T
              pt="Ordem dos títulos, textos dos rótulos, mensagens de erro, texto alternativo de imagens e a ordem de leitura dependem de quem usa os componentes. O checklist no fim desta página cobre essa parte."
              en="Heading order, label wording, error messages, image alt text and reading order depend on whoever uses the components. The checklist at the end of this page covers that part."
            />
          </p>
        </Callout>
        <p className="guide-muted guide-note">
          <T
            pt={
              <>
                Critério por critério, o que o Orange cobre e como foi verificado está no{' '}
                <Link to={to('/design-guidelines/conformance')}>Relatório de conformidade</Link>{' '}
                (autoavaliação; a auditoria externa está prevista para a 1.0).
              </>
            }
            en={
              <>
                Criterion by criterion, what Orange covers and how it was verified is in the{' '}
                <Link to={to('/design-guidelines/conformance')}>Conformance report</Link>{' '}
                (self-assessment; the external audit is planned for 1.0).
              </>
            }
          />
        </p>
      </Section>

      <Section title={{ pt: 'Princípios POUR', en: 'POUR principles' }}>
        <ul className="guide-pour">
          {principles.map((p) => (
            <li key={p.letter}>
              <span className="guide-pour__letter" aria-hidden="true">
                {p.letter}
              </span>
              <p className="guide-pour__title">{t(p.title)}</p>
              <p className="guide-pour__text">{t(p.text)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={{ pt: 'Teclado', en: 'Keyboard' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Tudo o que se faz com o mouse precisa ser possível com o teclado (2.1.1). A ordem
                  do foco segue a ordem visual; nunca use <Code>tabindex</Code> positivo. Em widgets
                  compostos — abas, menus, grupos de rádio — o <Code>Tab</Code> entra e sai do grupo
                  e as setas movem entre os itens (padrão <em>roving tabindex</em>, disponível em{' '}
                  <Code>useRovingFocus</Code>).
                </>
              }
              en={
                <>
                  Everything you can do with a mouse must be possible with a keyboard (2.1.1). Focus
                  order follows visual order; never use a positive <Code>tabindex</Code>. In
                  composite widgets — tabs, menus, radio groups — <Code>Tab</Code> enters and leaves
                  the group and arrow keys move between items (the <em>roving tabindex</em> pattern,
                  available as <Code>useRovingFocus</Code>).
                </>
              }
            />
          </p>
        </Prose>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Move o foco para o próximo elemento interativo.',
                en: 'Moves focus to the next interactive element.',
              },
            },
            {
              keys: ['Shift', 'Tab'],
              description: {
                pt: 'Move o foco para o elemento anterior.',
                en: 'Moves focus to the previous element.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Ativa links e botões; envia formulários.',
                en: 'Activates links and buttons; submits forms.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'Ativa botões, marca caixas de seleção, abre selects.',
                en: 'Activates buttons, toggles checkboxes, opens selects.',
              },
            },
            {
              keys: ['Esc'],
              description: {
                pt: 'Fecha modais, popovers, menus e tooltips; devolve o foco para quem abriu.',
                en: 'Closes modals, popovers, menus and tooltips; returns focus to the trigger.',
              },
            },
            {
              keys: ['← ↑ → ↓'],
              description: {
                pt: 'Navega dentro de abas, menus, listas, grupos de rádio e sliders.',
                en: 'Navigates within tabs, menus, lists, radio groups and sliders.',
              },
            },
            {
              keys: ['Home'],
              description: {
                pt: 'Vai para o primeiro item do grupo (ou o início do campo de texto).',
                en: 'Jumps to the first item in the group (or the start of a text field).',
              },
            },
            {
              keys: ['End'],
              description: {
                pt: 'Vai para o último item do grupo (ou o fim do campo de texto).',
                en: 'Jumps to the last item in the group (or the end of a text field).',
              },
            },
            {
              keys: ['Page Up'],
              description: {
                pt: 'Passo maior em sliders; mês anterior em calendários.',
                en: 'Larger step in sliders; previous month in calendars.',
              },
            },
            {
              keys: ['Page Down'],
              description: {
                pt: 'Passo maior em sliders; próximo mês em calendários.',
                en: 'Larger step in sliders; next month in calendars.',
              },
            },
            {
              keys: ['a–z'],
              description: {
                pt: 'Busca por digitação em listas e menus (type-ahead).',
                en: 'Type-ahead search in lists and menus.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Foco visível', en: 'Visible focus' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Todo elemento focável mostra um contorno de 2px em <Code>--or-color-focus</Code>{' '}
                  com 2px de afastamento, aplicado em <Code>:focus-visible</Code> pelo{' '}
                  <Code>base.css</Code>. O contraste do foco contra o fundo é de{' '}
                  {ratioOf('dark', 'focus', 'bg').toFixed(2)}:1 no tema escuro e{' '}
                  {ratioOf('light', 'focus', 'bg').toFixed(2)}:1 no claro — acima dos 3:1 exigidos
                  (1.4.11).
                </>
              }
              en={
                <>
                  Every focusable element shows a 2px outline in <Code>--or-color-focus</Code>{' '}
                  offset by 2px, applied on <Code>:focus-visible</Code> by <Code>base.css</Code>.
                  Focus contrast against the background is{' '}
                  {ratioOf('dark', 'focus', 'bg').toFixed(2)}:1 on dark and{' '}
                  {ratioOf('light', 'focus', 'bg').toFixed(2)}:1 on light — above the required 3:1
                  (1.4.11).
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
                  Nunca remova o contorno com <Code>outline: none</Code> sem oferecer um substituto
                  igualmente visível.
                </>
              ),
              en: (
                <>
                  Never remove the outline with <Code>outline: none</Code> without an equally
                  visible replacement.
                </>
              ),
            },
            {
              pt: (
                <>
                  Elementos fixos não podem esconder o item focado (2.4.11). A documentação usa{' '}
                  <Code>scroll-padding-top</Code> com a altura do cabeçalho.
                </>
              ),
              en: (
                <>
                  Sticky elements must not hide the focused item (2.4.11). These docs use{' '}
                  <Code>scroll-padding-top</Code> with the header height.
                </>
              ),
            },
            {
              pt: 'Ao abrir um modal, o foco vai para dentro; ao fechar, volta para o botão que o abriu (useFocusTrap faz os dois).',
              en: 'When a modal opens, focus moves inside; when it closes, focus returns to the button that opened it (useFocusTrap does both).',
            },
          ]}
        />
        <Example
          title={{ pt: 'Experimente com Tab', en: 'Try it with Tab' }}
          description={{
            pt: 'Clique na prévia e use Tab e Shift+Tab. O contorno só aparece na navegação por teclado.',
            en: 'Click the preview and use Tab and Shift+Tab. The outline only shows for keyboard navigation.',
          }}
          align="center"
        >
          <Button>{t({ pt: 'Salvar', en: 'Save' })}</Button>
          <Button variant="outline">{t({ pt: 'Cancelar', en: 'Cancel' })}</Button>
          <a
            href={`#${slugify(t({ pt: 'Foco visível', en: 'Visible focus' }))}`}
            className="guide-link"
          >
            {t({ pt: 'Ver histórico', en: 'View history' })}
          </a>
          <input
            className="or-control guide-inline-control"
            aria-label={t({ pt: 'Buscar pedido', en: 'Search order' })}
            placeholder={t({ pt: 'Buscar pedido…', en: 'Search order…' })}
          />
        </Example>
      </Section>

      <Section title={{ pt: 'Leitores de tela', en: 'Screen readers' }}>
        <Prose>
          <p>
            <T
              pt="Leitores de tela anunciam a função, o nome e o estado de cada elemento. Os componentes cuidam da função e do estado; o nome quase sempre vem do texto que você escreve."
              en="Screen readers announce each element's role, name and state. Components take care of role and state; the name almost always comes from the text you write."
            />
          </p>
        </Prose>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <strong>Ícones:</strong> decorativos por padrão (<Code>aria-hidden</Code>). Se o
                  ícone transmite significado sozinho, passe <Code>label</Code>.
                </>
              ),
              en: (
                <>
                  <strong>Icons:</strong> decorative by default (<Code>aria-hidden</Code>). If the
                  icon carries meaning on its own, pass <Code>label</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Botões só com ícone:</strong> <Code>aria-label</Code> no botão,
                  descrevendo a ação (“Remover do carrinho”), não o desenho (“Menos”).
                </>
              ),
              en: (
                <>
                  <strong>Icon-only buttons:</strong> <Code>aria-label</Code> on the button,
                  describing the action (“Remove from cart”), not the drawing (“Minus”).
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Texto extra para leitores:</strong> <Code>VisuallyHidden</Code> esconde
                  visualmente e mantém o conteúdo na árvore de acessibilidade.
                </>
              ),
              en: (
                <>
                  <strong>Extra text for readers:</strong> <Code>VisuallyHidden</Code> hides content
                  visually while keeping it in the accessibility tree.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Mudanças dinâmicas:</strong> anuncie com <Code>role="status"</Code>{' '}
                  (educado) ou <Code>role="alert"</Code> (urgente). A região precisa existir antes
                  da mudança.
                </>
              ),
              en: (
                <>
                  <strong>Dynamic changes:</strong> announce with <Code>role="status"</Code>{' '}
                  (polite) or <Code>role="alert"</Code> (urgent). The region must exist before the
                  change.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Idioma:</strong> defina <Code>lang</Code> no <Code>&lt;html&gt;</Code>{' '}
                  para a pronúncia correta; esta documentação troca entre <Code>pt-BR</Code> e{' '}
                  <Code>en</Code>.
                </>
              ),
              en: (
                <>
                  <strong>Language:</strong> set <Code>lang</Code> on <Code>&lt;html&gt;</Code> for
                  correct pronunciation; these docs switch between <Code>pt-BR</Code> and{' '}
                  <Code>en</Code>.
                </>
              ),
            },
          ]}
        />
        <Example
          title={{ pt: 'Nome, ícone e região de status', en: 'Name, icon and status region' }}
          description={{
            pt: 'O botão “−” é anunciado como “Remover do carrinho, botão”. A contagem fica em role="status": cada mudança é lida sem mover o foco.',
            en: 'The “−” button is announced as “Remove from cart, button”. The count lives in role="status": every change is read without moving focus.',
          }}
          code={`<Button variant="outline" startIcon={<Icon name="plus" size="sm" />} onClick={adicionar}>
  Adicionar ao carrinho
</Button>
<Button variant="ghost" iconOnly aria-label="Remover do carrinho" onClick={remover}>
  <Icon name="minus" />
</Button>
<p role="status">
  <Icon name="inbox" size="sm" /> <strong>{total}</strong> itens no carrinho
</p>

{/* Ícone informativo, sem texto ao lado: */}
<Icon name="lock" label="Conteúdo protegido" />
<VisuallyHidden>(abre em nova aba)</VisuallyHidden>`}
          collapsed
        >
          <CartAnnouncer />
          <span className="guide-row guide-muted">
            <Icon name="lock" label={t({ pt: 'Conteúdo protegido', en: 'Protected content' })} />
            <a
              href="https://www.w3.org/WAI/ARIA/apg/"
              target="_blank"
              rel="noreferrer"
              className="guide-link"
            >
              WAI-ARIA APG <Icon name="arrow-up-right" size="sm" />
              <VisuallyHidden>
                {t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}
              </VisuallyHidden>
            </a>
          </span>
        </Example>
      </Section>

      <Section title={{ pt: 'Contraste', en: 'Contrast' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Os pares abaixo são os mesmos verificados em{' '}
                  <Code>packages/tokens/src/contrast.test.ts</Code>, recalculados aqui com{' '}
                  <Code>contrastRatio()</Code>. Texto exige 4.5:1 (1.4.3); bordas de campos, foco e
                  o acento como elemento gráfico exigem 3:1 (1.4.11).
                </>
              }
              en={
                <>
                  The pairs below are the same ones checked in{' '}
                  <Code>packages/tokens/src/contrast.test.ts</Code>, recomputed here with{' '}
                  <Code>contrastRatio()</Code>. Text requires 4.5:1 (1.4.3); field borders, focus
                  and the accent as a graphic require 3:1 (1.4.11).
                </>
              }
            />
          </p>
        </Prose>
        <ContrastTable />
        <p className="guide-muted guide-note">
          <T
            pt={
              <>
                A matriz completa de texto × fundo está em{' '}
                <Link to={to('/design-guidelines/color')}>Cor</Link>.
              </>
            }
            en={
              <>
                The full text × background matrix is on{' '}
                <Link to={to('/design-guidelines/color')}>Color</Link>.
              </>
            }
          />
        </p>
      </Section>

      <Section
        title={{ pt: 'Alto contraste (forced-colors)', en: 'High contrast (forced-colors)' }}
      >
        <Prose>
          <p>
            <T
              pt={
                <>
                  Nos temas de contraste do Windows (o antigo “Alto contraste”) o navegador entra em{' '}
                  <Code>forced-colors: active</Code>: troca as cores da página pela paleta escolhida
                  pela pessoa. Fundos viram <Code>Canvas</Code>, textos e bordas viram{' '}
                  <Code>CanvasText</Code>, e <Code>box-shadow</Code>, <Code>text-shadow</Code> e
                  gradientes somem. Tudo o que comunica estado só com fundo ou sombra — a caixa
                  marcada, a aba ativa, o dia escolhido, o anel de foco — desaparece se não houver
                  um plano B.
                </>
              }
              en={
                <>
                  In Windows contrast themes (formerly “High Contrast”) the browser switches to{' '}
                  <Code>forced-colors: active</Code>: it replaces the page colors with the palette
                  the person chose. Backgrounds become <Code>Canvas</Code>, text and borders become{' '}
                  <Code>CanvasText</Code>, and <Code>box-shadow</Code>, <Code>text-shadow</Code> and
                  gradients are dropped. Anything that conveys state with only a background or a
                  shadow — the checked box, the active tab, the chosen date, the focus ring —
                  disappears without a fallback.
                </>
              }
            />
          </p>
          <p>
            <T
              pt={
                <>
                  Todo componente do Orange que desenha estado assim tem um bloco{' '}
                  <Code>@media (forced-colors: active)</Code> que repinta esse estado com{' '}
                  <strong>cores do sistema</strong> — e elas seguem a paleta da pessoa, seja ela
                  clara, escura ou colorida.
                </>
              }
              en={
                <>
                  Every Orange component that draws state this way has an{' '}
                  <Code>@media (forced-colors: active)</Code> block that repaints that state with{' '}
                  <strong>system colors</strong> — which follow the person's palette, whether light,
                  dark or colorful.
                </>
              }
            />
          </p>
        </Prose>
        <TableWrap label={{ pt: 'Cores do sistema no Orange', en: 'System colors in Orange' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Cor do sistema', en: 'System color' })}</th>
                <th scope="col">{t({ pt: 'Onde o Orange usa', en: 'Where Orange uses it' })}</th>
              </tr>
            </thead>
            <tbody>
              {forcedColorRoles.map((row) => (
                <tr key={row.color}>
                  <th scope="row">
                    <span className="guide-mono">{row.color}</span>
                  </th>
                  <td>{t(row.use)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <strong>Selecionado, marcado, atual:</strong> <Code>Highlight</Code> com{' '}
                  <Code>HighlightText</Code> — Switch, Checkbox, Radio, SegmentedControl, abas,
                  Listbox, Combobox, TreeView, dias do calendário, estrelas do Rating, página atual
                  do SideNav, BottomNavigation e Paginator.
                </>
              ),
              en: (
                <>
                  <strong>Selected, checked, current:</strong> <Code>Highlight</Code> with{' '}
                  <Code>HighlightText</Code> — Switch, Checkbox, Radio, SegmentedControl, tabs,
                  Listbox, Combobox, TreeView, calendar days, Rating stars, the current page in
                  SideNav, BottomNavigation and Paginator.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Foco:</strong> sempre <Code>outline</Code> (nunca só sombra). Quando o
                  elemento já está em <Code>Highlight</Code>, o anel usa <Code>HighlightText</Code>{' '}
                  ou <Code>CanvasText</Code> para não sumir no mesmo fundo — e a seleção nunca ocupa
                  o contorno, que fica livre para o foco.
                </>
              ),
              en: (
                <>
                  <strong>Focus:</strong> always an <Code>outline</Code> (never just a shadow). When
                  the element is already <Code>Highlight</Code>, the ring uses{' '}
                  <Code>HighlightText</Code> or <Code>CanvasText</Code> so it doesn't vanish on the
                  same background — and selection never takes over the outline, which stays free for
                  focus.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Progresso e trilhos:</strong> preenchimento em <Code>Highlight</Code>{' '}
                  sobre trilho vazado (contorno) ou pontilhado — “cheio × vazio” não depende de duas
                  cores do sistema contrastarem entre si.
                </>
              ),
              en: (
                <>
                  <strong>Progress and tracks:</strong> a <Code>Highlight</Code> fill over a hollow
                  (outlined) or dotted track — “full vs. empty” doesn't depend on two system colors
                  contrasting with each other.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>
                    <Code>forced-color-adjust: none</Code> com cuidado:
                  </strong>{' '}
                  só quando a cor é o conteúdo (séries de um gráfico, a cor escolhida no ColorField)
                  ou quando há texto sobre <Code>Highlight</Code>/<Code>Mark</Code> — com{' '}
                  <Code>auto</Code>, o Chromium pinta uma “placa de leitura” em <Code>Canvas</Code>{' '}
                  atrás do texto e o rótulo some no fundo da seleção. Nesses elementos todas as
                  cores (texto, ícones, borda, foco) são definidas explicitamente; no gráfico,
                  texto, grade, eixos e foco continuam em cores do sistema e a tabela “Ver dados”
                  traz os mesmos números.
                </>
              ),
              en: (
                <>
                  <strong>
                    <Code>forced-color-adjust: none</Code>, with care:
                  </strong>{' '}
                  only when the color is the content (chart series, the color picked in ColorField)
                  or when text sits on <Code>Highlight</Code>/<Code>Mark</Code> — with{' '}
                  <Code>auto</Code>, Chromium paints a <Code>Canvas</Code> “readability backplate”
                  behind the text and the label vanishes into the selection background. On those
                  elements every color (text, icons, border, focus) is set explicitly; in charts,
                  text, grid, axes and focus stay in system colors and the “View data” table carries
                  the same numbers.
                </>
              ),
            },
          ]}
        />
        <CodeBlock
          language="css"
          title={t({ pt: 'O padrão (Switch.css)', en: 'The pattern (Switch.css)' })}
          code={`@media (forced-colors: active) {
  /* Repita os seletores de hover/foco: senão a regra mais específica,
     com cor de token, vence — e o navegador a descarta. */
  .or-switch__control[aria-checked='true'],
  .or-switch__control[aria-checked='true']:focus-visible {
    border-color: Highlight;
    background: Highlight;
  }

  .or-switch__control[aria-checked='true'] .or-switch__thumb {
    background: HighlightText;
  }

  .or-switch__control:disabled .or-switch__thumb {
    background: GrayText;
  }
}`}
        />
        <h3 id={forcedTestId} className="doc-h3">
          {t({ pt: 'Como testar', en: 'How to test' })}
        </h3>
        <Steps
          items={[
            {
              title: { pt: 'Chrome ou Edge (DevTools)', en: 'Chrome or Edge (DevTools)' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        DevTools → menu <Code>⋮</Code> → <em>More tools</em> → <em>Rendering</em> →{' '}
                        <em>Emulate CSS media feature forced-colors</em> → <Code>active</Code>.
                        Combine com <Code>prefers-color-scheme: dark</Code> para ver a paleta
                        escura.
                      </>
                    }
                    en={
                      <>
                        DevTools → <Code>⋮</Code> menu → <em>More tools</em> → <em>Rendering</em> →{' '}
                        <em>Emulate CSS media feature forced-colors</em> → <Code>active</Code>.
                        Combine it with <Code>prefers-color-scheme: dark</Code> to see the dark
                        palette.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Windows de verdade', en: 'Real Windows' },
              content: (
                <p>
                  <T
                    pt="Configurações → Acessibilidade → Temas de contraste (Aquático, Deserto, Crepúsculo, Céu noturno). Atalho: Alt esquerdo + Shift esquerdo + Print Screen."
                    en="Settings → Accessibility → Contrast themes (Aquatic, Desert, Dusk, Night sky). Shortcut: left Alt + left Shift + Print Screen."
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Automatizado', en: 'Automated' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        O teste <Code>packages/ui/src/test/forcedColors.test.ts</Code> lê o CSS de
                        todos os componentes e falha se um estado ou foco desenhado com fundo ou
                        sombra não tiver bloco forced-colors, se um bloco usar cor de token ou se{' '}
                        <Code>forced-color-adjust: none</Code> aparecer fora da lista revisada. Para
                        capturas, o Playwright emula o modo com{' '}
                        <Code>
                          browser.newContext({'{'} forcedColors: 'active' {'}'})
                        </Code>
                        .
                      </>
                    }
                    en={
                      <>
                        The <Code>packages/ui/src/test/forcedColors.test.ts</Code> test reads every
                        component's CSS and fails if a state or focus drawn with a background or
                        shadow has no forced-colors block, if a block uses a token color, or if{' '}
                        <Code>forced-color-adjust: none</Code> shows up outside the reviewed list.
                        For screenshots, Playwright emulates the mode with{' '}
                        <Code>
                          browser.newContext({'{'} forcedColors: 'active' {'}'})
                        </Code>
                        .
                      </>
                    }
                  />
                </p>
              ),
            },
          ]}
        />
        <p className="guide-muted guide-note">
          <T
            pt="Um tema de alto contraste escolhido dentro do produto é outra coisa: ele usa tokens e vale quando a pessoa o seleciona na interface. O forced-colors vale quando o sistema operacional impõe as cores — e passa por cima de qualquer tema."
            en="A high-contrast theme picked inside the product is a different thing: it uses tokens and applies when the person selects it in the interface. Forced colors apply when the operating system imposes the colors — overriding any theme."
          />
        </p>
      </Section>

      <Section title={{ pt: 'Movimento reduzido', en: 'Reduced motion' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Quando o sistema pede menos movimento, <Code>tokens.css</Code> zera todas as
                  durações <Code>--or-duration-*</Code> e o <Code>base.css</Code> encurta qualquer
                  animação ou transição restante. Para lógica em JavaScript, use{' '}
                  <Code>useReducedMotion()</Code>.
                </>
              }
              en={
                <>
                  When the system asks for less motion, <Code>tokens.css</Code> zeroes every{' '}
                  <Code>--or-duration-*</Code> and <Code>base.css</Code> shortens any remaining
                  animation or transition. For JavaScript logic, use <Code>useReducedMotion()</Code>
                  .
                </>
              }
            />
          </p>
        </Prose>
        <p className="guide-live" role="status">
          {t({ pt: 'Seu sistema agora: ', en: 'Your system right now: ' })}
          <strong>
            {reduced
              ? t({ pt: 'movimento reduzido ativo', en: 'reduced motion on' })
              : t({ pt: 'movimento padrão', en: 'standard motion' })}
          </strong>
        </p>
        <CodeBlock
          language="css"
          title="tokens.css"
          code={`@media (prefers-reduced-motion: reduce) {
  :root {
    --or-duration-instant: 0ms;
    --or-duration-fast: 0ms;
    --or-duration-medium: 0ms;
    --or-duration-slow: 0ms;
    --or-duration-slower: 0ms;
  }
}`}
        />
        <Bullets
          items={[
            {
              pt: 'Nada pisca mais de três vezes por segundo (2.3.1).',
              en: 'Nothing flashes more than three times per second (2.3.1).',
            },
            {
              pt: 'Movimento automático com mais de 5 segundos precisa de pausa (2.2.2) — a faixa da página inicial para no hover e some com movimento reduzido.',
              en: 'Automatic motion longer than 5 seconds needs a pause (2.2.2) — the home page marquee stops on hover and with reduced motion.',
            },
            {
              pt: 'Troque deslocamentos grandes por fade quando o movimento estiver reduzido; a informação não pode depender da animação.',
              en: 'Swap large movements for fades when motion is reduced; information must never depend on the animation.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Tamanho de alvo', en: 'Target size' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  A WCAG 2.2 exige alvos de pelo menos 24×24px (2.5.8). Os controles do Orange
                  começam em 32px: os tokens <Code>--or-control-sm</Code>, <Code>-md</Code> e{' '}
                  <Code>-lg</Code> definem as alturas de botões, campos e selects.
                </>
              }
              en={
                <>
                  WCAG 2.2 requires targets of at least 24×24px (2.5.8). Orange controls start at
                  32px: the <Code>--or-control-sm</Code>, <Code>-md</Code> and <Code>-lg</Code>{' '}
                  tokens set the height of buttons, fields and selects.
                </>
              }
            />
          </p>
        </Prose>
        <div
          className="guide-targets"
          role="img"
          aria-label={t({
            pt: 'Comparação de tamanhos de alvo: mínimo WCAG de 24px e controles de 32, 40 e 48px',
            en: 'Target size comparison: WCAG minimum of 24px and controls of 32, 40 and 48px',
          })}
        >
          <div className="guide-targets__item guide-targets__item--min">
            <span style={{ width: 24, height: 24 }} />
            <p>24px</p>
            <p className="guide-muted">{t({ pt: 'mínimo WCAG', en: 'WCAG minimum' })}</p>
          </div>
          {sizes.map((size) => (
            <div key={size.name} className="guide-targets__item">
              <span style={{ width: size.px, height: size.px }} />
              <p>{size.px}px</p>
              <p className="guide-muted">--or-control-{size.name}</p>
            </div>
          ))}
        </div>
        <Bullets
          items={[
            {
              pt: 'Ícones pequenos (16px) dentro de botões: a área clicável é o botão inteiro, não o ícone.',
              en: 'Small icons (16px) inside buttons: the clickable area is the whole button, not the icon.',
            },
            {
              pt: 'Links dentro de texto corrido são isentos, mas listas de links soltos não — dê a eles altura de linha suficiente.',
              en: 'Links inside running text are exempt, but loose lists of links are not — give them enough line height.',
            },
            {
              pt: 'Arrastar nunca é a única forma de agir (2.5.7): sliders e listas ordenáveis também aceitam teclado e cliques.',
              en: 'Dragging is never the only way to act (2.5.7): sliders and sortable lists also accept keyboard and clicks.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Formulários', en: 'Forms' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Todo controle de formulário do Orange usa o <Code>Field</Code>, que liga rótulo (
                  <Code>for</Code>), descrição e erro (<Code>aria-describedby</Code>) e marca o
                  campo como inválido (<Code>aria-invalid</Code>). Envie o formulário vazio abaixo
                  para ver o erro.
                </>
              }
              en={
                <>
                  Every Orange form control uses <Code>Field</Code>, which wires the label (
                  <Code>for</Code>), description and error (<Code>aria-describedby</Code>) and flags
                  the field as invalid (<Code>aria-invalid</Code>). Submit the empty form below to
                  see the error.
                </>
              }
            />
          </p>
        </Prose>
        <Bullets
          items={[
            {
              pt: 'Rótulo visível sempre. Placeholder não é rótulo: some ao digitar e costuma ter pouco contraste.',
              en: 'Always a visible label. A placeholder is not a label: it disappears when typing and usually has low contrast.',
            },
            {
              pt: 'Erros dizem o que fazer (“Informe um e-mail no formato…”), não só o que deu errado (“Inválido”).',
              en: 'Errors say what to do (“Enter an email like…”), not just what went wrong (“Invalid”).',
            },
            {
              pt: (
                <>
                  Use <Code>autoComplete</Code> nos campos de dados pessoais (1.3.5) e não peça a
                  mesma informação duas vezes (3.3.7).
                </>
              ),
              en: (
                <>
                  Use <Code>autoComplete</Code> on personal data fields (1.3.5) and don't ask for
                  the same information twice (3.3.7).
                </>
              ),
            },
            {
              pt: 'Login sem testes cognitivos: permita colar senhas e usar gerenciadores (3.3.8).',
              en: 'Sign-in without cognitive tests: allow pasting passwords and password managers (3.3.8).',
            },
          ]}
        />
        <Example code={signupCode} align="stretch" collapsed>
          <SignupForm />
        </Example>
      </Section>

      <Section title={{ pt: 'Como testamos', en: 'How we test' }}>
        <Cards
          columns={2}
          items={[
            {
              icon: 'check-circle',
              title: { pt: 'axe-core em cada componente', en: 'axe-core on every component' },
              text: {
                pt: (
                  <>
                    Os testes chamam <code>expectNoA11yViolations()</code> e falham com a lista de
                    violações.
                  </>
                ),
                en: (
                  <>
                    Tests call <code>expectNoA11yViolations()</code> and fail with the list of
                    violations.
                  </>
                ),
              },
            },
            {
              icon: 'keyboard',
              title: { pt: 'Teclado com Testing Library', en: 'Keyboard with Testing Library' },
              text: {
                pt: (
                  <>
                    Interações com <code>user-event</code>: Tab, setas, Escape, Home e End.
                  </>
                ),
                en: (
                  <>
                    Interactions with <code>user-event</code>: Tab, arrows, Escape, Home and End.
                  </>
                ),
              },
            },
            {
              icon: 'layers',
              title: { pt: 'Painel a11y do Storybook', en: 'Storybook a11y panel' },
              text: {
                pt: 'axe com layout real em todas as stories, nos dois temas.',
                en: 'axe with real layout on every story, in both themes.',
              },
            },
            {
              icon: 'droplet',
              title: { pt: 'Testes de contraste', en: 'Contrast tests' },
              text: {
                pt: '19 pares de tokens verificados por tema a cada execução de pnpm test.',
                en: '19 token pairs checked per theme on every pnpm test run.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Critérios novos da WCAG 2.2', en: 'New WCAG 2.2 criteria' }}>
        <WcagList
          items={[
            {
              criterion: '2.4.11',
              description: {
                pt: 'Foco não obscurecido: cabeçalhos fixos não cobrem o elemento focado.',
                en: 'Focus not obscured: sticky headers do not cover the focused element.',
              },
            },
            {
              criterion: '2.5.7',
              description: {
                pt: 'Movimentos de arrastar têm alternativa com um único ponteiro ou teclado.',
                en: 'Dragging movements have a single-pointer or keyboard alternative.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Alvos de pelo menos 24×24px — os controles do Orange começam em 32px.',
                en: 'Targets of at least 24×24px — Orange controls start at 32px.',
              },
            },
            {
              criterion: '3.2.6',
              description: {
                pt: 'Ajuda consistente: links de ajuda no mesmo lugar em todas as páginas.',
                en: 'Consistent help: help links in the same place on every page.',
              },
            },
            {
              criterion: '3.3.7',
              description: {
                pt: 'Entrada redundante: não peça de novo o que já foi informado.',
                en: 'Redundant entry: do not ask again for what was already provided.',
              },
            },
            {
              criterion: '3.3.8',
              description: {
                pt: 'Autenticação acessível: sem quebra-cabeças; colar e gerenciadores de senha permitidos.',
                en: 'Accessible authentication: no puzzles; pasting and password managers allowed.',
              },
            },
          ]}
        />
      </Section>

      <Section
        title={{ pt: 'Checklist para quem constrói telas', en: 'Checklist for screen builders' }}
      >
        <Checklist
          label={{ pt: 'Antes de publicar uma tela', en: 'Before shipping a screen' }}
          items={[
            {
              pt: 'Um único h1 por página e títulos sem pular níveis (h2 → h3, nunca h2 → h4).',
              en: 'A single h1 per page and headings without skipped levels (h2 → h3, never h2 → h4).',
            },
            {
              pt: (
                <>
                  Landmarks presentes: <code>header</code>, <code>nav</code>, <code>main</code>,{' '}
                  <code>footer</code>, e um link “Pular para o conteúdo”.
                </>
              ),
              en: (
                <>
                  Landmarks present: <code>header</code>, <code>nav</code>, <code>main</code>,{' '}
                  <code>footer</code>, plus a “Skip to content” link.
                </>
              ),
            },
            {
              pt: 'Toda a tela navegável por teclado, na ordem visual, com foco sempre visível.',
              en: 'The whole screen keyboard-navigable, in visual order, with focus always visible.',
            },
            {
              pt: 'Imagens informativas com alt descritivo; decorativas com alt="".',
              en: 'Informative images with descriptive alt; decorative ones with alt="".',
            },
            {
              pt: 'Botões e links com textos que fazem sentido fora de contexto (nada de “clique aqui”).',
              en: 'Buttons and links with text that makes sense out of context (no “click here”).',
            },
            {
              pt: 'Cores fora dos tokens verificadas: 4.5:1 para texto, 3:1 para ícones e bordas.',
              en: 'Colors outside the tokens checked: 4.5:1 for text, 3:1 for icons and borders.',
            },
            {
              pt: 'Nenhuma informação transmitida só por cor, posição ou forma.',
              en: 'No information conveyed only by color, position or shape.',
            },
            {
              pt: 'Zoom de 200% e largura de 320px sem perda de conteúdo nem rolagem horizontal (1.4.10).',
              en: '200% zoom and 320px width without lost content or horizontal scroll (1.4.10).',
            },
            {
              pt: 'Mensagens de sucesso e erro anunciadas por região de status ou alerta.',
              en: 'Success and error messages announced through a status or alert region.',
            },
            {
              pt: 'Testado com pelo menos um leitor de tela (NVDA, VoiceOver ou TalkBack).',
              en: 'Tested with at least one screen reader (NVDA, VoiceOver or TalkBack).',
            },
          ]}
        />
      </Section>
    </DocPage>
  )
}
