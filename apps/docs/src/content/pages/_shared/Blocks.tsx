import { Icon, useClipboard, type IconName } from '@orangesys/ui'
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLang, type Localized } from '../../../i18n'
import { CodeBlock, slugify, type CodeBlockProps } from '../../../kit'
import { formatRatio, wcagLevel } from './color'
import '../../../styles/guides.css'

/* ---------------------------------------------------------------------------
 * Blocos compartilhados pelas páginas de guidelines e uso.
 * ------------------------------------------------------------------------- */

/** Contêiner rolável e focável para tabelas largas (WCAG 2.1.1). */
export function TableWrap({ label, children }: { label: Localized<string>; children: ReactNode }) {
  const { t } = useLang()
  return (
    // Prefixo "Tabela:" evita repetir o nome da seção que contém a tabela (landmark-unique).
    <div
      className="doc-table-wrap"
      role="region"
      aria-label={t({ pt: `Tabela: ${label.pt}`, en: `Table: ${label.en}` })}
      tabIndex={0}
    >
      {children}
    </div>
  )
}

/** Selo com a razão de contraste e o nível WCAG correspondente. */
export function ContrastBadge({ ratio, kind = 'text' }: { ratio: number; kind?: 'text' | 'ui' }) {
  const { t } = useLang()
  const level = wcagLevel(ratio)
  const pass = kind === 'ui' ? ratio >= 3 : ratio >= 4.5
  const label =
    kind === 'ui'
      ? pass
        ? t({ pt: 'Passa 3:1', en: 'Passes 3:1' })
        : t({ pt: 'Abaixo de 3:1', en: 'Below 3:1' })
      : level === 'Fail'
        ? t({ pt: 'Falha', en: 'Fail' })
        : level
  return (
    <span
      className={`guide-badge ${pass ? (level === 'AAA' && kind === 'text' ? 'guide-badge--aaa' : 'guide-badge--pass') : 'guide-badge--fail'}`}
    >
      <span className="guide-badge__ratio">{formatRatio(ratio)}</span>
      <span className="guide-badge__level">{label}</span>
    </span>
  )
}

/** Amostra de cor quadrada. Clicar copia o valor. */
export function ColorChip({
  color,
  label,
  value,
  ink,
  group,
  size = 'md',
}: {
  color: string
  label: string
  value: string
  ink: string
  /** Nome do grupo (ex.: família da paleta) usado no nome acessível. */
  group?: string
  size?: 'sm' | 'md'
}) {
  const { copy, copied } = useClipboard(1600)
  const { t } = useLang()
  return (
    <button
      type="button"
      className={`guide-chip guide-chip--${size}`}
      style={{ background: color, color: ink }}
      onClick={() => copy(value)}
      aria-label={t({
        pt: `${group ? `${group} ` : ''}${label} ${value} — copiar valor`,
        en: `${group ? `${group} ` : ''}${label} ${value} — copy value`,
      })}
    >
      <span className="guide-chip__label">{label}</span>
      <span className="guide-chip__value">
        {copied ? t({ pt: 'copiado', en: 'copied' }) : value}
      </span>
    </button>
  )
}

export interface CardItem {
  title: Localized<string>
  text: Localized<ReactNode>
  eyebrow?: Localized<string>
  icon?: IconName
  /** Link interno (sem prefixo de idioma). */
  to?: string
  /** Link externo. */
  href?: string
  meta?: ReactNode
}

/**
 * Grade de cartões. Só informativos: bordas compartilhadas (grade explícita
 * do Orange). Com links: cartões separados com o hover de elevação (or-lift).
 */
