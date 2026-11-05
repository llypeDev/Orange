# Contribuindo com o Orange

Este guia descreve **como um componente é construído** no Orange. Ele vale tanto para pessoas quanto
para agentes automatizados. O `Button` é a implementação de referência — leia-o antes de começar:

- `packages/ui/src/components/Button/` — componente, CSS, testes e stories
- `apps/docs/src/content/components/button/` — página de documentação

## Estrutura do monorepo

```
packages/
  tokens/   @orangesys/tokens — tokens (TS) → css/tokens.css (gerado)
  ui/       @orangesys/ui     — componentes React, hooks, ícones, providers
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
| Elevar (cartões/blocos clicáveis) | hover/foco → `translateY(var(--or-distance-lift))` + `box-shadow: var(--or-shadow-lift)` + barra de acento de 4px na borda esquerda (`::after`, `scaleY(0 → 1)` a partir do topo) + ponte invisível de 12px abaixo (`::before`) para não tremer na borda — como os cartões do zop.dev; pressionar afunda metade da elevação (classe `or-lift`; `Card`/`Paper` `interactive` fazem o mesmo). Use em todo cartão clicável; grades só informativas mantêm as bordas compartilhadas. |
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
pnpm --filter @orangesys/ui exec vitest run src/components/Foo
pnpm --filter @orangesys/ui typecheck
pnpm --filter @orangesys/docs typecheck
```

## Regressão visual

O CI tira screenshots das stories nos temas **dark** e **light** e compara com as baselines em
`tests/visual/__screenshots__/` (suíte em `tests/visual/`, workflow `visual.yml`). Entra uma story por
componente (a `--default` ou a primeira) mais as de `EXTRA_STORIES`; componentes não determinísticos
ficam em `SKIP_TITLES`, com o motivo (`tests/visual/visual.spec.ts`).

- **Como o CI compara:** no contêiner `mcr.microsoft.com/playwright:v1.63.0-noble` (mesma versão do
  `@playwright/test`), com data fixa, movimento reduzido e animações desligadas. Diferença acima da
  tolerância falha o job e publica o artefato **relatorio-visual** (relatório HTML do Playwright com
  expected/actual/diff). Se o branch ainda não tem baselines, a comparação é pulada com um aviso.
- **Atualizando as baselines** (mudança visual intencional, story nova ou primeira vez): **Actions →
  "Atualizar baselines visuais" → Run workflow** no seu branch. O workflow gera as imagens no mesmo
  contêiner e faz commit delas no branch; revise as imagens no PR. Commits do bot não disparam o CI:
  faça `git pull` e o seu próximo push compara de novo.
- **Rodadas locais são só informativas:** os pixels dependem de fontes, freetype e da build do
  Chromium, então a sua máquina não reproduz o contêiner. Nunca faça commit de baselines locais.

```bash
pnpm build:storybook
pnpm test:visual -g "Button"                          # compara (fora do contêiner, espere diferenças)
VISUAL_SNAPSHOT_DIR=/tmp/vr pnpm test:visual:update   # baselines descartáveis, fora do repositório
```

## Commits

Mensagens no imperativo, em português: `Adiciona componente Tabs`, `Corrige foco do Modal`.

## Versionamento

A política completa está na documentação, em **Usando → Versionamento e depreciação**
(`/usage/versioning`, fonte em `apps/docs/src/content/pages/usage/Versioning.tsx`). O essencial:

- **SemVer** (`MAJOR.MINOR.PATCH`). `@orangesys/tokens` e `@orangesys/ui` formam um grupo **fixo** no
  Changesets: saem sempre juntos, com o mesmo número. Motivo: o `styles.css` do `ui` embute os tokens,
  o `ui` depende da versão exata de `@orangesys/tokens`, e a página Novidades fala de uma versão do
  sistema — não de duas.
- **API pública:** tudo o que `@orangesys/ui` exporta (componentes, props, valores aceitos, padrões,
  tipos, hooks, ícones, `MessageKey`), o comportamento de teclado/ARIA documentado, os pontos de
  entrada (`@orangesys/ui`, `@orangesys/ui/styles.css`, `@orangesys/tokens`, `@orangesys/tokens/contrast`,
  `@orangesys/tokens/tokens.css`), os **nomes** dos tokens `--or-*` e as classes utilitárias documentadas
  (`.or-visually-hidden`, `.or-eyebrow`, `.or-control`, `.or-lift`…).
- **Não é API:** classes `or-*` de componente (`.or-foo`, `.or-foo__parte`, `.or-foo--modificador`),
  variáveis privadas `--_*`, estrutura do DOM, `data-*` não documentados e nomes de keyframes.
