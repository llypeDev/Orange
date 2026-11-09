# EmptyState

Explica por que não há conteúdo — primeiro uso, busca sem resultados, filtros — e oferece o próximo passo.

- Categoria: Feedback · Status: estável
- Importação: `import { EmptyState } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/empty-state (em inglês: https://orange.llypedev.com.br/en/components/empty-state)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-emptystate--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/EmptyState

## Boas práticas

- Explique por que está vazio e o que fazer em seguida. O título diz o fato; a descrição, o motivo ou o benefício.
- Ofereça no máximo uma ação primária. A secundária leva a alternativas (modelos, documentação, importar).
- Escolha o `headingLevel` pela hierarquia da página — dentro de uma seção com h2, use h3.
- Em painéis, listas e áreas laterais, use a variante compacta.

- Faça: Diga o que aconteceu e ofereça uma saída.
- Evite: Mensagem vaga, sem próximo passo.

## Quando aparece

- **Primeiro uso** — Ainda não existe nada. Mostre o valor do recurso e a ação para criar.
- **Sem resultados** — A busca não encontrou nada. Repita o termo e sugira como ajustar.
- **Filtros restritivos** — Existe conteúdo, mas os filtros esconderam tudo. Ofereça removê-los.
- **Tudo concluído** — Caixa de entrada zerada, sem pendências. Comemore com moderação.

## Exemplos

### Primeiro uso

A ilustração geométrica — dois quadrados e o marcador laranja — envolve o ícone escolhido.

```tsx
import { Button, EmptyState, Icon } from '@orangesys/ui'

export default function FirstUse() {
  return (
    <EmptyState
      icon="folder"
      title="Nenhum projeto ainda"
      description="Projetos reúnem tarefas, arquivos e pessoas. Crie o primeiro para convidar o seu time."
      action={<Button startIcon={<Icon name="plus" />}>Criar projeto</Button>}
      secondaryAction={<Button variant="ghost">Ver modelos</Button>}
    />
  )
}
```

### Busca sem resultados

```tsx
import { Button, EmptyState } from '@orangesys/ui'
import { useState } from 'react'

export default function NoResults() {
  const [query, setQuery] = useState('boleto vencido março')

  if (!query) {
    return (
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>Busca limpa — 248 faturas.</p>
    )
  }

  return (
    <EmptyState
      icon="search"
      headingLevel={4}
      title={`Nenhum resultado para “${query}”`}
      description="Confira a grafia ou use termos mais gerais, como o nome do cliente ou o número da fatura."
      action={
        <Button variant="outline" onClick={() => setQuery('')}>
          Limpar busca
        </Button>
      }
    />
  )
}
```

### Filtros

```tsx
import { Button, EmptyState } from '@orangesys/ui'

export default function Filtered() {
  return (
    <EmptyState
      icon="filter"
      title="Nenhum pedido com esses filtros"
      description={
        <>
          Você filtrou por <strong>Status: Cancelado</strong> e{' '}
          <strong>Período: últimos 7 dias</strong>.
        </>
      }
      action={<Button variant="outline">Remover filtros</Button>}
      secondaryAction={<Button variant="ghost">Ver todos os pedidos</Button>}
    />
  )
}
```

### Entrada

Ao montar, os quadrados caem no lugar um depois do outro e o marcador laranja estala por último.

```tsx
import { Button, EmptyState } from '@orangesys/ui'
import { useState } from 'react'

export default function Entrance() {
  // trocar a key remonta o EmptyState e repete a entrada
  const [round, setRound] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center', width: '100%' }}>
      <EmptyState
        key={round}
        icon="check-circle"
        title="Tudo em dia"
        description="Nenhuma fatura pendente neste mês."
      />
      <Button size="sm" variant="ghost" onClick={() => setRound((r) => r + 1)}>
        Repetir animação
      </Button>
    </div>
  )
}
```

### Compacta

Horizontal e menor, para painéis e listas.

```tsx
import { Button, EmptyState } from '@orangesys/ui'

