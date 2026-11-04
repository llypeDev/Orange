import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import OnSurface from './examples/OnSurface'
import OnSurfaceCode from './examples/OnSurface?raw'
import SizesShapes from './examples/SizesShapes'
import SizesShapesCode from './examples/SizesShapes?raw'
import Total from './examples/Total'
import TotalCode from './examples/Total?raw'
import { meta } from './meta'

export default function AvatarGroupPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para mostrar quem participa de algo (revisores, membros, pessoas online) quando a identidade individual é secundária.',
              en: 'Use it to show who takes part in something (reviewers, members, people online) when individual identity is secondary.',
            },
            {
              pt: (
                <>
                  Dê um rótulo que explique o grupo com <Code>label</Code> — ou aponte para um título visível com{' '}
                  <Code>aria-labelledby</Code>.
                </>
              ),
              en: (
                <>
                  Give a label explaining the group with <Code>label</Code> — or point to a visible title with{' '}
                  <Code>aria-labelledby</Code>.
                </>
              ),
            },
            {
              pt: 'Mostre de 3 a 5 avatares. Mais do que isso vira ruído; use max e deixe o contador resumir o restante.',
              en: 'Show 3 to 5 avatars. More becomes noise; use max and let the counter summarize the rest.',
            },
            {
              pt: 'Se o usuário precisa ver a lista completa, ofereça um link ou botão ao lado ("Ver todos") — o contador não é interativo.',
              en: 'If users need the full list, offer a link or button next to it ("See all") — the counter is not interactive.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico com limite', en: 'Basic with limit' }}
          description={{
            pt: 'max={4} mostra quatro avatares e resume o restante em "+2". O contador tem nome acessível ("mais 2") e lista os nomes ocultos no title.',
            en: 'max={4} shows four avatars and summarizes the rest as "+2". The counter has an accessible name ("2 more") and lists the hidden names in its title.',
          }}
          code={BasicCode}
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Tamanhos e formas', en: 'Sizes and shapes' }}
          description={{
            pt: 'size e shape do grupo valem para todos os avatares (e para o contador).',
            en: 'The group size and shape apply to every avatar (and the counter).',
          }}
          code={SizesShapesCode}
        >
          <SizesShapes />
        </Example>
        <Example
          title={{ pt: 'Total maior que a lista', en: 'Total larger than the list' }}
          description={{
            pt: 'Quando só parte das pessoas foi carregada, total informa o número real e o contador mostra a diferença.',
            en: 'When only some people were loaded, total sets the real number and the counter shows the difference.',
          }}
          code={TotalCode}
        >
          <Total />
        </Example>
        <Example
          title={{ pt: 'Sobre uma superfície', en: 'On a surface' }}
          description={{
            pt: 'A borda que separa os avatares usa a cor do fundo. Em superfícies elevadas, ajuste --or-avatar-ring. Aqui o rótulo é um texto visível ligado por aria-labelledby.',
            en: 'The border separating avatars uses the background color. On raised surfaces, set --or-avatar-ring. Here the label is visible text linked via aria-labelledby.',
          }}
          code={OnSurfaceCode}
          align="stretch"
        >
          <OnSurface />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover ou foco em um avatar', en: 'Hover or focus on an avatar' }, description: { pt: 'Sobe 4px (--or-distance-lift), fica acima dos vizinhos e ganha a sombra deslocada laranja. --or-duration-medium (250ms), --or-ease-out.', en: 'Lifts 4px (--or-distance-lift), moves above its neighbors and gets the orange offset shadow. --or-duration-medium (250ms), --or-ease-out.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Sem deslocamento; a sombra laranja continua indicando o destaque.', en: 'No movement; the orange shadow still marks the highlight.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'string', description: { pt: <>Rótulo da lista. Obrigatório sem <Code>aria-labelledby</Code>.</>, en: <>List label. Required without <Code>aria-labelledby</Code>.</> } },
            { name: 'max', type: 'number', description: { pt: 'Quantidade máxima de avatares visíveis.', en: 'Maximum number of visible avatars.' } },
            { name: 'total', type: 'number', description: { pt: 'Total real de pessoas (quando a lista está paginada).', en: 'Real number of people (when the list is paginated).' } },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: { pt: 'Tamanho de todos os avatares.', en: 'Size of every avatar.' } },
            { name: 'shape', type: "'square' | 'circle'", default: "'square'", description: { pt: 'Forma de todos os avatares.', en: 'Shape of every avatar.' } },
            { name: 'children', type: 'Avatar[]', required: true, description: { pt: 'Os avatares. Cada um pode sobrescrever size e shape.', en: 'The avatars. Each can override size and shape.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLUListElement>', description: { pt: 'Atributos nativos da <ul>.', en: 'Native <ul> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Renderiza uma <Code>&lt;ul role="list"&gt;</Code> rotulada, com um <Code>&lt;li&gt;</Code> por avatar —
                leitores de tela anunciam "Revisores do documento, lista, 5 itens". O <Code>role="list"</Code> explícito
                preserva a semântica no Safari, que a remove de listas sem marcadores. O contador "+N" é uma imagem com
                nome traduzido via <Code>t('avatarMore')</Code>.
              </>
            }
            en={
              <>
                Renders a labelled <Code>&lt;ul role="list"&gt;</Code>, with one <Code>&lt;li&gt;</Code> per avatar —
                screen readers announce "Document reviewers, list, 5 items". The explicit <Code>role="list"</Code> keeps
                the semantics in Safari, which drops them from unstyled lists. The "+N" counter is an image with a
                translated name via <Code>t('avatarMore')</Code>.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.1.1', description: { pt: 'Cada avatar e o contador têm nome acessível.', en: 'Each avatar and the counter have an accessible name.' } },
            { criterion: '1.3.1', description: { pt: 'Lista semântica rotulada, com a quantidade de itens anunciada.', en: 'Labelled semantic list, with the number of items announced.' } },
            { criterion: '1.4.11', description: { pt: 'Borda na cor do fundo separa avatares sobrepostos.', en: 'A background-colored border separates overlapping avatars.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
