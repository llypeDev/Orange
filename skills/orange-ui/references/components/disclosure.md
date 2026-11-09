# Disclosure

Uma única área que se mostra e se esconde, como "Opções avançadas" ou "Por que pedimos isso?", sem precisar de um Accordion.

- Categoria: Exibição de dados · Status: novo
- Importação: `import { Disclosure } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/disclosure (em inglês: https://orange.llypedev.com.br/en/components/disclosure)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-disclosure--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Disclosure

## Boas práticas

- Use para uma área isolada de conteúdo secundário: opções avançadas de um formulário, uma explicação ("Por que pedimos isso?"), os detalhes de um pedido.
- Não esconda o que a pessoa precisa para concluir a tarefa. Se quase todo mundo vai abrir, deixe aberto ou mostre direto.
- Escreva um rótulo curto e específico, que diga o que vai aparecer — nunca "Clique aqui" ou "Mais".
- Campos dentro de um Disclosure fechado continuam montados e enviados com o formulário. Se um deles tiver erro, abra a área (`open`/ `onOpenChange`) para a pessoa ver o problema.
- Use `headingLevel` quando o rótulo funcionar como título de seção (variante `outline`), ajustado à hierarquia da página.

- Faça: Disclosure para uma área isolada.
- Evite: Accordion de um item só: heading obrigatório e navegação por setas sem necessidade.

## Quando usar cada um

- **Disclosure** — Uma área isolada que a pessoa abre se quiser: opções avançadas, "Por que pedimos isso?", detalhes do pedido. O conteúdo pode ter campos, links e listas.
- **Accordion** — Várias seções relacionadas e do mesmo nível (perguntas frequentes, etapas), com headings e navegação por setas entre os cabeçalhos.
- **ExpandableText** — Um texto longo que já começa visível em algumas linhas e se completa com "Mostrar mais" — o botão só aparece quando o texto não cabe.
- **Toggletip** — Uma explicação de uma ou duas frases num balão sobre o conteúdo, aberta por um ícone de informação, sem empurrar o layout.

## Variantes

- **inline (padrão)** — Botão com cara de link e chevron, conteúdo recuado com um fio à esquerda — no fluxo do texto ou de um formulário, como o Details do GOV.UK.
- **outline** — Caixa com borda e cabeçalho em largura total, como um item de Accordion — para blocos que funcionam como seção.

## Exemplos

### Opções avançadas

O padrão é variant="inline". Os campos ficam montados enquanto a área está fechada: o valor não se perde.

```tsx
import { Button, Disclosure, Select, Stack, Switch, TextField } from '@orangesys/ui'

const regioes = [
  { value: 'sa-east-1', label: 'São Paulo (sa-east-1)' },
  { value: 'us-east-1', label: 'Virgínia do Norte (us-east-1)' },
  { value: 'eu-west-1', label: 'Irlanda (eu-west-1)' },
]

export default function AdvancedOptions() {
  return (
    <form style={{ width: '100%', maxWidth: 420 }} onSubmit={(event) => event.preventDefault()}>
      <Stack gap={5}>
        <TextField label="Nome do projeto" defaultValue="Portal do cliente" />
        <Disclosure label="Opções avançadas">
          <Stack gap={4}>
            <Select label="Região do servidor" options={regioes} defaultValue="sa-east-1" />
            <Switch
              label="Backups diários"
              description="Mantidos por 30 dias. Desligue só em ambientes de teste."
              defaultChecked
            />
          </Stack>
        </Disclosure>
        <div>
          <Button type="submit">Criar projeto</Button>
        </div>
      </Stack>
    </form>
  )
}
```

### Por que pedimos isso?

size="sm" logo abaixo de um campo, para uma explicação curta que a maioria não precisa ler.

```tsx
import { Disclosure, Select, Stack } from '@orangesys/ui'

