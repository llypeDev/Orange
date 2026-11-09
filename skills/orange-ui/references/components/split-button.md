# SplitButton

Uma ação principal ao lado de uma seta que abre um menu com ações alternativas relacionadas.

- Categoria: Ações · Status: estável
- Importação: `import { SplitButton } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/split-button (em inglês: https://orange.llypedev.com.br/en/components/split-button)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-splitbutton--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/SplitButton

## Boas práticas

- A ação principal é a mais comum; o menu guarda variações dela (salvar como rascunho, exportar em outro formato).
- Mantenha o menu curto — de 2 a 6 itens — com rótulos que começam com verbo.
- Se as ações não são variações da principal, use um botão comum e um menu separado ("Mais ações").
- Itens indisponíveis ficam visíveis e desabilitados, para que o usuário saiba que a opção existe.

- Faça: Menu com variações da ação principal.
- Evite: Ações destrutivas ou sem relação escondidas atrás da seta.

## Anatomia

- **Ação principal** — Um Button comum; recebe `ref`, `onClick` e os demais atributos.
- **Seta** — Botão com `aria-haspopup="menu"`, `aria-expanded` e o nome "Mais ações".
- **Menu** — Lista `role="menu"` num portal, posicionada abaixo do botão; vira para cima se faltar espaço.

## Exemplos

### Publicação de conteúdo

Ao escolher um item, o menu fecha e o foco volta para a seta.

```tsx
import { SplitButton } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [status, setStatus] = useState('Rascunho salvo às 14:32')

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SplitButton
        onClick={() => setStatus('Artigo publicado agora')}
        actions={[
          {
            label: 'Salvar como rascunho',
            icon: 'file',
            onSelect: () => setStatus('Rascunho salvo agora'),
          },
          {
            label: 'Agendar publicação',
            icon: 'calendar',
            onSelect: () => setStatus('Publicação agendada para amanhã, 9h'),
          },
          {
            label: 'Enviar para revisão',
            icon: 'send',
            onSelect: () => setStatus('Enviado para a equipe editorial'),
          },
        ]}
      >
        Publicar artigo
      </SplitButton>
      <p
        role="status"
        style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}
      >
        {status}
      </p>
    </div>
  )
}
```

### Outline com ícone

Para ações secundárias, como exportar.

```tsx
import { Icon, SplitButton } from '@orangesys/ui'
import { useState } from 'react'

export default function Outline() {
  const [format, setFormat] = useState<string | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SplitButton
        variant="outline"
        startIcon={<Icon name="download" />}
        onClick={() => setFormat('CSV')}
        actions={[
          { label: 'Exportar como XLSX', icon: 'file', onSelect: () => setFormat('XLSX') },
          { label: 'Exportar como PDF', icon: 'file', onSelect: () => setFormat('PDF') },
          { label: 'Enviar por e-mail', icon: 'mail', onSelect: () => setFormat('e-mail') },
        ]}
      >
        Exportar CSV
      </SplitButton>
      <p
        role="status"
        style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}
      >
        {format
          ? `Relatório de vendas de outubro exportado (${format}).`
          : 'Nenhuma exportação ainda.'}
      </p>
    </div>
  )
}
```

### Tamanhos e variantes

primary (padrão), secondary e outline; sm, md e lg.

```tsx
import { SplitButton, type SplitButtonAction } from '@orangesys/ui'

const actions: SplitButtonAction[] = [
  { label: 'Duplicar', icon: 'copy', onSelect: () => {} },
  { label: 'Salvar como modelo', icon: 'layers', onSelect: () => {} },
]

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16 }}>
      <SplitButton size="lg" actions={actions}>
        Salvar
      </SplitButton>
      <SplitButton size="md" variant="secondary" actions={actions}>
        Salvar
      </SplitButton>
      <SplitButton size="sm" variant="outline" actions={actions}>
        Salvar
      </SplitButton>
    </div>
  )
}
```

### Itens e botão desabilitados

Itens com `disabled` recebem foco, mas não são acionados. `placement="bottom-start"` alinha o menu à esquerda.

```tsx
import { SplitButton } from '@orangesys/ui'
import { useState } from 'react'

