# ActionBar

Barra flutuante de ações em lote: aparece quando há itens selecionados, com a contagem, as ações e um atalho para limpar a seleção.

- Categoria: Ações · Status: novo
- Importação: `import { ActionBar } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/action-bar (em inglês: https://orange.llypedev.com.br/en/components/action-bar)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-actionbar--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ActionBar

## Boas práticas

- Controle a visibilidade pela seleção — `open={selecionados.length > 0}` — e passe `count`: a barra mostra "N selecionados" e anuncia cada mudança.
- Até três ações visíveis, com verbos curtos (Exportar, Atribuir, Excluir). As demais vão para um Dropdown "Mais ações".
- Ações destrutivas pedem confirmação (ConfirmDialog) dizendo quantos itens serão afetados.
- Declare o ActionBar logo depois da coleção que ele controla: é ali que ele entra na ordem do Tab e é para lá que o foco volta quando a barra fecha. Passe `onDismiss` para limpar a seleção (botão e Escape).
- Em painéis, drawers e cartões use `portal={false}` num contêiner com `position: relative` e reserve espaço (padding) para a barra não cobrir o último item.
- Para ações que não dependem de seleção, use Toolbar ou os botões do PageHeader.

## Anatomia e layout

- **Barra** — `role="toolbar"` com nome "Ações em lote" (troque com `aria-label`) e a contagem como descrição. Uma única parada de Tab.
- **Contagem** — "1 selecionado" / "3 selecionados", no idioma do OrangeProvider e com separador de milhar. `label` troca o texto.
- **Limpar seleção** — Botão ✕ ao lado da contagem, presente quando há `onDismiss`.
- **Ações** — Os filhos. Todo botão ou link dentro deles entra nas setas, mesmo em fragmentos ou componentes próprios. Button filhos diretos (e o gatilho Button de um Dropdown) também ficam ghost/sm, como na Toolbar.
- **Posição** — Padrão: fixa na janela, centralizada, acima do conteúdo ( `--or-z-header`) e da safe area. Com `portal={false}`, absoluta no contêiner posicionado mais próximo. Ajuste a distância da borda com `--or-action-bar-offset` (ex.: acima de uma BottomNavigation).
- **Faixa estreita** — Até 32rem de largura disponível (container query, vale também dentro de painéis), a barra ocupa a largura toda e empilha: contagem e ✕ em cima, ações embaixo, quebrando linha. Nada rola na horizontal, nem a 320px.

## Exemplos

### Básico

Marque os arquivos: a barra aparece sem tirar o foco da caixa marcada. Excluir remove os itens e o foco volta para a lista.

```tsx
import { ActionBar, Button, CheckboxGroup, Icon } from '@orangesys/ui'
import { useState } from 'react'

const initialFiles = [
  { value: 'proposta', label: 'Proposta comercial.pdf' },
  { value: 'cronograma', label: 'Cronograma de entregas.xlsx' },
  { value: 'briefing', label: 'Briefing da campanha de verão.docx' },
  { value: 'logos', label: 'Logos aprovados.zip' },
]

export default function Basic() {
  const [files, setFiles] = useState(initialFiles)
  const [selected, setSelected] = useState<string[]>(['proposta', 'cronograma'])

  const remove = () => {
    setFiles((current) => current.filter((file) => !selected.includes(file.value)))
    setSelected([])
  }

  return (
    // portal={false}: a barra se prende a este contêiner posicionado, não à janela.
    // O padding embaixo reserva o espaço dela.
    <div style={{ position: 'relative', width: '100%', minHeight: 240, paddingBottom: 128 }}>
      <CheckboxGroup
        label="Arquivos do projeto"
        value={selected}
        onChange={setSelected}
        options={files}
      />
      {files.length === 0 && (
        <Button variant="outline" size="sm" onClick={() => setFiles(initialFiles)}>
          Restaurar arquivos
        </Button>
      )}
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        onDismiss={() => setSelected([])}
        portal={false}
      >
        <Button startIcon={<Icon name="download" />}>Baixar</Button>
        <Button startIcon={<Icon name="trash" />} onClick={remove}>
          Excluir
        </Button>
      </ActionBar>
    </div>
  )
}
```

### Com Table

`selectedRows` e `onSelectedRowsChange` da Table controlam a barra. Excluir pede confirmação; as ações menos usadas ficam em "Mais ações".

```tsx
import {
  ActionBar,
  Badge,
  Button,
  ConfirmDialog,
  Dropdown,
  DropdownItem,
  Icon,
  IconButton,
  Table,
  type BadgeTone,
  type TableColumn,
} from '@orangesys/ui'
import { useState } from 'react'

