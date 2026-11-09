# ListView

Lista interativa com seleção e ações por linha: membros, arquivos, integrações e configurações, navegável por teclado.

- Categoria: Exibição de dados · Status: novo
- Importação: `import { ListView, ListViewItem } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/list-view (em inglês: https://orange.llypedev.com.br/en/components/list-view)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-listview--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ListView

## Boas práticas

- Use para coleções em que cada linha é um objeto com ações: membros, arquivos, integrações, configurações. Para listas só de leitura, use **List**; para escolher valores de um formulário, **Listbox**; para dados com várias colunas comparáveis, **Table**.
- Dê um nome à lista com **aria-label** ou **aria-labelledby**. O título de cada linha deve ser curto e único — ele é o nome da linha e o alvo da busca por digitação.
- Use **onAction** para a ação principal da linha (abrir detalhes). Ações secundárias vão em **actions**: no máximo dois botões de ícone; o resto num **Dropdown**.
- Não coloque links nem campos de texto como conteúdo principal da linha: a linha inteira já é o alvo do clique e do teclado.
- Desabilite uma linha só quando o item existe mas não pode ser usado (ex.: convite expirado) — e desabilite também as ações dela. Como no Listbox e no TreeView, a linha desabilitada continua focável, para que o motivo (na descrição) seja lido.

## Anatomia

- **ListView** — Contêiner `role="grid"` com borda de 1px e separadores entre as linhas. Uma única parada de Tab.
- **ListViewItem** — Linha (`role="row"`) com uma célula. Slots, da esquerda para a direita: caixa de seleção, `icon`, título (`children`) com `description` abaixo e `actions`.
- **icon** — Ícone, avatar ou logotipo. Decorativo (aria-hidden): o nome da linha vem do título. Informação que só existe no visual (ex.: status de presença) deve ir para a descrição.
- **Título e descrição** — Quebram linha em telas estreitas; as ações nunca encolhem e continuam alcançáveis a 320px.
- **actions** — Botões de ícone, um Dropdown ou um status (Badge). Ficam fora da ordem de Tab e são alcançados com → / ←.
- **Indicador de seleção** — Em `selectionMode="multiple"`, uma caixa de seleção (checkbox): clicar nela alterna só aquela linha. Na seleção única com `onAction`, um botão de opção (radio), já que o clique na linha é a ação: marca a linha e não desmarca.
- **Linha selecionada** — Fundo de acento suave, barra laranja à esquerda e título em negrito.

## Seleção e ação

- **`selectionMode="none"`** — Padrão. Sem seleção: Enter, Espaço e clique na linha chamam `onAction(id)` (se houver), com o `id` do item.
- **Sem onAction** — Enter, Espaço e clique na linha selecionam. Na seleção única (como no Listbox e no TreeView), selecionar outra linha substitui a seleção e a linha já selecionada continua selecionada; na múltipla, alternam a linha.
- **Com onAction** — Enter e clique no fundo da linha chamam `onAction(id)`, que recebe o `id` do item; a seleção fica com Espaço e com o indicador de seleção (caixa na múltipla, botão de opção na única).
- **Ordem dos ids** — `onSelectedChange` recebe os ids na ordem das linhas. Ids em `selected` sem linha correspondente são mantidos no fim.
- **Linhas desabilitadas** — Como no Listbox e no TreeView: continuam focáveis (setas, Home/End, PageUp/PageDown, busca por digitação e clique) e expõem aria-disabled="true", mas não são selecionadas — nem por Espaço, clique, Ctrl + A ou faixas com Shift — e não disparam onAction. Visual: conteúdo esmaecido, sem hover; com foco, o mesmo fundo e contorno das outras linhas.

## Exemplos

### Membros da equipe

Seleção múltipla controlada, avatares, função na descrição e um Dropdown de ações por linha. O convite expirado está desabilitado: recebe foco, mas não seleção. Remover uma linha devolve o foco à vizinha.

```tsx
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  IconButton,
  ListView,
  ListViewItem,
} from '@orangesys/ui'
import { useState } from 'react'

const equipeInicial = [
  { id: 'ana', nome: 'Ana Souza', funcao: 'Administradora · Financeiro' },
  { id: 'bruno', nome: 'Bruno Lima', funcao: 'Editor · Marketing' },
  { id: 'carla', nome: 'Carla Dias', funcao: 'Leitora · Jurídico' },
  { id: 'diego', nome: 'Diego Alves', funcao: 'Convite expirado', expirado: true },
  { id: 'elisa', nome: 'Elisa Moraes', funcao: 'Editora · Produto' },
]

