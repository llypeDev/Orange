---
name: orange-ui
description: Constrói interfaces React com o Orange Design System (@orangesys/ui e @orangesys/tokens) — componentes acessíveis (WCAG 2.2 AA), temas escuro, claro e de alto contraste por tokens CSS, interface em PT/EN. Use ao criar, revisar ou refatorar telas, formulários, painéis, tabelas ou componentes num projeto que usa (ou vai usar) @orangesys/ui, ou quando o pedido citar Orange, orangesys, tokens --or-* ou o estilo carvão, creme e laranja.
---

# Orange UI (`@orangesys/ui`)

Design system React 19 + TypeScript, open source: componentes acessíveis (WCAG 2.2 AA), quatro temas
trocados por um atributo (`data-theme`) e mensagens internas em PT-BR e EN. Linguagem visual
geométrica: fundo carvão, texto creme, **um único acento laranja**, cantos retos, bordas de 1px e
grade explícita. Site: https://orange.llypedev.com.br · Código: https://github.com/llypeDev/Orange

## Como trabalhar

1. **Escolha** os componentes em [references/components.md](references/components.md) (índice por
   categoria, com uma linha sobre cada um) ou na tabela "Preciso de…" abaixo.
2. **Leia** `references/components/<slug>.md` de cada componente que for usar, antes de escrever o
   código. Ele traz as props reais (geradas do TypeScript), os tipos exportados (seção "Tipos",
   como `FormValues` ou `SelectOption`), boas práticas, faça/evite, teclado, WCAG e exemplos
   completos que funcionam. **Não invente props**: o que não está na tabela não existe — exceto os
   atributos nativos que o componente repassa (`name`, `required`, `disabled`, `className`,
   `aria-*`…), indicados na linha "Repassa também…" depois de cada tabela.
3. **Tela inteira?** Parta de um modelo: [sign-in](references/templates/sign-in.md),
   [dashboard](references/templates/dashboard.md) ou [settings](references/templates/settings.md) —
   código completo, componentes usados e decisões de acessibilidade.
4. **Demais referências:** [foundations.md](references/foundations.md) (`OrangeProvider`, `Field`,
   `Heading`/`Text`/`Eyebrow`, `Icon`, `Portal`, utilitários como `cx`) ·
   [hooks.md](references/hooks.md) · [tokens.md](references/tokens.md) ·
   [icons.md](references/icons.md) · guias em `references/guides/` (getting-started, theme, styles,
   i18n, versioning, accessibility, color, typography, grid, iconography, motion,
   data-visualization).

## Configuração (uma vez por aplicação)

```bash
npm install @orangesys/ui   # já traz @orangesys/tokens; react e react-dom são peer deps (18.2 ou 19)
```

```tsx
// main.tsx — estilos uma única vez e o provider na raiz
import '@orangesys/ui/styles.css'
import { OrangeProvider } from '@orangesys/ui'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <OrangeProvider defaultTheme="system" locale="pt-BR">
    <App />
  </OrangeProvider>,
)
```

- Fontes (no `<head>`): Space Grotesk (títulos), Inter (texto) e JetBrains Mono (código) do Google
  Fonts — o link exato está em `references/guides/getting-started.md`. Sem elas o sistema cai em
  fontes do sistema.
- `OrangeProvider`: `theme`/`defaultTheme` (`dark` padrão, `light`, `dark-hc`, `light-hc`,
  `system`), `onThemeChange`, `themeTarget` (`document` | `scoped`), `locale` (`pt-BR` padrão,
  `en-US`) e `messages` (sobrescreve textos internos). `useTheme()` lê e troca o tema.
- `ToastProvider`, uma vez, na raiz (dentro do `OrangeProvider`), se a aplicação usar `useToast()`.
  O hook só funciona num componente **descendente** do provider (fora dele, lança erro) — nunca
  no mesmo componente que renderiza o `ToastProvider`.
- Landmarks: o `AppShell` já cria `header`, `nav`, `main` e o link "Pular para o conteúdo". Uma
  tela dentro dele não cria outro `<main>`; uma página avulsa usa `Container as="main"`.
- Next.js App Router: o provider vai num componente `'use client'`; veja "Next.js e SSR" em
  `references/guides/getting-started.md` (inclui o script que evita o flash de tema).

## Preciso de… → use

