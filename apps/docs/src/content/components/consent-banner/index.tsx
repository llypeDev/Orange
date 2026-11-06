import {
  Bullets,
  Callout,
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
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import CustomText from './examples/CustomText'
import CustomTextCode from './examples/CustomText?raw'
import Persistence from './examples/Persistence'
import PersistenceCode from './examples/Persistence?raw'
import Viewport from './examples/Viewport'
import ViewportCode from './examples/Viewport?raw'
import { meta } from './meta'

export default function ConsentBannerPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Callout tone="info" title={{ pt: 'Orientação de produto', en: 'Product guidance' }}>
          <T
            pt="As recomendações abaixo seguem a LGPD, o guia de cookies da ANPD e o padrão de banner do GOV.UK como referência de produto e acessibilidade — não são aconselhamento jurídico. Confirme textos, categorias e o registro da decisão com o jurídico ou o encarregado de dados (DPO) da sua empresa."
            en="The recommendations below draw on Brazil's LGPD, the ANPD cookie guidance and the GOV.UK cookie banner as product and accessibility references — they are not legal advice. Confirm wording, categories and how decisions are recorded with your company's legal team or data protection officer (DPO)."
          />
        </Callout>
        <Bullets
          items={[
            {
              pt: 'Aceitar e rejeitar com o mesmo destaque: as três ações têm a mesma variante, tamanho e posição — nada de "Aceitar" laranja e "Rejeitar" escondido num link.',
              en: 'Accept and reject with equal prominence: the three actions share the same variant, size and placement — no orange "Accept" next to a "Reject" hidden in a link.',
            },
            {
              pt: (
                <>
                  Categorias granulares e com propósito claro (Necessários, Desempenho,
                  Funcionalidade, Publicidade), cada uma com uma <Code>description</Code> que diz o
                  que faz e o que muda se for recusada.
                </>
              ),
              en: (
                <>
                  Granular categories with a clear purpose (Necessary, Performance, Functionality,
                  Advertising), each with a <Code>description</Code> saying what it does and what
                  changes if it is refused.
                </>
              ),
            },
            {
              pt: (
                <>
                  Nenhuma categoria opcional começa marcada: sem <Code>value</Code>/
                  <Code>defaultValue</Code>, só as <Code>required</Code> vêm aceitas. Use{' '}
                  <Code>required</Code> apenas para o que o site realmente precisa para funcionar.
                </>
              ),
              en: (
                <>
                  No optional category starts checked: without <Code>value</Code>/
                  <Code>defaultValue</Code>, only the <Code>required</Code> ones are accepted. Use{' '}
                  <Code>required</Code> only for what the site truly needs to work.
                </>
              ),
            },
            {
              pt: 'As categorias são caixas de seleção (CheckboxGroup), não switches: no Orange, Switch tem efeito imediato, e aqui a escolha só vale ao salvar.',
              en: 'Categories are checkboxes (CheckboxGroup), not switches: in Orange a Switch takes effect immediately, and here the choice only applies on save.',
            },
            {
              pt: 'Só carregue scripts opcionais (analytics, pixels de anúncio) depois de uma decisão que os aceite. Fechar a página sem decidir não é consentimento.',
              en: 'Only load optional scripts (analytics, ad pixels) after a decision that accepts them. Leaving the page without deciding is not consent.',
            },
            {
              pt: (
                <>
                  Mudar de ideia tem que ser tão fácil quanto aceitar: deixe um link "Preferências
                  de cookies" no rodapé de todas as páginas, abrindo as preferências com{' '}
                  <Code>preferencesOpen</Code>.
                </>
              ),
              en: (
                <>
                  Changing your mind must be as easy as accepting: keep a "Cookie preferences" link
                  in the footer of every page, opening the preferences with{' '}
                  <Code>preferencesOpen</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  O app guarda a decisão em <Code>onDecision</Code> — o componente não lê nem grava
                  cookies ou <Code>localStorage</Code>. Guarde só o necessário: as categorias, a
                  versão da política e a data. Nunca dados pessoais.
                </>
              ),
              en: (
                <>
                  The app stores the decision in <Code>onDecision</Code> — the component never reads
                  or writes cookies or <Code>localStorage</Code>. Store only what is needed: the
                  categories, the policy version and the date. Never personal data.
                </>
              ),
            },
            {
              pt: (
                <>
                  Fixo (<Code>bottom</Code>/<Code>top</Code>), o banner é renderizado no início do{' '}
                  <Code>&lt;body&gt;</Code>: é o primeiro na leitura e na ordem do Tab, como no
                  GOV.UK, onde quer que você o declare. Mantenha-o montado e controle{' '}
                  <Code>open</Code>. Para reabrir a pedido da pessoa, prefira abrir as preferências
                  (<Code>preferencesOpen</Code>) — elas recebem o foco; o banner reaberto não o
                  rouba.
                </>
              ),
              en: (
                <>
                  Fixed (<Code>bottom</Code>/<Code>top</Code>), the banner is rendered at the start
                  of <Code>&lt;body&gt;</Code>: it comes first in reading and Tab order, as on
                  GOV.UK, wherever you declare it. Keep it mounted and control <Code>open</Code>. To
                  reopen on request, prefer opening the preferences (<Code>preferencesOpen</Code>) —
                  they receive focus; a reopened banner does not steal it.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doItems={[
            {
              pt: 'Texto curto e direto: o que é usado, para quê e que dá para mudar depois.',
              en: 'Short, plain text: what is used, what for, and that it can be changed later.',
            },
            {
              pt: 'Link para a política de cookies (policyHref) sempre visível no banner.',
              en: 'A link to the cookie policy (policyHref) always visible in the banner.',
            },
            {
              pt: 'Mostrar o banner de novo quando a política ou as categorias mudarem (versione o registro).',
              en: 'Show the banner again when the policy or the categories change (version the record).',
            },
          ]}
          dontItems={[
            {
              pt: 'Bloquear o site inteiro até a pessoa aceitar ("cookie wall") ou só permitir "Aceitar".',
              en: 'Block the whole site until people accept ("cookie wall") or only offer "Accept".',
            },
            {
              pt: 'Pré-marcar categorias opcionais ou tratar rolar a página como aceite.',
              en: 'Pre-tick optional categories or treat scrolling as acceptance.',
            },
            {
              pt: 'Esconder a forma de revogar: sem o link no rodapé, mudar de ideia fica mais difícil que aceitar.',
              en: 'Hide the way to withdraw: without the footer link, changing your mind is harder than accepting.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Região', en: 'Region' },
              description: {
                pt: (
                  <>
                    <Code>role="region"</Code> nomeada pelo título (<Code>aria-labelledby</Code>):
                    aparece na lista de regiões do leitor de tela. Não é um diálogo — não prende nem
                    rouba o foco.
                  </>
                ),
                en: (
                  <>
                    <Code>role="region"</Code> named by the title (<Code>aria-labelledby</Code>): it
                    shows up in the screen reader's landmarks list. It is not a dialog — it neither
                    traps nor steals focus.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Título e texto', en: 'Title and text' },
              description: {
                pt: (
                  <>
                    <Code>title</Code> (um <Code>h2</Code>; troque com <Code>headingLevel</Code>) e{' '}
                    <Code>children</Code>. Sem eles, textos padrão no idioma do OrangeProvider.{' '}
                    <Code>policyHref</Code> acrescenta o link "Política de cookies".
                  </>
                ),
                en: (
                  <>
                    <Code>title</Code> (an <Code>h2</Code>; change it with <Code>headingLevel</Code>
                    ) and <Code>children</Code>. Without them, default texts in the OrangeProvider
                    language. <Code>policyHref</Code> adds the "Cookie policy" link.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Ações', en: 'Actions' },
              description: {
                pt: '"Aceitar todos", "Rejeitar opcionais" e "Personalizar", com o mesmo peso visual. Em larguras de até 30rem, empilham na largura toda.',
                en: '"Accept all", "Reject optional" and "Customize", with equal visual weight. Up to 30rem wide, they stack at full width.',
              },
            },
            {
              term: { pt: 'Preferências', en: 'Preferences' },
              description: {
                pt: (
                  <>
                    Um Modal com um CheckboxGroup em cartões ("Categorias de cookies"), uma caixa
                    por categoria com a descrição. As <Code>required</Code> ficam marcadas,
                    desabilitadas e com "Sempre ativos"; as demais começam como no valor atual.
                    "Salvar preferências" decide com o que está marcado; "Aceitar todos" marca tudo.
                    Fechar sem salvar descarta as mudanças.
                  </>
                ),
                en: (
                  <>
                    A Modal with a card CheckboxGroup ("Cookie categories"), one checkbox per
                    category with its description. <Code>required</Code> ones are checked, disabled
                    and marked "Always active"; the others start from the current value. "Save
                    preferences" decides with what is checked; "Accept all" checks everything.
                    Closing without saving discards the changes.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Confirmação', en: 'Confirmation' },
              description: {
                pt: 'Depois de cada decisão o banner fecha e uma região de status anuncia "Você aceitou todos os cookies…", "Você rejeitou os cookies opcionais…" ou "Suas preferências de cookies foram salvas…", como a mensagem de confirmação do GOV.UK.',
                en: 'After each decision the banner closes and a status region announces "You\'ve accepted all cookies…", "You\'ve rejected optional cookies…" or "Your cookie preferences have been saved…", like the GOV.UK confirmation message.',
              },
            },
            {
              term: { pt: 'Posição', en: 'Position' },
              description: {
                pt: (
                  <>
                    <Code>bottom</Code> (padrão) e <Code>top</Code>: fixo na janela, em portal no
                    início do <Code>&lt;body&gt;</Code>, acima do conteúdo (um acima de{' '}
                    <Code>--or-z-header</Code>) e da safe area, com a largura máxima do layout. A
                    distância da borda vem de <Code>--or-consent-banner-offset</Code>. O tema de uma
                    área com <Code>data-theme</Code> acompanha o portal. <Code>inline</Code>: no
                    fluxo da página, onde foi declarado.
                  </>
                ),
                en: (
                  <>
                    <Code>bottom</Code> (default) and <Code>top</Code>: fixed to the window, in a
                    portal at the start of <Code>&lt;body&gt;</Code>, above the content (one above{' '}
                    <Code>--or-z-header</Code>) and the safe area, at the layout max width. The edge
                    distance comes from <Code>--or-consent-banner-offset</Code>. The theme of an
                    area with <Code>data-theme</Code> follows the portal. <Code>inline</Code>: in
                    the page flow, where it is declared.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: (
              <>
                No fluxo da página (<Code>placement="inline"</Code>). Decida para ver o que{' '}
                <Code>onDecision</Code> recebe.
              </>
            ),
            en: (
              <>
                In the page flow (<Code>placement="inline"</Code>). Decide to see what{' '}
                <Code>onDecision</Code> receives.
              </>
            ),
          }}
          code={BasicCode}
          align="stretch"
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Guardando a decisão', en: 'Storing the decision' }}
          description={{
            pt: (
              <>
                O app lê a escolha salva depois de montar e mostra o banner só se não houver decisão
                (ou se a versão da política mudou). <Code>onDecision</Code> grava categorias, versão
                e data no <Code>localStorage</Code>; o botão "Preferências de cookies" do rodapé
                reabre as preferências com <Code>preferencesOpen</Code>.
              </>
            ),
            en: (
              <>
                The app reads the saved choice after mounting and only shows the banner when there
                is no decision (or the policy version changed). <Code>onDecision</Code> writes the
                categories, version and date to <Code>localStorage</Code>; the footer "Cookie
                preferences" button reopens the preferences with <Code>preferencesOpen</Code>.
              </>
            ),
          }}
          code={PersistenceCode}
          align="stretch"
        >
          <Persistence />
        </Example>
        <Example
          title={{ pt: 'Fixo na janela (padrão)', en: 'Fixed to the window (default)' }}
          description={{
            pt: 'Sem placement, o banner flutua no rodapé da janela; placement="top" o leva para o topo. Enquanto ele está aberto, a página reserva a altura dele na rolagem para que o elemento focado nunca fique escondido atrás.',
            en: 'Without placement, the banner floats at the bottom of the window; placement="top" moves it to the top. While it is open, the page reserves its height when scrolling so the focused element is never hidden behind it.',
          }}
          code={ViewportCode}
        >
          <Viewport />
        </Example>
        <Example
          title={{ pt: 'Texto próprio e roteador', en: 'Custom text and router' }}
          description={{
            pt: (
              <>
                <Code>title</Code> e <Code>children</Code> trocam os textos; <Code>renderLink</Code>{' '}
                renderiza o link da política com o componente do seu roteador.
              </>
            ),
            en: (
              <>
                <Code>title</Code> and <Code>children</Code> replace the texts;{' '}
                <Code>renderLink</Code> renders the policy link with your router's component.
              </>
            ),
          }}
          code={CustomTextCode}
          align="stretch"
        >
          <CustomText />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrar', en: 'Enter' },
              description: {
                pt: (
                  <>
                    Sobe 24px a partir da borda (desce, no topo; 8px no inline) com fade em{' '}
                    <Code>--or-duration-medium</Code> e <Code>--or-ease-out</Code>.
                  </>
                ),
                en: (
                  <>
                    Rises 24px from the edge (drops, on top; 8px inline) with a fade in{' '}
                    <Code>--or-duration-medium</Code> and <Code>--or-ease-out</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Sair', en: 'Exit' },
              description: {
                pt: (
                  <>
                    Mais curta: volta 8px e esmaece em <Code>--or-duration-fast</Code> com{' '}
                    <Code>--or-ease-in-out</Code>, sem receber cliques nem foco (<Code>inert</Code>
                    ). No inline, a altura recolhe junto e a página sobe suave. O{' '}
                    <Code>usePresence</Code> mantém o banner montado até o fim.
                  </>
                ),
                en: (
                  <>
                    Shorter: moves back 8px and fades in <Code>--or-duration-fast</Code> with{' '}
                    <Code>--or-ease-in-out</Code>, ignoring clicks and focus (<Code>inert</Code>).
                    Inline, the height collapses too so the page moves up smoothly.{' '}
                    <Code>usePresence</Code> keeps the banner mounted until it ends.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: (
                  <>
                    Com <Code>prefers-reduced-motion</Code>, sem deslocamento e com as durações
                    zeradas: o banner só aparece e some.
                  </>
                ),
                en: (
                  <>
                    With <Code>prefers-reduced-motion</Code>, no movement and zero durations: the
                    banner just appears and disappears.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'categories',
              type: 'ConsentCategory[]',
              required: true,
              description: {
                pt: (
                  <>
                    <Code>
                      &#123; id: string; label: ReactNode; description?: ReactNode; required?:
                      boolean &#125;
                    </Code>
                    , na ordem exibida nas preferências. <Code>required</Code>: sempre aceita.
                  </>
                ),
                en: (
                  <>
                    <Code>
                      &#123; id: string; label: ReactNode; description?: ReactNode; required?:
                      boolean &#125;
                    </Code>
                    , in the order shown in the preferences. <Code>required</Code>: always accepted.
                  </>
                ),
              },
            },
            {
              name: 'onDecision',
              type: "(consent: ConsentValue, source: 'accept-all' | 'reject' | 'custom') => void",
              description: {
                pt: 'Chamado a cada decisão, com todas as categorias. Depois dele o banner fecha. É aqui que o app guarda a escolha.',
                en: 'Called on every decision, with every category. The banner closes afterwards. This is where the app stores the choice.',
              },
            },
            {
              name: 'value',
              type: 'Record<string, boolean>',
              description: {
                pt: 'Preferências atuais (controlado). Categorias ausentes contam como recusadas; as required, como aceitas.',
                en: 'Current preferences (controlled). Missing categories count as rejected; required ones as accepted.',
              },
            },
            {
              name: 'defaultValue',
              type: 'Record<string, boolean>',
              description: {
                pt: 'Preferências iniciais (não controlado). Padrão: só as obrigatórias.',
                en: 'Initial preferences (uncontrolled). Default: only the required ones.',
              },
            },
            {
              name: 'onChange',
              type: '(consent: ConsentValue) => void',
              description: {
                pt: 'Chamado quando uma decisão muda as preferências.',
                en: 'Called when a decision changes the preferences.',
              },
            },
            {
              name: 'open',
              type: 'boolean',
              description: {
                pt: 'Banner visível (controlado).',
                en: 'Banner visible (controlled).',
              },
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'true',
              description: {
                pt: 'Banner visível inicialmente (não controlado).',
                en: 'Banner initially visible (uncontrolled).',
              },
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              description: {
                pt: (
                  <>
                    Chamado quando o banner pede para abrir ou fechar — com <Code>false</Code> após
                    cada decisão.
                  </>
                ),
                en: (
                  <>
                    Called when the banner asks to open or close — with <Code>false</Code> after
                    every decision.
                  </>
                ),
              },
            },
            {
              name: 'preferencesOpen',
              type: 'boolean',
              description: {
                pt: 'Preferências abertas (controlado) — para o link "Preferências de cookies" do rodapé. Funciona com o banner fechado.',
                en: 'Preferences open (controlled) — for the footer "Cookie preferences" link. Works with the banner closed.',
              },
            },
            {
              name: 'defaultPreferencesOpen',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Preferências abertas inicialmente (não controlado).',
                en: 'Preferences initially open (uncontrolled).',
              },
            },
            {
              name: 'onPreferencesOpenChange',
              type: '(open: boolean) => void',
              description: {
                pt: 'Chamado quando as preferências abrem ou fecham.',
                en: 'Called when the preferences open or close.',
              },
            },
            {
              name: 'title',
              type: 'ReactNode',
              default: "'Cookies neste site'",
              description: {
                pt: 'Título; nomeia a região.',
                en: 'Title; names the region.',
              },
            },
            {
              name: 'headingLevel',
              type: '2 | 3 | 4 | 5 | 6',
              default: '2',
              description: { pt: 'Nível de heading do título.', en: 'Heading level of the title.' },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: {
                pt: 'Texto do banner. Padrão: um texto genérico sobre cookies necessários e opcionais.',
                en: 'Banner text. Default: a generic text about necessary and optional cookies.',
              },
            },
            {
              name: 'policyHref',
              type: 'string',
              description: {
                pt: 'Endereço da política de cookies (ou de privacidade): mostra o link "Política de cookies".',
                en: 'Address of the cookie (or privacy) policy: shows the "Cookie policy" link.',
              },
            },
            {
              name: 'renderLink',
              type: '(props: RenderLinkProps) => ReactNode',
              description: {
                pt: (
                  <>
                    Renderiza o link da política com o seu roteador:{' '}
                    <Code>
                      renderLink=&#123;(&#123; href, ...p &#125;) =&gt; &lt;RouterLink
                      to=&#123;href&#125; &#123;...p&#125; /&gt;&#125;
                    </Code>
                    .
                  </>
                ),
                en: (
                  <>
                    Renders the policy link with your router:{' '}
                    <Code>
                      renderLink=&#123;(&#123; href, ...p &#125;) =&gt; &lt;RouterLink
                      to=&#123;href&#125; &#123;...p&#125; /&gt;&#125;
                    </Code>
                    .
                  </>
                ),
              },
            },
            {
              name: 'placement',
              type: "'bottom' | 'top' | 'inline'",
              default: "'bottom'",
              description: {
                pt: 'Fixo no rodapé ou no topo da janela, ou no fluxo da página.',
                en: 'Fixed to the bottom or top of the window, or in the page flow.',
              },
            },
            {
              name: 'finalFocus',
              type: 'RefObject<HTMLElement>',
              description: {
                pt: 'Destino do foco quando o banner fecha com o foco dentro dele (ou nas preferências abertas por ele).',
                en: 'Where focus goes when the banner closes with focus inside it (or in the preferences it opened).',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Atributos nativos da região (id, className, aria-label…). A ref aponta para ela.',
                en: 'Native attributes of the region (id, className, aria-label…). The ref points to it.',
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
                Segue o padrão do GOV.UK: o banner é uma <Code>role="region"</Code> nomeada pelo
                título, <strong>não prende o foco e não o rouba ao aparecer</strong> — nem na
                primeira visita, nem ao ser reaberto. Fixo, ele é renderizado no início do{' '}
                <Code>&lt;body&gt;</Code>: é o primeiro elemento na leitura e na ordem do Tab, mesmo
                aparecendo no rodapé. Enquanto ele está fixo na janela, a altura dele é reservada na
                rolagem (<Code>scroll-padding</Code>), para que o elemento focado nunca fique
                escondido atrás dele.
              </>
            }
            en={
              <>
                It follows the GOV.UK pattern: the banner is a <Code>role="region"</Code> named by
                its title and <strong>neither traps focus nor steals it when it appears</strong> —
                on the first visit or when reopened. When fixed, it is rendered at the start of{' '}
                <Code>&lt;body&gt;</Code>: it comes first in reading and Tab order, even when shown
                at the bottom. While it is fixed to the window, its height is reserved when
                scrolling (<Code>scroll-padding</Code>), so the focused element is never hidden
                behind it.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                <strong>Foco depois da decisão:</strong> se o foco estava no banner (ou nas
                preferências abertas por ele), ele vai para <Code>finalFocus</Code>; senão, para o
                elemento focado antes de entrar no banner; sem ele, para o próximo elemento focável
                depois do banner na página (normalmente o link de atalho ou o cabeçalho) — ou o
                anterior, se o banner for o último. Preferências abertas pelo rodapé devolvem o foco
                para o botão que as abriu. A confirmação é anunciada numa região{' '}
                <Code>role="status"</Code> educada, sempre montada no lugar do componente — mantenha
                o ConsentBanner montado e controle <Code>open</Code>, em vez de removê-lo.
              </>
            }
            en={
              <>
                <strong>Focus after a decision:</strong> if focus was in the banner (or in the
                preferences it opened), it moves to <Code>finalFocus</Code>; otherwise to the
                element focused before entering the banner; without it, to the next focusable
                element after the banner on the page (usually the skip link or the header) — or the
                previous one if the banner is last. Preferences opened from the footer return focus
                to the button that opened them. The confirmation is announced in a polite{' '}
                <Code>role="status"</Code> region, always mounted where the component is — keep the
                ConsentBanner mounted and control <Code>open</Code> instead of removing it.
              </>
            }
          />
        </p>
        <p>
          <T
            pt="As preferências são um Modal: prendem o foco (que entra na primeira caixa que pode ser alterada), fecham com Escape e devolvem o foco a Personalizar. As categorias formam um grupo nomeado (fieldset e legend “Categorias de cookies”); as caixas obrigatórias são desabilitadas e o nome delas inclui “Sempre ativos”."
            en="The preferences are a Modal: they trap focus (which lands on the first checkbox that can be changed), close with Escape and return focus to Customize. The categories form a named group (fieldset and legend “Cookie categories”); required checkboxes are disabled and their name includes “Always active”."
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Percorre o link da política e as três ações, na ordem da página; nas preferências, as caixas e os botões (preso no diálogo).',
                en: 'Moves through the policy link and the three actions, in page order; in the preferences, the checkboxes and buttons (trapped in the dialog).',
              },
            },
            {
              keys: ['Shift', 'Tab'],
              description: { pt: 'Mesmo caminho, ao contrário.', en: 'Same path, backwards.' },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Ativa o botão focado; em "Personalizar", abre as preferências.',
                en: 'Activates the focused button; on "Customize", opens the preferences.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'Ativa o botão ou marca/desmarca a caixa focada.',
                en: 'Activates the focused button or checks/unchecks the focused checkbox.',
              },
            },
            {
              keys: ['Esc'],
              description: {
                pt: 'Nas preferências, fecha sem salvar. No banner, não faz nada: fechar sem decidir não é uma escolha.',
                en: 'In the preferences, closes without saving. In the banner, does nothing: closing without deciding is not a choice.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Região nomeada pelo título; categorias num fieldset com legend; caixas com nome e descrição.',
                en: 'Region named by its title; categories in a fieldset with a legend; checkboxes with a name and description.',
              },
            },
            {
              criterion: '1.4.10',
              description: {
                pt: 'Reflui em larguras estreitas: ações empilhadas, sem rolagem horizontal a 320px.',
                en: 'Reflows at narrow widths: stacked actions, with no horizontal scrolling at 320px.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Todas as ações e categorias alcançáveis pelo teclado.',
                en: 'Every action and category is reachable by keyboard.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Aparecer não rouba o foco; depois da decisão, o foco vai para um lugar previsível.',
                en: 'Appearing does not steal focus; after a decision, focus goes to a predictable place.',
              },
            },
            {
              criterion: '2.4.11',
              description: {
                pt: 'Fixo na janela, reserva a própria altura na rolagem: o foco não fica escondido atrás dele.',
                en: 'When fixed to the window, it reserves its own height when scrolling: focus is not hidden behind it.',
              },
            },
            {
              criterion: '3.2.1',
              description: {
                pt: 'Receber foco não muda nada: só um clique ou tecla decide.',
                en: 'Receiving focus changes nothing: only a click or key press decides.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'A confirmação da escolha é anunciada numa região de status, sem mover o foco para ela.',
                en: 'The confirmation of the choice is announced in a status region, without moving focus to it.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
