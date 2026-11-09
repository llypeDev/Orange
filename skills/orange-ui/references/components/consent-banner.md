# ConsentBanner

Banner de consentimento de cookies (LGPD): aceitar, rejeitar e personalizar com o mesmo destaque, categorias granulares e uma escolha que pode ser revista a qualquer momento.

- Categoria: Feedback · Status: novo
- Importação: `import { ConsentBanner } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/consent-banner (em inglês: https://orange.llypedev.com.br/en/components/consent-banner)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-consentbanner--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ConsentBanner

## Boas práticas

> **Orientação de produto** As recomendações abaixo seguem a LGPD, o guia de cookies da ANPD e o padrão de banner do GOV.UK como referência de produto e acessibilidade — não são aconselhamento jurídico. Confirme textos, categorias e o registro da decisão com o jurídico ou o encarregado de dados (DPO) da sua empresa.

- Aceitar e rejeitar com o mesmo destaque: as três ações têm a mesma variante, tamanho e posição — nada de "Aceitar" laranja e "Rejeitar" escondido num link.
- Categorias granulares e com propósito claro (Necessários, Desempenho, Funcionalidade, Publicidade), cada uma com uma `description` que diz o que faz e o que muda se for recusada.
- Nenhuma categoria opcional começa marcada: sem `value`/ `defaultValue`, só as `required` vêm aceitas. Use `required` apenas para o que o site realmente precisa para funcionar.
- As categorias são caixas de seleção (CheckboxGroup), não switches: no Orange, Switch tem efeito imediato, e aqui a escolha só vale ao salvar.
- Só carregue scripts opcionais (analytics, pixels de anúncio) depois de uma decisão que os aceite. Fechar a página sem decidir não é consentimento.
- Mudar de ideia tem que ser tão fácil quanto aceitar: deixe um link "Preferências de cookies" no rodapé de todas as páginas, abrindo as preferências com `preferencesOpen`.
- O app guarda a decisão em `onDecision` — o componente não lê nem grava cookies ou `localStorage`. Guarde só o necessário: as categorias, a versão da política e a data. Nunca dados pessoais.
- Fixo (`bottom`/`top`), o banner é renderizado no início do `<body>`: é o primeiro na leitura e na ordem do Tab, como no GOV.UK, onde quer que você o declare. Mantenha-o montado e controle `open`. Para reabrir a pedido da pessoa, prefira abrir as preferências (`preferencesOpen`) — elas recebem o foco; o banner reaberto não o rouba.

- Faça: Texto curto e direto: o que é usado, para quê e que dá para mudar depois.
- Faça: Link para a política de cookies (policyHref) sempre visível no banner.
- Faça: Mostrar o banner de novo quando a política ou as categorias mudarem (versione o registro).
- Evite: Bloquear o site inteiro até a pessoa aceitar ("cookie wall") ou só permitir "Aceitar".
- Evite: Pré-marcar categorias opcionais ou tratar rolar a página como aceite.
- Evite: Esconder a forma de revogar: sem o link no rodapé, mudar de ideia fica mais difícil que aceitar.

## Anatomia

- **Região** — `role="region"` nomeada pelo título (`aria-labelledby`): aparece na lista de regiões do leitor de tela. Não é um diálogo — não prende nem rouba o foco.
- **Título e texto** — `title` (um `h2`; troque com `headingLevel`) e `children`. Sem eles, textos padrão no idioma do OrangeProvider. `policyHref` acrescenta o link "Política de cookies".
- **Ações** — "Aceitar todos", "Rejeitar opcionais" e "Personalizar", com o mesmo peso visual. Em larguras de até 30rem, empilham na largura toda.
- **Preferências** — Um Modal com um CheckboxGroup em cartões ("Categorias de cookies"), uma caixa por categoria com a descrição. As `required` ficam marcadas, desabilitadas e com "Sempre ativos"; as demais começam como no valor atual. "Salvar preferências" decide com o que está marcado; "Aceitar todos" marca tudo. Fechar sem salvar descarta as mudanças.
- **Confirmação** — Depois de cada decisão o banner fecha e uma região de status anuncia "Você aceitou todos os cookies…", "Você rejeitou os cookies opcionais…" ou "Suas preferências de cookies foram salvas…", como a mensagem de confirmação do GOV.UK.
- **Posição** — `bottom` (padrão) e `top`: fixo na janela, em portal no início do `<body>`, acima do conteúdo (um acima de `--or-z-header`) e da safe area, com a largura máxima do layout. A distância da borda vem de `--or-consent-banner-offset`. O tema de uma área com `data-theme` acompanha o portal. `inline`: no fluxo da página, onde foi declarado.

## Exemplos

### Básico

No fluxo da página (`placement="inline"`). Decida para ver o que `onDecision` recebe.

```tsx
import { Button, ConsentBanner, Stack, type ConsentCategory } from '@orangesys/ui'
import { useState } from 'react'

