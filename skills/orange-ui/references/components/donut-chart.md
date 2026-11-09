# DonutChart

Gráfico de rosca acessível em SVG puro: a participação de cada parte num todo, com o total no centro e legenda com valor e percentual.

- Categoria: Exibição de dados · Status: novo
- Importação: `import { DonutChart } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/donut-chart (em inglês: https://orange.llypedev.com.br/en/components/donut-chart)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-donutchart--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/DonutChart

## Boas práticas

- A rosca mostra partes de **um** todo num momento. Para comparar quantidades entre categorias use **BarChart** ou **BarList**; para partes de um todo ao longo do tempo, **BarChart** empilhado. As regras vêm da diretriz Visualização de dados.
- Até cinco fatias, com as cores `--or-color-viz-1…5` na ordem. O resto vira “Outros”, no fim, com `--or-color-viz-other`.
- Ordene as fatias da maior para a menor (com “Outros” por último): o desenho começa no topo e segue no sentido horário, na mesma ordem da legenda.
- Os percentuais são inteiros arredondados pelo maior resto: a legenda sempre soma 100%. O valor exato fica na legenda e na tabela “Ver dados”. Use `centerLabel` para dizer o que o total conta (“tickets”, “pedidos”).

- Faça: Escrever a conclusão em summary (“Seis em cada dez tickets já foram resolvidos”).
- Faça: Agrupar fatias pequenas em “Outros” com o neutro.
- Faça: Formatar com valueFormat (moeda, sem casas decimais em valores grandes).
- Evite: Mais de cinco fatias coloridas, ou fatias que não somam um todo (ex.: respostas de múltipla escolha).
- Evite: Comparar duas roscas lado a lado para ver variação: use barras.
- Evite: Valores negativos: a rosca só mostra partes positivas (negativos contam como zero).

## Anatomia

- **Título e subtítulo** — O <figcaption> da figura, como em BarChart e LineChart. hideCaption os esconde só visualmente.
- **Anel** — Fatias retas separadas por 2px de fundo (--or-chart-surface), a partir do topo, no sentido horário. O diâmetro é height (padrão 200px) e encolhe para caber.
- **Centro** — O total formatado (display bold) e centerLabel (padrão “Total”). Com uma fatia em destaque, mostra o percentual e o nome dela.
- **Legenda** — Ao lado do anel (abaixo, em telas estreitas): marca de cor, nome, valor e percentual, em colunas alinhadas.
- **Ver dados** — A tabela com valor, participação e a linha Total. Sempre presente para leitores de tela; o botão a mostra na tela.

## Exemplos

### Participação por canal

Passe o mouse numa fatia ou na legenda, ou foque o gráfico e use as setas.

```tsx
import { DonutChart } from '@orangesys/ui'

export default function SalesByChannel() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart
        title="Vendas por canal"
        description="R$ · março de 2026"
        source="Fonte: ERP de vendas (dados fictícios)."
        categoryLabel="Canal"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        data={[
          { label: 'Site', value: 48200 },
          { label: 'App', value: 39800 },
          { label: 'Lojas físicas', value: 24400 },
          { label: 'Marketplace', value: 12200 },
          // A partir da sexta fatia, agrupe em "Outros" com o neutro.
          { label: 'Outros', value: 3800, color: 'var(--or-color-viz-other)' },
        ]}
      />
    </div>
  )
}
```

### Contagens e resumo

Sem valueFormat, os números seguem o idioma. centerLabel diz o que o total conta e summary dá a conclusão ao leitor de tela.

```tsx
import { DonutChart } from '@orangesys/ui'

export default function TicketsByStatus() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart
        title="Tickets por status"
        description="Suporte · semana 44 de 2026"
        summary="Seis em cada dez tickets da semana já foram resolvidos; 42 seguem abertos."
        categoryLabel="Status"
        centerLabel="tickets"
        data={[
          { label: 'Resolvidos', value: 118 },
          { label: 'Abertos', value: 42 },
          { label: 'Em andamento', value: 31 },
          { label: 'Aguardando cliente', value: 9 },
        ]}
      />
    </div>
  )
}
```

### Em um cartão

variant="plain" e hideCaption quando o cartão já tem o título; --or-chart-surface com o fundo do cartão mantém o espaço entre as fatias.

```tsx
import type { CSSProperties } from 'react'
import { Card, CardBody, CardHeader, DonutChart } from '@orangesys/ui'

