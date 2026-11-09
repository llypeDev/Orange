# DateRangePicker

Campo de período com duas datas mascaradas, calendário de período em diálogo e atalhos como "Últimos 7 dias".

- Categoria: Formulários · Status: estável
- Importação: `import { DateRangePicker, RangeCalendar } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/date-range-picker (em inglês: https://orange.llypedev.com.br/en/components/date-range-picker)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-daterangepicker--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/DateRangePicker

## Boas práticas

- Use para períodos com início e fim: filtros de relatório, reservas, vigências e férias. Para uma data só, use o DatePicker.
- Em filtros de relatório, ofereça `presets` ("Últimos 7 dias", "Mês passado") — a maioria das consultas cabe em um clique. Combine com `max` em hoje para não sugerir datas futuras.
- `minLength` e `maxLength` contam os dias **entre** as datas (fim − início), como noites de hospedagem: 10/03 → 12/03 = 2. Explique a regra na `description`.
- Fim antes do início, datas inválidas e períodos fora dos limites mostram um erro automático e emitem a ponta como `null`. Use `error` para regras de negócio, como "Informe o início e o fim da vigência".

- Faça: Rótulo que diz para que serve o período e a regra explicada.
- Evite: Período sem rótulo visível, dependendo só dos placeholders.

## Anatomia

- **Grupo de campos** — Um só controle com role="group", nomeado pelo rótulo. Dentro, "Data inicial" e "Data final", cada um com máscara do idioma.
- **Botão de calendário** — Abre o diálogo. Com período, o nome acessível inclui as datas: "Alterar período, 10 de março de 2026 a 15 de março de 2026".
- **Atalhos** — Lista de botões ao lado do calendário (acima, no celular). O atalho do período atual fica marcado; os que violam min/max ou o comprimento ficam desabilitados.
- **Calendário (RangeCalendar)** — Dois meses em telas largas, um no celular. Início e fim preenchidos em laranja com cantos próprios (superior esquerdo / inferior direito); a faixa entre eles é preenchida em laranja suave; a prévia tem bordas tracejadas.

## Exemplos

### Básico

Digite as duas datas ou abra o calendário pelo botão (ou Alt + ↓ em qualquer campo).

```tsx
import { DateRangePicker } from '@orangesys/ui'

export default function Basic() {
  return (
    <DateRangePicker
      label="Período da campanha"
      description="Digite as datas ou escolha no calendário."
    />
  )
}
```

### Filtro de relatório com atalhos

Atalhos prontos (chaves como "last7Days") e um próprio ({ label, range }); max em hoje desabilita o futuro.

```tsx
import { DateRangePicker, Text, type DateRange } from '@orangesys/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const hoje = new Date()
const ano = hoje.getFullYear()
const trimestre = Math.floor(hoje.getMonth() / 3)

export default function SalesReport() {
  const [periodo, setPeriodo] = useState<DateRange>({
    start: new Date(ano, hoje.getMonth(), hoje.getDate() - 6),
    end: hoje,
  })
  const dias =
    periodo.start && periodo.end
      ? Math.round((periodo.end.getTime() - periodo.start.getTime()) / DIA) + 1
      : 0

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <DateRangePicker
        label="Período do relatório de vendas"
        description="Pedidos faturados até hoje."
        value={periodo}
        onChange={setPeriodo}
        max={hoje}
        weekStartsOn={1}
        presets={[
          'today',
          'last7Days',
          'last30Days',
          'thisMonth',
          'lastMonth',
          {
            label: 'Trimestre anterior',
            range: () => ({
              start: new Date(ano, (trimestre - 1) * 3, 1),
              end: new Date(ano, trimestre * 3, 0),
            }),
          },
        ]}
      />
      <Text size="sm" tone="muted" aria-live="polite">
        {dias > 0
          ? `Exibindo vendas de ${dias} ${dias === 1 ? 'dia' : 'dias'}.`
          : 'Escolha o período para atualizar o relatório.'}
      </Text>
    </div>
  )
}
```

### Reserva de hotel

min em hoje bloqueia datas passadas; minLength 1 exige pelo menos uma noite e maxLength 14 limita a estadia. Depois do check-in, as datas fora da regra ficam desabilitadas.

```tsx
import { DateRangePicker, Text, type DateRange } from '@orangesys/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const DIARIA = 420
const hoje = new Date()
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function HotelBooking() {
  const [estadia, setEstadia] = useState<DateRange>({ start: null, end: null })
  const noites =
    estadia.start && estadia.end
      ? Math.round((estadia.end.getTime() - estadia.start.getTime()) / DIA)
      : 0

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <DateRangePicker
        label="Check-in e check-out"
        description="Mínimo de 1 noite e máximo de 14. Datas passadas ficam indisponíveis."
        name="estadia"
        value={estadia}
        onChange={setEstadia}
        min={hoje}
        minLength={1}
        maxLength={14}
        weekStartsOn={1}
        required
      />
      <Text size="sm" tone="muted" aria-live="polite">
        {noites > 0
          ? `${noites} ${noites === 1 ? 'noite' : 'noites'} · ${moeda.format(noites * DIARIA)} (diária de ${moeda.format(DIARIA)})`
          : 'Escolha as datas da estadia.'}
      </Text>
    </div>
  )
}
```

### Validação e estados

Erro de negócio via error ao enviar, erro automático de ordem, somente leitura e desabilitado. Com name, o formulário recebe vigencia[start] e vigencia[end] como aaaa-mm-dd.

```tsx
import { Button, DateRangePicker, type DateRange } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [vigencia, setVigencia] = useState<DateRange>({ start: null, end: null })
  const [enviado, setEnviado] = useState(false)

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <DateRangePicker
        label="Vigência do contrato"
        description="Tente digitar uma data final anterior à inicial."
        required
        name="vigencia"
        value={vigencia}
        onChange={setVigencia}
        error={
          enviado && (!vigencia.start || !vigencia.end)
            ? 'Informe o início e o fim da vigência.'
            : undefined
        }
      />
      <DateRangePicker
        label="Período de apuração"
        defaultValue={{ start: new Date(2026, 9, 1), end: new Date(2026, 9, 31) }}
        readOnly
      />
      <DateRangePicker label="Período de carência" disabled />
      <Button type="submit">Salvar contrato</Button>
    </form>
  )
}
```

### RangeCalendar standalone

A grade de período também é exportada para painéis e agendas, com a mesma navegação por teclado. Aqui, férias que começam e terminam em dias úteis.

```tsx
import { RangeCalendar, Text, type DateRange } from '@orangesys/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const hoje = new Date()
const ehFimDeSemana = (data: Date) => data.getDay() === 0 || data.getDay() === 6