- **Tipo de versão:** `patch` = correções (inclusive de acessibilidade); `minor` = novidades,
  depreciações e refinamento de valores de tokens; `major` = remover ou renomear algo público, mudar o
  padrão de uma prop, restringir um tipo, deixar de suportar uma versão do React/Node/navegador.
- **Série 0.x:** o npm trata a minor como major (`^0.4.0` não aceita a 0.5.0), então até a 1.0 a
  **minor faz o papel da major**: mudança incompatível só entra em minor, nunca em patch, e sempre
  depois de uma depreciação. **Não use `major` nos changesets antes de decidirmos lançar a 1.0** — ele
  leva direto à 1.0.0.

### Adicionando um changeset

Todo PR que muda o que é publicado de `packages/tokens` ou `packages/ui` precisa de um changeset.
Testes, stories, a documentação e o Storybook não precisam.

```bash
pnpm changeset            # escolha os pacotes, o tipo (patch/minor/major) e escreva o resumo
pnpm changeset --empty    # mudança em um pacote que não deve gerar release
pnpm changeset status     # mostra o que será versionado
```

Faça commit do arquivo gerado em `.changeset/`. O resumo vira uma linha do `CHANGELOG.md` do pacote:
escreva para quem **usa** a biblioteca (o que muda e o que fazer), em português. Comece com
`Incompatível:` quando quebrar algo (e inclua a migração) e com `Depreciado:` ao depreciar. Pode haver
vários changesets por PR. O CI avisa — sem bloquear — quando um PR muda um pacote sem changeset.

A página **Novidades** (`apps/docs/src/content/pages/Changelog.tsx`) continua escrita à mão: é o resumo
editorial, bilíngue, de cada versão. Atualize a entrada da versão em desenvolvimento junto com o PR.

### Depreciando uma API

1. **Em uma minor**, marque e avise:
   - JSDoc ``/** @deprecated Use `onClose`. Sai na v1.0. */`` na prop, no tipo ou no export;
   - `deprecate(mensagem, id)` de `src/utils` quando a API antiga for **usada** — aviso no console só
     em desenvolvimento, uma vez por `id` (some do bundle de produção):
     ```ts
     if (onDismiss !== undefined) {
       deprecate('Foo: `onDismiss` está depreciado e sai na v1.0. Use `onClose`.', 'foo.onDismiss')
     }
     ```
   - na documentação: “Depreciado — use X” na descrição da prop; se o componente inteiro sai,
     `status: 'deprecated'` e `deprecation: { replacement: 'bar', since: '0.5.0', removal: '1.0.0' }`
     no `meta.ts` (o cabeçalho mostra o selo “Depreciado” com link para o substituto);
   - changeset `minor` começando com `Depreciado:` e a nota de migração — ou um codemod, quando a troca
     for mecânica e atingir muitos arquivos.
2. **Mantenha a API antiga funcionando e testada** por pelo menos uma minor publicada.
3. **Remova só na major seguinte** (na série 0.x, numa minor posterior), com changeset
   `Incompatível:` e o passo a passo da migração.

Exceção: falhas de segurança e falhas graves de acessibilidade podem ser corrigidas em qualquer versão,
mesmo mudando comportamento — sempre anunciadas no changelog.

**Janela de suporte:** a major atual recebe tudo; a anterior, correções de segurança e de
acessibilidade críticas por 6 meses depois da nova major; na série 0.x, só a minor mais recente.

## Publicação

