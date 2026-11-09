# CodeBlock

Exibe trechos de código em fonte monoespaçada, com botão de copiar, numeração e destaque de linhas.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { CodeBlock } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/code-block (em inglês: https://orange.llypedev.com.br/en/components/code-block)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-codeblock--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/CodeBlock

## Boas práticas

- Use para trechos que a pessoa vai ler ou copiar: comandos de instalação, exemplos de configuração, payloads de API.
- Informe **language** ou **title** (nome do arquivo): eles aparecem no cabeçalho e dão nome à área de código para leitores de tela.
- Destaque só as linhas que o texto ao redor explica. O destaque é um reforço visual; diga em palavras o que mudou.
- Para código inline numa frase, use `<code>`. O CodeBlock não faz realce de sintaxe — mantém a biblioteca leve e funciona com qualquer linguagem.

## Anatomia

- **Cabeçalho** — Nome do arquivo (mono) e linguagem (eyebrow) à esquerda; botão Copiar à direita.
- **Área de código** — Um <pre> focável que rola na horizontal (ou quebra linhas com wrap) e na vertical com maxHeight.
- **Numeração** — Gerada por CSS: não é copiada nem lida por leitores de tela.
- **Linha destacada** — Um <mark> com fundo laranja sutil e faixa laranja de 3px à esquerda.

## Exemplos

### Comando de instalação

O botão Copiar copia o código sem quebras de linha finais e anuncia "Copiado!".

```tsx
import { CodeBlock } from '@orangesys/ui'

export default function Install() {
  return <CodeBlock language="bash" code="pnpm add @orangesys/ui @orangesys/tokens" style={{ width: '100%' }} />
}
```

### Numeração e linhas destacadas

highlightLines recebe os números exibidos das linhas.

```tsx
import { CodeBlock } from '@orangesys/ui'

const code = `import { OrangeProvider } from '@orangesys/ui'
import '@orangesys/ui/styles.css'

export function App({ children }) {
  return (
    <OrangeProvider defaultTheme="dark" locale="pt-BR">
      {children}
    </OrangeProvider>
  )
}`

export default function LineHighlight() {
  return (
    <CodeBlock
      title="src/App.tsx"
      language="tsx"
      code={code}
      showLineNumbers
      highlightLines={[1, 2, 6]}
      style={{ width: '100%' }}
    />
  )
}
```

### Trecho de um arquivo maior

startingLineNumber mantém a numeração do arquivo original — o destaque usa os mesmos números.

```tsx
import { CodeBlock } from '@orangesys/ui'

const excerpt = `  const { t } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label={t('menu')}>`

export default function Excerpt() {
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%' }}>
      <p style={{ margin: 0 }}>
        A linha 43 cria o estado do menu; a numeração continua a partir do arquivo original.
      </p>
      <CodeBlock
        title="src/components/Header.tsx"
        language="tsx"
        code={excerpt}
        showLineNumbers
        startingLineNumber={42}
        highlightLines={[43]}
      />
    </div>
  )
}
```

### Quebra de linha e altura máxima

wrap quebra linhas longas (útil para JSON e logs); maxHeight limita a altura e ativa a rolagem.

```tsx
import { CodeBlock } from '@orangesys/ui'

const log = `{
  "id": "evt_01J9Z4",
  "tipo": "pedido.atualizado",
  "criadoEm": "2026-11-03T14:05:12-03:00",
  "mensagem": "O pedido 4821 foi atualizado para 'em separação' pelo centro de distribuição de Cajamar após a confirmação do estoque.",
  "origem": "api",
  "tentativas": 1,
  "versao": "2026-10-01"
}`

export default function WrapAndHeight() {
  return (
    <CodeBlock
      title="webhook-payload.json"
      language="json"
      code={log}
      wrap
      maxHeight={180}
      style={{ width: '100%', maxWidth: 520 }}
    />
  )
}
```

### Destaque passo a passo

Mudar highlightLines faz o destaque deslizar suavemente entre as linhas.

```tsx
import { Button, CodeBlock } from '@orangesys/ui'
import { useState } from 'react'

const code = `import { OrangeProvider, Button } from '@orangesys/ui'
import '@orangesys/ui/styles.css'

export function App() {
  return (
    <OrangeProvider locale="pt-BR">
      <Button>Criar conta</Button>
    </OrangeProvider>
  )
}`

const passos = [
  { rotulo: '1. Importe', linhas: [1, 2] },
  { rotulo: '2. Envolva no provider', linhas: [6, 8] },
  { rotulo: '3. Use os componentes', linhas: [7] },
]

export default function Steps() {
  const [passo, setPasso] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <div role="group" aria-label="Passos da instalação" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {passos.map((p, i) => (
          <Button
            key={p.rotulo}
            size="sm"
            variant={passo === i ? 'secondary' : 'outline'}
            aria-pressed={passo === i}
            onClick={() => setPasso(i)}
          >
            {p.rotulo}
          </Button>
        ))}
      </div>
      <CodeBlock title="src/App.tsx" language="tsx" code={code} showLineNumbers highlightLines={passos[passo].linhas} />
    </div>
  )
}
```

## Props

### `CodeBlock`

Exibe trechos de código em fonte monoespaçada sobre fundo escuro, com botão
de copiar, numeração e destaque de linhas. Não faz realce de sintaxe — mantém
a biblioteca leve e o código legível em qualquer linguagem.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `code` (obrigatória) | `string` | — | Código exibido. Quebras de linha no final são removidas. |
| `codeLabel` | `string` | — | Nome acessível da área rolável. Padrão: "Código: {title ou language}". |
| `copyable` | `boolean` | `true` | Mostra o botão de copiar. Padrão: `true`. |
| `highlightLines` | `number[]` | — | Linhas destacadas, pelo número exibido (considera `startingLineNumber`). |
| `language` | `string` | — | Linguagem do trecho (`tsx`, `bash`, `json`…), exibida como rótulo no cabeçalho. |
| `maxHeight` | `string \| number` | — | Altura máxima da área de código antes de rolar (px ou valor CSS). |
| `onCopy` | `((code: string) => void)` | — | Chamado depois que o código é copiado com sucesso. |
| `showLineNumbers` | `boolean` | `false` | Mostra a numeração das linhas (não é copiada nem lida por leitores de tela). |
| `startingLineNumber` | `number` | `1` | Número da primeira linha — útil para trechos de um arquivo maior. Padrão: `1`. |
| `title` | `string` | — | Nome do arquivo ou título do trecho, exibido no cabeçalho. |
| `wrap` | `boolean` | `false` | Quebra linhas longas em vez de rolar horizontalmente. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

## Movimento

- **Copiar** — O ícone troca para um check que "salta" (escala 0.6 → 1) — 250ms, ease-bounce; ao voltar, o ícone de copiar surge com fade de 160ms. "Copiado!" continua anunciado pela região de status.
- **Botão Copiar** — Hover e foco: borda e cor em 160ms; pressionar afunda 1px (90ms).
- **Linhas destacadas** — Fundo e faixa laranja transicionam quando highlightLines muda — 250ms, ease-out.
- **Hover na linha** — O número da linha clareia — 160ms.

## Acessibilidade

A área de código é um `<pre tabindex="0" role="group">` com nome acessível, para que quem usa teclado consiga rolar trechos longos. A numeração fica fora da árvore de acessibilidade e as linhas destacadas usam `<mark>`. Ao copiar, uma região `role="status"` anuncia "Copiado!".

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o botão Copiar e depois para a área de código. |
| `Enter` | No botão, copia o código. |
| `←` + `→` + `↑` + `↓` | Na área de código focada, rola o conteúdo. |

- **1.3.1** — Linhas destacadas são <mark>; numeração é aria-hidden e não entra no texto copiado.
- **1.4.3** — Texto claro sobre fundo escuro nos dois temas, com contraste acima de 4.5:1.
- **2.1.1** — A área rolável é focável e pode ser rolada pelo teclado.
- **4.1.3** — A confirmação de cópia é anunciada por uma região de status.
