# DateTimePicker

Data e hora num só campo: a data com máscara e calendário em diálogo, a hora em segmentos como no TimeField — para agendar publicações, reuniões e entregas.

- Categoria: Formulários · Status: novo
- Importação: `import { DateTimePicker } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/date-time-picker (em inglês: https://orange.llypedev.com.br/en/components/date-time-picker)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-datetimepicker--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/DateTimePicker

## Boas práticas

- Use quando o horário faz parte da decisão: agendar uma publicação, marcar uma reunião, programar uma manutenção. Só a data? Use o DatePicker. Só a hora? Use o TimeField.
- O valor é um `Date` em hora local. Ele só existe com data e hora completas: enquanto um dos campos estiver vazio, incompleto ou fora das regras, o `onChange` recebe `null`. Diga o fuso na `description` quando ele importar ("Horário de Brasília").
- Escolher um dia no calendário mantém a hora digitada. Com a hora vazia, passe `defaultTime` (ex.: `'09:00'`) quando houver um horário típico; sem ele, a hora fica vazia para a pessoa preencher.
- `min` e `max` valem para data *e* hora: dias fora ficam desabilitados no calendário e, no dia-limite, as setas da hora param no horário mínimo ou máximo; um horário digitado antes do mínimo mostra "Escolha um horário a partir de 14:00". Regras por dia (horário comercial) vão em `error`.
- A hora usa os mesmos segmentos do TimeField e fica igual em todos os navegadores. O relógio de 12 horas (com AM/PM) ou de 24 vem do idioma do `OrangeProvider`, como o formato da data — não do navegador da pessoa. O valor é sempre um `Date`.
- `step` é em segundos (`900` = 15 minutos): as setas da hora andam nesse passo, contado a partir da meia-noite. Um horário digitado fora do passo continua valendo; se só alguns horários servem, valide em `error`.

- Faça: Um rótulo para o par data e hora, com o fuso e a regra explicados.
- Evite: Campo sem rótulo visível — ou um DatePicker e um TimeField soltos, com dois rótulos para um só valor.

## Anatomia

- **Grupo** — Um só controle com role="group", nomeado pelo rótulo. O clique no rótulo leva ao campo de data.
- **Data** — Campo de texto com a máscara do idioma, igual ao do DatePicker ("5/3" vira "05/03"). Nome acessível "Data".
- **Botão de calendário** — Logo depois da data. Abre o diálogo; com um dia preenchido, o nome inclui a data: "Alterar data, sexta-feira, 13 de novembro de 2026".
- **Hora** — Segmentos de hora e minuto (mais segundo e AM/PM, quando há), os mesmos do TimeField, com o relógio à esquerda; clicar no relógio ou na área livre leva o foco à hora. Formam um grupo com o nome acessível "Hora".
- **Telas estreitas** — Sem espaço para os dois lado a lado (≈ 320px), a hora desce para uma segunda linha dentro da mesma moldura, separada por um divisor.

## Exemplos

### Básico

Digite a data e a hora, ou escolha o dia no calendário pelo botão (ou Alt + ↓ no campo de data). Na hora, os números avançam sozinhos de um segmento para o outro e as setas ↑ e ↓ mudam o valor.

```tsx
import { DateTimePicker } from '@orangesys/ui'

export default function Basic() {
  return (
    <DateTimePicker label="Data e hora da reunião" description="Horário de Brasília (UTC−3)." />
  )
}
```

### Agendar publicação

min em agora e max em 30 dias; step de 15 minutos (as setas da hora andam de 15 em 15); ao escolher um dia sem hora, defaultTime preenche 09:00. Escolha hoje: as setas param no horário mínimo e digitar um horário anterior mostra o aviso.

```tsx
import { DateTimePicker, Stack, Text, useLocale } from '@orangesys/ui'
import { useState } from 'react'

const QUINZE_MINUTOS = 15 * 60 * 1000
// Próximo horário de 15 em 15 minutos a partir de agora.
const agora = new Date(Math.ceil(Date.now() / QUINZE_MINUTOS) * QUINZE_MINUTOS)
const limite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 30, 23, 45)

export default function Publication() {
  const { locale } = useLocale()
  const [publicacao, setPublicacao] = useState<Date | null>(null)

  return (
    <Stack gap={3}>
      <DateTimePicker
        label="Agendar publicação"
        description="Nos próximos 30 dias, de 15 em 15 minutos."
        min={agora}
        max={limite}
        step={900}
        defaultTime="09:00"
        value={publicacao}
        onChange={setPublicacao}
      />
      <Text size="sm" tone="muted" aria-live="polite">
        {publicacao
          ? `“Novidades do app de pedidos” vai ao ar em ${publicacao.toLocaleString(locale, {
              dateStyle: 'full',
              timeStyle: 'short',
            })}.`
          : 'Escolha quando o artigo vai ao ar.'}
      </Text>
    </Stack>
  )
}
```

### Horário comercial

Fins de semana desabilitados com isDateDisabled e a regra das 08:00 às 17:30 validada pela aplicação em error.

```tsx
import { DateTimePicker } from '@orangesys/ui'
import { useState } from 'react'

