---
'@orangesys/tokens': patch
---

`@orangesys/tokens` passa a ser publicado também em CommonJS. `require('@orangesys/tokens')`, `/contrast` e `/dtcg` agora funcionam em projetos CommonJS — arquivos de configuração, Jest em modo CJS, Node sem `require` de ESM e TypeScript com `module: node16` (antes dava `ERR_REQUIRE_ESM` ou o erro TS1479). Quem usa `import` continua recebendo a versão ESM.
