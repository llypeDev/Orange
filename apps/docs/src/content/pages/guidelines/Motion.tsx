import { Button, Icon, useReducedMotion } from '@orange/ui'
import { motion } from '@orange/tokens'
import { useState } from 'react'
import { T, useLang, type Localized } from '../../../i18n'
import {
  Bullets,
  Callout,
  Code,
  CodeBlock,
  DefinitionTable,
  DocPage,
  Prose,
  Section,
} from '../../../kit'
import { Cards, TableWrap } from '../_shared/Blocks'

const durationUsage: Record<string, Localized<string>> = {
  instant: {
    pt: 'Mudança de cor ao pressionar, troca de ícone',
    en: 'Press color change, icon swap',
  },
  fast: { pt: 'Hover, foco, tooltips, fechar menus', en: 'Hover, focus, tooltips, closing menus' },
  medium: { pt: 'Abrir popovers, menus, acordeões', en: 'Opening popovers, menus, accordions' },
  slow: { pt: 'Modais, drawers, mudanças de layout', en: 'Modals, drawers, layout changes' },
  slower: {
    pt: 'Entradas de página e ilustrações — raramente',
    en: 'Page entrances and illustrations — rarely',
  },
}

const easingUsage: Record<string, Localized<string>> = {
  out: {
    pt: 'Padrão. Começa rápido e desacelera: elementos que entram.',
    en: 'Default. Starts fast and slows down: entering elements.',
  },
  'in-out': {
    pt: 'Acelera e desacelera: movimentos de A para B na tela.',
    en: 'Speeds up and slows down: moving from A to B on screen.',
  },
  spring: {
    pt: 'Passa um pouco do ponto e volta: micro-feedback, como a seta do botão.',
    en: 'Overshoots slightly and settles: micro-feedback, like the button arrow.',
  },
  snap: {
    pt: 'Desaceleração forte: encaixes, indicadores de aba, sliders.',
    en: 'Strong deceleration: snapping, tab indicators, sliders.',
  },
}

const parseBezier = (value: string) =>
  value
    .replace(/cubic-bezier\(|\)/g, '')
    .split(',')
    .map((n) => Number(n.trim())) as [number, number, number, number]

