# PinInput

Campos de um caractere para códigos de verificação (OTP) e PINs, com colar e preenchimento automático.

- Categoria: Formulários · Status: estável
- Importação: `import { PinInput } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/pin-input (em inglês: https://orange.llypedev.com.br/en/components/pin-input)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-pininput--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/PinInput

## Boas práticas

- Use apenas para códigos curtos e de tamanho fixo (4 a 8 caracteres): verificação por SMS/e-mail, autenticador, PIN.
- Diga na descrição para onde o código foi enviado e quantos caracteres ele tem; ofereça "Reenviar código".
- Verifique em `onComplete` — não exija um botão "Confirmar" extra — e mostre o erro com `error`.
- Não bloqueie colar nem o preenchimento automático: o primeiro campo usa `autocomplete="one-time-code"` para o celular sugerir o código do SMS.

## Exemplos

### Básico

O foco avança sozinho; colar o código inteiro em qualquer campo distribui os dígitos.

```tsx
import { PinInput } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [status, setStatus] = useState('')

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PinInput
        label="Código de verificação"
        description="Enviamos um código de 6 dígitos por SMS para (11) •••••-4821."
        onChange={() => setStatus('')}
        onComplete={(codigo) => setStatus(`Verificando o código ${codigo}…`)}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {status}
      </p>
    </div>
  )
}
```

### Mascarado e agrupado

`mask` oculta os caracteres; `groupSize` separa visualmente em blocos.

```tsx
import { PinInput } from '@orangesys/ui'

export default function Masked() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <PinInput
        label="Senha do cartão"
        description="4 dígitos. Os números ficam ocultos."
        length={4}
        mask
      />
      <PinInput label="Código do autenticador" length={6} groupSize={3} placeholder="·" />
    </div>
  )
}
```

### Alfanumérico

Com `type="alphanumeric"`, aceita letras e números e cada campo é anunciado como "Caractere N de 8".

```tsx
import { PinInput } from '@orangesys/ui'

export default function Alphanumeric() {
  return (
    <PinInput
      label="Código do cupom"
      description="Letras e números — tente colar “PRIMA2026”."
      type="alphanumeric"
      length={8}
      groupSize={4}
      size="sm"
    />
  )
}
```

### Validação e tentativas

```tsx
import { Button, PinInput } from '@orangesys/ui'
import { useState } from 'react'

const CODIGO_CORRETO = '274913'

export default function Validation() {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState<string>()
  const [tentativas, setTentativas] = useState(3)

  const verificar = (valor: string) => {
    if (valor === CODIGO_CORRETO) {
      setErro(undefined)
      return
    }
    const restantes = tentativas - 1
    setTentativas(restantes)
    setErro(
      restantes > 0
        ? `Código incorreto. ${restantes === 1 ? 'Resta 1 tentativa' : `Restam ${restantes} tentativas`}.`
        : 'Código bloqueado. Peça um novo código.',
    )
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PinInput
        label="Confirme o código"
        description={`Para testar, use ${CODIGO_CORRETO}.`}
        size="lg"
        value={codigo}
        onChange={(valor) => {
          setCodigo(valor)
          if (valor.length < 6) setErro(undefined)
        }}
        onComplete={verificar}
        error={erro}
        disabled={tentativas === 0}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-success-text)' }}>
        {codigo === CODIGO_CORRETO ? 'Telefone confirmado!' : ''}
      </p>
      <div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setCodigo('')
            setErro(undefined)
            setTentativas(3)
          }}
        >
          Reenviar código
        </Button>
      </div>
    </div>
  )
}
```

## Props

### `PinInput`

Campos de um caractere para códigos de verificação (OTP/PIN): avança
sozinho, aceita colar o código inteiro e o preenchimento automático do SMS.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `autoFocus` | `boolean` | — | Foca o primeiro campo ao montar. |
| `defaultValue` | `string` | — | Código inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `disabled` | `boolean` | — | — |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `groupSize` | `number` | — | Agrupa visualmente os campos (ex.: 3 → "123 456"). |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `id` | `string` | — | Id do primeiro campo. |
| `invalid` | `boolean` | — | Marca os campos como inválidos sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo do grupo. |
| `length` | `number` | `6` | Quantidade de caracteres. Padrão: 6. |
| `mask` | `boolean` | — | Oculta os caracteres (como em senhas). |
| `name` | `string` | — | Nome do campo oculto que envia o código completo no formulário. |
| `onChange` | `((value: string) => void)` | — | Chamado a cada alteração. |
| `onComplete` | `((value: string) => void)` | — | Chamado quando todos os campos estão preenchidos. |
| `placeholder` | `string` | — | Texto de exemplo em cada campo vazio (ex.: "○"). |
| `required` | `boolean` | — | Campo obrigatório: mostra `*` e marca o controle como `required`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Lado de cada campo: `sm` 32px, `md` 40px, `lg` 48px. |
| `type` | `"numeric" \| "alphanumeric"` | `numeric` | Caracteres aceitos. `numeric` abre o teclado numérico no celular. |
| `value` | `string` | — | Código digitado (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`PinInputSize`:

```ts
export type PinInputSize = 'sm' | 'md' | 'lg'
```

`PinInputType`:

```ts
export type PinInputType = 'numeric' | 'alphanumeric'
```

## Movimento

- **Digitar** — O campo preenchido faz um pop (scale 0.86 → 1, 250ms, bounce).
- **Colar / preencher automaticamente** — Os pops entram em onda, 40ms por campo.
- **Completar** — As bordas passam a success em onda (160ms cada, 40ms entre campos). Não é confirmação: verifique o código e mostre o erro se preciso.
- **Erro** — O grupo treme uma vez (or-shake, 400ms) quando o erro surge ou muda.
- **Foco** — Borda, anel e fundo laranja em 160ms, ease-out.
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

Os campos ficam em um `role="group"` nomeado pelo rótulo e descrito pela ajuda/erro. Cada campo tem um nome próprio — "Dígito 1 de 6" — vindo das mensagens do `OrangeProvider`. O primeiro campo usa `autocomplete="one-time-code"` e todos usam o `inputMode` adequado.

| Teclas | Ação |
| --- | --- |
| `0–9` | Preenche o campo e avança para o próximo. |
| `Backspace` | Apaga o caractere; em um campo vazio, volta e apaga o anterior. |
| `Delete` | Apaga o caractere sem mover o foco. |
| `← / →` | Move entre os campos. |
| `Home / End` | Primeiro/último campo. |
| `Ctrl` + `V` | Cola e distribui o código. |

- **1.3.1** — Grupo nomeado e campos com posição anunciada.
- **1.3.5** — Finalidade identificada com `autocomplete="one-time-code"`.
- **2.4.7** — Campo em foco com borda e fundo laranja.
- **3.3.1** — Erro em texto, ligado ao grupo e marcado com aria-invalid.
- **3.3.8** — Colar e preenchimento automático permitidos (autenticação acessível).
