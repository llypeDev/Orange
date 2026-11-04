import { Bullets, Callout, Code, ComponentPage, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T, useLang } from '../../../i18n'
import DetectTruncation from './examples/DetectTruncation'
import DetectTruncationCode from './examples/DetectTruncation?raw'
import FlexRow from './examples/FlexRow'
import FlexRowCode from './examples/FlexRow?raw'
import MultiLine from './examples/MultiLine'
import MultiLineCode from './examples/MultiLine?raw'
import SingleLine from './examples/SingleLine'
import SingleLineCode from './examples/SingleLine?raw'
import { meta } from './meta'

export default function TruncatedTextPage() {
  const { t } = useLang()
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para textos secundários em espaços fixos: nomes de arquivos, prévias de mensagens, descrições em cartões.',
              en: 'Use it for secondary text in fixed spaces: file names, message previews, card descriptions.',
            },
            {
              pt: 'Não corte informações essenciais, como valores, prazos ou mensagens de erro. Se a pessoa precisa ler tudo, use ExpandableText.',
              en: 'Never clamp essential information such as amounts, deadlines or error messages. If people need to read it all, use ExpandableText.',
            },
            {
              pt: (
                <>
                  <strong>showTitle</strong> mostra o texto completo ao passar o mouse, mas não ajuda quem usa teclado ou tela de
                  toque. Garanta outro caminho para o conteúdo completo (a página de detalhes, por exemplo).
                </>
              ),
              en: (
                <>
                  <strong>showTitle</strong> reveals the full text on hover, but doesn't help keyboard or touch users. Make sure
                  there's another way to reach the full content (a details page, for example).
                </>
              ),
            },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Em layouts flex e grid', en: 'In flex and grid layouts' }}>
          {t({
            pt: 'Itens flex não encolhem abaixo do conteúdo por padrão. Aplique min-width: 0 no item que contém o TruncatedText para o corte funcionar.',
            en: "Flex items don't shrink below their content by default. Apply min-width: 0 to the item containing TruncatedText so clamping works.",
          })}
        </Callout>
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Uma linha', en: 'Single line' }}
          description={{
            pt: 'Com showTitle, o title nativo só aparece quando o texto está realmente cortado.',
            en: 'With showTitle, the native title only appears when the text is actually clamped.',
          }}
          code={SingleLineCode}
        >
          <SingleLine />
        </Example>
        <Example title={{ pt: 'Várias linhas', en: 'Multiple lines' }} code={MultiLineCode}>
          <MultiLine />
        </Example>
        <Example
          title={{ pt: 'Dentro de uma linha flex', en: 'Inside a flex row' }}
          code={FlexRowCode}
        >
          <FlexRow />
        </Example>
        <Example
          title={{ pt: 'Detectando o corte', en: 'Detecting truncation' }}
          description={{
            pt: 'onTruncatedChange avisa quando o texto passa a estar cortado — útil para mostrar um atalho para o conteúdo completo.',
            en: 'onTruncatedChange tells you when the text becomes clamped — useful to show a shortcut to the full content.',
          }}
          code={DetectTruncationCode}
        >
          <DetectTruncation />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'lines', type: 'number', default: '1', description: { pt: 'Linhas visíveis antes das reticências.', en: 'Visible lines before the ellipsis.' } },
            { name: 'as', type: 'ElementType', default: "'span'", description: { pt: 'Elemento renderizado (exibido como bloco).', en: 'Rendered element (displayed as block).' } },
            { name: 'showTitle', type: 'boolean', default: 'false', description: { pt: 'Texto completo no title quando há corte.', en: 'Full text in the title when clamped.' } },
            { name: 'onTruncatedChange', type: '(truncated: boolean) => void', description: { pt: 'Chamado quando o estado de corte muda.', en: 'Called when the truncation state changes.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: { pt: <>Atributos nativos. O elemento recebe <Code>data-truncated</Code> quando há corte.</>, en: <>Native attributes. The element gets <Code>data-truncated</Code> when clamped.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O corte é só visual (<Code>line-clamp</Code> / <Code>text-overflow</Code>): o texto completo continua no DOM, então
                leitores de tela leem tudo e a busca da página o encontra. O componente não é interativo e não recebe foco.
              </>
            }
            en={
              <>
                Clamping is visual only (<Code>line-clamp</Code> / <Code>text-overflow</Code>): the full text stays in the DOM, so
                screen readers read it all and in-page search finds it. The component is not interactive and takes no focus.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.3.2', description: { pt: 'O texto completo permanece na ordem de leitura.', en: 'The full text remains in the reading order.' } },
            { criterion: '1.4.4', description: { pt: 'O corte acompanha o zoom de texto sem sobreposição — mais zoom, mais corte, nunca texto escondido de forma inacessível.', en: 'Clamping follows text zoom without overlap — more zoom means more clamping, never inaccessibly hidden text.' } },
            { criterion: '1.4.10', description: { pt: 'Reflui em telas estreitas; use o title ou um link de detalhes para o conteúdo completo.', en: 'Reflows on narrow screens; use the title or a details link for the full content.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
