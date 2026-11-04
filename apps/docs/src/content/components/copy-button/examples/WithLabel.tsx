import { CopyButton } from '@orange/ui'

const inviteLink = 'https://app.orange.dev/convite/equipe-produto'

export default function WithLabel() {
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 520 }}>
      <label
        htmlFor="invite-link"
        style={{
          fontFamily: 'var(--or-font-display)',
          fontSize: 'var(--or-text-sm)',
          fontWeight: 600,
        }}
      >
        Link de convite
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          id="invite-link"
          readOnly
          value={inviteLink}
          onFocus={(e) => e.currentTarget.select()}
          style={{
            flex: 1,
            minWidth: 0,
            height: 40,
            padding: '0 12px',
            border: '1px solid var(--or-color-border-control)',
            background: 'var(--or-color-surface)',
            fontSize: 'var(--or-text-sm)',
          }}
        />
        <CopyButton value={inviteLink} copiedLabel="Link copiado">
          Copiar link
        </CopyButton>
      </div>
    </div>
  )
}
