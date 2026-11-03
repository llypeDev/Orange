import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Button, EmptyState } from '@orange/ui'
import Compact from './examples/Compact'
import CompactCode from './examples/Compact?raw'
import Filtered from './examples/Filtered'
import FilteredCode from './examples/Filtered?raw'
import FirstUse from './examples/FirstUse'
import FirstUseCode from './examples/FirstUse?raw'
import NoResults from './examples/NoResults'
import NoResultsCode from './examples/NoResults?raw'
import { meta } from './meta'

export default function EmptyStatePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Explique por que está vazio e o que fazer em seguida. O título diz o fato; a descrição, o motivo ou o benefício.',
              en: 'Explain why it is empty and what to do next. The title states the fact; the description, the reason or benefit.',
            },
            {
              pt: 'Ofereça no máximo uma ação primária. A secundária leva a alternativas (modelos, documentação, importar).',
              en: 'Offer at most one primary action. The secondary one leads to alternatives (templates, docs, import).',
            },
            {
              pt: (
                <>
                  Escolha o <Code>headingLevel</Code> pela hierarquia da página — dentro de uma
                  seção com h2, use h3.
                </>
              ),
              en: (
                <>
                  Choose <Code>headingLevel</Code> from the page hierarchy — inside a section with
                  an h2, use h3.
                </>
              ),
            },
            {
              pt: 'Em painéis, listas e áreas laterais, use a variante compacta.',
              en: 'In panels, lists and side areas, use the compact variant.',
            },
          ]}
        />
        <DoDont
          doExample={
            <EmptyState
              variant="compact"
              icon="search"
              title="Nenhum cliente encontrado"
              description="Tente buscar pelo CNPJ."
              action={
                <Button size="sm" variant="outline">
                  Limpar busca
                </Button>
              }
            />
          }
          dontExample={<EmptyState variant="compact" icon="inbox" title="Sem dados" />}
          doItems={[
            {
              pt: 'Diga o que aconteceu e ofereça uma saída.',
              en: 'Say what happened and offer a way out.',
            },
          ]}
          dontItems={[
            { pt: 'Mensagem vaga, sem próximo passo.', en: 'Vague message with no next step.' },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Quando aparece', en: 'When it appears' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Primeiro uso', en: 'First use' },
              description: {
                pt: 'Ainda não existe nada. Mostre o valor do recurso e a ação para criar.',
                en: 'Nothing exists yet. Show the value of the feature and the action to create.',
              },
            },
            {
              term: { pt: 'Sem resultados', en: 'No results' },
              description: {
                pt: 'A busca não encontrou nada. Repita o termo e sugira como ajustar.',
                en: 'The search found nothing. Repeat the term and suggest how to adjust.',
              },
            },
            {
              term: { pt: 'Filtros restritivos', en: 'Restrictive filters' },
              description: {
                pt: 'Existe conteúdo, mas os filtros esconderam tudo. Ofereça removê-los.',
                en: 'Content exists, but filters hid everything. Offer to remove them.',
              },
            },
            {
              term: { pt: 'Tudo concluído', en: 'All done' },
              description: {
                pt: 'Caixa de entrada zerada, sem pendências. Comemore com moderação.',
                en: 'Inbox zero, nothing pending. Celebrate in moderation.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Primeiro uso', en: 'First use' }}
          description={{
            pt: 'A ilustração geométrica — dois quadrados e o marcador laranja — envolve o ícone escolhido.',
            en: 'The geometric illustration — two squares and the orange marker — frames the chosen icon.',
          }}
          code={FirstUseCode}
          align="stretch"
        >
          <FirstUse />
        </Example>
        <Example
          title={{ pt: 'Busca sem resultados', en: 'No search results' }}
          code={NoResultsCode}
          align="stretch"
        >
          <NoResults />
        </Example>
        <Example title={{ pt: 'Filtros', en: 'Filters' }} code={FilteredCode} align="stretch">
          <Filtered />
        </Example>
        <Example
          title={{ pt: 'Compacta', en: 'Compact' }}
          description={{
            pt: 'Horizontal e menor, para painéis e listas.',
            en: 'Horizontal and smaller, for panels and lists.',
          }}
          code={CompactCode}
        >
          <Compact />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'title',
              type: 'ReactNode',
              required: true,
              description: { pt: 'Título curto.', en: 'Short title.' },
            },
            {
              name: 'headingLevel',
              type: '2 | 3 | 4 | 5 | 6',
              default: '3',
              description: { pt: 'Nível semântico do título.', en: 'Semantic level of the title.' },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: { pt: 'Texto de apoio.', en: 'Supporting text.' },
            },
            {
              name: 'icon',
              type: 'IconName | ReactNode',
              default: "'inbox'",
              description: {
                pt: 'Ícone dentro da ilustração.',
                en: 'Icon inside the illustration.',
              },
            },
            {
              name: 'illustration',
              type: 'ReactNode | false',
              description: {
                pt: (
                  <>
                    Substitui a ilustração; <Code>false</Code> remove.
                  </>
                ),
                en: (
                  <>
                    Replaces the illustration; <Code>false</Code> removes it.
                  </>
                ),
              },
            },
            {
              name: 'action',
              type: 'ReactNode',
              description: { pt: 'Ação primária.', en: 'Primary action.' },
            },
            {
              name: 'secondaryAction',
              type: 'ReactNode',
              description: { pt: 'Ação secundária.', en: 'Secondary action.' },
            },
            {
              name: 'variant',
              type: "'default' | 'compact'",
              default: "'default'",
              description: {
                pt: 'Centralizada ou compacta (horizontal).',
                en: 'Centered or compact (horizontal).',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Atributos nativos da <div> raiz.',
                en: 'Native attributes of the root <div>.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O título é um heading real (<Code>h2</Code>–<Code>h6</Code>), então o estado vazio
                aparece na navegação por títulos. A ilustração é decorativa (
                <Code>aria-hidden</Code>). Se o estado vazio surgir depois de uma ação (ex.: uma
                busca), anuncie o resultado numa região <Code>role="status"</Code> — por exemplo,
                "Nenhum resultado".
              </>
            }
            en={
              <>
                The title is a real heading (<Code>h2</Code>–<Code>h6</Code>), so the empty state
                shows up in heading navigation. The illustration is decorative (
                <Code>aria-hidden</Code>). If the empty state appears after an action (e.g. a
                search), announce the result in a <Code>role="status"</Code> region — for instance,
                "No results".
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: { pt: 'Move o foco para as ações.', en: 'Moves focus to the actions.' },
            },
            {
              keys: ['Enter'],
              description: { pt: 'Ativa a ação focada.', en: 'Activates the focused action.' },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.1.1',
              description: {
                pt: 'Ilustração decorativa oculta de tecnologias assistivas.',
                en: 'Decorative illustration hidden from assistive technology.',
              },
            },
            {
              criterion: '1.3.1',
              description: {
                pt: 'Título exposto como heading no nível configurado.',
                en: 'Title exposed as a heading at the configured level.',
              },
            },
            {
              criterion: '2.4.6',
              description: {
                pt: 'Título e ações descrevem o estado e o próximo passo.',
                en: 'Title and actions describe the state and the next step.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