Automatizada com [Changesets](https://changesets.dev) (`.changeset/config.json`) e
`.github/workflows/release.yml`:

1. PRs com changesets entram em `main`.
2. O workflow **Release** abre ou atualiza o PR **“Versionar pacotes”** (branch
   `changeset-release/main`): aplica as versões, gera `packages/*/CHANGELOG.md` e apaga os changesets
   consumidos.
3. Ao fazer merge desse PR, o workflow encontra versões que ainda não estão no npm e roda
   `pnpm release` (`pnpm gen` → build de tokens e ui → `changeset publish`): publica por
   **trusted publishing**, com **provenance**, e cria as tags (`@orangesys/ui@0.5.0`) e as GitHub
   Releases.

O `changeset publish` usa `pnpm publish`, que aplica o `publishConfig` (exports, `main` e `types`
apontando para `dist/`) e troca `workspace:*` pela versão real. **Nunca rode `npm publish` direto em
um pacote:** o npm ignora `publishConfig.exports` e publicaria caminhos de `src/` que não estão no
tarball. Para conferir um pacote localmente:

```bash
pnpm --filter @orangesys/tokens build && pnpm --filter @orangesys/ui build
cd packages/ui && pnpm pack --dry-run   # lista o conteúdo do tarball
npx publint --pack pnpm                 # valida exports, tipos e arquivos
```

### Autenticação no npm: trusted publishing

O workflow não guarda token do npm. Ele publica por **trusted publishing** (OIDC): o npm confia no
`release.yml` deste repositório, emite uma credencial de uso único a cada publicação e gera o
provenance automaticamente. Não há secret para renovar nem token para vazar.

Cadastre uma vez **em cada pacote** (`@orangesys/tokens` e `@orangesys/ui`): npmjs.com → pacote →
_Settings_ → _Trusted Publisher_ → **GitHub Actions**.

| Campo                | Valor                                          |
| -------------------- | ---------------------------------------------- |
| Label                | `GitHub Actions – Release` (opcional; só nome) |
| Organization or user | `llypeDev`                                     |
| Repository           | `Orange`                                       |
| Workflow filename    | `release.yml` (só o nome do arquivo)           |
| Environment name     | vazio                                          |
| Allowed actions      | marque **`npm publish`**                       |

- **`npm publish` precisa estar marcado.** Configurações novas vêm só com `npm stage publish`
  (publicação em estágio, que espera aprovação manual no npmjs.com), e o workflow usa publicação direta.
- **Os campos diferenciam maiúsculas** e o npm não valida nada ao salvar: um erro só aparece na hora de
  publicar (`ENEEDAUTH`, `E401`, `E403` ou `E404`). O resumo da execução traz uma dica quando isso
  acontece.
- **Prazo de 2 dias.** Uma configuração nova expira se não tiver uma publicação bem-sucedida em até 2
  dias, e configuração expirada não pode ser editada (apague e crie outra). Cadastre logo antes de
  fazer merge do PR “Versionar pacotes”.
- **Feche a porta dos tokens.** Em _Settings_ → _Publishing access_ de cada pacote, escolha “Require
  two-factor authentication and disallow bypass 2fa tokens” (a opção recomendada; em versões antigas
  da página, “… and disallow tokens”). O trusted publishing continua funcionando, porque usa OIDC e
  não token; o que deixa de funcionar é publicar com token de automação. Depois, revogue em _Access
  Tokens_ os tokens de automação antigos e apague o secret `NPM_TOKEN` do repositório, se ainda existir.
- Requisitos que o workflow já cumpre: runner hospedado pelo GitHub (self-hosted não funciona),
  permissão `id-token: write`, Node 24 e npm ≥ 11.5.1. O provenance só sai porque o repositório e os
  pacotes são públicos.

### Outras configurações

- **Escopo `@orangesys`.** Os pacotes são publicados na organização
  [`orangesys`](https://www.npmjs.com/org/orangesys) do npm. Quem cadastra o trusted publisher precisa
  ser membro dela com permissão de escrita nos pacotes.
- **Permissão para abrir PRs.** Em _Settings → Actions → General_, marque “Allow GitHub Actions to
  create and approve pull requests”.
- O PR “Versionar pacotes” é aberto com o `GITHUB_TOKEN`, então o CI não roda nele sozinho (regra do
  GitHub). Rode manualmente ou passe um token de GitHub App em `github-token` na action.
- `llypeDev/Orange` aparece em `release.yml` (forks não publicam), no `repo` do
  `.changeset/config.json`, em `repository`/`bugs` dos `package.json` e no trusted publisher de cada
  pacote. Se o repositório mudar de dono ou de nome, atualize todos: o npm só aceita a publicação se o
  repositório bater com o trusted publisher e com o `repository.url`.
- Se o arquivo `release.yml` mudar de nome, cadastre um trusted publisher novo com o nome novo.

### Trocando o escopo

Se o escopo precisar mudar (ex.: para `@llypedev`), troque tudo de uma vez. Depois da primeira
publicação, o escopo novo cria pacotes novos: publique-os e marque os antigos com `npm deprecate`
apontando para os novos.

1. `name` em `packages/tokens/package.json` e `packages/ui/package.json` e a dependência
   `@orangesys/tokens` do `ui`; as dependências `@orangesys/*` de `apps/docs` e `apps/storybook`.
2. `fixed` e `ignore` em `.changeset/config.json`, os filtros `--filter @orangesys/...` dos scripts e os
   cabeçalhos dos changesets pendentes em `.changeset/*.md`.
3. Os imports e textos com `@orangesys/` no código, nos exemplos e páginas da documentação, no README e
   neste guia (busca e troca global; revise o diff).
4. `pnpm install` (atualiza o lockfile), depois `pnpm build:lib`, `pnpm test` e `npx publint --pack pnpm`
   em cada pacote.
5. Cadastre o trusted publisher dos pacotes novos (seção acima). Se o npm só permitir isso depois que o
   pacote existe, faça a primeira publicação com um token granular (em `NODE_AUTH_TOKEN` no passo de
   publicação do `release.yml`), cadastre o trusted publisher e revogue o token.
