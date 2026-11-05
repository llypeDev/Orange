import {
  Bullets,
  Callout,
  Code,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Autoplay from './examples/Autoplay'
import AutoplayCode from './examples/Autoplay?raw'
import Gallery from './examples/Gallery'
import GalleryCode from './examples/Gallery?raw'
import Onboarding from './examples/Onboarding'
import OnboardingCode from './examples/Onboarding?raw'
import ProductRail from './examples/ProductRail'
import ProductRailCode from './examples/ProductRail?raw'
import { meta } from './meta'

export default function CarouselPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use carrosséis para itens de mesma importância que o usuário percorre por escolha: vitrines, onboarding, galerias. Muita gente só vê o primeiro slide — não esconda nele informação crítica que não esteja também em outro lugar.',
              en: 'Use carousels for items of equal importance that people browse by choice: product rails, onboarding, galleries. Many people only see the first slide — do not hide critical information in later slides that is not available elsewhere.',
            },
            {
              pt: (
                <>
                  Prefira sem rotação automática. Se usar <Code>autoplay</Code>, mantenha ao menos 5 s por slide: o Orange
                  mostra o botão <strong>Pausar rotação</strong> como primeiro controle, pausa no hover, para quando o foco
                  do teclado entra e nunca começa sozinho com movimento reduzido.
                </>
              ),
              en: (
                <>
                  Prefer no automatic rotation. If you use <Code>autoplay</Code>, keep at least 5 s per slide: Orange shows
                  the <strong>Pause rotation</strong> button as the first control, pauses on hover, stops when keyboard focus
                  enters and never starts on its own under reduced motion.
                </>
              ),
            },
            {
              pt: (
                <>
                  Dê um nome com <Code>label</Code> sem a palavra "carrossel" (o papel já é anunciado). Quando o slide tiver um
                  título visível, ligue-o com <Code>aria-labelledby</Code> no <Code>CarouselSlide</Code>.
                </>
              ),
              en: (
                <>
                  Give it a name with <Code>label</Code> without the word "carousel" (the role is already announced). When a
                  slide has a visible title, point to it with <Code>aria-labelledby</Code> on <Code>CarouselSlide</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Em vitrines, use <Code>slidesPerView</Code> fracionado (<Code>1.4</Code>, <Code>2.4</Code>): o próximo item
                  "espia" na borda e sinaliza que há mais. Com muitas posições, troque os pontos por{' '}
                  <Code>picker="counter"</Code>.
                </>
              ),
              en: (
                <>
                  In product rails, use a fractional <Code>slidesPerView</Code> (<Code>1.4</Code>, <Code>2.4</Code>): the next
                  item peeks at the edge and signals there is more. With many positions, swap the dots for{' '}
                  <Code>picker="counter"</Code>.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doItems={[
            { pt: 'Poucos slides (3 a 6) com títulos claros e rotação opcional pausável.', en: 'Few slides (3 to 6) with clear titles and optional, pausable rotation.' },
            { pt: 'Imagens com proporção fixa (Image ratio) para os slides não mudarem de altura.', en: 'Images with a fixed ratio (Image ratio) so slides do not change height.' },
          ]}
          dontItems={[
            { pt: 'Rotação rápida sem botão de pausa, ou o único caminho para uma ação importante.', en: 'Fast rotation without a pause button, or the only path to an important action.' },
            { pt: 'Usar o carrossel para conteúdo que precisa ser comparado lado a lado (use uma grade ou tabela).', en: 'Using a carousel for content that must be compared side by side (use a grid or table).' },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Carousel', en: 'Carousel' }, description: { pt: <>Região (<Code>section</Code>) com <Code>aria-roledescription="carousel"</Code> e nome obrigatório.</>, en: <>Region (<Code>section</Code>) with <Code>aria-roledescription="carousel"</Code> and a required name.</> } },
            { term: { pt: 'Botão de rotação', en: 'Rotation button' }, description: { pt: 'Só com autoplay. Primeiro controle da região; o rótulo alterna entre Pausar rotação e Iniciar rotação.', en: 'Autoplay only. First control in the region; its label switches between Pause rotation and Start rotation.' } },
            { term: { pt: 'Seletor', en: 'Picker' }, description: { pt: <>Pontos em abas (<Code>tablist</Code>, uma parada de Tab), contador "02 / 05" ou nenhum.</>, en: <>Dots as tabs (<Code>tablist</Code>, a single Tab stop), a "02 / 05" counter or none.</> } },
            { term: { pt: 'Anterior / Próximo', en: 'Previous / Next' }, description: { pt: <>Botões quadrados de 40px. Sem <Code>loop</Code>, nas pontas ficam <Code>aria-disabled</Code> — continuam focáveis.</>, en: <>40px square buttons. Without <Code>loop</Code>, they become <Code>aria-disabled</Code> at the ends — still focusable.</> } },
            { term: { pt: 'Trilho', en: 'Track' }, description: { pt: <>Rolagem com <Code>scroll-snap-type: x mandatory</Code> (swipe nativo) e região ao vivo dos slides.</>, en: <>Scrolling with <Code>scroll-snap-type: x mandatory</Code> (native swipe) and the slides' live region.</> } },
            { term: { pt: 'CarouselSlide', en: 'CarouselSlide' }, description: { pt: <><Code>role="group"</Code> + <Code>aria-roledescription="slide"</Code>, nomeado "2 de 5" por padrão. Fora da vista fica inerte.</>, en: <><Code>role="group"</Code> + <Code>aria-roledescription="slide"</Code>, named "2 of 5" by default. Out of view it is inert.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Onboarding', en: 'Onboarding' }}
          description={{
            pt: 'Um slide por vez, sem rotação. Cada slide é nomeado pelo próprio título (aria-labelledby) e a ilustração é decorativa (alt="").',
            en: 'One slide at a time, no rotation. Each slide is named by its own title (aria-labelledby) and the illustration is decorative (alt="").',
          }}
          code={OnboardingCode}
          align="stretch"
        >
          <Onboarding />
        </Example>
        <Example
          title={{ pt: 'Vitrine de produtos', en: 'Product rail' }}
          description={{
            pt: 'slidesPerView responsivo ({ base: 1.4, sm: 2.4, lg: 3.2 }) deixa o próximo produto espiando. Controles no topo com contador. Arraste, use o trackpad ou as setas.',
            en: 'Responsive slidesPerView ({ base: 1.4, sm: 2.4, lg: 3.2 }) lets the next product peek. Controls on top with a counter. Swipe, use the trackpad or the arrows.',
          }}
          code={ProductRailCode}
          align="stretch"
        >
          <ProductRail />
        </Example>
        <Example
          title={{ pt: 'Destaques com rotação automática', en: 'Highlights with autoplay' }}
          description={{
            pt: 'autoplay={{ interval: 6000 }}: a barra laranja mostra o tempo até o próximo slide e pausa no hover. Pressione Tab: o foco entra no botão de rotação e a rotação para até você iniciá-la de novo.',
            en: 'autoplay={{ interval: 6000 }}: the orange bar shows the time until the next slide and pauses on hover. Press Tab: focus lands on the rotation button and rotation stops until you start it again.',
          }}
          code={AutoplayCode}
          align="stretch"
        >
          <Autoplay />
        </Example>
        <Example
          title={{ pt: 'Galeria controlada', en: 'Controlled gallery' }}
          description={{
            pt: 'index + onIndexChange: as miniaturas e o carrossel compartilham a mesma posição. picker="none" deixa só as setas.',
            en: 'index + onIndexChange: the thumbnails and the carousel share the same position. picker="none" keeps only the arrows.',
          }}
          code={GalleryCode}
        >
          <Gallery />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Troca de slide', en: 'Slide change' }, description: { pt: 'Rolagem nativa suave (scrollTo com behavior smooth) sobre o trilho com scroll-snap — o mesmo movimento do swipe. Slides fora da posição recuam para 50% de opacidade e o novo acende em --or-duration-medium (250ms), --or-ease-out.', en: 'Native smooth scrolling (scrollTo with behavior smooth) over the scroll-snap track — the same motion as a swipe. Slides outside the position recede to 50% opacity and the new one lights up in --or-duration-medium (250ms), --or-ease-out.' } },
            { term: { pt: 'Indicador do seletor', en: 'Picker indicator' }, description: { pt: 'Um único quadrado laranja desliza até o ponto ativo com --or-ease-spring (250ms), só transform. Os pontos crescem 1.25× no hover e no foco.', en: 'A single orange square slides to the active dot with --or-ease-spring (250ms), transform only. Dots grow 1.25× on hover and focus.' } },
            { term: { pt: 'Setas', en: 'Arrows' }, description: { pt: 'Afundam 1px ao pressionar (--or-duration-press, 90ms) e o ícone empurra 2px na direção do movimento no hover/foco.', en: 'Sink 1px when pressed (--or-duration-press, 90ms) and the icon nudges 2px in the direction of travel on hover/focus.' } },
            { term: { pt: 'Barra de progresso', en: 'Progress bar' }, description: { pt: 'Com autoplay, uma barra de 2px preenche a linha dos controles (or-fill-x, linear, no tempo do intervalo). Recomeça a cada slide e pausa junto com a rotação (animation-play-state).', en: 'With autoplay, a 2px bar fills the controls rule (or-fill-x, linear, over the interval). It restarts on every slide and pauses together with rotation (animation-play-state).' } },
            { term: { pt: 'Pausar / Iniciar', en: 'Pause / Start' }, description: { pt: 'O ícone troca com um pequeno pop (or-scale-in, --or-ease-bounce).', en: 'The icon swaps with a small pop (or-scale-in, --or-ease-bounce).' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'A rotação nunca começa sozinha, a troca de slide é instantânea (behavior auto), o indicador salta direto e a barra de progresso some. O estado continua visível pelo ponto ativo e pelo contador.', en: 'Rotation never starts on its own, slide changes are instant (behavior auto), the indicator jumps directly and the progress bar is hidden. State remains visible through the active dot and the counter.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Carousel', en: 'Carousel' }}
          rows={[
            { name: 'label', type: 'string', required: true, description: { pt: <>Nome acessível da região. <Code>aria-labelledby</Code> tem precedência.</>, en: <>Accessible name of the region. <Code>aria-labelledby</Code> takes precedence.</> } },
            { name: 'index', type: 'number', description: { pt: 'Posição atual (controlado): índice do primeiro slide visível.', en: 'Current position (controlled): index of the first visible slide.' } },
            { name: 'defaultIndex', type: 'number', default: '0', description: { pt: 'Posição inicial (não controlado).', en: 'Initial position (uncontrolled).' } },
            { name: 'onIndexChange', type: '(index: number) => void', description: { pt: 'Chamado em toda troca: botões, seletor, swipe ou rotação.', en: 'Called on every change: buttons, picker, swipe or rotation.' } },
            { name: 'loop', type: 'boolean', default: 'false', description: { pt: 'Anterior/próximo dão a volta. A rotação automática sempre volta ao início.', en: 'Previous/next wrap around. Automatic rotation always returns to the start.' } },
            { name: 'slidesPerView', type: 'number | { base?, sm?, md?, lg?, xl? }', default: '1', description: { pt: 'Slides por vista; frações criam o "espiar". Breakpoints de largura mínima: sm 640, md 768, lg 1024, xl 1280.', en: 'Slides per view; fractions create the peek. Min-width breakpoints: sm 640, md 768, lg 1024, xl 1280.' } },
            { name: 'gap', type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8', default: '4', description: { pt: <>Espaço entre slides na escala <Code>--or-space-*</Code>.</>, en: <>Space between slides on the <Code>--or-space-*</Code> scale.</> } },
            { name: 'autoplay', type: 'boolean | { interval: number }', default: 'false', description: { pt: 'Rotação automática (padrão 5000ms, mínimo 1000ms). Exibe o botão de pausa como primeiro controle.', en: 'Automatic rotation (default 5000ms, minimum 1000ms). Shows the pause button as the first control.' } },
            { name: 'controls', type: "'bottom' | 'top'", default: "'bottom'", description: { pt: 'Posição visual da barra de controles. No DOM e no Tab ela vem sempre antes dos slides.', en: 'Visual position of the controls bar. In the DOM and Tab order it always comes before the slides.' } },
            { name: 'picker', type: "'dots' | 'counter' | 'none'", default: "'dots'", description: { pt: 'Seletor: abas com pontos, contador "02 / 05" ou nenhum.', en: 'Picker: tabs with dots, a "02 / 05" counter or none.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: { pt: <>Atributos da <Code>&lt;section&gt;</Code> raiz (a ref também vai para ela). Use <Code>role="group"</Code> se o carrossel não deve ser um landmark.</>, en: <>Attributes for the root <Code>&lt;section&gt;</Code> (the ref goes there too). Use <Code>role="group"</Code> if the carousel should not be a landmark.</> } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'CarouselSlide', en: 'CarouselSlide' }}
          rows={[
            { name: 'label', type: 'string', description: { pt: 'Nome acessível do slide. Padrão: posição ("2 de 5").', en: 'Accessible name of the slide. Default: position ("2 of 5").' } },
            { name: 'aria-labelledby', type: 'string', description: { pt: 'Id do título visível do slide (preferível a label quando existe).', en: "Id of the slide's visible title (preferred over label when present)." } },
            { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos do elemento do slide (a ref vai para ele).', en: 'Attributes for the slide element (the ref goes there).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <strong>Carousel</strong> do WAI-ARIA APG. A raiz é uma <Code>section</Code> nomeada com{' '}
                <Code>aria-roledescription="carousel"</Code>; cada slide é um <Code>group</Code> com{' '}
                <Code>aria-roledescription="slide"</Code>. Slides fora da vista recebem <Code>inert</Code> (e{' '}
                <Code>aria-hidden</Code>): somem dos leitores de tela e da ordem do Tab. O trilho é uma região ao vivo com{' '}
                <Code>aria-live="off"</Code> enquanto gira e <Code>"polite"</Code> quando o usuário navega, para o novo slide
                ser anunciado sem interromper. Anterior e próximo não movem o foco, então podem ser repetidos à vontade.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <strong>Carousel</strong> pattern. The root is a named <Code>section</Code> with{' '}
                <Code>aria-roledescription="carousel"</Code>; each slide is a <Code>group</Code> with{' '}
                <Code>aria-roledescription="slide"</Code>. Slides out of view get <Code>inert</Code> (and{' '}
                <Code>aria-hidden</Code>): they leave screen readers and the Tab order. The track is a live region with{' '}
                <Code>aria-live="off"</Code> while rotating and <Code>"polite"</Code> when the user navigates, so the new
                slide is announced without interrupting. Previous and next do not move focus, so they can be repeated freely.
              </>
            }
          />
        </p>
        <Callout title={{ pt: 'Por que o seletor usa abas', en: 'Why the picker uses tabs' }}>
          <T
            pt={
              <>
                O APG oferece dois seletores: abas (<Code>tablist</Code>) ou botões agrupados. Ele recomenda as abas porque
                ocupam <strong>uma única parada de Tab</strong> e se navegam com as setas; os botões agrupados criam uma
                parada por slide — "o menos amigável para quem usa teclado". Os slides continuam <Code>group</Code> (e não{' '}
                <Code>tabpanel</Code>) porque, com <Code>slidesPerView</Code>, vários ficam visíveis ao mesmo tempo; cada aba
                aponta para o seu slide com <Code>aria-controls</Code>.
              </>
            }
            en={
              <>
                The APG offers two pickers: tabs (<Code>tablist</Code>) or grouped buttons. It recommends tabs because they
                take <strong>a single Tab stop</strong> and are navigated with the arrow keys; grouped buttons create one
                stop per slide — "the least friendly for keyboard users". Slides stay <Code>group</Code> (not{' '}
                <Code>tabpanel</Code>) because, with <Code>slidesPerView</Code>, several are visible at once; each tab points
                to its slide with <Code>aria-controls</Code>.
              </>
            }
          />
        </Callout>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Entra no carrossel pelo botão de rotação (se houver), depois o seletor, as setas e o conteúdo do slide visível. O foco do teclado entrando para a rotação.', en: 'Enters the carousel at the rotation button (if any), then the picker, the arrows and the visible slide content. Keyboard focus entering stops rotation.' } },
            { keys: ['Enter'], description: { pt: 'Ativa o botão focado (pausar/iniciar, anterior, próximo).', en: 'Activates the focused button (pause/start, previous, next).' } },
            { keys: ['Space'], description: { pt: 'Ativa o botão focado.', en: 'Activates the focused button.' } },
            { keys: ['→'], description: { pt: 'No seletor: próximo slide (volta ao primeiro no fim) e move o foco para a aba.', en: 'In the picker: next slide (wraps to the first at the end) and moves focus to the tab.' } },
            { keys: ['←'], description: { pt: 'No seletor: slide anterior (vai ao último no início).', en: 'In the picker: previous slide (wraps to the last at the start).' } },
            { keys: ['Home'], description: { pt: 'No seletor: primeiro slide.', en: 'In the picker: first slide.' } },
            { keys: ['End'], description: { pt: 'No seletor: último slide.', en: 'In the picker: last slide.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '2.2.2', description: { pt: 'Pausar, parar, ocultar: botão de rotação como primeiro controle, pausa no hover, para com o foco do teclado e quando a aba do navegador fica oculta.', en: 'Pause, stop, hide: rotation button as the first control, pauses on hover, stops on keyboard focus and when the browser tab is hidden.' } },
            { criterion: '2.3.3', description: { pt: 'Com prefers-reduced-motion a rotação não começa sozinha e as trocas são instantâneas.', en: 'With prefers-reduced-motion rotation does not start on its own and changes are instant.' } },
            { criterion: '1.3.1', description: { pt: 'Região, slides e seletor com papéis e nomes do APG; posição "2 de 5" em cada slide.', en: 'Region, slides and picker with APG roles and names; "2 of 5" position on each slide.' } },
            { criterion: '2.1.1', description: { pt: 'Tudo operável por teclado: botões nativos e abas com setas, Home e End.', en: 'Everything keyboard operable: native buttons and tabs with arrows, Home and End.' } },
            { criterion: '2.4.3', description: { pt: 'Slides fora da vista ficam inertes: o Tab nunca cai em conteúdo invisível.', en: 'Out-of-view slides are inert: Tab never lands on invisible content.' } },
            { criterion: '2.5.8', description: { pt: 'Pontos com alvo de 24×24px; setas e rotação com 40×40px.', en: 'Dots with a 24×24px target; arrows and rotation with 40×40px.' } },
            { criterion: '4.1.3', description: { pt: 'O novo slide é anunciado pela região ao vivo polite, sem mover o foco.', en: 'The new slide is announced by the polite live region, without moving focus.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
