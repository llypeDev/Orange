# Contribuindo com o Orange

Este guia descreve **como um componente é construído** no Orange. Ele vale tanto para pessoas quanto
para agentes automatizados. O `Button` é a implementação de referência — leia-o antes de começar:

- `packages/ui/src/components/Button/` — componente, CSS, testes e stories
- `apps/docs/src/content/components/button/` — página de documentação

## Estrutura do monorepo

```
packages/
  tokens/   @orange/tokens — tokens (TS) → css/tokens.css (gerado)
  ui/       @orange/ui     — componentes React, hooks, ícones, providers
apps/
  docs/       site de documentação (Vite + React Router), PT/EN
  storybook/  Storybook 9 (stories ficam junto dos componentes em packages/ui)
scripts/
  gen-index.mjs   gera packages/ui/src/components/index.ts automaticamente
```

Comandos:

```bash
pnpm install
pnpm gen          # regenera o índice de componentes (rode após criar uma pasta nova)
pnpm dev          # docs em http://localhost:5173
pnpm storybook    # storybook em http://localhost:6006
pnpm test         # vitest (tokens + ui)
pnpm typecheck
pnpm lint
pnpm build        # tokens → ui → storybook → docs (com /storybook embutido)
```

## Checklist de um componente

Para um componente `Foo` (slug `foo`, pasta `Foo`), crie **todos** os itens abaixo:

```
packages/ui/src/components/Foo/
  Foo.tsx            implementação
  Foo.css            estilos (prefixo .or-foo)
  Foo.test.tsx       testes (comportamento + teclado + axe)
  Foo.stories.tsx    stories (title: 'Componentes/Foo', tags: ['autodocs'])
  index.ts           exporta o componente e os tipos públicos
apps/docs/src/content/components/foo/
  meta.ts            metadados (slug, name, category, description PT/EN)
  index.tsx          página (ComponentPage + Sections)
  examples/*.tsx     exemplos ao vivo (cada um com export default)
```

Depois de criar a pasta, rode `pnpm gen` — o índice e o menu da documentação são **descobertos
automaticamente**. Não edite `packages/ui/src/components/index.ts` à mão.

## Regras de implementação

### API

- Componentes funcionais com `forwardRef` para o elemento raiz interativo e `...rest` repassado.
- Nomes consistentes entre componentes:
  - `size?: 'sm' | 'md' | 'lg'` (alturas 32 / 40 / 48px — tokens `--or-control-*`)
  - `variant` para estilo visual; `tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'` para cor semântica
  - estado controlado/não controlado: `value` / `defaultValue` / `onChange`, `open` / `defaultOpen` / `onOpenChange`
    — use `useControllableState` / `useDisclosure` de `src/hooks`
  - `disabled`, `required`, `invalid` (quando aplicável)
- Exporte também os tipos: `export type { FooProps } from './Foo'`.
- Componentes compostos usam notação de ponto **ou** exports nomeados (`Tabs`, `TabList`, `Tab`, `TabPanel`).
  Prefira exports nomeados — evita problemas de tree-shaking e de docgen.
- Não exporte helpers internos. Nomes exportados devem ser únicos na biblioteca inteira.

### Campos de formulário

Todo controle de formulário aceita `label`, `description`, `error`, `required`, `disabled` e usa o
`Field` (`src/components/Field`) para rótulo/descrição/erro e os vínculos ARIA:

```tsx
<Field label={label} description={description} error={error} required={required} disabled={disabled}>
  <FooControl />   // dentro: const controlProps = useFieldControlProps({ id, ... })
</Field>
```

Classes de controle compartilhadas (em `Field.css`): `.or-control` (input/select/textarea direto) e
`.or-control-frame` + `.or-control-frame__input` + `__addon` + `__button` (controles com adornos).

### Estilo (CSS)

