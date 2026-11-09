# Chip

Chips selecionáveis para filtros rápidos, com seleção única ou múltipla em um grupo rotulado.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Chip, ChipGroup } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/chip (em inglês: https://orange.llypedev.com.br/en/components/chip)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-chip--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Chip

## Boas práticas

- Use chips para filtros que o usuário liga e desliga e cujo efeito aparece na hora (resultados, gráficos).
- Para opções de formulário que só valem ao enviar, prefira Checkbox ou RadioGroup.
- Agrupe chips relacionados em um `ChipGroup` com `label` — ele vira o nome do `role="group"`.
- Mostre contagens (count) quando ajudarem a decidir, e desabilite opções sem resultados em vez de escondê-las.

## Exemplos

### Chip isolado

Fora de um grupo, cada chip tem seu próprio estado (selected / defaultSelected / onSelectedChange). Selecionado, o ícone dá lugar ao check.

```tsx
import { Chip, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function Standalone() {
  const [freeShipping, setFreeShipping] = useState(true)

  return (
    <>
      <Chip selected={freeShipping} onSelectedChange={setFreeShipping} icon={<Icon name="zap" />}>
        Frete grátis
      </Chip>
      <Chip>Somente em estoque</Chip>
      <Chip disabled>Retirar na loja</Chip>
    </>
  )
}
```

### Seleção múltipla com contagem

ChipGroup controlado com value (string[]) e onChange. count mostra quantos resultados cada filtro traz.

```tsx
import { Chip, ChipGroup } from '@orangesys/ui'
import { useState } from 'react'

const categories = [
  { value: 'eletronicos', label: 'Eletrônicos', count: 128 },
  { value: 'casa', label: 'Casa e cozinha', count: 86 },
  { value: 'moda', label: 'Moda', count: 240 },
  { value: 'livros', label: 'Livros', count: 57 },
  { value: 'esporte', label: 'Esporte', count: 0 },
]

export default function Multiple() {
  const [selected, setSelected] = useState<string[]>(['casa', 'livros'])

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ChipGroup label="Categorias" value={selected} onChange={setSelected}>
        {categories.map((category) => (
          <Chip key={category.value} value={category.value} count={category.count} disabled={category.count === 0}>
            {category.label}
          </Chip>
        ))}
      </ChipGroup>
      <p style={{ margin: 0, color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>
        Filtrando por: {selected.length ? selected.join(', ') : 'todas as categorias'}
      </p>
    </div>
  )
}
```

### Seleção única

selectionMode="single": selecionar um chip desmarca o anterior; clicar no selecionado o desmarca.

```tsx
import { Chip, ChipGroup } from '@orangesys/ui'

export default function Single() {
  return (
    <ChipGroup selectionMode="single" label="Período" defaultValue="30d" size="sm">
      <Chip value="hoje">Hoje</Chip>
      <Chip value="7d">7 dias</Chip>
      <Chip value="30d">30 dias</Chip>
      <Chip value="90d">90 dias</Chip>
      <Chip value="12m">12 meses</Chip>
    </ChipGroup>
  )
}
```

### Com ícones e rótulo oculto

hideLabel mantém o rótulo do grupo só para leitores de tela, quando o contexto visual já é claro.

```tsx
import { Chip, ChipGroup, Icon } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <ChipGroup label="Formas de pagamento" hideLabel defaultValue={['pix']}>
      <Chip value="pix" icon={<Icon name="zap" />}>
        Pix
      </Chip>
      <Chip value="cartao" icon={<Icon name="layers" />}>
        Cartão de crédito
      </Chip>
      <Chip value="boleto" icon={<Icon name="file" />}>
        Boleto
      </Chip>
    </ChipGroup>
  )
}
```

## Movimento

- **Selecionar** — O check entra com or-scale-in em --or-duration-medium (250ms), --or-ease-bounce (só depois de uma interação, não no carregamento).
- **Pressionar** — Afunda 1px e reduz para 98,5% em --or-duration-press (90ms).
- **Hover e seleção** — Borda, fundo e cor transicionam em --or-duration-fast (160ms).

## Props

### `Chip`

Botão de alternância para filtros (`aria-pressed`). Mostra um check
quando selecionado. Agrupe com `ChipGroup`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `count` | `number` | — | Contagem exibida após o rótulo (ex.: resultados do filtro). |
| `defaultSelected` | `boolean` | `false` | Selecionado inicialmente (não controlado, fora de um grupo). |
| `icon` | `ReactNode` | — | Ícone antes do rótulo. Quando selecionado, dá lugar ao check. |
| `onSelectedChange` | `((selected: boolean) => void)` | — | Chamado quando o chip é alternado (fora de um grupo). |
| `selected` | `boolean` | — | Selecionado (controlado, fora de um grupo). |
| `size` | `"sm" \| "md"` | — | Altura: `sm` 28px ou `md` 32px. |
| `value` | `string` | — | Valor do chip dentro de um `ChipGroup`. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`) do `<button>`, como `type`, `disabled`, `onClick`, `form` e `name`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### `ChipGroup`

Agrupa chips de filtro (`role="group"` rotulado) com seleção única ou múltipla.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `string \| string[] \| null` | — | — |
| `disabled` | `boolean` | — | Desabilita todos os chips. |
| `hideLabel` | `boolean` | — | Esconde o rótulo visualmente (continua acessível). |
| `label` | `ReactNode` | — | Rótulo do grupo (ex.: "Status"). |
| `onChange` | `((value: string[]) => void) \| ((value: string \| null) => void)` | — | — |
| `selectionMode` | `"single" \| "multiple"` | — | `multiple` (padrão): vários chips selecionados. `single`: no máximo um chip selecionado; clicar no selecionado o desmarca. |
| `size` | `"sm" \| "md"` | — | Tamanho aplicado a todos os chips. |
| `value` | `string \| string[] \| null` | — | — |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ChipSize`:

```ts
export type ChipSize = 'sm' | 'md'
```

## Acessibilidade

Cada chip é um `<button type="button">` com `aria-pressed` — o leitor de tela anuncia "Casa e cozinha (86), botão de alternância, pressionado". O grupo usa `role="group"` com `aria-labelledby` apontando para o rótulo. O check e os ícones são decorativos; a contagem entra no nome entre parênteses.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco entre os chips. |
| `Space` | Seleciona ou desmarca o chip focado. |
| `Enter` | Seleciona ou desmarca o chip focado. |

- **1.3.1** — Grupo rotulado relaciona os chips ao que filtram.
- **1.4.1** — Selecionado não depende só da cor: há um ícone de check.
- **2.5.8** — Alvos de pelo menos 28px de altura.
- **4.1.2** — Estado exposto com `aria-pressed`.
