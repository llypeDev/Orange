# Tokens de design

Estilize sempre com as variáveis CSS do Orange (`var(--or-…)`), nunca com cores ou medidas fixas: assim o estilo acompanha os quatro temas (escuro, claro e os dois de alto contraste) e a escala do sistema. As variáveis vêm de `@orangesys/ui/styles.css` (ou `@orangesys/tokens/tokens.css`, se usar só os tokens). Os mesmos valores existem em JS: `import { themes, space, motion, breakpoints } from '@orangesys/tokens'`.

## Cores semânticas (mudam com o tema)

Use estas — não as primitivas da paleta. `*-subtle` são fundos suaves; `*-text` é o texto sobre o fundo padrão; `text-on-*` é o texto sobre o preenchimento sólido.

| Variável | escuro | claro | escuro alto contraste | claro alto contraste |
| --- | --- | --- | --- | --- |
| `--or-color-bg` | `#0f0f12` | `#faf7ec` | `#0a0a0d` | `#fffdf6` |
| `--or-color-bg-subtle` | `#16161a` | `#f0ebdb` | `#0f0f12` | `#faf7ec` |
| `--or-color-surface` | `#0f0f12` | `#fffdf6` | `#0a0a0d` | `#fffdf6` |
| `--or-color-surface-raised` | `#1c1c21` | `#fffdf6` | `#0f0f12` | `#fffdf6` |
| `--or-color-surface-hover` | `#2a2a30` | `#ece7d7` | `#1c1c21` | `#ece7d7` |
| `--or-color-surface-active` | `#3a3a42` | `#e2ddcd` | `#2a2a30` | `#e2ddcd` |
| `--or-color-surface-inverse` | `#f0ebdb` | `#0f0f12` | `#faf7ec` | `#0f0f12` |
| `--or-color-overlay` | `rgba(5, 5, 7, 0.72)` | `rgba(15, 15, 18, 0.48)` | `rgba(0, 0, 0, 0.8)` | `rgba(15, 15, 18, 0.64)` |
| `--or-color-shadow` | `rgba(0, 0, 0, 0.55)` | `rgba(15, 15, 18, 0.14)` | `rgba(0, 0, 0, 0.7)` | `rgba(15, 15, 18, 0.28)` |
| `--or-color-text` | `#f0ebdb` | `#0f0f12` | `#faf7ec` | `#0f0f12` |
| `--or-color-text-muted` | `#b8b0a0` | `#525252` | `#d4cdb5` | `#2a2a2a` |
| `--or-color-text-subtle` | `#9c9588` | `#666057` | `#b8b0a0` | `#525252` |
| `--or-color-text-disabled` | `#6b6b74` | `#8a8478` | `#85858e` | `#666057` |
| `--or-color-text-inverse` | `#0f0f12` | `#faf7ec` | `#0a0a0d` | `#fffdf6` |
| `--or-color-text-on-accent` | `#0f0f12` | `#0f0f12` | `#0a0a0d` | `#fffdf6` |
| `--or-color-border` | `#2a2a30` | `#d9d3bf` | `#9c9588` | `#525252` |
| `--or-color-border-subtle` | `#1f1f26` | `#e2ddcd` | `#85858e` | `#666057` |
| `--or-color-border-strong` | `#3a3a42` | `#c9c4b5` | `#b8b0a0` | `#2a2a2a` |
| `--or-color-border-control` | `#75757f` | `#7a7468` | `#b8b0a0` | `#2a2a2a` |
| `--or-color-accent` | `#f58549` | `#d4622a` | `#f58549` | `#8a3a10` |
| `--or-color-accent-hover` | `#f6945f` | `#e06a2c` | `#f6945f` | `#6b2e0e` |
| `--or-color-accent-active` | `#e06a2c` | `#b85a24` | `#f8a675` | `#6b2e0e` |
| `--or-color-accent-subtle` | `rgba(245, 133, 73, 0.12)` | `rgba(212, 98, 42, 0.12)` | `rgba(245, 133, 73, 0.16)` | `rgba(138, 58, 16, 0.08)` |
| `--or-color-accent-text` | `#f58549` | `#9c4416` | `#f6945f` | `#6b2e0e` |
| `--or-color-accent-border` | `rgba(245, 133, 73, 0.45)` | `rgba(184, 90, 36, 0.5)` | `#f58549` | `#8a3a10` |
| `--or-color-neutral` | `#f0ebdb` | `#0f0f12` | `#faf7ec` | `#0f0f12` |
| `--or-color-neutral-hover` | `#faf7ec` | `#2b2b2c` | `#f0ebdb` | `#2a2a2a` |
| `--or-color-text-on-neutral` | `#0f0f12` | `#faf7ec` | `#0a0a0d` | `#fffdf6` |
| `--or-color-success` | `#7fb236` | `#7fb236` | `#7fb236` | `#22390b` |
| `--or-color-success-subtle` | `rgba(127, 178, 54, 0.14)` | `rgba(127, 178, 54, 0.16)` | `rgba(127, 178, 54, 0.16)` | `rgba(61, 102, 20, 0.1)` |
| `--or-color-success-text` | `#a6d16a` | `#3d6614` | `#a6d16a` | `#22390b` |
| `--or-color-warning` | `#e8c15a` | `#e8c15a` | `#e8c15a` | `#4d3200` |
| `--or-color-warning-subtle` | `rgba(232, 193, 90, 0.14)` | `rgba(232, 193, 90, 0.22)` | `rgba(232, 193, 90, 0.16)` | `rgba(165, 124, 16, 0.14)` |
| `--or-color-warning-text` | `#efd27f` | `#8a5a00` | `#efd27f` | `#4d3200` |
| `--or-color-danger` | `#ef6a5a` | `#b42318` | `#f79a8f` | `#961d13` |
| `--or-color-danger-hover` | `#f79a8f` | `#c9301f` | `#fde4e1` | `#6e140d` |
| `--or-color-danger-subtle` | `rgba(239, 106, 90, 0.14)` | `rgba(180, 35, 24, 0.1)` | `rgba(239, 106, 90, 0.16)` | `rgba(150, 29, 19, 0.08)` |
| `--or-color-danger-text` | `#f79a8f` | `#b42318` | `#f79a8f` | `#961d13` |
| `--or-color-text-on-danger` | `#0f0f12` | `#ffffff` | `#0a0a0d` | `#fffdf6` |
| `--or-color-text-on-success` | `#0f0f12` | `#0f0f12` | `#0a0a0d` | `#fffdf6` |
| `--or-color-text-on-warning` | `#0f0f12` | `#0f0f12` | `#0a0a0d` | `#fffdf6` |
| `--or-color-text-on-info` | `#fffdf6` | `#fffdf6` | `#0a0a0d` | `#fffdf6` |
| `--or-color-info` | `#4a66d4` | `#2a4494` | `#8da2ea` | `#2a4494` |
| `--or-color-info-subtle` | `rgba(74, 102, 212, 0.16)` | `rgba(42, 68, 148, 0.1)` | `rgba(74, 102, 212, 0.16)` | `rgba(42, 68, 148, 0.08)` |
| `--or-color-info-text` | `#8da2ea` | `#2a4494` | `#8da2ea` | `#2a4494` |
| `--or-color-focus` | `#f6945f` | `#b85a24` | `#f8a675` | `#6b2e0e` |
| `--or-color-grid-line` | `rgba(240, 235, 219, 0.045)` | `rgba(15, 15, 18, 0.05)` | `rgba(250, 247, 236, 0.08)` | `rgba(15, 15, 18, 0.08)` |
| `--or-color-code-bg` | `#0a0a0d` | `#0f0f12` | `#0f0f12` | `#0a0a0d` |
| `--or-color-code-text` | `#d4cdb5` | `#d4cdb5` | `#f0ebdb` | `#f0ebdb` |
| `--or-color-selection` | `rgba(245, 133, 73, 0.32)` | `rgba(245, 133, 73, 0.28)` | `rgba(245, 133, 73, 0.4)` | `rgba(138, 58, 16, 0.24)` |
| `--or-color-viz-1` | `#7fb236` | `#3d6614` | `#7fb236` | `#3d6614` |
| `--or-color-viz-2` | `#6b85e0` | `#4a66d4` | `#8da2ea` | `#4a66d4` |
| `--or-color-viz-3` | `#e8c15a` | `#8a5a00` | `#e8c15a` | `#8a5a00` |
| `--or-color-viz-4` | `#d4622a` | `#e06a2c` | `#d4622a` | `#6b2e0e` |
| `--or-color-viz-5` | `#f79a8f` | `#b42318` | `#f79a8f` | `#b42318` |
| `--or-color-viz-other` | `#75757f` | `#8a8478` | `#9c9588` | `#666057` |
| `--or-color-viz-seq-1` | `#6b2e0e` | `#fde2cf` | `#9c4416` | `#f8a675` |
| `--or-color-viz-seq-2` | `#9c4416` | `#fbc6a2` | `#b85a24` | `#f58549` |
| `--or-color-viz-seq-3` | `#b85a24` | `#f8a675` | `#d4622a` | `#e06a2c` |
| `--or-color-viz-seq-4` | `#d4622a` | `#f58549` | `#f58549` | `#b85a24` |
| `--or-color-viz-seq-5` | `#f58549` | `#d4622a` | `#f6945f` | `#9c4416` |
| `--or-color-viz-seq-6` | `#f8a675` | `#9c4416` | `#f8a675` | `#8a3a10` |
| `--or-color-viz-seq-7` | `#fde2cf` | `#6b2e0e` | `#fde2cf` | `#6b2e0e` |
| `--or-color-viz-div-1` | `#8da2ea` | `#2a4494` | `#8da2ea` | `#18275a` |
| `--or-color-viz-div-2` | `#6b85e0` | `#4a66d4` | `#6b85e0` | `#2a4494` |
| `--or-color-viz-div-3` | `#2a4494` | `#8da2ea` | `#4a66d4` | `#4a66d4` |
| `--or-color-viz-div-4` | `#55555e` | `#d9d3bf` | `#55555e` | `#c9c4b5` |
| `--or-color-viz-div-5` | `#9c4416` | `#f8a675` | `#b85a24` | `#e06a2c` |
| `--or-color-viz-div-6` | `#d4622a` | `#e06a2c` | `#f58549` | `#9c4416` |
| `--or-color-viz-div-7` | `#f8a675` | `#9c4416` | `#f8a675` | `#6b2e0e` |