export default function DisabledActions() {
  const [merged, setMerged] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <SplitButton
        placement="bottom-start"
        onClick={() => setMerged('merge commit')}
        actions={[
          { label: 'Squash e mesclar', icon: 'layers', onSelect: () => setMerged('squash') },
          // Desabilitado pela política do repositório: continua visível e focável.
          {
            label: 'Rebase e mesclar',
            icon: 'refresh',
            onSelect: () => setMerged('rebase'),
            disabled: true,
          },
        ]}
      >
        Mesclar pull request
      </SplitButton>
      <SplitButton disabled actions={[{ label: 'Implantar em homologação', onSelect: () => {} }]}>
        Implantar
      </SplitButton>
      {merged && (
        <span
          role="status"
          style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-success-text)' }}
        >
          Mesclado com {merged}.
        </span>
      )}
    </div>
  )
}
```

## Movimento

- **Abrir o menu** — Opacidade + 6px vindo do botão em `medium` com `--or-ease-out`. Quando o menu vira para cima (flip), o sentido se inverte. A entrada só começa depois do posicionamento — nada pisca no canto.
- **Fechar o menu** — Saída mais curta: opacidade + 4px de volta ao botão em `fast` com `--or-ease-in-out`, via `usePresence`. Durante a saída o menu fica inerte e o foco já voltou para a seta.
- **Seta** — Gira 180° ao abrir (`medium`, `ease-out`) e o botão fica com o fundo de pressionado enquanto o menu está aberto.
- **Itens** — Fundo, cor e barra laranja em `fast`; o ícone do item ativo desliza 2px.
- **Pressionar** — As duas partes são coladas: a moldura fica parada e só o rótulo e o ícone afundam 1px (90ms), sem a borda compartilhada piscar.
- **Movimento reduzido** — Com `prefers-reduced-motion`, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.

## Props

### `SplitButton`

Ação principal com um botão de seta que abre um menu de ações relacionadas
(padrão "menu button" do WAI-ARIA). `ref` e os atributos extras vão para o
botão principal; `className` e `style`, para o contêiner.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `actions` (obrigatória) | `SplitButtonAction[]` | — | Ações alternativas exibidas no menu da seta. |
| `defaultOpen` | `boolean` | `false` | Menu aberto inicialmente (não controlado). |
| `loading` | `boolean` | — | Mostra um indicador de carregamento e bloqueia novos cliques. |
| `loadingText` | `string` | — | Texto anunciado a leitores de tela durante o carregamento. |
| `menuLabel` | `string` | — | Nome acessível do botão de seta. Padrão: `t('moreActions')` ("Mais ações"). |
| `onOpenChange` | `((open: boolean) => void)` | — | — |
| `open` | `boolean` | — | Menu aberto (controlado). |
| `placement` | `"bottom-start" \| "bottom-end"` | `bottom-end` | Alinhamento do menu em relação ao botão. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. |
| `startIcon` | `ReactNode` | — | Ícone antes do rótulo. |
| `variant` | `"outline" \| "primary" \| "secondary"` | — | Estilo visual das duas partes. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`) do `<button>`, como `type`, `disabled`, `onClick`, `form` e `name`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`SplitButtonAction`:

```ts
export interface SplitButtonAction {
  /** Rótulo do item do menu (também usado na busca por letra inicial). */
  label: string
  /** Chamado quando o item é escolhido. O menu fecha e o foco volta para a seta. */
  onSelect: () => void
  /** Ícone antes do rótulo. */
  icon?: IconName
  /** Item visível e focável, mas que não pode ser acionado. */
  disabled?: boolean
}
```

`SplitButtonVariant`:

```ts
export type SplitButtonVariant = 'primary' | 'secondary' | 'outline'
```

## Acessibilidade

Segue o padrão *Menu Button* do WAI-ARIA. A seta controla um `role="menu"` rotulado por ela, com itens `role="menuitem"`. Ao abrir, o foco vai para o primeiro item; ao fechar com Escape ou ao escolher um item, volta para a seta. Clicar fora fecha o menu.

| Teclas | Ação |
| --- | --- |
| `Enter` | Na seta: abre o menu. No menu: escolhe o item focado. |
| `Space` | Na seta: abre o menu. No menu: escolhe o item focado. |
| `↓` | Na seta: abre no primeiro item. No menu: próximo item (volta ao início). |
| `↑` | Na seta: abre no último item. No menu: item anterior (volta ao fim). |
| `Home` | Primeiro item. |
| `End` | Último item. |
| `A–Z` | Foca o próximo item que começa com a letra. |
| `Escape` | Fecha o menu e devolve o foco à seta. |
| `Tab` | Fecha o menu e segue para o próximo elemento. |

- **2.1.1** — Todas as ações do menu são alcançáveis pelo teclado.
- **2.4.3** — O foco vai para o menu ao abrir e volta para a seta ao fechar.
- **2.4.7** — Item focado com fundo, barra laranja e contorno.
- **4.1.2** — Estado exposto com `aria-expanded`; papéis `menu`/`menuitem` e `aria-disabled`.
