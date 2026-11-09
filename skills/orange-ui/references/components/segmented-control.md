# SegmentedControl

Escolha exclusiva entre 2 a 5 opções sempre visíveis, com um indicador que desliza até a opção selecionada.

- Categoria: Ações · Status: estável
- Importação: `import { SegmentedControl } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/segmented-control (em inglês: https://orange.llypedev.com.br/en/components/segmented-control)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-segmentedcontrol--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/SegmentedControl

## Boas práticas

- Use para alternar entre visões ou modos do mesmo conteúdo — período de um gráfico, lista ou grade, unidade de medida.
- De 2 a 5 opções, com rótulos curtos (uma ou duas palavras) e de tamanho parecido. Para mais opções, use Select ou RadioGroup.
- Sempre há uma opção selecionada — sem `defaultValue`, a primeira opção habilitada é escolhida. Para permitir "nenhuma", use **ToggleButtonGroup**.
- O `label` do grupo é obrigatório. Se o contexto já deixa claro, esconda-o com `hideLabel` — ele continua sendo lido por leitores de tela.

- Faça: Poucas opções curtas e equivalentes.
- Evite: Muitas opções com rótulos longos — use um Select. E não use para disparar ações.

## Anatomia

- **Rótulo** — Nome do grupo (obrigatório), visível ou oculto.
- **Trilho** — O `role="radiogroup"` com borda de 1px; as opções dividem a largura igualmente.
- **Indicador** — Realce com barra laranja que desliza até a opção selecionada.
- **Opção** — Um radio nativo visualmente oculto + rótulo (e ícone opcional).

## Exemplos

### Período de um relatório

Controlado com value e onChange.

```tsx
import { SegmentedControl } from '@orangesys/ui'
import { useState } from 'react'

const labels: Record<string, string> = {
  day: 'de hoje',
  week: 'dos últimos 7 dias',
  month: 'dos últimos 30 dias',
  year: 'de 2026',
}

export default function Basic() {
  const [period, setPeriod] = useState('week')

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <SegmentedControl
        label="Período do relatório"
        value={period}
        onChange={setPeriod}
        options={[
          { value: 'day', label: 'Dia' },
          { value: 'week', label: 'Semana' },
          { value: 'month', label: 'Mês' },
          { value: 'year', label: 'Ano' },
        ]}
      />
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Exibindo vendas {labels[period]}.
      </p>
    </div>
  )
}
```

### Com ícones

```tsx
import { SegmentedControl } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <SegmentedControl
      label="Tema da interface"
      defaultValue="system"
      options={[
        { value: 'light', label: 'Claro', icon: 'sun' },
        { value: 'dark', label: 'Escuro', icon: 'moon' },
        { value: 'system', label: 'Sistema', icon: 'monitor' },
      ]}
    />
  )
}
```

### Somente ícones

Com `iconOnly`, os rótulos ficam visualmente ocultos mas continuam sendo o nome de cada radio.

```tsx
import { SegmentedControl } from '@orangesys/ui'
import { useState } from 'react'

const projects = ['Portal do cliente', 'App de entregas', 'Painel financeiro', 'Site institucional']

