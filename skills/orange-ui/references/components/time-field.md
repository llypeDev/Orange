# TimeField

Campo de horário em segmentos, igual em todos os navegadores, com relógio de 12 ou 24 horas pelo idioma, limites, intervalos e lista de horários.

- Categoria: Formulários · Status: estável
- Importação: `import { TimeField } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/time-field (em inglês: https://orange.llypedev.com.br/en/components/time-field)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-timefield--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TimeField

## Boas práticas

- O valor é sempre uma string `HH:mm` em 24 horas. Como ele aparece (12 horas com AM/PM ou 24 horas) vem do idioma do `OrangeProvider`, não do navegador da pessoa; `hourCycle` força um dos dois.
- Use `step` (em segundos) quando só alguns horários fazem sentido — `900` para intervalos de 15 minutos — e informe a regra na `description`. As setas e a lista seguem o passo.
- Com `min`, `max` ou `step`, o próprio campo avisa quando o horário digitado fica de fora. Use `error` para as regras do seu negócio; ela substitui o aviso do campo.
- Mencione o fuso horário quando a pessoa puder estar em outra região.
- Para escolher entre poucos horários fixos (ex.: 3 janelas de entrega), prefira RadioGroup ou SegmentedControl.

## Exemplos

### Básico

Digite os números, use as setas em cada segmento ou abra a lista pelo relógio.

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

As setas andam de 15 em 15 minutos e param em 08:00 e 18:00; a lista só traz os horários válidos; um horário digitado fora disso mostra o aviso do campo.

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

### Relógio de 12 ou 24 horas

Sem hourCycle, vale o idioma do provider: 24 horas em português e espanhol, 12 em inglês americano. O valor continua em 24 horas.

```tsx
import { Stack, TimeField } from '@orangesys/ui'

export default function HourCycle() {
  return (
    <Stack gap={4} direction="horizontal" wrap>
      <TimeField label="Relógio de 24 horas" hourCycle={24} defaultValue="14:30" />
      <TimeField label="Relógio de 12 horas" hourCycle={12} defaultValue="14:30" />
    </Stack>
  )
}
```

### Lista de horários

O relógio abre uma lista: no intervalo do step quando ele é de 5 minutos ou mais, senão de meia em meia hora. listStep muda o intervalo; false tira o botão.

```tsx
import { Stack, TimeField } from '@orangesys/ui'

