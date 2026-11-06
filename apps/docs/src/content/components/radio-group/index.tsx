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
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import Cards from './examples/Cards'
import CardsCode from './examples/Cards?raw'
import Horizontal from './examples/Horizontal'
import HorizontalCode from './examples/Horizontal?raw'
import Validation from './examples/Validation'
import ValidationCode from './examples/Validation?raw'
import WithDescriptions from './examples/WithDescriptions'
import WithDescriptionsCode from './examples/WithDescriptions?raw'
import { meta } from './meta'

export default function RadioGroupPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use radios para até ~6 opções mutuamente exclusivas que a pessoa precisa comparar. Com muitas opções, use Select.',
              en: 'Use radios for up to ~6 mutually exclusive options people need to compare. With many options, use Select.',
            },
            {
              pt: 'Ordene as opções de forma lógica (do menor para o maior, do mais comum para o menos comum).',
              en: 'Order options logically (smallest to largest, most to least common).',
            },
            {
              pt: 'Pré-selecione uma opção apenas quando houver um padrão seguro; em decisões importantes (pagamento, plano), deixe sem seleção.',
              en: 'Preselect an option only when there is a safe default; for important decisions (payment, plan), leave it unselected.',
            },
            {
              pt: (
                <>
                  A variante <Code>card</Code> funciona bem quando cada opção tem descrição relevante, como planos e fretes.
                </>
              ),
              en: (
                <>
                  The <Code>card</Code> variant works well when each option has a meaningful description, such as plans and shipping.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Básico', en: 'Basic' }} code={BasicCode}>
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Com descrições', en: 'With descriptions' }}
          description={{
            pt: <>Usando filhos <Code>&lt;Radio&gt;</Code>. A descrição de cada opção é ligada por <Code>aria-describedby</Code>.</>,
            en: <>Using <Code>&lt;Radio&gt;</Code> children. Each option description is linked via <Code>aria-describedby</Code>.</>,
          }}
          code={WithDescriptionsCode}
        >
          <WithDescriptions />
        </Example>
        <Example
          title={{ pt: 'Cartões', en: 'Cards' }}
          description={{
            pt: 'O cartão inteiro é clicável; a borda fica laranja na opção selecionada.',
            en: 'The whole card is clickable; the border turns orange on the selected option.',
          }}
          code={CardsCode}
          align="stretch"
        >
          <Cards />
        </Example>
        <Example title={{ pt: 'Horizontal e controlado', en: 'Horizontal and controlled' }} code={HorizontalCode}>
          <Horizontal />
        </Example>
        <Example
          title={{ pt: 'Validação', en: 'Validation' }}
          description={{ pt: 'Envie sem escolher para ver o erro do grupo.', en: 'Submit without choosing to see the group error.' }}
          code={ValidationCode}
        >
          <Validation />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'RadioGroup', en: 'RadioGroup' }}
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: { pt: 'Pergunta do grupo (<legend>).', en: 'Group question (<legend>).' } },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: { pt: 'Oculta a legenda visualmente.', en: 'Visually hides the legend.' } },
            { name: 'description / error', type: 'ReactNode', description: { pt: 'Ajuda e erro do grupo (aria-describedby).', en: 'Group help and error (aria-describedby).' } },
            { name: 'invalid', type: 'boolean', default: 'false', description: { pt: 'Estado inválido sem mensagem (erro mostrado em outro lugar).', en: 'Invalid state without a message (error shown elsewhere).' } },
            { name: 'required', type: 'boolean', default: 'false', description: { pt: 'required nativo em todas as opções.', en: 'Native required on every option.' } },
            { name: 'optional', type: 'boolean', default: 'false', description: { pt: 'Mostra "(opcional)" na legenda.', en: 'Shows "(optional)" on the legend.' } },
            { name: 'value', type: 'string | null', description: { pt: 'Opção selecionada (controlado).', en: 'Selected option (controlled).' } },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: { pt: 'Opção selecionada inicialmente.', en: 'Initially selected option.' } },
            { name: 'onChange', type: '(value: string) => void', description: { pt: 'Chamado com o valor escolhido.', en: 'Called with the chosen value.' } },
            { name: 'options', type: '{ value, label, description?, disabled? }[]', description: { pt: 'Opções geradas automaticamente.', en: 'Auto-generated options.' } },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: { pt: 'Disposição das opções.', en: 'Options layout.' } },
            { name: 'variant', type: "'default' | 'card'", default: "'default'", description: { pt: 'Lista simples ou cartões com borda.', en: 'Plain list or bordered cards.' } },
            { name: 'name', type: 'string', default: 'auto', description: { pt: 'name compartilhado pelos radios.', en: 'name shared by the radios.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita todas as opções (fieldset nativo).', en: 'Disables every option (native fieldset).' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'Radio', en: 'Radio' }}
          rows={[
            { name: 'value', type: 'string', required: true, description: { pt: 'Valor da opção.', en: 'Option value.' } },
            { name: 'label', type: 'ReactNode', required: true, description: { pt: 'Rótulo clicável.', en: 'Clickable label.' } },
            { name: 'description', type: 'ReactNode', description: { pt: 'Texto de apoio da opção.', en: 'Option supporting text.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita a opção.', en: 'Disables the option.' } },
            { name: '...rest', type: 'InputHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;input type="radio"&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;input type="radio"&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T
            pt={<>Interações rápidas e geométricas, só com tokens de duração e curva. Com <Code>prefers-reduced-motion</Code>, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.</>}
            en={<>Fast, geometric interactions using only duration and easing tokens. With <Code>prefers-reduced-motion</Code>, durations drop to zero and states change instantly — motion is never the only cue.</>}
          />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover e foco', en: 'Hover and focus' }, description: { pt: 'Borda mais forte e anel laranja suave — 160ms, --or-ease-out.', en: 'Stronger border and a soft orange ring — 160ms, --or-ease-out.' } },
            { term: { pt: 'Selecionar', en: 'Select' }, description: { pt: 'O ponto entra com or-scale-in (250ms, --or-ease-bounce); o ponto anterior sai em 160ms (--or-ease-in-out).', en: 'The dot enters with or-scale-in (250ms, --or-ease-bounce); the previous dot leaves in 160ms (--or-ease-in-out).' } },
            { term: { pt: 'Pressionar', en: 'Press' }, description: { pt: 'O indicador afunda 1px (scale 0.92) em 90ms.', en: 'The indicator sinks 1px (scale 0.92) in 90ms.' } },
            { term: { pt: 'Cartões (variant="card")', en: 'Cards (variant="card")' }, description: { pt: 'Borda em 160ms; fundo e anel laranja em 250ms; o cartão afunda translateY(1px) scale(0.985) em 90ms ao clicar.', en: 'Border in 160ms; orange background and ring in 250ms; the card sinks translateY(1px) scale(0.985) in 90ms on click.' } },
            { term: { pt: 'Erro surge', en: 'Error appears' }, description: { pt: 'As opções tremem uma vez e a mensagem do grupo desliza 4px com fade.', en: 'The options shake once and the group message slides 4px with a fade.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Radios nativos com o mesmo <Code>name</Code> dentro de <Code>&lt;fieldset&gt;</Code>/<Code>&lt;legend&gt;</Code>: o navegador já implementa o padrão <strong>Radio Group</strong> do WAI-ARIA — Tab entra no grupo pela opção selecionada e as setas movem e selecionam. Cada opção é nomeada pelo rótulo e descrita pela descrição; o erro do grupo fica em <Code>aria-describedby</Code> do fieldset.</>}
            en={<>Native radios sharing a <Code>name</Code> inside <Code>&lt;fieldset&gt;</Code>/<Code>&lt;legend&gt;</Code>: the browser already implements the WAI-ARIA <strong>Radio Group</strong> pattern — Tab enters the group at the selected option and arrows move and select. Each option is named by its label and described by its description; the group error is in the fieldset's <Code>aria-describedby</Code>.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Entra no grupo pela opção selecionada (ou a primeira).', en: 'Enters the group at the selected (or first) option.' } },
            { keys: ['↓ / →'], description: { pt: 'Seleciona a próxima opção (volta ao início no fim).', en: 'Selects the next option (wraps at the end).' } },
            { keys: ['↑ / ←'], description: { pt: 'Seleciona a opção anterior.', en: 'Selects the previous option.' } },
            { keys: ['Space'], description: { pt: 'Seleciona a opção focada, se ainda não estiver.', en: 'Selects the focused option, if not already selected.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Pergunta em <legend>; opções com rótulos associados.', en: 'Question in <legend>; options with associated labels.' } },
            { criterion: '1.4.1', description: { pt: 'Seleção indicada pelo ponto interno, não só pela cor.', en: 'Selection shown by the inner dot, not only color.' } },
            { criterion: '2.1.1', description: { pt: 'Navegação completa por teclado (nativa).', en: 'Full keyboard navigation (native).' } },
            { criterion: '2.5.8', description: { pt: 'Alvo de 24×24px; na variante card, o cartão todo.', en: '24×24px target; in the card variant, the whole card.' } },
            { criterion: '3.3.2', description: { pt: 'required nativo anunciado em cada opção.', en: 'Native required announced on each option.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
