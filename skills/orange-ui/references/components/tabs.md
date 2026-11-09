# Tabs

Abas organizam conteúdo relacionado em painéis e mostram um painel por vez.

- Categoria: Navegação · Status: estável
- Importação: `import { Tabs, Tab, TabList, TabPanel } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/tabs (em inglês: https://orange.llypedev.com.br/en/components/tabs)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-tabs--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Tabs

## Boas práticas

- Use abas para alternar entre visões do mesmo assunto. Para etapas em sequência, use Stepper; para ir a outra página, use links.
- Rótulos curtos (uma ou duas palavras), em caixa de sentença, que descrevem o conteúdo do painel.
- Evite mais de 6 abas. Se o conteúdo não cabe, reorganize — abas roláveis escondem opções.
- Prefira a ativação automática. Use `activation="manual"` quando trocar de painel dispara uma consulta lenta.

- Faça: Visões paralelas do mesmo objeto.
- Evite: Etapas sequenciais de um fluxo — use Stepper.

## Anatomia

- **Tabs** — Raiz: guarda a aba selecionada, a variante e a orientação.
- **TabList** — Lista de abas (`role="tablist"`). Precisa de `aria-label`.
- **Tab** — Uma aba, com ícone e contador opcionais.
- **TabPanel** — Painel ligado à aba de mesmo `value`.

## Exemplos

### Básico

Variante line: a aba ativa ganha o sublinhado laranja de 2px. Abas desabilitadas são puladas pelas setas.

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

export default function Basic() {
  return (
    <Tabs defaultValue="geral" style={{ width: '100%' }}>
      <TabList aria-label="Configurações do projeto">
        <Tab value="geral">Visão geral</Tab>
        <Tab value="membros">Membros</Tab>
        <Tab value="integracoes">Integrações</Tab>
        <Tab value="faturamento" disabled>
          Faturamento
        </Tab>
      </TabList>
      <TabPanel value="geral">
        <p style={{ margin: 0 }}>Resumo do projeto Checkout 2.0: 3 metas no trimestre, 12 tarefas abertas.</p>
      </TabPanel>
      <TabPanel value="membros">
        <p style={{ margin: 0 }}>8 pessoas têm acesso a este projeto. Convide alguém pelo e-mail.</p>
      </TabPanel>
      <TabPanel value="integracoes">
        <p style={{ margin: 0 }}>Conecte o Slack para receber alertas de deploy no canal #checkout.</p>
      </TabPanel>
      <TabPanel value="faturamento">
        <p style={{ margin: 0 }}>Disponível no plano Pro.</p>
      </TabPanel>
    </Tabs>
  )
}
```

### Enclosed com ícones e contadores

Abas com borda que se unem ao painel. icon é decorativo; badge entra no nome acessível.

```tsx
import { Icon, Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

export default function Enclosed() {
  return (
    <Tabs variant="enclosed" defaultValue="pendentes" style={{ width: '100%' }}>
      <TabList aria-label="Pedidos por status">
        <Tab value="todos" icon={<Icon name="inbox" />} badge={128}>
          Todos
        </Tab>
        <Tab value="pendentes" icon={<Icon name="clock" />} badge={12}>
          Pendentes
        </Tab>
        <Tab value="enviados" icon={<Icon name="send" />} badge={96}>
          Enviados
        </Tab>
        <Tab value="cancelados" icon={<Icon name="x-circle" />}>
          Cancelados
        </Tab>
      </TabList>
      <TabPanel value="todos">128 pedidos nos últimos 30 dias.</TabPanel>
      <TabPanel value="pendentes">12 pedidos aguardando confirmação de pagamento.</TabPanel>
      <TabPanel value="enviados">96 pedidos a caminho do cliente.</TabPanel>
      <TabPanel value="cancelados">Nenhum pedido cancelado neste período.</TabPanel>
    </Tabs>
  )
}
```

### Vertical

Para páginas de configurações. As setas ↑/↓ substituem ←/→. Em telas estreitas a lista fica acima do painel.

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

const sections = [
  { value: 'conta', label: 'Conta', text: 'Nome, e-mail e foto exibidos para a sua equipe.' },
  { value: 'notificacoes', label: 'Notificações', text: 'Escolha o que chega por e-mail e o que fica só no app.' },
  { value: 'privacidade', label: 'Privacidade', text: 'Controle quem vê seu status e sua atividade recente.' },
  { value: 'acessibilidade', label: 'Acessibilidade', text: 'Reduza animações e aumente o contraste da interface.' },
]