## Escalas (iguais em todos os temas)

### font

| Variável | Valor |
| --- | --- |
| `--or-font-display` | `"Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--or-font-body` | `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| `--or-font-mono` | `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

### text

| Variável | Valor |
| --- | --- |
| `--or-text-2xs` | `0.6875rem` |
| `--or-text-xs` | `0.75rem` |
| `--or-text-sm` | `0.8125rem` |
| `--or-text-md` | `0.9375rem` |
| `--or-text-lg` | `1.0625rem` |
| `--or-text-xl` | `1.25rem` |
| `--or-text-2xl` | `1.5rem` |
| `--or-text-3xl` | `2rem` |
| `--or-text-4xl` | `2.75rem` |
| `--or-text-5xl` | `3.75rem` |
| `--or-text-display` | `5.375rem` |

### weight

| Variável | Valor |
| --- | --- |
| `--or-weight-regular` | `400` |
| `--or-weight-medium` | `500` |
| `--or-weight-semibold` | `600` |
| `--or-weight-bold` | `700` |

### leading

| Variável | Valor |
| --- | --- |
| `--or-leading-display` | `1` |
| `--or-leading-heading` | `1.1` |
| `--or-leading-tight` | `1.35` |
| `--or-leading-body` | `1.55` |
| `--or-leading-loose` | `1.7` |

