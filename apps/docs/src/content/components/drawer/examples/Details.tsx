import { Button, Drawer } from '@orangesys/ui'

const itens = [
  { nome: 'Camiseta básica preta — M', qtd: 2, valor: 'R$ 119,80' },
  { nome: 'Boné aba reta laranja', qtd: 1, valor: 'R$ 79,90' },
  { nome: 'Frete expresso', qtd: 1, valor: 'R$ 24,90' },
]

export default function Details() {
  return (
    <Drawer
      title="Pedido #4821"
      description="Feito em 12 de março de 2026 às 14h32"
      size="sm"
      trigger={<Button variant="outline">Ver pedido #4821</Button>}
      footer={({ close }) => (
        <>
          <Button variant="outline" onClick={close}>
            Fechar
          </Button>
          <Button onClick={close}>Marcar como enviado</Button>
        </>
      )}
    >
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '8px 16px',
          margin: '0 0 24px',
        }}
      >
        <dt style={{ color: 'var(--or-color-text-subtle)' }}>Cliente</dt>
        <dd style={{ margin: 0 }}>Marina Costa</dd>
        <dt style={{ color: 'var(--or-color-text-subtle)' }}>Status</dt>
        <dd style={{ margin: 0 }}>Pago, aguardando envio</dd>
        <dt style={{ color: 'var(--or-color-text-subtle)' }}>Entrega</dt>
        <dd style={{ margin: 0 }}>Curitiba, PR</dd>
      </dl>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {itens.map((item) => (
          <li
            key={item.nome}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              padding: '12px 0',
              borderTop: '1px solid var(--or-color-border)',
            }}
          >
            <span>
              {item.qtd}× {item.nome}
            </span>
            <strong>{item.valor}</strong>
          </li>
        ))}
      </ul>
    </Drawer>
  )
}
