# MultiSelect

Combobox de seleção múltipla com busca: os itens escolhidos aparecem como chips removíveis.

- Categoria: Formulários · Status: estável
- Importação: `import { MultiSelect } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/multi-select (em inglês: https://orange.llypedev.com.br/en/components/multi-select)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-multiselect--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/MultiSelect

## Boas práticas

- Use para escolher vários itens de uma lista conhecida (habilidades, filtros, destinatários). Com poucas opções sempre visíveis, prefira um grupo de checkboxes.
- Para valores livres digitados pelo usuário (palavras-chave, e-mails), use **TagInput**.
- Se houver limite, informe-o na descrição e use `maxSelected`: as demais opções ficam indisponíveis e o motivo é exibido na lista.
- Mantenha os rótulos curtos — eles viram chips. Use a descrição da opção para detalhes.

## Exemplos

### Básico

A lista continua aberta enquanto você escolhe. Backspace com o campo vazio remove o último chip.

```tsx
import { MultiSelect } from '@orangesys/ui'

const habilidades = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'css', label: 'CSS' },
  { value: 'a11y', label: 'Acessibilidade', description: 'WCAG, WAI-ARIA e leitores de tela' },
  { value: 'testes', label: 'Testes automatizados' },
  { value: 'figma', label: 'Figma' },
  { value: 'sql', label: 'SQL' },
  { value: 'go', label: 'Go', description: 'Sem vagas no momento', disabled: true },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <MultiSelect
        label="Habilidades"
        description="Usadas para recomendar vagas."
        placeholder="Buscar habilidades"
        options={habilidades}
        defaultValue={['react', 'a11y']}
        name="habilidades"
      />
    </div>
  )
}
```

### Limite de seleção

Com `maxSelected`, ao atingir o limite as outras opções ficam indisponíveis.

```tsx
import { MultiSelect } from '@orangesys/ui'

const interesses = [
  { value: 'produto', label: 'Gestão de produto' },
  { value: 'design', label: 'Design de interfaces' },
  { value: 'dados', label: 'Ciência de dados' },
  { value: 'devops', label: 'DevOps e infraestrutura' },
  { value: 'mobile', label: 'Desenvolvimento mobile' },
  { value: 'seguranca', label: 'Segurança da informação' },
  { value: 'ia', label: 'Inteligência artificial' },
]

export default function MaxSelected() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <MultiSelect
        label="Trilhas de interesse"
        description="Escolha até 3 trilhas para o seu plano de estudos."
        options={interesses}
        maxSelected={3}
        defaultValue={['produto', 'design']}
      />
    </div>
  )
}
```

### Controlado: filtro de pedidos

```tsx
import { Button, MultiSelect } from '@orangesys/ui'
import { useState } from 'react'

const status = [
  { value: 'aguardando', label: 'Aguardando pagamento' },
  { value: 'aprovado', label: 'Pagamento aprovado' },
  { value: 'separacao', label: 'Em separação' },
  { value: 'transporte', label: 'Em transporte' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
]

const pedidos = [
  { id: '#10482', status: 'transporte' },
  { id: '#10483', status: 'aguardando' },
  { id: '#10484', status: 'entregue' },
  { id: '#10485', status: 'transporte' },
  { id: '#10486', status: 'cancelado' },
  { id: '#10487', status: 'separacao' },
]

export default function Controlled() {
  const [filtro, setFiltro] = useState<string[]>(['transporte', 'separacao'])
  const visiveis = filtro.length ? pedidos.filter((p) => filtro.includes(p.status)) : pedidos

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <MultiSelect
        label="Status do pedido"
        placeholder="Todos os status"
        options={status}
        value={filtro}
        onChange={setFiltro}
      />
      <p
        style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}
        aria-live="polite"
      >
        {visiveis.length} de {pedidos.length} pedidos: {visiveis.map((p) => p.id).join(', ')}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="outline" onClick={() => setFiltro(['aguardando', 'aprovado'])}>
          Só pagamentos
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setFiltro([])}>
          Mostrar todos
        </Button>
      </div>
    </div>
  )
}
```

### Tamanhos e estados

```tsx
import { MultiSelect } from '@orangesys/ui'