### tracking

| Variável | Valor |
| --- | --- |
| `--or-tracking-display` | `-0.045em` |
| `--or-tracking-heading` | `-0.03em` |
| `--or-tracking-body` | `-0.005em` |
| `--or-tracking-meta` | `0.14em` |

### space

| Variável | Valor |
| --- | --- |
| `--or-space-0` | `0` |
| `--or-space-1` | `0.25rem` |
| `--or-space-2` | `0.5rem` |
| `--or-space-3` | `0.75rem` |
| `--or-space-4` | `1rem` |
| `--or-space-5` | `1.25rem` |
| `--or-space-6` | `1.5rem` |
| `--or-space-7` | `1.75rem` |
| `--or-space-8` | `2rem` |
| `--or-space-10` | `2.5rem` |
| `--or-space-12` | `3rem` |
| `--or-space-14` | `3.5rem` |
| `--or-space-16` | `4rem` |
| `--or-space-20` | `5rem` |
| `--or-space-24` | `6rem` |

### radius

| Variável | Valor |
| --- | --- |
| `--or-radius-none` | `0` |
| `--or-radius-sm` | `2px` |
| `--or-radius-md` | `4px` |
| `--or-radius-full` | `9999px` |

### border

| Variável | Valor |
| --- | --- |
| `--or-border-thin` | `1px` |
| `--or-border-thick` | `2px` |
| `--or-border-accent` | `3px` |

