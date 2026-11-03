# Orange Design System

Design system open source, **acessível** (WCAG 2.2 AA), **customizável** (temas claro e escuro por
tokens) e **bilíngue** (PT/EN), feito com React 19 e TypeScript.

Linguagem visual geométrica: fundo carvão, texto creme, um único acento laranja, cantos retos,
bordas de 1px e grade explícita.

| Pacote / app        | Descrição                                                        |
| ------------------- | ---------------------------------------------------------------- |
| `@orange/tokens`    | Tokens de design (cores, tipografia, espaço, movimento) → CSS     |
| `@orange/ui`        | Componentes React acessíveis, hooks, ícones e providers          |
| `apps/docs`         | Site de documentação (PT/EN) com guidelines e páginas de componentes |
| `apps/storybook`    | Storybook 9 com painel de acessibilidade, temas e idiomas        |

## Começando

```bash
pnpm install
pnpm dev         # documentação → http://localhost:5173
pnpm storybook   # Storybook   → http://localhost:6006
```

```tsx
import '@orange/ui/styles.css'
import { Button, Icon, OrangeProvider } from '@orange/ui'

export function App() {
  return (
    <OrangeProvider defaultTheme="dark" locale="pt-BR">
      <Button endIcon={<Icon name="arrow-right" />}>Começar</Button>
    </OrangeProvider>
  )
}
```

## Scripts

| Comando          | O que faz                                                  |
| ---------------- | ---------------------------------------------------------- |
| `pnpm gen`       | Regenera o índice de componentes de `@orange/ui`           |
| `pnpm test`      | Testes (Vitest + Testing Library + axe-core)               |
| `pnpm typecheck` | TypeScript em todos os pacotes                             |
| `pnpm lint`      | ESLint com `jsx-a11y` e `react-hooks`                      |
| `pnpm build`     | tokens → biblioteca → Storybook → docs (Storybook em `/storybook`) |

## Contribuindo

Leia o [CONTRIBUTING.md](./CONTRIBUTING.md): estrutura de um componente, regras de acessibilidade,
testes, stories e páginas de documentação.

## Licença

MIT
