# Image

Imagem com proporção reservada (sem deslocamento de layout), carregamento sob demanda, skeleton, fade-in e substituto acessível em caso de erro.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Image } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/image (em inglês: https://orange.llypedev.com.br/en/components/image)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-image--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Image

## Boas práticas

- `alt` é obrigatório. Descreva o que a imagem comunica naquele contexto, em uma frase curta — não o arquivo nem "imagem de". Para um produto: cor, tipo e o detalhe que diferencia.
- Use `alt=""` só quando a imagem for **decorativa**: ornamento, textura, ou quando o mesmo conteúdo já está no texto ao lado (o título do cartão, a legenda). Assim leitores de tela a ignoram em vez de repetir a informação.
- Sempre reserve o espaço: passe `ratio` (ou `width` e `height` numéricos). Sem isso, a altura só é conhecida depois do carregamento e o conteúdo abaixo pula (CLS).
- Mantenha `loading="lazy"` (padrão) para imagens abaixo da dobra. Para a imagem principal visível ao abrir a página, use `loading="eager"` e `fetchPriority="high"`.

- Faça: alt descreve o conteúdo e o contexto.
- Evite: alt com nome de arquivo, "imagem" ou vazio numa imagem informativa.

## Anatomia

- **Contêiner** — Reserva a proporção com `aspect-ratio`; recebe `className`, `style` e `data-state` (loading, loaded, error).
- **Skeleton** — Mesmo visual do componente Skeleton, decorativo, até a imagem carregar.
- **<img>** — Recebe a `ref` e os demais atributos (`srcSet`, `sizes`, `fetchPriority`…).
- **Substituto** — Em erro: superfície neutra com ícone e o alt em texto oculto, ou o seu fallback.
- **Legenda** — Com `caption`, tudo fica dentro de `<figure>` com `<figcaption>`.

## Exemplos

### Proporções

ratio aceita '1/1', '4/3', '3/2', '16/9', '21/9' ou um número. A área existe antes do download, então nada pula.

```tsx
import { Eyebrow, Image } from '@orangesys/ui'
import vitrine from './media/vitrine.svg'

const ratios = ['1/1', '4/3', '16/9', '21/9'] as const

export default function Ratios() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, width: '100%' }}>
      {ratios.map((ratio) => (
        <div key={ratio} style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
          {/* A área é reservada antes de carregar: nada pula quando a foto chega. */}
          <Image src={vitrine} alt="Prateleiras da loja com mochilas, garrafas e acessórios" ratio={ratio} bordered />
          <Eyebrow>{ratio}</Eyebrow>
        </div>
      ))}
    </div>
  )
}
```

### Enquadramento e ponto focal

cover recorta para preencher; position escolhe o que preservar. contain mostra a imagem inteira — use para logotipos.

```tsx
import { Eyebrow, Image } from '@orangesys/ui'
import logotipo from './media/logotipo.svg'
import retrato from './media/retrato.svg'

export default function FitPosition() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, width: '100%' }}>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        <Image src={retrato} alt="Retrato da gerente da loja" ratio="1/1" bordered />
        <Eyebrow>cover · center</Eyebrow>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* O rosto fica no topo da foto: o ponto focal evita cortá-lo. */}
        <Image src={retrato} alt="Retrato da gerente da loja" ratio="1/1" position="top" bordered />
        <Eyebrow>cover · top</Eyebrow>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* Logotipos nunca devem ser recortados. */}
        <Image src={logotipo} alt="Laranja Store" ratio="1/1" fit="contain" bordered />
        <Eyebrow>contain</Eyebrow>
      </div>
    </div>
  )
}
```

### Erro e substitutos

Se o src falhar, o Image tenta o fallbackSrc uma vez. Depois mostra o substituto padrão (ícone + "Imagem indisponível: <alt>" para leitores de tela) ou o seu fallback.

```tsx
import { Eyebrow, Icon, Image, Text } from '@orangesys/ui'
import reserva from './media/reserva.svg'

export default function Fallbacks() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, width: '100%' }}>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* 1. A foto falha e o Image tenta o fallbackSrc uma vez. */}
        <Image
          src="/produtos/mochila-inexistente.jpg"
          fallbackSrc={reserva}
          alt="Mochila Urbana 22 L"
          ratio="4/3"
          bordered
        />
        <Eyebrow>fallbackSrc</Eyebrow>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* 2. Sem alternativa: superfície neutra com ícone e o alt em texto oculto. */}
        <Image src="/produtos/tenis-inexistente.jpg" alt="Tênis Pace Leve" ratio="4/3" bordered />
        <Eyebrow>Padrão</Eyebrow>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* 3. Substituto próprio. */}
        <Image
          src="/mapas/loja-centro-inexistente.png"
          alt="Mapa da loja do centro"
          ratio="4/3"
          bordered
          fallback={
            <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
              <Icon name="globe" size="lg" />
              <Text size="sm">Mapa indisponível no momento.</Text>
            </div>
          }
        />
        <Eyebrow>fallback</Eyebrow>
      </div>
    </div>
  )
}
```

### Com legenda e borda

caption envolve a imagem em <figure>/<figcaption>. bordered desenha a borda de 1px por cima da imagem.

```tsx
import { Image } from '@orangesys/ui'
import vitrine from './media/vitrine.svg'

export default function Caption() {
  return (
    <Image
      src={vitrine}
      alt="Prateleiras da loja com mochilas, garrafas e acessórios organizados por cor"
      ratio="16/9"
      bordered
      caption="Nova vitrine da loja do centro, organizada por categoria."
      style={{ maxWidth: 520 }}
    />
  )
}
```

## Movimento

- **Carregando** — O skeleton (brilho do Skeleton, 1.6s) ocupa a área reservada. Com movimento reduzido ele fica estático.
- **Carregou** — A imagem entra com fade de opacidade em --or-duration-medium (250ms), --or-ease-out. Imagens já em cache aparecem direto, sem fade.
- **Erro** — O substituto entra com or-fade-in (250ms).
- **Movimento reduzido** — Troca instantânea: as durações zeram pelos tokens.

## Props

### `Image`

Imagem robusta: reserva a proporção (sem CLS), carrega sob demanda
(`loading="lazy"`, `decoding="async"`), mostra um skeleton até carregar e
entra com fade. Se falhar, tenta `fallbackSrc` uma vez e depois exibe um
substituto acessível. A `ref` e os demais atributos vão para a `<img>`;
`className` e `style` vão para o contêiner (que define tamanho e proporção).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `alt` (obrigatória) | `string` | — | Texto alternativo — obrigatório. Descreva o que a imagem comunica no contexto. Use `alt=""` só quando ela for decorativa (o mesmo conteúdo já está no texto ao lado, ou é puro ornamento): assim leitores de tela a ignoram. |
| `src` (obrigatória) | `string` | — | URL da imagem. `srcSet` e `sizes` são repassados à `<img>`. |
| `bordered` | `boolean` | `false` | Borda de 1px (`--or-color-border`) desenhada sobre a borda da imagem. |
| `caption` | `ReactNode` | — | Legenda visível. Envolve a imagem em `<figure>` com `<figcaption>`. |
| `fallback` | `ReactNode` | — | Conteúdo exibido se a imagem (e o `fallbackSrc`) falharem. Substitui o padrão. |
| `fallbackSrc` | `string` | — | Segunda tentativa: carregada uma vez quando `src` falha, antes do `fallback`. |
| `fit` | `"cover" \| "contain"` | `cover` | Como a imagem preenche a área: `cover` (recorta, padrão) ou `contain` (mostra inteira). |
| `position` | `string` | — | Ponto focal do recorte (`object-position`), ex.: `'top'`, `'50% 30%'`. |
| `ratio` | `ImageRatio` | — | Proporção reservada antes do carregamento (`aspect-ratio`), evitando deslocamento de layout. Sem `ratio`, usa `width`/`height` numéricos se houver. |

Repassa também os atributos nativos (`AnchorHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O tipo exige `alt`, então esquecê-lo vira erro de compilação. Com `alt=""` a imagem sai da árvore de acessibilidade. O skeleton é decorativo (`aria-hidden`). Se a imagem falhar, o substituto padrão não é uma caixa vazia: ele mantém o conteúdo em texto oculto — "Imagem indisponível: Mochila Urbana 22 L".

> **Legendas e alt** A legenda complementa o alt, não o substitui: o alt descreve o que se vê; a legenda dá contexto (quando, onde, crédito). Não repita o mesmo texto nos dois.

- **1.1.1** — alt obrigatório no tipo; alt="" explícito para imagens decorativas; substituto com o alt em texto.
- **1.3.1** — Legenda associada pela estrutura nativa <figure>/<figcaption>.
- **2.3.3** — Fade e brilho desligados com movimento reduzido.
