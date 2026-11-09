# Form

Orquestra o envio de um formulário: valida no envio, resume os erros no topo com links para os campos, move o foco e bloqueia envio duplo.

- Categoria: Formulários · Status: estável
- Importação: `import { Form, FormActions } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/form (em inglês: https://orange.llypedev.com.br/en/components/form)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-form--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Form

## Boas práticas

- Valide no envio, não enquanto a pessoa digita. Depois de um envio com erros, os erros somem assim que são corrigidos — e erros novos só aparecem no próximo envio.
- Todo campo precisa de `name`: é a chave dos valores, dos erros e do link no resumo. Passe o erro para o campo com `error={errors.email}` (render-prop) ou `getError('email')` (`useForm()`).
- Escreva mensagens que digam como corrigir ("Informe um e-mail no formato nome@empresa.com"), não só o que está errado ("E-mail inválido").
- Erros do servidor vão em `errors`, somados aos de validação. Limpe-os no início do próximo envio.
- Não desabilite o botão de envio enquanto há erros — a pessoa precisa enviar para descobrir o que falta. Durante o envio, use `loading={isSubmitting}` no `Button`.

## Como funciona

- **Antes do primeiro envio** — Nada é validado nem exibido. O formulário usa noValidate: o navegador não mostra os balões nativos.
- **Envio com erros** — `validate(values)` roda com os valores lidos por `FormData`. Com erros, o envio é cancelado, o `ErrorSummary` aparece no topo (na ordem dos campos) e recebe o foco, e cada campo mostra sua mensagem. A cada novo envio com erros, o foco volta ao resumo.
- **Corrigindo** — Depois de um envio com erros, o formulário valida de novo a cada alteração (digitar, escolher uma opção, sair do campo) e tira os erros corrigidos do campo e do resumo. Um campo que estava válido e ficou inválido só ganha erro no próximo envio ("recompense cedo, puna tarde").
- **Erros externos** — `errors` (ex.: da API) aparece junto com a validação e move o foco para o resumo quando chega um erro novo. Cada erro externo some quando o valor do campo muda e volta se `errors` mudar. Erros externos não bloqueiam o envio: o servidor decide de novo.
- **Envio assíncrono** — Se `onSubmit` retorna uma promessa, o formulário fica com `aria-busy="true"`, `isSubmitting` vale `true` e novos envios (clique ou Enter) são ignorados até ela terminar. Trate falhas dentro do `onSubmit` (try/catch) e devolva-as em `errors`.
- **Envio válido** — `onSubmit(values, event)` é chamado e nada é exibido por padrão (veja "Depois do envio"). Sem `onSubmit`, o envio nativo segue para `action`. Um botão `type="reset"` limpa os erros e o contador de envios.

## Exemplos

### Cadastro

Envie vazio: o resumo aparece e recebe o foco; clique em um erro para ir ao campo. Os erros somem conforme você corrige.

```tsx
import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormActions,
  NumberField,
  TextField,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'
import { useState } from 'react'

const text = (value: FormValues[string]) => String(value ?? '').trim()

function validate(values: FormValues): FormErrors {
  const email = text(values.email)
  return {
    nome: text(values.nome) ? undefined : 'Informe seu nome completo.',
    email: !email
      ? 'Informe seu e-mail de trabalho.'
      : /^\S+@\S+\.\S+$/.test(email)
        ? undefined
        : 'Informe um e-mail no formato nome@empresa.com.',
    empresa: text(values.empresa) ? undefined : 'Informe o nome da empresa.',
    licencas: Number(values.licencas) >= 1 ? undefined : 'Informe quantas licenças a equipe precisa (mínimo 1).',
    termos: values.termos ? undefined : 'Aceite os termos de uso para criar a conta.',
  }
}

