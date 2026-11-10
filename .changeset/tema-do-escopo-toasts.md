---
'@orangesys/ui': patch
---

`ToastProvider`: a pilha de toasts, que vai para o `<body>`, passa a levar o tema da área onde o provider foi declarado. Com o provider dentro de um `<OrangeProvider themeTarget="scoped">` (ou de um elemento com `data-theme`) de tema diferente do da página, os toasts saíam com as cores da página. Para saber onde está, o provider passa a renderizar um `<span hidden>` vazio depois dos filhos. Com o tema no `<html>`, ou com um `container` dentro da própria área, nada muda: a pilha continua sem `data-theme` próprio e acompanha a troca de tema da página.
