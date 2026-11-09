# Carousel

Percorre uma sequência de slides (vitrines, onboarding, destaques) com swipe nativo, setas, seletor e rotação opcional pausável.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Carousel, CarouselSlide } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/carousel (em inglês: https://orange.llypedev.com.br/en/components/carousel)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-carousel--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Carousel

## Boas práticas

- Use carrosséis para itens de mesma importância que o usuário percorre por escolha: vitrines, onboarding, galerias. Muita gente só vê o primeiro slide — não esconda nele informação crítica que não esteja também em outro lugar.
- Prefira sem rotação automática. Se usar `autoplay`, mantenha ao menos 5 s por slide: o Orange mostra o botão **Pausar rotação** como primeiro controle, pausa no hover, para quando o foco do teclado entra e nunca começa sozinho com movimento reduzido.
- Dê um nome com `label` sem a palavra "carrossel" (o papel já é anunciado). Quando o slide tiver um título visível, ligue-o com `aria-labelledby` no `CarouselSlide`.
- Em vitrines, use `slidesPerView` fracionado (`1.4`, `2.4`): o próximo item "espia" na borda e sinaliza que há mais. Com muitas posições, troque os pontos por `picker="counter"`.

- Faça: Poucos slides (3 a 6) com títulos claros e rotação opcional pausável.
- Faça: Imagens com proporção fixa (Image ratio) para os slides não mudarem de altura.
- Evite: Rotação rápida sem botão de pausa, ou o único caminho para uma ação importante.
- Evite: Usar o carrossel para conteúdo que precisa ser comparado lado a lado (use uma grade ou tabela).

## Anatomia

- **Carousel** — Região (`section`) com `aria-roledescription="carousel"` e nome obrigatório.
- **Botão de rotação** — Só com autoplay. Primeiro controle da região; o rótulo alterna entre Pausar rotação e Iniciar rotação.
- **Seletor** — Pontos em abas (`tablist`, uma parada de Tab), contador "02 / 05" ou nenhum.
- **Anterior / Próximo** — Botões quadrados de 40px. Sem `loop`, nas pontas ficam `aria-disabled` — continuam focáveis.
- **Trilho** — Rolagem com `scroll-snap-type: x mandatory` (swipe nativo) e região ao vivo dos slides.
- **CarouselSlide** — `role="group"` + `aria-roledescription="slide"`, nomeado "2 de 5" por padrão. Fora da vista fica inerte.

## Exemplos

### Onboarding

Um slide por vez, sem rotação. Cada slide é nomeado pelo próprio título (aria-labelledby) e a ilustração é decorativa (alt="").

```tsx
import { Carousel, CarouselSlide, Heading, Image, Text } from '@orangesys/ui'
import alertas from './media/alertas.svg'
import boasVindas from './media/boas-vindas.svg'
import pedidos from './media/pedidos.svg'
import pronto from './media/pronto.svg'

const steps = [
  {
    id: 'boas-vindas',
    image: boasVindas,
    title: 'Boas-vindas à Laranja Store',
    text: 'Monte sua lista de desejos e receba ofertas dos produtos que você acompanha.',
  },
  {
    id: 'pedidos',
    image: pedidos,
    title: 'Acompanhe cada pedido',
    text: 'Veja quando o pedido sai do centro de distribuição e em que etapa da entrega ele está.',
  },
  {
    id: 'alertas',
    image: alertas,
    title: 'Alertas de preço',
    text: 'Avisamos quando um item da sua lista baixar de preço ou voltar ao estoque.',
  },
  {
    id: 'pronto',
    image: pronto,
    title: 'Tudo pronto',
    text: 'Ative as notificações e comece a explorar as categorias.',
  },
]

export default function Onboarding() {
  return (
    <Carousel label="Primeiros passos" style={{ maxWidth: 440 }}>
      {steps.map((step) => (
        // O título visível nomeia o slide; a ilustração é decorativa (alt="").
        <CarouselSlide key={step.id} aria-labelledby={`onboarding-${step.id}`}>
          <Image src={step.image} alt="" ratio="4/3" bordered />
          <Heading level={4} size="lg" id={`onboarding-${step.id}`} style={{ marginTop: 16 }}>
            {step.title}
          </Heading>
          <Text tone="muted" style={{ marginTop: 4 }}>
            {step.text}
          </Text>
        </CarouselSlide>
      ))}
    </Carousel>
  )
}
```

### Vitrine de produtos

slidesPerView responsivo ({ base: 1.4, sm: 2.4, lg: 3.2 }) deixa o próximo produto espiando. Controles no topo com contador. Arraste no toque ou use as setas e o seletor.

```tsx
import { Button, Carousel, CarouselSlide, Eyebrow, Heading, Image, Text } from '@orangesys/ui'
import bone from './media/bone.svg'
import caneca from './media/caneca.svg'
import fone from './media/fone.svg'
import garrafa from './media/garrafa.svg'
import luminaria from './media/luminaria.svg'
import mochila from './media/mochila.svg'
import relogio from './media/relogio.svg'
import tenis from './media/tenis.svg'

const products = [
  { id: 'mochila', image: mochila, category: 'Viagem', name: 'Mochila Urbana 22 L', price: 'R$ 289,90', alt: 'Mochila grafite com alças laranja' },
  { id: 'tenis', image: tenis, category: 'Corrida', name: 'Tênis Pace Leve', price: 'R$ 459,00', alt: 'Tênis preto com solado laranja' },
  { id: 'garrafa', image: garrafa, category: 'Esporte', name: 'Garrafa Térmica 750 ml', price: 'R$ 119,90', alt: 'Garrafa térmica laranja com faixa grafite' },
  { id: 'fone', image: fone, category: 'Áudio', name: 'Fone Over-ear Studio', price: 'R$ 699,00', alt: 'Fone de ouvido grafite com conchas laranja' },
  { id: 'relogio', image: relogio, category: 'Acessórios', name: 'Relógio Minimal', price: 'R$ 349,90', alt: 'Relógio de pulseira grafite com mostrador claro' },
  { id: 'luminaria', image: luminaria, category: 'Casa', name: 'Luminária Articulada', price: 'R$ 229,00', alt: 'Luminária de mesa com cúpula laranja' },
  { id: 'caneca', image: caneca, category: 'Cozinha', name: 'Caneca Esmaltada', price: 'R$ 59,90', alt: 'Caneca grafite com faixa laranja' },
  { id: 'bone', image: bone, category: 'Acessórios', name: 'Boné Aba Curva', price: 'R$ 89,90', alt: 'Boné grafite com aba laranja' },
]

export default function ProductRail() {
  return (
    <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
      <Heading level={4} size="lg">
        Mais vendidos da semana
      </Heading>
      {/* Frações deixam o próximo produto "espiando": sinal visual de que há mais. */}
      <Carousel
        label="Mais vendidos da semana"
        slidesPerView={{ base: 1.4, sm: 2.4, lg: 3.2 }}
        gap={4}
        controls="top"
        picker="counter"
      >
        {products.map((product) => (
          <CarouselSlide key={product.id} aria-labelledby={`produto-${product.id}`}>
            <article style={{ display: 'grid', gap: 8 }}>
              <Image src={product.image} alt={product.alt} ratio="1/1" bordered />
              <Eyebrow>{product.category}</Eyebrow>
              <Heading level={5} size="md" id={`produto-${product.id}`}>
                {product.name}
              </Heading>
              <Text weight="semibold">{product.price}</Text>
              <Button variant="outline" size="sm" aria-label={`Adicionar ${product.name} ao carrinho`}>
                Adicionar
              </Button>
            </article>
          </CarouselSlide>
        ))}
      </Carousel>
    </div>
  )
}
```

### Destaques com rotação automática

autoplay={{ interval: 6000 }}: a barra laranja mostra o tempo até o próximo slide e pausa no hover. Pressione Tab: o foco entra no botão de rotação e a rotação para até você iniciá-la de novo.

```tsx
import { Carousel, CarouselSlide, Eyebrow, Heading, Image, Text } from '@orangesys/ui'
import deploy from './media/deploy.svg'
import equipes from './media/equipes.svg'
import monitoramento from './media/monitoramento.svg'
import seguranca from './media/seguranca.svg'

const features = [
  {
    id: 'deploy',
    image: deploy,
    eyebrow: 'Entrega',
    title: 'Deploy contínuo sem fila',
    text: 'Cada merge vira uma versão publicada em minutos, com rollback em um clique.',
  },
  {
    id: 'monitoramento',
    image: monitoramento,
    eyebrow: 'Observabilidade',
    title: 'Monitoramento em tempo real',
    text: 'Latência, erros e custo por serviço no mesmo painel, com alertas por canal.',
  },
  {
    id: 'equipes',
    image: equipes,
    eyebrow: 'Colaboração',
    title: 'Espaços por equipe',
    text: 'Permissões por projeto e revisão obrigatória antes de chegar à produção.',
  },
  {
    id: 'seguranca',
    image: seguranca,
    eyebrow: 'Segurança',
    title: 'Segredos sempre cifrados',
    text: 'Variáveis sensíveis ficam cifradas e nunca aparecem nos registros de build.',
  },
]

export default function Autoplay() {
  return (
    // O primeiro controle é Pausar rotação; o hover pausa e o foco do teclado para a rotação.
    <Carousel label="Recursos da plataforma" autoplay={{ interval: 6000 }} loop style={{ maxWidth: 640 }}>
      {features.map((feature) => (
        <CarouselSlide key={feature.id} aria-labelledby={`recurso-${feature.id}`}>
          <Image src={feature.image} alt="" ratio="16/9" bordered />
          <div style={{ display: 'grid', gap: 4, marginTop: 16 }}>
            <Eyebrow>{feature.eyebrow}</Eyebrow>
            <Heading level={4} size="xl" id={`recurso-${feature.id}`}>
              {feature.title}
            </Heading>
            <Text tone="muted">{feature.text}</Text>
          </div>
        </CarouselSlide>
      ))}
    </Carousel>
  )
}
```

### Galeria controlada

index + onIndexChange: as miniaturas e o carrossel compartilham a mesma posição. picker="none" deixa só as setas.

```tsx
import { useState } from 'react'
import { Carousel, CarouselSlide, Image, Text } from '@orangesys/ui'
import fone from './media/fone.svg'
import garrafa from './media/garrafa.svg'
import mochila from './media/mochila.svg'
import tenis from './media/tenis.svg'

const photos = [
  { id: 'mochila', src: mochila, alt: 'Mochila Urbana: vista frontal com alças laranja' },
  { id: 'tenis', src: tenis, alt: 'Tênis Pace Leve: vista lateral' },
  { id: 'garrafa', src: garrafa, alt: 'Garrafa Térmica: vista frontal' },
  { id: 'fone', src: fone, alt: 'Fone Studio: conchas laranja' },
]

export default function Gallery() {
  // Controlado: a posição vive no estado do pai e as miniaturas também a alteram.
  const [index, setIndex] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360, width: '100%' }}>
      <Carousel label="Fotos do produto" index={index} onIndexChange={setIndex} picker="none" loop>
        {photos.map((photo) => (
          <CarouselSlide key={photo.id}>
            <Image src={photo.src} alt={photo.alt} ratio="1/1" bordered />
          </CarouselSlide>
        ))}
      </Carousel>
      <div style={{ display: 'flex', gap: 8 }}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`Ver foto ${i + 1}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            style={{
              width: 56,
              padding: 0,
              border: `2px solid ${i === index ? 'var(--or-color-accent)' : 'transparent'}`,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <Image src={photo.src} alt="" ratio="1/1" />
          </button>
        ))}
      </div>
      <Text size="sm" tone="muted">
        Foto {index + 1} de {photos.length}
      </Text>
    </div>
  )
}
```

## Movimento

- **Troca de slide** — Rolagem nativa suave (scrollTo com behavior smooth) sobre o trilho com scroll-snap — o mesmo movimento do swipe. Slides fora da posição recuam para 50% de opacidade e o novo acende em --or-duration-medium (250ms), --or-ease-out.
- **Indicador do seletor** — Um único quadrado laranja desliza até o ponto ativo com --or-ease-spring (250ms), só transform. Os pontos crescem 1.25× no hover e no foco.
- **Setas** — Afundam 1px ao pressionar (--or-duration-press, 90ms) e o ícone empurra 2px na direção do movimento no hover/foco.
- **Barra de progresso** — Com autoplay, uma barra de 2px preenche a linha dos controles (or-fill-x, linear, no tempo do intervalo). Recomeça a cada slide e pausa junto com a rotação (animation-play-state).
- **Pausar / Iniciar** — O ícone troca com um pequeno pop (or-scale-in, --or-ease-bounce).
- **Movimento reduzido** — A rotação nunca começa sozinha, a troca de slide é instantânea (behavior auto), o indicador salta direto e a barra de progresso some. O estado continua visível pelo ponto ativo e pelo contador.

## Props

### `Carousel`

Carrossel acessível (padrão Carousel do WAI-ARIA APG): região com
`aria-roledescription="carousel"`, slides `role="group"`, botões
anterior/próximo, seletor em abas e rotação opcional com botão de pausa.
O trilho usa scroll-snap nativo: swipe, trackpad e roda funcionam sem JS.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `string` | — | Nome acessível do carrossel (vira `aria-label`). Obrigatório. Não inclua a palavra "carrossel": o papel já é anunciado. Com um título visível, passe `aria-labelledby` — ele tem precedência. |
| `autoplay` | `CarouselAutoplay` | `false` | Rotação automática. `true` usa 5s; `{ interval }` define o tempo em ms. Sempre exibe o botão Pausar/Iniciar como primeiro controle; pausa no hover, para quando o foco do teclado entra e nunca começa sozinha com movimento reduzido. |
| `children` | `ReactNode` | — | Slides (`CarouselSlide`) como filhos diretos. |
| `controls` | `"bottom" \| "top"` | `bottom` | Posição da barra de controles. Na ordem do Tab ela sempre vem antes dos slides. |
| `defaultIndex` | `number` | `0` | Posição inicial (não controlado). Padrão: `0`. |
| `gap` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 8` | `4` | Espaço entre slides, na escala `--or-space-*`. Padrão: `4` (16px). |
| `index` | `number` | — | Posição atual (controlado). É o índice do primeiro slide visível. |
| `loop` | `boolean` | `false` | Anterior/próximo dão a volta nas pontas. A rotação automática sempre volta ao início. |
| `onIndexChange` | `((index: number) => void)` | — | Chamado quando a posição muda (botões, seletor, swipe ou rotação). |
| `picker` | `"none" \| "dots" \| "counter"` | `dots` | Seletor de slides: `dots` (abas do APG, uma parada de Tab), `counter` ("02 / 05", para muitos slides) ou `none` (só anterior/próximo). |
| `slidesPerView` | `CarouselSlidesPerView` | `1` | Slides visíveis por vez. Frações deixam o próximo "espiando" (ex.: `1.2`, `2.5`). Aceita valores por breakpoint: `{ base: 1.2, md: 2.5, lg: 4 }`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `CarouselSlide`