export default function Compact() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 480 }}>
      <section aria-labelledby="equipe" style={{ border: '1px solid var(--or-color-border)' }}>
        <h3
          id="equipe"
          style={{
            margin: 0,
            padding: '12px 20px',
            borderBottom: '1px solid var(--or-color-border)',
            fontFamily: 'var(--or-font-display)',
          }}
        >
          Equipe do projeto
        </h3>
        <EmptyState
          variant="compact"
          headingLevel={4}
          icon="users"
          title="Ninguém foi convidado"
          description="Convide colegas para comentar e editar este projeto."
          action={
            <Button size="sm" variant="outline">
              Convidar pessoas
            </Button>
          }
        />
      </section>
      <section aria-labelledby="anexos" style={{ border: '1px solid var(--or-color-border)' }}>
        <h3
          id="anexos"
          style={{
            margin: 0,
            padding: '12px 20px',
            borderBottom: '1px solid var(--or-color-border)',
            fontFamily: 'var(--or-font-display)',
          }}
        >
          Anexos
        </h3>
        <EmptyState
          variant="compact"
          headingLevel={4}
          icon="file"
          title="Sem anexos"
          description="Arraste arquivos para cá ou use o botão Enviar."
        />
      </section>
    </div>
  )
}
```

## Movimento

- **Ao montar** — Os quadrados caem no lugar em sequência (`or-piece-drop`, `--or-duration-slow`, `--or-ease-spring`), com `--or-stagger` (80ms) entre eles.
- **Marcador** — O quadrado laranja "estala" por último (`or-scale-in`, `--or-ease-bounce`).
- **Texto** — Sobe 8px com fade (`--or-duration-medium`) junto com a ilustração.
- **Ações** — Botões afundam 1px ao pressionar (`--or-duration-press`).
- **Desligar** — `animated={false}` — por exemplo, quando o estado vazio já é o conteúdo inicial da página.
- **Movimento reduzido** — Tudo aparece de uma vez.

## Props

### `EmptyState`

Estado vazio: explica por que não há conteúdo (primeiro uso, busca sem
resultados, filtro restritivo) e oferece o próximo passo.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` (obrigatória) | `ReactNode` | — | Título curto que explica o que está vazio. |
| `action` | `ReactNode` | — | Ação principal (ex.: `<Button>Criar projeto</Button>`). |
| `animated` | `boolean` | `true` | Entrada ao montar: os quadrados da ilustração "caem" no lugar, um depois do outro, e o texto sobe 8px. Desligado automaticamente com movimento reduzido. |
| `description` | `ReactNode` | — | Texto de apoio: por que está vazio e o que fazer. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Nível semântico do título (`h2`–`h6`). Escolha pela hierarquia da página. |
| `icon` | `ReactNode` | `inbox` | Nome de um ícone do Orange ou um elemento. Fica dentro da ilustração geométrica. |
| `illustration` | `ReactNode` | — | Substitui toda a ilustração. `false` remove a ilustração. |
| `secondaryAction` | `ReactNode` | — | Ação secundária (ex.: um link para a documentação). |
| `variant` | `"default" \| "compact"` | `default` | `compact`: horizontal e menor, para painéis, listas e células. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O título é um heading real (`h2`–`h6`), então o estado vazio aparece na navegação por títulos. A ilustração é decorativa ( `aria-hidden`). Se o estado vazio surgir depois de uma ação (ex.: uma busca), anuncie o resultado numa região `role="status"` — por exemplo, "Nenhum resultado".

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para as ações. |
| `Enter` | Ativa a ação focada. |

- **1.1.1** — Ilustração decorativa oculta de tecnologias assistivas.
- **1.3.1** — Título exposto como heading no nível configurado.
- **2.4.6** — Título e ações descrevem o estado e o próximo passo.
