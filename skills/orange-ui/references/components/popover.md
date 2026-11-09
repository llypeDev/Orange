# Popover

Painel não modal ancorado a um botão, para conteúdo e controles complementares — compartilhar, filtros rápidos, detalhes.

- Categoria: Sobreposições · Status: estável
- Importação: `import { Popover } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/popover (em inglês: https://orange.llypedev.com.br/en/components/popover)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-popover--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Popover

## Boas práticas

- Use para conteúdo complementar e ações rápidas ligadas a um botão. O resto da página continua utilizável enquanto ele está aberto.
- Mantenha curto: um título, poucas linhas e no máximo um pequeno formulário. Se precisar de rolagem ou várias etapas, use um Drawer ou Modal.
- Para um texto curto que explica um ícone, use Tooltip; para uma explicação acionada por clique, Toggletip; para uma lista de ações, Dropdown.
- Dê um nome ao painel: `title` visível ou `aria-label`. Sem nenhum dos dois, ele usa o texto do gatilho.

## Quando usar cada sobreposição

- **Popover** — Conteúdo interativo não modal ancorado a um botão.
- **Tooltip** — Rótulo curto em hover/foco, sem interação.
- **Toggletip** — Explicação curta aberta por clique num ícone de informação.
- **Dropdown** — Lista de ações ou opções com navegação por setas.
- **Modal** — Tarefa que bloqueia a página até ser concluída.

## Exemplos

### Compartilhar

Com título, botão fechar e seta. O foco vai para o primeiro controle ao abrir.

```tsx
import { Button, Icon, Popover, Stack, useClipboard } from '@orangesys/ui'

export default function Share() {
  const { copy, copied } = useClipboard()
  const link = 'https://orange.app/p/site-2026'

  return (
    <Popover
      title="Compartilhar projeto"
      showCloseButton
      arrow
      trigger={
        <Button variant="outline" startIcon={<Icon name="link" />}>
          Compartilhar
        </Button>
      }
    >
      <Stack gap={3} style={{ width: 280 }}>
        <span>Qualquer pessoa com o link pode ver este projeto.</span>
        <code
          style={{
            padding: '6px 8px',
            border: '1px solid var(--or-color-border)',
            fontFamily: 'var(--or-font-mono)',
            fontSize: 12,
            color: 'var(--or-color-text)',
            overflowWrap: 'anywhere',
          }}
        >
          {link}
        </code>
        <Button
          size="sm"
          startIcon={<Icon name={copied ? 'check' : 'copy'} />}
          onClick={() => copy(link)}
        >
          {copied ? 'Link copiado' : 'Copiar link'}
        </Button>
      </Stack>
    </Popover>
  )
}
```

### Edição rápida

`initialFocus` leva o foco direto ao campo; `children` como função recebe `close`, que fecha e devolve o foco ao gatilho.

```tsx
import { Button, Field, Popover, Stack } from '@orangesys/ui'
import { useRef, useState } from 'react'

export default function InlineEdit() {
  const [meta, setMeta] = useState(120)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Stack gap={3} direction="horizontal" align="center">
      <span>
        Meta mensal: <strong>{meta} vendas</strong>
      </span>
      <Popover
        title="Editar meta"
        placement="bottom-start"
        initialFocus={inputRef}
        trigger={
          <Button size="sm" variant="ghost">
            Editar
          </Button>
        }
      >
        {({ close }) => (
          <form
            style={{ display: 'grid', gap: 12, width: 240 }}
            onSubmit={(event) => {
              event.preventDefault()
              const valor = Number(new FormData(event.currentTarget).get('meta'))
              if (valor > 0) setMeta(valor)
              close()
            }}
          >
            <Field label="Vendas por mês" controlId="meta-mensal">
              <input
                ref={inputRef}
                id="meta-mensal"
                name="meta"
                type="number"
                min={1}
                defaultValue={meta}
                className="or-control"
              />
            </Field>
            <Stack gap={2} direction="horizontal" justify="end">
              <Button size="sm" variant="outline" onClick={close}>
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                Salvar
              </Button>
            </Stack>
          </form>
        )}
      </Popover>
    </Stack>
  )
}
```

### Posições

placement aceita top, right, bottom, left e as variações -start/-end. Flip e shift mantêm o painel na tela.

```tsx
import { Button, Popover, type PopoverPlacement } from '@orangesys/ui'

