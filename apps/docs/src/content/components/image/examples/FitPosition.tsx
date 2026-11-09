import { Eyebrow, Image, Stack } from '@orangesys/ui'
import logotipo from './media/logotipo.svg'
import retrato from './media/retrato.svg'

export default function FitPosition() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, width: '100%' }}>
      <Stack gap={2}>
        <Image src={retrato} alt="Retrato da gerente da loja" ratio="1/1" bordered />
        <Eyebrow>cover · center</Eyebrow>
      </Stack>
      <Stack gap={2}>
        {/* O rosto fica no topo da foto: o ponto focal evita cortá-lo. */}
        <Image src={retrato} alt="Retrato da gerente da loja" ratio="1/1" position="top" bordered />
        <Eyebrow>cover · top</Eyebrow>
      </Stack>
      <Stack gap={2}>
        {/* Logotipos nunca devem ser recortados. */}
        <Image src={logotipo} alt="Laranja Store" ratio="1/1" fit="contain" bordered />
        <Eyebrow>contain</Eyebrow>
      </Stack>
    </div>
  )
}
