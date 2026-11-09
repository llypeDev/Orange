# Combobox

Campo de texto com lista de sugestões filtrada enquanto se digita, para escolher uma opção em listas longas.

- Categoria: Formulários · Status: estável
- Importação: `import { Combobox } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/combobox (em inglês: https://orange.llypedev.com.br/en/components/combobox)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-combobox--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Combobox

## Boas práticas

- Use quando houver muitas opções (cidades, clientes, bancos) e o usuário souber o que procura. Para até ~15 opções, o **Select** nativo é mais simples.
- O valor sempre vem da lista: texto que não corresponde a nenhuma opção é descartado ao sair do campo. Para texto livre com sugestões, use um campo de texto comum.
- Use `description` nas opções para desambiguar (estado de uma cidade, e-mail de um cliente) — ela também entra na busca.
- Em buscas no servidor, passe `filter={false}`, atualize `options` em `onInputChange` e indique `loading`.

## Exemplos

### Básico

A busca ignora acentos e caixa, destaca o trecho encontrado e já marca o primeiro resultado — Enter escolhe.

```tsx
import { Combobox } from '@orangesys/ui'

const cidades = [
  { value: 'bel', label: 'Belém', description: 'Pará' },
  { value: 'bh', label: 'Belo Horizonte', description: 'Minas Gerais' },
  { value: 'bsb', label: 'Brasília', description: 'Distrito Federal' },
  { value: 'cwb', label: 'Curitiba', description: 'Paraná' },
  { value: 'fln', label: 'Florianópolis', description: 'Santa Catarina' },
  { value: 'for', label: 'Fortaleza', description: 'Ceará' },
  { value: 'gyn', label: 'Goiânia', description: 'Goiás' },
  { value: 'mao', label: 'Manaus', description: 'Amazonas' },
  { value: 'poa', label: 'Porto Alegre', description: 'Rio Grande do Sul' },
  { value: 'rec', label: 'Recife', description: 'Pernambuco' },
  { value: 'rio', label: 'Rio de Janeiro', description: 'Rio de Janeiro' },
  { value: 'ssa', label: 'Salvador', description: 'Bahia' },
  { value: 'sp', label: 'São Paulo', description: 'São Paulo' },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Combobox
        label="Cidade de entrega"
        description="Digite para filtrar — acentos são ignorados (tente “sao”)."
        placeholder="Buscar cidade"
        options={cidades}
        name="cidade"
      />
    </div>
  )
}
```

### Busca assíncrona

Resultados vindos de uma API simulada. A contagem de resultados é anunciada para leitores de tela.

```tsx
import { Combobox, type ComboboxOption } from '@orangesys/ui'
import { useEffect, useState } from 'react'

const clientes: ComboboxOption[] = [
  { value: 'c-101', label: 'Ana Beatriz Souza', description: 'ana.souza@lumen.com.br' },
  { value: 'c-102', label: 'Bruno Carvalho', description: 'bruno@padariadobairro.com' },
  { value: 'c-103', label: 'Carla Menezes', description: 'carla.menezes@vertice.io' },
  { value: 'c-104', label: 'Diego Ramos', description: 'diego@ramosarquitetura.com' },
  { value: 'c-105', label: 'Elaine Toledo', description: 'elaine.toledo@clinicavida.med.br' },
  { value: 'c-106', label: 'Fábio Nogueira', description: 'fabio@nogueiraeassociados.adv.br' },
]

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Simula uma chamada à API com 700 ms de latência. */
function buscarClientes(termo: string): Promise<ComboboxOption[]> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          clientes.filter((c) =>
            normalizar(`${c.label} ${c.description}`).includes(normalizar(termo)),
          ),
        ),
      700,
    ),
  )
}

export default function Async() {
  const [termo, setTermo] = useState('')
  const [opcoes, setOpcoes] = useState<ComboboxOption[]>([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (termo.trim().length < 2) {
      setOpcoes([])
      return
    }
    let ativo = true
    setCarregando(true)
    buscarClientes(termo).then((resultado) => {
      if (!ativo) return
      setOpcoes(resultado)
      setCarregando(false)
    })
    return () => {
      ativo = false
    }
  }, [termo])

  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Combobox
        label="Cliente"
        placeholder="Nome ou e-mail"
        options={opcoes}
        filter={false}
        loading={carregando}
        onInputChange={setTermo}
        emptyMessage={termo.trim().length < 2 ? 'Digite ao menos 2 letras' : undefined}
      />
    </div>
  )
}
```

### Controlado

Com `value` e `onChange`, o valor pode ser alterado de fora. Opções podem ser desabilitadas.

```tsx
import { Button, Combobox, Stack, type ComboboxOption } from '@orangesys/ui'
import { useState } from 'react'

const fusos: ComboboxOption[] = [
  { value: 'America/Noronha', label: 'Fernando de Noronha', description: 'UTC−02:00' },
  { value: 'America/Sao_Paulo', label: 'Brasília', description: 'UTC−03:00' },
  { value: 'America/Manaus', label: 'Amazonas', description: 'UTC−04:00' },
  { value: 'America/Rio_Branco', label: 'Acre', description: 'UTC−05:00' },
  { value: 'Europe/Lisbon', label: 'Lisboa', description: 'UTC+00:00' },
  { value: 'America/New_York', label: 'Nova York', description: 'UTC−05:00', disabled: true },
]

export default function Controlled() {
  const [fuso, setFuso] = useState<string | null>('America/Sao_Paulo')

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 380 }}>
      <Combobox
        label="Fuso horário"
        options={fusos}
        value={fuso}
        onChange={(value) => setFuso(value)}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Valor salvo: <code>{fuso ?? 'nenhum'}</code>
      </p>
      <div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFuso(Intl.DateTimeFormat().resolvedOptions().timeZone)}
        >
          Usar fuso do navegador
        </Button>
      </div>
    </Stack>
  )
}
```

### Tamanhos e estados

```tsx
import { Combobox, Stack } from '@orangesys/ui'

