# Fundamentos: provider, base e utilitários

Peças que não têm página própria de componente, mas são usadas em toda parte.

## Componentes de base

### `Eyebrow`

Rótulo curto em caixa alta (ex.: "COMPONENTES"), usado acima de títulos.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `p` | — |
| `marker` | `boolean` | `false` | Mostra o marcador quadrado laranja antes do texto. |
| `tone` | `"accent" \| "subtle"` | `subtle` | — |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

Código: `packages/ui/src/components/Typography/Typography.tsx`

### `Field`

Estrutura padrão de campos de formulário: rótulo, descrição, controle e
erro, com todos os vínculos ARIA (`for`, `aria-describedby`, `aria-invalid`).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `controlId` | `string` | — | Id do controle. Gerado automaticamente se omitido. |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `disabled` | `boolean` | `false` | — |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | `false` | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — mesmo que oculto. |
| `labelAside` | `ReactNode` | — | Elemento extra à direita do rótulo (ex.: contador, link). |
| `optional` | `boolean` | `false` | Mostra "(opcional)" ao lado do rótulo. |
| `required` | `boolean` | `false` | Campo obrigatório: mostra `*` e marca o controle como `required`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

Código: `packages/ui/src/components/Field/Field.tsx`

### `Heading`

Títulos em Space Grotesk com espaçamento negativo, a voz do Orange.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Nível semântico (h1–h6). Defina pela hierarquia do documento, não pelo tamanho. |
| `size` | `"md" \| "lg" \| "xl" \| "display" \| "5xl" \| "4xl" \| "3xl" \| "2xl"` | `md` | Tamanho visual, independente do nível semântico. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

Código: `packages/ui/src/components/Typography/Typography.tsx`

### `Icon`

Ícone SVG da biblioteca do Orange. Decorativo por padrão; informe `label`
quando o ícone transmitir significado sozinho.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `name` (obrigatória) | `"type" \| "search" \| "send" \| "grid" \| …` | — | Nome do ícone na biblioteca do Orange. |
| `label` | `string` | — | Texto alternativo. Quando informado, o ícone é anunciado por leitores de tela (`role="img"`). Sem `label`, o ícone é decorativo (`aria-hidden`). |
| `size` | `IconSize` | `md` | Tamanho: token (`xs`=12, `sm`=16, `md`=20, `lg`=24, `xl`=32) ou pixels. |
| `strokeWidth` | `number` | `1.75` | Espessura do traço. Padrão 1.75. |

