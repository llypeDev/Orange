# Kbd

Representa teclas e atalhos de teclado, com combinações e símbolos do macOS acessíveis.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Kbd } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/kbd (em inglês: https://orange.llypedev.com.br/en/components/kbd)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-kbd--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Kbd

## Boas práticas

- Use Kbd para ensinar atalhos em textos de ajuda, menus, dicas e listas de atalhos — não como botão.
- Prefira `keys` a escrever "Ctrl+K" à mão: cada tecla vira um `<kbd>` e o leitor de tela entende a combinação.
- Mostre o atalho do sistema do usuário. Use `Mod` (Ctrl ou ⌘) com `symbols` para alternar entre Windows/Linux e macOS.

## Teclas reconhecidas

- **Mod** — Ctrl — ou ⌘ (Command) com symbols.
- **Meta, Cmd** — Cmd — ou ⌘ (Command).
- **Ctrl, Alt, Shift** — Com symbols: ⌃ (Control), ⌥ (Option), ⇧ (Shift).
- **Enter, Backspace, Delete, Tab** — Com symbols: ↵ ⌫ ⌦ ⇥.
- **ArrowUp, ArrowDown, ArrowLeft, ArrowRight** — Sempre setas (↑ ↓ ← →), com nome traduzido ("Seta para cima").
- **Esc, Space** — Esc e "Espaço"/"Space" conforme o idioma.

## Exemplos

### No texto

Kbd acompanha a linha de base do texto. Teclas simples podem ser passadas como children.

```tsx
import { Kbd } from '@orangesys/ui'

export default function InText() {
  return (
    <p style={{ margin: 0, maxWidth: '60ch', lineHeight: 1.8 }}>
      Pressione <Kbd keys={['Ctrl', 'K']} /> para abrir a busca, <Kbd>/</Kbd> para filtrar a lista e <Kbd>Esc</Kbd>{' '}
      para fechar qualquer janela.
    </p>
  )
}
```

### Combinações

keys gera um <kbd> por tecla, com "+" entre elas. separator troca o separador; size="sm" para espaços apertados.

```tsx
import { Kbd } from '@orangesys/ui'

export default function Combinations() {
  return (
    <>
      <Kbd keys={['Ctrl', 'Shift', 'P']} />
      <Kbd keys={['Alt', 'Tab']} />
      <Kbd keys={['Ctrl', 'Enter']} />
      <Kbd keys={['Shift', 'Space']} />
      <Kbd keys={['ArrowUp', 'ArrowDown']} separator="/" />
      <Kbd keys={['Ctrl', 'Z']} size="sm" />
    </>
  )
}
```

### Símbolos do macOS

Com symbols, modificadores viram ⌘ ⌥ ⇧ ⌃. Cada símbolo tem o nome da tecla em texto oculto e no title.

```tsx
import { Kbd } from '@orangesys/ui'

export default function MacSymbols() {
  return (
    <>
      {/* "Mod" vira ⌘ com symbols e Ctrl sem eles */}
      <Kbd keys={['Mod', 'K']} symbols />
      <Kbd keys={['Mod', 'Shift', 'P']} symbols separator="" />
      <Kbd keys={['Alt', 'Backspace']} symbols />
      <Kbd keys={['Ctrl', 'Tab']} symbols />
      <Kbd keys={['Mod', 'Enter']} symbols separator="" />
    </>
  )
}
```

### Teclas pressionadas

pressed aceita true ou uma lista de teclas. Clique no campo e pressione Shift + N: cada tecla afunda enquanto está pressionada.

```tsx
import { Kbd } from '@orangesys/ui'
import { useState, type KeyboardEvent } from 'react'

export default function Pressed() {
  const [down, setDown] = useState<string[]>([])
  const press = (event: KeyboardEvent) => setDown((keys) => Array.from(new Set([...keys, event.key.toLowerCase()])))
  const release = (event: KeyboardEvent) => setDown((keys) => keys.filter((k) => k !== event.key.toLowerCase()))
  const done = down.includes('shift') && down.includes('n')

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <input
        readOnly
        aria-label="Campo de treino de atalho"
        placeholder="Clique aqui e pressione Shift + N"
        onKeyDown={press}
        onKeyUp={release}
        onBlur={() => setDown([])}
        style={{
          padding: '10px 12px',
          border: '1px solid var(--or-color-border-strong)',
          background: 'var(--or-color-surface)',
          color: 'var(--or-color-text)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Kbd keys={['Shift', 'N']} pressed={down} />
        <span role="status" style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-subtle)' }}>
          {done ? 'Novo pedido criado!' : 'Novo pedido'}
        </span>
      </div>
      <p style={{ margin: 0, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Kbd pressed>Esc</Kbd>
        <span style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-subtle)' }}>pressed fixo</span>
      </p>
    </div>
  )
}
```

### Lista de atalhos

Uma tabela de atalhos que alterna entre Windows/Linux e macOS com o mesmo array de teclas.

```tsx
import { Chip, ChipGroup, Kbd, Table, type TableColumn } from '@orangesys/ui'
import { useState } from 'react'

interface Shortcut {
  id: string
  action: string
  keys: string[]
  /** Teclas alternativas (ex.: ↑ ou ↓) usam "/" em vez de "+". */
  alternatives?: boolean
}

const shortcuts: Shortcut[] = [
  { id: 'busca', action: 'Abrir a busca', keys: ['Mod', 'K'] },
  { id: 'novo', action: 'Novo pedido', keys: ['Mod', 'Shift', 'N'] },
  { id: 'salvar', action: 'Salvar rascunho', keys: ['Mod', 'S'] },
  { id: 'enviar', action: 'Enviar comentário', keys: ['Mod', 'Enter'] },
  { id: 'navegar', action: 'Navegar na lista', keys: ['ArrowUp', 'ArrowDown'], alternatives: true },
  { id: 'fechar', action: 'Fechar painel', keys: ['Esc'] },
]

export default function ShortcutList() {
  const [platform, setPlatform] = useState<string | null>('windows')
  const mac = platform === 'mac'

  const columns: TableColumn<Shortcut>[] = [
    { key: 'action', header: 'Ação', rowHeader: true },
    {
      key: 'keys',
      header: 'Atalho',
      align: 'end',
      render: (s) => <Kbd keys={s.keys} symbols={mac} separator={s.alternatives ? '/' : mac ? '' : '+'} />,
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 520 }}>
      <ChipGroup selectionMode="single" label="Sistema" value={platform} onChange={(v) => v && setPlatform(v)} size="sm">
        <Chip value="windows">Windows e Linux</Chip>
        <Chip value="mac">macOS</Chip>
      </ChipGroup>
      <Table caption="Atalhos de teclado" hideCaption columns={columns} data={shortcuts} density="compact" />
    </div>
  )
}
```

## Movimento

- **pressed** — A tecla desce 1px e a sombra inferior some (a borda de 2px vira 1px), com fundo laranja suave. --or-duration-press (90ms).
- **Soltar** — Volta à posição com --or-ease-bounce em --or-duration-fast (160ms).

## Props

### `Kbd`

Representa teclas e atalhos de teclado (`<kbd>`). Use `keys` para
combinações; símbolos do macOS ganham nomes acessíveis.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `keys` | `string[]` | — | Combinação de teclas: `['Ctrl', 'K']`. Nomes reconhecidos: `Mod` (Ctrl ou ⌘), `Meta`/`Cmd`, `Ctrl`, `Alt`/`Option`, `Shift`, `Enter`, `Backspace`, `Delete`, `Esc`, `Tab`, `Space`, `ArrowUp`/`Down`/`Left`/`Right`. |
| `pressed` | `boolean \| string[]` | `false` | Mostra teclas pressionadas (a tecla "afunda"): `true` para todas ou uma lista de nomes (`['Ctrl']`). Útil para demonstrar atalhos. |
| `separator` | `ReactNode` | `+` | Separador visual entre as teclas. Padrão: `+`. |
| `size` | `"sm" \| "md"` | `md` | Tamanho: `sm` (20px) ou `md` (24px, padrão). |
| `symbols` | `boolean` | `false` | Usa os símbolos do macOS (⌘ ⌥ ⇧ ⌃), com rótulos acessíveis. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue a recomendação do HTML para entradas de teclado: a combinação é um `<kbd>` que contém um `<kbd>` por tecla. Símbolos como ⌘ não têm pronúncia confiável, então o símbolo fica oculto (`aria-hidden`) e o nome da tecla ("Command") é lido no lugar. Nomes de setas e da barra de espaço vêm de `useLocale().t()`.

- **1.1.1** — Símbolos têm alternativa em texto.
- **1.3.1** — Semântica de entrada de teclado com <kbd> aninhados.
- **1.4.3** — Contraste de texto mínimo de 4.5:1 nos dois temas.
