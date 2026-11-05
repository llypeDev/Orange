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
import Pagina from './examples/Pagina'
import PaginaCode from './examples/Pagina?raw'
import Tamanhos from './examples/Tamanhos'
import TamanhosCode from './examples/Tamanhos?raw'
import { meta } from './meta'

export default function ContainerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use um Container por faixa de conteúdo da página (cabeçalho, conteúdo, rodapé) para que todas alinhem nas mesmas margens. Fundos de borda a borda ficam num elemento por fora, com o Container dentro.',
              en: 'Use one Container per content band of the page (header, content, footer) so they all align on the same margins. Edge-to-edge backgrounds go on an outer element, with the Container inside.',
            },
            {
              pt: (
                <>
                  Escolha o tamanho pelo conteúdo: <Code>sm</Code> para formulários e textos (linhas
                  curtas são mais fáceis de ler), <Code>xl</Code> (padrão) para páginas do produto
                  com grades e tabelas.
                </>
              ),
              en: (
                <>
                  Pick the size by content: <Code>sm</Code> for forms and text (short lines are
                  easier to read), <Code>xl</Code> (default) for product pages with grids and
                  tables.
                </>
              ),
            },
            {
              pt: (
                <>
                  Não aninhe Containers: o de dentro somaria mais uma margem lateral. Dentro dele,
                  organize com Stack e Grid. Para o conteúdo principal, use <Code>as="main"</Code>.
                </>
              ),
              en: (
                <>
                  Do not nest Containers: the inner one would add another side gutter. Inside it,
                  lay out with Stack and Grid. For the main content, use <Code>as="main"</Code>.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Tamanhos e gutter', en: 'Sizes and gutter' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'sm', en: 'sm' },
              description: {
                pt: '640px de conteúdo — formulários, login, textos longos.',
                en: '640px of content — forms, sign-in, long text.',
              },
            },
            {
              term: { pt: 'md', en: 'md' },
              description: {
                pt: '768px — artigos, configurações.',
                en: '768px — articles, settings.',
              },
            },
            {
              term: { pt: 'lg', en: 'lg' },
              description: {
                pt: '1024px — listas, tabelas, painéis compactos.',
                en: '1024px — lists, tables, compact dashboards.',
              },
            },
            {
              term: { pt: 'xl (padrão)', en: 'xl (default)' },
              description: {
                pt: '1200px (--or-layout-max-width) — a largura da grade do Orange.',
                en: '1200px (--or-layout-max-width) — the width of Orange’s grid.',
              },
            },
            {
              term: { pt: 'full', en: 'full' },
              description: {
                pt: 'Sem limite de largura, só com o gutter — ferramentas e mapas que usam a tela toda.',
                en: 'No width limit, just the gutter — tools and maps that use the whole screen.',
              },
            },
            {
              term: { pt: 'Gutter', en: 'Gutter' },
              description: {
                pt: 'Margem lateral responsiva: 16px no celular, 24px a partir de 768px e 32px (--or-layout-gutter) a partir de 1024px. Fica por fora da largura máxima: xl mostra 1200px de conteúdo.',
                en: 'Responsive side gutter: 16px on mobile, 24px from 768px and 32px (--or-layout-gutter) from 1024px. It sits outside the max width: xl shows 1200px of content.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{
            pt: 'Em janelas largas, sm e md ficam visivelmente mais estreitos e centralizados; lg e xl ocupam a prévia inteira. No celular, todos usam a largura toda com 16px de margem.',
            en: 'On wide windows, sm and md are visibly narrower and centered; lg and xl fill the whole preview. On mobile, all of them use the full width with a 16px gutter.',
          }}
          code={TamanhosCode}
          align="stretch"
        >
          <Tamanhos />
        </Example>
        <Example
          title={{ pt: 'Página do painel', en: 'Dashboard page' }}
          description={{
            pt: 'Os três componentes de layout juntos: Container para a largura e as margens, Stack para o cabeçalho (empilhado no celular, em linha no desktop) e Grid bordered para as métricas.',
            en: 'The three layout components together: Container for width and margins, Stack for the header (stacked on mobile, in a row on desktop) and a bordered Grid for the metrics.',
          }}
          code={PaginaCode}
          align="stretch"
        >
          <Pagina />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Container', en: 'Container' },
              description: {
                pt: 'Sem movimento próprio. O gutter muda de tamanho na hora ao cruzar um breakpoint.',
                en: 'No motion of its own. The gutter changes size instantly when crossing a breakpoint.',
              },
            },
            {
              term: { pt: 'Entrada de conteúdo', en: 'Content entrance' },
              description: {
                pt: 'Anime o conteúdo, não o Container: use Reveal nos blocos dentro dele (veja Grid → Movimento para a entrada escalonada).',
                en: 'Animate the content, not the Container: use Reveal on the blocks inside it (see Grid → Motion for the staggered entrance).',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
              default: "'xl'",
              description: { pt: 'Largura máxima do conteúdo.', en: 'Maximum content width.' },
            },
            {
              name: 'as',
              type: 'ElementType',
              default: "'div'",
              description: {
                pt: 'Elemento renderizado (main, section, header, footer…).',
                en: 'Rendered element (main, section, header, footer…).',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLElement>',
              description: { pt: 'Atributos do elemento.', en: 'Element attributes.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O Container é puramente visual. Use <Code>as</Code> para dar estrutura à página:{' '}
                <Code>main</Code> para o conteúdo principal (um por página), <Code>header</Code>/
                <Code>footer</Code> para as faixas de cabeçalho e rodapé, ou <Code>section</Code>{' '}
                com <Code>aria-labelledby</Code> apontando para o título.
              </>
            }
            en={
              <>
                Container is purely visual. Use <Code>as</Code> to structure the page:{' '}
                <Code>main</Code> for the main content (one per page), <Code>header</Code>/
                <Code>footer</Code> for the header and footer bands, or <Code>section</Code> with{' '}
                <Code>aria-labelledby</Code> pointing to the heading.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Sem interação própria: o foco passa pelo conteúdo na ordem do código.',
                en: 'No interaction of its own: focus moves through the content in source order.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Landmarks reais via as (main, header, footer, section).',
                en: 'Real landmarks via as (main, header, footer, section).',
              },
            },
            {
              criterion: '1.4.8',
              description: {
                pt: 'size="sm" mantém linhas de texto curtas e confortáveis de ler.',
                en: 'size="sm" keeps text lines short and comfortable to read.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Gutter de 16px no celular e largura fluida: sem rolagem horizontal a 320px.',
                en: '16px gutter on mobile and fluid width: no horizontal scrolling at 320px.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
