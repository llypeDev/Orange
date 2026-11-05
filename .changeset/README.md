# Changesets

Esta pasta guarda os **changesets**: arquivos Markdown curtos que dizem quais pacotes publicados
(`@orangesys/tokens`, `@orangesys/ui`) mudam, o tipo de versão (`patch`, `minor`, `major`) e o texto que
entra no `CHANGELOG.md` de cada pacote.

```bash
pnpm changeset          # cria um changeset (pergunta pacotes, tipo e resumo)
pnpm changeset status   # mostra o que será versionado
```

Ao entrar em `main`, o workflow **Release** junta os changesets no PR "Versionar pacotes". Ao fazer
merge desse PR, os pacotes são publicados no npm. Veja as seções **Versionamento** e **Publicação**
do [`CONTRIBUTING.md`](../CONTRIBUTING.md) e a documentação do [Changesets](https://changesets.dev).
