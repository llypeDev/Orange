import { Eyebrow, Image } from '@orangesys/ui'
import vitrine from './media/vitrine.svg'

const ratios = ['1/1', '4/3', '16/9', '21/9'] as const

export default function Ratios() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, width: '100%' }}>
      {ratios.map((ratio) => (
        <div key={ratio} style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
          {/* A área é reservada antes de carregar: nada pula quando a foto chega. */}
          <Image src={vitrine} alt="Prateleiras da loja com mochilas, garrafas e acessórios" ratio={ratio} bordered />
          <Eyebrow>{ratio}</Eyebrow>
        </div>
      ))}
    </div>
  )
}
