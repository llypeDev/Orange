# Hooks do @orangesys/ui

29 hooks exportados, todos seguros para SSR. Importe de `@orangesys/ui`.

Os mesmos hooks que constroem os componentes do Orange, exportados para você: estado controlado, foco, teclado, eventos e ambiente. Todos são seguros para SSR e tipados.

## Visão geral

Importe de `@orangesys/ui`. Os exemplos abaixo rodam ao vivo — abra o código de cada um para copiar. `useTheme` e `useLocale` estão em Tema e Internacionalização.

| Estado |  |
| --- | --- |
| Foco e teclado |  |
| Eventos |  |
| Movimento |  |
| Navegação na página |  |
| Ambiente e SSR |  |

## Estado

### `useControllableState`

Base do padrão `value` / `defaultValue` / `onChange` de todos os componentes. Se `value` vier definido, o estado é controlado pelo pai; senão, fica interno. O setter aceita valor ou função e só chama `onChange` quando o valor muda de fato.

```ts
function useControllableState<T>(options: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, (next: T | ((prev: T) => T)) => void]
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` | `T` | — | Valor controlado. undefined = não controlado. |
| `defaultValue` (obrigatório) | `T` | — | Valor inicial quando não controlado. |
| `onChange` | `(value: T) => void` | — | Chamado a cada mudança, nos dois modos. |

Retorna: Uma tupla [valor, setValor], como useState.

Um seletor de quantidade que funciona controlado e não controlado.

```tsx
import { Button, Icon, useControllableState } from '@orangesys/ui'
import { useState } from 'react'

interface QuantidadeProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  max?: number
}

/** Funciona controlado (value + onChange) e não controlado (defaultValue). */
function Quantidade({ value, defaultValue = 1, onChange, max = 10 }: QuantidadeProps) {
  const [quantidade, setQuantidade] = useControllableState({ value, defaultValue, onChange })
  return (
    <div className="guide-row" role="group" aria-label="Quantidade">
      <Button
        size="sm"
        variant="outline"
        iconOnly
        aria-label="Diminuir"
        disabled={quantidade <= 1}
        onClick={() => setQuantidade((q) => q - 1)}
      >
        <Icon name="minus" size="sm" />
      </Button>
      <output className="guide-qty" aria-live="polite">
        {quantidade}
      </output>
      <Button
        size="sm"
        variant="outline"
        iconOnly
        aria-label="Aumentar"
        disabled={quantidade >= max}
        onClick={() => setQuantidade((q) => q + 1)}
      >
        <Icon name="plus" size="sm" />
      </Button>
    </div>
  )
}

export default function Carrinho() {
  const [itens, setItens] = useState(2)
  return (
    <div className="guide-stack">
      <p className="guide-live">Não controlado:</p>
      <Quantidade defaultValue={1} />
      <p className="guide-live">
        Controlado pelo pai: <strong>{itens}</strong> {itens === 1 ? 'item' : 'itens'} · total R${' '}
        {(itens * 89.9).toFixed(2).replace('.', ',')}
      </p>
      <Quantidade value={itens} onChange={setItens} />
    </div>
  )
}
```

### `useDisclosure`

Estado abre/fecha para modais, menus, drawers e painéis — com o mesmo contrato `open` / `defaultOpen` / `onOpenChange` dos componentes. As funções retornadas são estáveis entre renderizações.

```ts
function useDisclosure(options?: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}): { isOpen: boolean; open(): void; close(): void; toggle(): void; setOpen(open: boolean): void }
```

Lembre de ligar o botão ao painel com aria-expanded e aria-controls.

```tsx
import { Button, Icon, useDisclosure } from '@orangesys/ui'

export default function FiltrosAvancados() {
  const filtros = useDisclosure()
  return (
    <div className="guide-stack">
      <div>
        <Button
          variant="outline"
          aria-expanded={filtros.isOpen}
          aria-controls="filtros-avancados"
          onClick={filtros.toggle}
          endIcon={<Icon name={filtros.isOpen ? 'chevron-up' : 'chevron-down'} size="sm" />}
        >
          Filtros avançados
        </Button>
      </div>
      <div id="filtros-avancados" hidden={!filtros.isOpen} className="guide-panel">
        <p>Status, período e forma de pagamento aparecem aqui.</p>
        <Button size="sm" variant="ghost" onClick={filtros.close}>
          Fechar filtros
        </Button>
      </div>
    </div>
  )
}
```