type Status = 'Paga' | 'Em aberto' | 'Vencida'

interface Invoice {
  id: string
  number: string
  customer: string
  due: string
  status: Status
  total: number
}

const initialInvoices: Invoice[] = [
  {
    id: 'fat-1042',
    number: 'FAT-1042',
    customer: 'Padaria Aurora',
    due: '05/11/2026',
    status: 'Paga',
    total: 1280,
  },
  {
    id: 'fat-1043',
    number: 'FAT-1043',
    customer: 'Studio Lume',
    due: '10/11/2026',
    status: 'Em aberto',
    total: 640,
  },
  {
    id: 'fat-1044',
    number: 'FAT-1044',
    customer: 'Café Tropeiro',
    due: '28/10/2026',
    status: 'Vencida',
    total: 2115.5,
  },
  {
    id: 'fat-1045',
    number: 'FAT-1045',
    customer: 'Ateliê Ponto Cruz',
    due: '15/11/2026',
    status: 'Em aberto',
    total: 389.9,
  },
  {
    id: 'fat-1046',
    number: 'FAT-1046',
    customer: 'Livraria Sebo Azul',
    due: '20/11/2026',
    status: 'Em aberto',
    total: 1020,
  },
]

const statusTone: Record<Status, BadgeTone> = {
  Paga: 'success',
  'Em aberto': 'info',
  Vencida: 'danger',
}
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const columns: TableColumn<Invoice>[] = [
  { key: 'number', header: 'Fatura', rowHeader: true },
  { key: 'customer', header: 'Cliente' },
  { key: 'due', header: 'Vencimento' },
  {
    key: 'status',
    header: 'Situação',
    render: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge>,
  },
  { key: 'total', header: 'Total', align: 'end', render: (row) => brl.format(row.total) },
]

export default function WithTable() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [selected, setSelected] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)
  const count = selected.length

  const markAsPaid = () =>
    setInvoices((current) =>
      current.map((invoice) =>
        selected.includes(invoice.id) ? { ...invoice, status: 'Paga' } : invoice,
      ),
    )

  const remove = () => {
    setInvoices((current) => current.filter((invoice) => !selected.includes(invoice.id)))
    setSelected([])
  }

  return (
    // A barra fica presa a este contêiner (portal={false}); o padding embaixo
    // reserva o espaço dela para não cobrir a última linha (em telas estreitas
    // ela empilha e fica mais alta).
    <div style={{ position: 'relative', width: '100%', paddingBottom: 144 }}>
      <Table
        caption="Faturas de novembro"
        columns={columns}
        data={invoices}
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
        getRowLabel={(invoice) => `${invoice.number}, ${invoice.customer}`}
        emptyState={
          <Button variant="outline" size="sm" onClick={() => setInvoices(initialInvoices)}>
            Restaurar faturas
          </Button>
        }
      />

      <ActionBar open={count > 0} count={count} onDismiss={() => setSelected([])} portal={false}>
        <Button startIcon={<Icon name="download" />}>Exportar</Button>
        <Button startIcon={<Icon name="trash" />} onClick={() => setConfirming(true)}>
          Excluir
        </Button>
        {/* Ações menos usadas ficam no menu "Mais ações". */}
        <Dropdown trigger={<IconButton icon="more-horizontal" label="Mais ações" />}>
          <DropdownItem icon="check" onSelect={markAsPaid}>
            Marcar como paga
          </DropdownItem>
          <DropdownItem icon="mail">Reenviar cobrança</DropdownItem>
        </Dropdown>
      </ActionBar>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        tone="danger"
        title={count === 1 ? 'Excluir 1 fatura?' : `Excluir ${count} faturas?`}
        description="As faturas saem da lista e os clientes deixam de receber lembretes. Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={remove}
      />
    </div>
  )
}
```

### Rótulo próprio e no topo

`label` mostra um resumo da seleção e `placement="top"` leva a barra para o topo.

```tsx
import {
  ActionBar,
  Button,
  CheckboxGroup,
  Dropdown,
  DropdownItem,
  Icon,
  IconButton,
} from '@orangesys/ui'
import { useState } from 'react'

