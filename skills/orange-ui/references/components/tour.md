# Tour

Tour guiado com spotlight: apresenta novidades passo a passo, destacando cada elemento com um recorte na tela escurecida, com foco preso e retorno ao fechar.

- Categoria: Sobreposições · Status: estável
- Importação: `import { Tour } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/tour (em inglês: https://orange.llypedev.com.br/en/components/tour)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-tour--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Tour

## Boas práticas

- Use o Tour para apresentar o que mudou — um painel novo, um recurso recém-lançado. Não use para ensinar a interface inteira: se a tela precisa de um tour para ser entendida, o problema é a tela.
- Três a cinco passos, cada um com **um** elemento e **uma** ideia. O título diz o benefício (**Filtre por status**), não o nome do controle (**Segmented control**).
- Comece o tour por uma ação da pessoa (um botão "Conheça as novidades", um item no menu Ajuda) ou uma única vez após a atualização — e lembre que ele já foi visto. Nunca abra sozinho a cada visita.
- Mantenha `dismissible` ligado: pular precisa ser sempre possível. Desligue só em fluxos curtos e obrigatórios, em que concluir é o único caminho.
- Destaque elementos que estão na tela atual. Um passo cujo alvo não existe (oculto, em outra rota, ainda carregando) aparece centralizado, sem recorte — escreva o texto para fazer sentido também assim.

## Anatomia

- **Fundo e recorte** — A página escurece (--or-color-overlay) e um recorte com contorno de acento de 1px deixa o alvo à vista. O fundo cobre a tela toda, inclusive o alvo: ele fica visível, mas não clicável, enquanto o tour está aberto.
- **Diálogo** — Ao lado do alvo, com uma seta apontando para ele; troca de lado sozinho se faltar espaço. Sem alvo, fica no centro. Em telas estreitas vira uma folha na borda inferior (ou superior, se o alvo estiver embaixo).
- **Cabeçalho** — Eyebrow com o nome do tour (label) e o botão "Pular tour".
- **Mídia, título e texto** — Imagem opcional, título do passo (nomeia o diálogo) e texto (descreve o diálogo).
- **Rodapé** — Pontos de progresso (decorativos), contador "2 de 4" e os botões Voltar e Próximo — que vira Concluir no último passo. Com um passo só, o contador some.

## Exemplos

### Novo painel de pedidos

Quatro passos sobre um painel fictício. Os alvos são refs de elementos do próprio exemplo; o recorte desliza de um para o outro.

```tsx
import { Badge, Button, Icon, SegmentedControl, Stat, StatGroup, Tour, type TourStep } from '@orangesys/ui'
import { useRef, useState } from 'react'