/** Desenha a curva cúbica de Bézier de uma easing em um quadrado 100×100. */
function CurvePlot({ value }: { value: string }) {
  const [x1, y1, x2, y2] = parseBezier(value)
  const pad = 12
  const size = 100
  const px = (x: number) => pad + x * size
  const py = (y: number) => pad + (1 - y) * size
  return (
    <svg
      className="guide-curve"
      viewBox={`0 0 ${size + pad * 2} ${size + pad * 2}`}
      aria-hidden="true"
    >
      <rect x={pad} y={pad} width={size} height={size} className="guide-curve__frame" />
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

/** Trilho com um quadrado que atravessa ao clicar — usa os tokens, então respeita movimento reduzido. */
function Track({ duration, easing, label }: { duration: string; easing: string; label: string }) {
  const { t } = useLang()
  const [on, setOn] = useState(false)
  return (
    <div className="guide-track">
      <div className="guide-track__rail" aria-hidden="true">
        <span
          className="guide-track__dot"
          data-on={on || undefined}
          style={{
            transitionDuration: `var(--or-duration-${duration})`,
            transitionTimingFunction: `var(--or-ease-${easing})`,
          }}
        />
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

const keyframes: { name: string; usage: Localized<string>; duration: string }[] = [
  {
    name: 'or-fade-in',
    usage: {
      pt: 'Véus e conteúdo que aparece no lugar',
      en: 'Scrims and content appearing in place',
    },
    duration: 'fast',
  },
  {
    name: 'or-pop-in',
    usage: { pt: 'Popovers, menus e tooltips', en: 'Popovers, menus and tooltips' },
    duration: 'medium',
  },
  {
    name: 'or-slide-up',
    usage: { pt: 'Toasts e modais', en: 'Toasts and modals' },
    duration: 'slow',
  },
  {
    name: 'or-slide-in-right',
    usage: { pt: 'Drawer pela direita', en: 'Drawer from the right' },
    duration: 'slow',
  },
  {
    name: 'or-slide-in-left',
    usage: { pt: 'Drawer pela esquerda (menu mobile)', en: 'Drawer from the left (mobile menu)' },
    duration: 'slow',
  },
]

function KeyframeDemo({ name, duration }: { name: string; duration: string }) {
  const { t } = useLang()
  const [run, setRun] = useState(0)
  return (
    <div className="guide-keyframe">
      <div className="guide-keyframe__stage" aria-hidden="true">
        <span
          key={run}
          className="guide-keyframe__box"
          style={{
            animation: run
              ? `${name} var(--or-duration-${duration}) var(--or-ease-out) both`
              : 'none',
          }}
        />
      </div>
      <Button
        size="sm"
        variant="ghost"
        startIcon={<Icon name="refresh" size="sm" />}
        onClick={() => setRun((n) => n + 1)}
      >
        {t({ pt: 'Reproduzir', en: 'Play' })}
        <span className="or-visually-hidden"> {name}</span>
      </Button>
    </div>
  )
}

function DismissDemo() {
  const { t } = useLang()
  const [open, setOpen] = useState(true)
  return (
    <div className="guide-dismiss">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="guide-dismiss-panel"
      >
        {open
          ? t({ pt: 'Fechar painel', en: 'Close panel' })
          : t({ pt: 'Abrir painel', en: 'Open panel' })}
      </Button>
      <div id="guide-dismiss-panel" className="guide-dismiss__panel" data-open={open || undefined}>
        <Icon name="bell" size="sm" />
        {t({ pt: '3 novas notificações', en: '3 new notifications' })}
      </div>
    </div>
  )
}

export default function MotionPage() {
  const { t } = useLang()
  const reduced = useReducedMotion()

  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Movimento', en: 'Motion' }}
      lead={{
        pt: 'Movimento no Orange é curto e funcional: confirma uma ação, mostra de onde algo veio e para onde foi. Cinco durações e quatro curvas cobrem tudo — e todas viram zero quando o sistema pede menos movimento.',
        en: 'Motion in Orange is short and functional: it confirms an action, shows where something came from and where it went. Five durations and four curves cover everything — and all of them drop to zero when the system asks for less motion.',
      }}
    >
      {reduced && (
        <Callout tone="info" title={{ pt: 'Movimento reduzido ativo', en: 'Reduced motion is on' }}>
          <p>
            <T
              pt="Seu sistema pede menos movimento, então as demonstrações abaixo mudam de estado sem animar — exatamente como os componentes se comportam para você."
              en="Your system asks for less motion, so the demos below change state without animating — exactly how the components behave for you."
            />
          </p>
        </Callout>
      )}

      <Section title={{ pt: 'Princípios', en: 'Principles' }}>
        <Cards
          columns={3}
          items={[
            {
              icon: 'zap',
              title: { pt: 'Rápido', en: 'Fast' },
              text: {
                pt: 'A maioria das transições fica entre 160 e 250ms. A interface responde no ritmo de quem usa, sem plateia.',
                en: 'Most transitions sit between 160 and 250ms. The interface keeps pace with the user, no audience needed.',
              },
            },
            {
              icon: 'arrow-right',
              title: { pt: 'Funcional', en: 'Functional' },
              text: {
                pt: 'Cada animação explica algo: relação espacial, mudança de estado ou confirmação. Se não explica nada, sai.',
                en: 'Every animation explains something: spatial relationship, state change or confirmation. If it explains nothing, it goes.',
              },
            },
            {
              icon: 'pause',
              title: { pt: 'Sem bloquear', en: 'Non-blocking' },
              text: {
                pt: 'Ninguém espera uma animação terminar para agir. Elementos são interativos desde o primeiro quadro.',
                en: 'Nobody waits for an animation to finish before acting. Elements are interactive from the first frame.',
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
                  Clique em ▶ para ver cada duração com a curva <Code>--or-ease-out</Code>. Quanto
                  maior a distância percorrida ou a área que muda, maior a duração — mas quase nunca
                  acima de 400ms.
                </>
              }
              en={
                <>
                  Click ▶ to see each duration with the <Code>--or-ease-out</Code> curve. The larger
                  the distance or the area that changes, the longer the duration — but almost never
                  above 400ms.
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
                  <td>{t(durationUsage[name])}</td>
                  <td>
                    <Track duration={name} easing="out" label={`--or-duration-${name}`} />
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
                  As curvas usam <Code>--or-duration-slow</Code> nas demonstrações para a diferença
                  ficar visível. Os quadrados laranja são os pontos de controle da curva de Bézier.
                </>
              }
              en={
                <>
                  The demos use <Code>--or-duration-slow</Code> so the difference is visible. The
                  orange squares are the Bézier curve control points.
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
                <span className="guide-easings__usage">{t(easingUsage[name])}</span>
                <Track duration="slow" easing={name} label={`--or-ease-${name}`} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={{ pt: 'Quando animar', en: 'When to animate' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Feedback', en: 'Feedback' },
              description: {
                pt: (
                  <>
                    Hover, foco e pressionar: só cor, borda e sombra, em <Code>fast</Code> ou{' '}
                    <Code>instant</Code>. Nunca mexa no tamanho do elemento.
                  </>
                ),
                en: (
                  <>
                    Hover, focus and press: color, border and shadow only, at <Code>fast</Code> or{' '}
                    <Code>instant</Code>. Never change the element size.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Entrar', en: 'Entering' },
              description: {
                pt: (
                  <>
                    Overlays entram com <Code>or-pop-in</Code> ou <Code>or-slide-up</Code> em{' '}
                    <Code>medium</Code>/<Code>slow</Code> e <Code>ease-out</Code>, a partir de onde
                    foram acionados.
                  </>
                ),
                en: (
                  <>
                    Overlays enter with <Code>or-pop-in</Code> or <Code>or-slide-up</Code> at{' '}
                    <Code>medium</Code>/<Code>slow</Code> with <Code>ease-out</Code>, from where
                    they were triggered.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Sair', en: 'Leaving' },
              description: {
                pt: (
                  <>
                    Saídas são mais rápidas que entradas (<Code>fast</Code>): a pessoa já decidiu,
                    não faça esperar.
                  </>
                ),
                en: (
                  <>
                    Exits are faster than entrances (<Code>fast</Code>): the person already decided,
                    don’t make them wait.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Mover', en: 'Moving' },
              description: {
                pt: (
                  <>
                    Indicadores de aba e reordenação usam <Code>ease-in-out</Code> ou{' '}
                    <Code>snap</Code> e animam <Code>transform</Code>, nunca <Code>top</Code>/
                    <Code>left</Code>.
                  </>
                ),
                en: (
                  <>
                    Tab indicators and reordering use <Code>ease-in-out</Code> or <Code>snap</Code>{' '}
                    and animate <Code>transform</Code>, never <Code>top</Code>/<Code>left</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Carregar', en: 'Loading' },
              description: {
                pt: (
                  <>
                    Spinners (<Code>or-spin</Code>) e skeletons (<Code>or-shimmer</Code>) são os
                    únicos loops permitidos — e somem quando o conteúdo chega.
                  </>
                ),
                en: (
                  <>
                    Spinners (<Code>or-spin</Code>) and skeletons (<Code>or-shimmer</Code>) are the
                    only loops allowed — and they disappear when content arrives.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Não animar', en: 'Do not animate' },
              description: {
                pt: 'Texto que a pessoa está lendo, tabelas que atualizam, mudanças de rota inteiras e qualquer coisa que dispare sozinha em loop.',
                en: 'Text being read, updating tables, entire route changes and anything that loops on its own.',
              },
            },
          ]}
        />
        <div className="guide-split">
          <div className="guide-panel">
            <p className="or-eyebrow">
              {t({ pt: 'Entra devagar, sai rápido', en: 'Enter slow, leave fast' })}
            </p>
            <DismissDemo />
          </div>
          <div className="guide-panel">
            <p className="or-eyebrow">
              {t({ pt: 'Micro-feedback com spring', en: 'Micro-feedback with spring' })}
            </p>
            <div className="guide-row">
              <Button endIcon={<Icon name="arrow-right" />}>
                {t({ pt: 'Passe o mouse', en: 'Hover me' })}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section title={{ pt: 'Animações prontas', en: 'Built-in keyframes' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  O <Code>base.css</Code> define keyframes compartilhados, usados pelos componentes
                  de sobreposição. Combine-os com os tokens de duração e curva.
                </>
              }
              en={
                <>
                  <Code>base.css</Code> defines shared keyframes used by the overlay components.
                  Pair them with the duration and easing tokens.
                </>
              }
            />
          </p>
        </Prose>
        <ul className="guide-keyframes">
          {keyframes.map((k) => (
            <li key={k.name}>
              <KeyframeDemo name={k.name} duration={k.duration} />
              <Code>{k.name}</Code>
              <span className="guide-muted guide-keyframes__usage">{t(k.usage)}</span>
            </li>
          ))}
        </ul>
        <CodeBlock
          language="css"
          title="popover.css"
          code={`.meu-popover[data-state='open'] {
  animation: or-pop-in var(--or-duration-medium) var(--or-ease-out);
}

.meu-drawer[data-state='open'] {
  animation: or-slide-in-right var(--or-duration-slow) var(--or-ease-out);
}`}
        />
      </Section>

      <Section title={{ pt: 'Movimento reduzido', en: 'Reduced motion' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Pessoas com distúrbios vestibulares, enxaqueca ou dificuldade de atenção podem
                  pedir menos movimento no sistema operacional. O Orange respeita isso em três
                  camadas: os tokens de duração viram <Code>0ms</Code>, o <Code>base.css</Code>{' '}
                  encurta qualquer animação restante e <Code>useReducedMotion()</Code> expõe a
                  preferência para JavaScript.
                </>
              }
              en={
                <>
                  People with vestibular disorders, migraines or attention difficulties may ask
                  their OS for less motion. Orange respects it in three layers: duration tokens
                  become <Code>0ms</Code>, <Code>base.css</Code> shortens any remaining animation
                  and <Code>useReducedMotion()</Code> exposes the preference to JavaScript.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="tsx"
          title="Contador.tsx"
          code={`import { useReducedMotion } from '@orange/ui'

export function Contador({ valor }: { valor: number }) {
  const reduzido = useReducedMotion()
  // Com movimento reduzido, mostra o valor final direto, sem contagem animada.
  const exibido = useContagemAnimada(valor, { desligado: reduzido })
  return <span>{exibido.toLocaleString('pt-BR')}</span>
}`}
        />
        <Bullets
          items={[
            {
              pt: (
                <>
                  Sempre use <Code>var(--or-duration-*)</Code> em transições; uma duração escrita à
                  mão (<Code>300ms</Code>) não é zerada pelos tokens.
                </>
              ),
              en: (
                <>
                  Always use <Code>var(--or-duration-*)</Code> in transitions; a hand-written
                  duration (<Code>300ms</Code>) is not zeroed by the tokens.
                </>
              ),
            },
            {
              pt: 'Com movimento reduzido, troque deslizamentos e zoom por fade ou corte seco. O estado final precisa ser o mesmo.',
              en: 'With reduced motion, swap slides and zooms for a fade or a hard cut. The end state must be the same.',
            },
            {
              pt: 'Nada de parallax, rolagem automática ou vídeo em autoplay sem controle de pausa (2.2.2).',
              en: 'No parallax, auto-scrolling or autoplay video without a pause control (2.2.2).',
            },
            {
              pt: 'Teste ativando a preferência: macOS (Acessibilidade → Tela → Reduzir movimento), Windows (Efeitos de animação) ou DevTools (Rendering → prefers-reduced-motion).',
              en: 'Test by turning the preference on: macOS (Accessibility → Display → Reduce motion), Windows (Animation effects) or DevTools (Rendering → prefers-reduced-motion).',
            },
          ]}
        />
      </Section>
    </DocPage>
  )
}
