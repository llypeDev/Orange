# Avatar

Representa uma pessoa ou organização com foto, iniciais ou ícone, e indicador de presença opcional.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Avatar } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/avatar (em inglês: https://orange.llypedev.com.br/en/components/avatar)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-avatar--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Avatar

## Boas práticas

- Sempre informe `name`: ele gera as iniciais, a cor de fundo e o nome acessível — mesmo quando há foto, para o caso de ela falhar.
- Se o nome já está escrito ao lado do avatar, use `alt=""` para não repeti-lo no leitor de tela.
- Use square (padrão) para pessoas e organizações na interface; circle quando o produto pedir um tom mais pessoal, como chats.
- Não dependa só da cor do status: mostre o estado em texto quando ele for importante para a tarefa.

## Conteúdo exibido

- **Foto** — Quando src carrega. Aparece com um fade suave sobre as iniciais.
- **Iniciais** — Primeira letra do primeiro e do último nome, sobre uma cor derivada do nome.
- **Ícone** — Sem foto e sem nome. Personalizável via icon.

## Exemplos

### Foto e alternativas

Foto carregada, foto quebrada (volta para as iniciais), apenas nome e nenhum dado.

```tsx
import { Avatar } from '@orangesys/ui'
import mariana from './photos/mariana.svg'

export default function Fallbacks() {
  return (
    <>
      {/* 1. Foto carregada */}
      <Avatar src={mariana} name="Mariana Lopes" size="lg" />
      {/* 2. Foto que falhou: volta para as iniciais */}
      <Avatar src="/fotos/rafael-inexistente.jpg" name="Rafael Costa" size="lg" />
      {/* 3. Sem foto: iniciais e cor derivadas do nome */}
      <Avatar name="Beatriz Nunes" size="lg" />
      {/* 4. Sem nome: ícone de usuário */}
      <Avatar alt="Convidado" size="lg" />
    </>
  )
}
```

### Tamanhos e formas

xs (24px), sm (32px), md (40px, padrão), lg (48px) e xl (64px), em square ou circle.

```tsx
import { Avatar } from '@orangesys/ui'
import rafael from './photos/rafael.svg'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export default function SizesShapes() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        {sizes.map((size) => (
          <Avatar key={size} size={size} name="Diego Almeida" />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        {sizes.map((size) => (
          <Avatar key={size} size={size} shape="circle" src={rafael} name="Rafael Costa" />
        ))}
      </div>
    </div>
  )
}
```

### Presença

online, away, busy e offline. O texto do status entra no nome acessível (ou em texto oculto, com alt=""). Use statusLabel para detalhar e pulse para o anel "ao vivo".

```tsx
import { Avatar, type AvatarStatus } from '@orangesys/ui'
import beatriz from './photos/beatriz.svg'
import mariana from './photos/mariana.svg'

interface Member {
  name: string
  role: string
  photo?: string
  status: AvatarStatus
  statusLabel?: string
}

const team: Member[] = [
  { name: 'Mariana Lopes', role: 'Product designer', photo: mariana, status: 'online' },
  { name: 'Rafael Costa', role: 'Engenheiro front-end', status: 'busy', statusLabel: 'Ocupado, em reunião até 15h' },
  { name: 'Beatriz Nunes', role: 'Pesquisadora UX', photo: beatriz, status: 'away' },
  { name: 'Thiago Rocha', role: 'Gerente de produto', status: 'offline' },
]

export default function Presence() {
  return (
    <ul style={{ display: 'grid', gap: 16, margin: 0, padding: 0, listStyle: 'none' }}>
      {team.map((person) => (
        <li key={person.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* alt="" porque o nome já está escrito ao lado; o status continua acessível */}
          <Avatar
            alt=""
            name={person.name}
            src={person.photo}
            status={person.status}
            statusLabel={person.statusLabel}
            pulse={person.status === 'online'}
          />
          <span style={{ display: 'grid' }}>
            <strong style={{ fontWeight: 600 }}>{person.name}</strong>
            <span style={{ color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>{person.role}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
```

### Cores determinísticas

A cor de fundo vem de uma paleta de tokens e é sempre a mesma para o mesmo nome, em qualquer tela.

```tsx
import { Avatar } from '@orangesys/ui'

const customers = [
  'Padaria Aurora',
  'Clínica Bem Viver',
  'Atelier Norte',
  'Mercado São Jorge',
  'Studio Pilates Vila',
  'Oficina do Pedro',
  'Livraria Capitu',
  'Café Moinho',
]

export default function Colors() {
  return (
    <>
      {customers.map((name) => (
        <Avatar key={name} name={name} title={name} />
      ))}
    </>
  )
}
```

## Movimento

- **Foto carregada** — Fade e escala 1.06 → 1 sobre as iniciais. --or-duration-slow (400ms), --or-ease-out.
- **Mudança de status** — A cor do indicador transiciona em --or-duration-medium (250ms).
- **pulse** — Anel pulsante em box-shadow (or-pulse-ring), --or-duration-loop (2.4s) em loop, na cor do status. Só para estados "ao vivo"; desligado em movimento reduzido.

## Props

### `Avatar`

Representa uma pessoa ou organização: foto, iniciais ou ícone, com
indicador de presença opcional.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `alt` | `string` | — | Texto alternativo. Padrão: `name`. Use `alt=""` quando o nome já estiver escrito ao lado do avatar (o avatar vira decorativo). |
| `icon` | `ReactNode` | — | Ícone usado quando não há imagem nem nome. |
| `imgProps` | `Omit<ImgHTMLAttributes<HTMLImageElement>, "src" \| "alt">` | — | Atributos extras da `<img>` (ex.: `referrerPolicy`, `loading`). |
| `name` | `string` | — | Nome da pessoa: gera as iniciais e a cor de fundo. |
| `pulse` | `boolean` | `false` | Anel pulsante no indicador ("ao vivo"). Ignorado para `offline` e em movimento reduzido. |
| `shape` | `"circle" \| "square"` | — | Forma: `square` (padrão) ou `circle`. |
| `size` | `"sm" \| "md" \| "lg" \| "xs" \| "xl"` | — | `xs` 24px, `sm` 32px, `md` 40px, `lg` 48px, `xl` 64px. |
| `src` | `string` | — | URL da foto. Se falhar, mostra as iniciais (ou o ícone de usuário). |
| `status` | `"online" \| "away" \| "busy" \| "offline"` | — | Indicador de presença. |
| `statusLabel` | `string` | — | Substitui o texto acessível do status. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O avatar é exposto como uma única imagem (`role="img"`) cujo nome reúne pessoa e status — "Mariana Lopes, Online". Foto, iniciais e indicador são decorativos dentro dele. Com `alt=""`, a imagem some da árvore de acessibilidade e só o status permanece, como texto oculto. Não é interativo: para abrir um perfil, envolva-o em um link com texto.

- **1.1.1** — Alternativa em texto pelo nome; modo decorativo com alt="".
- **1.4.1** — Status não depende só da cor: tem texto acessível e formas distintas (busy com barra, offline vazado).
- **1.4.3** — Iniciais sobre fundo misturado à superfície, com contraste mínimo de 4.5:1 nos dois temas.
- **1.4.11** — Indicador de status com anel na cor do fundo para se destacar da foto.
