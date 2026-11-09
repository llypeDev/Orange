# Button

Botões disparam ações quando clicados — salvar, enviar, excluir, abrir um diálogo.

- Categoria: Ações · Status: estável
- Importação: `import { Button, buttonClassName } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/button (em inglês: https://orange.llypedev.com.br/en/components/button)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-button--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Button

## Boas práticas

- Não use botões para navegar. Para levar o usuário a outra página, use **Link**.
- O rótulo diz o que acontece no clique. Use verbos — **Salvar**, **Excluir** — em caixa de sentença e com até três palavras.
- Use apenas um botão primary por contexto; as demais ações ficam em secondary, outline ou ghost.

- Faça: Uma ação primária com rótulo específico.
- Evite: Duas ações primárias com rótulos genéricos como "OK".

## Tipos de botões

- **Primary** — A ação principal da tela. Fundo laranja.
- **Secondary** — Ação de alto contraste que não compete com o laranja.
- **Outline** — Ações secundárias, como Cancelar ou Voltar.
- **Ghost** — Ações terciárias e barras de ferramentas.
- **Danger** — Ações destrutivas (excluir, remover). Confirme antes de executar.

## Exemplos

### Variantes

```tsx
import { Button } from '@orangesys/ui'

export default function Variants() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </>
  )
}
```

### Tamanhos

sm (32px), md (40px, padrão) e lg (48px). Use block para ocupar toda a largura.

```tsx
import { Button } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16 }}>
        <Button size="lg">Large</Button>
        <Button size="md">Medium</Button>
        <Button size="sm">Small</Button>
      </div>
      <Button block>Block button</Button>
    </div>
  )
}
```

### Com ícones

O ícone final desliza no hover. Botões só com ícone precisam de aria-label.

```tsx
import { Button, Icon } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <>
      <Button endIcon={<Icon name="arrow-right" />}>Agendar demo</Button>
      <Button variant="outline" startIcon={<Icon name="download" />}>
        Baixar relatório
      </Button>
      <Button variant="ghost" startIcon={<Icon name="plus" />}>
        Novo projeto
      </Button>
      <Button variant="outline" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />
      <Button variant="ghost" iconOnly aria-label="Mais ações" startIcon={<Icon name="more-horizontal" />} />
    </>
  )
}
```

### Carregando e desabilitado

Em loading, o botão continua focável, anuncia o status e ignora novos cliques.

```tsx
import { Button } from '@orangesys/ui'
import { useState } from 'react'

export default function Loading() {
  const [saving, setSaving] = useState(false)

  const save = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 2000)
  }

  return (
    <>
      <Button loading={saving} loadingText="Salvando alterações" onClick={save}>
        Salvar alterações
      </Button>
      <Button variant="outline" disabled>
        Desabilitado
      </Button>
    </>
  )
}
```

## Props

### `Button`

Botões disparam ações: salvar, enviar, excluir, abrir um diálogo.
Para navegar entre páginas, use `Link`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `block` | `boolean` | `false` | Ocupa toda a largura disponível. |
| `endIcon` | `ReactNode` | — | Ícone depois do rótulo (desliza levemente no hover). |
| `iconOnly` | `boolean` | `false` | Botão somente com ícone (quadrado). Exige `aria-label` para ser compreendido por leitores de tela. |
| `loading` | `boolean` | `false` | Mostra um indicador de carregamento e bloqueia novos cliques. |
| `loadingText` | `string` | — | Texto anunciado a leitores de tela durante o carregamento. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. |
| `startIcon` | `ReactNode` | — | Ícone antes do rótulo. |
| `variant` | `"outline" \| "danger" \| "primary" \| "secondary" \| "ghost"` | `primary` | Estilo visual. `primary` é a ação principal; use apenas um por contexto. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `buttonClassName(opções)` — função

Gera as classes do botão — útil para estilizar links como botões.

| Opção | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `block` | `boolean` | `false` | Ocupa toda a largura disponível. |
| `iconOnly` | `boolean` | `false` | Botão somente com ícone (quadrado). Exige `aria-label` para ser compreendido por leitores de tela. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. |
| `variant` | `"outline" \| "danger" \| "primary" \| "secondary" \| "ghost"` | `primary` | Estilo visual. `primary` é a ação principal; use apenas um por contexto. |

## Acessibilidade

Renderiza um `<button type="button">` nativo: foco, teclado e semântica vêm de graça.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o botão. |
| `Enter` | Ativa o botão. |
| `Space` | Ativa o botão. |

- **1.4.3** — Contraste mínimo de 4.5:1 entre rótulo e fundo em todas as variantes.
- **2.4.7** — Foco visível com contorno laranja de 2px.
- **2.5.8** — Área de toque mínima de 32×32px (tamanho sm).
- **4.1.2** — Estado de carregamento exposto com `aria-busy` e região de status.
