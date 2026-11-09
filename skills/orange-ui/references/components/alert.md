# Alert

Mensagem inline que confirma, informa, alerta ou aponta um erro ligado a uma parte da página.

- Categoria: Feedback · Status: estável
- Importação: `import { Alert } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/alert (em inglês: https://orange.llypedev.com.br/en/components/alert)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-alert--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Alert

## Boas práticas

- Coloque o Alert perto do que ele descreve: no topo do formulário, acima da tabela, ao lado da configuração.
- Escreva um título curto com o fato e use o texto para o que fazer em seguida. Evite repetir o tom no título ("Erro: …") — o prefixo para leitores de tela já é automático.
- Use `live` só quando a mensagem surge depois de uma ação (envio de formulário, sincronização). Mensagens presentes no carregamento da página são estáticas.
- Para avisos do sistema que valem para a página inteira, use **Banner**; para confirmações breves que somem sozinhas, **Toast**.

- Faça: Diga o que aconteceu e como resolver.
- Evite: Mensagens genéricas que não ajudam a seguir em frente.

## Tons

- **`neutral`** — Contexto sem urgência: rascunhos, estados, observações.
- **`info`** — Informação útil ou novidade. Tom padrão.
- **`success`** — Confirma que uma ação foi concluída.
- **`warning`** — Algo precisa de atenção antes de virar problema.
- **`danger`** — Erro que impede o usuário de continuar.

## Exemplos

### Tons

Cada tom tem cor e ícone próprios. A borda esquerda de 3px marca o tom; o fundo continua neutro.

```tsx
import { Alert } from '@orangesys/ui'

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Alert tone="neutral" title="Rascunho">
        Este documento ainda não foi publicado.
      </Alert>
      <Alert tone="info" title="Manutenção programada">
        O painel ficará indisponível no sábado, das 2h às 4h.
      </Alert>
      <Alert tone="success" title="Pagamento confirmado">
        O recibo foi enviado para financeiro@empresa.com.br.
      </Alert>
      <Alert tone="warning" title="Seu certificado digital vence em 5 dias">
        Renove para continuar emitindo notas fiscais.
      </Alert>
      <Alert tone="danger" title="Não foi possível importar a planilha">
        A coluna “CNPJ” está vazia em 14 linhas.
      </Alert>
    </div>
  )
}
```

### Com ações

Até duas ações, em botões sm. A principal vem primeiro.

```tsx
import { Alert, Button } from '@orangesys/ui'

export default function WithActions() {
  return (
    <div style={{ width: '100%' }}>
      <Alert
        tone="warning"
        title="Seu plano vence em 3 dias"
        action={
          <>
            <Button size="sm">Atualizar pagamento</Button>
            <Button size="sm" variant="ghost">
              Lembrar amanhã
            </Button>
          </>
        }
      >
        Atualize o cartão de crédito para manter os 12 usuários do workspace ativos.
      </Alert>
    </div>
  )
}
```

### Dispensável

Ao fechar, o foco vai para o próximo elemento focável — nunca se perde no <body>. Com open controlado, você decide quando mostrar de novo.

```tsx
import { Alert, Button } from '@orangesys/ui'
import { useState } from 'react'

export default function Dismissible() {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ width: '100%' }}>
      {/* open mantém o Alert montado: a saída recolhe a altura e a reabertura anima a entrada */}
      <Alert
        open={open}
        tone="info"
        title="Novo: exportação para Excel"
        dismissible
        onDismiss={() => setOpen(false)}
      >
        Agora você pode baixar qualquer relatório em .xlsx pelo menu <strong>Exportar</strong>.
      </Alert>
      {!open && (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Mostrar aviso novamente
        </Button>
      )}
    </div>
  )
}
```

### Mensagem dinâmica (live)

Clique em Salvar duas vezes: o erro é anunciado imediatamente (role="alert") e o sucesso de forma educada (role="status").

```tsx
import { Alert, Button } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function LiveRegion() {
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // simula uma resposta do servidor alternando entre erro e sucesso
    setStatus((current) => (current === 'error' ? 'success' : 'error'))
  }

  return (
    <form onSubmit={submit} style={{ width: '100%' }}>
      {/* open em vez de {cond && <Alert />}: um sai recolhendo enquanto o outro entra.
          A margem fica no próprio Alert para recolher junto com ele. */}
      <Alert
        live
        open={status === 'error'}
        tone="danger"
        title="Não foi possível salvar o cliente"
        style={{ marginBottom: 12 }}
      >
        O CNPJ informado já está cadastrado em outra conta.
      </Alert>
      <Alert
        live
        open={status === 'success'}
        tone="success"
        title="Cliente salvo"
        style={{ marginBottom: 12 }}
      >
        Os dados de Padaria Pão Dourado foram atualizados.
      </Alert>
      <Button type="submit">Salvar cliente</Button>
    </form>
  )
}
```

### Sem título e com ícone próprio

```tsx
import { Alert, Icon } from '@orangesys/ui'

