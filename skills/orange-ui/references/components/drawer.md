# Drawer

Painel modal que desliza de uma borda da tela para filtros, formulários e detalhes sem sair do contexto.

- Categoria: Sobreposições · Status: estável
- Importação: `import { Drawer } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/drawer (em inglês: https://orange.llypedev.com.br/en/components/drawer)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-drawer--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Drawer

## Boas práticas

- Use o Drawer para tarefas de apoio que não exigem sair da página: filtros, edição rápida, detalhes de um item da lista, configurações de uma seção.
- Para uma decisão curta e urgente, prefira o Modal; para fluxos longos com várias etapas, uma página própria.
- Coloque as ações em `footer`: ele fica fixo enquanto o conteúdo rola, e a ação principal fica à direita.
- Mantenha a direção consistente no produto: detalhes e edição pela direita, navegação pela esquerda, folhas de ação por baixo no celular.

## Exemplos

### Filtros

Painel à direita (padrão) com rodapé fixo. `footer` e `children` aceitam funções que recebem `close`.

```tsx
import { Button, Drawer, Field, Stack } from '@orangesys/ui'
import { useState } from 'react'

const statusOpcoes = ['Pendente', 'Pago', 'Enviado', 'Cancelado']

export default function Filters() {
  const [selecionados, setSelecionados] = useState<string[]>(['Pendente'])
  const [aplicados, setAplicados] = useState<string[]>(['Pendente'])

  const alternar = (status: string) =>
    setSelecionados((atual) =>
      atual.includes(status) ? atual.filter((s) => s !== status) : [...atual, status],
    )

  return (
    <Stack gap={4} direction="horizontal" align="center" wrap>
      <Drawer
        title="Filtrar pedidos"
        description="Os filtros valem para a lista e para a exportação."
        onOpenChange={(aberto) => aberto && setSelecionados(aplicados)}
        trigger={<Button variant="outline">Filtros ({aplicados.length})</Button>}
        footer={({ close }) => (
          <>
            <Button variant="ghost" onClick={() => setSelecionados([])}>
              Limpar
            </Button>
            <Button
              onClick={() => {
                setAplicados(selecionados)
                close()
              }}
            >
              Aplicar filtros
            </Button>
          </>
        )}
      >
        <Stack gap={6}>
          <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            <legend style={{ fontWeight: 600, marginBottom: 8 }}>Status</legend>
            {statusOpcoes.map((status) => (
              <label key={status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  style={{ accentColor: 'var(--or-color-accent)' }}
                  checked={selecionados.includes(status)}
                  onChange={() => alternar(status)}
                />
                {status}
              </label>
            ))}
          </fieldset>
          <Field label="Período" controlId="filtro-periodo">
            <select id="filtro-periodo" className="or-control" defaultValue="30">
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
            </select>
          </Field>
        </Stack>
      </Drawer>
      <span>
        {aplicados.length ? `Mostrando: ${aplicados.join(', ')}` : 'Mostrando todos os pedidos'}
      </span>
    </Stack>
  )
}
```

### Posições

left, right e bottom — cada uma com sua animação de deslizar.

```tsx
import { Button, Drawer, type DrawerPlacement } from '@orangesys/ui'

const posicoes: { placement: DrawerPlacement; label: string; title: string }[] = [
  { placement: 'left', label: 'Esquerda', title: 'Painel à esquerda' },
  { placement: 'right', label: 'Direita', title: 'Painel à direita' },
  { placement: 'bottom', label: 'Inferior', title: 'Painel inferior' },
]

export default function Placements() {
  return (
    <>
      {posicoes.map(({ placement, label, title }) => (
        <Drawer
          key={placement}
          placement={placement}
          title={title}
          trigger={<Button variant="outline">{label}</Button>}
        >
          <p style={{ margin: 0 }}>
            Laterais funcionam bem para navegação (esquerda) e detalhes ou edição (direita). O
            inferior é natural em telas pequenas, como uma folha que sobe.
          </p>
        </Drawer>
      ))}
    </>
  )
}
```

### Tamanhos

Nas laterais, size define a largura; na posição inferior, a altura máxima (40%, 60%, 85% ou 100%).

```tsx
import { Button, Drawer, type DrawerSize } from '@orangesys/ui'

const tamanhos: { size: DrawerSize; label: string }[] = [
  { size: 'sm', label: 'sm · 360px' },
  { size: 'md', label: 'md · 480px' },
  { size: 'lg', label: 'lg · 640px' },
  { size: 'full', label: 'full · 100%' },
]

export default function Sizes() {
  return (
    <>
      {tamanhos.map(({ size, label }) => (
        <Drawer
          key={size}
          size={size}
          title={`Tamanho ${label}`}
          trigger={<Button variant="outline">{label}</Button>}
        >
          <p style={{ margin: 0 }}>
            Em telas estreitas, todos os tamanhos ocupam a largura disponível.
          </p>
        </Drawer>
      ))}
    </>
  )
}
```

### Detalhes de um item

Leitura rápida de um registro da lista com uma ação contextual no rodapé.

```tsx
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
```

## Movimento

- **Abrir** — Desliza a partir da borda escolhida (or-slide-in-right / -left / -up). 250ms, --or-ease-out. Fundo em fade junto.
- **Fechar** — Volta para a mesma borda (or-slide-out-right / -left / -down). 160ms, --or-ease-in-out. Conteúdo inerte durante a saída.
- **Botões** — Afundam 1px ao pressionar. 90ms.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `Drawer`

Painel modal que desliza de uma borda da tela. Bom para formulários,
filtros e detalhes que não exigem sair do contexto atual.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` (obrigatória) | `ReactNode` | — | Título visível; nomeia o painel via `aria-labelledby`. |
| `children` | `ReactNode \| ((props: DrawerRenderProps) => ReactNode)` | — | Conteúdo rolável do painel. Aceita uma função `({ close }) => …`. |
| `closeOnEscape` | `boolean` | `true` | Fecha com a tecla Escape. |
| `closeOnOverlayClick` | `boolean` | `true` | Fecha ao clicar no fundo escurecido. |
| `defaultOpen` | `boolean` | — | Aberto inicialmente (não controlado). |
| `description` | `ReactNode` | — | Texto de apoio sob o título (`aria-describedby`). |
| `finalFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco ao fechar. Padrão: o que estava focado antes. |
| `footer` | `ReactNode \| ((props: DrawerRenderProps) => ReactNode)` | — | Rodapé fixo com ações. Aceita uma função `({ close }) => …`. |
| `hideCloseButton` | `boolean` | `false` | Esconde o botão de fechar do cabeçalho. Garanta outra forma de fechar. |
| `initialFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco ao abrir. Padrão: primeiro focável do conteúdo. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o painel pede para abrir ou fechar. |
| `open` | `boolean` | — | Aberto (controlado). Use com `onOpenChange`. |
| `placement` | `"bottom" \| "left" \| "right"` | `right` | Borda de onde o painel desliza. |
| `size` | `"sm" \| "md" \| "lg" \| "full"` | `md` | Largura (left/right): `sm` 360px, `md` 480px, `lg` 640px, `full` 100%. Altura máxima (bottom): `sm` 40%, `md` 60%, `lg` 85%, `full` 100%. |
| `trigger` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Elemento que abre o painel (modo não controlado). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`DrawerPlacement`:

```ts
export type DrawerPlacement = 'left' | 'right' | 'bottom'
```

`DrawerSize`:

```ts
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full'
```

## Acessibilidade

O Drawer é um diálogo modal (padrão *Dialog (Modal)* do APG): `role="dialog"`, `aria-modal="true"`, nome pelo título e o mesmo comportamento do Modal — foco preso, scroll da página bloqueado, Escape fecha e o foco volta para quem abriu. A animação de deslizar é desligada para quem prefere movimento reduzido.

| Teclas | Ação |
| --- | --- |
| `Tab` | Próximo elemento dentro do painel; do último volta ao primeiro. |
| `Shift` + `Tab` | Elemento anterior dentro do painel. |
| `Esc` | Fecha o painel e devolve o foco. |

- **1.3.1** — Título e descrição ligados ao painel por ARIA.
- **2.1.2** — Escape e o botão Fechar sempre saem do painel.
- **2.3.3** — Animação de deslizar desativada com prefers-reduced-motion.
- **2.4.3** — Foco entra no painel ao abrir e volta ao gatilho ao fechar.
