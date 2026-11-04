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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@orange/ui'
import Checkout from './examples/Checkout'
import CheckoutCode from './examples/Checkout?raw'
import Faq from './examples/Faq'
import FaqCode from './examples/Faq?raw'
import Flush from './examples/Flush'
import FlushCode from './examples/Flush?raw'
import Multiple from './examples/Multiple'
import MultipleCode from './examples/Multiple?raw'
import { meta } from './meta'

export default function AccordionPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para conteúdo secundário que nem todos precisam ler: perguntas frequentes, detalhes de produto, configurações avançadas.',
              en: 'Use it for secondary content not everyone needs to read: FAQs, product details, advanced settings.',
            },
            {
              pt: 'Não esconda informação essencial para concluir a tarefa. Se o usuário precisa ver tudo, mostre tudo.',
              en: 'Do not hide information that is essential to complete the task. If users need to see everything, show everything.',
            },
            {
              pt: (
                <>
                  Escreva cabeçalhos curtos e específicos, que antecipem o conteúdo. Ajuste <Code>headingLevel</Code>{' '}
                  à hierarquia da página.
                </>
              ),
              en: (
                <>
                  Write short, specific headers that anticipate the content. Set <Code>headingLevel</Code> to match the
                  page hierarchy.
                </>
              ),
            },
            {
              pt: (
                <>
                  Prefira <Code>type="single"</Code> quando os itens forem alternativas; <Code>multiple</Code> quando o
                  usuário precisar comparar seções.
                </>
              ),
              en: (
                <>
                  Prefer <Code>type="single"</Code> when items are alternatives; <Code>multiple</Code> when users need to
                  compare sections.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <Accordion headingLevel={3} style={{ width: '100%' }}>
              <AccordionItem value="a">
                <AccordionTrigger>Qual o prazo de reembolso?</AccordionTrigger>
                <AccordionContent>Até 7 dias úteis.</AccordionContent>
              </AccordionItem>
            </Accordion>
          }
          dontExample={
            <Accordion headingLevel={4} style={{ width: '100%' }}>
              <AccordionItem value="a">
                <AccordionTrigger>Clique aqui para mais informações</AccordionTrigger>
                <AccordionContent>Até 7 dias úteis.</AccordionContent>
              </AccordionItem>
            </Accordion>
          }
          doItems={[{ pt: 'Cabeçalho que descreve o conteúdo.', en: 'A header that describes the content.' }]}
          dontItems={[{ pt: 'Cabeçalhos genéricos como "Mais informações".', en: 'Generic headers such as "More information".' }]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Accordion', en: 'Accordion' }, description: { pt: 'Contêiner: controla quais itens estão abertos e a navegação por setas.', en: 'Container: controls which items are open and arrow-key navigation.' } },
            { term: { pt: 'AccordionItem', en: 'AccordionItem' }, description: { pt: 'Agrupa um cabeçalho e um painel; recebe um value único.', en: 'Groups a header and a panel; takes a unique value.' } },
            { term: { pt: 'AccordionTrigger', en: 'AccordionTrigger' }, description: { pt: 'Botão dentro de um heading, com o ícone quadrado "+"/"−".', en: 'Button inside a heading, with the square "+"/"−" icon.' } },
            { term: { pt: 'AccordionContent', en: 'AccordionContent' }, description: { pt: 'Painel com role="region" rotulado pelo cabeçalho.', en: 'Panel with role="region" labelled by the header.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Perguntas frequentes', en: 'FAQ' }}
          description={{
            pt: 'O padrão é type="single" e recolhível: abrir um item fecha o anterior, e clicar no aberto o fecha.',
            en: 'The default is type="single" and collapsible: opening an item closes the previous one, and clicking the open one closes it.',
          }}
          code={FaqCode}
          align="stretch"
        >
          <Faq />
        </Example>
        <Example
          title={{ pt: 'Vários abertos', en: 'Multiple open' }}
          description={{
            pt: 'Com type="multiple", cada item abre e fecha de forma independente.',
            en: 'With type="multiple", each item opens and closes independently.',
          }}
          code={MultipleCode}
          align="stretch"
        >
          <Multiple />
        </Example>
        <Example
          title={{ pt: 'Controlado e não recolhível', en: 'Controlled and not collapsible' }}
          description={{
            pt: 'Etapas de checkout: sempre há uma seção aberta (collapsible={false}) e o botão Continuar avança via value/onChange.',
            en: 'Checkout steps: one section is always open (collapsible={false}) and the Continue button advances via value/onChange.',
          }}
          code={CheckoutCode}
          align="stretch"
        >
          <Checkout />
        </Example>
        <Example
          title={{ pt: 'Sem moldura e item desabilitado', en: 'Flush and disabled item' }}
          description={{
            pt: 'variant="flush" remove a caixa e mantém só as divisórias — bom para painéis laterais.',
            en: 'variant="flush" removes the box and keeps only the dividers — good for side panels.',
          }}
          code={FlushCode}
        >
          <Flush />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Accordion', en: 'Accordion' }}
          rows={[
            { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: { pt: 'Um ou vários itens abertos ao mesmo tempo.', en: 'One or several items open at a time.' } },
            { name: 'value', type: 'string | null (single) · string[] (multiple)', description: { pt: 'Itens abertos (controlado).', en: 'Open items (controlled).' } },
            { name: 'defaultValue', type: 'string | null · string[]', description: { pt: 'Itens abertos inicialmente.', en: 'Initially open items.' } },
            { name: 'onChange', type: '(value) => void', description: { pt: 'Chamado quando itens abrem ou fecham.', en: 'Called when items open or close.' } },
            { name: 'collapsible', type: 'boolean', default: 'true', description: { pt: <>No modo <Code>single</Code>, permite fechar o item aberto.</>, en: <>In <Code>single</Code> mode, allows closing the open item.</> } },
            { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: { pt: 'Nível dos headings que envolvem os botões.', en: 'Level of the headings wrapping the buttons.' } },
            { name: 'variant', type: "'outline' | 'flush'", default: "'outline'", description: { pt: 'Caixa com borda ou apenas divisórias.', en: 'Bordered box or dividers only.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita todos os itens.', en: 'Disables every item.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'AccordionItem, AccordionTrigger, AccordionContent', en: 'AccordionItem, AccordionTrigger, AccordionContent' }}
          rows={[
            { name: 'value', type: 'string', required: true, description: { pt: 'AccordionItem: identificador único do item.', en: 'AccordionItem: unique item identifier.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'AccordionItem: desabilita o item.', en: 'AccordionItem: disables the item.' } },
            { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', description: { pt: 'AccordionTrigger: sobrescreve o nível do Accordion.', en: 'AccordionTrigger: overrides the Accordion level.' } },
            { name: '...rest', type: 'HTMLAttributes', description: { pt: 'Atributos nativos (o Trigger repassa ao <button>).', en: 'Native attributes (the Trigger forwards them to the <button>).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Segue o padrão <strong>Accordion</strong> do WAI-ARIA APG: cada cabeçalho é um{' '}
                <Code>&lt;button&gt;</Code> dentro de um heading, com <Code>aria-expanded</Code> e{' '}
                <Code>aria-controls</Code>; o painel tem <Code>role="region"</Code> e <Code>aria-labelledby</Code>. Painéis
                fechados ficam com <Code>hidden</Code>, fora da ordem de tabulação. No modo single não recolhível, o
                cabeçalho aberto recebe <Code>aria-disabled="true"</Code>.
              </>
            }
            en={
              <>
                Follows the WAI-ARIA APG <strong>Accordion</strong> pattern: each header is a <Code>&lt;button&gt;</Code>{' '}
                inside a heading, with <Code>aria-expanded</Code> and <Code>aria-controls</Code>; the panel has{' '}
                <Code>role="region"</Code> and <Code>aria-labelledby</Code>. Closed panels are <Code>hidden</Code>, out of
                the tab order. In non-collapsible single mode, the open header gets <Code>aria-disabled="true"</Code>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Enter'], description: { pt: 'Abre ou fecha o item focado.', en: 'Opens or closes the focused item.' } },
            { keys: ['Space'], description: { pt: 'Abre ou fecha o item focado.', en: 'Opens or closes the focused item.' } },
            { keys: ['Tab'], description: { pt: 'Move para o próximo elemento focável (cabeçalhos e conteúdo aberto).', en: 'Moves to the next focusable element (headers and open content).' } },
            { keys: ['↓'], description: { pt: 'Foca o próximo cabeçalho (volta ao primeiro no fim).', en: 'Focuses the next header (wraps to the first).' } },
            { keys: ['↑'], description: { pt: 'Foca o cabeçalho anterior (vai ao último no início).', en: 'Focuses the previous header (wraps to the last).' } },
            { keys: ['Home'], description: { pt: 'Foca o primeiro cabeçalho.', en: 'Focuses the first header.' } },
            { keys: ['End'], description: { pt: 'Foca o último cabeçalho.', en: 'Focuses the last header.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Botões dentro de headings preservam a estrutura do documento.', en: 'Buttons inside headings preserve the document structure.' } },
            { criterion: '2.1.1', description: { pt: 'Todas as ações disponíveis pelo teclado, com setas, Home e End.', en: 'Every action is available by keyboard, with arrows, Home and End.' } },
            { criterion: '2.3.3', description: { pt: 'A animação de altura é desativada com prefers-reduced-motion.', en: 'The height animation is disabled with prefers-reduced-motion.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno de 2px.', en: 'Visible focus with a 2px outline.' } },
            { criterion: '4.1.2', description: { pt: <>Estado exposto com <Code>aria-expanded</Code>; painel ligado por <Code>aria-controls</Code>.</>, en: <>State exposed with <Code>aria-expanded</Code>; panel linked via <Code>aria-controls</Code>.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