const idiomas = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'Inglês' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' },
]

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <MultiSelect size="sm" label="Idiomas (sm)" options={idiomas} defaultValue={['pt', 'en']} />
      <MultiSelect
        label="Idiomas do atendimento"
        options={idiomas}
        required
        error="Escolha ao menos um idioma."
      />
      <MultiSelect
        size="lg"
        label="Idiomas (lg, desabilitado)"
        options={idiomas}
        defaultValue={['es']}
        disabled
      />
    </div>
  )
}
```

## Props

### `MultiSelect`

Seleção de várias opções com busca: a lista fica aberta enquanto se escolhe
e os itens escolhidos aparecem como chips removíveis.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `options` (obrigatória) | `MultiSelectOption[]` | — | — |
| `className` | `string` | — | Classe aplicada ao contêiner externo. |
| `clearable` | `boolean` | — | Mostra o botão "Limpar tudo" quando há seleção. Padrão: `true`. |
| `defaultOpen` | `boolean` | — | — |
| `defaultValue` | `string[]` | — | Valores iniciais (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `emptyMessage` | `ReactNode` | — | Mensagem quando nenhuma opção corresponde à busca. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `filter` | `false \| ((option: MultiSelectOption, query: string) => boolean)` | — | Função de filtro. Padrão: o rótulo contém o texto, ignorando acentos e caixa. Passe `false` quando as opções já vierem filtradas. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Marca o campo como inválido sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — mesmo que oculto. |
| `loading` | `boolean` | — | Mostra "Carregando…" na lista. |
| `maxSelected` | `number` | — | Limite de itens selecionados. Ao atingir, as demais opções ficam indisponíveis. |
| `onChange` | `((value: string[], options: MultiSelectOption[]) => void)` | — | Chamado a cada seleção ou remoção. |
| `onInputChange` | `((inputValue: string) => void)` | — | Chamado a cada alteração do texto de busca — use para busca assíncrona. |
| `onOpenChange` | `((open: boolean) => void)` | — | — |
| `open` | `boolean` | — | — |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura mínima do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `string[]` | — | Valores selecionados (controlado). |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`MultiSelectOption`:

```ts
export interface MultiSelectOption {
  /** Valor da opção (único). */
  value: string
  /** Texto exibido na lista e no chip. */
  label: string
  /** Texto secundário exibido abaixo do rótulo. */
  description?: string
  disabled?: boolean
}
```

`MultiSelectSize`:

```ts
export type MultiSelectSize = 'sm' | 'md' | 'lg'
```

## Movimento

- **Abrir a lista** — Opacidade + 6px a partir do campo (desce quando abre embaixo, sobe quando abre em cima) — 160ms, ease-out.
- **Fechar a lista** — Fade + recuo de 4px em direção ao campo — 120ms, ease-in-out. O conteúdo fica congelado durante a saída.
- **Opção ativa** — Fundo em 160ms (ease-out); a marca laranja lateral cresce (scaleY) em 250ms, spring.
- **Chevron** — Gira 180° ao abrir — 250ms, spring.
- **Marcar opção** — A caixa muda de cor em 160ms e o check entra com pop (scale-in, 250ms, bounce) — só quando a seleção muda com a lista aberta.
- **Adicionar item** — O chip entra com pop (scale 0.6 → 1, 250ms, bounce). Chips já presentes ao carregar não animam.
- **Remover item** — O chip sai com fade + scale 0.8 em 120ms antes de deixar o DOM; o foco vai para o vizinho na hora.
- **Limpar tudo** — O botão aparece/some com pop; todos os chips saem juntos.
- **Botões internos** — Afundam no clique: translateY(1px) scale(0.985) em 90ms (press).
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

Mesmo padrão do Combobox (APG), com a lista marcada como `aria-multiselectable="true"` e cada opção com `aria-selected` . Os itens escolhidos ficam em uma lista "Itens selecionados" com botões "Remover …" acessíveis; inclusões e remoções são anunciadas em uma região `role="status"`. Ao remover um chip, o foco vai para o próximo chip ou volta ao campo.

| Teclas | Ação |
| --- | --- |
| `↓ / ↑` | Abre a lista ou move entre as opções. |
| `Alt` + `↓` | Abre a lista sem mover o foco visual. |
| `Home / End` | Primeira/última opção (com uma opção ativa). |
| `Enter` | Marca ou desmarca a opção ativa; a lista continua aberta. |
| `Backspace` | Com o campo vazio, remove o último item. |
| `Esc` | Fecha a lista; depois, limpa a busca. |
| `Tab` | Percorre os botões de remover, o campo e "Limpar tudo". |

- **1.3.1** — Itens selecionados expostos como lista; seleção nas opções com aria-selected.
- **2.1.1** — Escolher, remover e limpar funcionam pelo teclado.
- **2.4.3** — Ordem de foco previsível após remover itens.
- **2.5.8** — Botões de remover com área mínima de 24×24px.
- **4.1.3** — Inclusões, remoções, limite e contagem de resultados anunciados.