const posicoes: { placement: PopoverPlacement; label: string }[] = [
  { placement: 'top', label: 'Acima' },
  { placement: 'right', label: 'À direita' },
  { placement: 'bottom', label: 'Abaixo' },
  { placement: 'left', label: 'À esquerda' },
]

export default function Placements() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        width: '100%',
        padding: '48px 0',
      }}
    >
      {posicoes.map(({ placement, label }) => (
        <Popover
          key={placement}
          placement={placement}
          arrow
          trigger={<Button variant="outline">{label}</Button>}
        >
          Sem espaço, o painel inverte e desliza sozinho para continuar visível.
        </Popover>
      ))}
    </div>
  )
}
```

### Ajuda contextual

Sem título visível: aria-label nomeia o painel. Diferente do Tooltip, pode conter links.

```tsx
import { Button, Icon, Popover, Stack } from '@orangesys/ui'

export default function Help() {
  return (
    <Stack gap={1} direction="horizontal" align="center">
      <span>Plano Pro</span>
      <Popover
        aria-label="Sobre o plano Pro"
        placement="right"
        arrow
        trigger={
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Sobre o plano Pro"
            startIcon={<Icon name="help-circle" />}
          />
        }
      >
        <p style={{ margin: '0 0 8px' }}>
          Inclui 10 projetos, domínio próprio e suporte prioritário.
        </p>
        <a href="#comparar-planos">Comparar planos</a>
      </Popover>
    </Stack>
  )
}
```

## Movimento

- **Abrir** — Opacidade + 4px vindo do lado do gatilho (acompanha o placement, inclusive após o flip). 250ms, --or-ease-out.
- **Fechar** — Recua 4px em direção ao gatilho e some. 160ms, --or-ease-in-out. Inerte e sem cliques durante a saída.
- **Gatilho e ações** — Botões afundam 1px ao pressionar. 90ms.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `Popover`

Painel não modal ancorado a um gatilho, para conteúdo e controles
complementares (filtros, detalhes, formulários curtos).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `trigger` (obrigatória) | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Elemento que abre o popover (normalmente um `Button`). Recebe `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls`. |
| `arrow` | `boolean` | `false` | Mostra uma seta apontando para o gatilho. |
| `children` | `ReactNode \| ((props: PopoverRenderProps) => ReactNode)` | — | Conteúdo. Aceita uma função `({ close }) => …`. |
| `closeOnOutsideClick` | `boolean` | `true` | Fecha ao clicar fora. |
| `defaultOpen` | `boolean` | — | Aberto inicialmente (não controlado). |
| `initialFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco ao abrir. Padrão: primeiro focável (ou o próprio painel). |
| `offset` | `number` | `8` | Distância do gatilho, em px. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o popover pede para abrir ou fechar. |
| `open` | `boolean` | — | Aberto (controlado). Use com `onOpenChange`. |
| `placement` | `"bottom" \| "top" \| "left" \| "right" \| "bottom-start" \| "bottom-end" \| "top-start" \| "top-end" \| "left-start" \| "left-end" \| "right-start" \| "right-end"` | `bottom` | Posição preferida em relação ao gatilho; inverte sozinho se faltar espaço. |
| `showCloseButton` | `boolean` | `false` | Mostra um botão de fechar no cabeçalho. |
| `title` | `ReactNode` | — | Título visível; nomeia o popover. Sem título, o nome vem do gatilho (ou de `aria-label`). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`PopoverPlacement`:

```ts
export type PopoverPlacement = FloatingPlacement
```

## Acessibilidade

O painel é um diálogo não modal (`role="dialog"`, sem `aria-modal`). O gatilho expõe `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls`. Ao abrir, o foco vai para o conteúdo; na ordem de Tab, o painel se comporta como se estivesse logo depois do gatilho. Escape e clique fora fecham e devolvem o foco ao gatilho.

| Teclas | Ação |
| --- | --- |
| `Enter` | No gatilho: abre ou fecha o popover. |
| `Tab` | Percorre o conteúdo; no último elemento, fecha e segue para o próximo item da página. |
| `Shift` + `Tab` | No primeiro elemento, volta ao gatilho (o painel continua aberto). |
| `Esc` | Fecha e devolve o foco ao gatilho. |

- **1.3.2** — Ordem de foco lógica mesmo com o conteúdo renderizado em portal.
- **2.1.1** — Abre, navega e fecha só com o teclado.
- **2.4.3** — Foco entra no painel ao abrir e volta ao gatilho ao fechar.
- **4.1.2** — Estado aberto/fechado exposto por aria-expanded.
