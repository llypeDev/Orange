---
'@orangesys/ui': minor
---

Novo hook `useScrollSpy(ids, { root, rootMargin })`: diz qual seção está sendo lida, para montar um índice "Nesta página" com qualquer visual. É o mesmo mecanismo do `TableOfContents` (que agora o usa por dentro): vence o primeiro título dentro da faixa; entre dois títulos, o que já passou (também ao subir); no fim da rolagem, o último à vista. Retorna `{ activeId, setActiveId }` — `setActiveId` marca uma seção no clique e segura a marca durante o salto, até a próxima interação. Aceita janela ou contêiner rolável (elemento ou ref), é seguro para SSR e um array novo de ids a cada render não reinicia a observação.
