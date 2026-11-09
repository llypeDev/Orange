# Listbox

Lista de opções sempre visível, com seleção única ou múltipla: painéis de filtro, escolha de plano, listas mestre.

- Categoria: Formulários · Status: estável
- Importação: `import { Listbox, ListboxGroup, ListboxOption } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/listbox (em inglês: https://orange.llypedev.com.br/en/components/listbox)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-listbox--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Listbox

## Boas práticas

- Use quando as opções precisam ficar à vista enquanto a pessoa decide: painéis de filtro, escolha de plano, listas mestre (escolher um item para ver os detalhes ao lado).
- Em formulários compactos, prefira uma lista suspensa: **Select** para poucas opções, **Combobox** para muitas com busca e **MultiSelect** para várias. Com até cinco opções simples, **RadioGroup** e **CheckboxGroup** são mais familiares.
- Rótulos curtos e escaneáveis; detalhes (preço, prazo, estoque) vão na `description`. Com mais de oito opções, agrupe com `ListboxGroup` e limite a altura com `maxHeight`.
- Explique na descrição por que uma opção está desabilitada ("Em manutenção até 18/11"). Ela continua focável, então o leitor de tela também lê o motivo.
- No modo múltiplo, mostre perto da lista quantos itens estão selecionados e uma ação para limpar.

## Anatomia

- **Listbox** — Contêiner com borda de 1px que recebe o foco (uma única parada de Tab). Rola por dentro com maxHeight. Fica com borda vermelha quando há error.
- **ListboxOption** — Linha com ícone opcional, rótulo e descrição, separada das outras por 1px.
- **Indicador de seleção** — Seleção única: check laranja à direita. Seleção múltipla: caixa quadrada à esquerda, como o Checkbox.
- **Opção ativa** — A opção sob o foco do teclado: fundo sutil e barra de acento à esquerda. Só aparece enquanto a lista tem foco.
- **ListboxGroup** — Título em caixa alta (eyebrow) que nomeia um role="group" com as opções abaixo dele.

## Exemplos

### Escolha de plano

Seleção única controlada (`value` / `onChange`) com descrições. Espaço, Enter ou clique selecionam; as setas só movem o foco.

```tsx
import { Listbox, ListboxOption, Stack } from '@orangesys/ui'
import { useState } from 'react'

const planos = [
  { value: 'gratuito', nome: 'Gratuito', detalhe: '1 usuário, 3 projetos e 1 GB · R$ 0' },
  { value: 'essencial', nome: 'Essencial', detalhe: 'Até 5 usuários, projetos ilimitados e 50 GB · R$ 49/mês' },
  { value: 'profissional', nome: 'Profissional', detalhe: 'Até 25 usuários, relatórios avançados e 500 GB · R$ 149/mês' },
  { value: 'empresarial', nome: 'Empresarial', detalhe: 'Usuários ilimitados, SSO e suporte dedicado · sob consulta' },
]

export default function PlanPicker() {
  const [plano, setPlano] = useState<string | null>('essencial')
  const escolhido = planos.find((p) => p.value === plano)

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <Listbox
        label="Plano"
        description="Cobrança mensal. Você pode trocar de plano quando quiser."
        value={plano}
        onChange={setPlano}
      >
        {planos.map((p) => (
          <ListboxOption key={p.value} value={p.value} description={p.detalhe}>
            {p.nome}
          </ListboxOption>
        ))}
      </Listbox>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Plano escolhido: <strong style={{ color: 'var(--or-color-text)' }}>{escolhido?.nome ?? 'nenhum'}</strong>
      </p>
    </Stack>
  )
}
```

### Filtro de categorias da loja

`selectionMode="multiple"` com grupos e `maxHeight`. Clique alterna, Shift+clique marca uma faixa e Ctrl/Cmd+A marca todas; a lista rola mantendo a opção ativa visível.

```tsx
import { Button, Listbox, ListboxGroup, ListboxOption, Stack } from '@orangesys/ui'
import { useState } from 'react'

const grupos = [
  {
    titulo: 'Alimentos',
    categorias: [
      { value: 'hortifruti', nome: 'Hortifrúti' },
      { value: 'padaria', nome: 'Padaria' },
      { value: 'laticinios', nome: 'Laticínios' },
      { value: 'carnes', nome: 'Carnes e peixes' },
      { value: 'congelados', nome: 'Congelados' },
    ],
  },
  {
    titulo: 'Bebidas',
    categorias: [
      { value: 'cafes', nome: 'Cafés e chás' },
      { value: 'sucos', nome: 'Sucos' },
      { value: 'vinhos', nome: 'Vinhos e espumantes' },
    ],
  },
  {
    titulo: 'Casa',
    categorias: [
      { value: 'limpeza', nome: 'Limpeza' },
      { value: 'higiene', nome: 'Higiene pessoal' },
      { value: 'utilidades', nome: 'Utilidades domésticas' },
    ],
  },
]

