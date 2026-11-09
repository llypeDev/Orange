# Reveal

Revela o conteúdo quando ele entra na tela: sobe 24px e aparece em 600ms, com escalonamento opcional entre os filhos.

- Categoria: Utilitários · Status: estável
- Importação: `import { Reveal } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/reveal (em inglês: https://orange.llypedev.com.br/en/components/reveal)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-reveal--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Reveal

## Boas práticas

- Use em páginas de leitura e marketing — seções, cartões de recursos, números — para dar ritmo à rolagem. Em telas de trabalho (tabelas, formulários, painéis), não revele nada: a pessoa precisa ver o conteúdo já pronto.
- Revele blocos, não frases soltas. Para grupos de itens irmãos, prefira um único `<Reveal stagger>` a vários Reveals com atraso manual.
- Mantenha sequências curtas: o escalonamento para no 9º filho (8 × 80ms). Listas longas devem aparecer de uma vez.
- Nunca dependa da revelação para comunicar algo: o conteúdo é o mesmo com ou sem movimento.

- Faça: Uma revelação por seção, ao entrar na tela pela primeira vez.
- Faça: Cartões de um mesmo grupo com stagger.
- Evite: Revelar o conteúdo acima da dobra ou o título principal da página.
- Evite: Usar `once={false}` em páginas longas: o conteúdo some e reaparece a cada rolagem.

## Exemplos

### Variantes

Role a página até aqui: `up` (padrão) sobe 24px, `fade` só muda a opacidade e `scale` cresce de 0.96. Recarregue a página no topo para ver de novo.

```tsx
import { Reveal } from '@orangesys/ui'

export default function Basico() {
  return (
    <div className="guide-reveal-grid guide-reveal-grid--flush">
      {/* up (padrão): opacidade + 24px · fade: só opacidade · scale: opacidade + escala 0.96 */}
      <Reveal className="guide-reveal-card">variant="up"</Reveal>
      <Reveal variant="fade" className="guide-reveal-card">
        variant="fade"
      </Reveal>
      <Reveal variant="scale" className="guide-reveal-card">
        variant="scale"
      </Reveal>
    </div>
  )
}
```

### Grupo escalonado

Com `stagger`, o Reveal anima os filhos diretos em sequência — cada um 80ms depois do anterior. Use `as` para manter a semântica de lista.

```tsx
import { Icon, Reveal } from '@orangesys/ui'

const recursos = [
  { icone: 'layers', titulo: 'Tokens', texto: 'Cor, tipo, espaço e movimento.' },
  { icone: 'grid', titulo: 'Fundamentos', texto: 'Grid, ícones e tipografia.' },
  { icone: 'code', titulo: 'Componentes', texto: 'React acessível e testado.' },
  { icone: 'accessibility', titulo: 'Acessibilidade', texto: 'WCAG 2.2 AA por padrão.' },
] as const

export default function Escalonado() {
  return (
    // stagger: cada filho direto entra --or-stagger (80ms) depois do anterior
    <Reveal
      as="ul"
      stagger
      className="guide-reveal-grid guide-reveal-grid--flush guide-reveal-list"
    >
      {recursos.map((r) => (
        <li key={r.titulo} className="guide-reveal-card">
          <Icon name={r.icone} />
          <strong>{r.titulo}</strong>
          <span>{r.texto}</span>
        </li>
      ))}
    </Reveal>
  )
}
```

### Sequência com index e delay

Quando os elementos não são irmãos diretos, dê a cada Reveal sua posição com `index` (soma 80ms por posição) e, se preciso, um atraso fixo com `delay`.

```tsx
import { Button, Icon, Reveal } from '@orangesys/ui'

export default function Sequencia() {
  return (
    <div className="guide-stack">
      {/* Elementos que não são irmãos: index soma 80ms por posição; delay adiciona um atraso fixo */}
      <Reveal index={0}>
        <span className="or-eyebrow">Plano Pro</span>
      </Reveal>
      <Reveal index={1}>
        <h4 className="guide-reveal-title">Tudo o que sua loja precisa para crescer</h4>
      </Reveal>
      <Reveal index={2}>
        <p className="guide-reveal-text">
          Até 10 lojas, relatórios diários e suporte em português.
        </p>
      </Reveal>
      <Reveal index={3} delay={120} variant="fade">
        <Button endIcon={<Icon name="arrow-right" />}>Assinar o Pro</Button>
      </Reveal>
    </div>
  )
}
```

### Contêiner rolável

O Reveal observa a viewport, inclusive o recorte de contêineres roláveis. Role dentro da caixa: cada pedido aparece ao entrar na área visível. Com `once={false}`, ele se esconde ao sair e revela de novo ao voltar — use “Repetir”.

```tsx
import { Button, Icon, Reveal, useReducedMotion } from '@orangesys/ui'
import { useRef } from 'react'

