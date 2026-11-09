# Componentes do @orangesys/ui

117 componentes documentados, por categoria. Cada um tem um arquivo em `components/<slug>.md` com boas práticas, props (geradas do código), acessibilidade (teclado e WCAG) e exemplos que funcionam. Leia o arquivo antes de usar o componente.

Base que não está nesta lista (provider, `Field`, tipografia, `Icon`, `Portal`, utilitários): `foundations.md`. Hooks: `hooks.md`. Tokens: `tokens.md`. Ícones: `icons.md`. Telas inteiras prontas: `templates/` (sign-in, dashboard, settings). Tema, estilos, i18n e diretrizes de design: `guides/`.

## Ações (9)

- **ActionBar** _(novo)_ — Barra flutuante de ações em lote: aparece quando há itens selecionados, com a contagem, as ações e um atalho para limpar a seleção. → `components/action-bar.md`
- **Button** — Botões disparam ações quando clicados — salvar, enviar, excluir, abrir um diálogo. → `components/button.md`
- **ButtonGroup** — Agrupa botões relacionados, lado a lado ou colados, e repassa tamanho e variante a todos eles. → `components/button-group.md`
- **CopyButton** — Copia um texto para a área de transferência e confirma com um ícone de check e um anúncio para leitores de tela. → `components/copy-button.md`
- **IconButton** — Botão quadrado só com ícone, com nome acessível obrigatório — para ações reconhecíveis pelo ícone. → `components/icon-button.md`
- **SegmentedControl** — Escolha exclusiva entre 2 a 5 opções sempre visíveis, com um indicador que desliza até a opção selecionada. → `components/segmented-control.md`
- **SplitButton** — Uma ação principal ao lado de uma seta que abre um menu com ações alternativas relacionadas. → `components/split-button.md`
- **ToggleButton** — Botão que liga e desliga uma opção (aria-pressed), sozinho ou em grupo com ToggleButtonGroup. → `components/toggle-button.md`
- **Toolbar** — Barra de ferramentas com uma única parada de Tab: as setas movem o foco entre os botões. → `components/toolbar.md`

## Formulários (28)

- **Checkbox** — Caixas de seleção para aceites, preferências e escolhas múltiplas — sozinhas ou em um CheckboxGroup. → `components/checkbox.md`
- **ColorField** — Seletor de cor nativo sincronizado com um campo hexadecimal validado e paleta sugerida opcional. → `components/color-field.md`
- **Combobox** — Campo de texto com lista de sugestões filtrada enquanto se digita, para escolher uma opção em listas longas. → `components/combobox.md`
- **CurrencyField** — Campo de valor monetário com símbolo da moeda, digitação natural e formatação pelo locale. → `components/currency-field.md`
- **DatePicker** — Campo de data com máscara conforme o idioma e calendário em diálogo, navegável por teclado. → `components/date-picker.md`
- **DateRangePicker** — Campo de período com duas datas mascaradas, calendário de período em diálogo e atalhos como "Últimos 7 dias". → `components/date-range-picker.md`
- **DateTimePicker** _(novo)_ — Data e hora num só campo: a data com máscara e calendário em diálogo, a hora no campo nativo — para agendar publicações, reuniões e entregas. → `components/date-time-picker.md`
- **ErrorSummary** — Resumo dos erros de um formulário, com links que levam a cada campo e foco automático para ser anunciado. → `components/error-summary.md`
- **Fieldset** — Agrupa campos relacionados com fieldset e legend nativos, com descrição, erro do grupo e desabilitação em bloco. → `components/fieldset.md`
- **FileUploader** — Envio de arquivos com arrastar e soltar, validação de tipo e tamanho e lista com progresso. → `components/file-uploader.md`
- **Form** — Orquestra o envio de um formulário: valida no envio, resume os erros no topo com links para os campos, move o foco e bloqueia envio duplo. → `components/form.md`
- **InlineEdit** — Edição no lugar: o valor vira um campo ao ser ativado e salva com Enter ou ao sair. → `components/inline-edit.md`
- **Listbox** — Lista de opções sempre visível, com seleção única ou múltipla: painéis de filtro, escolha de plano, listas mestre. → `components/listbox.md`
- **MultiSelect** — Combobox de seleção múltipla com busca: os itens escolhidos aparecem como chips removíveis. → `components/multi-select.md`
- **NumberField** — Campo numérico (spinbutton) com botões − / +, atalhos de teclado, limites e formatação de moeda, porcentagem e unidades. → `components/number-field.md`
- **PasswordField** — Campo de senha com botão para mostrar/ocultar e lista opcional de requisitos com estado acessível. → `components/password-field.md`
- **Picker** _(novo)_ — Lista suspensa personalizada para escolher uma opção — com ícones, descrições, opções desabilitadas e grupos. → `components/picker.md`
- **PinInput** — Campos de um caractere para códigos de verificação (OTP) e PINs, com colar e preenchimento automático. → `components/pin-input.md`
- **RadioGroup** — Escolha única entre poucas opções, com radios nativos, setas do teclado e variante em cartões. → `components/radio-group.md`
- **Rating** — Avaliação por estrelas com rádios nativos, prévia no hover e modo somente leitura com frações. → `components/rating.md`
- **Search** — Campo de busca com lupa, botão de limpar e envio por Enter, dentro de um landmark de busca. → `components/search.md`
- **Select** — Lista suspensa nativa para escolher uma opção entre poucas — com rótulo, ajuda e erro integrados. → `components/select.md`
- **Slider** — Controle deslizante para escolher um valor ou um intervalo dentro de uma faixa contínua. → `components/slider.md`
- **Switch** — Liga ou desliga uma configuração com efeito imediato — trilho e polegar quadrados, laranja quando ligado. → `components/switch.md`
- **TagInput** — Campo que transforma o texto digitado em tags removíveis — palavras-chave, e-mails, códigos. → `components/tag-input.md`
- **TextArea** — Campo de texto multilinha para comentários, descrições e mensagens, com crescimento automático e contador. → `components/text-area.md`
- **TextField** — Campo de texto de uma linha com rótulo, ajuda, erro, ícones, prefixo/sufixo e contador de caracteres. → `components/text-field.md`
- **TimeField** — Campo de horário nativo com a aparência do Orange, limites e intervalos configuráveis. → `components/time-field.md`

