import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import {
  Callout,
  Code,
  CodeBlock,
  DocPage,
  Example,
  PropsTable,
  Prose,
  Section,
  type PropRow,
} from '../../../kit'
import { SubHeading } from '../_shared/Blocks'
import UseClipboard from './examples/UseClipboard'
import UseClipboardCode from './examples/UseClipboard?raw'
import UseCountUp from './examples/UseCountUp'
import UseCountUpCode from './examples/UseCountUp?raw'
import UseInView from './examples/UseInView'
import UseInViewCode from './examples/UseInView?raw'
import UsePresence from './examples/UsePresence'
import UsePresenceCode from './examples/UsePresence?raw'
import UseScrollDirection from './examples/UseScrollDirection'
import UseScrollDirectionCode from './examples/UseScrollDirection?raw'
import UseControllableState from './examples/UseControllableState'
import UseControllableStateCode from './examples/UseControllableState?raw'
import UseDebouncedValue from './examples/UseDebouncedValue'
import UseDebouncedValueCode from './examples/UseDebouncedValue?raw'
import UseDisclosure from './examples/UseDisclosure'
import UseDisclosureCode from './examples/UseDisclosure?raw'
import UseEventListener from './examples/UseEventListener'
import UseEventListenerCode from './examples/UseEventListener?raw'
import UseFocusTrap from './examples/UseFocusTrap'
import UseFocusTrapCode from './examples/UseFocusTrap?raw'
import UseId from './examples/UseId'
import UseIdCode from './examples/UseId?raw'
import UseMediaQuery from './examples/UseMediaQuery'
import UseMediaQueryCode from './examples/UseMediaQuery?raw'
import UsePrevious from './examples/UsePrevious'
import UsePreviousCode from './examples/UsePrevious?raw'
import UseRovingFocus from './examples/UseRovingFocus'
import UseRovingFocusCode from './examples/UseRovingFocus?raw'

interface HookDocProps {
  name: string
  signature: string
  description: Localized<ReactNode>
  params?: PropRow[]
  returns?: Localized<ReactNode>
  example?: { node: ReactNode; code: string; description?: Localized<ReactNode> }
  usage?: string
}

function HookDoc({ name, signature, description, params, returns, example, usage }: HookDocProps) {
  const { t } = useLang()
  return (
    <div className="guide-hook">
      <SubHeading title={name} id={name.toLowerCase()} />
      <div className="doc-prose">
        <p>{t(description)}</p>
      </div>
      <CodeBlock code={signature} language="ts" title={t({ pt: 'assinatura', en: 'signature' })} />
      {params && params.length > 0 && (
        <PropsTable
          rows={params}
          caption={{ pt: `Parâmetros de ${name}`, en: `${name} parameters` }}
        />
      )}
      {returns && (
        <p className="guide-hook__returns">
          <span className="or-eyebrow">{t({ pt: 'Retorna', en: 'Returns' })}</span>{' '}
          {/* Um único span: o <p> é flex, e cada nó de texto/<Code> solto viraria um item
              separado com gap — a frase se desmancharia (inclusive antes das vírgulas). */}
          <span className="guide-hook__returns-text">{t(returns)}</span>
        </p>
      )}
      {usage && <CodeBlock code={usage} language="tsx" title={t({ pt: 'uso', en: 'usage' })} />}
      {example && (
        <Example description={example.description} code={example.code} align="stretch" collapsed>
          {example.node}
        </Example>
      )}
    </div>
  )
}

