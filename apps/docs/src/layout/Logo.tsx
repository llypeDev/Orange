/**
 * Marca do Orange: quadrado laranja com um canto recortado + wordmark.
 * `animated`: as três peças "caem" no lugar na primeira pintura (como o
 * piece-drop do zop.dev). Respeita prefers-reduced-motion via tokens.
 */
export function LogoMark({ size = 22, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={`doc-logo__mark ${animated ? 'doc-logo__mark--animated' : ''}`}
    >
      <rect className="doc-logo__piece doc-logo__piece--1" x="0" y="0" width="24" height="24" fill="var(--or-color-accent)" />
      <rect className="doc-logo__piece doc-logo__piece--2" x="12" y="0" width="12" height="12" fill="var(--or-color-bg)" />
      <rect className="doc-logo__piece doc-logo__piece--3" x="15" y="3" width="6" height="6" fill="var(--or-color-text)" />
    </svg>
  )
}

export function Logo({ animated = false }: { animated?: boolean }) {
  return (
    <span className="doc-logo">
      <LogoMark animated={animated} />
      <span className="doc-logo__word">orange</span>
      <span className="doc-logo__tag">design system</span>
    </span>
  )
}