### shadow

| Variável | Valor |
| --- | --- |
| `--or-shadow-none` | `none` |
| `--or-shadow-lift` | `0 8px 0 -4px var(--or-color-text)` |
| `--or-shadow-hover-accent` | `0 8px 0 -4px var(--or-color-accent)` |
| `--or-shadow-hover-ink` | `0 4px 0 -2px var(--or-color-text)` |
| `--or-shadow-raised` | `0 1px 0 0 var(--or-color-border-strong)` |
| `--or-shadow-overlay` | `0 24px 64px -16px var(--or-color-shadow), 0 0 0 1px var(--or-color-border-strong)` |

### duration

| Variável | Valor |
| --- | --- |
| `--or-duration-press` | `90ms` |
| `--or-duration-instant` | `80ms` |
| `--or-duration-fast` | `160ms` |
| `--or-duration-medium` | `250ms` |
| `--or-duration-slow` | `400ms` |
| `--or-duration-reveal` | `600ms` |
| `--or-duration-slower` | `640ms` |
| `--or-duration-loop` | `2400ms` |

### ease

| Variável | Valor |
| --- | --- |
| `--or-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--or-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--or-ease-spring` | `cubic-bezier(0.2, 0.9, 0.3, 1.05)` |
| `--or-ease-snap` | `cubic-bezier(0.19, 1, 0.22, 1)` |
| `--or-ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### distance

| Variável | Valor |
| --- | --- |
| `--or-distance-sm` | `4px` |
| `--or-distance-md` | `8px` |
| `--or-distance-lg` | `24px` |
| `--or-distance-lift` | `-4px` |

### stagger

| Variável | Valor |
| --- | --- |
| `--or-stagger` | `80ms` |

### z

| Variável | Valor |
| --- | --- |
| `--or-z-base` | `0` |
| `--or-z-raised` | `10` |
| `--or-z-sticky` | `100` |
| `--or-z-header` | `200` |
| `--or-z-dropdown` | `1000` |
| `--or-z-overlay` | `1100` |
| `--or-z-modal` | `1200` |
| `--or-z-popover` | `1300` |
| `--or-z-toast` | `1400` |
| `--or-z-tooltip` | `1500` |

### layout

| Variável | Valor |
| --- | --- |
| `--or-layout-max-width` | `1200px` |
| `--or-layout-gutter` | `2rem` |
| `--or-layout-header-height` | `4rem` |
| `--or-layout-sidebar-width` | `17.5rem` |

### control

| Variável | Valor |
| --- | --- |
| `--or-control-sm` | `2rem` |
| `--or-control-md` | `2.5rem` |
| `--or-control-lg` | `3rem` |

## Paleta primitiva

61 cores base (`--or-palette-<família>-<nível>`) usadas para compor as semânticas. Não use direto em componentes: elas não mudam com o tema.