export default function TeamMembers() {
  const [equipe, setEquipe] = useState(equipeInicial)
  const [selecionados, setSelecionados] = useState<string[]>(['bruno'])

  const remover = (ids: string[]) => {
    setEquipe((atual) => atual.filter((membro) => !ids.includes(membro.id)))
    setSelecionados((atual) => atual.filter((id) => !ids.includes(id)))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, width: '100%', maxWidth: 560 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <p id="membros-titulo" style={{ margin: 0, fontWeight: 600 }}>
          Membros da equipe
        </p>
        <Button
          size="sm"
          variant="outline"
          disabled={selecionados.length === 0}
          onClick={() => remover(selecionados)}
        >
          Remover selecionados ({selecionados.length})
        </Button>
      </div>
      <ListView
        aria-labelledby="membros-titulo"
        selectionMode="multiple"
        selected={selecionados}
        onSelectedChange={setSelecionados}
      >
        {equipe.map((membro) => (
          <ListViewItem
            key={membro.id}
            id={membro.id}
            icon={<Avatar name={membro.nome} size="sm" alt="" />}
            description={membro.funcao}
            disabled={membro.expirado}
            actions={
              <Dropdown
                trigger={
                  <IconButton
                    size="sm"
                    icon="more-horizontal"
                    label={`Ações de ${membro.nome}`}
                    disabled={membro.expirado}
                  />
                }
              >
                <DropdownItem icon="user">Ver perfil</DropdownItem>
                <DropdownItem icon="edit">Alterar função</DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon="trash" tone="danger" onSelect={() => remover([membro.id])}>
                  Remover da equipe
                </DropdownItem>
              </Dropdown>
            }
          >
            {membro.nome}
          </ListViewItem>
        ))}
      </ListView>
    </div>
  )
}
```

### Integrações

onAction abre os detalhes num Drawer (Enter ou clique na linha). Sem seleção, a lista é navegação + ação; o status fica no slot actions.

```tsx
import { Badge, Button, Drawer, Icon, ListView, ListViewItem, type IconName } from '@orangesys/ui'
import { useState } from 'react'

interface Integracao {
  id: string
  nome: string
  descricao: string
  icone: IconName
  conectada: boolean
  permissoes: string
}

const integracoes: Integracao[] = [
  {
    id: 'slack',
    nome: 'Slack',
    descricao: 'Avisos de deploy e incidentes no canal #engenharia',
    icone: 'send',
    conectada: true,
    permissoes: 'Publicar mensagens em canais escolhidos pela equipe.',
  },
  {
    id: 'github',
    nome: 'GitHub',
    descricao: 'Vincula pull requests às tarefas do projeto',
    icone: 'code',
    conectada: true,
    permissoes: 'Ler repositórios e status de pull requests.',
  },
  {
    id: 'drive',
    nome: 'Google Drive',
    descricao: 'Anexa documentos e planilhas às tarefas',
    icone: 'folder',
    conectada: false,
    permissoes: 'Ler os arquivos que você escolher ao anexar.',
  },
  {
    id: 'agenda',
    nome: 'Agenda',
    descricao: 'Cria eventos a partir dos prazos das entregas',
    icone: 'calendar',
    conectada: false,
    permissoes: 'Criar e editar eventos na agenda da equipe.',
  },
]

export default function Integrations() {
  const [aberta, setAberta] = useState(false)
  const [atual, setAtual] = useState(integracoes[0])

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <ListView
        aria-label="Integrações"
        onAction={(id) => {
          setAtual(integracoes.find((item) => item.id === id) ?? integracoes[0])
          setAberta(true)
        }}
      >
        {integracoes.map((item) => (
          <ListViewItem
            key={item.id}
            id={item.id}
            icon={<Icon name={item.icone} />}
            description={item.descricao}
            actions={
              <Badge tone={item.conectada ? 'success' : 'neutral'}>
                {item.conectada ? 'Conectada' : 'Desconectada'}
              </Badge>
            }
          >
            {item.nome}
          </ListViewItem>
        ))}
      </ListView>
      <Drawer
        open={aberta}
        onOpenChange={setAberta}
        title={atual.nome}
        description={atual.descricao}
        footer={({ close }) => (
          <>
            <Button variant="outline" onClick={close}>
              Fechar
            </Button>
            <Button onClick={close}>{atual.conectada ? 'Desconectar' : 'Conectar'}</Button>
          </>
        )}
      >
        <p style={{ marginTop: 0 }}>
          <strong>Status:</strong> {atual.conectada ? 'conectada' : 'desconectada'}
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Permissões:</strong> {atual.permissoes}
        </p>
      </Drawer>
    </div>
  )
}
```

### Estado vazio

emptyState aparece quando não há itens — aqui, com um EmptyState compacto e uma ação para limpar a busca. Lista compacta (size="sm") com seleção única.

```tsx
import { Button, EmptyState, Icon, ListView, ListViewItem, Search } from '@orangesys/ui'
import { useState } from 'react'

