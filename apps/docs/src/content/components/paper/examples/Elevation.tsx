import { Paper } from '@orange/ui'

export default function Elevation() {
  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', width: '100%', padding: 8 }}>
      <Paper elevation="flat">
        <p className="or-eyebrow" style={{ margin: 0 }}>flat</p>
        <p style={{ margin: '8px 0 0' }}>Conteúdo no fluxo da página.</p>
      </Paper>
      <Paper elevation="raised">
        <p className="or-eyebrow" style={{ margin: 0 }}>raised</p>
        <p style={{ margin: '8px 0 0' }}>Painéis que se destacam do fundo.</p>
      </Paper>
      <Paper elevation="overlay">
        <p className="or-eyebrow" style={{ margin: 0 }}>overlay</p>
        <p style={{ margin: '8px 0 0' }}>Camadas flutuantes, como menus.</p>
      </Paper>
    </div>
  )
}