export default function SignUp() {
  const [createdFor, setCreatedFor] = useState<string | null>(null)

  return (
    <Form
      aria-label="Criar conta"
      validate={validate}
      onSubmit={(values) => setCreatedFor(text(values.email))}
      style={{ width: '100%', maxWidth: 520 }}
    >
      {({ errors }) => (
        <>
          {createdFor && (
            <Alert tone="success" live title="Conta criada">
              Enviamos o link de acesso para {createdFor}.
            </Alert>
          )}
          <TextField name="nome" label="Nome completo" autoComplete="name" error={errors.nome} />
          <TextField
            name="email"
            type="email"
            label="E-mail de trabalho"
            autoComplete="email"
            error={errors.email}
          />
          <TextField name="empresa" label="Empresa" autoComplete="organization" error={errors.empresa} />
          <NumberField
            name="licencas"
            label="Número de licenças"
            description="Uma por pessoa que vai usar o sistema."
            min={1}
            max={500}
            style={{ maxWidth: 200 }}
            error={errors.licencas}
          />
          <Checkbox name="termos" label="Li e aceito os termos de uso" error={errors.termos} />
          <FormActions>
            <Button type="submit">Criar conta</Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}
```

### Endereço de entrega

Fieldset, Select e RadioGroup no mesmo formulário. O link de um grupo de opções foca a opção marcada ou a primeira.

```tsx
import {
  Button,
  Fieldset,
  Form,
  FormActions,
  RadioGroup,
  Select,
  TextField,
  useToast,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'

const text = (value: FormValues[string]) => String(value ?? '').trim()

const estados = [
  { value: 'BA', label: 'Bahia' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PR', label: 'Paraná' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'SP', label: 'São Paulo' },
]

function validate(values: FormValues): FormErrors {
  const cep = text(values.cep)
  return {
    cep: !cep ? 'Informe o CEP.' : /^\d{5}-?\d{3}$/.test(cep) ? undefined : 'O CEP tem 8 números, como 00000-000.',
    rua: text(values.rua) ? undefined : 'Informe a rua ou avenida.',
    numero: text(values.numero) ? undefined : 'Informe o número (ou "s/n").',
    cidade: text(values.cidade) ? undefined : 'Informe a cidade.',
    estado: values.estado ? undefined : 'Escolha o estado.',
    janela: values.janela ? undefined : 'Escolha um período para a entrega.',
  }
}

export default function Delivery() {
  const { toast } = useToast()

  return (
    <Form
      aria-label="Endereço de entrega"
      validate={validate}
      onSubmit={() => {
        toast({ title: 'Endereço confirmado', tone: 'success' })
      }}
      style={{ width: '100%', maxWidth: 560 }}
    >
      {({ errors }) => (
        <>
          <Fieldset legend="Endereço de entrega" description="Enviaremos o pedido para este endereço.">
            <TextField
              name="cep"
              label="CEP"
              inputMode="numeric"
              autoComplete="postal-code"
              style={{ maxWidth: 200 }}
              error={errors.cep}
            />
            <TextField name="rua" label="Rua" autoComplete="address-line1" error={errors.rua} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
              <TextField name="numero" label="Número" error={errors.numero} />
              <TextField name="complemento" label="Complemento" optional autoComplete="address-line2" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <TextField name="cidade" label="Cidade" autoComplete="address-level2" error={errors.cidade} />
              <Select
                name="estado"
                label="Estado"
                placeholder="Selecione"
                autoComplete="address-level1"
                options={estados}
                error={errors.estado}
              />
            </div>
          </Fieldset>
          <RadioGroup
            name="janela"
            label="Período de entrega"
            orientation="horizontal"
            error={errors.janela}
            options={[
              { value: 'manha', label: 'Manhã (8h–12h)' },
              { value: 'tarde', label: 'Tarde (13h–18h)' },
            ]}
          />
          <FormActions align="between">
            <Button type="button" variant="outline">
              Voltar ao carrinho
            </Button>
            <Button type="submit">Continuar para o pagamento</Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}
```

### Envio assíncrono com erro do servidor

Durante o envio, o botão mostra o carregamento e o formulário ignora novos envios. O erro "e-mail já cadastrado" vem da API por errors.

```tsx
import { Alert, Button, Form, FormActions, TextField, type FormErrors, type FormValues } from '@orangesys/ui'
import { useState } from 'react'

const text = (value: FormValues[string]) => String(value ?? '').trim()

/** Simula a API: e-mails @acme.com.br já têm conta. */
async function convidar(email: string): Promise<{ ok: true } | { ok: false; errors: FormErrors }> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  if (email.endsWith('@acme.com.br')) {
    return { ok: false, errors: { email: 'Este e-mail já está cadastrado. Peça para a pessoa entrar na conta dela.' } }
  }
  return { ok: true }
}

export default function ServerError() {
  const [serverErrors, setServerErrors] = useState<FormErrors>({})
  const [invited, setInvited] = useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setServerErrors({}) // limpa os erros do envio anterior
    setInvited(null)
    const result = await convidar(text(values.email))
    if (result.ok) setInvited(text(values.email))
    else setServerErrors(result.errors)
  }

  return (
    <Form
      aria-label="Convidar pessoa"
      errors={serverErrors}
      onSubmit={onSubmit}
      validate={(values) => ({
        email: /^\S+@\S+\.\S+$/.test(text(values.email)) ? undefined : 'Informe um e-mail no formato nome@empresa.com.',
      })}
      style={{ width: '100%', maxWidth: 520 }}
    >
      {({ errors, isSubmitting }) => (
        <>
          {invited && (
            <Alert tone="success" live title="Convite enviado">
              {invited} vai receber um link para entrar na equipe.
            </Alert>
          )}
          <TextField
            name="email"
            type="email"
            label="E-mail de trabalho"
            description="Use ana@acme.com.br para ver o erro do servidor."
            error={errors.email}
          />
          <FormActions>
            <Button type="submit" loading={isSubmitting} loadingText="Enviando convite">
              Enviar convite
            </Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}
```

### Select, DatePicker e useForm()

Campos em um componente próprio leem os erros com useForm(). O DatePicker envia a data como AAAA-MM-DD.

```tsx
import {
  Button,
  DatePicker,
  Form,
  FormActions,
  Select,
  TextArea,
  useForm,
  useToast,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'

const today = new Date()
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6

function validate(values: FormValues): FormErrors {
  return {
    produto: values.produto ? undefined : 'Escolha o produto da demonstração.',
    data: values.data ? undefined : 'Escolha uma data em dia útil.',
  }
}

/** Campos em um componente próprio: os erros chegam por useForm(). */
function DemoFields() {
  const { getError } = useForm()
  return (
    <>
      <Select
        name="produto"
        label="Produto"
        placeholder="Selecione um produto"
        error={getError('produto')}
        options={[
          { value: 'financeiro', label: 'Gestão financeira' },
          { value: 'estoque', label: 'Controle de estoque' },
          { value: 'fiscal', label: 'Emissão de notas fiscais' },
        ]}
      />
      <DatePicker
        name="data"
        label="Data da demonstração"
        description="De segunda a sexta."
        min={today}
        isDateDisabled={isWeekend}
        error={getError('data')}
      />
      <TextArea name="observacoes" label="O que você quer ver?" optional rows={3} />
    </>
  )
}

// O ToastProvider fica uma vez na raiz da aplicação.
export default function Schedule() {
  const { toast } = useToast()
  const formatDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR')

  return (
    <Form
      aria-label="Agendar demonstração"
      validate={validate}
      onSubmit={(values) => {
        toast({
          title: 'Demonstração agendada',
          description: `Dia ${formatDate(String(values.data))}. O convite chega no seu e-mail.`,
          tone: 'success',
        })
      }}
      style={{ width: '100%', maxWidth: 520 }}
    >
      <DemoFields />
      <FormActions>
        <Button type="submit">Agendar demonstração</Button>
      </FormActions>
    </Form>
  )
}
```

## Campos e valores

Os valores vêm de `new FormData(form)`: cada controle com `name` vira uma chave. Vários controles com o mesmo `name` viram uma lista (só quando há dois ou mais valores). Caixas desmarcadas e campos de arquivo vazios ficam de fora. O botão que enviou entra se tiver `name`.

- **name no controle nativo** — TextField, TextArea, PasswordField, Search, TimeField, ColorField, Select, Checkbox, CheckboxGroup, RadioGroup, SegmentedControl, Rating, Slider (com range, dois valores → lista) e FileUploader (File).
- **name em input oculto** — Combobox e Picker (valor da opção; vazio sem escolha), MultiSelect e TagInput (um por item → lista), DatePicker (AAAA-MM-DD), DateTimePicker (AAAA-MM-DDTHH:mm, hora local), NumberField (número sem formatação), CurrencyField, PinInput e Switch (value quando ligado). O link do resumo foca o controle visível do campo.
- **Sem input quando vazio** — MultiSelect e TagInput sem itens e Switch desligado não renderizam o input oculto. Para que o link do resumo encontre o campo, dê ao componente um `id` igual ao `name`.
- **RadioGroup** — Sem `name`, o grupo gera um nome automático — sempre informe o `name` para ler o valor.

## Depois do envio

O `Form` não mostra mensagem de sucesso: quem decide é a tela. Para uma confirmação curta, chame `toast()` no fim do `onSubmit`; para uma mensagem que fica no lugar, mostre um `Alert` com `live` no topo do formulário (anunciado por `role="status"`). Se a tela muda depois do envio, mova o foco para o título da próxima tela.

```tsx
import { Alert, Button, Form, FormActions, TextField, useToast } from '@orangesys/ui'

// Toast: confirmação curta, a pessoa continua na mesma tela.
function Perfil() {
  const { toast } = useToast() // ToastProvider na raiz da aplicação
  return (
    <Form
      onSubmit={async (values) => {
        await salvarPerfil(values)
        toast({ title: 'Perfil atualizado', tone: 'success' })
      }}
    >
      {({ isSubmitting }) => (
        <>
          <TextField name="nome" label="Nome de exibição" />
          <FormActions>
            <Button type="submit" loading={isSubmitting}>Salvar</Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}

// Alert: mensagem que fica no lugar, ligada ao formulário.
{enviado && (
  <Alert tone="success" live title="Pedido enviado">
    Você vai receber a confirmação por e-mail.
  </Alert>
)}
```

> **Erros não vão em toasts** Toasts somem sozinhos e ficam longe do campo. Erros de formulário vão no resumo e junto do campo (errors).

## Movimento

O `Form` não anima nada por conta própria: reaproveita o movimento do `ErrorSummary` e dos campos, para que nada se mova duas vezes. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora.

- **Resumo aparece** — Desce deslizando (or-slide-down-in, 250ms, --or-ease-out) e os erros entram em sequência, 40ms entre itens. Em envios seguintes com erros, o resumo continua montado e só recebe o foco — sem repetir a entrada.
- **Erro no campo** — A mensagem entra com fade e 4px de deslocamento (250ms). TextField, TextArea, Checkbox, RadioGroup e CheckboxGroup tremem uma vez (or-shake, 400ms) quando passam a ficar inválidos — não de novo enquanto o erro continua.
- **Erros corrigidos** — O item sai da lista e a mensagem do campo some; quando não sobra nenhum erro, o resumo sai com fade de 160ms (--or-ease-in-out).
- **Enviando** — O spinner do Button (loading) gira em loop enquanto a promessa está pendente; o cursor vira "progress" sobre o formulário.

## Props

### `Form`

Orquestra um formulário no padrão GOV.UK: valida no envio, mostra um
`ErrorSummary` no topo com links para cada campo inválido, move o foco para
ele e, depois do primeiro envio, tira os erros conforme são corrigidos. Os
erros chegam aos campos pelo render-prop `children` ou por `useForm()`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode \| ((state: FormState) => ReactNode)` | — | Conteúdo do formulário, ou uma função que recebe o `FormState`. |
| `errors` | `FormErrors` | — | Erros externos (ex.: retornados pela API), somados aos de validação. Cada um some quando o valor daquele campo muda e volta se `errors` mudar. |
| `errorSummary` | `boolean` | `true` | Mostra o `ErrorSummary` no topo depois de um envio com erros. Padrão: `true`. |
| `errorSummaryTitle` | `ReactNode` | — | Título do resumo. Padrão: "Corrija os seguintes erros" (dicionário de mensagens). |
| `gap` | `"sm" \| "md" \| "lg"` | `md` | Espaçamento entre os filhos: `sm` 12px, `md` 20px, `lg` 32px. Padrão: `md`. |
| `onSubmit` | `((values: FormValues, event: FormEvent<HTMLFormElement>) => unknown)` | — | Chamado só quando não há erros de validação. Se retornar uma promessa, o formulário fica `aria-busy` e bloqueia novos envios até ela terminar. Sem `onSubmit`, um envio válido segue o caminho nativo (`action`/`method`). |
| `validate` | `((values: FormValues) => FormErrors)` | — | Validação síncrona, chamada no envio com os valores do formulário. Retorne uma mensagem por `name` inválido. Depois de um envio com erros, roda de novo a cada alteração para tirar os erros já corrigidos. |

Repassa também os atributos nativos (`FormHTMLAttributes`) do `<form>`, como `id`, `action`, `method` e `noValidate`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### `FormActions`

Linha de botões no fim do formulário: espaçamento padrão, quebra de linha em
telas estreitas e alinhamento. Coloque o botão de envio primeiro na ordem de leitura.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `align` | `"start" \| "end" \| "between"` | `start` | Alinhamento dos botões: `start` (padrão), `end` ou `between` (ex.: Voltar … Continuar). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`FormErrors`:

```ts
/** Mensagens de erro por `name`. `undefined` ou `''` = sem erro. */
export type FormErrors = Record<string, string | undefined>
```

`FormState`:

```ts
/** Estado exposto pelo render-prop `children` e pelo hook `useForm()`. */
export interface FormState {
  /** Erros visíveis agora (validação depois do envio + erros externos), por `name`. */
  errors: Record<string, string>
  /** `true` enquanto a promessa retornada por `onSubmit` está pendente. */
  isSubmitting: boolean
  /** Número de tentativas de envio (válidas ou não). */
  submitCount: number
  /** `true` quando não há erros visíveis. Antes do primeiro envio, é sempre `true`. */
  isValid: boolean
  /** Mensagem de erro visível de um campo. */
  getError: (name: string) => string | undefined
}
```

`FormValue`:

```ts
/** Valor de um campo: texto (ou `File`), ou uma lista quando vários controles têm o mesmo `name`. */
export type FormValue = FormDataEntryValue | FormDataEntryValue[]
```

`FormValues`:

```ts
/** Valores do formulário por `name`, lidos com `FormData`. Campos ausentes (caixa desmarcada) ficam de fora. */
export type FormValues = Record<string, FormValue | undefined>
```

## Acessibilidade

Segue o padrão de erros do GOV.UK. Ao enviar com erros, o foco vai para o resumo, que é lido pelo leitor de tela (título e lista). Cada link leva ao campo: a página rola até o rótulo (ou a legenda do grupo) e o foco vai para o controle. Os campos recebem `aria-invalid` e a mensagem por `aria-describedby`, via `Field`. Durante o envio, o formulário fica com `aria-busy="true"` e o `Button` em `loading` anuncia o status.

| Teclas | Ação |
| --- | --- |
| `Enter` | Num campo de texto, envia o formulário (envio implícito); ignorado durante um envio. |
| `Tab` | A partir do resumo focado, percorre os links de erro e depois os campos. |
| `Enter` | Num link do resumo, foca o campo do erro. |

- **2.4.3** — Foco vai para o resumo após o envio e dele para cada campo, na ordem do formulário.
- **3.3.1** — Erros identificados em texto no resumo e junto de cada campo.
- **3.3.3** — As mensagens sugerem como corrigir; erros corrigidos somem na hora.
- **4.1.3** — O resumo é anunciado ao receber o foco; o envio em andamento é exposto com `aria-busy` e o status do Button.
