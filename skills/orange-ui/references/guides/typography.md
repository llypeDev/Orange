# Tipografia

Três famílias com papéis claros: Space Grotesk dá a voz, Inter faz o trabalho pesado de leitura e JetBrains Mono cuida do que é técnico. Uma escala de 11 tamanhos cobre do rótulo ao hero.

## Famílias

> **Fallbacks** Cada família termina em fontes do sistema (`system-ui`, `Segoe UI`, `ui-monospace`…). Se as fontes web não carregarem, a interface continua legível e com a mesma hierarquia.

## Escala

Os tamanhos vivem em `--or-text-*` e estão em rem: respeitam o tamanho de fonte que a pessoa configurou no navegador (1.4.4). Os valores em px abaixo consideram a base de 16px.

## Pesos

- **Regular (400):** texto corrido. É o padrão do `body`.
- **Medium (500):** eyebrows, navegação, ênfase leve.
- **Semibold (600):** títulos grandes (h1, display) e `<strong>`.
- **Bold (700):** títulos de h2 para baixo e rótulos de botão — compensa o tamanho menor.

## Altura de linha e espaçamento

| Token | Valor | Uso |
| --- | --- | --- |

body · 1.55

Em telas de produto, 1.55 mantém tabelas, formulários e cartões compactos sem colar as linhas.

loose · 1.7

Para leitura longa, 1.7 dá ar ao parágrafo e ajuda o olho a achar o começo da próxima linha.

O conteúdo precisa sobreviver quando a pessoa aumenta o espaçamento (1.4.12): altura de linha 1.5×, parágrafos 2×, letras +0.12em e palavras +0.16em. Não fixe alturas em contêineres de texto.

## Componentes

`Heading`, `Text` e `Eyebrow` aplicam a escala, as famílias e as cores de texto. Use-os em vez de estilizar `h1`– `p` à mão.

### Heading

level define a semântica (o que o leitor de tela anuncia); size define a aparência. Escolha o nível pela estrutura do documento, nunca pelo tamanho.

```tsx
import { Heading } from '@orangesys/ui'

// level = semântica (h1–h6), definida pela estrutura do documento;
// size = aparência. Aqui o exemplo está dentro de um h3, então começa no h4.
<Heading level={4} size="4xl">Relatório de vendas</Heading>
<Heading level={5} size="3xl">Resumo do trimestre</Heading>
<Heading level={6} size="2xl">Por canal</Heading>
<Heading level={6} size="xl">Loja física</Heading>
<Heading level={5} size="xl">Um h5 com tamanho de h4</Heading>
```

### Text

Tamanho, tom, peso, família e truncamento. O elemento padrão é <p>; troque com as.

```tsx
import { Text } from '@orangesys/ui'

<Text size="lg" tone="muted">Lead: resumo do que a página entrega.</Text>
<Text>Texto padrão: 15px, Inter, cor text.</Text>
<Text size="sm" tone="subtle">Atualizado há 5 minutos</Text>
<Text tone="success" weight="semibold">Pagamento confirmado</Text>
<Text font="mono" size="sm">PED-2026-04821</Text>
<Text truncate style={{ maxWidth: 260 }}>
  Endereço: Rua Doutor Arnaldo de Carvalho, 1500 — São Paulo
</Text>
```

### Eyebrow

Rótulo curto em caixa alta acima de títulos. O marcador quadrado é decorativo.

```tsx
import { Eyebrow, Heading } from '@orangesys/ui'

<Eyebrow>Configurações</Eyebrow>
<Eyebrow marker>Novo</Eyebrow>
<Eyebrow tone="accent" marker>Em destaque</Eyebrow>

{/* Acima de um título */}
<Eyebrow as="span" marker>Faturamento</Eyebrow>
<Heading level={2}>R$ 182.430</Heading>
```

## Hierarquia

A hierarquia nasce de tamanho, peso e espaço — não de cor. Um cabeçalho típico combina eyebrow (contexto), título (o quê) e lead (por quê), separados do conteúdo por uma borda de 1px.

### Exemplo

```tsx
<header>
  <Eyebrow marker>Pedidos · Março</Eyebrow>
  <Heading level={1} size="4xl">Pedidos em aberto</Heading>
  <Text size="lg" tone="muted">
    32 pedidos aguardam separação. Os mais antigos aparecem primeiro.
  </Text>
</header>
<section>
  <Heading level={2} size="xl">Prioridade alta</Heading>
  <Text tone="muted">Pedidos com entrega expressa e prazo vencendo hoje.</Text>
</section>
```

## Escrita

- **Caixa de sentença** em títulos, botões e rótulos: “Criar projeto”, não “Criar Projeto”. Só a primeira palavra e nomes próprios em maiúscula.
- **60 a 75 caracteres por linha** em texto corrido. A documentação usa `max-width: 72ch`; o lead usa 68ch.
- **Caixa alta só em eyebrows**, com `text-transform` — nunca digitada em maiúsculas (leitores de tela podem soletrar).
- **Alinhado à esquerda.** Texto justificado cria rios de espaço; centralizado só em blocos curtos, como o hero.
- **Números tabulares** em tabelas e métricas: `font-variant-numeric: tabular-nums`.
- **Direto ao ponto.** Verbos no começo dos botões, frases curtas, sem jargão interno.

- Faça: Caixa de sentença, texto alinhado à esquerda e linhas de tamanho confortável.
- Evite: Título digitado em maiúsculas e parágrafo justificado.