| Preciso de…                                     | Use                                                                                             | Não use                               |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| Disparar uma ação                               | `Button` (um `primary` por contexto), `IconButton` só com ícone                                 | `Link`                                |
| Ir para outra página                            | `Link` (`as={RouterLink}` com roteador) ou `buttonClassName()` num link                         | `Button` com `onClick` navegando      |
| Texto de uma linha / várias                     | `TextField` / `TextArea`                                                                        | `<input>` cru                         |
| Escolher 1 entre poucas opções visíveis         | `RadioGroup` (ou `SegmentedControl` para 2–5 opções de visualização)                            | `Select` com 2 opções                 |
| Escolher 1 numa lista curta                     | `Select` (nativo); com ícones/descrições/grupos, `Picker`                                       | —                                     |
| Escolher 1 numa lista longa, com busca          | `Combobox`                                                                                      | `Select` com 200 itens                |
| Escolher vários                                 | `Checkbox` em `CheckboxGroup`, `MultiSelect` (com busca), `Chip` (filtros rápidos)              | —                                     |
| Liga/desliga com efeito imediato                | `Switch`                                                                                        | `Checkbox`                            |
| Opção que só vale ao enviar o formulário        | `Checkbox`                                                                                      | `Switch`                              |
| "Cancelar" num cadastro                         | `Link`/`buttonClassName()` para voltar; `Button` + `ConfirmDialog` se houver alterações         | `Button` que navega                   |
| Data, período, data e hora, hora                | `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimeField`                                  | `<input type="date">`                 |
| Dinheiro, número                                | `CurrencyField`, `NumberField`                                                                  | `TextField` com máscara manual        |
| Formulário com validação e resumo de erros      | `Form` (+ `ErrorSummary`, `Fieldset`)                                                           | validar só com cor                    |
| Confirmar ação destrutiva                       | `ConfirmDialog` ou `useConfirm()`                                                               | `window.confirm`                      |
| Pedir decisão/informação bloqueante             | `Modal`; painel lateral: `Drawer`                                                               | —                                     |
| Menu de ações                                   | `Dropdown` (botão), `ContextMenu` (botão direito), `SplitButton`                                | `Select`                              |
| Dica curta num ícone / explicação clicável      | `Tooltip` / `Toggletip`; conteúdo rico não modal: `Popover`                                     | `title=`                              |
| Confirmar que algo deu certo                    | `Toast` (breve)                                                                                 | `Alert` que nunca some                |
| Aviso ligado a uma parte da página / ao sistema | `Alert` / `Banner`                                                                              | `Toast` para erro que precisa de ação |
| Carregando                                      | `Skeleton` (forma do conteúdo), `Spinner` (curto), `ProgressBar` (mensurável), `LoadingOverlay` | —                                     |
| Sem conteúdo                                    | `EmptyState` (explica e oferece o próximo passo)                                                | lista vazia muda                      |
| Tabela de dados                                 | `Table` (ordenação, filtros, seleção, colunas fixas, `virtualized` para milhares) + `Paginator` | `<table>` sem cabeçalhos              |
| Lista interativa com ações                      | `ListView`; reordenar: `SortableList`; árvore: `TreeView`                                       | —                                     |
| Métrica                                         | `Stat`/`StatGroup` (+ `Sparkline`); gráficos: `BarChart`, `LineChart`, `DonutChart`, `BarList`  | gráfico sem tabela de dados           |
| Estrutura de app                                | `AppShell` + `AppHeader` + `SideNav`; topo de página: `PageHeader`                              | layout manual com `position: fixed`   |
| Espaçar e alinhar                               | `Stack` (`direction`, `gap` na escala, responsivo), `Grid`, `Container`, `Paper`, `Divider`     | `margin` solto                        |
| Títulos e texto                                 | `Heading` (`level` pela hierarquia, `size` pelo visual), `Text`, `Eyebrow`                      | `<h1>` com estilo próprio             |

Na dúvida entre dois, leia "Boas práticas" no arquivo de cada um: quase todos dizem quando usar o
outro.

## Convenções da API

- Imports nomeados de `@orangesys/ui` (tree-shakeable). Nunca importe de `dist/` nem de caminhos
  internos.
- Controlado ou não controlado: `value` + `defaultValue` com um callback de mudança. `TextField` e
  `TextArea` têm `onValueChange(valor)` e mantêm o `onChange` nativo; `Select` é o `<select>`
  nativo (`onChange` com o evento); widgets próprios (`Tabs`, `Picker`, `Combobox`…) usam
  `onChange(valor)`; liga/desliga usa `checked` + `onCheckedChange`; sobreposições usam `open` +
  `onOpenChange`. Confirme sempre na tabela de props.
