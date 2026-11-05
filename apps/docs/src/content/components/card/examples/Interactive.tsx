import { Button, Card, CardBody, CardHeader, CardMedia, Icon } from '@orangesys/ui'
import { useState } from 'react'
import guia from './media/guia.svg'
import integracao from './media/integracao.svg'
import relatorio from './media/relatorio.svg'

const articles = [
  { id: 'vendas', type: 'Relatório', title: 'Vendas do 3º trimestre', meta: 'Atualizado há 2 horas', image: relatorio },
  { id: 'nfe', type: 'Guia', title: 'Como emitir notas fiscais em lote', meta: '6 min de leitura', image: guia },
  { id: 'erp', type: 'Integração', title: 'Conectar o ERP à sua loja', meta: '12 min de leitura', image: integracao },
]

export default function Interactive() {
  const [saved, setSaved] = useState<string[]>(['nfe'])
  const toggle = (id: string) =>
    setSaved((list) => (list.includes(id) ? list.filter((s) => s !== id) : [...list, id]))

  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        width: '100%',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {articles.map((article) => (
        <Card as="li" key={article.id} interactive>
          <CardMedia src={article.image} alt="" />
          <CardHeader
            eyebrow={article.type}
            title={article.title}
            href={`#${article.id}`}
            linkProps={{ arrow: true }}
            headingLevel={4}
            actions={
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Salvar "${article.title}"`}
                aria-pressed={saved.includes(article.id)}
                startIcon={<Icon name={saved.includes(article.id) ? 'check' : 'heart'} />}
                onClick={() => toggle(article.id)}
              />
            }
          />
          <CardBody style={{ fontSize: 'var(--or-text-sm)' }}>{article.meta}</CardBody>
        </Card>
      ))}
    </ul>
  )
}
