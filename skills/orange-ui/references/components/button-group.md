# ButtonGroup

Agrupa botões relacionados, lado a lado ou colados, e repassa tamanho e variante a todos eles.

- Categoria: Ações · Status: estável
- Importação: `import { ButtonGroup } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/button-group (em inglês: https://orange.llypedev.com.br/en/components/button-group)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-buttongroup--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ButtonGroup

## Boas práticas

- Agrupe apenas ações relacionadas ao mesmo objeto ou tarefa — exportar, compartilhar e arquivar um relatório.
- Dê um nome ao grupo com `aria-label` (ex.: "Ações do relatório"). Leitores de tela anunciam o nome ao entrar no grupo.
- Use **attached** quando os botões formam um único controle (zoom, anterior/próximo). Para ações independentes, mantenha o espaçamento padrão.
- ButtonGroup é para *ações*. Para escolher um estado, use **ToggleButtonGroup** ou **SegmentedControl**; para muitas ações com navegação por setas, use **Toolbar**.

- Faça: Ações irmãs, com o mesmo peso visual, coladas num único controle.
- Evite: Misturar ações sem relação e uma ação destrutiva colada às demais — fácil de clicar por engano.

## Exemplos

### Grupo básico

A variante definida no grupo vale para todos os botões filhos.

```tsx
import { Button, ButtonGroup, Icon } from '@orangesys/ui'

export default function Basic() {
  return (
    <ButtonGroup aria-label="Ações do relatório" variant="outline">
      <Button startIcon={<Icon name="download" />}>Exportar</Button>
      <Button startIcon={<Icon name="link" />}>Compartilhar</Button>
      <Button startIcon={<Icon name="folder" />}>Arquivar</Button>
    </ButtonGroup>
  )
}
```

### Colado (attached)

Sem espaço entre os botões e com bordas internas compartilhadas. Em variantes preenchidas, a borda interna vira um divisor sutil.

```tsx
import { Button, ButtonGroup, Icon, IconButton } from '@orangesys/ui'
import { useState } from 'react'

export default function Attached() {
  const [zoom, setZoom] = useState(100)

  return (
    <>
      <ButtonGroup aria-label="Zoom" attached variant="outline">
        <IconButton
          icon="minus"
          label="Diminuir zoom"
          disabled={zoom <= 50}
          onClick={() => setZoom((z) => z - 25)}
        />
        <Button onClick={() => setZoom(100)} aria-label={`Zoom em ${zoom}%. Restaurar para 100%`}>
          {zoom}%
        </Button>
        <IconButton
          icon="plus"
          label="Aumentar zoom"
          disabled={zoom >= 200}
          onClick={() => setZoom((z) => z + 25)}
        />
      </ButtonGroup>

      <ButtonGroup aria-label="Navegar entre pedidos" attached variant="outline">
        <Button startIcon={<Icon name="chevron-left" />}>Anterior</Button>
        <Button endIcon={<Icon name="chevron-right" />}>Próximo</Button>
      </ButtonGroup>

      <ButtonGroup aria-label="Período do gráfico" attached variant="secondary" size="sm">
        <Button>24 h</Button>
        <Button>7 dias</Button>
        <Button>30 dias</Button>
      </ButtonGroup>
    </>
  )
}
```

### Tamanho, variante e disabled do grupo

`size`, `variant` e `disabled` são repassados aos filhos que não os definem. IconButton, ToggleButton, CopyButton e SplitButton leem o grupo em qualquer nível; `Button` recebe os valores quando é filho direto.

```tsx
import { Button, ButtonGroup } from '@orangesys/ui'

export default function GroupProps() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      {/* Todos os botões herdam size e variant do grupo… */}
      <ButtonGroup aria-label="Rodapé do formulário" size="sm" variant="outline">
        <Button>Cancelar</Button>
        <Button>Salvar rascunho</Button>
        {/* …exceto quando definem os próprios. */}
        <Button variant="primary">Publicar artigo</Button>
      </ButtonGroup>

      <ButtonGroup aria-label="Ações em lote" size="lg" variant="ghost" disabled>
        <Button>Marcar como lidas</Button>
        <Button>Mover</Button>
        <Button>Excluir</Button>
      </ButtonGroup>
    </div>
  )
}
```

### Vertical

Os botões ocupam a mesma largura e os rótulos alinham à esquerda.

```tsx
import { Button, ButtonGroup, Icon } from '@orangesys/ui'

export default function Vertical() {
  return (
    <div style={{ width: 240 }}>
      <ButtonGroup
        aria-label="Ações do arquivo"
        orientation="vertical"
        attached
        variant="outline"
        style={{ width: '100%' }}
      >
        <Button startIcon={<Icon name="edit" />}>Renomear</Button>
        <Button startIcon={<Icon name="copy" />}>Duplicar</Button>
        <Button startIcon={<Icon name="folder" />}>Mover para…</Button>
        <Button startIcon={<Icon name="trash" />}>Excluir</Button>
      </ButtonGroup>
    </div>
  )
}
```

## Movimento

- **Pressionar** — Afunda 1px e reduz para 98,5% em `--or-duration-press` (90ms); volta em `fast` com `--or-ease-out`.
- **Pressionar colado** — A moldura fica parada — a borda compartilhada não pisca — e só o rótulo e o ícone afundam 1px (90ms).
- **Hover e foco** — Fundo, borda e cor em `--or-duration-fast` (160ms) com `--or-ease-out`. Hover e foco visível têm a mesma resposta.
- **Camadas** — Em grupos colados, o item em hover sobe uma camada e o item focado, duas: a borda inteira e o contorno de foco ficam sempre visíveis.
- **Seta final** — Desliza 4px no hover e no foco (`medium`, `ease-out`), herdado do Button — também quando colado.
- **Movimento reduzido** — Com `prefers-reduced-motion`, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.

## Props

### `ButtonGroup`

Agrupa botões relacionados (`role="group"`). Informe `aria-label` para que
leitores de tela anunciem o propósito do grupo. `size`, `variant` e
`disabled` são repassados aos botões filhos que não os definem.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `attached` | `boolean` | `false` | Cola os botões: sem espaço entre eles e com bordas internas compartilhadas. |
| `disabled` | `boolean` | — | Desabilita todos os botões do grupo. |
| `orientation` | `"horizontal" \| "vertical"` | — | Direção do grupo. Padrão: `horizontal` (ou a da Toolbar que o contém). |
| `size` | `"sm" \| "md" \| "lg"` | — | Tamanho aplicado a todos os botões que não definem o próprio `size`. |
| `variant` | `"outline" \| "danger" \| "primary" \| "secondary" \| "ghost"` | — | Variante aplicada a todos os botões que não definem a própria `variant`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ButtonGroupOrientation`:

```ts
export type ButtonGroupOrientation = 'horizontal' | 'vertical'
```

## Acessibilidade

Renderiza um `<div role="group">` com o nome dado em `aria-label`. Cada botão continua sendo uma parada de Tab — o grupo não muda a navegação. Para uma única parada de Tab com setas, use **Toolbar**.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o próximo botão do grupo. |
| `Shift` + `Tab` | Move o foco para o botão anterior. |
| `Enter` | Ativa o botão focado. |
| `Space` | Ativa o botão focado. |

- **1.3.1** — A relação entre os botões é exposta com `role="group"` e um nome.
- **1.4.11** — Bordas e divisores dos grupos colados têm contraste suficiente com o fundo.
- **2.4.7** — O botão focado sobe acima dos vizinhos: o contorno de foco nunca fica escondido.
- **4.1.2** — Cada botão mantém o próprio nome, papel e estado.
