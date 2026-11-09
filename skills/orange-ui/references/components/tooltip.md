# Tooltip

Rótulo curto exibido ao passar o ponteiro ou focar um elemento — ideal para nomear botões só com ícone.

- Categoria: Sobreposições · Status: estável
- Importação: `import { Tooltip } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/tooltip (em inglês: https://orange.llypedev.com.br/en/components/tooltip)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-tooltip--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Tooltip

## Boas práticas

- Texto curto (até ~80 caracteres), sem links, botões ou informação essencial — quem usa toque nunca vê o tooltip.
- O tooltip complementa o nome do gatilho, não o substitui: botões só com ícone continuam precisando de `aria-label`. O texto do tooltip vira a *descrição* acessível.
- O gatilho precisa ser focável. Botões desabilitados não recebem foco nem eventos — explique o motivo em texto visível.
- Para conteúdo interativo use Popover; para uma explicação aberta por clique, Toggletip.

- Faça: Uma frase curta que esclarece a ação.
- Evite: Instruções longas ou passos que a pessoa precisa seguir.

## Exemplos

### Botões só com ícone

Passe o ponteiro ou navegue com Tab. Depois do primeiro tooltip, os próximos abrem sem atraso.

```tsx
import { Button, Icon, Tooltip, type IconName } from '@orangesys/ui'

const acoes: { icon: IconName; label: string; dica: string }[] = [
  { icon: 'edit', label: 'Editar', dica: 'Editar documento' },
  { icon: 'copy', label: 'Duplicar', dica: 'Duplicar documento' },
  { icon: 'download', label: 'Baixar', dica: 'Baixar como PDF' },
  { icon: 'trash', label: 'Excluir', dica: 'Mover para a lixeira' },
]

export default function Toolbar() {
  return (
    <div role="toolbar" aria-label="Ações do documento" style={{ display: 'flex', gap: 4 }}>
      {acoes.map(({ icon, label, dica }) => (
        <Tooltip key={icon} content={dica}>
          <Button variant="ghost" iconOnly aria-label={label} startIcon={<Icon name={icon} />} />
        </Tooltip>
      ))}
    </div>
  )
}
```

### Posições

Sem espaço, o tooltip inverte de lado automaticamente.

```tsx
import { Button, Tooltip, type TooltipPlacement } from '@orangesys/ui'

const posicoes: { placement: TooltipPlacement; label: string }[] = [
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
        padding: '32px 0',
      }}
    >
      {posicoes.map(({ placement, label }) => (
        <Tooltip key={placement} placement={placement} content={`Tooltip ${label.toLowerCase()}`}>
          <Button variant="outline">{label}</Button>
        </Tooltip>
      ))}
    </div>
  )
}
```

### Atalhos e atraso

O conteúdo pode incluir um `<kbd>` com o atalho. `delay` controla o atraso no hover (padrão 400ms); no foco por teclado o tooltip abre na hora.

```tsx
import { Button, Icon, Tooltip } from '@orangesys/ui'

export default function Shortcut() {
  return (
    <>
      <Tooltip
        content={
          <>
            Salvar rascunho <kbd>Ctrl S</kbd>
          </>
        }
      >
        <Button variant="outline" startIcon={<Icon name="file" />}>
          Salvar
        </Button>
      </Tooltip>
      <Tooltip content="Publica para todos os leitores" placement="bottom" delay={0}>
        <Button startIcon={<Icon name="send" />}>Publicar</Button>
      </Tooltip>
    </>
  )
}
```

## Movimento

- **Entrada** — Depois do delay (400ms no hover, imediato no foco): fade + 4px vindo do gatilho. 160ms, --or-ease-out. Dentro de 300ms após outro tooltip, abre sem atraso.
- **Saída** — Recua 4px e some. 80ms (--or-duration-instant), --or-ease-in-out — mais curta que a entrada.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `Tooltip`

Rótulo curto que aparece ao passar o ponteiro ou focar um elemento.
Complementa (não substitui) o nome acessível do gatilho.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` (obrigatória) | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Gatilho focável (um único elemento, ex.: `Button`). Recebe `aria-describedby`. |
| `content` (obrigatória) | `ReactNode` | — | Texto curto e não interativo (sem links ou botões). |
| `arrow` | `boolean` | `true` | Mostra a seta apontando para o gatilho. |
| `closeDelay` | `number` | `150` | Atraso para fechar ao sair com o ponteiro, em ms (tempo para alcançar o tooltip). |
| `defaultOpen` | `boolean` | `false` | Aberto inicialmente (não controlado). |
| `delay` | `number` | `400` | Atraso para abrir no hover, em ms. No foco por teclado abre na hora. |
| `disabled` | `boolean` | `false` | Desliga o tooltip (o gatilho é renderizado sem alterações). |
| `offset` | `number` | `8` | Distância do gatilho, em px. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o tooltip abre ou fecha. |
| `open` | `boolean` | — | Aberto (controlado). |
| `placement` | `"bottom" \| "top" \| "left" \| "right" \| "bottom-start" \| "bottom-end" \| "top-start" \| "top-end" \| "left-start" \| "left-end" \| "right-start" \| "right-end"` | `top` | Posição preferida; inverte sozinha se faltar espaço. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão *Tooltip* do WAI-ARIA APG: o conteúdo tem `role="tooltip"` e está ligado ao gatilho por `aria-describedby` mesmo enquanto fechado, então leitores de tela leem a descrição assim que o gatilho recebe foco. O foco nunca vai para o tooltip.

| Teclas | Ação |
| --- | --- |
| `Tab` | Focar o gatilho mostra o tooltip; sair dele esconde. |
| `Esc` | Esconde o tooltip sem mover o foco. |

- **1.4.13** — Dispensável (Escape), sobrevoável (o ponteiro pode ir até ele) e persistente (só fecha ao sair).
- **2.1.1** — Aparece também no foco por teclado, não só no hover.
- **4.1.2** — Texto exposto como descrição acessível do gatilho.
