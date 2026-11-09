# Footer

Rodapé do site: marca, mapa do site em colunas e barra inferior com informações legais.

- Categoria: Layout · Status: estável
- Importação: `import { Footer } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/footer (em inglês: https://orange.llypedev.com.br/en/components/footer)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-footer--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Footer

## Boas práticas

- Use um Footer por página, fora do `<main>`: no nível da página ele vira o landmark "contentinfo". Dentro de um AppShell, passe-o no slot `footer`.
- Até cinco colunas, com títulos de uma ou duas palavras e de três a seis links cada. Links que ninguém procura no rodapé ficam de fora.
- Marque links para outros sites com `external`: eles abrem em nova aba, mostram o ↗ e avisam leitores de tela. Não use `external` para páginas do próprio produto.
- A barra inferior é para copyright, termos e versão — nada que o usuário precise para concluir uma tarefa.

## Anatomia

- **Marca** — brand (logo com link para o início) e description (frase curta).
- **Mapa do site** — Um <nav> nomeado com as colunas; cada coluna é um heading em caixa alta e uma lista de links.
- **Barra inferior** — bottom: copyright, termos, versão. Itens se distribuem nas pontas e quebram linha.

## Exemplos

### Site do produto

Cinco colunas ao lado da marca. Abaixo de ≈ 52rem o mapa vai para baixo da marca; as colunas se reorganizam (mínimo de 9rem cada, duas no celular).

```tsx
import { Footer, Icon } from '@orangesys/ui'

export default function Basic() {
  return (
    <Footer
      brand={
        <a href="#inicio" aria-label="Aurora Commerce — início">
          <Icon name="layers" /> Aurora
        </a>
      }
      navLabel="Mapa do site da Aurora"
      description="Gestão de pedidos, estoque e entregas para lojas independentes."
      columns={[
        {
          title: 'Produto',
          links: [
            { label: 'Pedidos', href: '#pedidos' },
            { label: 'Catálogo', href: '#catalogo' },
            { label: 'Estoque', href: '#estoque' },
            { label: 'Relatórios', href: '#relatorios' },
          ],
        },
        {
          title: 'Para lojistas',
          links: [
            { label: 'Planos e preços', href: '#planos' },
            { label: 'Integrações', href: '#integracoes' },
            { label: 'Casos de sucesso', href: '#casos' },
          ],
        },
        {
          title: 'Ajuda',
          links: [
            { label: 'Central de ajuda', href: '#ajuda' },
            { label: 'Fale com o suporte', href: '#suporte' },
            { label: 'Status do serviço', href: 'https://status.example.com', external: true },
          ],
        },
        {
          title: 'Empresa',
          links: [
            { label: 'Sobre', href: '#sobre' },
            { label: 'Carreiras', href: '#carreiras' },
            { label: 'Imprensa', href: '#imprensa' },
          ],
        },
        {
          title: 'Desenvolvedores',
          links: [
            { label: 'Documentação da API', href: 'https://docs.example.com', external: true },
            {
              label: 'Webhooks de pedidos',
              href: 'https://docs.example.com/webhooks',
              external: true,
            },
          ],
        },
      ]}
      bottom={
        <>
          <span>© 2026 Aurora Commerce</span>
          <span>
            <a href="#termos">Termos de uso</a> · <a href="#privacidade">Privacidade</a>
          </span>
        </>
      }
    />
  )
}
```

### Painel com roteador

renderLink renderiza os links internos com o componente do roteador; os externos continuam <a> nativos.

```tsx
import { Footer } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  return (
    <Footer
      // Links internos usam o roteador; os externos continuam <a> com nova aba.
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      navLabel="Links do painel"
      columns={[
        {
          title: 'Conta',
          links: [
            { label: 'Plano e faturas', href: '/configuracoes/faturamento' },
            { label: 'Equipe e permissões', href: '/configuracoes/equipe' },
            { label: 'Notificações', href: '/configuracoes/notificacoes' },
          ],
        },
        {
          title: 'Ajuda',
          links: [
            { label: 'Primeiros passos', href: '/ajuda/primeiros-passos' },
            { label: 'Status do serviço', href: 'https://status.example.com', external: true },
          ],
        },
      ]}
      bottom={
        <>
          <span>Aurora Commerce · versão 4.12</span>
          <span>Dados atualizados há 2 minutos</span>
        </>
      }
    />
  )
}
```

### Só a barra inferior

Sem colunas, o Footer não renderiza o <nav>.

```tsx
import { Footer } from '@orangesys/ui'

