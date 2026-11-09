# DatePicker

Campo de data com máscara conforme o idioma e calendário em diálogo, navegável por teclado.

- Categoria: Formulários · Status: estável
- Importação: `import { DatePicker, Calendar } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/date-picker (em inglês: https://orange.llypedev.com.br/en/components/date-picker)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-datepicker--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/DatePicker

## Boas práticas

- Use para datas próximas ou relativas a hoje (entrega, vencimento, agendamento). Para datas distantes e conhecidas, como nascimento, a pessoa digita mais rápido — o campo aceita digitação direta com máscara.
- Quando o horário também importa (agendar uma publicação, marcar uma reunião), use o : data e hora num só campo, com um rótulo e um valor `Date` — em vez de um DatePicker e um TimeField combinados à mão.
- O formato segue o idioma do `OrangeProvider`: `dd/mm/aaaa` em pt-BR e `mm/dd/yyyy` em en-US. Ele aparece como placeholder e é anunciado como descrição do campo.
- Restrinja com `min`, `max` e `isDateDisabled` e explique a regra na `description` ("Dias úteis nos próximos 60 dias").
- Datas inválidas (31/02) ou indisponíveis mostram um erro automático e emitem `null`. Passe `error` para mensagens de negócio, como "Informe o vencimento".

- Faça: Rótulo específico e a regra de disponibilidade explicada.
- Evite: Campo sem rótulo visível, dependendo só do placeholder.

## Anatomia

- **Campo de texto** — Aceita digitação com máscara; separadores são inseridos sozinhos e "5/3" vira "05/03".
- **Botão de calendário** — Abre o diálogo. Com valor, o nome acessível inclui a data: "Alterar data, domingo, 15 de março de 2026".
- **Diálogo** — Modal, rotulado pelo mês e ano exibidos; prende o foco até fechar.
- **Grade (Calendar)** — Hoje tem marcador laranja; o dia selecionado é preenchido em laranja; dias indisponíveis ficam riscados.

## Exemplos

### Básico

Digite a data ou abra o calendário pelo botão (ou Alt + ↓ dentro do campo).

```tsx
import { DatePicker } from '@orangesys/ui'

export default function Basic() {
  return (
    <DatePicker
      label="Data de entrega"
      description="Digite a data ou escolha no calendário."
      defaultValue={new Date()}
    />
  )
}
```

### Datas permitidas

min, max e isDateDisabled bloqueiam fins de semana e feriados; a semana começa na segunda-feira.

```tsx
import { DatePicker } from '@orangesys/ui'

const hoje = new Date()
const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 60)
// feriados no formato mês-dia
const feriados = ['11-15', '11-20', '12-25', '01-01']

const ehFeriado = (data: Date) =>
  feriados.includes(
    `${data.getMonth() + 1}`.padStart(2, '0') + '-' + `${data.getDate()}`.padStart(2, '0'),
  )
const ehFimDeSemana = (data: Date) => data.getDay() === 0 || data.getDay() === 6

export default function Restrictions() {
  return (
    <DatePicker
      label="Agendar visita técnica"
      description="Dias úteis nos próximos 60 dias, exceto feriados."
      min={hoje}
      max={limite}
      isDateDisabled={(data) => ehFimDeSemana(data) || ehFeriado(data)}
      weekStartsOn={1}
    />
  )
}
```

### Período (controlado)

Dois campos controlados: o check-out só libera depois do check-in e começa no dia seguinte.

```tsx
import { DatePicker, Text } from '@orangesys/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const hoje = new Date()

