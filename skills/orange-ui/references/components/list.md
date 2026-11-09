# List

Listas com os marcadores do Orange: quadrado laranja, numeração "01", ícones, divisórias ou itens em linha.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { List, ListItem } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/list (em inglês: https://orange.llypedev.com.br/en/components/list)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-list--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/List

## Boas práticas

- Use **numbered** quando a ordem importa (passos, ranking) — ela renderiza um `<ol>`. Nas demais variantes, a ordem não carrega significado.
- Mantenha os itens paralelos: mesma estrutura gramatical e tamanho parecido. Comece com a informação mais importante.
- Na variante icon, o ícone reforça o texto — ele é decorativo e não é anunciado. Não dependa só dele para transmitir significado.
- Para pares rótulo/valor, use DescriptionList; para dados com várias colunas, use Table.

## Variantes

- **bullet** — Marcador quadrado laranja de 6px — a assinatura do Orange.
- **numbered** — "01", "02"… em Space Grotesk, num <ol>. Aceita start.
- **icon** — Um ícone por item (da List ou do próprio ListItem).
- **divided** — Sem marcador, com linhas de 1px entre os itens.
- **inline** — Itens na mesma linha separados por "·".
- **plain** — Sem marcador nem divisórias.

## Exemplos

### Marcadores

```tsx
import { List, ListItem } from '@orangesys/ui'

export default function Bullet() {
  return (
    <List>
      <ListItem>Faturas em PDF e XML enviadas por e-mail</ListItem>
      <ListItem>Conciliação bancária automática todos os dias</ListItem>
      <ListItem>Suporte em português de segunda a sábado</ListItem>
    </List>
  )
}
```

### Numerada com descrição

A numeração "01" é desenhada por CSS; leitores de tela recebem a ordem pelo próprio <ol>.

```tsx
import { List, ListItem } from '@orangesys/ui'

export default function Numbered() {
  return (
    <List variant="numbered" size="lg" style={{ maxWidth: 480 }}>
      <ListItem description="Use o e-mail corporativo da sua empresa.">Crie sua conta</ListItem>
      <ListItem description="Adicione quem vai aprovar pagamentos e emitir notas.">Convide a equipe</ListItem>
      <ListItem description="A integração com o banco leva menos de 2 minutos.">Conecte sua conta bancária</ListItem>
    </List>
  )
}
```

### Com ícones

Defina um ícone para a lista e sobrescreva em itens específicos.

```tsx
import { Icon, List, ListItem } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <List variant="icon" icon={<Icon name="check" />}>
      <ListItem>Backups diários com retenção de 30 dias</ListItem>
      <ListItem>Login único (SSO) com Google e Microsoft</ListItem>
      <ListItem icon={<Icon name="lock" />}>Dados criptografados em repouso e em trânsito</ListItem>
      <ListItem icon={<Icon name="globe" />}>Servidores no Brasil</ListItem>
    </List>
  )
}
```

### Com divisórias

```tsx
import { List, ListItem } from '@orangesys/ui'

export default function Divided() {
  return (
    <List variant="divided" aria-label="Membros da equipe" style={{ width: '100%', maxWidth: 420 }}>
      <ListItem description="Administradora · último acesso há 2 horas">Ana Souza</ListItem>
      <ListItem description="Financeiro · último acesso ontem">Bruno Lima</ListItem>
      <ListItem description="Leitura · convite pendente">Carla Mendes</ListItem>
    </List>
  )
}
```

### Em linha

Para metadados curtos e links de rodapé. O separador "·" não é lido por leitores de tela.

```tsx
import { List, ListItem } from '@orangesys/ui'

export default function Inline() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <List variant="inline" size="sm" aria-label="Detalhes do arquivo" style={{ color: 'var(--or-color-text-muted)' }}>
        <ListItem>PDF</ListItem>
        <ListItem>2,4 MB</ListItem>
        <ListItem>Atualizado em 28 de out.</ListItem>
      </List>
      <nav aria-label="Rodapé">
        <List variant="inline" size="sm">
          <ListItem>
            <a href="#termos">Termos de uso</a>
          </ListItem>
          <ListItem>
            <a href="#privacidade">Privacidade</a>
          </ListItem>
          <ListItem>
            <a href="#status">Status do serviço</a>
          </ListItem>
        </List>
      </nav>
    </div>
  )
}
```

### Entrada animada

Para listas de destaque em páginas de apresentação: os itens entram escalonados ao aparecer na tela.

```tsx
import { Button, Icon, List, ListItem } from '@orangesys/ui'
import { useState } from 'react'

export default function Animated() {
  // Trocar a key remonta a lista e repete a entrada.
  const [rodada, setRodada] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      <div>
        <Button size="sm" variant="outline" startIcon={<Icon name="refresh" />} onClick={() => setRodada((r) => r + 1)}>
          Repetir animação
        </Button>
      </div>
      <List key={rodada} variant="numbered" size="lg" animated>
        <ListItem description="Importe faturas e extratos em poucos cliques.">Conecte seus bancos</ListItem>
        <ListItem description="Regras automáticas casam lançamentos e pagamentos.">Concilie todos os dias</ListItem>
        <ListItem description="Relatórios prontos para a reunião de fechamento.">Feche o mês sem planilhas</ListItem>
      </List>
    </div>
  )
}
```

## Props

### `List`

Lista de itens com marcadores do Orange. Use `ul` quando a ordem não importa
e `numbered` (`ol`) para passos e rankings.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `animated` | `boolean` | `false` | Os itens entram escalonados (subindo 24px, 80ms entre eles) quando a lista aparece na tela. Para listas de destaque em páginas de apresentação. |
| `as` | `"ol" \| "ul"` | — | Elemento da lista. Padrão: `ol` para `numbered`, `ul` para as demais. |
| `icon` | `ReactNode` | — | Ícone padrão dos itens na variante `icon` (cada `ListItem` pode sobrescrever). |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Tamanho do texto e do espaçamento entre itens. Padrão: `md`. |
| `start` | `number` | — | Número inicial da variante `numbered`. Padrão: `1`. |
| `variant` | `"inline" \| "icon" \| "plain" \| "divided" \| "bullet" \| "numbered"` | `bullet` | `bullet` (marcador quadrado laranja), `numbered` ("01", "02"…), `icon` (ícone por item), `divided` (linhas entre itens), `inline` (itens na mesma linha separados por "·") ou `plain` (sem marcador). Padrão: `bullet`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `ListItem`

Item de `List`. Aceita uma descrição secundária opcional.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `description` | `ReactNode` | — | Texto secundário exibido abaixo do conteúdo principal. |
| `icon` | `ReactNode` | — | Ícone do item (variante `icon`). Sobrescreve o `icon` da `List`. |

Repassa também os atributos nativos (`LiHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

- **Entrada (animated)** — Cada item sobe 24px e aparece — 600ms, ease-out, 80ms entre itens.
- **Marcadores** — Quadrado, numeração ou ícone surgem com "pop" (escala 0.4 → 1) — 250ms, ease-bounce.
- **Sem animated** — A lista é estática: itens não são interativos, então não há hover.
- **Movimento reduzido** — Nada é escondido: a lista aparece direto.

## Acessibilidade

Usa `<ul>`/`<ol>` e `<li>` nativos. Como os marcadores padrão são removidos, a lista recebe `role="list"` explícito — sem ele, o VoiceOver no Safari deixa de anunciá-la como lista. Números, quadrados, ícones e o separador "·" são decorativos e ficam fora da leitura.

- **1.3.1** — Estrutura de lista e quantidade de itens expostas a tecnologias assistivas.
- **1.3.2** — Listas numeradas usam <ol>, preservando a sequência significativa.
- **1.4.1** — Nenhuma informação depende só da cor do marcador ou do ícone.
