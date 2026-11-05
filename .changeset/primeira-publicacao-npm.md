---
'@orange/tokens': minor
'@orange/ui': minor
---

Primeira publicação no npm. Os dois pacotes passam a sair juntos, sempre com a mesma versão, com changelog gerado a partir dos changesets e publicação com provenance.

- `@orange/ui`: ESM (`dist/orange-ui.js`) e CommonJS (`dist/orange-ui.cjs`), tipos em um único arquivo para `import` e `require` (`index.d.ts` / `index.d.cts`) e `@orange/ui/styles.css` com todos os estilos e tokens.
- `@orange/tokens`: tokens em TypeScript (ESM) e `@orange/tokens/tokens.css` com as custom properties `--or-*`.
- `react` e `react-dom` passam a ser peer dependencies com faixa explícita: `^18.2.0 || ^19.0.0`.
- Política de versionamento e depreciação publicada em https://orange.llypedev.com.br/pt/usage/versioning.