const tasks = [
  { value: 'onboarding', label: 'Revisar fluxo de onboarding', points: 5 },
  { value: 'cupom', label: 'Corrigir cupom no checkout', points: 3 },
  { value: 'relatorio', label: 'Relatório mensal de vendas', points: 2 },
  { value: 'auditoria', label: 'Auditoria de acessibilidade', points: 8 },
]

export default function LabelAndPlacement() {
  const [selected, setSelected] = useState<string[]>(['onboarding', 'auditoria'])
  const points = tasks
    .filter((task) => selected.includes(task.value))
    .reduce((sum, task) => sum + task.points, 0)
  const noun = selected.length === 1 ? 'tarefa' : 'tarefas'

  return (
    // placement="top": a barra flutua no topo do contêiner; o padding reserva o espaço.
    <div style={{ position: 'relative', width: '100%', minHeight: 280, paddingTop: 128 }}>
      <CheckboxGroup
        label="Backlog da sprint"
        value={selected}
        onChange={setSelected}
        options={tasks.map(({ value, label, points }) => ({
          value,
          label,
          description: `${points} pontos`,
        }))}
      />
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        label={`${selected.length} ${noun} · ${points} pontos`}
        placement="top"
        onDismiss={() => setSelected([])}
        portal={false}
      >
        <IconButton icon="user" label="Atribuir responsável" />
        {/* O gatilho Button de um Dropdown filho direto também entra nas setas. */}
        <Dropdown trigger={<Button endIcon={<Icon name="chevron-down" />}>Mover para</Button>}>
          <DropdownItem>Em andamento</DropdownItem>
          <DropdownItem>Em revisão</DropdownItem>
          <DropdownItem>Concluído</DropdownItem>
        </Dropdown>
      </ActionBar>
    </div>
  )
}
```

### Fixa na janela (padrão)

Sem portal={false}, a barra flutua no rodapé da janela. A ordem do Tab continua a da página: depois da lista vem a barra.

```tsx
import { ActionBar, Button, CheckboxGroup, Icon } from '@orangesys/ui'
import { useState } from 'react'

const initialNotifications = [
  { value: 'envio', label: 'Pedido #4821 saiu para entrega' },
  { value: 'comentario', label: 'Novo comentário em "Proposta comercial"' },
  { value: 'vencida', label: 'A fatura FAT-1044 venceu ontem' },
  { value: 'relatorio', label: 'Relatório semanal de vendas disponível' },
]