export default function Booking() {
  const [entrada, setEntrada] = useState<Date | null>(null)
  const [saida, setSaida] = useState<Date | null>(null)
  const noites = entrada && saida ? Math.round((saida.getTime() - entrada.getTime()) / DIA) : 0

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <DatePicker
          label="Check-in"
          value={entrada}
          min={hoje}
          onChange={(data) => {
            setEntrada(data)
            if (data && saida && saida <= data) setSaida(null)
          }}
        />
        <DatePicker
          label="Check-out"
          value={saida}
          min={entrada ? new Date(entrada.getTime() + DIA) : hoje}
          disabled={!entrada}
          onChange={setSaida}
        />
      </div>
      <Text size="sm" tone="muted" aria-live="polite">
        {noites > 0
          ? `${noites} ${noites === 1 ? 'noite' : 'noites'} de hospedagem`
          : 'Escolha as datas da estadia.'}
      </Text>
    </div>
  )
}
```

### Validação e estados

Erro de negócio via error, somente leitura e desabilitado. Com name, o valor vai no formulário como aaaa-mm-dd.

```tsx
import { Button, DatePicker } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [vencimento, setVencimento] = useState<Date | null>(null)
  const [enviado, setEnviado] = useState(false)

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <DatePicker
        label="Vencimento do boleto"
        required
        name="vencimento"
        value={vencimento}
        onChange={setVencimento}
        error={enviado && !vencimento ? 'Informe uma data de vencimento válida.' : undefined}
      />
      <DatePicker label="Data de emissão" defaultValue={new Date(2026, 9, 1)} readOnly />
      <DatePicker label="Data de compensação" disabled />
      <Button type="submit">Gerar boleto</Button>
    </form>
  )
}
```

### Calendar standalone

A grade também é exportada como Calendar para agendas e painéis — com a mesma navegação por teclado.

```tsx
import { Calendar, Text, useLocale } from '@orangesys/ui'
import { useState } from 'react'

const hoje = new Date()
const ano = hoje.getFullYear()
const mes = hoje.getMonth()

const eventos: Record<string, string[]> = {
  [new Date(ano, mes, 5).toDateString()]: ['09:30 · Daily do time de pagamentos'],
  [new Date(ano, mes, 12).toDateString()]: [
    '14:00 · Revisão de design do checkout',
    '16:30 · 1:1 com a liderança',
  ],
  [new Date(ano, mes, 18).toDateString()]: ['10:00 · Planejamento do trimestre'],
}

