# BackToTop

Botão que aparece em páginas longas e leva de volta ao início, movendo o foco junto.

- Categoria: Navegação · Status: estável
- Importação: `import { BackToTop } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/back-to-top (em inglês: https://orange.llypedev.com.br/en/components/back-to-top)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-backtotop--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/BackToTop

## Boas práticas

- Use em páginas com várias telas de altura — artigos, listas longas, documentação. Em páginas curtas, ele só ocupa espaço.
- Inclua apenas um por página e mantenha-o no canto inferior direito, longe de outras ações flutuantes.
- O foco vai para o `<main>` depois da rolagem. Se o início lógico for outro (um título, um painel), informe `focusTarget`.
- Em barras inferiores no mobile (BottomNavigation), aumente o deslocamento com a variável --or-back-to-top-offset para não sobrepor.

## Exemplos

### Em um painel rolável

Com scrollContainer e position="sticky", o botão acompanha o fim do painel. Role a lista para vê-lo.

```tsx
import { BackToTop } from '@orangesys/ui'
import { useRef } from 'react'

const transactions = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  date: `${String(30 - i).padStart(2, '0')}/10`,
  description: ['Assinatura Orange Pro', 'Reembolso de frete', 'Pagamento via Pix', 'Compra no cartão'][i % 4],
  amount: ((i % 4 === 1 ? 1 : -1) * (19.9 + i * 13.4)).toFixed(2),
}))

export default function ScrollPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={panelRef}
      tabIndex={0}
      role="region"
      aria-label="Extrato de outubro"
      style={{ width: '100%', height: 320, overflow: 'auto', border: '1px solid var(--or-color-border)', padding: '0 16px 16px' }}
    >
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {transactions.map((t) => (
          <li
            key={t.id}
            style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--or-color-border-subtle)', fontSize: 14 }}
          >
            <span style={{ color: 'var(--or-color-text-subtle)', fontVariantNumeric: 'tabular-nums' }}>{t.date}</span>
            <span style={{ flex: 1 }}>{t.description}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>R$ {t.amount}</span>
          </li>
        ))}
      </ul>
      <BackToTop scrollContainer={panelRef} position="sticky" threshold={160} />
    </div>
  )
}
```

### Com rótulo visível

showLabel mostra o texto ao lado da seta — útil quando o ícone sozinho pode não ser entendido.

```tsx
import { BackToTop } from '@orangesys/ui'
import { useRef } from 'react'

const sections = ['Introdução', 'Instalação', 'Configuração', 'Temas', 'Componentes', 'Publicação']

export default function WithLabel() {
  const articleRef = useRef<HTMLElement>(null)
  return (
    <article
      ref={articleRef}
      tabIndex={0}
      aria-label="Guia de instalação"
      style={{ width: '100%', height: 300, overflow: 'auto', border: '1px solid var(--or-color-border)', padding: '0 20px 16px' }}
    >
      {sections.map((title) => (
        <section key={title}>
          <h4 style={{ margin: '20px 0 8px' }}>{title}</h4>
          <p style={{ margin: 0, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
            Siga os passos desta seção antes de avançar. Cada etapa depende da configuração anterior e leva poucos minutos.
          </p>
        </section>
      ))}
      <BackToTop scrollContainer={articleRef} focusTarget={articleRef} position="sticky" threshold={120} showLabel />
    </article>
  )
}
```

### Na página inteira

O uso mais comum: fixo na janela. Esta página usa este exemplo — role para baixo.

```tsx
import { BackToTop } from '@orangesys/ui'

export default function Page() {
  // Fixo no canto inferior direito da janela. Ao clicar, o foco vai para o <main>.
  return (
    <>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Role esta página: depois de 600px, o botão aparece no canto inferior direito.
      </p>
      <BackToTop threshold={600} />
    </>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Aparecer** — Depois do threshold, entra com fade + 8px de baixo — medium, ease-out.
- **Sumir** — Sai com fade + 8px para baixo — fast, ease-in-out — e só então é desmontado (usePresence); sem cliques durante a saída.
- **Hover / foco** — A seta empurra 4px para cima (medium, ease-out); borda laranja e sombra deslocada (medium).
- **Pressionar** — Afunda 1px — press (90ms). A rolagem é suave, ou instantânea com movimento reduzido.

## Props

### `BackToTop`

Botão "Voltar ao topo": aparece depois que a página é rolada além de
`threshold`, rola suavemente até o início (instantâneo com movimento
reduzido) e devolve o foco ao início do conteúdo.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `focusTarget` | `string \| ElementTarget` | — | Elemento que recebe o foco depois de voltar ao topo. Aceita elemento, ref, função ou seletor CSS. Padrão: o `<main>` da página ou o `<body>`. |
| `label` | `string` | — | Rótulo. Padrão: `t('backToTop')` — "Voltar ao topo". |
| `position` | `"sticky" \| "fixed"` | `fixed` | `fixed` (padrão) prende o botão no canto da janela; `sticky` o mantém no fim do contêiner rolável (posicione-o como último filho). |
| `scrollContainer` | `ElementTarget` | — | Contêiner rolável observado. Padrão: a janela. Use quando o conteúdo rola dentro de um painel com `overflow: auto`. |
| `showLabel` | `boolean` | `false` | Mostra o rótulo ao lado do ícone. Padrão: só o ícone (com `aria-label`). |
| `threshold` | `number` | `400` | Distância rolada (px) a partir da qual o botão aparece. Padrão: 400. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Um `<button>` nativo com nome "Voltar ao topo". Enquanto escondido, usa `visibility: hidden`: sai da ordem de foco e da árvore de acessibilidade. Depois de rolar, o foco é movido para o início do conteúdo — sem isso, o próximo Tab continuaria do fim da página.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o botão (quando visível). |
| `Enter` | Volta ao topo e move o foco para o conteúdo. |
| `Space` | Mesmo que Enter. |

- **2.3.3** — Rolagem instantânea quando o sistema pede movimento reduzido.
- **2.4.3** — O foco acompanha a rolagem e volta ao início do conteúdo.
- **2.5.8** — Alvo de 48×48px.
- **4.1.2** — Nome acessível mesmo quando só o ícone aparece.
