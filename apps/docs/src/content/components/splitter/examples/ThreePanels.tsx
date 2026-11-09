import { Checkbox, Splitter, SplitterHandle, SplitterPanel, Stack, Tag } from '@orangesys/ui'
import { useState } from 'react'

const products = [
  { sku: 'CAF-250', name: 'Café especial 250 g', category: 'Mercearia', price: 'R$ 42,90', stock: 132 },
  { sku: 'CHA-100', name: 'Chá mate tostado 100 g', category: 'Bebidas', price: 'R$ 14,50', stock: 58 },
  { sku: 'GRA-500', name: 'Granola sem açúcar 500 g', category: 'Mercearia', price: 'R$ 27,00', stock: 0 },
  { sku: 'SUC-1L', name: 'Suco de uva integral 1 L', category: 'Bebidas', price: 'R$ 19,90', stock: 24 },
  { sku: 'BAN-1KG', name: 'Banana prata orgânica 1 kg', category: 'Hortifrúti', price: 'R$ 8,90', stock: 40 },
]

const categories = ['Bebidas', 'Mercearia', 'Hortifrúti']

export default function ThreePanels() {
  // Controlado: os tamanhos ficam no estado da página (e podem ir para a URL ou para o servidor).
  const [sizes, setSizes] = useState([22, 48, 30])
  const [active, setActive] = useState<string[]>(categories)
  const [inStock, setInStock] = useState(false)
  const [selected, setSelected] = useState(products[0].sku)

  const results = products.filter((p) => active.includes(p.category) && (!inStock || p.stock > 0))
  const product = products.find((p) => p.sku === selected) ?? products[0]

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Filtros {Math.round(sizes[0])}% · Resultados {Math.round(sizes[1])}% · Detalhes {Math.round(sizes[2])}%.
        Foque o primeiro separador e pressione Enter para recolher os filtros.
      </p>
      <div style={{ height: 400, border: '1px solid var(--or-color-border)' }}>
        <Splitter label="Catálogo" sizes={sizes} onSizesChange={setSizes} stackBelow="md">
          <SplitterPanel label="Filtros" collapsible minSize={18} maxSize={32}>
            <fieldset style={{ display: 'grid', gap: 10, margin: 0, padding: 16, border: 0 }}>
              <legend className="or-eyebrow" style={{ padding: 0, marginBottom: 8 }}>
                Categorias
              </legend>
              {categories.map((category) => (
                <Checkbox
                  key={category}
                  label={category}
                  checked={active.includes(category)}
                  onCheckedChange={(checked) =>
                    setActive((list) => (checked ? [...list, category] : list.filter((c) => c !== category)))
                  }
                />
              ))}
              <Checkbox label="Só com estoque" checked={inStock} onCheckedChange={setInStock} />
            </fieldset>
          </SplitterPanel>
          <SplitterHandle />
          <SplitterPanel label="Resultados" minSize={30}>
            <p className="or-eyebrow" style={{ margin: 0, padding: '16px 16px 8px' }}>
              {results.length} produtos
            </p>
            <ul role="list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {results.map((p) => (
                <li key={p.sku} style={{ borderTop: '1px solid var(--or-color-border)' }}>
                  <button
                    type="button"
                    aria-current={p.sku === selected ? 'true' : undefined}
                    onClick={() => setSelected(p.sku)}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: 8,
                      width: '100%',
                      padding: '10px 16px',
                      border: 0,
                      background: p.sku === selected ? 'var(--or-color-accent-subtle)' : 'transparent',
                      color: 'inherit',
                      font: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{p.name}</span>
                    <strong>{p.price}</strong>
                  </button>
                </li>
              ))}
            </ul>
          </SplitterPanel>
          <SplitterHandle />
          <SplitterPanel label="Detalhes do produto" minSize={20} maxSize={40}>
            <div style={{ display: 'grid', gap: 8, padding: 16 }}>
              <p className="or-eyebrow" style={{ margin: 0 }}>
                {product.sku}
              </p>
              <h4 style={{ margin: 0 }}>{product.name}</h4>
              <p style={{ margin: 0 }}>{product.price}</p>
              <div>
                <Tag tone={product.stock > 0 ? 'success' : 'danger'}>
                  {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
                </Tag>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
    </Stack>
  )
}
