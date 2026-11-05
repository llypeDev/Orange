import { Button, Icon, Popover, useClipboard } from '@orangesys/ui'

export default function Share() {
  const { copy, copied } = useClipboard()
  const link = 'https://orange.app/p/site-2026'

  return (
    <Popover
      title="Compartilhar projeto"
      showCloseButton
      arrow
      trigger={
        <Button variant="outline" startIcon={<Icon name="link" />}>
          Compartilhar
        </Button>
      }
    >
      <div style={{ display: 'grid', gap: 12, width: 280 }}>
        <span>Qualquer pessoa com o link pode ver este projeto.</span>
        <code
          style={{
            padding: '6px 8px',
            border: '1px solid var(--or-color-border)',
            fontFamily: 'var(--or-font-mono)',
            fontSize: 12,
            color: 'var(--or-color-text)',
            overflowWrap: 'anywhere',
          }}
        >
          {link}
        </code>
        <Button
          size="sm"
          startIcon={<Icon name={copied ? 'check' : 'copy'} />}
          onClick={() => copy(link)}
        >
          {copied ? 'Link copiado' : 'Copiar link'}
        </Button>
      </div>
    </Popover>
  )
}
