import { Button, Icon, useReducedMotion } from '@orange/ui'
import { motion } from '@orange/tokens'
import { useState, type CSSProperties } from 'react'
import { T, useLang, type Localized } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  DocPage,
  DoDont,
  Example,
  Prose,
  Section,
} from '../../../kit'
import { Cards, TableWrap } from '../_shared/Blocks'
import Collapse from '../_shared/examples/motion/Collapse'
import CollapseCode from '../_shared/examples/motion/Collapse?raw'
import CountUp from '../_shared/examples/motion/CountUp'
import CountUpCode from '../_shared/examples/motion/CountUp?raw'
import Draw from '../_shared/examples/motion/Draw'
import DrawCode from '../_shared/examples/motion/Draw?raw'
import HideOnScroll from '../_shared/examples/motion/HideOnScroll'
import HideOnScrollCode from '../_shared/examples/motion/HideOnScroll?raw'
import Indicator from '../_shared/examples/motion/Indicator'
import IndicatorCode from '../_shared/examples/motion/Indicator?raw'
import Lift from '../_shared/examples/motion/Lift'
import LiftCode from '../_shared/examples/motion/Lift?raw'
import Nudge from '../_shared/examples/motion/Nudge'
import NudgeCode from '../_shared/examples/motion/Nudge?raw'
import PageEnter from '../_shared/examples/motion/PageEnter'
import PageEnterCode from '../_shared/examples/motion/PageEnter?raw'
import PieceDrop from '../_shared/examples/motion/PieceDrop'
import PieceDropCode from '../_shared/examples/motion/PieceDrop?raw'
import Presence from '../_shared/examples/motion/Presence'
import PresenceCode from '../_shared/examples/motion/Presence?raw'
import Press from '../_shared/examples/motion/Press'
import PressCode from '../_shared/examples/motion/Press?raw'
import Pulse from '../_shared/examples/motion/Pulse'
import PulseCode from '../_shared/examples/motion/Pulse?raw'
import RevealStagger from '../_shared/examples/motion/RevealStagger'
import RevealStaggerCode from '../_shared/examples/motion/RevealStagger?raw'
import Shake from '../_shared/examples/motion/Shake'
import ShakeCode from '../_shared/examples/motion/Shake?raw'
import TimedProgress from '../_shared/examples/motion/TimedProgress'
import TimedProgressCode from '../_shared/examples/motion/TimedProgress?raw'
import Underline from '../_shared/examples/motion/Underline'
import UnderlineCode from '../_shared/examples/motion/Underline?raw'

/* --- Dados dos tokens ------------------------------------------------------ */

const durationUsage: Record<string, Localized<string>> = {
  press: { pt: 'Pressionar: o botão afunda 1px', en: 'Press: the button sinks 1px' },
  instant: { pt: 'Troca de ícone, cor ao pressionar', en: 'Icon swap, press color' },
  fast: {
    pt: 'Hover, foco, cor e borda — e todas as saídas',
    en: 'Hover, focus, color and border — and every exit',
  },
  medium: {
    pt: 'Entradas de popovers e menus, indicadores, sublinhados',
    en: 'Popover and menu entrances, indicators, underlines',
  },
  slow: { pt: 'Expandir/recolher, painéis e drawers', en: 'Expand/collapse, panels and drawers' },
  reveal: { pt: 'Revelação no scroll (Reveal)', en: 'Scroll reveal (Reveal)' },
  slower: {
    pt: 'Entradas grandes e ilustrações — raramente',
    en: 'Large entrances and illustrations — rarely',
  },
  loop: { pt: 'Ciclos de status (pulso “ao vivo”)', en: 'Status cycles (“live” pulse)' },
}

const easingUsage: Record<string, Localized<string>> = {
  out: {
    pt: 'Padrão: começa rápido e desacelera. Entradas e hovers.',
    en: 'Default: starts fast and slows down. Entrances and hovers.',
  },
  'in-out': {
    pt: 'Ida e volta: saídas e o cabeçalho que se esconde.',
    en: 'Back and forth: exits and the hiding header.',
  },
  spring: {
    pt: 'Passa um pouco do ponto: indicadores de aba, segmento, switch.',
    en: 'Slight overshoot: tab, segment and switch indicators.',
  },
  snap: {
    pt: 'Desaceleração forte: encaixes e sliders.',
    en: 'Strong deceleration: snapping and sliders.',
  },
  bounce: {
    pt: 'Pop com overshoot: check, ponto do radio, badges.',
    en: 'Pop with overshoot: check, radio dot, badges.',
  },
}

const distanceUsage: Record<string, Localized<string>> = {
  sm: { pt: 'Popovers, menus e tooltips', en: 'Popovers, menus and tooltips' },
  md: { pt: 'Diálogos, toasts e entrada de página', en: 'Dialogs, toasts and page entrance' },
  lg: { pt: 'Revelação no scroll', en: 'Scroll reveal' },
  lift: { pt: 'Cartões que sobem no hover', en: 'Cards lifting on hover' },
}

