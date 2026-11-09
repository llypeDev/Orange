# Divider

Linha de 1px que separa grupos de conteúdo, na horizontal ou na vertical, com rótulo opcional.

- Categoria: Layout · Status: estável
- Importação: `import { Divider } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/divider (em inglês: https://orange.llypedev.com.br/en/components/divider)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-divider--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Divider

## Boas práticas

- Use para separar grupos que mudam de assunto — seções de configurações, blocos de um menu, ações de naturezas diferentes.
- Prefira espaço em branco antes de recorrer a linhas. Divisores demais fragmentam a leitura.
- Marque como **decorative** quando a linha for só estética (ex.: um traço sob um título). Assim leitores de tela não anunciam um separador sem significado.
- Use o tom accent com moderação: o laranja é acento, não estrutura.

- Faça: Um divisor neutro entre seções distintas.
- Evite: Divisores laranja entre cada campo de um mesmo grupo.

## Exemplos

### Separando seções

```tsx
import { Divider } from '@orangesys/ui'

export default function Sections() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>Dados da conta</p>
      <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Nome, e-mail e foto do perfil.</p>
      <Divider spacing={6} />
      <p style={{ margin: 0, fontWeight: 600 }}>Notificações</p>
      <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Escolha o que chega por e-mail.</p>
      <Divider spacing={6} />
      <p style={{ margin: 0, fontWeight: 600 }}>Segurança</p>
      <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Senha e verificação em duas etapas.</p>
    </div>
  )
}
```

### Com rótulo

O rótulo vira o nome acessível do separador. Use textos curtos, como "ou" ou "Hoje".

```tsx
import { Button, Divider, Stack } from '@orangesys/ui'

export default function WithLabel() {
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <Button block>Entrar com e-mail</Button>
      <Divider label="ou continue com" spacing={2} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Button variant="outline">Google</Button>
        <Button variant="outline">Microsoft</Button>
      </div>
    </Stack>
  )
}
```

### Vertical

Em contêineres flex, o divisor vertical ocupa toda a altura disponível.

```tsx
import { Button, Divider, Icon } from '@orangesys/ui'

export default function Vertical() {
  return (
    <div role="group" aria-label="Ações do documento" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 8, minHeight: 40 }}>
      <Button variant="ghost" size="sm" startIcon={<Icon name="edit" />}>
        Editar
      </Button>
      <Button variant="ghost" size="sm" startIcon={<Icon name="copy" />}>
        Duplicar
      </Button>
      <Divider orientation="vertical" spacing={2} />
      <Button variant="ghost" size="sm" startIcon={<Icon name="download" />}>
        Exportar
      </Button>
      <Divider orientation="vertical" spacing={2} />
      <Button variant="ghost" size="sm" startIcon={<Icon name="trash" />}>
        Excluir
      </Button>
    </div>
  )
}
```

### Tons e espessura

subtle, default, strong e accent; thickness="thick" dobra a espessura para 2px.

```tsx
import { Divider } from '@orangesys/ui'

export default function Tones() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Divider tone="subtle" label="subtle" labelPosition="start" />
      <Divider tone="default" label="default" labelPosition="start" />
      <Divider tone="strong" label="strong" labelPosition="start" />
      <Divider tone="accent" label="accent" labelPosition="start" />
      <Divider tone="strong" thickness="thick" label="thick" labelPosition="start" />
    </div>
  )
}
```

### Decorativo

Um traço curto em laranja sob o título — oculto de leitores de tela.

```tsx
import { Divider } from '@orangesys/ui'

export default function Decorative() {
  return (
    <div style={{ maxWidth: 480 }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Relatório anual
      </p>
      <h3 style={{ margin: '8px 0 0', fontSize: 28 }}>Resultados de 2026</h3>
      <div style={{ width: 48 }}>
        <Divider decorative tone="accent" thickness="thick" spacing={4} />
      </div>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Crescemos 38% em receita recorrente e chegamos a 12 mil clientes ativos.
      </p>
    </div>
  )
}
```

## Props

### `Divider`

Separa visualmente grupos de conteúdo. Usa `<hr>` (ou `role="separator"`)
para que a separação também seja percebida por leitores de tela, a menos que
seja marcado como `decorative`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `decorative` | `boolean` | `false` | Divisor puramente visual: fica oculto para leitores de tela. Use quando a separação já é clara pela estrutura (títulos, listas, landmarks). |
| `label` | `ReactNode` | — | Rótulo curto exibido sobre a linha em caixa alta (ex.: "ou", "Hoje"). Só para divisores horizontais. |
| `labelPosition` | `"center" \| "start" \| "end"` | `center` | Posição do rótulo. Padrão: `center`. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Direção da linha. Na vertical, o divisor ocupa a altura do contêiner flex. |
| `spacing` | `0 \| 1 \| 2 \| 3 \| 4 \| 6 \| 8` | `4` | Margem ao redor da linha, na escala de espaço (`4` = 1rem). Padrão: `4`. |
| `thickness` | `"thin" \| "thick"` | `thin` | Espessura: `thin` (1px, padrão) ou `thick` (2px). |
| `tone` | `"accent" \| "default" \| "strong" \| "subtle"` | `default` | Intensidade da linha: `subtle`, `default`, `strong` ou `accent` (laranja). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`DividerOrientation`:

```ts
export type DividerOrientation = 'horizontal' | 'vertical'
```

`DividerSpacing`:

```ts
export type DividerSpacing = 0 | 1 | 2 | 3 | 4 | 6 | 8
```

`DividerTone`:

```ts
export type DividerTone = 'subtle' | 'default' | 'strong' | 'accent'
```

## Acessibilidade

Na horizontal, renderiza um `<hr>`, que já tem o papel `separator`. Na vertical, usa `role="separator"` com `aria-orientation="vertical"`. Com rótulo, o separador é nomeado pelo texto via `aria-labelledby`. Divisores não são focáveis e não exigem interação por teclado.

- **1.3.1** — A separação estrutural é exposta como separator; a decorativa fica oculta.
- **1.4.11** — A linha não é a única pista de agrupamento (títulos e espaço também separam). Quando ela precisar se destacar, o tom accent passa de 3:1 nos dois temas.
- **1.4.12** — O rótulo acompanha mudanças de espaçamento de texto sem cortar.