### `useDebouncedValue`

Devolve o valor só depois de delay milissegundos sem mudanças. Ideal para buscas e filtros que disparam requisições ou cálculos pesados.

```ts
function useDebouncedValue<T>(value: T, delay?: number /* 300 */): T
```

```tsx
import { Icon, useDebouncedValue } from '@orangesys/ui'
import { useMemo, useState } from 'react'

const cidades = [
  'Aracaju',
  'Belém',
  'Belo Horizonte',
  'Boa Vista',
  'Brasília',
  'Campo Grande',
  'Cuiabá',
  'Curitiba',
  'Florianópolis',
  'Fortaleza',
  'Goiânia',
  'João Pessoa',
  'Macapá',
  'Maceió',
  'Manaus',
  'Natal',
  'Palmas',
  'Porto Alegre',
  'Porto Velho',
  'Recife',
  'Rio Branco',
  'Rio de Janeiro',
  'Salvador',
  'São Luís',
  'São Paulo',
  'Teresina',
  'Vitória',
]

const sem = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function BuscaDeCidades() {
  const [busca, setBusca] = useState('')
  const buscaAtrasada = useDebouncedValue(busca, 400)
  const resultado = useMemo(
    () => cidades.filter((c) => sem(c).includes(sem(buscaAtrasada))),
    [buscaAtrasada],
  )
  return (
    <div className="guide-stack" style={{ maxWidth: '24rem' }}>
      <label htmlFor="busca-cidade" className="guide-label">
        Capital
      </label>
      <div className="guide-icons__search">
        <Icon name="search" size="sm" />
        <input
          id="busca-cidade"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite para filtrar…"
        />
      </div>
      <p className="guide-live">
        digitado: <strong>“{busca}”</strong> · aplicado após 400ms:{' '}
        <strong>“{buscaAtrasada}”</strong>
      </p>
      <p className="guide-live" role="status">
        {resultado.length} {resultado.length === 1 ? 'capital' : 'capitais'}:{' '}
        {resultado.slice(0, 6).join(', ')}
        {resultado.length > 6 ? '…' : ''}
      </p>
    </div>
  )
}
```

### `usePrevious`

Guarda o valor da renderização anterior — útil para mostrar variações, animar diferenças ou comparar props. É undefined na primeira renderização.

```ts
function usePrevious<T>(value: T): T | undefined
```

```tsx
import { Button, usePrevious } from '@orangesys/ui'
import { useState } from 'react'

export default function Cotacao() {
  const [preco, setPreco] = useState(5.42)
  const anterior = usePrevious(preco)
  const variacao = anterior === undefined ? 0 : preco - anterior
  return (
    <div className="guide-row">
      <Button
        variant="outline"
        onClick={() => setPreco((p) => Math.round((p + (Math.random() - 0.5) * 0.4) * 100) / 100)}
      >
        Atualizar cotação
      </Button>
      <p className="guide-live" role="status">
        USD → BRL <strong>{preco.toFixed(2)}</strong>{' '}
        {anterior !== undefined && (
          <span className={variacao >= 0 ? 'guide-up' : 'guide-down'}>
            {variacao >= 0 ? '▲ subiu' : '▼ caiu'} {Math.abs(variacao).toFixed(2)} (antes{' '}
            {anterior.toFixed(2)})
          </span>
        )}
      </p>
    </div>
  )
}
```

## Foco e teclado

### `useFocusTrap`

Enquanto `active` for verdadeiro, `Tab` e `Shift+Tab` circulam dentro de `ref`. Ao ativar, foca o primeiro elemento focável (ou `initialFocus`); ao desativar, devolve o foco para quem estava focado antes. Combine com `useEscapeKey` e `useClickOutside`.

```ts
function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  options?: { initialFocus?: RefObject<HTMLElement | null>; restoreFocus?: boolean /* true */ },
): void
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `ref` (obrigatório) | `RefObject<HTMLElement \| null>` | — | Contêiner que prende o foco. |
| `active` (obrigatório) | `boolean` | — | Liga e desliga a armadilha. |
| `options.initialFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco ao abrir. |
| `options.restoreFocus` | `boolean` | `true` | Devolve o foco ao fechar. |