const hoje = new Date()
const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 8, 0)
const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 30, 18, 0)
const ehFimDeSemana = (data: Date) => data.getDay() === 0 || data.getDay() === 6

export default function BusinessHours() {
  const [visita, setVisita] = useState<Date | null>(null)
  const minutos = visita ? visita.getHours() * 60 + visita.getMinutes() : 0
  const foraDoExpediente = visita !== null && (minutos < 8 * 60 || minutos > 17 * 60 + 30)

  return (
    <DateTimePicker
      label="Visita técnica"
      description="Dias úteis a partir de amanhã, das 08:00 às 17:30, de 30 em 30 minutos."
      min={amanha}
      max={limite}
      isDateDisabled={ehFimDeSemana}
      weekStartsOn={1}
      step={1800}
      defaultTime="08:00"
      value={visita}
      onChange={setVisita}
      error={foraDoExpediente ? 'Escolha um horário entre 08:00 e 17:30.' : undefined}
    />
  )
}
```

### No Form

Com name, o valor vai num input oculto como aaaa-mm-ddTHH:mm (hora local, o formato do datetime-local). O link do resumo de erros foca o campo de data.

```tsx
import { Button, DateTimePicker, Form, FormActions, Text } from '@orangesys/ui'
import { useState } from 'react'

