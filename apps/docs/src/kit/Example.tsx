import { useState, type ReactNode } from 'react'
import { useLang, type Localized } from '../i18n'
import { CodeBlock } from './CodeBlock'
import { slugify } from './slugify'

export interface ExampleProps {
  /** Título do exemplo (vira um <h3> com âncora). */
  title?: Localized<string>
  /** Explicação curta acima da prévia. */
  description?: Localized<ReactNode>
  /** Código-fonte exibido (use `import Code from './examples/X?raw'`). */
  code?: string
  /** A prévia renderizada ao vivo. */
  children: ReactNode
  /** Alinhamento da prévia. */
  align?: 'start' | 'center' | 'stretch'
  /** Altura mínima da área de prévia (px). */
  minHeight?: number
  /** Código começa recolhido. */
  collapsed?: boolean
}

/**
 * Bloco de exemplo: prévia ao vivo + código. A prévia pode ser alternada
 * entre os temas claro e escuro, independente do tema da página.
 */
export function Example({ title, description, code, children, align = 'start', minHeight, collapsed = false }: ExampleProps) {
  const { t } = useLang()
  const [theme, setTheme] = useState<'inherit' | 'dark' | 'light'>('inherit')
  const [showCode, setShowCode] = useState(!collapsed)
  const heading = title ? t(title) : undefined
  // Prefixo evita colisão com o id da Section de mesmo título (ex.: seção "Tons" e exemplo "Tons").
  const id = heading ? `ex-${slugify(heading)}` : undefined

  return (
    <div className="doc-example">
      {heading && (
        <h3 id={id} className="doc-h3">
          <a href={`#${id}`} className="doc-anchor">
            {heading}
          </a>
        </h3>
      )}
      {description && <div className="doc-example__description">{t(description)}</div>}
      <div className="doc-example__frame">
        <div className="doc-example__toolbar">
          <span className="doc-example__label">{t({ pt: 'Prévia', en: 'Preview' })}</span>
          <div className="doc-example__tools" role="group" aria-label={t({ pt: 'Tema da prévia', en: 'Preview theme' })}>
            {(['inherit', 'dark', 'light'] as const).map((value) => (
              <button
                key={value}
                type="button"
                className="doc-example__tool"
                aria-pressed={theme === value}
                onClick={() => setTheme(value)}
              >
                {value === 'inherit'
                  ? t({ pt: 'Auto', en: 'Auto' })
                  : value === 'dark'
                    ? t({ pt: 'Escuro', en: 'Dark' })
                    : t({ pt: 'Claro', en: 'Light' })}
              </button>
            ))}
          </div>
        </div>
        <div
          className={`doc-example__preview doc-example__preview--${align}`}
          data-theme={theme === 'inherit' ? undefined : theme}
          style={{ minHeight }}
        >
          {children}
        </div>
        {code && (
          <>
            <button
              type="button"
              className="doc-example__toggle"
              aria-expanded={showCode}
              onClick={() => setShowCode((v) => !v)}
            >
              <span aria-hidden="true">{showCode ? '−' : '+'}</span>
              {showCode ? t({ pt: 'Ocultar código', en: 'Hide code' }) : t({ pt: 'Mostrar código', en: 'Show code' })}
            </button>
            {showCode && <CodeBlock code={code} language="tsx" maxHeight={460} />}
          </>
        )}
      </div>
    </div>
  )
}
