# Splitter

Painéis redimensionáveis com separador arrastável e acessível pelo teclado — lista e detalhe, editor e prévia, inspetores e consoles.

- Categoria: Layout · Status: estável
- Importação: `import { Splitter, SplitterHandle, SplitterPanel } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/splitter (em inglês: https://orange.llypedev.com.br/en/components/splitter)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-splitter--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Splitter

## Boas práticas

- Use quando a pessoa precisa equilibrar duas ou três áreas que trabalham juntas: lista e detalhe, editor e prévia, inspetor, console de logs. Para a estrutura da página (cabeçalho, menu lateral), use o AppShell.
- Dê um `label` a cada painel: ele nomeia o separador ("Redimensionar Lista de pedidos"). Defina `minSize` para que o conteúdo nunca fique estreito demais para ser lido.
- Torne recolhível (`collapsible`) só o painel secundário — filtros, console, inspetor —, nunca o conteúdo principal.
- Em ferramentas usadas todo dia, guarde o layout com `storageKey`. O clique duplo no separador sempre volta aos tamanhos padrão.
- O Splitter ocupa a altura do contêiner: dê uma altura a ele (ou ao pai). Painéis rolam por dentro.

> **Telas estreitas** Com `stackBelow="sm"` (640px) ou `"md"` (768px), abaixo do ponto de quebra os painéis empilham na ordem do código, com a altura do conteúdo e sem separadores (só CSS, sem JavaScript). O conteúdo precisa fazer sentido empilhado: a lista antes do detalhe, o editor antes da prévia. Painéis recolhidos voltam a aparecer.

## Anatomia

- **Splitter** — Grade CSS que divide o espaço. Os tamanhos são porcentagens (somam 100) aplicadas como trilhas em fr; os separadores têm 1px fixo.
- **SplitterPanel** — Área de conteúdo com limites (minSize, maxSize) e recolhimento opcional. Rola por dentro.
- **SplitterHandle** — Separador focável entre dois painéis: linha de 1px em --or-color-border, área de toque invisível de 24px e marca de "pegar" no meio. Vira laranja no hover, no foco e no arraste.
- **Painel primário** — O painel antes do separador. É o tamanho dele que o separador anuncia (aria-valuenow) e controla (aria-controls).

## Exemplos

### Lista e detalhe

A lista vai de 25% a 55%; o detalhe nunca fica abaixo de 35%. Abaixo de 640px os painéis empilham.

```tsx
import { Splitter, SplitterHandle, SplitterPanel, Tag } from '@orangesys/ui'
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
```

### Editor, prévia e console

Divisão vertical com um Splitter horizontal dentro do painel de cima. O console de logs é recolhível: foque o separador de baixo e pressione Enter (ou arraste até o fim).

```tsx
import { Splitter, SplitterHandle, SplitterPanel, TextArea } from '@orangesys/ui'
import { useState } from 'react'

const initialText =
  'Café especial de torra média, com notas de chocolate e caramelo. Grãos 100% arábica do sul de Minas, torrados na semana do envio.'

export default function EditorPreview() {
  const [text, setText] = useState(initialText)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const logs = [
    '09:41:02  rascunho carregado (versão 3)',
    `09:41:05  ${text.length} caracteres · ${words} palavras`,
    text.length > 160
      ? '09:41:05  aviso: acima de 160 caracteres, o resumo da vitrine será cortado'
      : '09:41:05  ok: o resumo cabe no card da vitrine',
    '09:41:06  prévia atualizada',
  ]

  return (
    <div style={{ height: 460, border: '1px solid var(--or-color-border)' }}>
      {/* Divisão vertical: editor e prévia em cima, console recolhível embaixo. */}
      <Splitter orientation="vertical" label="Edição da descrição" defaultSizes={[68, 32]}>
        <SplitterPanel label="Editor e prévia" minSize={40}>
          <Splitter label="Editor e prévia" defaultSizes={[50, 50]} stackBelow="sm">
            <SplitterPanel label="Descrição do produto" minSize={30}>
              <div style={{ padding: 16 }}>
                <TextArea
                  label="Descrição do produto"
                  description="Aparece na página do produto e no card da vitrine."
                  rows={6}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
            </SplitterPanel>
            <SplitterHandle />
            <SplitterPanel label="Prévia" minSize={30}>
              <article style={{ display: 'grid', gap: 8, padding: 16 }}>
                <p className="or-eyebrow" style={{ margin: 0 }}>
                  Prévia
                </p>
                <h4 style={{ margin: 0 }}>Café especial torra média — 250 g</h4>
                <p style={{ margin: 0, color: 'var(--or-color-text-muted)', overflowWrap: 'anywhere' }}>
                  {text || 'Sem descrição.'}
                </p>
                <strong>R$ 42,90</strong>
              </article>
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel
          label="Console de logs"
          collapsible
          minSize={18}
          style={{ display: 'flex', flexDirection: 'column', background: 'var(--or-color-bg-subtle)' }}
        >
          <p className="or-eyebrow" style={{ margin: 0, padding: '8px 16px 0' }}>
            Console de logs
          </p>
          {/* Região rolável focável: quem usa teclado também consegue rolar os logs. */}
          <pre
            tabIndex={0}
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              margin: 0,
              padding: '8px 16px 12px',
              overflow: 'auto',
              fontFamily: 'var(--or-font-mono)',
              fontSize: 'var(--or-text-xs)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {logs.join('\n')}
          </pre>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
```

### Três painéis

Filtros, resultados e detalhes com tamanhos mínimos; cada separador mexe só nos seus vizinhos. Os tamanhos são controlados (sizes + onSizesChange) e os filtros, recolhíveis.

```tsx
import { Checkbox, Splitter, SplitterHandle, SplitterPanel, Tag } from '@orangesys/ui'
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
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
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
    </div>
  )
}
```

### Layout salvo

Com storageKey, os tamanhos vão para o localStorage ao fim de cada ajuste e voltam ao recarregar. Se o armazenamento estiver bloqueado (modo privado, cota cheia), o Splitter segue funcionando sem salvar.

```tsx
import { Splitter, SplitterHandle, SplitterPanel } from '@orangesys/ui'
import { useState } from 'react'

