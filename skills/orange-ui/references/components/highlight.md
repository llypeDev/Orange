# Highlight

Destaca termos de busca dentro de um texto com <mark>, sem diferenciar acentos nem maiúsculas.

- Categoria: Utilitários · Status: estável
- Importação: `import { Highlight } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/highlight (em inglês: https://orange.llypedev.com.br/en/components/highlight)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-highlight--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Highlight

## Boas práticas

- Use para mostrar por que um resultado apareceu: buscas, filtros, autocompletar.
- O destaque deve refletir a mesma regra do filtro. Se a busca ignora acentos, o Highlight também ignora — "sao" destaca "São".
- Para destacar cada palavra da busca separadamente, passe um array: `query={busca.split(/\s+/)}`.
- Não use para ênfase editorial em textos corridos — para isso existe <strong>.

## Exemplos

### Lista filtrada

Digite "sao", "SÃO" ou "ribeirao": acentos e maiúsculas são ignorados.

```tsx
import { Field, Highlight } from '@orangesys/ui'
import { useState } from 'react'

const cidades = ['São Paulo', 'São José dos Campos', 'Santos', 'Ribeirão Preto', 'Campinas', 'Sorocaba', 'Jundiaí']

const semAcento = (texto: string) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export default function SearchList() {
  const [busca, setBusca] = useState('sao')
  const resultados = cidades.filter((cidade) => semAcento(cidade).includes(semAcento(busca.trim())))

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <Field label="Cidade de entrega" controlId="busca-cidade">
        <input
          id="busca-cidade"
          className="or-control"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </Field>
      <ul aria-label="Cidades encontradas" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {resultados.map((cidade) => (
          <li key={cidade} style={{ padding: '6px 0', borderBottom: '1px solid var(--or-color-border)' }}>
            <Highlight query={busca}>{cidade}</Highlight>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Vários termos

Ocorrências sobrepostas ou vizinhas são unidas em um único destaque.

```tsx
import { Highlight } from '@orangesys/ui'

const busca = 'nota fiscal cancelar'
const termos = busca.split(/\s+/)

const artigos = [
  {
    titulo: 'Como cancelar uma nota fiscal emitida',
    trecho: 'O cancelamento pode ser feito em até 24 horas após a emissão, direto pelo painel de notas.',
  },
  {
    titulo: 'Corrigir dados de uma nota fiscal',
    trecho: 'Use a carta de correção quando o erro não altera valores nem impostos.',
  },
]

export default function MultipleTerms() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }}>
        Resultados para <strong>“{busca}”</strong>
      </p>
      {artigos.map((artigo) => (
        <article key={artigo.titulo}>
          <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>
            <Highlight query={termos}>{artigo.titulo}</Highlight>
          </h3>
          <Highlight as="p" query={termos} style={{ margin: 0, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
            {artigo.trecho}
          </Highlight>
        </article>
      ))}
    </div>
  )
}
```

### Termos literais e maiúsculas

Caracteres especiais como ( ) $ * são tratados como texto. caseSensitive diferencia "API" de "rápida".

```tsx
import { Highlight } from '@orangesys/ui'

export default function Literal() {
  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
      <Highlight as="p" query="(R$ 49,90)" style={{ margin: 0 }}>
        Plano Essencial (R$ 49,90) por mês, com até 5 usuários.
      </Highlight>
      <Highlight as="p" query="*.csv" style={{ margin: 0 }}>
        Arraste arquivos *.csv ou *.xlsx para importar os lançamentos.
      </Highlight>
      <Highlight as="p" query="API" caseSensitive style={{ margin: 0 }}>
        A API pública tem limite de 100 requisições por minuto; a rápida integração usa a mesma chave.
      </Highlight>
    </div>
  )
}
```

## Props

### `Highlight`

Destaca termos de busca dentro de um texto com `<mark>`. A comparação ignora
acentos e maiúsculas por padrão, e os termos são tratados como texto literal.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` (obrigatória) | `string` | — | Texto em que os termos serão destacados. |
| `query` (obrigatória) | `string \| string[]` | — | Termo ou lista de termos a destacar. Termos vazios são ignorados. |
| `accentSensitive` | `boolean` | `false` | Diferencia letras acentuadas ("é" ≠ "e"). Padrão: `false`. |
| `as` | `ElementType` | `span` | Elemento que envolve o texto. Padrão: `span`. |
| `caseSensitive` | `boolean` | `false` | Diferencia maiúsculas de minúsculas. Padrão: `false`. |
| `markClassName` | `string` | — | Classe extra aplicada a cada `<mark>`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

## Movimento

- **Nova ocorrência** — Fundo e sublinhado laranja surgem com fade — 250ms, ease-out. Marcas que continuam iguais quando a busca muda não repetem a animação.
- **Movimento reduzido** — O destaque aparece sem fade.

## Acessibilidade

Os trechos destacados são elementos `<mark>`, que alguns leitores de tela anunciam como "destacado". O texto continua íntegro (nada é inserido ou removido), e o destaque usa fundo e sublinhado laranja — não depende só da cor. Em modo de alto contraste, usa as cores de sistema `Mark`/`MarkText`.

- **1.3.1** — Destaques expostos semanticamente com <mark>.
- **1.4.1** — Sublinhado de 2px além da cor de fundo.
- **1.4.3** — O texto destacado mantém a cor original, com o mesmo contraste.
