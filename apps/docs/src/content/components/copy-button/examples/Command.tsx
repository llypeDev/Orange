import { CopyButton } from '@orange/ui'

const command = 'pnpm add @orange/ui @orange/tokens'

export default function Command() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        maxWidth: 480,
        padding: '4px 4px 4px 16px',
        border: '1px solid var(--or-color-border)',
        background: 'var(--or-color-bg-subtle)',
      }}
    >
      <code
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: 'var(--or-font-mono)',
          fontSize: 'var(--or-text-sm)',
          color: 'var(--or-color-text)',
        }}
      >
        {command}
      </code>
      {/* Sem children: somente ícone, com o nome "Copiar para a área de transferência". */}
      <CopyButton value={command} size="sm" />
    </div>
  )
}