export default function BottomOnly() {
  // Telas internas (checkout, painel): só a barra inferior, sem mapa do site.
  return (
    <Footer
      bottom={
        <>
          <span>© 2026 Aurora Commerce</span>
          <span>
            <a href="#termos">Termos de uso</a> · <a href="#privacidade">Privacidade</a> ·{' '}
            <a href="#ajuda">Ajuda</a>
          </span>
        </>
      }
    />
  )
}
```

## Movimento

- **Hover ou foco em um link** — Como no zop.dev: o link desliza 2px para a direita e clareia para a cor do texto; uma seta laranja surge à direita vindo de 4px atrás. --or-duration-fast (160ms), --or-ease-out.
- **Link externo** — Sem a seta: o ↗ fica laranja e sobe 2px na diagonal.
- **Movimento reduzido** — Sem deslocamento: só a cor muda, e a seta aparece direto.

## Props

### `Footer`

Rodapé do site no formato do zop.dev: marca e frase, mapa do site em
colunas com títulos em caixa alta e uma barra inferior.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `bottom` | `ReactNode` | — | Barra inferior: copyright, termos, versão. |
| `brand` | `ReactNode` | — | Marca (logo com link para o início). |
| `columns` | `FooterColumn[]` | `[]` | Colunas do mapa do site (até 5 por linha em telas largas). |
| `description` | `ReactNode` | — | Frase curta sob a marca. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Nível dos headings das colunas. Padrão: `2`. |
| `navLabel` | `string` | — | Nome da navegação do mapa do site. Padrão: `t('footerNavLabel')` ("Mapa do site"). |
| `renderLink` | `RenderLink` | — | Renderiza os links internos com o componente do seu roteador: `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`. Links `external` continuam sendo `<a>` nativos. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`FooterColumn`:

```ts
/** Uma coluna do mapa do site: título curto em caixa alta e a lista de links. */
export interface FooterColumn {
  /** Título da coluna (vira um heading). */
  title: string
  links: FooterLinkItem[]
}
```

`FooterHeadingLevel`:

```ts
export type FooterHeadingLevel = 2 | 3 | 4 | 5 | 6
```

`FooterLinkItem`:

```ts
/** Um link de uma coluna do rodapé. */
export interface FooterLinkItem {
  /** Texto do link. */
  label: string
  /** Destino. */
  href: string
  /**
   * Link para outro site: abre em nova aba (`rel="noopener noreferrer"`),
   * mostra o ícone ↗ colado à última palavra e avisa leitores de tela.
   */
  external?: boolean
}
```

## Acessibilidade

A raiz é um `<footer>` e o mapa do site é um `<nav>` nomeado ("Mapa do site"). Cada coluna tem um heading real e uma lista ligada a ele por `aria-labelledby`: o leitor de tela anuncia "Produto, lista, 4 itens". Links externos terminam com "(abre em nova aba)" no nome acessível; o ↗ é decorativo.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre a marca e os links, coluna por coluna, e depois a barra inferior. |
| `Enter` | Segue o link focado. |

- **1.3.1** — Colunas como heading + lista; o mapa do site em um nav nomeado.
- **2.4.4** — O nome de cada link diz o destino; externos avisam que abrem em nova aba.
- **2.4.7** — Foco visível com contorno laranja de 2px, com a mesma resposta do hover.
- **1.4.10** — Colunas e barra inferior se reorganizam em 320px, sem rolagem horizontal.