## Feedback (12)

- **Alert** — Mensagem inline que confirma, informa, alerta ou aponta um erro ligado a uma parte da página. → `components/alert.md`
- **Banner** — Faixa de largura total para avisos do sistema ou da página — manutenção, instabilidade, prazos e chamadas. → `components/banner.md`
- **ConsentBanner** _(novo)_ — Banner de consentimento de cookies (LGPD): aceitar, rejeitar e personalizar com o mesmo destaque, categorias granulares e uma escolha que pode ser revista a qualquer momento. → `components/consent-banner.md`
- **EmptyState** — Explica por que não há conteúdo — primeiro uso, busca sem resultados, filtros — e oferece o próximo passo. → `components/empty-state.md`
- **LoadingOverlay** — Cobre uma área enquanto ela é atualizada, bloqueando a interação e anunciando o carregamento. → `components/loading-overlay.md`
- **Meter** — Medidor de um valor dentro de uma faixa conhecida — armazenamento, cotas, níveis — com cor por faixa. → `components/meter.md`
- **ProgressBar** — Barra de progresso linear para tarefas com andamento mensurável — uploads, importações, etapas. → `components/progress-bar.md`
- **ProgressCircle** — Indicador circular de progresso, determinado ou indeterminado, com valor central opcional. → `components/progress-circle.md`
- **SaveStatus** _(novo)_ — Indicador de salvamento automático: “Salvando…”, “Salvo há 2 min.” e “Erro ao salvar”, com nova tentativa. → `components/save-status.md`
- **Skeleton** — Espaço reservado com a forma do conteúdo que está carregando. → `components/skeleton.md`
- **Spinner** — Indicador circular para esperas curtas de duração desconhecida. → `components/spinner.md`
- **Toast** — Notificações breves e não bloqueantes que confirmam ações e somem sozinhas. → `components/toast.md`

## Sobreposições (11)

- **CommandPalette** — Busca de comandos em um diálogo, aberta por atalho (⌘K / Ctrl+K), para navegar e agir sem tirar as mãos do teclado. → `components/command-palette.md`
- **ConfirmDialog** — Diálogo de alerta que pede confirmação antes de uma ação importante ou irreversível — com loading enquanto a ação roda. → `components/confirm-dialog.md`
- **ContextMenu** — Menu aberto com o botão direito (ou Shift+F10) sobre uma área, posicionado no ponteiro, com a navegação do Dropdown. → `components/context-menu.md`
- **Drawer** — Painel modal que desliza de uma borda da tela para filtros, formulários e detalhes sem sair do contexto. → `components/drawer.md`
- **Dropdown** — Menu de ações aberto por um botão, com itens, opções marcáveis, grupos e navegação completa por teclado. → `components/dropdown.md`
- **HoverCard** — Cartão de pré-visualização ao passar o ponteiro ou focar um link — perfis, itens referenciados, prévias de páginas. → `components/hover-card.md`
- **Modal** — Diálogo modal que interrompe a tarefa atual para pedir uma decisão ou informação, com foco preso e retorno ao gatilho. → `components/modal.md`
- **Popover** — Painel não modal ancorado a um botão, para conteúdo e controles complementares — compartilhar, filtros rápidos, detalhes. → `components/popover.md`
- **Toggletip** — Botão de informação que mostra uma explicação curta ao ser clicado e a anuncia para leitores de tela. → `components/toggletip.md`
- **Tooltip** — Rótulo curto exibido ao passar o ponteiro ou focar um elemento — ideal para nomear botões só com ícone. → `components/tooltip.md`
- **Tour** — Tour guiado com spotlight: apresenta novidades passo a passo, destacando cada elemento com um recorte na tela escurecida, com foco preso e retorno ao fechar. → `components/tour.md`