const setores = [
  { value: 'varejo', label: 'Varejo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'industria', label: 'Indústria' },
  { value: 'educacao', label: 'Educação' },
]

export default function WhyWeAsk() {
  return (
    <Stack gap={2} style={{ width: '100%', maxWidth: 360 }}>
      <Select
        label="Setor de atuação"
        placeholder="Selecione o setor"
        options={setores}
        name="setor"
      />
      <Disclosure label="Por que pedimos isso?" size="sm">
        Usamos o setor para sugerir modelos de relatório e integrações que outras empresas parecidas
        com a sua já usam. Essa informação não é compartilhada com terceiros.
      </Disclosure>
    </Stack>
  )
}
```

### Detalhes do pedido

variant="outline" com headingLevel={3}: o botão fica dentro de um <h3> e a caixa lembra um item de Accordion.

```tsx
import { DescriptionList, Disclosure } from '@orangesys/ui'

export default function OrderDetails() {
  return (
    <Disclosure
      label="Ver detalhes do pedido"
      variant="outline"
      headingLevel={3}
      defaultOpen
      style={{ width: '100%' }}
    >
      <DescriptionList
        size="sm"
        items={[
          { term: 'Pedido', description: '#48213' },
          { term: 'Itens', description: ['2× Cadeira ergonômica', '1× Apoio para os pés'] },
          { term: 'Frete', description: 'Grátis — Entrega Expressa Sul' },
          { term: 'Total', description: 'R$ 1.489,90 no Pix' },
        ]}
      />
    </Disclosure>
  )
}
```

### Controlado: abrir quando há erro

Envie com o domínio inválido: o formulário abre a área via open/onOpenChange para mostrar o erro.

```tsx
import { Button, Disclosure, Stack, TextField } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Controlled() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const domain = String(new FormData(event.currentTarget).get('dominio') ?? '').trim()
    if (domain && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domain)) {
      setError('Informe um domínio válido, como loja.suaempresa.com.br.')
      // o erro está dentro da área: abra-a para a pessoa ver e corrigir
      setOpen(true)
    } else {
      setError(undefined)
    }
  }

  return (
    <form style={{ width: '100%', maxWidth: 420 }} onSubmit={handleSubmit} noValidate>
      <Stack gap={5}>
        <TextField label="Nome da loja" defaultValue="Café Serra Azul" />
        <Disclosure label="Opções avançadas" open={open} onOpenChange={setOpen}>
          <TextField
            label="Domínio personalizado"
            name="dominio"
            defaultValue="loja serra azul"
            description="Deixe em branco para usar o endereço padrão."
            error={error}
          />
        </Disclosure>
        <div>
          <Button type="submit">Salvar</Button>
        </div>
      </Stack>
    </form>
  )
}
```

## Movimento

- **Abrir** — Altura via grid-template-rows 0fr → 1fr em --or-duration-slow (400ms), --or-ease-out; o conteúdo entra com fade e 4px de deslocamento.
- **Fechar** — Mais curto: --or-duration-medium (250ms), --or-ease-in-out. Inerte durante a saída; recebe hidden quando a transição termina.
- **Chevron** — Gira 180° em --or-duration-medium (250ms), --or-ease-spring.
- **Hover e foco** — Mesma resposta: no inline, o sublinhado engrossa (1px → 2px); no outline, o cabeçalho ganha fundo. --or-duration-fast (160ms).
- **Pressionar** — Inline: o botão afunda 1px (scale 0.985). Outline: o chevron encolhe 12%. --or-duration-press (90ms).

## Props

### `Disclosure`

Uma área que se mostra e se esconde, fora de um Accordion (padrão
"disclosure" do WAI-ARIA): um `<button>` com `aria-expanded` e
`aria-controls` e o conteúdo logo abaixo. O conteúdo fechado continua
montado (preserva o estado de campos), fica `inert` durante a saída e
recebe `hidden` quando a transição termina.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Texto do botão que mostra e esconde o conteúdo ("Opções avançadas", "Por que pedimos isso?"). |
| `defaultOpen` | `boolean` | `false` | Aberto inicialmente (não controlado). Padrão: `false`. |
| `disabled` | `boolean` | `false` | Desabilita o botão (o conteúdo mantém o estado atual). |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | — | Envolve o botão em um heading (`h2`–`h6`). Sem esta prop, não há heading. |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado ao abrir ou fechar. |
| `open` | `boolean` | — | Aberto (controlado). |
| `size` | `"sm" \| "md"` | `md` | Tamanho do texto e dos espaçamentos. Padrão: `md`. |
| `variant` | `"outline" \| "inline"` | `inline` | `inline` (padrão): botão com cara de link e conteúdo recuado com um fio à esquerda. `outline`: caixa com borda, como um item de Accordion. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão **Disclosure** do WAI-ARIA APG: o gatilho é um `<button>` nativo com `aria-expanded` e `aria-controls`; o conteúdo tem `role="group"` rotulado pelo botão. Ao fechar, o conteúdo fica `inert` na hora (fora do Tab e dos leitores de tela) e recebe `hidden` quando a transição termina. Com `headingLevel`, o botão fica dentro de um heading e aparece na navegação por títulos.

| Teclas | Ação |
| --- | --- |
| `Enter` | Abre ou fecha a área. |
| `Space` | Abre ou fecha a área. |
| `Tab` | Vai do botão para o conteúdo aberto; com a área fechada, pula o conteúdo. |

- **1.3.1** — Botão opcionalmente dentro de heading; conteúdo ligado por aria-controls e rotulado pelo botão.
- **1.4.1** — Estado indicado pelo chevron (para baixo/para cima), não só pela cor.
- **2.1.1** — Enter e Espaço nativos do <button>.
- **2.3.3** — A animação de altura é desativada com prefers-reduced-motion.
- **2.4.3** — Conteúdo fechado fica inerte e oculto: o foco nunca cai em algo invisível.
- **2.4.7** — Foco visível com contorno de 2px.
- **2.5.8** — Alvo de pelo menos 24px de altura.
- **4.1.2** — Estado exposto com `aria-expanded`.