const parseBezier = (value: string) =>
  value
    .replace(/cubic-bezier\(|\)/g, '')
    .split(',')
    .map((n) => Number(n.trim())) as [number, number, number, number]

/** Desenha a curva de Bézier — o quadro se ajusta a curvas com overshoot (bounce). */
function CurvePlot({ value }: { value: string }) {
  const [x1, y1, x2, y2] = parseBezier(value)
  const pad = 12
  const size = 100
  const yMax = Math.max(1, y1, y2)
  const yMin = Math.min(0, y1, y2)
  const height = (yMax - yMin) * size + pad * 2
  const px = (x: number) => pad + x * size
  const py = (y: number) => pad + (yMax - y) * size
  return (
    <svg className="guide-curve" viewBox={`0 0 ${size + pad * 2} ${height}`} aria-hidden="true">
      <rect x={pad} y={py(1)} width={size} height={size} className="guide-curve__frame" />
      <line x1={px(0)} y1={py(0)} x2={px(x1)} y2={py(y1)} className="guide-curve__handle" />
      <line x1={px(1)} y1={py(1)} x2={px(x2)} y2={py(y2)} className="guide-curve__handle" />
      <path
        d={`M${px(0)} ${py(0)} C${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} ${px(1)} ${py(1)}`}
        className="guide-curve__path"
      />
      <rect x={px(x1) - 3} y={py(y1) - 3} width={6} height={6} className="guide-curve__point" />
      <rect x={px(x2) - 3} y={py(y2) - 3} width={6} height={6} className="guide-curve__point" />
    </svg>
  )
}

/** Trilho: o quadrado atravessa com transform, na duração e curva escolhidas. */
function Track({ duration, easing, label }: { duration: string; easing: string; label: string }) {
  const { t } = useLang()
  const [on, setOn] = useState(false)
  return (
    <div className="guide-track">
      <div className="guide-track__rail" aria-hidden="true">
        <span
          className="guide-track__runner"
          data-on={on || undefined}
          style={{
            transitionDuration: `var(--or-duration-${duration})`,
            transitionTimingFunction: `var(--or-ease-${easing})`,
          }}
        >
          <span className="guide-track__dot" />
        </span>
      </div>
      <Button
        size="sm"
        variant="outline"
        iconOnly
        onClick={() => setOn((v) => !v)}
        aria-label={t({ pt: `Reproduzir ${label}`, en: `Play ${label}` })}
      >
        <Icon name="play" size="sm" />
      </Button>
    </div>
  )
}

function StaggerDemo() {
  const { t } = useLang()
  const [run, setRun] = useState(0)
  return (
    <div className="guide-row">
      <div key={run} className="guide-stagger" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} style={{ '--_i': i } as CSSProperties} />
        ))}
      </div>
      <Button
        size="sm"
        variant="ghost"
        startIcon={<Icon name="refresh" size="sm" />}
        onClick={() => setRun((n) => n + 1)}
      >
        {t({ pt: 'Repetir', en: 'Replay' })}
      </Button>
    </div>
  )
}

const replayNote: Localized<string> = {
  pt: ' Use “Repetir” para ver de novo.',
  en: ' Use “Repetir” (replay) to see it again.',
}

