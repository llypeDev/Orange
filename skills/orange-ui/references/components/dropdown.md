# Dropdown

Menu de ações aberto por um botão, com itens, opções marcáveis, grupos e navegação completa por teclado.

- Categoria: Sobreposições · Status: estável
- Importação: `import { Dropdown, DropdownCheckboxItem, DropdownItem, DropdownLabel, DropdownRadioGroup, DropdownRadioItem, DropdownSeparator } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/dropdown (em inglês: https://orange.llypedev.com.br/en/components/dropdown)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-dropdown--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Dropdown

## Boas práticas

- Use para agrupar ações secundárias de um objeto (projeto, linha da tabela, arquivo) e economizar espaço. A ação mais comum deve continuar visível como botão.
- Itens começam com verbo e são curtos. Termine com reticências (…) quando a ação abre outra etapa, como um diálogo.
- Ações destrutivas ficam no fim, depois de um `DropdownSeparator`, com `tone="danger"` — e pedem confirmação.
- Para escolher um valor de formulário, use Select ou Combobox; o Dropdown é para ações e preferências de visualização.

## Partes

- **DropdownItem** — Ação (`menuitem`) com ícone, atalho e `tone="danger"` opcionais.
- **DropdownCheckboxItem** — Opção liga/desliga (`menuitemcheckbox`). Não fecha o menu.
- **DropdownRadioGroup + DropdownRadioItem** — Opções exclusivas (`menuitemradio`) num grupo rotulado.
- **DropdownSeparator** — Divide grupos de itens.
- **DropdownLabel** — Título não interativo de uma seção.

## Exemplos

### Menu de ações

Ícones, atalhos, item desabilitado e ação destrutiva. Experimente ↓, letras e Enter.

```tsx
import { Button, Dropdown, DropdownItem, DropdownLabel, DropdownSeparator, Icon, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Actions() {
  const [ultima, setUltima] = useState('nenhuma')

  return (
    <Stack gap={4} direction="horizontal" align="center" wrap>
      <Dropdown
        trigger={
          <Button variant="outline" endIcon={<Icon name="chevron-down" />}>
            Ações
          </Button>
        }
      >
        <DropdownLabel>Projeto</DropdownLabel>
        <DropdownItem icon="edit" shortcut="F2" onSelect={() => setUltima('Renomear')}>
          Renomear
        </DropdownItem>
        <DropdownItem icon="copy" shortcut="Ctrl D" onSelect={() => setUltima('Duplicar')}>
          Duplicar
        </DropdownItem>
        <DropdownItem icon="folder" onSelect={() => setUltima('Mover para…')}>
          Mover para…
        </DropdownItem>
        <DropdownItem icon="download" disabled>
          Exportar (plano Pro)
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon="trash" tone="danger" onSelect={() => setUltima('Excluir')}>
          Excluir
        </DropdownItem>
      </Dropdown>
      <span>Última ação: {ultima}</span>
    </Stack>
  )
}
```

### Opções de visualização

Checkboxes mantêm o menu aberto para marcar vários; o grupo de rádio fecha ao escolher (ajustável com closeOnSelect).

```tsx
import {
  Button,
  Dropdown,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  Icon, Stack,
} from '@orangesys/ui'
import { useState } from 'react'

const rotulos: Record<string, string> = { recentes: 'mais recentes', prazo: 'prazo', nome: 'nome' }

export default function Options() {
  const [concluidas, setConcluidas] = useState(true)
  const [arquivadas, setArquivadas] = useState(false)
  const [ordem, setOrdem] = useState('recentes')

  return (
    <Stack gap={4} direction="horizontal" align="center" wrap>
      <Dropdown
        trigger={
          <Button variant="outline" startIcon={<Icon name="sliders" />}>
            Exibir
          </Button>
        }
      >
        <DropdownCheckboxItem checked={concluidas} onCheckedChange={setConcluidas}>
          Tarefas concluídas
        </DropdownCheckboxItem>
        <DropdownCheckboxItem checked={arquivadas} onCheckedChange={setArquivadas}>
          Tarefas arquivadas
        </DropdownCheckboxItem>
        <DropdownSeparator />
        <DropdownRadioGroup label="Ordenar por" value={ordem} onChange={setOrdem}>
          <DropdownRadioItem value="recentes">Mais recentes</DropdownRadioItem>
          <DropdownRadioItem value="prazo">Prazo</DropdownRadioItem>
          <DropdownRadioItem value="nome">Nome</DropdownRadioItem>
        </DropdownRadioGroup>
      </Dropdown>
      <span>
        {[concluidas && 'concluídas', arquivadas && 'arquivadas'].filter(Boolean).join(' e ') ||
          'só abertas'}
        , por {rotulos[ordem]}
      </span>
    </Stack>
  )
}
```

### Ações por linha

Gatilho só com ícone (com aria-label específico) alinhado ao fim com placement="bottom-end".

```tsx
import { Button, Dropdown, DropdownItem, DropdownSeparator, Icon } from '@orangesys/ui'

const arquivos = [
  { nome: 'proposta-comercial.pdf', detalhe: '2,4 MB · editado hoje' },
  { nome: 'cronograma-q2.xlsx', detalhe: '880 KB · editado ontem' },
]

export default function RowActions() {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', maxWidth: 480 }}>
      {arquivos.map((arquivo) => (
        <li
          key={arquivo.nome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 8px 8px 12px',
            borderBottom: '1px solid var(--or-color-border)',
          }}
        >
          <Icon name="file" />
          <span style={{ flex: 1, display: 'grid' }}>
            <span>{arquivo.nome}</span>
            <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>
              {arquivo.detalhe}
            </span>
          </span>
          <Dropdown
            placement="bottom-end"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Ações de ${arquivo.nome}`}
                startIcon={<Icon name="more-horizontal" />}
              />
            }
          >
            <DropdownItem icon="external-link">Abrir</DropdownItem>
            <DropdownItem icon="download">Baixar</DropdownItem>
            <DropdownItem icon="link">Copiar link</DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon="trash" tone="danger">
              Excluir
            </DropdownItem>
          </Dropdown>
        </li>
      ))}
    </ul>
  )
}
```

### Abrindo uma confirmação

Ao escolher um item, o foco volta ao gatilho antes da ação rodar — então o diálogo aberto por ela devolve o foco ao lugar certo.

```tsx
import { Button, ConfirmDialog, Dropdown, DropdownItem, DropdownSeparator, Icon, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function WithConfirm() {
  const [confirmar, setConfirmar] = useState(false)
  const [ativo, setAtivo] = useState(true)

  return (
    <Stack gap={4} direction="horizontal" align="center">
      <span>Webhook de pedidos: {ativo ? 'ativo' : 'removido'}</span>
      {!ativo && (
        <Button variant="ghost" size="sm" onClick={() => setAtivo(true)}>
          Recriar
        </Button>
      )}
      <Dropdown
        trigger={
          <Button variant="outline" size="sm" endIcon={<Icon name="chevron-down" />}>
            Gerenciar
          </Button>
        }
      >
        <DropdownItem icon="refresh" disabled={!ativo}>
          Reenviar último evento
        </DropdownItem>
        <DropdownItem icon="edit" disabled={!ativo}>
          Editar URL
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          icon="trash"
          tone="danger"
          disabled={!ativo}
          onSelect={() => setConfirmar(true)}
        >
          Remover webhook…
        </DropdownItem>
      </Dropdown>
      <ConfirmDialog
        open={confirmar}
        onOpenChange={setConfirmar}
        tone="danger"
        title="Remover o webhook de pedidos?"
        description="Seu sistema deixa de receber notificações de novos pedidos."
        confirmLabel="Remover webhook"
        onConfirm={() => setAtivo(false)}
      />
    </Stack>
  )
}
```

## Movimento

- **Abrir** — Opacidade + 6px vindo do gatilho. 160ms (--or-duration-fast), --or-ease-out.
- **Fechar** — Recua para o gatilho em 80ms (--or-duration-instant); inerte durante a saída.
- **Item em foco** — Fundo muda em 160ms e a barra laranja cresce do centro (scaleY). Mesmo efeito no hover e no teclado.
- **Pressionar item** — Afunda 1px. 90ms (--or-duration-press).
- **Check e rádio** — O indicador entra com or-scale-in (160ms, --or-ease-bounce) quando o estado muda — não ao abrir o menu.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `Dropdown`

Menu de ações aberto por um botão (padrão "menu button" do WAI-ARIA):
setas navegam, letras buscam, Enter/Espaço ativam, Escape fecha.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` (obrigatória) | `ReactNode` | — | Itens: `DropdownItem`, `DropdownCheckboxItem`, `DropdownRadioGroup`, `DropdownSeparator`, `DropdownLabel`. |
| `trigger` (obrigatória) | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Botão que abre o menu. Recebe `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` e a navegação por teclado. |
| `defaultOpen` | `boolean` | — | Aberto inicialmente (não controlado). |
| `offset` | `number` | `4` | Distância do gatilho, em px. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o menu pede para abrir ou fechar. |
| `open` | `boolean` | — | Aberto (controlado). Use com `onOpenChange`. |
| `placement` | `"bottom" \| "top" \| "left" \| "right" \| "bottom-start" \| "bottom-end" \| "top-start" \| "top-end" \| "left-start" \| "left-end" \| "right-start" \| "right-end"` | `bottom-start` | Posição preferida; inverte sozinha se faltar espaço. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DropdownCheckboxItem`

Opção liga/desliga do menu (`role="menuitemcheckbox"`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Marcado (controlado). |
| `closeOnSelect` | `boolean` | `true` | Fecha o menu ao alternar. Padrão: `false` (permite marcar vários). |
| `defaultChecked` | `boolean` | `false` | Marcado inicialmente (não controlado). |
| `disabled` | `boolean` | — | — |
| `onCheckedChange` | `((checked: boolean) => void)` | — | Chamado com o novo estado. |
| `shortcut` | `string` | — | Atalho exibido à direita (apenas visual). |
| `textValue` | `string` | — | — |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DropdownItem`

Item de ação do menu (`role="menuitem"`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `closeOnSelect` | `boolean` | `true` | Fecha o menu ao ativar. Padrão: `true`. |
| `disabled` | `boolean` | — | Visível e focável, mas não pode ser ativado. |
| `icon` | `IconName \| ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Ícone à esquerda: nome da biblioteca do Orange ou um elemento. |
| `onSelect` | `((event: SyntheticEvent<HTMLDivElement, Event>) => void)` | — | Executado ao ativar o item (clique, Enter ou Espaço). |
| `shortcut` | `string` | — | Atalho de teclado exibido à direita (apenas visual — implemente o atalho à parte). |
| `textValue` | `string` | — | Texto usado pelo typeahead quando o conteúdo não é texto simples. |
| `tone` | `"neutral" \| "danger"` | `neutral` | `danger` para ações destrutivas. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DropdownLabel`

Título não interativo de uma seção do menu.

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DropdownRadioGroup`

Grupo de opções exclusivas (`role="group"` com `menuitemradio`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultValue` | `string` | — | Valor selecionado inicialmente (não controlado). |
| `label` | `ReactNode` | — | Rótulo visível do grupo (ex.: "Ordenar por"). Também nomeia o grupo. |
| `onChange` | `((value: string) => void)` | — | Chamado com o novo valor. |
| `value` | `string` | — | Valor selecionado (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DropdownRadioItem`

Opção exclusiva dentro de `DropdownRadioGroup` (`role="menuitemradio"`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` (obrigatória) | `string` | — | Valor desta opção dentro do `DropdownRadioGroup`. |
| `closeOnSelect` | `boolean` | `true` | Fecha o menu ao escolher. Padrão: `true`. |
| `disabled` | `boolean` | — | — |
| `textValue` | `string` | — | — |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DropdownSeparator`

Linha divisória entre grupos de itens (`role="separator"`).

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`DropdownPlacement`:

```ts
export type DropdownPlacement = FloatingPlacement
```

## Acessibilidade

Segue o padrão *Menu Button* do WAI-ARIA APG. O gatilho tem `aria-haspopup="menu"`, `aria-expanded` e `aria-controls`; o menu tem `role="menu"` rotulado pelo gatilho e itens `menuitem`, `menuitemcheckbox` e `menuitemradio` com `aria-checked`. O foco percorre os itens de verdade (não só visualmente) e volta ao gatilho ao fechar.

| Teclas | Ação |
| --- | --- |
| `Enter` | No gatilho: abre e foca o primeiro item. No item: ativa. |
| `Space` | No gatilho: abre. No item: ativa (checkbox alterna sem fechar). |
| `↓` | No gatilho: abre no primeiro item. No menu: próximo item (circula). |
| `↑` | No gatilho: abre no último item. No menu: item anterior (circula). |
| `Home` | Primeiro item. |
| `End` | Último item. |
| `A–Z` | Foca o próximo item que começa com as letras digitadas. |
| `Esc` | Fecha e devolve o foco ao gatilho. |
| `Tab` | Fecha e segue para o próximo elemento da página. |

- **1.3.1** — Grupos, separadores e estados marcados expostos por papéis ARIA.
- **2.1.1** — Todas as ações acessíveis por teclado, incluindo busca por letra.
- **2.4.3** — Foco volta ao gatilho ao fechar ou escolher um item.
- **2.4.7** — Item focado destacado com fundo e barra laranja.
- **4.1.2** — Estado do menu exposto por aria-expanded; itens desabilitados por aria-disabled.