const categories: ConsentCategory[] = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description: 'Mantêm o site funcionando: login, segurança, carrinho e esta escolha.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho e analytics',
    description: 'Contam visitas e medem o carregamento das páginas, em dados agregados.',
  },
  {
    id: 'funcionalidade',
    label: 'Funcionalidade',
    description: 'Lembram a região de entrega e os produtos vistos recentemente.',
  },
  {
    id: 'publicidade',
    label: 'Publicidade',
    description: 'Permitem que parceiros mostrem anúncios de acordo com os seus interesses.',
  },
]

const sourceLabels = {
  'accept-all': 'Aceitou todos',
  reject: 'Rejeitou os opcionais',
  custom: 'Personalizou',
}

export default function Basic() {
  const [open, setOpen] = useState(true)
  const [result, setResult] = useState('')

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <ConsentBanner
        placement="inline"
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        policyHref="#politica-de-cookies"
        onDecision={(consent, source) => {
          const accepted = categories.filter((category) => consent[category.id])
          setResult(`${sourceLabels[source]}: ${accepted.map((c) => c.label).join(', ')}.`)
        }}
      />
      {!open && (
        <Stack gap={3} direction="horizontal" align="center" wrap>
          <span>{result}</span>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Mostrar de novo
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
```

### Guardando a decisão

O app lê a escolha salva depois de montar e mostra o banner só se não houver decisão (ou se a versão da política mudou). `onDecision` grava categorias, versão e data no `localStorage`; o botão "Preferências de cookies" do rodapé reabre as preferências com `preferencesOpen`.

```tsx
import { Button, ConsentBanner, Stack, type ConsentCategory, type ConsentValue } from '@orangesys/ui'
import { useEffect, useState } from 'react'

const categories: ConsentCategory[] = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description: 'Login, segurança, carrinho e esta escolha. Sem eles o site não funciona.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho e analytics',
    description: 'Contam visitas e medem o carregamento das páginas, em dados agregados.',
  },
  {
    id: 'funcionalidade',
    label: 'Funcionalidade',
    description: 'Lembram a região de entrega e os produtos vistos recentemente.',
  },
  {
    id: 'publicidade',
    label: 'Publicidade',
    description: 'Permitem que parceiros mostrem anúncios de acordo com os seus interesses.',
  },
]

const STORAGE_KEY = 'aurora:consentimento-cookies'
// Mude a versão quando a política ou as categorias mudarem: a pessoa decide de novo.
const POLICY_VERSION = '2026-11'

interface StoredConsent {
  consent: ConsentValue
  version: string
  decidedAt: string
}

/** O app guarda a escolha — o ConsentBanner não lê nem grava cookies ou localStorage. */
function readConsent(): StoredConsent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as StoredConsent | null
    return stored?.version === POLICY_VERSION ? stored : null
  } catch {
    return null // armazenamento bloqueado (modo privado) ou valor inválido: pergunta de novo
  }
}