Abra a confirmação e tente sair com Tab: o foco fica preso até Cancelar, Excluir, Esc ou um clique fora.

```tsx
import { Button, Icon, useClickOutside, useEscapeKey, useFocusTrap } from '@orangesys/ui'
import { useRef, useState } from 'react'

export default function ConfirmarExclusao() {
  const [aberto, setAberto] = useState(false)
  const painel = useRef<HTMLDivElement>(null)
  const fechar = () => setAberto(false)

  useFocusTrap(painel, aberto) // prende o Tab e devolve o foco ao fechar
  useEscapeKey(fechar, aberto) // Esc fecha
  useClickOutside(painel, fechar, aberto) // clique fora fecha

  return (
    <div className="guide-stack">
      <div>
        <Button
          variant="danger"
          startIcon={<Icon name="trash" size="sm" />}
          onClick={() => setAberto(true)}
        >
          Excluir projeto
        </Button>
      </div>
      {aberto && (
        <div
          ref={painel}
          role="dialog"
          aria-labelledby="confirmar-titulo"
          className="guide-panel guide-dialog"
        >
          <p id="confirmar-titulo" className="guide-dialog__title">
            Excluir “Loja Centro”?
          </p>
          <p>O projeto e os 32 pedidos ligados a ele serão removidos.</p>
          <div className="guide-row">
            <Button size="sm" variant="outline" onClick={fechar}>
              Cancelar
            </Button>
            <Button size="sm" variant="danger" onClick={fechar}>
              Excluir
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### `useRovingFocus`

Implementa o *roving tabindex* do WAI-ARIA: só um item do grupo fica no `Tab`; as setas, `Home` e `End` movem entre os itens marcados com `data-roving-item`. Devolva o handler no `onKeyDown` do contêiner.

```ts
function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  options?: { orientation?: 'horizontal' | 'vertical' | 'both'; loop?: boolean; selector?: string },
): (event: React.KeyboardEvent) => void
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical' \| 'both'` | `'horizontal'` | Quais setas navegam. |
| `loop` | `boolean` | `true` | Do último volta ao primeiro. |
| `selector` | `string` | `'[data-roving-item]:not([disabled])'` | Seletor dos itens navegáveis. |

Use Tab para entrar na barra e as setas ←/→ para trocar de item.

```tsx
import { Icon, useRovingFocus, type IconName } from '@orangesys/ui'
import { useRef, useState } from 'react'

const ferramentas: { id: string; rotulo: string; icone: IconName }[] = [
  { id: 'lista', rotulo: 'Lista', icone: 'list' },
  { id: 'grade', rotulo: 'Grade', icone: 'grid' },
  { id: 'calendario', rotulo: 'Calendário', icone: 'calendar' },
  { id: 'grafico', rotulo: 'Gráfico', icone: 'chart-bar' },
]

export default function AlternarVisualizacao() {
  const grupo = useRef<HTMLDivElement>(null)
  const onKeyDown = useRovingFocus(grupo, { orientation: 'horizontal' })
  const [ativo, setAtivo] = useState('lista')
  return (
    <div
      ref={grupo}
      role="toolbar"
      aria-label="Visualização"
      onKeyDown={onKeyDown}
      className="guide-toolbar-demo"
    >
      {ferramentas.map((f, i) => (
        <button
          key={f.id}
          type="button"
          data-roving-item
          tabIndex={i === 0 ? 0 : -1}
          aria-pressed={ativo === f.id}
          onClick={() => setAtivo(f.id)}
        >
          <Icon name={f.icone} size="sm" />
          {f.rotulo}
        </button>
      ))}
    </div>
  )
}
```

### `useEscapeKey`

Chama handler quando Escape é pressionado em qualquer lugar do documento, enquanto enabled for verdadeiro. Desligue-o quando a sobreposição estiver fechada.

```ts
function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled?: boolean /* true */): void
```

```tsx
useEscapeKey(() => setAberto(false), aberto)
```

## Eventos

