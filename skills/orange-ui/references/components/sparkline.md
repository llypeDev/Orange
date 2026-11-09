# Sparkline

Tendência em miniatura, em linha com o texto: acompanha um número (Stat, tabelas) e descreve a tendência em palavras.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Sparkline } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/sparkline (em inglês: https://orange.llypedev.com.br/en/components/sparkline)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-sparkline--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Sparkline

## Boas práticas

- Use ao lado de um número (**Stat**, uma linha de tabela) para mostrar a forma da tendência. Sem eixos, ele não serve para ler valores — para isso use **LineChart**. Veja a diretriz Visualização de dados.
- O `label` é obrigatório e diz a tendência em palavras, com número e período: “Vendas subiram 18% em 7 dias” — não “gráfico de vendas”.
- A linha fica no neutro e o ponto final no acento: o período atual é o que importa. Para outra cor, use um token viz em color.

## Anatomia

- **Linha** — 2px, em --or-color-viz-other (≥ 3:1 contra o fundo). Os valores ocupam toda a altura.
- **Ponto final** — O valor atual, no acento, com anel de fundo (showEndPoint, padrão).
- **Mínimo e máximo** — Pontos discretos opcionais (showMinMax).

## Exemplos

### Em cartões de métrica

Dentro do Stat, ao lado da variação.

```tsx
import { Card, CardBody, CardHeader, Sparkline, Stat } from '@orangesys/ui'

export default function StatCards() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        width: '100%',
      }}
    >
      <Card>
        <CardHeader eyebrow="Loja virtual" title="Últimos 7 dias" headingLevel={4} />
        <CardBody>
          <Stat
            label="Vendas"
            value="R$ 215 mil"
            delta="18%"
            trend="increase"
            help={
              <Sparkline
                data={[182, 176, 195, 201, 188, 214, 215]}
                label="Vendas subiram 18% em 7 dias"
              />
            }
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Operação" title="Últimos 7 dias" headingLevel={4} />
        <CardBody>
          <Stat
            label="Pedidos"
            value={1284}
            delta="4%"
            trend="increase"
            help={
              <Sparkline
                data={[171, 180, 176, 189, 185, 190, 193]}
                label="Pedidos subiram 4% em 7 dias, de 171 para 193 por dia"
              />
            }
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Atendimento" title="Últimos 7 dias" headingLevel={4} />
        <CardBody>
          <Stat
            label="Cancelamentos"
            value="2,4%"
            delta="0,6 p.p."
            trend="decrease"
            deltaTone="positive"
            help={
              <Sparkline
                data={[3.0, 2.9, 2.8, 2.8, 2.6, 2.5, 2.4]}
                label="Cancelamentos caíram de 3% para 2,4% em 7 dias"
              />
            }
          />
        </CardBody>
      </Card>
    </div>
  )
}
```

### Variações

Padrão, com mínimo e máximo, e com área e outra cor.

```tsx
import { Sparkline } from '@orangesys/ui'

const visitas = [1820, 1764, 1953, 2018, 1889, 2146, 2213, 2198, 2324, 2411, 2302, 2559]

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32 }}>
      <Sparkline data={visitas} label="Visitas subiram 41% em 12 semanas" />
      <Sparkline
        data={visitas}
        label="Visitas subiram 41% em 12 semanas; mínima na semana 2, máxima na semana 12"
        width={160}
        height={40}
        showMinMax
      />
      <Sparkline
        data={visitas}
        label="Visitas subiram 41% em 12 semanas"
        width={160}
        height={40}
        area
        color="var(--or-color-viz-2)"
      />
    </div>
  )
}
```

### Em linha com o texto

```tsx
import { Sparkline } from '@orangesys/ui'

const produtos = [
  { nome: 'Fone sem fio', vendas: [42, 38, 51, 47, 55, 61, 66], resumo: 'subiu 57% na semana' },
  { nome: 'Garrafa térmica', vendas: [31, 33, 30, 29, 27, 26, 24], resumo: 'caiu 23% na semana' },
  { nome: 'Mochila urbana', vendas: [18, 19, 18, 20, 19, 18, 19], resumo: 'estável na semana' },
]

export default function InText() {
  return (
    <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
      {produtos.map((p) => (
        <li key={p.nome} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 16px' }}>
          <span style={{ minWidth: 140 }}>{p.nome}</span>
          <Sparkline
            data={p.vendas}
            label={`Vendas de ${p.nome}: ${p.resumo}`}
            width={80}
            height={24}
          />
          <span style={{ color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>
            {p.resumo}
          </span>
        </li>
      ))}
    </ul>
  )
}
```

## Movimento

- **Entrada** — Uma vez, ao entrar na tela (useInView): a linha se desenha (stroke-dashoffset, --or-duration-reveal, --or-ease-in-out) e os pontos surgem no fim (--or-ease-bounce).
- **Movimento reduzido** — Aparece desenhado, sem animação.

## Props

### `Sparkline`

Tendência em miniatura, para usar junto de um número (Stat, tabelas, listas).
Não interativa: sem eixos nem legenda — o `label` diz em palavras o que a
linha mostra. Desenha-se uma vez ao entrar na tela.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `data` (obrigatória) | `number[]` | — | Valores em ordem (o último é o período atual). |
| `label` (obrigatória) | `string` | — | Resumo da tendência em palavras — é o texto alternativo do gráfico (ex.: "Vendas subiram 18% em 7 dias"). Obrigatório. |
| `area` | `boolean` | `false` | Preenche a área sob a linha. |
| `color` | `string` | `var(--or-color-viz-other)` | Cor da linha. Padrão: o neutro `--or-color-viz-other` (o ponto final usa o acento). |
| `height` | `number` | `28` | Altura em px. Padrão: 28. |
| `showEndPoint` | `boolean` | `true` | Ponto no último valor, no acento. Padrão: `true`. |
| `showMinMax` | `boolean` | `false` | Marca o menor e o maior valor. |
| `width` | `number` | `96` | Largura em px. Padrão: 96. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Renderiza um `<span role="img">` com `aria-label` igual ao `label`; o SVG interno é `aria-hidden`. Por ser conteúdo em linha (cabe dentro de `Stat`, células e parágrafos) e não interativo, não usa `<figure>`, foco nem a tabela “Ver dados” dos gráficos maiores: o rótulo é a alternativa em texto — então ele precisa dizer a conclusão.

- **1.1.1** — Texto alternativo obrigatório (label) com a tendência.
- **1.4.11** — Linha e ponto com ≥ 3:1 contra o fundo.
- **2.3.3** — Sem animação com prefers-reduced-motion.
