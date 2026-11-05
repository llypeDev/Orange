import { Button, Icon, iconNames, useClipboard, useDebouncedValue, type IconName } from '@orangesys/ui'
import { useId, useMemo, useState } from 'react'
import { T, useLang } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  DocPage,
  DoDont,
  Example,
  PropsTable,
  Prose,
  Section,
} from '../../../kit'
import { REPO_URL } from '../../registry'
import { Steps } from '../_shared/Blocks'

const sizes: {
  name: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  px: number
  usage: { pt: string; en: string }
}[] = [
  {
    name: 'xs',
    px: 12,
    usage: { pt: 'Setas ao lado de links pequenos', en: 'Arrows next to small links' },
  },
  {
    name: 'sm',
    px: 16,
    usage: { pt: 'Botões sm, campos, texto 13–15px', en: 'sm buttons, fields, 13–15px text' },
  },
  {
    name: 'md',
    px: 20,
    usage: { pt: 'Padrão: botões md, navegação', en: 'Default: md buttons, navigation' },
  },
  {
    name: 'lg',
    px: 24,
    usage: { pt: 'Botões lg, ícones isolados', en: 'lg buttons, standalone icons' },
  },
  {
    name: 'xl',
    px: 32,
    usage: { pt: 'Estados vazios, destaques', en: 'Empty states, highlights' },
  },
]

