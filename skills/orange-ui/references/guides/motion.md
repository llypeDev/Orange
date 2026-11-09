# Movimento

O Orange se move como uma ferramenta, não como um show: rápido, funcional e geométrico. Botões afundam 1px, cartões sobem 4px, conteúdo entra 24px de baixo — e tudo para quando o sistema pede menos movimento.

## Princípios

- **Rápido** — Feedback de toque em 90ms, hover em 160ms, entradas em 250ms. A interface acompanha a mão de quem usa — ninguém espera uma animação.
- **Funcional** — Movimento mostra causa e efeito: de onde o menu veio, que o clique foi aceito, que o erro apareceu. Se não explica nada, sai.
- **Geométrico** — Deslocamentos retos em distâncias fixas, sombras sólidas deslocadas, sublinhados que crescem da esquerda. Nada de desfoque, rotação decorativa ou elástico exagerado.
- **Sem bloquear** — Elementos são interativos desde o primeiro quadro, saídas são mais curtas que entradas e nada essencial depende de a animação terminar.

## Durações

Gerada de `motion.duration` em `@orangesys/tokens`. Clique em ▶ para ver cada duração com `--or-ease-out`. Todas viram `0ms` com movimento reduzido.

| Token | Valor | Uso | Demonstração |
| --- | --- | --- | --- |

## Curvas

Gerada de `motion.easing`. As demonstrações usam `--or-duration-slow` para a diferença ficar visível; os quadrados laranja são os pontos de controle — o do `bounce` sai do quadro porque a curva passa do destino e volta.

## Distâncias e escalonamento

Quanto maior o elemento, maior o deslocamento — mas sempre em um dos quatro valores de `motion.distance`. Grupos entram em sequência, com `--or-stagger` () entre um item e o próximo. Com movimento reduzido, distâncias e stagger também vão a zero.

--or-stagger ·

## Interação

Respostas imediatas ao ponteiro e ao teclado. Hover e `:focus-visible` sempre têm a mesma resposta; nenhuma delas é a única pista de estado.

### Pressionar

Clique e segure: o alvo afunda `translateY(1px) scale(0.985)` em 90ms e volta em 160ms. Use `or-press` em qualquer alvo clicável que não seja um `Button`.

```tsx
import { Button, Icon } from '@orangesys/ui'

export default function Pressionar() {
  return (
    <div className="guide-row">
      {/* or-press: o alvo afunda 1px e encolhe 1,5% em --or-duration-press (90ms) */}
      <button type="button" className="guide-tile or-press">
        <Icon name="zap" size="lg" />
        Pressione e segure
      </button>
      {/* O Button do Orange já faz o mesmo no :active */}
      <Button>Salvar alterações</Button>
    </div>
  )
}
```

### Elevar

Cartões clicáveis sobem 4px, ganham uma sombra sólida `0 8px 0 -4px` na cor do texto e uma barra de acento de 4px que desce pela borda esquerda ( `scaleY(0 → 1)`, a partir do topo) — no hover e no foco do teclado. Uma ponte invisível de 12px abaixo do cartão evita que ele trema com o cursor na borda de baixo. Troque as cores com `--or-lift-accent` (barra) e `--or-lift-shadow` (sombra).

```tsx
import { Icon } from '@orangesys/ui'

const planos = [
  { nome: 'Starter', preco: 'R$ 0', texto: '1 loja, 100 pedidos por mês.' },
  { nome: 'Pro', preco: 'R$ 49', texto: 'Até 10 lojas e relatórios.' },
  { nome: 'Escala', preco: 'R$ 199', texto: 'Lojas ilimitadas e API.' },
]

export default function CartoesQueSobem() {
  return (
    <ul className="guide-lift-grid">
      {planos.map((plano) => (
        <li key={plano.nome}>
          {/* or-lift: no hover e no foco sobe 4px, ganha a sombra 0 8px 0 -4px e a barra
              de acento desce pela borda esquerda. Cores: --or-lift-accent e --or-lift-shadow. */}
          <a href="#elevar" className="guide-lift-card or-lift or-nudge">
            <span className="or-eyebrow">{plano.nome}</span>
            <strong>{plano.preco}/mês</strong>
            <span>{plano.texto}</span>
            <span className="guide-lift-card__more">
              Ver plano <Icon name="arrow-right" size="sm" className="or-nudge__icon" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
```