## Navegação (14)

- **AppHeader** — Cabeçalho da aplicação com marca, navegação principal e ações, que vira menu em telas pequenas. → `components/app-header.md`
- **BackToTop** — Botão que aparece em páginas longas e leva de volta ao início, movendo o foco junto. → `components/back-to-top.md`
- **BottomNavigation** — Barra de navegação inferior para telas pequenas, com 3 a 5 destinos principais sempre à mão. → `components/bottom-navigation.md`
- **Breadcrumb** — Trilha de navegação que mostra onde a página está na hierarquia e leva de volta a níveis anteriores. → `components/breadcrumb.md`
- **Link** — Links levam a outra página, a outro site ou a outro ponto da mesma página. → `components/link.md`
- **MonthPaginator** — Navegação entre meses ("‹ Março de 2026 ›") para extratos, agendas e relatórios mensais. → `components/month-paginator.md`
- **NavigationMenu** _(novo)_ — Navegação de site ou aplicação com painéis de links — submenus e pequenos mega-menus —, no padrão de navegação por divulgação do WAI-ARIA. → `components/navigation-menu.md`
- **Paginator** — Divide listas e tabelas longas em páginas e permite navegar entre elas. → `components/paginator.md`
- **SideNav** — Navegação lateral da aplicação, com grupos recolhíveis, seções e modo só com ícones. → `components/side-nav.md`
- **SkipLink** — Atalho invisível até receber foco que leva usuários de teclado direto ao conteúdo principal. → `components/skip-link.md`
- **Stepper** — Mostra o progresso em um fluxo de várias etapas — concluídas, a atual e as próximas. → `components/stepper.md`
- **TableOfContents** — Índice "Nesta página" que lista as seções e destaca a que está visível durante a rolagem. → `components/table-of-contents.md`
- **Tabs** — Abas organizam conteúdo relacionado em painéis e mostram um painel por vez. → `components/tabs.md`
- **TaskList** _(novo)_ — Lista de tarefas com status para configurações longas que a pessoa conclui em qualquer ordem — com resumo de progresso. → `components/task-list.md`

## Exibição de dados (28)