- CSS puro, um arquivo por componente, importado no `.tsx` (`import './Foo.css'`).
- Prefixo `or-` e BEM: `.or-foo`, `.or-foo__part`, `.or-foo--modifier`. Estados via atributos
  (`[aria-expanded='true']`, `[data-state='open']`, `:disabled`).
- **Somente tokens** (`var(--or-*)`), nunca cores hex soltas. Veja `packages/tokens/css/tokens.css`.
- Linguagem visual: cantos retos (`--or-radius-none`), bordas de 1px (`--or-color-border`,
  `--or-color-border-strong`), laranja apenas como acento (`--or-color-accent`), títulos e rótulos de
  botões em `--or-font-display` (Space Grotesk), corpo em `--or-font-body` (Inter), rótulos pequenos
  em caixa alta com `.or-eyebrow`. Use `--or-radius-full` só para avatares, switches e indicadores.
- Foco: `outline: 2px solid var(--or-color-focus); outline-offset: 2px` em `:focus-visible`.
- Movimento: durações `--or-duration-*` e curvas `--or-ease-*` (já zeradas em reduced motion).
- Camadas: `--or-z-dropdown`, `--or-z-modal`, `--or-z-popover`, `--or-z-toast`, `--or-z-tooltip`.
- Funciona nos dois temas: teste com `data-theme="light"` (o Example da doc tem o seletor de tema).

### Motion (obrigatório)

O Orange se move como o zop.dev: **rápido, funcional, geométrico**. Todo componente interativo
precisa de movimento coerente — nada "pisca" de um estado para outro.

**Tokens** (`packages/tokens`): durações `--or-duration-press` (90ms) · `instant` · `fast` (160ms,
hover/foco/saídas) · `medium` (250ms, entradas e indicadores) · `slow` (400ms, expandir/recolher) ·
`reveal` (600ms) · `loop` (2.4s, pulsos); curvas `--or-ease-out` (padrão), `--or-ease-in-out`
(saídas, idas e voltas), `--or-ease-spring` (indicadores), `--or-ease-bounce` (pequenos pops);
distâncias `--or-distance-sm` (4px, popovers) · `md` (8px, diálogos/toasts) · `lg` (24px, reveal) ·
`lift` (-4px); `--or-stagger` (80ms). Nunca escreva `ms`/`cubic-bezier` soltos no CSS — use tokens
(eles zeram sozinhos em `prefers-reduced-motion`).

**Utilitários** (`src/styles/motion.css`) e **hooks** (`src/hooks`):

| Padrão | Como |
| --- | --- |
| Entrada/saída de sobreposições | `usePresence(open)` → `{ present, state, nodeRef }`; `data-state={state}` + classe `or-motion-pop` / `or-motion-drop` / `or-motion-fade` (ou keyframes próprias com `[data-state='closed']`). Saída mais curta que entrada. |
| Pressionar | `:active` → `transform: translateY(1px) scale(0.985)` em `--or-duration-press` (ou classe `or-press`). |
| Elevar (cartões/blocos clicáveis) | hover/foco → `translateY(var(--or-distance-lift))` + `box-shadow: 0 8px 0 -4px <cor>` (classe `or-lift`). |
| Seta que empurra | ícone final desliza 4px no hover/foco (`or-nudge` + `or-nudge__icon`). |
| Sublinhado animado | cresce da esquerda via `background-size` (`or-underline`). |
| Expandir/recolher | `grid-template-rows: 0fr → 1fr` + opacidade em `--or-duration-slow` (`or-collapse` + `data-state`), chevron gira 180°. |
| Indicadores de seleção | deslizam/escala com `--or-ease-spring` (aba ativa, segmento, polegar do switch); check/ponto entram com `or-scale-in`/`or-draw` e `--or-ease-bounce`. |
| Progresso | largura/`transform` com transição; indeterminado em loop; `or-fill-x` para barras temporizadas. |
| Status "ao vivo" | `or-pulse` (anel em `box-shadow`, `--_pulse-color`). |
| Erro de validação | `or-shake` curto ao surgir o erro (uma vez). |
| Revelação no scroll | componente `Reveal` (`stagger` para grupos) / hook `useInView`. |
| Números | `useCountUp(valor)` quando o número entra em cena. |
| Cabeçalhos | `useScrollDirection()` para esconder ao rolar para baixo. |

