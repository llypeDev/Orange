# RelativeTime

Datas relativas ("há 5 minutos", "em 3 dias") no idioma do provider, em <time> e com atualização automática.

- Categoria: Utilitários · Status: estável
- Importação: `import { RelativeTime } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/relative-time (em inglês: https://orange.llypedev.com.br/en/components/relative-time)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-relativetime--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/RelativeTime

## Boas práticas

- Use datas relativas quando a proximidade importa mais que o instante exato: feeds de atividade, comentários, "atualizado há".
- Para datas antigas, o formato **auto** troca para a data absoluta depois de **threshold** dias — "há 4 meses" é menos útil que "12 de jun. de 2026".
- Quando o horário exato for decisivo (prazos, transações, registros de auditoria), use format="absolute" ou mostre as duas formas.
- O texto segue o idioma do OrangeProvider — troque o idioma da documentação (PT/EN) para ver os exemplos em inglês.

## Exemplos

### Feed de atividade

O texto se atualiza sozinho: "agora" vira "há 1 minuto" sem recarregar. Passe o mouse para ver a data completa.

```tsx
import { RelativeTime } from '@orangesys/ui'

const minutos = (n: number) => new Date(Date.now() - n * 60_000)

const atividades = [
  { quem: 'Ana Souza', acao: 'aprovou o pagamento de fornecedores', quando: minutos(0.2) },
  { quem: 'Bruno Lima', acao: 'comentou em "Fechamento de outubro"', quando: minutos(12) },
  { quem: 'Carla Mendes', acao: 'enviou 3 notas fiscais', quando: minutos(60 * 5) },
  { quem: 'Diego Rocha', acao: 'criou o projeto "Expansão Sul"', quando: minutos(60 * 26) },
]

export default function ActivityFeed() {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', width: '100%', maxWidth: 460 }}>
      {atividades.map((item) => (
        <li
          key={item.quem}
          style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--or-color-border)' }}
        >
          <span>
            <strong>{item.quem}</strong> {item.acao}
          </span>
          <RelativeTime date={item.quando} style={{ flexShrink: 0, color: 'var(--or-color-text-subtle)', fontSize: 13 }} />
        </li>
      ))}
    </ul>
  )
}
```

### Relativo até um limite

Com format="auto" (padrão), datas além de threshold dias aparecem no formato absoluto.

```tsx
import { RelativeTime } from '@orangesys/ui'

const dias = (n: number) => new Date(Date.now() - n * 86_400_000)

export default function AutoThreshold() {
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: 14 }}>
      <caption style={{ textAlign: 'left', paddingBottom: 8, color: 'var(--or-color-text-muted)' }}>
        Comentários do chamado (relativo até 7 dias)
      </caption>
      <tbody>
        {[0.1, 2, 6, 15, 120].map((n) => (
          <tr key={n} style={{ borderTop: '1px solid var(--or-color-border)' }}>
            <th scope="row" style={{ padding: '8px 24px 8px 0', textAlign: 'left', fontWeight: 500 }}>
              Comentário de {n < 1 ? 'hoje' : `${n} dias atrás`}
            </th>
            <td style={{ padding: '8px 0' }}>
              <RelativeTime date={dias(n)} threshold={7} absoluteFormat={{ dateStyle: 'medium' }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Datas futuras

Funciona nos dois sentidos: "em 2 horas", "amanhã", "próximo mês".

```tsx
import { RelativeTime } from '@orangesys/ui'

const daqui = (horas: number) => new Date(Date.now() + horas * 3_600_000)

const agenda = [
  { evento: 'Reunião de planejamento', quando: daqui(2) },
  { evento: 'Vencimento do relatório trimestral', quando: daqui(26) },
  { evento: 'Renovação do plano Pro', quando: daqui(24 * 40) },
]

export default function Upcoming() {
  return (
    <ul style={{ display: 'grid', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
      {agenda.map((item) => (
        <li key={item.evento}>
          {item.evento} — <RelativeTime date={item.quando} format="relative" style={{ fontWeight: 600 }} />
        </li>
      ))}
    </ul>
  )
}
```

### Estilos e formatos

numeric="auto" usa expressões naturais ("ontem"); relativeStyle encurta as unidades.

```tsx
import { RelativeTime } from '@orangesys/ui'

const ontem = new Date(Date.now() - 26 * 3_600_000)
const recente = new Date(Date.now() - 42 * 60_000)

export default function Styles() {
  return (
    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 24px', margin: 0, fontSize: 14 }}>
      <dt>numeric="auto" (padrão)</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={ontem} />
      </dd>
      <dt>numeric="always"</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={ontem} numeric="always" />
      </dd>
      <dt>relativeStyle="short"</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={recente} relativeStyle="short" />
      </dd>
      <dt>format="absolute"</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={recente} format="absolute" />
      </dd>
    </dl>
  )
}
```

## Props

### `RelativeTime`

Data em formato relativo ("há 5 minutos", "em 3 dias") com `Intl` no idioma
do provider. Renderiza `<time dateTime>` e se atualiza sozinha.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `date` (obrigatória) | `RelativeTimeDate` | — | Data de referência (Date, string ISO ou timestamp em ms). |
| `absoluteFormat` | `DateTimeFormatOptions` | — | Formato do texto absoluto. Padrão: `{ dateStyle: 'medium', timeStyle: 'short' }`. |
| `format` | `"auto" \| "relative" \| "absolute"` | `auto` | `relative` ("há 5 minutos"), `absolute` ("3 de nov. de 2026, 14:05") ou `auto` (relativo até `threshold` dias, depois absoluto). Padrão: `auto`. |
| `numeric` | `"auto" \| "always"` | `auto` | `auto` usa expressões como "ontem" e "agora"; `always` sempre usa números. Padrão: `auto`. |
| `relativeStyle` | `"long" \| "short" \| "narrow"` | `long` | Extensão do texto relativo: `long` ("há 5 minutos"), `short` ("há 5 min.") ou `narrow`. |
| `showTitle` | `boolean` | `true` | Mostra a data completa no `title` (dica ao passar o mouse). Padrão: `true`. |
| `threshold` | `number` | `7` | No formato `auto`, quantos dias o texto continua relativo. Padrão: `7`. |
| `updateInterval` | `number \| false` | — | Intervalo de atualização do texto em ms. Padrão: automático (mais frequente para datas recentes). Use `false` para não atualizar. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

- **Atualização do texto** — O texto novo ("agora" → "há 1 minuto") surge com fade de 20% a 100% — 250ms, ease-out. A primeira renderização não anima.
- **Leitores de tela** — Sem aria-live: as atualizações não são anunciadas nem interrompem a leitura.
- **Movimento reduzido** — O texto muda sem fade.

## Acessibilidade

Renderiza `<time dateTime="…">` com a data em ISO 8601, legível por máquinas. As atualizações periódicas são silenciosas (sem `aria-live`) para não interromper leitores de tela a cada minuto. O `title` com a data completa ajuda quem usa mouse, mas não aparece para teclado ou toque — por isso, quando a data exata importa, exiba-a no texto.

- **1.3.1** — Data exposta em formato legível por máquina no atributo dateTime.
- **2.2.2** — Atualizações discretas, sem animação nem anúncios automáticos.
- **3.1.2** — Texto gerado no idioma do provider (Intl.RelativeTimeFormat).
