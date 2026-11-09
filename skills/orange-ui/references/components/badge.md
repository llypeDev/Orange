# Badge

Indicador numérico ou ponto que sinaliza novidades, pendências ou status, inline ou sobre outro elemento.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Badge } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/badge (em inglês: https://orange.llypedev.com.br/en/components/badge)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-badge--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Badge

## Boas práticas

- Use badges para contagens e sinais curtos que mudam com o uso: notificações, itens pendentes, novidades.
- Sempre informe `label` com a frase completa ("3 notificações não lidas"). Um número solto não diz o que está sendo contado.
- Limite números grandes com `max` (padrão 99 → "99+"). O valor exato pode ir no `label`.
- Para rótulos de texto ("Novo", "Beta", status), use Tag. Badge é para números e pontos.

- Faça: Badge com label sobre um botão neutro.
- Evite: Badge sem label e com a mesma cor do fundo em que está.

## Exemplos

### Sobre botões

Com children, o badge fica no canto superior direito e o label vira a descrição acessível do botão (aria-describedby).

```tsx
import { Badge, Button, Icon } from '@orangesys/ui'

export default function Overlay() {
  return (
    <>
      <Badge count={3} label="3 notificações não lidas">
        <Button variant="outline" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
      </Badge>
      <Badge count={128} label="128 itens no carrinho" tone="neutral">
        <Button variant="outline" iconOnly aria-label="Carrinho" startIcon={<Icon name="inbox" />} />
      </Badge>
      <Badge dot label="Há mensagens novas" tone="info">
        <Button variant="ghost" iconOnly aria-label="Mensagens" startIcon={<Icon name="mail" />} />
      </Badge>
    </>
  )
}
```

### Contagem ao vivo

O badge surge com um pop, salta quando a contagem muda e encolhe ao zerar. pulse liga o anel "ao vivo" no ponto.

```tsx
import { Badge, Button, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function LiveCount() {
  const [unread, setUnread] = useState(2)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Badge count={unread} label={`${unread} notificações não lidas`}>
        <Button variant="outline" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
      </Badge>
      <Button variant="ghost" size="sm" startIcon={<Icon name="plus" />} onClick={() => setUnread((n) => n + 1)}>
        Simular notificação
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setUnread(0)} disabled={unread === 0}>
        Marcar como lidas
      </Button>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <Badge dot pulse tone="danger" label="Transmissão ao vivo" />
        <span style={{ fontSize: 'var(--or-text-sm)' }}>Ao vivo · 128 assistindo</span>
      </span>
    </div>
  )
}
```

### Inline em navegação

Sem children, o badge acompanha o texto. Com count={0}, ele some (use showZero para manter).

```tsx
import { Badge, Icon } from '@orangesys/ui'

const folders = [
  { name: 'Caixa de entrada', icon: 'inbox', count: 12, label: '12 não lidas', tone: 'accent' },
  { name: 'Aguardando aprovação', icon: 'clock', count: 3, label: '3 pendentes', tone: 'warning' },
  { name: 'Com erro', icon: 'alert-triangle', count: 1, label: '1 com erro', tone: 'danger' },
  { name: 'Arquivadas', icon: 'folder', count: 0, label: 'nenhuma', tone: 'neutral' },
] as const

export default function Inline() {
  return (
    <nav aria-label="Pastas" style={{ width: '100%', maxWidth: 320 }}>
      <ul style={{ display: 'grid', gap: 4, margin: 0, padding: 0, listStyle: 'none' }}>
        {folders.map((folder) => (
          <li key={folder.name}>
            <a
              href={`#${folder.icon}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                color: 'inherit',
                textDecoration: 'none',
                border: '1px solid var(--or-color-border)',
              }}
            >
              <Icon name={folder.icon} size="sm" />
              <span style={{ marginRight: 'auto' }}>{folder.name}</span>
              {/* count 0 esconde o badge automaticamente */}
              <Badge count={folder.count} tone={folder.tone} label={folder.label} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

