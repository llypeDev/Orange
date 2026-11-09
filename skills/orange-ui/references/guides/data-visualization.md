# Visualização de dados

Gráficos no Orange seguem a mesma regra das telas: estrutura visível, cor com propósito e nada que dependa só da cor. Esta página traz as paletas, as regras e modelos de gráficos acessíveis desenhados com SVG puro.

## Escolha a forma antes da cor

- **Um número** — Não é gráfico: mostre o valor grande, com a variação em texto ao lado.
- **Comparar categorias** — Barras, com eixo começando em zero. Horizontais quando os rótulos são longos.
- **Evolução no tempo** — Linhas para séries contínuas; barras para poucos períodos discretos.
- **Parte de um todo** — Rosca ou barra empilhada com até 5 fatias; o resto vira “Outros”.
- **Acima ou abaixo de uma referência** — Barras divergentes com a paleta divergente.
- **Intensidade em duas dimensões** — Mapa de calor com a paleta sequencial e o valor escrito em cada célula.

## Paleta categórica

Para identificar séries: cinco matizes em ordem fixa, mais um neutro para “Outros”. A ordem não é estética — verde, âmbar e vermelho ficam quase iguais para quem tem protanopia ou deuteranopia, então nunca são vizinhos. Cada tema tem seus próprios tons, validados contra o próprio fundo (a tabela abaixo mostra o tema atual: **** ).

| Ordem | Cor | Primitiva | Contraste com o fundo |
| --- | --- | --- | --- |
| Outros |  | `--or-palette-` |  |

- Atribua as cores na ordem, sem pular. A sexta série não ganha uma cor nova: vira “Outros” ou um gráfico separado.
- A cor segue a entidade, não a posição: se um filtro remove uma série, as outras mantêm suas cores.
- Quando a série significa bom ou ruim (erros, metas), use os tokens de status ( `success`, `danger`) com ícone e rótulo — nunca misture as duas lógicas no mesmo gráfico.
- O acento continua único: para destacar uma barra ou série, pinte-a com `--or-color-accent` e deixe o resto no neutro.

## Paletas sequencial e divergente

Sequencial representa quantidade: um único matiz (laranja), do claro ao escuro no tema claro e do escuro ao claro no escuro — o valor alto é sempre o que mais se destaca do fundo. Divergente representa os dois lados de uma referência: azul abaixo, laranja acima, neutro no meio.

Sequencial

Divergente

No mapa de calor, cada célula mostra o número: a cor ajuda a achar padrões, o texto garante a leitura exata.

## Regras

- Faça: Rótulos diretos nas linhas e na barra em destaque, além da legenda.
- Faça: Forma, textura ou posição reforçando a cor (marcadores diferentes por série).
- Faça: Eixo de barras começando em zero e um único eixo vertical.
- Faça: Linhas de grade discretas (--or-color-border) e texto nos tokens de texto.
- Faça: Título que diz o quê, subtítulo que diz quando e em que unidade, e a fonte dos dados.
- Evite: Legenda como única forma de saber qual cor é qual série.
- Evite: Gráficos 3D, pizza com mais de 5 fatias ou dois eixos Y.
- Evite: Arco-íris para quantidades — use um só matiz.
- Evite: Texto colorido com a cor da série: o rótulo fica em text e um marcador colorido identifica.
- Evite: Um número em cada ponto do gráfico.

## Modelos

Os gráficos abaixo são SVG desenhado à mão, sem biblioteca. Cada um é um `<figure>` com o SVG em `role="img"`, `<title>` e `<desc>` resumindo a conclusão, e a tabela com os dados completos logo abaixo. Passe o mouse sobre as marcas para ver os valores.

> **Gráficos com biblioteca** Usando Recharts, Visx, ECharts ou similares? Passe as mesmas cores na mesma ordem, desligue animações com movimento reduzido e mantenha a tabela de dados e o resumo em texto.

## Anatomia de um gráfico

1

2

3

2025

2026

518

7

- **Título** — o que o gráfico mostra, em display semibold.
- **Subtítulo** — período e unidade, em text-subtle.
- **Legenda** — acima do gráfico, na ordem das séries, sempre que houver 2 ou mais.
- **Eixo e grade** — linhas de 1px em border; base em border-strong; números em text-subtle.
- **Marcas** — barras retas, linhas de 2px e marcadores de ≥ 8px, separados por 2px de fundo.
- **Rótulo direto** — só no que importa (o destaque, o fim da linha), na cor de texto.
- **Fonte e dados** — origem dos números e a tabela alternativa para leitores de tela.
