# BottomNavigation

Barra de navegação inferior para telas pequenas, com 3 a 5 destinos principais sempre à mão.

- Categoria: Navegação · Status: estável
- Importação: `import { BottomNavigation } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/bottom-navigation (em inglês: https://orange.llypedev.com.br/en/components/bottom-navigation)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-bottomnavigation--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/BottomNavigation

## Boas práticas

- Use de 3 a 5 destinos de mesmo nível, os mais usados do app. Ações (como "Novo pedido") não são destinos — use um botão.
- Rótulos sempre visíveis, com uma palavra. Ícone sozinho não é suficiente.
- Mostre a barra apenas em telas pequenas; em telas largas, a mesma navegação vai para o AppHeader ou o SideNav.
- Badges numéricos precisam de `badgeLabel` ("12 não lidas"); o ponto sozinho não diz nada a leitores de tela.

- Faça: Destinos de mesmo nível.
- Evite: Misturar destinos com ações como "Novo" e "Sair".

## Exemplos

### Básico

Sem href, os itens são botões controlados por value/onChange — útil para telas dentro do mesmo app.

```tsx
import { BottomNavigation, Icon } from '@orangesys/ui'
import { useState } from 'react'

const titles: Record<string, string> = {
  inicio: 'Restaurantes perto de você',
  buscar: 'Buscar pratos e lojas',
  pedidos: 'Seus pedidos',
  conta: 'Minha conta',
}

export default function Basic() {
  const [tab, setTab] = useState('inicio')
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--or-color-border-strong)', background: 'var(--or-color-surface)' }}>
      <div style={{ height: 220, padding: 16 }}>
        <strong>{titles[tab]}</strong>
      </div>
      <BottomNavigation
        aria-label="Navegação do app"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'inicio', label: 'Início', icon: <Icon name="home" /> },
          { value: 'buscar', label: 'Buscar', icon: <Icon name="search" /> },
          { value: 'pedidos', label: 'Pedidos', icon: <Icon name="inbox" /> },
          { value: 'conta', label: 'Conta', icon: <Icon name="user" /> },
        ]}
      />
    </div>
  )
}
```

### Com badges

badge mostra um contador (ou ponto com true) sobre o ícone; badgeLabel é o texto anunciado.

```tsx
import { BottomNavigation, Icon } from '@orangesys/ui'

export default function Badges() {
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--or-color-border-strong)' }}>
      <BottomNavigation
        aria-label="Navegação do banco"
        defaultValue="extrato"
        items={[
          { value: 'extrato', label: 'Extrato', icon: <Icon name="chart-bar" /> },
          { value: 'pix', label: 'Pix', icon: <Icon name="zap" /> },
          { value: 'mensagens', label: 'Mensagens', icon: <Icon name="mail" />, badge: 12, badgeLabel: '12 não lidas' },
          { value: 'perfil', label: 'Perfil', icon: <Icon name="user" />, badge: true, badgeLabel: 'atualização pendente' },
        ]}
      />
    </div>
  )
}
```

### Com roteador

Com href, os itens são links; renderLink usa o link do roteador e value pode ser a rota atual.

```tsx
import { BottomNavigation, Icon } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real: import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/agenda' // useLocation().pathname
  const items = [
    { value: '/agenda', href: '/agenda', label: 'Agenda', icon: <Icon name="calendar" /> },
    { value: '/pacientes', href: '/pacientes', label: 'Pacientes', icon: <Icon name="users" /> },
    { value: '/alertas', href: '/alertas', label: 'Alertas', icon: <Icon name="bell" />, badge: 2, badgeLabel: '2 novos' },
  ]
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--or-color-border-strong)' }}>
      <BottomNavigation
        aria-label="Navegação da clínica"
        value={pathname}
        items={items}
        renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      />
    </div>
  )
}
```

### Fixa no rodapé

No layout real, use fixed e reserve espaço no fim do conteúdo.

```tsx
import { BottomNavigation, Icon } from '@orangesys/ui'
import type { ReactNode } from 'react'

// Em produção, use fixed e reserve espaço no fim da página para a barra.
export function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="main" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}>
        {children}
      </main>
      <BottomNavigation
        fixed
        defaultValue="inicio"
        items={[
          { value: 'inicio', href: '/', label: 'Início', icon: <Icon name="home" /> },
          { value: 'explorar', href: '/explorar', label: 'Explorar', icon: <Icon name="globe" /> },
          { value: 'salvos', href: '/salvos', label: 'Salvos', icon: <Icon name="heart" /> },
          { value: 'conta', href: '/conta', label: 'Conta', icon: <Icon name="user" /> },
        ]}
      />
    </>
  )
}

export default function Fixed() {
  return (
    <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
      Com <code>fixed</code>, a barra fica presa ao rodapé da janela e respeita a área segura do iPhone.
    </p>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Trocar de destino** — O indicador laranja do topo desliza até o novo destino (translateX) — medium, ease-spring.
- **Destino ativo** — O ícone dá um pequeno pop (scale 0.82 → 1) — medium, ease-bounce; cor em fast.
- **Pressionar** — O ícone afunda (translateY(1px) scale(0.9)) — press (90ms).

## Props

### `BottomNavigation`

Barra de navegação inferior para telas pequenas: de 3 a 5 destinos
principais, com ícone e rótulo sempre visíveis.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `items` (obrigatória) | `BottomNavigationItem[]` | — | De 3 a 5 destinos principais. |
| `defaultValue` | `string` | — | Destino ativo inicial (não controlado). |
| `fixed` | `boolean` | `false` | Prende a barra na parte inferior da janela (respeitando a área segura do iOS). |
| `onChange` | `((value: string) => void)` | — | Chamado ao escolher um destino. |
| `renderLink` | `RenderLink` | — | Renderiza os links com o componente do seu roteador. |
| `value` | `string` | — | Destino ativo (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Uma `<nav>` rotulada com uma lista de links (ou botões). O destino ativo tem `aria-current="page"`, ícone laranja e indicador no topo. Ícones são decorativos; o rótulo visível é o nome acessível, complementado pelo texto do badge.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os destinos. |
| `Enter` | Abre o destino. |

- **1.4.1** — Destino ativo indicado por barra e cor do ícone, não só pela cor do texto.
- **2.5.8** — Alvos de toque com 56px de altura.
- **2.4.6** — Rótulos visíveis e descritivos.
- **4.1.2** — Destino atual exposto com aria-current="page".
