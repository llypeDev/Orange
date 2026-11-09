# Paper

Superfície base com fundo, borda de 1px e espaçamento interno — a peça sobre a qual painéis e cartões são montados.

- Categoria: Layout · Status: estável
- Importação: `import { Paper } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/paper (em inglês: https://orange.llypedev.com.br/en/components/paper)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-paper--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Paper

## Boas práticas

- Use para agrupar conteúdo relacionado numa superfície própria: resumos, painéis de configuração, blocos de destaque.
- Escolha o elemento certo com **as**: `section` com título para regiões, `article` para conteúdo independente, `li` dentro de listas. O Paper não adiciona semântica sozinho.
- Evite aninhar superfícies com borda: dentro de um Paper, separe com espaço ou Divider.
- Reserve elevation="overlay" para camadas flutuantes; no fluxo da página, flat ou raised bastam.

## Opções de superfície

- **`border`** — none, default, strong, accent-top (faixa laranja de 3px no topo) e accent-left.
- **`elevation`** — flat (padrão), raised (sombra leve) e overlay (sombra de sobreposição do sistema).
- **`tone`** — default (superfície), subtle (fundo sutil) e inverse (inverte o tema dentro da superfície).
- **`padding`** — Escala de espaço: 0, 1, 2, 3, 4, 5, 6 (padrão, 24px), 8, 10, 12.

## Exemplos

### Resumo em uma seção

Com as="section" e aria-labelledby, o Paper vira uma região nomeada.

```tsx
import { DescriptionList, Heading, Paper } from '@orangesys/ui'

export default function Summary() {
  return (
    <Paper as="section" aria-labelledby="assinatura-titulo" style={{ width: '100%', maxWidth: 440 }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Assinatura
      </p>
      <Heading level={3} size="xl" id="assinatura-titulo" style={{ margin: '6px 0 16px' }}>
        Plano Pro anual
      </Heading>
      <DescriptionList
        size="sm"
        termWidth="9rem"
        items={[
          { term: 'Usuários', description: '24 de 30 licenças' },
          { term: 'Renovação', description: '12 de março de 2027' },
          { term: 'Armazenamento', description: '412 GB de 1 TB' },
        ]}
      />
    </Paper>
  )
}
```

### Bordas

```tsx
import { Paper } from '@orangesys/ui'

export default function Borders() {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', width: '100%' }}>
      <Paper padding={5}>
        <strong>default</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Borda neutra de 1px.</p>
      </Paper>
      <Paper padding={5} border="strong">
        <strong>strong</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Mais contraste com o fundo.</p>
      </Paper>
      <Paper padding={5} border="accent-top">
        <strong>accent-top</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Destaca um plano ou métrica.</p>
      </Paper>
      <Paper padding={5} border="accent-left" tone="subtle">
        <strong>accent-left</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Notas e citações.</p>
      </Paper>
      <Paper padding={5} border="none" tone="subtle">
        <strong>none</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Só o fundo sutil.</p>
      </Paper>
    </div>
  )
}
```

### Elevação

```tsx
import { Paper } from '@orangesys/ui'

export default function Elevation() {
  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', width: '100%', padding: 8 }}>
      <Paper elevation="flat">
        <p className="or-eyebrow" style={{ margin: 0 }}>flat</p>
        <p style={{ margin: '8px 0 0' }}>Conteúdo no fluxo da página.</p>
      </Paper>
      <Paper elevation="raised">
        <p className="or-eyebrow" style={{ margin: 0 }}>raised</p>
        <p style={{ margin: '8px 0 0' }}>Painéis que se destacam do fundo.</p>
      </Paper>
      <Paper elevation="overlay">
        <p className="or-eyebrow" style={{ margin: 0 }}>overlay</p>
        <p style={{ margin: '8px 0 0' }}>Camadas flutuantes, como menus.</p>
      </Paper>
    </div>
  )
}
```

### Tom inverso

Aplica o tema oposto dentro da superfície — os componentes internos (como Button) acompanham automaticamente. Teste com o seletor Claro/Escuro.

```tsx
import { Button, Heading, Icon, Paper } from '@orangesys/ui'

export default function Inverse() {
  return (
    <Paper tone="inverse" padding={8} border="none" style={{ width: '100%' }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Teste grátis
      </p>
      <Heading level={3} size="2xl" style={{ margin: '8px 0 8px' }}>
        Leve a conciliação bancária para toda a equipe
      </Heading>
      <p style={{ margin: '0 0 20px', color: 'var(--or-color-text-muted)', maxWidth: 520 }}>
        14 dias com todos os recursos do plano Pro. Sem cartão de crédito.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button endIcon={<Icon name="arrow-right" />}>Começar agora</Button>
        <Button variant="outline">Falar com vendas</Button>
      </div>
    </Paper>
  )
}
```

### Elemento polimórfico

Itens de lista renderizados como <li> dentro de um <ul>.

```tsx
import { Heading, Paper } from '@orangesys/ui'

const artigos = [
  { titulo: 'Como organizar o fechamento do mês', tempo: '6 min de leitura' },
  { titulo: 'Boas práticas para aprovar despesas', tempo: '4 min de leitura' },
  { titulo: 'Relatórios que a diretoria realmente lê', tempo: '8 min de leitura' },
]

export default function Polymorphic() {
  return (
    <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none', width: '100%', maxWidth: 480 }}>
      {artigos.map((artigo) => (
        <Paper as="li" key={artigo.titulo} padding={4} border="accent-left">
          <Heading level={3} size="md" style={{ margin: 0 }}>
            {artigo.titulo}
          </Heading>
          <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)', fontSize: 13 }}>{artigo.tempo}</p>
        </Paper>
      ))}
    </ul>
  )
}
```

### Superfície interativa

interactive transforma o Paper em alvo clicável: eleva no hover/foco e afunda ao pressionar. Aqui com as="a" e a seta do utilitário or-nudge.

```tsx
import { Icon, Paper } from '@orangesys/ui'