export default function InCard() {
  return (
    <Card
      variant="raised"
      style={
        { maxWidth: 440, '--or-chart-surface': 'var(--or-color-surface-raised)' } as CSSProperties
      }
    >
      <CardHeader title="Pedidos por forma de pagamento" description="Outubro de 2026" />
      <CardBody>
        <DonutChart
          title="Pedidos por forma de pagamento"
          hideCaption
          variant="plain"
          height={160}
          categoryLabel="Forma de pagamento"
          centerLabel="pedidos"
          data={[
            { label: 'Pix', value: 1478 },
            { label: 'Cartão de crédito', value: 996 },
            { label: 'Boleto', value: 386 },
            { label: 'Cartão de débito', value: 225 },
            { label: 'Outros', value: 129, color: 'var(--or-color-viz-other)' },
          ]}
        />
      </CardBody>
    </Card>
  )
}
```

## Movimento

- **Entrada** — Uma vez, quando o gráfico entra na tela (useInView): uma máscara varre o anel a partir do topo, no sentido horário (stroke-dashoffset, --or-duration-reveal × 1,5, --or-ease-in-out); o centro aparece em seguida (opacidade, --or-duration-medium).
- **Destaque** — A fatia ativa se afasta 4px do centro e as outras recuam (opacidade); no centro, o total dá lugar ao percentual da fatia — tudo em --or-duration-fast.
- **Movimento reduzido** — O anel aparece desenhado, sem varredura. O destaque continua indicando a fatia.

## Props

### `DonutChart`

Gráfico de rosca acessível, em SVG puro: a participação de cada parte num
todo ("Vendas por canal", "Tickets por status"). O total fica no centro e a
legenda traz valor e percentual de cada fatia. Tabela de dados alternativa e
exploração por teclado, como BarChart e LineChart.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `data` (obrigatória) | `DonutChartDatum[]` | — | Fatias na ordem do desenho (sentido horário, a partir do topo) e da legenda. |
| `title` (obrigatória) | `string` | — | Título do gráfico: diz o quê. Vira o `<figcaption>` e o nome do gráfico. |
| `categoryLabel` | `string` | — | Cabeçalho da coluna de categorias na tabela de dados (ex.: "Mês"). |
| `centerLabel` | `string` | — | Legenda pequena sob o total, no centro da rosca. Padrão: "Total". |
| `defaultShowData` | `boolean` | — | Começa com a tabela de dados visível. |
| `description` | `ReactNode` | — | Subtítulo visível: quando e em que unidade ("R$ mil por mês · 2026"). |
| `height` | `number` | — | Diâmetro da rosca em px. Encolhe para caber na largura disponível. Padrão: `200`. |
| `hideCaption` | `boolean` | `false` | Esconde o título e o subtítulo visualmente (continuam no `<figcaption>`). |
| `source` | `ReactNode` | — | Fonte dos dados, abaixo do gráfico. |
| `summary` | `string` | — | Resumo em texto para leitores de tela (a conclusão). Padrão: gerado a partir dos dados. |
| `valueFormat` | `((value: number) => string) \| NumberFormatOptions` | — | Formato dos números: função ou opções do `Intl.NumberFormat` (ex.: `{ style: 'currency', currency: 'BRL' }`). |
| `variant` | `"outline" \| "plain"` | `outline` | `outline` (padrão): borda de 1px e respiro interno. `plain`: sem moldura, para cartões. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`DonutChartDatum`:

```ts
/** Uma fatia da rosca. */
export interface DonutChartDatum {
  /** Nome da fatia: canal, status, forma de pagamento… */
  label: string
  /** Valor da fatia (≥ 0). A participação é calculada sobre a soma de todas. */
  value: number
  /**
   * Cor da fatia. Padrão: `--or-color-viz-1…5`, na ordem dos dados. Use
   * `--or-color-viz-other` para "Outros".
   */
  color?: string
}
```

## Acessibilidade

Renderiza um `<figure>` nomeado pelo título, como BarChart e LineChart. O SVG tem `role="img"` e um `aria-label` com o título e o resumo (“Total: R$ 128.400. Site: R$ 48.200 (38%), …”). A legenda é uma lista com nome, valor e percentual de cada fatia, e a tabela de dados fica sempre na árvore de acessibilidade — o botão “Ver dados” só a mostra na tela. O gráfico é **uma** parada de Tab (as fatias não são): as setas movem o destaque e uma região `role="status"` anuncia “Site: R$ 48.200 (38%)”. O destaque pelo ponteiro (fatia ou legenda) é só visual.

| Teclas | Ação |
| --- | --- |
| `Tab` | Foca o gráfico (e depois o botão Ver dados). |
| `→` + `↓` | Próxima fatia (sentido horário / próxima linha da legenda). |
| `←` + `↑` | Fatia anterior. |
| `Home` + `End` | Primeira/última fatia. |
| `Esc` | Limpa o destaque (também o do mouse). |

- **1.1.1** — Texto alternativo: título + resumo no SVG, legenda em texto e a tabela com os dados completos.
- **1.3.1** — Legenda como lista; tabela com <caption> e cabeçalhos de linha e coluna.
- **1.4.1** — Cor nunca sozinha: cada cor tem nome, valor e percentual na legenda, na mesma ordem do desenho.
- **1.4.11** — Cores categóricas com ≥ 3:1 contra o fundo nos dois temas (testado nos tokens).
- **1.4.13** — O destaque do ponteiro não cobre nada e fecha com Esc.
- **2.1.1** — Todas as fatias são alcançáveis pelo teclado.
- **2.3.3** — Sem animação com prefers-reduced-motion.
- **4.1.3** — Fatia em destaque anunciada por role="status".
