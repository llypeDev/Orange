# LineChart

Gráfico de linhas acessível em SVG puro: evolução no tempo de uma ou mais séries, cada uma com cor, traço e marcador próprios.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { LineChart } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/line-chart (em inglês: https://orange.llypedev.com.br/en/components/line-chart)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-linechart--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/LineChart

## Boas práticas

- Linhas mostram evolução contínua no tempo. Para poucos períodos discretos ou para comparar categorias use **BarChart**. As regras vêm da diretriz Visualização de dados.
- Cada série ganha cor, traço e marcador próprios, na ordem: a forma reforça a cor. Até cinco séries; acima disso, agrupe ou divida em gráficos menores.
- Dado ausente é `null`: a linha se interrompe em vez de inventar um valor — e a tabela mostra “sem dados”.
- O eixo de valores segue os dados; use `includeZero` quando a distância até o zero importa. `area` (uma série) sempre parte do zero.

- Faça: Rótulo direto no fim de cada linha (endLabels), além da legenda.
- Faça: Um resumo (summary) com a conclusão: “o app encosta no site em junho”.
- Evite: Dois eixos Y para medidas de escalas diferentes: faça dois gráficos.
- Evite: Área em várias séries sobrepostas — uma esconde a outra.

## Anatomia

- **Título, subtítulo e legenda** — Iguais aos do BarChart. Na legenda, cada série mostra o traço e o marcador que usa no gráfico.
- **Linhas e marcadores** — Linhas de 2px; marcadores de 9px (círculo, quadrado, triângulo, losango, triângulo invertido) com anel de 2px no fundo. Com muitos pontos, só o último e os isolados.
- **Cruz e dica** — A cruz vertical encontra o mês mais próximo do ponteiro; a dica lista todas as séries ali.
- **Rótulo no fim** — O último valor de cada linha, em cor de texto. Se dois rótulos colidirem, o segundo sai (fica na legenda e na dica).

## Exemplos

### Duas séries

Ticket médio por canal. Foque o gráfico: ← → percorrem os meses, ↑ ↓ trocam a série.

```tsx
import { LineChart } from '@orangesys/ui'

export default function AverageTicket() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        title="Ticket médio por canal"
        description="R$ por pedido · 1º semestre de 2026"
        summary="O ticket do site sobe de R$ 152 para R$ 168; o do app cresce todo mês e encosta no site em junho."
        source="Fonte: painel de vendas (dados fictícios)."
        categoryLabel="Mês"
        valueFormat={{ style: 'currency', currency: 'BRL' }}
        series={[
          { key: 'site', label: 'Site' },
          { key: 'app', label: 'App' },
        ]}
        data={[
          { label: 'jan', values: { site: 152.4, app: 131.9 } },
          { label: 'fev', values: { site: 158.1, app: 136.2 } },
          { label: 'mar', values: { site: 149.7, app: 141.0 } },
          { label: 'abr', values: { site: 163.2, app: 146.5 } },
          { label: 'mai', values: { site: 171.0, app: 152.8 } },
          { label: 'jun', values: { site: 168.4, app: 159.3 } },
        ]}
      />
    </div>
  )
}
```

### Área

Uma série com área: um véu de 14% da cor, partindo do zero.

```tsx
import { LineChart } from '@orangesys/ui'

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const receita = [
  184000, 176500, 195300, 201800, 188900, 214600, 221300, 219800, 232400, 241100, 255900, 268700,
]

export default function MonthlyRevenue() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        title="Receita mensal"
        description="R$ · 2026"
        area
        categoryLabel="Mês"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={[{ key: 'receita', label: 'Receita' }]}
        data={meses.map((label, i) => ({ label, values: { receita: receita[i] } }))}
      />
    </div>
  )
}
```

### Lacunas

null interrompe a linha do marketplace na quarta.

```tsx
import { LineChart } from '@orangesys/ui'

export default function WithGaps() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        title="Pedidos por dia"
        description="Unidades · a integração do marketplace ficou fora do ar na quarta"
        categoryLabel="Dia"
        height={240}
        series={[
          { key: 'site', label: 'Site' },
          { key: 'app', label: 'App' },
          { key: 'marketplace', label: 'Marketplace' },
        ]}
        data={[
          { label: 'seg', values: { site: 214, app: 162, marketplace: 120 } },
          { label: 'ter', values: { site: 231, app: 170, marketplace: 134 } },
          { label: 'qua', values: { site: 226, app: 181, marketplace: null } },
          { label: 'qui', values: { site: 248, app: 176, marketplace: 141 } },
          { label: 'sex', values: { site: 273, app: 198, marketplace: 158 } },
          { label: 'sáb', values: { site: 301, app: 227, marketplace: 176 } },
          { label: 'dom', values: { site: 262, app: 214, marketplace: 149 } },
        ]}
      />
    </div>
  )
}
```

## Movimento

- **Entrada** — Uma vez, quando o gráfico entra na tela (useInView): cada linha se desenha da esquerda para a direita (stroke-dashoffset 1 → 0 com pathLength=1, numa máscara, para funcionar também nas tracejadas). 1,5 × --or-duration-reveal, --or-ease-in-out; séries escalonadas com --or-stagger.
- **Marcadores, área e rótulos** — Os marcadores surgem quando a linha passa por eles (--or-ease-bounce); a área e o rótulo do fim aparecem por opacidade.
- **Cruz e dica** — Deslizam até o novo mês em --or-duration-fast; as outras séries recuam (opacidade).
- **Movimento reduzido** — Sem máscara nem animação: as linhas já aparecem desenhadas.

## Props

### `LineChart`

Gráfico de linhas acessível, em SVG puro: evolução no tempo de uma ou mais
séries, cada uma com cor, traço e marcador próprios (nunca só a cor). Lacunas
(`null`) interrompem a linha. Tabela de dados alternativa e exploração por teclado.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `data` (obrigatória) | `ChartDatum[]` | — | Um ponto do eixo X por entrada (mês, data em texto): `{ label: 'mar', values: { site: 180 } }`. `null` = sem dado (a linha se interrompe). |
| `series` (obrigatória) | `ChartSeries[]` | — | Séries na ordem da legenda. Cada uma ganha cor, traço e marcador próprios. |
| `title` (obrigatória) | `string` | — | Título do gráfico: diz o quê. Vira o `<figcaption>` e o nome do gráfico. |
| `area` | `boolean` | `false` | Preenche a área sob a linha (só com uma série). Inclui o zero no eixo. |
| `categoryLabel` | `string` | — | Cabeçalho da coluna de categorias na tabela de dados (ex.: "Mês"). |
| `defaultShowData` | `boolean` | — | Começa com a tabela de dados visível. |
| `description` | `ReactNode` | — | Subtítulo visível: quando e em que unidade ("R$ mil por mês · 2026"). |
| `endLabels` | `boolean` | `true` | Escreve o último valor de cada linha no fim dela (quando os rótulos não colidem). Padrão: `true`. |
| `height` | `number` | — | Altura da área do gráfico em px, incluindo os rótulos dos eixos. |
| `hideCaption` | `boolean` | `false` | Esconde o título e o subtítulo visualmente (continuam no `<figcaption>`). |
| `includeZero` | `boolean` | — | Começa o eixo de valores em zero. Padrão: só com `area`. |
| `source` | `ReactNode` | — | Fonte dos dados, abaixo do gráfico. |
| `summary` | `string` | — | Resumo em texto para leitores de tela (a conclusão). Padrão: gerado a partir dos dados. |
| `valueFormat` | `((value: number) => string) \| NumberFormatOptions` | — | Formato dos números: função ou opções do `Intl.NumberFormat` (ex.: `{ style: 'currency', currency: 'BRL' }`). |
| `variant` | `"outline" \| "plain"` | `outline` | `outline` (padrão): borda de 1px e respiro interno. `plain`: sem moldura, para cartões. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Mesma estrutura do BarChart: `<figure>` nomeado pelo título, SVG com `role="img"` e resumo (período, séries, maior e menor valor ou o seu `summary`), tabela sempre presente para leitores de tela e anúncio em `role="status"` ao explorar pelo teclado: “mar · App: R$ 141,00”.

| Teclas | Ação |
| --- | --- |
| `Tab` | Foca a área do gráfico. |
| `←` + `→` | Ponto anterior/próximo no eixo X. |
| `↑` + `↓` | Série anterior/próxima no mesmo ponto. |
| `Home` + `End` | Primeiro/último ponto. |
| `Esc` | Limpa o destaque e fecha a dica. |

- **1.1.1** — Resumo no SVG e tabela com os dados completos.
- **1.4.1** — Séries distinguidas por cor, traço e forma do marcador.
- **1.4.11** — Linhas com ≥ 3:1 contra o fundo nos dois temas.
- **1.4.13** — A dica não bloqueia o ponteiro e fecha com Esc.
- **2.1.1** — Todos os pontos alcançáveis pelo teclado.
- **4.1.3** — Ponto em destaque anunciado por role="status".