export default function PainelPedidos() {
  const [aberto, setAberto] = useState(false)
  const [status, setStatus] = useState('abertos')
  // Os alvos são elementos deste próprio painel (refs), nunca o resto da página.
  const aoVivoRef = useRef<HTMLSpanElement>(null)
  const filtrosRef = useRef<HTMLDivElement>(null)
  const indicadoresRef = useRef<HTMLDListElement>(null)
  const exportarRef = useRef<HTMLButtonElement>(null)

  const passos: TourStep[] = [
    {
      target: aoVivoRef,
      title: 'Pedidos em tempo real',
      content: 'O painel agora se atualiza sozinho: novos pedidos entram na lista sem recarregar a página.',
    },
    {
      target: filtrosRef,
      title: 'Filtre por status',
      content: 'Alterne entre pedidos em aberto, em separação e enviados com um clique.',
    },
    {
      target: indicadoresRef,
      title: 'Indicadores do dia',
      content: 'Volume, separação e atrasos ficam no topo da lista — sem abrir outro relatório.',
      placement: 'top',
    },
    {
      target: exportarRef,
      title: 'Exporte em planilha',
      content: 'Baixe os pedidos filtrados para conciliar com o financeiro.',
      placement: 'left',
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div>
        <Button startIcon={<Icon name="sparkle" />} onClick={() => setAberto(true)}>
          Conheça o novo painel de pedidos
        </Button>
      </div>

      <section
        aria-label="Painel de pedidos (demonstração)"
        style={{
          display: 'grid',
          gap: 16,
          padding: 20,
          border: '1px solid var(--or-color-border)',
          background: 'var(--or-color-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 'var(--or-text-lg)' }}>Pedidos</strong>
            <span
              ref={aoVivoRef}
              className="or-eyebrow"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '2px 0' }}
            >
              <Badge dot pulse tone="success" />
              Ao vivo
            </span>
          </div>
          <Button ref={exportarRef} variant="outline" size="sm" startIcon={<Icon name="download" />}>
            Exportar
          </Button>
        </div>

        <div ref={filtrosRef} style={{ justifySelf: 'start', maxWidth: '100%' }}>
          <SegmentedControl
            label="Status dos pedidos"
            hideLabel
            size="sm"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'abertos', label: 'Em aberto' },
              { value: 'separacao', label: 'Em separação' },
              { value: 'enviados', label: 'Enviados' },
            ]}
          />
        </div>

        <StatGroup ref={indicadoresRef} size="sm">
          <Stat label="Pedidos hoje" value={128} delta="12%" trend="increase" help="vs. ontem" />
          <Stat label="Em separação" value={23} help="7 aguardando estoque" />
          <Stat label="Atrasados" value={4} delta="2" trend="decrease" deltaTone="positive" help="vs. ontem" />
        </StatGroup>
      </section>

      <Tour label="Novidades do painel" steps={passos} open={aberto} onOpenChange={setAberto} />
    </div>
  )
}
```

### Anúncio de recurso

Um passo sem alvo: diálogo centralizado com mídia, sem recorte nem contador.

```tsx
import { Button, Icon, Tour } from '@orangesys/ui'
import { useState } from 'react'

/** Ilustração geométrica: semana com a segunda-feira em destaque. */
function SemanaIlustracao() {
  const dias = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  return (
    <svg viewBox="0 0 360 140" role="img" aria-label="Semana com a segunda-feira destacada em laranja">
      <rect width="360" height="140" fill="var(--or-color-bg-subtle)" />
      {dias.map((dia, i) => (
        <g key={i} transform={`translate(${26 + i * 46} 34)`}>
          <rect
            width="38"
            height="64"
            fill={i === 0 ? 'var(--or-color-accent)' : 'var(--or-color-surface-raised)'}
            stroke={i === 0 ? 'var(--or-color-accent)' : 'var(--or-color-border-strong)'}
          />
          <text
            x="19"
            y="38"
            textAnchor="middle"
            fontFamily="var(--or-font-display)"
            fontSize="14"
            fill={i === 0 ? 'var(--or-color-text-on-accent)' : 'var(--or-color-text-muted)'}
          >
            {dia}
          </text>
        </g>
      ))}
      <rect x="26" y="108" width="38" height="4" fill="var(--or-color-accent)" />
    </svg>
  )
}

export default function Anuncio() {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      <Button variant="outline" startIcon={<Icon name="bell" />} onClick={() => setAberto(true)}>
        Ver novidade
      </Button>
      {/* Um passo sem alvo: aparece centralizado, sem recorte, e o botão vira "Concluir". */}
      <Tour
        label="Novidade"
        open={aberto}
        onOpenChange={setAberto}
        steps={[
          {
            title: 'Relatórios agendados chegaram',
            content: (
              <p>
                Programe o resumo de vendas para chegar toda segunda-feira, às 8h, no e-mail da equipe. Configure em{' '}
                <strong>Relatórios → Agendamentos</strong>.
              </p>
            ),
            media: <SemanaIlustracao />,
          },
        ]}
      />
    </>
  )
}
```

### Controlado

`open` e `step` controlados: o tour começa por um botão (ou direto num passo) e os eventos `onStepChange`, `onFinish` e `onSkip` alimentam o estado da página.

```tsx
import { Button, Icon, Search, Tour, type TourStep } from '@orangesys/ui'
import { useRef, useState } from 'react'

