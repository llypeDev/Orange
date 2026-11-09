---
'@orangesys/ui': minor
---

`Table` para dados grandes. Tudo é opcional e aditivo — tabelas existentes não mudam.

- **Filtros por coluna:** `filter: 'text' | 'select'` na coluna (com `filterOptions` e `filterValue`) mostra um campo sob o cabeçalho. A tabela anuncia quantas linhas sobraram, "Selecionar todos" vale só para elas e, sem resultado, aparece "Limpar filtros". Controle com `filters`/`defaultFilters`/`onFiltersChange`; `manualFilter` deixa o filtro com o servidor.
- **Colunas ocultas:** prop `hiddenColumns` e o componente novo `TableColumnsMenu`, um menu com um item marcável por coluna (`hideable: false` tira uma coluna do menu).
- **Virtualização:** `virtualized` com `maxHeight` renderiza só as linhas à vista — milhares de linhas sem pesar. Informa o total e a posição ao leitor de tela (`aria-rowcount`, `aria-rowindex`) e mantém no DOM a linha que está com o foco. `rowHeight` e `overscan` ajustam a janela.
- **Colunas fixas:** `pinned: 'start' | 'end'` prende a coluna à borda durante a rolagem horizontal; o foco nunca para escondido sob elas.
- **Colunas redimensionáveis:** `resizable` (com `minWidth` e `maxWidth`) põe um separador na borda do cabeçalho: arraste, use as setas, Home e End, ou dê um clique duplo (ou Enter) para ajustar ao conteúdo. Controle com `columnWidths`/`defaultColumnWidths`/`onColumnWidthsChange`.

Mensagens novas em `ptBR` e `enUS`: `tableFilterBy`, `tableFilterAll`, `tableClearFilters`, `tableColumns` e `tableResizeColumn`.
