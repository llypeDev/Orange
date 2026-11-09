# Container

Centraliza o conteúdo da página com largura máxima e margens laterais que encolhem no celular.

- Categoria: Layout · Status: estável
- Importação: `import { Container } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/container (em inglês: https://orange.llypedev.com.br/en/components/container)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-container--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Container

## Boas práticas

- Use um Container por faixa de conteúdo da página (cabeçalho, conteúdo, rodapé) para que todas alinhem nas mesmas margens. Fundos de borda a borda ficam num elemento por fora, com o Container dentro.
- Escolha o tamanho pelo conteúdo: `sm` para formulários e textos (linhas curtas são mais fáceis de ler), `xl` (padrão) para páginas do produto com grades e tabelas.
- Não aninhe Containers: o de dentro somaria mais uma margem lateral. Dentro dele, organize com Stack e Grid. Para o conteúdo principal, use `as="main"`.

## Tamanhos e gutter

- **sm** — 640px de conteúdo — formulários, login, textos longos.
- **md** — 768px — artigos, configurações.
- **lg** — 1024px — listas, tabelas, painéis compactos.
- **xl (padrão)** — 1200px (--or-layout-max-width) — a largura da grade do Orange.
- **full** — Sem limite de largura, só com o gutter — ferramentas e mapas que usam a tela toda.
- **Gutter** — Margem lateral responsiva: 16px no celular, 24px a partir de 768px e 32px (--or-layout-gutter) a partir de 1024px. Fica por fora da largura máxima: xl mostra 1200px de conteúdo.

## Exemplos

### Tamanhos

Em janelas largas, sm e md ficam visivelmente mais estreitos e centralizados; lg e xl ocupam a prévia inteira. No celular, todos usam a largura toda com 16px de margem.

```tsx
import { Container, Paper, Stack, Text } from '@orangesys/ui'

const tamanhos = [
  { size: 'sm', uso: '640px — formulários e textos longos' },
  { size: 'md', uso: '768px — artigos e configurações' },
  { size: 'lg', uso: '1024px — listas e tabelas' },
  { size: 'xl', uso: '1200px (padrão) — páginas do produto' },
] as const

export default function Tamanhos() {
  return (
    <Stack gap={3}>
      {tamanhos.map((t) => (
        <Container key={t.size} size={t.size}>
          <Paper tone="subtle" padding={3}>
            <Text size="sm">
              <strong>size="{t.size}"</strong> · {t.uso}
            </Text>
          </Paper>
        </Container>
      ))}
    </Stack>
  )
}
```

### Página do painel

Os três componentes de layout juntos: Container para a largura e as margens, Stack para o cabeçalho (empilhado no celular, em linha no desktop) e Grid bordered para as métricas.

```tsx
import { Button, Container, Grid, Heading, Icon, Stack, Stat, Text } from '@orangesys/ui'

export default function Pagina() {
  return (
    // Container dá a largura máxima e as margens laterais; Stack e Grid organizam o resto.
    // Numa página real, o Container do conteúdo principal costuma ser as="main".
    <Container as="section" size="lg" aria-labelledby="titulo-visao-geral">
      <Stack gap={8}>
        <Stack
          direction={{ base: 'vertical', md: 'horizontal' }}
          justify="between"
          align="start"
          gap={4}
        >
          <Stack gap={1}>
            <Heading level={4} id="titulo-visao-geral">
              Visão geral da loja
            </Heading>
            <Text size="sm" tone="muted">
              Março de 2026 · atualizado há 5 minutos
            </Text>
          </Stack>
          <Button variant="outline" startIcon={<Icon name="download" />}>
            Exportar relatório
          </Button>
        </Stack>

        <Grid variant="bordered" columns={{ base: 1, sm: 3 }} gap={5}>
          <Stat size="sm" label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" />
          <Stat size="sm" label="Pedidos" value="1.284" delta="4%" trend="increase" />
          <Stat size="sm" label="Ticket médio" value="R$ 37,50" delta="2%" trend="decrease" />
        </Grid>
      </Stack>
    </Container>
  )
}
```

## Movimento

- **Container** — Sem movimento próprio. O gutter muda de tamanho na hora ao cruzar um breakpoint.
- **Entrada de conteúdo** — Anime o conteúdo, não o Container: use Reveal nos blocos dentro dele (veja Grid → Movimento para a entrada escalonada).

## Props

### `Container`

Centraliza o conteúdo da página com largura máxima e margens laterais
(gutter) que encolhem no celular: 16px, 24px a partir de 768px e 32px
(`--or-layout-gutter`) a partir de 1024px.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `div` | Elemento renderizado. Padrão: `div`. Use `main` para o conteúdo principal da página ou `section` com um título. |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `xl` | Largura máxima do conteúdo: `sm` 640px (formulários, texto), `md` 768px, `lg` 1024px, `xl` 1200px (`--or-layout-max-width`, padrão) ou `full` (sem limite, só com as margens laterais). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ContainerSize`:

```ts
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
```

## Acessibilidade

O Container é puramente visual. Use `as` para dar estrutura à página: `main` para o conteúdo principal (um por página), `header`/ `footer` para as faixas de cabeçalho e rodapé, ou `section` com `aria-labelledby` apontando para o título.

| Teclas | Ação |
| --- | --- |
| `Tab` | Sem interação própria: o foco passa pelo conteúdo na ordem do código. |

- **1.3.1** — Landmarks reais via as (main, header, footer, section).
- **1.4.8** — size="sm" mantém linhas de texto curtas e confortáveis de ler.
- **1.4.10** — Gutter de 16px no celular e largura fluida: sem rolagem horizontal a 320px.
