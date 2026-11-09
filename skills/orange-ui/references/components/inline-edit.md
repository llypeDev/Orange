# InlineEdit

Edição no lugar: o valor vira um campo ao ser ativado e salva com Enter ou ao sair.

- Categoria: Formulários · Status: estável
- Importação: `import { InlineEdit } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/inline-edit (em inglês: https://orange.llypedev.com.br/en/components/inline-edit)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-inlineedit--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/InlineEdit

## Boas práticas

- Use para ajustes pontuais em telas de leitura (nome de um projeto, um campo de perfil). Para formulários com vários campos obrigatórios, use um formulário normal com botão Salvar.
- Sempre passe `label`, mesmo sem mostrá-lo: ele forma o nome acessível "Editar Nome do projeto: Checkout 2.0".
- Se salvar envolve a rede, retorne uma Promise em `onSave`: o campo mostra o carregamento e, se der erro, continua em edição com a mensagem.
- Em campos sensíveis (e-mail, valores), use `showButtons` e `saveOnBlur={false}` para que a pessoa confirme a alteração explicitamente.

## Exemplos

### Básico

Clique no valor (ou Enter com foco) para editar. Enter ou sair do campo salva; Escape cancela.

```tsx
import { InlineEdit } from '@orangesys/ui'

export default function Basic() {
  return <InlineEdit label="Nome do projeto" showLabel defaultValue="Checkout 2.0" />
}
```

### Salvamento assíncrono

onSave retorna uma Promise. Tente "Financeiro" para ver o erro do servidor, ou deixe vazio para ver a validação.

```tsx
import { InlineEdit } from '@orangesys/ui'
import { useState } from 'react'

const nomesEmUso = ['financeiro', 'marketing']

// Simula uma chamada à API que leva 1 segundo.
const salvarNaApi = (nome: string) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      if (nomesEmUso.includes(nome.trim().toLowerCase()))
        reject(new Error(`Já existe um time chamado "${nome}".`))
      else resolve()
    }, 1000),
  )

export default function AsyncSave() {
  const [nome, setNome] = useState('Plataforma')

  return (
    <InlineEdit
      label="Nome do time"
      showLabel
      value={nome}
      onSave={async (novo) => {
        await salvarNaApi(novo)
        setNome(novo)
      }}
      validate={(valor) => (valor.trim() ? null : 'O nome não pode ficar vazio.')}
    />
  )
}
```

### Com botões e validação

Salvar e Cancelar explícitos; sair do campo não salva.

```tsx
import { InlineEdit } from '@orangesys/ui'

export default function WithButtons() {
  return (
    <InlineEdit
      label="E-mail de cobrança"
      showLabel
      showButtons
      saveOnBlur={false}
      defaultValue="financeiro@orange.dev"
      inputProps={{ type: 'email', autoComplete: 'email' }}
      validate={(valor) =>
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(valor)
          ? null
          : 'Informe um e-mail no formato nome@empresa.com.'
      }
    />
  )
}
```

### Perfil editável

Vários campos em uma lista de definição, com placeholder para valores vazios.

```tsx
import { InlineEdit } from '@orangesys/ui'

const campos = [
  { label: 'Nome completo', valor: 'Ana Beatriz Costa' },
  { label: 'Cargo', valor: 'Designer de produto' },
  { label: 'Telefone comercial', valor: '' },
  { label: 'Cidade', valor: 'Recife, PE' },
]

