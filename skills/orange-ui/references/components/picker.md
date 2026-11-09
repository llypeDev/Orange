# Picker

Lista suspensa personalizada para escolher uma opção — com ícones, descrições, opções desabilitadas e grupos.

- Categoria: Formulários · Status: novo
- Importação: `import { Picker } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/picker (em inglês: https://orange.llypedev.com.br/en/components/picker)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-picker--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Picker

## Boas práticas

- Use quando as opções precisam de mais que texto: um **ícone** que ajuda a reconhecer, uma **descrição** que explica a consequência ou grupos com título. Para opções só de texto, o **Select** nativo é mais simples e mais leve.
- Até ~15 opções. Para listas longas em que a pessoa sabe o que procura, use **Combobox** (com busca); para várias escolhas, **MultiSelect**; para 2 a 4 opções que cabem na tela, **RadioGroup**.
- Rótulos curtos e escaneáveis: o rótulo também aparece no campo fechado e é usado na busca por digitação. Detalhes (prazo, preço, impacto) vão na `description`, que só aparece na lista aberta.
- Explique na descrição por que uma opção está desabilitada ("Disponível no plano Empresarial"). Desabilitadas continuam visíveis, mas o teclado as pula.
- Ícones são decorativos e reforçam o rótulo — nunca o substituem. Use ícones em todas as opções ou em nenhuma.

- Faça: Ícone e descrição ajudam a decidir — é para isso que o Picker existe.
- Evite: Só texto: aqui um `Select` resolve, com teclado e leitores de tela nativos.

## Anatomia

- **Gatilho** — Elemento role="combobox" com a mesma borda, altura e foco dos outros campos. Mostra o ícone e o rótulo da opção escolhida — ou o placeholder — e um chevron.
- **Lista** — Popup role="listbox" na largura do campo, com borda de 1px e sombra de sobreposição. Abre embaixo (ou em cima, sem espaço) e rola por dentro em listas longas.
- **Opção** — Ícone opcional, rótulo e descrição. A ativa ganha fundo e uma barra laranja à esquerda; a escolhida, rótulo em negrito e check à direita.
- **Grupo** — Título em caixa alta (eyebrow) que nomeia um role="group"; grupos são separados por uma linha de 1px.

## Exemplos

### Ícones e descrições

O campo fechado mostra o ícone e o rótulo da escolha; a descrição aparece só na lista. `icon` aceita o nome de um ícone do Orange ou um elemento.

```tsx
import { Picker } from '@orangesys/ui'

const visibilidade = [
  {
    value: 'privado',
    label: 'Privado',
    icon: 'lock',
    description: 'Só você e as pessoas que você convidar',
  },
  {
    value: 'equipe',
    label: 'Equipe',
    icon: 'users',
    description: 'Todos da equipe Produto podem ver e comentar',
  },
  {
    value: 'organizacao',
    label: 'Organização',
    icon: 'home',
    description: 'Disponível no plano Empresarial',
    disabled: true,
  },
  {
    value: 'publico',
    label: 'Público',
    icon: 'globe',
    description: 'Qualquer pessoa com o link, sem login',
  },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Picker
        label="Visibilidade do projeto"
        description="Você pode mudar depois nas configurações."
        options={visibilidade}
        defaultValue="equipe"
        name="visibilidade"
      />
    </div>
  )
}
```

### Grupos e opções desabilitadas

Passe `{ label, options }` em `options` para agrupar. A lista rola por dentro e mantém a opção ativa visível; experimente digitar “fr” com o campo focado.

```tsx
import { Picker } from '@orangesys/ui'