Um slide do `Carousel` (`role="group"`, `aria-roledescription="slide"`).
Fora da vista fica inerte: some dos leitores de tela e da ordem do Tab.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` | `string` | — | Nome acessível do slide. Padrão: a posição ("2 de 5"). Com um título visível no slide, prefira `aria-labelledby`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão **Carousel** do WAI-ARIA APG. A raiz é uma `section` nomeada com `aria-roledescription="carousel"`; cada slide é um `group` com `aria-roledescription="slide"`. Slides fora da vista recebem `inert` (e `aria-hidden`): somem dos leitores de tela e da ordem do Tab. O trilho é uma região ao vivo com `aria-live="off"` enquanto gira e `"polite"` quando o usuário navega, para o novo slide ser anunciado sem interromper. Anterior e próximo não movem o foco, então podem ser repetidos à vontade.

> **Por que o seletor usa abas** O APG oferece dois seletores: abas (`tablist`) ou botões agrupados. Ele recomenda as abas porque ocupam **uma única parada de Tab** e se navegam com as setas; os botões agrupados criam uma parada por slide — "o menos amigável para quem usa teclado". Os slides continuam `group` (e não `tabpanel`) porque, com `slidesPerView`, vários ficam visíveis ao mesmo tempo; cada aba aponta para o seu slide com `aria-controls`.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra no carrossel pelo botão de rotação (se houver), depois o seletor, as setas e o conteúdo do slide visível. O foco do teclado entrando para a rotação. |
| `Enter` | Ativa o botão focado (pausar/iniciar, anterior, próximo). |
| `Space` | Ativa o botão focado. |
| `→` | No seletor: próximo slide (volta ao primeiro no fim) e move o foco para a aba. |
| `←` | No seletor: slide anterior (vai ao último no início). |
| `Home` | No seletor: primeiro slide. |
| `End` | No seletor: último slide. |

- **2.2.2** — Pausar, parar, ocultar: botão de rotação como primeiro controle, pausa no hover, para com o foco do teclado e quando a aba do navegador fica oculta.
- **2.3.3** — Com prefers-reduced-motion a rotação não começa sozinha e as trocas são instantâneas.
- **1.3.1** — Região, slides e seletor com papéis e nomes do APG; posição "2 de 5" em cada slide.
- **2.1.1** — Tudo operável por teclado: botões nativos e abas com setas, Home e End.
- **2.4.3** — Slides fora da vista ficam inertes: o Tab nunca cai em conteúdo invisível.
- **2.5.8** — Pontos com alvo de 24×24px; setas e rotação com 40×40px.
- **4.1.3** — O novo slide é anunciado pela região ao vivo polite, sem mover o foco.