const pedidos = [
  { id: '#4821', cliente: 'Ana Souza', total: 'R$ 289,90' },
  { id: '#4822', cliente: 'Bruno Lima', total: 'R$ 74,50' },
  { id: '#4823', cliente: 'Carla Dias', total: 'R$ 1.120,00' },
  { id: '#4824', cliente: 'Diego Alves', total: 'R$ 56,00' },
  { id: '#4825', cliente: 'Elisa Rocha', total: 'R$ 432,10' },
  { id: '#4826', cliente: 'Fábio Nunes', total: 'R$ 98,40' },
]

export default function ContainerRolavel() {
  const caixa = useRef<HTMLDivElement>(null)
  const reduzido = useReducedMotion()
  const repetir = () => {
    const el = caixa.current
    if (!el) return
    el.scrollTo({ top: 0 })
    window.setTimeout(
      () => el.scrollTo({ top: el.scrollHeight, behavior: reduzido ? 'auto' : 'smooth' }),
      150,
    )
  }
  return (
    <div className="guide-stack">
      <div
        ref={caixa}
        className="guide-stage"
        tabIndex={0}
        role="region"
        aria-label="Pedidos recentes (área rolável)"
      >
        <p className="guide-stage__hint">
          Role dentro da caixa <Icon name="arrow-down" size="sm" />
        </p>
        <div className="guide-stage__spacer" />
        <ul className="guide-reveal-orders">
          {pedidos.map((p) => (
            // once={false}: esconde ao sair da área visível e revela de novo ao voltar
            <Reveal as="li" key={p.id} once={false} className="guide-reveal-order">
              <span className="guide-mono">{p.id}</span>
              <span>{p.cliente}</span>
              <strong>{p.total}</strong>
            </Reveal>
          ))}
        </ul>
      </div>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={repetir}
        >
          Repetir
        </Button>
      </div>
    </div>
  )
}
```

## Props

### `Reveal`

Revela o conteúdo quando ele entra na viewport: sobe 24px e aparece em
600ms, com escalonamento opcional entre os filhos. Conteúdo já visível na
carga não pisca; sem JavaScript ou com movimento reduzido, tudo aparece
imediatamente. Puramente visual: nada é escondido de leitores de tela.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `appear` | `boolean` | `false` | Anima também quando o conteúdo já está visível ao montar (entrada de página/hero). Sem `appear`, conteúdo acima da dobra aparece direto. |
| `as` | `ElementType` | `div` | Elemento renderizado. Padrão: `div`. |
| `delay` | `number` | — | Atraso antes de começar, em ms. |
| `index` | `number` | — | Posição numa sequência: cada índice soma `--or-stagger` (80ms) ao atraso. |
| `once` | `boolean` | `true` | Revela só uma vez (padrão) ou sempre que entrar na viewport. |
| `rootMargin` | `string` | `0px 0px -60px 0px` | Margem do IntersectionObserver. |
| `stagger` | `boolean` | `false` | Escalona os filhos diretos (cada um entra 80ms depois do anterior). |
| `variant` | `"up" \| "fade" \| "scale"` | `up` | Tipo de entrada: subir 24px (padrão), só opacidade ou leve escala. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`RevealVariant`:

```ts
export type RevealVariant = 'up' | 'fade' | 'scale'
```

## Movimento

- **Entrada** — Opacidade 0 → 1 e `translateY(--or-distance-lg)` (24px) em `--or-duration-reveal` (600ms) com `--or-ease-out`.
- **Escalonamento** — `--or-stagger` (80ms) × posição, somado ao `delay`.
- **Disparo** — `IntersectionObserver` com `rootMargin` −60px na base e `threshold` 0: revela assim que o topo entra na tela, mesmo em contêineres mais altos que a viewport (uma grade longa no celular). Por padrão, uma única vez. Quando a entrada termina, o elemento ganha `data-reveal-settled` e os filhos voltam às próprias transições (o hover de um cartão não herda o atraso escalonado).
- **Acima da dobra** — O que já está visível na primeira pintura não anima — nada pisca ao carregar.
- **SSR e sem JavaScript** — O HTML do servidor sai visível; o estado escondido só é aplicado no cliente.
- **Movimento reduzido** — Com `prefers-reduced-motion`, tudo aparece imediatamente: o estado escondido nunca é aplicado e os tokens de duração e distância vão a zero.

## Acessibilidade

O Reveal é puramente visual. O conteúdo fica no DOM e na árvore de acessibilidade o tempo todo — `opacity` e `transform` não escondem nada de leitores de tela — e a ordem do documento não muda. Elementos focáveis dentro dele continuam focáveis e na mesma ordem de tabulação.

- **2.2.2** — A animação dura 600ms, é disparada pela rolagem e não se repete sozinha — não há movimento automático a pausar.
- **2.3.3** — Animação a partir de interação desativada com prefers-reduced-motion: o conteúdo aparece sem deslocamento.
- **1.3.2** — A sequência de leitura é a do DOM; o escalonamento é só visual.