### Seta que empurra

O ícone final desliza 4px quando o link recebe hover ou foco — um convite para seguir em frente.

```tsx
import { Icon } from '@orangesys/ui'

export default function SetaQueEmpurra() {
  return (
    <div className="guide-row">
      {/* or-nudge no alvo + or-nudge__icon no ícone: a seta desliza 4px no hover e no foco */}
      <a href="#empurrar" className="guide-link or-nudge">
        Ver todos os pedidos
        <Icon name="arrow-right" size="sm" className="or-nudge__icon" />
      </a>
      <a href="#empurrar" className="guide-link or-nudge">
        Documentação da API
        <Icon name="arrow-up-right" size="sm" className="or-nudge__icon" />
      </a>
    </div>
  )
}
```

### Sublinhado animado

O traço cresce da esquerda via `background-size` e fica cheio no item com `aria-current`. Funciona em texto de várias linhas.

```tsx
export default function SublinhadoAnimado() {
  const itens = ['Visão geral', 'Pedidos', 'Clientes', 'Relatórios']
  return (
    <nav aria-label="Seções do painel">
      <ul className="guide-underline-nav">
        {itens.map((item, i) => (
          <li key={item}>
            {/* or-underline: o traço cresce da esquerda no hover, no foco e em aria-current */}
            <a
              href="#sublinhado"
              className="or-underline"
              aria-current={i === 1 ? 'page' : undefined}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

### Indicador de seleção

O indicador desliza entre as opções com `--or-ease-spring` em 250ms — o mesmo movimento das abas, do controle segmentado e do polegar do switch.

```tsx
import { useState } from 'react'

const periodos = ['Dia', 'Semana', 'Mês', 'Ano']

export default function IndicadorDeslizante() {
  const [ativo, setAtivo] = useState(1)
  return (
    <div className="guide-seg" role="group" aria-label="Período do relatório">
      {/* O indicador desliza com transform e --or-ease-spring; não é medido em JS */}
      <span
        className="guide-seg__indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${ativo * 100}%)`, width: `${100 / periodos.length}%` }}
      />
      {periodos.map((periodo, i) => (
        <button key={periodo} type="button" aria-pressed={ativo === i} onClick={() => setAtivo(i)}>
          {periodo}
        </button>
      ))}
    </div>
  )
}
```

## Entrada e saída

Sobreposições entram a partir de onde foram acionadas e saem mais rápido do que entraram. `usePresence(open)` mantém o elemento montado durante a saída e devolve o `data-state` que as classes de `motion.css` animam.

### Presença: pop, drop e fade

`or-motion-pop` (popovers: opacidade + 4px + escala 0.98), `or-motion-drop` (menus: desce 6px) e `or-motion-fade` (véus). Entram em 250ms ou 160ms com `ease-out` e saem em 160ms com `ease-in-out`.

```tsx
import { Button, Icon, usePresence } from '@orangesys/ui'
import { useState } from 'react'

function Painel({ variante, titulo }: { variante: 'pop' | 'drop' | 'fade'; titulo: string }) {
  const [aberto, setAberto] = useState(false)
  // present continua true enquanto a animação de saída roda
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(aberto)
  return (
    <div className="guide-presence">
      <Button
        size="sm"
        variant="outline"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
      >
        {aberto ? 'Fechar' : 'Abrir'} {titulo}
      </Button>
      {present && (
        <div
          ref={nodeRef}
          data-state={state}
          className={`guide-presence__panel or-motion-${variante}`}
        >
          <Icon name="bell" size="sm" />
          or-motion-{variante}
        </div>
      )}
    </div>
  )
}

export default function Presenca() {
  return (
    <div className="guide-row guide-row--top">
      <Painel variante="pop" titulo="popover" />
      <Painel variante="drop" titulo="menu" />
      <Painel variante="fade" titulo="véu" />
    </div>
  )
}
```

### Expandir e recolher

Altura animada sem medir nada: `grid-template-rows: 0fr → 1fr` com opacidade em 400ms, e o chevron gira 180°. O conteúdo fechado recebe `inert` para sair da ordem de tabulação.

```tsx
import { Icon } from '@orangesys/ui'
import { useId, useState } from 'react'

