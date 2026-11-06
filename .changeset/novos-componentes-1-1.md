---
'@orangesys/ui': minor
---

Oito componentes novos, todos com teclado completo, WCAG 2.2 AA, temas de alto contraste e forced-colors:

- `Picker`: select customizado (padrão APG "select-only combobox") com ícones, descrições, opções desabilitadas e grupos; integra com `Form`/FormData.
- `ActionBar`: barra de ações em lote para seleções (Table, ListView, CheckboxGroup), com contagem anunciada, `onDismiss` e modo portal ou inline.
- `ListView` + `ListViewItem`: lista interativa com seleção (`selectionMode`, `selected`/`defaultSelected`/`onSelectedChange`), `onAction` e ações por linha.
- `DonutChart`: participação no todo, com o mesmo frame, tabela de dados e exploração por teclado dos outros gráficos.
- `BarList`: ranking em barras horizontais, com links por linha e "Mostrar todos".
- `Disclosure`: área única de mostrar/ocultar, variantes `inline` e `outline`.
- `Prose` e `Blockquote`: tipografia para HTML de CMS/Markdown e citações.

`CheckboxGroup` ganha `variant="card"`, igual ao do `RadioGroup`. Correções: o conteúdo do `Accordion` que fecha fica `inert` já durante a animação de saída (antes continuava focável por 250 ms); o `Calendar` (e o `DatePicker`) usa células menores em telas de até 24rem, como o `RangeCalendar`, e cabe em 320px.