const arquivos = [
  { id: 'briefing', nome: 'Briefing da campanha.pdf', detalhe: 'Atualizado hoje · 2,4 MB' },
  { id: 'cronograma', nome: 'Cronograma de entregas.xlsx', detalhe: 'Atualizado ontem · 380 KB' },
  { id: 'roteiro', nome: 'Roteiro do vídeo.docx', detalhe: 'Atualizado há 3 dias · 96 KB' },
  { id: 'logotipo', nome: 'Logotipo vetorizado.svg', detalhe: 'Atualizado há 1 semana · 48 KB' },
]

const normalizar = (texto: string) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export default function Empty() {
  const [busca, setBusca] = useState('contrato')
  const visiveis = arquivos.filter((arquivo) =>
    normalizar(arquivo.nome).includes(normalizar(busca.trim())),
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, width: '100%', maxWidth: 560 }}>
      <Search
        label="Buscar arquivos do projeto"
        placeholder="Buscar arquivos…"
        value={busca}
        onChange={setBusca}
      />
      <ListView
        aria-label="Arquivos do projeto"
        size="sm"
        selectionMode="single"
        emptyState={
          <EmptyState
            variant="compact"
            headingLevel={4}
            icon="search"
            title="Nenhum arquivo encontrado"
            description={`Nada corresponde a "${busca}". Confira a grafia ou limpe a busca.`}
            action={
              <Button size="sm" variant="outline" onClick={() => setBusca('')}>
                Limpar busca
              </Button>
            }
          />
        }
      >
        {visiveis.map((arquivo) => (
          <ListViewItem
            key={arquivo.id}
            id={arquivo.id}
            icon={<Icon name="file" size="sm" />}
            description={arquivo.detalhe}
          >
            {arquivo.nome}
          </ListViewItem>
        ))}
      </ListView>
    </div>
  )
}
```

## Props

### `ListView`

Lista interativa de linhas com seleção e ações (padrão Grid do WAI-ARIA APG
usado como lista de uma coluna): membros, arquivos, integrações,
configurações. Cada linha tem visual à esquerda, título, descrição e ações.
Só uma parada de Tab para a lista inteira: setas navegam entre as linhas e
→ / ← entram nas ações. Para listas estáticas use `List`; para escolher
valores de formulário, `Listbox`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Os `<ListViewItem>`. |
| `defaultSelected` | `string[]` | — | Ids selecionados inicialmente (não controlado). |
| `emptyState` | `ReactNode` | — | Conteúdo exibido quando não há itens. Padrão: "Nenhum resultado encontrado". |
| `onAction` | `((id: string) => void)` | — | Ação principal da linha (abrir detalhes, navegar), chamada com o `id` do item ao pressionar Enter ou clicar no fundo da linha. Com ela, a seleção fica com Espaço e com a caixa de seleção. |
| `onSelectedChange` | `((selected: string[]) => void)` | — | Chamado com os ids selecionados, na ordem das linhas, sempre que a seleção muda. |
| `selected` | `string[]` | — | Ids selecionados (controlado), na ordem das linhas. |
| `selectionMode` | `"single" \| "multiple" \| "none"` | `none` | `none` (padrão, só navegação e ações), `single` (selecionar outra linha substitui; a selecionada continua selecionada) ou `multiple` (alterna, com caixas de seleção). |
| `size` | `"sm" \| "md"` | `md` | Densidade das linhas: `sm` (40px) ou `md` (56px, padrão). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `ListViewItem`

Uma linha do `ListView` (`role="row"` com uma `gridcell`). Slots: `icon` à
esquerda, `children` (título) e `description` no meio, `actions` à direita.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `id` (obrigatória) | `string` | — | Identificador único na lista. É o valor usado em `selected` e `onAction`. |
| `actions` | `ReactNode` | — | Conteúdo à direita: ações (`IconButton`, `Dropdown`) ou status (`Badge`). Alcançado com → / ←, fora da ordem de Tab. |
| `children` | `ReactNode` | — | Conteúdo principal (título da linha). Dá o nome acessível da linha. |
| `description` | `ReactNode` | — | Texto secundário abaixo do título (função, status, metadados). Ligado por `aria-describedby`. |
| `disabled` | `boolean` | `false` | Linha desabilitada: continua focável (como no `Listbox` e no `TreeView`), mas não pode ser selecionada nem dispara `onAction`. Desabilite também as `actions`. |
| `icon` | `ReactNode` | — | Visual à esquerda: ícone, avatar ou logotipo. Decorativo (`aria-hidden`). |
| `textValue` | `string` | — | Texto da busca por digitação e nome acessível quando `children` não tem texto. Padrão: o texto de `children`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ListViewSelectionMode`:

