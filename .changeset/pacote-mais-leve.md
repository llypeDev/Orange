---
'@orangesys/ui': patch
---

Pacote menor no npm: 2,96 MB e 330 arquivos descompactados (antes 6,4 MB e 654). Os sourcemaps, que eram 64% do pacote, saem; em troca, o JavaScript publicado deixa de ter os nomes encurtados — quem depura lê o código com os nomes originais, sem precisar de mapas. Nada muda para o seu projeto: mesmos exports, tipos e `styles.css` (que continua minificado), e o custo final no navegador é o mesmo, porque o seu build minifica.
