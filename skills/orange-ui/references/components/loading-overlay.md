# LoadingOverlay

Cobre uma área enquanto ela é atualizada, bloqueando a interação e anunciando o carregamento.

- Categoria: Feedback · Status: estável
- Importação: `import { LoadingOverlay } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/loading-overlay (em inglês: https://orange.llypedev.com.br/en/components/loading-overlay)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-loadingoverlay--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/LoadingOverlay

## Boas práticas

- Use para atualizar algo que já está na tela (filtros aplicados, dados recarregados, formulário salvando) — o conteúdo antigo continua visível por baixo, como referência.
- Cubra só a área afetada, não a página inteira. O resto da interface continua utilizável.
- No primeiro carregamento, quando ainda não há conteúdo, prefira Skeleton.
- Escreva a mensagem com o que está acontecendo ("Atualizando relatório…"). O padrão, `t('loading')`, é genérico.

## Exemplos

### Tabela

Clique em Atualizar dados: a tabela fica inert e aria-busy por 2 s e a mensagem é anunciada.

```tsx
import { Button, LoadingOverlay } from '@orangesys/ui'
import { useState } from 'react'

const regions = [
  ['Sudeste', 'R$ 1.284.300', '+12%'],
  ['Sul', 'R$ 642.900', '+4%'],
  ['Nordeste', 'R$ 518.200', '+18%'],
  ['Centro-Oeste', 'R$ 301.750', '−3%'],
]

const cell = {
  padding: '10px 16px',
  borderTop: '1px solid var(--or-color-border)',
  textAlign: 'left',
} as const

export default function Table() {
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div style={{ width: '100%', maxWidth: 560, border: '1px solid var(--or-color-border)' }}>
      <LoadingOverlay open={loading} message="Atualizando relatório…">
        {/* Em telas muito estreitas a tabela rola na horizontal em vez de alargar a página. */}
        <div
          role="region"
          aria-label="Vendas por região"
          tabIndex={0}
          style={{ overflowX: 'auto' }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <caption style={{ ...cell, borderTop: 0, fontWeight: 700 }}>
              Vendas por região — outubro
            </caption>
            <thead>
              <tr>
                <th scope="col" style={cell}>
                  Região
                </th>
                <th scope="col" style={cell}>
                  Receita
                </th>
                <th scope="col" style={cell}>
                  Variação
                </th>
              </tr>
            </thead>
            <tbody>
              {regions.map(([region, revenue, change]) => (
                <tr key={region}>
                  <td style={cell}>{region}</td>
                  <td style={cell}>{revenue}</td>
                  <td style={cell}>{change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--or-color-border)' }}>
          <Button size="sm" variant="outline" onClick={refresh}>
            Atualizar dados
          </Button>
        </div>
      </LoadingOverlay>
    </div>
  )
}
```

### Formulário salvando

O foco estava no botão: ele é estacionado no painel durante o carregamento e devolvido ao botão no fim.

```tsx
import { Button, LoadingOverlay } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

const field = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  border: '1px solid var(--or-color-border-control)',
  background: 'var(--or-color-surface)',
} as const

export default function Form() {
  const [saving, setSaving] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setTimeout(() => setSaving(false), 2000)
  }

  return (
    <LoadingOverlay
      open={saving}
      message="Salvando endereço…"
      style={{ width: '100%', maxWidth: 400 }}
    >
      <form
        onSubmit={submit}
        style={{
          display: 'grid',
          gap: 12,
          padding: 20,
          border: '1px solid var(--or-color-border)',
        }}
      >
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
          CEP
          <input style={field} defaultValue="01310-100" inputMode="numeric" />
        </label>
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
          Número
          <input style={field} defaultValue="1578" />
        </label>
        <div>
          <Button type="submit">Salvar endereço</Button>
        </div>
      </form>
    </LoadingOverlay>
  )
}
```

### Cartões

Funciona em qualquer contêiner. Em áreas pequenas, use spinnerSize="sm".

```tsx
import { LoadingOverlay, Stack } from '@orangesys/ui'

export default function Card() {
  return (
    <Stack gap={4} direction="horizontal" wrap>
      <LoadingOverlay open spinnerSize="sm" style={{ width: 260, maxWidth: '100%' }}>
        <article style={{ padding: 20, border: '1px solid var(--or-color-border)' }}>
          <p className="or-eyebrow" style={{ margin: 0 }}>
            Saldo disponível
          </p>
          <p
            style={{
              margin: '8px 0 0',
              fontFamily: 'var(--or-font-display)',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            R$ 48.210,90
          </p>
          <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-subtle)', fontSize: 13 }}>
            Atualizado às 14h32
          </p>
        </article>
      </LoadingOverlay>
      <LoadingOverlay open message="Recalculando frete…" style={{ width: 260, maxWidth: '100%' }}>
        <article style={{ padding: 20, border: '1px solid var(--or-color-border)' }}>
          <p className="or-eyebrow" style={{ margin: 0 }}>
            Resumo do pedido
          </p>
          <p style={{ margin: '8px 0 0' }}>3 itens · R$ 389,70</p>
          <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-subtle)', fontSize: 13 }}>
            Frete: calculando
          </p>
        </article>
      </LoadingOverlay>
    </Stack>
  )
}
```

## Movimento

- **Mostrar** — O fundo aparece com fade em `--or-duration-medium` e o painel sobe 4px (`--or-distance-sm`), `--or-ease-out`.
- **Esconder** — Saída mais curta: fade em `--or-duration-fast`, `--or-ease-in-out`. Spinner e mensagem ficam no painel até o fim (`usePresence`) — nada encolhe no meio do fade. O conteúdo é liberado logo no início.
- **Spinner** — Gira em loop (veja Spinner).
- **Movimento reduzido** — Aparece e some na hora; o spinner pulsa em vez de girar.

## Props

### `LoadingOverlay`

Cobre uma área (tabela, cartão, painel) enquanto ela é atualizada. O
conteúdo coberto fica `inert` e `aria-busy`; a mensagem é anunciada numa
região `role="status"` que fica fora dele.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Conteúdo que será coberto. |
| `message` | `ReactNode` | — | Mensagem exibida e anunciada. Padrão: `t('loading')`. |
| `open` | `boolean` | `false` | Mostra a sobreposição e bloqueia o conteúdo coberto. |
| `spinnerSize` | `"sm" \| "md" \| "lg"` | `md` | Tamanho do spinner. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

## Acessibilidade

Enquanto visível, o conteúdo coberto recebe `inert` (sai da ordem de foco e da árvore de acessibilidade) e `aria-busy="true"`. A mensagem fica numa região `role="status"` sempre montada e **fora** do conteúdo ocupado — assim ela é anunciada de forma confiável. Se o foco estava dentro da área, ele vai para o painel e volta ao mesmo elemento quando o carregamento termina.

| Teclas | Ação |
| --- | --- |
| `Tab` | Pula o conteúdo coberto enquanto ele está inert. |

- **2.1.1** — Conteúdo bloqueado não recebe foco nem cliques.
- **2.4.3** — O foco é preservado e devolvido ao terminar.
- **2.4.7** — O painel com foco mostra o contorno de foco.
- **4.1.3** — Mensagem anunciada por `role="status"`.