export default function TimeList() {
  return (
    <Stack gap={4} direction="horizontal" wrap>
      <TimeField label="De hora em hora" listStep={3600} defaultValue="09:00" />
      <TimeField
        label="Sem lista"
        description="Só digitação e setas."
        listStep={false}
        defaultValue="09:00"
      />
    </Stack>
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

Somente leitura, com o aviso do próprio campo (depois do máximo) e desabilitado.

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
      <TimeField label="Fechamento" defaultValue="23:30" max="22:00" />
      <TimeField label="Intervalo" defaultValue="12:00" disabled />
    </Stack>
  )
}
```

## Movimento

- **Hover e foco** — Borda e anel laranja do campo · fast (160ms), ease-out.
- **Segmento em edição** — O segmento com foco ganha fundo laranja, com transição · fast.
- **Abrir a lista** — O relógio fica laranja e avança um "tique" (gira 30°) · medium (250ms), ease-spring. A lista entra com opacidade e 4px vindo do campo e sai mais rápido.
- **Clicar no relógio** — O ícone afunda 1px · press (90ms).
- **Opção da lista** — A barra laranja da opção com foco cresce do centro · medium, ease-spring.
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `TimeField`

Campo de horário em segmentos (hora, minuto, segundo, AM/PM), cada um editável pelo teclado,
com a aparência do Orange e o formato do idioma do provider — igual em todos os navegadores.
O botão do relógio abre uma lista de horários. O valor é sempre `HH:mm` em 24 horas; um
`<input type="time">` oculto guarda esse valor para formulários, `ref` e validação nativa.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `string` | — | Horário inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro. Substitui os avisos do próprio campo (fora do limite, incompleto). |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `hourCycle` | `12 \| 24` | — | Relógio de 12 horas (com AM/PM) ou de 24. Padrão: o do idioma do `OrangeProvider` (24 em `pt-BR` e `es-ES`, 12 em `en-US`). O valor é sempre `HH:mm` em 24 horas. |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `listStep` | `number \| false` | — | Intervalo, em segundos, entre os horários da lista que o botão do relógio abre. Padrão: o `step`, quando ele é de 5 minutos ou mais; senão 30 minutos. `false` tira o botão e a lista. |
| `max` | `string` | — | Horário máximo (`HH:mm`). |
| `min` | `string` | — | Horário mínimo (`HH:mm`). Depois de `max`, o intervalo atravessa a meia-noite. |
| `onChange` | `((value: string, event: ChangeEvent<HTMLInputElement, Element>) => void)` | — | Chamado com o novo horário (`HH:mm`) ou `''` quando apagado ou ainda incompleto. |
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

## Formulários

O valor mora num `<input type="time">` oculto, que é quem recebe a `ref` e o `name`: o campo entra no envio do formulário, no `FormData` e na validação nativa (`required`, `min`, `max`, `step`) como antes. Um horário pela metade conta como inválido, e o envio para no campo. Focar esse input — pelo rótulo, por `ref.current.focus()` ou pela validação — leva o foco ao primeiro segmento.

## Acessibilidade

Os segmentos formam um grupo com o nome do campo. Cada um é um `spinbutton` com nome próprio ("hora", "minuto", "segundo", "AM ou PM"), valor atual, mínimo e máximo; vazio, anuncia "vazio". Descrição e erro são lidos no primeiro segmento. O botão do relógio diz o que faz ("Escolher horário" ou "Alterar horário, 09:30") e abre uma `listbox` com o foco no horário escolhido.

No celular, cada segmento abre o teclado numérico. Essa digitação foi verificada por emulação de toque, não em aparelhos; os anúncios, por testes automáticos, não com leitores de tela.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra no campo, passa pelos segmentos e chega ao botão do relógio. |
| `← / →` | Segmento anterior / próximo. |
| `↑ / ↓` | Aumenta / diminui o segmento no passo, dando a volta, sem sair de min e max. |
| `PageUp / PageDown` | Anda mais: 2 horas, 15 minutos ou 15 segundos. |
| `Home / End` | Primeiro / último valor do segmento. |
| `0–9` | Digita o valor; completo, o foco passa para o próximo segmento. |
| `A / P` | No relógio de 12 horas, escolhe AM ou PM. |
| `Backspace / Delete` | Apaga o segmento; Backspace num segmento vazio volta ao anterior. |
| `Ctrl` + `V` | Cola um horário escrito de vários jeitos: 14:30, 14h30, 2:30 pm. |
| `Enter` | Nos segmentos, envia o formulário. Na lista, escolhe o horário. |
| `Alt` + `↓` | Abre a lista de horários a partir de um segmento. |
| `Esc` | Fecha a lista sem escolher e devolve o foco ao relógio. Tab faz o mesmo. |

Na lista: ↑ e ↓ andam entre os horários, PageUp e PageDown pulam oito, Home e End vão aos extremos, e digitar números leva ao horário (14 → 14:00).

- **1.3.1** — Grupo com o nome do campo; descrição e erro ligados por aria-describedby.
- **2.1.1** — Tudo pelo teclado: segmentos, botão e lista.
- **2.4.7** — Foco visível na borda laranja e no segmento ativo; em alto contraste, com as cores de seleção do sistema.
- **2.5.8** — Botão do relógio e opções da lista com pelo menos 24px.
- **3.3.1** — Erros com `aria-invalid` e mensagem associada, inclusive os avisos do próprio campo.
- **3.3.3** — Os avisos dizem como corrigir: o limite ou o intervalo aceito.
- **4.1.2** — spinbutton com nome e valor; botão com aria-expanded; listbox com a opção escolhida marcada.