export default function Controlado() {
  const [aberto, setAberto] = useState(false)
  const [passo, setPasso] = useState(0)
  const [evento, setEvento] = useState('Tour ainda não iniciado.')
  const buscaRef = useRef<HTMLDivElement>(null)
  const novoRef = useRef<HTMLButtonElement>(null)
  const ajudaRef = useRef<HTMLButtonElement>(null)

  const passos: TourStep[] = [
    {
      target: buscaRef,
      title: 'Encontre qualquer pedido',
      content: 'Busque pelo número do pedido ou pelo nome da loja.',
    },
    {
      target: novoRef,
      title: 'Lance pedidos manuais',
      content: 'Para vendas por telefone ou no balcão, cadastre o pedido aqui.',
    },
    {
      target: ajudaRef,
      title: 'Reveja quando quiser',
      content: 'Este tour fica disponível no menu Ajuda.',
    },
  ]

  const iniciar = (indice: number) => {
    setPasso(indice)
    setAberto(true)
    setEvento(`Tour iniciado no passo ${indice + 1}.`)
  }

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          padding: 12,
          border: '1px solid var(--or-color-border)',
          background: 'var(--or-color-surface)',
        }}
      >
        <div ref={buscaRef} style={{ flex: '1 1 220px', maxWidth: 320 }}>
          <Search label="Buscar pedidos" hideLabel placeholder="Buscar pedidos" size="sm" />
        </div>
        <Button ref={novoRef} size="sm" startIcon={<Icon name="plus" />}>
          Novo pedido
        </Button>
        <Button ref={ajudaRef} size="sm" variant="ghost" startIcon={<Icon name="help-circle" />}>
          Ajuda
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => iniciar(0)}>
          Começar tour
        </Button>
        <Button variant="ghost" onClick={() => iniciar(2)}>
          Ir direto para “Ajuda”
        </Button>
      </div>
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Último evento: {evento}
      </p>

      <Tour
        label="Primeiros passos"
        steps={passos}
        open={aberto}
        onOpenChange={setAberto}
        step={passo}
        onStepChange={(proximo) => {
          setPasso(proximo)
          setEvento(`Passo ${proximo + 1} de ${passos.length}.`)
        }}
        onFinish={() => setEvento('Tour concluído.')}
        onSkip={(atual) => setEvento(`Tour pulado no passo ${atual + 1}.`)}
      />
    </div>
  )
}
```

## Movimento

- **Abrir** — O fundo faz fade e o diálogo entra com or-motion-pop (sobe 4px, escala 0,98 → 1). 250ms (--or-duration-medium), --or-ease-out.
- **Trocar de passo** — Se o novo alvo estiver fora da tela, a página rola até ele (centralizado) antes; então o recorte e o diálogo deslizam até o novo alvo. Só transform: 400ms (--or-duration-slow), --or-ease-in-out. O conteúdo do passo entra em fade.
- **Passo sem alvo** — O recorte se fecha num ponto, o contorno some (opacidade, 160ms) e o diálogo desliza para o centro.
- **Progresso** — O ponto atual cresce com --or-ease-spring e ganha o acento.
- **Fechar** — Diálogo e fundo saem juntos em 160ms (--or-duration-fast), --or-ease-in-out; o conteúdo fica inerte durante a saída.
- **Rolagem e redimensionamento** — Fora das trocas de passo, recorte e diálogo acompanham o alvo sem atraso.
- **prefers-reduced-motion** — Tudo instantâneo: a rolagem até o alvo é imediata (behavior: auto), o recorte e o diálogo pulam direto para o lugar e as entradas/saídas não se deslocam.

## Props

### `Tour`

Tour guiado (onboarding com spotlight): apresenta novidades passo a passo,
destacando cada elemento com um recorte na tela escurecida. Cada passo é um
diálogo modal — o foco fica preso, vai para o título a cada passo e volta
para onde estava ao fechar. O alvo destacado não recebe cliques enquanto o
tour está aberto.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `steps` (obrigatória) | `TourStep[]` | — | Passos do tour, na ordem. |
| `defaultOpen` | `boolean` | `false` | Aberto inicialmente (não controlado). |
| `defaultStep` | `number` | `0` | Passo inicial (não controlado). O tour volta para ele ao fechar. |
| `dismissible` | `boolean` | `true` | Permite sair antes do fim: mostra "Pular tour" e aceita Escape. |
| `label` | `string` | — | Nome do tour (ex.: "Novidades do painel"). Aparece como eyebrow e abre o nome acessível do diálogo. |
| `onFinish` | `(() => void)` | — | Chamado ao clicar em "Concluir" no último passo. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o tour abre ou fecha (concluir, pular, Escape). |
| `onSkip` | `((step: number) => void)` | — | Chamado com o índice do passo atual ao pular (botão "Pular tour" ou Escape). |
| `onStepChange` | `((step: number) => void)` | — | Chamado com o índice do passo pedido (Próximo/Voltar). |
| `open` | `boolean` | — | Aberto (controlado). Use com `onOpenChange`. |
| `spotlightPadding` | `number` | `8` | Folga entre o alvo e a borda do recorte, em px. |
| `step` | `number` | — | Índice do passo atual, a partir de 0 (controlado). Use com `onStepChange`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Cada passo é um diálogo modal (padrão *Dialog (Modal)* do WAI-ARIA APG): `role="dialog"` com `aria-modal="true"`, nomeado pelo nome do tour + título do passo e descrito pelo texto do passo. O foco fica preso no diálogo; ao abrir e a cada troca de passo ele vai para o título, que é lido pelo leitor de tela. Ao fechar, volta para o elemento que estava focado quando o tour abriu. Como no Modal, o restante da página fica inerte: o fundo bloqueia cliques, o foco não sai do diálogo e o scroll da página é travado.

> **O alvo não é clicável** O tour é modal: o elemento destacado fica visível pelo recorte, mas não recebe cliques nem foco enquanto o tour está aberto. Para pedir que a pessoa experimente o recurso, conclua o tour e deixe o controle livre.

Os pontos de progresso são decorativos (`aria-hidden`); a posição é dada pelo contador em texto ("2 de 4"). Os rótulos internos — Voltar, Próximo, Concluir, Pular tour e o contador — vêm do dicionário de mensagens e seguem o idioma do `OrangeProvider`.

| Teclas | Ação |
| --- | --- |
| `Tab` | Do título para os controles do passo; do último volta ao primeiro. |
| `Shift` + `Tab` | Controle anterior; do primeiro vai ao último. |
| `Enter` | Ativa o botão focado (Próximo, Voltar, Concluir, Pular tour). |
| `Esc` | Pula o tour (onSkip) e devolve o foco. Ignorado com dismissible={false}. |

- **1.3.1** — Título e texto ligados por aria-labelledby/aria-describedby; progresso em texto, não só em pontos.
- **1.4.11** — Contorno de acento de 1px ao redor do recorte nos dois temas (Highlight em alto contraste).
- **2.1.2** — Sem armadilha de teclado: Escape e Pular tour saem do tour; sem dismissible, Concluir é sempre alcançável.
- **2.4.3** — Foco no título a cada passo e retorno ao ponto de origem ao fechar.
- **2.4.11** — O foco fica sempre no diálogo, acima do fundo — nunca encoberto. O alvo é rolado para o centro da tela antes de cada passo.
- **2.3.3** — Com movimento reduzido, rolagem e transições são instantâneas.
- **4.1.2** — Papel `dialog`, estado modal e botões com nomes traduzidos.