const tickets = [
  { id: '1093', subject: 'Troca de tamanho — tênis de corrida', status: 'Aberto' },
  { id: '1092', subject: 'Atraso na entrega do pedido #4818', status: 'Aguardando cliente' },
  { id: '1091', subject: 'Cupom de frete grátis não aplicado', status: 'Resolvido' },
]

const messages = [
  { from: 'Cliente', text: 'O tênis chegou, mas ficou apertado. Consigo trocar pelo número 41?' },
  { from: 'Equipe', text: 'Claro! Geramos a etiqueta de devolução — é só postar em até 7 dias.' },
]

export default function Persisted() {
  const [saved, setSaved] = useState<number[] | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <div style={{ height: 320, border: '1px solid var(--or-color-border)' }}>
        {/* Salvo em localStorage como "or-splitter:docs-atendimento" ao fim de cada ajuste. */}
        <Splitter
          label="Atendimento"
          storageKey="docs-atendimento"
          defaultSizes={[34, 66]}
          onResizeEnd={setSaved}
          stackBelow="sm"
        >
          <SplitterPanel label="Fila de chamados" minSize={24} maxSize={50}>
            <ul role="list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  style={{ display: 'grid', gap: 2, padding: '12px 16px', borderBottom: '1px solid var(--or-color-border)' }}
                >
                  <strong>#{ticket.id}</strong>
                  <span>{ticket.subject}</span>
                  <span style={{ color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>
                    {ticket.status}
                  </span>
                </li>
              ))}
            </ul>
          </SplitterPanel>
          <SplitterHandle />
          <SplitterPanel label="Conversa" minSize={40}>
            <div style={{ display: 'grid', gap: 12, padding: 16 }}>
              <p className="or-eyebrow" style={{ margin: 0 }}>
                Chamado #1093
              </p>
              {messages.map((message, i) => (
                <p key={i} style={{ margin: 0 }}>
                  <strong>{message.from}:</strong> {message.text}
                </p>
              ))}
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        {saved
          ? `Salvo: ${saved.map((size) => `${Math.round(size)}%`).join(' · ')}. Recarregue a página para conferir.`
          : 'Redimensione e recarregue a página: o layout volta como você deixou. Clique duas vezes no separador para voltar ao padrão.'}
      </p>
    </div>
  )
}
```

## Movimento

Só as trilhas da grade (grid-template-columns / grid-template-rows) animam — nada de width, height ou flex-basis nos painéis. Durações e curvas vêm dos tokens e zeram com prefers-reduced-motion.

- **Recolher / expandir (Enter)** — As trilhas animam até o novo tamanho em --or-duration-slow (400ms), --or-ease-in-out. Recolhido em 0%, o conteúdo esmaece em --or-duration-fast (160ms) e, ao fim, sai do foco e dos leitores de tela.
- **Home / End e clique duplo** — Saltos ao mínimo, ao máximo ou aos tamanhos padrão usam a mesma transição (400ms, --or-ease-in-out).
- **Arrastar e setas** — Sem transição: o painel segue o ponteiro (ou o passo da tecla) na hora. Arrastando, o cursor vira col-resize/row-resize na página toda e a seleção de texto fica desligada.
- **Hover, foco e arraste no separador** — A linha e a marca passam de --or-color-border para --or-color-accent em --or-duration-fast (160ms), --or-ease-out; no arraste, a linha engrossa para 3px com box-shadow.
- **Movimento reduzido** — Recolher, expandir e os saltos são instantâneos; as cores continuam indicando hover, foco e arraste.

## Props

### `Splitter`

Painéis redimensionáveis (lista/detalhe, editor/prévia, inspetores, consoles).
Implementa o padrão Window Splitter do WAI-ARIA: cada `SplitterHandle` é um
`separator` focável que se move com as setas, Home/End e recolhe com Enter.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | `SplitterPanel` e `SplitterHandle` como filhos diretos, intercalados. |
| `defaultSizes` | `number[]` | — | Tamanhos iniciais em % (não controlado). Também é o destino do clique duplo no separador. Padrão: divisão igual. |
| `label` | `string` | — | Nome acessível do grupo de painéis (`role="group"`). |
| `onResizeEnd` | `((sizes: number[]) => void)` | — | Chamado quando um redimensionamento termina (soltar o ponteiro, soltar a tecla, clique duplo). |
| `onSizesChange` | `((sizes: number[]) => void)` | — | Chamado a cada mudança de tamanho (inclusive durante o arraste). |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | `horizontal` (padrão): painéis lado a lado, separadores verticais. `vertical`: painéis empilhados, separadores horizontais. |
| `shiftStep` | `number` | `10` | Passo de Shift + seta, em %. Padrão: 10. |
| `sizes` | `number[]` | — | Tamanhos dos painéis em % (somam 100), na ordem do DOM (controlado). |
| `stackBelow` | `"sm" \| "md"` | — | Abaixo deste ponto de quebra (`sm` 640px, `md` 768px) os painéis empilham na vertical, sem separadores. O conteúdo precisa fazer sentido empilhado. |
| `step` | `number` | `2` | Passo das setas, em %. Padrão: 2. |
| `storageKey` | `string` | — | Guarda os tamanhos no `localStorage` (chave `or-splitter:<storageKey>`) ao fim de cada redimensionamento e os restaura ao montar. Falhas de armazenamento (modo privado, cota cheia) são ignoradas. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `SplitterHandle`

Separador entre dois `SplitterPanel` (`role="separator"`, focável). Arraste
com mouse, caneta ou toque; setas, Shift + setas, Home/End e Enter pelo teclado;
clique duplo volta aos tamanhos padrão.

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `SplitterPanel`

Painel do `Splitter`. Os limites (`minSize`, `maxSize`) e o recolhimento são
lidos pelo Splitter — o painel precisa ser filho direto dele.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `collapsedSize` | `number` | — | Tamanho em % quando recolhido. Padrão: 0 (o conteúdo sai da tela e do foco). |
| `collapsible` | `boolean` | — | Pode ser recolhido (Enter no separador ou arraste abaixo do mínimo). |
| `defaultCollapsed` | `boolean` | — | Começa recolhido (requer `collapsible`). |
| `id` | `string` | — | `id` do painel (alvo do `aria-controls` do separador). Padrão: gerado. |
| `label` | `string` | — | Nome do painel, usado no nome acessível do separador ("Redimensionar {label}"). |
| `maxSize` | `number` | — | Tamanho máximo em %. Padrão: 100. |
| `minSize` | `number` | — | Tamanho mínimo em %. Padrão: 0. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão **Window Splitter** do WAI-ARIA. Cada `SplitterHandle` é um `role="separator"` focável (`tabIndex=0`) com `aria-orientation` perpendicular ao layout (painéis lado a lado → separador vertical), `aria-valuenow` / `aria-valuemin` / `aria-valuemax` com o tamanho em % do painel primário (o anterior), `aria-controls` apontando para ele e um nome como "Redimensionar Lista de pedidos". Quando um painel está recolhido, `aria-valuetext` anuncia "Painel Filtros recolhido".

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o separador (cada um é uma parada de Tab). |
| `← / →` | Painéis lado a lado: move o separador 2% (step). Em páginas da direita para a esquerda, a seta segue a direção visual. |
| `↑ / ↓` | Painéis empilhados (vertical): move o separador 2%. |
| `Shift` + `← → ↑ ↓` | Move 10% (shiftStep). |
| `Home` | Leva o painel primário ao menor tamanho permitido pelos dois vizinhos. |
| `End` | Leva o painel primário ao maior tamanho permitido pelos dois vizinhos. |
| `Enter` | Recolhe o painel recolhível (o primário; se ele não for, o secundário) ou o restaura ao tamanho anterior. |

Com o ponteiro: arraste com mouse, caneta ou toque (Pointer Events com captura — o arraste continua fora do separador). Clique duplo volta aos tamanhos padrão. No toque, o separador usa touch-action: none para não rolar a página.

- **1.3.2** — Empilhado (stackBelow), os painéis seguem a ordem do código — a mesma da leitura.
- **1.4.10** — Sem rolagem horizontal a 320px CSS: os painéis empilham ou rolam por dentro.
- **1.4.11** — A linha e a marca vão para a cor de acento no hover, foco e arraste; em alto contraste, usam as cores do sistema.
- **2.1.1** — Tudo que o arraste faz tem equivalente no teclado: setas, Shift, Home/End e Enter.
- **2.4.7** — Foco visível: contorno de 2px e linha laranja.
- **2.5.7** — Movimentos de arraste têm alternativa de ponteiro único: clique duplo para o padrão e o teclado para o resto.
- **2.5.8** — Área de toque de 24px em volta da linha de 1px (--or-splitter-hit-area).
- **4.1.2** — Papel, nome, valor e orientação expostos no separador; recolhido em 0%, o painel sai da árvore de acessibilidade.