function saveConsent(consent: ConsentValue) {
  const record: StoredConsent = {
    consent,
    version: POLICY_VERSION,
    decidedAt: new Date().toISOString(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Sem armazenamento a escolha vale só nesta visita.
  }
}

export default function Persistence() {
  const [consent, setConsent] = useState<ConsentValue>({})
  const [open, setOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  // Lê depois de montar (seguro com SSR). Sem decisão salva, mostra o banner.
  useEffect(() => {
    const stored = readConsent()
    if (stored) setConsent(stored.consent)
    else setOpen(true)
  }, [])

  // Scripts opcionais só carregam com consentimento, e só depois da decisão:
  // useEffect(() => { if (consent.desempenho) carregarAnalytics() }, [consent.desempenho])

  const forget = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // nada a esquecer
    }
    setConsent({})
    setOpen(true)
  }

  const accepted = categories.filter((category) => consent[category.id])

  return (
    <Stack gap={4} style={{ width: '100%' }}>
      {/* No app, omita placement: o banner fica fixo no rodapé da janela. */}
      <ConsentBanner
        placement="inline"
        categories={categories}
        policyHref="#politica-de-cookies"
        open={open}
        onOpenChange={setOpen}
        preferencesOpen={preferencesOpen}
        onPreferencesOpenChange={setPreferencesOpen}
        value={consent}
        onDecision={(next) => {
          saveConsent(next)
          setConsent(next)
        }}
      />
      <p style={{ margin: 0 }}>
        {open
          ? 'Nenhuma decisão salva neste navegador.'
          : `Salvo neste navegador: ${accepted.map((c) => c.label).join(', ')}.`}
      </p>
      <footer
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          paddingTop: 12,
          borderTop: '1px solid var(--or-color-border)',
        }}
      >
        {/* Revogar ou mudar a escolha precisa ser tão fácil quanto dar o consentimento. */}
        <Button variant="ghost" size="sm" onClick={() => setPreferencesOpen(true)}>
          Preferências de cookies
        </Button>
        <Button variant="ghost" size="sm" onClick={forget}>
          Esquecer decisão (demonstração)
        </Button>
      </footer>
    </Stack>
  )
}
```

### Fixo na janela (padrão)

Sem placement, o banner flutua no rodapé da janela; placement="top" o leva para o topo. Enquanto ele está aberto, a página reserva a altura dele na rolagem para que o elemento focado nunca fique escondido atrás.

```tsx
import { Button, ConsentBanner, Stack, type ConsentBannerPlacement } from '@orangesys/ui'
import { useState } from 'react'

const categories = [
  { id: 'necessarios', label: 'Necessários', required: true },
  { id: 'desempenho', label: 'Desempenho e analytics' },
  { id: 'publicidade', label: 'Publicidade' },
]

export default function Viewport() {
  const [placement, setPlacement] = useState<ConsentBannerPlacement | null>(null)

  return (
    <>
      <Stack gap={3} direction="horizontal" wrap>
        <Button variant="outline" onClick={() => setPlacement('bottom')}>
          Mostrar no rodapé
        </Button>
        <Button variant="outline" onClick={() => setPlacement('top')}>
          Mostrar no topo
        </Button>
      </Stack>
      {/* Fixo, o banner vai para o início do <body> (portal): primeiro na leitura e no Tab. */}
      <ConsentBanner
        placement={placement ?? 'bottom'}
        open={placement !== null}
        onOpenChange={(open) => !open && setPlacement(null)}
        categories={categories}
        policyHref="#politica-de-cookies"
      />
    </>
  )
}
```

### Texto próprio e roteador

`title` e `children` trocam os textos; `renderLink` renderiza o link da política com o componente do seu roteador.

```tsx
import { ConsentBanner } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

const categories = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description: 'Sessão, segurança e carrinho.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho e analytics',
    description: 'Visitas e tempo de carregamento, em dados agregados.',
  },
  {
    id: 'publicidade',
    label: 'Publicidade',
    description: 'Ofertas de café de acordo com os seus interesses, em sites parceiros.',
  },
]

