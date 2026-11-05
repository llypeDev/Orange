---
'@orange/tokens': minor
'@orange/ui': minor
---

Temas de alto contraste e suporte completo a `forced-colors`.

- Novos temas `dark-hc` e `light-hc` (contraste AAA) e o modo `system` passa a seguir `prefers-contrast: more`.
- Novos tokens `text-on-success`, `text-on-warning` e `text-on-info`; o `Badge` usa-os em vez de cores fixas.
- `forced-colors` (contraste do Windows) em todos os componentes, com um teste que impede regressões.
- Exportação dos tokens em DTCG (um arquivo por modo) e o script `figma:sync` para as variáveis do Figma.
- `OrangeProvider` aninhado sem tema próprio herda o tema do provider de fora.
