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
import { Banner } from '@orangesys/ui'
import Accent from './examples/Accent'
import AccentCode from './examples/Accent?raw'
import Live from './examples/Live'
import LiveCode from './examples/Live?raw'
import PageTop from './examples/PageTop'
import PageTopCode from './examples/PageTop?raw'
import Tones from './examples/Tones'
import TonesCode from './examples/Tones?raw'
import WithAction from './examples/WithAction'
import WithActionCode from './examples/WithAction?raw'
import { meta } from './meta'

export default function BannerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use o Banner para avisos que valem para a página ou o sistema inteiro. Mensagens sobre um trecho específico ficam em um Alert, perto do conteúdo.',
              en: 'Use Banner for notices that apply to the whole page or system. Messages about a specific area go in an Alert, near the content.',
            },
            {
              pt: 'Coloque-o no topo, antes do cabeçalho ou logo abaixo dele, e mostre um por vez. Vários banners empilhados viram ruído.',
              en: 'Place it at the top, before or right below the header, and show one at a time. Stacked banners become noise.',
            },
            {
              pt: 'Título curto com o fato + uma frase com o impacto. Ofereça uma ação clara ("Acompanhar status", "Ver planos").',
              en: 'Short title with the fact + one sentence with the impact. Offer a clear action ("Track status", "See plans").',
            },
            {
              pt: (
                <>
                  Permita dispensar avisos informativos e lembre a escolha (ex.:{' '}
                  <Code>localStorage</Code>). Avisos críticos, como uma queda de serviço, não devem
                  ser dispensáveis enquanto valerem.
                </>
              ),
              en: (
                <>
                  Let users dismiss informational notices and remember the choice (e.g.{' '}
                  <Code>localStorage</Code>). Critical notices, like an outage, should not be
                  dismissible while they apply.
                </>
              ),
            },
            {
              pt: (
                <>
                  A variante <Code>accent</Code> é para chamadas (convites, lançamentos), não para
                  avisos de sistema. Use no máximo uma por página.
                </>
              ),
              en: (
                <>
                  The <Code>accent</Code> variant is for calls to action (invitations, launches),
                  not system notices. Use at most one per page.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Banner tone="warning" title="Instabilidade no Pix" style={{ width: '100%' }}>
              Pagamentos podem levar até 30 min.
            </Banner>
          }
          dontExample={
            <div style={{ display: 'grid', gap: 4, width: '100%' }}>
              <Banner tone="info" title="Novidade" />
              <Banner tone="warning" title="Atenção" />
              <Banner tone="success" title="Tudo certo" />
            </div>
          }
          doItems={[
            {
              pt: 'Um aviso, específico, com o impacto.',
              en: 'One specific notice with its impact.',
            },
          ]}
          dontItems={[
            {
              pt: 'Vários banners empilhados com títulos vagos.',
              en: 'Several stacked banners with vague titles.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Variantes', en: 'Variants' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: <Code>default</Code>, en: <Code>default</Code> },
              description: {
                pt: 'Faixa compacta com fundo suave do tom, ícone e borda esquerda colorida. Para avisos do sistema.',
                en: 'Compact strip with a soft tone background, icon and colored left border. For system notices.',
              },
            },
            {
              term: { pt: <Code>accent</Code>, en: <Code>accent</Code> },
              description: {
                pt: 'Chamada com borda esquerda laranja, título grande em Space Grotesk e ações à direita.',
                en: 'Call to action with an orange left border, large Space Grotesk title and actions on the right.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Tons', en: 'Tones' }} code={TonesCode}>
          <Tones />
        </Example>
        <Example
          title={{ pt: 'Com ação e dispensável', en: 'With action and dismissible' }}
          description={{
            pt: 'Links simples ganham sublinhado; botões usam o tamanho sm. Ao fechar, o foco segue para o próximo elemento.',
            en: 'Plain links get an underline; buttons use the sm size. On close, focus moves to the next element.',
          }}
          code={WithActionCode}
        >
          <WithAction />
        </Example>
        <Example
          title={{ pt: 'No topo da página', en: 'At the top of the page' }}
          description={{
            pt: 'Como primeiro elemento do layout, acima do cabeçalho.',
            en: 'As the first element of the layout, above the header.',
          }}
          code={PageTopCode}
        >
          <PageTop />
        </Example>
        <Example
          title={{ pt: 'Chamada (accent)', en: 'Call to action (accent)' }}
          description={{
            pt: 'Com headingLevel, o título vira um heading e entra na estrutura da página.',
            en: 'With headingLevel, the title becomes a heading and joins the page outline.',
          }}
          code={AccentCode}
        >
          <Accent />
        </Example>
        <Example
          title={{ pt: 'Aviso dinâmico (live)', en: 'Dynamic notice (live)' }}
          description={{
            pt: 'A queda é anunciada imediatamente (role="alert"); o retorno, de forma educada (role="status").',
            en: 'The outage is announced immediately (role="alert"); the recovery politely (role="status").',
          }}
          code={LiveCode}
        >
          <Live />
        </Example>
      </Section>
      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada (live ou reaberto)', en: 'Enter (live or reopened)' },
              description: {
                pt: (
                  <>
                    Desce 8px a partir do topo com fade — <Code>{'--or-duration-medium'}</Code>,{' '}
                    <Code>{'--or-ease-out'}</Code>.
                  </>
                ),
                en: (
                  <>
                    Slides down 8px from the top with a fade — <Code>{'--or-duration-medium'}</Code>
                    , <Code>{'--or-ease-out'}</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Dispensar', en: 'Dismiss' },
              description: {
                pt: (
                  <>
                    Esmaece e sobe 4px (<Code>{'--or-duration-fast'}</Code>) enquanto a faixa
                    recolhe a altura (grid <Code>{'1fr → 0fr'}</Code>,{' '}
                    <Code>{'--or-duration-medium'}</Code>): a página sobe sem pular.
                  </>
                ),
                en: (
                  <>
                    Fades and rises 4px (<Code>{'--or-duration-fast'}</Code>) while the strip
                    collapses (grid <Code>{'1fr → 0fr'}</Code>,{' '}
                    <Code>{'--or-duration-medium'}</Code>): the page moves up without jumping.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Ao vivo (pulse)', en: 'Live (pulse)' },
              description: {
                pt: (
                  <>
                    Anel quadrado pulsando em volta do ícone, na cor do tom —{' '}
                    <Code>{'or-pulse'}</Code>, <Code>{'--or-duration-loop'}</Code> (2.4s). É só
                    reforço: o texto precisa dizer que é ao vivo.
                  </>
                ),
                en: (
                  <>
                    Square ring pulsing around the icon, in the tone color —{' '}
                    <Code>{'or-pulse'}</Code>, <Code>{'--or-duration-loop'}</Code> (2.4s). It is
                    only reinforcement: the text must say it is live.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Links e botões', en: 'Links and buttons' },
              description: {
                pt: (
                  <>
                    O sublinhado engrossa no hover e no foco (<Code>{'--or-duration-fast'}</Code>);
                    botões afundam 1px (<Code>{'--or-duration-press'}</Code>).
                  </>
                ),
                en: (
                  <>
                    The underline thickens on hover and focus (<Code>{'--or-duration-fast'}</Code>);
                    buttons sink 1px (<Code>{'--or-duration-press'}</Code>).
                  </>
                ),
              },
            },
            {
              term: { pt: 'Para a saída animar', en: 'For the exit to animate' },
              description: {
                pt: (
                  <>
                    O Banner precisa continuar montado: use <Code>open</Code> (ou deixe não
                    controlado) em vez de <Code>{'{cond && <Banner />}'}</Code>. Espaçamento em
                    margem no próprio Banner recolhe junto; <Code>gap</Code> no pai só some no fim.
                  </>
                ),
                en: (
                  <>
                    The Banner must stay mounted: use <Code>open</Code> (or leave it uncontrolled)
                    instead of <Code>{'{cond && <Banner />}'}</Code>. Spacing as a margin on the
                    Banner itself collapses with it; a parent <Code>gap</Code> only goes away at the
                    end.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: <>Sem deslocamento e sem pulso.</>,
                en: <>No movement and no pulse.</>,
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'tone',
              type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
              default: "'info'",
              description: {
                pt: 'Cor semântica e ícone (variante default).',
                en: 'Semantic color and icon (default variant).',
              },
            },
            {
              name: 'variant',
              type: "'default' | 'accent'",
              default: "'default'",
              description: {
                pt: 'Aviso do sistema ou chamada.',
                en: 'System notice or call to action.',
              },
            },
            {
              name: 'title',
              type: 'ReactNode',
              description: { pt: 'Título curto.', en: 'Short title.' },
            },
            {
              name: 'headingLevel',
              type: '2 | 3 | 4 | 5 | 6',
              description: {
                pt: 'Renderiza o título como heading. Sem ela, é um parágrafo.',
                en: 'Renders the title as a heading. Without it, it is a paragraph.',
              },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: { pt: 'Texto do aviso.', en: 'Notice text.' },
            },
            {
              name: 'icon',
              type: 'ReactNode | false',
              description: {
                pt: (
                  <>
                    Substitui o ícone do tom; <Code>false</Code> remove. A variante accent não tem
                    ícone por padrão.
                  </>
                ),
                en: (
                  <>
                    Replaces the tone icon; <Code>false</Code> removes it. The accent variant has no
                    icon by default.
                  </>
                ),
              },
            },
            {
              name: 'action',
              type: 'ReactNode',
              description: { pt: 'Link ou botões de ação.', en: 'Action link or buttons.' },
            },
            {
              name: 'dismissible',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Mostra o botão de fechar.', en: 'Shows the close button.' },
            },
            {
              name: 'onDismiss',
              type: '() => void',
              description: { pt: 'Chamado ao fechar.', en: 'Called on close.' },
            },
            {
              name: 'open',
              type: 'boolean',
              description: { pt: 'Visibilidade controlada.', en: 'Controlled visibility.' },
            },
            {
              name: 'pulse',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Indicador "ao vivo": anel pulsando em volta do ícone, na cor do tom.',
                en: '"Live" indicator: a ring pulsing around the icon, in the tone color.',
              },
            },
            {
              name: 'live',
              type: 'boolean',
              default: 'false',
              description: {
                pt: (
                  <>
                    Região viva: <Code>role="alert"</Code> em danger/warning,{' '}
                    <Code>role="status"</Code> nos demais.
                  </>
                ),
                en: (
                  <>
                    Live region: <Code>role="alert"</Code> for danger/warning,{' '}
                    <Code>role="status"</Code> otherwise.
                  </>
                ),
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
                O Banner é conteúdo estático por padrão. Para avisos que surgem com a página aberta
                (queda de conexão, sessão expirando), use <Code>live</Code>: só a mensagem é
                anunciada, sem ações nem o botão de fechar. Nos tons semânticos, um prefixo oculto
                ("Atenção:", "Erro:") é lido antes do título.
              </>
            }
            en={
              <>
                Banner is static content by default. For notices that appear while the page is open
                (lost connection, session expiring), use <Code>live</Code>: only the message is
                announced, without actions or the close button. In semantic tones, a hidden prefix
                ("Warning:", "Error:") is read before the title.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Move o foco para a ação e o botão de fechar.',
                en: 'Moves focus to the action and the close button.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Ativa a ação ou fecha o Banner.',
                en: 'Activates the action or closes the Banner.',
              },
            },
            {
              keys: ['Space'],
              description: { pt: 'Ativa o botão focado.', en: 'Activates the focused button.' },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.4.1',
              description: {
                pt: 'O tom é comunicado por ícone e texto oculto, além da cor.',
                en: 'Tone is conveyed by icon and hidden text, not only color.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'O conteúdo quebra em linhas em telas estreitas, sem rolagem horizontal.',
                en: 'Content wraps on narrow screens without horizontal scrolling.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Ao fechar, o foco segue para o próximo elemento focável.',
                en: 'On close, focus moves to the next focusable element.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'Avisos dinâmicos anunciados sem mover o foco.',
                en: 'Dynamic notices announced without moving focus.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