const planos = [
  { nome: 'Essencial', resumo: 'Até 5 usuários e conciliação diária.', href: '#plano-essencial' },
  { nome: 'Pro', resumo: 'Usuários ilimitados e relatórios avançados.', href: '#plano-pro' },
  { nome: 'Empresa', resumo: 'SSO, auditoria e suporte dedicado.', href: '#plano-empresa' },
]

export default function Interactive() {
  return (
    <ul
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        width: '100%',
        margin: 0,
        padding: '8px 0',
        listStyle: 'none',
      }}
    >
      {planos.map((plano) => (
        <li key={plano.nome}>
          {/* or-nudge: a seta desliza 4px no hover/foco (utilitário de motion.css) */}
          <Paper as="a" href={plano.href} interactive padding={5} className="or-nudge">
            <p className="or-eyebrow" style={{ margin: 0 }}>
              Plano
            </p>
            <strong style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 18 }}>
              {plano.nome}
              <span className="or-nudge__icon" aria-hidden="true">
                <Icon name="arrow-right" size="sm" />
              </span>
            </strong>
            <span style={{ display: 'block', marginTop: 4, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
              {plano.resumo}
            </span>
          </Paper>
        </li>
      ))}
    </ul>
  )
}
```

## Props

### `Paper`

Superfície base do Orange: um contêiner com fundo, borda de 1px e
espaçamento interno. É a peça sobre a qual cartões, painéis e seções são
montados.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `div` | Elemento renderizado (`section`, `article`, `aside`, `li`…). Padrão: `div`. |
| `border` | `"none" \| "default" \| "strong" \| "accent-top" \| "accent-left"` | `default` | Borda: 1px neutra, mais forte, ou com faixa laranja no topo/à esquerda. Padrão: `default`. |
| `elevation` | `"flat" \| "raised" \| "overlay"` | `flat` | `flat` (padrão), `raised` (sombra leve) ou `overlay` (sombra de sobreposição). |
| `interactive` | `boolean` | `false` | Superfície clicável (cartão-link, opção selecionável): sobe 4px com sombra laranja no hover/foco e afunda ao pressionar. Use com `as="a"`/`as="button"` ou com um link/botão dentro. |
| `padding` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 8 \| 10 \| 12` | `6` | Espaçamento interno na escala de espaço (`6` = 1.5rem). Padrão: `6`. |
| `tone` | `"default" \| "subtle" \| "inverse"` | `default` | Cor de fundo: `default` (superfície), `subtle` (fundo sutil) ou `inverse` (inverte o tema dentro da superfície — componentes internos acompanham). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`PaperBorder`:

```ts
export type PaperBorder = 'none' | 'default' | 'strong' | 'accent-top' | 'accent-left'
```

`PaperElevation`:

```ts
export type PaperElevation = 'flat' | 'raised' | 'overlay'
```

`PaperPadding`:

```ts
export type PaperPadding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
```

`PaperTone`:

```ts
export type PaperTone = 'default' | 'subtle' | 'inverse'
```

## Movimento

- **Hover e foco (interactive)** — Sobe 4px (--or-distance-lift) com a sombra sólida 0 8px 0 -4px na cor do texto, e uma barra de acento de 4px desce pela borda esquerda (scaleY 0 → 1) — 250ms, ease-out, como os cartões do zop.dev. Uma ponte de 12px abaixo evita tremor com o cursor na borda de baixo. Vale também para o foco de um link ou botão interno. Cores: --or-paper-lift-color e --or-paper-lift-shadow.
- **Pressionar** — Desce 1px abaixo da posição original — 90ms.
- **Bordas e fundo** — Transicionam em 160ms quando mudam.
- **Movimento reduzido** — A superfície não se desloca: a sombra e a barra aparecem direto.

## Acessibilidade

O Paper é puramente visual: a semântica vem do elemento escolhido em `as`. Para uma região navegável, use `as="section"` com `aria-labelledby` apontando para o título. O tom `inverse` aplica `data-theme` oposto, então textos e componentes internos mantêm o contraste dos tokens.

- **1.3.1** — Estrutura transmitida pelo elemento escolhido (section, article, li), não pela aparência.
- **1.4.3** — Todos os tons usam pares de tokens com contraste de 4.5:1 para texto.
- **1.4.11** — Em modo de alto contraste, a borda usa a cor do sistema.
