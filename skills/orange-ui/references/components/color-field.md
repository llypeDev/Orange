# ColorField

Seletor de cor nativo sincronizado com um campo hexadecimal validado e paleta sugerida opcional.

- Categoria: Formulários · Status: estável
- Importação: `import { ColorField } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/color-field (em inglês: https://orange.llypedev.com.br/en/components/color-field)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-colorfield--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ColorField

## Boas práticas

- Dê nomes às cores da paleta ( `{ value: '#f58549', label: 'Laranja' }`): leitores de tela anunciam o nome, não o código.
- Ofereça uma paleta quando a marca tem cores definidas; deixe o hexadecimal para quem precisa de precisão.
- Mostre o resultado ao lado (prévia do botão, do e-mail) e valide o contraste quando a cor for usada em texto.
- O campo aceita `#rgb`, `rrggbb` e maiúsculas; o valor emitido é sempre `#rrggbb` em minúsculas.

## Exemplos

### Básico

A amostra quadrada abre o seletor nativo; o campo de texto aceita o código hexadecimal.

```tsx
import { ColorField } from '@orangesys/ui'

export default function Basic() {
  return (
    <ColorField
      label="Cor primária da loja"
      description="Usada em botões e links da sua vitrine."
      defaultValue="#f58549"
    />
  )
}
```

### Com paleta

As cores sugeridas formam um radiogroup: setas mudam a seleção.

```tsx
import { ColorField } from '@orangesys/ui'

const etiquetas = [
  { value: '#f58549', label: 'Laranja' },
  { value: '#e8c15a', label: 'Âmbar' },
  { value: '#7fb236', label: 'Verde' },
  { value: '#4a66d4', label: 'Azul' },
  { value: '#ef6a5a', label: 'Vermelho' },
  { value: '#75757f', label: 'Grafite' },
]

export default function Swatches() {
  return (
    <ColorField
      label="Cor da etiqueta"
      description="Escolha uma cor sugerida ou digite um hexadecimal."
      swatches={etiquetas}
      defaultValue="#7fb236"
    />
  )
}
```

### Com prévia (controlado)

```tsx
import { ColorField, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Preview() {
  const [cor, setCor] = useState('#4a66d4')

  return (
    <Stack gap={8} direction="horizontal" align="start" wrap>
      <ColorField
        label="Cor do cabeçalho do e-mail"
        value={cor}
        onChange={setCor}
        swatches={['#0f0f12', '#4a66d4', '#f58549', '#7fb236']}
      />
      <div
        style={{ width: 260, border: '1px solid var(--or-color-border-strong)' }}
        aria-hidden="true"
      >
        <div style={{ height: 56, background: cor || 'transparent' }} />
        <div style={{ padding: 16, display: 'grid', gap: 8 }}>
          <div style={{ height: 10, width: '70%', background: 'var(--or-color-surface-active)' }} />
          <div style={{ height: 10, width: '90%', background: 'var(--or-color-surface-hover)' }} />
          <div style={{ height: 10, width: '55%', background: 'var(--or-color-surface-hover)' }} />
        </div>
      </div>
    </Stack>
  )
}
```

### Estados

Sem cor (amostra riscada), com erro e desabilitado. Saia do campo com um código inválido para ver a validação interna.

```tsx
import { ColorField, Stack } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={6} direction="horizontal" wrap>
      <ColorField
        label="Cor de destaque"
        optional
        defaultValue=""
        description="Sem cor definida."
      />
      <ColorField
        label="Cor do texto"
        defaultValue="#d4cdb5"
        error="Contraste insuficiente com o fundo claro."
      />
      <ColorField label="Cor do tema" defaultValue="#0f0f12" disabled size="sm" />
    </Stack>
  )
}
```

## Movimento

- **Trocar a cor** — A amostra principal faz crossfade entre as cores (camada sobre o seletor nativo) · medium (250ms), ease-out.
- **Hover e foco na paleta** — A amostra sobe 4px com sombra deslocada na própria cor · medium, ease-out.
- **Pressionar** — Amostras afundam 1px (translateY(1px) scale(0.985)) · press (90ms).
- **Escolher na paleta** — A amostra faz pop (0,85 → 1) e o check entra em escala · medium, ease-bounce.
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `ColorField`

Campo de cor: seletor nativo (`<input type="color">`) sincronizado com um
campo hexadecimal validado e, opcionalmente, uma paleta de cores sugeridas.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `string` | — | Cor inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro. Substitui a validação interna de formato. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `onChange` | `((value: string) => void)` | — | Chamado com a cor normalizada (`#rrggbb`, minúsculas) sempre que ela for válida. |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. |
| `swatches` | `(string \| ColorSwatch)[]` | — | Cores sugeridas, exibidas como grupo de opções (radiogroup). |
| `value` | `string` | — | Cor no formato `#rrggbb` (controlado). `''` = sem cor. |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ColorFieldSize`:

```ts
export type ColorFieldSize = 'sm' | 'md' | 'lg'
```

`ColorSwatch`:

```ts
export interface ColorSwatch {
  /** Cor em hexadecimal (`#rrggbb` ou `#rgb`). */
  value: string
  /** Nome acessível da cor ("Laranja Orange"). Padrão: o próprio hexadecimal. */
  label?: string
}
```

## Acessibilidade

O campo hexadecimal é o controle principal, ligado ao rótulo, à descrição e ao erro. O `<input type="color">` recebe o nome "rótulo + Seletor de cor". A paleta é um `role="radiogroup"` com um único ponto de tabulação; cada cor é um botão `role="radio"` com `aria-checked` e o nome da cor.

| Teclas | Ação |
| --- | --- |
| `Tab` | Seletor de cor → campo hexadecimal → paleta. |
| `Enter` | No seletor: abre o seletor de cor do sistema. |
| `←` + `→` | Na paleta: cor anterior / próxima (seleciona). |
| `↑` + `↓` | Na paleta: mesmo que ← / →. |
| `Home` + `End` | Na paleta: primeira / última cor. |
| `Space` | Na paleta: seleciona a cor focada. |

- **1.4.1** — Cores da paleta têm nome em texto, não só a amostra visual.
- **1.4.11** — Amostras com borda de 1px e seleção indicada por contorno e ícone.
- **3.3.1** — Código inválido gera mensagem de erro com o formato esperado.
- **4.1.2** — Estado das cores exposto com `aria-checked`.