- Campos já trazem `label`, `description`, `error`, `required`, `optional` e `hideLabel` (o `Field`
  interno liga tudo por ARIA). Para um controle próprio, use `Field` com `useFieldControlProps()`.
- Tamanhos `sm` | `md` | `lg` (32/40/48px nos controles); tons por `tone`; refs são repassadas ao
  elemento nativo.

## Estilo

- **Só tokens**: `var(--or-color-text)`, `var(--or-color-surface)`, `var(--or-space-4)`… — nunca
  hex, rgb ou px soltos para cor, espaço, raio, sombra ou duração. As cores semânticas mudam com o
  tema; as primitivas `--or-palette-*` não (não use direto). Lista completa: `references/tokens.md`.
- Personalize sobrescrevendo **tokens públicos** num escopo (`.compacto { --or-control-md: 2rem }`),
  nunca as classes internas (`.or-button__label`) nem variáveis privadas (`--_bg`).
- Os exemplos espaçam com `Stack` (`gap` na escala), e o CSS dos modelos usa classes próprias com
  tokens — os dois seguem estas regras. O `style` inline que sobra nos exemplos só enquadra a
  demonstração (largura máxima, uma margem pontual); no seu código, prefira classes suas com
  `var(--or-*)`.
- Identidade: cantos retos (sem `border-radius` arredondado), bordas de 1px, um só acento laranja
  (`--or-color-accent`) — não introduza outras cores de destaque. Ícones: `<Icon name="…" />`
  (nomes em `references/icons.md`), não SVGs avulsos.
- Movimento: componentes já animam e respeitam `prefers-reduced-motion`. Para o resto, use os
  utilitários (`or-press`, `or-lift`, `or-nudge`…), `Reveal` e os hooks de movimento
  (`references/guides/motion.md`); animação própria precisa de `@media (prefers-reduced-motion:
reduce)`.

## Acessibilidade (não negociável)

- Todo campo tem rótulo visível (`label`); se o design esconder, use `hideLabel`, nunca omita.
  Placeholder não é rótulo.
- Botão só com ícone: `IconButton` com `label` (ou `Button iconOnly` com `aria-label`) descrevendo a
  ação ("Remover do carrinho"), não o desenho. Ícone que transmite sentido sozinho: `label` no
  `Icon`.
- Um `h1` por página; `Heading level` segue a hierarquia, não o tamanho.
- Erros dizem o que fazer ("Informe um e-mail no formato nome@empresa.com.br"), não só "Inválido";
  nunca só cor para indicar estado.
- Não remova o foco visível; não prenda nem perca o foco (os overlays do Orange já prendem e
  devolvem).
- Mudanças assíncronas: `Toast`, `Alert` com live region ou `SaveStatus` — não mude a tela em
  silêncio.
- Gráficos com título e descrição; os do Orange trazem uma tabela com os mesmos números (o "Ver
  dados") — não a esconda.
- Confira nos quatro temas (escuro, claro e alto contraste) e com teclado (Tab, setas, Esc).

## Textos e dados

- Interface no idioma do produto (PT-BR por padrão), com verbos nos botões ("Salvar projeto", não
  "OK"). Textos internos dos componentes seguem o `locale` do provider.
- Datas, moedas e tempos relativos pelos componentes (`DatePicker`, `CurrencyField`,
  `RelativeTime`), que formatam pelo idioma.
- Dados de exemplo sempre fictícios. Não use números reais ou realistas de documentos pessoais
  (CPF, RG), telefones nem números de cartão; em demonstrações, prefira nomes e e-mails de uma
  empresa fictícia.

## Antes de entregar

- [ ] Cada componente usado foi conferido no seu `references/components/<slug>.md` (props existem).
- [ ] Nenhuma cor/espaço fixo: só `var(--or-*)`; nada estiliza classes internas.
- [ ] Rótulos, `aria-label` em botões de ícone, hierarquia de títulos e mensagens de erro úteis.
- [ ] Funciona em tema claro e escuro, no teclado e em 390px de largura.
- [ ] `@orangesys/ui/styles.css` importado uma vez e o app dentro do `OrangeProvider`.
