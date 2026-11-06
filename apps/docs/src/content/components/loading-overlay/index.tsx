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
import Card from './examples/Card'
import CardCode from './examples/Card?raw'
import Form from './examples/Form'
import FormCode from './examples/Form?raw'
import Table from './examples/Table'
import TableCode from './examples/Table?raw'
import { meta } from './meta'

export default function LoadingOverlayPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para atualizar algo que já está na tela (filtros aplicados, dados recarregados, formulário salvando) — o conteúdo antigo continua visível por baixo, como referência.',
              en: 'Use it to refresh something already on screen (filters applied, data reloaded, form saving) — the old content stays visible underneath as reference.',
            },
            {
              pt: 'Cubra só a área afetada, não a página inteira. O resto da interface continua utilizável.',
              en: 'Cover only the affected area, not the whole page. The rest of the interface remains usable.',
            },
            {
              pt: 'No primeiro carregamento, quando ainda não há conteúdo, prefira Skeleton.',
              en: 'On first load, when there is no content yet, prefer Skeleton.',
            },
            {
              pt: (
                <>
                  Escreva a mensagem com o que está acontecendo ("Atualizando relatório…"). O
                  padrão, <Code>t('loading')</Code>, é genérico.
                </>
              ),
              en: (
                <>
                  Write a message with what is happening ("Updating report…"). The default,{' '}
                  <Code>t('loading')</Code>, is generic.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Tabela', en: 'Table' }}
          description={{
            pt: 'Clique em Atualizar dados: a tabela fica inert e aria-busy por 2 s e a mensagem é anunciada.',
            en: 'Click Update data: the table becomes inert and aria-busy for 2 s and the message is announced.',
          }}
          code={TableCode}
        >
          <Table />
        </Example>
        <Example
          title={{ pt: 'Formulário salvando', en: 'Saving form' }}
          description={{
            pt: 'O foco estava no botão: ele é estacionado no painel durante o carregamento e devolvido ao botão no fim.',
            en: 'Focus was on the button: it is parked on the panel while loading and returned to the button at the end.',
          }}
          code={FormCode}
        >
          <Form />
        </Example>
        <Example
          title={{ pt: 'Cartões', en: 'Cards' }}
          description={{
            pt: 'Funciona em qualquer contêiner. Em áreas pequenas, use spinnerSize="sm".',
            en: 'Works in any container. In small areas, use spinnerSize="sm".',
          }}
          code={CardCode}
        >
          <Card />
        </Example>
      </Section>
      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Mostrar', en: 'Show' },
              description: {
                pt: (
                  <>
                    O fundo aparece com fade em <Code>{'--or-duration-medium'}</Code> e o painel
                    sobe 4px (<Code>{'--or-distance-sm'}</Code>), <Code>{'--or-ease-out'}</Code>.
                  </>
                ),
                en: (
                  <>
                    The backdrop fades in over <Code>{'--or-duration-medium'}</Code> and the panel
                    rises 4px (<Code>{'--or-distance-sm'}</Code>), <Code>{'--or-ease-out'}</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Esconder', en: 'Hide' },
              description: {
                pt: (
                  <>
                    Saída mais curta: fade em <Code>{'--or-duration-fast'}</Code>,{' '}
                    <Code>{'--or-ease-in-out'}</Code>. Spinner e mensagem ficam no painel até o fim
                    (<Code>{'usePresence'}</Code>) — nada encolhe no meio do fade. O conteúdo é
                    liberado logo no início.
                  </>
                ),
                en: (
                  <>
                    Shorter exit: fade in <Code>{'--or-duration-fast'}</Code>,{' '}
                    <Code>{'--or-ease-in-out'}</Code>. Spinner and message stay in the panel until
                    the end (<Code>{'usePresence'}</Code>) — nothing shrinks mid-fade. The content
                    is released right at the start.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Spinner', en: 'Spinner' },
              description: {
                pt: <>Gira em loop (veja Spinner).</>,
                en: <>Spins in a loop (see Spinner).</>,
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: <>Aparece e some na hora; o spinner pulsa em vez de girar.</>,
                en: <>Appears and disappears instantly; the spinner pulses instead of spinning.</>,
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'open',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Mostra a sobreposição e bloqueia o conteúdo.',
                en: 'Shows the overlay and blocks the content.',
              },
            },
            {
              name: 'message',
              type: 'ReactNode',
              default: "t('loading')",
              description: {
                pt: 'Mensagem exibida e anunciada.',
                en: 'Message shown and announced.',
              },
            },
            {
              name: 'spinnerSize',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: { pt: 'Tamanho do spinner.', en: 'Spinner size.' },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: { pt: 'Conteúdo coberto.', en: 'Covered content.' },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Atributos da raiz (que recebe <Code>position: relative</Code>).
                  </>
                ),
                en: (
                  <>
                    Root attributes (the root gets <Code>position: relative</Code>).
                  </>
                ),
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
                Enquanto visível, o conteúdo coberto recebe <Code>inert</Code> (sai da ordem de foco
                e da árvore de acessibilidade) e <Code>aria-busy="true"</Code>. A mensagem fica numa
                região <Code>role="status"</Code> sempre montada e <strong>fora</strong> do conteúdo
                ocupado — assim ela é anunciada de forma confiável. Se o foco estava dentro da área,
                ele vai para o painel e volta ao mesmo elemento quando o carregamento termina.
              </>
            }
            en={
              <>
                While visible, the covered content gets <Code>inert</Code> (removed from focus order
                and the accessibility tree) and <Code>aria-busy="true"</Code>. The message lives in
                an always-mounted <Code>role="status"</Code> region placed <strong>outside</strong>{' '}
                the busy content, so it is announced reliably. If focus was inside the area, it
                moves to the panel and returns to the same element when loading ends.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Pula o conteúdo coberto enquanto ele está inert.',
                en: 'Skips the covered content while it is inert.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '2.1.1',
              description: {
                pt: 'Conteúdo bloqueado não recebe foco nem cliques.',
                en: 'Blocked content receives neither focus nor clicks.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'O foco é preservado e devolvido ao terminar.',
                en: 'Focus is preserved and restored at the end.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'O painel com foco mostra o contorno de foco.',
                en: 'The focused panel shows the focus outline.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: (
                  <>
                    Mensagem anunciada por <Code>role="status"</Code>.
                  </>
                ),
                en: (
                  <>
                    Message announced via <Code>role="status"</Code>.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
