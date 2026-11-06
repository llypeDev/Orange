# @orangesys/ui

## 1.3.0

### Minor Changes

- [#29](https://github.com/llypeDev/Orange/pull/29) [`a12ef94`](https://github.com/llypeDev/Orange/commit/a12ef94018aa5fb45e3a4158d4ce9b8513e3aab6) Thanks [@llypeDev](https://github.com/llypeDev)! - Novo hook `useScrollSpy(ids, { root, rootMargin })`: diz qual seção está sendo lida, para montar um índice "Nesta página" com qualquer visual. É o mesmo mecanismo do `TableOfContents` (que agora o usa por dentro): vence o primeiro título dentro da faixa; entre dois títulos, o que já passou (também ao subir); no fim da rolagem, o último à vista. Retorna `{ activeId, setActiveId }` — `setActiveId` marca uma seção no clique e segura a marca durante o salto, até a próxima interação. Aceita janela ou contêiner rolável (elemento ou ref), é seguro para SSR e um array novo de ids a cada render não reinicia a observação.

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@1.3.0

## 1.2.1

### Patch Changes

- [#27](https://github.com/llypeDev/Orange/pull/27) [`0dacbda`](https://github.com/llypeDev/Orange/commit/0dacbda7be6268a7f21c0454a84fc2a855569d82) Thanks [@llypeDev](https://github.com/llypeDev)! - Correções no fim da faixa: o último item, seção, valor ou opção passa a ser alcançável e visível.

  - `TableOfContents`: no fim da rolagem marca a última seção (uma seção final curta nunca chegava à faixa); entre dois títulos marca a que já passou — também ao subir; o item clicado continua marcado durante o salto. A seção ativa vem da geometria dos títulos a cada quadro, não só dos eventos do IntersectionObserver.
  - `useInView` e `Reveal`: com margem inferior negativa (o padrão), o que fica nos últimos pixels da página conta como visto no fim da rolagem — antes o `Reveal` ficava invisível para sempre. Esconder passa a ser instantâneo: abaixo da dobra o conteúdo não esmaece mais ao carregar, e `appear` volta a animar.
  - `Combobox`, `MultiSelect` e `Picker`: abrir na última opção (↑, End) ou na escolhida a deixa à vista, inclusive com movimento reduzido.
  - `Dropdown`, `ContextMenu` e `SplitButton`: End, PageDown, a volta das setas e a busca por letra rolam o menu até o item focado; no primeiro item volta ao topo e mostra o título do grupo. `SplitButton` limita a altura do menu ao espaço disponível.
  - `CommandPalette`: ao voltar ao primeiro item de um grupo, o título do grupo volta à vista.
  - `Tabs`: numa lista com rolagem, a aba selecionada ou focada fica inteira à vista (só a lista rola).
  - `Table` com cabeçalho fixo: o foco não fica escondido sob o cabeçalho (`scroll-padding-top` com a altura medida do `thead`, WCAG 2.4.11).
  - `Stepper` compacto: com o fluxo concluído, o rótulo da última etapa continua visível.
  - `Slider`: valores padrão e controlados passam pela mesma sanitização do input nativo (saída, polegar e `aria-valuenow` concordam); precisão considera `min` e notação exponencial; `marks` não perde a última marca; aviso em desenvolvimento quando `step` não divide `max − min`.
  - `ProgressBar`, `ProgressCircle` e `FileUploader`: o percentual arredonda para baixo e só mostra 100% ao concluir.

- Updated dependencies []:
  - @orangesys/tokens@1.2.1

## 1.2.0

### Minor Changes

- [#24](https://github.com/llypeDev/Orange/pull/24) [`c6199a6`](https://github.com/llypeDev/Orange/commit/c6199a6bd9eef6fe0c2d23703d7f7c7c21534bd9) Thanks [@llypeDev](https://github.com/llypeDev)! - Seis componentes novos e dois recursos novos em componentes existentes:

  - `NavigationMenu`: navegação com painéis e mega-menu no padrão APG "disclosure navigation menu"; o `AppHeader` aceita `items` em cada item (painéis no desktop, seções sanfonadas no menu do celular).
  - `DateTimePicker`: data e hora num campo só (Date local), com calendário, `min`/`max`, `defaultTime` e envio em `aaaa-mm-ddTHH:mm`.
  - `ChatThread`, `ChatMessage` e `ChatComposer`: conversas com assistentes, suporte e comentários; log rolável que segue o fim, "Novas mensagens", anúncio único da última mensagem e composer com Enter/Shift+Enter.
  - `ConsentBanner`: consentimento de cookies para a LGPD, com aceitar, rejeitar e personalizar com o mesmo peso e categorias em checkboxes; não grava cookies sozinho.
  - `TaskList` + `TaskListItem`: checklist de configuração com status e progresso (padrão Task list do GOV.UK).
  - `SaveStatus`: indicador de autosave ("Salvando…", "Salvo há 2 min.", erro com "Tentar de novo"), anunciado só nas transições.
  - `Table`: linhas expansíveis com painel de detalhes (`renderExpanded`, `expandedRows`/`defaultExpandedRows`/`onExpandedRowsChange`, `isRowExpandable`).

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@1.2.0

## 1.1.0

### Minor Changes

- [#22](https://github.com/llypeDev/Orange/pull/22) [`dde9732`](https://github.com/llypeDev/Orange/commit/dde9732acab3c360ba20d6720890abe142bbfafc) Thanks [@llypeDev](https://github.com/llypeDev)! - Oito componentes novos, todos com teclado completo, WCAG 2.2 AA, temas de alto contraste e forced-colors:

  - `Picker`: select customizado (padrão APG "select-only combobox") com ícones, descrições, opções desabilitadas e grupos; integra com `Form`/FormData.
  - `ActionBar`: barra de ações em lote para seleções (Table, ListView, CheckboxGroup), com contagem anunciada, `onDismiss` e modo portal ou inline.
  - `ListView` + `ListViewItem`: lista interativa com seleção (`selectionMode`, `selected`/`defaultSelected`/`onSelectedChange`), `onAction` e ações por linha.
  - `DonutChart`: participação no todo, com o mesmo frame, tabela de dados e exploração por teclado dos outros gráficos.
  - `BarList`: ranking em barras horizontais, com links por linha e "Mostrar todos".
  - `Disclosure`: área única de mostrar/ocultar, variantes `inline` e `outline`.
  - `Prose` e `Blockquote`: tipografia para HTML de CMS/Markdown e citações.

  `CheckboxGroup` ganha `variant="card"`, igual ao do `RadioGroup`. Correções: o conteúdo do `Accordion` que fecha fica `inert` já durante a animação de saída (antes continuava focável por 250 ms); o `Calendar` (e o `DatePicker`) usa células menores em telas de até 24rem, como o `RangeCalendar`, e cabe em 320px; a `Table` vira região focável também quando rola na horizontal (telas estreitas), não só com `maxHeight`.

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@1.1.0

## 1.0.0

### Major Changes

- [#20](https://github.com/llypeDev/Orange/pull/20) [`4c84062`](https://github.com/llypeDev/Orange/commit/4c840623ef8502b031fd8c1e1f9d58192a310a80) Thanks [@llypeDev](https://github.com/llypeDev)! - Incompatível: Orange 1.0 — a API pública fica estável e saem os nomes depreciados na 0.6. Daqui em diante, mudanças incompatíveis só numa nova major, sempre depois de uma depreciação.

  Migração (os valores e os argumentos dos callbacks são os mesmos; só o nome muda):

  | Onde                             | Antes               | Agora                  |
  | -------------------------------- | ------------------- | ---------------------- |
  | `SegmentedControl`               | `fullWidth`         | `block`                |
  | `DropdownRadioGroup`             | `onValueChange`     | `onChange`             |
  | `FileUploader`                   | `onFilesChange`     | `onChange`             |
  | `Table`                          | `onSelectionChange` | `onSelectedRowsChange` |
  | `LoadingOverlay`                 | `visible`           | `open`                 |
  | `Toast`                          | `onClose`           | `onDismiss`            |
  | `ChipGroup`, `ToggleButtonGroup` | `type`              | `selectionMode`        |
  | `Stepper`                        | `activeStep`        | `step`                 |
  | `AppShell`                       | `navBreakpoint`     | `navDrawerBelow`       |

  `clamp`, `range`, `setRef` e `getFocusableElements` saem da API pública: use `Math.min(Math.max(value, min), max)`, `Array.from({ length: end - start + 1 }, (_, i) => start + i)`, `mergeRefs` e `useFocusTrap`. Se o projeto já roda sem avisos de depreciação no console da 0.6, a atualização não exige mudanças.

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@1.0.0

## 0.6.0

### Minor Changes

- [#16](https://github.com/llypeDev/Orange/pull/16) [`a48a385`](https://github.com/llypeDev/Orange/commit/a48a385104d81fb0beedc610932639cfa0febea3) Thanks [@llypeDev](https://github.com/llypeDev)! - Depreciado: seis props ganharam o nome usado no resto da biblioteca, antes de a API congelar na 1.0. Os nomes antigos continuam funcionando até a v1.0 e avisam no console em desenvolvimento.

  | Componente           | Antes               | Agora                                                                |
  | -------------------- | ------------------- | -------------------------------------------------------------------- |
  | `SegmentedControl`   | `fullWidth`         | `block` (como no `Button`)                                           |
  | `DropdownRadioGroup` | `onValueChange`     | `onChange` (como no `RadioGroup`)                                    |
  | `FileUploader`       | `onFilesChange`     | `onChange` (par de `value`/`defaultValue`)                           |
  | `Table`              | `onSelectionChange` | `onSelectedRowsChange` (par de `selectedRows`/`defaultSelectedRows`) |
  | `LoadingOverlay`     | `visible`           | `open` (como nas outras sobreposições)                               |
  | `Toast`              | `onClose`           | `onDismiss` (como em `Alert`, `Banner` e `toast()`)                  |

  Migração: troque o nome da prop; os valores e os argumentos dos callbacks são os mesmos.

- [#18](https://github.com/llypeDev/Orange/pull/18) [`91c585e`](https://github.com/llypeDev/Orange/commit/91c585e4f92d51607f374703b4f28ce6f6276c69) Thanks [@llypeDev](https://github.com/llypeDev)! - Depreciado: mais quatro nomes alinhados antes de a API congelar na 1.0. Os antigos continuam funcionando até a v1.0 e avisam no console em desenvolvimento.

  | Onde                             | Antes                                              | Agora                                                                             |
  | -------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
  | `ChipGroup`, `ToggleButtonGroup` | `type`                                             | `selectionMode` (como em `Listbox` e `TreeView`)                                  |
  | `Stepper`                        | `activeStep`                                       | `step` (como no `Tour`); agora opcional, padrão `0`                               |
  | `AppShell`                       | `navBreakpoint`                                    | `navDrawerBelow` (no padrão de `AppHeader.collapseBelow` e `Splitter.stackBelow`) |
  | utilitários                      | `clamp`, `range`, `setRef`, `getFocusableElements` | saem da API pública na v1.0                                                       |

  O `ToggleButtonGroup` passa a aceitar a omissão do modo, com seleção única como padrão. O `Accordion` mantém `type`, porque ali o modo é de expansão, não de seleção. Continuam públicos os utilitários que ajudam a compor com os componentes: `cx`, `mergeRefs`, `composeEventHandlers` e `interpolate`.

  Migração: troque o nome da prop; os valores são os mesmos. Para os utilitários, a mensagem no console mostra o equivalente em uma linha.

- [#18](https://github.com/llypeDev/Orange/pull/18) [`91c585e`](https://github.com/llypeDev/Orange/commit/91c585e4f92d51607f374703b4f28ce6f6276c69) Thanks [@llypeDev](https://github.com/llypeDev)! - Todo campo que aceita `error` agora também aceita `invalid`, que marca o campo como inválido sem mostrar mensagem (por exemplo, quando o erro aparece num `ErrorSummary`). A prop é nova em `Field`, `CheckboxGroup`, `RadioGroup`, `ColorField`, `DatePicker`, `DateRangePicker`, `TimeField`, `Rating` e `FileUploader`, e se comporta como `error` sem a mensagem. `Field` passa a repassar `ref` para a `div` raiz.

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@0.6.0

## 0.5.1

### Patch Changes

- Updated dependencies [[`bf03fa2`](https://github.com/llypeDev/Orange/commit/bf03fa2e0dab23ac28c4440488106bd15d8b0f75)]:
  - @orangesys/tokens@0.5.1

## 0.5.0

### Minor Changes

- [#8](https://github.com/llypeDev/Orange/pull/8) [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6) Thanks [@llypeDev](https://github.com/llypeDev)! - Gráficos, reordenação, tour guiado, painéis redimensionáveis e Listbox — todos operáveis sem mouse e sem depender só de cor.

  - `BarChart`, `LineChart` e `Sparkline` em SVG puro, com tabela de dados alternativa e exploração por teclado.
  - `SortableList`: reordene arrastando, pelo teclado ou com os botões "Mover para cima/baixo" (WCAG 2.5.7).
  - `Tour`: passo a passo com destaque no elemento, foco gerenciado e painel inferior no celular.
  - `Splitter`: painéis redimensionáveis no padrão APG Window Splitter, com recolher pelo Enter.
  - `Listbox`: lista de seleção única ou múltipla, com grupos, busca ao digitar e integração com o `Form`.

- [#8](https://github.com/llypeDev/Orange/pull/8) [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6) Thanks [@llypeDev](https://github.com/llypeDev)! - Primeira publicação no npm. Os dois pacotes passam a sair juntos, sempre com a mesma versão, com changelog gerado a partir dos changesets e publicação com provenance.

  - `@orangesys/ui`: ESM (`dist/orange-ui.js`) e CommonJS (`dist/orange-ui.cjs`), tipos em um único arquivo para `import` e `require` (`index.d.ts` / `index.d.cts`) e `@orangesys/ui/styles.css` com todos os estilos e tokens.
  - `@orangesys/tokens`: tokens em TypeScript (ESM) e `@orangesys/tokens/tokens.css` com as custom properties `--or-*`.
  - `react` e `react-dom` passam a ser peer dependencies com faixa explícita: `^18.2.0 || ^19.0.0`.
  - Política de versionamento e depreciação publicada em https://orange.llypedev.com.br/pt/usage/versioning.

- [#8](https://github.com/llypeDev/Orange/pull/8) [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b) Thanks [@llypeDev](https://github.com/llypeDev)! - Temas de alto contraste e suporte completo a `forced-colors`.

  - Novos temas `dark-hc` e `light-hc` (contraste AAA) e o modo `system` passa a seguir `prefers-contrast: more`.
  - Novos tokens `text-on-success`, `text-on-warning` e `text-on-info`; o `Badge` usa-os em vez de cores fixas.
  - `forced-colors` (contraste do Windows) em todos os componentes, com um teste que impede regressões.
  - Exportação dos tokens em DTCG (um arquivo por modo) e o script `figma:sync` para as variáveis do Figma.
  - `OrangeProvider` aninhado sem tema próprio herda o tema do provider de fora.

### Patch Changes

- [#8](https://github.com/llypeDev/Orange/pull/8) [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b) Thanks [@llypeDev](https://github.com/llypeDev)! - `AppShell`: com o cabeçalho fixo, a rolagem da página reserva a altura dele, para que o elemento em foco nunca fique escondido sob o cabeçalho (WCAG 2.4.11).

- [#8](https://github.com/llypeDev/Orange/pull/8) [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b) Thanks [@llypeDev](https://github.com/llypeDev)! - `SortableList`: o arraste agora alcança a última posição. Com itens da mesma altura, mover o penúltimo item (ou qualquer outro) para o fim não mudava a ordem.
- Updated dependencies [[`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6), [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b), [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6)]:
  - @orangesys/tokens@0.5.0
