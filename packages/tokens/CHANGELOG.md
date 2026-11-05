# @orangesys/tokens

## 0.5.0

### Minor Changes

- [#8](https://github.com/llypeDev/Orange/pull/8) [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6) Thanks [@llypeDev](https://github.com/llypeDev)! - Primeira publicação no npm. Os dois pacotes passam a sair juntos, sempre com a mesma versão, com changelog gerado a partir dos changesets e publicação com provenance.

  - `@orangesys/ui`: ESM (`dist/orange-ui.js`) e CommonJS (`dist/orange-ui.cjs`), tipos em um único arquivo para `import` e `require` (`index.d.ts` / `index.d.cts`) e `@orangesys/ui/styles.css` com todos os estilos e tokens.
  - `@orangesys/tokens`: tokens em TypeScript (ESM) e `@orangesys/tokens/tokens.css` com as custom properties `--or-*`.
  - `react` e `react-dom` passam a ser peer dependencies com faixa explícita: `^18.2.0 || ^19.0.0`.
  - Política de versionamento e depreciação publicada em https://orange.llypedev.com.br/pt/usage/versioning.

- [#8](https://github.com/llypeDev/Orange/pull/8) [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b) Thanks [@llypeDev](https://github.com/llypeDev)! - Temas de alto contraste e suporte completo a `forced-colors`.

  - Novos temas `dark-hc` e `light-hc` (contraste AAA) e o modo `system` passa a seguir `prefers-contrast: more`.
  - Novos tokens `text-on-success`, `text-on-warning` e `text-on-info`; o `Badge` usa-os em vez de cores fixas.
  - `forced-colors` (contraste do Windows) em todos os componentes, com um teste que impede regressões.
  - Exportação dos tokens em DTCG (um arquivo por modo) e o script `figma:sync` para as variáveis do Figma.
  - `OrangeProvider` aninhado sem tema próprio herda o tema do provider de fora.

- [#8](https://github.com/llypeDev/Orange/pull/8) [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6) Thanks [@llypeDev](https://github.com/llypeDev)! - Tokens de visualização de dados — paletas categórica, sequencial e divergente — nos temas claro e escuro, com contraste validado em testes.