Repassa também os atributos nativos (`InputHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

Código: `packages/ui/src/icons/Icon.tsx`

### `OrangeProvider`

Provedor raiz do Orange: aplica o tema (escuro, claro ou um dos de alto
contraste) e fornece as mensagens internas traduzidas para os componentes.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultTheme` | `"system" \| "dark" \| "light" \| "dark-hc" \| "light-hc"` | — | Tema inicial (não controlado). Padrão: `dark` — ou, num provider aninhado sem `theme`/`defaultTheme` (ex.: só para trocar o idioma), o tema do provider de fora. `system` segue `prefers-color-scheme` e, com `prefers-contrast: more`, usa o tema de alto contraste do mesmo esquema (`dark-hc`/`light-hc`). |
| `locale` | `Locale` | `pt-BR` | Idioma das mensagens internas. Padrão: `pt-BR`. |
| `messages` | `Partial<Messages>` | — | Sobrescreve mensagens internas específicas. |
| `onThemeChange` | `((theme: ThemeSetting) => void)` | — | — |
| `theme` | `"system" \| "dark" \| "light" \| "dark-hc" \| "light-hc"` | — | Tema controlado: `dark`, `light`, `dark-hc`, `light-hc` ou `system`. |
| `themeTarget` | `"document" \| "scoped"` | `document` | Onde aplicar o atributo `data-theme`. `document` (padrão) aplica em `<html>`; `scoped` envolve os filhos em um `<div data-theme>`. |

Código: `packages/ui/src/providers/OrangeProvider.tsx`

### `Portal`

Renderiza os filhos em outro ponto do DOM (padrão: `document.body`).
Usado por Modal, Drawer, Popover, Tooltip e Toast. Seguro para SSR.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `container` | `Element \| null` | — | Elemento de destino. Padrão: `document.body`. |
| `disabled` | `boolean` | `false` | Renderiza no lugar, sem portal. |

Código: `packages/ui/src/components/Portal/Portal.tsx`

### `Text`

Texto corrido com escala, tons e pesos do sistema.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `p` | Elemento renderizado. Padrão: `p`. |
| `font` | `"body" \| "display" \| "mono"` | `body` | Família tipográfica: `body` (Inter), `display` (Space Grotesk) ou `mono`. |
| `size` | `"sm" \| "md" \| "lg" \| "xs" \| "xl" \| "2xs"` | `md` | — |
| `tone` | `"inherit" \| "info" \| "success" \| "warning" \| "danger" \| "accent" \| "default" \| "subtle" \| "muted"` | `subtle` | — |
| `truncate` | `boolean` | — | Corta o texto em uma linha com reticências. |
| `weight` | `"bold" \| "regular" \| "medium" \| "semibold"` | — | — |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

Código: `packages/ui/src/components/Typography/Typography.tsx`

## Utilitários e constantes

### `builtInMessages`

### `composeEventHandlers`

```ts
composeEventHandlers<E extends SyntheticEvent | Event>(external: ((event: E) => void) | undefined, internal: (event: E) => void): (event: E) => void
```

Compõe handlers de evento: chama o do usuário primeiro e só executa o interno
se `event.defaultPrevented` não tiver sido marcado.

### `cx`

```ts
cx(...values: ClassValue[]): string
```

Junta classes CSS condicionalmente: `cx('a', cond && 'b', { c: true })`.

### `enUS`

### `getColorScheme`

```ts
getColorScheme(theme: "dark" | "light" | "dark-hc" | "light-hc"): ColorScheme
```

Esquema de cor de um tema: `dark-hc` → `dark`.

### `iconNames`

### `iconPaths`

Biblioteca de ícones do Orange: grade 24×24, traço de 1.75px, terminações
quadradas e cantos vivos — coerente com a linguagem geométrica do sistema.

Para adicionar um ícone: inclua uma nova chave neste objeto (mantenha a
ordem alfabética) usando apenas <path>, <circle>, <rect> ou <line>.

### `interpolate`

```ts
interpolate(template: string, vars?: Record<string, string | number> | undefined): string
```

### `isHighContrastTheme`

```ts
isHighContrastTheme(theme: "dark" | "light" | "dark-hc" | "light-hc"): boolean
```

`true` para os temas de alto contraste (WCAG AAA).

### `isThemeName`

```ts
isThemeName(value: unknown): value is "dark" | "light" | "dark-hc" | "light-hc"
```

`true` para os temas prontos (`dark`, `light`, `dark-hc`, `light-hc`).

### `isThemeSetting`

```ts
isThemeSetting(value: unknown): value is ThemeSetting
```

`true` para um tema pronto ou `system` — útil ao ler a preferência salva.

### `mergeRefs`

```ts
mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T>
```

Combina várias refs em uma única ref callback.

### `ptBR`

Textos internos dos componentes (rótulos de botões de fechar, paginação,
mensagens para leitores de tela...). Sobrescreva via
`<OrangeProvider messages={{ close: 'Fechar janela' }}>`.

Use `{nome}` para interpolação: t('pageOf', { page: 2, total: 10 }).

### `resolveTheme`

```ts
resolveTheme(setting: ThemeSetting, { prefersLight, prefersMoreContrast }?: SystemThemePreferences): "dark" | "light" | "dark-hc" | "light-hc"
```

Resolve a preferência no tema aplicado. `system` segue `prefers-color-scheme`
e, com `prefers-contrast: more`, troca para o tema de alto contraste do mesmo
esquema (`dark` → `dark-hc`, `light` → `light-hc`). Temas fixos não mudam.

### `themeNames`

Temas prontos, na ordem dos seletores.
