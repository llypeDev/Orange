# Grid

Doze colunas, um contêiner de 1200px, gutter de 32px e uma escala de espaço em múltiplos de 4. A grade do Orange é explícita: aparece nas bordas, nas linhas verticais do hero e no alinhamento de cada bloco.

## Grade de 12 colunas

Doze divide bem em 2, 3, 4 e 6, o que cobre quase todos os layouts de produto: metade e metade, três cartões, quatro métricas, conteúdo com barra lateral. As linhas abaixo mostram a grade e algumas combinações comuns.

`layout.css`:

```css
.pagina {
  max-width: var(--or-layout-max-width);   /* 1200px */
  margin-inline: auto;
  padding-inline: var(--or-layout-gutter); /* 32px */
}

.grade {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--or-layout-gutter);
  row-gap: var(--or-space-8);
}

.grade__principal { grid-column: span 8; }
.grade__lateral   { grid-column: span 4; }
```

## Contêiner e gutter

auto

px

max-width

px

auto

| Token | Valor | Uso |
| --- | --- | --- |
| max-width | Largura máxima do conteúdo; acima disso, margens automáticas. |  |
| gutter | Espaço entre colunas e margem lateral do contêiner. |  |
| header-height | Altura do cabeçalho fixo; também usada no scroll-padding-top. |  |
| sidebar-width | Largura da navegação lateral a partir de lg. |  |

## Breakpoints

Os breakpoints são *min-width* (mobile first). Custom properties não funcionam dentro de `@media`, então em CSS os valores são repetidos; em JavaScript, importe `breakpoints` de `@orangesys/tokens` e use `useMediaQuery`.

| Nome | min-width | Colunas | Gutter | Uso típico |
| --- | --- | --- | --- | --- |

`responsivo.tsx`:

```tsx
import { breakpoints } from '@orangesys/tokens'
import { useMediaQuery } from '@orangesys/ui'

// CSS: @media (min-width: 1024px) { … }
const desktop = useMediaQuery(`(min-width: ${breakpoints.lg})`)

return desktop ? <TabelaCompleta /> : <ListaDeCartoes />
```

## Escala de espaço

Todo espaçamento — padding, margin, gap — vem de `--or-space-*`. A unidade base é 4px (`--or-space-1`); o número do token multiplicado por 4 dá o valor em pixels.

- **1–3 (4–12px):** dentro de componentes — ícone e rótulo, itens de uma lista compacta.
- **4–6 (16–24px):** entre elementos relacionados — campos de um formulário, padding de cartões.
- **8–12 (32–48px):** entre grupos — blocos de uma página, colunas.
- **14–24 (56–96px):** entre seções e em páginas de marketing.

## Layout de página

O layout de aplicação do Orange — o mesmo desta documentação — tem cabeçalho fixo de 64px (`--or-layout-header-height`), navegação lateral de 280px ( `--or-layout-sidebar-width`) e conteúdo com largura de leitura limitada. Abaixo de `lg`, a lateral vira uma gaveta.

header ·

px

sidebar ·

px

main · max 72ch

toc · ≥ xl

`app-shell.css`:

```css
.app {
  display: grid;
  grid-template-columns: var(--or-layout-sidebar-width) minmax(0, 1fr);
  grid-template-rows: var(--or-layout-header-height) 1fr;
  min-height: 100vh;
}

.app__header {
  grid-column: 1 / -1;
  position: sticky;
  top: 0;
  z-index: var(--or-z-header);
  border-bottom: 1px solid var(--or-color-border);
}

@media (max-width: 1023px) {
  .app { grid-template-columns: minmax(0, 1fr); }
  .app__sidebar { /* vira gaveta com useFocusTrap + Escape */ }
}
```

## Boas práticas

- Faça: Alinhe blocos às colunas e use o mesmo gutter em toda a página.
- Faça: Separe áreas com bordas de 1px e espaço, não com sombras.
- Faça: Use minmax(0, 1fr) nas colunas para que conteúdo longo não estoure a grade.
- Faça: Teste em 320px de largura: nada de rolagem horizontal (1.4.10).
- Evite: Valores mágicos como 13px ou 27px fora da escala.
- Evite: Larguras fixas em pixels para colunas de conteúdo.
- Evite: Texto corrido ocupando 1200px inteiros — limite a 72ch.
- Evite: Esconder conteúdo no mobile em vez de reorganizá-lo.