export default function StoreFilter() {
  const [categorias, setCategorias] = useState<string[]>(['padaria', 'cafes'])

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <Listbox
        label="Categorias"
        description="Clique para marcar. Shift+clique ou Shift+↓ marcam em sequência; Ctrl+A marca todas."
        selectionMode="multiple"
        value={categorias}
        onChange={setCategorias}
        maxHeight={320}
      >
        {grupos.map((grupo) => (
          <ListboxGroup key={grupo.titulo} label={grupo.titulo}>
            {grupo.categorias.map((c) => (
              <ListboxOption key={c.value} value={c.value}>
                {c.nome}
              </ListboxOption>
            ))}
          </ListboxGroup>
        ))}
      </Listbox>
      <Stack gap={2} direction="horizontal" align="center" justify="between">
        <span style={{ fontSize: 13, color: 'var(--or-color-text-subtle)' }} aria-live="polite">
          {categorias.length === 0
            ? 'Todas as categorias'
            : categorias.length === 1
              ? '1 categoria no filtro'
              : `${categorias.length} categorias no filtro`}
        </span>
        <Button size="sm" variant="ghost" onClick={() => setCategorias([])} disabled={categorias.length === 0}>
          Limpar filtro
        </Button>
      </Stack>
    </Stack>
  )
}
```

### Armazéns com item desabilitado

Com `selectionFollowsFocus`, as setas já selecionam. O CD Recife está desabilitado: recebe o foco (e o motivo é lido), mas não pode ser escolhido. Ícones são decorativos.

```tsx
import { Icon, Listbox, ListboxOption } from '@orangesys/ui'

export default function Warehouses() {
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <Listbox
        label="Armazém de origem"
        description="De onde sai a mercadoria deste pedido. As setas já selecionam."
        defaultValue="cajamar"
        selectionFollowsFocus
      >
        <ListboxOption
          value="cajamar"
          icon={<Icon name="layers" size="sm" />}
          description="Cajamar, SP · 1.240 unidades em estoque"
        >
          CD Cajamar
        </ListboxOption>
        <ListboxOption
          value="extrema"
          icon={<Icon name="layers" size="sm" />}
          description="Extrema, MG · 860 unidades em estoque"
        >
          CD Extrema
        </ListboxOption>
        <ListboxOption
          value="recife"
          icon={<Icon name="alert-triangle" size="sm" />}
          description="Em manutenção até 18/11 — indisponível para novos pedidos"
          disabled
        >
          CD Recife
        </ListboxOption>
        <ListboxOption
          value="canoas"
          icon={<Icon name="layers" size="sm" />}
          description="Canoas, RS · 312 unidades em estoque"
        >
          CD Canoas
        </ListboxOption>
      </Listbox>
    </div>
  )
}
```

### Integração com Form

Com `name`, cada valor selecionado vira um `<input type="hidden">` que o `Form` (e formulários nativos) envia. Envie sem escolher a entrega para ver o erro: a lista treme, o resumo de erros leva o foco até ela e o erro some assim que você escolhe.

```tsx
import {
  Button,
  CodeBlock,
  Form,
  FormActions,
  Listbox,
  ListboxOption, Stack,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'
import { useState } from 'react'

function validate(values: FormValues): FormErrors {
  return {
    entrega: values.entrega ? undefined : 'Escolha como quer receber o pedido.',
  }
}

export default function WithForm() {
  const [enviado, setEnviado] = useState<FormValues | null>(null)

  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 460 }}>
      <Form aria-label="Preferências de entrega" validate={validate} onSubmit={setEnviado}>
        {({ errors }) => (
          <>
            <Listbox name="entrega" label="Tipo de entrega" required error={errors.entrega}>
              <ListboxOption value="economica" description="5 a 8 dias úteis · grátis acima de R$ 150">
                Econômica
              </ListboxOption>
              <ListboxOption value="expressa" description="1 a 2 dias úteis · R$ 24,90">
                Expressa
              </ListboxOption>
              <ListboxOption value="retirada" description="Pronto em 2 horas numa loja parceira · grátis">
                Retirar na loja
              </ListboxOption>
            </Listbox>
            <Listbox
              name="avisos"
              label="Avisos do pedido"
              optional
              selectionMode="multiple"
              defaultValue={['email', 'app']}
            >
              <ListboxOption value="email">E-mail</ListboxOption>
              <ListboxOption value="app">Notificação no aplicativo</ListboxOption>
              <ListboxOption value="sms">SMS</ListboxOption>
            </Listbox>
            <FormActions>
              <Button type="submit">Salvar preferências</Button>
            </FormActions>
          </>
        )}
      </Form>
      {enviado && <CodeBlock title="Valores enviados" language="json" code={JSON.stringify(enviado, null, 2)} />}
    </Stack>
  )
}
```

### Orientação horizontal

`orientation="horizontal"` troca ↑/↓ por ←/→. Bom para poucas opções curtas, como tamanhos.

```tsx
import { Listbox, ListboxOption } from '@orangesys/ui'

