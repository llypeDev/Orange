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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Disclosure,
} from '@orangesys/ui'
import AdvancedOptions from './examples/AdvancedOptions'
import AdvancedOptionsCode from './examples/AdvancedOptions?raw'
import Controlled from './examples/Controlled'
import ControlledCode from './examples/Controlled?raw'
import OrderDetails from './examples/OrderDetails'
import OrderDetailsCode from './examples/OrderDetails?raw'
import WhyWeAsk from './examples/WhyWeAsk'
import WhyWeAskCode from './examples/WhyWeAsk?raw'
import { meta } from './meta'

export default function DisclosurePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para uma área isolada de conteúdo secundário: opções avançadas de um formulário, uma explicação ("Por que pedimos isso?"), os detalhes de um pedido.',
              en: 'Use it for a single area of secondary content: advanced form options, an explanation ("Why do we ask?"), order details.',
            },
            {
              pt: 'Não esconda o que a pessoa precisa para concluir a tarefa. Se quase todo mundo vai abrir, deixe aberto ou mostre direto.',
              en: 'Do not hide what people need to finish the task. If almost everyone will open it, leave it open or show it directly.',
            },
            {
              pt: 'Escreva um rótulo curto e específico, que diga o que vai aparecer — nunca "Clique aqui" ou "Mais".',
              en: 'Write a short, specific label that says what will appear — never "Click here" or "More".',
            },
            {
              pt: (
                <>
                  Campos dentro de um Disclosure fechado continuam montados e enviados com o
                  formulário. Se um deles tiver erro, abra a área (<Code>open</Code>/
                  <Code>onOpenChange</Code>) para a pessoa ver o problema.
                </>
              ),
              en: (
                <>
                  Fields inside a closed Disclosure stay mounted and are submitted with the form. If
                  one has an error, open the area (<Code>open</Code>/<Code>onOpenChange</Code>) so
                  people can see the problem.
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <Code>headingLevel</Code> quando o rótulo funcionar como título de seção
                  (variante <Code>outline</Code>), ajustado à hierarquia da página.
                </>
              ),
              en: (
                <>
                  Use <Code>headingLevel</Code> when the label works as a section title (
                  <Code>outline</Code> variant), matching the page hierarchy.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Disclosure label="Opções avançadas de envio">
              Agendar envio, limitar por região e testar com 10% da base.
            </Disclosure>
          }
          dontExample={
            <Accordion style={{ width: '100%' }}>
              <AccordionItem value="avancado">
                <AccordionTrigger>Opções avançadas de envio</AccordionTrigger>
                <AccordionContent>
                  Agendar envio, limitar por região e testar com 10% da base.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          }
          doItems={[
            { pt: 'Disclosure para uma área isolada.', en: 'Disclosure for a single area.' },
          ]}
          dontItems={[
            {
              pt: 'Accordion de um item só: heading obrigatório e navegação por setas sem necessidade.',
              en: 'A one-item Accordion: a mandatory heading and arrow-key navigation for nothing.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Quando usar cada um', en: 'Which one to use' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Disclosure', en: 'Disclosure' },
              description: {
                pt: 'Uma área isolada que a pessoa abre se quiser: opções avançadas, "Por que pedimos isso?", detalhes do pedido. O conteúdo pode ter campos, links e listas.',
                en: 'A single area people open if they want to: advanced options, "Why do we ask?", order details. The content can hold fields, links and lists.',
              },
            },
            {
              term: { pt: 'Accordion', en: 'Accordion' },
              description: {
                pt: 'Várias seções relacionadas e do mesmo nível (perguntas frequentes, etapas), com headings e navegação por setas entre os cabeçalhos.',
                en: 'Several related sections at the same level (FAQs, steps), with headings and arrow-key navigation between headers.',
              },
            },
            {
              term: { pt: 'ExpandableText', en: 'ExpandableText' },
              description: {
                pt: 'Um texto longo que já começa visível em algumas linhas e se completa com "Mostrar mais" — o botão só aparece quando o texto não cabe.',
                en: 'Long text that starts visible for a few lines and completes with "Show more" — the button only appears when the text overflows.',
              },
            },
            {
              term: { pt: 'Toggletip', en: 'Toggletip' },
              description: {
                pt: 'Uma explicação de uma ou duas frases num balão sobre o conteúdo, aberta por um ícone de informação, sem empurrar o layout.',
                en: 'A one- or two-sentence explanation in a bubble over the content, opened from an info icon, without pushing the layout.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Variantes', en: 'Variants' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'inline (padrão)', en: 'inline (default)' },
              description: {
                pt: 'Botão com cara de link e chevron, conteúdo recuado com um fio à esquerda — no fluxo do texto ou de um formulário, como o Details do GOV.UK.',
                en: 'Link-like button with a chevron, content indented with a rule on the left — in the flow of text or a form, like GOV.UK Details.',
              },
            },
            {
              term: { pt: 'outline', en: 'outline' },
              description: {
                pt: 'Caixa com borda e cabeçalho em largura total, como um item de Accordion — para blocos que funcionam como seção.',
                en: 'Bordered box with a full-width header, like an Accordion item — for blocks that work as a section.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Opções avançadas', en: 'Advanced options' }}
          description={{
            pt: 'O padrão é variant="inline". Os campos ficam montados enquanto a área está fechada: o valor não se perde.',
            en: 'The default is variant="inline". Fields stay mounted while the area is closed: values are not lost.',
          }}
          code={AdvancedOptionsCode}
        >
          <AdvancedOptions />
        </Example>
        <Example
          title={{ pt: 'Por que pedimos isso?', en: 'Why do we ask?' }}
          description={{
            pt: 'size="sm" logo abaixo de um campo, para uma explicação curta que a maioria não precisa ler.',
            en: 'size="sm" right below a field, for a short explanation most people do not need to read.',
          }}
          code={WhyWeAskCode}
        >
          <WhyWeAsk />
        </Example>
        <Example
          title={{ pt: 'Detalhes do pedido', en: 'Order details' }}
          description={{
            pt: 'variant="outline" com headingLevel={3}: o botão fica dentro de um <h3> e a caixa lembra um item de Accordion.',
            en: 'variant="outline" with headingLevel={3}: the button sits inside an <h3> and the box looks like an Accordion item.',
          }}
          code={OrderDetailsCode}
          align="stretch"
        >
          <OrderDetails />
        </Example>
        <Example
          title={{ pt: 'Controlado: abrir quando há erro', en: 'Controlled: open on error' }}
          description={{
            pt: 'Envie com o domínio inválido: o formulário abre a área via open/onOpenChange para mostrar o erro.',
            en: 'Submit with the invalid domain: the form opens the area via open/onOpenChange to show the error.',
          }}
          code={ControlledCode}
        >
          <Controlled />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Abrir', en: 'Open' },
              description: {
                pt: 'Altura via grid-template-rows 0fr → 1fr em --or-duration-slow (400ms), --or-ease-out; o conteúdo entra com fade e 4px de deslocamento.',
                en: 'Height via grid-template-rows 0fr → 1fr in --or-duration-slow (400ms), --or-ease-out; content fades in with a 4px offset.',
              },
            },
            {
              term: { pt: 'Fechar', en: 'Close' },
              description: {
                pt: 'Mais curto: --or-duration-medium (250ms), --or-ease-in-out. Inerte durante a saída; recebe hidden quando a transição termina.',
                en: 'Shorter: --or-duration-medium (250ms), --or-ease-in-out. Inert while leaving; gets hidden when the transition ends.',
              },
            },
            {
              term: { pt: 'Chevron', en: 'Chevron' },
              description: {
                pt: 'Gira 180° em --or-duration-medium (250ms), --or-ease-spring.',
                en: 'Turns 180° in --or-duration-medium (250ms), --or-ease-spring.',
              },
            },
            {
              term: { pt: 'Hover e foco', en: 'Hover and focus' },
              description: {
                pt: 'Mesma resposta: no inline, o sublinhado engrossa (1px → 2px); no outline, o cabeçalho ganha fundo. --or-duration-fast (160ms).',
                en: 'Same response: in inline, the underline thickens (1px → 2px); in outline, the header gets a background. --or-duration-fast (160ms).',
              },
            },
            {
              term: { pt: 'Pressionar', en: 'Press' },
              description: {
                pt: 'Inline: o botão afunda 1px (scale 0.985). Outline: o chevron encolhe 12%. --or-duration-press (90ms).',
                en: 'Inline: the button sinks 1px (scale 0.985). Outline: the chevron shrinks 12%. --or-duration-press (90ms).',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Disclosure', en: 'Disclosure' }}
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              required: true,
              description: {
                pt: 'Texto do botão que mostra e esconde o conteúdo.',
                en: 'Text of the button that shows and hides the content.',
              },
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: { pt: 'Conteúdo da área.', en: 'Area content.' },
            },
            {
              name: 'open',
              type: 'boolean',
              description: { pt: 'Aberto (controlado).', en: 'Open (controlled).' },
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Aberto inicialmente (não controlado).',
                en: 'Initially open (uncontrolled).',
              },
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              description: {
                pt: 'Chamado ao abrir ou fechar.',
                en: 'Called when it opens or closes.',
              },
            },
            {
              name: 'variant',
              type: "'inline' | 'outline'",
              default: "'inline'",
              description: {
                pt: 'Botão com cara de link ou caixa com borda.',
                en: 'Link-like button or bordered box.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md'",
              default: "'md'",
              description: {
                pt: 'Tamanho do texto e dos espaçamentos.',
                en: 'Text and spacing size.',
              },
            },
            {
              name: 'headingLevel',
              type: '2 | 3 | 4 | 5 | 6',
              description: {
                pt: 'Envolve o botão em um heading. Sem esta prop, não há heading.',
                en: 'Wraps the button in a heading. Without it, there is no heading.',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Desabilita o botão; o conteúdo mantém o estado atual.',
                en: 'Disables the button; the content keeps its current state.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: (
                  <>
                    Atributos nativos e <Code>ref</Code> vão para o contêiner.
                  </>
                ),
                en: (
                  <>
                    Native attributes and <Code>ref</Code> go to the container.
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
                Segue o padrão <strong>Disclosure</strong> do WAI-ARIA APG: o gatilho é um{' '}
                <Code>&lt;button&gt;</Code> nativo com <Code>aria-expanded</Code> e{' '}
                <Code>aria-controls</Code>; o conteúdo tem <Code>role="group"</Code> rotulado pelo
                botão. Ao fechar, o conteúdo fica <Code>inert</Code> na hora (fora do Tab e dos
                leitores de tela) e recebe <Code>hidden</Code> quando a transição termina. Com{' '}
                <Code>headingLevel</Code>, o botão fica dentro de um heading e aparece na navegação
                por títulos.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <strong>Disclosure</strong> pattern: the trigger is a
                native <Code>&lt;button&gt;</Code> with <Code>aria-expanded</Code> and{' '}
                <Code>aria-controls</Code>; the content has <Code>role="group"</Code> labelled by
                the button. On close, the content becomes <Code>inert</Code> right away (out of the
                Tab order and screen readers) and gets <Code>hidden</Code> when the transition ends.
                With <Code>headingLevel</Code>, the button sits inside a heading and shows up in
                heading navigation.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Enter'],
              description: { pt: 'Abre ou fecha a área.', en: 'Opens or closes the area.' },
            },
            {
              keys: ['Space'],
              description: { pt: 'Abre ou fecha a área.', en: 'Opens or closes the area.' },
            },
            {
              keys: ['Tab'],
              description: {
                pt: 'Vai do botão para o conteúdo aberto; com a área fechada, pula o conteúdo.',
                en: 'Moves from the button into the open content; when closed, skips the content.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.3.1',
              description: {
                pt: 'Botão opcionalmente dentro de heading; conteúdo ligado por aria-controls e rotulado pelo botão.',
                en: 'Button optionally inside a heading; content linked via aria-controls and labelled by the button.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Estado indicado pelo chevron (para baixo/para cima), não só pela cor.',
                en: 'State shown by the chevron (down/up), not only by color.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Enter e Espaço nativos do <button>.',
                en: 'Native <button> Enter and Space.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'A animação de altura é desativada com prefers-reduced-motion.',
                en: 'The height animation is disabled with prefers-reduced-motion.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Conteúdo fechado fica inerte e oculto: o foco nunca cai em algo invisível.',
                en: 'Closed content is inert and hidden: focus never lands on something invisible.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível com contorno de 2px.',
                en: 'Visible focus with a 2px outline.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Alvo de pelo menos 24px de altura.',
                en: 'Target at least 24px tall.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: (
                  <>
                    Estado exposto com <Code>aria-expanded</Code>.
                  </>
                ),
                en: (
                  <>
                    State exposed with <Code>aria-expanded</Code>.
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