```ts
export type ListViewSelectionMode = 'none' | 'single' | 'multiple'
```

`ListViewSize`:

```ts
export type ListViewSize = 'sm' | 'md'
```

## Movimento

- **Hover e foco** — Mesma resposta: fundo da linha — 160ms, ease-out. O contorno de foco aparece na hora.
- **Pressionar** — O fundo escurece um tom em 90ms (a linha não afunda, para não quebrar os separadores).
- **Seleção** — A barra laranja cresce do centro — 250ms, ease-spring; o check entra com "pop" — 250ms, ease-bounce.
- **Movimento reduzido** — Todas as transições são instantâneas.

## Acessibilidade

Segue o padrão *Grid* do WAI-ARIA APG usado como lista de uma coluna (como o GridList do React Aria): `role="grid"` com `aria-multiselectable` na seleção múltipla, linhas `role="row"` com `aria-selected` (quando selecionáveis) e `aria-disabled`, conteúdo numa `role="gridcell"`. O nome da linha vem só do título (`aria-labelledby`) e a descrição chega por `aria-describedby` — as ações não entram no nome.

Só uma linha fica na ordem de tabulação (roving tabindex); botões, menus e caixas de seleção dentro das linhas recebem `tabindex="-1"` e são alcançados com → / ←. Ao voltar à lista, o foco retorna à última linha visitada ou à primeira selecionada. Se a linha focada for removida, o foco vai para a vizinha. Linhas desabilitadas continuam focáveis, como no Listbox e no TreeView, para que o leitor de tela anuncie o item e o motivo. Na seleção múltipla, o indicador de cada linha é um checkbox real ("Selecionar" + título) — um radio na seleção única com `onAction` — e Ctrl + A anuncia a contagem de selecionados numa região `role="status"`.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra na lista (uma única parada) ou sai dela, inclusive de dentro das ações. |
| `↓ / ↑` | Próxima / anterior linha, inclusive as desabilitadas. Não dá a volta. Também funciona a partir de uma ação. |
| `Home / End` | Primeira / última linha (mesmo desabilitada). |
| `PageUp / PageDown` | Sobe / desce uma "página" (a altura da lista, se ela rola, ou da janela). |
| `→` | Na linha: vai à caixa de seleção ou à primeira ação. Numa ação: próxima ação; depois da última, volta à linha. |
| `←` | Na linha: vai à última ação. Numa ação: ação anterior; antes da primeira, volta à linha. |
| `Space` | Seleciona a linha (única: substitui a seleção; a já selecionada continua selecionada) ou alterna a seleção (múltipla). Sem seleção, chama onAction(id). Nada acontece numa linha desabilitada. |
| `Enter` | Chama onAction(id) com o id do item; sem onAction, seleciona como o Espaço. Nada acontece numa linha desabilitada. |
| `Shift` + `↓ / ↑` | Seleção múltipla: estende a seleção da linha focada até a próxima/anterior (voltar encolhe a faixa; linhas desabilitadas ficam de fora). |
| `Ctrl` + `Shift` + `Home / End` | Seleção múltipla: estende a seleção até a primeira / última linha. |
| `Ctrl / ⌘` + `A` | Seleção múltipla: seleciona todas as linhas habilitadas (ou limpa, se todas já estiverem). |
| `a–z` | Busca por digitação: foca a próxima linha (inclusive desabilitada) cujo título ou textValue começa com o texto, ignorando acentos. |

Dentro de uma ação, Espaço, Enter e as letras ficam com o próprio controle, e controles que usam as setas para si têm prioridade — o gatilho de um Dropdown abre o menu com ↓. Shift + clique para selecionar faixas não é suportado: use Shift + setas ou as caixas de seleção.

- **1.3.1** — Estrutura, seleção e estado desabilitado expostos com papéis e atributos ARIA.
- **1.4.1** — Seleção indicada por fundo, barra lateral, título em negrito e caixa marcada — não só por cor.
- **1.4.10** — A 320px título e descrição quebram linha e as ações continuam visíveis, sem rolagem horizontal.
- **2.1.1** — Navegação, seleção, ação e as ações internas disponíveis pelo teclado.
- **2.4.3** — Uma parada de Tab para a lista; o foco não se perde ao remover a linha focada.
- **2.4.7** — Foco visível na linha e em cada ação; em alto contraste, seleção e foco usam cores do sistema.
- **2.5.8** — Indicador de seleção (checkbox ou radio) com alvo de 24×24px.
- **4.1.2** — Cada linha tem nome (só o título), descrição e estados (aria-selected, aria-disabled) atualizados; os indicadores têm nome "Selecionar + título".