### `useEventListener`

Adiciona um listener tipado e o remove ao desmontar. O handler mais recente é sempre usado, sem recriar o listener a cada renderização.

```ts
function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: Window | Document | HTMLElement | null, // padrão: window
  options?: AddEventListenerOptions,
): void
```

Role a página ou redimensione a janela.

```tsx
import { useEventListener } from '@orangesys/ui'
import { useState } from 'react'

export default function Janela() {
  const [largura, setLargura] = useState(() => window.innerWidth)
  const [rolagem, setRolagem] = useState(() => Math.round(window.scrollY))

  useEventListener('resize', () => setLargura(window.innerWidth))
  useEventListener('scroll', () => setRolagem(Math.round(window.scrollY)), undefined, {
    passive: true,
  })

  return (
    <dl className="guide-kv">
      <dt>window.innerWidth</dt>
      <dd>{largura}px</dd>
      <dt>window.scrollY</dt>
      <dd>{rolagem}px</dd>
    </dl>
  )
}
```

### `useClickOutside`

Chama `handler` em um `pointerdown` fora de todos os elementos informados. Passe o gatilho e o painel juntos para que clicar no botão de novo não feche e reabra o menu.

```ts
function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: (event: PointerEvent) => void,
  enabled?: boolean, // true
): void
```

```tsx
useClickOutside([gatilhoRef, menuRef], () => setAberto(false), aberto)
```

### `useClipboard`

Copia texto com a Clipboard API (com fallback para navegadores antigos) e mantém `copied` verdadeiro por `timeout` ms. Anuncie o resultado numa região `role="status"`.

```ts
function useClipboard(timeout?: number /* 2000 */): { copy(text: string): Promise<boolean>; copied: boolean }
```

```tsx
import { Button, Icon, useClipboard } from '@orangesys/ui'

export default function Cupom() {
  const { copy, copied } = useClipboard(2000)
  const codigo = 'LARANJA10'
  return (
    <div className="guide-row">
      <code className="guide-coupon">{codigo}</code>
      <Button
        variant="outline"
        startIcon={<Icon name={copied ? 'check' : 'copy'} size="sm" />}
        onClick={() => copy(codigo)}
      >
        {copied ? 'Copiado' : 'Copiar cupom'}
      </Button>
      <span role="status" className="or-visually-hidden">
        {copied ? 'Cupom copiado para a área de transferência' : ''}
      </span>
    </div>
  )
}
```

## Movimento

Hooks do sistema de movimento. Todos respeitam `prefers-reduced-motion` e são seguros para SSR. Os padrões visuais estão em Movimento.

### `usePresence`

Mantém um elemento montado enquanto a animação de saída roda. `state` vira `closed` assim que `open` fica falso; `present` só vira falso no `animationend`/ `transitionend` do elemento ligado a `nodeRef` (ou após `timeout`). Sem animação — jsdom, CSS ausente, movimento reduzido — desmonta na hora.

```ts
function usePresence<T extends HTMLElement = HTMLElement>(
  open: boolean,
  options?: { timeout?: number /* 1000 */ },
): { present: boolean; state: 'open' | 'closed'; nodeRef: RefObject<T | null> }
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `open` (obrigatório) | `boolean` | — | Se o elemento deve estar aberto. |
| `options.timeout` | `number` | `1000` | Limite (ms) para desmontar caso o evento de fim não chegue. |

Retorna: `present` (renderizar?), `state` (use em `data-state` com `or-motion-pop`, `-drop` ou `-fade`) e `nodeRef` (ligue ao elemento animado).

Observe present continuar true por 160ms depois de esconder: é a saída rodando.

```tsx
import { Button, Icon, usePresence } from '@orangesys/ui'
import { useState } from 'react'

