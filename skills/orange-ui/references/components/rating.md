# Rating

Avaliação por estrelas com rádios nativos, prévia no hover e modo somente leitura com frações.

- Categoria: Formulários · Status: estável
- Importação: `import { Rating } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/rating (em inglês: https://orange.llypedev.com.br/en/components/rating)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-rating--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Rating

## Boas práticas

- Use para opiniões rápidas e subjetivas (satisfação, qualidade). Para escolhas com significado preciso, prefira RadioGroup com rótulos.
- Dê nome a cada nota com `labels` ("Péssima" … "Excelente"): fica claro o que cada estrela significa e o texto aparece ao lado durante o hover.
- Para exibir médias, use `readOnly` — aceita frações (4,5) e é anunciado como "4,5 de 5 estrelas". Mostre também o número de avaliações.

- Faça: Médias em modo somente leitura.
- Evite: Rating interativo para mostrar uma média — parece que a pessoa pode votar.

## Exemplos

### Básico

Passe o mouse para ver a prévia; clique ou use as setas para escolher.

```tsx
import { Rating } from '@orangesys/ui'

export default function Basic() {
  return <Rating label="Avalie o atendimento" />
}
```

### Pesquisa de satisfação

Controlado, com rótulos por nota, obrigatório e validação no envio.

```tsx
import { Button, Rating } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

const rotulos = ['Péssima', 'Ruim', 'Regular', 'Boa', 'Excelente']

export default function Survey() {
  const [nota, setNota] = useState<number | null>(null)
  const [enviado, setEnviado] = useState(false)

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Rating
        label="Como foi a entrega do seu pedido?"
        description="Sua resposta é anônima."
        labels={rotulos}
        value={nota}
        onChange={setNota}
        required
        error={enviado && !nota ? 'Escolha uma nota de 1 a 5 estrelas.' : undefined}
      />
      <Button type="submit">Enviar avaliação</Button>
    </form>
  )
}
```

### Somente leitura

Médias com frações em uma lista de produtos.

```tsx
import { Rating, Text } from '@orangesys/ui'

const produtos = [
  { nome: 'Fone Orange Studio', nota: 4.5, avaliacoes: 128 },
  { nome: 'Teclado Mecânico TKL', nota: 4, avaliacoes: 52 },
  { nome: 'Mouse sem fio Slim', nota: 3.5, avaliacoes: 17 },
]

export default function ReadOnly() {
  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        gap: 12,
        width: '100%',
        maxWidth: 420,
      }}
    >
      {produtos.map((produto) => (
        <li
          key={produto.nome}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Text weight="medium">{produto.nome}</Text>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Rating readOnly value={produto.nota} size="sm" />
            <Text as="span" size="sm" tone="subtle">
              ({produto.avaliacoes})
            </Text>
          </span>
        </li>
      ))}
    </ul>
  )
}
```

### Tamanhos, escala e estados

```tsx
import { Rating } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Rating label="Pequeno (sm)" size="sm" defaultValue={3} />
      <Rating label="Médio (md)" size="md" defaultValue={4} />
      <Rating label="Grande (lg)" size="lg" defaultValue={5} />
      <Rating label="Nota de 1 a 10" max={10} size="sm" defaultValue={8} />
      <Rating label="Desabilitado" disabled defaultValue={2} />
    </div>
  )
}
```

## Movimento

- **Hover (prévia)** — As estrelas da prévia crescem 6% e a estrela sob o ponteiro (ou com foco do teclado) cresce 18% · fast, ease-spring.
- **Escolher uma nota** — Pop em onda até a nota escolhida, ~27ms entre estrelas · medium (250ms), ease-bounce.
- **Preenchimento** — Cor e preenchimento passam de transparente a laranja · fast (160ms).
- **Pressionar** — A estrela afunda 1px · press (90ms).
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `Rating`

Avaliação por estrelas. Interativo, é um grupo de rádios nativos (setas
do teclado funcionam como em qualquer radiogroup); em `readOnly`, uma
imagem com a nota por extenso.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `number \| null` | `null` | Nota inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `disabled` | `boolean` | `false` | — |
| `error` | `ReactNode` | — | Mensagem de erro. |
| `hideLabel` | `boolean` | `false` | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo do grupo ("Avalie o atendimento"). |
| `labels` | `string[]` | — | Nome de cada nota ("Péssimo"… "Excelente"). Usado como nome acessível de cada estrela e exibido ao lado durante o hover/seleção. |
| `max` | `number` | `5` | Quantidade de estrelas. Padrão: 5. |
| `name` | `string` | — | Nome do grupo de rádios (envio em formulários). Gerado se omitido. |
| `onChange` | `((value: number) => void)` | — | Chamado com a nova nota (1 a `max`). |
| `readOnly` | `boolean` | `false` | Somente leitura: exibe as estrelas como imagem (`role="img"`) com a nota por extenso. Aceita frações (ex.: 4.5). |
| `required` | `boolean` | `false` | Campo obrigatório: mostra `*` e marca o controle como `required`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Tamanho das estrelas: `sm` 16px, `md` 24px, `lg` 32px. |
| `value` | `number \| null` | — | Nota selecionada (controlado). `null` ou `0` = sem nota. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`RatingSize`:

```ts
export type RatingSize = 'sm' | 'md' | 'lg'
```

## Acessibilidade

Cada estrela é um `<input type="radio">` nativo, visualmente oculto, com um `<label>` que desenha a estrela e diz "3 de 5 estrelas" (ou o rótulo de `labels`). O grupo tem `role="radiogroup"` nomeado pelo rótulo. Em `readOnly` não há controles: um `role="img"` com `aria-label` descreve a nota.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra no grupo (na nota escolhida ou na primeira estrela). |
| `→` + `↓` | Próxima nota (seleciona). |
| `←` + `↑` | Nota anterior (seleciona). |
| `Space` | Seleciona a estrela focada. |

- **1.1.1** — Estrelas têm alternativa em texto; somente leitura usa role="img" com a nota.
- **1.4.1** — Estrelas preenchidas mudam forma (preenchimento sólido), não só a cor.
- **2.1.1** — Setas nativas do grupo de rádios.
- **2.5.8** — Alvo de 24×24px no tamanho sm.
