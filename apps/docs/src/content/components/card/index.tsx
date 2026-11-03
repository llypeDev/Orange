import {
  Bullets,
  Callout,
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
import Interactive from './examples/Interactive'
import InteractiveCode from './examples/Interactive?raw'
import Product from './examples/Product'
import ProductCode from './examples/Product?raw'
import Variants from './examples/Variants'
import VariantsCode from './examples/Variants?raw'
import { meta } from './meta'

export default function CardPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use cartões para agrupar informações sobre um único assunto (um produto, um relatório, um plano) em coleções que o usuário compara ou percorre.',
              en: 'Use cards to group information about a single subject (a product, a report, a plan) in collections users compare or browse.',
            },
            {
              pt: (
                <>
                  Para o cartão inteiro ser clicável, use <Code>interactive</Code> com um título-link (
                  <Code>href</Code>). Não envolva o cartão em um <Code>&lt;a&gt;</Code>: o leitor de tela leria todo o
                  conteúdo como nome do link.
                </>
              ),
              en: (
                <>
                  To make the whole card clickable, use <Code>interactive</Code> with a title link (<Code>href</Code>).
                  Do not wrap the card in an <Code>&lt;a&gt;</Code>: screen readers would read the entire content as the
                  link name.
                </>
              ),
            },
            {
              pt: (
                <>
                  Ajuste <Code>headingLevel</Code> à hierarquia da página e use <Code>as="li"</Code> dentro de listas ou{' '}
                  <Code>as="article"</Code> para conteúdo independente.
                </>
              ),
              en: (
                <>
                  Set <Code>headingLevel</Code> to match the page hierarchy and use <Code>as="li"</Code> inside lists or{' '}
                  <Code>as="article"</Code> for standalone content.
                </>
              ),
            },
            {
              pt: 'Reserve a variante accent para destacar um item (o plano recomendado, uma novidade) — não para todos.',
              en: 'Reserve the accent variant to highlight one item (the recommended plan, something new) — not all of them.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'CardMedia', en: 'CardMedia' }, description: { pt: 'Imagem de borda a borda, no topo ou na base. Proporção via ratio.', en: 'Edge-to-edge image at the top or bottom. Aspect ratio via ratio.' } },
            { term: { pt: 'CardHeader', en: 'CardHeader' }, description: { pt: 'Eyebrow, título (heading, opcionalmente link), descrição e ações.', en: 'Eyebrow, title (heading, optionally a link), description and actions.' } },
            { term: { pt: 'CardBody', en: 'CardBody' }, description: { pt: 'Conteúdo principal; cresce para alinhar rodapés em grades.', en: 'Main content; grows to align footers in grids.' } },
            { term: { pt: 'CardFooter', en: 'CardFooter' }, description: { pt: 'Ações ou metadados, sempre na base do cartão. divider adiciona uma linha.', en: 'Actions or metadata, always at the bottom. divider adds a line.' } },
            { term: { pt: 'CardLink', en: 'CardLink' }, description: { pt: 'Link do título; aceita o Link do seu roteador via as.', en: "The title link; accepts your router's Link via as." } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{ pt: 'Cabeçalho, corpo e rodapé com ações.', en: 'Header, body and footer with actions.' }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Variantes', en: 'Variants' }}
          description={{
            pt: 'outline (borda de 1px, padrão), raised (superfície elevada) e accent (borda superior laranja de 2px).',
            en: 'outline (1px border, default), raised (raised surface) and accent (2px orange top border).',
          }}
          code={VariantsCode}
          align="stretch"
        >
          <Variants />
        </Example>
        <Example
          title={{ pt: 'Cartão clicável', en: 'Clickable card' }}
          description={{
            pt: 'Com interactive, o link do título se estende por todo o cartão e o hover ganha a sombra laranja. O botão de salvar continua sendo um alvo independente.',
            en: 'With interactive, the title link stretches over the whole card and hover gets the orange shadow. The save button remains an independent target.',
          }}
          code={InteractiveCode}
          align="stretch"
        >
          <Interactive />
        </Example>
        <Example
          title={{ pt: 'Produto com mídia', en: 'Product with media' }}
          description={{
            pt: 'CardMedia no topo, sem padding lateral. O rodapé com divider separa a ação principal.',
            en: 'CardMedia at the top, without side padding. The footer with divider sets the main action apart.',
          }}
          code={ProductCode}
        >
          <Product />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Card', en: 'Card' }}
          rows={[
            { name: 'variant', type: "'outline' | 'raised' | 'accent'", default: "'outline'", description: { pt: 'Estilo visual.', en: 'Visual style.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Espaçamento interno (16, 24 ou 32px) e tamanho do título.', en: 'Inner spacing (16, 24 or 32px) and title size.' } },
            { name: 'interactive', type: 'boolean', default: 'false', description: { pt: 'Cartão inteiro clicável através do CardLink.', en: 'Whole card clickable through the CardLink.' } },
            { name: 'as', type: 'ElementType', default: "'div'", description: { pt: 'Elemento raiz (article, li, section…).', en: 'Root element (article, li, section…).' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'CardHeader', en: 'CardHeader' }}
          rows={[
            { name: 'title', type: 'ReactNode', description: { pt: 'Título (heading).', en: 'Title (heading).' } },
            { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: { pt: 'Nível do heading.', en: 'Heading level.' } },
            { name: 'href', type: 'string', description: { pt: 'Transforma o título em CardLink.', en: 'Turns the title into a CardLink.' } },
            { name: 'linkProps', type: 'CardLinkProps', description: { pt: <>Props do link (ex.: <Code>{'{ as: RouterLink, to: "/x" }'}</Code>).</>, en: <>Link props (e.g. <Code>{'{ as: RouterLink, to: "/x" }'}</Code>).</> } },
            { name: 'eyebrow', type: 'ReactNode', description: { pt: 'Rótulo em caixa alta acima do título.', en: 'Uppercase label above the title.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio abaixo do título.', en: 'Supporting text below the title.' } },
            { name: 'actions', type: 'ReactNode', description: { pt: 'Ações à direita (botões de ícone, menus).', en: 'Actions on the right (icon buttons, menus).' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'CardMedia, CardFooter, CardLink', en: 'CardMedia, CardFooter, CardLink' }}
          rows={[
            { name: 'src / alt', type: 'string', description: { pt: <>CardMedia: imagem e texto alternativo (<Code>""</Code> se decorativa).</>, en: <>CardMedia: image and alt text (<Code>""</Code> if decorative).</> } },
            { name: 'ratio', type: 'string | number', default: "'16/9'", description: { pt: 'CardMedia: proporção da área de mídia.', en: 'CardMedia: media aspect ratio.' } },
            { name: 'divider', type: 'boolean', default: 'false', description: { pt: 'CardFooter: linha acima do rodapé.', en: 'CardFooter: line above the footer.' } },
            { name: 'as', type: 'ElementType', default: "'a'", description: { pt: 'CardLink: componente de link do roteador.', en: "CardLink: your router's link component." } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O cartão clicável usa o padrão de <strong>link esticado</strong>: o único link é o título (dentro do
                heading), e um pseudo-elemento <Code>::after</Code> estende sua área de clique sobre o cartão. Assim o
                nome do link é curto ("Vendas do 3º trimestre"), a navegação por headings e por links continua útil e o
                foco desenha um contorno ao redor do cartão inteiro. Botões e links internos ficam acima da camada e
                continuam funcionando.
              </>
            }
            en={
              <>
                The clickable card uses the <strong>stretched link</strong> pattern: the only link is the title (inside
                the heading), and an <Code>::after</Code> pseudo-element extends its click area over the card. The link
                name stays short ("Q3 sales"), heading and link navigation remain useful, and focus draws an outline
                around the whole card. Inner buttons and links sit above that layer and keep working.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Foca o link do título e depois as ações do cartão.', en: 'Focuses the title link, then the card actions.' } },
            { keys: ['Enter'], description: { pt: 'Abre o link do cartão (ou ativa a ação focada).', en: 'Opens the card link (or activates the focused action).' } },
          ]}
        />
        <Callout tone="warning" title={{ pt: 'Evite seleção de texto acidental', en: 'Avoid accidental text selection' }}>
          <T
            pt="Como o cartão inteiro é um alvo de clique, o texto do corpo não pode ser selecionado com o mouse. Se o usuário precisar copiar informações (códigos, endereços), não use interactive."
            en="Since the whole card is a click target, body text cannot be selected with the mouse. If users need to copy information (codes, addresses), do not use interactive."
          />
        </Callout>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Título como heading com nível configurável; article/li conforme o contexto.', en: 'Title as a heading with configurable level; article/li depending on context.' } },
            { criterion: '2.4.4', description: { pt: 'O nome do link é o título do cartão, curto e descritivo.', en: 'The link name is the card title, short and descriptive.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível ao redor do cartão inteiro.', en: 'Visible focus around the whole card.' } },
            { criterion: '2.5.8', description: { pt: 'Área de clique do tamanho do cartão.', en: 'Click area the size of the card.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
