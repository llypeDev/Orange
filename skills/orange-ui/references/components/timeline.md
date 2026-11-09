# Timeline

Sequência cronológica de eventos com datas, marcadores por tom e destaque do evento atual.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Timeline, TimelineItem } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/timeline (em inglês: https://orange.llypedev.com.br/en/components/timeline)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-timeline--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Timeline

## Boas práticas

- Use para eventos já ocorridos ou previstos em ordem: histórico de pedido, changelog, atividade de um chamado.
- Escolha uma direção e mantenha-a: cronológica (mais antigo primeiro) para processos, reversa (mais recente primeiro) para feeds de atividade.
- Marque **current** em um único evento, quando houver uma etapa em andamento. Para fluxos que a pessoa percorre (formulários em etapas), use Stepper.
- A cor do marcador reforça o título — "Falha no build" já diz que algo deu errado. Não dependa só do tom.

## Exemplos

### Histórico de pedido

Datas AAAA-MM-DD são lidas como data local e formatadas no idioma do provider. dateLabel substitui o texto da data.

```tsx
import { Timeline, TimelineItem } from '@orangesys/ui'

export default function OrderHistory() {
  return (
    <Timeline aria-label="Histórico do pedido #4821">
      <TimelineItem date="2026-11-02" title="Pedido realizado" tone="success" description="Pagamento aprovado." />
      <TimelineItem date="2026-11-03" title="Nota fiscal emitida" tone="success" />
      <TimelineItem
        date="2026-11-04"
        title="Saiu para entrega"
        current
        description="O entregador está a caminho do endereço cadastrado."
      />
      <TimelineItem dateLabel="Previsto para 6 de nov." title="Entregue" />
    </Timeline>
  )
}
```

### Changelog com ícones

icon aumenta o marcador; dateFormat na Timeline vale para todos os itens.

```tsx
import { Icon, Timeline, TimelineItem } from '@orangesys/ui'

export default function Changelog() {
  return (
    <Timeline aria-label="Atividade do repositório" dateFormat={{ dateStyle: 'medium', timeStyle: 'short' }}>
      <TimelineItem
        date={new Date(2026, 9, 28, 14, 5)}
        title="v3.2.0 publicada"
        tone="accent"
        icon={<Icon name="rocket" />}
        description="Novo componente TreeView e melhorias de acessibilidade no Combobox."
      />
      <TimelineItem
        date={new Date(2026, 9, 27, 18, 40)}
        title="Testes de regressão aprovados"
        tone="success"
        icon={<Icon name="check" />}
      />
      <TimelineItem
        date={new Date(2026, 9, 27, 11, 2)}
        title="Falha no build de documentação"
        tone="danger"
        icon={<Icon name="alert-triangle" />}
        description="Corrigida no commit seguinte."
      />
      <TimelineItem date={new Date(2026, 9, 26, 9, 12)} title="Revisão solicitada" icon={<Icon name="users" />} />
    </Timeline>
  )
}
```

### Alternada

Eventos alternam dos dois lados da linha. Em contêineres estreitos, volta ao layout padrão.

```tsx
import { Timeline, TimelineItem } from '@orangesys/ui'

export default function Alternate() {
  return (
    <Timeline variant="alternate" dateFormat={{ year: 'numeric' }} style={{ width: '100%' }}>
      <TimelineItem date="2019-03-01" title="Fundação" description="Três pessoas e um protótipo de conciliação bancária." />
      <TimelineItem date="2021-06-01" title="Primeiros mil clientes" description="Chegamos a todas as regiões do país." />
      <TimelineItem date="2023-09-01" title="Série A" tone="accent" description="Investimento para expandir o time de produto." />
      <TimelineItem date="2026-01-01" title="12 mil clientes" current description="Lançamento do módulo de despesas." />
    </Timeline>
  )
}
```

### Conteúdo adicional

children aparece abaixo da descrição — anexos, ações, citações. titleAs ajusta o nível do título.

```tsx
import { Button, Icon, Timeline, TimelineItem } from '@orangesys/ui'

export default function WithContent() {
  return (
    <Timeline aria-label="Atividade do chamado" dateFormat={{ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }}>
      <TimelineItem
        date={new Date(2026, 10, 3, 9, 30)}
        title="Ana Souza respondeu"
        titleAs="h4"
        description="Enviamos o arquivo corrigido. Pode confirmar se o relatório abre normalmente?"
      >
        <div style={{ marginTop: 8 }}>
          <Button variant="outline" size="sm" startIcon={<Icon name="file" />}>
            relatorio-outubro.pdf
          </Button>
        </div>
      </TimelineItem>
      <TimelineItem
        date={new Date(2026, 10, 2, 16, 12)}
        title="Prioridade alterada para alta"
        titleAs="h4"
        tone="warning"
      />
      <TimelineItem
        date={new Date(2026, 10, 2, 15, 48)}
        title="Chamado aberto por Bruno Lima"
        titleAs="h4"
        description="O relatório mensal não abre no aplicativo."
      />
    </Timeline>
  )
}
```

### Entrada animada

Com animated, os eventos entram escalonados quando a timeline aparece na tela e a linha é desenhada. O evento atual pulsa.

```tsx
import { Button, Icon, Stack, Timeline, TimelineItem } from '@orangesys/ui'
import { useState } from 'react'

export default function Animated() {
  // Trocar a key remonta a timeline e repete a entrada.
  const [rodada, setRodada] = useState(0)

  return (
    <Stack gap={5} style={{ width: '100%' }}>
      <div>
        <Button size="sm" variant="outline" startIcon={<Icon name="refresh" />} onClick={() => setRodada((r) => r + 1)}>
          Repetir animação
        </Button>
      </div>
      <Timeline key={rodada} animated aria-label="Deploy da versão 3.2.0" dateFormat={{ timeStyle: 'short' }}>
        <TimelineItem date={new Date(2026, 10, 4, 14, 2)} title="Build iniciado" tone="success" />
        <TimelineItem
          date={new Date(2026, 10, 4, 14, 4)}
          title="Testes aprovados"
          tone="success"
          description="312 testes em 1 min 48 s."
        />
        <TimelineItem
          date={new Date(2026, 10, 4, 14, 5)}
          title="Publicando em São Paulo"
          current
          description="Ao vivo — 2 de 3 servidores atualizados."
        />
        <TimelineItem dateLabel="Previsto para 14:08" title="Disponível para todos" />
      </Timeline>
    </Stack>
  )
}
```

## Props

### `Timeline`

Sequência cronológica de eventos — histórico de um pedido, changelog,
etapas de um processo. Renderiza um `<ol>` com datas em `<time>`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `animated` | `boolean` | `false` | Os eventos entram escalonados (80ms entre eles) quando a timeline aparece na tela, e a linha vertical é "desenhada". Desligado com movimento reduzido. |
| `dateFormat` | `DateTimeFormatOptions` | — | Formato das datas dos itens (`Intl.DateTimeFormat`). Padrão: `{ dateStyle: 'medium' }`. |
| `variant` | `"default" \| "alternate"` | `default` | `default`: linha à esquerda. `alternate`: eventos alternam dos dois lados da linha (vira `default` em contêineres estreitos). |

Repassa também os atributos nativos (`OlHTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `TimelineItem`

Evento de uma `Timeline`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` (obrigatória) | `ReactNode` | — | Título do evento. |
| `current` | `boolean` | `false` | Marca o evento atual: destaque visual e `aria-current="step"`. |
| `date` | `TimelineDate` | — | Data do evento. Strings `AAAA-MM-DD` são tratadas como data local (sem deslocamento de fuso). Vira `<time dateTime>` formatado no idioma do provider. |
| `dateFormat` | `DateTimeFormatOptions` | — | Formato desta data; sobrescreve o `dateFormat` da `Timeline`. |
| `dateLabel` | `ReactNode` | — | Texto exibido no lugar da data formatada (ex.: "Agora", "Previsto"). |
| `description` | `ReactNode` | — | Texto de apoio abaixo do título. |
| `icon` | `ReactNode` | — | Ícone dentro do marcador (marcador maior). |
| `pulse` | `boolean` | — | Anel pulsando no marcador, para eventos "ao vivo" (em andamento). Padrão: igual a `current`. O estado nunca depende só do pulso. |
| `titleAs` | `ElementType` | `p` | Elemento do título. Padrão: `p`. Use `h3`/`h4` se os eventos forem seções. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "accent"` | `neutral` | Cor do marcador quadrado. Padrão: `neutral` (contorno). |

Repassa também os atributos nativos (`LiHTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TimelineDate`:

```ts
export type TimelineDate = Date | string | number
```

`TimelineTone`:

```ts
export type TimelineTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
```

`TimelineVariant`:

```ts
export type TimelineVariant = 'default' | 'alternate'
```

## Movimento

- **Entrada (animated)** — Cada evento sobe 24px e aparece — 600ms, ease-out, 80ms entre eventos (stagger).
- **Linha vertical** — É desenhada de cima para baixo (scaleY 0 → 1) logo depois do evento — 600ms, ease-out.
- **Marcador** — Surge com um pequeno "pop" (escala 0.4 → 1) — 250ms, ease-bounce.
- **Evento atual** — Anel pulsando no marcador (or-pulse), na cor do tom — ciclo de 2.4s. pulse={false} desliga; o estado também é dado por aria-current e pelo destaque visual.
- **Movimento reduzido** — Nada é escondido nem pulsa: os eventos aparecem direto.

## Acessibilidade

A Timeline é um `<ol>` com `role="list"` explícito, então leitores de tela anunciam a quantidade e a posição de cada evento. Datas usam `<time dateTime>` com valor legível por máquina. O evento atual recebe `aria-current="step"`. Marcadores, linhas e ícones são decorativos.

- **1.3.1** — Ordem dos eventos exposta pela lista ordenada; datas com dateTime.
- **1.4.1** — O tom do marcador nunca é a única forma de transmitir o estado.
- **1.4.10** — A variante alternada vira coluna única em contêineres estreitos.
- **4.1.2** — Evento atual exposto com aria-current="step".
