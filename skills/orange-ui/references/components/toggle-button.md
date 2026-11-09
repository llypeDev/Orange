# ToggleButton

Botão que liga e desliga uma opção (aria-pressed), sozinho ou em grupo com ToggleButtonGroup.

- Categoria: Ações · Status: estável
- Importação: `import { ToggleButton, ToggleButtonGroup } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/toggle-button (em inglês: https://orange.llypedev.com.br/en/components/toggle-button)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-togglebutton--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ToggleButton

## Boas práticas

- Use para opções que o usuário liga e desliga e cujo efeito é imediato: filtros, formatação de texto, seguir uma discussão.
- O rótulo **não muda** entre os estados — "Negrito" continua "Negrito"; quem comunica o estado é o `aria-pressed`. Se o rótulo precisa mudar ("Seguir" → "Seguindo"), use um Button comum.
- O estado pressionado não depende só da cor: fundo, borda, barra inferior e o indicador (+ vira check) mudam juntos.
- Para uma escolha exclusiva e obrigatória (sempre uma opção ativa), prefira o **SegmentedControl**.

- Faça: Rótulo fixo que nomeia a opção ("Negrito").
- Evite: Rótulo de ação ("Desativar") — pressionado ou não, fica ambíguo.

## Quando usar

- **ToggleButton** — Liga/desliga com efeito imediato, em barras de ferramentas e filtros.
- **ToggleButtonGroup** — Vários toggles relacionados. `single`: no máximo um ativo; `multiple`: qualquer combinação.
- **SegmentedControl** — Escolha exclusiva e obrigatória entre 2 a 5 opções (radiogroup).
- **Switch / Checkbox** — Configurações e campos de formulário que são enviados ou salvos.

## Exemplos

### Filtros

Botões com texto mostram um indicador: + solto e check pressionado, num espaço fixo. Variantes: outline (padrão) e ghost.

```tsx
import { ToggleButton } from '@orangesys/ui'

export default function Basic() {
  return (
    <>
      <ToggleButton defaultPressed>Somente remotas</ToggleButton>
      <ToggleButton>Com salário informado</ToggleButton>
      <ToggleButton variant="ghost">Candidatura simplificada</ToggleButton>
    </>
  )
}
```

### Com ícone e somente ícone

Com `startIcon` o indicador não aparece. Somente ícone exige `aria-label`.

```tsx
import { Icon, ToggleButton } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <>
      <ToggleButton startIcon={<Icon name="bell" />}>Seguir discussão</ToggleButton>
      <ToggleButton
        iconOnly
        variant="ghost"
        aria-label="Favoritar"
        defaultPressed
        startIcon={<Icon name="star" />}
      />
      <ToggleButton iconOnly aria-label="Curtir comentário" startIcon={<Icon name="heart" />} />
    </>
  )
}
```

### Controlado

Use `pressed` e `onPressedChange`.

```tsx
import { Icon, ToggleButton } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [watching, setWatching] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <ToggleButton
        pressed={watching}
        onPressedChange={setWatching}
        startIcon={<Icon name={watching ? 'eye' : 'eye-off'} />}
      >
        Acompanhar pedido
      </ToggleButton>
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        {watching
          ? 'Você receberá um e-mail a cada mudança de status do pedido #48213.'
          : 'Ative para receber atualizações do pedido #48213 por e-mail.'}
      </p>
    </div>
  )
}
```

### Grupo com múltipla escolha

Com `selectionMode="multiple"`, o valor é um array com os botões pressionados.

```tsx
import { ToggleButton, ToggleButtonGroup } from '@orangesys/ui'
import { useState } from 'react'

export default function GroupMultiple() {
  const [modes, setModes] = useState<string[]>(['remote', 'hybrid'])

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <ToggleButtonGroup
        selectionMode="multiple"
        aria-label="Modalidade de trabalho"
        value={modes}
        onChange={setModes}
      >
        <ToggleButton value="remote">Remoto</ToggleButton>
        <ToggleButton value="hybrid">Híbrido</ToggleButton>
        <ToggleButton value="onsite">Presencial</ToggleButton>
      </ToggleButtonGroup>
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        {modes.length === 0
          ? 'Mostrando vagas de todas as modalidades.'
          : `${modes.length} filtro(s) de modalidade ativo(s).`}
      </p>
    </div>
  )
}
```

### Grupo com escolha única

Com `selectionMode="single"`, clicar no botão pressionado o solta (`onChange(null)`). Para manter sempre um ativo, ignore o `null` no modo controlado.

```tsx
import { Icon, ToggleButton, ToggleButtonGroup } from '@orangesys/ui'
import { useState } from 'react'

type Align = 'left' | 'center' | 'right'

