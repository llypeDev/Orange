# Blockquote

Citação com barra de acento e fonte opcional, em <figure> com <figcaption>. Também serve como texto em destaque.

- Categoria: Exibição de dados · Status: novo
- Importação: `import { Blockquote } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/blockquote (em inglês: https://orange.llypedev.com.br/en/components/blockquote)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-blockquote--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Blockquote

## Boas práticas

- Use para trechos de outra fonte: depoimentos, cláusulas de um contrato, a fala de uma pessoa em um relatório.
- Dê o crédito em `source` (quem disse e onde) e, quando houver, o endereço da origem em `cite`. Marque o título da obra com `<cite>`.
- Para **texto em destaque** (o "inset text" do GOV.UK) — um prazo, uma exceção, um exemplo que precisa se separar do texto ao redor sem ser citação —, use `as="div"`. Assim leitores de tela não anunciam uma citação que não existe.
- Não use para avisos que pedem atenção ou ação (erro, atenção, sucesso): para isso existem Alert e Banner. Nem para recuo decorativo.
- Mantenha curto: uma ou duas frases. Citações longas cansam e escondem o ponto principal.

## Anatomia

- **Barra de acento** — Borda laranja de 3px à esquerda (à direita em RTL). É uma borda, então continua visível em alto contraste.
- **Citação** — O `<blockquote>` (ou `<div>` com `as="div"`). Aceita texto ou vários parágrafos.
- **Fonte** — Com `source`, tudo vai para um `<figure>` e a fonte para a `<figcaption>`, em texto secundário e precedida de travessão.

## Exemplos

### Com fonte

cite guarda o endereço do relatório; source mostra quem disse e onde.

```tsx
import { Blockquote } from '@orangesys/ui'

export default function WithSource() {
  return (
    <Blockquote
      cite="https://exemplo.com.br/relatorios/atendimento-2026"
      source={
        <>
          Ana Lima, diretora de Atendimento — <cite>Relatório de Atendimento 2026</cite>
        </>
      }
      style={{ maxWidth: 560 }}
    >
      Automatizar a triagem dos chamados liberou a equipe para os casos que exigem conversa. O
      primeiro contato agora acontece no mesmo dia.
    </Blockquote>
  )
}
```

### Tamanhos

sm (13px), md (15px, padrão) e lg (17px) — a mesma escala do Prose.

```tsx
import { Blockquote } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: 560 }}>
      <Blockquote size="sm" source="Equipe de Suporte">
        Responda primeiro o que a pessoa perguntou; o contexto vem depois.
      </Blockquote>
      <Blockquote source="Guia de estilo, seção Voz e tom">
        Escreva como quem explica para um colega: frases curtas, verbos no imperativo, sem jargão.
      </Blockquote>
      <Blockquote
        size="lg"
        source={
          <>
            Marina Costa, <cite>Loja Ateliê Verde</cite>
          </>
        }
      >
        Levamos uma tarde para importar dois anos de pedidos.
      </Blockquote>
    </div>
  )
}
```

### Texto em destaque

as="div": o mesmo visual, sem a semântica de citação.

```tsx
import { Blockquote, Text } from '@orangesys/ui'

export default function InsetText() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      <Text>Você pode emitir notas fiscais a qualquer hora pelo painel ou pela API.</Text>
      {/* Não é citação de outra fonte: as="div", sem cite. */}
      <Blockquote as="div">
        A emissão fica indisponível no domingo, 15 de novembro, das 2h às 6h, para manutenção
        programada.
      </Blockquote>
      <Text>Notas emitidas antes da manutenção continuam válidas.</Text>
    </div>
  )
}
```

### Dentro do Prose

O Blockquote mantém o próprio estilo dentro do Prose — que, por sua vez, dá o mesmo visual a um <blockquote> vindo do CMS.

```tsx
import { Blockquote, Prose } from '@orangesys/ui'

export default function InProse() {
  return (
    <Prose>
      <h3>7. Cancelamento</h3>
      <p>A cláusula que trata do cancelamento diz:</p>
      <Blockquote
        cite="https://exemplo.com.br/termos#cancelamento"
        source={
          <>
            Cláusula 7.2, <cite>Termos de uso</cite>
          </>
        }
      >
        <p>
          O cancelamento pode ser solicitado a qualquer momento, pelo painel ou pela central de
          ajuda.
        </p>
        <p>Os dados do espaço de trabalho ficam disponíveis para exportação por 30 dias.</p>
      </Blockquote>
      <p>Depois desse prazo, os dados são apagados de forma definitiva.</p>
    </Prose>
  )
}
```

## Props

### `Blockquote`

Citação com barra de acento à esquerda e fonte opcional. Sem `source`,
renderiza só o `<blockquote>`; com `source`, usa
`<figure><blockquote /><figcaption /></figure>`. A `ref` e os demais
atributos vão para o elemento raiz.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `"div" \| "blockquote"` | `blockquote` | Elemento do trecho. `blockquote` (padrão) para citações de outra fonte; `div` para "texto em destaque" (inset text) que não é citação — um aviso de prazo, um exemplo, um resumo. |
| `cite` | `string` | — | URL do documento citado (atributo `cite` do `<blockquote>`). Não é exibido — a atribuição visível vai em `source`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Tamanho do texto: `sm` (13px), `md` (15px, padrão) ou `lg` (17px). |
| `source` | `ReactNode` | — | Atribuição visível: autor, cargo, obra (`<cite>`). Com ela, a citação é envolvida em `<figure>` e a fonte vai para uma `<figcaption>` precedida de travessão. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`BlockquoteSize`:

```ts
export type BlockquoteSize = 'sm' | 'md' | 'lg'
```

## Acessibilidade

Leitores de tela anunciam o início e o fim da citação ( `<blockquote>`). Com `source`, a `<figure>` é nomeada pela `<figcaption>`, então a fonte fica ligada à citação. O travessão antes da fonte é decorativo (gerado por CSS, com texto alternativo vazio). O endereço em `cite` não é exposto aos usuários — se a origem for importante, coloque um link na fonte. Não é um componente interativo: não há interação de teclado.

- **1.3.1** — Citação e fonte expostas com <blockquote>, <figure> e <figcaption>; texto em destaque sem semântica de citação.
- **1.4.1** — A barra e o recuo marcam o trecho, além da cor.
- **1.4.10** — O texto quebra em telas de 320px, inclusive palavras e URLs longas.
