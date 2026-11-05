# @orange/tokens

Tokens de design do **Orange**: cores, tipografia, espaço, raios, sombras e movimento, com quatro temas
— escuro, claro e os de alto contraste `dark-hc` e `light-hc` — e testes de contraste WCAG no build.

**Documentação:** https://orange.llypedev.com.br

## Instalação

```bash
pnpm add @orange/tokens
```

## Uso

### CSS

```css
@import '@orange/tokens/tokens.css';

.card {
  background: var(--or-color-surface);
  color: var(--or-color-text);
  border: 1px solid var(--or-color-border);
}
```

O tema vem do atributo `data-theme` (`dark`, `light`, `dark-hc`, `light-hc`). Sem atributo, vale o escuro
— ou o escuro de alto contraste quando o sistema pede `prefers-contrast: more`.

### TypeScript

```ts
import { themes, primitives } from '@orange/tokens'

themes.light.accent // valor resolvido do acento no tema claro
```

### Figma e outras ferramentas

`@orange/tokens/tokens.dtcg.json` traz os tokens no formato W3C Design Tokens (DTCG), com um modo por
tema. O passo a passo para importar no Figma ou no Tokens Studio — e o script `figma:sync` — está em
[Figma](https://orange.llypedev.com.br/pt/usage/figma).

## Licença

MIT