export default function Agenda() {
  const { locale } = useLocale()
  const [dia, setDia] = useState<Date | null>(new Date(ano, mes, 12))
  const doDia = dia ? (eventos[dia.toDateString()] ?? []) : []

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
      <Calendar value={dia} onChange={setDia} weekStartsOn={1} showTodayButton />
      <div style={{ minWidth: 220 }}>
        <p className="or-eyebrow">
          {dia?.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {doDia.length > 0 ? (
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            {doDia.map((evento) => (
              <li key={evento}>{evento}</li>
            ))}
          </ul>
        ) : (
          <Text size="sm" tone="muted">
            Nenhum compromisso neste dia.
          </Text>
        )}
      </div>
    </div>
  )
}
```

## Movimento

- **Abrir o calendário** — O diálogo entra com opacidade, 4px vindos do lado do campo (acima ou abaixo) e escala 0,98 → 1 · medium (250ms), ease-out.
- **Fechar** — Sai mais rápido pelo mesmo lado e fica inerte durante a saída · fast (160ms), ease-in-out.
- **Trocar de mês** — A grade desliza 16px na direção (próximo → da direita, anterior → da esquerda) com fade; o título faz crossfade · medium, ease-out (saída do título em fast).
- **Escolher um dia** — O dia selecionado faz pop de 0,8 → 1 com overshoot · medium, ease-bounce.
- **Hover e foco** — Fundo e cor dos dias e botões · fast; as setas de navegação empurram 2px na direção · medium.
- **Pressionar** — Dias, botões e o ícone do calendário afundam 1px (translateY(1px) scale(0.985)) · press (90ms).
- **Hoje** — O marcador laranja entra em escala ao exibir o mês · medium, ease-bounce.
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `DatePicker`

Campo de data com máscara conforme o idioma (dd/mm/aaaa em pt-BR,
mm/dd/yyyy em en-US) e um calendário em diálogo, seguindo o padrão
"Date Picker Dialog" do WAI-ARIA.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | — | Calendário aberto inicialmente (não controlado). |
| `defaultValue` | `Date \| null` | `null` | Data inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro. Substitui a validação interna de formato. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `isDateDisabled` | `((date: Date) => boolean)` | — | Desabilita datas específicas (feriados, fins de semana…). |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `max` | `Date` | — | Última data permitida. |
| `min` | `Date` | — | Primeira data permitida. |
| `onChange` | `((date: Date \| null) => void)` | — | Chamado com a nova data — ou `null` quando o campo fica vazio ou o texto digitado não forma uma data válida/disponível. |
| `onOpenChange` | `((open: boolean) => void)` | — | — |
| `open` | `boolean` | — | Calendário aberto (controlado). |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `Date \| null` | — | Data selecionada (controlado). `null` = vazio. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Primeiro dia da semana no calendário: 0 = domingo (padrão), 1 = segunda… |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `Calendar`

Grade mensal de datas com navegação completa por teclado (padrão "grid"
do WAI-ARIA). Use sozinha em painéis de agenda ou dentro do `DatePicker`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | `false` | Foca o dia ativo ao montar. |
| `defaultMonth` | `Date` | — | Mês exibido inicialmente quando não há valor. Padrão: mês atual. |
| `defaultValue` | `Date \| null` | `null` | Data selecionada inicial (não controlado). |
| `headingId` | `string` | — | Id do título "mês de ano" — o diálogo do DatePicker usa como rótulo. |
| `isDateDisabled` | `((date: Date) => boolean)` | — | Desabilita datas específicas (feriados, fins de semana…). |
| `max` | `Date` | — | Última data selecionável. |
| `min` | `Date` | — | Primeira data selecionável. |
| `onChange` | `((date: Date) => void)` | — | Chamado quando o usuário escolhe um dia (clique, Enter ou Espaço). |
| `showTodayButton` | `boolean` | `false` | Mostra o botão "Hoje" no rodapé. |
| `value` | `Date \| null` | — | Data selecionada (controlado). `null` = nenhuma. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Primeiro dia da semana: 0 = domingo (padrão), 1 = segunda… |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão **Date Picker Dialog** do WAI-ARIA APG. O diálogo tem `role="dialog"`, `aria-modal="true"` e é rotulado pelo mês exibido, que fica numa região `aria-live`. A grade usa `role="grid"` com cabeçalhos de dia da semana (nome completo para leitores de tela), roving tabindex, `aria-selected` no dia escolhido, `aria-current="date"` em hoje e `aria-disabled` nos dias indisponíveis.

| Teclas | Ação |
| --- | --- |
| `Alt` + `↓` | No campo: abre o calendário. |
| `Enter` | No botão: abre o calendário. No dia: seleciona, fecha e devolve o foco ao botão. |
| `Space` | No dia: seleciona e fecha. |
| `←` + `→` | Dia anterior / próximo. |
| `↑` + `↓` | Mesmo dia da semana anterior / seguinte. |
| `Home` + `End` | Primeiro / último dia da semana. |
| `PageUp` + `PageDown` | Mês anterior / próximo. |
| `Shift` + `PageUp` | Ano anterior (Shift + PageDown: próximo ano). |
| `Tab` | Circula entre os botões do cabeçalho, a grade e "Hoje" — o foco fica preso no diálogo. |
| `Escape` | Fecha sem alterar e devolve o foco ao botão. |

- **1.3.1** — Grade com cabeçalhos de coluna e nomes completos de cada dia.
- **2.1.1** — Toda a seleção funciona pelo teclado, inclusive digitando a data.
- **2.4.3** — Foco entra no dia ativo ao abrir e volta ao botão ao fechar.
- **3.3.1** — Datas inválidas ou indisponíveis geram mensagem de erro vinculada ao campo.
- **3.3.2** — O formato esperado é anunciado como descrição do campo.
- **4.1.2** — Estados expostos com `aria-selected`, `aria-current`, `aria-disabled` e `aria-expanded`.
