import { DescriptionList } from '@orange/ui'

export default function Horizontal() {
  return (
    <DescriptionList
      style={{ width: '100%', maxWidth: 560 }}
      items={[
        { term: 'Pedido', description: '#4821' },
        { term: 'Status', description: 'Em separação' },
        { term: 'Previsão de entrega', description: '6 de novembro de 2026' },
        { term: 'Transportadora', description: 'Entrega Expressa Sul' },
        { term: 'Itens', description: ['2× Cadeira ergonômica', '1× Apoio para os pés'] },
      ]}
    />
  )
}
