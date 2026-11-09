# ConfirmDialog

Diálogo de alerta que pede confirmação antes de uma ação importante ou irreversível — com loading enquanto a ação roda.

- Categoria: Sobreposições · Status: estável
- Importação: `import { ConfirmDialog } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/confirm-dialog (em inglês: https://orange.llypedev.com.br/en/components/confirm-dialog)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-confirmdialog--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ConfirmDialog

## Boas práticas

- Confirme apenas ações destrutivas, caras ou difíceis de desfazer. Confirmar tudo ensina as pessoas a clicar sem ler — quando possível, ofereça "Desfazer" em vez de perguntar.
- O título é uma pergunta com o objeto: **Excluir o projeto Site 2026?**. A descrição diz a consequência concreta (o que se perde, quem é afetado).
- O botão de confirmação repete o verbo da ação — **Excluir projeto**, nunca **Sim** ou **OK**.
- Use `tone="danger"` para ações destrutivas: o botão fica vermelho e o foco inicial vai para **Cancelar**, a opção segura.

## Exemplos

### Ação destrutiva

tone="danger": botão vermelho, ícone de alerta e foco inicial em Cancelar. O fundo não fecha o diálogo.

```tsx
import { Button, ConfirmDialog } from '@orangesys/ui'
import { useState } from 'react'

export default function Danger() {
  const [excluido, setExcluido] = useState(false)

  if (excluido) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>Projeto excluído.</span>
        <Button variant="ghost" onClick={() => setExcluido(false)}>
          Desfazer
        </Button>
      </div>
    )
  }

  return (
    <ConfirmDialog
      tone="danger"
      title="Excluir o projeto Site 2026?"
      description="O projeto, seus 12 arquivos e o histórico de versões serão removidos para sempre."
      confirmLabel="Excluir projeto"
      onConfirm={() => setExcluido(true)}
      trigger={<Button variant="danger">Excluir projeto</Button>}
    />
  )
}
```

### Confirmação assíncrona

Se `onConfirm` retornar uma Promise, o botão fica em loading (anunciado a leitores de tela), Cancelar e Escape são bloqueados e o diálogo só fecha quando ela resolver. Se rejeitar, o diálogo continua aberto.

```tsx
import { Button, ConfirmDialog } from '@orangesys/ui'
import { useState } from 'react'

const encerrarSessoes = () => new Promise((resolve) => setTimeout(resolve, 1800))

export default function Async() {
  const [status, setStatus] = useState('3 dispositivos conectados')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <span>{status}</span>
      <ConfirmDialog
        tone="danger"
        title="Encerrar todas as sessões?"
        description="Você continuará conectado aqui. Nos outros dispositivos será preciso entrar de novo."
        confirmLabel="Encerrar sessões"
        loadingText="Encerrando sessões"
        onConfirm={async () => {
          await encerrarSessoes()
          setStatus('Apenas este dispositivo está conectado')
        }}
        trigger={<Button variant="outline">Encerrar sessões</Button>}
      />
    </div>
  )
}
```

### Com detalhes

Conteúdo extra (children) aparece entre a descrição e as ações — útil para listar o que será afetado. Tom neutro foca o botão de confirmação.

```tsx
import { Button, ConfirmDialog } from '@orangesys/ui'

const integracoes = [
  'Slack — canal #vendas',
  'Google Agenda — 2 calendários',
  'Webhook de faturamento',
]

