# Começando

Instale o Orange, importe os estilos, envolva a aplicação no OrangeProvider e renderize o primeiro componente. Leva cerca de cinco minutos.

## Requisitos

- **React** — 18.2 ou 19 (desenvolvido e testado com React 19). `react` e `react-dom` são peer dependencies.
- **TypeScript** — Opcional. Os tipos acompanham o pacote; recomendamos o modo strict e moduleResolution "Bundler".
- **Empacotador** — Qualquer um que importe CSS a partir de JavaScript: Vite, Next.js, Remix, webpack, Parcel, Rsbuild.
- **Navegadores** — As duas últimas versões de Chrome, Edge, Firefox e Safari (usamos :focus-visible, :where() e color-mix()).
- **Node.js** — 20 ou superior — necessário apenas para desenvolver o próprio monorepo ( `pnpm@10`).

## Instalação

O pacote `@orangesys/ui` traz os componentes, hooks, ícones e providers. Ele já depende de `@orangesys/tokens`, então não é preciso instalar os dois.

**pnpm**

```bash
pnpm add @orangesys/ui
```

**npm**

```bash
npm install @orangesys/ui
```

**yarn**

```bash
yarn add @orangesys/ui
```

## Configuração em quatro passos

### 1. Importe os estilos uma única vez

No ponto de entrada da aplicação. O arquivo inclui os tokens ( `tokens.css`) e a base (`base.css`): reset leve, foco visível, utilitários e animações. O CSS de cada componente entra junto com o componente.

`main.tsx`:

```ts
import '@orangesys/ui/styles.css'
```

### 2. Carregue as fontes

Space Grotesk (títulos e rótulos), Inter (texto) e JetBrains Mono (código). Sem elas, os tokens caem em fontes do sistema — funciona, mas perde a voz do Orange.

`index.html`:

```html
<!-- index.html, dentro de <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" />
```

### 3. Envolva a aplicação no OrangeProvider

Ele aplica `data-theme` no `<html>` e fornece as mensagens internas (rótulos como “Fechar” e “Próxima página”) no idioma escolhido.

`main.tsx`:

```tsx
// src/main.tsx
import '@orangesys/ui/styles.css'
import { OrangeProvider } from '@orangesys/ui'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <OrangeProvider defaultTheme="dark" locale="pt-BR">
    <App />
  </OrangeProvider>,
)
```

### 4. Use os componentes

Importe pelo nome a partir de `@orangesys/ui`. Todos os exports são nomeados e o pacote é tree-shakeable.

## Seu primeiro componente

### Exemplo

Tipografia e botão da base, já com os tokens do tema. Alterne entre Escuro e Claro na barra da prévia.

```tsx
import { Button, Eyebrow, Heading, Icon, Text } from '@orangesys/ui'

export function BoasVindas() {
  return (
    <section>
      <Eyebrow marker>Conta criada</Eyebrow>
      <Heading level={3} size="2xl">Bem-vinda ao painel, Marina</Heading>
      <Text tone="muted">Conecte sua loja para importar pedidos e estoque.</Text>
      <Button endIcon={<Icon name="arrow-right" />}>Conectar loja</Button>
    </section>
  )
}
```

## Next.js e SSR

Os componentes não acessam `window` nem `document` durante a renderização, e portais só montam no cliente (`useMounted`). No App Router, o `OrangeProvider` usa estado e contexto, então fica em um componente cliente:

`app/providers.tsx`:

```tsx
// app/providers.tsx
'use client'

import { OrangeProvider } from '@orangesys/ui'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OrangeProvider defaultTheme="system" locale="pt-BR">
      {children}
    </OrangeProvider>
  )
}
```

`app/layout.tsx`:

```tsx
// app/layout.tsx
import '@orangesys/ui/styles.css'
import { Providers } from './providers'

// Aplica o tema salvo antes da hidratação — evita o "flash" de tema errado.
const themeScript = `try {
  var t = localStorage.getItem('tema');
  if (!/^(dark|light)(-hc)?$/.test(t || '')) {
    t = (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') +
      (matchMedia('(prefers-contrast: more)').matches ? '-hc' : '');
  }
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

> **Por que o script inline?** No servidor não existe `prefers-color-scheme` nem `localStorage`. O script define `data-theme` antes da primeira pintura; `suppressHydrationWarning` evita o aviso de atributo diferente entre servidor e cliente.

## Usando apenas os tokens

Não usa React? `@orangesys/tokens` funciona sozinho. O CSS expõe tudo como custom properties `--or-*`, com os temas em `[data-theme='dark']` e `[data-theme='light']`; o TypeScript expõe os mesmos valores como objetos.

**CSS**

```css
/* Qualquer stack: Vue, Svelte, Astro, HTML puro… */
@import '@orangesys/tokens/tokens.css';

.cartao {
  padding: var(--or-space-6);
  border: 1px solid var(--or-color-border);
  background: var(--or-color-surface-raised);
  color: var(--or-color-text);
  font-family: var(--or-font-body);
}

.cartao__titulo {
  font-family: var(--or-font-display);
  font-size: var(--or-text-xl);
  letter-spacing: var(--or-tracking-heading);
}
```

**TypeScript**

```ts
import { breakpoints, motion, themes } from '@orangesys/tokens'
import { contrastRatio } from '@orangesys/tokens/contrast'

themes.dark.accent            // '#f58549'
breakpoints.lg                // '1024px'
motion.duration.fast          // '160ms'
contrastRatio(themes.light['text-on-accent'], themes.light.accent) // 5.08
```

**Instalar**

```bash
pnpm add @orangesys/tokens
```

## Estrutura do monorepo

Para contribuir ou estudar o código. O repositório usa workspaces do pnpm; os pacotes apontam para `src/` durante o desenvolvimento, então mudanças em tokens e componentes aparecem na documentação com hot reload.

`estrutura`:

```bash
orange/
├── packages/
│   ├── tokens/        @orangesys/tokens — fonte única dos tokens
│   │   ├── src/index.ts       primitives, themes, typography, space…
│   │   ├── src/contrast.ts    contrastRatio(), wcagLevel()
│   │   └── css/tokens.css     gerado — não edite à mão
│   └── ui/            @orangesys/ui — componentes, hooks, ícones, providers
│       └── src/
│           ├── components/<Nome>/   .tsx · .css · .test.tsx · .stories.tsx
│           ├── hooks/               useDisclosure, useFocusTrap…
│           ├── icons/               <Icon /> + paths.tsx
│           ├── providers/           OrangeProvider, mensagens pt-BR/en-US
│           └── styles/              index.css, base.css
├── apps/
│   ├── docs/          este site (Vite + React Router, PT/EN)
│   └── storybook/     Storybook 9 + addon de acessibilidade
└── scripts/           gen-index.mjs, merge-storybook.mjs
```

## Scripts de desenvolvimento

| Comando | O que faz |
| --- | --- |
| pnpm install | Instala as dependências de todos os workspaces. |
| pnpm dev | Sobe esta documentação em http://localhost:5173. |
| pnpm storybook | Sobe o Storybook em http://localhost:6006. |
| pnpm gen | Regenera o índice de componentes de @orangesys/ui (rode após criar uma pasta). |
| pnpm test | Vitest + Testing Library + axe-core em tokens e componentes. |
| pnpm typecheck | TypeScript em modo strict em todos os pacotes. |
| pnpm lint | ESLint com jsx-a11y e react-hooks. |
| pnpm build:tokens | Gera css/tokens.css a partir de src/index.ts. |
| pnpm build | tokens → biblioteca → Storybook → docs (Storybook servido em /storybook). |

## Pronto para produção

Antes de publicar, confira os itens abaixo. A lista é interativa e não é salva — use-a como roteiro de revisão.

- [ ] `@orangesys/ui/styles.css` importado uma única vez, antes do CSS da aplicação.
- [ ] Fontes carregadas com preconnect e display=swap.
- [ ] Atributo `lang` do `<html>` igual ao `locale` do provider.
- [ ] Tema aplicado antes da primeira pintura (sem flash) e escolha do usuário persistida.
- [ ] Cores customizadas verificadas: texto ≥ 4.5:1 e bordas/ícones ≥ 3:1 nos dois temas.
- [ ] Navegação completa por teclado testada, com foco sempre visível.
- [ ] Botões só com ícone têm aria-label; imagens informativas têm texto alternativo.
- [ ] Interface verificada com prefers-reduced-motion ativo e zoom de 200%.
- [ ] Build de produção usando o dist/ publicado (ESM + CJS + styles.css).

## Próximos passos

- **Cor** — Paletas, tokens semânticos e a regra do acento único.
- **Tema** — Claro, escuro, por seção ou com a cor da sua marca.
- **Acessibilidade** — O que os componentes garantem e o que fica com você.
- **Componentes** — Todos os componentes com exemplos ao vivo e API.

- Explore os estados de cada componente no Storybook .
- Encontrou um problema? Abra uma issue no GitHub .