export default function AvisoDeSalvamento() {
  const [visivel, setVisivel] = useState(false)
  // present segue true durante a saída; state vai para 'closed' na hora
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(visivel)
  return (
    <div className="guide-stack">
      <div>
        <Button variant="outline" onClick={() => setVisivel((v) => !v)}>
          {visivel ? 'Esconder aviso' : 'Mostrar aviso'}
        </Button>
      </div>
      <p className="guide-live">
        visivel: <strong>{String(visivel)}</strong> · present: <strong>{String(present)}</strong> ·
        state: <strong>{state}</strong>
      </p>
      {present && (
        <div
          ref={nodeRef}
          data-state={state}
          role="status"
          className="guide-presence__panel or-motion-pop"
        >
          <Icon name="check-circle" size="sm" />
          Rascunho salvo às 14h32
        </div>
      )}
    </div>
  )
}
```

### `useInView`

Diz se o elemento está na área visível, com `IntersectionObserver`. Por padrão dispara uma vez — ideal para revelações no scroll e para iniciar `useCountUp`. Sem suporte ao observer, devolve `true`. É o hook por trás do componente `Reveal`.

```ts
function useInView<T extends Element = HTMLElement>(options?: {
  rootMargin?: string        // '0px 0px -60px 0px'
  threshold?: number | number[] // 0.08
  once?: boolean             // true
  root?: Element | null      // null (viewport)
}): [ref: RefCallback<T>, inView: boolean]
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `rootMargin` | `string` | `'0px 0px -60px 0px'` | Margem da área observada (negativa = dispara um pouco depois de entrar). Com margem inferior negativa, no fim da rolagem o que está à vista conta como visto — senão os últimos pixels da página nunca disparariam. |
| `threshold` | `number \| number[]` | `0.08` | Fração visível necessária. |
| `once` | `boolean` | `true` | Para de observar após a primeira entrada. |
| `root` | `Element \| null` | `null` | Contêiner de rolagem (null = viewport). |

Retorna: Uma tupla [ref, inView]: passe ref ao elemento observado.

Com once: false, cada linha alterna entre “na tela” e “fora da tela”.

```tsx
import { Icon, useInView } from '@orangesys/ui'

function Linha({ rotulo }: { rotulo: string }) {
  // once: false → volta a false quando sai da área visível
  const [ref, visivel] = useInView<HTMLLIElement>({ once: false, threshold: 0.5 })
  return (
    <li ref={ref} className="guide-inview-row" data-visible={visivel || undefined}>
      <span>{rotulo}</span>
      <strong>{visivel ? 'na tela' : 'fora da tela'}</strong>
    </li>
  )
}

export default function Observador() {
  return (
    <div
      className="guide-stage guide-stage--short"
      tabIndex={0}
      role="region"
      aria-label="Área rolável: useInView"
    >
      <p className="guide-stage__hint">
        Role dentro da caixa <Icon name="arrow-down" size="sm" />
      </p>
      <ul className="guide-inview-list">
        {[
          'Pedido #4821',
          'Pedido #4822',
          'Pedido #4823',
          'Pedido #4824',
          'Pedido #4825',
          'Pedido #4826',
        ].map((p) => (
          <Linha key={p} rotulo={p} />
        ))}
      </ul>
    </div>
  )
}
```

### `useCountUp`

Anima um número de `from` até `target` com desaceleração cúbica, via `requestAnimationFrame`. Com movimento reduzido ou `enabled=false`, devolve o valor final. O retorno é fracionário: formate com `toLocaleString` ou `Math.round`.

```ts
function useCountUp(
  target: number,
  options?: { duration?: number /* 900 */; from?: number /* 0 */; enabled?: boolean /* true */ },
): number
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `target` (obrigatório) | `number` | — | Valor final. |
| `duration` | `number` | `900` | Duração em ms. |
| `from` | `number` | `0` | Valor inicial de cada contagem. |
| `enabled` | `boolean` | `true` | Liga a animação (ex.: quando useInView fica true). |

Retorna: O valor atual da contagem.

```tsx
import { Button, Icon, useCountUp } from '@orangesys/ui'
import { useState } from 'react'

