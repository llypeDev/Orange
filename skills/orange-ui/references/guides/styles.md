# Estilos

CSS puro, sem CSS-in-JS: tokens em custom properties, uma base enxuta e um arquivo por componente com prefixo or- e BEM. Tudo pode ser ajustado sobrescrevendo tokens, sem brigar com especificidade.

## Como o CSS é organizado

### 1. tokens.css — gerado

Gerado por `packages/tokens/scripts/build.ts` a partir de `src/index.ts`. Define as paletas, a tipografia, o espaço e o movimento em `:root`, e as cores semânticas em `[data-theme='dark']` e `[data-theme='light']`. Nunca edite à mão.

### 2. base.css — reset e utilitários

`box-sizing`, tipografia do `body`, foco visível global, `::selection`, as classes utilitárias, os keyframes compartilhados e a regra de movimento reduzido. Seletores com `:where()` para manter a especificidade em zero.

### 3. Um CSS por componente

`Button.css` é importado por `Button.tsx`: usar o componente traz o estilo junto. No pacote publicado, tudo está em `styles.css` e, um arquivo por componente, na entrada `@orangesys/ui/with-css` (veja abaixo).

### 4. Seu CSS

Carregado depois do Orange. Com a mesma especificidade, a regra que vem por último vence — sem !important.

`@orangesys/ui/styles.css`:

```css
/* Ponto de entrada global — importe uma vez na raiz da aplicação */
@import '@orangesys/tokens/tokens.css';
@import './base.css';
```

## Só o CSS do que você usa

O `styles.css` traz o CSS de todos os componentes (cerca de 65 KB em gzip). Se a aplicação usa poucos, importe os componentes de `@orangesys/ui/with-css` e não importe o `styles.css`: cada componente traz o próprio CSS — e o dos componentes que usa por dentro —, e o bundler leva para a página só isso, mais a base (tokens, reset e movimento, cerca de 6 KB).

`main.tsx`:

```tsx
// O CSS inteiro, uma vez na raiz
import '@orangesys/ui/styles.css'
import { Button, Table } from '@orangesys/ui'

// Ou só o CSS do que é importado — sem o styles.css
import { Button, Table } from '@orangesys/ui/with-css'
import './app.css' // o seu CSS, depois dos componentes
```

- Mesmos exports e mesmos tipos da entrada principal: é só trocar a origem do import. As duas entradas usam os mesmos componentes por baixo, então podem conviver.
- CSS que chega à página (gzip, medido com o Vite): só o Button, 6,9 KB; só a Table, 8,5 KB; uma tela com 45 componentes, 25,6 KB; a biblioteca inteira, 65,3 KB.
- O CSS de cada componente entra onde ele é importado pela primeira vez. Importe o seu CSS depois dos componentes — no fim dos imports do arquivo de entrada — para as suas regras continuarem vencendo.

> **Quando ficar com o styles.css** A entrada `with-css` depende de um bundler que processe os `import './x.css'` de dentro das dependências e descarte os módulos não usados. Foi verificada com o Vite; o esbuild sozinho não descarta o CSS e o resultado é o CSS inteiro (correto, só sem a economia). Sem bundler — testes no Node, SSR direto — o `import` de `.css` falha: nesses ambientes use a entrada principal. Ela só existe em ESM. Se a aplicação usa a maior parte dos componentes, o `styles.css` único, em cache, continua sendo a escolha mais simples.

## Convenções de nomes

| Parte | Exemplo | Regra |
| --- | --- | --- |
| Bloco | .or-button | Prefixo or- + nome do componente em kebab-case. |
| Elemento | .or-button__label | Partes internas com __. |
| Modificador | .or-button--primary | Variantes e tamanhos com --. |
| Estado | [aria-expanded='true'] | Estados vêm de atributos ARIA, data-* ou pseudo-classes — nunca de classes como .is-open. |
| Variável privada | --_bg | Variáveis internas do componente. Não são API pública e podem mudar. |
| Token | --or-color-accent | API pública: sobrescreva à vontade. |

## Sobrescrevendo com tokens

Custom properties herdam pela árvore. Redefina um token em `:root` para mudar a aplicação inteira, em `[data-theme]` para um tema, ou em qualquer seletor para mudar só aquela região. No exemplo, uma classe `.compacto` reduz a altura dos controles para tabelas densas — os botões não sabem de nada, só leem os tokens.

