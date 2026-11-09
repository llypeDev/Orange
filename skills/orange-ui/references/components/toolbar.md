# Toolbar

Barra de ferramentas com uma única parada de Tab: as setas movem o foco entre os botões.

- Categoria: Ações · Status: estável
- Importação: `import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/toolbar (em inglês: https://orange.llypedev.com.br/en/components/toolbar)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-toolbar--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Toolbar

## Boas práticas

- Use para conjuntos de controles usados com frequência sobre um mesmo conteúdo — editor de texto, quadro, tabela.
- Dê um nome à barra com `aria-label` ("Formatação de texto"), principalmente quando houver mais de uma na página.
- Organize os itens em grupos com ToolbarGroup e ToolbarSeparator: histórico, estilo, alinhamento, inserir.
- Com três ou menos botões, prefira um ButtonGroup — a navegação por setas só compensa em barras maiores.

## Anatomia

- **Toolbar** — `role="toolbar"` com `aria-orientation`; controla o roving tabindex.
- **Itens** — Elementos com `data-roving-item`. IconButton, ToggleButton, CopyButton, SplitButton e os Buttons filhos diretos são marcados automaticamente.
- **ToolbarGroup** — Um `role="group"` opcional para itens relacionados. ToggleButtonGroup também funciona como grupo.
- **ToolbarSeparator** — Divisor `role="separator"`, não focável, com orientação oposta à da barra.

## Exemplos

### Editor de texto

Tab entra na barra uma única vez; use ←/→ para percorrer os botões e Espaço para alternar a formatação. A barra lembra o último item focado.

```tsx
import {
  Icon,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@orangesys/ui'
import { useState } from 'react'

type Align = 'left' | 'center' | 'right'

export default function Editor() {
  const [styles, setStyles] = useState<string[]>(['bold'])
  const [align, setAlign] = useState<Align>('left')

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <Toolbar aria-label="Formatação de texto" aria-controls="nota-reuniao" size="sm">
        <ToolbarGroup aria-label="Histórico">
          <IconButton icon="undo" label="Desfazer" />
          <IconButton icon="redo" label="Refazer" disabled />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToggleButtonGroup selectionMode="multiple" aria-label="Estilo" value={styles} onChange={setStyles}>
          <ToggleButton
            value="bold"
            iconOnly
            aria-label="Negrito"
            startIcon={<Icon name="bold" />}
          />
          <ToggleButton
            value="italic"
            iconOnly
            aria-label="Itálico"
            startIcon={<Icon name="italic" />}
          />
          <ToggleButton
            value="underline"
            iconOnly
            aria-label="Sublinhado"
            startIcon={<Icon name="underline" />}
          />
        </ToggleButtonGroup>
        <ToolbarSeparator />
        <ToggleButtonGroup
          selectionMode="single"
          aria-label="Alinhamento"
          value={align}
          onChange={(value) => value && setAlign(value as Align)}
        >
          <ToggleButton
            value="left"
            iconOnly
            aria-label="Alinhar à esquerda"
            startIcon={<Icon name="align-left" />}
          />
          <ToggleButton
            value="center"
            iconOnly
            aria-label="Centralizar"
            startIcon={<Icon name="align-center" />}
          />
          <ToggleButton
            value="right"
            iconOnly
            aria-label="Alinhar à direita"
            startIcon={<Icon name="align-right" />}
          />
        </ToggleButtonGroup>
        <ToolbarSeparator />
        <IconButton icon="link" label="Inserir link" />
        <IconButton icon="image" label="Inserir imagem" />
      </Toolbar>
      <p
        id="nota-reuniao"
        style={{
          margin: 0,
          padding: 16,
          border: '1px solid var(--or-color-border)',
          borderTop: 0,
          textAlign: align,
          fontWeight: styles.includes('bold') ? 700 : 400,
          fontStyle: styles.includes('italic') ? 'italic' : 'normal',
          textDecoration: styles.includes('underline') ? 'underline' : 'none',
        }}
      >
        Reunião de planejamento: revisar as metas do trimestre e definir os responsáveis por cada
        entrega.
      </p>
    </div>
  )
}
```

### Vertical

Com orientation="vertical", as setas ↑/↓ movem o foco.

```tsx
import {
  Icon,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  ToolbarSeparator,
} from '@orangesys/ui'

export default function Vertical() {
  return (
    <Toolbar aria-label="Ferramentas do quadro" orientation="vertical">
      <ToggleButtonGroup selectionMode="single" aria-label="Ferramenta ativa" defaultValue="select">
        <ToggleButton
          value="select"
          iconOnly
          aria-label="Selecionar"
          startIcon={<Icon name="arrow-up-right" />}
        />
        <ToggleButton value="text" iconOnly aria-label="Texto" startIcon={<Icon name="type" />} />
        <ToggleButton
          value="shape"
          iconOnly
          aria-label="Retângulo"
          startIcon={<Icon name="square" />}
        />
        <ToggleButton
          value="note"
          iconOnly
          aria-label="Nota adesiva"
          startIcon={<Icon name="file" />}
        />
      </ToggleButtonGroup>
      <ToolbarSeparator />
      <IconButton icon="image" label="Inserir imagem" />
      <IconButton icon="trash" label="Excluir seleção" />
    </Toolbar>
  )
}
```

### Ações com texto, sem moldura

Buttons, CopyButton e SplitButton convivem na mesma barra. `bordered={false}` remove a moldura.

```tsx
import { Button, CopyButton, Icon, SplitButton, Toolbar, ToolbarSeparator } from '@orangesys/ui'

