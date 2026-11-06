---
'@orangesys/ui': patch
---

Tree-shaking de verdade: o pacote passa a ser publicado com um arquivo por módulo (`dist/esm` e `dist/cjs`), e o bundler do seu projeto descarta o que não é importado. Antes, num arquivo único, importar só o `Button` trazia a biblioteca inteira (~147 KB gzip); agora são ~5 KB (o `DatePicker` ~21 KB, o `useScrollSpy` ~1 KB). Os exports, os tipos e o `@orangesys/ui/styles.css` não mudam. O `@orangesys/tokens` (dependência, sempre na mesma versão) deixa de ser embutido e passa a ser importado — sem cópia duplicada para quem também usa os tokens.
