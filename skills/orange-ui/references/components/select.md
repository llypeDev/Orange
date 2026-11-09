# Select

Lista suspensa nativa para escolher uma opção entre poucas — com rótulo, ajuda e erro integrados.

- Categoria: Formulários · Status: estável
- Importação: `import { Select } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/select (em inglês: https://orange.llypedev.com.br/en/components/select)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-select--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Select

## Boas práticas

- Use para escolher **uma** opção entre poucas (até ~15). Para listas longas ou com busca, use **Combobox**; para várias opções, **MultiSelect**.
- Com 2 a 4 opções que cabem na tela, prefira botões de rádio: todas ficam visíveis sem clique extra.
- O `<select>` nativo só mostra texto. Quando as opções precisam de ícone, descrição ou grupos estilizados, use o **Picker**.
- Ordene as opções de forma previsível (alfabética, cronológica ou por frequência de uso) e use `placeholder` quando não houver um padrão sensato.
- Não use o Select para navegar entre páginas ou disparar ações — ele só escolhe um valor.

- Faça: Rótulo visível e um padrão sensato.
- Evite: Usar o placeholder como único rótulo — ele some depois da escolha.

## Exemplos

### Básico

Rótulo, descrição e placeholder. O texto de ajuda é ligado ao campo por aria-describedby.

```tsx
import { Select } from '@orangesys/ui'

const estados = [
  { value: 'ba', label: 'Bahia' },
  { value: 'mg', label: 'Minas Gerais' },
  { value: 'pr', label: 'Paraná' },
  { value: 'pe', label: 'Pernambuco' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'rs', label: 'Rio Grande do Sul' },
  { value: 'sp', label: 'São Paulo' },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Select
        label="Estado"
        description="Usado para calcular o frete e os impostos."
        placeholder="Selecione um estado"
        options={estados}
        name="estado"
      />
    </div>
  )
}
```

### Grupos de opções

Passe objetos `{ label, options }` para gerar `<optgroup>`. Opções podem ser desabilitadas.

```tsx
import { Select } from '@orangesys/ui'

export default function Groups() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Select
        label="Plano"
        placeholder="Escolha um plano"
        options={[
          {
            label: 'Cobrança mensal',
            options: [
              { value: 'starter-m', label: 'Starter — R$ 49/mês' },
              { value: 'pro-m', label: 'Pro — R$ 129/mês' },
            ],
          },
          {
            label: 'Cobrança anual (2 meses grátis)',
            options: [
              { value: 'starter-a', label: 'Starter — R$ 490/ano' },
              { value: 'pro-a', label: 'Pro — R$ 1.290/ano' },
              { value: 'enterprise', label: 'Enterprise — fale com vendas', disabled: true },
            ],
          },
        ]}
      />
    </div>
  )
}
```

### Tamanhos

sm (32px), md (40px, padrão) e lg (48px).

```tsx
import { Select } from '@orangesys/ui'

const ordenacao = [
  { value: 'relevancia', label: 'Mais relevantes' },
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'preco-asc', label: 'Menor preço' },
  { value: 'preco-desc', label: 'Maior preço' },
]

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}>
      <Select size="sm" label="Ordenar por (sm)" options={ordenacao} />
      <Select size="md" label="Ordenar por (md)" options={ordenacao} />
      <Select size="lg" label="Ordenar por (lg)" options={ordenacao} />
    </div>
  )
}
```

### Validação e desabilitado

Com required, o placeholder vira uma opção desabilitada. A mensagem de erro aparece após o envio.

```tsx
import { Button, Select } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [motivo, setMotivo] = useState('')
  const [enviado, setEnviado] = useState(false)
  const erro = enviado && !motivo ? 'Selecione um motivo para continuar.' : undefined

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form
      noValidate
      onSubmit={enviar}
      style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}
    >
      <Select
        label="Motivo do cancelamento"
        placeholder="Selecione"
        required
        value={motivo}
        onChange={(event) => setMotivo(event.target.value)}
        error={erro}
        options={[
          { value: 'preco', label: 'O preço ficou alto' },
          { value: 'uso', label: 'Não uso mais o serviço' },
          { value: 'concorrente', label: 'Mudei para outra empresa' },
          { value: 'outro', label: 'Outro motivo' },
        ]}
      />
      <Select
        label="Conta"
        options={[{ value: 'pj', label: 'Empresa — CNPJ final 0001' }]}
        disabled
      />
      <div>
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  )
}
```

## Props

### `Select`

Lista suspensa baseada no `<select>` nativo: teclado, leitores de tela e
foco vêm prontos. Onde o navegador suporta o select customizável
(`appearance: base-select`), a lista aberta também ganha o visual do Orange;
nos demais, abre o seletor do sistema. Use para escolher uma opção entre
poucas (até ~15). Para listas longas com busca, use `Combobox`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `className` | `string` | — | Classe aplicada ao contêiner externo. |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Marca o campo como inválido sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `options` | `(SelectOption \| SelectOptionGroup)[]` | — | Opções (ou grupos de opções). Alternativa a passar `<option>`/`<optgroup>` como children. |
| `placeholder` | `string` | — | Texto exibido enquanto nada foi escolhido (opção de valor vazio). Se o campo for `required`, a opção fica desabilitada e não pode ser escolhida de volta. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

- **Hover** — Borda clareia e o fundo muda para bg-subtle em 160ms (ease-out); o chevron escurece e desce 2px em 250ms, spring.
- **Foco** — Borda e anel laranja em 160ms, ease-out; o chevron responde igual ao hover.
- **Clique** — O chevron "afunda" mais 1px em 90ms (press).
- **Lista aberta** — Com select customizável (appearance: base-select, Chrome e Edge recentes), a lista entra descendo 6px com fade em 160ms (ease-out) e sai recuando 4px em 120ms; o chevron gira 180° em 250ms, spring. A opção ativa ganha fundo e a barra laranja à esquerda, que cresce do centro com spring. Sem suporte, a lista é a nativa do sistema.
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

Renderiza um `<select>` nativo: leitores de tela anunciam rótulo, valor e posição da opção. Só a aparência é personalizada — o chevron é decorativo ( `aria-hidden`). Onde o navegador suporta o select customizável ( `appearance: base-select`), a lista aberta também ganha o visual do Orange, com o mesmo teclado, foco e anúncios do select nativo; nos demais, abre o seletor do sistema. Rótulos muito longos são cortados no campo fechado — mantenha-os curtos.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o campo. |
| `↑ / ↓` | Muda a opção selecionada (ou navega na lista aberta). |
| `Alt` + `↓` | Abre a lista de opções (Windows/Linux). |
| `Space` | Abre a lista de opções. |
| `A–Z` | Vai para a opção que começa com a letra digitada. |
| `Esc` | Fecha a lista sem mudar o valor. |

- **1.3.1** — Rótulo ligado por `for`/`id`; ajuda e erro por `aria-describedby`.
- **2.1.1** — Teclado completo do controle nativo.
- **2.4.7** — Foco visível com borda e anel laranja.
- **3.3.1** — Erro exposto com `aria-invalid` e mensagem em texto.
- **3.3.2** — Rótulo sempre visível (ou oculto, mas presente para leitores de tela).
