import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Basico from './examples/Basico'
import BasicoCode from './examples/Basico?raw'
import ContainerRolavel from './examples/ContainerRolavel'
import ContainerRolavelCode from './examples/ContainerRolavel?raw'
import Escalonado from './examples/Escalonado'
import EscalonadoCode from './examples/Escalonado?raw'
import Sequencia from './examples/Sequencia'
import SequenciaCode from './examples/Sequencia?raw'
import { meta } from './meta'
import '../../../styles/guides.css'

export default function RevealPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use em páginas de leitura e marketing — seções, cartões de recursos, números — para dar ritmo à rolagem. Em telas de trabalho (tabelas, formulários, painéis), não revele nada: a pessoa precisa ver o conteúdo já pronto.',
              en: 'Use it on reading and marketing pages — sections, feature cards, numbers — to give the scroll a rhythm. On work screens (tables, forms, dashboards), reveal nothing: people need to see content ready.',
            },
            {
              pt: (
                <>
                  Revele blocos, não frases soltas. Para grupos de itens irmãos, prefira um único{' '}
                  <Code>{'<Reveal stagger>'}</Code> a vários Reveals com atraso manual.
                </>
              ),
              en: (
                <>
                  Reveal blocks, not loose sentences. For groups of sibling items, prefer a single{' '}
                  <Code>{'<Reveal stagger>'}</Code> over several Reveals with manual delays.
                </>
              ),
            },
            {
              pt: (
                <>
                  Mantenha sequências curtas: o escalonamento para no 9º filho (8 × 80ms). Listas
                  longas devem aparecer de uma vez.
                </>
              ),
              en: (
                <>
                  Keep sequences short: staggering caps at the 9th child (8 × 80ms). Long lists
                  should appear at once.
                </>
              ),
            },
            {
              pt: 'Nunca dependa da revelação para comunicar algo: o conteúdo é o mesmo com ou sem movimento.',
              en: 'Never rely on the reveal to communicate anything: content is the same with or without motion.',
            },
          ]}
        />
        <DoDont
          doItems={[
            {
              pt: 'Uma revelação por seção, ao entrar na tela pela primeira vez.',
              en: 'One reveal per section, the first time it enters the screen.',
            },
            {
              pt: 'Cartões de um mesmo grupo com stagger.',
              en: 'Cards from the same group with stagger.',
            },
          ]}
          dontItems={[
            {
              pt: 'Revelar o conteúdo acima da dobra ou o título principal da página.',
              en: 'Revealing above-the-fold content or the main page title.',
            },
            {
              pt: (
                <>
                  Usar <Code>once={'{false}'}</Code> em páginas longas: o conteúdo some e reaparece
                  a cada rolagem.
                </>
              ),
              en: (
                <>
                  Using <Code>once={'{false}'}</Code> on long pages: content disappears and
                  reappears on every scroll.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Variantes', en: 'Variants' }}
          description={{
            pt: (
              <>
                Role a página até aqui: <Code>up</Code> (padrão) sobe 24px, <Code>fade</Code> só
                muda a opacidade e <Code>scale</Code> cresce de 0.96. Recarregue a página no topo
                para ver de novo.
              </>
            ),
            en: (
              <>
                Scroll the page to here: <Code>up</Code> (default) rises 24px, <Code>fade</Code>{' '}
                only changes opacity and <Code>scale</Code> grows from 0.96. Reload the page at the
                top to see it again.
              </>
            ),
          }}
          code={BasicoCode}
          align="stretch"
        >
          <Basico />
        </Example>
        <Example
          title={{ pt: 'Grupo escalonado', en: 'Staggered group' }}
          description={{
            pt: (
              <>
                Com <Code>stagger</Code>, o Reveal anima os filhos diretos em sequência — cada um
                80ms depois do anterior. Use <Code>as</Code> para manter a semântica de lista.
              </>
            ),
            en: (
              <>
                With <Code>stagger</Code>, Reveal animates its direct children in sequence — each
                80ms after the previous one. Use <Code>as</Code> to keep list semantics.
              </>
            ),
          }}
          code={EscalonadoCode}
          align="stretch"
        >
          <Escalonado />
        </Example>
        <Example
          title={{ pt: 'Sequência com index e delay', en: 'Sequence with index and delay' }}
          description={{
            pt: (
              <>
                Quando os elementos não são irmãos diretos, dê a cada Reveal sua posição com{' '}
                <Code>index</Code> (soma 80ms por posição) e, se preciso, um atraso fixo com{' '}
                <Code>delay</Code>.
              </>
            ),
            en: (
              <>
                When elements aren’t direct siblings, give each Reveal its position with{' '}
                <Code>index</Code> (adds 80ms per position) and, if needed, a fixed delay with{' '}
                <Code>delay</Code>.
              </>
            ),
          }}
          code={SequenciaCode}
          align="stretch"
        >
          <Sequencia />
        </Example>
        <Example
          title={{ pt: 'Contêiner rolável', en: 'Scrollable container' }}
          description={{
            pt: (
              <>
                O Reveal observa a viewport, inclusive o recorte de contêineres roláveis. Role
                dentro da caixa: cada pedido aparece ao entrar na área visível. Com{' '}
                <Code>once={'{false}'}</Code>, ele se esconde ao sair e revela de novo ao voltar —
                use “Repetir”.
              </>
            ),
            en: (
              <>
                Reveal watches the viewport, including the clipping of scrollable containers. Scroll
                inside the box: each order appears as it enters the visible area. With{' '}
                <Code>once={'{false}'}</Code>, it hides when leaving and reveals again when coming
                back — use “Repetir” (replay).
              </>
            ),
          }}
          code={ContainerRolavelCode}
          align="stretch"
          collapsed
        >
          <ContainerRolavel />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'as',
              type: 'ElementType',
              default: "'div'",
              description: {
                pt: 'Elemento renderizado (section, ul, li…).',
                en: 'Rendered element (section, ul, li…).',
              },
            },
            {
              name: 'variant',
              type: "'up' | 'fade' | 'scale'",
              default: "'up'",
              description: {
                pt: 'Subir 24px, só opacidade ou leve escala (0.96).',
                en: 'Rise 24px, opacity only or a slight scale (0.96).',
              },
            },
            {
              name: 'stagger',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Escalona os filhos diretos em 80ms (até o 9º).',
                en: 'Staggers direct children by 80ms (up to the 9th).',
              },
            },
            {
              name: 'index',
              type: 'number',
              description: {
                pt: (
                  <>
                    Posição numa sequência: soma <Code>index × --or-stagger</Code> ao atraso.
                  </>
                ),
                en: (
                  <>
                    Position in a sequence: adds <Code>index × --or-stagger</Code> to the delay.
                  </>
                ),
              },
            },
            {
              name: 'delay',
              type: 'number',
              description: {
                pt: 'Atraso fixo antes de começar, em ms.',
                en: 'Fixed delay before starting, in ms.',
              },
            },
            {
              name: 'once',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Revela uma vez ou sempre que entrar na viewport.',
                en: 'Reveals once or every time it enters the viewport.',
              },
            },
            {
              name: 'rootMargin',
              type: 'string',
              default: "'0px 0px -60px 0px'",
              description: {
                pt: 'Margem do IntersectionObserver: o padrão dispara 60px depois de a borda inferior cruzar a tela.',
                en: 'IntersectionObserver margin: the default fires 60px after the bottom edge crosses the screen.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes',
              description: {
                pt: 'Atributos nativos repassados ao elemento (className, style, aria-*…).',
                en: 'Native attributes forwarded to the element (className, style, aria-*…).',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada', en: 'Entrance' },
              description: {
                pt: (
                  <>
                    Opacidade 0 → 1 e <Code>translateY(--or-distance-lg)</Code> (24px) em{' '}
                    <Code>--or-duration-reveal</Code> (600ms) com <Code>--or-ease-out</Code>.
                  </>
                ),
                en: (
                  <>
                    Opacity 0 → 1 and <Code>translateY(--or-distance-lg)</Code> (24px) over{' '}
                    <Code>--or-duration-reveal</Code> (600ms) with <Code>--or-ease-out</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Escalonamento', en: 'Stagger' },
              description: {
                pt: (
                  <>
                    <Code>--or-stagger</Code> (80ms) × posição, somado ao <Code>delay</Code>.
                  </>
                ),
                en: (
                  <>
                    <Code>--or-stagger</Code> (80ms) × position, added to <Code>delay</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Disparo', en: 'Trigger' },
              description: {
                pt: (
                  <>
                    <Code>IntersectionObserver</Code> com <Code>rootMargin</Code> −60px na base e{' '}
                    <Code>threshold</Code> 0.08; por padrão, uma única vez.
                  </>
                ),
                en: (
                  <>
                    <Code>IntersectionObserver</Code> with a −60px bottom <Code>rootMargin</Code>{' '}
                    and <Code>threshold</Code> 0.08; once by default.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Acima da dobra', en: 'Above the fold' },
              description: {
                pt: 'O que já está visível na primeira pintura não anima — nada pisca ao carregar.',
                en: 'What is already visible on first paint doesn’t animate — nothing flashes on load.',
              },
            },
            {
              term: { pt: 'SSR e sem JavaScript', en: 'SSR and no JavaScript' },
              description: {
                pt: 'O HTML do servidor sai visível; o estado escondido só é aplicado no cliente.',
                en: 'Server HTML ships visible; the hidden state is only applied on the client.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: (
                  <>
                    Com <Code>prefers-reduced-motion</Code>, tudo aparece imediatamente: o estado
                    escondido nunca é aplicado e os tokens de duração e distância vão a zero.
                  </>
                ),
                en: (
                  <>
                    With <Code>prefers-reduced-motion</Code>, everything appears at once: the hidden
                    state is never applied and the duration and distance tokens drop to zero.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O Reveal é puramente visual. O conteúdo fica no DOM e na árvore de acessibilidade o
                tempo todo — <Code>opacity</Code> e <Code>transform</Code> não escondem nada de
                leitores de tela — e a ordem do documento não muda. Elementos focáveis dentro dele
                continuam focáveis e na mesma ordem de tabulação.
              </>
            }
            en={
              <>
                Reveal is purely visual. Content stays in the DOM and in the accessibility tree at
                all times — <Code>opacity</Code> and <Code>transform</Code> hide nothing from screen
                readers — and document order doesn’t change. Focusable elements inside stay
                focusable and keep their tab order.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            {
              criterion: '2.2.2',
              description: {
                pt: 'A animação dura 600ms, é disparada pela rolagem e não se repete sozinha — não há movimento automático a pausar.',
                en: 'The animation lasts 600ms, is triggered by scrolling and doesn’t repeat by itself — there is no automatic motion to pause.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Animação a partir de interação desativada com prefers-reduced-motion: o conteúdo aparece sem deslocamento.',
                en: 'Motion from interaction is disabled with prefers-reduced-motion: content appears without movement.',
              },
            },
            {
              criterion: '1.3.2',
              description: {
                pt: 'A sequência de leitura é a do DOM; o escalonamento é só visual.',
                en: 'Reading sequence follows the DOM; staggering is visual only.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
