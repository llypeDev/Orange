import { Splitter, SplitterHandle, SplitterPanel, Tag } from '@orange/ui'
import { useState } from 'react'

const orders = [
  {
    id: '4821',
    store: 'Mercearia Bom Grão',
    total: 'R$ 1.240,00',
    status: 'Pago',
    tone: 'success',
    items: ['Café especial 250 g × 12', 'Açúcar demerara 1 kg × 10', 'Filtro de papel nº 103 × 20'],
    shipping: 'Transportadora · previsão 12/11',
  },
  {
    id: '4820',
    store: 'Café Ponto Doce',
    total: 'R$ 318,90',
    status: 'Aguardando envio',
    tone: 'warning',
    items: ['Chá mate tostado 100 g × 6', 'Granola sem açúcar 500 g × 4'],
    shipping: 'Retirada na loja',
  },
  {
    id: '4819',
    store: 'Ateliê Fio de Linha',
    total: 'R$ 96,50',
    status: 'Em separação',
    tone: 'info',
    items: ['Linha de algodão cru × 5'],
    shipping: 'Correios · previsão 14/11',
  },
] as const

export default function ListDetail() {
  const [selected, setSelected] = useState<string>(orders[0].id)
  const order = orders.find((o) => o.id === selected) ?? orders[0]

  return (
    <div style={{ height: 380, border: '1px solid var(--or-color-border)' }}>
      {/* Abaixo de 640px os painéis empilham: a lista vem antes do detalhe. */}
      <Splitter label="Pedidos" defaultSizes={[38, 62]} stackBelow="sm">
        <SplitterPanel label="Lista de pedidos" minSize={25} maxSize={55}>
          <ul role="list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {orders.map((o) => {
              const current = o.id === selected
              return (
                <li key={o.id} style={{ borderBottom: '1px solid var(--or-color-border)' }}>
                  <button
                    type="button"
                    aria-current={current ? 'true' : undefined}
                    onClick={() => setSelected(o.id)}
                    style={{
                      display: 'grid',
                      gap: 4,
                      width: '100%',
                      padding: '12px 16px',
                      border: 0,
                      borderLeft: `3px solid ${current ? 'var(--or-color-accent)' : 'transparent'}`,
                      background: current ? 'var(--or-color-accent-subtle)' : 'transparent',
                      color: 'inherit',
                      font: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>Pedido #{o.id}</strong>
                    <span style={{ color: 'var(--or-color-text-muted)' }}>
                      {o.store} · {o.total}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel label="Detalhe do pedido" minSize={35}>
          <div style={{ display: 'grid', gap: 12, padding: 20 }}>
            <p className="or-eyebrow" style={{ margin: 0 }}>
              Detalhe do pedido
            </p>
            <h4 style={{ margin: 0 }}>
              #{order.id} · {order.store}
            </h4>
            <div>
              <Tag tone={order.tone}>{order.status}</Tag>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {order.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>{order.shipping}</p>
            <p style={{ margin: 0 }}>
              Total: <strong>{order.total}</strong>
            </p>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