function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function IconGallery() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [last, setLast] = useState<IconName | null>(null)
  const debounced = useDebouncedValue(query, 120)
  const { copy, copied } = useClipboard(1800)
  const inputId = useId()
  const filtered = useMemo(() => {
    const q = normalize(debounced.trim())
    return q ? iconNames.filter((name) => name.includes(q)) : iconNames
  }, [debounced])

  return (
    <div className="guide-icons">
      <div className="guide-icons__bar">
        <div className="guide-icons__search">
          <Icon name="search" size="sm" />
          <label htmlFor={inputId} className="or-visually-hidden">
            {t({ pt: 'Buscar ícones', en: 'Search icons' })}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t({
              pt: `Buscar entre ${iconNames.length} ícones…`,
              en: `Search ${iconNames.length} icons…`,
            })}
            autoComplete="off"
          />
        </div>
        <span className="guide-mono guide-muted" aria-hidden="true">
          {filtered.length}/{iconNames.length}
        </span>
      </div>
      <p className="or-visually-hidden" role="status">
        {copied && last
          ? t({ pt: `Código do ícone ${last} copiado`, en: `${last} icon code copied` })
          : t({
              pt: `${filtered.length} ícones encontrados`,
              en: `${filtered.length} icons found`,
            })}
      </p>
      {filtered.length > 0 ? (
        <ul className="guide-icons__grid">
          {filtered.map((name) => (
            <li key={name}>
              <button
                type="button"
                className="guide-icons__item"
                onClick={() => {
                  copy(`<Icon name="${name}" />`)
                  setLast(name)
                }}
                aria-label={t({ pt: `${name} — copiar código`, en: `${name} — copy code` })}
              >
                <Icon name={copied && last === name ? 'check' : name} size="lg" />
                <span className="guide-icons__name">
                  {copied && last === name ? t({ pt: 'copiado', en: 'copied' }) : name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="guide-icons__empty">
          {t({ pt: `Nenhum ícone para “${query}”.`, en: `No icons for “${query}”.` })}{' '}
          <a
            href={`${REPO_URL}/issues/new?title=${encodeURIComponent(`Ícone: ${query}`)}`}
            target="_blank"
            rel="noreferrer"
            className="guide-link"
          >
            {t({ pt: 'Sugerir um ícone', en: 'Suggest an icon' })}
          </a>
        </p>
      )}
    </div>
  )
}

export default function IconographyPage() {
  const { t } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Iconografia', en: 'Iconography' }}
      lead={{
        pt: `${iconNames.length} ícones desenhados para o Orange: grade de 24px, traço de 1.75, terminações quadradas e cantos vivos. Leves, geométricos e coerentes com as bordas de 1px do resto do sistema.`,
        en: `${iconNames.length} icons drawn for Orange: 24px grid, 1.75 stroke, square caps and sharp corners. Light, geometric and consistent with the 1px borders across the system.`,
      }}
    >
      <Section title={{ pt: 'Princípios', en: 'Principles' }}>
        <div className="guide-icon-anatomy">
          <div className="guide-icon-anatomy__canvas" aria-hidden="true">
            <span className="guide-icon-anatomy__safe" />
            <Icon name="layers" size={192} strokeWidth={1.75} />
          </div>
          <ul className="guide-icon-anatomy__list">
            <li>
              <strong>{t({ pt: 'Grade de 24×24', en: '24×24 grid' })}</strong>
              <span>
                {t({
                  pt: 'Desenho dentro de uma área viva de 20×20, com 2px de respiro em cada lado.',
                  en: 'Drawn inside a 20×20 live area, with 2px of breathing room on each side.',
                })}
              </span>
            </li>
            <li>
              <strong>{t({ pt: 'Traço de 1.75', en: '1.75 stroke' })}</strong>
              <span>
                {t({
                  pt: 'Contorno, nunca preenchimento. Escala junto com o tamanho do ícone.',
                  en: 'Outline, never fill. Scales with the icon size.',
                })}
              </span>
            </li>
            <li>
              <strong>{t({ pt: 'Terminações quadradas', en: 'Square caps' })}</strong>
              <span>
                <Code>stroke-linecap: square</Code> · <Code>stroke-linejoin: miter</Code>
              </span>
            </li>
            <li>
              <strong>{t({ pt: 'Cantos vivos', en: 'Sharp corners' })}</strong>
              <span>
                {t({
                  pt: 'Curvas só onde a forma pede (círculos, relógio). Nada de cantos arredondados decorativos.',
                  en: 'Curves only where the shape needs them (circles, clock). No decorative rounded corners.',
                })}
              </span>
            </li>
            <li>
              <strong>currentColor</strong>
              <span>
                {t({
                  pt: 'O ícone herda a cor do texto ao redor e acompanha o tema.',
                  en: 'The icon inherits the surrounding text color and follows the theme.',
                })}
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <Section title={{ pt: 'Tamanhos', en: 'Sizes' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Use os tamanhos nomeados da prop <Code>size</Code>; um número em pixels também é
                  aceito para casos especiais. Acompanhe a altura do texto ou do controle onde o
                  ícone está.
                </>
              }
              en={
                <>
                  Use the named sizes of the <Code>size</Code> prop; a pixel number is also accepted
                  for special cases. Match the height of the text or control the icon sits in.
                </>
              }
            />
          </p>
        </Prose>
        <ul className="guide-icon-sizes">
          {sizes.map((size) => (
            <li key={size.name}>
              <span className="guide-icon-sizes__box">
                <Icon name="rocket" size={size.name} />
              </span>
              <span className="guide-icon-sizes__name">
                {size.name} · {size.px}px
              </span>
              <span className="guide-icon-sizes__usage">{t(size.usage)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={{ pt: 'Decorativo ou informativo', en: 'Decorative or informative' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Por padrão o <Code>Icon</Code> é <strong>decorativo</strong>: recebe{' '}
                  <Code>aria-hidden</Code> e o leitor de tela o ignora. Isso é o certo quando há
                  texto ao lado. Quando o ícone é a única forma de transmitir a informação, ele é{' '}
                  <strong>informativo</strong>: passe <Code>label</Code> e ele ganha{' '}
                  <Code>role="img"</Code> e <Code>aria-label</Code>.
                </>
              }
              en={
                <>
                  By default <Code>Icon</Code> is <strong>decorative</strong>: it gets{' '}
                  <Code>aria-hidden</Code> and screen readers skip it. That’s right when there is
                  text next to it. When the icon is the only way to convey the information, it is{' '}
                  <strong>informative</strong>: pass <Code>label</Code> and it gets{' '}
                  <Code>role="img"</Code> and <Code>aria-label</Code>.
                </>
              }
            />
          </p>
        </Prose>
        <Example
          code={`import { Button, Icon } from '@orangesys/ui'

{/* Decorativo: o texto já diz tudo */}
<Button startIcon={<Icon name="download" />}>Exportar CSV</Button>

{/* Informativo: sem texto ao lado, precisa de label */}
<Icon name="lock" label="Arquivo protegido" />

{/* Botão só com ícone: o nome vai no botão */}
<Button iconOnly variant="outline" aria-label="Excluir relatório">
  <Icon name="trash" />
</Button>`}
          align="center"
        >
          <Button startIcon={<Icon name="download" />}>
            {t({ pt: 'Exportar CSV', en: 'Export CSV' })}
          </Button>
          <Icon name="lock" label={t({ pt: 'Arquivo protegido', en: 'Protected file' })} />
          <Button
            iconOnly
            variant="outline"
            aria-label={t({ pt: 'Excluir relatório', en: 'Delete report' })}
          >
            <Icon name="trash" />
          </Button>
        </Example>
        <PropsTable
          caption={{ pt: 'Props do Icon', en: 'Icon props' }}
          rows={[
            {
              name: 'name',
              type: 'IconName',
              required: true,
              description: {
                pt: 'Nome do ícone (veja a galeria).',
                en: 'Icon name (see the gallery).',
              },
            },
            {
              name: 'size',
              type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number",
              default: "'md'",
              description: {
                pt: '12, 16, 20, 24 ou 32px — ou um número em pixels.',
                en: '12, 16, 20, 24 or 32px — or a pixel number.',
              },
            },
            {
              name: 'label',
              type: 'string',
              description: {
                pt: 'Torna o ícone informativo (role="img" + aria-label).',
                en: 'Makes the icon informative (role="img" + aria-label).',
              },
            },
            {
              name: 'strokeWidth',
              type: 'number',
              default: '1.75',
              description: {
                pt: 'Espessura do traço. Mude só com motivo.',
                en: 'Stroke width. Change it only with a reason.',
              },
            },
            {
              name: '...rest',
              type: 'SVGProps<SVGSVGElement>',
              description: {
                pt: 'Atributos nativos de <svg> (className, style…).',
                en: 'Native <svg> attributes (className, style…).',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Galeria', en: 'Gallery' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Clique em um ícone para copiar <Code>{'<Icon name="…" />'}</Code>. A busca filtra
                  pelo nome em inglês, em kebab-case.
                </>
              }
              en={
                <>
                  Click an icon to copy <Code>{'<Icon name="…" />'}</Code>. Search filters by the
                  English, kebab-case name.
                </>
              }
            />
          </p>
        </Prose>
        <IconGallery />
      </Section>

      <Section title={{ pt: 'Uso', en: 'Usage' }}>
        <DoDont
          doExample={
            <>
              <Button variant="outline" startIcon={<Icon name="filter" size="sm" />}>
                {t({ pt: 'Filtrar', en: 'Filter' })}
              </Button>
              <Button variant="ghost" endIcon={<Icon name="arrow-right" size="sm" />}>
                {t({ pt: 'Ver pedidos', en: 'View orders' })}
              </Button>
            </>
          }
          dontExample={
            <>
              <Button
                variant="outline"
                startIcon={
                  <Icon name="filter" size="lg" style={{ color: 'var(--or-color-accent)' }} />
                }
              >
                {t({ pt: 'Filtrar', en: 'Filter' })}
              </Button>
              <Button
                variant="ghost"
                startIcon={<Icon name="star" size="sm" />}
                endIcon={<Icon name="arrow-right" size="sm" />}
              >
                {t({ pt: 'Ver pedidos', en: 'View orders' })}
              </Button>
            </>
          }
          doItems={[
            {
              pt: 'Ícone do mesmo tamanho da fonte e na cor do texto.',
              en: 'Icon matching the font size and the text color.',
            },
            {
              pt: 'Um ícone por botão, reforçando o rótulo.',
              en: 'One icon per button, reinforcing the label.',
            },
          ]}
          dontItems={[
            {
              pt: 'Ícone maior que o texto e pintado de laranja só para enfeitar.',
              en: 'Icon larger than the text and painted orange just for decoration.',
            },
            {
              pt: 'Dois ícones disputando o mesmo rótulo.',
              en: 'Two icons competing for the same label.',
            },
          ]}
        />
        <Bullets
          items={[
            {
              pt: 'Um conceito, um ícone: “excluir” é sempre trash, “fechar” é sempre close.',
              en: 'One concept, one icon: “delete” is always trash, “close” is always close.',
            },
            {
              pt: (
                <>
                  Ícones direcionais (<Code>arrow-right</Code>, <Code>chevron-right</Code>) indicam
                  movimento ou navegação; <Code>arrow-up-right</Code> sinaliza link externo.
                </>
              ),
              en: (
                <>
                  Directional icons (<Code>arrow-right</Code>, <Code>chevron-right</Code>) indicate
                  movement or navigation; <Code>arrow-up-right</Code> marks an external link.
                </>
              ),
            },
            {
              pt: 'Ícones informativos isolados precisam de ≥ 3:1 de contraste com o fundo (1.4.11) — currentColor sobre text e text-muted já garante.',
              en: 'Standalone informative icons need ≥ 3:1 contrast with the background (1.4.11) — currentColor on text and text-muted already ensures it.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Como adicionar um ícone', en: 'How to add an icon' }}>
        <Steps
          items={[
            {
              title: { pt: 'Desenhe na grade de 24px', en: 'Draw on the 24px grid' },
              content: (
                <p>
                  <T
                    pt="Área viva de 20×20, traço de 1.75 sem preenchimento, terminações quadradas e junções em quina. Exporte com viewBox 0 0 24 24."
                    en="20×20 live area, 1.75 stroke with no fill, square caps and miter joins. Export with viewBox 0 0 24 24."
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Simplifique o SVG', en: 'Simplify the SVG' },
              content: (
                <p>
                  <T
                    pt={
                      <>
                        Use apenas <Code>&lt;path&gt;</Code>, <Code>&lt;circle&gt;</Code>,{' '}
                        <Code>&lt;rect&gt;</Code> ou <Code>&lt;line&gt;</Code>, sem{' '}
                        <Code>fill</Code>, <Code>stroke</Code> ou <Code>style</Code> — o componente
                        define tudo isso.
                      </>
                    }
                    en={
                      <>
                        Use only <Code>&lt;path&gt;</Code>, <Code>&lt;circle&gt;</Code>,{' '}
                        <Code>&lt;rect&gt;</Code> or <Code>&lt;line&gt;</Code>, with no{' '}
                        <Code>fill</Code>, <Code>stroke</Code> or <Code>style</Code> — the component
                        sets all of that.
                      </>
                    }
                  />
                </p>
              ),
            },
            {
              title: { pt: 'Registre em paths.tsx', en: 'Register it in paths.tsx' },
              content: (
                <>
                  <p>
                    <T
                      pt={
                        <>
                          Adicione uma chave em <Code>packages/ui/src/icons/paths.tsx</Code>, em
                          ordem alfabética e kebab-case. O tipo <Code>IconName</Code> e a lista{' '}
                          <Code>iconNames</Code> se atualizam sozinhos.
                        </>
                      }
                      en={
                        <>
                          Add a key to <Code>packages/ui/src/icons/paths.tsx</Code>, in alphabetical
                          order and kebab-case. The <Code>IconName</Code> type and the{' '}
                          <Code>iconNames</Code> list update themselves.
                        </>
                      }
                    />
                  </p>
                  <CodeBlock
                    language="tsx"
                    title="packages/ui/src/icons/paths.tsx"
                    code={`export const iconPaths = {
  // …
  'credit-card': <path d="M3 5.5h18v13H3zM3 10h18M6.5 15h4" />,
  // …
}`}
                  />
                </>
              ),
            },
            {
              title: { pt: 'Confira e abra o PR', en: 'Check it and open a PR' },
              content: (
                <p>
                  <T
                    pt="Veja o ícone nesta galeria e no Storybook (Fundamentos/Ícones) nos dois temas e nos tamanhos sm a xl antes de abrir o pull request."
                    en="Check the icon in this gallery and in Storybook (Fundamentos/Ícones) in both themes and at sizes sm to xl before opening the pull request."
                  />
                </p>
              ),
            },
          ]}
        />
        <Callout
          tone="info"
          title={{ pt: 'Por que não uma biblioteca externa?', en: 'Why not an external library?' }}
        >
          <p>
            <T
              pt="Ícones próprios garantem o mesmo traço e as mesmas terminações em todo o sistema, sem dependência extra. Se precisar de muitos ícones de domínio, mantenha as regras de desenho acima ao misturar fontes."
              en="Our own icons guarantee the same stroke and caps across the system, with no extra dependency. If you need many domain icons, keep the drawing rules above when mixing sources."
            />
          </p>
        </Callout>
      </Section>
    </DocPage>
  )
}
