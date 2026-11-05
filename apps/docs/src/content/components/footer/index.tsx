import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import BottomOnly from './examples/BottomOnly'
import BottomOnlyCode from './examples/BottomOnly?raw'
import WithRouter from './examples/WithRouter'
import WithRouterCode from './examples/WithRouter?raw'
import { meta } from './meta'

export default function FooterPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use um Footer por página, fora do <Code>&lt;main&gt;</Code>: no nível da página ele vira o landmark
                  "contentinfo". Dentro de um AppShell, passe-o no slot <Code>footer</Code>.
                </>
              ),
              en: (
                <>
                  Use one Footer per page, outside <Code>&lt;main&gt;</Code>: at page level it becomes the
                  "contentinfo" landmark. Inside an AppShell, pass it to the <Code>footer</Code> slot.
                </>
              ),
            },
            {
              pt: 'Até cinco colunas, com títulos de uma ou duas palavras e de três a seis links cada. Links que ninguém procura no rodapé ficam de fora.',
              en: 'Up to five columns, with one- or two-word titles and three to six links each. Leave out links nobody looks for in a footer.',
            },
            {
              pt: (
                <>
                  Marque links para outros sites com <Code>external</Code>: eles abrem em nova aba, mostram o ↗ e avisam
                  leitores de tela. Não use <Code>external</Code> para páginas do próprio produto.
                </>
              ),
              en: (
                <>
                  Mark links to other sites with <Code>external</Code>: they open in a new tab, show the ↗ and tell
                  screen readers. Don't use <Code>external</Code> for pages of your own product.
                </>
              ),
            },
            {
              pt: 'A barra inferior é para copyright, termos e versão — nada que o usuário precise para concluir uma tarefa.',
              en: 'The bottom bar is for copyright, terms and version — nothing users need to finish a task.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Marca', en: 'Brand' }, description: { pt: 'brand (logo com link para o início) e description (frase curta).', en: 'brand (logo linking home) and description (short tagline).' } },
            { term: { pt: 'Mapa do site', en: 'Site map' }, description: { pt: 'Um <nav> nomeado com as colunas; cada coluna é um heading em caixa alta e uma lista de links.', en: 'A named <nav> with the columns; each column is an uppercase heading and a list of links.' } },
            { term: { pt: 'Barra inferior', en: 'Bottom bar' }, description: { pt: 'bottom: copyright, termos, versão. Itens se distribuem nas pontas e quebram linha.', en: 'bottom: copyright, terms, version. Items spread to both ends and wrap.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Site do produto', en: 'Product site' }}
          description={{
            pt: 'Cinco colunas ao lado da marca. Abaixo de ≈ 52rem o mapa vai para baixo da marca; as colunas se reorganizam (mínimo de 9rem cada, duas no celular).',
            en: 'Five columns next to the brand. Below ≈ 52rem the map moves under the brand; columns reflow (at least 9rem each, two on phones).',
          }}
          code={BasicCode}
          align="stretch"
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Painel com roteador', en: 'Dashboard with a router' }}
          description={{
            pt: 'renderLink renderiza os links internos com o componente do roteador; os externos continuam <a> nativos.',
            en: 'renderLink renders internal links with your router component; external ones stay native <a>.',
          }}
          code={WithRouterCode}
          align="stretch"
        >
          <WithRouter />
        </Example>
        <Example
          title={{ pt: 'Só a barra inferior', en: 'Bottom bar only' }}
          description={{ pt: 'Sem colunas, o Footer não renderiza o <nav>.', en: 'Without columns, the Footer does not render the <nav>.' }}
          code={BottomOnlyCode}
          align="stretch"
        >
          <BottomOnly />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover ou foco em um link', en: 'Hover or focus on a link' }, description: { pt: 'Como no zop.dev: o link desliza 2px para a direita e clareia para a cor do texto; uma seta laranja surge à direita vindo de 4px atrás. --or-duration-fast (160ms), --or-ease-out.', en: 'Like zop.dev: the link slides 2px right and brightens to the text color; an orange arrow appears on the right, coming from 4px behind. --or-duration-fast (160ms), --or-ease-out.' } },
            { term: { pt: 'Link externo', en: 'External link' }, description: { pt: 'Sem a seta: o ↗ fica laranja e sobe 2px na diagonal.', en: 'No arrow: the ↗ turns orange and moves 2px diagonally.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Sem deslocamento: só a cor muda, e a seta aparece direto.', en: 'No movement: only the color changes, and the arrow appears instantly.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'brand', type: 'ReactNode', description: { pt: 'Marca (logo com link para o início).', en: 'Brand (logo linking home).' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Frase curta sob a marca.', en: 'Short tagline under the brand.' } },
            { name: 'columns', type: '{ title: string; links: { label; href; external? }[] }[]', description: { pt: 'Colunas do mapa do site.', en: 'Site map columns.' } },
            { name: 'bottom', type: 'ReactNode', description: { pt: 'Barra inferior (copyright, termos).', en: 'Bottom bar (copyright, terms).' } },
            { name: 'navLabel', type: 'string', default: "'Mapa do site'", description: { pt: 'Nome do <nav> do mapa do site.', en: 'Name of the site map <nav>.' } },
            { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '2', description: { pt: 'Nível dos headings das colunas.', en: 'Column heading level.' } },
            { name: 'renderLink', type: '(props) => ReactNode', description: { pt: 'Renderiza os links internos com o componente do roteador.', en: 'Renders internal links with your router component.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: { pt: 'Atributos nativos do <footer>.', en: 'Native <footer> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                A raiz é um <Code>&lt;footer&gt;</Code> e o mapa do site é um <Code>&lt;nav&gt;</Code> nomeado ("Mapa do
                site"). Cada coluna tem um heading real e uma lista ligada a ele por <Code>aria-labelledby</Code>: o
                leitor de tela anuncia "Produto, lista, 4 itens". Links externos terminam com "(abre em nova aba)" no
                nome acessível; o ↗ é decorativo.
              </>
            }
            en={
              <>
                The root is a <Code>&lt;footer&gt;</Code> and the site map is a named <Code>&lt;nav&gt;</Code> ("Site
                map"). Each column has a real heading and a list tied to it with <Code>aria-labelledby</Code>: screen
                readers announce "Product, list, 4 items". External links end with "(opens in a new tab)" in their
                accessible name; the ↗ is decorative.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre a marca e os links, coluna por coluna, e depois a barra inferior.', en: 'Moves through the brand and links, column by column, then the bottom bar.' } },
            { keys: ['Enter'], description: { pt: 'Segue o link focado.', en: 'Follows the focused link.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Colunas como heading + lista; o mapa do site em um nav nomeado.', en: 'Columns as heading + list; the site map in a named nav.' } },
            { criterion: '2.4.4', description: { pt: 'O nome de cada link diz o destino; externos avisam que abrem em nova aba.', en: 'Each link name says where it goes; external ones say they open in a new tab.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px, com a mesma resposta do hover.', en: 'Visible focus with a 2px orange outline, with the same response as hover.' } },
            { criterion: '1.4.10', description: { pt: 'Colunas e barra inferior se reorganizam em 320px, sem rolagem horizontal.', en: 'Columns and the bottom bar reflow at 320px, without horizontal scrolling.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