export default function CustomText() {
  return (
    <ConsentBanner
      placement="inline"
      title="Sua privacidade na Torrefação Aurora"
      categories={categories}
      policyHref="/privacidade/cookies"
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    >
      <p>
        Usamos cookies para manter o seu carrinho e, se você permitir, para entender como o site é
        usado e mostrar ofertas do seu interesse. Recusar não muda preços, frete nem o acesso à
        loja.
      </p>
    </ConsentBanner>
  )
}
```

## Movimento

- **Entrar** — Sobe 24px a partir da borda (desce, no topo; 8px no inline) com fade em `--or-duration-medium` e `--or-ease-out`.
- **Sair** — Mais curta: volta 8px e esmaece em `--or-duration-fast` com `--or-ease-in-out`, sem receber cliques nem foco (`inert` ). No inline, a altura recolhe junto e a página sobe suave. O `usePresence` mantém o banner montado até o fim.
- **Movimento reduzido** — Com `prefers-reduced-motion`, sem deslocamento e com as durações zeradas: o banner só aparece e some.

## Props

### `ConsentBanner`

Banner de consentimento de cookies (LGPD): título, texto, link da política e
três ações com o mesmo peso — "Aceitar todos", "Rejeitar opcionais" e
"Personalizar", que abre um Modal com uma caixa de seleção por categoria. É uma região
nomeada que não prende nem rouba o foco; quem guarda a decisão é o app
(`onDecision`) — o componente não lê nem grava cookies.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `categories` (obrigatória) | `ConsentCategory[]` | — | Categorias listadas em "Personalizar", na ordem exibida. |
| `children` | `ReactNode` | — | Texto do banner. Padrão: um texto genérico sobre cookies necessários e opcionais. |
| `defaultOpen` | `boolean` | `true` | Banner visível inicialmente (não controlado). Padrão: `true`. |
| `defaultPreferencesOpen` | `boolean` | `false` | Preferências abertas inicialmente (não controlado). |
| `defaultValue` | `ConsentValue` | — | Preferências iniciais (não controlado). Padrão: só as obrigatórias. |
| `finalFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco quando o banner fecha com o foco dentro dele (ou nas preferências abertas a partir dele). Padrão: o elemento focado antes de entrar no banner ou, sem ele, o próximo elemento focável depois do banner na página. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Nível de heading do título (`2`–`6`). Padrão: `2`. |
| `onChange` | `((consent: ConsentValue) => void)` | — | Chamado quando uma decisão muda as preferências, com todas as categorias. |
| `onDecision` | `((consent: ConsentValue, source: ConsentDecisionSource) => void)` | — | Chamado a cada decisão — "Aceitar todos", "Rejeitar opcionais" ou "Salvar preferências" — com o consentimento completo e a origem. Depois dele, o banner fecha. É aqui que o app guarda a escolha. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o banner pede para abrir ou fechar (fecha após cada decisão). |
| `onPreferencesOpenChange` | `((open: boolean) => void)` | — | Chamado quando o diálogo de preferências abre ou fecha. |
| `open` | `boolean` | — | Banner visível (controlado). Use com `onOpenChange`. |
| `placement` | `"inline" \| "bottom" \| "top"` | `bottom` | `bottom` (padrão) e `top`: fixo na borda da janela, acima do conteúdo — renderizado em portal no início do `<body>`, primeiro na leitura e na ordem do Tab. `inline`: no fluxo, onde foi declarado. |
| `policyHref` | `string` | — | Endereço da política de cookies (ou de privacidade): mostra o link no banner. |
| `preferencesOpen` | `boolean` | — | Preferências abertas (controlado) — ex.: um link "Preferências de cookies" no rodapé. |
| `renderLink` | `RenderLink` | — | Renderiza o link da política com o componente do seu roteador: `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`. |
| `title` | `ReactNode` | — | Título do banner (nomeia a região). Padrão: "Cookies neste site". |
| `value` | `ConsentValue` | — | Preferências atuais (controlado), por `id` de categoria. Categorias ausentes contam como recusadas; as `required`, sempre como aceitas. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ConsentBannerPlacement`:

```ts
export type ConsentBannerPlacement = 'bottom' | 'top' | 'inline'
```

`ConsentCategory`:

```ts
/** Uma categoria de cookies (ou de tratamento) que a pessoa pode aceitar ou recusar. */
export interface ConsentCategory {
  /** Chave da categoria no objeto de consentimento: `analytics`. */
  id: string
  /** Nome curto: "Desempenho". */
  label: ReactNode
  /** Para que serve e o que acontece se for recusada. */
  description?: ReactNode
  /**
   * Necessária para o site funcionar: sempre marcada, com a caixa desabilitada
   * e a indicação "Sempre ativos".
   */
  required?: boolean
}
```

`ConsentDecisionSource`:

```ts
/** Como a decisão foi tomada. */
export type ConsentDecisionSource = 'accept-all' | 'reject' | 'custom'
```

`ConsentValue`:

```ts
/** Consentimento por categoria: `{ necessarios: true, analytics: false }`. */
export type ConsentValue = Record<string, boolean>
```

## Acessibilidade

Segue o padrão do GOV.UK: o banner é uma `role="region"` nomeada pelo título, **não prende o foco e não o rouba ao aparecer** — nem na primeira visita, nem ao ser reaberto. Fixo, ele é renderizado no início do `<body>`: é o primeiro elemento na leitura e na ordem do Tab, mesmo aparecendo no rodapé. Enquanto ele está fixo na janela, a altura dele é reservada na rolagem (`scroll-padding`), para que o elemento focado nunca fique escondido atrás dele.

**Foco depois da decisão:** se o foco estava no banner (ou nas preferências abertas por ele), ele vai para `finalFocus`; senão, para o elemento focado antes de entrar no banner; sem ele, para o próximo elemento focável depois do banner na página (normalmente o link de atalho ou o cabeçalho) — ou o anterior, se o banner for o último. Preferências abertas pelo rodapé devolvem o foco para o botão que as abriu. A confirmação é anunciada numa região `role="status"` educada, sempre montada no lugar do componente — mantenha o ConsentBanner montado e controle `open`, em vez de removê-lo.

As preferências são um Modal: prendem o foco (que entra na primeira caixa que pode ser alterada), fecham com Escape e devolvem o foco a Personalizar. As categorias formam um grupo nomeado (fieldset e legend “Categorias de cookies”); as caixas obrigatórias são desabilitadas e o nome delas inclui “Sempre ativos”.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre o link da política e as três ações, na ordem da página; nas preferências, as caixas e os botões (preso no diálogo). |
| `Shift` + `Tab` | Mesmo caminho, ao contrário. |
| `Enter` | Ativa o botão focado; em "Personalizar", abre as preferências. |
| `Space` | Ativa o botão ou marca/desmarca a caixa focada. |
| `Esc` | Nas preferências, fecha sem salvar. No banner, não faz nada: fechar sem decidir não é uma escolha. |

- **1.3.1** — Região nomeada pelo título; categorias num fieldset com legend; caixas com nome e descrição.
- **1.4.10** — Reflui em larguras estreitas: ações empilhadas, sem rolagem horizontal a 320px.
- **2.1.1** — Todas as ações e categorias alcançáveis pelo teclado.
- **2.4.3** — Aparecer não rouba o foco; depois da decisão, o foco vai para um lugar previsível.
- **2.4.11** — Fixo na janela, reserva a própria altura na rolagem: o foco não fica escondido atrás dele.
- **3.2.1** — Receber foco não muda nada: só um clique ou tecla decide.
- **4.1.3** — A confirmação da escolha é anunciada numa região de status, sem mover o foco para ela.
