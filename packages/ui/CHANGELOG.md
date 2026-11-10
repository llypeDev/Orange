# @orangesys/ui

## 1.5.0

### Minor Changes

- [#46](https://github.com/llypeDev/Orange/pull/46) [`799c710`](https://github.com/llypeDev/Orange/commit/799c710b27e44b8457e5d6db66a27e2b3047e8eb) Thanks [@llypeDev](https://github.com/llypeDev)! - `TimeField` em segmentos próprios, no lugar do `<input type="time">` visível do navegador. As props são as mesmas; o campo fica igual no Chrome, no Firefox e no Safari.

  - **Segmento em edição laranja:** hora, minuto, segundo e AM/PM são segmentos do Orange, cada um com foco, nome e valor para leitores de tela. Antes, o destaque era o azul do sistema.
  - **Relógio pelo idioma do provider:** 24 horas em `pt-BR` e `es-ES`, 12 horas com AM/PM em `en-US` — não mais pelo idioma do navegador de cada pessoa. A prop nova `hourCycle={12 | 24}` força um dos dois. O valor continua sendo `HH:mm` em 24 horas.
  - **Setas que respeitam `step`, `min` e `max`:** andam no passo (contado a partir de `min`), dão a volta dentro do segmento e param no limite em vez de passar dele. PageUp/PageDown, Home/End, Backspace e colar (`14h30`, `2:30 pm`) também funcionam.
  - **Avisos do próprio campo:** com `min`, `max` ou `step`, um horário digitado fora da regra marca o campo como inválido e mostra a mensagem ("Escolha um horário até 18:00."), no idioma do provider. Sair com o horário pela metade avisa "Horário incompleto.". A prop `error` substitui esses avisos.
  - **Lista de horários:** o relógio agora é um botão no fim do campo e abre uma lista (no intervalo do `step` quando ele é de 5 minutos ou mais; senão de meia em meia hora), no lugar do seletor do navegador, que no Firefox não abria. A prop nova `listStep` muda o intervalo; `listStep={false}` tira o botão.

  ```tsx
  <TimeField label="Reunião" min="08:00" max="18:00" step={900} hourCycle={24} listStep={1800} />
  ```

  O que muda para quem já usa:

  - O valor mora num `<input type="time">` oculto, que recebe a `ref`, o `name` e o restante das props: envio de formulário, `FormData` e validação nativa (`required`, `min`, `max`, `step`) continuam funcionando, e `onChange(value, event)` recebe um evento desse input. Focá-lo (rótulo, `ref.current.focus()`) leva o foco ao primeiro segmento. `onFocus`, `onBlur` e `onKeyDown` passam a valer para o campo inteiro.
  - Um horário pela metade agora conta como inválido para o formulário (como o `badInput` do input nativo).
  - CSS próprio que mirava `.or-time-field__input` ou `.or-time-field__icon` deixa de ter efeito: os segmentos são `.or-time-field__segment` e o relógio, `.or-time-field__button`.
  - Em testes, `getByLabelText` passa a encontrar também o grupo dos segmentos, além do input. Para digitar, use `getByRole('spinbutton', { name: 'hora' })` (ou `'minuto'`); `fireEvent.change` no `input[type="time"]` continua funcionando.

  A digitação por teclado virtual (celular) foi verificada por emulação de toque no Chromium, não em aparelhos; os anúncios, por testes automáticos, não com leitores de tela. O `DateTimePicker` continua com o campo de hora nativo.

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@1.5.0

## 1.4.0

### Minor Changes

- [#43](https://github.com/llypeDev/Orange/pull/43) [`3085b9f`](https://github.com/llypeDev/Orange/commit/3085b9f23cfb22b502359d1a8a7ce6372aab153c) Thanks [@llypeDev](https://github.com/llypeDev)! - Nova entrada `@orangesys/ui/with-css`: os mesmos exports da entrada principal, mas cada componente traz o próprio CSS. Importando dela — e sem importar o `styles.css` — o bundler leva para a página só o CSS dos componentes usados, mais a base (tokens, reset e movimento):

  ```tsx
  import { Button, Table } from '@orangesys/ui/with-css'
  import './app.css' // o seu CSS, depois dos componentes
  ```

  CSS em gzip, medido com o Vite: só o `Button`, 6,9 KB; só a `Table`, 8,5 KB; uma tela com 45 componentes, 25,6 KB — contra 65,3 KB do `styles.css` inteiro.

  O `@orangesys/ui/styles.css` não muda e continua sendo o caminho mais simples. A entrada nova depende de um bundler que processe `import './x.css'` dentro das dependências e descarte módulos não usados (verificada com o Vite; com o esbuild sozinho o resultado é o CSS inteiro), só existe em ESM e não serve para código que roda no Node sem bundler. O pacote publicado cresce de 3,0 para 3,5 MB, porque passa a levar também o CSS de cada módulo em `dist/css`.

- [#43](https://github.com/llypeDev/Orange/pull/43) [`3085b9f`](https://github.com/llypeDev/Orange/commit/3085b9f23cfb22b502359d1a8a7ce6372aab153c) Thanks [@llypeDev](https://github.com/llypeDev)! - Idioma espanhol: o dicionário `esES` (espanhol da Espanha) traz traduzidos todos os textos internos dos componentes.

  ```tsx
  import { esES, OrangeProvider } from '@orangesys/ui'

  createRoot(root).render(
    <OrangeProvider locale="es-ES" messages={esES}>
      <App />
    </OrangeProvider>,
  )
  ```

  O `locale` cuida de datas, números e ordenação; o `messages` troca os textos. O `esES` não vem embutido no provider, para não pesar no bundle de quem não usa — só entra na aplicação que o importa.

  Em desenvolvimento, o `OrangeProvider` passa a avisar no console quando recebe um `locale` sem textos embutidos (qualquer um que não seja português ou inglês) e nenhum `messages`: nesse caso os componentes ficam em português.

- [#43](https://github.com/llypeDev/Orange/pull/43) [`3085b9f`](https://github.com/llypeDev/Orange/commit/3085b9f23cfb22b502359d1a8a7ce6372aab153c) Thanks [@llypeDev](https://github.com/llypeDev)! - `Table` para dados grandes. Tudo é opcional e aditivo — tabelas existentes não mudam.

  - **Filtros por coluna:** `filter: 'text' | 'select'` na coluna (com `filterOptions` e `filterValue`) mostra um campo sob o cabeçalho. A tabela anuncia quantas linhas sobraram, "Selecionar todos" vale só para elas e, sem resultado, aparece "Limpar filtros". Controle com `filters`/`defaultFilters`/`onFiltersChange`; `manualFilter` deixa o filtro com o servidor.
  - **Colunas ocultas:** prop `hiddenColumns` e o componente novo `TableColumnsMenu`, um menu com um item marcável por coluna (`hideable: false` tira uma coluna do menu).
  - **Virtualização:** `virtualized` com `maxHeight` renderiza só as linhas à vista — milhares de linhas sem pesar. Informa o total e a posição ao leitor de tela (`aria-rowcount`, `aria-rowindex`) e mantém no DOM a linha que está com o foco. `rowHeight` e `overscan` ajustam a janela.
  - **Colunas fixas:** `pinned: 'start' | 'end'` prende a coluna à borda durante a rolagem horizontal; o foco nunca para escondido sob elas.
  - **Colunas redimensionáveis:** `resizable` (com `minWidth` e `maxWidth`) põe um separador na borda do cabeçalho: arraste, use as setas, Home e End, ou dê um clique duplo (ou Enter) para ajustar ao conteúdo. Controle com `columnWidths`/`defaultColumnWidths`/`onColumnWidthsChange`.

  Mensagens novas em `ptBR` e `enUS`: `tableFilterBy`, `tableFilterAll`, `tableClearFilters`, `tableColumns` e `tableResizeColumn`.

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@1.4.0

## 1.3.3

### Patch Changes

- [#36](https://github.com/llypeDev/Orange/pull/36) [`4506d41`](https://github.com/llypeDev/Orange/commit/4506d416e19444704d01229a4b31727860903b74) Thanks [@llypeDev](https://github.com/llypeDev)! - Pacote menor no npm: 2,96 MB e 330 arquivos descompactados (antes 6,4 MB e 654). Os sourcemaps, que eram 64% do pacote, saem; em troca, o JavaScript publicado deixa de ter os nomes encurtados — quem depura lê o código com os nomes originais, sem precisar de mapas. Nada muda para o seu projeto: mesmos exports, tipos e `styles.css` (que continua minificado), e o custo final no navegador é o mesmo, porque o seu build minifica.

- [#36](https://github.com/llypeDev/Orange/pull/36) [`4506d41`](https://github.com/llypeDev/Orange/commit/4506d416e19444704d01229a4b31727860903b74) Thanks [@llypeDev](https://github.com/llypeDev)! - `Tabs`, `Picker`, `SplitButton`, `Dropdown` e `ContextMenu`: ao revelar a aba ou o item ativo na ponta da lista, a rolagem arredonda para longe de zero. No Safari (WebKit), que rola em pixels inteiros, o último item ficava cortado por menos de 1px. Encontrado pelos testes de layout, agora rodando também no WebKit e no Firefox.
- Updated dependencies []:
  - @orangesys/tokens@1.3.3

## 1.3.2

### Patch Changes

- [#33](https://github.com/llypeDev/Orange/pull/33) [`01bebbc`](https://github.com/llypeDev/Orange/commit/01bebbcc8092fc7f84ed9c06d870e0818bdfe8fc) Thanks [@llypeDev](https://github.com/llypeDev)! - `SplitButton`: o menu de ações para em 24rem de altura (e rola acima disso), como o do `Dropdown`. Antes só respeitava o espaço disponível, e numa tela alta um menu com muitas ações esticava até o fim da tela.

- [#33](https://github.com/llypeDev/Orange/pull/33) [`01bebbc`](https://github.com/llypeDev/Orange/commit/01bebbcc8092fc7f84ed9c06d870e0818bdfe8fc) Thanks [@llypeDev](https://github.com/llypeDev)! - Tree-shaking de verdade: o pacote passa a ser publicado com um arquivo por módulo (`dist/esm` e `dist/cjs`), e o bundler do seu projeto descarta o que não é importado. Antes, num arquivo único, importar só o `Button` trazia a biblioteca inteira (~147 KB gzip); agora são ~5 KB (o `DatePicker` ~21 KB, o `useScrollSpy` ~1 KB). Os exports, os tipos e o `@orangesys/ui/styles.css` não mudam. O `@orangesys/tokens` (dependência, sempre na mesma versão) deixa de ser embutido e passa a ser importado — sem cópia duplicada para quem também usa os tokens.
- Updated dependencies []:
  - @orangesys/tokens@1.3.2

## 1.3.1

### Patch Changes

- [#31](https://github.com/llypeDev/Orange/pull/31) [`e6d7350`](https://github.com/llypeDev/Orange/commit/e6d735026e020ded1a9f453d8ebcadb1023e31cf) Thanks [@llypeDev](https://github.com/llypeDev)! - `NumberField`: um passo em notação exponencial com casas na mantissa (ex.: `step={1.5e-7}`) era arredondado para 7 casas e virava `0.0000002`; agora as casas da mantissa somam ao expoente e o passo é exato. Por dentro, a contagem de casas decimais e o arredondamento passam a ser um utilitário interno único, usado por `NumberField`, `Slider` e pelos eixos dos gráficos.
- Updated dependencies []:
  - @orangesys/tokens@1.3.1

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
