# VisuallyHidden

Esconde conteúdo da tela mantendo-o disponível para leitores de tela e tecnologias assistivas.

- Categoria: Utilitários · Status: estável
- Importação: `import { VisuallyHidden } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/visually-hidden (em inglês: https://orange.llypedev.com.br/en/components/visually-hidden)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-visuallyhidden--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/VisuallyHidden

## Boas práticas

- Use para completar o contexto que a interface já transmite visualmente — por exemplo, "Ler mais sobre <título>".
- Prefira rótulos visíveis. Esconder texto é exceção, não regra: se o rótulo ajuda todo mundo, mostre-o.
- Não use `display: none` nem `hidden` para isso — eles escondem também dos leitores de tela.
- Nunca esconda conteúdo focável sem a prop focusable: o foco ficaria invisível (WCAG 2.4.7).

- Faça: Links repetidos como "Ler mais" com o complemento oculto que diz a qual item se referem.
- Evite: Esconder instruções importantes que pessoas videntes também precisariam ler.

## Exemplos

### Rótulo para ícone com contador

O número visível é decorativo; o leitor de tela ouve "Carrinho com 3 itens".

```tsx
import { Icon, VisuallyHidden } from '@orangesys/ui'

export default function IconLabel() {
  return (
    <a
      href="#carrinho"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'inherit' }}
    >
      <Icon name="inbox" />
      <span aria-hidden="true">3</span>
      <VisuallyHidden>Carrinho com 3 itens</VisuallyHidden>
    </a>
  )
}
```

### Contexto para links repetidos

Na lista de links do leitor de tela, cada "Ler mais" ganha um nome único.

```tsx
import { VisuallyHidden } from '@orangesys/ui'

const posts = ['Lançamento do Orange 0.1', 'Como testamos acessibilidade', 'Tokens na prática']

export default function Context() {
  return (
    <ul
      style={{ display: 'grid', gap: 12, width: '100%', margin: 0, padding: 0, listStyle: 'none' }}
    >
      {posts.map((title) => (
        <li
          key={title}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', alignItems: 'baseline' }}
        >
          <span style={{ minWidth: 'min(260px, 100%)' }}>{title}</span>
          <a href={`#${title}`}>
            Ler mais
            <VisuallyHidden> sobre {title}</VisuallyHidden>
          </a>
        </li>
      ))}
    </ul>
  )
}
```

### Visível ao receber foco

Com focusable, o conteúdo aparece quando recebe foco do teclado — a base do SkipLink.

```tsx
import { VisuallyHidden } from '@orangesys/ui'

export default function Focusable() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Pressione Tab dentro desta prévia para revelar o link.
      </p>
      <VisuallyHidden
        as="a"
        focusable
        href="#conteudo"
        style={{ padding: '8px 12px', background: 'var(--or-color-accent)', color: 'var(--or-color-text-on-accent)' }}
      >
        Pular para o conteúdo
      </VisuallyHidden>
    </div>
  )
}
```

## Props

### `VisuallyHidden`

Esconde conteúdo visualmente mantendo-o acessível para leitores de tela.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `span` | Elemento renderizado. Padrão: `span`. |
| `focusable` | `boolean` | `false` | Torna-se visível quando recebe foco (útil para links de atalho). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

## Acessibilidade

Usa a técnica de recorte (`clip` + 1px) em vez de `display: none`, então o texto permanece na árvore de acessibilidade. Também disponível como classe utilitária `.or-visually-hidden`.

- **1.1.1** — Alternativa em texto para ícones e conteúdo não textual.
- **2.4.4** — Propósito do link claro no seu contexto.
- **2.4.7** — Com focusable, o foco nunca fica invisível.
