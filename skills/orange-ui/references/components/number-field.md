# NumberField

Campo numérico (spinbutton) com botões − / +, atalhos de teclado, limites e formatação de moeda, porcentagem e unidades.

- Categoria: Formulários · Status: estável
- Importação: `import { NumberField } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/number-field (em inglês: https://orange.llypedev.com.br/en/components/number-field)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-numberfield--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/NumberField

## Boas práticas

- Use NumberField para quantidades que se ajustam aos poucos (itens, pessoas, porcentagens). Para números que são identificadores — CPF, CEP, cartão — use TextField com inputMode="numeric".
- Defina `min` e `max` sempre que houver limite: os botões são desabilitados nos extremos e `Home`/`End` levam até eles.
- Para dinheiro e porcentagem, use `formatOptions`: o texto segue o idioma do provider (R$ 1.234,50 / $1,234.50) e o valor continua sendo um número.
- O valor digitado é confirmado ao sair do campo ou com Enter, e ajustado aos limites. Texto inválido volta ao último valor.

## Exemplos

### Básico

```tsx
import { NumberField } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 280 }}>
      <NumberField label="Quantidade" defaultValue={1} min={1} max={10} description="Máximo de 10 unidades por pedido." />
      <NumberField label="Hóspedes" defaultValue={2} min={1} max={8} size="sm" />
    </div>
  )
}
```

### Moeda e porcentagem

Com porcentagem, o valor é a fração (0,1 = 10%). Digite "R$ 99,9" ou "99,90": os dois funcionam.

```tsx
import { NumberField } from '@orangesys/ui'

export default function Currency() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 280 }}>
      <NumberField
        label="Preço de venda"
        defaultValue={149.9}
        min={0}
        step={0.5}
        formatOptions={{ style: 'currency', currency: 'BRL' }}
      />
      <NumberField
        label="Desconto"
        defaultValue={0.1}
        min={0}
        max={1}
        step={0.05}
        formatOptions={{ style: 'percent' }}
        description="Entre 0% e 100%."
      />
    </div>
  )
}
```

### Unidades e passos

```tsx
import { NumberField } from '@orangesys/ui'

export default function Units() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 280 }}>
      <NumberField label="Peso do pacote" defaultValue={1.5} min={0.1} step={0.1} suffix="kg" />
      <NumberField
        label="Distância máxima"
        defaultValue={25}
        min={1}
        max={200}
        largeStep={25}
        formatOptions={{ style: 'unit', unit: 'kilometer' }}
        description="PageUp/PageDown avançam 25 km."
      />
      <NumberField label="Altura" defaultValue={172} suffix="cm" hideStepper />
    </div>
  )
}
```

### Controlado

O valor é `number | null` — `null` quando o campo está vazio.

```tsx
import { NumberField, Text } from '@orangesys/ui'
import { useState } from 'react'

const unitPrice = 39.9
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Controlled() {
  const [quantity, setQuantity] = useState<number | null>(2)
  const total = (quantity ?? 0) * unitPrice

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 280 }}>
      <NumberField
        label="Camisetas (R$ 39,90 cada)"
        value={quantity}
        onChange={setQuantity}
        min={0}
        max={20}
        error={quantity === null ? 'Informe a quantidade.' : undefined}
      />
      <Text size="sm" tone="muted" aria-live="polite">
        Total: <strong>{brl.format(total)}</strong>
      </Text>
    </div>
  )
}
```

### Estados

```tsx
import { NumberField } from '@orangesys/ui'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 280 }}>
      <NumberField label="Parcelas" defaultValue={0} min={1} max={12} error="Escolha de 1 a 12 parcelas." />
      <NumberField label="Estoque atual" defaultValue={128} readOnly />
      <NumberField label="Limite de usuários" defaultValue={5} disabled description="Disponível no plano Pro." />
    </div>
  )
}
```

## Props

### `NumberField`

Campo numérico no padrão spinbutton do WAI-ARIA: setas, PageUp/PageDown,
Home/End e botões − / +. Aceita formatação por `Intl.NumberFormat`
(moeda, porcentagem, unidades) e trabalha com `number | null`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `number \| null` | `null` | Valor inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo e ligado por `aria-describedby`. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `formatOptions` | `NumberFormatOptions` | — | Opções de `Intl.NumberFormat` (moeda, porcentagem, unidade, casas decimais). O idioma vem do `OrangeProvider`. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `hideStepper` | `boolean` | `false` | Oculta os botões − / +. O teclado continua funcionando. |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — use `hideLabel` para ocultá-lo. |
| `labelAside` | `ReactNode` | — | Elemento à direita do rótulo (ex.: link "Esqueceu a senha?"). |
| `largeStep` | `number` | — | Incremento de `PageUp`/`PageDown`. Padrão: `step × 10`. |
| `max` | `number` | — | Valor máximo. `End` leva até ele. |
| `min` | `number` | — | Valor mínimo. `Home` leva até ele. |
| `onChange` | `((value: number \| null) => void)` | — | Chamado com o novo valor numérico (ou `null` quando vazio). |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `prefix` | `ReactNode` | — | Texto fixo antes do valor (ex.: `R$`). |
| `required` | `boolean` | — | Campo obrigatório: mostra `*` no rótulo e aplica `required`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `startIcon` | `ReactNode` | — | Ícone decorativo no início do campo. |
| `step` | `number` | `1` | Incremento das setas e dos botões. Padrão: 1. |
| `suffix` | `ReactNode` | — | Texto fixo depois do valor (ex.: `kg`, `un.`). |
| `value` | `number \| null` | — | Valor (controlado). `null` representa o campo vazio. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Hover e foco** — Borda e anel de foco mudam de cor juntos — 160ms (--or-duration-fast), --or-ease-out.
- **Botões − / +** — Pressionar: o ícone afunda 1px e o fundo escurece em 90ms (--or-duration-press).
- **Passo (setas, botões, Home/End)** — O valor faz um "tick": entra 3px de baixo (↑) ou de cima (↓) com fade, em 160ms. Não roda ao segurar o botão, para não prejudicar a leitura.
- **Erro surge** — A mensagem entra com fade e desliza 4px (250ms, --or-ease-out); o controle treme uma vez (or-shake, 400ms) só na passagem de válido para inválido.

## Acessibilidade

Segue o padrão **Spinbutton** do WAI-ARIA: o input tem `role="spinbutton"` com `aria-valuenow`, `aria-valuemin`, `aria-valuemax` e `aria-valuetext` (o valor formatado, como "R$ 12,50"). Os botões − / + têm nome ("Diminuir"/"Aumentar"), `aria-controls` e ficam fora da ordem de tabulação, pois o teclado já cobre tudo. Segurar o botão repete o passo.

| Teclas | Ação |
| --- | --- |
| `↑` | Aumenta um passo. |
| `↓` | Diminui um passo. |
| `PageUp` | Aumenta um passo grande (`largeStep`, padrão 10×). |
| `PageDown` | Diminui um passo grande. |
| `Home` | Vai para o mínimo (quando há `min`). |
| `End` | Vai para o máximo (quando há `max`). |
| `Enter` | Confirma o valor digitado. |

- **1.3.1** — Limites e valor expostos por aria-valuemin/max/now.
- **2.1.1** — Todas as ações disponíveis pelo teclado.
- **2.5.7** — Botões − / + como alternativa a arrastar ou digitar.
- **2.5.8** — Botões com no mínimo 30×30px (tamanho sm).
- **4.1.2** — Valor formatado anunciado por aria-valuetext.
