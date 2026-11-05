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
import ColunasAutomaticas from './examples/ColunasAutomaticas'
import ColunasAutomaticasCode from './examples/ColunasAutomaticas?raw'
import Metricas from './examples/Metricas'
import MetricasCode from './examples/Metricas?raw'
import Painel from './examples/Painel'
import PainelCode from './examples/Painel?raw'
import Produtos from './examples/Produtos'
import ProdutosCode from './examples/Produtos?raw'
import Revelacao from './examples/Revelacao'
import RevelacaoCode from './examples/Revelacao?raw'
import { meta } from './meta'

export default function GridPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use Grid quando os itens se alinham em linhas e colunas ao mesmo tempo: vitrines de produtos, galerias, painéis de métricas. Para uma única fila, use Stack.',
              en: 'Use Grid when items line up in rows and columns at once: product showcases, galleries, metric dashboards. For a single line, use Stack.',
            },
            {
              pt: (
                <>
                  Escolha entre <Code>columns</Code> (contagem fixa, que pode mudar por breakpoint)
                  e <Code>minItemWidth</Code> (quantas colunas couberem, sem media queries). Para
                  coleções de tamanho variável, <Code>minItemWidth</Code> costuma ser o mais
                  simples.
                </>
              ),
              en: (
                <>
                  Choose between <Code>columns</Code> (a fixed count that can change per breakpoint)
                  and <Code>minItemWidth</Code> (as many columns as fit, without media queries). For
                  variable-size collections, <Code>minItemWidth</Code> is usually simplest.
                </>
              ),
            },
            {
              pt: (
                <>
                  Coleções são listas: use <Code>as="ul"</Code> com itens <Code>li</Code> (ou{' '}
                  <Code>Card as="li"</Code>
                  ). Pares rótulo/valor ficam bem em <Code>as="dl"</Code> ou com <Code>Stat</Code>.
                </>
              ),
              en: (
                <>
                  Collections are lists: use <Code>as="ul"</Code> with <Code>li</Code> items (or{' '}
                  <Code>Card as="li"</Code>
                  ). Label/value pairs fit <Code>as="dl"</Code> or <Code>Stat</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  Reserve <Code>variant="bordered"</Code> para grades informativas (números,
                  especificações). Cartões clicáveis já têm borda e elevação próprias: use a grade{' '}
                  <Code>plain</Code> com <Code>gap</Code>.
                </>
              ),
              en: (
                <>
                  Reserve <Code>variant="bordered"</Code> for informative grids (numbers, specs).
                  Clickable cards already have their own border and lift: use the <Code>plain</Code>{' '}
                  grid with a <Code>gap</Code>.
                </>
              ),
            },
            {
              pt: 'A ordem dos itens na tela é sempre a ordem do código: não há posicionamento manual nem preenchimento "dense" que reordene as células.',
              en: 'The on-screen order of items is always the source order: there is no manual placement or "dense" packing that reorders cells.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Grid', en: 'Grid' },
              description: {
                pt: 'O contêiner: define colunas, espaçamento e a variante. Qualquer filho direto vira uma célula.',
                en: 'The container: sets columns, spacing and the variant. Any direct child becomes a cell.',
              },
            },
            {
              term: { pt: 'GridItem', en: 'GridItem' },
              description: {
                pt: 'Opcional: só para células que ocupam várias colunas (span) ou a linha inteira (full).',
                en: 'Optional: only for cells that span several columns (span) or the whole row (full).',
              },
            },
            {
              term: { pt: 'plain', en: 'plain' },
              description: {
                pt: 'Células separadas por gap, sem linhas (padrão).',
                en: 'Cells separated by gap, with no lines (default).',
              },
            },
            {
              term: { pt: 'bordered', en: 'bordered' },
              description: {
                pt: 'Células encostadas, linhas de 1px (--or-color-border) entre elas e moldura externa. O gap vira o respiro interno das células. Funciona com qualquer número de colunas e com a última linha incompleta.',
                en: 'Cells touch, with 1px lines (--or-color-border) between them and an outer frame. The gap becomes the inner padding of the cells. Works with any column count and an incomplete last row.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Vitrine de produtos', en: 'Product grid' }}
          description={{
            pt: 'Uma coluna no celular, duas a partir de 640px (sm) e três a partir de 1024px (lg). A grade é uma lista (ul) e cada Card é um li.',
            en: 'One column on mobile, two from 640px (sm) and three from 1024px (lg). The grid is a list (ul) and each Card is an li.',
          }}
          code={ProdutosCode}
          align="stretch"
        >
          <Produtos />
        </Example>
        <Example
          title={{ pt: 'Colunas automáticas', en: 'Automatic columns' }}
          description={{
            pt: 'Com minItemWidth="12rem", cabem quantas colunas a largura permitir — sem media queries, e reagindo à largura da própria grade.',
            en: 'With minItemWidth="12rem", as many columns fit as the width allows — no media queries, reacting to the grid’s own width.',
          }}
          code={ColunasAutomaticasCode}
          align="stretch"
        >
          <ColunasAutomaticas />
        </Example>
        <Example
          title={{ pt: 'Painel de métricas com bordas', en: 'Bordered metrics dashboard' }}
          description={{
            pt: 'variant="bordered" desenha as linhas de 1px das grades de números do zop.dev. Teste os dois temas e redimensione: as linhas se ajustam a qualquer número de colunas.',
            en: 'variant="bordered" draws the 1px lines of zop.dev’s number grids. Try both themes and resize: the lines adapt to any column count.',
          }}
          code={MetricasCode}
          align="stretch"
        >
          <Metricas />
        </Example>
        <Example
          title={{ pt: 'Células que ocupam várias colunas', en: 'Cells spanning columns' }}
          description={{
            pt: 'GridItem com span="full" ocupa a linha inteira; span={{ base: 1, md: 2 }} ocupa duas das três colunas a partir de 768px.',
            en: 'GridItem with span="full" takes the whole row; span={{ base: 1, md: 2 }} takes two of three columns from 768px up.',
          }}
          code={PainelCode}
          align="stretch"
        >
          <Painel />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Grid e GridItem', en: 'Grid and GridItem' },
              description: {
                pt: 'Sem movimento próprio. Mudanças de colunas, spans e gap por breakpoint acontecem na hora — animar layout desorienta e custa caro.',
                en: 'No motion of their own. Column, span and gap changes per breakpoint happen instantly — animating layout is disorienting and expensive.',
              },
            },
            {
              term: { pt: 'Entrada escalonada', en: 'Staggered entrance' },
              description: {
                pt: 'Combine com Reveal: cada célula é um <Reveal index={i}> (ou <Reveal as="li"> em listas). Ela sobe 24px e aparece em 600ms (--or-duration-reveal), 80ms (--or-stagger) depois da anterior. O Reveal com stagger escalona os filhos diretos dele — como as células precisam ser filhos diretos da Grid, use index.',
                en: 'Combine with Reveal: each cell is a <Reveal index={i}> (or <Reveal as="li"> in lists). It rises 24px and fades in over 600ms (--or-duration-reveal), 80ms (--or-stagger) after the previous one. Reveal with stagger staggers its own direct children — since cells must be direct children of the Grid, use index.',
              },
            },
            {
              term: { pt: 'Grades longas', en: 'Long grids' },
              description: {
                pt: 'Limite o atraso: index={i % 3} (o número de colunas) faz cada linha entrar junta, sem esperar as anteriores.',
                en: 'Cap the delay: index={i % 3} (the column count) makes each row enter together, without waiting for the previous ones.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'O Reveal mostra tudo de imediato. As linhas da variante bordered são estáticas.',
                en: 'Reveal shows everything immediately. The bordered variant’s lines are static.',
              },
            },
          ]}
        />
        <Example
          title={{ pt: 'Grid com Reveal', en: 'Grid with Reveal' }}
          description={{
            pt: 'As coleções entram uma a uma quando a grade chega à tela (role a página para ver de novo depois de recarregar).',
            en: 'Collections enter one by one when the grid reaches the screen (reload and scroll to see it again).',
          }}
          code={RevelacaoCode}
          align="stretch"
        >
          <Revelacao />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Grid', en: 'Grid' }}
          rows={[
            {
              name: 'as',
              type: 'ElementType',
              default: "'div'",
              description: {
                pt: (
                  <>
                    Elemento renderizado. <Code>ul</Code>/<Code>ol</Code> recebem{' '}
                    <Code>role="list"</Code>.
                  </>
                ),
                en: (
                  <>
                    Rendered element. <Code>ul</Code>/<Code>ol</Code> get <Code>role="list"</Code>.
                  </>
                ),
              },
            },
            {
              name: 'columns',
              type: 'ResponsiveValue<number>',
              default: '1',
              description: {
                pt: 'Colunas de mesma largura; aceita um valor por breakpoint.',
                en: 'Equal-width columns; accepts one value per breakpoint.',
              },
            },
            {
              name: 'minItemWidth',
              type: 'string',
              description: {
                pt: (
                  <>
                    Largura mínima de cada item (<Code>'12rem'</Code>): colunas automáticas. Tem
                    prioridade sobre <Code>columns</Code>.
                  </>
                ),
                en: (
                  <>
                    Minimum item width (<Code>'12rem'</Code>): automatic columns. Takes precedence
                    over <Code>columns</Code>.
                  </>
                ),
              },
            },
            {
              name: 'gap',
              type: 'ResponsiveValue<LayoutGap>',
              default: '4',
              description: {
                pt: 'Espaço entre linhas e colunas. Em bordered, o respiro interno das células.',
                en: 'Space between rows and columns. In bordered, the inner padding of cells.',
              },
            },
            {
              name: 'rowGap',
              type: 'ResponsiveValue<LayoutGap>',
              description: {
                pt: 'Substitui gap entre linhas (em bordered, o respiro vertical).',
                en: 'Overrides gap between rows (in bordered, the vertical padding).',
              },
            },
            {
              name: 'columnGap',
              type: 'ResponsiveValue<LayoutGap>',
              description: {
                pt: 'Substitui gap entre colunas (em bordered, o respiro horizontal).',
                en: 'Overrides gap between columns (in bordered, the horizontal padding).',
              },
            },
            {
              name: 'variant',
              type: "'plain' | 'bordered'",
              default: "'plain'",
              description: {
                pt: 'bordered desenha linhas de 1px entre as células e uma moldura.',
                en: 'bordered draws 1px lines between cells and a frame.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLElement>',
              description: {
                pt: 'Atributos do elemento (aria-label, id…).',
                en: 'Element attributes (aria-label, id…).',
              },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'GridItem', en: 'GridItem' }}
          rows={[
            {
              name: 'span',
              type: "ResponsiveValue<number | 'full'>",
              description: {
                pt: 'Colunas ocupadas, ou full para a linha inteira. Não passe do número de colunas no mesmo breakpoint.',
                en: 'Columns taken, or full for the whole row. Do not exceed the column count at the same breakpoint.',
              },
            },
            {
              name: 'as',
              type: 'ElementType',
              default: "'div'",
              description: {
                pt: (
                  <>
                    Elemento renderizado (<Code>li</Code> dentro de <Code>Grid as="ul"</Code>).
                  </>
                ),
                en: (
                  <>
                    Rendered element (<Code>li</Code> inside <Code>Grid as="ul"</Code>).
                  </>
                ),
              },
            },
          ]}
        />
        <p>
          <T
            pt={
              <>
                <Code>ResponsiveValue</Code> e <Code>LayoutGap</Code> são os mesmos tipos da Stack —
                veja a página da Stack.
              </>
            }
            en={
              <>
                <Code>ResponsiveValue</Code> and <Code>LayoutGap</Code> are the same types as
                Stack’s — see the Stack page.
              </>
            }
          />
        </p>
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                A Grid é puramente visual: a semântica vem de <Code>as</Code>. Coleções devem ser
                listas (<Code>ul</Code> + <Code>li</Code>) para que leitores de tela anunciem
                "lista, 6 itens"; a Grid adiciona <Code>role="list"</Code> porque o Safari remove a
                semântica de listas sem marcadores. As linhas da variante <Code>bordered</Code> são
                desenhadas só com CSS e não aparecem para tecnologias assistivas.
              </>
            }
            en={
              <>
                Grid is purely visual: semantics come from <Code>as</Code>. Collections should be
                lists (<Code>ul</Code> + <Code>li</Code>) so screen readers announce "list, 6
                items"; Grid adds <Code>role="list"</Code> because Safari drops the semantics of
                lists without markers. The <Code>bordered</Code> lines are drawn with CSS only and
                are not exposed to assistive technology.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Percorre os elementos focáveis das células na ordem do código: linha por linha, da esquerda para a direita.',
                en: 'Moves through focusable elements in the cells in source order: row by row, left to right.',
              },
            },
          ]}
        />
        <Callout
          tone="info"
          title={{ pt: 'Breakpoints olham a janela', en: 'Breakpoints look at the window' }}
        >
          <T
            pt="columns e span responsivos usam media queries (largura da janela), como os tokens. Dentro de uma área estreita (barra lateral, modal), prefira minItemWidth, que reage à largura da própria grade."
            en="Responsive columns and span use media queries (window width), like the tokens. Inside a narrow area (sidebar, modal), prefer minItemWidth, which reacts to the grid’s own width."
          />
        </Callout>
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Estrutura real com as (ul, ol, dl); listas mantêm role="list".',
                en: 'Real structure via as (ul, ol, dl); lists keep role="list".',
              },
            },
            {
              criterion: '1.3.2',
              description: {
                pt: 'Sem posicionamento manual: ordem visual igual à ordem de leitura.',
                en: 'No manual placement: visual order matches reading order.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Colunas responsivas e minItemWidth com min(…, 100%) evitam rolagem horizontal a 320px.',
                en: 'Responsive columns and minItemWidth with min(…, 100%) avoid horizontal scrolling at 320px.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'A ordem do foco segue a ordem visual das células.',
                en: 'Focus order follows the visual order of the cells.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