export default function WithoutTitle() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Alert tone="neutral">As alterações são salvas automaticamente a cada 30 segundos.</Alert>
      <Alert tone="info" icon={<Icon name="sparkle" />}>
        Dica: pressione <kbd>/</kbd> para buscar em qualquer tela.
      </Alert>
    </div>
  )
}
```

## Movimento

- **Entrada (live ou reaberto)** — Fade e sobe 8px — `--or-duration-medium` (250ms), `--or-ease-out`. Mensagens estáticas não animam.
- **Ícone** — "Assenta" com escala (`or-scale-in`) logo depois da mensagem — `--or-duration-medium`, `--or-ease-bounce`.
- **Dispensar** — Esmaece e sobe 4px em `--or-duration-fast` (160ms) enquanto a altura recolhe (grid `1fr → 0fr`) em `--or-duration-medium`: o conteúdo abaixo sobe suave. Fica `inert` até desmontar (`usePresence`); o foco já foi movido.
- **Pressionar ações e fechar** — Os botões afundam 1px — `--or-duration-press` (90ms).
- **Para a saída animar** — O Alert precisa continuar montado: use `open` (ou deixe não controlado) em vez de `{cond && <Alert />}`. Espaçamento em margem no próprio Alert recolhe junto; `gap` no pai só some no fim.
- **Movimento reduzido** — Sem deslocamento: entrada e saída são instantâneas (os tokens zeram).

## Props

### `Alert`

Mensagem inline e contextual — confirma, informa, alerta ou aponta um erro
relacionado a uma parte da página.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `action` | `ReactNode` | — | Ações relacionadas à mensagem (ex.: um `Button` `sm` ou um link). |
| `dismissible` | `boolean` | `false` | Mostra o botão de fechar. |
| `icon` | `ReactNode` | — | Substitui o ícone do tom. Use `false` para não exibir ícone. |
| `live` | `boolean` | `false` | Para mensagens que aparecem dinamicamente: aplica `role="alert"` (tons `danger` e `warning`, anúncio imediato) ou `role="status"` (demais tons, anúncio educado). Mensagens estáticas, presentes no carregamento da página, não devem usar `live`. |
| `onDismiss` | `(() => void)` | — | Chamado ao clicar em fechar. |
| `open` | `boolean` | — | Visibilidade controlada. Sem esta prop, o Alert se esconde sozinho ao ser fechado. |
| `title` | `ReactNode` | — | Título curto, em negrito. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger"` | `info` | Cor semântica e ícone. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`AlertTone`:

```ts
export type AlertTone = FeedbackTone
```

## Acessibilidade

Por padrão o Alert é estático, sem papel ARIA: ele faz parte do conteúdo e é lido na ordem da página. Com `live`, só a mensagem (prefixo, título e texto) vira região viva — ações e o botão de fechar ficam de fora do anúncio. Um prefixo visualmente oculto ("Erro:", "Atenção:"…) informa o tom sem depender da cor.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para as ações e o botão de fechar. |
| `Enter` | Ativa a ação ou fecha o Alert. |
| `Space` | Ativa a ação ou fecha o Alert. |

- **1.4.1** — O tom é comunicado por ícone, texto oculto e cor — nunca só pela cor.
- **2.4.3** — Ao fechar, o foco segue para o próximo elemento focável.
- **4.1.2** — Botão de fechar com nome acessível traduzido (`t('close')`).
- **4.1.3** — Mensagens dinâmicas anunciadas com `role="alert"` ou `role="status"`.