const regioes = [
  {
    label: 'América do Sul',
    options: [
      { value: 'sa-east-1', label: 'São Paulo', description: 'Menor latência para o Brasil' },
      {
        value: 'sa-west-1',
        label: 'Santiago',
        description: 'Em manutenção até 18/11',
        disabled: true,
      },
    ],
  },
  {
    label: 'América do Norte',
    options: [
      { value: 'us-east-1', label: 'Virgínia' },
      { value: 'us-west-2', label: 'Oregon' },
      { value: 'ca-central-1', label: 'Montreal' },
    ],
  },
  {
    label: 'Europa',
    options: [
      { value: 'eu-west-1', label: 'Irlanda' },
      { value: 'eu-central-1', label: 'Frankfurt' },
      { value: 'eu-south-1', label: 'Milão' },
    ],
  },
  {
    label: 'Ásia e Oceania',
    options: [
      { value: 'ap-northeast-1', label: 'Tóquio' },
      { value: 'ap-southeast-1', label: 'Singapura' },
      { value: 'ap-southeast-2', label: 'Sydney' },
    ],
  },
]

export default function Groups() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Picker
        label="Região dos dados"
        description="Onde o banco do projeto fica hospedado. Não pode ser alterada depois."
        placeholder="Escolha uma região"
        options={regioes}
        required
      />
    </div>
  )
}
```

### Controlado

Valor com `value` / `onChange` e lista com `open` / `onOpenChange`. `onChange` recebe o valor (ou `null`).

```tsx
import { Button, Picker, type PickerOption } from '@orangesys/ui'
import { useState } from 'react'

const status: PickerOption[] = [
  { value: 'a-fazer', label: 'A fazer', icon: 'circle' },
  { value: 'andamento', label: 'Em andamento', icon: 'clock' },
  { value: 'revisao', label: 'Em revisão', icon: 'eye' },
  { value: 'concluida', label: 'Concluída', icon: 'check-circle' },
  { value: 'arquivada', label: 'Arquivada', icon: 'folder', disabled: true },
]

export default function Controlled() {
  const [valor, setValor] = useState<string | null>('andamento')
  const [aberta, setAberta] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <Picker
        label="Status da tarefa"
        options={status}
        value={valor}
        onChange={setValor}
        open={aberta}
        onOpenChange={setAberta}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Valor salvo: <code>{valor ?? 'nenhum'}</code> · lista {aberta ? 'aberta' : 'fechada'}
      </p>
      <div>
        <Button size="sm" variant="outline" onClick={() => setValor('concluida')}>
          Marcar como concluída
        </Button>
      </div>
    </div>
  )
}
```

### Integração com Form

Com `name`, o valor vai num `<input type="hidden">` (vazio sem escolha) que o `Form` e formulários nativos leem. Envie vazio para ver o erro: o resumo leva o foco ao campo e o erro some ao escolher. “Limpar” (reset) volta ao `defaultValue`.

```tsx
import {
  Button,
  CodeBlock,
  Form,
  FormActions,
  Picker,
  TextField,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'
import { useState } from 'react'

const modelos = [
  {
    value: 'kanban',
    label: 'Kanban',
    icon: 'layout',
    description: 'Colunas por etapa, ideal para fluxo contínuo',
  },
  {
    value: 'sprints',
    label: 'Sprints',
    icon: 'refresh',
    description: 'Ciclos de duas semanas com planejamento e revisão',
  },
  {
    value: 'lista',
    label: 'Lista simples',
    icon: 'list',
    description: 'Tarefas em uma lista única, sem etapas',
  },
]

const regioes = [
  {
    label: 'América do Sul',
    options: [{ value: 'sa-east-1', label: 'São Paulo' }],
  },
  {
    label: 'América do Norte',
    options: [
      { value: 'us-east-1', label: 'Virgínia' },
      { value: 'us-west-2', label: 'Oregon' },
    ],
  },
  {
    label: 'Europa',
    options: [{ value: 'eu-central-1', label: 'Frankfurt' }],
  },
]

function validate(values: FormValues): FormErrors {
  return {
    nome: values.nome ? undefined : 'Dê um nome ao projeto.',
    modelo: values.modelo ? undefined : 'Escolha como a equipe vai organizar as tarefas.',
    regiao: values.regiao ? undefined : 'Escolha onde os dados ficam hospedados.',
  }
}

export default function WithForm() {
  const [enviado, setEnviado] = useState<FormValues | null>(null)

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <Form aria-label="Novo projeto" validate={validate} onSubmit={setEnviado}>
        {({ errors }) => (
          <>
            <TextField name="nome" label="Nome do projeto" required error={errors.nome} />
            <Picker
              name="modelo"
              label="Modelo de trabalho"
              options={modelos}
              required
              error={errors.modelo}
            />
            <Picker
              name="regiao"
              label="Região dos dados"
              placeholder="Escolha uma região"
              options={regioes}
              required
              error={errors.regiao}
            />
            <FormActions>
              <Button type="submit">Criar projeto</Button>
              <Button type="reset" variant="outline">
                Limpar
              </Button>
            </FormActions>
          </>
        )}
      </Form>
      {enviado && (
        <CodeBlock
          title="Valores enviados"
          language="json"
          code={JSON.stringify(enviado, null, 2)}
        />
      )}
    </div>
  )
}
```

### Tamanhos e estados

```tsx
import { Picker } from '@orangesys/ui'