export default function Horizontal() {
  return (
    <Listbox
      label="Tamanho"
      description="GG esgotado. Use ← e → para navegar."
      orientation="horizontal"
      defaultValue="m"
      name="tamanho"
    >
      <ListboxOption value="p">P</ListboxOption>
      <ListboxOption value="m">M</ListboxOption>
      <ListboxOption value="g">G</ListboxOption>
      <ListboxOption value="gg" disabled>
        GG
      </ListboxOption>
    </Listbox>
  )
}
```

## Movimento

- **Opção ativa** — O fundo muda em --or-duration-fast (160ms), --or-ease-out; a barra de acento de 3px cresce do centro (scaleY 0 → 1) em --or-duration-medium (250ms), --or-ease-spring. Na horizontal, a barra fica na base (scaleX).
- **Selecionar** — O check (ou a marca da caixa) entra com escala 0.6 → 1 em 250ms, --or-ease-bounce; a caixa ganha o laranja em 160ms. Ao desmarcar, sai mais rápido (160ms, --or-ease-in-out). Seleções já presentes ao carregar não animam.
- **Pressionar** — A linha escurece um tom (--or-color-surface-active) em --or-duration-press (90ms). Ela não afunda, para não quebrar os separadores.
- **Erro** — Quando o erro surge, a lista treme uma vez (or-shake, 400ms) e a mensagem entra com fade + 4px, como nos outros campos.
- **Movimento reduzido** — Tudo instantâneo pelos tokens: o fundo, a barra, o check e a borda vermelha continuam indicando o estado.

## Props

### `Listbox`

Lista de opções sempre visível (padrão Listbox do WAI-ARIA APG): painéis de
filtro, escolha de plano, listas mestre. Seleção única ou múltipla, teclado
completo (setas, Home/End, digitação, faixas com Shift) e integração com
`Form` via `name`. Para escolher em uma lista suspensa, use `Select`,
`Combobox` ou `MultiSelect`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | `<ListboxOption>` e `<ListboxGroup>`. |
| `defaultValue` | `string \| string[] \| null` | — | Valor inicial (não controlado). Valores iniciais (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo, ligado por `aria-describedby`. |
| `disabled` | `boolean` | `false` | Desabilita a lista inteira: sai da ordem de Tab e não envia valores. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, a lista fica inválida (borda vermelha + tremor). |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Marca a lista como inválida sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sem rótulo, informe `aria-label` ou `aria-labelledby`. |
| `maxHeight` | `string \| number` | — | Altura máxima (número em px ou valor CSS). A lista rola por dentro e mantém a opção ativa visível. |
| `name` | `string` | — | Envia um `<input type="hidden">` por valor selecionado (para `Form` e formulários nativos). |
| `onChange` | `((value: string \| null) => void) \| ((value: string[]) => void)` | — | Chamado com o novo valor selecionado. Chamado com a nova lista de valores, na ordem das opções. |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `options` | `(ListboxItem \| ListboxItemGroup)[]` | — | Opções geradas a partir de dados. Alternativa a passar `<ListboxOption>` como filhos. |
| `orientation` | `"horizontal" \| "vertical"` | — | Disposição das opções. `horizontal` troca ↑/↓ por ←/→. Padrão: `vertical`. |
| `required` | `boolean` | — | Mostra `*` no rótulo e expõe `aria-required`. A validação fica com o formulário. |
| `selectionFollowsFocus` | `boolean` | — | Só no modo `single`: mover o foco com as setas, Home/End ou a digitação também seleciona a opção. Padrão: `false`. |
| `selectionMode` | `"single" \| "multiple"` | — | `single` (padrão): uma opção por vez. `multiple`: várias, com `aria-multiselectable`. |
| `value` | `string \| string[] \| null` | — | Valor selecionado (controlado). `null` = nada selecionado. Valores selecionados (controlado), na ordem das opções. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `ListboxGroup`

Agrupa opções sob um título (`role="group"` nomeado por `aria-labelledby`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Título do grupo, que nomeia o `role="group"`. |
| `children` | `ReactNode` | — | As `<ListboxOption>` do grupo. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `ListboxOption`

Uma opção do `Listbox`. A seleção é exposta com `aria-selected` e indicada
por um check (seleção única) ou uma caixa marcada (seleção múltipla).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` (obrigatória) | `ReactNode` | — | Rótulo visível (nome acessível da opção). |
| `value` (obrigatória) | `string` | — | Valor da opção (único na lista). |
| `description` | `ReactNode` | — | Texto secundário abaixo do rótulo, ligado por `aria-describedby`. |
| `disabled` | `boolean` | `false` | A opção continua focável (o leitor de tela a anuncia), mas não pode ser selecionada. |
| `icon` | `ReactNode` | — | Ícone decorativo antes do rótulo. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ListboxItem`:

```ts
/** Opção da prop `options` (alternativa a `<ListboxOption>`). */
export interface ListboxItem {
  /** Valor da opção (único na lista). É o que vai para `onChange` e para o formulário. */
  value: string
  /** Rótulo visível (nome acessível da opção). */
  label: ReactNode
  /** Texto secundário abaixo do rótulo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Focável, mas não pode ser selecionada. */
  disabled?: boolean
  /** Ícone decorativo antes do rótulo. */
  icon?: ReactNode
}
```

`ListboxItemGroup`:

```ts
/** Grupo da prop `options` (alternativa a `<ListboxGroup>`). */
export interface ListboxItemGroup {
  /** Título do grupo. */
  label: ReactNode
  options: ListboxItem[]
}
```

`ListboxOrientation`:

```ts
export type ListboxOrientation = 'vertical' | 'horizontal'
```

`ListboxSelectionMode`:

```ts
export type ListboxSelectionMode = 'single' | 'multiple'
```

## Acessibilidade

Segue o padrão **Listbox** do WAI-ARIA APG. O foco do teclado fica sempre no elemento `role="listbox"` e a opção ativa é indicada por `aria-activedescendant` (em vez de mover o foco entre as opções com roving tabindex). Motivos: a lista é uma única parada de Tab mesmo com centenas de opções; o foco não salta para dentro de grupos nem dispara rolagens do navegador ao navegar — a própria lista rola a opção ativa para a vista; e é o mesmo modelo dos popups de **Select**, **Combobox** e **MultiSelect**, então leitores de tela se comportam igual em toda a biblioteca. Cada opção expõe `aria-selected` e a lista, `aria-multiselectable`.

Ao receber o foco, a opção ativa é a primeira selecionada (ou a primeira da lista). Opções desabilitadas continuam focáveis — recomendação do APG para que o motivo seja descoberto —, mas não são selecionadas por Espaço, clique, faixas nem Ctrl+A. Com o mouse, o clique seleciona (única) ou alterna (múltipla) e Shift+clique seleciona a faixa desde a última opção marcada. No modo múltiplo, mudanças em bloco (Ctrl+A, faixas) anunciam a contagem de selecionados numa região `role="status"`.

| Teclas | Ação |
| --- | --- |
| `Tab` | Foca a lista (uma única parada). |
| `↓ / ↑` | Próxima / anterior opção (← / → na horizontal). Não dá a volta. |
| `Home / End` | Primeira / última opção. |
| `a–z` | Busca por digitação: letras em sequência (até 500ms entre elas) vão à opção que começa com o texto; repetir a mesma letra percorre as opções. |
| `Space / Enter` | Seleção única: seleciona a opção ativa. Seleção múltipla: marca ou desmarca. |
| `Shift` + `↓ / ↑` | Múltipla: move e estende a seleção a partir de onde a extensão começou; voltar encolhe a faixa. |
| `Shift` + `Space` | Múltipla: seleciona as opções contíguas da última marcada até a ativa. |
| `Ctrl / ⌘` + `A` | Múltipla: seleciona todas as habilitadas; se já estiverem todas, desmarca. |
| `Ctrl` + `Shift` + `Home / End` | Múltipla: seleciona da opção ativa até a primeira / última e move o foco. |

> **Envio sem seleção** Sem nada selecionado, nenhum valor é enviado (como caixas desmarcadas). Valide no `Form` com `values.campo ? undefined : 'mensagem'`: o resumo de erros encontra a lista pelo `name` e leva o foco até ela.

- **1.3.1** — Papéis listbox, option e group; rótulo, descrição e erro ligados por aria-labelledby e aria-describedby.
- **1.4.1** — Seleção indicada por check/caixa e peso do texto, não só por cor; opção ativa com barra lateral.
- **2.1.1** — Navegação, seleção, faixas e "selecionar tudo" pelo teclado, conforme o APG.
- **2.4.7** — Contorno de foco de 2px na lista e opção ativa destacada.
- **3.3.1** — Erro exposto com aria-invalid, texto ligado à lista e borda vermelha.
- **4.1.2** — aria-selected, aria-multiselectable, aria-disabled e aria-activedescendant sempre atualizados.
