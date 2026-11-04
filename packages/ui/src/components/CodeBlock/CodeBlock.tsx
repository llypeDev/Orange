import { forwardRef, useMemo, useState, type CSSProperties, type HTMLAttributes } from 'react'
import { useClipboard, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './CodeBlock.css'

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title' | 'onCopy'> {
  /** Código exibido. Quebras de linha no final são removidas. */
  code: string
  /** Linguagem do trecho (`tsx`, `bash`, `json`…), exibida como rótulo no cabeçalho. */
  language?: string
  /** Nome do arquivo ou título do trecho, exibido no cabeçalho. */
  title?: string
  /** Mostra a numeração das linhas (não é copiada nem lida por leitores de tela). */
  showLineNumbers?: boolean
  /** Número da primeira linha — útil para trechos de um arquivo maior. Padrão: `1`. */
  startingLineNumber?: number
  /** Linhas destacadas, pelo número exibido (considera `startingLineNumber`). */
  highlightLines?: number[]
  /** Quebra linhas longas em vez de rolar horizontalmente. */
  wrap?: boolean
  /** Altura máxima da área de código antes de rolar (px ou valor CSS). */
  maxHeight?: number | string
  /** Mostra o botão de copiar. Padrão: `true`. */
  copyable?: boolean
  /** Chamado depois que o código é copiado com sucesso. */
  onCopy?: (code: string) => void
  /** Nome acessível da área rolável. Padrão: "Código: {title ou language}". */
  codeLabel?: string
}

/**
 * Exibe trechos de código em fonte monoespaçada sobre fundo escuro, com botão
 * de copiar, numeração e destaque de linhas. Não faz realce de sintaxe — mantém
 * a biblioteca leve e o código legível em qualquer linguagem.
 */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  {
    code,
    language,
    title,
    showLineNumbers = false,
    startingLineNumber = 1,
    highlightLines,
    wrap = false,
    maxHeight,
    copyable = true,
    onCopy,
    codeLabel,
    className,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const { copy, copied } = useClipboard()
  // Depois da primeira cópia, a volta do ícone "copiar" também é animada.
  const [hasCopied, setHasCopied] = useState(false)
  const labelId = useId('or-code-block-label')
  const trimmed = useMemo(() => code.replace(/\r\n?/g, '\n').replace(/\n+$/, ''), [code])
  const lines = useMemo(() => trimmed.split('\n'), [trimmed])
  const highlighted = useMemo(() => new Set(highlightLines ?? []), [highlightLines])
  const lastLineNumber = startingLineNumber + lines.length - 1
  const name = title ?? language
  const hasHeader = Boolean(title || language || copyable)

  const handleCopy = async () => {
    const ok = await copy(trimmed)
    if (ok) {
      setHasCopied(true)
      onCopy?.(trimmed)
    }
  }

  return (
    <div
      ref={ref}
      className={cx(
        'or-code-block',
        wrap && 'or-code-block--wrap',
        showLineNumbers && 'or-code-block--line-numbers',
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="or-code-block__header">
          <span className="or-code-block__meta">
            {title && (
              <span className="or-code-block__title" id={labelId}>
                {title}
              </span>
            )}
            {language && (
              <span className="or-code-block__language" id={title ? undefined : labelId}>
                {language}
              </span>
            )}
          </span>
          {copyable && (
            <button
              type="button"
              className="or-code-block__copy"
              onClick={handleCopy}
              aria-describedby={name ? labelId : undefined}
              data-copied={copied || undefined}
            >
              <span
                key={copied ? 'check' : 'copy'}
                className={cx(
                  'or-code-block__copy-icon',
                  copied && 'or-code-block__copy-icon--check',
                  !copied && hasCopied && 'or-code-block__copy-icon--return',
                )}
                aria-hidden="true"
              >
                <Icon name={copied ? 'check' : 'copy'} size="sm" />
              </span>
              <span>{copied ? t('copied') : t('copy')}</span>
            </button>
          )}
          {copyable && (
            <VisuallyHidden role="status" aria-live="polite">
              {copied ? t('copied') : ''}
            </VisuallyHidden>
          )}
        </div>
      )}
      <pre
        className="or-code-block__pre"
        tabIndex={0}
        role="group"
        aria-label={codeLabel ?? (name ? t('codeBlockNamed', { name }) : t('codeBlock'))}
        style={
          {
            maxHeight,
            '--_digits': `${String(lastLineNumber).length}ch`,
          } as CSSProperties
        }
        data-language={language}
      >
        <code className="or-code-block__code">
          {lines.map((line, index) => {
            const lineNumber = startingLineNumber + index
            const isHighlighted = highlighted.has(lineNumber)
            // A linha mantém o mesmo elemento (o fundo do destaque transiciona);
            // o texto destacado fica num <mark> para leitores de tela.
            const Text = isHighlighted ? 'mark' : 'span'
            return (
              <span
                key={index}
                className={cx('or-code-block__line', isHighlighted && 'or-code-block__line--highlighted')}
              >
                {showLineNumbers && (
                  <span className="or-code-block__line-number" aria-hidden="true" data-line={lineNumber} />
                )}
                <Text className="or-code-block__line-text">
                  {line}
                  {'\n'}
                </Text>
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
})