function Total({ valor }: { valor: number }) {
  // Com movimento reduzido, devolve o valor final direto.
  const atual = useCountUp(valor, { duration: 900 })
  return (
    <p className="guide-count-big">
      {atual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </p>
  )
}

export default function Faturamento() {
  const [valor, setValor] = useState(48250.9)
  return (
    <div className="guide-stack">
      <span className="or-eyebrow">Faturamento de hoje</span>
      <Total valor={valor} />
      <div>
        {/* Cada novo alvo recomeça a contagem a partir de `from` (padrão: 0) */}
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={() => setValor(Math.round((40000 + Math.random() * 20000) * 100) / 100)}
        >
          Atualizar
        </Button>
      </div>
    </div>
  )
}
```

### `useScrollDirection`

Direção da rolagem da página e se ela já passou de `threshold`. Ignora variações menores que `tolerance` e agrupa leituras com `requestAnimationFrame`. Use para esconder o cabeçalho ao rolar para baixo — como o desta documentação.

```ts
function useScrollDirection(options?: {
  threshold?: number  // 120 — px a partir do topo
  tolerance?: number  // 6 — px mínimos de variação
}): { direction: 'up' | 'down'; pastThreshold: boolean }
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `threshold` | `number` | `120` | Distância do topo a partir da qual pastThreshold vira true. |
| `tolerance` | `number` | `6` | Variação mínima para trocar a direção. |

Retorna: { direction, pastThreshold } — esconda quando direction for down e pastThreshold for true.

```tsx
const { direction, pastThreshold } = useScrollDirection({ threshold: 160 })
const escondido = direction === 'down' && pastThreshold

return <header data-hidden={escondido || undefined} className="cabecalho">…</header>

/* cabecalho.css */
.cabecalho { transition: transform var(--or-duration-medium) var(--or-ease-in-out); }
.cabecalho[data-hidden] { transform: translateY(-100%); }
```

Role a página para cima e para baixo e veja os valores mudarem.

```tsx
import { Icon, useScrollDirection } from '@orangesys/ui'

export default function DirecaoDaRolagem() {
  const { direction, pastThreshold } = useScrollDirection({ threshold: 120, tolerance: 6 })
  return (
    <dl className="guide-kv">
      <dt>direction</dt>
      <dd>
        <Icon name={direction === 'down' ? 'arrow-down' : 'arrow-up'} size="sm" /> {direction}
      </dd>
      <dt>pastThreshold</dt>
      <dd>{String(pastThreshold)}</dd>
      <dt>esconder cabeçalho?</dt>
      <dd>{direction === 'down' && pastThreshold ? 'sim' : 'não'}</dd>
    </dl>
  )
}
```

## Navegação na página

### `useScrollSpy`

Diz qual seção está sendo lida, para montar um índice "Nesta página" com o visual que você quiser — é o hook por trás do `TableOfContents` e do índice desta documentação. Recebe os ids dos títulos na ordem do documento. Vence o primeiro título dentro da faixa; entre dois títulos, o que já passou (também ao subir); no fim da rolagem, o último à vista, mesmo que não alcance a faixa. Recalcula a cada quadro de rolagem e é seguro para SSR.

```ts
function useScrollSpy(ids: readonly string[], options?: {
  root?: HTMLElement | null | RefObject<HTMLElement | null>  // window
  rootMargin?: string  // '-80px 0px -65% 0px'
}): { activeId: string | undefined; setActiveId: (id: string) => void }
```

| Nome | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `ids` (obrigatório) | `readonly string[]` | — | Ids dos títulos, na ordem do documento. Um array novo a cada render não reinicia a observação. |
| `root` | `HTMLElement \| null \| RefObject` | `window` | Contêiner rolável, quando o conteúdo rola dentro de um painel. |
| `rootMargin` | `string` | `'-80px 0px -65% 0px'` | Faixa em que um título conta como "na tela", no formato do rootMargin (px ou %). O padrão é o terço superior, descontando um cabeçalho fixo de 80px. |

Retorna: { activeId, setActiveId } — setActiveId marca uma seção na hora (no clique de um link) e segura a marca durante o salto, até a próxima interação.

```tsx
const { activeId, setActiveId } = useScrollSpy(secoes.map((s) => s.id))

return (
  <nav aria-label="Nesta página">
    {secoes.map((s) => (
      <a
        key={s.id}
        href={`#${s.id}`}
        aria-current={activeId === s.id ? 'location' : undefined}
        onClick={() => setActiveId(s.id)}
      >
        {s.titulo}
      </a>
    ))}
  </nav>
)
```

Um índice próprio para um painel rolável: role até o fim e a última etapa fica marcada.

```tsx
import { useScrollSpy } from '@orangesys/ui'
import { useRef } from 'react'