const prioridades = [
  { value: 'urgente', label: 'Urgente', icon: 'zap' },
  { value: 'alta', label: 'Alta', icon: 'arrow-up' },
  { value: 'media', label: 'Média', icon: 'minus' },
  { value: 'baixa', label: 'Baixa', icon: 'arrow-down' },
]

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 380 }}>
      <Picker size="sm" label="Prioridade (sm)" options={prioridades} defaultValue="media" />
      <Picker label="Prioridade (md)" options={prioridades} defaultValue="alta" />
      <Picker size="lg" label="Prioridade (lg)" options={prioridades} defaultValue="urgente" />
      <Picker
        label="Prioridade"
        options={prioridades}
        required
        error="Defina a prioridade antes de publicar."
      />
      <Picker label="Prioridade" options={prioridades} defaultValue="baixa" disabled />
    </div>
  )
}
```

## Movimento

- **Abrir a lista** — Opacidade + 6px a partir do campo (desce quando abre embaixo, sobe quando abre em cima) — 160ms, ease-out.
- **Fechar a lista** — Fade + recuo de 4px em direção ao campo — 120ms, ease-in-out. O conteúdo fica congelado durante a saída.
- **Opção ativa** — Fundo em 160ms (ease-out); a barra laranja lateral cresce do centro (scaleY) em 250ms, spring.
- **Chevron** — Escurece e desce 2px no hover/foco (como no Select), afunda no clique (90ms) e gira 180° ao abrir — 250ms, spring.
- **Erro** — Quando o erro surge, o campo treme uma vez (or-shake, 400ms) e a mensagem entra com fade + 4px, como nos outros campos.
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda, check e texto.

## Props

### `Picker`

Lista suspensa personalizada, só de seleção (padrão "Select-Only Combobox"
do WAI-ARIA APG): um gatilho com a aparência dos campos abre uma lista com
opções que podem ter ícone, descrição, estar desabilitadas e agrupadas.
Use quando o `Select` nativo não basta (ícones, descrições); para listas
longas com busca, use `Combobox`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `options` (obrigatória) | `(PickerOption \| PickerGroup)[]` | — | Opções (ou grupos de opções), na ordem em que aparecem na lista. |
| `className` | `string` | — | Classe aplicada ao contêiner externo. |
| `defaultOpen` | `boolean` | — | Lista aberta inicialmente (não controlado). |
| `defaultValue` | `string \| null` | — | Valor inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `disabled` | `boolean` | — | Desabilita o campo: sai da ordem de Tab e não envia o valor. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Marca o campo como inválido sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sem rótulo, informe `aria-label` ou `aria-labelledby`. |
| `name` | `string` | — | Envia o valor em um `<input type="hidden">` (para `Form` e formulários nativos). |
| `onChange` | `((value: string \| null) => void)` | — | Chamado com o novo valor quando a pessoa escolhe uma opção. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando a lista pede para abrir ou fechar. |
| `open` | `boolean` | — | Lista aberta (controlado). |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `placeholder` | `string` | — | Texto exibido no gatilho enquanto nada foi escolhido. Padrão: "Selecione…". |
| `required` | `boolean` | — | Mostra `*` no rótulo e expõe `aria-required`. A validação fica com o formulário. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `string \| null` | — | Valor escolhido (controlado). `null` = nenhum. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`PickerGroup`:

```ts
/** Grupo de opções do `Picker`, com um título. */
export interface PickerGroup {
  /** Título do grupo, que nomeia o `role="group"`. */
  label: string
  options: PickerOption[]
}
```

`PickerOption`:

```ts
/** Uma opção do `Picker`. */
export interface PickerOption {
  /** Valor da opção (único). É o que vai para `onChange` e para o formulário. */
  value: string
  /** Rótulo exibido na lista e no gatilho. Também é usado na busca por digitação. */
  label: string
  /** Texto secundário abaixo do rótulo, ligado à opção por `aria-describedby`. */
  description?: ReactNode
  /** Ícone decorativo antes do rótulo: nome de um ícone do Orange ou um elemento. */
  icon?: IconName | ReactNode
  /** Aparece na lista, mas é pulada pelo teclado e não pode ser escolhida. */
  disabled?: boolean
}
```

`PickerSize`:

```ts
export type PickerSize = 'sm' | 'md' | 'lg'
```

## Acessibilidade

Segue o padrão **Select-Only Combobox** do WAI-ARIA APG. O gatilho tem `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded` e é nomeado pelo rótulo do campo; aberto, ganha `aria-controls` e `aria-activedescendant`. O foco fica sempre no gatilho: a lista (`role="listbox"`) não recebe foco, e a opção ativa é indicada por `aria-activedescendant`. Cada opção expõe `aria-selected`, a descrição chega por `aria-describedby` e os grupos são `role="group"` nomeados pelo título. Clicar no rótulo foca o gatilho.

| Teclas | Ação |
| --- | --- |
| `Enter / Space / ↓ / ↑` | Fechada: abre a lista na opção escolhida (sem escolha, ↓ vai à primeira e ↑ à última). |
| `Alt` + `↓` | Abre a lista sem mudar a escolha. |
| `↓ / ↑` | Aberta: próxima / anterior opção, pulando as desabilitadas. Não dá a volta. |
| `Home / End` | Primeira / última opção (abre a lista se estiver fechada). |
| `PageUp / PageDown` | Aberta: sobe / desce 10 opções. |
| `a–z` | Busca por digitação (sem acentos; até 500ms entre as letras; repetir a letra percorre as opções). Aberta, move a opção ativa; fechada, escolhe direto, como o select nativo. |
| `Enter / Space` | Aberta: escolhe a opção ativa e fecha. |
| `Alt` + `↑` | Escolhe a opção ativa e fecha. |
| `Esc` | Fecha sem mudar a escolha. |
| `Tab` | Escolhe a opção ativa, fecha e segue para o próximo campo. |

> **Quando usar o Select** O `Select` nativo tem teclado, leitores de tela e o seletor do sistema (no celular) prontos. Prefira-o sempre que as opções forem só texto — o Picker existe para o que o `<select>` não consegue mostrar.

- **1.3.1** — Papéis combobox, listbox, option e group; rótulo, descrição e erro ligados por aria-labelledby e aria-describedby.
- **1.4.1** — Escolha indicada por check e peso do texto, não só por cor; opção ativa com barra lateral.
- **2.1.1** — Abrir, navegar, buscar e escolher pelo teclado, conforme o APG.
- **2.4.7** — Foco visível no campo (borda e anel laranja) e opção ativa destacada.
- **3.3.1** — Erro exposto com aria-invalid, texto ligado ao campo e borda vermelha.
- **4.1.2** — aria-expanded, aria-selected, aria-disabled e aria-activedescendant sempre atualizados.
- **4.1.3** — A escolha feita por digitação com a lista fechada é anunciada numa região role="status".