export default function MotionPage() {
  const { t } = useLang()
  const reduced = useReducedMotion()

  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Movimento', en: 'Motion' }}
      lead={{
        pt: 'O Orange se move como uma ferramenta, não como um show: rápido, funcional e geométrico. Botões afundam 1px, cartões sobem 4px, conteúdo entra 24px de baixo — e tudo para quando o sistema pede menos movimento.',
        en: 'Orange moves like a tool, not a show: fast, functional and geometric. Buttons sink 1px, cards lift 4px, content enters 24px from below — and everything stops when the system asks for less motion.',
      }}
    >
      <p className={`guide-motion-pref ${reduced ? 'guide-motion-pref--on' : ''}`} role="status">
        <span className="guide-motion-pref__dot" aria-hidden="true" />
        {reduced
          ? t({
              pt: 'Seu sistema pede movimento reduzido: as demonstrações abaixo mudam de estado sem animar.',
              en: 'Your system asks for reduced motion: the demos below change state without animating.',
            })
          : t({
              pt: 'Seu sistema usa movimento padrão. Ative “reduzir movimento” para ver a versão sem animação.',
              en: 'Your system uses standard motion. Turn on “reduce motion” to see the version without animation.',
            })}
      </p>

      <Section title={{ pt: 'Princípios', en: 'Principles' }}>
        <Cards
          columns={2}
          items={[
            {
              icon: 'zap',
              eyebrow: { pt: '90–250ms', en: '90–250ms' },
              title: { pt: 'Rápido', en: 'Fast' },
              text: {
                pt: 'Feedback de toque em 90ms, hover em 160ms, entradas em 250ms. A interface acompanha a mão de quem usa — ninguém espera uma animação.',
                en: 'Touch feedback in 90ms, hover in 160ms, entrances in 250ms. The interface keeps up with the user’s hand — nobody waits for an animation.',
              },
            },
            {
              icon: 'arrow-right',
              eyebrow: { pt: 'Cada movimento explica', en: 'Every move explains' },
              title: { pt: 'Funcional', en: 'Functional' },
              text: {
                pt: 'Movimento mostra causa e efeito: de onde o menu veio, que o clique foi aceito, que o erro apareceu. Se não explica nada, sai.',
                en: 'Motion shows cause and effect: where the menu came from, that the click registered, that an error appeared. If it explains nothing, it goes.',
              },
            },
            {
              icon: 'grid',
              eyebrow: { pt: '4 · 8 · 24px', en: '4 · 8 · 24px' },
              title: { pt: 'Geométrico', en: 'Geometric' },
              text: {
                pt: 'Deslocamentos retos em distâncias fixas, sombras sólidas deslocadas, sublinhados que crescem da esquerda. Nada de desfoque, rotação decorativa ou elástico exagerado.',
                en: 'Straight translations over fixed distances, solid offset shadows, underlines growing from the left. No blur, decorative rotation or exaggerated elasticity.',
              },
            },
            {
              icon: 'pause',
              eyebrow: { pt: 'Saída < entrada', en: 'Exit < entrance' },
              title: { pt: 'Sem bloquear', en: 'Non-blocking' },
              text: {
                pt: 'Elementos são interativos desde o primeiro quadro, saídas são mais curtas que entradas e nada essencial depende de a animação terminar.',
                en: 'Elements are interactive from the first frame, exits are shorter than entrances and nothing essential depends on the animation finishing.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Durações', en: 'Durations' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Gerada de <Code>motion.duration</Code> em <Code>@orange/tokens</Code>. Clique em ▶
                  para ver cada duração com <Code>--or-ease-out</Code>. Todas viram <Code>0ms</Code>{' '}
                  com movimento reduzido.
                </>
              }
              en={
                <>
                  Generated from <Code>motion.duration</Code> in <Code>@orange/tokens</Code>. Click
                  ▶ to see each duration with <Code>--or-ease-out</Code>. They all become{' '}
                  <Code>0ms</Code> with reduced motion.
                </>
              }
            />
          </p>
        </Prose>
        <TableWrap label={{ pt: 'Durações', en: 'Durations' }}>
          <table className="doc-table guide-motion-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">{t({ pt: 'Valor', en: 'Value' })}</th>
                <th scope="col">{t({ pt: 'Uso', en: 'Usage' })}</th>
                <th scope="col">{t({ pt: 'Demonstração', en: 'Demo' })}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(motion.duration).map(([name, value]) => (
                <tr key={name}>
                  <th scope="row">
                    <Code>--or-duration-{name}</Code>
                  </th>
                  <td>
                    <span className="guide-mono">{value}</span>
                  </td>
                  <td>{durationUsage[name] ? t(durationUsage[name]) : '—'}</td>
                  <td>
                    {name === 'loop' ? (
                      <span className="guide-mono guide-muted">
                        {t({ pt: 'veja “Pulso”', en: 'see “Pulse”' })}
                      </span>
                    ) : (
                      <Track duration={name} easing="out" label={`--or-duration-${name}`} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Section>

      <Section title={{ pt: 'Curvas', en: 'Easing curves' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Gerada de <Code>motion.easing</Code>. As demonstrações usam{' '}
                  <Code>--or-duration-slow</Code> para a diferença ficar visível; os quadrados
                  laranja são os pontos de controle — o do <Code>bounce</Code> sai do quadro porque
                  a curva passa do destino e volta.
                </>
              }
              en={
                <>
                  Generated from <Code>motion.easing</Code>. The demos use{' '}
                  <Code>--or-duration-slow</Code> so the difference is visible; the orange squares
                  are the control points — <Code>bounce</Code>’s leaves the frame because the curve
                  overshoots and comes back.
                </>
              }
            />
          </p>
        </Prose>
        <ul className="guide-easings">
          {Object.entries(motion.easing).map(([name, value]) => (
            <li key={name}>
              <CurvePlot value={value} />
              <div className="guide-easings__body">
                <Code>--or-ease-{name}</Code>
                <span className="guide-mono guide-muted">{value}</span>
                <span className="guide-easings__usage">
                  {easingUsage[name] ? t(easingUsage[name]) : ''}
                </span>
                <Track duration="slow" easing={name} label={`--or-ease-${name}`} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={{ pt: 'Distâncias e escalonamento', en: 'Distances and stagger' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Quanto maior o elemento, maior o deslocamento — mas sempre em um dos quatro
                  valores de <Code>motion.distance</Code>. Grupos entram em sequência, com{' '}
                  <Code>--or-stagger</Code> ({motion.stagger}) entre um item e o próximo. Com
                  movimento reduzido, distâncias e stagger também vão a zero.
                </>
              }
              en={
                <>
                  The bigger the element, the bigger the offset — but always one of the four values
                  in <Code>motion.distance</Code>. Groups enter in sequence, with{' '}
                  <Code>--or-stagger</Code> ({motion.stagger}) between one item and the next. With
                  reduced motion, distances and stagger drop to zero too.
                </>
              }
            />
          </p>
        </Prose>
        <ul className="guide-distances">
          {Object.entries(motion.distance).map(([name, value]) => (
            <li key={name}>
              <span className="guide-distances__stage" aria-hidden="true">
                <span className="guide-distances__ghost" />
                <span
                  className="guide-distances__box"
                  style={{
                    transform: `translateY(calc(var(--or-distance-${name}) * ${name === 'lift' ? 1 : -1}))`,
                  }}
                />
              </span>
              <Code>--or-distance-{name}</Code>
              <span className="guide-mono guide-muted">{value}</span>
              <span className="guide-distances__usage">
                {distanceUsage[name] ? t(distanceUsage[name]) : ''}
              </span>
            </li>
          ))}
        </ul>
        <p className="guide-ramp__title">--or-stagger · {motion.stagger}</p>
        <StaggerDemo />
      </Section>

      <Section title={{ pt: 'Interação', en: 'Interaction' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Respostas imediatas ao ponteiro e ao teclado. Hover e <Code>:focus-visible</Code>{' '}
                  sempre têm a mesma resposta; nenhuma delas é a única pista de estado.
                </>
              }
              en={
                <>
                  Immediate responses to pointer and keyboard. Hover and <Code>:focus-visible</Code>{' '}
                  always get the same response; none of them is the only state cue.
                </>
              }
            />
          </p>
        </Prose>
        <Example
          title={{ pt: 'Pressionar', en: 'Press' }}
          description={{
            pt: (
              <>
                Clique e segure: o alvo afunda <Code>translateY(1px) scale(0.985)</Code> em 90ms e
                volta em 160ms. Use <Code>or-press</Code> em qualquer alvo clicável que não seja um{' '}
                <Code>Button</Code>.
              </>
            ),
            en: (
              <>
                Click and hold: the target sinks <Code>translateY(1px) scale(0.985)</Code> in 90ms
                and returns in 160ms. Use <Code>or-press</Code> on any clickable target that isn’t a{' '}
                <Code>Button</Code>.
              </>
            ),
          }}
          code={PressCode}
          collapsed
        >
          <Press />
        </Example>
        <Example
          title={{ pt: 'Elevar', en: 'Lift' }}
          description={{
            pt: (
              <>
                Cartões clicáveis sobem 4px com uma sombra laranja sólida <Code>0 8px 0 -4px</Code>{' '}
                — no hover e no foco do teclado. Troque a cor com <Code>--_lift-color</Code>.
              </>
            ),
            en: (
              <>
                Clickable cards lift 4px with a solid orange <Code>0 8px 0 -4px</Code> shadow — on
                hover and on keyboard focus. Change the color with <Code>--_lift-color</Code>.
              </>
            ),
          }}
          code={LiftCode}
          align="stretch"
          collapsed
        >
          <Lift />
        </Example>
        <Example
          title={{ pt: 'Seta que empurra', en: 'Nudging arrow' }}
          description={{
            pt: 'O ícone final desliza 4px quando o link recebe hover ou foco — um convite para seguir em frente.',
            en: 'The trailing icon slides 4px when the link gets hover or focus — an invitation to move forward.',
          }}
          code={NudgeCode}
          collapsed
        >
          <Nudge />
        </Example>
        <Example
          title={{ pt: 'Sublinhado animado', en: 'Animated underline' }}
          description={{
            pt: (
              <>
                O traço cresce da esquerda via <Code>background-size</Code> e fica cheio no item com{' '}
                <Code>aria-current</Code>. Funciona em texto de várias linhas.
              </>
            ),
            en: (
              <>
                The line grows from the left via <Code>background-size</Code> and stays full on the
                item with <Code>aria-current</Code>. Works on multi-line text.
              </>
            ),
          }}
          code={UnderlineCode}
          collapsed
        >
          <Underline />
        </Example>
        <Example
          title={{ pt: 'Indicador de seleção', en: 'Selection indicator' }}
          description={{
            pt: (
              <>
                O indicador desliza entre as opções com <Code>--or-ease-spring</Code> em 250ms — o
                mesmo movimento das abas, do controle segmentado e do polegar do switch.
              </>
            ),
            en: (
              <>
                The indicator slides between options with <Code>--or-ease-spring</Code> in 250ms —
                the same motion as tabs, the segmented control and the switch thumb.
              </>
            ),
          }}
          code={IndicatorCode}
          collapsed
        >
          <Indicator />
        </Example>
      </Section>

      <Section title={{ pt: 'Entrada e saída', en: 'Enter and exit' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Sobreposições entram a partir de onde foram acionadas e saem mais rápido do que
                  entraram. <Code>usePresence(open)</Code> mantém o elemento montado durante a saída
                  e devolve o <Code>data-state</Code> que as classes de <Code>motion.css</Code>{' '}
                  animam.
                </>
              }
              en={
                <>
                  Overlays enter from where they were triggered and leave faster than they came.{' '}
                  <Code>usePresence(open)</Code> keeps the element mounted during the exit and
                  returns the <Code>data-state</Code> that the <Code>motion.css</Code> classes
                  animate.
                </>
              }
            />
          </p>
        </Prose>
        <Example
          title={{ pt: 'Presença: pop, drop e fade', en: 'Presence: pop, drop and fade' }}
          description={{
            pt: (
              <>
                <Code>or-motion-pop</Code> (popovers: opacidade + 4px + escala 0.98),{' '}
                <Code>or-motion-drop</Code> (menus: desce 6px) e <Code>or-motion-fade</Code> (véus).
                Entram em 250ms ou 160ms com <Code>ease-out</Code> e saem em 160ms com{' '}
                <Code>ease-in-out</Code>.
              </>
            ),
            en: (
              <>
                <Code>or-motion-pop</Code> (popovers: opacity + 4px + 0.98 scale),{' '}
                <Code>or-motion-drop</Code> (menus: drops 6px) and <Code>or-motion-fade</Code>{' '}
                (scrims). They enter in 250ms or 160ms with <Code>ease-out</Code> and leave in 160ms
                with <Code>ease-in-out</Code>.
              </>
            ),
          }}
          code={PresenceCode}
          minHeight={150}
          collapsed
        >
          <Presence />
        </Example>
        <Example
          title={{ pt: 'Expandir e recolher', en: 'Expand and collapse' }}
          description={{
            pt: (
              <>
                Altura animada sem medir nada: <Code>grid-template-rows: 0fr → 1fr</Code> com
                opacidade em 400ms, e o chevron gira 180°. O conteúdo fechado recebe{' '}
                <Code>inert</Code> para sair da ordem de tabulação.
              </>
            ),
            en: (
              <>
                Height animated without measuring: <Code>grid-template-rows: 0fr → 1fr</Code> with
                opacity in 400ms, and the chevron turns 180°. Closed content gets <Code>inert</Code>{' '}
                to leave the tab order.
              </>
            ),
          }}
          code={CollapseCode}
          align="stretch"
          collapsed
        >
          <Collapse />
        </Example>
        <Example
          title={{ pt: 'Entrada de página', en: 'Page entrance' }}
          description={{
            pt: (
              <>
                Na troca de rota, o conteúdo surge com opacidade e 8px (<Code>or-page-enter</Code>,
                400ms).{t(replayNote)}
              </>
            ),
            en: (
              <>
                On route change, content appears with opacity and 8px (<Code>or-page-enter</Code>,
                400ms).{t(replayNote)}
              </>
            ),
          }}
          code={PageEnterCode}
          align="stretch"
          collapsed
        >
          <PageEnter />
        </Example>
        <Example
          title={{ pt: 'Peças que caem', en: 'Dropping pieces' }}
          description={{
            pt: (
              <>
                Marcas e ilustrações geométricas montam peça por peça com <Code>or-piece-drop</Code>
                , <Code>--or-ease-bounce</Code> e stagger.{t(replayNote)}
              </>
            ),
            en: (
              <>
                Marks and geometric illustrations assemble piece by piece with{' '}
                <Code>or-piece-drop</Code>, <Code>--or-ease-bounce</Code> and stagger.
                {t(replayNote)}
              </>
            ),
          }}
          code={PieceDropCode}
          collapsed
        >
          <PieceDrop />
        </Example>
      </Section>

      <Section title={{ pt: 'Feedback e status', en: 'Feedback and status' }}>
        <Example
          title={{ pt: 'Pulso de status', en: 'Status pulse' }}
          description={{
            pt: (
              <>
                Um anel em <Code>box-shadow</Code> a cada 2,4s marca o que está “ao vivo”. É a única
                animação infinita permitida fora de carregamento — e sempre ao lado de texto
                (“Operacional”). Some com movimento reduzido.
              </>
            ),
            en: (
              <>
                A <Code>box-shadow</Code> ring every 2.4s marks what is “live”. It is the only
                infinite animation allowed outside loading — and always next to text
                (“Operational”). It disappears with reduced motion.
              </>
            ),
          }}
          code={PulseCode}
          collapsed
        >
          <Pulse />
        </Example>
        <Example
          title={{ pt: 'Tremor de erro', en: 'Error shake' }}
          description={{
            pt: (
              <>
                Ao surgir um erro de validação, o campo treme uma vez (<Code>or-shake</Code>,{' '}
                <Code>--or-duration-slow</Code>). A mensagem e o <Code>aria-invalid</Code> continuam sendo a informação — o
                tremor só chama o olhar.
              </>
            ),
            en: (
              <>
                When a validation error appears, the field shakes once (<Code>or-shake</Code>,{' '}
                <Code>--or-duration-slow</Code>). The message and <Code>aria-invalid</Code> remain the information — the shake
                only draws the eye.
              </>
            ),
          }}
          code={ShakeCode}
          align="stretch"
          collapsed
        >
          <Shake />
        </Example>
        <Example
          title={{ pt: 'Progresso temporizado', en: 'Timed progress' }}
          description={{
            pt: (
              <>
                Passos que avançam sozinhos mostram o tempo restante numa barra{' '}
                <Code>or-fill-x</Code> (<Code>scaleX</Code> 0 → 1). Nunca comece sozinho e ofereça
                como repetir ou pausar (2.2.2); com movimento reduzido, o resultado aparece direto.
              </>
            ),
            en: (
              <>
                Self-advancing steps show remaining time in an <Code>or-fill-x</Code> bar (
                <Code>scaleX</Code> 0 → 1). Never auto-start and offer a way to replay or pause
                (2.2.2); with reduced motion, the result shows right away.
              </>
            ),
          }}
          code={TimedProgressCode}
          align="stretch"
          collapsed
        >
          <TimedProgress />
        </Example>
        <Example
          title={{ pt: 'Desenho de traço', en: 'Stroke drawing' }}
          description={{
            pt: (
              <>
                Checks e linhas de gráfico se desenham com <Code>or-draw</Code> (
                <Code>stroke-dashoffset</Code>); defina <Code>--_draw-length</Code> com o
                comprimento do traço.{t(replayNote)}
              </>
            ),
            en: (
              <>
                Checks and chart lines draw themselves with <Code>or-draw</Code> (
                <Code>stroke-dashoffset</Code>); set <Code>--_draw-length</Code> to the stroke
                length.{t(replayNote)}
              </>
            ),
          }}
          code={DrawCode}
          collapsed
        >
          <Draw />
        </Example>
      </Section>

      <Section title={{ pt: 'Rolagem', en: 'Scroll' }}>
        <Example
          title={{ pt: 'Revelação escalonada', en: 'Staggered reveal' }}
          description={{
            pt: (
              <>
                O componente <Code>Reveal</Code> observa a viewport (<Code>rootMargin</Code> −60px,{' '}
                <Code>threshold</Code> 0.08) e sobe o conteúdo 24px em 600ms; com{' '}
                <Code>stagger</Code>, cada filho entra 80ms depois do anterior. Conteúdo já visível
                na carga nunca pisca.
              </>
            ),
            en: (
              <>
                The <Code>Reveal</Code> component watches the viewport (<Code>rootMargin</Code>{' '}
                −60px, <Code>threshold</Code> 0.08) and lifts content 24px in 600ms; with{' '}
                <Code>stagger</Code>, each child enters 80ms after the previous one. Content already
                visible on load never flashes.
              </>
            ),
          }}
          code={RevealStaggerCode}
          align="stretch"
          collapsed
        >
          <RevealStagger />
        </Example>
        <Example
          title={{ pt: 'Números que contam', en: 'Counting numbers' }}
          description={{
            pt: (
              <>
                <Code>useCountUp</Code> anima de 0 ao valor com desaceleração cúbica quando o número
                entra em cena (<Code>useInView</Code>). Com movimento reduzido, mostra o valor
                final.
              </>
            ),
            en: (
              <>
                <Code>useCountUp</Code> animates from 0 to the value with cubic deceleration when
                the number comes into view (<Code>useInView</Code>). With reduced motion it shows
                the final value.
              </>
            ),
          }}
          code={CountUpCode}
          align="stretch"
          collapsed
        >
          <CountUp />
        </Example>
        <Example
          title={{ pt: 'Cabeçalho que se esconde', en: 'Hiding header' }}
          description={{
            pt: (
              <>
                Role a página: depois de 160px rolando para baixo, <Code>useScrollDirection</Code>{' '}
                esconde a barra (<Code>translateY(-100%)</Code>, <Code>ease-in-out</Code>); qualquer
                rolagem para cima a traz de volta. É o mesmo hook do cabeçalho desta documentação.
              </>
            ),
            en: (
              <>
                Scroll the page: after 160px scrolling down, <Code>useScrollDirection</Code> hides
                the bar (<Code>translateY(-100%)</Code>, <Code>ease-in-out</Code>); any upward
                scroll brings it back. It’s the same hook as these docs’ header.
              </>
            ),
          }}
          code={HideOnScrollCode}
          align="stretch"
          collapsed
        >
          <HideOnScroll />
        </Example>
      </Section>

      <Section title={{ pt: 'Referência rápida', en: 'Quick reference' }}>
        <TableWrap label={{ pt: 'Padrões de movimento', en: 'Motion patterns' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Padrão', en: 'Pattern' })}</th>
                <th scope="col">{t({ pt: 'Como', en: 'How' })}</th>
                <th scope="col">{t({ pt: 'Tokens', en: 'Tokens' })}</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  [{ pt: 'Pressionar', en: 'Press' }, 'or-press · :active', 'press · fast'],
                  [{ pt: 'Elevar', en: 'Lift' }, 'or-lift', 'distance-lift · medium'],
                  [
                    { pt: 'Seta que empurra', en: 'Nudging arrow' },
                    'or-nudge + or-nudge__icon',
                    'medium · out',
                  ],
                  [{ pt: 'Sublinhado', en: 'Underline' }, 'or-underline', 'medium · out'],
                  [{ pt: 'Indicador', en: 'Indicator' }, 'transform + spring', 'medium · spring'],
                  [
                    { pt: 'Sobreposições', en: 'Overlays' },
                    'usePresence + or-motion-pop | drop | fade',
                    'medium/fast · distance-sm',
                  ],
                  [
                    { pt: 'Expandir/recolher', en: 'Expand/collapse' },
                    'or-collapse + data-state',
                    'slow · out',
                  ],
                  [
                    { pt: 'Status ao vivo', en: 'Live status' },
                    'or-pulse + --_pulse-color',
                    'loop',
                  ],
                  [{ pt: 'Erro', en: 'Error' }, 'or-shake (uma vez)', 'slow · 400ms'],
                  [{ pt: 'Progresso', en: 'Progress' }, 'or-fill-x · transform', 'linear'],
                  [
                    { pt: 'Check e linhas', en: 'Check and lines' },
                    'or-draw + --_draw-length',
                    'bounce/out',
                  ],
                  [
                    { pt: 'Revelação', en: 'Reveal' },
                    'Reveal · useInView',
                    'reveal · distance-lg · stagger',
                  ],
                  [{ pt: 'Números', en: 'Numbers' }, 'useCountUp', '900ms'],
                  [{ pt: 'Cabeçalho', en: 'Header' }, 'useScrollDirection', 'medium · in-out'],
                ] as [Localized<string>, string, string][]
              ).map(([pattern, how, tokens]) => (
                <tr key={how}>
                  <th scope="row">{t(pattern)}</th>
                  <td>
                    <Code>{how}</Code>
                  </td>
                  <td>
                    <span className="guide-mono guide-muted">{tokens}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Section>

      <Section title={{ pt: 'Quando usar', en: 'When to use it' }}>
        <DoDont
          doItems={[
            {
              pt: 'Confirmar uma ação (pressionar, check que se desenha).',
              en: 'Confirm an action (press, a check drawing itself).',
            },
            {
              pt: 'Mostrar origem e destino (menu que desce do botão, drawer que vem da borda).',
              en: 'Show origin and destination (menu dropping from its button, drawer coming from the edge).',
            },
            {
              pt: 'Chamar atenção uma vez para algo novo (erro, toast, conteúdo revelado).',
              en: 'Draw attention once to something new (error, toast, revealed content).',
            },
            {
              pt: 'Indicar que algo está vivo ou carregando — com texto ao lado.',
              en: 'Signal that something is live or loading — with text next to it.',
            },
          ]}
          dontItems={[
            {
              pt: 'Animar texto que a pessoa está lendo ou tabelas que atualizam.',
              en: 'Animate text people are reading or tables that update.',
            },
            {
              pt: (
                <>
                  Animar <Code>width</Code>, <Code>height</Code>, <Code>top</Code> ou{' '}
                  <Code>left</Code> (exceção: <Code>grid-template-rows</Code>).
                </>
              ),
              en: (
                <>
                  Animate <Code>width</Code>, <Code>height</Code>, <Code>top</Code> or{' '}
                  <Code>left</Code> (exception: <Code>grid-template-rows</Code>).
                </>
              ),
            },
            {
              pt: 'Loops infinitos decorativos, parallax ou rolagem automática.',
              en: 'Decorative infinite loops, parallax or auto-scrolling.',
            },
            {
              pt: (
                <>
                  Escrever <Code>300ms</Code> ou <Code>cubic-bezier(…)</Code> soltos: eles não zeram
                  com movimento reduzido.
                </>
              ),
              en: (
                <>
                  Writing loose <Code>300ms</Code> or <Code>cubic-bezier(…)</Code>: they don’t zero
                  out with reduced motion.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento reduzido', en: 'Reduced motion' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Pessoas com distúrbios vestibulares, enxaqueca ou dificuldade de atenção podem
                  pedir menos movimento ao sistema. Com <Code>prefers-reduced-motion: reduce</Code>,
                  o Orange desliga o movimento em quatro camadas:
                </>
              }
              en={
                <>
                  People with vestibular disorders, migraines or attention difficulties can ask
                  their system for less motion. With <Code>prefers-reduced-motion: reduce</Code>,
                  Orange turns motion off in four layers:
                </>
              }
            />
          </p>
        </Prose>
        <p className="guide-live" role="status">
          {t({ pt: 'Seu sistema agora: ', en: 'Your system right now: ' })}
          <strong>
            {reduced
              ? t({ pt: 'movimento reduzido ativo', en: 'reduced motion on' })
              : t({ pt: 'movimento padrão', en: 'standard motion' })}
          </strong>
        </p>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <strong>Tokens:</strong> todas as <Code>--or-duration-*</Code>,{' '}
                  <Code>--or-distance-*</Code> e <Code>--or-stagger</Code> viram zero em{' '}
                  <Code>tokens.css</Code>.
                </>
              ),
              en: (
                <>
                  <strong>Tokens:</strong> every <Code>--or-duration-*</Code>,{' '}
                  <Code>--or-distance-*</Code> and <Code>--or-stagger</Code> becomes zero in{' '}
                  <Code>tokens.css</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Base:</strong> <Code>base.css</Code> encurta qualquer animação ou
                  transição restante para 0.01ms.
                </>
              ),
              en: (
                <>
                  <strong>Base:</strong> <Code>base.css</Code> shortens any remaining animation or
                  transition to 0.01ms.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Utilitários:</strong> <Code>Reveal</Code> mostra tudo imediatamente e{' '}
                  <Code>or-pulse</Code> para.
                </>
              ),
              en: (
                <>
                  <strong>Utilities:</strong> <Code>Reveal</Code> shows everything immediately and{' '}
                  <Code>or-pulse</Code> stops.
                </>
              ),
            },
            {
              pt: (
                <>
                  <strong>Hooks:</strong> <Code>useCountUp</Code> devolve o valor final;{' '}
                  <Code>usePresence</Code> desmonta na hora; use <Code>useReducedMotion()</Code> na
                  sua lógica.
                </>
              ),
              en: (
                <>
                  <strong>Hooks:</strong> <Code>useCountUp</Code> returns the final value;{' '}
                  <Code>usePresence</Code> unmounts at once; use <Code>useReducedMotion()</Code> in
                  your own logic.
                </>
              ),
            },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="Galeria.tsx"
          code={`import { useReducedMotion } from '@orange/ui'

export function Galeria({ slides }: { slides: Slide[] }) {
  const reduzido = useReducedMotion()
  // Sem reprodução automática quando o movimento está reduzido.
  const [tocando, setTocando] = useState(!reduzido)
  // …
}`}
        />
        <Callout tone="info" title={{ pt: 'Como testar', en: 'How to test' }}>
          <p>
            <T
              pt="macOS: Ajustes → Acessibilidade → Tela → Reduzir movimento. Windows: Configurações → Acessibilidade → Efeitos visuais → Efeitos de animação. Chrome DevTools: Rendering → Emulate CSS prefers-reduced-motion."
              en="macOS: Settings → Accessibility → Display → Reduce motion. Windows: Settings → Accessibility → Visual effects → Animation effects. Chrome DevTools: Rendering → Emulate CSS prefers-reduced-motion."
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Regras de implementação', en: 'Implementation rules' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Anime só <Code>transform</Code>, <Code>opacity</Code>, cores, bordas e{' '}
                  <Code>box-shadow</Code>.
                </>
              ),
              en: (
                <>
                  Animate only <Code>transform</Code>, <Code>opacity</Code>, colors, borders and{' '}
                  <Code>box-shadow</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Durações, curvas e distâncias sempre de tokens:{' '}
                  <Code>var(--or-duration-fast) var(--or-ease-out)</Code>.
                </>
              ),
              en: (
                <>
                  Durations, curves and distances always from tokens:{' '}
                  <Code>var(--or-duration-fast) var(--or-ease-out)</Code>.
                </>
              ),
            },
            {
              pt: 'Saída mais curta que a entrada; hover e foco visível com a mesma resposta.',
              en: 'Exit shorter than entrance; hover and visible focus with the same response.',
            },
            {
              pt: 'Movimento nunca é a única pista de estado: sempre há texto, ícone, cor ou atributo ARIA.',
              en: 'Motion is never the only state cue: there is always text, icon, color or an ARIA attribute.',
            },
            {
              pt: (
                <>
                  Teste a saída de componentes com <Code>usePresence</Code> — no jsdom ela desmonta
                  na hora, porque não há animação.
                </>
              ),
              en: (
                <>
                  Test component exits with <Code>usePresence</Code> — in jsdom it unmounts at once,
                  since there is no animation.
                </>
              ),
            },
          ]}
        />
      </Section>
    </DocPage>
  )
}