export default function Vertical() {
  return (
    <Tabs orientation="vertical" defaultValue="conta" style={{ width: '100%', minHeight: 200 }}>
      <TabList aria-label="Preferências" style={{ minWidth: 180 }}>
        {sections.map((s) => (
          <Tab key={s.value} value={s.value}>
            {s.label}
          </Tab>
        ))}
      </TabList>
      {sections.map((s) => (
        <TabPanel key={s.value} value={s.value}>
          <h4 style={{ margin: '0 0 8px' }}>{s.label}</h4>
          <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>{s.text}</p>
        </TabPanel>
      ))}
    </Tabs>
  )
}
```

### Controlado com ativação manual

As setas só movem o foco; Enter ou Espaço carregam o período.

```tsx
import { Stack, Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'
import { useState } from 'react'

const periods = { '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '90d': 'Últimos 90 dias', '12m': 'Últimos 12 meses' }
type Period = keyof typeof periods

export default function Manual() {
  const [period, setPeriod] = useState<Period>('30d')
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      {/* Cada painel dispara uma consulta pesada: seleção só com Enter/Espaço. */}
      <Tabs value={period} onChange={(v) => setPeriod(v as Period)} activation="manual" size="sm">
        <TabList aria-label="Período do relatório">
          {Object.entries(periods).map(([value, label]) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabList>
        {Object.keys(periods).map((value) => (
          <TabPanel key={value} value={value}>
            Receita, pedidos e ticket médio — {periods[value as Period].toLowerCase()}.
          </TabPanel>
        ))}
      </Tabs>
      <small style={{ color: 'var(--or-color-text-subtle)' }}>Período carregado: {period}</small>
    </Stack>
  )
}
```

### Ajustadas à largura

fitted divide a largura igualmente — bom para duas ou três abas em telas pequenas.

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

export default function Fitted() {
  return (
    <Tabs fitted size="lg" defaultValue="entrar" style={{ width: '100%', maxWidth: 400 }}>
      <TabList aria-label="Acesso">
        <Tab value="entrar">Entrar</Tab>
        <Tab value="criar">Criar conta</Tab>
      </TabList>
      <TabPanel value="entrar">Use seu e-mail corporativo e senha.</TabPanel>
      <TabPanel value="criar">Leva menos de um minuto. Não pedimos cartão.</TabPanel>
    </Tabs>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Trocar de aba** — Um único indicador de 2px desliza até a aba ativa (translateX + scaleX) — medium (250ms), ease-spring. Na vertical, translateY + scaleY.
- **Painel novo** — Entra com fade + 4px de baixo para cima — medium, ease-out. Não anima na primeira renderização.
- **Hover / foco em aba inativa** — Prévia do sublinhado cresce da esquerda (scaleX) — medium, ease-out; cor do texto em fast (160ms).
- **Enclosed: selecionar** — O traço laranja do topo cresce de 0 a 2px (box-shadow) — medium, ease-spring; fundo e borda em fast.

## Props

### `Tabs`

Abas organizam conteúdo relacionado em painéis, mostrando um por vez.
Implementa o padrão Tabs do WAI-ARIA com `TabList`, `Tab` e `TabPanel`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `activation` | `"manual" \| "automatic"` | `automatic` | `automatic` (padrão) seleciona a aba ao receber foco pelas setas; `manual` só seleciona com Enter/Espaço — use quando trocar de painel é lento. |
| `defaultValue` | `string` | — | Aba selecionada inicialmente (não controlado). Padrão: a primeira aba habilitada. |
| `fitted` | `boolean` | `false` | As abas dividem igualmente a largura disponível. |
| `onChange` | `((value: string) => void)` | — | Chamado quando outra aba é selecionada. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Orientação da lista de abas. `vertical` usa ↑/↓; `horizontal` usa ←/→. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura das abas: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `string` | — | Aba selecionada (controlado). |
| `variant` | `"line" \| "enclosed"` | `line` | `line`: sublinhado laranja de 2px. `enclosed`: abas com borda, unidas ao painel. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `Tab`

Uma aba. Fica fora da ordem de Tab quando não está selecionada (roving tabindex).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` (obrigatória) | `string` | — | Identificador da aba; liga a aba ao `TabPanel` de mesmo `value`. |
| `badge` | `ReactNode` | — | Contador ou selo após o rótulo (ex.: número de itens). |
| `icon` | `ReactNode` | — | Ícone antes do rótulo (decorativo). |

Repassa também os atributos nativos (`ButtonHTMLAttributes`) do `<button>`, como `type`, `disabled`, `onClick`, `form` e `name`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### `TabList`

Contêiner das abas (`role="tablist"`). Dê um nome com `aria-label` ou `aria-labelledby`.

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `TabPanel`

Painel de conteúdo de uma aba (`role="tabpanel"`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` (obrigatória) | `string` | — | O `value` da aba que controla este painel. |
| `keepMounted` | `boolean` | `false` | Mantém o conteúdo montado (apenas escondido) quando o painel está inativo. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TabsActivation`:

```ts
export type TabsActivation = 'automatic' | 'manual'
```

`TabsOrientation`:

```ts
export type TabsOrientation = 'horizontal' | 'vertical'
```

`TabsSize`:

```ts
export type TabsSize = 'sm' | 'md' | 'lg'
```

`TabsVariant`:

```ts
export type TabsVariant = 'line' | 'enclosed'
```

## Acessibilidade

Segue o padrão **Tabs** do WAI-ARIA APG: `role="tablist"`, `tab` e `tabpanel`, com `aria-selected`, `aria-controls` e `aria-labelledby`. Apenas a aba selecionada fica na ordem de Tab (roving tabindex); o painel é focável para quem navega por teclado.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra na lista pela aba selecionada; o próximo Tab vai para o painel. |
| `→` | Horizontal: próxima aba (volta ao início no fim). |
| `←` | Horizontal: aba anterior. |
| `↓` + `↑` | Vertical: próxima e anterior. |
| `Home` | Primeira aba habilitada. |
| `End` | Última aba habilitada. |
| `Enter` | Ativação manual: seleciona a aba em foco. |
| `Space` | Ativação manual: seleciona a aba em foco. |

- **1.3.1** — Relações entre abas e painéis expostas com papéis e atributos ARIA.
- **1.4.1** — A aba ativa é indicada pelo sublinhado (ou borda), não só pela cor do texto.
- **2.1.1** — Todas as funções disponíveis por teclado, conforme o APG.
- **2.4.7** — Foco visível dentro da aba e no painel.
- **4.1.2** — Estado selecionado exposto com aria-selected.
