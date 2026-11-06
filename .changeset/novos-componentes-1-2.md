---
'@orangesys/ui': minor
---

Seis componentes novos e dois recursos novos em componentes existentes:

- `NavigationMenu`: navegação com painéis e mega-menu no padrão APG "disclosure navigation menu"; o `AppHeader` aceita `items` em cada item (painéis no desktop, seções sanfonadas no menu do celular).
- `DateTimePicker`: data e hora num campo só (Date local), com calendário, `min`/`max`, `defaultTime` e envio em `aaaa-mm-ddTHH:mm`.
- `ChatThread`, `ChatMessage` e `ChatComposer`: conversas com assistentes, suporte e comentários; log rolável que segue o fim, "Novas mensagens", anúncio único da última mensagem e composer com Enter/Shift+Enter.
- `ConsentBanner`: consentimento de cookies para a LGPD, com aceitar, rejeitar e personalizar com o mesmo peso e categorias em checkboxes; não grava cookies sozinho.
- `TaskList` + `TaskListItem`: checklist de configuração com status e progresso (padrão Task list do GOV.UK).
- `SaveStatus`: indicador de autosave ("Salvando…", "Salvo há 2 min.", erro com "Tentar de novo"), anunciado só nas transições.
- `Table`: linhas expansíveis com painel de detalhes (`renderExpanded`, `expandedRows`/`defaultExpandedRows`/`onExpandedRowsChange`, `isRowExpandable`).