const perguntas = [
  {
    p: 'Posso trocar de plano depois?',
    r: 'Sim. A mudança vale a partir do próximo ciclo e o valor é calculado proporcionalmente.',
  },
  {
    p: 'Como exporto meus pedidos?',
    r: 'Em Pedidos → Exportar. O arquivo CSV chega por e-mail em poucos minutos.',
  },
]

function Pergunta({ p, r }: { p: string; r: string }) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  return (
    <div className="guide-faq">
      <button
        type="button"
        className="guide-faq__trigger"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((v) => !v)}
      >
        {p}
        <Icon name="chevron-down" size="sm" className="guide-faq__chevron" />
      </button>
      {/* or-collapse: grid-template-rows 0fr → 1fr + opacidade em --or-duration-slow */}
      <div id={id} className="or-collapse" data-state={aberto ? 'open' : 'closed'} inert={!aberto}>
        <div>
          <p className="guide-faq__answer">{r}</p>
        </div>
      </div>
    </div>
  )
}

export default function PerguntasFrequentes() {
  return (
    <div className="guide-faq-list">
      {perguntas.map((item) => (
        <Pergunta key={item.p} {...item} />
      ))}
    </div>
  )
}
```

### Entrada de página

Na troca de rota, o conteúdo surge com opacidade e 8px (`or-page-enter`, 400ms).

```tsx
import { Button, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function EntradaDePagina() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-stack">
      {/* or-page-enter: opacidade + --or-distance-md (8px) na troca de rota */}
      <div key={rodada} className="guide-page-mock">
        <span className="or-eyebrow">Pedidos</span>
        <strong>Pedidos em aberto</strong>
        <span>32 pedidos aguardam separação.</span>
      </div>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={() => setRodada((n) => n + 1)}
        >
          Trocar de página
        </Button>
      </div>
    </div>
  )
}
```

### Peças que caem

Marcas e ilustrações geométricas montam peça por peça com `or-piece-drop` , `--or-ease-bounce` e stagger.

```tsx
import { Button, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function PecasQueCaem() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-row">
      {/* or-piece-drop: cada peça cai 40% da própria altura, escalonada por --or-stagger */}
      <svg
        key={rodada}
        className="guide-pieces"
        viewBox="0 0 24 24"
        width="96"
        height="96"
        aria-hidden="true"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          className="guide-pieces__piece"
          style={{ ['--_i' as string]: 0 }}
          fill="var(--or-color-accent)"
        />
        <rect
          x="12"
          y="0"
          width="12"
          height="12"
          className="guide-pieces__piece"
          style={{ ['--_i' as string]: 1 }}
          fill="var(--or-color-bg)"
        />
        <rect
          x="15"
          y="3"
          width="6"
          height="6"
          className="guide-pieces__piece"
          style={{ ['--_i' as string]: 2 }}
          fill="var(--or-color-text)"
        />
      </svg>
      <Button
        size="sm"
        variant="ghost"
        startIcon={<Icon name="refresh" size="sm" />}
        onClick={() => setRodada((n) => n + 1)}
      >
        Repetir
      </Button>
    </div>
  )
}
```

## Feedback e status

### Pulso de status

Um anel em `box-shadow` a cada 2,4s marca o que está “ao vivo”. É a única animação infinita permitida fora de carregamento — e sempre ao lado de texto (“Operacional”). Some com movimento reduzido.

```tsx
const servicos = [
  { nome: 'API de pedidos', estado: 'Operacional', cor: 'var(--or-color-success)', vivo: true },
  { nome: 'Sincronização com ERP', estado: 'Lenta', cor: 'var(--or-color-warning)', vivo: true },
  { nome: 'Relatórios', estado: 'Em manutenção', cor: 'var(--or-color-text-subtle)', vivo: false },
]

export default function StatusAoVivo() {
  return (
    <ul className="guide-status-list">
      {servicos.map((s) => (
        <li key={s.nome}>
          {/* or-pulse: anel em box-shadow a cada --or-duration-loop (2,4s); a cor vem de --_pulse-color */}
          <span
            className={s.vivo ? 'guide-dot or-pulse' : 'guide-dot'}
            style={{ background: s.cor, ['--_pulse-color' as string]: s.cor }}
            aria-hidden="true"
          />
          <span>{s.nome}</span>
          <strong>{s.estado}</strong>
        </li>
      ))}
    </ul>
  )
}
```

### Tremor de erro

Ao surgir um erro de validação, o campo treme uma vez (`or-shake`, `--or-duration-slow`). A mensagem e o `aria-invalid` continuam sendo a informação — o tremor só chama o olhar.

```tsx
import { Button, Field, useFieldControlProps } from '@orangesys/ui'
import { useState } from 'react'

