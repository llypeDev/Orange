# Stepper

Mostra o progresso em um fluxo de várias etapas — concluídas, a atual e as próximas.

- Categoria: Navegação · Status: estável
- Importação: `import { Stepper } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/stepper (em inglês: https://orange.llypedev.com.br/en/components/stepper)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-stepper--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Stepper

## Boas práticas

- Use para fluxos lineares de 3 a 6 etapas (checkout, cadastro, configuração inicial). Com duas etapas, um título "Etapa 1 de 2" basta.
- Nomeie cada etapa pelo que a pessoa faz nela, com uma ou duas palavras: Entrega, Pagamento, Revisão.
- Deixe etapas concluídas clicáveis (`onStepClick`) quando a pessoa puder voltar sem perder dados. Etapas futuras nunca são clicáveis.
- Marque etapas com problema com status="error" e explique o problema na descrição — não apenas com cor.

## Estados

- **complete** — Etapas antes de step. Quadrado com check e conector laranja.
- **current** — A etapa de `step`. Quadrado laranja e `aria-current="step"`.
- **upcoming** — Etapas seguintes. Quadrado com borda e número.
- **error** — Definido por step.status. Quadrado vermelho com alerta.

## Exemplos

### Checkout

Horizontal, controlado por step. Avance e volte com os botões.

```tsx
import { Button, Stack, Stepper } from '@orangesys/ui'
import { useState } from 'react'

const steps = [
  { label: 'Carrinho', description: '3 itens' },
  { label: 'Entrega', description: 'Endereço e frete' },
  { label: 'Pagamento', description: 'Cartão ou Pix' },
  { label: 'Revisão', description: 'Confirme o pedido' },
]

export default function Checkout() {
  const [active, setActive] = useState(1)
  return (
    <Stack gap={6} style={{ width: '100%' }}>
      <Stepper steps={steps} step={active} aria-label="Etapas do checkout" />
      <Stack gap={2} direction="horizontal">
        <Button variant="outline" disabled={active === 0} onClick={() => setActive((v) => v - 1)}>
          Voltar
        </Button>
        <Button disabled={active === steps.length} onClick={() => setActive((v) => v + 1)}>
          {active >= steps.length - 1 ? 'Finalizar pedido' : 'Continuar'}
        </Button>
      </Stack>
    </Stack>
  )
}
```

### Vertical com conteúdo

Na vertical, step.content aparece sob a etapa atual — bom para onboarding.

```tsx
import { Button, Stack, Stepper } from '@orangesys/ui'
import { useState } from 'react'

export default function Vertical() {
  const [active, setActive] = useState(1)
  const next = () => setActive((v) => v + 1)
  return (
    <Stepper
      orientation="vertical"
      step={active}
      aria-label="Configuração do workspace"
      steps={[
        { label: 'Criar workspace', description: 'Orange Labs' },
        {
          label: 'Convidar equipe',
          description: 'Até 10 pessoas no plano gratuito',
          content: (
            <Stack gap={2} direction="horizontal">
              <Button size="sm" onClick={next}>
                Enviar convites
              </Button>
              <Button size="sm" variant="ghost" onClick={next}>
                Fazer depois
              </Button>
            </Stack>
          ),
        },
        {
          label: 'Conectar repositório',
          description: 'GitHub, GitLab ou Bitbucket',
          content: (
            <Button size="sm" onClick={next}>
              Conectar GitHub
            </Button>
          ),
        },
        { label: 'Primeiro deploy', content: <Button size="sm" onClick={() => setActive(0)}>Recomeçar</Button> },
      ]}
    />
  )
}
```

### Etapa com erro

O estado de erro é anunciado ("com erro") e explicado na descrição.

```tsx
import { Stepper } from '@orangesys/ui'

export default function WithError() {
  return (
    <Stepper
      aria-label="Verificação de identidade"
      step={1}
      steps={[
        { label: 'Dados pessoais', description: 'Nome e data de nascimento' },
        { label: 'Documento', description: 'Foto ilegível — envie novamente', status: 'error' },
        { label: 'Selfie', description: 'Foto do rosto' },
        { label: 'Análise', description: 'Até 2 dias úteis' },
      ]}
    />
  )
}
```

### Etapas concluídas clicáveis

Com onStepClick, só as etapas concluídas viram botões.

```tsx
import { Stack, Stepper } from '@orangesys/ui'
import { useState } from 'react'