export default function IconOnly() {
  const [view, setView] = useState('grid')

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
      >
        <strong style={{ fontFamily: 'var(--or-font-display)' }}>Projetos</strong>
        {/* O rótulo do grupo e das opções continua disponível para leitores de tela. */}
        <SegmentedControl
          label="Visualização dos projetos"
          hideLabel
          iconOnly
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: 'list', label: 'Lista', icon: 'list' },
            { value: 'grid', label: 'Grade', icon: 'grid' },
          ]}
        />
      </div>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(160px, 1fr))' : '1fr',
          gap: 8,
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {projects.map((name) => (
          <li
            key={name}
            style={{
              padding: view === 'grid' ? '24px 16px' : '10px 16px',
              border: '1px solid var(--or-color-border)',
              fontSize: 'var(--or-text-sm)',
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Tamanhos e largura total

sm (32px), md (40px) e lg (48px). `block` ocupa a largura do contêiner.

```tsx
import { SegmentedControl, type SegmentedControlOption } from '@orangesys/ui'

const units: SegmentedControlOption[] = [
  { value: 'km', label: 'Quilômetros' },
  { value: 'mi', label: 'Milhas' },
]

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 480 }}>
      <SegmentedControl label="Small" size="sm" options={units} />
      <SegmentedControl label="Medium" size="md" options={units} />
      <SegmentedControl label="Large" size="lg" options={units} />
      <SegmentedControl
        label="Ciclo de cobrança"
        description="No plano anual você economiza 20%."
        block
        defaultValue="yearly"
        options={[
          { value: 'monthly', label: 'Mensal' },
          { value: 'yearly', label: 'Anual' },
        ]}
      />
    </div>
  )
}
```

### Opção e grupo desabilitados

As setas pulam opções desabilitadas. Explique perto do controle por que uma opção está indisponível.

```tsx
import { SegmentedControl } from '@orangesys/ui'

export default function Disabled() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SegmentedControl
        label="Prioridade do chamado"
        defaultValue="normal"
        options={[
          { value: 'low', label: 'Baixa' },
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'Alta' },
          // Disponível apenas no plano Empresa.
          { value: 'urgent', label: 'Urgente', disabled: true },
        ]}
      />
      <SegmentedControl
        label="Formato do arquivo"
        disabled
        defaultValue="csv"
        options={[
          { value: 'csv', label: 'CSV' },
          { value: 'xlsx', label: 'XLSX' },
          { value: 'pdf', label: 'PDF' },
        ]}
      />
    </div>
  )
}
```

## Movimento

- **Mudar a seleção** — O indicador desliza até a opção com `--or-ease-spring` em `medium` (250ms) — por clique ou pelas setas do teclado. Só o `transform` anima.
- **Montagem** — Sem animação: a transição só é ligada depois da primeira medição, então o indicador não desliza a partir da borda ao carregar.
- **Pressionar uma opção** — O conteúdo afunda 1px em `--or-duration-press` (90ms); o trilho fica parado.
- **Hover** — Fundo e cor do texto em `fast`; o ícone da opção escolhida ganha a cor de acento.
- **Movimento reduzido** — Com `prefers-reduced-motion`, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.

## Props

### `SegmentedControl`

Escolha exclusiva entre 2 a 5 opções, sempre visíveis. É um grupo de radios
nativos (`role="radiogroup"`): Tab entra no grupo pela opção selecionada e
as setas mudam a seleção.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Rótulo do grupo (obrigatório). Use `hideLabel` para escondê-lo visualmente. |
| `options` (obrigatória) | `SegmentedControlOption[]` | — | De 2 a 5 opções mutuamente exclusivas. |
| `block` | `boolean` | `false` | Ocupa toda a largura disponível; as opções dividem o espaço igualmente. |
| `defaultValue` | `string` | — | Valor inicial (não controlado). Padrão: a primeira opção habilitada. |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo. |
| `disabled` | `boolean` | `false` | Desabilita o grupo inteiro. |
| `hideLabel` | `boolean` | `false` | Esconde o rótulo visualmente, mantendo-o para leitores de tela. |
| `iconOnly` | `boolean` | `false` | Mostra apenas os ícones; os rótulos continuam disponíveis para leitores de tela. |
| `name` | `string` | — | Atributo `name` dos radios (gerado automaticamente se omitido). |
| `onChange` | `((value: string) => void)` | — | — |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `string` | — | Valor selecionado (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`SegmentedControlOption`:

```ts
export interface SegmentedControlOption {
  /** Valor enviado em `onChange` e no formulário. */
  value: string
  /** Rótulo da opção. Também é o nome acessível quando `iconOnly`. */
  label: string
  /** Ícone antes do rótulo. */
  icon?: IconName
  /** Desabilita somente esta opção. */
  disabled?: boolean
}
```

`SegmentedControlSize`:

```ts
export type SegmentedControlSize = 'sm' | 'md' | 'lg'
```

## Acessibilidade

É um `role="radiogroup"` rotulado por `aria-labelledby`, com radios nativos de mesmo `name` visualmente ocultos. A navegação por teclado é a do próprio navegador: o grupo é uma única parada de Tab e as setas mudam a seleção.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para a opção selecionada. |
| `→` | Seleciona a próxima opção habilitada. |
| `↓` | Seleciona a próxima opção habilitada. |
| `←` | Seleciona a opção anterior habilitada. |
| `↑` | Seleciona a opção anterior habilitada. |
| `Space` | Seleciona a opção focada, se ainda não estiver selecionada. |

- **1.3.1** — Grupo e opções expostos como radiogroup e radios nativos.
- **1.4.1** — A seleção usa fundo, barra inferior e cor do texto — não só a cor.
- **2.4.7** — Contorno de foco de 2px ao redor da opção focada pelo teclado.
- **2.3.3** — A animação do indicador é desligada com prefers-reduced-motion.
- **3.3.2** — Rótulo do grupo obrigatório e descrição opcional vinculada.
