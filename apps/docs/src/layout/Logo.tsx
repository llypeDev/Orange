/** Marca do Orange: quadrado laranja com um canto recortado + wordmark. */
export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="doc-logo__mark">
      <rect x="0" y="0" width="24" height="24" fill="var(--or-color-accent)" />
      <rect x="12" y="0" width="12" height="12" fill="var(--or-color-bg)" />
      <rect x="15" y="3" width="6" height="6" fill="var(--or-color-text)" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="doc-logo">
      <LogoMark />
      <span className="doc-logo__word">orange</span>
      <span className="doc-logo__tag">design system</span>
    </span>
  )
}
