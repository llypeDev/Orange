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

## Componentes

103 componentes documentados, cada um com testes automatizados (incluindo axe-core), stories no
Storybook e página bilíngue com boas práticas, exemplos ao vivo, props e acessibilidade (teclado e
critérios WCAG). Além deles, a base inclui `Field`, `Portal`, tipografia
(`Heading`, `Text`, `Eyebrow`), 20 hooks, 92 ícones e o `OrangeProvider` (tema + idioma).

| Categoria | Componentes |
| --- | --- |
| Ações (8) | Button, ButtonGroup, CopyButton, IconButton, SegmentedControl, SplitButton, ToggleButton, Toolbar |
| Formulários (26) | Checkbox, ColorField, Combobox, CurrencyField, DatePicker, DateRangePicker, ErrorSummary, Fieldset, FileUploader, Form, InlineEdit, Listbox, MultiSelect, NumberField, PasswordField, PinInput, RadioGroup, Rating, Search, Select, Slider, Switch, TagInput, TextArea, TextField, TimeField |
| Feedback (10) | Alert, Banner, EmptyState, LoadingOverlay, Meter, ProgressBar, ProgressCircle, Skeleton, Spinner, Toast |
| Sobreposições (11) | CommandPalette, ConfirmDialog, ContextMenu, Drawer, Dropdown, HoverCard, Modal, Popover, Toggletip, Tooltip, Tour |
| Navegação (12) | AppHeader, BackToTop, BottomNavigation, Breadcrumb, Link, MonthPaginator, Paginator, SideNav, SkipLink, Stepper, TableOfContents, Tabs |
| Exibição de dados (21) | Accordion, Avatar, AvatarGroup, Badge, BarChart, Card, Carousel, Chip, CodeBlock, DescriptionList, Image, Kbd, LineChart, List, SortableList, Sparkline, Stat, Table, Tag, Timeline, TreeView |
| Layout (9) | AppShell, Container, Divider, Footer, Grid, PageHeader, Paper, Splitter, Stack |
| Utilitários (6) | ExpandableText, Highlight, RelativeTime, Reveal, TruncatedText, VisuallyHidden |

## Motion

O Orange se move como o zop.dev: **rápido, funcional e geométrico** — e tudo desliga com
`prefers-reduced-motion`.

- **Tokens** (`@orange/tokens`): durações `press` (90ms) · `fast` · `medium` · `slow` · `reveal` ·
  `loop`; curvas `out`, `in-out`, `spring`, `bounce`; distâncias `sm` · `md` · `lg` · `lift`; `stagger`.
- **Utilitários** (`motion.css`): `or-press` (afundar no clique), `or-lift` (subir 4px com sombra sólida
  na base e barra de acento descendo pela borda esquerda, como os cartões do zop.dev), `or-nudge` (seta que desliza), `or-underline`, `or-collapse` (altura 0fr → 1fr),
  `or-pulse`, `or-shake`, `or-motion-pop/drop/fade` (entrada e saída por `data-state`).
- **Hooks**: `usePresence` (animação de saída antes de desmontar), `useInView`, `useCountUp`,
  `useScrollDirection`; componente **`Reveal`** para revelação no scroll com escalonamento.
- **Em todos os componentes**: sobreposições com entrada e saída, indicadores deslizantes (abas,
  segmentos, polegar), checks desenhados, chips e tags que entram e saem, tremor em erros,
  progresso com transição, cartões que sobem, contadores e linhas do tempo animadas — cada página
  da documentação tem uma seção **Movimento** com o que anima, a duração e a curva.
- **No site**: entrada de página, cabeçalho que se esconde ao rolar, revelação das seções, passos em
  loop com barra temporizada, troca de tema com View Transitions e botão "Pausar animações"
  (WCAG 2.2.2). O Storybook tem um seletor de **movimento reduzido** na barra.

## Documentação

Mesma organização do [Lemonade UI](https://lemonade-ui.llypedev.com.br/pt/): **Começando**,
**Sobre**, **Design Guidelines** (acessibilidade, cor, visualização de dados, grid, iconografia,
movimento, tipografia), **Usando** (estilos, tema, i18n, hooks), **Componentes** (visão geral +
uma página por componente), **Recursos** e **Storybook** — em português e inglês, com temas claro e
escuro.

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
