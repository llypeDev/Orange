# TableOfContents

Índice "Nesta página" que lista as seções e destaca a que está visível durante a rolagem.

- Categoria: Navegação · Status: estável
- Importação: `import { TableOfContents } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/table-of-contents (em inglês: https://orange.llypedev.com.br/en/components/table-of-contents)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-tableofcontents--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TableOfContents

## Boas práticas

- Use em páginas longas com seções tituladas — documentação, artigos, termos de uso. Com menos de três seções, dispense.
- Mantenha até dois níveis (h2 e h3). Índices profundos viram um segundo menu difícil de escanear.
- Fixe o índice ao lado do conteúdo em telas largas (position: sticky) e esconda-o em telas pequenas.
- Quando houver mais de um índice ou navegação na página, dê a cada um um título diferente (`title` ou `aria-label`).
- Precisa de outro visual — etapas numeradas, abas, progresso de leitura? Use o hook `useScrollSpy` (em Usando → Hooks): a mesma detecção da seção atual, com o seu markup.

## Exemplos

### Itens definidos

items com id, label e level. root aponta para o painel rolável; role-o para ver o destaque acompanhar.

```tsx
import { Stack, TableOfContents } from '@orangesys/ui'
import { useRef } from 'react'

const sections = [
  { id: 'guia-credenciais', label: 'Credenciais', level: 2 },
  { id: 'guia-sandbox', label: 'Ambiente de testes', level: 3 },
  { id: 'guia-producao', label: 'Produção', level: 3 },
  { id: 'guia-webhooks', label: 'Webhooks', level: 2 },
  { id: 'guia-erros', label: 'Tratamento de erros', level: 2 },
  { id: 'guia-limites', label: 'Limites de uso', level: 2 },
]

export default function Manual() {
  const panelRef = useRef<HTMLDivElement>(null)
  return (
    <Stack gap={8} direction="horizontal" wrap style={{ width: '100%' }}>
      <div
        ref={panelRef}
        tabIndex={0}
        role="region"
        aria-label="Guia de integração"
        style={{ flex: '1 1 320px', height: 320, overflow: 'auto', paddingRight: 16 }}
      >
        {sections.map((s) => {
          const Heading = s.level === 2 ? 'h4' : 'h5'
          return (
            <section key={s.id} style={{ minHeight: 180 }}>
              <Heading id={s.id} style={{ margin: '0 0 8px' }}>
                {s.label}
              </Heading>
              <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
                Instruções sobre {s.label.toLowerCase()} para integrar a API de pagamentos.
              </p>
            </section>
          )
        })}
      </div>
      <TableOfContents
        items={sections}
        title="Neste guia"
        root={panelRef}
        rootMargin="0px 0px -70% 0px"
        style={{ flex: '0 0 200px' }}
      />
    </Stack>
  )
}
```

### Coleta automática

Com container, os títulos são lidos do DOM (e atualizados se o conteúdo mudar). Títulos sem id ganham um.

```tsx
import { Stack, TableOfContents } from '@orangesys/ui'
import { useRef } from 'react'

export default function Auto() {
  const articleRef = useRef<HTMLElement>(null)
  return (
    <Stack gap={8} direction="horizontal" wrap style={{ width: '100%' }}>
      <article
        ref={articleRef}
        tabIndex={0}
        aria-label="Política de trocas"
        style={{ flex: '1 1 320px', height: 300, overflow: 'auto', paddingRight: 16 }}
      >
        {/* Títulos sem id recebem um gerado a partir do texto. */}
        <h4>Prazo para trocas</h4>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Até 30 dias após o recebimento.</p>
        <h4>Produtos com defeito</h4>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Coletamos o produto sem custo.</p>
        <h5>Eletrônicos</h5>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Garantia do fabricante de 12 meses.</p>
        <h4>Reembolso</h4>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Estorno em até 2 faturas.</p>
      </article>
      <TableOfContents
        container={articleRef}
        headingSelector="h4, h5"
        root={articleRef}
        rootMargin="0px 0px -70% 0px"
        title="Neste artigo"
        style={{ flex: '0 0 200px' }}
      />
    </Stack>
  )
}
```

### Índice desta página

Lê os h2 desta documentação e acompanha a rolagem da janela — role a página para ver.

```tsx
import { TableOfContents } from '@orangesys/ui'
import { useCallback, useState } from 'react'

export default function ThisPage() {
  // Coleta os <h2> do <main> desta documentação e acompanha a rolagem da janela.
  const [main, setMain] = useState<HTMLElement | null>(null)
  const wrapperRef = useCallback((el: HTMLDivElement | null) => setMain(el?.closest('main') ?? null), [])
  return (
    <div ref={wrapperRef} style={{ width: 240 }}>
      <TableOfContents container={main} headingSelector="h2[id]" title="Seções desta página" />
    </div>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Nova seção visível** — Um único marcador laranja de 2px desliza até o link da seção (translateY + scaleY) — medium, ease-spring.
- **Hover / foco em um link** — Cor do texto — fast (160ms), ease-out.

## Props

### `TableOfContents`

Índice "Nesta página": lista as seções da página e destaca a que está
visível enquanto a pessoa rola.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `container` | `ContainerTarget` | — | Contêiner de onde os títulos são coletados automaticamente (quando `items` não é informado). Títulos sem `id` recebem um gerado do texto. |
| `headingSelector` | `string` | `h2, h3` | Seletor dos títulos coletados. Padrão: `h2, h3`. |
| `items` | `TableOfContentsItem[]` | — | Itens do índice. Alternativa a `container`. |
| `onItemClick` | `((id: string, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void)` | — | Chamado ao clicar em um item. |
| `root` | `ContainerTarget` | — | Contêiner rolável usado como raiz do IntersectionObserver. Padrão: a janela. Informe quando o conteúdo rola dentro de um painel. |
| `rootMargin` | `string` | `-80px 0px -65% 0px` | Faixa da área visível em que um título conta como "na tela", no formato do `rootMargin` do IntersectionObserver (px ou %). Padrão: `'-80px 0px -65% 0px'` (terço superior). No fim da rolagem, a última seção à vista fica ativa mesmo que o título não alcance a faixa. |
| `title` | `ReactNode` | — | Título visível acima da lista. Padrão: `t('tableOfContents')`. `null` esconde (o nome continua no `aria-label`). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TableOfContentsItem`:

```ts
export interface TableOfContentsItem {
  /** Id do título de destino (sem `#`). */
  id: string
  /** Texto exibido no índice. */
  label: ReactNode
  /** Nível do título (2 para `h2`, 3 para `h3`…). Define a indentação. */
  level?: number
}
```

## Acessibilidade

Uma `<nav>` nomeada pelo título visível ("Nesta página"), com uma lista de links de âncora. A seção visível recebe `aria-current="location"` e a barra laranja de 2px. Os links são âncoras nativas: o navegador rola até a seção e o próximo Tab continua a partir dela.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os links do índice. |
| `Enter` | Vai para a seção. |

- **1.3.1** — Hierarquia por indentação e tamanho, em uma lista de links.
- **2.4.5** — Mais de um caminho para chegar a cada seção.
- **2.4.8** — A seção atual fica destacada.
- **4.1.2** — Seção atual exposta com aria-current="location".