export default function HooksPage() {
  const { to } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: 'Usando', en: 'Usage' }}
      title="Hooks"
      lead={{
        pt: 'Os mesmos hooks que constroem os componentes do Orange, exportados para você: estado controlado, foco, teclado, eventos e ambiente. Todos são seguros para SSR e tipados.',
        en: 'The same hooks that build Orange’s components, exported for you: controlled state, focus, keyboard, events and environment. All of them are SSR-safe and typed.',
      }}
    >
      <Section title={{ pt: 'Visão geral', en: 'Overview' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Importe de <Code>@orangesys/ui</Code>. Os exemplos abaixo rodam ao vivo — abra o
                  código de cada um para copiar. <Code>useTheme</Code> e <Code>useLocale</Code>{' '}
                  estão em <Link to={to('/usage/theme')}>Tema</Link> e{' '}
                  <Link to={to('/usage/i18n')}>Internacionalização</Link>.
                </>
              }
              en={
                <>
                  Import from <Code>@orangesys/ui</Code>. The examples below run live — open each one’s
                  code to copy it. <Code>useTheme</Code> and <Code>useLocale</Code> are covered in{' '}
                  <Link to={to('/usage/theme')}>Theme</Link> and{' '}
                  <Link to={to('/usage/i18n')}>Internationalization</Link>.
                </>
              }
            />
          </p>
        </Prose>
        <div className="doc-table-wrap">
          <table className="doc-table guide-hook-index">
            <tbody>
              {(
                [
                  [
                    { pt: 'Estado', en: 'State' },
                    ['useControllableState', 'useDisclosure', 'useDebouncedValue', 'usePrevious'],
                  ],
                  [
                    { pt: 'Foco e teclado', en: 'Focus and keyboard' },
                    ['useFocusTrap', 'useRovingFocus', 'useEscapeKey'],
                  ],
                  [
                    { pt: 'Eventos', en: 'Events' },
                    ['useEventListener', 'useClickOutside', 'useClipboard'],
                  ],
                  [
                    { pt: 'Movimento', en: 'Motion' },
                    ['usePresence', 'useInView', 'useCountUp', 'useScrollDirection'],
                  ],
                  [
                    { pt: 'Ambiente e SSR', en: 'Environment and SSR' },
                    [
                      'useMediaQuery',
                      'useReducedMotion',
                      'useLockBodyScroll',
                      'useMounted',
                      'useIsomorphicLayoutEffect',
                      'useId',
                    ],
                  ],
                ] as [Localized<string>, string[]][]
              ).map(([group, names]) => (
                <HookIndexRow key={group.en} group={group} names={names} />
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={{ pt: 'Estado', en: 'State' }}>
        <HookDoc
          name="useControllableState"
          signature={`function useControllableState<T>(options: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, (next: T | ((prev: T) => T)) => void]`}
          description={{
            pt: (
              <>
                Base do padrão <Code>value</Code> / <Code>defaultValue</Code> /{' '}
                <Code>onChange</Code> de todos os componentes. Se <Code>value</Code> vier definido,
                o estado é controlado pelo pai; senão, fica interno. O setter aceita valor ou função
                e só chama <Code>onChange</Code> quando o valor muda de fato.
              </>
            ),
            en: (
              <>
                The foundation of the <Code>value</Code> / <Code>defaultValue</Code> /{' '}
                <Code>onChange</Code> pattern in every component. When <Code>value</Code> is
                defined, the parent controls the state; otherwise it is internal. The setter takes a
                value or a function and only calls <Code>onChange</Code> when the value actually
                changes.
              </>
            ),
          }}
          params={[
            {
              name: 'value',
              type: 'T',
              description: {
                pt: 'Valor controlado. undefined = não controlado.',
                en: 'Controlled value. undefined = uncontrolled.',
              },
            },
            {
              name: 'defaultValue',
              type: 'T',
              required: true,
              description: {
                pt: 'Valor inicial quando não controlado.',
                en: 'Initial value when uncontrolled.',
              },
            },
            {
              name: 'onChange',
              type: '(value: T) => void',
              description: {
                pt: 'Chamado a cada mudança, nos dois modos.',
                en: 'Called on every change, in both modes.',
              },
            },
          ]}
          returns={{
            pt: 'Uma tupla [valor, setValor], como useState.',
            en: 'A [value, setValue] tuple, like useState.',
          }}
          example={{
            node: <UseControllableState />,
            code: UseControllableStateCode,
            description: {
              pt: 'Um seletor de quantidade que funciona controlado e não controlado.',
              en: 'A quantity stepper that works both controlled and uncontrolled.',
            },
          }}
        />
        <HookDoc
          name="useDisclosure"
          signature={`function useDisclosure(options?: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}): { isOpen: boolean; open(): void; close(): void; toggle(): void; setOpen(open: boolean): void }`}
          description={{
            pt: (
              <>
                Estado abre/fecha para modais, menus, drawers e painéis — com o mesmo contrato{' '}
                <Code>open</Code> / <Code>defaultOpen</Code> / <Code>onOpenChange</Code> dos
                componentes. As funções retornadas são estáveis entre renderizações.
              </>
            ),
            en: (
              <>
                Open/close state for modals, menus, drawers and panels — with the same{' '}
                <Code>open</Code> / <Code>defaultOpen</Code> / <Code>onOpenChange</Code> contract as
                the components. Returned functions are stable across renders.
              </>
            ),
          }}
          example={{
            node: <UseDisclosure />,
            code: UseDisclosureCode,
            description: {
              pt: 'Lembre de ligar o botão ao painel com aria-expanded e aria-controls.',
              en: 'Remember to wire the button to the panel with aria-expanded and aria-controls.',
            },
          }}
        />
        <HookDoc
          name="useDebouncedValue"
          signature="function useDebouncedValue<T>(value: T, delay?: number /* 300 */): T"
          description={{
            pt: 'Devolve o valor só depois de delay milissegundos sem mudanças. Ideal para buscas e filtros que disparam requisições ou cálculos pesados.',
            en: 'Returns the value only after delay milliseconds without changes. Ideal for searches and filters that trigger requests or heavy work.',
          }}
          example={{ node: <UseDebouncedValue />, code: UseDebouncedValueCode }}
        />
        <HookDoc
          name="usePrevious"
          signature="function usePrevious<T>(value: T): T | undefined"
          description={{
            pt: 'Guarda o valor da renderização anterior — útil para mostrar variações, animar diferenças ou comparar props. É undefined na primeira renderização.',
            en: 'Keeps the value from the previous render — useful for showing deltas, animating differences or comparing props. It is undefined on the first render.',
          }}
          example={{ node: <UsePrevious />, code: UsePreviousCode }}
        />
      </Section>

      <Section title={{ pt: 'Foco e teclado', en: 'Focus and keyboard' }}>
        <HookDoc
          name="useFocusTrap"
          signature={`function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  options?: { initialFocus?: RefObject<HTMLElement | null>; restoreFocus?: boolean /* true */ },
): void`}
          description={{
            pt: (
              <>
                Enquanto <Code>active</Code> for verdadeiro, <Code>Tab</Code> e{' '}
                <Code>Shift+Tab</Code> circulam dentro de <Code>ref</Code>. Ao ativar, foca o
                primeiro elemento focável (ou <Code>initialFocus</Code>); ao desativar, devolve o
                foco para quem estava focado antes. Combine com <Code>useEscapeKey</Code> e{' '}
                <Code>useClickOutside</Code>.
              </>
            ),
            en: (
              <>
                While <Code>active</Code> is true, <Code>Tab</Code> and <Code>Shift+Tab</Code> cycle
                inside <Code>ref</Code>. On activation it focuses the first focusable element (or{' '}
                <Code>initialFocus</Code>); on deactivation it returns focus to whatever was focused
                before. Pair it with <Code>useEscapeKey</Code> and <Code>useClickOutside</Code>.
              </>
            ),
          }}
          params={[
            {
              name: 'ref',
              type: 'RefObject<HTMLElement | null>',
              required: true,
              description: {
                pt: 'Contêiner que prende o foco.',
                en: 'Container that traps focus.',
              },
            },
            {
              name: 'active',
              type: 'boolean',
              required: true,
              description: { pt: 'Liga e desliga a armadilha.', en: 'Turns the trap on and off.' },
            },
            {
              name: 'options.initialFocus',
              type: 'RefObject<HTMLElement | null>',
              description: {
                pt: 'Elemento que recebe o foco ao abrir.',
                en: 'Element that receives focus on open.',
              },
            },
            {
              name: 'options.restoreFocus',
              type: 'boolean',
              default: 'true',
              description: { pt: 'Devolve o foco ao fechar.', en: 'Returns focus on close.' },
            },
          ]}
          example={{
            node: <UseFocusTrap />,
            code: UseFocusTrapCode,
            description: {
              pt: 'Abra a confirmação e tente sair com Tab: o foco fica preso até Cancelar, Excluir, Esc ou um clique fora.',
              en: 'Open the confirmation and try to Tab out: focus stays trapped until Cancel, Delete, Esc or a click outside.',
            },
          }}
        />
        <HookDoc
          name="useRovingFocus"
          signature={`function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  options?: { orientation?: 'horizontal' | 'vertical' | 'both'; loop?: boolean; selector?: string },
): (event: React.KeyboardEvent) => void`}
          description={{
            pt: (
              <>
                Implementa o <em>roving tabindex</em> do WAI-ARIA: só um item do grupo fica no{' '}
                <Code>Tab</Code>; as setas, <Code>Home</Code> e <Code>End</Code> movem entre os
                itens marcados com <Code>data-roving-item</Code>. Devolva o handler no{' '}
                <Code>onKeyDown</Code> do contêiner.
              </>
            ),
            en: (
              <>
                Implements the WAI-ARIA <em>roving tabindex</em>: only one item of the group is in
                the <Code>Tab</Code> order; arrows, <Code>Home</Code> and <Code>End</Code> move
                between items marked with <Code>data-roving-item</Code>. Pass the handler to the
                container’s <Code>onKeyDown</Code>.
              </>
            ),
          }}
          params={[
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical' | 'both'",
              default: "'horizontal'",
              description: { pt: 'Quais setas navegam.', en: 'Which arrows navigate.' },
            },
            {
              name: 'loop',
              type: 'boolean',
              default: 'true',
              description: { pt: 'Do último volta ao primeiro.', en: 'Wraps from last to first.' },
            },
            {
              name: 'selector',
              type: 'string',
              default: "'[data-roving-item]:not([disabled])'",
              description: {
                pt: 'Seletor dos itens navegáveis.',
                en: 'Selector for navigable items.',
              },
            },
          ]}
          example={{
            node: <UseRovingFocus />,
            code: UseRovingFocusCode,
            description: {
              pt: 'Use Tab para entrar na barra e as setas ←/→ para trocar de item.',
              en: 'Use Tab to enter the toolbar and ←/→ to move between items.',
            },
          }}
        />
        <HookDoc
          name="useEscapeKey"
          signature="function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled?: boolean /* true */): void"
          description={{
            pt: 'Chama handler quando Escape é pressionado em qualquer lugar do documento, enquanto enabled for verdadeiro. Desligue-o quando a sobreposição estiver fechada.',
            en: 'Calls handler when Escape is pressed anywhere in the document, while enabled is true. Turn it off when the overlay is closed.',
          }}
          usage={`useEscapeKey(() => setAberto(false), aberto)`}
        />
      </Section>

      <Section title={{ pt: 'Eventos', en: 'Events' }}>
        <HookDoc
          name="useEventListener"
          signature={`function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: Window | Document | HTMLElement | null, // padrão: window
  options?: AddEventListenerOptions,
): void`}
          description={{
            pt: 'Adiciona um listener tipado e o remove ao desmontar. O handler mais recente é sempre usado, sem recriar o listener a cada renderização.',
            en: 'Adds a typed listener and removes it on unmount. The latest handler is always used, without re-adding the listener on every render.',
          }}
          example={{
            node: <UseEventListener />,
            code: UseEventListenerCode,
            description: {
              pt: 'Role a página ou redimensione a janela.',
              en: 'Scroll the page or resize the window.',
            },
          }}
        />
        <HookDoc
          name="useClickOutside"
          signature={`function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: (event: PointerEvent) => void,
  enabled?: boolean, // true
): void`}
          description={{
            pt: (
              <>
                Chama <Code>handler</Code> em um <Code>pointerdown</Code> fora de todos os elementos
                informados. Passe o gatilho e o painel juntos para que clicar no botão de novo não
                feche e reabra o menu.
              </>
            ),
            en: (
              <>
                Calls <Code>handler</Code> on a <Code>pointerdown</Code> outside all given elements.
                Pass the trigger and the panel together so clicking the button again doesn’t close
                and reopen the menu.
              </>
            ),
          }}
          usage={`useClickOutside([gatilhoRef, menuRef], () => setAberto(false), aberto)`}
        />
        <HookDoc
          name="useClipboard"
          signature="function useClipboard(timeout?: number /* 2000 */): { copy(text: string): Promise<boolean>; copied: boolean }"
          description={{
            pt: (
              <>
                Copia texto com a Clipboard API (com fallback para navegadores antigos) e mantém{' '}
                <Code>copied</Code> verdadeiro por <Code>timeout</Code> ms. Anuncie o resultado numa
                região <Code>role="status"</Code>.
              </>
            ),
            en: (
              <>
                Copies text with the Clipboard API (with a fallback for old browsers) and keeps{' '}
                <Code>copied</Code> true for <Code>timeout</Code> ms. Announce the result in a{' '}
                <Code>role="status"</Code> region.
              </>
            ),
          }}
          example={{ node: <UseClipboard />, code: UseClipboardCode }}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Hooks do sistema de movimento. Todos respeitam <Code>prefers-reduced-motion</Code>{' '}
                  e são seguros para SSR. Os padrões visuais estão em{' '}
                  <Link to={to('/design-guidelines/motion')}>Movimento</Link>.
                </>
              }
              en={
                <>
                  Hooks from the motion system. All of them respect{' '}
                  <Code>prefers-reduced-motion</Code> and are SSR-safe. The visual patterns are in{' '}
                  <Link to={to('/design-guidelines/motion')}>Motion</Link>.
                </>
              }
            />
          </p>
        </Prose>
        <HookDoc
          name="usePresence"
          signature={`function usePresence<T extends HTMLElement = HTMLElement>(
  open: boolean,
  options?: { timeout?: number /* 1000 */ },
): { present: boolean; state: 'open' | 'closed'; nodeRef: RefObject<T | null> }`}
          description={{
            pt: (
              <>
                Mantém um elemento montado enquanto a animação de saída roda. <Code>state</Code>{' '}
                vira <Code>closed</Code> assim que <Code>open</Code> fica falso;{' '}
                <Code>present</Code> só vira falso no <Code>animationend</Code>/
                <Code>transitionend</Code> do elemento ligado a <Code>nodeRef</Code> (ou após{' '}
                <Code>timeout</Code>). Sem animação — jsdom, CSS ausente, movimento reduzido —
                desmonta na hora.
              </>
            ),
            en: (
              <>
                Keeps an element mounted while its exit animation runs. <Code>state</Code> becomes{' '}
                <Code>closed</Code> as soon as <Code>open</Code> turns false; <Code>present</Code>{' '}
                only turns false on the <Code>animationend</Code>/<Code>transitionend</Code> of the
                element bound to <Code>nodeRef</Code> (or after <Code>timeout</Code>). Without
                animation — jsdom, missing CSS, reduced motion — it unmounts right away.
              </>
            ),
          }}
          params={[
            {
              name: 'open',
              type: 'boolean',
              required: true,
              description: {
                pt: 'Se o elemento deve estar aberto.',
                en: 'Whether the element should be open.',
              },
            },
            {
              name: 'options.timeout',
              type: 'number',
              default: '1000',
              description: {
                pt: 'Limite (ms) para desmontar caso o evento de fim não chegue.',
                en: 'Limit (ms) to unmount if the end event never arrives.',
              },
            },
          ]}
          returns={{
            pt: (
              <>
                <Code>present</Code> (renderizar?), <Code>state</Code> (use em{' '}
                <Code>data-state</Code> com <Code>or-motion-pop</Code>, <Code>-drop</Code> ou{' '}
                <Code>-fade</Code>) e <Code>nodeRef</Code> (ligue ao elemento animado).
              </>
            ),
            en: (
              <>
                <Code>present</Code> (render?), <Code>state</Code> (use on <Code>data-state</Code>{' '}
                with <Code>or-motion-pop</Code>, <Code>-drop</Code> or <Code>-fade</Code>) and{' '}
                <Code>nodeRef</Code> (bind to the animated element).
              </>
            ),
          }}
          example={{
            node: <UsePresence />,
            code: UsePresenceCode,
            description: {
              pt: 'Observe present continuar true por 160ms depois de esconder: é a saída rodando.',
              en: 'Watch present stay true for 160ms after hiding: that is the exit running.',
            },
          }}
        />
        <HookDoc
          name="useInView"
          signature={`function useInView<T extends Element = HTMLElement>(options?: {
  rootMargin?: string        // '0px 0px -60px 0px'
  threshold?: number | number[] // 0.08
  once?: boolean             // true
  root?: Element | null      // null (viewport)
}): [ref: RefCallback<T>, inView: boolean]`}
          description={{
            pt: (
              <>
                Diz se o elemento está na área visível, com <Code>IntersectionObserver</Code>. Por
                padrão dispara uma vez — ideal para revelações no scroll e para iniciar{' '}
                <Code>useCountUp</Code>. Sem suporte ao observer, devolve <Code>true</Code>. É o
                hook por trás do componente <Code>Reveal</Code>.
              </>
            ),
            en: (
              <>
                Tells whether the element is in view, using <Code>IntersectionObserver</Code>. By
                default it fires once — ideal for scroll reveals and for starting{' '}
                <Code>useCountUp</Code>. Without observer support it returns <Code>true</Code>. It
                is the hook behind the <Code>Reveal</Code> component.
              </>
            ),
          }}
          params={[
            {
              name: 'rootMargin',
              type: 'string',
              default: "'0px 0px -60px 0px'",
              description: {
                pt: 'Margem da área observada (negativa = dispara um pouco depois de entrar).',
                en: 'Margin of the observed area (negative = fires a little after entering).',
              },
            },
            {
              name: 'threshold',
              type: 'number | number[]',
              default: '0.08',
              description: { pt: 'Fração visível necessária.', en: 'Visible fraction required.' },
            },
            {
              name: 'once',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Para de observar após a primeira entrada.',
                en: 'Stops observing after the first entry.',
              },
            },
            {
              name: 'root',
              type: 'Element | null',
              default: 'null',
              description: {
                pt: 'Contêiner de rolagem (null = viewport).',
                en: 'Scroll container (null = viewport).',
              },
            },
          ]}
          returns={{
            pt: 'Uma tupla [ref, inView]: passe ref ao elemento observado.',
            en: 'A [ref, inView] tuple: pass ref to the observed element.',
          }}
          example={{
            node: <UseInView />,
            code: UseInViewCode,
            description: {
              pt: 'Com once: false, cada linha alterna entre “na tela” e “fora da tela”.',
              en: 'With once: false, each row toggles between “na tela” (in view) and “fora da tela” (out of view).',
            },
          }}
        />
        <HookDoc
          name="useCountUp"
          signature={`function useCountUp(
  target: number,
  options?: { duration?: number /* 900 */; from?: number /* 0 */; enabled?: boolean /* true */ },
): number`}
          description={{
            pt: (
              <>
                Anima um número de <Code>from</Code> até <Code>target</Code> com desaceleração
                cúbica, via <Code>requestAnimationFrame</Code>. Com movimento reduzido ou{' '}
                <Code>enabled=false</Code>, devolve o valor final. O retorno é fracionário: formate
                com <Code>toLocaleString</Code> ou <Code>Math.round</Code>.
              </>
            ),
            en: (
              <>
                Animates a number from <Code>from</Code> to <Code>target</Code> with cubic
                deceleration, via <Code>requestAnimationFrame</Code>. With reduced motion or{' '}
                <Code>enabled=false</Code>, it returns the final value. The return value is
                fractional: format it with <Code>toLocaleString</Code> or <Code>Math.round</Code>.
              </>
            ),
          }}
          params={[
            {
              name: 'target',
              type: 'number',
              required: true,
              description: { pt: 'Valor final.', en: 'Final value.' },
            },
            {
              name: 'duration',
              type: 'number',
              default: '900',
              description: { pt: 'Duração em ms.', en: 'Duration in ms.' },
            },
            {
              name: 'from',
              type: 'number',
              default: '0',
              description: {
                pt: 'Valor inicial de cada contagem.',
                en: 'Starting value of each count.',
              },
            },
            {
              name: 'enabled',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Liga a animação (ex.: quando useInView fica true).',
                en: 'Turns the animation on (e.g. when useInView becomes true).',
              },
            },
          ]}
          returns={{ pt: 'O valor atual da contagem.', en: 'The current count value.' }}
          example={{ node: <UseCountUp />, code: UseCountUpCode }}
        />
        <HookDoc
          name="useScrollDirection"
          signature={`function useScrollDirection(options?: {
  threshold?: number  // 120 — px a partir do topo
  tolerance?: number  // 6 — px mínimos de variação
}): { direction: 'up' | 'down'; pastThreshold: boolean }`}
          description={{
            pt: (
              <>
                Direção da rolagem da página e se ela já passou de <Code>threshold</Code>. Ignora
                variações menores que <Code>tolerance</Code> e agrupa leituras com{' '}
                <Code>requestAnimationFrame</Code>. Use para esconder o cabeçalho ao rolar para
                baixo — como o desta documentação.
              </>
            ),
            en: (
              <>
                Page scroll direction and whether it is past <Code>threshold</Code>. It ignores
                changes smaller than <Code>tolerance</Code> and batches reads with{' '}
                <Code>requestAnimationFrame</Code>. Use it to hide the header when scrolling down —
                like these docs’ header.
              </>
            ),
          }}
          params={[
            {
              name: 'threshold',
              type: 'number',
              default: '120',
              description: {
                pt: 'Distância do topo a partir da qual pastThreshold vira true.',
                en: 'Distance from the top after which pastThreshold becomes true.',
              },
            },
            {
              name: 'tolerance',
              type: 'number',
              default: '6',
              description: {
                pt: 'Variação mínima para trocar a direção.',
                en: 'Minimum change to flip the direction.',
              },
            },
          ]}
          returns={{
            pt: '{ direction, pastThreshold } — esconda quando direction for down e pastThreshold for true.',
            en: '{ direction, pastThreshold } — hide when direction is down and pastThreshold is true.',
          }}
          usage={`const { direction, pastThreshold } = useScrollDirection({ threshold: 160 })
const escondido = direction === 'down' && pastThreshold

return <header data-hidden={escondido || undefined} className="cabecalho">…</header>

/* cabecalho.css */
.cabecalho { transition: transform var(--or-duration-medium) var(--or-ease-in-out); }
.cabecalho[data-hidden] { transform: translateY(-100%); }`}
          example={{
            node: <UseScrollDirection />,
            code: UseScrollDirectionCode,
            description: {
              pt: 'Role a página para cima e para baixo e veja os valores mudarem.',
              en: 'Scroll the page up and down and watch the values change.',
            },
          }}
        />
      </Section>

      <Section title={{ pt: 'Ambiente e SSR', en: 'Environment and SSR' }}>
        <HookDoc
          name="useMediaQuery"
          signature="function useMediaQuery(query: string, defaultValue?: boolean /* false */): boolean"
          description={{
            pt: (
              <>
                Retorna se a media query corresponde e reage a mudanças. No servidor devolve{' '}
                <Code>defaultValue</Code>. Para breakpoints, use os valores de{' '}
                <Code>breakpoints</Code> de <Code>@orangesys/tokens</Code>.
              </>
            ),
            en: (
              <>
                Returns whether the media query matches and reacts to changes. On the server it
                returns <Code>defaultValue</Code>. For breakpoints, use the values from{' '}
                <Code>breakpoints</Code> in <Code>@orangesys/tokens</Code>.
              </>
            ),
          }}
          example={{ node: <UseMediaQuery />, code: UseMediaQueryCode }}
        />
        <HookDoc
          name="useReducedMotion"
          signature="function useReducedMotion(): boolean"
          description={{
            pt: (
              <>
                Atalho para <Code>useMediaQuery</Code> com{' '}
                <Code>(prefers-reduced-motion: reduce)</Code>. Use para desligar animações feitas em
                JavaScript; as de CSS já são zeradas pelos tokens.
              </>
            ),
            en: (
              <>
                Shortcut for <Code>useMediaQuery</Code> with{' '}
                <Code>(prefers-reduced-motion: reduce)</Code>. Use it to turn off JavaScript-driven
                animations; CSS ones are already zeroed by the tokens.
              </>
            ),
          }}
          usage={`const reduzido = useReducedMotion()
lista.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth' })`}
        />
        <HookDoc
          name="useLockBodyScroll"
          signature="function useLockBodyScroll(locked: boolean): void"
          description={{
            pt: 'Trava a rolagem do body enquanto locked for verdadeiro — para modais e drawers — e compensa a largura da barra de rolagem para o layout não pular. Restaura os estilos originais ao destravar.',
            en: 'Locks body scrolling while locked is true — for modals and drawers — and compensates for the scrollbar width so the layout doesn’t jump. Restores the original styles when unlocked.',
          }}
          usage={`function Gaveta({ aberta }: { aberta: boolean }) {
  useLockBodyScroll(aberta)
  // …
}`}
        />
        <HookDoc
          name="useMounted"
          signature="function useMounted(): boolean"
          description={{
            pt: 'false na renderização do servidor e na primeira do cliente; true depois da montagem. Use para renderizar o que depende do navegador (portais, valores de window) sem erro de hidratação.',
            en: 'false during server rendering and the first client render; true after mounting. Use it to render browser-dependent things (portals, window values) without hydration errors.',
          }}
          usage={`const montado = useMounted()
if (!montado) return null
return createPortal(<Toasts />, document.body)`}
        />
        <HookDoc
          name="useIsomorphicLayoutEffect"
          signature="const useIsomorphicLayoutEffect: typeof useLayoutEffect"
          description={{
            pt: 'useLayoutEffect no navegador e useEffect no servidor. Use para medir e posicionar elementos antes da pintura sem o aviso do React no SSR.',
            en: 'useLayoutEffect in the browser and useEffect on the server. Use it to measure and position elements before paint without React’s SSR warning.',
          }}
        />
        <HookDoc
          name="useId"
          signature="function useId(prefix?: string /* 'or' */, providedId?: string): string"
          description={{
            pt: (
              <>
                Gera um id estável e único (baseado no <Code>useId</Code> do React, sem caracteres
                especiais) para ligar rótulos, descrições e controles. Se <Code>providedId</Code>{' '}
                vier, ele é usado — assim o componente aceita um <Code>id</Code> externo.
              </>
            ),
            en: (
              <>
                Generates a stable, unique id (based on React’s <Code>useId</Code>, without special
                characters) to link labels, descriptions and controls. If <Code>providedId</Code> is
                given it is used — so the component accepts an external <Code>id</Code>.
              </>
            ),
          }}
          example={{
            node: <UseId />,
            code: UseIdCode,
            description: {
              pt: 'Dois campos iguais, cada um com seu id.',
              en: 'Two identical fields, each with its own id.',
            },
          }}
        />
        <Callout tone="info" title={{ pt: 'Hooks de formulário', en: 'Form hooks' }}>
          <p>
            <T
              pt={
                <>
                  <Code>useField()</Code> e <Code>useFieldControlProps()</Code> vêm junto com o
                  componente <Code>Field</Code> e ligam qualquer controle ao rótulo, à descrição e
                  ao erro. Veja o exemplo em{' '}
                  <Link to={to('/design-guidelines/accessibility')}>
                    Acessibilidade → Formulários
                  </Link>
                  .
                </>
              }
              en={
                <>
                  <Code>useField()</Code> and <Code>useFieldControlProps()</Code> ship with the{' '}
                  <Code>Field</Code> component and wire any control to the label, description and
                  error. See the example in{' '}
                  <Link to={to('/design-guidelines/accessibility')}>Accessibility → Forms</Link>.
                </>
              }
            />
          </p>
        </Callout>
      </Section>
    </DocPage>
  )
}

function HookIndexRow({ group, names }: { group: Localized<string>; names: string[] }) {
  const { t } = useLang()
  return (
    <tr>
      <th scope="row">{t(group)}</th>
      <td>
        <span className="guide-hook-index__list">
          {names.map((name) => (
            <a
              key={name}
              href={`#${name.toLowerCase()}`}
              className="doc-inline-code guide-hook-index__link"
            >
              {name}
            </a>
          ))}
        </span>
      </td>
    </tr>
  )
}
