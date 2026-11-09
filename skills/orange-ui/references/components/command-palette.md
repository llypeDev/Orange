# CommandPalette

Busca de comandos em um diálogo, aberta por atalho (⌘K / Ctrl+K), para navegar e agir sem tirar as mãos do teclado.

- Categoria: Sobreposições · Status: estável
- Importação: `import { CommandPalette } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/command-palette (em inglês: https://orange.llypedev.com.br/en/components/command-palette)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-commandpalette--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/CommandPalette

## Boas práticas

- A paleta acelera quem já conhece o produto; ela não substitui a navegação visível. Todo comando deve existir também em algum lugar da interface.
- Escreva comandos como ações ("Criar projeto", "Ir para relatórios") e agrupe por intenção: navegar, criar, configurar.
- Use `keywords` para sinônimos ("equipe", "time", "membros") e `description` para desambiguar comandos parecidos. A busca ignora acentos e caixa.
- Registre o atalho global (`hotkey="mod+k"`) em apenas uma paleta por página e mostre-o no gatilho.

## Exemplos

### Paleta de comandos

Clique no botão ou use Ctrl+K / ⌘K. Digite para filtrar, ↑/↓ para escolher e Enter para executar.

```tsx
import { Button, CommandPalette, Icon, type CommandGroup } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [ultimo, setUltimo] = useState('nenhum')

  const executar = (nome: string) => () => setUltimo(nome)

  const grupos: CommandGroup[] = [
    {
      label: 'Navegação',
      items: [
        {
          id: 'inicio',
          label: 'Ir para o painel',
          icon: 'home',
          shortcut: 'G P',
          onSelect: executar('Ir para o painel'),
        },
        {
          id: 'projetos',
          label: 'Ir para projetos',
          icon: 'folder',
          shortcut: 'G R',
          onSelect: executar('Ir para projetos'),
        },
        {
          id: 'configuracoes',
          label: 'Abrir configurações',
          description: 'Conta, notificações e segurança',
          icon: 'sliders',
          onSelect: executar('Abrir configurações'),
        },
      ],
    },
    {
      label: 'Criar',
      items: [
        {
          id: 'projeto',
          label: 'Criar projeto',
          icon: 'plus',
          shortcut: 'C',
          onSelect: executar('Criar projeto'),
        },
        {
          id: 'convidar',
          label: 'Convidar pessoas',
          icon: 'users',
          keywords: ['equipe', 'membros', 'time'],
          onSelect: executar('Convidar pessoas'),
        },
        {
          id: 'importar',
          label: 'Importar planilha',
          description: 'Disponível no plano Pro',
          icon: 'upload',
          disabled: true,
        },
      ],
    },
    {
      label: 'Ajuda',
      items: [
        {
          id: 'atalhos',
          label: 'Ver atalhos de teclado',
          icon: 'keyboard',
          shortcut: '?',
          onSelect: executar('Ver atalhos'),
        },
        {
          id: 'suporte',
          label: 'Falar com o suporte',
          icon: 'mail',
          onSelect: executar('Falar com o suporte'),
        },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <CommandPalette
        groups={grupos}
        hotkey="mod+k"
        trigger={
          <Button variant="outline" startIcon={<Icon name="search" />}>
            Buscar comandos
            <kbd
              style={{
                marginLeft: 12,
                fontFamily: 'var(--or-font-mono)',
                fontSize: 11,
                opacity: 0.7,
              }}
            >
              Ctrl K
            </kbd>
          </Button>
        }
      />
      <span>Último comando: {ultimo}</span>
    </div>
  )
}
```

### Ir para um registro

Um grupo só, com `label`, `placeholder` e `emptyMessage` personalizados. Busque sem acentos.

```tsx
import { Button, CommandPalette, type CommandGroup } from '@orangesys/ui'
import { useState } from 'react'

const clientes = [
  'Açaí da Praça',
  'Café Santa Mônica',
  'Padaria São João',
  'Mercearia Três Irmãos',
  'Ótica Visão Clara',
]

export default function Navigation() {
  const [cliente, setCliente] = useState<string>()

  const grupos: CommandGroup[] = [
    {
      label: 'Clientes',
      items: clientes.map((nome) => ({
        id: nome,
        label: nome,
        icon: 'user',
        onSelect: () => setCliente(nome),
      })),
    },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <CommandPalette
        groups={grupos}
        label="Ir para cliente"
        placeholder="Nome do cliente…"
        emptyMessage="Nenhum cliente com esse nome. Tente sem acentos: “otica”, “sao joao”."
        trigger={<Button variant="outline">Ir para cliente</Button>}
      />
      <span>
        {cliente ? `Abrindo ${cliente}` : 'Busque "sao joao" ou "acai": acentos são ignorados.'}
      </span>
    </div>
  )
}
```

## Movimento

- **Abrir** — Desce 8px com escala 0,98 → 1 em ~200ms (média entre --or-duration-fast e --or-duration-medium), --or-ease-out; fundo em fade.
- **Fechar** — Sobe 4px e some. 160ms, --or-ease-in-out.
- **Item ativo** — Um único destaque desliza até a opção ativa (setas ou ponteiro). 160ms, --or-ease-out. Na abertura ele já aparece no lugar.
- **Filtrar** — Só as opções que reaparecem entram com fade de 160ms; as que continuam na lista não reanimam a cada tecla.
- **Campo de busca** — Sublinhado laranja surge no foco em 160ms.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `CommandPalette`

Paleta de comandos: um diálogo com busca para encontrar e executar ações
pelo teclado. Abre por um gatilho ou por um atalho global como ⌘K.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `groups` (obrigatória) | `CommandGroup[]` | — | Comandos agrupados. |
| `defaultOpen` | `boolean` | — | Aberta inicialmente (não controlado). |
| `emptyMessage` | `ReactNode` | — | Mensagem quando a busca não encontra nada. Padrão: "Nenhum resultado encontrado". |
| `hotkey` | `string` | — | Atalho global que abre/fecha a paleta: `'mod+k'` (⌘K no Mac, Ctrl+K nos demais), `'ctrl+shift+p'`… Desligado por padrão. |
| `label` | `string` | — | Nome acessível da paleta. Padrão: "Paleta de comandos". |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando a paleta pede para abrir ou fechar. |
| `onSelect` | `((item: CommandItem) => void)` | — | Chamado com o comando escolhido (além do `onSelect` do próprio item). |
| `open` | `boolean` | — | Aberta (controlado). Use com `onOpenChange`. |
| `placeholder` | `string` | — | Texto de exemplo do campo de busca. |
| `trigger` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Elemento que abre a paleta (modo não controlado). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

É um diálogo modal com um campo `role="combobox"` (padrão *Combobox* do APG) que controla uma `role="listbox"` com grupos rotulados. O foco fica no campo; o item ativo é indicado por `aria-activedescendant` e `aria-selected`. A quantidade de resultados é anunciada numa região de status e, ao executar um comando, o foco volta para onde estava antes de abrir.

| Teclas | Ação |
| --- | --- |
| `Ctrl` + `K` | Abre ou fecha a paleta (⌘K no Mac), quando hotkey="mod+k". |
| `↓` | Próximo comando (circula, pulando desabilitados). |
| `↑` | Comando anterior. |
| `Page Down` | Último comando. |
| `Page Up` | Primeiro comando. |
| `Enter` | Executa o comando ativo. |
| `Esc` | Fecha e devolve o foco. |

- **1.3.1** — Grupos rotulados e descrições ligadas a cada opção.
- **2.1.1** — Busca, navegação e execução inteiramente pelo teclado.
- **2.1.4** — O atalho global usa modificador (Ctrl/⌘), sem atalhos de uma tecla só.
- **4.1.2** — combobox com aria-expanded, aria-controls e aria-activedescendant.
- **4.1.3** — Total de resultados e "nenhum resultado" anunciados em região de status.
