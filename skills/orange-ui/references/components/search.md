# Search

Campo de busca com lupa, botão de limpar e envio por Enter, dentro de um landmark de busca.

- Categoria: Formulários · Status: estável
- Importação: `import { Search } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/search (em inglês: https://orange.llypedev.com.br/en/components/search)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-search--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Search

## Boas práticas

- Sempre informe `label`, mesmo com o rótulo oculto (padrão): é ele que leitores de tela anunciam e que nomeia o landmark de busca.
- Diga no placeholder o que pode ser buscado ("Nome, e-mail ou CNPJ"), não apenas "Buscar".
- Para filtrar enquanto digita, use `debounce` (200–400 ms) e anuncie a quantidade de resultados em uma região `role="status"`.
- Para escolher um valor de uma lista (e não buscar conteúdo), use **Combobox**.

- Faça: Rótulo e placeholder específicos.
- Evite: Rótulo genérico que não diz o que é buscado.

## Exemplos

### Básico

Enter envia a busca. O botão de limpar aparece quando há texto e devolve o foco ao campo; Escape também limpa.

```tsx
import { Search } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [ultimaBusca, setUltimaBusca] = useState<string>()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 12,
        width: '100%',
        maxWidth: 420,
      }}
    >
      <Search
        label="Buscar na loja"
        placeholder="Buscar produtos, marcas e categorias"
        onSearch={setUltimaBusca}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {ultimaBusca === undefined
          ? 'Digite e pressione Enter.'
          : `Você buscou por “${ultimaBusca}”.`}
      </p>
    </div>
  )
}
```

### Filtrar enquanto digita

Com `debounce`, `onChange` só é chamado após uma pausa na digitação. Aqui o rótulo está visível.

```tsx
import { Search } from '@orangesys/ui'
import { useMemo, useState } from 'react'

const artigos = [
  'Como emitir a segunda via do boleto',
  'Alterar a forma de pagamento',
  'Cancelar a assinatura',
  'Trocar o e-mail de acesso',
  'Redefinir a senha',
  'Configurar a autenticação em dois fatores',
  'Exportar notas fiscais',
  'Adicionar pessoas à equipe',
]

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Debounced() {
  const [termo, setTermo] = useState('')
  const resultados = useMemo(
    () => artigos.filter((a) => normalizar(a).includes(normalizar(termo))),
    [termo],
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 12,
        width: '100%',
        maxWidth: 420,
      }}
    >
      <Search
        label="Buscar na central de ajuda"
        hideLabel={false}
        description="Os resultados são filtrados enquanto você digita."
        placeholder="Ex.: boleto, senha, equipe"
        debounce={250}
        onChange={setTermo}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {resultados.length} {resultados.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
        {resultados.map((artigo) => (
          <li key={artigo}>{artigo}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Carregando

Durante buscas no servidor, a lupa vira um indicador de carregamento.

```tsx
import { Search } from '@orangesys/ui'
import { useState } from 'react'

export default function Loading() {
  const [buscando, setBuscando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const buscar = (termo: string) => {
    if (!termo.trim()) return
    setBuscando(true)
    setMensagem('')
    setTimeout(() => {
      setBuscando(false)
      setMensagem(`3 clientes encontrados para “${termo}”.`)
    }, 1200)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 12,
        width: '100%',
        maxWidth: 420,
      }}
    >
      <Search
        label="Buscar clientes"
        placeholder="Nome, e-mail ou CNPJ"
        loading={buscando}
        onSearch={buscar}
        onClear={() => setMensagem('')}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {buscando ? 'Buscando…' : mensagem}
      </p>
    </div>
  )
}
```

### Tamanhos e desabilitado

```tsx
import { Search } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 16,
        width: '100%',
        maxWidth: 420,
      }}
    >
      <Search size="sm" label="Filtrar tabela" placeholder="Filtrar (sm)" />
      <Search size="md" label="Buscar documentos" placeholder="Buscar (md)" />
      <Search size="lg" label="Buscar no site" placeholder="O que você procura? (lg)" />
      <Search label="Busca indisponível" placeholder="Busca desabilitada" disabled />
    </div>
  )
}
```

## Props

### `Search`

Campo de busca: `<form role="search">` com input `type="search"`, lupa,
botão de limpar e envio por Enter. Opcionalmente chama `onChange` com
atraso (`debounce`) para buscar enquanto o usuário digita.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Rótulo do campo (obrigatório — fica oculto por padrão, mas é lido por leitores de tela). |
| `className` | `string` | — | Classe aplicada ao `<form>`. |
| `debounce` | `number` | — | Atraso em ms para chamar `onChange` (busca enquanto digita). |
| `defaultValue` | `string` | — | Texto inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `formProps` | `Omit<FormHTMLAttributes<HTMLFormElement>, "role" \| "onSubmit">` | — | Atributos extras do `<form role="search">`. |
| `hideLabel` | `boolean` | `true` | Oculta o rótulo visualmente. Padrão: `true`. |
| `loading` | `boolean` | — | Mostra um indicador de carregamento no lugar da lupa. |
| `onChange` | `((value: string) => void)` | — | Chamado quando o texto muda. Com `debounce`, só é chamado após a pausa na digitação (limpar e enviar disparam na hora). |
| `onClear` | `(() => void)` | — | Chamado quando o campo é limpo (botão ou Escape). |
| `onSearch` | `((value: string) => void)` | — | Chamado ao pressionar Enter ou enviar o formulário. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `value` | `string` | — | Texto buscado (controlado). |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

- **Foco** — Borda e anel laranja em 160ms; a lupa acende em laranja em 160ms (ease-out).
- **Digitar** — O botão limpar entra com fade + escala (scale 0.6 → 1, 250ms, bounce).
- **Limpar** — O botão afunda no clique (90ms) e sai em 120ms (fade + scale); o foco volta ao campo.
- **loading** — Lupa e spinner ficam empilhados e trocam com fade (160ms) + escala (250ms, spring). O giro só roda enquanto carrega.
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

Renderiza `<form role="search">` — um landmark que leitores de tela listam para navegação rápida — com um `<input type="search">` rotulado. A lupa é decorativa; o botão de limpar tem nome acessível ("Limpar") e devolve o foco ao campo.

| Teclas | Ação |
| --- | --- |
| `Enter` | Envia a busca (onSearch). |
| `Esc` | Limpa o texto. Com o campo vazio, o evento segue (ex.: fecha um modal). |
| `Tab` | Vai do campo para o botão de limpar. |

- **1.3.1** — Landmark de busca e rótulo associado ao campo.
- **2.4.1** — O landmark permite pular direto para a busca.
- **2.4.7** — Foco visível no campo e no botão de limpar.
- **3.3.2** — Rótulo sempre presente, mesmo quando oculto.