Regras: anime só `transform`, `opacity`, cores, bordas e `box-shadow` (nada de `width/height/top`
— exceto `grid-template-rows`). Hover e foco visível sempre com a mesma resposta. Movimento nunca
pode ser a única pista de estado. Animações infinitas só para status/carregamento. Teste a
saída com `usePresence` (o jsdom desmonta na hora porque não há animação).

### Acessibilidade (obrigatório)

- HTML semântico primeiro (`button`, `a`, `input`, `dialog`, `nav`, `ul`…). ARIA só quando necessário,
  seguindo o [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/).
- Navegação completa por teclado conforme o padrão APG do componente (setas, Home/End, Escape…).
  Hooks prontos: `useRovingFocus`, `useFocusTrap`, `useEscapeKey`, `useClickOutside`, `useLockBodyScroll`.
- Todo elemento interativo tem nome acessível. Ícones decorativos: `<Icon name="x" />` (já é `aria-hidden`).
- Textos internos (rótulos de "Fechar", "Próxima página"…) vêm de `useLocale().t('chave')` —
  dicionário em `src/providers/messages.ts`. Se precisar de uma chave nova, adicione-a em **ptBR e enUS**.
- Sobreposições (Modal, Popover…) usam `Portal`, prendem/restauram o foco e fecham com Escape.
  Posicionamento: `@floating-ui/react-dom` (`useFloating`, `offset`, `flip`, `shift`, `autoUpdate`).
- Anúncios dinâmicos: `role="status"`/`aria-live="polite"` (ou `role="alert"` para erros urgentes).
- Alvo mínimo de 24×24px; contraste vem dos tokens (validado em `packages/tokens/src/contrast.test.ts`).

### Testes (`Foo.test.tsx`)

Vitest + Testing Library + `user-event`. Cubra no mínimo:

1. renderização e papéis/nomes acessíveis (`getByRole`)
2. interação por mouse **e** teclado
3. estados controlado/não controlado quando houver
4. `await expectNoA11yViolations(container)` de `src/test/axe.ts`

### Stories (`Foo.stories.tsx`)

`title: 'Componentes/Foo'`, `component: Foo`, `tags: ['autodocs']`, uma descrição em
`parameters.docs.description.component`, `argTypes` para as props principais e uma story por
variação relevante (Default, Variants, Sizes, States…). Importe tipos de `@storybook/react-vite`.

### Página de documentação

Siga `apps/docs/src/content/components/button/index.tsx`. Todas as strings são bilíngues
(`{ pt: '…', en: '…' }`). Seções na ordem:

1. **Boas práticas** (`Bullets`, opcionalmente `DoDont`)
2. **Tipos / Anatomia** (`DefinitionTable`) quando fizer sentido
3. **Exemplos** — cada `Example` recebe o componente de `./examples/X` e o código via `./examples/X?raw`
4. **Props** (`PropsTable`)
5. **Acessibilidade** (texto + `KeyboardTable` + `WcagList`)

`meta.ts`: `slug` em kebab-case (URL), `name` igual ao export, `category` entre
`actions | forms | feedback | overlays | navigation | data-display | layout | utilities`.
Os exemplos devem ser curtos, realistas e em português (conteúdo de produto, não "lorem ipsum").

## Verificação antes de entregar

```bash
pnpm gen
pnpm --filter @orange/ui exec vitest run src/components/Foo
pnpm --filter @orange/ui typecheck
pnpm --filter @orange/docs typecheck
```

## Commits

Mensagens no imperativo, em português: `Adiciona componente Tabs`, `Corrige foco do Modal`.