### Sobre avatares

overlap="circle" aproxima o badge da borda de elementos redondos.

```tsx
import { Avatar, Badge } from '@orangesys/ui'

const chats = [
  { name: 'Mariana Lopes', unread: 2 },
  { name: 'Rafael Costa', unread: 0 },
  { name: 'Suporte Orange', unread: 14 },
]

export default function OnAvatar() {
  return (
    <>
      {chats.map((chat) => (
        <Badge
          key={chat.name}
          count={chat.unread}
          label={`${chat.unread} mensagens não lidas`}
          overlap="circle"
          size="sm"
        >
          <Avatar name={chat.name} shape="circle" size="lg" />
        </Badge>
      ))}
    </>
  )
}
```

### Tons, tamanhos e pontos

accent (padrão), neutral, success, warning, danger e info, nos tamanhos md e sm. Pontos sem label são decorativos.

```tsx
import { Badge } from '@orangesys/ui'

const tones = ['accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} count={8} />
        ))}
        <Badge count={1500} />
        <Badge count={42} max={9} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} count={8} size="sm" />
        ))}
        {tones.map((tone) => (
          <Badge key={`dot-${tone}`} tone={tone} dot />
        ))}
      </div>
    </div>
  )
}
```

## Movimento

- **Surgir (0 → N)** — Pop de escala 0.4 → 1 com fade, --or-duration-medium (250ms), --or-ease-bounce. A primeira renderização da página não anima.
- **Contagem muda** — "Salto" de escala 0.7 → 1 sem piscar, 250ms, --or-ease-bounce.
- **Sumir (N → 0)** — Encolhe e some em --or-duration-fast (160ms), --or-ease-in-out, mantendo o último número durante a saída.
- **pulse** — Anel pulsante (or-pulse-ring) em --or-duration-loop (2.4s). Use para status ao vivo; desligado em movimento reduzido.

## Props

### `Badge`

Indicador numérico ou ponto, inline ou sobreposto a outro elemento
(ícone, botão, avatar).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Elemento sobre o qual o badge é posicionado (canto superior direito). O `label` é ligado a ele via `aria-describedby`. |
| `count` | `number` | — | Número exibido. Com `0`, o badge some (a menos que `showZero`). |
| `dot` | `boolean` | `false` | Mostra apenas um ponto (sem número). |
| `label` | `string` | — | Texto acessível completo (ex.: "3 notificações não lidas"). Sem ele, o leitor de tela ouve apenas o número; pontos sem `label` são decorativos. |
| `max` | `number` | `99` | Valor máximo exibido; acima dele mostra `max+`. Padrão: 99. |
| `overlap` | `"circle" \| "square"` | `square` | Forma do elemento ancorado, para ajustar a posição do badge. |
| `pulse` | `boolean` | `false` | Anel pulsante ("ao vivo"), útil com `dot`. Desligado em movimento reduzido. |
| `showZero` | `boolean` | `false` | Mantém o badge visível quando `count` é 0. |
| `size` | `"sm" \| "md"` | `md` | Tamanho: `sm` ou `md` (padrão). |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "accent"` | `accent` | Cor semântica. Padrão: `accent`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Inline, o número fica oculto para leitores de tela e o `label` é lido no lugar dele. Sobre um elemento, o badge visual é `aria-hidden` e o `label` é ligado ao filho via `aria-describedby`: o leitor anuncia "Notificações, botão, 3 notificações não lidas". O filho nunca é remontado quando a contagem muda, então o foco é preservado.

Mudanças de contagem não são anunciadas automaticamente. Se a atualização for importante, anuncie-a com um Toast ou uma região de status.

- **1.1.1** — O label dá significado ao número ou ponto.
- **1.4.1** — Informação não depende só da cor: o label descreve o estado.
- **1.4.3** — Contraste mínimo de 4.5:1 entre número e fundo em todos os tons.
- **1.4.11** — Anel na cor do fundo separa o badge do elemento ancorado.
