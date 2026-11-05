import { Paper } from '@orangesys/ui'

export default function Borders() {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', width: '100%' }}>
      <Paper padding={5}>
        <strong>default</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Borda neutra de 1px.</p>
      </Paper>
      <Paper padding={5} border="strong">
        <strong>strong</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Mais contraste com o fundo.</p>
      </Paper>
      <Paper padding={5} border="accent-top">
        <strong>accent-top</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Destaca um plano ou métrica.</p>
      </Paper>
      <Paper padding={5} border="accent-left" tone="subtle">
        <strong>accent-left</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Notas e citações.</p>
      </Paper>
      <Paper padding={5} border="none" tone="subtle">
        <strong>none</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Só o fundo sutil.</p>
      </Paper>
    </div>
  )
}