- **Accordion** — Lista de seções que se expandem e recolhem, para revelar conteúdo sob demanda. → `components/accordion.md`
- **Avatar** — Representa uma pessoa ou organização com foto, iniciais ou ícone, e indicador de presença opcional. → `components/avatar.md`
- **AvatarGroup** — Avatares sobrepostos em uma lista rotulada, com contador "+N" para quem não cabe. → `components/avatar-group.md`
- **Badge** — Indicador numérico ou ponto que sinaliza novidades, pendências ou status, inline ou sobre outro elemento. → `components/badge.md`
- **BarChart** — Gráfico de barras acessível em SVG puro: compara quantidades entre categorias, agrupadas ou empilhadas, na vertical ou na horizontal. → `components/bar-chart.md`
- **BarList** _(novo)_ — Ranking em barras horizontais: uma lista com rótulo, valor e barra proporcional ao maior valor — páginas mais visitadas, produtos mais vendidos. → `components/bar-list.md`
- **Blockquote** _(novo)_ — Citação com barra de acento e fonte opcional, em <figure> com <figcaption>. Também serve como texto em destaque. → `components/blockquote.md`
- **Card** — Contêiner para conteúdo relacionado — título, texto, mídia e ações — que pode ser clicável por inteiro. → `components/card.md`
- **Carousel** — Percorre uma sequência de slides (vitrines, onboarding, destaques) com swipe nativo, setas, seletor e rotação opcional pausável. → `components/carousel.md`
- **ChatThread** _(novo)_ — Conversas com assistentes de IA, atendimento e comentários: lista de mensagens que acompanha o fim (ChatThread), mensagens com autor, horário e estado (ChatMessage) e o campo de envio (ChatComposer). → `components/chat.md`
- **Chip** — Chips selecionáveis para filtros rápidos, com seleção única ou múltipla em um grupo rotulado. → `components/chip.md`
- **CodeBlock** — Exibe trechos de código em fonte monoespaçada, com botão de copiar, numeração e destaque de linhas. → `components/code-block.md`
- **DescriptionList** — Pares termo/descrição em um <dl> para metadados, especificações e resumos — horizontal, vertical ou em grade. → `components/description-list.md`
- **Disclosure** _(novo)_ — Uma única área que se mostra e se esconde, como "Opções avançadas" ou "Por que pedimos isso?", sem precisar de um Accordion. → `components/disclosure.md`
- **DonutChart** _(novo)_ — Gráfico de rosca acessível em SVG puro: a participação de cada parte num todo, com o total no centro e legenda com valor e percentual. → `components/donut-chart.md`
- **Image** — Imagem com proporção reservada (sem deslocamento de layout), carregamento sob demanda, skeleton, fade-in e substituto acessível em caso de erro. → `components/image.md`
- **Kbd** — Representa teclas e atalhos de teclado, com combinações e símbolos do macOS acessíveis. → `components/kbd.md`
- **LineChart** — Gráfico de linhas acessível em SVG puro: evolução no tempo de uma ou mais séries, cada uma com cor, traço e marcador próprios. → `components/line-chart.md`
- **List** — Listas com os marcadores do Orange: quadrado laranja, numeração "01", ícones, divisórias ou itens em linha. → `components/list.md`
- **ListView** _(novo)_ — Lista interativa com seleção e ações por linha: membros, arquivos, integrações e configurações, navegável por teclado. → `components/list-view.md`
- **Prose** _(novo)_ — Aplica a tipografia do Orange a conteúdo rico que a aplicação não controla: HTML de CMS, Markdown, artigos e termos de uso. → `components/prose.md`
- **SortableList** — Lista que o usuário reordena arrastando, pelo teclado ou com botões de mover — prioridades, categorias de um cardápio, etapas de um processo. → `components/sortable-list.md`
- **Sparkline** — Tendência em miniatura, em linha com o texto: acompanha um número (Stat, tabelas) e descreve a tendência em palavras. → `components/sparkline.md`
- **Stat** — Métrica em destaque com rótulo, variação e contexto; StatGroup organiza várias em uma grade. → `components/stat.md`
- **Table** — Tabela de dados semântica com ordenação por coluna, seleção de linhas, cabeçalho fixo e estado vazio. → `components/table.md`
- **Tag** — Rótulo curto para categorizar ou indicar status, com marcador quadrado colorido e remoção opcional. → `components/tag.md`
- **Timeline** — Sequência cronológica de eventos com datas, marcadores por tom e destaque do evento atual. → `components/timeline.md`
- **TreeView** — Árvore hierárquica navegável por teclado, com seleção única ou múltipla — arquivos, categorias, estrutura de páginas. → `components/tree-view.md`

## Layout (9)

- **AppShell** — Estrutura de página da aplicação: cabeçalho, navegação lateral recolhível, conteúdo, painel complementar e rodapé. → `components/app-shell.md`
- **Container** — Centraliza o conteúdo da página com largura máxima e margens laterais que encolhem no celular. → `components/container.md`
- **Divider** — Linha de 1px que separa grupos de conteúdo, na horizontal ou na vertical, com rótulo opcional. → `components/divider.md`
- **Footer** — Rodapé do site: marca, mapa do site em colunas e barra inferior com informações legais. → `components/footer.md`
- **Grid** — Grade em duas dimensões: colunas por breakpoint ou automáticas por largura mínima, com variante de bordas de 1px entre as células. → `components/grid.md`
- **PageHeader** — Topo de uma página da aplicação: contexto, título, descrição, selos, ações e abas. → `components/page-header.md`
- **Paper** — Superfície base com fundo, borda de 1px e espaçamento interno — a peça sobre a qual painéis e cartões são montados. → `components/paper.md`
- **Splitter** — Painéis redimensionáveis com separador arrastável e acessível pelo teclado — lista e detalhe, editor e prévia, inspetores e consoles. → `components/splitter.md`
- **Stack** — Empilha elementos na vertical ou na horizontal com espaçamento da escala — e muda de direção por breakpoint, sem escrever CSS. → `components/stack.md`

## Utilitários (6)

- **ExpandableText** — Texto longo recolhido em algumas linhas, com botão "Mostrar mais" que só aparece quando o conteúdo não cabe. → `components/expandable-text.md`
- **Highlight** — Destaca termos de busca dentro de um texto com <mark>, sem diferenciar acentos nem maiúsculas. → `components/highlight.md`
- **RelativeTime** — Datas relativas ("há 5 minutos", "em 3 dias") no idioma do provider, em <time> e com atualização automática. → `components/relative-time.md`
- **Reveal** — Revela o conteúdo quando ele entra na tela: sobe 24px e aparece em 600ms, com escalonamento opcional entre os filhos. → `components/reveal.md`
- **TruncatedText** — Corta textos longos em um número fixo de linhas com reticências, mantendo o texto completo acessível. → `components/truncated-text.md`
- **VisuallyHidden** — Esconde conteúdo da tela mantendo-o disponível para leitores de tela e tecnologias assistivas. → `components/visually-hidden.md`
