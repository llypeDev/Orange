# Slider

Controle deslizante para escolher um valor ou um intervalo dentro de uma faixa contínua.

- Categoria: Formulários · Status: estável
- Importação: `import { Slider } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/slider (em inglês: https://orange.llypedev.com.br/en/components/slider)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-slider--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Slider

## Boas práticas

- Use quando o valor exato importa menos que a posição relativa (volume, brilho, faixa de preço). Para valores precisos, ofereça também um campo numérico.
- Mostre o valor atual (padrão) e formate-o com `formatValue` — o mesmo texto é anunciado por leitores de tela via `aria-valuetext`.
- Escolha um `step` que faça sentido: R$ 100 em uma faixa de preços, 5% em uma porcentagem. Passos muito finos tornam o teclado lento.
- Use marcas com rótulos para pontos de referência (limites de plano, valores comuns), não para todos os passos.

## Exemplos

### Básico

O valor formatado aparece ao lado do rótulo em um `<output>`.

```tsx
import { Slider } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Slider
        label="Volume das notificações"
        description="Afeta apenas os alertas sonoros deste dispositivo."
        defaultValue={60}
        formatValue={(v) => `${v}%`}
      />
    </div>
  )
}
```

### Intervalo

Com `range`, dois polegares definem mínimo e máximo; eles não se cruzam e respeitam `minDistance`. Clique no trilho para mover o polegar mais próximo.

```tsx
import { Slider, Stack } from '@orangesys/ui'
import { useState } from 'react'

const brl = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export default function Range() {
  const [faixa, setFaixa] = useState<[number, number]>([1500, 4500])

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 420 }}>
      <Slider
        range
        label="Faixa de preço"
        min={0}
        max={8000}
        step={100}
        minDistance={200}
        value={faixa}
        onChange={setFaixa}
        formatValue={brl}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Mostrando notebooks entre {brl(faixa[0])} e {brl(faixa[1])}.
      </p>
    </Stack>
  )
}
```

### Marcas

Marcas com rótulo (clicáveis) ou `marks` para uma marca por passo.

```tsx
import { Slider, Stack } from '@orangesys/ui'

const planos: Record<number, string> = {
  1: 'Individual',
  10: 'Equipe',
  50: 'Empresa',
  100: 'Corporativo',
}

export default function Marks() {
  return (
    <Stack gap={8} style={{ width: '100%', maxWidth: 420 }}>
      <Slider
        label="Pessoas na equipe"
        min={1}
        max={100}
        defaultValue={10}
        marks={[
          { value: 1, label: '1' },
          { value: 10, label: '10' },
          { value: 50, label: '50' },
          { value: 100, label: '100' },
        ]}
        formatValue={(v) => {
          const faixa =
            Object.keys(planos)
              .map(Number)
              .filter((n) => n <= v)
              .pop() ?? 1
          return `${v} ${v === 1 ? 'pessoa' : 'pessoas'} · plano ${planos[faixa]}`
        }}
      />
      <Slider
        label="Intensidade do filtro"
        min={0}
        max={100}
        step={10}
        defaultValue={40}
        marks
        formatValue={(v) => `${v}%`}
      />
    </Stack>
  )
}
```

### Tamanhos e desabilitado

```tsx
import { Slider, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
      <Slider size="sm" label="Brilho (sm)" defaultValue={30} />
      <Slider size="md" label="Brilho (md)" defaultValue={55} />
      <Slider size="lg" label="Brilho (lg)" defaultValue={80} />
      <Slider
        label="Qualidade do vídeo"
        description="Disponível no plano Pro."
        defaultValue={50}
        disabled
      />
    </Stack>
  )
}
```

## Props

### `Slider`

Controle deslizante baseado no `<input type="range">` nativo — teclado,
leitores de tela e toque funcionam como o navegador manda. No modo `range`,
dois polegares definem um intervalo.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `className` | `string` | — | Classe aplicada ao contêiner externo. |
| `defaultValue` | `number \| [number, number]` | — | — |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `formatValue` | `((value: number) => string)` | — | Formata o valor para a saída visível e para `aria-valuetext` (ex.: moeda, %). |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Marca o campo como inválido sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `marks` | `boolean \| (number \| SliderMark)[]` | — | Marcas no trilho. `true` = uma por passo; números = marcas sem rótulo; objetos `{ value, label }` = marcas com rótulo (clicáveis com o mouse). |
| `max` | `number` | — | Valor máximo. Padrão: 100. |
| `min` | `number` | — | Valor mínimo. Padrão: 0. |
| `minDistance` | `number` | — | Distância mínima entre os polegares. Padrão: 0. |
| `onChange` | `((value: number) => void) \| ((value: [number, number]) => void)` | — | — |
| `onChangeEnd` | `((value: number) => void) \| ((value: [number, number]) => void)` | — | Chamado quando o usuário solta o polegar ou a tecla (valor "confirmado"). |
| `range` | `boolean` | — | Dois polegares: mínimo e máximo. |
| `showValue` | `boolean` | — | Mostra o valor atual ao lado do rótulo (`<output>`). Padrão: `true`. |
| `size` | `"sm" \| "md" \| "lg"` | — | Tamanho do polegar e do trilho. |
| `step` | `number` | — | Incremento. Padrão: 1. Como no input nativo, se não dividir `max − min`, o maior valor alcançável é o último passo antes de `max`. |
| `thumbLabels` | `[string, string]` | — | Nomes acessíveis dos polegares. Padrão: "mínimo" e "máximo". |
| `value` | `number \| [number, number]` | — | — |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`SliderMark`:

```ts
export interface SliderMark {
  value: number
  /** Rótulo exibido abaixo do trilho. Sem rótulo, mostra apenas a marca. */
  label?: ReactNode
}
```

`SliderSize`:

```ts
export type SliderSize = 'sm' | 'md' | 'lg'
```

## Movimento

- **Hover e foco** — O polegar cresce 12% (250ms, spring) e ganha um anel que se expande de 0 (250ms, ease-out) — mesma resposta para mouse e teclado.
- **Pressionar / arrastar** — O polegar cresce 22% e preenche de laranja.
- **Clique no trilho ou marca, teclado** — Preenchimento e polegar deslizam até o novo valor por transform (250ms, spring).
- **Arraste** — Sem transição: o polegar segue o ponteiro sem atraso.
- **Marcas** — Mudam de cor em 160ms quando entram/saem do intervalo.
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

Cada polegar é um `<input type="range">` nativo, com `role="slider"`, valores mínimo/máximo e teclado do navegador. No modo intervalo, os dois ficam em um `role="group"` com o rótulo do campo e cada um recebe o nome "*rótulo* mínimo" e "*rótulo* máximo". O `<output>` visível não é uma região viva, para não repetir o que o leitor de tela já anuncia.

| Teclas | Ação |
| --- | --- |
| `→ / ↑` | Aumenta um passo. |
| `← / ↓` | Diminui um passo. |
| `PageUp / PageDown` | Aumenta/diminui em passos maiores (conforme o navegador). |
| `Home / End` | Vai para o mínimo/máximo permitido. |
| `Tab` | No modo intervalo, passa do polegar mínimo para o máximo. |

- **1.3.1** — Rótulo, descrição e papéis nativos; grupo nomeado no modo intervalo.
- **2.1.1** — Teclado completo do input nativo.
- **2.4.7** — Anel de foco desenhado no polegar.
- **2.5.7** — Arrastar não é obrigatório: clique no trilho, nas marcas ou use o teclado.
- **4.1.2** — Valor legível via `aria-valuetext` quando há `formatValue` .
