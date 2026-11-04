import { Meter } from '@orange/ui'

export default function HighIsGood() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 480 }}>
      {/* valores altos são bons: optimum acima de high */}
      <Meter label="Bateria do leitor de cartão" value={86} low={20} high={50} optimum={100} />
      <Meter label="Bateria do totem" value={34} low={20} high={50} optimum={100} />
      <Meter
        label="Bateria da maquininha"
        value={12}
        low={20}
        high={50}
        optimum={100}
        description="Conecte ao carregador."
      />
    </div>
  )
}
