# CurrencyField

Campo de valor monetário com símbolo da moeda, digitação natural e formatação pelo locale.

- Categoria: Formulários · Status: estável
- Importação: `import { CurrencyField } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/currency-field (em inglês: https://orange.llypedev.com.br/en/components/currency-field)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-currencyfield--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/CurrencyField

## Boas práticas

- Trabalhe com números: `value` e `onChange` usam `number | null`, nunca a string formatada. O `name` envia o número cru (ex.: `1299.9`).
- Não force máscaras que digitam da direita para a esquerda: o usuário digita como escreveria ("1500,90") e o campo formata ao sair.
- Informe limites na descrição. `min`/`max` ajustam o valor ao sair; para bloquear o envio, mostre também um `error`.
- O locale padrão é o do `OrangeProvider`; troque `currency` e `locale` juntos quando o valor for de outro país.

## Como a digitação é interpretada

- **`1500,9`** — Vírgula é o decimal em pt-BR → 1.500,90
- **`1.500`** — Um separador seguido de 3 dígitos é milhar → 1.500,00
- **`12.5`** — Ponto com 1 ou 2 dígitos vira decimal (teclado numérico) → 12,50
- **`2.345.678,123`** — Arredonda para as casas da moeda → 2.345.678,12
- **`R$ 99`** — Letras e símbolos são descartados → 99,00

## Exemplos

### Básico

Real brasileiro (padrão). O símbolo fica no campo e a formatação é aplicada ao sair.

```tsx
import { CurrencyField, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [preco, setPreco] = useState<number | null>(1299.9)

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 320 }}>
      <CurrencyField
        label="Preço de venda"
        description="Use vírgula para os centavos."
        value={preco}
        onChange={setPreco}
        name="preco"
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Valor numérico: <code>{preco === null ? 'null' : preco}</code>
      </p>
    </Stack>
  )
}
```

### Limites

```tsx
import { CurrencyField } from '@orangesys/ui'
import { useState } from 'react'

const LIMITE = 5000

export default function Limits() {
  const [valor, setValor] = useState<number | null>(null)
  const acima = valor !== null && valor > LIMITE

  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <CurrencyField
        label="Valor do Pix"
        description="Limite disponível: R$ 5.000,00. Valores fora da faixa são ajustados ao sair do campo."
        min={1}
        max={LIMITE}
        value={valor}
        onChange={setValor}
        error={acima ? 'O valor excede o seu limite disponível.' : undefined}
        size="lg"
      />
    </div>
  )
}
```

### Outras moedas

Casas decimais, separadores e posição do símbolo seguem o Intl.NumberFormat (o iene não tem centavos).

```tsx
import { CurrencyField, Stack } from '@orangesys/ui'

export default function Currencies() {
  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 320 }}>
      <CurrencyField label="Assinatura em dólar" currency="USD" locale="en-US" defaultValue={49} />
      <CurrencyField
        label="Hospedagem em Lisboa"
        currency="EUR"
        locale="pt-PT"
        defaultValue={1280.5}
      />
      <CurrencyField
        label="Fornecedor no Japão"
        currency="JPY"
        locale="ja-JP"
        defaultValue={158000}
      />
      <CurrencyField
        label="Valor em código ISO"
        currency="BRL"
        currencyDisplay="code"
        defaultValue={89.9}
        size="sm"
      />
    </Stack>
  )
}
```

### Simulador de parcelas

```tsx
import { CurrencyField, Select, Stack } from '@orangesys/ui'
import { useState } from 'react'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Installments() {
  const [total, setTotal] = useState<number | null>(3600)
  const [parcelas, setParcelas] = useState('6')
  const valorParcela = total ? total / Number(parcelas) : 0

  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 360 }}>
      <CurrencyField label="Valor total" value={total} onChange={setTotal} min={0} />
      <Select
        label="Parcelas"
        value={parcelas}
        onChange={(event) => setParcelas(event.target.value)}
        options={[1, 2, 3, 6, 10, 12].map((n) => ({
          value: String(n),
          label: n === 1 ? 'À vista' : `${n}x sem juros`,
        }))}
      />
      <p
        role="status"
        style={{ margin: 0, fontFamily: 'var(--or-font-display)', fontSize: 18, fontWeight: 600 }}
      >
        {total ? `${parcelas}x de ${brl.format(valorParcela)}` : 'Informe o valor total'}
      </p>
    </Stack>
  )
}
```

## Props

### `CurrencyField`

Campo de valor monetário: digitação natural (vírgula ou ponto), símbolo da
moeda no campo e formatação com `Intl.NumberFormat` ao sair. Entrega um
`number` (ou `null`) — nunca uma string formatada.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `className` | `string` | — | Classe aplicada ao contêiner externo. |
| `currency` | `string` | — | Código ISO 4217 da moeda. Padrão: `'BRL'`. |
| `currencyDisplay` | `"symbol" \| "code" \| "narrowSymbol"` | — | Como exibir a moeda: símbolo (`R$`), símbolo curto (`$`) ou código (`BRL`). |
| `defaultValue` | `number \| null` | — | Valor inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — mesmo que oculto. |
| `locale` | `string` | — | Locale da formatação. Padrão: o idioma do `OrangeProvider` (pt-BR). |
| `max` | `number` | — | Valor máximo (aplicado ao sair do campo). |
| `min` | `number` | — | Valor mínimo (aplicado ao sair do campo). Valores negativos só são aceitos se `min < 0`. |
| `onChange` | `((value: number \| null) => void)` | — | Chamado com o número interpretado a cada digitação e com o valor final ao sair do campo. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `number \| null` | — | Valor numérico (controlado). `null` = vazio. |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`CurrencyFieldSize`:

```ts
export type CurrencyFieldSize = 'sm' | 'md' | 'lg'
```

## Movimento

- **Foco** — Borda e anel em 160ms; o símbolo acende em laranja (160ms) e encosta 2px no valor (250ms, spring).
- **Erro** — O campo treme uma vez (or-shake, 400ms) quando a mensagem surge ou muda; o símbolo fica vermelho.
- **Sair do campo** — A formatação é aplicada sem animar o texto, para não atrapalhar a leitura do valor.
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

É um campo de texto com `inputMode="decimal"` (teclado numérico no celular) — não um `type="number"`, que tem problemas conhecidos com separadores e rolagem. O símbolo é decorativo; a moeda é anunciada por extenso ("Moeda: Real brasileiro") via `aria-describedby`, junto com a ajuda e o erro.

| Teclas | Ação |
| --- | --- |
| `0–9` | Digita o valor; letras e símbolos são ignorados. |
| `, / .` | Separador decimal (ambos são aceitos; veja a tabela acima). |
| `Tab` | Sai do campo e aplica a formatação e os limites. |

- **1.3.1** — Moeda informada em texto, não só pelo símbolo.
- **3.3.1** — Erros com `aria-invalid` e mensagem ligada ao campo.
- **3.3.2** — Placeholder mostra o formato esperado (0,00).
- **3.3.4** — Valores fora dos limites são corrigidos antes do envio.