export default function Profile() {
  return (
    <dl style={{ display: 'grid', gap: 4, margin: 0, width: '100%', maxWidth: 560 }}>
      {campos.map((campo) => (
        // Rótulo e valor lado a lado; sem largura para os dois (celular), o valor desce.
        <div
          key={campo.label}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 24 }}
        >
          <dt className="or-eyebrow" style={{ flex: '0 0 144px' }}>
            {campo.label}
          </dt>
          <dd style={{ flex: '1 1 200px', minWidth: 0, margin: 0 }}>
            <InlineEdit
              label={campo.label}
              defaultValue={campo.valor}
              placeholder="Adicionar"
              size="sm"
            />
          </dd>
        </div>
      ))}
    </dl>
  )
}
```

### Tamanhos e estados

```tsx
import { InlineEdit } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <InlineEdit label="Título (lg)" size="lg" defaultValue="Relatório trimestral" />
      <InlineEdit label="Subtítulo (md)" size="md" defaultValue="Resultados de julho a setembro" />
      <InlineEdit label="Nota (sm)" size="sm" defaultValue="" placeholder="Adicionar uma nota" />
      <InlineEdit label="Código do projeto" disabled defaultValue="ORG-2026-114" />
    </div>
  )
}
```

## Movimento

- **Entrar e sair da edição** — O campo entra com fade + 2px e o valor volta com fade · fast (160ms). Só anima depois da primeira interação — nada se move no carregamento.
- **Salvar** — Flash verde sutil (borda e fundo) no valor salvo · reveal (600ms), ease-out.
- **Erro** — O campo treme a cada tentativa inválida (or-shake) · slow; a mensagem desce com fade · fast.
- **Hover e foco no valor** — Fundo e borda · fast; o lápis entra deslizando 4px · medium.
- **Pressionar** — O valor afunda 1px · press (90ms).
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `InlineEdit`

Edição no lugar: o valor aparece como texto clicável e vira um campo ao
ser ativado. Enter ou sair do campo salva, Escape cancela.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `string` | — | Nome do campo, usado nos nomes acessíveis ("Editar <label>: <valor>"). |
| `defaultValue` | `string` | — | Valor inicial (não controlado). |
| `disabled` | `boolean` | `false` | — |
| `inputProps` | `Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" \| "onChange" \| "value">` | — | Atributos extras do `<input>` (maxLength, type, inputMode…). |
| `onCancel` | `(() => void)` | — | Chamado quando a edição é cancelada (Escape ou botão Cancelar). |
| `onSave` | `((value: string) => void \| Promise<void>)` | — | Chamado ao salvar (Enter, sair do campo ou botão Salvar) com o novo valor. Pode retornar uma Promise: o campo mostra o carregamento e, se ela for rejeitada, continua em edição exibindo o erro. |
| `placeholder` | `string` | — | Texto exibido quando não há valor ("Adicionar descrição"). |
| `saveOnBlur` | `boolean` | `true` | Salva ao tirar o foco do campo. Padrão: `true`. |
| `showButtons` | `boolean` | `false` | Mostra botões Salvar/Cancelar durante a edição. |
| `showLabel` | `boolean` | `false` | Mostra o rótulo acima do valor (estilo eyebrow). |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura: `sm` 32px, `md` 40px, `lg` 48px. |
| `validate` | `((value: string) => string \| null)` | — | Retorna uma mensagem de erro para impedir o salvamento. |
| `value` | `string` | — | Valor salvo (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`InlineEditSize`:

```ts
export type InlineEditSize = 'sm' | 'md' | 'lg'
```

## Acessibilidade

Em leitura, o valor é um `<button>` com nome "Editar <rótulo>: <valor>" (o texto visível faz parte do nome). Ao ativar, o campo recebe foco com o texto selecionado; ao salvar com Enter ou cancelar com Escape, o foco volta ao botão. Durante o salvamento o campo fica `aria-busy` e "Salvando…" é anunciado; erros ficam ligados por `aria-describedby`.

| Teclas | Ação |
| --- | --- |
| `Enter` | No botão: entra em edição. No campo: salva. |
| `Space` | No botão: entra em edição. |
| `Escape` | Cancela, restaura o valor e devolve o foco. |
| `Tab` | Sai do campo e salva (ou vai para Salvar/Cancelar com showButtons). |

- **2.4.3** — Foco previsível: entra no campo ao editar e volta ao botão ao concluir.
- **2.5.3** — O nome acessível contém o texto visível do valor.
- **3.3.1** — Erros de validação e de salvamento descritos em texto.
- **4.1.3** — Estado de salvamento anunciado via `role="status"`.
