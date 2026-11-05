import { DescriptionList } from '@orangesys/ui'

export default function Vertical() {
  return (
    <DescriptionList
      layout="vertical"
      style={{ width: '100%', maxWidth: 320 }}
      items={[
        { term: 'Empresa', description: 'Mercado Bom Preço Ltda.' },
        { term: 'Segmento', description: 'Varejo alimentar' },
        { term: 'Fuso horário', description: 'Brasília (GMT−3)' },
        { term: 'Cliente desde', description: 'Agosto de 2023' },
      ]}
    />
  )
}
