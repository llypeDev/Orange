# TruncatedText

Corta textos longos em um número fixo de linhas com reticências, mantendo o texto completo acessível.

- Categoria: Utilitários · Status: estável
- Importação: `import { TruncatedText } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/truncated-text (em inglês: https://orange.llypedev.com.br/en/components/truncated-text)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-truncatedtext--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TruncatedText

## Boas práticas

- Use para textos secundários em espaços fixos: nomes de arquivos, prévias de mensagens, descrições em cartões.
- Não corte informações essenciais, como valores, prazos ou mensagens de erro. Se a pessoa precisa ler tudo, use ExpandableText.
- **showTitle** mostra o texto completo ao passar o mouse, mas não ajuda quem usa teclado ou tela de toque. Garanta outro caminho para o conteúdo completo (a página de detalhes, por exemplo).

> **Em layouts flex e grid** Itens flex não encolhem abaixo do conteúdo por padrão. Aplique min-width: 0 no item que contém o TruncatedText para o corte funcionar.

## Exemplos

### Uma linha

Com showTitle, o title nativo só aparece quando o texto está realmente cortado.

```tsx
import { TruncatedText } from '@orangesys/ui'

const arquivos = [
  'Proposta comercial — Implantação do módulo de conciliação para as filiais do interior.pdf',
  'Contrato de prestação de serviços 2026.pdf',
  'Planilha de custos consolidada do terceiro trimestre com projeções revisadas.xlsx',
]

export default function SingleLine() {
  return (
    <ul style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 8, margin: 0, padding: 0, listStyle: 'none', width: 280, maxWidth: '100%' }}>
      {arquivos.map((nome) => (
        <li key={nome} style={{ padding: '8px 12px', border: '1px solid var(--or-color-border)' }}>
          <TruncatedText showTitle>{nome}</TruncatedText>
        </li>
      ))}
    </ul>
  )
}
```

### Várias linhas

```tsx
import { TruncatedText } from '@orangesys/ui'

const produtos = [
  {
    nome: 'Cadeira ergonômica Pro',
    descricao:
      'Encosto em tela respirável, apoio lombar ajustável, braços 4D e base em alumínio. Garantia de 5 anos e montagem inclusa para entregas nas capitais.',
  },
  {
    nome: 'Mesa elevatória elétrica',
    descricao: 'Tampo de 140 × 70 cm, dois motores silenciosos e quatro alturas memorizadas.',
  },
]

export default function MultiLine() {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 260px))', width: '100%' }}>
      {produtos.map((produto) => (
        <article key={produto.nome} style={{ padding: 16, border: '1px solid var(--or-color-border)' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{produto.nome}</h3>
          <TruncatedText as="p" lines={2} style={{ margin: 0, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
            {produto.descricao}
          </TruncatedText>
        </article>
      ))}
    </div>
  )
}
```

### Dentro de uma linha flex

```tsx
import { TruncatedText } from '@orangesys/ui'

const conversas = [
  { nome: 'Equipe financeira', mensagem: 'Ana: O fechamento de outubro está pronto para revisão, falta só a conciliação bancária.', hora: '14:05' },
  { nome: 'Bruno Lima', mensagem: 'Combinado, envio o relatório amanhã cedo.', hora: '11:32' },
]

export default function FlexRow() {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', width: '100%', maxWidth: 380 }}>
      {conversas.map((c) => (
        <li key={c.nome} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid var(--or-color-border)' }}>
          {/* min-width: 0 permite que o item flex encolha e o texto seja cortado */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <TruncatedText style={{ fontWeight: 600 }}>{c.nome}</TruncatedText>
            <TruncatedText showTitle style={{ color: 'var(--or-color-text-muted)', fontSize: 14 }}>
              {c.mensagem}
            </TruncatedText>
          </div>
          <span style={{ flexShrink: 0, fontSize: 12, color: 'var(--or-color-text-subtle)' }}>{c.hora}</span>
        </li>
      ))}
    </ul>
  )
}
```

### Detectando o corte

onTruncatedChange avisa quando o texto passa a estar cortado — útil para mostrar um atalho para o conteúdo completo.

```tsx
import { TruncatedText } from '@orangesys/ui'
import { useState } from 'react'

export default function DetectTruncation() {
  const [largura, setLargura] = useState(240)
  const [cortado, setCortado] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <label style={{ display: 'grid', gap: 4, fontSize: 14 }}>
        Largura do contêiner: {largura}px
        <input type="range" min={120} max={420} value={largura} onChange={(e) => setLargura(Number(e.target.value))} />
      </label>
      <div style={{ width: largura, padding: '8px 12px', border: '1px solid var(--or-color-border)' }}>
        <TruncatedText onTruncatedChange={setCortado}>Reunião de planejamento do quarto trimestre</TruncatedText>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }} aria-live="polite">
        {cortado ? 'O texto está cortado.' : 'O texto cabe inteiro.'}
      </p>
    </div>
  )
}
```

## Props

### `TruncatedText`

Corta textos longos em um número fixo de linhas com reticências. O texto
completo continua no DOM — leitores de tela e a busca da página o encontram.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `span` | Elemento renderizado. Padrão: `span` (exibido como bloco). |
| `lines` | `number` | `1` | Número máximo de linhas visíveis antes das reticências. Padrão: `1`. |
| `onTruncatedChange` | `((truncated: boolean) => void)` | — | Chamado quando o texto passa a estar (ou deixa de estar) cortado. |
| `showTitle` | `boolean` | `false` | Quando o texto estiver cortado, mostra o texto completo no `title` nativo (dica ao passar o mouse). Um `title` passado explicitamente tem prioridade. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O corte é só visual (`line-clamp` / `text-overflow`): o texto completo continua no DOM, então leitores de tela leem tudo e a busca da página o encontra. O componente não é interativo e não recebe foco.

- **1.3.2** — O texto completo permanece na ordem de leitura.
- **1.4.4** — O corte acompanha o zoom de texto sem sobreposição — mais zoom, mais corte, nunca texto escondido de forma inacessível.
- **1.4.10** — Reflui em telas estreitas; use o title ou um link de detalhes para o conteúdo completo.