export default function GroupSingle() {
  const [align, setAlign] = useState<Align>('left')

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <ToggleButtonGroup
        selectionMode="single"
        aria-label="Alinhamento do parágrafo"
        attached
        value={align}
        // Ignora `null` para que sempre haja um alinhamento ativo.
        onChange={(value) => value && setAlign(value as Align)}
      >
        <ToggleButton
          value="left"
          iconOnly
          aria-label="Alinhar à esquerda"
          startIcon={<Icon name="align-left" />}
        />
        <ToggleButton
          value="center"
          iconOnly
          aria-label="Centralizar"
          startIcon={<Icon name="align-center" />}
        />
        <ToggleButton
          value="right"
          iconOnly
          aria-label="Alinhar à direita"
          startIcon={<Icon name="align-right" />}
        />
      </ToggleButtonGroup>
      <p
        style={{
          margin: 0,
          textAlign: align,
          fontSize: 'var(--or-text-sm)',
          color: 'var(--or-color-text-muted)',
        }}
      >
        A entrega do novo painel de métricas está prevista para a próxima sprint, depois da revisão
        de acessibilidade.
      </p>
    </div>
  )
}
```

## Movimento

- **Solto → pressionado** — Fundo e borda laranjas em `fast`; a barra inferior cresce de 0 a 2px com `--or-ease-spring` em `medium` (250ms).
- **Indicador + → check** — O `+` gira 90° e some (`fast`); o check entra como `or-scale-in` (0.6 → 1) com `--or-ease-bounce` em `medium`. O espaço é fixo: a largura não muda.
- **Pressionado → solto** — Saída mais curta: a barra recolhe e o check some em `fast` com `--or-ease-in-out`; o `+` volta suave (`medium`, `ease-out`).
- **Ícones** — Com `startIcon` ou somente ícone, o ícone ganha a cor de acento em `fast`.
- **Pressionar** — Afunda 1px e reduz para 98,5% em `--or-duration-press` (90ms); volta em `fast` com `--or-ease-out`.
- **Movimento reduzido** — Com `prefers-reduced-motion`, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.

## Props

### `ToggleButton`

Botão de alternância (liga/desliga) com `aria-pressed`. O rótulo não muda
entre os estados — o estado é comunicado pelo `aria-pressed` e, visualmente,
por fundo, borda, barra inferior e indicador (+ → check).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `block` | `boolean` | — | Ocupa toda a largura disponível. |
| `defaultPressed` | `boolean` | `false` | Estado pressionado inicial (não controlado). |
| `endIcon` | `ReactNode` | — | Ícone depois do rótulo (desliza levemente no hover). |
| `iconOnly` | `boolean` | `false` | Botão somente com ícone (quadrado). Exige `aria-label` para ser compreendido por leitores de tela. |
| `loading` | `boolean` | — | Mostra um indicador de carregamento e bloqueia novos cliques. |
| `loadingText` | `string` | — | Texto anunciado a leitores de tela durante o carregamento. |
| `onPressedChange` | `((pressed: boolean) => void)` | — | Chamado com o novo estado quando o usuário alterna o botão. |
| `pressed` | `boolean` | — | Estado pressionado (controlado). |
| `showCheck` | `boolean` | — | Mostra um indicador antes do rótulo: `+` solto e check pressionado (o espaço é fixo, então a largura não muda). Padrão: `true` para botões com texto e sem `startIcon`. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. |
| `startIcon` | `ReactNode` | — | Ícone antes do rótulo. |
| `value` | `string` | — | Identificador do botão dentro de um `ToggleButtonGroup`. |
| `variant` | `"outline" \| "ghost"` | — | Estilo visual em repouso. Pressionado, o botão ganha fundo, borda e barra laranjas. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `ToggleButtonGroup`

Agrupa ToggleButtons relacionados (`role="group"`) e controla quais estão
pressionados. Cada botão continua sendo um `aria-pressed` independente.
Para uma escolha exclusiva e obrigatória, prefira o SegmentedControl.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `attached` | `boolean` | — | Cola os botões, com bordas internas compartilhadas. |
| `defaultValue` | `string \| string[] \| null` | — | Valor inicial (não controlado). Valores iniciais (não controlado). |
| `disabled` | `boolean` | — | Desabilita todos os botões. |
| `onChange` | `((value: string \| null) => void) \| ((value: string[]) => void)` | — | — |
| `orientation` | `"horizontal" \| "vertical"` | — | — |
| `selectionMode` | `"single" \| "multiple"` | — | `single` (padrão): no máximo um botão pressionado (clicar no pressionado o solta). `multiple`: qualquer combinação de botões pressionados. |
| `size` | `"sm" \| "md" \| "lg"` | — | Tamanho repassado aos ToggleButtons. |
| `value` | `string \| string[] \| null` | — | Valor pressionado (controlado). `null` quando nenhum. Valores pressionados (controlado). |
| `variant` | `"outline" \| "ghost"` | — | Variante repassada aos ToggleButtons. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Cada ToggleButton é um `<button>` nativo com `aria-pressed="true|false"`, anunciado como "botão de alternância, pressionado". O ToggleButtonGroup é um `role="group"` com nome; cada botão continua sendo uma parada de Tab. Dentro de uma **Toolbar**, os botões passam a usar as setas.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o próximo botão. |
| `Enter` | Alterna o estado pressionado. |
| `Space` | Alterna o estado pressionado. |

- **1.4.1** — O estado pressionado usa fundo, borda, barra e ícone — não só a cor.
- **1.4.11** — Borda e barra laranjas têm contraste de 3:1 com o fundo nos dois temas.
- **2.4.7** — Foco visível com contorno laranja de 2px.
- **4.1.2** — Estado exposto com `aria-pressed`; o nome não muda entre os estados.
