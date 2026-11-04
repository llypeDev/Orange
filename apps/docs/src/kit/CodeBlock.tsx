import { useClipboard } from '@orange/ui'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { useLang } from '../i18n'

/** Tema de sintaxe na paleta do Orange (funciona sobre o fundo de código escuro). */
const orangePrism: PrismTheme = {
  plain: { color: '#d4cdb5', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#8a8a94', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: '#9c9588' } },
    { types: ['keyword', 'boolean', 'important', 'atrule'], style: { color: '#f58549' } },
    { types: ['string', 'char', 'attr-value', 'inserted', 'url'], style: { color: '#a6d16a' } },
    { types: ['tag', 'selector', 'class-name', 'builtin'], style: { color: '#8da2ea' } },
    { types: ['attr-name', 'property', 'constant', 'symbol'], style: { color: '#efd27f' } },
    { types: ['number', 'variable', 'regex'], style: { color: '#f8a675' } },
    { types: ['function'], style: { color: '#f0ebdb' } },
    { types: ['deleted'], style: { color: '#ef6a5a' } },
  ],
}

export interface CodeBlockProps {
  code: string
  language?: 'tsx' | 'jsx' | 'ts' | 'js' | 'bash' | 'css' | 'json' | 'html' | 'markup'
  /** Rótulo exibido no cabeçalho (ex.: nome do arquivo). */
  title?: string
  /** Mostrar números de linha. */
  lineNumbers?: boolean
  /** Altura máxima antes de rolar. */
  maxHeight?: number
}

export function CodeBlock({ code, language = 'tsx', title, lineNumbers = false, maxHeight }: CodeBlockProps) {
  const { copy, copied } = useClipboard()
  const { t } = useLang()
  const trimmed = code.replace(/\n+$/, '')
  const lang = language === 'ts' ? 'typescript' : language === 'js' ? 'javascript' : language === 'html' ? 'markup' : language

  return (
    <div className="doc-code">
      <div className="doc-code__bar">
        <span className="doc-code__lang">{title ?? language.toUpperCase()}</span>
        <button
          type="button"
          className="doc-code__copy"
          onClick={() => copy(trimmed)}
          aria-live="polite"
          data-copied={copied || undefined}
        >
          {copied ? t({ pt: 'Copiado', en: 'Copied' }) : t({ pt: 'Copiar', en: 'Copy' })}
        </button>
      </div>
      <Highlight code={trimmed} language={lang} theme={orangePrism}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`doc-code__pre ${className}`}
            style={{ ...style, maxHeight }}
            tabIndex={0}
            aria-label={t({ pt: `Código ${title ?? language}`, en: `${title ?? language} code` })}
          >
            <code>
              {tokens.map((line, i) => {
                const { key: _lineKey, ...lineProps } = getLineProps({ line, key: i }) as Record<string, unknown>
                return (
                  <span key={i} {...lineProps} className="doc-code__line">
                    {lineNumbers && <span className="doc-code__ln" aria-hidden="true">{i + 1}</span>}
                    {line.map((token, k) => {
                      const { key: _tokenKey, ...tokenProps } = getTokenProps({ token, key: k }) as Record<string, unknown>
                      return <span key={k} {...tokenProps} />
                    })}
                    {'\n'}
                  </span>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}

/** Código inline: <Code>variant="primary"</Code> */
export function Code({ children }: { children: React.ReactNode }) {
  return <code className="doc-inline-code">{children}</code>
}
