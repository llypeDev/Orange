# Toggletip

Botão de informação que mostra uma explicação curta ao ser clicado e a anuncia para leitores de tela.

- Categoria: Sobreposições · Status: estável
- Importação: `import { Toggletip } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/toggletip (em inglês: https://orange.llypedev.com.br/en/components/toggletip)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-toggletip--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Toggletip

## Boas práticas

- Use para explicar um termo, uma métrica ou uma regra ao lado de onde ela aparece — informação útil, mas que não precisa ficar sempre visível.
- Dê um rótulo específico ao botão: **Sobre a taxa de conversão** diz mais que o padrão **Mais informações**, principalmente quando há vários na tela.
- Uma ou duas frases, sem links nem botões: o conteúdo é anunciado, mas não recebe foco.
- Diferente do Tooltip, abre com clique ou toque — funciona em telas sensíveis ao toque.

## Exemplos

### Ao lado de uma métrica

Clique no ícone ou foque e pressione Enter. Escape ou clique fora fecham.

```tsx
import { Toggletip } from '@orangesys/ui'

export default function Metric() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 4,
        padding: '16px 20px',
        border: '1px solid var(--or-color-border)',
        minWidth: 240,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span className="or-eyebrow">Taxa de conversão</span>
        <Toggletip
          label="Sobre a taxa de conversão"
          content="Pedidos concluídos divididos pelo total de visitantes no período. Visitas de robôs são descartadas."
        />
      </div>
      <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 32, lineHeight: 1.1 }}>
        3,8%
      </strong>
      <span style={{ fontSize: 13, color: 'var(--or-color-text-subtle)' }}>Últimos 30 dias</span>
    </div>
  )
}
```

### Em um campo de formulário

Dentro de `labelAside` do Field. O conteúdo pode ter formatação simples.

```tsx
import { Field, Toggletip } from '@orangesys/ui'

export default function InForm() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Field
        label="Limite de requisições"
        controlId="limite-api"
        labelAside={
          <Toggletip
            label="Sobre o limite de requisições"
            placement="right"
            content={
              <>
                Quantidade máxima de chamadas por minuto, por chave de API. Acima disso, a API
                responde com <strong>429</strong>.
              </>
            }
          />
        }
      >
        <input id="limite-api" type="number" className="or-control" defaultValue={600} />
      </Field>
    </div>
  )
}
```

### Tamanhos e ícone

sm (24px, padrão) e md (32px); o ícone pode ser trocado.

```tsx
import { Toggletip } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Pequeno (24px)
        <Toggletip
          size="sm"
          label="Sobre o tamanho pequeno"
          content="Ideal ao lado de rótulos e textos de corpo."
        />
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Médio (32px)
        <Toggletip
          size="md"
          icon="help-circle"
          placement="bottom"
          label="Sobre o tamanho médio"
          content="Use ao lado de títulos ou em áreas de toque."
        />
      </span>
    </div>
  )
}
```

## Movimento

- **Botão** — Afunda ao pressionar (90ms); fundo e cor mudam em 160ms; o ícone cresce levemente quando aberto (250ms, --or-ease-spring).
- **Bolha** — Entra com opacidade + 4px em 250ms e sai em 160ms, voltando para o botão.
- **Reabrir** — Reabrir durante a saída monta uma bolha nova, que é anunciada de novo.
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `Toggletip`

Botão de informação que mostra uma explicação curta ao ser clicado. O
conteúdo entra numa região `aria-live`, então é anunciado mesmo sem mover o
foco (padrão "toggletip" do Inclusive Components).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `content` (obrigatória) | `ReactNode` | — | Explicação exibida na bolha e anunciada por leitores de tela. Evite links e botões. |
| `defaultOpen` | `boolean` | `false` | Aberto inicialmente (não controlado). |
| `icon` | `IconName` | `info` | Ícone do botão. |
| `label` | `string` | — | Nome acessível do botão. Padrão: "Mais informações". Prefira algo específico: "Sobre a taxa de conversão". |
| `offset` | `number` | `8` | Distância do botão, em px. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando a bolha abre ou fecha. |
| `open` | `boolean` | — | Aberto (controlado). |
| `placement` | `"bottom" \| "top" \| "left" \| "right" \| "bottom-start" \| "bottom-end" \| "top-start" \| "top-end" \| "left-start" \| "left-end" \| "right-start" \| "right-end"` | `top` | Posição preferida da bolha; inverte sozinha se faltar espaço. |
| `size` | `"sm" \| "md"` | `sm` | Tamanho do botão: `sm` 24px, `md` 32px. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`) do `<button>`, como `type`, `disabled`, `onClick`, `form` e `name`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ToggletipPlacement`:

```ts
export type ToggletipPlacement = FloatingPlacement
```

`ToggletipSize`:

```ts
export type ToggletipSize = 'sm' | 'md'
```

## Acessibilidade

Implementa o padrão *toggletip* do Inclusive Components: um `<button>` com rótulo e `aria-expanded`, e uma região `role="status"` / `aria-live="polite"` que existe desde o carregamento. Ao abrir, a bolha é inserida nessa região e o leitor de tela anuncia o texto sem mover o foco. Ao fechar, a região é esvaziada — abrir de novo anuncia de novo.

| Teclas | Ação |
| --- | --- |
| `Enter` | Abre ou fecha a explicação. |
| `Space` | Abre ou fecha a explicação. |
| `Esc` | Fecha mantendo o foco no botão. |
| `Tab` | Sai do botão e fecha a explicação. |

- **1.4.13** — Aberto por ação explícita, dispensável com Escape e persistente até ser fechado.
- **2.5.8** — Alvo de toque de no mínimo 24×24px.
- **4.1.2** — Botão com nome acessível traduzido e estado aria-expanded.
- **4.1.3** — Conteúdo anunciado por região aria-live, sem mover o foco.