function CampoCupom({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  const props = useFieldControlProps()
  return (
    <input
      {...props}
      className="or-control"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder="LARANJA10"
    />
  )
}

export default function TremorDeErro() {
  const [cupom, setCupom] = useState('')
  const [erro, setErro] = useState<string>()
  const [tremer, setTremer] = useState(false)
  return (
    <form
      className="guide-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const valido = cupom.trim().toUpperCase() === 'LARANJA10'
        setErro(valido ? undefined : 'Cupom inválido. Confira as letras e os números.')
        setTremer(!valido)
      }}
    >
      {/* or-shake roda uma vez; a classe sai no fim para poder tremer de novo no próximo erro */}
      <div
        className={tremer ? 'or-shake' : undefined}
        onAnimationEnd={(e) => e.target === e.currentTarget && setTremer(false)}
      >
        <Field
          label="Cupom de desconto"
          description="Experimente enviar vazio e depois LARANJA10."
          error={erro}
        >
          <CampoCupom valor={cupom} onChange={setCupom} />
        </Field>
      </div>
      <div>
        <Button type="submit">Aplicar cupom</Button>
      </div>
    </form>
  )
}
```

### Progresso temporizado

Passos que avançam sozinhos mostram o tempo restante numa barra `or-fill-x` (`scaleX` 0 → 1). Nunca comece sozinho e ofereça como repetir ou pausar (2.2.2); com movimento reduzido, o resultado aparece direto.

```tsx
import { Button, Icon, useReducedMotion } from '@orangesys/ui'
import { useState } from 'react'

const passos = ['Conecte a loja', 'Importe os pedidos', 'Convide a equipe']

type Fase = 'parado' | 'rodando' | 'fim'

export default function PassosTemporizados() {
  const reduzido = useReducedMotion()
  const [fase, setFase] = useState<Fase>('parado')
  const [atual, setAtual] = useState(0)
  const [rodada, setRodada] = useState(0)

  const iniciar = () => {
    setAtual(0)
    setRodada((n) => n + 1)
    // Com movimento reduzido, nada avança sozinho: mostra o resultado final.
    setFase(reduzido ? 'fim' : 'rodando')
  }

  return (
    <div className="guide-stack">
      <ol className="guide-steps-timed">
        {passos.map((passo, i) => {
          const cheio = fase === 'fim' || (fase === 'rodando' && i < atual)
          const animando = fase === 'rodando' && i === atual
          return (
            <li key={passo} aria-current={animando ? 'step' : undefined}>
              <span className="guide-steps-timed__track" aria-hidden="true">
                {animando ? (
                  // or-fill-x: scaleX 0 → 1 a partir da esquerda; ao terminar, avança
                  <span
                    key={rodada}
                    className="guide-steps-timed__bar guide-steps-timed__bar--run"
                    onAnimationEnd={() =>
                      i < passos.length - 1 ? setAtual(i + 1) : setFase('fim')
                    }
                  />
                ) : (
                  <span className="guide-steps-timed__bar" data-full={cheio || undefined} />
                )}
              </span>
              <span className="guide-steps-timed__label">
                {String(i + 1).padStart(2, '0')} · {passo}
              </span>
            </li>
          )
        })}
      </ol>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name={fase === 'parado' ? 'play' : 'refresh'} size="sm" />}
          onClick={iniciar}
        >
          {fase === 'parado' ? 'Reproduzir' : 'Repetir'}
        </Button>
      </div>
    </div>
  )
}
```

### Desenho de traço

Checks e linhas de gráfico se desenham com `or-draw` ( `stroke-dashoffset`); defina `--_draw-length` com o comprimento do traço.

```tsx
import { Button, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function Desenho() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-row">
      {/* or-draw: stroke-dashoffset de --_draw-length até 0 */}
      <svg
        key={`c${rodada}`}
        className="guide-draw"
        viewBox="0 0 48 48"
        width="64"
        height="64"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="44" height="44" className="guide-draw__box" />
        <path
          d="M13 25l7 7 15-15"
          className="guide-draw__path"
          style={{ ['--_draw-length' as string]: 32 }}
        />
      </svg>
      <svg
        key={`l${rodada}`}
        className="guide-draw guide-draw--wide"
        viewBox="0 0 200 64"
        width="200"
        height="64"
        aria-hidden="true"
      >
        <polyline
          points="0,52 40,44 80,48 120,26 160,30 200,8"
          className="guide-draw__path guide-draw__path--line"
          style={{ ['--_draw-length' as string]: 230 }}
        />
      </svg>
      <Button
        size="sm"
        variant="ghost"
        startIcon={<Icon name="refresh" size="sm" />}
        onClick={() => setRodada((n) => n + 1)}
      >
        Repetir
      </Button>
    </div>
  )
}
```

## Rolagem

### Revelação escalonada

O componente `Reveal` observa a viewport (`rootMargin` −60px, `threshold` 0.08) e sobe o conteúdo 24px em 600ms; com `stagger`, cada filho entra 80ms depois do anterior. Conteúdo já visível na carga nunca pisca.

```tsx
import { Button, Icon, Reveal, useReducedMotion } from '@orangesys/ui'
import { useRef } from 'react'

