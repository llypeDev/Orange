# TaskList

Lista de tarefas com status para configurações longas que a pessoa conclui em qualquer ordem — com resumo de progresso.

- Categoria: Navegação · Status: novo
- Importação: `import { TaskList, TaskListItem } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/task-list (em inglês: https://orange.llypedev.com.br/en/components/task-list)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-tasklist--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TaskList

## Boas práticas

- Use para configurações longas que a pessoa conclui **em qualquer ordem** e em várias visitas — onboarding, cadastro em seções, preparação de uma campanha. Para um fluxo linear, uma etapa por vez, use **Stepper**.
- Nomeie cada tarefa pelo que a pessoa vai fazer ou informar (“Formas de pagamento”), em até poucas palavras; detalhes vão na descrição.
- O status é sempre texto: a tag só reforça com cor. Use `statusLabel` para explicar por que uma tarefa ainda não pode começar (“Disponível após o frete”).
- Com `title`, o resumo “3 de 5 concluídas” é calculado a partir dos itens. Se os itens estiverem dentro de componentes próprios, informe `completed` e `total`.

- Faça: Nomes específicos e o motivo de uma tarefa bloqueada.
- Faça: Uma linha inteira por tarefa, com descrição curta.
- Evite: Nomes genéricos (“Clique aqui”, “Passo 2”): o link é lido fora de contexto.
- Evite: Botões ou links dentro da descrição de uma linha acionável (alvos aninhados).

## Status

- **complete — Concluído** — Tag success. A tarefa continua sendo link: a pessoa pode voltar e revisar.
- **in-progress — Em andamento** — Tag info. Começou, mas falta algo para concluir.
- **not-started — Não iniciado** — Tag neutral. Disponível, ainda sem nenhuma informação.
- **error — Com erro** — Tag danger. Algo precisa ser corrigido; diga o quê na descrição (“2 produtos sem preço”).
- **cannot-start — Ainda indisponível** — Texto simples, sem tag, e a linha nunca é link (mesmo com href). Explique o motivo com statusLabel.

## Exemplos

### Onboarding com resumo

title mostra o heading e o progresso calculado a partir dos itens. A barra fica verde quando tudo está concluído.

```tsx
import { TaskList, TaskListItem } from '@orangesys/ui'

export default function Onboarding() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <TaskList title="Configure sua loja" headingLevel={4}>
        <TaskListItem
          href="#/configuracoes/empresa"
          status="complete"
          description="Razão social, endereço e logotipo"
        >
          Dados da empresa
        </TaskListItem>
        <TaskListItem
          href="#/configuracoes/pagamentos"
          status="in-progress"
          description="Pix, boleto e cartão de crédito"
        >
          Formas de pagamento
        </TaskListItem>
        <TaskListItem
          href="#/configuracoes/frete"
          status="not-started"
          description="Tabelas de frete e retirada na loja"
        >
          Frete e entrega
        </TaskListItem>
        <TaskListItem href="#/catalogo" status="error" description="2 produtos estão sem preço">
          Catálogo de produtos
        </TaskListItem>
        <TaskListItem status="cannot-start" statusLabel="Disponível após o frete">
          Domínio próprio
        </TaskListItem>
      </TaskList>
    </div>
  )
}
```

### Em seções

Como no GOV.UK: uma lista por seção, nomeada pelo heading da página (aria-labelledby), sem resumo próprio.

```tsx
import { useId } from 'react'
import { TaskList, TaskListItem } from '@orangesys/ui'

