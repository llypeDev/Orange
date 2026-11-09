# AGENTS.md — Orange Design System

Instruções para agentes de IA (Codex, Cursor, Copilot, Gemini, Claude Code…) que trabalham **neste
repositório**. Para **usar** a biblioteca em outro projeto, o caminho é o skill
[`skills/orange-ui`](skills/orange-ui/SKILL.md). O detalhe de cada regra está no
[CONTRIBUTING.md](CONTRIBUTING.md), que vale para pessoas e agentes.

## O projeto

Monorepo pnpm (Node ≥ 22.12, pnpm 10) de um design system React 19 + TypeScript, acessível (WCAG 2.2
AA), com quatro temas por tokens e documentação bilíngue (PT/EN):

| Caminho                        | O quê                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `packages/tokens`              | `@orangesys/tokens`: tokens em TS → `css/tokens.css` (gerado por `pnpm build:tokens`)         |
| `packages/ui`                  | `@orangesys/ui`: componentes (`src/components/<Nome>/`), hooks, ícones, providers             |
| `apps/docs`                    | site (Vite + React Router); página de cada componente em `src/content/components/<slug>/`     |
| `apps/storybook`               | Storybook 10; as stories ficam ao lado dos componentes em `packages/ui`                       |
| `tests/visual`, `tests/layout` | regressão visual e testes de layout (Playwright) sobre o Storybook construído                 |
| `skills/orange-ui`             | skill para IAs que usam a biblioteca; `references/` é **gerado** (`pnpm gen:ai`)              |
| `scripts/`                     | `gen-index.mjs` (índice de componentes), `gen-ai.mjs` (referência para IAs), `size-check.mjs` |

Implementação de referência: `packages/ui/src/components/Button/` e
`apps/docs/src/content/components/button/`. Leia antes de criar algo novo.

## Comandos

```bash
pnpm install
pnpm gen            # índice de componentes (depois de criar uma pasta)
pnpm gen:ai         # referência para IAs (depois de mudar props, JSDoc, docs ou exemplos)
pnpm typecheck
pnpm lint
pnpm test           # vitest (tokens + ui); uma pasta: pnpm --filter @orangesys/ui exec vitest run src/components/Foo
pnpm build          # tokens → ui → storybook → docs
pnpm size           # orçamento de tamanho (depois de pnpm build:lib)
pnpm test:layout --project=chromium   # depois de pnpm build:storybook
```

A CI roda tudo isso, mais `pnpm gen:ai --check`, os testes de layout em Chromium, Firefox e WebKit e a
regressão visual.

## Regras que não mudam

- **Português** em código (comentários, JSDoc), documentação, mensagens de commit (imperativo:
  "Corrige foco do Modal") e changesets. Strings da documentação são bilíngues (`{ pt, en }`).
- **Componente novo = pacote completo:** `Foo.tsx`, `Foo.css`, `Foo.test.tsx` (comportamento,
  teclado e `expectNoA11yViolations`), `Foo.stories.tsx`, `index.ts`, e a página em
  `apps/docs/src/content/components/foo/` (`meta.ts`, `index.tsx`, `examples/*.tsx`). Depois,
  `pnpm gen` e `pnpm gen:ai`. Checklist completo no CONTRIBUTING.
- **Estilo só com tokens** (`var(--or-*)`), CSS puro com prefixo `or-` e BEM, cantos retos, bordas de
  1px, um único acento laranja. Movimento com os tokens de duração e curva (zeram em movimento
  reduzido).
- **Acessibilidade é requisito:** HTML semântico, teclado conforme o padrão do WAI-ARIA APG, nome
  acessível em tudo que é interativo, foco visível, textos internos via `useLocale().t()` com a chave
  em `ptBR` **e** `enUS`.
- **API estável:** `size` `sm|md|lg`, `variant`, `tone`, `value`/`defaultValue`/`onChange`,
  `open`/`defaultOpen`/`onOpenChange`, `forwardRef` e `...rest`. Mudança incompatível só depois de
  depreciar (veja "Versionamento" no CONTRIBUTING); nunca use `major` num changeset sem decisão.
- **Changeset** (`pnpm changeset`) em todo PR que muda o que é publicado de `packages/tokens` ou
  `packages/ui`, escrito para quem usa a biblioteca. Atualize também a entrada da versão em
  `apps/docs/src/content/pages/Changelog.tsx`.
- **Dados de exemplo fictícios** em stories, testes, exemplos e modelos. Nunca use números reais ou
  realistas de documentos pessoais (CPF, RG), telefones nem números de cartão.

## Não faça

- Editar arquivos gerados: `packages/ui/src/components/index.ts` (`pnpm gen`),
  `packages/tokens/css/tokens.css` (`pnpm build:tokens`), `skills/orange-ui/references/**`
  (`pnpm gen:ai`).
- Commitar baselines visuais geradas localmente: elas só valem do contêiner da CI (workflow
  "Atualizar baselines visuais").
- Desligar, pular ou afrouxar testes para a CI passar. Teste de layout instável quase sempre está
  medindo cedo demais: use `measureUntil`/`expectActiveVisible` em vez de aumentar tempos.
- Atualizar `@playwright/test` sem trocar a imagem do contêiner nos workflows (e regenerar as
  baselines), nem subir majors bloqueados (TypeScript 7, ESLint 10, jsdom 31; motivos no
  CONTRIBUTING).
- Exportar helpers internos ou nomes duplicados: tudo o que `@orangesys/ui` exporta é API pública.
- Usar classes `or-*` de outro componente sem importá-lo (ou o CSS dele): na entrada
  `@orangesys/ui/with-css` cada componente só leva o CSS do que importa, e o build de `packages/ui`
  falha quando falta (`packages/ui/scripts/component-css.ts`).

## Antes de entregar

```bash
pnpm gen && pnpm gen:ai
pnpm typecheck && pnpm lint && pnpm test
pnpm build && pnpm size
```

Mudou comportamento de layout (rolagem, overlays, foco)? Rode também `pnpm test:layout`. Mudou o
visual? A regressão visual da CI vai acusar; atualize as baselines pelo workflow, nunca à mão.