const etapas = ['01 Tokens', '02 Fundamentos', '03 Componentes', '04 Storybook']

export default function RevelacaoEscalonada() {
  const caixa = useRef<HTMLDivElement>(null)
  const reduzido = useReducedMotion()
  // Volta ao topo (o grupo sai da área visível e se esconde) e rola até ele de novo.
  const repetir = () => {
    const el = caixa.current
    if (!el) return
    el.scrollTo({ top: 0 })
    window.setTimeout(
      () => el.scrollTo({ top: el.scrollHeight, behavior: reduzido ? 'auto' : 'smooth' }),
      150,
    )
  }
  return (
    <div className="guide-stack">
      <div
        ref={caixa}
        className="guide-stage"
        tabIndex={0}
        role="region"
        aria-label="Área rolável: revelação escalonada"
      >
        <p className="guide-stage__hint">
          Role dentro da caixa <Icon name="arrow-down" size="sm" />
        </p>
        <div className="guide-stage__spacer" />
        {/* stagger: cada filho entra --or-stagger (80ms) depois do anterior; once={false} repete ao voltar */}
        <Reveal stagger once={false} className="guide-reveal-grid">
          {etapas.map((etapa) => (
            <div key={etapa} className="guide-reveal-card">
              {etapa}
            </div>
          ))}
        </Reveal>
      </div>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={repetir}
        >
          Repetir
        </Button>
      </div>
    </div>
  )
}
```

### Números que contam

`useCountUp` anima de 0 ao valor com desaceleração cúbica quando o número entra em cena (`useInView`). Com movimento reduzido, mostra o valor final.

```tsx
import { Button, Icon, useCountUp, useInView } from '@orangesys/ui'
import { useState } from 'react'

const formatar = (n: number, casas: number) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

/** Monta só quando visível: começa em 0 e desacelera até o valor (900ms). */
function Contagem({ valor, casas }: { valor: number; casas: number }) {
  const atual = useCountUp(valor, { duration: 900 })
  return <>{formatar(atual, casas)}</>
}

function Numero({
  valor,
  rotulo,
  prefixo = '',
  casas = 0,
}: {
  valor: number
  rotulo: string
  prefixo?: string
  casas?: number
}) {
  const [ref, visivel] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="guide-count">
      <dt>{rotulo}</dt>
      <dd>
        {prefixo}
        {visivel ? <Contagem valor={valor} casas={casas} /> : formatar(0, casas)}
      </dd>
    </div>
  )
}

export default function Contadores() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-stack">
      <dl key={rodada} className="guide-count-row">
        <Numero valor={3214} rotulo="pedidos em março" />
        <Numero valor={182.4} rotulo="faturamento (mil)" prefixo="R$ " casas={1} />
        <Numero valor={98} rotulo="% entregues no prazo" />
      </dl>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={() => setRodada((n) => n + 1)}
        >
          Repetir
        </Button>
      </div>
    </div>
  )
}
```

### Cabeçalho que se esconde

Role a página: depois de 160px rolando para baixo, `useScrollDirection` esconde a barra (`translateY(-100%)`, `ease-in-out`); qualquer rolagem para cima a traz de volta. É o mesmo hook do cabeçalho desta documentação.

```tsx
import { useScrollDirection } from '@orangesys/ui'