export default function Sections() {
  const planejamento = useId()
  const conteudo = useId()
  const revisao = useId()
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 640 }}>
      <section aria-labelledby={planejamento}>
        <h4 id={planejamento} className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          1. Planejamento
        </h4>
        <TaskList aria-labelledby={planejamento}>
          <TaskListItem href="#/campanha/publico" status="complete">
            Público e segmentação
          </TaskListItem>
          <TaskListItem href="#/campanha/orcamento" status="complete">
            Orçamento de mídia
          </TaskListItem>
        </TaskList>
      </section>
      <section aria-labelledby={conteudo}>
        <h4 id={conteudo} className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          2. Conteúdo
        </h4>
        <TaskList aria-labelledby={conteudo}>
          <TaskListItem
            href="#/campanha/banners"
            status="in-progress"
            description="3 de 6 formatos enviados"
          >
            Banners da Black Friday
          </TaskListItem>
          <TaskListItem href="#/campanha/email" status="not-started">
            E-mail de lançamento
          </TaskListItem>
        </TaskList>
      </section>
      <section aria-labelledby={revisao}>
        <h4 id={revisao} className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          3. Revisão
        </h4>
        <TaskList aria-labelledby={revisao}>
          <TaskListItem status="cannot-start" statusLabel="Disponível após o conteúdo">
            Aprovação do jurídico
          </TaskListItem>
        </TaskList>
      </section>
    </div>
  )
}
```

### Tarefas que abrem um diálogo

Sem href, onClick transforma o nome em botão. Ao concluir, o status dá um pequeno “pop” e o progresso avança.

```tsx
import { useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  TaskList,
  TaskListItem,
  type TaskListStatus,
} from '@orangesys/ui'

interface Tarefa {
  nome: string
  descricao: string
  status: TaskListStatus
}

const inicial: Tarefa[] = [
  { nome: 'Importar produtos', descricao: 'Planilha com 248 itens', status: 'complete' },
  { nome: 'Conectar o ERP', descricao: 'Sincroniza estoque a cada 15 min', status: 'in-progress' },
  {
    nome: 'Configurar notificações',
    descricao: 'Pedidos novos e estoque baixo',
    status: 'not-started',
  },
]

export default function WithButtons() {
  const [tarefas, setTarefas] = useState(inicial)
  const [aberta, setAberta] = useState<number | null>(null)
  const atual = aberta === null ? null : tarefas[aberta]

  const concluir = () => {
    setTarefas((lista) => lista.map((t, i) => (i === aberta ? { ...t, status: 'complete' } : t)))
    setAberta(null)
  }

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <TaskList title="Primeiros passos" headingLevel={4}>
        {tarefas.map((tarefa, i) => (
          <TaskListItem
            key={tarefa.nome}
            status={tarefa.status}
            description={tarefa.descricao}
            onClick={() => setAberta(i)}
          >
            {tarefa.nome}
          </TaskListItem>
        ))}
      </TaskList>
      <Modal
        open={atual !== null}
        onOpenChange={(open) => !open && setAberta(null)}
        title={atual?.nome ?? ''}
        description={atual?.descricao}
      >
        <ModalBody>
          <p style={{ margin: 0 }}>
            Revise as configurações e marque a tarefa como concluída para atualizar o progresso.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setAberta(null)}>
            Agora não
          </Button>
          <Button onClick={concluir}>Marcar como concluída</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
