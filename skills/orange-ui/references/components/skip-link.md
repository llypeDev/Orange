# SkipLink

Atalho invisível até receber foco que leva usuários de teclado direto ao conteúdo principal.

- Categoria: Navegação · Status: estável
- Importação: `import { SkipLink } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/skip-link (em inglês: https://orange.llypedev.com.br/en/components/skip-link)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-skiplink--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/SkipLink

## Boas práticas

- Coloque o SkipLink como o primeiro elemento focável da página, antes do cabeçalho e da navegação.
- O destino precisa existir: por padrão é `#main`, então dê `id="main"` ao seu `<main>`.
- Use no máximo dois ou três atalhos (conteúdo, busca, filtros). Mais do que isso vira outra barra de navegação.
- Não esconda o link com display: none — ele precisa continuar focável. O componente já cuida disso.

## Exemplos

> **Como testar** O atalho só aparece com foco de teclado. Clique em um botão de tema da prévia (Auto/Escuro/Claro) e pressione Tab.

### Atalho para o conteúdo

Ao ativar, o foco vai para o destino — que recebe tabindex="-1" temporário se não for focável.

```tsx
import { SkipLink } from '@orangesys/ui'

export default function Basic() {
  return (
    // transform cria um contexto para o position: fixed — só para a prévia.
    <div style={{ position: 'relative', width: '100%', minHeight: 200, transform: 'translateZ(0)', border: '1px solid var(--or-color-border)' }}>
      <SkipLink href="#conteudo-pedidos" />
      <nav aria-label="Principal" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', padding: '14px 16px', borderBottom: '1px solid var(--or-color-border)' }}>
        <a href="#painel">Painel</a>
        <a href="#pedidos">Pedidos</a>
        <a href="#clientes">Clientes</a>
        <a href="#relatorios">Relatórios</a>
      </nav>
      <div id="conteudo-pedidos" style={{ padding: 16 }}>
        <h4 style={{ margin: '0 0 8px' }}>Pedidos</h4>
        <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
          Com o atalho em foco, Enter pula a navegação e traz o foco para este bloco.
        </p>
      </div>
    </div>
  )
}
```

### Mais de um atalho

Em páginas de busca, um segundo atalho leva direto ao campo de busca.

```tsx
import { SkipLink } from '@orangesys/ui'

export default function MultipleTargets() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 220, transform: 'translateZ(0)', border: '1px solid var(--or-color-border)' }}>
      <SkipLink href="#loja-resultados" />
      <SkipLink href="#loja-busca">
        Pular para a busca
      </SkipLink>
      <nav aria-label="Categorias" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', padding: '14px 16px', borderBottom: '1px solid var(--or-color-border)' }}>
        <a href="#notebooks">Notebooks</a>
        <a href="#monitores">Monitores</a>
        <a href="#acessorios">Acessórios</a>
      </nav>
      <div style={{ display: 'grid', gap: 12, padding: 16 }}>
        <label style={{ display: 'grid', gap: 4, maxWidth: 320 }}>
          <span style={{ fontSize: 13 }}>Buscar produtos</span>
          <input id="loja-busca" className="or-control or-control--sm" type="search" />
        </label>
        <div id="loja-resultados">
          <strong>128 resultados</strong>
        </div>
      </div>
    </div>
  )
}
```

### No layout da aplicação

Inclua o atalho uma única vez, no layout raiz.

```tsx
import { SkipLink } from '@orangesys/ui'
import type { ReactNode } from 'react'

// Coloque o SkipLink como o PRIMEIRO elemento focável do layout e dê ao
// <main> o id correspondente.
export function AppLayout({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <>
      <SkipLink />
      {header}
      <main id="main">{children}</main>
    </>
  )
}

export default function AppShell() {
  return (
    <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
      Esta própria documentação usa um link de atalho: recarregue a página e pressione Tab.
    </p>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Receber foco** — Desce do topo da tela até o lugar (translateY) — medium, ease-spring (leve passada e acomodação).
- **Perder o foco** — Sobe para fora da tela — fast, ease-in-out.
- **Pressionar** — Afunda 1px — press (90ms).

## Props

### `SkipLink`

Link de atalho "Pular para o conteúdo principal". Fica invisível até
receber foco pelo teclado — deve ser o primeiro elemento focável da página.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `href` | `string` | `#main` | Âncora do conteúdo de destino (`#id`). O elemento precisa existir na página. Padrão: `#main`. |

Repassa também os atributos nativos (`AnchorHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Um `<a href="#main">` nativo, deslocado para fora da tela até receber foco (nunca `display: none`). Ao ativar, o componente move o foco de fato para o destino — sem isso, alguns navegadores só rolam a página e o próximo Tab volta ao topo.

| Teclas | Ação |
| --- | --- |
| `Tab` | Primeiro Tab da página revela o atalho. |
| `Enter` | Pula para o conteúdo e move o foco para ele. |

- **2.4.1** — Mecanismo para pular blocos repetidos de conteúdo.
- **2.4.3** — A ordem de foco continua a partir do conteúdo de destino.
- **2.4.7** — Visível e com contorno de foco quando focado.
