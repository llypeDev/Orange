# Cor

Carvão, creme e um único laranja. As cores do Orange existem em duas camadas: paletas primitivas e tokens semânticos — e só os semânticos entram nos componentes.

## Duas camadas

**Primitivas** (`--or-palette-orange-500`) são valores crus, sem significado. **Semânticas** (`--or-color-accent` ) dizem para que a cor serve e mudam com o tema. Componentes e telas usam apenas as semânticas; assim, o tema claro, o escuro e um tema da sua marca funcionam sem tocar em nenhum componente.

`tokens.css`:

```css
:root {
  --or-palette-orange-500: #f58549;   /* primitiva: só um valor */
}

[data-theme='dark'] {
  --or-color-accent: #f58549;         /* semântica: "o acento" no escuro */
}

[data-theme='light'] {
  --or-color-accent: #d4622a;         /* mais fechado para manter 3:1 no papel */
}
```

## Paletas primitivas

Clique em uma amostra para copiar o hex. As paletas existem para alimentar os temas e casos especiais, como gráficos; não as use diretamente em componentes.

## Tokens semânticos

Os tokens abaixo existem nos quatro temas (escuro, claro e os dois de alto contraste) com o mesmo nome. Valores com transparência (`rgba`) são compostos sobre o fundo de cada tema.

## Um único acento

O laranja é o único acento do sistema. Ele aponta para o que importa agora: a ação principal, o item selecionado, o foco do teclado. Quanto mais raro, mais ele funciona — uma tela com cinco elementos laranja não tem destaque nenhum.

- No máximo uma ação primária (fundo laranja) por contexto.
- Texto em laranja só com `accent-text`, que garante 4.5:1 nos dois temas.
- Hierarquia vem de tamanho, peso e espaço — não de cor. Títulos ficam em text.
- Precisa de uma ação forte sem laranja? Use o `neutral` (botão secondary).

- Faça: Laranja só na ação que você quer que a pessoa tome.
- Evite: Laranja em borda, título, texto e dois botões: nada se destaca.

## Cores de status

Verde, âmbar, vermelho e azul comunicam estado — sucesso, atenção, erro e informação. Cada um tem três tokens: a cor plena (ícones e marcas, `success`), o fundo suave (`success-subtle`) e o texto ( `success-text`, ≥ 4.5:1).

> **Cor nunca é o único sinal** Todo status tem ícone e texto (WCAG 1.4.1). No tema claro, success e warning plenos ficam abaixo de 3:1 sobre o papel — por isso o ícone vem acompanhado de um título legível em *-text. No claro de alto contraste eles escurecem (green-600, amber-600) e passam de 3:1.

## Alto contraste

Dois temas a mais, `dark-hc` e `light-hc`, miram o nível AAA da WCAG sem perder a identidade: o mesmo carvão, o mesmo creme, o mesmo laranja. O que muda é a força de cada camada — fundos mais fundos (`carbon-0`, `paper-0`), texto secundário mais forte, todas as bordas visíveis e, no claro, um laranja mais fechado (`orange-850`) com texto claro por cima. Os nomes dos tokens são os mesmos: nenhum componente muda.

Ative com `data-theme="dark-hc"` (ou `light-hc`). Em modo automático, quem pede mais contraste ao sistema (`prefers-contrast: more`) recebe o tema de alto contraste do mesmo esquema — veja Tema. A tabela abaixo é calculada ao vivo e as mesmas regras rodam em `contrast.test.ts`.

- Hierarquia continua existindo: texto (≥ 17:1), suave e sutil (≥ 7:1), desabilitado (≥ 4.5:1).
- Status plenos (ícones, barras, bordas) ficam ≥ 3:1 e mantêm o texto do Badge legível; o texto de status (*-text) passa de 7:1.
- Nos gráficos, as cores categóricas passam de 4.5:1 e vizinhas diferem em matiz ou luminosidade.

## Matriz de contraste

Calculada ao vivo com `contrastRatio()` e `wcagLevel()` de `@orangesys/tokens/contrast`. AA exige 4.5:1 para texto normal e 3:1 para texto grande (≥ 24px, ou ≥ 18.66px em negrito); AAA exige 7:1.

## Faça e não faça

- Faça: Use tokens semânticos: `var(--or-color-text-muted)`.
- Faça: Teste cada combinação nova nos dois temas.
- Faça: Combine cor com ícone, texto ou padrão.
- Faça: Use bordas de 1px para separar áreas antes de usar fundos coloridos.
- Evite: Escrever hex no CSS de componentes (`#f58549`).
- Evite: Usar `--or-palette-*` para texto: o valor não muda com o tema.
- Evite: Criar um segundo acento (roxo, rosa) para “dar vida” à tela.
- Evite: Usar vermelho ou verde para decorar — eles significam erro e sucesso.

> **Quer outra cor de marca?** Sobrescreva `--or-color-accent` e as variações e verifique o contraste — o passo a passo está em Tema.
