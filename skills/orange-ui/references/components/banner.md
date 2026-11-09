# Banner

Faixa de largura total para avisos do sistema ou da página — manutenção, instabilidade, prazos e chamadas.

- Categoria: Feedback · Status: estável
- Importação: `import { Banner } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/banner (em inglês: https://orange.llypedev.com.br/en/components/banner)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-banner--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Banner

## Boas práticas

- Use o Banner para avisos que valem para a página ou o sistema inteiro. Mensagens sobre um trecho específico ficam em um Alert, perto do conteúdo.
- Coloque-o no topo, antes do cabeçalho ou logo abaixo dele, e mostre um por vez. Vários banners empilhados viram ruído.
- Título curto com o fato + uma frase com o impacto. Ofereça uma ação clara ("Acompanhar status", "Ver planos").
- Permita dispensar avisos informativos e lembre a escolha (ex.: `localStorage`). Avisos críticos, como uma queda de serviço, não devem ser dispensáveis enquanto valerem.
- A variante `accent` é para chamadas (convites, lançamentos), não para avisos de sistema. Use no máximo uma por página.

- Faça: Um aviso, específico, com o impacto.
- Evite: Vários banners empilhados com títulos vagos.

## Variantes

- **`default`** — Faixa compacta com fundo suave do tom, ícone e borda esquerda colorida. Para avisos do sistema.
- **`accent`** — Chamada com borda esquerda laranja, título grande em Space Grotesk e ações à direita.

## Exemplos

### Tons

```tsx
import { Banner } from '@orangesys/ui'

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Banner tone="neutral" title="Modo somente leitura">
        Você está vendo a versão publicada em 12/10.
      </Banner>
      <Banner tone="info" title="Manutenção programada">
        Domingo, das 2h às 4h (horário de Brasília), o painel ficará indisponível.
      </Banner>
      <Banner tone="success" title="Integração concluída">
        Seus pedidos já estão sincronizando com o ERP.
      </Banner>
      <Banner tone="warning" title="Instabilidade no Pix">
        Alguns pagamentos podem levar até 30 minutos para compensar.
      </Banner>
      <Banner tone="danger" title="Falha na emissão de notas">
        Nenhuma NF-e foi emitida desde 14h. Nossa equipe já está atuando.
      </Banner>
    </div>
  )
}
```

### Com ação e dispensável

Links simples ganham sublinhado; botões usam o tamanho sm. Ao fechar, o foco segue para o próximo elemento.

```tsx
import { Banner, Button } from '@orangesys/ui'

export default function WithAction() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Banner
        tone="warning"
        title="Instabilidade no Pix"
        action={<a href="#status">Acompanhar status</a>}
        dismissible
      >
        Alguns pagamentos podem levar até 30 minutos para compensar.
      </Banner>
      <Banner
        tone="info"
        title="Seu teste termina em 2 dias"
        action={
          <Button size="sm" variant="secondary">
            Ver planos
          </Button>
        }
        dismissible
      >
        Escolha um plano para manter seus 4 projetos.
      </Banner>
    </div>
  )
}
```

### No topo da página

Como primeiro elemento do layout, acima do cabeçalho.

```tsx
import { Banner } from '@orangesys/ui'

export default function PageTop() {
  return (
    <div style={{ width: '100%', border: '1px solid var(--or-color-border)' }}>
      <Banner
        tone="info"
        title="Nova central de ajuda"
        action={<a href="#ajuda">Conhecer</a>}
        dismissible
        style={{ borderInline: 0, borderTop: 0 }}
      >
        Artigos, vídeos e o status dos serviços em um só lugar.
      </Banner>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--or-color-border)',
          fontFamily: 'var(--or-font-display)',
          fontWeight: 700,
        }}
      >
        <span>Painel financeiro</span>
        <span style={{ color: 'var(--or-color-text-subtle)', fontWeight: 400 }}>Ana Souza</span>
      </header>
      <div style={{ padding: 24, color: 'var(--or-color-text-muted)' }}>Conteúdo da página…</div>
    </div>
  )
}
```

### Chamada (accent)

Com headingLevel, o título vira um heading e entra na estrutura da página.

```tsx
import { Banner, Button, Icon } from '@orangesys/ui'

export default function Accent() {
  return (
    <div style={{ width: '100%' }}>
      <Banner
        variant="accent"
        headingLevel={2}
        title="Leve o Orange para o seu time"
        action={
          <>
            <Button endIcon={<Icon name="arrow-right" />}>Começar agora</Button>
            <Button variant="outline">Falar com vendas</Button>
          </>
        }
      >
        Componentes acessíveis, tokens e documentação bilíngue — prontos para produção.
      </Banner>
    </div>
  )
}
```

### Aviso dinâmico (live)

A queda é anunciada imediatamente (role="alert"); o retorno, de forma educada (role="status").

```tsx
import { Banner, Button } from '@orangesys/ui'
import { useState } from 'react'

