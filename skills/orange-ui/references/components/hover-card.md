# HoverCard

Cartão de pré-visualização ao passar o ponteiro ou focar um link — perfis, itens referenciados, prévias de páginas.

- Categoria: Sobreposições · Status: estável
- Importação: `import { HoverCard } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/hover-card (em inglês: https://orange.llypedev.com.br/en/components/hover-card)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-hovercard--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/HoverCard

## Boas práticas

- Use para pré-visualizar o destino de um link — perfil de uma pessoa, resumo de uma tarefa, prévia de um artigo — sem obrigar a abrir a página.
- O conteúdo é complementar: tudo que aparece no cartão precisa estar também no destino do link. Quem usa toque ou leitor de tela pode nunca ver o cartão.
- Não coloque ações essenciais (botões de seguir, aprovar…) apenas no cartão. Para conteúdo interativo aberto por clique, use Popover.
- Ajuste `openDelay` para que o cartão não apareça ao simplesmente cruzar o link com o mouse.

## Exemplos

### Perfil

Passe o ponteiro sobre o nome ou foque o link com Tab. O cartão continua aberto enquanto o ponteiro estiver sobre ele.

```tsx
import { HoverCard } from '@orangesys/ui'

function Perfil() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          aria-hidden="true"
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--or-color-accent)',
            color: 'var(--or-color-text-on-accent)',
            fontFamily: 'var(--or-font-display)',
            fontWeight: 700,
          }}
        >
          AS
        </span>
        <div style={{ display: 'grid' }}>
          <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 16 }}>Ana Souza</strong>
          <span style={{ color: 'var(--or-color-text-subtle)' }}>@ana.souza</span>
        </div>
      </div>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Designer de produto no time de Pagamentos. Cuida do checkout e do app do lojista.
      </p>
      <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>
        São Paulo · 14 projetos · desde 2021
      </span>
    </div>
  )
}

export default function Profile() {
  return (
    <p style={{ margin: 0 }}>
      Revisão solicitada por{' '}
      <HoverCard trigger={<a href="#perfil-ana">Ana Souza</a>} placement="bottom-start">
        <Perfil />
      </HoverCard>{' '}
      há 2 horas.
    </p>
  )
}
```

### Prévia de link

Com seta, acima do link e atraso de 400ms.

```tsx
import { HoverCard } from '@orangesys/ui'

export default function LinkPreview() {
  return (
    <p style={{ margin: 0, maxWidth: 560 }}>
      Antes de publicar, confira o guia{' '}
      <HoverCard
        arrow
        placement="top"
        openDelay={400}
        trigger={<a href="#guia-acessibilidade">Acessibilidade em formulários</a>}
      >
        <div style={{ display: 'grid', gap: 6 }}>
          <span className="or-eyebrow">Guia · 6 min de leitura</span>
          <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 16, lineHeight: 1.25 }}>
            Acessibilidade em formulários
          </strong>
          <span style={{ color: 'var(--or-color-text-muted)' }}>
            Rótulos, mensagens de erro e ordem de foco: o checklist que usamos em todo formulário do
            produto.
          </span>
        </div>
      </HoverCard>{' '}
      e o checklist de revisão.
    </p>
  )
}
```

### Menções

Atrasos menores para listas de menções: ao passar de uma para outra, o cartão troca rapidamente.

```tsx
import { HoverCard } from '@orangesys/ui'

const pessoas = [
  { usuario: 'bruno', nome: 'Bruno Lima', cargo: 'Engenharia · Plataforma', status: 'Disponível' },
  { usuario: 'carla', nome: 'Carla Mendes', cargo: 'Dados · Growth', status: 'Em reunião até 15h' },
]

export default function Mentions() {
  return (
    <p style={{ margin: 0 }}>
      {pessoas.map((pessoa, i) => (
        <span key={pessoa.usuario}>
          {i > 0 && ' e '}
          <HoverCard
            openDelay={300}
            closeDelay={200}
            trigger={<a href={`#${pessoa.usuario}`}>@{pessoa.usuario}</a>}
          >
            <div style={{ display: 'grid', gap: 4 }}>
              <strong style={{ fontFamily: 'var(--or-font-display)' }}>{pessoa.nome}</strong>
              <span style={{ color: 'var(--or-color-text-muted)' }}>{pessoa.cargo}</span>
              <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>
                {pessoa.status}
              </span>
            </div>
          </HoverCard>
        </span>
      ))}{' '}
      comentaram nesta tarefa.
    </p>
  )
}
```

## Movimento

- **Entrada** — Depois do openDelay (600ms): opacidade + 4px vindo do link. 250ms, --or-ease-out.
- **Saída** — Depois do closeDelay (300ms): recua 4px e some em 160ms; inerte durante a saída.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `HoverCard`

Cartão de pré-visualização exibido ao passar o ponteiro ou focar um link —
perfil de uma pessoa, resumo de um item. Conteúdo complementar: tudo nele
também precisa estar disponível no destino do link.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` (obrigatória) | `ReactNode` | — | Pré-visualização complementar. Não coloque aqui nada essencial. |
| `trigger` (obrigatória) | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Link ou elemento focável que mostra o cartão (ex.: `<a href="/u/ana">@ana</a>`). |
| `arrow` | `boolean` | `false` | Mostra uma seta apontando para o gatilho. |
| `closeDelay` | `number` | `300` | Atraso para fechar ao sair, em ms (tempo para alcançar o cartão). |
| `defaultOpen` | `boolean` | `false` | Aberto inicialmente (não controlado). |
| `offset` | `number` | `8` | Distância do gatilho, em px. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o cartão abre ou fecha. |
| `open` | `boolean` | — | Aberto (controlado). |
| `openDelay` | `number` | `600` | Atraso para abrir, em ms. |
| `placement` | `"bottom" \| "top" \| "left" \| "right" \| "bottom-start" \| "bottom-end" \| "top-start" \| "top-end" \| "left-start" \| "left-end" \| "right-start" \| "right-end"` | `bottom` | Posição preferida; inverte sozinha se faltar espaço. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O cartão abre no hover e também no foco por teclado do gatilho, respeitando os atrasos. Ele não rouba o foco nem muda a semântica do link: o gatilho continua sendo um link comum que leva ao conteúdo completo. Escape fecha sem mover o foco.

| Teclas | Ação |
| --- | --- |
| `Tab` | Focar o link mostra o cartão após o atraso; sair dele fecha. |
| `Enter` | Segue o link normalmente. |
| `Esc` | Fecha o cartão sem mover o foco. |

> **Conteúdo complementar** Leitores de tela não são avisados da existência do cartão. Por isso ele nunca deve ser o único lugar de uma informação ou ação.

- **1.4.13** — Dispensável com Escape, sobrevoável e persistente enquanto o ponteiro ou o foco estiver no gatilho/cartão.
- **2.1.1** — Também abre pelo foco do teclado, não só pelo mouse.
- **3.2.1** — Receber foco não muda o contexto: o cartão aparece sem mover o foco.
