import type { ReactNode } from 'react'
import { useLang, type Localized } from '../i18n'
import { Code } from './CodeBlock'

export interface PropRow {
  name: string
  type: string
  default?: string
  required?: boolean
  description: Localized<ReactNode>
}

/** Tabela de propriedades (API) de um componente. */
export function PropsTable({ rows, caption }: { rows: PropRow[]; caption?: Localized<string> }) {
  const { t } = useLang()
  return (
    <div className="doc-table-wrap" role="region" aria-label={caption ? t(caption) : 'Props'} tabIndex={0}>
      <table className="doc-table doc-table--props">
        {caption && <caption className="doc-table__caption">{t(caption)}</caption>}
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">{t({ pt: 'Tipo', en: 'Type' })}</th>
            <th scope="col">{t({ pt: 'Padrão', en: 'Default' })}</th>
            <th scope="col">{t({ pt: 'Descrição', en: 'Description' })}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <Code>{row.name}</Code>
                {row.required && (
                  <span className="doc-required" title={t({ pt: 'obrigatório', en: 'required' })}>
                    *
                  </span>
                )}
              </th>
              <td>
                <code className="doc-type">{row.type}</code>
              </td>
              <td>{row.default ? <Code>{row.default}</Code> : <span aria-label={t({ pt: 'nenhum', en: 'none' })}>—</span>}</td>
              <td>{t(row.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export interface KeyboardRow {
  keys: string[]
  description: Localized<ReactNode>
}

/** Tabela de interações de teclado. `keys` aceita combinações: ['Shift', 'Tab']. */
export function KeyboardTable({ rows }: { rows: KeyboardRow[] }) {
  const { t } = useLang()
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">{t({ pt: 'Tecla', en: 'Key' })}</th>
            <th scope="col">{t({ pt: 'Ação', en: 'Action' })}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th scope="row" className="doc-keys">
                {row.keys.map((k, j) => (
                  <span key={k}>
                    {j > 0 && <span className="doc-keys__plus">+</span>}
                    <kbd className="doc-kbd">{k}</kbd>
                  </span>
                ))}
              </th>
              <td>{t(row.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export interface DefinitionRow {
  term: Localized<ReactNode>
  description: Localized<ReactNode>
}

/** Tabela de duas colunas: termo → descrição (ex.: "Tipos de botões"). */
export function DefinitionTable({ rows }: { rows: DefinitionRow[] }) {
  const { t } = useLang()
  return (
    <div className="doc-table-wrap">
      <table className="doc-table doc-table--definitions">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th scope="row">{t(row.term)}</th>
              <td>{t(row.description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
