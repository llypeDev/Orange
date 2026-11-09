---
'@orangesys/ui': minor
---

Nova entrada `@orangesys/ui/with-css`: os mesmos exports da entrada principal, mas cada componente traz o próprio CSS. Importando dela — e sem importar o `styles.css` — o bundler leva para a página só o CSS dos componentes usados, mais a base (tokens, reset e movimento):

```tsx
import { Button, Table } from '@orangesys/ui/with-css'
import './app.css' // o seu CSS, depois dos componentes
```

CSS em gzip, medido com o Vite: só o `Button`, 6,9 KB; só a `Table`, 8,5 KB; uma tela com 45 componentes, 25,6 KB — contra 65,3 KB do `styles.css` inteiro.

O `@orangesys/ui/styles.css` não muda e continua sendo o caminho mais simples. A entrada nova depende de um bundler que processe `import './x.css'` dentro das dependências e descarte módulos não usados (verificada com o Vite; com o esbuild sozinho o resultado é o CSS inteiro), só existe em ESM e não serve para código que roda no Node sem bundler. O pacote publicado cresce de 3,0 para 3,5 MB, porque passa a levar também o CSS de cada módulo em `dist/css`.