const bancos = [
  { value: '001', label: '001 — Banco do Brasil' },
  { value: '033', label: '033 — Santander' },
  { value: '104', label: '104 — Caixa Econômica Federal' },
  { value: '237', label: '237 — Bradesco' },
  { value: '260', label: '260 — Nu Pagamentos' },
  { value: '341', label: '341 — Itaú Unibanco' },
]

export default function States() {
  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 380 }}>
      <Combobox size="sm" label="Banco (sm)" options={bancos} placeholder="Código ou nome" />
      <Combobox
        label="Banco"
        options={bancos}
        required
        error="Escolha um banco da lista."
        placeholder="Código ou nome"
      />
      <Combobox
        size="lg"
        label="Banco (lg, desabilitado)"
        options={bancos}
        defaultValue="341"
        disabled
      />
    </Stack>
  )
}
```

## Props

### `Combobox`

Campo de texto com lista de sugestões filtrada enquanto se digita (padrão
WAI-ARIA "combobox com listbox"). Use para escolher uma opção em listas
longas; para poucas opções, prefira `Select`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `options` (obrigatória) | `ComboboxOption[]` | — | Opções disponíveis. |
| `className` | `string` | — | Classe aplicada ao contêiner externo. |
| `clearable` | `boolean` | — | Mostra o botão de limpar quando há valor. Padrão: `true`. |
| `defaultOpen` | `boolean` | — | — |
| `defaultValue` | `string \| null` | — | Valor inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `emptyMessage` | `ReactNode` | — | Mensagem quando nenhuma opção corresponde. Padrão: "Nenhum resultado encontrado". |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `filter` | `false \| ((option: ComboboxOption, query: string) => boolean)` | — | Função de filtro. Padrão: o rótulo contém o texto, ignorando acentos e caixa. Passe `false` quando as opções já vierem filtradas (busca no servidor). |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Marca o campo como inválido sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `loading` | `boolean` | — | Mostra "Carregando…" na lista (busca assíncrona em andamento). |
| `onChange` | `((value: string \| null, option: ComboboxOption \| null) => void)` | — | Chamado quando o usuário escolhe ou limpa uma opção. |
| `onInputChange` | `((inputValue: string) => void)` | — | Chamado a cada alteração do texto digitado — use para busca assíncrona. |
| `onOpenChange` | `((open: boolean) => void)` | — | — |
| `open` | `boolean` | — | Estado aberto da lista (controlado). |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `string \| null` | — | Valor selecionado (controlado). `null` = nenhum. |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ComboboxOption`:

```ts
export interface ComboboxOption {
  /** Valor da opção (único). */
  value: string
  /** Texto exibido e usado na busca. */
  label: string
  /** Texto secundário exibido abaixo do rótulo (também entra na busca). */
  description?: string
  disabled?: boolean
}
```

`ComboboxSize`:

```ts
export type ComboboxSize = 'sm' | 'md' | 'lg'
```

## Movimento

- **Abrir a lista** — Opacidade + 6px a partir do campo (desce quando abre embaixo, sobe quando abre em cima) — 160ms, ease-out.
- **Fechar a lista** — Fade + recuo de 4px em direção ao campo — 120ms, ease-in-out. O conteúdo fica congelado durante a saída.
- **Opção ativa** — Fundo em 160ms (ease-out); a marca laranja lateral cresce (scaleY) em 250ms, spring.
- **Chevron** — Gira 180° ao abrir — 250ms, spring.
- **Botão limpar** — Entra com pop (scale 0.6 → 1, 250ms, bounce) e sai em 120ms (fade + scale).
- **Carregando** — O indicador surge com fade de 160ms; a lista mostra "Carregando…".
- **Botões internos** — Afundam no clique: translateY(1px) scale(0.985) em 90ms (press).
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

Segue o padrão **combobox com listbox** do WAI-ARIA APG: o campo tem `role="combobox"`, `aria-expanded`, `aria-controls` e `aria-autocomplete="list"`; o foco permanece no campo e a opção ativa é indicada por `aria-activedescendant`. A opção escolhida tem `aria-selected="true"` e a quantidade de resultados é anunciada em uma região `role="status"`.

| Teclas | Ação |
| --- | --- |
| `↓` | Abre a lista (na opção escolhida ou na primeira) ou vai para a próxima opção. |
| `↑` | Abre a lista na última opção ou vai para a anterior. |
| `Alt` + `↓` | Abre a lista sem mover o foco visual. |
| `Alt` + `↑` | Fecha a lista. |
| `Home / End` | Com uma opção ativa, vai para a primeira/última; senão, move o cursor no texto. |
| `Enter` | Escolhe a opção ativa e fecha a lista. |
| `Esc` | Fecha a lista; com ela fechada, limpa o campo. |
| `← / →` | Devolve o foco visual ao texto para edição. |
| `Tab` | Fecha a lista e segue para o próximo campo. |

> **Botões internos** Os botões de abrir e de limpar ficam fora da ordem de Tab (`tabIndex=-1` ), como no exemplo do APG: pelo teclado, use ↓ e Esc.

- **1.3.1** — Rótulo, lista e opções com papéis e relações ARIA explícitas.
- **2.1.1** — Todas as funções disponíveis pelo teclado.
- **2.4.7** — Foco visível no campo e marca laranja na opção ativa.
- **4.1.2** — Estado aberto/fechado em `aria-expanded`; seleção em `aria-selected`.
- **4.1.3** — Contagem de resultados e "nenhum resultado" anunciados sem mover o foco.
