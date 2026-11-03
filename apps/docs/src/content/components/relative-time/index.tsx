import { Bullets, Code, ComponentPage, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import ActivityFeed from './examples/ActivityFeed'
import ActivityFeedCode from './examples/ActivityFeed?raw'
import AutoThreshold from './examples/AutoThreshold'
import AutoThresholdCode from './examples/AutoThreshold?raw'
import Styles from './examples/Styles'
import StylesCode from './examples/Styles?raw'
import Upcoming from './examples/Upcoming'
import UpcomingCode from './examples/Upcoming?raw'
import { meta } from './meta'

export default function RelativeTimePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use datas relativas quando a proximidade importa mais que o instante exato: feeds de atividade, comentários, "atualizado há".',
              en: 'Use relative dates when recency matters more than the exact moment: activity feeds, comments, "updated ago".',
            },
            {
              pt: (
                <>
                  Para datas antigas, o formato <strong>auto</strong> troca para a data absoluta depois de{' '}
                  <strong>threshold</strong> dias — "há 4 meses" é menos útil que "12 de jun. de 2026".
                </>
              ),
              en: (
                <>
                  For older dates, the <strong>auto</strong> format switches to the absolute date after <strong>threshold</strong>{' '}
                  days — "4 months ago" is less useful than "Jun 12, 2026".
                </>
              ),
            },
            {
              pt: 'Quando o horário exato for decisivo (prazos, transações, registros de auditoria), use format="absolute" ou mostre as duas formas.',
              en: 'When the exact time is decisive (deadlines, transactions, audit logs), use format="absolute" or show both forms.',
            },
            {
              pt: 'O texto segue o idioma do OrangeProvider — troque o idioma da documentação (PT/EN) para ver os exemplos em inglês.',
              en: 'The text follows the OrangeProvider language — switch the docs language (PT/EN) to see the examples translated.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Feed de atividade', en: 'Activity feed' }}
          description={{
            pt: 'O texto se atualiza sozinho: "agora" vira "há 1 minuto" sem recarregar. Passe o mouse para ver a data completa.',
            en: 'The text updates itself: "now" turns into "1 minute ago" without reloading. Hover to see the full date.',
          }}
          code={ActivityFeedCode}
        >
          <ActivityFeed />
        </Example>
        <Example
          title={{ pt: 'Relativo até um limite', en: 'Relative up to a limit' }}
          description={{
            pt: 'Com format="auto" (padrão), datas além de threshold dias aparecem no formato absoluto.',
            en: 'With format="auto" (default), dates beyond threshold days appear in absolute form.',
          }}
          code={AutoThresholdCode}
        >
          <AutoThreshold />
        </Example>
        <Example
          title={{ pt: 'Datas futuras', en: 'Future dates' }}
          description={{ pt: 'Funciona nos dois sentidos: "em 2 horas", "amanhã", "próximo mês".', en: 'Works both ways: "in 2 hours", "tomorrow", "next month".' }}
          code={UpcomingCode}
        >
          <Upcoming />
        </Example>
        <Example
          title={{ pt: 'Estilos e formatos', en: 'Styles and formats' }}
          description={{
            pt: 'numeric="auto" usa expressões naturais ("ontem"); relativeStyle encurta as unidades.',
            en: 'numeric="auto" uses natural phrases ("yesterday"); relativeStyle shortens units.',
          }}
          code={StylesCode}
        >
          <Styles />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'date', type: 'Date | string | number', required: true, description: { pt: 'Data de referência. Strings AAAA-MM-DD são lidas como data local.', en: 'Reference date. YYYY-MM-DD strings are read as local dates.' } },
            { name: 'format', type: "'relative' | 'absolute' | 'auto'", default: "'auto'", description: { pt: 'Relativo, absoluto ou relativo até threshold dias.', en: 'Relative, absolute, or relative up to threshold days.' } },
            { name: 'threshold', type: 'number', default: '7', description: { pt: 'Dias em que o formato auto continua relativo.', en: 'Days the auto format stays relative.' } },
            { name: 'updateInterval', type: 'number | false', description: { pt: 'Intervalo de atualização em ms. Padrão: automático (5 s a 1 h conforme a distância). false desliga.', en: 'Update interval in ms. Default: automatic (5 s to 1 h depending on distance). false disables it.' } },
            { name: 'numeric', type: "'auto' | 'always'", default: "'auto'", description: { pt: '"ontem" (auto) ou "há 1 dia" (always).', en: '"yesterday" (auto) or "1 day ago" (always).' } },
            { name: 'relativeStyle', type: "'long' | 'short' | 'narrow'", default: "'long'", description: { pt: 'Extensão das unidades.', en: 'Unit length.' } },
            { name: 'absoluteFormat', type: 'Intl.DateTimeFormatOptions', default: "{ dateStyle: 'medium', timeStyle: 'short' }", description: { pt: 'Formato do texto absoluto.', en: 'Absolute text format.' } },
            { name: 'showTitle', type: 'boolean', default: 'true', description: { pt: 'Data completa no title.', en: 'Full date in the title.' } },
            { name: '...rest', type: 'TimeHTMLAttributes', description: { pt: 'Atributos nativos de <time>.', en: 'Native <time> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Renderiza <Code>&lt;time dateTime="…"&gt;</Code> com a data em ISO 8601, legível por máquinas. As atualizações
                periódicas são silenciosas (sem <Code>aria-live</Code>) para não interromper leitores de tela a cada minuto. O{' '}
                <Code>title</Code> com a data completa ajuda quem usa mouse, mas não aparece para teclado ou toque — por isso, quando
                a data exata importa, exiba-a no texto.
              </>
            }
            en={
              <>
                Renders <Code>&lt;time dateTime="…"&gt;</Code> with an ISO 8601, machine-readable date. Periodic updates are silent
                (no <Code>aria-live</Code>) so screen readers aren't interrupted every minute. The <Code>title</Code> with the full
                date helps mouse users but isn't available to keyboard or touch — so when the exact date matters, show it in the
                text.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Data exposta em formato legível por máquina no atributo dateTime.', en: 'Date exposed in machine-readable form in the dateTime attribute.' } },
            { criterion: '2.2.2', description: { pt: 'Atualizações discretas, sem animação nem anúncios automáticos.', en: 'Discreet updates, with no animation or automatic announcements.' } },
            { criterion: '3.1.2', description: { pt: 'Texto gerado no idioma do provider (Intl.RelativeTimeFormat).', en: 'Text generated in the provider language (Intl.RelativeTimeFormat).' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