export default function Viewport() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selected, setSelected] = useState<string[]>([])

  const archive = () => {
    setNotifications((current) => current.filter((item) => !selected.includes(item.value)))
    setSelected([])
  }

  return (
    <>
      <CheckboxGroup
        label="Notificações"
        description="Selecione uma ou mais: a barra aparece no rodapé da janela."
        value={selected}
        onChange={setSelected}
        options={notifications}
      />
      {notifications.length === 0 && (
        <Button variant="outline" size="sm" onClick={() => setNotifications(initialNotifications)}>
          Restaurar notificações
        </Button>
      )}
      {/* Padrão (portal): fixa na janela, centralizada, acima do conteúdo e da safe area. */}
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        onDismiss={() => setSelected([])}
      >
        <Button startIcon={<Icon name="check" />} onClick={() => setSelected([])}>
          Marcar como lidas
        </Button>
        <Button startIcon={<Icon name="folder" />} onClick={archive}>
          Arquivar
        </Button>
      </ActionBar>
    </>
  )
}
```

## Movimento

- **Entrar** — Sobe 24px (desce, no topo) com fade em `--or-duration-medium` e `--or-ease-out`.
- **Sair** — Mais curta: volta 8px e esmaece em `--or-duration-fast` com `--or-ease-in-out`, sem receber cliques. O `usePresence` mantém a barra montada até o fim.
- **Contagem** — O número muda na hora, sem animação: é informação, não decoração.
- **Movimento reduzido** — Com `prefers-reduced-motion`, sem deslocamento e com as durações zeradas: a barra só aparece e some.

## Props

### `ActionBar`

Barra flutuante de ações em lote: aparece quando há itens selecionados
(Table, TreeView, CheckboxGroup, SortableList…) com a contagem, as ações e
um botão para limpar a seleção. É um `role="toolbar"` com roving tabindex;
aparecer não rouba o foco e a contagem é anunciada numa região viva educada.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `count` | `number` | — | Quantidade de itens selecionados. Mostra "{count} selecionados" (no idioma do `OrangeProvider`) e anuncia cada mudança a leitores de tela. |
| `finalFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco quando a barra fecha com o foco dentro dela. Padrão: o elemento focado antes de entrar na barra ou, se ele sumiu (ex.: linhas excluídas), o elemento focável mais próximo antes do ActionBar. |
| `label` | `ReactNode` | — | Substitui o texto da contagem (ex.: "3 faturas selecionadas"). Em texto, é ele o anunciado; se for um elemento, anuncia-se a contagem. |
| `onDismiss` | `(() => void)` | — | Mostra o botão "Limpar seleção" e é chamado nele e com Escape enquanto o foco estiver na barra. Normalmente limpa a seleção (o que fecha a barra). |
| `open` | `boolean` | `false` | Mostra a barra. O uso comum é controlado pela seleção: `open={selecionados.length > 0}`. |
| `placement` | `"bottom" \| "top"` | `bottom` | Borda da tela (ou do contêiner, com `portal={false}`) onde a barra flutua. |
| `portal` | `boolean` | `true` | `true`: fixa na viewport, centralizada, acima do conteúdo (renderizada em portal). `false`: absoluta dentro do contêiner posicionado mais próximo — para painéis e exemplos. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ActionBarPlacement`:

```ts
export type ActionBarPlacement = 'bottom' | 'top'
```

## Acessibilidade

A barra é um `role="toolbar"` com *roving tabindex*: uma parada de Tab (de início, a primeira ação) e setas entre os itens. **Aparecer não move o foco** — quem está marcando linhas continua na linha. A contagem é anunciada numa região `role="status"` educada, sempre montada, só quando muda.

**Foco ao fechar:** se a barra fecha com o foco dentro dela (Limpar seleção, Escape, uma ação que limpa a seleção), o foco vai para `finalFocus`; senão, volta ao elemento focado antes de entrar na barra (a caixa da linha, por exemplo); se ele sumiu (linhas excluídas), vai para o elemento focável mais próximo antes do ActionBar na página. Um diálogo de confirmação que devolva o foco à barra que está saindo é redirecionado da mesma forma. Em portal, a ordem do Tab trata a barra como se ela estivesse onde o ActionBar foi declarado.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra na barra pela primeira ação (ou a última focada) a partir do elemento anterior a ela; o próximo Tab sai da barra. |
| `Shift` + `Tab` | Mesmo caminho, ao contrário. |
| `→` | Próximo item. Do último, volta ao primeiro. |
| `←` | Item anterior. |
| `Home` | Primeiro item (Limpar seleção, quando houver). |
| `End` | Último item. |
| `Enter` | Ativa o item focado. |
| `Space` | Ativa o item focado. |
| `↓` | No gatilho de um Dropdown, abre o menu. |
| `Esc` | Com o foco na barra, chama `onDismiss` (limpa a seleção). Num menu aberto, fecha só o menu. |

- **1.3.1** — Barra exposta como toolbar com nome; a contagem é a descrição dela.
- **1.4.10** — Reflui em faixas estreitas, sem rolagem horizontal a 320px.
- **2.1.1** — Todas as ações alcançáveis pelo teclado; Escape limpa a seleção.
- **2.4.3** — Aparecer não rouba o foco; ao fechar, o foco volta para um lugar previsível; em portal, a ordem do Tab segue a página.
- **2.4.7** — Foco visível com contorno laranja de 2px em cada item.
- **4.1.3** — A contagem é anunciada numa região viva educada, sem mover o foco.
