# IconButton

Botão quadrado só com ícone, com nome acessível obrigatório — para ações reconhecíveis pelo ícone.

- Categoria: Ações · Status: estável
- Importação: `import { IconButton } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/icon-button (em inglês: https://orange.llypedev.com.br/en/components/icon-button)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-iconbutton--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/IconButton

## Boas práticas

- Use só com ícones reconhecidos sem legenda — buscar, fechar, editar, excluir, baixar. Na dúvida, use um Button com texto.
- O `label` descreve a ação, não o desenho: **Excluir arquivo**, não "Lixeira".
- Quando a mesma ação se repete por linha, inclua o objeto no rótulo ("Excluir Proposta v3.pdf") para que cada botão seja único.
- Combine com um Tooltip para mostrar o rótulo a quem enxerga a tela — o IconButton não depende dele para ser acessível.

- Faça: Ícone conhecido e rótulo com verbo e objeto.
- Evite: Ícone ambíguo com rótulo genérico — ninguém sabe o que acontece no clique.

## IconButton ou Button iconOnly?

Os dois renderizam o mesmo `<button>` quadrado. O IconButton é um atalho com garantias extras:

- **Nome acessível** — IconButton exige `label` no tipo (erro de compilação se faltar). Em Button, `aria-label` é opcional e só gera um aviso em desenvolvimento.
- **Ícone** — Pelo nome: `icon="search"`. Em Button: `startIcon={<Icon name="search" />}`.
- **Variante padrão** — `ghost` (Button usa `primary`).
- **Grupos** — Herda size, variant e disabled de ButtonGroup e Toolbar em qualquer nível e se marca como item da Toolbar automaticamente.

## Exemplos

### Variantes

```tsx
import { IconButton } from '@orangesys/ui'

export default function Variants() {
  return (
    <>
      <IconButton icon="plus" label="Novo projeto" variant="primary" />
      <IconButton icon="edit" label="Editar perfil" variant="secondary" />
      <IconButton icon="download" label="Baixar fatura" variant="outline" />
      <IconButton icon="more-horizontal" label="Mais ações" />
      <IconButton icon="trash" label="Excluir projeto" variant="danger" />
    </>
  )
}
```

### Tamanhos

lg (48px), md (40px, padrão) e sm (32px). Em telas de toque, o alvo do sm cresce sem mudar o visual.

```tsx
import { IconButton } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton icon="search" label="Buscar" variant="outline" size="lg" />
      <IconButton icon="search" label="Buscar" variant="outline" size="md" />
      <IconButton icon="search" label="Buscar" variant="outline" size="sm" />
    </div>
  )
}
```

### Ações por linha

Cada rótulo inclui o nome do arquivo, então a lista de botões faz sentido fora de contexto.

```tsx
import { IconButton } from '@orangesys/ui'

const files = [
  { name: 'Contrato de prestação.pdf', size: '284 KB' },
  { name: 'Proposta comercial v3.pdf', size: '1,2 MB' },
  { name: 'Cronograma do projeto.xlsx', size: '96 KB' },
]

export default function RowActions() {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', maxWidth: 520 }}>
      {files.map((file) => (
        <li
          key={file.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 0 8px 12px',
            borderBottom: '1px solid var(--or-color-border)',
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: 'block', fontSize: 'var(--or-text-sm)' }}>{file.name}</strong>
            <span style={{ fontSize: 'var(--or-text-xs)', color: 'var(--or-color-text-subtle)' }}>
              {file.size}
            </span>
          </span>
          {/* O rótulo inclui o nome do arquivo: cada botão é único para leitores de tela. */}
          <IconButton icon="download" label={`Baixar ${file.name}`} size="sm" />
          <IconButton icon="edit" label={`Renomear ${file.name}`} size="sm" />
          <IconButton icon="trash" label={`Excluir ${file.name}`} size="sm" />
        </li>
      ))}
    </ul>
  )
}
```

### Comparação com Button iconOnly

Resultado idêntico; o IconButton é mais curto e não deixa o nome acessível de fora.

```tsx
import { Button, Icon, IconButton } from '@orangesys/ui'

export default function Comparison() {
  return (
    <>
      {/* IconButton: label obrigatório no tipo, ícone por nome, ghost por padrão. */}
      <IconButton icon="close" label="Fechar painel" />

      {/* Equivalente com Button: aria-label não é exigido pelo TypeScript. */}
      <Button
        variant="ghost"
        iconOnly
        aria-label="Fechar painel"
        startIcon={<Icon name="close" />}
      />
    </>
  )
}
```

### Carregando e desabilitado

Em loading, o botão continua focável e anuncia o loadingText.

```tsx
import { IconButton } from '@orangesys/ui'
import { useState } from 'react'

export default function States() {
  const [syncing, setSyncing] = useState(false)

  const sync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <>
      <IconButton
        icon="refresh"
        label="Sincronizar caixa de entrada"
        variant="outline"
        loading={syncing}
        loadingText="Sincronizando caixa de entrada"
        onClick={sync}
      />
      <IconButton icon="send" label="Enviar mensagem" variant="primary" disabled />
    </>
  )
}
```

## Movimento

- **Pressionar** — Afunda 1px e reduz para 98,5% em `--or-duration-press` (90ms); volta em `fast` com `--or-ease-out`.
- **Hover e foco** — Fundo, borda e cor em `--or-duration-fast` (160ms) com `--or-ease-out`. Hover e foco visível têm a mesma resposta.
- **Em grupos** — Em ButtonGroup colado ou ToolbarGroup colado, a moldura fica parada e só o ícone afunda, para a borda compartilhada não pular.
- **Carregando** — O indicador gira em loop enquanto loading for verdadeiro (único movimento contínuo).
- **Movimento reduzido** — Com `prefers-reduced-motion`, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.

## Props

### `IconButton`

Botão quadrado somente com ícone e nome acessível obrigatório.
Atalho para `<Button iconOnly aria-label startIcon={<Icon />} />`, com
variante `ghost` por padrão e integração com ButtonGroup e Toolbar.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `icon` (obrigatória) | `"type" \| ReactElement<unknown, string \| JSXElementConstructor<any>> \| "search" \| "send" \| "grid" \| "link" \| "list" \| "menu" \| "copy" \| "info" \| ... 82 more ... \| "zap"` | — | Nome de um ícone do Orange ou um elemento SVG próprio. |
| `label` (obrigatória) | `string` | — | Nome acessível do botão (vira `aria-label`). Obrigatório: descreva a ação, não o ícone — "Excluir arquivo", não "Lixeira". |
| `loading` | `boolean` | — | Mostra um indicador de carregamento e bloqueia novos cliques. |
| `loadingText` | `string` | — | Texto anunciado a leitores de tela durante o carregamento. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. |
| `variant` | `"outline" \| "danger" \| "primary" \| "secondary" \| "ghost"` | — | Estilo visual. `primary` é a ação principal; use apenas um por contexto. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Renderiza um `<button type="button">` nativo com `aria-label`; o ícone é decorativo ( `aria-hidden`). O nome não deve mudar com o estado — para alternar, use **ToggleButton**.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o botão. |
| `Enter` | Ativa o botão. |
| `Space` | Ativa o botão. |

- **1.1.1** — O ícone é decorativo e o botão tem um nome em texto obrigatório.
- **2.4.7** — Foco visível com contorno laranja de 2px.
- **2.5.8** — Alvo mínimo de 32×32px; em telas de toque o sm ganha uma área extra de toque.
- **4.1.2** — Nome via `aria-label` e papel nativo de botão.