const etapas = [
  { id: 'spy-resumo', titulo: 'Resumo' },
  { id: 'spy-entrega', titulo: 'Entrega' },
  { id: 'spy-pagamento', titulo: 'Pagamento' },
  { id: 'spy-revisao', titulo: 'Revisão' },
]

export default function IndiceProprio() {
  const painel = useRef<HTMLDivElement>(null)
  // Painel rolável: a faixa é o topo do painel (30%). Sem `root`, vale a janela.
  const { activeId, setActiveId } = useScrollSpy(
    etapas.map((etapa) => etapa.id),
    { root: painel, rootMargin: '0px 0px -70% 0px' },
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, width: '100%' }}>
      <nav aria-label="Etapas do checkout" style={{ flex: '0 0 180px' }}>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
          {etapas.map((etapa, i) => {
            const atual = activeId === etapa.id
            return (
              <li key={etapa.id}>
                <a
                  href={`#${etapa.id}`}
                  aria-current={atual ? 'location' : undefined}
                  // Marca na hora e segura a marca durante o salto.
                  onClick={() => setActiveId(etapa.id)}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    padding: '6px 10px',
                    textDecoration: 'none',
                    color: atual ? 'var(--or-color-text)' : 'var(--or-color-text-muted)',
                    background: atual ? 'var(--or-color-accent-subtle)' : 'transparent',
                    fontWeight: atual ? 600 : 400,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: 'var(--or-font-mono)', fontSize: 12 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {etapa.titulo}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
      <div
        ref={painel}
        tabIndex={0}
        role="region"
        aria-label="Checkout"
        style={{ flex: '1 1 280px', minWidth: 0, height: 280, overflow: 'auto', paddingRight: 16 }}
      >
        {etapas.map((etapa) => (
          <section key={etapa.id} style={{ minHeight: 160 }}>
            <h4 id={etapa.id} style={{ margin: '0 0 8px' }}>
              {etapa.titulo}
            </h4>
            <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
              Conteúdo da etapa “{etapa.titulo.toLowerCase()}” do checkout.
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
```

## Ambiente e SSR

### `useMediaQuery`

Retorna se a media query corresponde e reage a mudanças. No servidor devolve `defaultValue`. Para breakpoints, use os valores de `breakpoints` de `@orangesys/tokens`.

```ts
function useMediaQuery(query: string, defaultValue?: boolean /* false */): boolean
```

```tsx
import { useMediaQuery, useReducedMotion } from '@orangesys/ui'

export default function Ambiente() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const claro = useMediaQuery('(prefers-color-scheme: light)')
  const toque = useMediaQuery('(pointer: coarse)')
  const reduzido = useReducedMotion()
  const linhas: [string, boolean][] = [
    ['(min-width: 1024px)', desktop],
    ['(prefers-color-scheme: light)', claro],
    ['(pointer: coarse)', toque],
    ['useReducedMotion()', reduzido],
  ]
  return (
    <dl className="guide-kv">
      {linhas.map(([consulta, valor]) => (
        <div key={consulta} className="guide-kv__row">
          <dt>{consulta}</dt>
          <dd>
            <span className={valor ? 'guide-bool guide-bool--true' : 'guide-bool'}>
              {String(valor)}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
```

### `useReducedMotion`

Atalho para `useMediaQuery` com `(prefers-reduced-motion: reduce)`. Use para desligar animações feitas em JavaScript; as de CSS já são zeradas pelos tokens.

```ts
function useReducedMotion(): boolean
```

```tsx
const reduzido = useReducedMotion()
lista.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth' })
```

### `useLockBodyScroll`

Trava a rolagem do body enquanto locked for verdadeiro — para modais e drawers — e compensa a largura da barra de rolagem para o layout não pular. Restaura os estilos originais ao destravar.

```ts
function useLockBodyScroll(locked: boolean): void
```

```tsx
function Gaveta({ aberta }: { aberta: boolean }) {
  useLockBodyScroll(aberta)
  // …
}
```

### `useMounted`

false na renderização do servidor e na primeira do cliente; true depois da montagem. Use para renderizar o que depende do navegador (portais, valores de window) sem erro de hidratação.

```ts
function useMounted(): boolean
```

```tsx
const montado = useMounted()
if (!montado) return null
return createPortal(<Toasts />, document.body)
```

### `useIsomorphicLayoutEffect`

useLayoutEffect no navegador e useEffect no servidor. Use para medir e posicionar elementos antes da pintura sem o aviso do React no SSR.

```ts
const useIsomorphicLayoutEffect: typeof useLayoutEffect
```

### `useId`

Gera um id estável e único (baseado no `useId` do React, sem caracteres especiais) para ligar rótulos, descrições e controles. Se `providedId` vier, ele é usado — assim o componente aceita um `id` externo.

```ts
function useId(prefix?: string /* 'or' */, providedId?: string): string
```

Dois campos iguais, cada um com seu id.

```tsx
import { useId } from '@orangesys/ui'

function CampoCep() {
  const id = useId('cep')
  return (
    <div className="guide-stack" style={{ maxWidth: '18rem' }}>
      <label htmlFor={id} className="guide-label">
        CEP
      </label>
      <input
        id={id}
        className="or-control"
        inputMode="numeric"
        autoComplete="postal-code"
        aria-describedby={`${id}-dica`}
        placeholder="00000-000"
      />
      <p id={`${id}-dica`} className="guide-live">
        Usamos o CEP para calcular o frete. id gerado: <strong>{id}</strong>
      </p>
    </div>
  )
}

export default function DoisCampos() {
  return (
    <>
      <CampoCep />
      <CampoCep />
    </>
  )
}
```

> **Hooks de formulário** `useField()` e `useFieldControlProps()` vêm junto com o componente `Field` e ligam qualquer controle ao rótulo, à descrição e ao erro. Veja o exemplo em Acessibilidade → Formulários .

## Outros hooks exportados

Hooks ligados a um componente ou provider (o uso completo está na referência dele).

### `useAppShell`

```ts
useAppShell(): AppShellState
```

Estado e ações da navegação do `AppShell` mais próximo.

Código: `packages/ui/src/components/AppShell/AppShell.tsx`

### `useConfirm`

```ts
useConfirm(): [(options: ConfirmOptions) => Promise<boolean>, ReactElement<unknown, string | JSXElementConstructor<any>>]
```

Confirmação imperativa: `const [confirm, confirmDialog] = useConfirm()`.
Renderize `confirmDialog` uma vez e use `await confirm({ … })`, que resolve
`true` (confirmou) ou `false` (cancelou).

Código: `packages/ui/src/components/ConfirmDialog/ConfirmDialog.tsx`

### `useField`

```ts
useField(): FieldContextValue | null
```

Lê o contexto do `Field` mais próximo (ou `null`).

Código: `packages/ui/src/components/Field/Field.tsx`

### `useFieldControlProps`

```ts
useFieldControlProps(own?: FieldControlProps): FieldControlProps
```

Retorna os atributos que ligam um controle (input, select, textarea) ao
rótulo, à descrição e à mensagem de erro do `Field` que o envolve.
Valores passados em `own` têm precedência.

Código: `packages/ui/src/components/Field/Field.tsx`

### `useForm`

```ts
useForm(): FormState
```

Lê o estado do `Form` mais próximo: `{ errors, isSubmitting, submitCount, isValid, getError }`.

```tsx
const { getError } = useForm(); <TextField name="email" error={getError('email')} />
```

Código: `packages/ui/src/components/Form/Form.tsx`

### `useLocale`

```ts
useLocale(): LocaleContextValue
```

Acessa idioma e mensagens. Funciona fora do provider (usa pt-BR).

Código: `packages/ui/src/providers/OrangeProvider.tsx`

### `useTheme`

```ts
useTheme(): ThemeContextValue
```

Acessa o tema atual. Funciona fora do provider (retorna `dark`).

Código: `packages/ui/src/providers/OrangeProvider.tsx`

### `useToast`

```ts
useToast(): UseToastReturn
```

Hook para disparar toasts. Precisa estar dentro de um `ToastProvider`.

```tsx
const { toast } = useToast(); toast({ title: 'Link copiado' })
```

Código: `packages/ui/src/components/Toast/ToastProvider.tsx`