export default function Actions() {
  return (
    <Toolbar aria-label="Ações da tabela de clientes" bordered={false}>
      {/* Buttons filhos diretos entram no roving tabindex e ficam ghost automaticamente. */}
      <Button startIcon={<Icon name="filter" />}>Filtrar</Button>
      <Button startIcon={<Icon name="arrows-up-down" />}>Ordenar</Button>
      <Button startIcon={<Icon name="layout" />}>Colunas</Button>
      <ToolbarSeparator />
      <CopyButton value="https://app.orange.dev/clientes?visao=ativos" copiedLabel="Link copiado">
        Copiar link da visão
      </CopyButton>
      <SplitButton
        variant="outline"
        startIcon={<Icon name="download" />}
        actions={[
          { label: 'Exportar como XLSX', icon: 'file', onSelect: () => {} },
          { label: 'Exportar como PDF', icon: 'file', onSelect: () => {} },
        ]}
      >
        Exportar CSV
      </SplitButton>
    </Toolbar>
  )
}
```

## Movimento

- **Mover o foco** — Com as setas, o contorno de foco vai direto para o próximo item, sem animação: foco precisa ser imediato.
- **Pressionar** — Afunda 1px e reduz para 98,5% em `--or-duration-press` (90ms); volta em `fast` com `--or-ease-out`.
- **Grupos colados** — Em ToolbarGroup attached, a moldura fica parada e só o conteúdo afunda, sem a borda compartilhada piscar.
- **Alternar formatação** — ToggleButtons da barra: fundo e borda em `fast`, barra laranja com `--or-ease-spring` (`medium`).
- **Hover e foco** — Fundo, borda e cor em `--or-duration-fast` (160ms) com `--or-ease-out`. Hover e foco visível têm a mesma resposta.
- **Movimento reduzido** — Com `prefers-reduced-motion`, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.

## Props

### `Toolbar`

Barra de ferramentas (`role="toolbar"`) com roving tabindex: a barra inteira
ocupa uma única parada de Tab e as setas movem o foco entre os itens.
Itens são os elementos com `data-roving-item` — IconButton, ToggleButton,
CopyButton, SplitButton e os `Button` filhos diretos são marcados
automaticamente.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `bordered` | `boolean` | `true` | Desenha a moldura (borda e fundo) da barra. |
| `loop` | `boolean` | `true` | Volta ao primeiro item depois do último (e vice-versa). |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Direção da barra. Define quais setas movem o foco (←/→ ou ↑/↓). |
| `size` | `"sm" \| "md" \| "lg"` | — | Tamanho repassado aos botões da barra. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `ToolbarGroup`

Agrupa itens relacionados dentro da Toolbar (`role="group"`). Use
`aria-label` quando o agrupamento tiver um nome ("Alinhamento").

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `attached` | `boolean` | — | Cola os botões: sem espaço entre eles e com bordas internas compartilhadas. |
| `disabled` | `boolean` | — | Desabilita todos os botões do grupo. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Direção do grupo. Padrão: `horizontal` (ou a da Toolbar que o contém). |
| `size` | `"sm" \| "md" \| "lg"` | — | Tamanho aplicado a todos os botões que não definem o próprio `size`. |
| `variant` | `"outline" \| "danger" \| "primary" \| "secondary" \| "ghost"` | — | Variante aplicada a todos os botões que não definem a própria `variant`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `ToolbarSeparator`

Divisor visual entre grupos de uma Toolbar (`role="separator"`, não focável).

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão *Toolbar* do WAI-ARIA com *roving tabindex*: só um item tem `tabindex="0"` e os demais `-1`. As setas não são capturadas quando o foco está num campo de texto dentro da barra. Itens desabilitados são pulados.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra na barra pelo último item focado (ou o primeiro) e sai na próxima tecla Tab. |
| `→` | Próximo item (barra horizontal). Do último, volta ao primeiro. |
| `←` | Item anterior (barra horizontal). |
| `↓` | Próximo item (barra vertical). |
| `↑` | Item anterior (barra vertical). |
| `Home` | Primeiro item. |
| `End` | Último item. |
| `Enter` | Ativa o item focado. |
| `Space` | Ativa ou alterna o item focado. |

- **1.3.1** — Barra, grupos e divisores expostos com toolbar, group e separator.
- **2.1.1** — Todos os itens são alcançáveis pelas setas; Home e End vão às pontas.
- **2.4.3** — Uma única parada de Tab mantém a ordem de foco previsível.
- **2.4.7** — Foco visível com contorno laranja de 2px em cada item.
- **4.1.2** — Nome em `aria-label`, orientação em `aria-orientation`.
