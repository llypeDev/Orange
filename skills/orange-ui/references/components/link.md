# Link

Links levam a outra página, a outro site ou a outro ponto da mesma página.

- Categoria: Navegação · Status: estável
- Importação: `import { Link, linkClassName } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/link (em inglês: https://orange.llypedev.com.br/en/components/link)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-link--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Link

## Boas práticas

- Links navegam; botões agem. Para salvar, enviar ou abrir um diálogo, use **Button**.
- O texto do link deve fazer sentido fora de contexto: descreva o destino, não "clique aqui" ou "saiba mais".
- Marque links para outros sites com `external`: o ícone ↗ e o aviso "(abre em nova aba)" evitam surpresas.
- Em texto corrido, mantenha o sublinhado — cor sozinha não basta para identificar um link (WCAG 1.4.1).

- Faça: Texto que descreve o destino.
- Evite: "Clique aqui" não diz para onde o link leva.

## Tipos de link

- **default** — Links dentro de parágrafos. Sublinhado laranja com espaçamento; fica laranja no hover.
- **subtle** — Rodapés, metadados e textos secundários. Cor atenuada e sublinhado discreto.
- **standalone** — Links isolados (chamadas, listas de artigos). Sem sublinhado, com seta → que desliza no hover.

## Exemplos

### Variantes

```tsx
import { Link } from '@orangesys/ui'

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
      <p style={{ margin: 0 }}>
        Ao continuar, você concorda com a <Link href="#privacidade">política de privacidade</Link> e confirma que leu
        as <Link href="#regras">regras da comunidade</Link>.
      </p>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        © 2026 Orange Labs ·{' '}
        <Link href="#termos" variant="subtle">
          Termos
        </Link>{' '}
        ·{' '}
        <Link href="#cookies" variant="subtle">
          Cookies
        </Link>
      </p>
      <Link href="#planos" variant="standalone">
        Comparar todos os planos
      </Link>
    </div>
  )
}
```

### Links isolados

Use standalone em listas de links e chamadas fora de um parágrafo.

```tsx
import { Link } from '@orangesys/ui'

const posts = [
  { title: 'Como reduzimos o tempo de checkout em 38%', href: '#checkout' },
  { title: 'Guia de migração para a API v3', href: '#api-v3' },
  { title: 'Novidades de outubro', href: '#outubro' },
]

export default function Standalone() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 520 }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Do blog
      </p>
      <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
        {posts.map((post) => (
          <li key={post.href}>
            <Link href={post.href} variant="standalone">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Links externos

external adiciona target="_blank", rel="noopener noreferrer", o ícone ↗ e o texto oculto "(abre em nova aba)".

```tsx
import { Link } from '@orangesys/ui'

export default function External() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <p style={{ margin: 0 }}>
        O padrão segue as{' '}
        <Link href="https://www.w3.org/WAI/ARIA/apg/" external>
          práticas de autoria WAI-ARIA
        </Link>
        .
      </p>
      <Link href="https://github.com/llypeDev/Orange" variant="standalone" external>
        Ver código no GitHub
      </Link>
    </div>
  )
}
```

### Com roteador

Passe o link do seu roteador em as; as demais props (como to) são repassadas a ele.

```tsx
import { Link } from '@orangesys/ui'
import { forwardRef, type AnchorHTMLAttributes } from 'react'

// Em um app real, importe o link do seu roteador:
// import { Link as RouterLink } from 'react-router-dom'
const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  function RouterLink({ to, ...props }, ref) {
    return <a ref={ref} href={`#${to}`} {...props} />
  },
)

export default function WithRouter() {
  return (
    <p style={{ margin: 0 }}>
      Altere seus dados em{' '}
      <Link as={RouterLink} to="/conta/perfil">
        Minha conta
      </Link>{' '}
      ou{' '}
      <Link as={RouterLink} to="/conta/seguranca" variant="standalone">
        revise a segurança
      </Link>
    </p>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Hover / foco (default, subtle)** — O sublinhado engrossa de 1px para 2px, se aproxima do texto e muda de cor — fast (160ms), ease-out.
- **Hover / foco (standalone)** — Sublinhado laranja cresce da esquerda (background-size) e a seta → empurra 4px — medium, ease-out.
- **Hover / foco (external)** — O ícone ↗ desliza 2px na diagonal, para fora da página — medium, ease-out.

## Props

### `Link`

Links levam a outra página ou a outro ponto da página. Para disparar
ações (salvar, abrir um diálogo), use `Button`.

Polimórfico: `as` aceita o link do seu roteador.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `("symbol" & ElementType) \| ("object" & ElementType) \| ("slot" & ElementType) \| ("style" & ElementType) \| ("title" & ElementType) \| ... 175 more ...` | — | Componente renderizado no lugar do `<a>` — use para integrar com roteadores: `<Link as={RouterLink} to="/conta">`. |
| `className` | `string` | — | — |
| `external` | `boolean` | — | Link para outro site: abre em nova aba (`target="_blank"`, `rel="noopener noreferrer"`), mostra o ícone ↗ e avisa leitores de tela. |
| `ref` | `Ref<HTMLAnchorElement>` | — | — |
| `variant` | `"default" \| "subtle" \| "standalone"` | — | Estilo visual. `standalone` é para links isolados, fora de um parágrafo. |

### `linkClassName(opções)` — função

Gera as classes do link — útil para estilizar o link de um roteador.

| Opção | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `variant` | `"default" \| "subtle" \| "standalone"` | `default` | — |

## Acessibilidade

Renderiza um `<a href>` nativo, com papel, foco e teclado do navegador. Ícones são decorativos; em links externos o aviso de nova aba é texto oculto, incluído no nome acessível.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o link. |
| `Enter` | Segue o link. |

- **1.4.1** — Links em texto são sublinhados, não apenas coloridos.
- **2.4.4** — O propósito do link é dado pelo próprio texto.
- **2.4.7** — Foco visível com contorno de 2px.
- **3.2.5** — Links que abrem nova aba avisam antes, visualmente e para leitores de tela.
