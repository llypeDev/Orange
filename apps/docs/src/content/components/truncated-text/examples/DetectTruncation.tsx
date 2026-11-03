import { TruncatedText } from '@orange/ui'
import { useState } from 'react'

export default function DetectTruncation() {
  const [largura, setLargura] = useState(240)
  const [cortado, setCortado] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <label style={{ display: 'grid', gap: 4, fontSize: 14 }}>
        Largura do contêiner: {largura}px
        <input type="range" min={120} max={420} value={largura} onChange={(e) => setLargura(Number(e.target.value))} />
      </label>
      <div style={{ width: largura, padding: '8px 12px', border: '1px solid var(--or-color-border)' }}>
        <TruncatedText onTruncatedChange={setCortado}>Reunião de planejamento do quarto trimestre</TruncatedText>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }} aria-live="polite">
        {cortado ? 'O texto está cortado.' : 'O texto cabe inteiro.'}
      </p>
    </div>
  )
}