export default function Live() {
  const [online, setOnline] = useState<boolean | null>(null)

  return (
    <div style={{ width: '100%' }}>
      {/* open mantém os banners montados: quem sai recolhe a altura, quem chega desce 8px */}
      <Banner
        live
        pulse
        open={online === false}
        tone="danger"
        title="Sem conexão agora"
        style={{ marginBottom: 12 }}
      >
        Suas alterações ficam salvas neste dispositivo e serão enviadas quando a conexão voltar.
      </Banner>
      <Banner
        live
        open={online === true}
        tone="success"
        title="Conexão restabelecida"
        dismissible
        onDismiss={() => setOnline(null)}
        style={{ marginBottom: 12 }}
      >
        Sincronizamos 3 alterações pendentes.
      </Banner>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm" onClick={() => setOnline(false)}>
          Simular queda
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOnline(true)}>
          Simular retorno
        </Button>
      </div>
    </div>
  )
}
```

## Movimento

- **Entrada (live ou reaberto)** — Desce 8px a partir do topo com fade — `--or-duration-medium`, `--or-ease-out`.
- **Dispensar** — Esmaece e sobe 4px (`--or-duration-fast`) enquanto a faixa recolhe a altura (grid `1fr → 0fr`, `--or-duration-medium`): a página sobe sem pular.
- **Ao vivo (pulse)** — Anel quadrado pulsando em volta do ícone, na cor do tom — `or-pulse`, `--or-duration-loop` (2.4s). É só reforço: o texto precisa dizer que é ao vivo.
- **Links e botões** — O sublinhado engrossa no hover e no foco (`--or-duration-fast`); botões afundam 1px (`--or-duration-press`).
- **Para a saída animar** — O Banner precisa continuar montado: use `open` (ou deixe não controlado) em vez de `{cond && <Banner />}`. Espaçamento em margem no próprio Banner recolhe junto; `gap` no pai só some no fim.
- **Movimento reduzido** — Sem deslocamento e sem pulso.

## Props

### `Banner`

Faixa de largura total para avisos do sistema ou da página — manutenção,
instabilidade, prazos, convites. Fica no topo, acima do conteúdo.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `action` | `ReactNode` | — | Ação principal: um link ou `Button`. |
| `dismissible` | `boolean` | `false` | Mostra o botão de fechar. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | — | Nível de heading do título (`2`–`6`). Sem esta prop, o título é um parágrafo. |
| `icon` | `ReactNode` | — | Substitui o ícone do tom. `false` remove o ícone (padrão na variante `accent`). |
| `live` | `boolean` | `false` | Para avisos que surgem com a página já aberta (ex.: queda de conexão): `role="alert"` em `danger`/`warning`, `role="status"` nos demais tons. |
| `onDismiss` | `(() => void)` | — | Chamado ao clicar em fechar. |
| `open` | `boolean` | — | Visibilidade controlada. Sem esta prop, o Banner se esconde sozinho ao ser fechado. |
| `pulse` | `boolean` | `false` | Indicador "ao vivo": o ícone ganha um anel pulsando na cor do tom — para situações em andamento (incidente, manutenção acontecendo agora). O movimento é só um reforço: o texto precisa dizer que é ao vivo. |
| `title` | `ReactNode` | — | Título curto. Na variante `accent`, é exibido em destaque. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger"` | `info` | Cor semântica e ícone (variante `default`). |
| `variant` | `"accent" \| "default"` | `default` | `default`: faixa compacta com fundo do tom, para avisos do sistema. `accent`: chamada com borda laranja e título grande (anúncios, convites). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O Banner é conteúdo estático por padrão. Para avisos que surgem com a página aberta (queda de conexão, sessão expirando), use `live`: só a mensagem é anunciada, sem ações nem o botão de fechar. Nos tons semânticos, um prefixo oculto ("Atenção:", "Erro:") é lido antes do título.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para a ação e o botão de fechar. |
| `Enter` | Ativa a ação ou fecha o Banner. |
| `Space` | Ativa o botão focado. |

- **1.4.1** — O tom é comunicado por ícone e texto oculto, além da cor.
- **1.4.10** — O conteúdo quebra em linhas em telas estreitas, sem rolagem horizontal.
- **2.4.3** — Ao fechar, o foco segue para o próximo elemento focável.
- **4.1.3** — Avisos dinâmicos anunciados sem mover o foco.
