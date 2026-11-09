# Versionamento e depreciação

O que é API pública, que tipo de versão cada mudança exige e como algo é depreciado antes de sair. Atualize sem medo: nada público some sem aviso.

## Resumo

- O Orange segue o Versionamento Semântico: `MAJOR.MINOR.PATCH`. `@orangesys/tokens` e `@orangesys/ui` saem sempre juntos, com o mesmo número de versão.
- Nada público é removido de surpresa: primeiro vem a depreciação em uma minor, com aviso no console em desenvolvimento e selo na documentação. A remoção só acontece na major seguinte.
- Toda mudança nos pacotes chega com um changeset, que gera o `CHANGELOG.md` de cada pacote, as notas da release no GitHub e alimenta a página Novidades.

## O que é API pública

Só a API pública segue as regras desta página. O resto é detalhe de implementação: evitamos mudanças desnecessárias, mas não prometemos estabilidade.

| Superfície | Pública? | Detalhes |
| --- | --- | --- |

## Que versão cada mudança exige

| Mudança | Versão |
| --- | --- |

> **Componentes Beta** Componentes marcados como Beta ainda estão consolidando a API e podem mudar em uma minor — sempre com changeset explicando a migração.

Desde a 1.0.0 vale a tabela acima: mudanças incompatíveis só numa nova major. Antes dela, as regras eram estas:

O Orange na série 0.x. Nela, o npm já trata a minor como major: `^0.4.0` aceita a 0.4.1, mas não a 0.5.0. Por isso, até a 1.0, a **minor faz o papel da major**: patch traz correções; minor traz novidades e, quando inevitável, mudanças incompatíveis — sempre depois de uma depreciação publicada em uma minor anterior. O changeset `major` fica reservado para lançar a 1.0.

Exemplo: depreciado na 0.5.0, com aviso durante toda a 0.5.x, removível a partir da 0.6.0.

## Ciclo de depreciação

### 1. Depreciar — em uma minor

- Tag `@deprecated` no JSDoc com o substituto e a versão de remoção: o editor risca o nome e mostra a dica.
- `deprecate(mensagem, id)` quando a API antiga é usada: aviso no console só em desenvolvimento, uma vez por id. Em produção o código some do bundle.
- Selo "Depreciado" na página do componente, com link para o substituto.
- Changeset minor começando com "Depreciado:" e a nota de migração — ou um codemod, quando a troca é mecânica e atinge muitos arquivos.

### 2. Conviver — pelo menos uma minor

A API antiga e a nova funcionam lado a lado, as duas cobertas por testes. Ninguém precisa migrar no mesmo dia em que atualiza.

### 3. Remover — só na major seguinte

Changeset `major` (`minor` na série 0.x) começando com **Incompatível:** e com o passo a passo da migração. A remoção aparece em destaque na página Novidades.

`packages/ui/src/components/Foo/Foo.tsx`:

```tsx
import { forwardRef } from 'react'
import { deprecate } from '../../utils'

export interface FooProps {
  onClose?: () => void
  /** @deprecated Use `onClose`. Sai na v1.0. */
  onDismiss?: () => void
}

export const Foo = forwardRef<HTMLDivElement, FooProps>(function Foo({ onClose, onDismiss, ...rest }, ref) {
  if (onDismiss !== undefined) {
    deprecate('Foo: `onDismiss` está depreciado e sai na v1.0. Use `onClose`.', 'foo.onDismiss')
  }
  const handleClose = onClose ?? onDismiss
  // …
})
```

`apps/docs/src/content/components/foo/meta.ts`:

```ts
export const meta: ComponentMeta = {
  slug: 'foo',
  name: 'Foo',
  category: 'feedback',
  description: { pt: '…', en: '…' },
  status: 'deprecated',
  deprecation: { replacement: 'bar', since: '0.5.0', removal: '1.0.0' },
}
```

`.changeset/foo-on-dismiss.md`:

```markup
---
'@orangesys/ui': minor
---

Depreciado: a prop `onDismiss` do `Foo` — use `onClose` (mesma assinatura). Sai na v1.0.
```

> **Exceções** Falhas de segurança e falhas graves de acessibilidade (WCAG A/AA) podem ser corrigidas em qualquer versão, mesmo que o comportamento mude. Essas correções são sempre anunciadas no changelog.

## Janela de suporte

- **Major atual** — Novidades, correções e segurança.
- **Major anterior** — Correções de segurança e de acessibilidade críticas por 6 meses após o lançamento da nova major.
- **Série 0.x** —
- **React** — As majors em `peerDependencies`: hoje `^18.2.0 || ^19.0.0` . Uma major nova do React entra em uma minor; deixar de suportar uma é major.
- **Navegadores** — As duas últimas versões de Chrome, Edge, Firefox e Safari.
- **Node.js** — `>=18` para SSR e ferramentas que leem os pacotes (campo `engines`).

## Como anunciamos mudanças

- Cada PR que muda `@orangesys/tokens` ou `@orangesys/ui` traz um changeset (`pnpm changeset`). Ao entrar em `main`, ele vai para o PR "Versionar pacotes"; no merge, vira entrada no `CHANGELOG.md` e na release do GitHub.
- Mudanças incompatíveis começam com **Incompatível:** e trazem a migração; ficam no topo das notas da versão.
- Depreciações começam com "Depreciado:", aparecem no console em desenvolvimento e ganham selo na documentação.
- A página Novidades resume cada versão em português e inglês.

Para quem contribui: o passo a passo está nas seções Versionamento e Publicação do CONTRIBUTING.md.
