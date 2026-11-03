import { Bullets, Code, ComponentPage, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import InForm from './examples/InForm'
import InFormCode from './examples/InForm?raw'
import Metric from './examples/Metric'
import MetricCode from './examples/Metric?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import { meta } from './meta'

export default function ToggletipPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para explicar um termo, uma métrica ou uma regra ao lado de onde ela aparece — informação útil, mas que não precisa ficar sempre visível.',
              en: 'Use it to explain a term, metric or rule next to where it appears — useful information that does not need to be always visible.',
            },
            {
              pt: (
                <>
                  Dê um rótulo específico ao botão: <strong>Sobre a taxa de conversão</strong> diz mais que o padrão{' '}
                  <strong>Mais informações</strong>, principalmente quando há vários na tela.
                </>
              ),
              en: (
                <>
                  Give the button a specific label: <strong>About conversion rate</strong> says more than the default{' '}
                  <strong>More information</strong>, especially when there are several on screen.
                </>
              ),
            },
            {
              pt: 'Uma ou duas frases, sem links nem botões: o conteúdo é anunciado, mas não recebe foco.',
              en: 'One or two sentences, no links or buttons: the content is announced but never receives focus.',
            },
            {
              pt: 'Diferente do Tooltip, abre com clique ou toque — funciona em telas sensíveis ao toque.',
              en: 'Unlike Tooltip, it opens on click or tap — it works on touch screens.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Ao lado de uma métrica', en: 'Next to a metric' }}
          description={{ pt: 'Clique no ícone ou foque e pressione Enter. Escape ou clique fora fecham.', en: 'Click the icon or focus it and press Enter. Escape or an outside click close it.' }}
          code={MetricCode}
        >
          <Metric />
        </Example>
        <Example
          title={{ pt: 'Em um campo de formulário', en: 'In a form field' }}
          description={{
            pt: (
              <>
                Dentro de <Code>labelAside</Code> do Field. O conteúdo pode ter formatação simples.
              </>
            ),
            en: (
              <>
                Inside the Field's <Code>labelAside</Code>. Content can have simple formatting.
              </>
            ),
          }}
          code={InFormCode}
        >
          <InForm />
        </Example>
        <Example
          title={{ pt: 'Tamanhos e ícone', en: 'Sizes and icon' }}
          description={{ pt: 'sm (24px, padrão) e md (32px); o ícone pode ser trocado.', en: 'sm (24px, default) and md (32px); the icon can be changed.' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'content', type: 'ReactNode', required: true, description: { pt: 'Explicação exibida e anunciada.', en: 'Explanation shown and announced.' } },
            { name: 'label', type: 'string', default: "t('moreInfo')", description: { pt: 'Nome acessível do botão ("Mais informações").', en: 'Accessible name of the button ("More information").' } },
            { name: 'placement', type: 'Placement', default: "'top'", description: { pt: 'Posição preferida da bolha.', en: 'Preferred bubble position.' } },
            { name: 'offset', type: 'number', default: '8', description: { pt: 'Distância do botão (px).', en: 'Distance from the button (px).' } },
            { name: 'icon', type: 'IconName', default: "'info'", description: { pt: 'Ícone do botão.', en: 'Button icon.' } },
            { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: { pt: 'Tamanho do botão: 24px ou 32px.', en: 'Button size: 24px or 32px.' } },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: { pt: 'Estado controlado ou não controlado.', en: 'Controlled or uncontrolled state.' } },
            { name: '...rest', type: 'ButtonHTMLAttributes', description: { pt: 'Repassados ao <button>.', en: 'Passed to the <button>.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Implementa o padrão <em>toggletip</em> do Inclusive Components: um <Code>&lt;button&gt;</Code> com rótulo e{' '}
                <Code>aria-expanded</Code>, e uma região <Code>role="status"</Code> / <Code>aria-live="polite"</Code> que existe
                desde o carregamento. Ao abrir, a bolha é inserida nessa região e o leitor de tela anuncia o texto sem mover o
                foco. Ao fechar, a região é esvaziada — abrir de novo anuncia de novo.
              </>
            }
            en={
              <>
                Implements the Inclusive Components <em>toggletip</em> pattern: a labelled <Code>&lt;button&gt;</Code> with{' '}
                <Code>aria-expanded</Code>, and a <Code>role="status"</Code> / <Code>aria-live="polite"</Code> region present from
                page load. On open, the bubble is inserted into that region and screen readers announce the text without moving
                focus. On close, the region is emptied — opening again announces it again.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Enter'], description: { pt: 'Abre ou fecha a explicação.', en: 'Opens or closes the explanation.' } },
            { keys: ['Space'], description: { pt: 'Abre ou fecha a explicação.', en: 'Opens or closes the explanation.' } },
            { keys: ['Esc'], description: { pt: 'Fecha mantendo o foco no botão.', en: 'Closes and keeps focus on the button.' } },
            { keys: ['Tab'], description: { pt: 'Sai do botão e fecha a explicação.', en: 'Leaves the button and closes the explanation.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.13', description: { pt: 'Aberto por ação explícita, dispensável com Escape e persistente até ser fechado.', en: 'Opened by explicit action, dismissible with Escape and persistent until closed.' } },
            { criterion: '2.5.8', description: { pt: 'Alvo de toque de no mínimo 24×24px.', en: 'Touch target of at least 24×24px.' } },
            { criterion: '4.1.2', description: { pt: 'Botão com nome acessível traduzido e estado aria-expanded.', en: 'Button with a translated accessible name and aria-expanded state.' } },
            { criterion: '4.1.3', description: { pt: 'Conteúdo anunciado por região aria-live, sem mover o foco.', en: 'Content announced through an aria-live region, without moving focus.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