export function Cards({ items, columns = 3 }: { items: CardItem[]; columns?: 2 | 3 | 4 }) {
  const { t, to } = useLang()
  return (
    <ul className={`guide-cards guide-cards--${columns}`}>
      {items.map((item, i) => {
        const body = (
          <>
            {(item.icon || item.eyebrow) && (
              <span className="guide-card__top">
                {item.icon && (
                  <span className="guide-card__icon">
                    <Icon name={item.icon} size="md" />
                  </span>
                )}
                {item.eyebrow && <span className="or-eyebrow">{t(item.eyebrow)}</span>}
              </span>
            )}
            <span className="guide-card__title">
              {t(item.title)}
              {item.href && <Icon name="arrow-up-right" size="sm" className="guide-card__arrow" />}
              {item.to && <Icon name="arrow-right" size="sm" className="guide-card__arrow" />}
            </span>
            <span className="guide-card__text">{t(item.text)}</span>
            {item.meta && <span className="guide-card__meta">{item.meta}</span>}
          </>
        )
        return (
          <li key={i}>
            {item.href ? (
              <a
                className="guide-card guide-card--link or-lift"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {body}
                <span className="or-visually-hidden">
                  {t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}
                </span>
              </a>
            ) : item.to ? (
              <Link className="guide-card guide-card--link or-lift" to={to(item.to)}>
                {body}
              </Link>
            ) : (
              <div className="guide-card">{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Passos numerados (01, 02…) com título e conteúdo livre. */
export function Steps({ items }: { items: { title: Localized<string>; content: ReactNode }[] }) {
  const { t } = useLang()
  return (
    <ol className="guide-steps">
      {items.map((item, i) => (
        <li key={i} className="guide-steps__item">
          <span className="guide-steps__n" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="guide-steps__body">
            <p className="guide-steps__title">{t(item.title)}</p>
            {item.content}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Lista de verificação interativa com progresso anunciado. */
export function Checklist({
  items,
  label,
}: {
  items: Localized<ReactNode>[]
  label: Localized<string>
}) {
  const { t } = useLang()
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false))
  const baseId = useId()
  const count = done.filter(Boolean).length
  return (
    <div className="guide-checklist" role="group" aria-labelledby={`${baseId}-title`}>
      <div className="guide-checklist__head">
        <span id={`${baseId}-title`} className="guide-checklist__title">
          {t(label)}
        </span>
        <span className="guide-checklist__count" aria-live="polite">
          {t({ pt: `${count} de ${items.length}`, en: `${count} of ${items.length}` })}
        </span>
      </div>
      <div className="guide-checklist__bar" aria-hidden="true">
        <span style={{ width: `${(count / items.length) * 100}%` }} />
      </div>
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            <input
              id={`${baseId}-${i}`}
              type="checkbox"
              checked={done[i]}
              onChange={(e) =>
                setDone((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))
              }
            />
            <label htmlFor={`${baseId}-${i}`}>{t(item)}</label>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Grupo de botões de alternância (aria-pressed). */
export function Segmented<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: Localized<string>
  value: V
  options: { value: V; label: Localized<string> | string }[]
  onChange: (value: V) => void
}) {
  const { t } = useLang()
  return (
    <div className="guide-segmented" role="group" aria-label={t(label)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {typeof option.label === 'string' ? option.label : t(option.label)}
        </button>
      ))}
    </div>
  )
}

/** Abas de código (padrão WAI-ARIA Tabs com setas, Home e End). */
export function CodeTabs({
  tabs,
  label,
}: {
  tabs: {
    id: string
    label: string
    code: string
    language?: CodeBlockProps['language']
    title?: string
  }[]
  label: Localized<string>
}) {
  const { t } = useLang()
  const [active, setActive] = useState(tabs[0].id)
  const baseId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0]

  const onKeyDown = (event: KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.id === active)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    setActive(tabs[next].id)
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <div className="guide-tabs">
      <div role="tablist" aria-label={t(label)} className="guide-tabs__list" ref={listRef}>
        {tabs.map((tab) => (
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
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="guide-tabs__panel"
      >
        <CodeBlock
          code={current.code}
          language={current.language ?? 'bash'}
          title={current.title}
        />
      </div>
    </div>
  )
}

/** Lista de números/fatos em destaque. */
export function Stats({ items }: { items: { value: ReactNode; label: Localized<string> }[] }) {
  const { t } = useLang()
  return (
    <dl className="guide-stats">
      {items.map((item, i) => (
        <div key={i}>
          <dt>{t(item.label)}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Subtítulo h3 ancorado dentro de uma Section. */
export function SubHeading({ title, id }: { title: Localized<string> | string; id?: string }) {
  const { t } = useLang()
  const text = typeof title === 'string' ? title : t(title)
  const anchor = id ?? slugify(text)
  return (
    <h3 id={anchor} className="doc-h3">
      <a href={`#${anchor}`} className="doc-anchor">
        {text}
      </a>
    </h3>
  )
}