const steps = [
  { label: 'Empresa', description: 'Razão social e CNPJ' },
  { label: 'Responsável', description: 'Quem assina o contrato' },
  { label: 'Plano', description: 'Mensal ou anual' },
  { label: 'Contrato', description: 'Assinatura digital' },
]

export default function Clickable() {
  const [active, setActive] = useState(3)
  return (
    <Stack gap={4} style={{ width: '100%' }}>
      <Stepper steps={steps} step={active} onStepClick={setActive} aria-label="Cadastro da empresa" />
      <p style={{ margin: 0, fontSize: 14, color: 'var(--or-color-text-muted)' }}>
        Editando: <strong style={{ color: 'var(--or-color-text)' }}>{steps[active].label}</strong>. Clique em uma etapa concluída
        para revisá-la.
      </p>
    </Stack>
  )
}
```

### Em espaço estreito

Abaixo de ~540px de largura do contêiner, só o rótulo da etapa atual aparece (com o fluxo concluído, o da última); os demais continuam acessíveis.

```tsx
import { Stepper } from '@orangesys/ui'

export default function Narrow() {
  return (
    <div style={{ width: 320, padding: 16, border: '1px solid var(--or-color-border)' }}>
      <Stepper
        aria-label="Abertura de conta"
        step={2}
        steps={[
          { label: 'Conta', description: 'E-mail e senha' },
          { label: 'Perfil', description: 'Nome e telefone' },
          { label: 'Endereço', description: 'Para entrega do cartão' },
          { label: 'Pronto', description: 'Conta ativa' },
        ]}
      />
    </div>
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Concluir uma etapa** — O conector se preenche de laranja da esquerda para a direita (scaleX; na vertical, scaleY) — slow (400ms), ease-out. Ao voltar, ele recua.
- **Nova etapa atual** — O quadrado "salta" (scale 0.72 → 1) logo depois do conector — medium, ease-bounce, 160ms de atraso.
- **Etapa concluída / com erro** — O check é desenhado (stroke-dashoffset); o alerta entra com scale-in — medium.
- **Etapa clicável** — Hover/foco: sublinhado cresce da esquerda e o quadrado acende (medium); clique: afunda (press).

## Props

### `Stepper`

Mostra o progresso em um fluxo de várias etapas (checkout, cadastro,
configuração). Indica etapas concluídas, a atual e as próximas.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `steps` (obrigatória) | `StepperStep[]` | — | Etapas do fluxo, em ordem. |
| `onStepClick` | `((index: number) => void)` | — | Torna as etapas concluídas clicáveis (para voltar e revisar). Etapas atuais e futuras nunca são clicáveis. |
| `orientation` | `"horizontal" \| "vertical"` | `horizontal` | Orientação. A horizontal vira compacta em contêineres estreitos. |
| `step` | `number` | `0` | Índice (a partir de 0) da etapa atual. Etapas anteriores ficam concluídas. Padrão: `0`. |

Repassa também os atributos nativos (`OlHTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`StepperOrientation`:

```ts
export type StepperOrientation = 'horizontal' | 'vertical'
```

`StepperStatus`:

```ts
export type StepperStatus = 'complete' | 'current' | 'upcoming' | 'error'
```

`StepperStep`:

```ts
export interface StepperStep {
  /** Nome da etapa. */
  label: ReactNode
  /** Texto de apoio abaixo do nome. */
  description?: ReactNode
  /** Força um estado. Padrão: calculado a partir de `step`. Use `error` para etapas com problema. */
  status?: StepperStatus
  /** Conteúdo exibido sob a etapa atual (somente na orientação vertical). */
  content?: ReactNode
}
```

## Acessibilidade

Uma `<ol>`: leitores de tela anunciam a posição ("3 de 4"). A etapa atual tem `aria-current="step"`; o estado de cada etapa vem em texto oculto — "(concluído)", "(atual)", "(com erro)". Números, check e alerta são decorativos. Etapas clicáveis são `<button>` nativos.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre as etapas concluídas clicáveis. |
| `Enter` | Volta para a etapa em foco. |
| `Space` | Volta para a etapa em foco. |

- **1.3.1** — Sequência exposta como lista ordenada.
- **1.4.1** — Estados indicados por ícone, preenchimento e texto, não só por cor.
- **2.4.8** — Mostra onde a pessoa está dentro do fluxo.
- **4.1.2** — Etapa atual com aria-current="step".