export default function WithDetails() {
  return (
    <ConfirmDialog
      title="Desconectar 3 integrações?"
      description="As automações abaixo deixam de rodar até você conectar de novo."
      confirmLabel="Desconectar"
      trigger={<Button variant="outline">Desconectar integrações</Button>}
    >
      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
        {integracoes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ConfirmDialog>
  )
}
```

### Hook useConfirm

`const [confirm, confirmDialog] = useConfirm()`: renderize `confirmDialog` uma vez e use `await confirm({…})`, que resolve `true` ou `false`.

```tsx
import { Button, Icon, useConfirm } from '@orangesys/ui'
import { useState } from 'react'

const membrosIniciais = ['Ana Souza', 'Bruno Lima', 'Carla Mendes']

export default function UseConfirm() {
  const [membros, setMembros] = useState(membrosIniciais)
  const [confirm, confirmDialog] = useConfirm()

  const remover = async (nome: string) => {
    const ok = await confirm({
      tone: 'danger',
      title: `Remover ${nome} da equipe?`,
      description: 'A pessoa perde o acesso aos projetos da equipe imediatamente.',
      confirmLabel: 'Remover',
    })
    if (ok) setMembros((lista) => lista.filter((m) => m !== nome))
  }

  return (
    <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 420 }}>
      {membros.map((nome) => (
        <div
          key={nome}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            border: '1px solid var(--or-color-border)',
          }}
        >
          <span>{nome}</span>
          <Button
            size="sm"
            variant="ghost"
            startIcon={<Icon name="trash" />}
            aria-label={`Remover ${nome}`}
            onClick={() => remover(nome)}
          >
            Remover
          </Button>
        </div>
      ))}
      {membros.length === 0 && (
        <Button variant="outline" onClick={() => setMembros(membrosIniciais)}>
          Restaurar equipe
        </Button>
      )}
      {confirmDialog}
    </div>
  )
}
```

## Movimento

- **Abrir** — Sobe 8px com escala 0,96 → 1 (mais marcada que o Modal, é um alerta); fundo em fade. 250ms, --or-ease-out.
- **Fechar** — Desce 4px e some. 160ms, --or-ease-in-out.
- **Confirmar com Promise** — O rótulo dá lugar ao spinner do Button enquanto a ação roda.
- **Botões** — Afundam 1px ao pressionar. 90ms (--or-duration-press).
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `ConfirmDialog`

Diálogo de alerta (`role="alertdialog"`) que pede confirmação antes de uma
ação importante ou irreversível.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` (obrigatória) | `ReactNode` | — | Pergunta direta: "Excluir projeto?". Nomeia o diálogo. |
| `cancelLabel` | `string` | — | Rótulo do botão de cancelar. Padrão: "Cancelar". |
| `children` | `ReactNode` | — | Conteúdo extra entre a descrição e as ações (ex.: lista de itens afetados). |
| `confirmLabel` | `string` | — | Rótulo do botão de confirmação. Padrão: "Confirmar". Prefira o verbo da ação. |
| `defaultOpen` | `boolean` | — | Aberto inicialmente (não controlado). |
| `description` | `ReactNode` | — | Consequência da ação. Descreve o diálogo via `aria-describedby`. |
| `loadingText` | `string` | — | Texto anunciado enquanto `onConfirm` está pendente. |
| `onCancel` | `(() => void)` | — | Chamado ao cancelar (botão, Escape). |
| `onConfirm` | `(() => void \| Promise<unknown>)` | — | Executa a ação. Se retornar uma Promise, o botão fica em loading até ela resolver; se ela rejeitar, o diálogo continua aberto. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o diálogo pede para abrir ou fechar. |
| `open` | `boolean` | — | Aberto (controlado). Use com `onOpenChange`. |
| `tone` | `"neutral" \| "danger"` | `neutral` | `danger` para ações destrutivas: botão vermelho e foco inicial em Cancelar. `neutral` foca o botão de confirmação. |
| `trigger` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Elemento que abre o diálogo (modo não controlado). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ConfirmDialogTone`:

```ts
export type ConfirmDialogTone = 'neutral' | 'danger'
```

`ConfirmOptions`:

```ts
/** Opções aceitas por `confirm()` do hook `useConfirm`. */
export type ConfirmOptions = Pick<
  ConfirmDialogProps,
  | 'title'
  | 'description'
  | 'children'
  | 'confirmLabel'
  | 'cancelLabel'
  | 'tone'
  | 'onConfirm'
  | 'loadingText'
>
```

## Acessibilidade

Segue o padrão *Alert Dialog* do WAI-ARIA APG: `role="alertdialog"` com `aria-modal="true"`, nome pelo título e descrição pela consequência — leitores de tela anunciam os dois ao abrir. O foco fica preso, começa na ação menos destrutiva e volta ao gatilho ao fechar.

| Teclas | Ação |
| --- | --- |
| `Tab` | Alterna entre Cancelar e a ação (e o conteúdo extra, se houver). |
| `Enter` | Ativa o botão focado. |
| `Esc` | Cancela e fecha (ignorado enquanto a ação está em andamento). |

> **Clique fora não fecha** Um alerta exige uma resposta explícita: o clique no fundo é ignorado para evitar confirmações ou cancelamentos acidentais.

- **1.3.1** — Título e consequência ligados por aria-labelledby e aria-describedby.
- **2.4.3** — Foco inicial na opção segura e retorno ao gatilho ao fechar.
- **3.3.4** — Ações destrutivas pedem confirmação antes de serem executadas.
- **4.1.3** — O estado de carregamento é anunciado por uma região de status.
