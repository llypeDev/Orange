---
'@orangesys/ui': patch
---

Correções no fim da faixa: o último item, seção, valor ou opção passa a ser alcançável e visível.

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