export default function CabecalhoQueSeEsconde() {
  const { direction, pastThreshold } = useScrollDirection({ threshold: 160 })
  const escondido = direction === 'down' && pastThreshold
  return (
    <div className="guide-stack">
      <div className="guide-header-mock">
        {/* translateY(-100%) com --or-ease-in-out; volta ao rolar para cima */}
        <div className="guide-header-mock__bar" data-hidden={escondido || undefined}>
          <span className="guide-header-mock__logo" aria-hidden="true" />
          Minha loja
        </div>
      </div>
      <p className="guide-live" role="status">
        direction: <strong>{direction}</strong> · pastThreshold:{' '}
        <strong>{String(pastThreshold)}</strong>
      </p>
    </div>
  )
}
```

## Referência rápida

| Padrão | Como | Tokens |
| --- | --- | --- |
| Pressionar | or-press · :active | press · fast |
| Elevar | or-lift | distance-lift · medium |
| Seta que empurra | or-nudge + or-nudge__icon | medium · out |
| Sublinhado | or-underline | medium · out |
| Indicador | transform + spring | medium · spring |
| Sobreposições | usePresence + or-motion-pop \| drop \| fade | medium/fast · distance-sm |
| Expandir/recolher | or-collapse + data-state | slow · out |
| Status ao vivo | or-pulse + --_pulse-color | loop |
| Erro | or-shake (uma vez) | slow · 400ms |
| Progresso | or-fill-x · transform | linear |
| Check e linhas | or-draw + --_draw-length | bounce/out |
| Revelação | Reveal · useInView | reveal · distance-lg · stagger |
| Números | useCountUp | 900ms |
| Cabeçalho | useScrollDirection | medium · in-out |

## Quando usar

- Faça: Confirmar uma ação (pressionar, check que se desenha).
- Faça: Mostrar origem e destino (menu que desce do botão, drawer que vem da borda).
- Faça: Chamar atenção uma vez para algo novo (erro, toast, conteúdo revelado).
- Faça: Indicar que algo está vivo ou carregando — com texto ao lado.
- Evite: Animar texto que a pessoa está lendo ou tabelas que atualizam.
- Evite: Animar `width`, `height`, `top` ou `left` (exceção: `grid-template-rows`).
- Evite: Loops infinitos decorativos, parallax ou rolagem automática.
- Evite: Escrever `300ms` ou `cubic-bezier(…)` soltos: eles não zeram com movimento reduzido.

## Movimento reduzido

Pessoas com distúrbios vestibulares, enxaqueca ou dificuldade de atenção podem pedir menos movimento ao sistema. Com `prefers-reduced-motion: reduce`, o Orange desliga o movimento em quatro camadas:

Seu sistema agora: ****

- **Tokens:** todas as `--or-duration-*`, `--or-distance-*` e `--or-stagger` viram zero em `tokens.css`.
- **Base:** `base.css` encurta qualquer animação ou transição restante para 0.01ms.
- **Utilitários:** `Reveal` mostra tudo imediatamente e `or-pulse` para.
- **Hooks:** `useCountUp` devolve o valor final; `usePresence` desmonta na hora; use `useReducedMotion()` na sua lógica.

`Galeria.tsx`:

```tsx
import { useReducedMotion } from '@orangesys/ui'

export function Galeria({ slides }: { slides: Slide[] }) {
  const reduzido = useReducedMotion()
  // Sem reprodução automática quando o movimento está reduzido.
  const [tocando, setTocando] = useState(!reduzido)
  // …
}
```

> **Como testar** macOS: Ajustes → Acessibilidade → Tela → Reduzir movimento. Windows: Configurações → Acessibilidade → Efeitos visuais → Efeitos de animação. Chrome DevTools: Rendering → Emulate CSS prefers-reduced-motion.

## Regras de implementação

- Anime só `transform`, `opacity`, cores, bordas e `box-shadow`.
- Durações, curvas e distâncias sempre de tokens: `var(--or-duration-fast) var(--or-ease-out)`.
- Saída mais curta que a entrada; hover e foco visível com a mesma resposta.
- Movimento nunca é a única pista de estado: sempre há texto, ícone, cor ou atributo ARIA.
- Teste a saída de componentes com `usePresence` — no jsdom ela desmonta na hora, porque não há animação.
