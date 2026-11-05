import type { ReactNode } from 'react'
import { Icon } from '@orangesys/ui'
import { useLang, type Localized } from '../i18n'
import { slugify } from './slugify'

/**
 * Seção de página com <h2> ancorado. O índice "Nesta página" é montado
 * automaticamente a partir destes títulos.
 */
export function Section({ title, id, children }: { title: Localized<string> | string; id?: string; children: ReactNode }) {
  const { t } = useLang()
  const heading = typeof title === 'string' ? title : t(title)
  const anchor = id ?? slugify(heading)
  return (
    <section className="doc-section" aria-labelledby={anchor}>
      <h2 id={anchor} className="doc-h2">
        <a href={`#${anchor}`} className="doc-anchor">
          {heading}
        </a>
      </h2>
      {children}
    </section>
  )
}

/** Parágrafo/conteúdo bilíngue com tipografia de documentação. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="doc-prose">{children}</div>
}

/** Lista com marcadores quadrados (assinatura visual do Orange). */
export function Bullets({ items }: { items: Localized<ReactNode>[] }) {
  const { t } = useLang()
  return (
    <ul className="doc-bullets">
      {items.map((item, i) => (
        <li key={i}>{t(item)}</li>
      ))}
    </ul>
  )
}

/** Faça / Não faça lado a lado. */
export function DoDont({
  doItems,
  dontItems,
  doExample,
  dontExample,
}: {
  doItems: Localized<ReactNode>[]
  dontItems: Localized<ReactNode>[]
  doExample?: ReactNode
  dontExample?: ReactNode
}) {
  const { t } = useLang()
  return (
    <div className="doc-dodont">
      <div className="doc-dodont__card doc-dodont__card--do">
        {doExample && <div className="doc-dodont__example">{doExample}</div>}
        <p className="doc-dodont__label">
          <Icon name="check" size="sm" /> {t({ pt: 'Faça', en: 'Do' })}
        </p>
        <ul className="doc-bullets">
          {doItems.map((item, i) => (
            <li key={i}>{t(item)}</li>
          ))}
        </ul>
      </div>
      <div className="doc-dodont__card doc-dodont__card--dont">
        {dontExample && <div className="doc-dodont__example">{dontExample}</div>}
        <p className="doc-dodont__label">
          <Icon name="close" size="sm" /> {t({ pt: 'Não faça', en: "Don't" })}
        </p>
        <ul className="doc-bullets">
          {dontItems.map((item, i) => (
            <li key={i}>{t(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Destaque lateral com borda laranja (dica, atenção, nota). */
export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warning' | 'success' | 'danger'
  title?: Localized<string>
  children: ReactNode
}) {
  const { t } = useLang()
  const icon = tone === 'warning' ? 'alert-triangle' : tone === 'danger' ? 'alert-circle' : tone === 'success' ? 'check-circle' : 'info'
  return (
    // <div> em vez de <aside>: um destaque dentro do texto não é uma região complementar (landmark).
    <div className={`doc-callout doc-callout--${tone}`}>
      <Icon name={icon} size="md" />
      <div>
        {title && <p className="doc-callout__title">{t(title)}</p>}
        <div className="doc-callout__body">{children}</div>
      </div>
    </div>
  )
}

/** Lista de critérios WCAG atendidos pelo componente. */
export function WcagList({ items }: { items: { criterion: string; description: Localized<ReactNode> }[] }) {
  const { t } = useLang()
  return (
    <ul className="doc-wcag">
      {items.map((item) => (
        <li key={item.criterion}>
          <span className="doc-wcag__criterion">{item.criterion}</span>
          <span>{t(item.description)}</span>
        </li>
      ))}
    </ul>
  )
}