### Exemplo

```tsx
/* styles.css */
.compacto {
  --or-control-sm: 1.75rem; /* 28px — ainda acima dos 24px da WCAG 2.5.8 */
  --or-control-md: 2rem;
  --or-control-lg: 2.5rem;
}

/* App.tsx */
<div className="acoes">
  <Button size="sm">Padrão sm</Button>
  <Button>Padrão md</Button>
</div>
<div className="acoes compacto">
  <Button size="sm">Compacto sm</Button>
  <Button>Compacto md</Button>
</div>
```

`tema-da-marca.css`:

```css
/* Toda a aplicação */
:root {
  --or-font-display: 'Sora', system-ui, sans-serif;
}

/* Só o tema claro */
[data-theme='light'] {
  --or-color-bg: #fbfaf7;
}

/* Só uma região */
.painel-financeiro {
  --or-color-accent: var(--or-palette-blue-500);
}
```

> **Evite sobrescrever classes internas** Seletores como `.or-button__label` e variáveis `--_*` não são API pública e podem mudar entre versões minor. Se precisar de algo que os tokens não cobrem, abra uma issue pedindo um token ou uma prop.

## Classes utilitárias

| Classe | O que faz |
| --- | --- |
| .or-visually-hidden | Esconde visualmente e mantém para leitores de tela. É o que o componente VisuallyHidden usa. |
| .or-visually-hidden-focusable | Igual, mas aparece ao receber foco — para links “pular para o conteúdo”. |
| .or-eyebrow | Rótulo em caixa alta, Space Grotesk 11px, espaçamento 0.14em, cor text-subtle. |
| .or-control | Aparência de campo (borda, altura, foco) para <input>, <select> e <textarea> nativos. Em <select>, onde há suporte a appearance: base-select, a lista aberta também ganha o visual do Orange. |
| .or-control-frame | Contêiner com aparência de campo para controles com ícones ou botões internos. |
| .or-theme-scope | Aplicada pelo OrangeProvider com themeTarget="scoped" no <div data-theme>. |

### Exemplo

```tsx
<a className="or-visually-hidden-focusable" href="#conteudo">Pular para o conteúdo</a>

<p className="or-eyebrow">Relatórios</p>

<label htmlFor="cupom">Cupom</label>
<input id="cupom" className="or-control" placeholder="LARANJA10" />

<button type="button">
  <Icon name="trash" />
  <span className="or-visually-hidden">Excluir cupom</span>
</button>
```

## Links com aparência de botão

Navegar é trabalho de link; agir é trabalho de botão. Quando uma navegação precisa da aparência de botão (um CTA “Ver planos”), use `buttonClassName()` em um `<a>` ou no `Link` do seu roteador — a semântica continua de link.

### Exemplo

```tsx
import { buttonClassName, Icon } from '@orangesys/ui'
import { Link } from 'react-router-dom'

<Link to="/precos" className={buttonClassName({ variant: 'primary' })}>
  <span className="or-button__label">Ver planos</span>
  <span className="or-button__icon or-button__icon--end" aria-hidden="true">
    <Icon name="arrow-right" size="sm" />
  </span>
</Link>

<a href="/ajuda" className={buttonClassName({ variant: 'outline', size: 'sm' })}>
  Central de ajuda
</a>
```

## Camadas (z-index)

Nunca escreva `z-index: 9999`. Use a escala `--or-z-*`: cada camada tem um propósito e os componentes de sobreposição já a respeitam (um toast aparece sobre um modal; um tooltip, sobre tudo).

| Token | Valor | Uso |
| --- | --- | --- |

## Raios, bordas e sombras

A linguagem do Orange é reta: `--or-radius-none` em quase tudo, `--or-radius-full` só em avatares, switches e indicadores. Elevação vem de bordas e de sombras sólidas deslocadas, não de desfoque.

- Bordas: `thin` (1px) para tudo, `thick` (2px) para seleção e foco, `accent` (3px) para a barra lateral de callouts.
- `--or-shadow-lift` é a assinatura dos cartões interativos (como no zop.dev): uma faixa sólida na cor do texto que aparece embaixo no hover, junto com a subida de 4px e a barra de acento na borda esquerda (`or-lift`, `Card interactive`, `Paper interactive`). `--or-shadow-hover-accent` é a variante laranja para destaques pontuais.