export default function TeamVacation() {
  const [ferias, setFerias] = useState<DateRange | null>(null)
  const dias =
    ferias?.start && ferias.end
      ? Math.round((ferias.end.getTime() - ferias.start.getTime()) / DIA) + 1
      : 0

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <RangeCalendar
        aria-label="Férias da equipe de suporte"
        value={ferias}
        onChange={setFerias}
        min={hoje}
        maxLength={29}
        visibleMonths={2}
        weekStartsOn={1}
        isDateDisabled={ehFimDeSemana}
      />
      <Text size="sm" tone="muted">
        {dias > 0
          ? `${dias} dias corridos de férias, começando e terminando em dias úteis.`
          : 'Clique no primeiro e no último dia das férias (até 30 dias corridos).'}
      </Text>
    </div>
  )
}
```

## Movimento

- **Abrir o calendário** — Igual ao DatePicker: o diálogo entra com opacidade, 4px vindos do lado do campo e escala 0,98 → 1 · medium (250ms), ease-out.
- **Fechar** — Sai mais rápido pelo mesmo lado e fica inerte durante a saída (usePresence) · fast (160ms), ease-in-out.
- **Prévia da faixa** — Depois do início, cada dia que entra na faixa se preenche com scaleX 0 → 1 a partir do lado do início (da direita, se a prévia for para trás) · fast, ease-out.
- **Marcar início e fim** — A ponta escolhida entra com or-scale-in (0,6 → 1, com overshoot) · medium, ease-bounce. O atalho do período atual ganha o marcador quadrado com o mesmo pop.
- **Trocar de mês** — Como no Calendar: as grades deslizam 16px na direção com fade e os títulos fazem crossfade · medium, ease-out.
- **Erro de validação** — O controle treme uma vez quando a mensagem surge (or-shake) · slow (400ms).
- **Hover, foco e pressionar** — Fundo e cor dos dias, atalhos e botões · fast; dias, atalhos e o ícone do calendário afundam 1px · press (90ms).
- **Movimento reduzido** — Os tokens viram 0: a faixa, as pontas e o diálogo aparecem na hora — forma, cor e texto continuam indicando o estado.

## Props

### `DateRangePicker`

Campo de período: duas datas com máscara conforme o idioma dentro de um
só controle, um calendário de período em diálogo (um ou dois meses) e
atalhos opcionais ("Últimos 7 dias", "Mês passado").

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | — | Calendário aberto inicialmente (não controlado). |
| `defaultValue` | `DateRange` | `{ start: null, end: null }` | Período inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `disabled` | `boolean` | — | Desabilita os campos e o botão do calendário. |
| `error` | `ReactNode` | — | Mensagem de erro. Substitui a validação interna. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `isDateDisabled` | `((date: Date) => boolean)` | — | Desabilita datas específicas (feriados, fins de semana…). |
| `label` | `ReactNode` | — | Rótulo visível do campo (também nomeia o grupo dos dois campos). |
| `max` | `Date` | — | Última data permitida. |
| `maxLength` | `number` | — | Comprimento máximo em dias entre início e fim. |
| `min` | `Date` | — | Primeira data permitida. |
| `minLength` | `number` | — | Comprimento mínimo em dias entre início e fim (`fim − início`, como noites). |
| `name` | `string` | — | Envia o período no formulário em dois inputs ocultos, `name[start]` e `name[end]`, no formato ISO `aaaa-mm-dd`. |
| `onChange` | `((range: DateRange) => void)` | — | Chamado com o novo período. Cada ponta vira `null` enquanto estiver vazia, incompleta, inválida ou indisponível; o fim também vira `null` quando quebra a ordem (fim antes do início) ou os limites de comprimento. |
| `onOpenChange` | `((open: boolean) => void)` | — | — |
| `open` | `boolean` | — | Calendário aberto (controlado). |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `presets` | `(DateRangePreset \| DateRangePresetKey)[]` | — | Atalhos ao lado do calendário: chaves prontas (`'last7Days'`, `'thisMonth'`, `'lastMonth'`…) e/ou `{ label, range }` próprios. |
| `readOnly` | `boolean` | — | Somente leitura: os campos não editam e o calendário não abre. |
| `required` | `boolean` | — | Marca os dois campos como obrigatórios. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `DateRange` | — | Período (controlado). Use `{ start: null, end: null }` para vazio. |
| `visibleMonths` | `1 \| 2` | `2` | Meses lado a lado no calendário (em telas estreitas, sempre 1). Padrão: 2. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Primeiro dia da semana no calendário: 0 = domingo (padrão), 1 = segunda… |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `RangeCalendar`

Calendário de período: o primeiro clique (ou Enter) marca o início, o
segundo marca o fim, com prévia da faixa ao passar o mouse ou mover o foco.
Mesma navegação por teclado do `Calendar` (padrão "grid" do WAI-ARIA).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | `false` | Foca o dia ativo ao montar. |
| `defaultMonth` | `Date` | — | Mês exibido inicialmente quando não há valor. Padrão: mês atual. |
| `defaultValue` | `DateRange \| null` | `null` | Período inicial (não controlado). |
| `isDateDisabled` | `((date: Date) => boolean)` | — | Desabilita datas específicas (feriados, fins de semana…). |
| `max` | `Date` | — | Última data selecionável. |
| `maxLength` | `number` | — | Comprimento máximo em dias entre início e fim. |
| `min` | `Date` | — | Primeira data selecionável. |
| `minLength` | `number` | — | Comprimento mínimo em dias entre início e fim (`fim − início`, como noites). Depois de escolher o início, datas mais próximas ficam desabilitadas. |
| `onChange` | `((range: CompleteDateRange) => void)` | — | Chamado quando o período fica completo: o 1º clique/Enter marca o início e o 2º, o fim (se vier antes do início, as datas são trocadas). |
| `value` | `DateRange \| null` | — | Período selecionado (controlado). `null` = nenhum. |
| `visibleMonths` | `1 \| 2` | `1` | Meses lado a lado. Com `2`, telas estreitas (< 768px) continuam mostrando um mês só — sem rolagem horizontal. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Primeiro dia da semana: 0 = domingo (padrão), 1 = segunda… |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Os dois campos ficam num `role="group"` nomeado pelo rótulo, cada um com nome próprio ("Data inicial", "Data final") e o formato como descrição. O calendário abre num diálogo modal (padrão **Date Picker Dialog** do WAI-ARIA APG). Cada mês é uma `role="grid"` com `aria-multiselectable`; todos os dias do período têm `aria-selected`, e início e fim têm descrição acessível "início"/"fim" além da forma própria — a cor nunca é a única pista. Escolhas e o período final são anunciados numa região `role="status"`.

| Teclas | Ação |
| --- | --- |
| `Alt` + `↓` | Em qualquer campo: abre o calendário. |
| `Enter` | No dia: 1º marca o início, 2º marca o fim, fecha e devolve o foco ao botão. |
| `Space` | No dia: igual ao Enter. |
| `←` + `→` + `↑` + `↓` | Dia anterior / próximo / semana anterior / seguinte; com o início marcado, a prévia acompanha o foco. |
| `Home` + `End` | Primeiro / último dia da semana. |
| `PageUp` + `PageDown` | Mês anterior / próximo. |
| `Shift` + `PageUp` | Ano anterior (Shift + PageDown: próximo ano). |
| `Tab` | Circula entre atalhos, botões de mês e a grade — o foco fica preso no diálogo. |
| `Escape` | Fecha sem alterar e devolve o foco ao botão (no RangeCalendar sozinho, cancela o início pendente). |

- **1.3.1** — Grupo rotulado para os dois campos e grades com cabeçalhos e nomes completos de cada dia.
- **1.4.1** — Início e fim se distinguem pela forma (cantos) e pela descrição, não só pela cor.
- **1.4.10** — Um mês só e atalhos que quebram linha em telas estreitas: sem rolagem horizontal em 320px.
- **2.1.1** — Toda a seleção funciona pelo teclado, inclusive digitando as datas.
- **2.4.3** — O foco entra no dia ativo ao abrir e volta ao botão ao fechar.
- **3.3.1** — Fim antes do início, datas inválidas e comprimentos fora da regra geram mensagem vinculada aos campos.
- **4.1.3** — O início escolhido e o período selecionado são anunciados numa região de status.
