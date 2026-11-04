import { Bullets, Code, ComponentPage, DefinitionTable, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import Alternate from './examples/Alternate'
import AlternateCode from './examples/Alternate?raw'
import Changelog from './examples/Changelog'
import ChangelogCode from './examples/Changelog?raw'
import OrderHistory from './examples/OrderHistory'
import OrderHistoryCode from './examples/OrderHistory?raw'
import WithContent from './examples/WithContent'
import WithContentCode from './examples/WithContent?raw'
import Animated from './examples/Animated'
import AnimatedCode from './examples/Animated?raw'
import { meta } from './meta'

export default function TimelinePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para eventos já ocorridos ou previstos em ordem: histórico de pedido, changelog, atividade de um chamado.',
              en: 'Use it for past or planned events in order: order history, changelog, ticket activity.',
            },
            {
              pt: 'Escolha uma direção e mantenha-a: cronológica (mais antigo primeiro) para processos, reversa (mais recente primeiro) para feeds de atividade.',
              en: 'Pick one direction and keep it: chronological (oldest first) for processes, reverse (newest first) for activity feeds.',
            },
            {
              pt: (
                <>
                  Marque <strong>current</strong> em um único evento, quando houver uma etapa em andamento. Para fluxos que a
                  pessoa percorre (formulários em etapas), use Stepper.
                </>
              ),
              en: (
                <>
                  Mark <strong>current</strong> on a single event, when there is an ongoing step. For flows people move through
                  (multi-step forms), use Stepper.
                </>
              ),
            },
            {
              pt: 'A cor do marcador reforça o título — "Falha no build" já diz que algo deu errado. Não dependa só do tom.',
              en: 'Marker color reinforces the title — "Build failed" already says something went wrong. Never rely on tone alone.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Histórico de pedido', en: 'Order history' }}
          description={{
            pt: 'Datas AAAA-MM-DD são lidas como data local e formatadas no idioma do provider. dateLabel substitui o texto da data.',
            en: 'YYYY-MM-DD dates are read as local dates and formatted in the provider language. dateLabel replaces the date text.',
          }}
          code={OrderHistoryCode}
        >
          <OrderHistory />
        </Example>
        <Example
          title={{ pt: 'Changelog com ícones', en: 'Changelog with icons' }}
          description={{
            pt: 'icon aumenta o marcador; dateFormat na Timeline vale para todos os itens.',
            en: 'icon enlarges the marker; dateFormat on the Timeline applies to every item.',
          }}
          code={ChangelogCode}
        >
          <Changelog />
        </Example>
        <Example
          title={{ pt: 'Alternada', en: 'Alternate' }}
          description={{
            pt: 'Eventos alternam dos dois lados da linha. Em contêineres estreitos, volta ao layout padrão.',
            en: 'Events alternate on both sides of the line. In narrow containers, it falls back to the default layout.',
          }}
          code={AlternateCode}
        >
          <Alternate />
        </Example>
        <Example
          title={{ pt: 'Conteúdo adicional', en: 'Extra content' }}
          description={{
            pt: 'children aparece abaixo da descrição — anexos, ações, citações. titleAs ajusta o nível do título.',
            en: 'children renders below the description — attachments, actions, quotes. titleAs sets the heading level.',
          }}
          code={WithContentCode}
        >
          <WithContent />
        </Example>
        <Example
          title={{ pt: 'Entrada animada', en: 'Animated entrance' }}
          description={{ pt: 'Com animated, os eventos entram escalonados quando a timeline aparece na tela e a linha é desenhada. O evento atual pulsa.', en: 'With animated, events enter staggered when the timeline scrolls into view and the line draws itself. The current event pulses.' }}
          code={AnimatedCode}
        >
          <Animated />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Timeline', en: 'Timeline' }}
          rows={[
            { name: 'variant', type: "'default' | 'alternate'", default: "'default'", description: { pt: 'Linha à esquerda ou eventos alternados.', en: 'Line on the left or alternating events.' } },
            { name: 'dateFormat', type: 'Intl.DateTimeFormatOptions', default: "{ dateStyle: 'medium' }", description: { pt: 'Formato das datas dos itens.', en: 'Date format for the items.' } },
            { name: '...rest', type: 'OlHTMLAttributes', description: { pt: 'Atributos nativos de <ol>.', en: 'Native <ol> attributes.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'TimelineItem', en: 'TimelineItem' }}
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: { pt: 'Título do evento.', en: 'Event title.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio.', en: 'Supporting text.' } },
            { name: 'date', type: 'Date | string | number', description: { pt: <>Data do evento, renderizada em <Code>&lt;time dateTime&gt;</Code>.</>, en: <>Event date, rendered in <Code>&lt;time dateTime&gt;</Code>.</> } },
            { name: 'dateLabel', type: 'ReactNode', description: { pt: 'Texto no lugar da data formatada.', en: 'Text shown instead of the formatted date.' } },
            { name: 'dateFormat', type: 'Intl.DateTimeFormatOptions', description: { pt: 'Formato desta data.', en: 'Format for this date.' } },
            { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: { pt: 'Cor do marcador.', en: 'Marker color.' } },
            { name: 'current', type: 'boolean', default: 'false', description: { pt: <>Evento atual: destaque e <Code>aria-current="step"</Code>.</>, en: <>Current event: highlight and <Code>aria-current="step"</Code>.</> } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone dentro do marcador.', en: 'Icon inside the marker.' } },
            { name: 'titleAs', type: 'ElementType', default: "'p'", description: { pt: 'Elemento do título (h3, h4…).', en: 'Title element (h3, h4…).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Entrada (animated)', en: 'Entrance (animated)' }, description: { pt: 'Cada evento sobe 24px e aparece — 600ms, ease-out, 80ms entre eventos (stagger).', en: 'Each event rises 24px and fades in — 600ms, ease-out, 80ms between events (stagger).' } },
            { term: { pt: 'Linha vertical', en: 'Vertical line' }, description: { pt: 'É desenhada de cima para baixo (scaleY 0 → 1) logo depois do evento — 600ms, ease-out.', en: 'Draws top to bottom (scaleY 0 → 1) right after the event — 600ms, ease-out.' } },
            { term: { pt: 'Marcador', en: 'Marker' }, description: { pt: 'Surge com um pequeno "pop" (escala 0.4 → 1) — 250ms, ease-bounce.', en: 'Pops in (scale 0.4 → 1) — 250ms, ease-bounce.' } },
            { term: { pt: 'Evento atual', en: 'Current event' }, description: { pt: 'Anel pulsando no marcador (or-pulse), na cor do tom — ciclo de 2.4s. pulse={false} desliga; o estado também é dado por aria-current e pelo destaque visual.', en: 'Pulsing ring on the marker (or-pulse), in the tone color — 2.4s loop. pulse={false} turns it off; state is also given by aria-current and the visual highlight.' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Nada é escondido nem pulsa: os eventos aparecem direto.', en: 'Nothing is hidden or pulses: events appear immediately.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                A Timeline é um <Code>&lt;ol&gt;</Code> com <Code>role="list"</Code> explícito, então leitores de tela anunciam a
                quantidade e a posição de cada evento. Datas usam <Code>&lt;time dateTime&gt;</Code> com valor legível por máquina.
                O evento atual recebe <Code>aria-current="step"</Code>. Marcadores, linhas e ícones são decorativos.
              </>
            }
            en={
              <>
                Timeline is an <Code>&lt;ol&gt;</Code> with an explicit <Code>role="list"</Code>, so screen readers announce the
                count and position of each event. Dates use <Code>&lt;time dateTime&gt;</Code> with a machine-readable value. The
                current event gets <Code>aria-current="step"</Code>. Markers, lines and icons are decorative.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Ordem dos eventos exposta pela lista ordenada; datas com dateTime.', en: 'Event order exposed by the ordered list; dates with dateTime.' } },
            { criterion: '1.4.1', description: { pt: 'O tom do marcador nunca é a única forma de transmitir o estado.', en: 'Marker tone is never the only way to convey status.' } },
            { criterion: '1.4.10', description: { pt: 'A variante alternada vira coluna única em contêineres estreitos.', en: 'The alternate variant becomes a single column in narrow containers.' } },
            { criterion: '4.1.2', description: { pt: 'Evento atual exposto com aria-current="step".', en: 'Current event exposed with aria-current="step".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