export default function FormSubmit() {
  const [enviado, setEnviado] = useState<string | null>(null)

  return (
    <Form
      aria-label="Agendar manutenção"
      validate={(values) => ({
        inicio: values.inicio ? undefined : 'Informe a data e a hora de início da manutenção.',
      })}
      onSubmit={(values) => setEnviado(String(values.inicio))}
      style={{ width: '100%', maxWidth: 520 }}
    >
      {({ errors }) => (
        <>
          <DateTimePicker
            name="inicio"
            label="Início da manutenção"
            description="O sistema de pedidos fica fora do ar por até 2 horas."
            required
            error={errors.inicio}
          />
          <FormActions>
            <Button type="submit">Agendar manutenção</Button>
          </FormActions>
          {enviado && (
            <Text size="sm" tone="muted" aria-live="polite">
              Enviado no FormData: inicio = {enviado}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
```

### Estados

Somente leitura, erro de negócio via error e desabilitado (no tamanho sm).

```tsx
import { DateTimePicker, Stack } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={4}>
      <DateTimePicker
        label="Abertura das inscrições"
        description="Definida pela coordenação."
        defaultValue={new Date(2026, 10, 3, 9, 0)}
        readOnly
      />
      <DateTimePicker
        label="Encerramento das inscrições"
        defaultValue={new Date(2026, 10, 1, 18, 0)}
        error="O encerramento deve ser depois da abertura."
      />
      <DateTimePicker label="Divulgação do resultado" size="sm" disabled />
    </Stack>
  )
}
```

## Movimento

- **Abrir e fechar o calendário** — Igual ao DatePicker: o diálogo entra com opacidade, 4px vindos do lado do campo e escala 0,98 → 1 · medium (250ms), ease-out; sai mais rápido e inerte · fast (160ms), ease-in-out.
- **Calendário** — O mesmo Calendar: a grade desliza ao trocar de mês e o dia escolhido faz pop · medium.
- **Relógio** — Com o foco num segmento da hora, o relógio fica laranja e avança um "tique" de 30° · medium, ease-spring.
- **Segmento em edição** — O segmento com o foco troca para o fundo laranja · fast (160ms), ease-out.
- **Erro de validação** — O controle treme uma vez quando a mensagem surge (or-shake) · slow (400ms).
- **Hover, foco e pressionar** — Borda e foco do frame · fast; o relógio acende ao passar o mouse pela hora · fast; o ícone do calendário afunda 1px · press (90ms).
- **Movimento reduzido** — Os tokens viram 0: tudo muda na hora — borda, cor e texto continuam indicando o estado.

## Props

### `DateTimePicker`

Campo de data e hora num só controle: a data com máscara conforme o idioma (como no
`DatePicker`), o calendário em diálogo para escolher o dia e a hora em segmentos (como no
`TimeField`), no relógio de 12 ou 24 horas do idioma do provider.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | — | Calendário aberto inicialmente (não controlado). |
| `defaultTime` | `string` | — | Horário (`HH:mm`) aplicado quando um dia é escolhido no calendário e a hora está vazia (ex.: `'09:00'`). Sem ele, a hora continua vazia até ser digitada. |
| `defaultValue` | `Date \| null` | `null` | Data e hora iniciais (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `disabled` | `boolean` | — | Desabilita a data, a hora e o botão do calendário. |
| `error` | `ReactNode` | — | Mensagem de erro. Substitui a validação interna. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `isDateDisabled` | `((date: Date) => boolean)` | — | Desabilita datas específicas (feriados, fins de semana…). |
| `label` | `ReactNode` | — | Rótulo visível do campo (também nomeia o grupo dos dois campos). |
| `max` | `Date` | — | Último instante permitido (data e hora). Dias posteriores ficam desabilitados no calendário e, no dia de `max`, as setas da hora param nesse horário. |
| `min` | `Date` | — | Primeiro instante permitido (data e hora). Dias anteriores ficam desabilitados no calendário e, no dia de `min`, as setas da hora param nesse horário. |
| `name` | `string` | — | Envia o valor no formulário em um input oculto, em hora local no formato `aaaa-mm-ddTHH:mm` (com `:ss` quando o `step` pede segundos) — o mesmo do `<input type="datetime-local">`. Vazio enquanto o valor for `null`. |
| `onChange` | `((date: Date \| null) => void)` | — | Chamado com a nova data e hora — ou `null` quando a data ou a hora fica vazia/incompleta, ou quando a combinação é inválida ou indisponível. |
| `onOpenChange` | `((open: boolean) => void)` | — | — |
| `open` | `boolean` | — | Calendário aberto (controlado). |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `placeholder` | `string` | — | Placeholder do campo de data. Padrão: o formato do idioma (`dd/mm/aaaa`). |
| `readOnly` | `boolean` | — | Somente leitura: a data e a hora não editam e o calendário não abre. |
| `required` | `boolean` | — | Marca a data e a hora como obrigatórias. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. |
| `step` | `number` | — | Intervalo em segundos em que as setas andam na hora, contado a partir da meia-noite (ex.: `900` = 15 minutos). Fora de múltiplos de 60, o campo mostra os segundos. |
| `value` | `Date \| null` | — | Data e hora (controlado), no fuso local. `null` = vazio. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Primeiro dia da semana no calendário: 0 = domingo (padrão), 1 = segunda… |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`DateTimePickerSize`:

```ts
export type DateTimePickerSize = 'sm' | 'md' | 'lg'
```

## Acessibilidade

A data e a hora ficam num `role="group"` nomeado pelo rótulo. A data é um campo de texto com nome próprio ("Data"), e o formato dela é anunciado como descrição. A hora é um grupo ("Hora") com os mesmos segmentos do TimeField: cada um é um `spinbutton` com nome próprio ("hora", "minuto", "segundo", "AM ou PM"), valor atual, mínimo e máximo; vazio, anuncia "vazio". A descrição e o erro são lidos na data e no primeiro segmento da hora. O calendário abre num diálogo modal (padrão **Date Picker Dialog** do WAI-ARIA APG), com a mesma grade do DatePicker. A parte com problema recebe `aria-invalid` (a data, quando ela é inválida ou indisponível; a hora, quando falta ou sai de min/max).

No celular, cada segmento da hora abre o teclado numérico. Essa digitação foi verificada por emulação de toque, não em aparelhos; os anúncios, por testes automáticos, não com leitores de tela.

| Teclas | Ação |
| --- | --- |
| `Tab` | Data → botão do calendário → hora → minuto (e os demais segmentos da hora). |
| `Alt` + `↓` | No campo de data: abre o calendário. |
| `← / →` | Na hora: segmento anterior / próximo. |
| `↑ / ↓` | Na hora: aumenta / diminui o segmento no step, dando a volta, sem passar do horário-limite no dia de min ou de max. |
| `PageUp / PageDown` | Na hora: anda mais (2 horas, 15 minutos ou 15 segundos). Home e End vão ao primeiro e ao último valor do segmento. |
| `0–9` | Na hora: digita o valor; completo, o foco passa para o próximo segmento. No relógio de 12 horas, A e P escolhem AM ou PM. |
| `Backspace / Delete` | Na hora: apaga o segmento (o valor fica vazio até a hora estar completa); Backspace num segmento vazio volta ao anterior. |
| `Ctrl` + `V` | Na hora: cola um horário escrito de vários jeitos (14:30, 14h30, 2:30 pm). |
| `Enter` | No botão: abre o calendário. No dia: seleciona mantendo a hora, fecha e devolve o foco ao botão. Na data e na hora: envia o formulário. |
| `←` + `→` + `↑` + `↓` | Na grade: dia anterior / próximo / semana anterior / seguinte. |
| `PageUp` + `PageDown` | Na grade: mês anterior / próximo (com Shift, ano). |
| `Escape` | Fecha o calendário sem alterar e devolve o foco ao botão. |

- **1.3.1** — Grupo rotulado com a data e a hora nomeadas; descrição e erro ligados por aria-describedby.
- **1.4.10** — Em 320px a hora desce para uma segunda linha: sem rolagem horizontal.
- **2.1.1** — Tudo funciona pelo teclado, inclusive digitando a data e a hora.
- **2.4.3** — A ordem de foco segue a ordem visual nos dois layouts; o foco volta ao botão ao fechar o calendário.
- **2.4.7** — Foco visível na borda laranja e no segmento ativo da hora; em alto contraste, com as cores de seleção do sistema.
- **3.3.1** — Data inválida ou indisponível, hora fora do intervalo e campo deixado vazio geram mensagem vinculada.
- **3.3.2** — O formato da data é anunciado; cada segmento da hora diz o que é ("hora", "minuto") e os limites que aceita.
