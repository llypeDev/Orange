# ContextMenu

Menu aberto com o botão direito (ou Shift+F10) sobre uma área, posicionado no ponteiro, com a navegação do Dropdown.

- Categoria: Sobreposições · Status: estável
- Importação: `import { ContextMenu } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/context-menu (em inglês: https://orange.llypedev.com.br/en/components/context-menu)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-contextmenu--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ContextMenu

## Boas práticas

- O menu de contexto é um atalho, nunca o único caminho: toda ação dele também precisa estar disponível de forma visível (botão, Dropdown de "Mais ações").
- Mostre só ações relacionadas ao que está sob o ponteiro — um arquivo, uma linha, o quadro — e mantenha a lista curta.
- Torne a área focável (`tabIndex=0` ou um elemento focável dentro dela) para que Shift+F10 e a tecla Menu funcionem.
- Usa as mesmas partes do Dropdown: `DropdownItem`, `DropdownCheckboxItem`, `DropdownRadioGroup`, `DropdownSeparator` e `DropdownLabel`.

## Exemplos

### Lista de arquivos

Cada linha tem seu próprio menu, nomeado com aria-label. Ao escolher um item, o foco volta para a linha.

```tsx
import { ContextMenu, DropdownItem, DropdownSeparator, Icon } from '@orangesys/ui'
import { useState } from 'react'

const arquivosIniciais = ['briefing-campanha.pdf', 'fotos-evento.zip', 'orcamento-2026.xlsx']

export default function Files() {
  const [arquivos, setArquivos] = useState(arquivosIniciais)
  const [aviso, setAviso] = useState(
    'Clique com o botão direito em um arquivo (ou foque e use Shift+F10).',
  )

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 480 }}>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          border: '1px solid var(--or-color-border)',
        }}
      >
        {arquivos.map((nome) => (
          <li key={nome}>
            <ContextMenu
              aria-label={`Ações de ${nome}`}
              content={
                <>
                  <DropdownItem icon="external-link" onSelect={() => setAviso(`Abrindo ${nome}…`)}>
                    Abrir
                  </DropdownItem>
                  <DropdownItem icon="download" onSelect={() => setAviso(`Baixando ${nome}…`)}>
                    Baixar
                  </DropdownItem>
                  <DropdownItem icon="link" onSelect={() => setAviso(`Link de ${nome} copiado.`)}>
                    Copiar link
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem
                    icon="trash"
                    tone="danger"
                    shortcut="Del"
                    onSelect={() => {
                      setArquivos((lista) => lista.filter((a) => a !== nome))
                      setAviso(`${nome} foi para a lixeira.`)
                    }}
                  >
                    Mover para a lixeira
                  </DropdownItem>
                </>
              }
            >
              <button
                type="button"
                onClick={() => setAviso(`Abrindo ${nome}…`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '10px 12px',
                  border: 0,
                  borderBottom: '1px solid var(--or-color-border)',
                  background: 'transparent',
                  color: 'inherit',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <Icon name="file" />
                {nome}
              </button>
            </ContextMenu>
          </li>
        ))}
      </ul>
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }}>
        {aviso}
      </p>
    </div>
  )
}
```

### Área de trabalho

O menu abre exatamente no ponto do clique e acompanha a área se a página rolar. Inclui uma opção marcável.

```tsx
import {
  ContextMenu,
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from '@orangesys/ui'
import { useState } from 'react'

export default function Canvas() {
  const [notas, setNotas] = useState(1)
  const [grade, setGrade] = useState(true)

  return (
    <ContextMenu
      aria-label="Ações do quadro"
      content={
        <>
          <DropdownLabel>Quadro</DropdownLabel>
          <DropdownItem icon="plus" shortcut="N" onSelect={() => setNotas((n) => n + 1)}>
            Adicionar nota
          </DropdownItem>
          <DropdownItem icon="refresh" disabled={notas === 0} onSelect={() => setNotas(0)}>
            Limpar quadro
          </DropdownItem>
          <DropdownSeparator />
          <DropdownCheckboxItem checked={grade} onCheckedChange={setGrade}>
            Mostrar grade
          </DropdownCheckboxItem>
        </>
      }
    >
      <div
        tabIndex={0}
        role="region"
        aria-label={`Quadro com ${notas} nota${notas === 1 ? '' : 's'}`}
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: 12,
          width: '100%',
          minHeight: 220,
          padding: 16,
          border: '1px dashed var(--or-color-border-strong)',
          backgroundImage: grade
            ? 'radial-gradient(var(--or-color-border-strong) 1px, transparent 1px)'
            : 'none',
          backgroundSize: '16px 16px',
        }}
      >
        {Array.from({ length: notas }, (_, i) => (
          <div
            key={i}
            style={{
              width: 120,
              height: 80,
              padding: 8,
              background: 'var(--or-color-accent-subtle)',
              border: '1px solid var(--or-color-accent-border)',
              fontSize: 13,
            }}
          >
            Nota {i + 1}
          </div>
        ))}
        {notas === 0 && (
          <span style={{ color: 'var(--or-color-text-subtle)' }}>
            Quadro vazio — clique com o botão direito.
          </span>
        )}
      </div>
    </ContextMenu>
  )
}
```

## Movimento

- **Abrir** — Cresce de 96% a partir do canto junto ao ponteiro. 160ms, --or-ease-out.
- **Fechar** — Encolhe para o mesmo canto em 80ms; inerte durante a saída.
- **Itens** — Iguais ao Dropdown: fundo + barra laranja no foco (160ms), afundar ao pressionar (90ms), pop no check/rádio.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `ContextMenu`

Menu aberto com o botão direito sobre uma área, posicionado no ponteiro.
Pelo teclado, abre com Shift+F10 ou a tecla Menu. Mesma semântica e
navegação do Dropdown.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` (obrigatória) | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Área que abre o menu com o botão direito (ou Shift+F10 / tecla Menu quando ela ou algo dentro dela está focado). Um único elemento. |
| `content` (obrigatória) | `ReactNode` | — | Itens do menu — as mesmas partes do Dropdown (`DropdownItem`, `DropdownSeparator`…). |
| `disabled` | `boolean` | `false` | Desliga o menu de contexto (o menu nativo do navegador volta a aparecer). |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o menu abre ou fecha. |
| `open` | `boolean` | — | Aberto (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O painel é um `role="menu"` com a mesma semântica e navegação do Dropdown. Pelo mouse, abre no ponto do clique com o foco no menu; pelo teclado (Shift+F10 ou a tecla Menu), abre junto ao elemento focado com o foco no primeiro item. Ao fechar, o foco volta para onde estava.

| Teclas | Ação |
| --- | --- |
| `Shift` + `F10` | Abre o menu da área focada. |
| `Menu` | Abre o menu (tecla de menu de contexto). |
| `↓` | Próximo item (circula). |
| `↑` | Item anterior (circula). |
| `Home` | Primeiro item. |
| `End` | Último item. |
| `Enter` | Ativa o item focado. |
| `Esc` | Fecha e devolve o foco. |

> **Não esconda ações** Muitas pessoas não sabem que existe um menu de contexto, e leitores de tela não o anunciam. Ofereça as mesmas ações em um controle visível.

- **2.1.1** — Abre e opera inteiramente pelo teclado (Shift+F10 / Menu).
- **2.4.3** — Foco entra no menu ao abrir e volta à origem ao fechar.
- **4.1.2** — Papéis menu/menuitem e nome acessível traduzido.
