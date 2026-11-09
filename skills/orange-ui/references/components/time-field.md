# TimeField

Campo de horário nativo com a aparência do Orange, limites e intervalos configuráveis.

- Categoria: Formulários · Status: estável
- Importação: `import { TimeField } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/time-field (em inglês: https://orange.llypedev.com.br/en/components/time-field)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-timefield--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TimeField

## Boas práticas

- O valor é sempre uma string `HH:mm` em 24 horas, independente de como o navegador exibe (12h com AM/PM ou 24h, conforme o sistema da pessoa).
- Use `step` (em segundos) quando só alguns horários fazem sentido — `900` para intervalos de 15 minutos — e informe a regra na `description`.
- Mencione o fuso horário quando a pessoa puder estar em outra região.
- Para escolher entre poucos horários fixos (ex.: 3 janelas de entrega), prefira RadioGroup ou SegmentedControl.

## Exemplos

### Básico

```tsx
import { TimeField } from '@orangesys/ui'

export default function Basic() {
  return (
    <TimeField
      label="Horário de retirada"
      description="Horário de Brasília (UTC−3)."
      defaultValue="09:30"
    />
  )
}
```

### Horário comercial

min, max e step seguem o atributo nativo; as setas respeitam o intervalo de 15 minutos.

```tsx
import { TimeField } from '@orangesys/ui'

export default function BusinessHours() {
  return (
    <TimeField
      label="Horário da reunião"
      description="Entre 08:00 e 18:00, em intervalos de 15 minutos."
      min="08:00"
      max="18:00"
      step={900}
      defaultValue="10:15"
    />
  )
}
```

### Intervalo (controlado)

Dois campos controlados com validação de negócio: o fim precisa ser depois do início.

```tsx
import { Stack, Text, TimeField } from '@orangesys/ui'
import { useState } from 'react'

const emMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

export default function Interval() {
  const [inicio, setInicio] = useState('09:00')
  const [fim, setFim] = useState('10:30')
  const duracao = inicio && fim ? emMinutos(fim) - emMinutos(inicio) : 0
  const invalido = Boolean(inicio && fim && duracao <= 0)

  return (
    <Stack gap={4}>
      <Stack gap={4} direction="horizontal" wrap>
        <TimeField label="Início do plantão" value={inicio} onChange={setInicio} required />
        <TimeField
          label="Fim do plantão"
          value={fim}
          onChange={setFim}
          required
          error={invalido ? 'O fim precisa ser depois do início.' : undefined}
        />
      </Stack>
      {!invalido && duracao > 0 && (
        <Text size="sm" tone="muted" aria-live="polite">
          Duração: {Math.floor(duracao / 60)}h{String(duracao % 60).padStart(2, '0')}
        </Text>
      )}
    </Stack>
  )
}
```

### Tamanhos

```tsx
import { Stack, TimeField } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={4} direction="horizontal" align="end" wrap>
      <TimeField label="Pequeno" size="sm" defaultValue="07:45" />
      <TimeField label="Médio" size="md" defaultValue="12:00" />
      <TimeField label="Grande" size="lg" defaultValue="18:30" />
    </Stack>
  )
}
```

### Estados

Somente leitura, com erro e desabilitado.

```tsx
import { Stack, TimeField } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={4} direction="horizontal" wrap>
      <TimeField
        label="Abertura da loja"
        defaultValue="08:00"
        readOnly
        description="Definido pela franquia."
      />
      <TimeField label="Fechamento" defaultValue="23:30" error="A loja fecha no máximo às 22:00." />
      <TimeField label="Intervalo" defaultValue="12:00" disabled />
    </Stack>
  )
}
```

## Movimento

- **Hover e foco** — Borda e anel laranja do campo; o relógio muda de cor · fast (160ms), ease-out.
- **Receber foco** — O relógio avança um "tique" (gira 30°) · medium (250ms), ease-spring.
- **Clicar no relógio** — O ícone afunda 1px antes de abrir o seletor nativo · press (90ms).
- **Segmento em edição** — Fundo laranja do segmento ativo com transição · fast.
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `TimeField`

Campo de horário: `<input type="time">` nativo com a aparência do Orange.
O navegador cuida da digitação por segmentos, do formato 12/24h do
sistema e do seletor nativo — com teclado e leitores de tela completos.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `string` | — | Horário inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `max` | `string` | — | Horário máximo (`HH:mm`). |
| `min` | `string` | — | Horário mínimo (`HH:mm`). |
| `onChange` | `((value: string, event: ChangeEvent<HTMLInputElement, Element>) => void)` | — | Chamado com o novo horário (`HH:mm`) ou `''` quando apagado. |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. |
| `step` | `number` | — | Intervalo em segundos entre horários válidos. Ex.: `900` = 15 minutos. Padrão: 60. |
| `value` | `string` | — | Horário no formato `HH:mm` (ou `HH:mm:ss` com `step` < 60). Controlado. |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TimeFieldSize`:

```ts
export type TimeFieldSize = 'sm' | 'md' | 'lg'
```

## Acessibilidade

Usa o `<input type="time">` nativo: cada segmento (hora, minuto, AM/PM) é anunciado e editável pelo teclado em qualquer leitor de tela. O ícone de relógio é decorativo — no mouse, ele abre o seletor nativo.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra no campo e passa entre os segmentos. |
| `←` + `→` | Segmento anterior / próximo. |
| `↑` + `↓` | Aumenta / diminui o segmento respeitando o step. |
| `0–9` | Digita o valor do segmento. |
| `Backspace` | Apaga o segmento. |

- **1.3.1** — Rótulo, descrição e erro ligados por for/aria-describedby.
- **1.3.5** — Tipo de entrada nativo identifica o propósito do campo.
- **2.4.7** — Foco visível na borda laranja e no segmento ativo.
- **3.3.1** — Erros com `aria-invalid` e mensagem associada.