```

### Com o roteador

renderLink recebe href, classe, aria-describedby e o nome — repasse tudo ao link do roteador.

```tsx
import { TaskList, TaskListItem } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real: import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function RouterLinks() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <TaskList
        title="Emissão de notas fiscais"
        headingLevel={4}
        renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      >
        <TaskListItem
          href="/fiscal/certificado"
          status="complete"
          description="Certificado A1 enviado"
        >
          Certificado digital
        </TaskListItem>
        <TaskListItem
          href="/fiscal/tributacao"
          status="in-progress"
          description="Regime tributário e alíquotas"
        >
          Regras de tributação
        </TaskListItem>
        <TaskListItem status="cannot-start" statusLabel="Disponível após a tributação">
          Nota de teste em homologação
        </TaskListItem>
      </TaskList>
    </div>
  )
}
```

## Movimento

- **Hover / foco em uma linha** — Mesma resposta: fundo da linha, cor de acento e sublinhado que engrossa (1px → 2px) — --or-duration-fast. O foco desenha o contorno em volta da linha inteira.
- **Pressionar** — A linha afunda 1px (translateY + scale) em --or-duration-press.
- **Status muda** — Só depois de montado: a nova tag entra com um “pop” (scale + opacidade, --or-ease-bounce); a barra de progresso cresce e troca de cor com transição.
- **Movimento reduzido** — Tudo instantâneo; status e progresso continuam em texto.

## Props

### `TaskList`

Lista de tarefas com status, para fluxos longos que a pessoa conclui em
qualquer ordem e em várias visitas (configuração de conta, onboarding,
cadastro em seções). Padrão "Task list" do GOV.UK.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Elementos `TaskListItem`. |
| `completed` | `number` | — | Tarefas concluídas. Padrão: contadas a partir dos `TaskListItem` filhos diretos com `status="complete"`. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Nível do heading do `title`. Padrão: `2`. |
| `renderLink` | `RenderLink` | — | Renderiza os links das tarefas com o componente do seu roteador: `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`. |
| `showProgress` | `boolean` | — | Mostra o progresso ("3 de 5 concluídas") com uma `ProgressBar`. Padrão: `true` quando há `title`. |
| `title` | `ReactNode` | — | Título do resumo acima da lista (ex.: "Configure sua loja"). Também nomeia a lista. |
| `total` | `number` | — | Total de tarefas. Padrão: o número de `TaskListItem` filhos diretos. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `TaskListItem`

Uma tarefa da `TaskList`: nome (link ou botão quando acionável), descrição
opcional e status em texto + tag.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` (obrigatória) | `ReactNode` | — | Nome da tarefa. Em linhas acionáveis, é o texto (e o nome acessível) do link ou botão. |
| `status` (obrigatória) | `"error" \| "complete" \| "in-progress" \| "not-started" \| "cannot-start"` | — | Situação da tarefa: `complete` (tag verde), `in-progress` (azul), `not-started` (neutra), `error` (vermelha) ou `cannot-start` (texto simples; a linha nunca é link). |
| `description` | `ReactNode` | — | Texto de apoio abaixo do nome. Descreve o link/botão da linha (`aria-describedby`). |
| `href` | `string` | — | Destino da tarefa. A linha inteira vira o alvo do link. |
| `onClick` | `((event: MouseEvent<HTMLElement, MouseEvent>) => void)` | — | Sem `href`, torna a linha um botão (ex.: abrir um diálogo). Com `href`, é repassado ao link. |
| `statusLabel` | `ReactNode` | — | Substitui o texto padrão do status (ex.: "Disponível após o frete"). |

Repassa também os atributos nativos (`LiHTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TaskListStatus`:

```ts
export type TaskListStatus = 'complete' | 'in-progress' | 'not-started' | 'cannot-start' | 'error'
```

## Acessibilidade

Segue a estrutura do **Task list** do GOV.UK: um `<ul>` nomeado pelo título, um `<li>` por tarefa. O nome da tarefa é o nome acessível do link (ou botão), e a descrição e o status o descrevem via `aria-describedby` — “Formas de pagamento, link, Pix e boleto, Em andamento”. A área de clique cobre a linha toda, mas há um único controle por linha. Tarefas `cannot-start` são texto. O resumo é uma `progressbar` nomeada pelo título, com `aria-valuetext` “3 de 5 concluídas”.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre as tarefas acionáveis (cannot-start fica de fora). |
| `Enter` | Segue o link ou ativa o botão da tarefa. |
| `Space` | Ativa o botão (tarefas com onClick). |

- **1.3.1** — Lista nomeada; nome, descrição e status ligados ao controle por aria-describedby.
- **1.4.1** — Status sempre em texto; a cor da tag só reforça.
- **2.4.4** — O propósito do link vem do nome da tarefa e da descrição programática.
- **2.4.7** — Foco visível em volta da linha inteira (o alvo real).
- **2.5.8** — Alvo de clique do tamanho da linha.
